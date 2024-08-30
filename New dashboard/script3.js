// document.addEventListener('DOMContentLoaded', function() {
//     const videos = document.querySelectorAll('.vdo1');
//     const totalProgressDisplay = document.getElementById('progress1');
//     const popupVideo = document.getElementById('popupVideo');
//     let watchedSegments = {};
//     let intervals = {};
//     let videosDuration = {};
//     let videosLoaded = 0;
//     const totalVideos = videos.length;
//     let currentlyPlayingVideo = null;

//     console.log(`Total videos found: ${totalVideos}`);

//     // Load progress from localStorage if available
//     // let savedProgress = JSON.parse(localStorage.getItem('videoProgress'));
//     // watchedSegments = savedProgress || {};

//     // Initialize progress display
//     updateProgressDisplay(0);

//     function attachVideoListeners(video, index) {
//         video.addEventListener('loadedmetadata', () => {
//             videosDuration[index] = video.duration;
//             videosLoaded++;
//             console.log(`Video ${index} loaded. Duration: ${video.duration}`);
//             if (videosLoaded === totalVideos) {
//                 console.log('All videos loaded. Calculating initial progress...');
//                 calculateTotalProgress();
//             }
//         });

//         video.addEventListener('play', () => {
//             if (currentlyPlayingVideo !== null && currentlyPlayingVideo !== video) {
//                 stopTracking(currentlyPlayingVideo);
//             }
//             currentlyPlayingVideo = video;
//             startTracking(video, index);
//         });

//         video.addEventListener('pause', () => stopTracking(video, index));
//         video.addEventListener('ended', () => {
//             console.log(`Video ${index} ended`);
//             markVideoAsComplete(index);
//             currentlyPlayingVideo = null;
//         });

//         video.addEventListener('seeked', () => {
//             console.log(`Video ${index} seeked to ${video.currentTime}`);
//             trackWatchedSegment(video, index);
//         });

//         // Initialize watched segments for this video if not exist
//         if (!watchedSegments[index]) {
//             watchedSegments[index] = [];
//         }
//     }

//     videos.forEach((video, index) => {
//         attachVideoListeners(video, index);
//     });

//     // Attach listeners to popup video
//     attachVideoListeners(popupVideo, 0);

//     function startTracking(video, index) {
//         if (!intervals[index]) {
//             intervals[index] = setInterval(() => trackWatchedSegment(video, index), 1000);
//         }
//     }

//     function stopTracking(video, index) {
//         if (intervals[index]) {
//             clearInterval(intervals[index]);
//             delete intervals[index];
//             trackWatchedSegment(video, index);
//         }
//     }

//     function trackWatchedSegment(video, index) {
//         const currentTime = video.currentTime;
//         const segments = watchedSegments[index];
//         const lastSegment = segments.length > 0 ? segments[segments.length - 1] : null;

//         if (lastSegment && Math.abs(lastSegment.end - currentTime) < 1) {
//             lastSegment.end = currentTime;
//         } else {
//             segments.push({ start: currentTime, end: currentTime });
//         }

//         // Merge overlapping segments
//         watchedSegments[index] = mergeSegments(segments);

//         localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
//         calculateTotalProgress();
//     }

//     function markVideoAsComplete(index) {
//         watchedSegments[index] = [{ start: 0, end: videosDuration[index] }];
//         localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
//         calculateTotalProgress();
//     }

//     function mergeSegments(segments) {
//         if (segments.length <= 1) return segments;
        
//         segments.sort((a, b) => a.start - b.start);
//         const merged = [segments[0]];

//         for (let i = 1; i < segments.length; i++) {
//             const current = segments[i];
//             const last = merged[merged.length - 1];

//             if (current.start <= last.end) {
//                 last.end = Math.max(last.end, current.end);
//             } else {
//                 merged.push(current);
//             }
//         }

//         return merged;
//     }

//     function calculateTotalProgress() {
//         let totalWatchedTime = 0;
//         let totalDuration = 0;

//         for (let index = 0; index < totalVideos; index++) {
//             const duration = videosDuration[index] || 0;
//             totalDuration += duration;

//             const segments = watchedSegments[index] || [];
//             const watchedTime = segments.reduce((sum, segment) => 
//                 sum + (segment.end - segment.start), 0);
//             totalWatchedTime += watchedTime;

//             console.log(`Video ${index}: Watched ${watchedTime.toFixed(2)}s out of ${duration.toFixed(2)}s`);
//         }

//         const totalProgress = totalDuration > 0 ? (totalWatchedTime / totalDuration) * 100 : 0;
//         console.log(`Total progress: ${totalProgress.toFixed(2)}%`);
//         updateProgressDisplay(totalProgress);
//     }

