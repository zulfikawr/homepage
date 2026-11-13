'use client';

import { Shimmer } from '@/components/ui/shimmer';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Employment } from '@/types/employment';
import { Movie } from '@/types/movie';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';
import { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from '@/types/spotify';

import ArtistCard from '../artist';
import BookCard from '../book';
import CertificateCard from '../certificate';
import EmploymentCard from '../employment';
import GitHubCard from '../github';
import MovieCard from '../movie';
import PlaylistCard from '../playlist/spotify';
import PostCard from '../post';
import ProjectCard from '../project';
import PublicationCard from '../publication';
import TrackRow from '../track';

const BOOK_TEMPLATE: Book = {
  id: 'loading-book',
  slug: 'loading-book',
  type: 'currently_reading',
  title: 'Book Title',
  author: 'Book Author',
  image: '/images/placeholder-portrait.png',
  image_url: '/images/placeholder-portrait.png',
  link: '#',
  date_added: '01/01/2025',
};

const EMPLOYMENT_TEMPLATE: Employment = {
  id: 'loading-employment',
  slug: 'loading-employment',
  organization: 'Organization Name',
  organization_industry: 'Industry Name',
  job_title: 'Job Title',
  job_type: 'full_time',
  responsibilities: [],
  date_string: 'Jan 2024 - Present',
  logo: '/images/placeholder-square.png',
  organization_location: 'Location',
};

const PROJECT_TEMPLATE: Project = {
  id: 'loading-project',
  slug: 'loading-project',
  name: 'Project Name',
  date_string: '2025',
  image: '/images/placeholder.png',
  description:
    'A short description of the project and the problem it solves for people.',
  tools: ['React', 'TypeScript', 'Tailwind'],
  status: 'completed',
  favicon: '/images/placeholder-square.png',
  pinned: true,
  link: '#',
};

const POST_TEMPLATE: Post = {
  id: 'loading-post',
  slug: 'loading-post',
  title: 'Post Title',
  excerpt:
    'A short excerpt describing the post and what the reader can expect from it.',
  categories: ['Category'],
  date_string: 'January 1, 2025',
  image: '/images/placeholder-portrait.png',
  image_url: '/images/placeholder-portrait.png',
  content: '',
};

const PUBLICATION_TEMPLATE: Publication = {
  id: 'loading-publication',
  slug: 'loading-publication',
  title: 'Publication Title',
  authors: ['Author Name'],
  publisher: 'Publisher',
  excerpt: 'A short publication excerpt.',
  keywords: ['Research', 'Academic', 'Publication'],
  open_access: true,
  link: '#',
};

const CERTIFICATE_TEMPLATE: Certificate = {
  id: 'loading-certificate',
  slug: 'loading-certificate',
  title: 'Certificate Title',
  issued_by: 'Issuing Organization',
  date_issued: 'January 2025',
  credential_id: 'CREDENTIAL-ID',
  image: '/images/placeholder.png',
  image_url: '/images/placeholder.png',
  logo: '/images/placeholder-square.png',
  link: '#',
};

const MOVIE_TEMPLATE: Movie = {
  id: 'loading-movie',
  slug: 'loading-movie',
  title: 'Movie Title',
  release_date: '2025',
  image: '/images/placeholder-portrait.png',
  imdb_link: '#',
  rating: 4,
};

const PLAYLIST_TEMPLATE: SpotifyPlaylist = {
  id: 'loading-playlist',
  name: 'Playlist Name',
  description: 'A short playlist description',
  images: [{ url: '/images/placeholder-square.png' }],
  tracks: { total: 0 },
  external_urls: { spotify: '#' },
};

const TRACK_TEMPLATE: SpotifyTrack = {
  id: 'loading-track',
  name: 'Track Name',
  artists: [{ name: 'Artist Name' }],
  album: {
    name: 'Album Name',
    images: [{ url: '/images/placeholder-square.png' }],
  },
  external_urls: { spotify: '#' },
  duration_ms: 0,
};

const ARTIST_TEMPLATE: SpotifyArtist = {
  id: 'loading-artist',
  name: 'Artist Name',
  images: [{ url: '/images/placeholder-square.png' }],
  external_urls: { spotify: '#' },
  genres: [],
};

const ShimmerCard = ({ children }: { children: React.ReactNode }) => (
  <Shimmer loading>{children}</Shimmer>
);

type CardLoadingProps = {
  variant:
    | 'book'
    | 'employment'
    | 'project'
    | 'post'
    | 'playlist'
    | 'certificate'
    | 'publication'
    | 'track'
    | 'artist'
    | 'movie'
    | 'github';
  isPreview?: boolean;
};

/**
 * Loading state for cards.
 *
 * Instead of hand-drawn skeleton blocks, each variant renders the real card
 * with representative data and lets `shimmer-from-structure` measure it. The
 * layout therefore stays pixel-perfect whenever a card changes.
 */
const CardLoading = ({ variant, isPreview }: CardLoadingProps) => {
  switch (variant) {
    case 'book':
      return (
        <ShimmerCard>
          <BookCard book={BOOK_TEMPLATE} isPreview />
        </ShimmerCard>
      );
    case 'employment':
      return (
        <ShimmerCard>
          <EmploymentCard employment={EMPLOYMENT_TEMPLATE} isPreview />
        </ShimmerCard>
      );
    case 'project':
      return (
        <ShimmerCard>
          <ProjectCard project={PROJECT_TEMPLATE} isPreview />
        </ShimmerCard>
      );
    case 'post':
      return (
        <ShimmerCard>
          <PostCard post={POST_TEMPLATE} isPreview />
        </ShimmerCard>
      );
    case 'playlist':
      return (
        <ShimmerCard>
          <PlaylistCard playlist={PLAYLIST_TEMPLATE} />
        </ShimmerCard>
      );
    case 'certificate':
      return (
        <ShimmerCard>
          <CertificateCard certificate={CERTIFICATE_TEMPLATE} isPreview />
        </ShimmerCard>
      );
    case 'publication':
      return (
        <ShimmerCard>
          <PublicationCard publication={PUBLICATION_TEMPLATE} isPreview />
        </ShimmerCard>
      );
    case 'track':
      return (
        <ShimmerCard>
          <TrackRow track={TRACK_TEMPLATE} trailing='0:00' index={0} />
        </ShimmerCard>
      );
    case 'artist':
      return (
        <ShimmerCard>
          <ArtistCard artist={ARTIST_TEMPLATE} />
        </ShimmerCard>
      );
    case 'movie':
      return (
        <ShimmerCard>
          <MovieCard movie={MOVIE_TEMPLATE} isPreview={isPreview} />
        </ShimmerCard>
      );
    case 'github':
      return (
        <ShimmerCard>
          <GitHubCard
            repoName='repository-name'
            repoUrl='https://github.com'
            isPreview
          />
        </ShimmerCard>
      );
    default:
      return (
        <ShimmerCard>
          <ProjectCard project={PROJECT_TEMPLATE} isPreview />
        </ShimmerCard>
      );
  }
};

export {
  CardLoading,
  BOOK_TEMPLATE,
  CERTIFICATE_TEMPLATE,
  MOVIE_TEMPLATE,
  POST_TEMPLATE,
  PROJECT_TEMPLATE,
  PUBLICATION_TEMPLATE,
};
