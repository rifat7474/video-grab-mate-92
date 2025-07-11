
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import subprocess
import json
import os
import logging
from typing import List, Optional, Dict, Any
import tempfile
import shutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Video Downloader API",
    description="API for downloading video information using yt-dlp",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

class VideoFormat(BaseModel):
    format_id: str
    ext: str
    quality: str
    filesize: Optional[int] = None
    url: str

class VideoInfo(BaseModel):
    title: str
    thumbnail: str
    duration: str
    uploader: str
    formats: List[VideoFormat]

def check_ytdlp_installed():
    """Check if yt-dlp is installed and accessible"""
    try:
        result = subprocess.run(
            ["yt-dlp", "--version"],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def format_duration(seconds):
    """Convert seconds to MM:SS or HH:MM:SS format"""
    if not seconds:
        return "Unknown"
    
    try:
        total_seconds = int(float(seconds))
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        
        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes:02d}:{seconds:02d}"
    except (ValueError, TypeError):
        return "Unknown"

def format_filesize(size_bytes):
    """Format file size in bytes to human readable format"""
    if not size_bytes:
        return None
    
    try:
        size = int(size_bytes)
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    except (ValueError, TypeError):
        return None

def get_video_info(url: str) -> Dict[str, Any]:
    """Extract video information using yt-dlp"""
    try:
        # Create a temporary directory for yt-dlp cache
        with tempfile.TemporaryDirectory() as temp_dir:
            cmd = [
                "yt-dlp",
                "--dump-json",
                "--no-download",
                "--no-playlist",
                "--cache-dir", temp_dir,
                url
            ]
            
            logger.info(f"Running yt-dlp command: {' '.join(cmd)}")
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                error_msg = result.stderr.strip() if result.stderr else "Unknown error"
                logger.error(f"yt-dlp error: {error_msg}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to fetch video information: {error_msg}"
                )
            
            # Parse the JSON output
            video_data = json.loads(result.stdout)
            
            # Extract formats
            formats = []
            raw_formats = video_data.get('formats', [])
            
            # Filter and process formats
            for fmt in raw_formats:
                if not fmt.get('url'):
                    continue
                
                # Determine quality description
                quality = "Unknown"
                if fmt.get('height'):
                    quality = f"{fmt['height']}p"
                elif fmt.get('abr'):
                    quality = f"{fmt['abr']}kbps"
                elif fmt.get('format_note'):
                    quality = fmt['format_note']
                
                formats.append(VideoFormat(
                    format_id=fmt.get('format_id', ''),
                    ext=fmt.get('ext', 'mp4'),
                    quality=quality,
                    filesize=fmt.get('filesize'),
                    url=fmt['url']
                ))
            
            # Sort formats by quality (video formats first, then audio)
            video_formats = [f for f in formats if f.quality.endswith('p')]
            audio_formats = [f for f in formats if 'kbps' in f.quality]
            other_formats = [f for f in formats if f not in video_formats and f not in audio_formats]
            
            # Sort video formats by resolution (highest first)
            video_formats.sort(
                key=lambda x: int(x.quality.replace('p', '')) if x.quality.replace('p', '').isdigit() else 0,
                reverse=True
            )
            
            # Sort audio formats by bitrate (highest first)
            audio_formats.sort(
                key=lambda x: int(x.quality.replace('kbps', '')) if x.quality.replace('kbps', '').isdigit() else 0,
                reverse=True
            )
            
            # Combine formats: video first, then audio, then others, but limit to reasonable number
            all_formats = (video_formats[:5] + audio_formats[:3] + other_formats[:2])
            
            return VideoInfo(
                title=video_data.get('title', 'Unknown Title'),
                thumbnail=video_data.get('thumbnail', ''),
                duration=format_duration(video_data.get('duration')),
                uploader=video_data.get('uploader', 'Unknown'),
                formats=all_formats
            )
            
    except subprocess.TimeoutExpired:
        logger.error("yt-dlp command timed out")
        raise HTTPException(
            status_code=408,
            detail="Request timed out while fetching video information"
        )
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse yt-dlp JSON output: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to parse video information"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Video Downloader API is running",
        "status": "healthy",
        "ytdlp_available": check_ytdlp_installed()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    ytdlp_available = check_ytdlp_installed()
    
    return {
        "status": "healthy" if ytdlp_available else "degraded",
        "ytdlp_available": ytdlp_available,
        "message": "All systems operational" if ytdlp_available else "yt-dlp not available"
    }

@app.post("/api/download", response_model=VideoInfo)
async def download_video_info(request: VideoRequest):
    """
    Extract video information from URL
    
    This endpoint accepts a video URL and returns detailed information
    about the video including available download formats.
    """
    url = request.url.strip()
    
    if not url:
        raise HTTPException(
            status_code=400,
            detail="URL is required"
        )
    
    # Basic URL validation
    if not any(url.startswith(protocol) for protocol in ['http://', 'https://']):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. URL must start with http:// or https://"
        )
    
    # Check if yt-dlp is available
    if not check_ytdlp_installed():
        raise HTTPException(
            status_code=503,
            detail="yt-dlp is not installed or not accessible"
        )
    
    logger.info(f"Processing video URL: {url}")
    
    try:
        video_info = get_video_info(url)
        logger.info(f"Successfully processed video: {video_info.title}")
        return video_info
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing URL {url}: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the video"
        )

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