//     function updateProgressDisplay(progress) {
//         if (totalProgressDisplay) {
//             totalProgressDisplay.textContent = `${Math.round(progress)}% - progress`;
//         } else {
//             console.error("Progress display element not found!");
//         }
//     }

//     // Handle fullscreen changes
//     document.addEventListener('fullscreenchange', function() {
//         if (document.fullscreenElement) {
//             console.log('Entered fullscreen');
//             if (currentlyPlayingVideo) {
//                 stopTracking(currentlyPlayingVideo, 0);
//             }
//             startTracking(popupVideo, 0);
//             currentlyPlayingVideo = popupVideo;
//         } else {
//             console.log('Exited fullscreen');
//             stopTracking(popupVideo, 0);
//             startTracking(videos[0], 0);
//             currentlyPlayingVideo = videos[0];
//         }
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const videos = document.querySelectorAll('.video');
//     const overallProgressElement = document.getElementById('progress1');
//     let totalDuration = 0;
//     let totalProgress = 0;

//     videos.forEach((video, index) => {
//         const videoId = `video${index + 1}`;
//         const progressElement = document.getElementById(`${videoId}-progress`);

//         // Load progress from localStorage
//         const savedTime = localStorage.getItem(`${videoId}-time`);
//         if (savedTime) {
//             video.currentTime = parseFloat(savedTime);
//             const progress = (video.currentTime / video.duration) * 100;
//             progressElement.textContent = `${progress.toFixed(2)}%`;
//         }

//         video.addEventListener('loadedmetadata', function () {
//             totalDuration += video.duration;
//             updateOverallProgress();
//         });

//         video.addEventListener('timeupdate', function () {
//             const currentTime = video.currentTime;
//             const progress = (currentTime / video.duration) * 100;

//             // Save progress to localStorage
//             localStorage.setItem(`${videoId}-time`, currentTime);

//             // Update individual video progress
//             progressElement.textContent = `${progress.toFixed(2)}%`;

//             // Update overall progress
//             updateOverallProgress();
//         });

//         video.addEventListener('ended', function () {
//             updateOverallProgress();
//         });
//     });

//     function updateOverallProgress() {
//         totalProgress = 0;
//         videos.forEach(video => {
//             totalProgress += video.currentTime;
//         });
//         const overallProgress = (totalProgress / totalDuration) * 100;
//         overallProgressElement.textContent = `${overallProgress.toFixed(2)}%`;
//     }
// });





// document.addEventListener('DOMContentLoaded', function() {
//     const videos = document.querySelectorAll('.vdo1');
//     const totalProgressDisplay = document.getElementById('progress1');
//     const popupVideo = document.getElementById('popupVideo');
//     let watchedSegments = {};
//     let intervals = {};
//     let videosDuration = {};
//     let videosLoaded = 0;
//     const totalVideos = videos.length;
//     let currentlyPlayingVideo = null;
  
//     console.log(`Total videos found: ${totalVideos}`);
  
//     // Load progress from localStorage if available
//     // let savedProgress = JSON.parse(localStorage.getItem('videoProgress')) || {};
//     // watchedSegments = savedProgress;
  
//     // Initialize progress display
//     updateProgressDisplay(0);
  
//     function attachVideoListeners(video, index) {
//       video.addEventListener('loadedmetadata', () => {
//         videosDuration[index] = video.duration;
//         videosLoaded++;
//         console.log(`Video ${index} loaded. Duration: ${video.duration}`);
//         if (videosLoaded === totalVideos) {
//           console.log('All videos loaded. Calculating initial progress...');
//           calculateTotalProgress();
//         }
//       });
  
//       video.addEventListener('play', () => {
//         if (currentlyPlayingVideo !== null && currentlyPlayingVideo !== video) {
//           stopTracking(currentlyPlayingVideo);
//         }
//         currentlyPlayingVideo = video;
//         startTracking(video, index);
//       });
  
//       video.addEventListener('pause', () => stopTracking(video, index));
//       video.addEventListener('ended', () => {
//         console.log(`Video ${index} ended`);
//         markVideoAsComplete(index);
//         currentlyPlayingVideo = null;
//       });
  
//       video.addEventListener('seeked', () => {
//         console.log(`Video ${index} seeked to ${video.currentTime}`);
//         trackWatchedSegment(video, index);
//       });
  
//       // Initialize watched segments for this video if not exist
//       if (!watchedSegments[index]) {
//         watchedSegments[index] = [];
//       }
//     }
  
//     videos.forEach((video, index) => {
//       attachVideoListeners(video, index + 1);
//     });
  
//     // Attach listeners to popup video
//     attachVideoListeners(popupVideo, 'popup');
  
//     function startTracking(video, index) {
//       if (!intervals[index]) {
//         intervals[index] = setInterval(() => trackWatchedSegment(video, index), 1000);
//       }
//     }
  
