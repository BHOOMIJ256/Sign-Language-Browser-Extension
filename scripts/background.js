console.log("🔄 Background script is running!");

// Store video paths for when the popup opens
let videoQueue = [];

// Establish WebSocket connection
function connectWebSocket() {
    let socket = new WebSocket("ws://localhost:9999");

    socket.onopen = function () {
        console.log("🔗 Connected to Python WebSocket Server!");
    };

    socket.onmessage = function (event) {
        console.log("📩 Video paths received:", event.data);

        let parsedData;
        try {
            parsedData = JSON.parse(event.data);
        } catch (error) {
            console.error("❌ JSON Parsing Error:", error);
            return;
        }

        if (!parsedData.videos || !Array.isArray(parsedData.videos)) {
            console.error("🚨 Invalid video data format:", parsedData);
            return;
        }

        // Store the latest video paths
       // Store the latest video paths with correct directory path
    videoQueue = parsedData.videos
        .filter(video => video && video !== "Video not found")
        .map(video => video.replace(/^Videos\//, "scripts/Videos/"));


        console.log("✅ Stored videos:", videoQueue);
    };

    socket.onerror = function (error) {
        console.error("❌ WebSocket Error:", error);
    };

    socket.onclose = function () {
        console.warn("⚠ WebSocket connection closed. Reconnecting in 5 seconds...");
        setTimeout(connectWebSocket, 5000);
    };
}

// Start WebSocket connection
connectWebSocket();

// Listen for popup open event
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Message received in background:", message);

    if (message.type === "POPUP_OPENED") {
        if (videoQueue.length > 0) {
            chrome.runtime.sendMessage({
                type: "VIDEO_PATHS",
                videos: videoQueue
            });
        } else {
            console.warn("⚠ No videos stored to send.");
        }
    }
});
