import { getDB } from '@/lib/cloudflare';
import {
  mapRecordToAnalyticsEvent,
  mapRecordToBook,
  mapRecordToCertificate,
  mapRecordToEmployment,
  mapRecordToInterests,
  mapRecordToMovie,
  mapRecordToPersonalInfo,
  mapRecordToPost,
  mapRecordToProject,
  mapRecordToPublication,
  mapRecordToResume,
  mapRecordToSection,
} from '@/lib/mappers';
import { AnalyticsEvent } from '@/types/analytics-event';
import { AnalyticsSummary } from '@/types/analytics-summary';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Employment } from '@/types/employment';
import { GitHubContributionData } from '@/types/github';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';
import { Movie } from '@/types/movie';
import { PersonalInfo } from '@/types/personal-info';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';
import { Resume } from '@/types/resume';
import { Section } from '@/types/section';

export async function getCollection<T>(
  table: string,
  mapper: (record: Record<string, unknown>) => T,
): Promise<T[]> {
  const db = getDB();
  if (!db) {
    console.error('Database not available in getCollection');
    return [];
  }

  try {
    const { results } = await db.prepare(`SELECT * FROM ${table}`).all();
    return (results as Record<string, unknown>[]).map(mapper);
  } catch (error) {
    console.error(`Error fetching collection ${table}:`, error);
    return [];
  }
}

export const getProfile = () =>
  getCollection<PersonalInfo>('personal_info', mapRecordToPersonalInfo);
export const getPosts = () => getCollection<Post>('posts', mapRecordToPost);
export const getProjects = () =>
  getCollection<Project>('projects', mapRecordToProject);
export const getSections = () =>
  getCollection<Section>('sections', mapRecordToSection);
export const getEmployments = () =>
  getCollection<Employment>('employments', mapRecordToEmployment);
export const getInterestsAndObjectives = () =>
  getCollection<InterestsAndObjectives>(
    'interests_objectives',
    mapRecordToInterests as (
      record: Record<string, unknown>,
    ) => InterestsAndObjectives,
  );
export const getBooks = () => getCollection<Book>('books', mapRecordToBook);
export const getCertificates = () =>
  getCollection<Certificate>('certificates', mapRecordToCertificate);
export const getPublications = () =>
  getCollection<Publication>('publications', mapRecordToPublication);
export const getMovies = () => getCollection<Movie>('movies', mapRecordToMovie);
export const getResume = () =>
  getCollection<Resume>('resume', mapRecordToResume);
export const getAnalyticsEvents = () =>
  getCollection<AnalyticsEvent>('analytics_events', mapRecordToAnalyticsEvent);

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = getDB();
  if (!db) {
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      topRoutes: [],
      countries: [],
      devices: [],
      referrers: [],
    };
  }

  try {
    // 1. Total Views and Unique Visitors
    const stats = await db
      .prepare(
        'SELECT COUNT(*) as total, COUNT(DISTINCT user_agent || country) as unique_v FROM analytics_events WHERE is_bot = 0',
      )
      .first<{ total: number; unique_v: number }>();

    // 2. Top Routes
    const topRoutes = await db
      .prepare(
        'SELECT path, COUNT(*) as views FROM analytics_events WHERE is_bot = 0 GROUP BY path ORDER BY views DESC LIMIT 5',
      )
      .all<{ path: string; views: number }>();

    // 3. Countries
    const countries = await db
      .prepare(
        "SELECT COALESCE(country, 'Unknown') as code, COUNT(*) as count FROM analytics_events WHERE is_bot = 0 GROUP BY code ORDER BY count DESC",
      )
      .all<{ code: string; count: number }>();

    // 4. Referrers - Fetch all and aggregate by hostname in JS for 100% accuracy
    const referrersRaw = await db
      .prepare('SELECT referrer FROM analytics_events WHERE is_bot = 0')
      .all<{ referrer: string }>();

    const referrerMap = new Map<string, number>();
    (referrersRaw.results || []).forEach((r) => {
      let name = r.referrer || 'Direct';
      if (name !== 'Direct') {
        try {
          if (name.startsWith('http')) {
            name = new URL(name).hostname;
          }
        } catch {
          // Keep as is if URL parsing fails
        }
      }
      referrerMap.set(name, (referrerMap.get(name) || 0) + 1);
    });

    const referrers = Array.from(referrerMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Devices (Approximated via User-Agent)
    const devicesRaw = await db
      .prepare(
        `SELECT 
          CASE 
            WHEN user_agent LIKE '%mobile%' OR user_agent LIKE '%android%' OR user_agent LIKE '%iphone%' OR user_agent LIKE '%ipad%' THEN 'Mobile'
            ELSE 'Desktop'
          END as type,
          COUNT(*) as count
        FROM analytics_events 
        WHERE is_bot = 0
        GROUP BY type`,
      )
      .all<{ type: string; count: number }>();

    const totalViews = stats?.total || 0;

    return {
      totalViews,
      uniqueVisitors: stats?.unique_v || 0,
      topRoutes: topRoutes.results || [],
      countries: (countries.results || []).map((c) => ({
        code: c.code,
        name: c.code, // Ideally we'd map code to name, but we'll keep it simple for now
        count: c.count,
      })),
      devices: (devicesRaw.results || []).map((d) => ({
        type: d.type,
        count: d.count,
        icon: d.type === 'Mobile' ? 'deviceMobile' : 'desktop',
        percentage: Math.round((d.count / (totalViews || 1)) * 100),
      })),
      referrers,
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      topRoutes: [],
      countries: [],
      devices: [],
      referrers: [],
    };
  }
}

