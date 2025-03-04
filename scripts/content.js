console.log("🎯 Content script is running!");

let lastSentURL = null; // Prevent duplicate messages

// Function to detect and send video URL
function detectAndSendVideoURL() {
    console.log("🔍 Checking for a video on the page...");

    const videoElement = document.querySelector("video");

    if (!videoElement) {
        console.warn("⚠️ No video element found.");
        return;
    }

    let videoURL = videoElement.src || window.location.href;

    if (!videoURL || videoURL === lastSentURL) {
        console.warn("⚠️ No new video URL detected or duplicate URL.");
        return;
    }

    lastSentURL = videoURL; // Update last sent URL
    console.log("🎥 Detected Video URL:", videoURL);

    // Send to backend
    sendToBackend(videoURL);
}

// Function to send video URL to backend (Flask server)
function sendToBackend(videoURL) {
    fetch("http://127.0.0.1:5000/download_audio", { // Update with your backend URL
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: videoURL })
    })
    .then(response => response.json())
    .then(data => console.log("✅ Backend Response:", data))
    .catch(error => console.error("🚨 Error sending to backend:", error));
}

// Run the function when the page loads
window.onload = () => {
    console.log("🌍 Page Loaded. Checking for videos...");
    detectAndSendVideoURL();
};

// Monitor for page changes (for SPAs like YouTube)
const observer = new MutationObserver(() => {
    setTimeout(() => { // Throttle updates
        console.log("🔄 Page changed, checking for new video...");
        detectAndSendVideoURL(); // Call correct function
    }, 1000); // Prevent excessive calls
});

observer.observe(document.body, { childList: true, subtree: true });




















// // Function to extract captions from YouTube
// function extractYouTubeCaptions() {
//     const captionElements = document.querySelectorAll(".ytp-caption-segment");
//     const captions = [];
//     captionElements.forEach(element => {
//         captions.push(element.textContent);
//     });
//     return captions.join(" "); // Combine all captions into a single string
// }

// // Function to monitor YouTube captions
// function monitorYouTubeCaptions() {
//     const captionContainer = document.querySelector(".ytp-caption-window-container");
//     if (captionContainer) {
//         const captionObserver = new MutationObserver(() => {
//             const captions = extractYouTubeCaptions();
//             if (captions) {
//                 console.log("📜 Captions updated:", captions);
//             }
//         });
//         captionObserver.observe(captionContainer, { childList: true, subtree: true });
//     }
// }

// // Function to transcribe audio
// async function transcribeAudio(video) {
//     try {
//         // Check if the browser supports captureStream and MediaRecorder
//         if (!video.captureStream || !MediaRecorder) {
//             console.error("Browser does not support audio recording.");
//             return null;
//         }

//         // Capture the audio stream from the video
//         const audioStream = video.captureStream();
//         console.log("Audio stream captured:", audioStream);

//         const audioBlob = await new Promise((resolve, reject) => {
//             const mediaRecorder = new MediaRecorder(audioStream);
//             const chunks = [];

//             mediaRecorder.ondataavailable = (e) => {
//                 console.log("Data available:", e.data);
//                 chunks.push(e.data);
//             };

//             mediaRecorder.onstop = () => {
//                 console.log("Recording stopped.");
//                 const blob = new Blob(chunks, { type: "audio/wav" });
//                 resolve(blob);
//             };

//             mediaRecorder.onerror = (e) => {
//                 console.error("Recording error:", e.error);
//                 reject(e.error);
//             };

//             mediaRecorder.start();
//             console.log("Recording started.");

//             setTimeout(() => {
//                 mediaRecorder.stop();
//                 console.log("Recording stopped after 5 seconds.");
//             }, 5000); // Record for 5 seconds
//         });

//         console.log("🎙️ Audio recorded:", audioBlob);

//         // Send the audio blob to a speech-to-text API
//         const transcription = await sendAudioToAPI(audioBlob);
//         return transcription;
//     } catch (error) {
//         console.error("Error transcribing audio:", error);
//         return null;
//     }
// }

// // Function to send audio to a speech-to-text API
// async function sendAudioToAPI(audioBlob) {
//     const formData = new FormData();
//     formData.append("file", audioBlob, "audio.wav");

//     try {
//         const response = await fetch("https://speech-to-text-api.com/transcribe", {
//             method: "POST",
//             body: formData,
//         });
//         const data = await response.json();
//         return data.transcription;
//     } catch (error) {
//         console.error("Error sending audio to API:", error);
//         return null;
//     }
// }

// // Function to handle video play event
// async function handleVideoPlay(video) {
//     console.log("🎥 Video is playing!");

//     // Check if this is YouTube
//     if (window.location.hostname.includes("youtube.com")) {
//         console.log("YouTube detected. Extracting captions...");
//         monitorYouTubeCaptions(); // Start monitoring YouTube captions
//     } else {
//         console.log("Non-YouTube video detected. Checking for captions...");

//         // Handle standard video captions
//         const tracks = video.textTracks;
//         console.log("Text Tracks:", tracks);

