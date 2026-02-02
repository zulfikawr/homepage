import { AnalyticsEvent } from '@/types/analytics';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Comment } from '@/types/comment';
import { Employment } from '@/types/employment';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { Movie } from '@/types/movie';
import { PersonalInfo } from '@/types/personalInfo';
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
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    excerpt: row.excerpt as string,
    dateString: (row.date_string || row.dateString) as string,
    image: getFileUrl({}, (row.image_url || row.image) as string),
    image_url: getFileUrl({}, (row.image_url || row.image) as string),
    audio: getFileUrl({}, (row.audio_url || row.audio) as string),
    audio_url: getFileUrl({}, (row.audio_url || row.audio) as string),
    slug: row.slug as string,
    categories:
      typeof row.categories === 'string'
        ? JSON.parse(row.categories)
        : (row.categories as string[]) || [],
  };
}

export function mapRecordToBook(row: BaseDatabaseRow): Book {
  return {
    id: row.id as string,
    slug: row.slug as string,
    type: row.type as 'currentlyReading' | 'read' | 'toRead',
    title: row.title as string,
    author: row.author as string,
    imageURL: getFileUrl({}, (row.image_url || row.imageURL || '') as string),
    link: row.link as string,
    dateAdded: (row.date_added || row.dateAdded) as string,
  };
}

export function mapRecordToCertificate(row: BaseDatabaseRow): Certificate {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    issuedBy: (row.issued_by || row.issuedBy) as string,
    dateIssued: (row.date_issued || row.dateIssued) as string,
    credentialId: (row.credential_id || row.credentialId) as string,
    imageUrl: getFileUrl({}, (row.image_url || row.imageUrl) as string),
    organizationLogoUrl: getFileUrl(
      {},
      (row.organization_logo_url || row.organizationLogoUrl) as string,
    ),
    link: row.link as string,
  };
}

export function mapRecordToEmployment(row: BaseDatabaseRow): Employment {
  return {
    id: row.id as string,
    slug: row.slug as string,
    organization: row.organization as string,
    jobTitle: (row.job_title || row.jobTitle) as string,
    dateString: (row.date_string || row.dateString) as string,
    jobType: (row.job_type || row.jobType) as Employment['jobType'],
    orgLogoUrl: getFileUrl({}, (row.org_logo_url || row.orgLogoUrl) as string),
    organizationIndustry: (row.organization_industry ||
      row.organizationIndustry) as string,
    organizationLocation: (row.organization_location ||
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
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    releaseDate: (row.release_date || row.releaseDate) as string,
    imdbId: (row.imdb_id || row.imdbId) as string,
    posterUrl: getFileUrl(
      {},
      (row.poster_url || row.posterUrl || '') as string,
    ),
    imdbLink: (row.imdb_link || row.imdbLink) as string,
    rating: row.rating as number,
  };
}

export function mapRecordToPersonalInfo(row: BaseDatabaseRow): PersonalInfo {
  return {
    name: row.name as string,
    title: row.title as string,
    avatarUrl: getFileUrl(
      {},
      (row.avatar_url || row.avatarUrl || '') as string,
    ),
  };
}

export function mapRecordToProject(row: BaseDatabaseRow): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    dateString: (row.date_string || row.dateString) as string,
    image: getFileUrl({}, (row.image_url || row.image) as string),
    description: row.description as string,
    tools:
      typeof row.tools === 'string'
        ? JSON.parse(row.tools)
        : (row.tools as string[]) || [],
    readme: row.readme as string,
    status: row.status as 'inProgress' | 'completed' | 'upcoming',
    link: row.link as string,
    favicon: getFileUrl({}, (row.favicon_url || row.favicon) as string),
    pinned: !!row.pinned,
    slug: row.slug as string,
    githubRepoUrl: (row.github_repo_url || row.githubRepoUrl) as string,
  };
}

export function mapRecordToPublication(row: BaseDatabaseRow): Publication {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    publisher: row.publisher as string,
    link: row.link as string,
    openAccess: !!row.open_access || !!row.openAccess,
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
  return {
    fileUrl: getFileUrl({}, (row.file_url || row.fileUrl || '') as string),
  };
}

export function mapRecordToComment(row: BaseDatabaseRow): Comment {
  return {
    id: row.id as string,
    postId: (row.post_id || row.postId) as string,
    author: row.author as string,
    content: row.content as string,
    avatarUrl: getFileUrl({}, (row.avatar_url || row.avatarUrl) as string),
    parentId: (row.parent_id || row.parentId) as string,
    createdAt: row.created_at
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
