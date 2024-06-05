"use client"
import { MutableRefObject, createContext, memo, useContext, useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { YouTubePlayer } from 'youtube-player/dist/types';
import { Video } from './common';

const Player = memo(function Player(props: { video: Video, setPlayerRef, setEndEvent }) {
    const { video , setPlayerRef, setEndEvent } = props;
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
        }, 1);
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