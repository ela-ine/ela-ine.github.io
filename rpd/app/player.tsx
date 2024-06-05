"use client"
import { MutableRefObject, createContext, memo, useContext, useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { YouTubePlayer } from 'youtube-player/dist/types';
import { Video } from './common';

interface PlayerContextType {
    initialized: boolean,
    playing: Video,
    setPlaying: (_) => void,
    playerRef: MutableRefObject<null | YouTubePlayer>,
    setPlayerRef: (_) => void,
    endEvent?: YouTubeEvent,
    setEndEvent: (_) => void,
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('useYouTubePlayer must be used within a YouTubePlayerProvider');
    }
    return context;
};

export function PlayerProvider({ children }) {
    const playerRef = useRef<null | YouTubePlayer>(null);
    const [endEvent, setEndEvent] = useState();
    const [initialized, setInitialized] = useState(false);
    const [playing, setPlaying] = useState<Video>();

    const setPlayerRef = (r: YouTubePlayer) => {
        if (!initialized) {
            playerRef.current = r;
            setInitialized(true);
        }
    };

    return (
        <PlayerContext.Provider value={{ playing, setPlaying, initialized, playerRef, setPlayerRef, endEvent, setEndEvent }}>
            {children}
        </PlayerContext.Provider>
    );
};

const Player = memo(function Player(props: { video: Video, setPlayerRef, setEndEvent }) {
    const { video , setPlayerRef, setEndEvent } = props;
    console.log("player rendering...", video);
    // const { setPlayerRef, setStateEvent } = usePlayerContext();
    const start = 0;
    const end = 5;
    const options = {
        width: "1280",
        height: "720",
        playerVars: {
            start: start,
            end: end,
        },
    }

    const onReady = async (event: YouTubeEvent) => {
        console.log("player ready!", event.target.videoTitle);
        event.target.playVideo();
        setPlayerRef(event.target);
    }

    const onStateChange = (event: YouTubeEvent) => {
        if (event.data == YouTube.PlayerState.CUED) {
            event.target.playVideo();
        }
    }

    const onEnd = (event: YouTubeEvent) => {
        setEndEvent(event);
    }

    return(
        <YouTube
            videoId={video.id}
            opts={options}
            onReady={onReady}
            onStateChange={onStateChange}
            onEnd={onEnd}
        />
    );
})

export default Player