import { afterAll, beforeAll, describe, expect, it, mock } from 'bun:test';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/**
 * CRUD smoke tests for every editable collection.
 *
 * The tests operate on a throwaway copy of the local SQLite database and a
 * throwaway object-storage directory, so real portfolio data is never touched.
 */

const realDbPath = path.join(process.cwd(), 'local', 'data', 'homepage.db');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'homepage-crud-'));
const testDbPath = path.join(tempRoot, 'homepage.db');
const testStoragePath = path.join(tempRoot, 'storage');

mock.module('next/cache', () => ({
  revalidatePath: () => {},
  revalidateTag: () => {},
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

type CrudResult = {
  success: boolean;
  error?: string;
  [key: string]: unknown;
};

let projects: typeof import('../database/projects');
let posts: typeof import('../database/posts');
let books: typeof import('../database/books');
let certificates: typeof import('../database/certificates');
let employments: typeof import('../database/employments');
let movies: typeof import('../database/movies');
let publications: typeof import('../database/publications');
let sections: typeof import('../database/sections');
let feedback: typeof import('../database/feedback');
let personalInfo: typeof import('../database/personal-info');
let interests: typeof import('../database/interests-and-objectives');
let customization: typeof import('../database/customization');
let resume: typeof import('../database/resume');
let analytics: typeof import('../database/analytics-events');
let banners: typeof import('../database/banners');

const formData = (values: Record<string, string | File>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.append(key, value);
  }
  return data;
};

const expectSuccess = (result: CrudResult) => {
  expect(result.success).toBe(true);
  if (!result.success) throw new Error(result.error);
};

beforeAll(async () => {
  if (!fs.existsSync(realDbPath)) {
    throw new Error(
      `Missing ${realDbPath}. Run ./scripts/export-cloudflare.sh first.`,
    );
  }

  // VACUUM INTO gives a consistent copy even if the dev server has the source
  // database open in WAL mode.
  const source = new DatabaseSync(realDbPath);
  const escaped = testDbPath.replaceAll("'", "''");
  source.exec(`VACUUM INTO '${escaped}'`);
  source.close();

  fs.mkdirSync(testStoragePath, { recursive: true });
  process.env.DATA_MODE = 'local';
  process.env.LOCAL_DB_PATH = testDbPath;
  process.env.LOCAL_STORAGE_DIR = testStoragePath;

  projects = await import('../database/projects');
  posts = await import('../database/posts');
  books = await import('../database/books');
  certificates = await import('../database/certificates');
  employments = await import('../database/employments');
  movies = await import('../database/movies');
  publications = await import('../database/publications');
  sections = await import('../database/sections');
  feedback = await import('../database/feedback');
  personalInfo = await import('../database/personal-info');
  interests = await import('../database/interests-and-objectives');
  customization = await import('../database/customization');
  resume = await import('../database/resume');
  analytics = await import('../database/analytics-events');
  banners = await import('../database/banners');
});

afterAll(async () => {
  await fsp.rm(tempRoot, { recursive: true, force: true });
});

describe('database CRUD on a temporary copy', () => {
  it('creates, updates and deletes a project', async () => {
    const image = new File([new Uint8Array([1, 2, 3])], 'cover.png', {
      type: 'image/png',
    });
    // The form appends the existing `image` string before the selected File;
    // the server must still pick the File.
    const projectForm = formData({
      name: 'CRUD Project',
      slug: 'crud-project',
      description: 'created',
      readme: '# readme',
      date_string: '5 Oct 2025 - 6 Nov 2025',
      status: 'in_progress',
      tools: JSON.stringify(['TypeScript', 'SQLite']),
      link: 'https://example.com',
      github_repo_url: 'https://github.com/example/crud',
      pinned: 'false',
      image: '',
    });
    projectForm.append('image', image);

    const created = await projects.createProject(projectForm);
    expectSuccess(created);
    expect(created.project?.name).toBe('CRUD Project');
    expect(created.project?.tools).toEqual(['TypeScript', 'SQLite']);
    expect(created.project?.date_string).toBe('5 Oct 2025 - 6 Nov 2025');
    expect(created.project?.pinned).toBe(false);

    const imageKey = String(created.project?.image_url || '');
    expect(imageKey.startsWith('projects/crud-project/')).toBe(true);
    expect(fs.existsSync(path.join(testStoragePath, imageKey))).toBe(true);

    const updated = await projects.updateProject(
      formData({
        id: created.project!.id,
        name: 'CRUD Project Updated',
        slug: 'crud-project',
        description: 'updated',
        readme: '# updated',
        date_string: '1 Jan 2026 - Present',
        status: 'completed',
        tools: JSON.stringify(['Rust']),
        pinned: 'true',
        image_url: '/api/storage/projects/crud-project/alternate.png',
      }),
    );
    expectSuccess(updated);
    expect(updated.project?.name).toBe('CRUD Project Updated');
    expect(updated.project?.status).toBe('completed');
    expect(updated.project?.pinned).toBe(true);
    expect(updated.project?.tools).toEqual(['Rust']);
    expect(updated.project?.image_url).toBe(
      'projects/crud-project/alternate.png',
    );

    expectSuccess(await projects.deleteProject(created.project!.id));
    expect(await projects.getProjectById(created.project!.id)).toBeNull();
  });

  it('creates, updates and deletes a post', async () => {
    const postForm = formData({
      title: 'CRUD Post',
      slug: 'crud-post',
      excerpt: 'excerpt',
      content: '# content',
      date_string: '5 Oct 2025',
      categories: JSON.stringify(['Test']),
      image: '',
    });
    postForm.append(
      'image',
      new File([new Uint8Array([4, 5, 6])], 'cover.png', {
        type: 'image/png',
      }),
    );

    const created = await posts.createPost(postForm);
    expectSuccess(created);
    expect(created.data?.title).toBe('CRUD Post');
    expect(created.data?.categories).toEqual(['Test']);
    expect(created.data?.image_url).toStartWith('posts/crud-post/');

    const updated = await posts.updatePost(
      created.data!.id,
      formData({
        id: created.data!.id,
        title: 'CRUD Post Updated',
        slug: 'crud-post',
        excerpt: 'updated',
        content: '# updated',
        date_string: '6 Nov 2025',
        categories: JSON.stringify(['Test', 'Updated']),
      }),
    );
    expectSuccess(updated);
    expect(updated.data?.title).toBe('CRUD Post Updated');
    expect(updated.data?.categories).toEqual(['Test', 'Updated']);

    expectSuccess(await posts.deletePost(created.data!.id));
    expect(await posts.getPostById(created.data!.id)).toBeNull();
  });

  it('creates, updates and deletes a book', async () => {
    const created = await books.createBook({
      slug: 'crud-book',
      type: 'to_read',
      title: 'CRUD Book',
      author: 'Test Author',
      image: '/api/storage/books/crud-book/image.png',
      image_url: 'books/crud-book/image.png',
      link: 'https://example.com/book',
      date_added: '5 Oct 2025',
    });
    expectSuccess(created);
    expect(created.book?.title).toBe('CRUD Book');

    const updated = await books.updateBook({
      id: created.book!.id,
      slug: 'crud-book',
      type: 'read',
      title: 'CRUD Book Updated',
      author: 'Test Author',
      image: '/api/storage/books/crud-book/image.png',
      image_url: 'books/crud-book/image.png',
      link: 'https://example.com/book',
      date_added: '6 Nov 2025',
    });
    expectSuccess(updated);
    expect(updated.book?.title).toBe('CRUD Book Updated');
    expect(updated.book?.type).toBe('read');

    expectSuccess(await books.deleteBook(created.book!.id));
    expect(await books.getBookById(created.book!.id)).toBeNull();
  });

  it('creates, updates and deletes a certificate', async () => {
    const created = await certificates.createCertificate(
      formData({
        title: 'CRUD Certificate',
        slug: 'crud-certificate',
        issued_by: 'Test Issuer',
        date_issued: '5 Oct 2025',
        credential_id: 'CRED-1',
        link: 'https://example.com/cert',
        image_url: '/api/storage/certs/crud.png',
      }),
    );
    expectSuccess(created);
    expect(created.certificate?.title).toBe('CRUD Certificate');

    const updated = await certificates.updateCertificate(
      formData({
        id: created.certificate!.id,
        title: 'CRUD Certificate Updated',
        slug: 'crud-certificate',
        issued_by: 'Test Issuer',
        date_issued: '6 Nov 2025',
        credential_id: 'CRED-2',
        link: 'https://example.com/cert',
      }),
    );
    expectSuccess(updated);
    expect(updated.certificate?.credential_id).toBe('CRED-2');

    expectSuccess(
      await certificates.deleteCertificate(created.certificate!.id),
    );
    expect(
      await certificates.getCertificateById(created.certificate!.id),
    ).toBeNull();
  });

  it('creates, updates and deletes an employment', async () => {
    const created = await employments.createEmployment(
      formData({
        organization: 'CRUD Org',
        slug: 'crud-org',
        organization_industry: 'Testing',
        job_title: 'Tester',
        job_type: 'full_time',
        responsibilities: JSON.stringify(['Test all collections']),
        date_string: 'Jan 2024 - Feb 2024',
        organization_location: 'Remote',
      }),
    );
    expectSuccess(created);
    expect(created.employment?.organization).toBe('CRUD Org');
    expect(created.employment?.responsibilities).toEqual([
      'Test all collections',
    ]);

    const updated = await employments.updateEmployment(
      formData({
        id: created.employment!.id,
        organization: 'CRUD Org Updated',
        slug: 'crud-org',
        organization_industry: 'Testing',
        job_title: 'Senior Tester',
        job_type: 'contract',
        responsibilities: JSON.stringify(['Test updates']),
        date_string: 'Jan 2024 - Present',
        organization_location: 'Remote',
      }),
    );
    expectSuccess(updated);
    expect(updated.employment?.job_title).toBe('Senior Tester');
    expect(updated.employment?.job_type).toBe('contract');

    expectSuccess(await employments.deleteEmployment(created.employment!.id));
    expect(
      await employments.getEmploymentById(created.employment!.id),
    ).toBeNull();
  });

  it('creates, updates and deletes a movie', async () => {
    const created = await movies.createMovie({
      slug: 'crud-movie',
      title: 'CRUD Movie',
      release_date: '5 Oct 2025',
      imdb_id: 'tt0000001',
      poster_url: 'movies/crud-movie/poster.png',
      imdb_link: 'https://www.imdb.com/title/tt0000001',
      rating: 8,
    });
    expectSuccess(created);
    expect(created.movie?.title).toBe('CRUD Movie');

    const updated = await movies.updateMovie({
      id: created.movie!.id,
      slug: 'crud-movie',
      title: 'CRUD Movie Updated',
      release_date: '6 Nov 2025',
      imdb_id: 'tt0000002',
      poster_url: 'movies/crud-movie/poster.png',
      imdb_link: 'https://www.imdb.com/title/tt0000002',
      rating: 9,
    });
    expectSuccess(updated);
    expect(updated.movie?.rating).toBe(9);
    expect(updated.movie?.imdb_id).toBe('tt0000002');

    expectSuccess(await movies.deleteMovie(created.movie!.id));
    expect(await movies.getMovieById(created.movie!.id)).toBeNull();
  });

  it('creates, updates and deletes a publication', async () => {
    const created = await publications.createPublication(
      formData({
        title: 'CRUD Publication',
        slug: 'crud-publication',
        publisher: 'Test Publisher',
        excerpt: 'Abstract',
        link: 'https://example.com/paper',
        open_access: 'true',
        authors: JSON.stringify(['A. Author']),
        keywords: JSON.stringify(['testing']),
      }),
    );
    expectSuccess(created);
    expect(created.publication?.title).toBe('CRUD Publication');
    expect(created.publication?.open_access).toBe(true);

    const updated = await publications.updatePublication(
      formData({
        id: created.publication!.id,
        title: 'CRUD Publication Updated',
        slug: 'crud-publication',
        publisher: 'Test Publisher',
        excerpt: 'Updated abstract',
        link: 'https://example.com/paper',
        open_access: 'false',
        authors: JSON.stringify(['A. Author', 'B. Author']),
        keywords: JSON.stringify(['testing', 'updated']),
      }),
    );
    expectSuccess(updated);
    expect(updated.publication?.open_access).toBe(false);
    expect(updated.publication?.authors).toEqual(['A. Author', 'B. Author']);

    expectSuccess(
      await publications.deletePublication(created.publication!.id),
    );
    expect(
      await publications.getPublicationById(created.publication!.id),
    ).toBeNull();
  });

  it('creates, updates and deletes a section', async () => {
    const created = await sections.createSection({
      name: 'crud-section',
      title: 'CRUD Section',
      enabled: true,
      order: 99,
    });
    expectSuccess(created);
    expect(created.section?.name).toBe('crud-section');

    const updated = await sections.updateSection({
      id: created.section!.id,
      title: 'CRUD Section Updated',
      enabled: false,
      order: 100,
    });
    expectSuccess(updated);
    expect(updated.section?.title).toBe('CRUD Section Updated');
    expect(updated.section?.enabled).toBe(false);

    expectSuccess(await sections.deleteSection(created.section!.id));
    const remaining = await sections.getSections();
    expect(remaining.some((s) => s.id === created.section!.id)).toBe(false);
  });

  it('creates and deletes feedback', async () => {
    const created = await feedback.createFeedback({
      feedback: 'CRUD feedback',
      contact: 'crud@example.com',
    });
    expectSuccess(created);

    const rows = await feedback.getFeedbacks();
    const row = rows.find((r) => r.feedback === 'CRUD feedback');
    expect(row).toBeDefined();

    expectSuccess(await feedback.deleteFeedback(row!.id));
    const after = await feedback.getFeedbacks();
    expect(after.some((r) => r.id === row!.id)).toBe(false);
  });

  it('updates personal info', async () => {
    const updated = await personalInfo.updatePersonalInfo(
      formData({
        name: 'CRUD Name',
        title: 'CRUD Title',
        avatar_url: '/api/storage/profile/avatar.png',
      }),
    );
    expectSuccess(updated);
    expect(updated.data?.name).toBe('CRUD Name');
    expect(updated.data?.title).toBe('CRUD Title');

    const fetched = await personalInfo.getPersonalInfo();
    expect(fetched.name).toBe('CRUD Name');
  });

  it('updates interests and objectives', async () => {
    const updated = await interests.updateInterestsAndObjectives({
      description: 'CRUD description',
      objectives: ['CRUD objective'],
      conclusion: 'CRUD conclusion',
    });
    expectSuccess(updated);
    expect(updated.data?.description).toBe('CRUD description');
    expect(updated.data?.objectives).toEqual(['CRUD objective']);
  });

  it('updates customization settings', async () => {
    const updated = await customization.updateCustomizationSettings({
      default_theme: 'nord',
      default_background: 'waves',
    });
    expectSuccess(updated);
    expect(updated.data?.default_theme).toBe('nord');
    expect(updated.data?.default_background).toBe('waves');
  });

  it('updates the resume', async () => {
    const updated = await resume.updateResume({
      file: '/api/storage/profile/resume-crud.pdf',
      file_url: 'profile/resume-crud.pdf',
    });
    expectSuccess(updated);
    expect(updated.data?.file_url).toBe('profile/resume-crud.pdf');
  });

  it('saves a project through the collection API route', async () => {
    const { POST, PUT, DELETE } =
      await import('../app/api/collection/[name]/route');

    const createData = formData({
      name: 'CRUD API Project',
      slug: 'crud-api-project',
      description: 'created via route',
      readme: '',
      date_string: '5 Oct 2025 - 6 Nov 2025',
      status: 'in_progress',
      tools: JSON.stringify(['Next.js']),
      pinned: 'true',
    });
    createData.append(
      'image',
      new File([new Uint8Array([7, 8, 9])], 'api.png', {
        type: 'image/png',
      }),
    );

    const createResponse = await POST(
      new Request('http://localhost/api/collection/projects', {
        method: 'POST',
        body: createData,
      }) as never,
      { params: Promise.resolve({ name: 'projects' }) },
    );
    const createJson = (await createResponse.json()) as {
      success: boolean;
      data: { project: { id: string; image_url?: string } };
    };
    expect(createJson.success).toBe(true);
    expect(createJson.data.project.image_url).toStartWith(
      'projects/crud-api-project/',
    );

    const id = createJson.data.project.id;
    const updateData = formData({
      id,
      name: 'CRUD API Project Updated',
      slug: 'crud-api-project',
      description: 'updated via route',
      readme: '',
      date_string: '1 Jan 2026 - Present',
      status: 'completed',
      tools: JSON.stringify(['Next.js', 'Bun']),
      pinned: 'false',
    });

    const updateResponse = await PUT(
      new Request('http://localhost/api/collection/projects', {
        method: 'PUT',
        body: updateData,
      }) as never,
      { params: Promise.resolve({ name: 'projects' }) },
    );
    const updateJson = (await updateResponse.json()) as {
      success: boolean;
      data: { project: { name: string; status: string } };
    };
    expect(updateJson.success).toBe(true);
    expect(updateJson.data.project.name).toBe('CRUD API Project Updated');
    expect(updateJson.data.project.status).toBe('completed');

    const deleteResponse = await DELETE(
      new Request(
        `http://localhost/api/collection/projects?id=${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      ) as never,
      { params: Promise.resolve({ name: 'projects' }) },
    );
    const deleteJson = (await deleteResponse.json()) as { success: boolean };
    expect(deleteJson.success).toBe(true);
    expect(await projects.getProjectById(id)).toBeNull();
  });

  it('loads and updates banner settings', async () => {
    const initial = await banners.getBannerSettings();
    expect(initial.length).toBeGreaterThan(0);
    expect(initial.find((banner) => banner.id === 'spotify')?.width).toBe(
      'half',
    );

    const updated = await banners.updateBannerSetting({
      id: 'spotify',
      width: 'wide',
    });
    expectSuccess(updated);
    expect(
      updated.settings?.find((banner) => banner.id === 'spotify')?.width,
    ).toBe('wide');

    const reordered = await banners.updateBannerSetting({
      id: 'spotify',
      order: 100,
    });
    expectSuccess(reordered);
    const settings = await banners.getBannerSettings();
    expect(settings[settings.length - 1].id).toBe('spotify');

    const invalid = await banners.updateBannerSetting({
      id: 'does-not-exist',
      width: 'half',
    });
    expect(invalid.success).toBe(false);
  });

  it('updates banner settings through the collection API route', async () => {
    const { GET, PUT } = await import('../app/api/collection/[name]/route');

    const getResponse = await GET(
      new Request('http://localhost/api/collection/banners') as never,
      { params: Promise.resolve({ name: 'banners' }) },
    );
    const getJson = (await getResponse.json()) as {
      success: boolean;
      data: { results: { id: string; width: string }[] };
    };
    expect(getJson.success).toBe(true);
    expect(getJson.data.results.length).toBeGreaterThan(0);

    const putResponse = await PUT(
      new Request('http://localhost/api/collection/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'weather', width: 'disabled' }),
      }) as never,
      { params: Promise.resolve({ name: 'banners' }) },
    );
    const putJson = (await putResponse.json()) as { success: boolean };
    expect(putJson.success).toBe(true);

    const settings = await banners.getBannerSettings();
    expect(settings.find((banner) => banner.id === 'weather')?.width).toBe(
      'disabled',
    );
  });

  it('reads analytics without errors', async () => {
    const rows = await analytics.getAnalyticsEvents();
    expect(Array.isArray(rows)).toBe(true);
  });
});