// GitHub Server Actions / Data Fetchers
const GITHUB_USERNAME = 'zulfikawr';

interface GitHubGraphQLDay {
  date: string;
  contributionCount: number;
}

interface GitHubGraphQLWeek {
  contributionDays: GitHubGraphQLDay[];
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: GitHubGraphQLWeek[];
        };
        commitContributionsByRepository?: Array<{
          repository: {
            nameWithOwner: string;
          };
        }>;
      };
    };
  };
}

export async function getGitHubContributionsServer(): Promise<GitHubContributionData | null> {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) return null;

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const result = (await response.json()) as GitHubGraphQLResponse;
    const data =
      result.data?.user?.contributionsCollection?.contributionCalendar;
    const contributedRepos =
      result.data?.user?.contributionsCollection
        ?.commitContributionsByRepository || [];
    if (!data) return null;

    const weeks = data.weeks || [];
    const daily_contributions = weeks.flatMap((week: GitHubGraphQLWeek) =>
      week.contributionDays.map((day: GitHubGraphQLDay) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    );

    return {
      total_contributions: data.totalContributions,
      repository_count: contributedRepos.length,
      daily_contributions: daily_contributions,
      weeks: weeks.map((week: GitHubGraphQLWeek) =>
        week.contributionDays.map((day: GitHubGraphQLDay) => ({
          date: day.date,
          count: day.contributionCount,
        })),
      ),
      year: daily_contributions[0]
        ? new Date(daily_contributions[0].date).getFullYear()
        : new Date().getFullYear(),
    };
  } catch (error) {
    console.error('Error fetching GitHub contributions on server:', error);
    return null;
  }
}

interface GitHubLanguageNode {
  name: string;
  color: string;
}

interface GitHubLanguageEdge {
  size: number;
  node: GitHubLanguageNode;
}

interface GitHubLanguagesRepo {
  name: string;
  languages: {
    edges: GitHubLanguageEdge[];
  };
}

interface GitHubLanguagesResponse {
  data?: {
    user?: {
      repositories?: {
        nodes: GitHubLanguagesRepo[];
      };
    };
  };
}

export async function getGitHubLanguagesServer() {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) return null;

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const result = (await response.json()) as GitHubLanguagesResponse;
    const repositories = result.data?.user?.repositories?.nodes;
    if (!repositories) return null;

    const languageStats: Record<
      string,
      { bytes: number; color: string; name: string }
    > = {};
    repositories.forEach((repo: GitHubLanguagesRepo) => {
      repo.languages.edges.forEach((edge: GitHubLanguageEdge) => {
        const { name, color } = edge.node;
        if (name === 'HTML' || name === 'Jupyter Notebook') return;
        if (languageStats[name]) {
          languageStats[name].bytes += edge.size;
        } else {
          languageStats[name] = {
            bytes: edge.size,
            color: color || '#858585',
            name,
          };
        }
      });
    });

    const sortedLanguages = Object.values(languageStats)
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10);
    const totalBytes = sortedLanguages.reduce(
      (sum, lang) => sum + lang.bytes,
      0,
    );
    return {
      languages: sortedLanguages.map((lang) => ({
        ...lang,
        percentage: ((lang.bytes / totalBytes) * 100).toFixed(1),
        lines: Math.round(lang.bytes / 40),
      })),
      total_bytes: totalBytes,
    };
  } catch (error) {
    console.error('Error fetching GitHub languages on server:', error);
    return null;
  }
}
