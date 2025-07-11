
#!/usr/bin/env python3
"""
Simple test script for the Video Downloader API
"""
import requests
import json

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_video_info():
    """Test the video info endpoint with a sample URL"""
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    try:
        response = requests.post(
            "http://localhost:8000/api/download",
            json={"url": test_url},
            timeout=30
        )
        
        print(f"Video Info: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Title: {data['title']}")
            print(f"Duration: {data['duration']}")
            print(f"Uploader: {data['uploader']}")
            print(f"Formats available: {len(data['formats'])}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"Video info test failed: {e}")
        return False

def main():
    print("🧪 Testing Video Downloader API...")
    
    # Test health check
    print("\n1. Testing health check...")
    health_ok = test_health_check()
    
    if not health_ok:
        print("❌ Health check failed - make sure the server is running")
        return
    
    # Test video info
    print("\n2. Testing video info extraction...")
    video_ok = test_video_info()
    
    if video_ok:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Video info test failed")

if __name__ == "__main__":
    main()
