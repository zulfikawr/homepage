import { AnalyticsEvent } from '@/types/analytics-event';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Comment } from '@/types/comment';
import { CustomizationSettings } from '@/types/customization';
import { Employment } from '@/types/employment';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';
import { Movie } from '@/types/movie';
import { PersonalInfo } from '@/types/personal-info';
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
  const imageKey = (row.image_url || row.image) as string;
  const audioKey = (row.audio_url || row.audio) as string;

  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    excerpt: row.excerpt as string,
    date_string: (row.date_string || row.date_string) as string,
    image: getFileUrl({}, imageKey),
    image_url: imageKey,
    audio: getFileUrl({}, audioKey),
    audio_url: audioKey,
    slug: row.slug as string,
    categories: (() => {
      if (typeof row.categories !== 'string')
        return (row.categories as string[]) || [];
      try {
        return JSON.parse(row.categories);
      } catch {
        return [];
      }
    })(),
  };
}

export function mapRecordToBook(row: BaseDatabaseRow): Book {
  const imageKey = (row.image_url || row.imageURL || '') as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    type: (row.type as string)
      ?.replace(/([A-Z])/g, '_$1')
      .toLowerCase() as Book['type'],
    title: row.title as string,
    author: row.author as string,
    image: getFileUrl({}, imageKey),
    image_url: imageKey,
    link: row.link as string,
    date_added: (row.date_added || row.date_added) as string,
  };
}

export function mapRecordToCertificate(row: BaseDatabaseRow): Certificate {
  const imageKey = (row.image_url || row.image_url) as string;
  const logoKey = (row.organization_logo_url ||
    row.organization_logo_url) as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    issued_by: (row.issued_by || row.issued_by) as string,
    date_issued: (row.date_issued || row.date_issued) as string,
    credential_id: (row.credential_id || row.credential_id) as string,
    image: getFileUrl({}, imageKey),
    image_url: imageKey,
    organization_logo: getFileUrl({}, logoKey),
    organization_logo_url: logoKey,
    link: row.link as string,
  };
}

export function mapRecordToEmployment(row: BaseDatabaseRow): Employment {
  const logoKey = (row.organization_logo_url ||
    row.org_logo_url ||
    row.orgLogoUrl) as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    organization: row.organization as string,
    job_title: (row.job_title || row.job_title) as string,
    date_string: (row.date_string || row.date_string) as string,
    job_type: (row.job_type as string)
      ?.replace(/([A-Z])/g, '_$1')
      .toLowerCase() as Employment['job_type'],
    organization_logo: getFileUrl({}, logoKey),
    organization_logo_url: logoKey,
    organization_industry: (row.organization_industry ||
      row.organization_industry) as string,
    organization_location: (row.organization_location ||
      row.organization_location) as string,
    responsibilities: (() => {
      if (typeof row.responsibilities !== 'string')
        return (row.responsibilities as string[]) || [];
      try {
        return JSON.parse(row.responsibilities);
      } catch {
        return [];
      }
    })(),
  };
}

export function mapRecordToInterests(
  row: BaseDatabaseRow,
): InterestsAndObjectives & { id: string } {
  return {
    id: row.id as string,
    description: row.description as string,
    conclusion: row.conclusion as string,
    objectives: (() => {
      if (typeof row.objectives !== 'string')
        return (row.objectives as string[]) || [];
      try {
        return JSON.parse(row.objectives);
      } catch {
        return [];
      }
    })(),
  };
}

export function mapRecordToMovie(row: BaseDatabaseRow): Movie {
  const posterKey = (row.poster_url || row.poster_url || '') as string;

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    release_date: (row.release_date || row.release_date) as string,
    imdb_id: (row.imdb_id || row.imdb_id) as string,
    image: getFileUrl({}, posterKey),
    poster_url: posterKey,
    imdb_link: (row.imdb_link || row.imdb_link) as string,
    rating: row.rating as number,
  };
}

export function mapRecordToPersonalInfo(row: BaseDatabaseRow): PersonalInfo {
  const avatarKey = (row.avatar_url || row.avatar_url || '') as string;

  return {
    name: row.name as string,
    title: row.title as string,
    avatar: getFileUrl({}, avatarKey),
    avatar_url: avatarKey,
  };
}

export function mapRecordToProject(row: BaseDatabaseRow): Project {
  const imageKey = (row.image_url || row.image) as string;
  const faviconKey = (row.favicon_url || row.favicon) as string;

  return {
    id: row.id as string,
    name: row.name as string,
    date_string: (row.date_string || row.date_string) as string,
    image: getFileUrl({}, imageKey),
    image_url: imageKey,
    description: row.description as string,
    tools: (() => {
      if (!row.tools) return [];
      if (typeof row.tools !== 'string') return (row.tools as string[]) || [];
      try {
        return JSON.parse(row.tools);
      } catch {
        return [];
      }
    })(),
    readme: row.readme as string,
    status: (row.status as string)
      ?.replace(/([A-Z])/g, '_$1')
      .toLowerCase() as Project['status'],
    link: row.link as string,
    favicon: getFileUrl({}, faviconKey),
    favicon_url: faviconKey,
    pinned: !!row.pinned,
    slug: row.slug as string,
    github_repo_url: (row.github_repo_url || row.github_repo_url) as string,
  };
}

export function mapRecordToPublication(row: BaseDatabaseRow): Publication {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    publisher: row.publisher as string,
    link: row.link as string,
    open_access: !!row.open_access || !!row.open_access,
    excerpt: row.excerpt as string,
    authors: (() => {
      if (typeof row.authors !== 'string')
        return (row.authors as string[]) || [];
      try {
        return JSON.parse(row.authors);
      } catch {
        return [];
      }
    })(),
    keywords: (() => {
      if (typeof row.keywords !== 'string')
        return (row.keywords as string[]) || [];
      try {
        return JSON.parse(row.keywords);
      } catch {
        return [];
      }
    })(),
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
  const fileKey = (row.fileUrl || row.file_url || '') as string;

  return {
    file: getFileUrl({}, fileKey),
    file_url: fileKey,
  };
}

export function mapRecordToComment(row: BaseDatabaseRow): Comment {
  const avatarKey = (row.avatar_url || row.avatar_url) as string;

  return {
    id: row.id as string,
    post_id: (row.post_id || row.post_id) as string,
    author: row.author as string,
    content: row.content as string,
    avatar: getFileUrl({}, avatarKey),
    avatar_url: avatarKey,
    parent_id: (row.parent_id || row.parent_id) as string,
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

export function mapRecordToCustomization(
  row: BaseDatabaseRow,
): CustomizationSettings {
  return {
    id: row.id as number,
    default_theme: row.default_theme as string,
    default_background: row.default_background as string,
    updated_at: row.updated_at as number,
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
