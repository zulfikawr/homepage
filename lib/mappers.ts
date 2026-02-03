import { AnalyticsEvent } from '@/types/analytics';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Comment } from '@/types/comment';
import { Employment } from '@/types/employment';
import { InterestsAndObjectives } from '@/types/interests_and_objectives';
import { Movie } from '@/types/movie';
import { PersonalInfo } from '@/types/personal_info';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';
import { Resume } from '@/types/resume';
import { Section } from '@/types/section';

import { getFileUrl } from './storage';

/**
 * Standardized mapping functions to convert database rows to application types.
 */

export type BaseDatabaseRow = {
  [key: string]: unknown;
};

export function mapRecordToPost(row: BaseDatabaseRow): Post {
  const image_key = (row.image_url || row.image) as string;
  const audio_key = (row.audio_url || row.audio) as string;

  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    excerpt: row.excerpt as string,
    date_string: (row.date_string || row.dateString) as string,
    image: getFileUrl({}, image_key),
    image_url: image_key,
    audio: getFileUrl({}, audio_key),
    audio_url: audio_key,
    slug: row.slug as string,
    categories:
      typeof row.categories === 'string'
        ? JSON.parse(row.categories)
        : (row.categories as string[]) || [],
  };
}

export function mapRecordToBook(row: BaseDatabaseRow): Book {
  const image_key = (row.image_url || row.imageURL || '') as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    type: (row.type as string)
      ?.replace(/([A-Z])/g, '_$1')
      .toLowerCase() as Book['type'],
    title: row.title as string,
    author: row.author as string,
    image: getFileUrl({}, image_key),
    image_url: image_key,
    link: row.link as string,
    date_added: (row.date_added || row.dateAdded) as string,
  };
}

export function mapRecordToCertificate(row: BaseDatabaseRow): Certificate {
  const image_key = (row.image_url || row.imageUrl) as string;
  const logo_key = (row.organization_logo_url ||
    row.organizationLogoUrl) as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    issued_by: (row.issued_by || row.issuedBy) as string,
    date_issued: (row.date_issued || row.dateIssued) as string,
    credential_id: (row.credential_id || row.credentialId) as string,
    image: getFileUrl({}, image_key),
    image_url: image_key,
    organization_logo: getFileUrl({}, logo_key),
    organization_logo_url: logo_key,
    link: row.link as string,
  };
}

export function mapRecordToEmployment(row: BaseDatabaseRow): Employment {
  const logo_key = (row.organization_logo_url ||
    row.org_logo_url ||
    row.orgLogoUrl) as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    organization: row.organization as string,
    job_title: (row.job_title || row.jobTitle) as string,
    date_string: (row.date_string || row.dateString) as string,
    job_type: (row.job_type as string)
      ?.replace(/([A-Z])/g, '_$1')
      .toLowerCase() as Employment['job_type'],
    organization_logo: getFileUrl({}, logo_key),
    organization_logo_url: logo_key,
    organization_industry: (row.organization_industry ||
      row.organizationIndustry) as string,
    organization_location: (row.organization_location ||
      row.organizationLocation) as string,
    responsibilities:
      typeof row.responsibilities === 'string'
        ? JSON.parse(row.responsibilities)
        : (row.responsibilities as string[]) || [],
  };
}

export function mapRecordToInterests(
  row: BaseDatabaseRow,
): InterestsAndObjectives & { id: string } {
  return {
    id: row.id as string,
    description: row.description as string,
    conclusion: row.conclusion as string,
    objectives:
      typeof row.objectives === 'string'
        ? JSON.parse(row.objectives)
        : (row.objectives as string[]) || [],
  };
}

export function mapRecordToMovie(row: BaseDatabaseRow): Movie {
  const poster_key = (row.poster_url || row.posterUrl || '') as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    release_date: (row.release_date || row.releaseDate) as string,
    imdb_id: (row.imdb_id || row.imdbId) as string,
    image: getFileUrl({}, poster_key),
    poster_url: poster_key,
    imdb_link: (row.imdb_link || row.imdbLink) as string,
    rating: row.rating as number,
  };
}