//         if (tracks && tracks.length > 0 && tracks[0].mode === "showing") {
//             console.log("Captions found and enabled.");

//             // Wait for captions to load
//             tracks[0].addEventListener("cuechange", () => {
//                 const captions = extractCaptions(video);
//                 if (captions) {
//                     console.log("📜 Captions extracted:", captions);
//                 } else {
//                     console.log("No captions found.");
//                 }
//             });
//         } else {
//             console.log("No captions found or captions are disabled. Transcribing audio...");

//             // Transcribe audio if no captions are found
//             const transcription = await transcribeAudio(video);
//             if (transcription) {
//                 console.log("🎙️ Transcription:", transcription);
//             } else {
//                 console.log("Failed to transcribe audio.");
//             }
//         }
//     }
// }

// // Function to extract captions from a video element
// function extractCaptions(video) {
//     const tracks = video.textTracks;
//     if (tracks && tracks.length > 0) {
//         const track = tracks[0]; // Use the first track
//         const captions = [];
//         for (let i = 0; i < track.cues.length; i++) {
//             captions.push(track.cues[i].text);
//         }
//         return captions.join(" "); // Combine all captions into a single string
//     }
//     return null; // No captions found
// }

// // Detect video elements and extract captions when they start playing
// document.addEventListener("DOMContentLoaded", () => {
//     const videos = document.querySelectorAll("video");
//     console.log(`Checking videos... Found ${videos.length} video(s).`);

//     videos.forEach(video => {
//         video.addEventListener("play", () => handleVideoPlay(video));
//     });
// });

// // Use MutationObserver to detect dynamically loaded videos
// const observer = new MutationObserver((mutationsList) => {
//     mutationsList.forEach(mutation => {
//         mutation.addedNodes.forEach(node => {
//             if (node.tagName === "VIDEO") {
//                 console.log("🎥 New video detected!");
//                 node.addEventListener("play", () => handleVideoPlay(node));
//             }
//         });
//     });
// });

// observer.observe(document.body, { childList: true, subtree: true });














































// console.log("🎯 Content script is running!");

// // Function to extract captions from YouTube
// function extractYouTubeCaptions() {
//     const captionElements = document.querySelectorAll(".ytp-caption-segment");
//     const captions = [];
//     captionElements.forEach(element => {
//         captions.push(element.textContent);
//     });
//     return captions.join(" "); // Combine all captions into a single string
// }

// // Function to monitor YouTube captions
// function monitorYouTubeCaptions() {
//     const captionContainer = document.querySelector(".ytp-caption-window-container");
//     if (captionContainer) {
//         const captionObserver = new MutationObserver(() => {
//             const captions = extractYouTubeCaptions();
//             if (captions) {
//                 console.log("📜 Captions updated:", captions);
//             }
//         });
//         captionObserver.observe(captionContainer, { childList: true, subtree: true });
//     }
// }

// // Function to transcribe audio
// async function transcribeAudio(video) {
//     try {
//         // Capture the audio stream from the video
//         const audioStream = video.captureStream();
//         const audioBlob = await new Promise((resolve) => {
//             const mediaRecorder = new MediaRecorder(audioStream);
//             const chunks = [];

//             mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
//             mediaRecorder.onstop = () => {
//                 const blob = new Blob(chunks, { type: "audio/wav" });
//                 resolve(blob);
//             };

//             mediaRecorder.start();
//             setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
//         });

//         console.log("🎙️ Audio recorded:", audioBlob);

//         // Send the audio blob to a speech-to-text API
//         const transcription = await sendAudioToAPI(audioBlob);
//         return transcription;
//     } catch (error) {
//         console.error("Error transcribing audio:", error);
//         return null;
//     }
// }

// // Function to send audio to a speech-to-text API
// async function sendAudioToAPI(audioBlob) {
//     const formData = new FormData();
//     formData.append("file", audioBlob, "audio.wav");

//     try {
//         const response = await fetch("https://speech-to-text-api.com/transcribe", {
//             method: "POST",
//             body: formData,
//         });
//         const data = await response.json();
//         return data.transcription;
//     } catch (error) {
//         console.error("Error sending audio to API:", error);
//         return null;
//     }
// }

// // Function to handle video play event
// async function handleVideoPlay(video) {
//     console.log("🎥 Video is playing!");

//     // Check if this is YouTube
//     if (window.location.hostname.includes("youtube.com")) {
//         console.log("YouTube detected. Extracting captions...");
//         monitorYouTubeCaptions(); // Start monitoring YouTube captions
//     } else {
//         // Handle standard video captions
//         const tracks = video.textTracks;
//         if (tracks && tracks.length > 0) {
//             const track = tracks[0];
//             track.mode = "showing"; // Enable captions

//             // Wait for captions to load
//             track.addEventListener("cuechange", () => {
//                 const captions = extractCaptions(video);
//                 if (captions) {
//                     console.log("📜 Captions extracted:", captions);
//                 } else {
//                     console.log("No captions found.");
//                 }
//             });
//         } else {
//             console.log("No captions track found. Transcribing audio...");

