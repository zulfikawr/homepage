<h1 align=center">Zulfikar's Homepage</h1>

<p align=center">
    A personal website where I list my projects, work history, blog posts, and more.
</p>

## 🛠️ Technologies Used

- **Next.js 16** – React-based framework for fast and scalable web apps.
- **Cloudflare D1** – Serverless SQL database based on SQLite.
- **Cloudflare R2** – S3-compatible object storage for assets.
- **Spotify API** – Fetches the currently playing track and listening history.
- **Tailwind CSS** – Utility-first CSS framework for styling.

## 🔧 Installation & Setup

To run this project locally, follow these steps:

### 1️⃣ Clone the repository:

```sh
git clone https://github.com/zulfikawr/homepage.git
cd homepage
```

### 2️⃣ Install dependencies:

```sh
bun install
```

### 3️⃣ Set up environment variables:

Create a `.env` file in the root directory and add:

```sh
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_DEV_URL=

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_API_TOKEN=
NEXT_PUBLIC_R2_DOMAIN=

NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=

GITHUB_TOKEN=
```

### 4️⃣ Local data (SQLite + filesystem)

Development uses the exported local copies of Cloudflare D1 and R2 by default:

```sh
DATA_MODE=local
LOCAL_DB_PATH=./local/data/homepage.db
LOCAL_STORAGE_DIR=./local/storage
```

To switch back to remote Cloudflare D1/R2 in development, set
`DATA_MODE=cloudflare` (requires the `CLOUDFLARE_*` variables above).

### 5️⃣ Run the project:

```sh
bun run dev
```

The site will be available at `http://localhost:3000`

## 🧪 Testing

The database CRUD tests run against a throwaway copy of
`local/data/homepage.db` and a temporary storage directory, so your real data
is never modified:

```sh
bun test
# or only the database suite
bun run test:crud
```

## 📌 Acknowledgments

- **Template & Design:** [Tony (Lipeng) He](https://www.ouorz.com/)

---

<p align=center">Made with ❤️ by Zulfikar</p>
