import type { NextApiRequest, NextApiResponse } from 'next';

const GITHUB_API = {
  USER: 'https://api.github.com/users/zulfikawr',
  REPOS: 'https://api.github.com/users/zulfikawr/repos',
};

type ResDataType = {
  followers: number;
  stars: number;
};

type Repository = {
  fork: boolean;
  stargazers_count: number;
};

type User = {
  followers: number;
};

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

const github = async (
  _req: NextApiRequest,
  res: NextApiResponse<ResDataType>,
) => {
  const userResponse = await fetch(GITHUB_API.USER, {
    headers,
  });
  const userReposResponse = await fetch(`${GITHUB_API.REPOS}?per_page=100`, {
    headers,
  });

  const user: User = await userResponse.json();
  const repositories: Repository[] = await userReposResponse.json();

  const mine = repositories.filter((repo) => !repo.fork);
  const stars = mine.reduce((accumulator, repository) => {
    return accumulator + repository.stargazers_count;
  }, 0);

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1200, stale-while-revalidate=600',
  );

  return res.status(200).json({
    followers: user.followers,
    stars,
  });
};

export default github;
