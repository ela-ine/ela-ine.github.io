'use server';
import { google } from "googleapis";
import { Video } from "./common";

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GAPI_KEY,
});

// gets videos by playlist id
export async function getVideosFromPlaylist(playlist) {
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
            };

            videos.push(v);
        })

        nextPageToken = response.data.nextPageToken;
    }

    return videos;
}

// gets video by id
export async function getVideo(id: string) {
    const response = await youtube.videos.list({
        part: ['snippet'],
        id: [id],
        maxResults: 1
    })

    if (response.data.items.length > 0) {
        const snippet = response.data.items[0].snippet;
        const v: Video = {
            id: id,
            title: snippet.title,
            channel: snippet.channelTitle,
        };
        return v;
    }
}
    