//     function stopTracking(video, index) {
//       if (intervals[index]) {
//         clearInterval(intervals[index]);
//         delete intervals[index];
//         trackWatchedSegment(video, index);
//         console.log(`Stopped tracking video ${index}`);
//       }
//     }
  
//     function trackWatchedSegment(video, index) {
//       const currentTime = video.currentTime;
//       if (!watchedSegments[index]) {
//         watchedSegments[index] = [];
//       }
//       const segments = watchedSegments[index];
//       const lastSegment = segments.length > 0 ? segments[segments.length - 1] : null;
  
//       if (lastSegment && Math.abs(lastSegment.end - currentTime) < 1) {
//         lastSegment.end = currentTime;
//       } else {
//         segments.push({ start: currentTime, end: currentTime });
//       }
  
//       watchedSegments[index] = mergeSegments(segments);
//       calculateTotalProgress();
//     }
  
//     function markVideoAsComplete(index) {
//       watchedSegments[index] = [{ start: 0, end: videosDuration[index] }];
//       calculateTotalProgress();
//     }
  
//     function mergeSegments(segments) {
//       if (segments.length <= 1) return segments;
  
//       segments.sort((a, b) => a.start - b.start);
//       const merged = [segments[0]];
  
//       for (let i = 1; i < segments.length; i++) {
//         const current = segments[i];
//         const last = merged[merged.length - 1];
  
//         if (current.start <= last.end) {
//           last.end = Math.max(last.end, current.end);
//         } else {
//           merged.push(current);
//         }
//       }
  
//       return merged;
//     }
  
//     function calculateTotalProgress() {
//       let totalWatchedTime = 0;
//       let totalDuration = 0;
  
//       for (let index = 1; index <= totalVideos; index++) {
//         const duration = videosDuration[index] || 0;
//         totalDuration += duration;
  
//         const segments = watchedSegments[index] || [];
//         const watchedTime = segments.reduce((sum, segment) =>
//           sum + Math.min(segment.end, duration) - segment.start, 0);
//         totalWatchedTime += Math.min(watchedTime, duration);
  
//         console.log(`Video ${index}: Watched ${watchedTime.toFixed(2)}s out of ${duration.toFixed(2)}s`);
//       }
  
//       // Include popup video if it exists
//       if (watchedSegments['popup']) {
//         const popupDuration = videosDuration['popup'] || 0;
//         totalDuration += popupDuration;
//         const popupWatchedTime = watchedSegments['popup'].reduce((sum, segment) =>
//           sum + Math.min(segment.end, popupDuration) - segment.start, 0);
//         totalWatchedTime += Math.min(popupWatchedTime, popupDuration);
//         console.log(`Popup Video: Watched ${popupWatchedTime.toFixed(2)}s out of ${popupDuration.toFixed(2)}s`);
//       }
  
//       const totalProgress = totalDuration > 0 ? (totalWatchedTime / totalDuration) * 100 : 0;
//       console.log(`Total progress: ${totalProgress.toFixed(2)}%`);
//       updateProgressDisplay(totalProgress);
  
//       localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
//     }
  
//     function updateProgressDisplay(progress) {
//       if (totalProgressDisplay) {
//         totalProgressDisplay.textContent = `${Math.round(progress)}% - progress`;
//       } else {
//         console.error("Progress display element not found!");
//       }
//     }
  
//     // Handle fullscreen changes
//     document.addEventListener('fullscreenchange', function() {
//       if (document.fullscreenElement) {
//         console.log('Entered fullscreen');
//         if (currentlyPlayingVideo) {
//           stopTracking(currentlyPlayingVideo, Array.from(videos).indexOf(currentlyPlayingVideo) + 1);
//         }
//         startTracking(popupVideo, 'popup');
//         currentlyPlayingVideo = popupVideo;
//       } else {
//         console.log('Exited fullscreen');
//         stopTracking(popupVideo, 'popup');
//         // Resume tracking the original video if it exists
//         const originalVideoIndex = Array.from(videos).findIndex(v => v.src === popupVideo.src);
//         if (originalVideoIndex !== -1) {
//           startTracking(videos[originalVideoIndex], originalVideoIndex + 1);
//           currentlyPlayingVideo = videos[originalVideoIndex];
//         } else {
//           currentlyPlayingVideo = null;
//         }
//       }
//     });
  
//     // Handle popup close
//     const closePopup = document.querySelector(".close-popup");
//     if (closePopup) {
//       closePopup.addEventListener("click", function() {
//         stopTracking(popupVideo, 'popup');
//         currentlyPlayingVideo = null;
//       });
//     }
  
//     // Handle Esc key press
//     document.addEventListener("keydown", function(event) {
//       if (event.key === "Escape" && currentlyPlayingVideo === popupVideo) {
//         stopTracking(popupVideo, 'popup');
//         currentlyPlayingVideo = null;
//       }
//     });
//   });

