import asyncio
import websockets
import json
import requests
import os
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sign_language import get_video_path

# NLTK setup
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")

#Flask API Url 
FLASK_API_URL = "http://127.0.0.1:5000/download_audio"


def preprocess_text(text):
    """Preprocesses text: lowercase, remove punctuation, tokenize, remove stopwords, lemmatize."""
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)  # Remove punctuation
    words = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    lemmatizer = WordNetLemmatizer()
    
    return [lemmatizer.lemmatize(word) for word in words if word not in stop_words]

def get_latest_transcription():
    """Fetches the latest transcription from backend.py"""
    try:
        response = requests.post(FLASK_API_URL, json={"url": "latest"})  # Send a POST request
        
        if response.status_code == 200:
            data = response.json()
            transcription = data.get("transcription")
            if transcription:
                print(f"📝 Latest Transcription: {transcription}")
                return transcription
            else:
                print("⚠️ No transcription found in API response.")
                return None
        else:
            print(f"❌ Error fetching transcription. Status: {response.status_code}")
            return None
    except Exception as e:
        print(f"🚨 API Request Failed: {e}")
        return None
async def handler(websocket):
    """WebSocket server handler"""
    json_file_path = "video_paths.json"

    while True:
        transcription_text = get_latest_transcription()

        if transcription_text:
            # Preprocess text
            words = preprocess_text(transcription_text)
            print(f"📝 Processed Words: {words}")

            # Get sign language videos
            mapped_videos = {word: get_video_path(word) for word in words}
            video_list = list(filter(None, mapped_videos.values()))

            # Save to JSON file
            with open(json_file_path, "w", encoding="utf-8") as json_file:
                json.dump(mapped_videos, json_file, indent=4)
            print(f"✅ Updated JSON file: {json_file_path}")

            # Send video paths to Chrome Extension
            if video_list:
                message = json.dumps({"type": "VIDEO_PATHS", "videos": video_list})
                await websocket.send(message)
                print(f"📤 Sent to Chrome Extension: {message}")

        await asyncio.sleep(5)  # Check every 5 seconds for updates

# Run WebSocket server
async def start_server():
    async with websockets.serve(handler, "localhost", 9999):
        print("🟢 WebSocket Server Running on ws://localhost:9999")
        await asyncio.Future()  # Keep server running

if __name__ == "__main__":
    asyncio.run(start_server())
