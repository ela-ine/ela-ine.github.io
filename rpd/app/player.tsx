"use client"
import { MutableRefObject, createContext, useContext, useRef, useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { YouTubePlayer } from 'youtube-player/dist/types';

interface PlayerContextType {
    initialized: boolean,
    playerRef: MutableRefObject<null | YouTubePlayer>,
    setPlayerRef: (_) => void,
    stateEvent?: YouTubeEvent,
    setStateEvent: (_) => void,
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
    console.log("player context initializing...", playerRef);
    const [stateEvent, setStateEvent] = useState();
    const [initialized, setInitialized] = useState(false);

    const setPlayerRef = (r: YouTubePlayer) => {
        if (!initialized) {
            playerRef.current = r;
            setInitialized(true);
            console.log("setting playerRef... ", playerRef.current);
        }
    };

    return (
        <PlayerContext.Provider value={{ initialized, playerRef, setPlayerRef, stateEvent, setStateEvent }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default function Player({ video }) {
    const { setPlayerRef, setStateEvent } = usePlayerContext();
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
        await setTimeout(() => {
            console.log("player ready!", event.target.videoTitle);
            event.target.playVideo();
            setPlayerRef(event.target);
        }, 200);
    }

    const onStateChange = (event: YouTubeEvent) => {
        console.log('state change', event.data);
        setPlayerRef(event.target);
        setStateEvent(event);
    }

    return(
        <YouTube
            videoId={video.id}
            opts={options}
            onReady={onReady}
            onStateChange={onStateChange}
        />
    );
}