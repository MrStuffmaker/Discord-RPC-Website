const API_URL = 'https://api.stuffmaker.top/v1';
const USERID = '213586333677912064';
const pfp = document.getElementById('pfp');
const status = document.getElementById('status');
const statusDot = document.getElementById('status-dot');
const status2 = document.getElementById('status2');
const activityStats = document.getElementById('activityInfo');
const username = document.getElementById('username');
const bigImage = document.getElementById('activity-big-image');
const smallImage = document.getElementById('activity-small-image');
const name = document.getElementById('activity-name');
const state = document.getElementById('activity-state');
const details = document.getElementById('activity-detail');
const start_time = document.getElementById('start-time');
const end_time = document.getElementById('end-time');
const progress_bar = document.getElementById('progress-bar');

var cache

async function fetchResponse(userId) {
    try {
        cache = await fetch(`${API_URL}/users/${userId}`).then(e => e.json());
        return true;
    } catch (err) {
        console.error(err);
    }
}
async function setAvatar() {
    const {
        data: {
            discord_user: {
                avatar
            }
        }
    } = cache;
    const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}`;
    pfp.src = fullUrl;
}
async function setAvatarFrame() {
    const {
        data: {
            discord_status
        }
    } = cache;
    switch (discord_status) {
    case 'online':
        statusDot.style.background =
            '#3ba45d';
        statusDot.title = 'Online';
        status2.innerHTML = 'Online';
        status2.style.cssText = 'color: #3ba45d; opacity: 1;';
        break;
    case 'dnd':
        statusDot.style.background =
            '#ed4245';
        statusDot.title = 'Do not disturb';
        status2.innerHTML = 'Busy <br>Please Do Not Disturb';
        status2.style.cssText = 'color: #ed4245; opacity: 1;';
        break;
    case 'idle':
        statusDot.style.background =
            '#faa81a';
        statusDot.title = 'Idle';
        status2.innerHTML = "Idle <br>Touching grass or smth...";
        status2.style.cssText = 'color: #faa81a; opacity: 1;';
        break;
    case 'offline':
        statusDot.style.background =
            '#747e8c';
        statusDot.title = 'Offline';
        status2.innerHTML = "Offline";
        status2.style.cssText = 'color: unset; opacity: 0.5;';
        break;
    }
}
async function setUsername() {
    const {
        data: {
            discord_user: {
                display_name: user
            },
            active_on_discord_web,
            active_on_discord_desktop,
            active_on_discord_mobile
        }
    } = cache;
    if (active_on_discord_web) {
        username.innerHTML = `${user} <i class="fas fa-globe" style="color: #0D8AE9; font-size: 23px"></i>`;
    }
    else if (active_on_discord_desktop) {
        username.innerHTML = `${user} <i class="fas fa-desktop" style="color: #4AF500; font-size: 20px;"></i>`;
    }
    else if (active_on_discord_mobile) {
        username.innerHTML = `${user} <i class="fas fa-mobile-alt" style="color: yellow; font-size: 23px;"></i>` ;
    } else {
        username.innerHTML = `${user}`;
    }
}

async function setStatus() {
    const {
        data: {
            discord_status,
            activities
        }
    } = cache;
    if (discord_status == 'offline')
        return;
    const {
        emoji: {
            name
        },
        state
    } = activities.find(m => m.type == 4);

    if (!state) {
        return;
    }
    status.innerHTML = `Status: ${name}"${state}"`;
}

// listening === true
async function setListeningMusic() {
    const {
        data: {
            activities,
            listening_to_spotify
        }
    } = cache;
    const mostRecent  = activities.filter(m => m.type !== 4).shift();
    if (listening_to_spotify === true) {
        activityStats.innerHTML = `Listening Music`
    } 
    else if (mostRecent?.name === "Twitch") {
        activityStats.innerHTML = `Streaming on Twitch`
    } 
    else if (mostRecent?.name === "Code") {
        activityStats.innerHTML = `Writing Code`;
    } 
    else if (mostRecent?.name === "TyniSpace" || mostRecent?.name === "VLC Media Player") {
        activityStats.innerHTML = `Watching ${mostRecent?.details}`;
    } 
    else {
        activityStats.innerHTML = ``
    }
}

async function setActivityBigImage() {
    const {
        data: {
            activities,
            spotify
        }
    } = cache;
    const mostRecent = activities.filter(m => m.type !== 4).shift();
    if (!mostRecent?.assets?.large_image) {
        bigImage.style.display = 'none';
        return;
    }
    if (mostRecent.assets.large_image.includes("spotify")) {
        bigImage.style.display = 'block';
        bigImage.src = spotify.album_art_url;
		bigImage.title =  spotify.album;

        return;
    }
    if (mostRecent.type === 1 && mostRecent.name === "Twitch") {
        bigImage.style.display = 'block';
        bigImage.src = `https://media.discordapp.net/attachments/832180255103385650/853870885097308160/MOSHED-2021-6-13-14-14-52.gif?ex=6589153b&is=6576a03b&hm=7c37c9cbe0b416440cd5391e91da5ef41b06c3cbe682101024173c4a66d19ea1&=&width=575&height=563`;
        bigImage.title = "Streaming on Twitch";
        return;
    }
    const imageLink = mostRecent.assets.large_image.includes("external") ? `https://media.discordapp.net/external/${mostRecent.assets.large_image.split("mp:external/")[1]}` :  `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.large_image}.png`;
    bigImage.style.display = 'block';
    bigImage.src = imageLink;
	bigImage.title = mostRecent.assets.large_text;
}
async function setActivitySmallImage() {
    const {
        data: {
            activities
        }
    } = cache;
    const mostRecent = activities.filter(m => m.type !== 4).shift();
    if (!mostRecent?.assets?.small_image || mostRecent.assets.large_image.includes("spotify")) {
        smallImage.style.display = 'none';
        return;
    }
    const imageLink = mostRecent.assets.small_image.includes("external") ? `https://media.discordapp.net/external/${mostRecent.assets.small_image.split("mp:external/")[1]}` : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.small_image}.png`;
    smallImage.style.display = 'block';
    smallImage.src = imageLink;
	smallImage.title = mostRecent.assets.small_text;
}
async function setActivityName() {
    const {
        data: {
            activities
        }
    } = cache;
    const mostRecent = activities.filter(m => m.type !== 4).shift();
    if (!mostRecent?.name) {
        name.innerHTML = 'Not doing anything rn...';
        return;
    }
    if (!mostRecent?.assets && mostRecent?.name) {
        name.style.display = 'block';
        name.innerHTML = `Playing ${mostRecent?.name}`;
        return;
    }
    name.style.display = 'block';
    name.innerHTML = mostRecent.name;
}
async function setActivityState() {
    const response = cache;
    const activities = response.data.activities.filter(m => m.type !== 4);
    if (!activities.length) {
        state.style.display = 'none';
        document.getElementById('spotify-activity').style.display = 'none';
        return;
    }
    const mostRecent = activities.shift();
    if (!mostRecent.state) {
        state.style.display = 'none';
        document.getElementById('spotify-activity').style.display = 'none';
        return;
    }
    const spotifyData = response.data.spotify;
    if (mostRecent.name === "Spotify") {
        state.style.display = 'block';
        state.innerHTML = `By ${spotifyData.artist.split(';').join(', ')}`;
        start_time.innerHTML = formatTime(spotifyData.timestamps.start);
        end_time.innerHTML = formatTime(spotifyData.timestamps.end, spotifyData.timestamps.start);
        document.getElementById('spotify-activity').style.display = 'flex';
        updateProgressBar(spotifyData.timestamps.start, spotifyData.timestamps.end);
        return;
    }
    state.style.display = 'block';
    document.getElementById('spotify-activity').style.display = 'none';
    state.innerHTML = mostRecent.state;
}
async function setActivityDetails() {
    const response = cache;

    const activities = response.data.activities.filter(m => m.type !== 4);
    if (!activities.length) {
        details.style.display = 'none';
        return;
    }
    const mostRecent = activities.shift();
    if (!mostRecent.details) {
        details.style.display = 'none';
        return;
    }
    const spotifyData = response.data.spotify;
    if (mostRecent.name === "Spotify") {
        details.style.display = 'block';
        details.innerHTML = spotifyData.song;
        return;
    }
    details.style.display = 'block';
    details.innerHTML = mostRecent.details;
}

function formatTime(timestamp, start_time_stamp) {
    if (start_time_stamp) {
        const duration = (timestamp - start_time_stamp) / 1000;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        const now = Date.now();
        const elapsed = (now - timestamp) / 1000;
        const minutes = Math.floor(elapsed / 60);
        const seconds = Math.floor(elapsed % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

function updateProgressBar(start, end) {
    const now = Date.now();
    const duration = end - start;
    const elapsed = now - start;
    const progress_percentage = (elapsed / duration) * 100;
    progress_bar.style.width = `${progress_percentage}%`;

    if (progress_percentage < 100) {
        requestAnimationFrame(() => {
            start_time.innerHTML = formatTime(start);
            updateProgressBar(start, end);
        });
    }
}

function presenceInvoke() {
    setListeningMusic();
    setActivityBigImage();
    setActivitySmallImage();
    setActivityName();
    setActivityState();
    setActivityDetails();
}

function statusInvoke() {
    setStatus();
    setAvatarFrame();
    // activeOn();
    setUsername();
}

function invoke() {
    setInterval(() => {
        fetchResponse(USERID).then(e =>{
            presenceInvoke();
            statusInvoke();
        })
    }, 5e3);
    fetchResponse(USERID).then(e =>{
        setAvatar();
        presenceInvoke();
        statusInvoke();
    })
}

invoke();