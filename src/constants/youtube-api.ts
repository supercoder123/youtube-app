const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.LEFT_HAND_RIGHT_CHANNEL_ID;

export const CHANNELS_API_URL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${CHANNEL_ID}&key=${API_KEY}`;
// export const PLAYLISTS_ITEMS_API_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&key=${NEXT_PUBLIC_API_KEY}`;
export const PLAYLISTS_ITEMS_API_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&key=AIzaSyC4eoBC80aEtdnjIgbL4A9vyJqln1w22us&playlistId=UUDt-2KorfMpzLf-CX71n18A`;

export const VIDEO_DETAILS_API_URL = 'https://www.googleapis.com/youtube/v3/videos?part=statistics,topicDetails,player,contentDetails&key=AIzaSyC4eoBC80aEtdnjIgbL4A9vyJqln1w22us&id='