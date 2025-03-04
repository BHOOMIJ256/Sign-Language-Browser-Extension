from flask import Flask, request, jsonify 
import subprocess
import os
import glob
from flask_cors import CORS
import assemblyai as aai 

app = Flask(__name__)
CORS(app)

# Directory to save audio files
SAVE_DIR = "downloads"
os.makedirs(SAVE_DIR, exist_ok=True)

#AssemblyAI API Key

aai.settings.api_key = "751c2f5c797241a2b3d36a476191723f"

@app.route("/download_audio", methods=["POST"])
def download_audio():
    try:
        data = request.get_json()
        video_url = data.get("url")

        if video_url == "latest":
            downloaded_files = glob.glob(os.path.join(SAVE_DIR, "*.mp3"))
            if not downloaded_files:
                return jsonify({"error": "No transcribed files found."}), 404

            latest_file = max(downloaded_files, key=os.path.getctime)
            transcription = transcribe_audio(latest_file)

            return jsonify({
                "message": "Latest transcription fetched successfully",
                "transcription": transcription
            })
        
        if not video_url:
            return jsonify({"error": "No video URL provided"}), 400

        print(f"🔹 Downloading audio from: {video_url}")

        # Unique output file pattern
        output_pattern = os.path.join(SAVE_DIR, "%(title)s.%(ext)s")

        # Run yt-dlp
        command = [
            "python", "-m", "yt_dlp", 
            "-x", "--audio-format", "mp3",
            "-o", output_pattern,
            video_url
        ]
        
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            return jsonify({"error": result.stderr}), 500

        # Get the actual downloaded file name
        downloaded_files = glob.glob(os.path.join(SAVE_DIR, "*.mp3"))
        if not downloaded_files:
            return jsonify({"error": "No MP3 file found after download."}), 500
        
        latest_file = max(downloaded_files, key=os.path.getctime)  # Get the most recent file

        print(f"✅ Download complete: {latest_file}")
    
        #Start the transcription  process
        transcription = transcribe_audio(latest_file)

        return jsonify({
            "message": "Download & transcription successful",
            "audio_file": latest_file,
            "transcription": transcription
        })

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500
    

def transcribe_audio(file_path):
    """ Transcribes the given audio file using AssemblyAI """
    try:
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(file_path)
        print(f"📝 Transcription Complete: {transcript.text}")
        return transcript.text
    except Exception as e:
        print("🚨 Transcription Error:", str(e))
        return None


if __name__ == "__main__":
    app.run(debug=True)
