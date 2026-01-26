import { RecordModel } from 'pocketbase';

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
 * Standardized mapping functions to convert PocketBase records to application types.
 * These are shared between client and server.
 */

export function mapRecordToPost(record: RecordModel): Post {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    excerpt: record.excerpt,
    dateString: record.dateString,
    image: getFileUrl(record, record.image as string),
    image_url: record.image_url,
    audio: getFileUrl(record, record.audio as string),
    audio_url: record.audio_url,
    slug: record.slug,
    categories:
      typeof record.categories === 'string'
        ? JSON.parse(record.categories)
        : record.categories,
  };
}

export function mapRecordToBook(record: RecordModel): Book {
  return {
    id: record.id,
    slug: record.slug,
    type: record.type,
    title: record.title,
    author: record.author,
    imageURL: record.imageURL
      ? getFileUrl(record, record.imageURL as string)
      : '',
    link: record.link,
    dateAdded: record.dateAdded,
  };
}

export function mapRecordToCertificate(record: RecordModel): Certificate {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    issuedBy: record.issuedBy,
    dateIssued: record.dateIssued,
    credentialId: record.credentialId,
    imageUrl: getFileUrl(
      record,
      (record.image as string) || (record.imageUrl as string),
    ),
    organizationLogoUrl: getFileUrl(
      record,
      (record.organizationLogo as string) ||
        (record.organizationLogoUrl as string),
    ),
    link: record.link,
  };
}

export function mapRecordToEmployment(record: RecordModel): Employment {
  return {
    id: record.id,
    slug: record.slug,
    organization: record.organization,
    jobTitle: record.jobTitle,
    dateString: record.dateString,
    jobType: record.jobType,
    orgLogoUrl: getFileUrl(
      record,
      (record.orgLogo as string) || (record.orgLogoUrl as string),
    ),
    organizationIndustry: record.organizationIndustry,
    organizationLocation: record.organizationLocation,
    responsibilities:
      typeof record.responsibilities === 'string'
        ? JSON.parse(record.responsibilities)
        : record.responsibilities,
  };
}

export function mapRecordToInterests(
  record: RecordModel,
): InterestsAndObjectives & { id: string } {
  return {
    id: record.id,
    description: record.description,
    conclusion: record.conclusion,
    objectives:
      typeof record.objectives === 'string'
        ? JSON.parse(record.objectives)
        : record.objectives,
  };
}

export function mapRecordToMovie(record: RecordModel): Movie {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    releaseDate: record.releaseDate,
    imdbId: record.imdbId,
    posterUrl: record.posterUrl
      ? getFileUrl(record, record.posterUrl as string)
      : '',
    imdbLink: record.imdbLink,
    rating: record.rating,
  };
}

export function mapRecordToPersonalInfo(record: RecordModel): PersonalInfo {
  const fileName =
    (record.avatar as string) || (record.avatarUrl as string) || '';
  return {
    name: record.name as string,
    title: record.title as string,
    avatarUrl: getFileUrl(record, fileName),
  };
}

export function mapRecordToProject(record: RecordModel): Project {
  return {
    id: record.id,
    name: record.name,
    dateString: record.dateString,
    image: getFileUrl(
      record,
      (record.image as string) || (record.image_url as string),
    ),
    description: record.description,
    tools:
      typeof record.tools === 'string'
        ? JSON.parse(record.tools)
        : record.tools,
    readme: record.readme,
    status: record.status,
    link: record.link,
    favicon: getFileUrl(
      record,
      (record.favicon as string) || (record.favicon_url as string),
    ),
    pinned: record.pinned,
    slug: record.slug,
  };
}

export function mapRecordToPublication(record: RecordModel): Publication {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    publisher: record.publisher,
    link: record.link,
    openAccess: record.openAccess,
    excerpt: record.excerpt,
    authors:
      typeof record.authors === 'string'
        ? JSON.parse(record.authors)
        : record.authors,
    keywords:
      typeof record.keywords === 'string'
        ? JSON.parse(record.keywords)
        : record.keywords,
  };
}

export function mapRecordToSection(record: RecordModel): Section {
  return {
    id: record.id,
    name: record.name,
    title: record.title,
    enabled: record.enabled,
    order: record.order,
  };
}

export function mapRecordToResume(record: RecordModel): Resume {
  const fileName = (record.file as string) || '';
  return {
    fileUrl: getFileUrl(record, fileName),
  };
}

export function mapRecordToComment(record: RecordModel): Comment {
  return {
    id: record.id,
    postId: record.postId,
    author: record.author,
    content: record.content,
    avatarUrl: record.avatarUrl
      ? getFileUrl(record, record.avatarUrl as string)
      : undefined,
    parentId: record.parentId,
    createdAt: new Date(record.created).getTime(),
    likes: Array.isArray(record.likedBy) ? record.likedBy.length : 0,
  };
}

export function mapRecordToAnalyticsEvent(record: RecordModel): AnalyticsEvent {
  return {
    id: record.id,
    path: record.path,
    country: record.country,
    referrer: record.referrer,
    user_agent: record.user_agent,
    is_bot: record.is_bot,
    created: record.created,
  };
}

export function mapRecordToFeedback(record: RecordModel): {
  id: string;
  feedback: string;
  contact: string;
  created: string;
} {
  return {
    id: record.id,
    feedback: record.feedback,
    contact: record.contact,
    created: record.created,
  };
}
