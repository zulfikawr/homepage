<h1 align="center">Zulfikar's Homepage</h1>

<p align="center">
    A personal website where I list my projects, work history, blog posts, and more.
</p>

<br>

![Screenshot](/public/screenshot.png)

## 🌟 Features

- **Project Showcase** – A collection of my personal and professional projects.
- **Work Experience** – Highlights of my employment and internships.
- **Blog Posts** – Articles about topics I’m interested in.
- **Spotify Integration** – Displays the currently playing and recently played songs using Spotify API.

## 🛠️ Technologies Used

- **Next.js 15** – React-based framework for fast and scalable web apps.
- **PocketBase** – Open source backend for real-time database and auth.
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
npm install
```

### 3️⃣ Set up environment variables:

Create a `.env` file in the root directory and add:

```sh
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=your_redirect_uri
```

### 4️⃣ Run the project:

```sh
npm run dev
```

The site will be available at `http://localhost:3000`

## 🌐 Deployment

This project is deployed on **Firebase Hosting**:
👉 [zulf1kar.web.app](https://zulf1kar.web.app)

## 📌 Acknowledgments

- **Template & Design:** [Tony (Lipeng) He](https://www.ouorz.com/)

---

<p align="center">Made with ❤️ by Zulfikar</p>
