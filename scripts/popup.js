// Add drag functionality at the start of your file
document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.getElementById('popup-container');
    const dragHandle = document.getElementById('drag-handle');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Make the popup float above other content
    popupContainer.style.position = 'fixed';
    popupContainer.style.zIndex = '10000';

    // Set initial position
    if (!popupContainer.style.left) {
        popupContainer.style.left = '20px';
        popupContainer.style.top = '20px';
    }

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === dragHandle) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            // Keep the popup within viewport bounds
            const maxX = window.innerWidth - popupContainer.offsetWidth;
            const maxY = window.innerHeight - popupContainer.offsetHeight;
            
            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            setTranslate(currentX, currentY, popupContainer);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.left = xPos + "px";
        el.style.top = yPos + "px";
    }

    // Add touch support
    dragHandle.addEventListener("touchstart", dragStart, false);
    dragHandle.addEventListener("touchend", dragEnd, false);
    dragHandle.addEventListener("touchmove", drag, false);

    // Add mouse support
    dragHandle.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mousemove", drag, false);
    document.addEventListener("mouseup", dragEnd, false);
});

// ... rest of your existing code ...

let videoQueue = [];
let videoElement = document.getElementById("sign-video");

// Ensure video element exists
if (!videoElement) {
    console.error("⚠ Video element not found! Check popup.html");
}

// Notify background that popup is open
chrome.runtime.sendMessage({ type: "POPUP_OPENED" });

// Function to play the next video in the queue
function playNextVideo() {
    if (!videoElement) {
        console.error("⚠ Video element not found!");
        return;
    }

    if (videoQueue.length > 0) {
        let nextVideo = videoQueue.shift();
        console.log("▶️ Playing next video:", nextVideo);

        let videoPath = chrome.runtime.getURL(nextVideo);
        console.log("🛠 Video full path:", videoPath);

        videoElement.src = videoPath;
        videoElement.load();

        videoElement.oncanplaythrough = () => {
            videoElement.play().catch(error => console.error("🚨 Video play error:", error));
        };
    } else {
        console.log("📭 No more videos in queue.");
    }
}


// Listen for video paths from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Received message in popup.js:", message);

    if (message.type === "VIDEO_PATHS") {
        console.log("📩 Received Video Paths:", message.videos);

        let validVideos = message.videos
            .filter(video => video && video !== "Video not found")
            .map(video => video.replace(/scripts\/Videos\/Videos\//, "scripts/Videos/")) // ✅ Remove extra "Videos/"




        console.log("🎥 Final video paths for playback:", validVideos);


        if (validVideos.length > 0) {
            videoQueue.push(...validVideos);

            // Start playing if no video is currently playing
            if (videoElement.paused || videoElement.ended || videoElement.readyState < 3) {
                playNextVideo();
            }
        } else {
            console.warn("⚠ No valid videos received.");
        }
    }
});

// Play next video when the current one ends
if (videoElement) {
    videoElement.addEventListener("ended", playNextVideo);
}
