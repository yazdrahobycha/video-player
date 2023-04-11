// Video Element
const video = document.querySelector('.video');
video.volume = 0.7;

// Loader
const loaderOverlay = document.querySelector('.loading-overlay');

/// Buttons
const playBtn = document.getElementById('play-btn');
const volumeBtn = document.getElementById('volume-icon');

// Volume Bar
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');

// Select Element
const selectEl = document.querySelector('.player-speed');

// Progress Bar and Time elements
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.time-elapsed');
const durationEl = document.querySelector('.time-duration');

// fullscreen and player elements
const player = document.querySelector('.player');
const fullscreenBtn = document.querySelector('.fa-expand');

// Global Variables
let lastVolume = 1;
let isFullscreen = false;

// Play & Pause ----------------------------------- //
const togglePlay = () => {
    if (video.paused) {
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
    } else {
        video.pause();
        playBtn.classList.replace('fa-pause', 'fa-play');
        playBtn.setAttribute('title', 'Play');
    }
};

// Progress Bar ---------------------------------- //
function getTimeString(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    let placeholder = ':';
    if (seconds < 10) {
        placeholder = ':0';
    }
    return minutes + placeholder + seconds;
}

function updateProgress() {
    const { duration, currentTime } = video;
    progressBar.style.width = `${(currentTime / duration) * 100}%`;
    currentTimeEl.textContent = getTimeString(currentTime) + ' /';
    durationEl.textContent = getTimeString(duration);
}

function selectProgressTime(e) {
    const clickX = e.offsetX;
    const width = this.clientWidth;
    video.currentTime = Math.floor((clickX / width) * video.duration);
}

// Volume Controls --------------------------- //
function changeVolumeDisplay(level) {
    volumeBtn.className = '';
    volumeBar.style.width = `${level * 100}%`;
    if (level >= 0.7) {
        volumeBtn.classList.add('fas', 'fa-volume-up');
    } else if (level < 0.7) {
        volumeBtn.classList.add('fas', 'fa-volume-down');
    } else if (level === 0) {
        volumeBtn.classList.add('fas', 'fa-volume-off');
    }
}

function changeVolume(e) {
    const clickX = e.offsetX;
    const width = this.clientWidth;
    let volumeLevel = clickX / width;
    if (volumeLevel < 0.1) {
        volumeLevel = 0;
    } else if (volumeLevel > 0.9) {
        volumeLevel = 1;
    }
    video.volume = volumeLevel;
    changeVolumeDisplay(volumeLevel);
}

const toggleMute = () => {
    if (video.volume) {
        volumeBtn.className = '';
        volumeBtn.setAttribute('title', 'Unmute');
        lastVolume = video.volume;
        video.volume = 0;
        volumeBtn.classList.add('fas', 'fa-volume-mute');
        volumeBar.style.width = '0%';
    } else {
        video.volume = lastVolume;
        volumeBtn.setAttribute('title', 'Mute');
        changeVolumeDisplay(lastVolume);
    }
};

// Fullscreen ------------------------------- //
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}

function toggleFullscreen() {
    if (!isFullscreen) {
        openFullscreen(player);
        video.classList.add('video-fullscreen');
    } else {
        closeFullscreen();
        video.classList.remove('video-fullscreen');
    }
    isFullscreen = !isFullscreen;
}

// Event Listeners

// For play/pause
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', togglePlay);
video.addEventListener('canplay', () => {
    loaderOverlay.classList.add('hidden');
});

// For Updating progress bar
video.addEventListener('timeupdate', updateProgress);
progressRange.addEventListener('click', selectProgressTime);

// For updating volume (bar and mute btn)
volumeBtn.addEventListener('click', toggleMute);
volumeRange.addEventListener('click', changeVolume);

// for select speed rate
selectEl.addEventListener('change', (e) => {
    video.playbackRate = +e.target.value;
});

// for fullscreen btn
fullscreenBtn.addEventListener('click', toggleFullscreen);
