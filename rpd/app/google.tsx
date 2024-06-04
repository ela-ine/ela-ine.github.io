'use server';
import { google } from "googleapis";
import { Video } from "./video";

    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.GAPI_KEY,
    });

    export default async function getVideosFromPlaylist(playlist) {
        var videos: Video[] = [];
        console.log('getting videos from playlist...');

        var nextPageToken = '';
        while (nextPageToken != null) {
            const response = await youtube.playlistItems.list({
                part: ['snippet'],
                playlistId: playlist,
                maxResults: 50
            });
            console.log(response);
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
// }
    