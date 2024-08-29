// document.addEventListener('DOMContentLoaded', function() {
//     const videos = document.querySelectorAll('.vdo1');
//     const totalProgressDisplay = document.getElementById('progress1');
//     let watchedSegments = [];

//     // Load progress from localStorage if available
//     let savedProgress = JSON.parse(localStorage.getItem('videoProgress'));
//     if (savedProgress) {
//         watchedSegments = savedProgress;
//     } else {
//         watchedSegments = Array.from({ length: videos.length }, () => []);
//     }

//     videos.forEach((video, index) => {
//         video.addEventListener('loadedmetadata', () => {
//             // Recalculate total progress after video duration is available
//             calculateTotalProgress();
//         });

//         video.addEventListener('play', () => {
//             startTracking(video, index);
//         });

//         video.addEventListener('pause', () => {
//             stopTracking(video, index);
//         });

//         video.addEventListener('ended', () => {
//             stopTracking(video, index);
//         });

//         // If progress exists, update the display
//         if (watchedSegments[index].length > 0) {
//             calculateTotalProgress(); // Update total progress when the page loads
//         }
//     });

//     let intervals = [];

//     function startTracking(video, index) {
//         intervals[index] = setInterval(() => {
//             trackWatchedSegment(video, index);
//         }, 1000);
//     }

//     function stopTracking(video, index) {
//         clearInterval(intervals[index]);
//         trackWatchedSegment(video, index);
//         calculateTotalProgress(); // Update total progress after each pause or end
//     }

//     function trackWatchedSegment(video, index) {
//         if (!video.paused && !video.ended) {
//             const currentTime = video.currentTime;
//             const lastSegment = watchedSegments[index][watchedSegments[index].length - 1];

//             if (lastSegment && lastSegment.end === currentTime) {
//                 lastSegment.end = currentTime + 1;
//             } else {
//                 watchedSegments[index].push({ start: currentTime, end: currentTime + 1 });
//             }

//             // Save the watched segments to localStorage
//             localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
//         }
//     }

//     function calculateTotalProgress() {
//         let totalWatchedTime = 0;
//         let totalDuration = 0;

//         videos.forEach((video, index) => {
//             let watchedTime = 0;
//             watchedSegments[index].forEach(segment => {
//                 watchedTime += segment.end - segment.start;
//             });
//             totalWatchedTime += watchedTime;
//             totalDuration += video.duration || 0; // Ensure video.duration is valid
//         });

//         const totalProgress = totalDuration ? (totalWatchedTime / totalDuration) * 100 : 0;
//         totalProgressDisplay.textContent = `${Math.floor(totalProgress)}% - progress`;
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.vdo1');
    const totalProgressDisplay = document.getElementById('progress1');
    const popupVideo = document.getElementById('popupVideo');
    let watchedSegments = {};
    let intervals = {};
    let videosDuration = {};
    let videosLoaded = 0;
    const totalVideos = videos.length;

    console.log(`Total videos found: ${totalVideos}`);

    // Load progress from localStorage if available
    let savedProgress = JSON.parse(localStorage.getItem('videoProgress'));
    watchedSegments = savedProgress || {};

    // Initialize progress display
    updateProgressDisplay(0);

    function attachVideoListeners(video, index) {
        video.addEventListener('loadedmetadata', () => {
            videosDuration[index] = video.duration;
            videosLoaded++;
            console.log(`Video ${index} loaded. Duration: ${video.duration}`);
            if (videosLoaded === totalVideos) {
                console.log('All videos loaded. Calculating initial progress...');
                calculateTotalProgress();
            }
        });

        video.addEventListener('play', () => startTracking(video, index));
        video.addEventListener('pause', () => stopTracking(video, index));
        video.addEventListener('ended', () => {
            console.log(`Video ${index} ended`);
            markVideoAsComplete(index);
        });

        video.addEventListener('seeked', () => {
            console.log(`Video ${index} seeked to ${video.currentTime}`);
            trackWatchedSegment(video, index);
        });

        // Initialize watched segments for this video if not exist
        if (!watchedSegments[index]) {
            watchedSegments[index] = [];
        }
    }

    videos.forEach((video, index) => {
        attachVideoListeners(video, index);
    });

    // Attach listeners to popup video
    attachVideoListeners(popupVideo, 0);

    function startTracking(video, index) {
        if (!intervals[index]) {
            intervals[index] = setInterval(() => trackWatchedSegment(video, index), 1000);
        }
    }

    function stopTracking(video, index) {
        if (intervals[index]) {
            clearInterval(intervals[index]);
            delete intervals[index];
            trackWatchedSegment(video, index);
        }
    }

    function trackWatchedSegment(video, index) {
        const currentTime = video.currentTime;
        const segments = watchedSegments[index];
        const lastSegment = segments.length > 0 ? segments[segments.length - 1] : null;

        if (lastSegment && Math.abs(lastSegment.end - currentTime) < 1) {
            lastSegment.end = currentTime;
        } else {
            segments.push({ start: currentTime, end: currentTime });
        }

        // Merge overlapping segments
        watchedSegments[index] = mergeSegments(segments);

        localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
        calculateTotalProgress();
    }

    function markVideoAsComplete(index) {
        watchedSegments[index] = [{ start: 0, end: videosDuration[index] }];
        localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
        calculateTotalProgress();
    }

    function mergeSegments(segments) {
        if (segments.length <= 1) return segments;
        
        segments.sort((a, b) => a.start - b.start);
        const merged = [segments[0]];

        for (let i = 1; i < segments.length; i++) {
            const current = segments[i];
            const last = merged[merged.length - 1];

            if (current.start <= last.end) {
                last.end = Math.max(last.end, current.end);
            } else {
                merged.push(current);
            }
        }

        return merged;
    }

    function calculateTotalProgress() {
        let totalWatchedTime = 0;
        let totalDuration = 0;

        for (let index = 0; index < totalVideos; index++) {
            const duration = videosDuration[index] || 0;
            totalDuration += duration;

            const segments = watchedSegments[index] || [];
            const watchedTime = segments.reduce((sum, segment) => 
                sum + Math.min(segment.end, duration) - Math.min(segment.start, duration), 0);
            totalWatchedTime += watchedTime;

            console.log(`Video ${index}: Watched ${watchedTime.toFixed(2)}s out of ${duration.toFixed(2)}s`);
        }

        const totalProgress = totalDuration > 0 ? (totalWatchedTime / totalDuration) * 100 : 0;
        console.log(`Total progress: ${totalProgress.toFixed(2)}%`);
        updateProgressDisplay(totalProgress);
    }

    function updateProgressDisplay(progress) {
        if (totalProgressDisplay) {
            totalProgressDisplay.textContent = `${Math.round(progress)}% - progress`;
        } else {
            console.error("Progress display element not found!");
        }
    }

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            console.log('Entered fullscreen');
            // The video in fullscreen is now the popupVideo
            stopTracking(videos[0], 0);
            startTracking(popupVideo, 0);
        } else {
            console.log('Exited fullscreen');
            // Back to the original video
            stopTracking(popupVideo, 0);
            startTracking(videos[0], 0);
        }
    });
});