document.addEventListener('DOMContentLoaded', function() {
  const videos = document.querySelectorAll('.vdo1');
  const totalProgressDisplay = document.getElementById('progress1');
  const popupVideo = document.getElementById('popupVideo');
  let watchedSegments = {};
  let intervals = {};
  let videosDuration = {};
  let videosLoaded = 0;
  const totalVideos = videos.length;
  let currentlyPlayingVideo = null;

  console.log(`Total videos found: ${totalVideos}`);

  // Load progress from localStorage if available
  let savedProgress = JSON.parse(localStorage.getItem('videoProgress')) || {};
  watchedSegments = savedProgress;

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

    video.addEventListener('play', () => {
      if (currentlyPlayingVideo !== null && currentlyPlayingVideo !== video) {
        stopTracking(currentlyPlayingVideo);
      }
      currentlyPlayingVideo = video;
      startTracking(video, index);
    });

    video.addEventListener('pause', () => stopTracking(video, index));
    video.addEventListener('ended', () => {
      console.log(`Video ${index} ended`);
      markVideoAsComplete(index);
      currentlyPlayingVideo = null;
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
    attachVideoListeners(video, index + 1);
  });

  // Attach listeners to popup video
  attachVideoListeners(popupVideo, 'popup');

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
      console.log(`Stopped tracking video ${index}`);
    }
  }

  function trackWatchedSegment(video, index) {
    const currentTime = video.currentTime;
    if (!watchedSegments[index]) {
      watchedSegments[index] = [];
    }
    const segments = watchedSegments[index];
    const lastSegment = segments.length > 0 ? segments[segments.length - 1] : null;

    if (lastSegment && Math.abs(lastSegment.end - currentTime) < 1) {
      lastSegment.end = currentTime;
    } else {
      segments.push({ start: currentTime, end: currentTime });
    }

    watchedSegments[index] = mergeSegments(segments);
    calculateTotalProgress();
  }

  function markVideoAsComplete(index) {
    watchedSegments[index] = [{ start: 0, end: videosDuration[index] }];
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

    for (let index = 1; index <= totalVideos; index++) {
      const duration = videosDuration[index] || 0;
      totalDuration += duration;

      const segments = watchedSegments[index] || [];
      const watchedTime = segments.reduce((sum, segment) =>
        sum + Math.min(segment.end, duration) - segment.start, 0);
      totalWatchedTime += Math.min(watchedTime, duration);

      console.log(`Video ${index}: Watched ${watchedTime.toFixed(2)}s out of ${duration.toFixed(2)}s`);
    }

    // Include popup video if it exists
    if (watchedSegments['popup'] && videosDuration['popup']) {
      const popupDuration = videosDuration['popup'];
      totalDuration += popupDuration;
      const popupWatchedTime = watchedSegments['popup'].reduce((sum, segment) =>
        sum + Math.min(segment.end, popupDuration) - segment.start, 0);
      totalWatchedTime += Math.min(popupWatchedTime, popupDuration);
      console.log(`Popup Video: Watched ${popupWatchedTime.toFixed(2)}s out of ${popupDuration.toFixed(2)}s`);
    }

    const totalProgress = totalDuration > 0 ? (totalWatchedTime / totalDuration) * 100 : 0;
    console.log(`Total progress: ${totalProgress.toFixed(2)}%`);
    updateProgressDisplay(totalProgress);

    localStorage.setItem('videoProgress', JSON.stringify(watchedSegments));
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
        if (currentlyPlayingVideo) {
          stopTracking(currentlyPlayingVideo, Array.from(videos).indexOf(currentlyPlayingVideo) + 1);
        }
        startTracking(popupVideo, 'popup');
        currentlyPlayingVideo = popupVideo;
      } else {
        console.log('Exited fullscreen');
        stopTracking(popupVideo, 'popup');
        // Resume tracking the original video if it exists
        const originalVideoIndex = Array.from(videos).findIndex(v => v.src === popupVideo.src);
        if (originalVideoIndex !== -1) {
          startTracking(videos[originalVideoIndex], originalVideoIndex + 1);
          currentlyPlayingVideo = videos[originalVideoIndex];
        } else {
          currentlyPlayingVideo = null;
        }
      }
    });
  
    // Handle popup close
    const closePopup = document.querySelector(".close-popup");
    if (closePopup) {
      closePopup.addEventListener("click", function() {
        stopTracking(popupVideo, 'popup');
        currentlyPlayingVideo = null;
      });
    }
  
    // Handle Esc key press
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && currentlyPlayingVideo === popupVideo) {
        stopTracking(popupVideo, 'popup');
        currentlyPlayingVideo = null;
      }
    });
  });