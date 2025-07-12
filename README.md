# Video Grab Mate 92

Video Grab Mate 92 is a modern tool for downloading, processing, and managing video content. Built primarily with TypeScript, with supporting Python scripts and CSS for styling, it’s designed to be extensible and easy to deploy.

---

## Features

- **Video Downloading:** Fetch videos from supported platforms.
- **Processing:** Convert, trim, and manipulate videos.
- **Extensible:** Add new sources or modules easily.
- **Cross-language:** TypeScript (frontend/backend) + Python (processing).
- **User-Friendly:** Simple interface with CSS styling.

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Python 3.8+** (for backend processing scripts)

---

## Local Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rifat7474/video-grab-mate-92.git
   cd video-grab-mate-92
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Python Environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Start Frontend**
   ```bash
   npm run start
   ```

5. **Run Python Backend**
   ```bash
   cd backend
   python <main_script>.py
   # Replace <main_script>.py with your actual entry point
   ```

---

## Deployment Guide

### Deploy on Render

**Frontend (Node.js/React/Vite):**

1. Push your repo to GitHub.
2. Sign in to [Render](https://render.com/) and select "New Web Service".
3. Connect your repository and select the branch.
4. Set **Build Command**:
   ```
   npm install && npm run build
   ```
5. Set **Start Command**:
   ```
   npm run start
   ```
6. Add environment variables if needed (`.env`).
7. Click "Create Web Service". Render will deploy your app.

**Backend (Python):**

1. Create another "Web Service" in Render for your backend.
2. Set **Build Command**:
   ```
   pip install -r requirements.txt
   ```
3. Set **Start Command**:
   ```
   python <main_script>.py
   ```
   Replace `<main_script>.py` with your backend entry file.
4. Add environment variables if needed.
5. Click "Create Web Service".

**Connecting Frontend & Backend:**
- You’ll get public URLs for each service. Set your frontend to use the backend’s Render URL for API requests (e.g. via `REACT_APP_BACKEND_URL`).
- Update your `.env` and redeploy as needed.

---

### Deploy on Vercel

**Frontend (Node.js/React/Vite):**

1. Push your repo to GitHub.
2. Go to [Vercel](https://vercel.com/) and click "New Project".
3. Import your GitHub repo.
4. Vercel will auto-detect frameworks like React/Vite. Confirm settings.
5. If needed, set environment variables (Settings > Environment Variables).
6. Click "Deploy".
7. Vercel will provide a public URL.

**Backend (Python):**

- Vercel is not suitable for long-running Python backend servers, but you can deploy serverless Python functions if your backend logic fits this model.
- For full backend, use Render or another platform (see above) and connect your frontend to the backend URL.

---

## Verifying Deployment

1. Visit your frontend URL.
2. Test video downloading/processing features.
3. Confirm the frontend can communicate with the backend (API calls).
4. Check logs on Render/Vercel for any errors.
5. Ensure all environment variables are correctly set.

---

## Project Structure

```
video-grab-mate-92/
├── src/         # TypeScript source files
├── backend/     # Python scripts for processing
├── public/      # Static assets and CSS
├── tests/       # Test suites
└── README.md
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

Licensed under the [MIT License](LICENSE).

---

## Author

- [rifat7474](https://github.com/rifat7474)

---

## Acknowledgments

Inspired by open-source video tools and community contributions.
