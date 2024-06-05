'use server';
import { google } from "googleapis";
import { Video } from "./common";

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GAPI_KEY,
});

export default async function getVideosFromPlaylist(playlist) {
    console.log("getting videos...")
    var videos: Video[] = [];

    var nextPageToken = '';
    while (nextPageToken != null) {
        const response = await youtube.playlistItems.list({
            part: ['snippet'],
            playlistId: playlist,
            maxResults: 50
        });
        
        response.data.items.map((video) => {
            const v: Video = {
                id: video.snippet.resourceId.videoId,
                title: video.snippet.title,
                channel: video.snippet.videoOwnerChannelTitle,
            }

            videos.push(v)
        })

        nextPageToken = response.data.nextPageToken;
    }

    return videos;
}
    