export function mapRecordToPersonalInfo(row: BaseDatabaseRow): PersonalInfo {
  const avatar_key = (row.avatar_url || row.avatarUrl || '') as string;

  return {
    name: row.name as string,
    title: row.title as string,
    avatar: getFileUrl({}, avatar_key),
    avatar_url: avatar_key,
  };
}

export function mapRecordToProject(row: BaseDatabaseRow): Project {
  const image_key = (row.image_url || row.image) as string;
  const favicon_key = (row.favicon_url || row.favicon) as string;

  return {
    id: row.id as string,
    name: row.name as string,
    date_string: (row.date_string || row.dateString) as string,
    image: getFileUrl({}, image_key),
    image_url: image_key,
    description: row.description as string,
    tools:
      typeof row.tools === 'string'
        ? JSON.parse(row.tools)
        : (row.tools as string[]) || [],
    readme: row.readme as string,
    status: (row.status as string)
      ?.replace(/([A-Z])/g, '_$1')
      .toLowerCase() as Project['status'],
    link: row.link as string,
    favicon: getFileUrl({}, favicon_key),
    favicon_url: favicon_key,
    pinned: !!row.pinned,
    slug: row.slug as string,
    github_repo_url: (row.github_repo_url || row.githubRepoUrl) as string,
  };
}

export function mapRecordToPublication(row: BaseDatabaseRow): Publication {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    publisher: row.publisher as string,
    link: row.link as string,
    open_access: !!row.open_access || !!row.openAccess,
    excerpt: row.excerpt as string,
    authors:
      typeof row.authors === 'string'
        ? JSON.parse(row.authors)
        : (row.authors as string[]) || [],
    keywords:
      typeof row.keywords === 'string'
        ? JSON.parse(row.keywords)
        : (row.keywords as string[]) || [],
  };
}

export function mapRecordToSection(row: BaseDatabaseRow): Section {
  return {
    id: row.id as string,
    name: row.name as string,
    title: row.title as string,
    enabled: !!row.enabled,
    order: (row.sort_order !== undefined
      ? row.sort_order
      : row.order) as number,
  };
}

export function mapRecordToResume(row: BaseDatabaseRow): Resume {
  const file_key = (row.file_url || row.fileUrl || '') as string;

  return {
    file: getFileUrl({}, file_key),
    file_url: file_key,
  };
}

export function mapRecordToComment(row: BaseDatabaseRow): Comment {
  const avatar_key = (row.avatar_url || row.avatarUrl) as string;

  return {
    id: row.id as string,
    post_id: (row.post_id || row.postId) as string,
    author: row.author as string,
    content: row.content as string,
    avatar: getFileUrl({}, avatar_key),
    avatar_url: avatar_key,
    parent_id: (row.parent_id || row.parentId) as string,
    created_at: row.created_at
      ? (row.created_at as number) * 1000
      : new Date((row.created as string) || Date.now()).getTime(),
    likes: (row.likes as number) || 0,
  };
}

export function mapRecordToAnalyticsEvent(
  row: BaseDatabaseRow,
): AnalyticsEvent {
  return {
    id: row.id as string,
    path: row.path as string,
    country: row.country as string,
    referrer: row.referrer as string,
    user_agent: row.user_agent as string,
    is_bot: !!row.is_bot,
    created: row.created_at
      ? new Date((row.created_at as number) * 1000).toISOString()
      : (row.created as string),
  };
}

export function mapRecordToFeedback(row: BaseDatabaseRow): {
  id: string;
  feedback: string;
  contact: string;
  created: string;
} {
  return {
    id: row.id as string,
    feedback: row.feedback as string,
    contact: row.contact as string,
    created: row.created_at
      ? new Date((row.created_at as number) * 1000).toISOString()
      : (row.created as string),
  };
}
