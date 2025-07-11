
# Video Downloader API

A FastAPI backend service for extracting video information using yt-dlp.

## Features

- ✅ FastAPI with automatic API documentation
- ✅ yt-dlp integration for video information extraction
- ✅ CORS support for frontend integration
- ✅ Comprehensive error handling
- ✅ Health check endpoints
- ✅ Docker support
- ✅ Ready for Render/Replit deployment

## API Endpoints

### `POST /api/download`
Extract video information from a URL.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "title": "Video Title",
  "thumbnail": "https://thumbnail-url.jpg",
  "duration": "03:32",
  "uploader": "Channel Name",
  "formats": [
    {
      "format_id": "22",
      "ext": "mp4",
      "quality": "720p",
      "filesize": 15728640,
      "url": "https://download-url.com"
    }
  ]
}
```

### `GET /health`
Health check endpoint.

### `GET /`
Basic API status.

## Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   python start.py
   ```

3. **Access the API:**
   - API: `http://localhost:8000`
   - Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

## Deployment

### Render
1. Connect your repository to Render
2. Use the provided `render.yaml` configuration
3. Deploy as a Web Service

### Replit
1. Import the project to Replit
2. Run `pip install -r requirements.txt`
3. Start with `python main.py`

### Docker
```bash
docker build -t video-downloader-api .
docker run -p 8000:8000 video-downloader-api
```

## Environment Variables

- `PORT`: Server port (default: 8000)

## Requirements

- Python 3.11+
- yt-dlp
- FastAPI
- ffmpeg (for some video processing)
