import { Metadata } from 'next';
import Home from './home';
import { getSections } from '@/database/sections';
import { getPersonalInfo } from '@/database/personalInfo';
import { getPosts } from '@/database/posts';
import { getProjects } from '@/database/projects';
import { getEmployments } from '@/database/employments';
import { getInterestsAndObjectives } from '@/database/interestsAndObjectives';

export const metadata: Metadata = {
  title: 'Home - Zulfikar',
  description: 'Personal website and portfolio of Zulfikar',
};

export default async function HomePage() {
  const [sections, personalInfo, posts, projects, employments, interests] =
    await Promise.all([
      getSections(),
      getPersonalInfo(),
      getPosts(),
      getProjects(),
      getEmployments(),
      getInterestsAndObjectives(),
    ]);

  return (
    <Home
      initialData={{
        sections,
        personalInfo,
        posts,
        projects,
        employments,
        interests,
      }}
    />
  );
}
