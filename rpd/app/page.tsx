'use client'

import { useRef, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { Video } from './common';
import VideoQueue from "./queue";
import getVideosFromPlaylist from "./google";
import Player, { PlayerProvider } from "./player";
import Submit from './input';

// const google = new GoogleClient();

export function PlayerComponent({ playing, videos, setPlaying, setVideos }) {
    console.log("playercomponent rerendering...", playing);

    const playerRef = useRef<null | YouTubePlayer>(null);
    const [endEvent, setEndEvent] = useState();
    const [initialized, setInitialized] = useState(false);
    const first: Video = { ...playing }

    const setPlayerRef = (r: YouTubePlayer) => {
        if (!initialized) {
            playerRef.current = r;
            setInitialized(true);
        }
    };

    const popQueue = () => {
        if (videos.length == 0) {
            setPlaying(null);
            return;
        }
        setPlaying(videos[0]);
        setVideos([...videos.slice(1)]);
    }

    const pushQueue = (x) => {
        setVideos(prev => [x, ...prev]);
    }

    return (
        <PlayerProvider>
            <Player 
                video={first} 
                setPlayerRef={setPlayerRef} 
                setEndEvent={setEndEvent} />
            <VideoQueue 
                playing={playing} 
                pop={popQueue}
                initialized={initialized}
                stateEvent={endEvent}
                playerRef={playerRef} />
        </PlayerProvider>
    );
}

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [playing, setPlaying] = useState<Video>();
    console.log('home rendering...', playing, videos);

    const getVideos = async (id) => { 
        const playlist = await getVideosFromPlaylist(id);
        setPlaying(playlist[0]);
        setVideos(playlist.slice(1));
    };

    // Event handler to handle form submission
    const handleSubmit = (val) => {
        getVideos(val);
    };

    return (
        <div>
            <Submit initialValue={'PLSGEqKTEpB0FDOYLNSJeKrEZeIT_iehIh'} handleSubmit={handleSubmit}></Submit>
            {playing && 
            <PlayerComponent 
                playing={playing} 
                videos={videos} 
                setPlaying={setPlaying} 
                setVideos={setVideos}>
            </PlayerComponent>}
        </div>
    );
}