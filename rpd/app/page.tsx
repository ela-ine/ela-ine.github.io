'use client'

import { Video } from './common';
import getVideosFromPlaylist from "./google";
import VideoQueue from "./video";
import Player, { PlayerProvider } from "./player";
import { useContext, useEffect, useRef, useState } from 'react';
import Input from "./input";
import { YouTubePlayer } from 'youtube-player/dist/types';
import { useStore } from 'zustand';

export function PlayerComponent({ first, playing, videos, setPlaying, setVideos }) {
    // const playerRef = useRef<null | YouTubePlayer>(null);
    // const [endEvent, setEndEvent] = useState();
    const [playerInitialized, setPlayerInitialized] = useState(false);

    // const setPlayerRef = (r: YouTubePlayer) => {
    //     if (!playerInitialized) {
    //         playerRef.current = r;
    //         setPlayerInitialized(true);
    //     }
    // };

    const popQueue = () => {
        if (videos.length == 0) {
            setPlaying(null);
            return;
        }
        setPlaying(videos[0]);
        setVideos([...videos.slice(1)]);
    }

    // player: first, 

    const pushQueue = (x) => {
        setVideos(prev => [x, ...prev]);
    }

    return (
        <PlayerProvider>
            {playing && <VideoQueue 
                playing={playing} 
                pop={popQueue}
                initialized={playerInitialized} />}
        </PlayerProvider>
    );
}

export default function Home() {
    console.log("home rendering...");
    const [videos, setVideos] = useState([]);
    const [playing, setPlaying] = useState<Video>();
    const [first, setFirst] = useState<Video>();

    const getVideos = async (id) => { 
        const playlist = await getVideosFromPlaylist(id);
        setPlaying(playlist[0]);
        setVideos(playlist.slice(1));
        // if(!first.id) {
            setFirst(playlist[0]);
        // }
    };

    // Event handler to handle form submission
    const handleSubmit = (val) => {
        getVideos(val);
    };

    return (
        <div>
            <Input initialValue={'PLSGEqKTEpB0FDOYLNSJeKrEZeIT_iehIh'} handleSubmit={handleSubmit}></Input>
            <PlayerComponent 
                first={first}
                playing={playing} 
                videos={videos} 
                setPlaying={setPlaying} 
                setVideos={setVideos}>
            </PlayerComponent>
            {first && 
            <Player video={first}/>}
        </div>
    );
}