//             // Transcribe audio if no captions are found
//             const transcription = await transcribeAudio(video);
//             if (transcription) {
//                 console.log("🎙️ Transcription:", transcription);
//             } else {
//                 console.log("Failed to transcribe audio.");
//             }
//         }
//     }
// }

// // Detect video elements and extract captions when they start playing
// document.addEventListener("DOMContentLoaded", () => {
//     const videos = document.querySelectorAll("video");
//     console.log(`Checking videos... Found ${videos.length} video(s).`);

//     videos.forEach(video => {
//         video.addEventListener("play", () => handleVideoPlay(video));
//     });
// });

// // Use MutationObserver to detect dynamically loaded videos
// const observer = new MutationObserver((mutationsList) => {
//     mutationsList.forEach(mutation => {
//         mutation.addedNodes.forEach(node => {
//             if (node.tagName === "VIDEO") {
//                 console.log("🎥 New video detected!");
//                 node.addEventListener("play", () => handleVideoPlay(node));
//             }
//         });
//     });
// });

// observer.observe(document.body, { childList: true, subtree: true });





















































// console.log("🎯 Content script is running!");

// // Function to extract captions from YouTube
// function extractYouTubeCaptions() {
//     const captionElements = document.querySelectorAll(".ytp-caption-segment");
//     const captions = [];
//     captionElements.forEach(element => {
//         captions.push(element.textContent);
//     });
//     return captions.join(" "); // Combine all captions into a single string
// }

// // Function to handle video play event
// function handleVideoPlay(video) {
//     console.log("🎥 Video is playing!");

//     // Check if this is YouTube
//     if (window.location.hostname.includes("youtube.com")) {
//         console.log("YouTube detected. Extracting captions...");
//         const captions = extractYouTubeCaptions();
//         if (captions) {
//             console.log("📜 Captions extracted:", captions);
//         } else {
//             console.log("No captions found.");
//         }
//     } else {
//         // Handle standard video captions
//         const tracks = video.textTracks;
//         if (tracks && tracks.length > 0) {
//             const track = tracks[0];
//             track.mode = "showing"; // Enable captions

//             // Wait for captions to load
//             track.addEventListener("cuechange", () => {
//                 const captions = extractCaptions(video);
//                 if (captions) {
//                     console.log("📜 Captions extracted:", captions);
//                 } else {
//                     console.log("No captions found.");
//                 }
//             });
//         } else {
//             console.log("No captions track found.");
//         }
//     }
// }

// // Detect video elements and extract captions when they start playing
// document.addEventListener("DOMContentLoaded", () => {
//     const videos = document.querySelectorAll("video");
//     console.log(`Checking videos... Found ${videos.length} video(s).`);

//     videos.forEach(video => {
//         video.addEventListener("play", () => handleVideoPlay(video));
//     });
// });

// // Use MutationObserver to detect dynamically loaded videos
// const observer = new MutationObserver((mutationsList) => {
//     mutationsList.forEach(mutation => {
//         mutation.addedNodes.forEach(node => {
//             if (node.tagName === "VIDEO") {
//                 console.log("🎥 New video detected!");
//                 node.addEventListener("play", () => handleVideoPlay(node));
//             }
//         });
//     });
// });

// observer.observe(document.body, { childList: true, subtree: true });































































































































































// function addSignLanguageOverlay(videoElement) {
//   if (document.getElementById("sign-language-overlay")) {
//       return; // Prevent duplicate overlays
//   }

//   const overlay = document.createElement("div");
//   overlay.id = "sign-language-overlay";
//   overlay.style.position = "absolute";
//   overlay.style.bottom = "10px";
//   overlay.style.right = "10px";
//   overlay.style.width = "200px";
//   overlay.style.height = "150px";
//   overlay.style.backgroundColor = "black";
//   overlay.style.borderRadius = "10px";
//   overlay.style.zIndex = "9999";

//   overlay.innerHTML = `
//       <video id="sign-video" width="100%" height="100%" autoplay loop>
//           <source id="sign-source" src="" type="video/mp4">
//       </video>
//   `;

//   // Append overlay inside the video container
//   videoElement.parentElement.appendChild(overlay);

//   // Start processing audio for translation
//   extractAudioAndTranslate(videoElement);

// async function extractAudioAndTranslate(videoElement) {
//   try {
//       const response = await fetch("https://api.example.com/speech-to-text", {
//           method: "POST",
//           body: JSON.stringify({ videoUrl: videoElement.src }),
//           headers: { "Content-Type": "application/json" }
//       });

//       const data = await response.json();
//       console.log("Speech-to-text result:", data.transcript);

//       const translationResponse = await fetch("https://api.example.com/sign-language-avatar", {
//           method: "POST",
//           body: JSON.stringify({ text: data.transcript }),
//           headers: { "Content-Type": "application/json" }
//       });

//       const translationData = await translationResponse.json();
//       console.log("Sign language video:", translationData.videoUrl);

//       document.getElementById("sign-source").src = translationData.videoUrl;
//       document.getElementById("sign-video").load();
//   } catch (error) {
//       console.error("Error translating speech to sign language:", error);
//   }
// }
