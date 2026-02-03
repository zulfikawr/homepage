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
import { AnalyticsEvent } from '@/types/analytics';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Employment } from '@/types/employment';
import { GitHubContributionData } from '@/types/github';
import { InterestsAndObjectives } from '@/types/interests_and_objectives';
import { Movie } from '@/types/movie';
import { PersonalInfo } from '@/types/personal_info';
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
      next: { revalidate: 3600 },
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
    const dailyContributions = weeks.flatMap((week: GitHubGraphQLWeek) =>
      week.contributionDays.map((day: GitHubGraphQLDay) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    );

    return {
      total_contributions: data.totalContributions,
      repository_count: contributedRepos.length,
      daily_contributions: dailyContributions,
      weeks: weeks.map((week: GitHubGraphQLWeek) =>
        week.contributionDays.map((day: GitHubGraphQLDay) => ({
          date: day.date,
          count: day.contributionCount,
        })),
      ),
      year: dailyContributions[0]
        ? new Date(dailyContributions[0].date).getFullYear()
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
      next: { revalidate: 3600 },
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
