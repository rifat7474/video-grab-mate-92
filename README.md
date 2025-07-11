
# Video Downloader

A modern video downloader application that allows users to paste URLs from YouTube, Facebook, Vimeo, TikTok, Instagram, Twitter, and many more platforms to download available formats using `yt-dlp`.

Built with:
- 🧩 **React + TypeScript + ShadCN UI**
- 🌗 **Dark/Light Mode with Theme Toggle**
- ⚡ **Supabase Edge Functions + `yt-dlp`**
- 🔥 **Deployed on Vercel and Render**

---

## 🚀 Features

- **Multi-Platform Support**: YouTube, Facebook, Vimeo, TikTok, Instagram, Twitter, and many more
- **Video Metadata Fetching**: Paste URL to fetch video metadata and formats instantly
- **Rich Preview**: View thumbnail, title, duration, and uploader information
- **Multiple Format Options**: Choose from various formats (MP4, MP3) and resolutions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Theme Support**: Toggle between dark and light modes
- **Smooth UX**: Loading states, error handling, and progress indicators
- **Secure Backend**: Powered by Supabase Edge Functions for scalable processing

---

## 🏗️ Project Structure

```bash
📁 src/
├── components/
│   ├── theme/                    # Theme management
│   │   ├── ThemeProvider.tsx     # Theme context provider
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── ui/                       # ShadCN UI components
│   │   ├── button.tsx, card.tsx, input.tsx, etc.
│   └── video-downloader/         # Main downloader components
│       ├── UrlInput.tsx          # URL input form
│       ├── VideoPreview.tsx      # Video information display
│       ├── DownloadOptions.tsx   # Format selection UI
│       └── ProgressIndicator.tsx # Download progress
├── pages/
│   ├── Index.tsx                 # Main application page
│   └── NotFound.tsx              # 404 error page
├── integrations/supabase/        # Supabase integration
│   ├── client.ts                 # Supabase client setup
│   └── types.ts                  # Database type definitions
├── config/
│   └── api.ts                    # API endpoint configuration
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── App.tsx                       # Root application component
└── main.tsx                      # Application entry point

📁 supabase/
├── functions/
│   └── fetch-video-info/         # Edge function for video processing
│       └── index.ts              # yt-dlp integration logic
└── config.toml                   # Supabase configuration

📁 deployment/
├── vercel.json                   # Vercel deployment config
├── render.yaml                   # Render.com deployment config
├── Dockerfile                    # Docker containerization
└── nginx.conf                    # Nginx configuration
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Beautiful and accessible component library
- **Lucide React** - Icon library
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

### Backend
- **Supabase Edge Functions** - Serverless backend functions
- **yt-dlp** - Video information extraction and downloading
- **Deno** - Runtime for edge functions

### Deployment
- **Vercel** - Frontend hosting and deployment
- **Render.com** - Alternative deployment option
- **Docker** - Containerization support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase CLI (for backend development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd video-downloader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Supabase Edge Functions: https://yzwarjplbrhqbxxmaouv.supabase.co/functions/v1

### Supabase Edge Functions Development

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**
   ```bash
   supabase start
   ```

3. **Deploy functions**
   ```bash
   supabase functions deploy fetch-video-info
   ```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   - Import your repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://yzwarjplbrhqbxxmaouv.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Alternative: Render Deployment

1. **Connect Repository**
   - Link your GitHub repository to Render
   - Use the pre-configured `render.yaml`

2. **Environment Variables**
   - Set in Render dashboard or use the `render.yaml` configuration

### Alternative: Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t video-downloader .
   ```

2. **Run container**
   ```bash
   docker run -p 80:80 video-downloader
   ```

### Backend Deployment (Supabase)

The backend is automatically deployed via Supabase Edge Functions:

1. **Deploy Edge Functions**
   ```bash
   supabase functions deploy fetch-video-info
   ```

2. **Configure Secrets** (if needed)
   ```bash
   supabase secrets set SECRET_NAME=secret_value
   ```

---

## 📡 API Reference

### Fetch Video Information
- **URL**: `POST /functions/v1/fetch-video-info`
- **Body**: `{ "url": "https://youtube.com/watch?v=..." }`
- **Response**: 
  ```json
  {
    "title": "Video Title",
    "thumbnail": "https://...",
    "duration": "3:45",
    "uploader": "Channel Name",
    "formats": [
      {
        "format_id": "22",
        "ext": "mp4",
        "quality": "720p",
        "filesize": 12345678,
        "url": "https://..."
      }
    ]
  }
  ```

---

## 🎯 Supported Platforms

- **YouTube** - Videos, playlists, channels
- **Facebook** - Public videos and posts
- **Vimeo** - Public and private videos
- **TikTok** - Individual videos
- **Instagram** - Posts, stories, reels
- **Twitter** - Video tweets
- **And many more** via yt-dlp support

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Project Configuration

- **Vite**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.ts`
- **ESLint**: `eslint.config.js`

---

## 🐛 Troubleshooting

### Common Issues

1. **Video URL not supported**
   - Verify the URL is publicly accessible
   - Check if the platform is supported by yt-dlp

2. **Download not starting**
   - Check browser popup blocker settings
   - Verify network connectivity

3. **Edge Function errors**
   - Check Supabase function logs
   - Ensure yt-dlp is properly installed in the function environment

### Debug Information

- Check browser console for frontend errors
- Monitor Supabase Edge Function logs
- Verify API endpoint configuration in `src/config/api.ts`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video downloading library
- [ShadCN UI](https://ui.shadcn.com/) - UI component library
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Vercel](https://vercel.com/) - Frontend hosting

---

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure Supabase Edge Functions are deployed
4. Check Supabase function logs for backend issues

For additional help, please open an issue in the repository.
