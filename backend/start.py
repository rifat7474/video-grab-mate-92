
#!/usr/bin/env python3
"""
Startup script for the Video Downloader API
"""
import os
import sys
import subprocess

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import yt_dlp
        print("✅ All Python dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_ytdlp():
    """Check if yt-dlp command is available"""
    try:
        result = subprocess.run(
            ["yt-dlp", "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"✅ yt-dlp is available: {result.stdout.strip()}")
            return True
        else:
            print("❌ yt-dlp command failed")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("❌ yt-dlp not found in PATH")
        print("Please install yt-dlp: pip install yt-dlp")
        return False

def main():
    print("🚀 Starting Video Downloader API...")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    if not check_ytdlp():
        print("⚠️  yt-dlp not available - API will return errors for video requests")
    
    # Get port from environment or use default
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🌐 Server will start on http://localhost:{port}")
    print("📚 API documentation available at http://localhost:{port}/docs")
    print("🔍 Health check available at http://localhost:{port}/health")
    
    # Start the server
    os.system(f"uvicorn main:app --host 0.0.0.0 --port {port} --reload")

if __name__ == "__main__":
    main()
