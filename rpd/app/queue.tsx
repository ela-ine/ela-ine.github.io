'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { Video } from './common';

export default function VideoQueue({ playing, pop, initialized, playerRef, stateEvent }) {
    const start = 0;
    const end = 5;

    useEffect(() => {
        if (initialized && playerRef?.current) {
            console.log('next playing...', playing);
            // if (playerRef.current && playing) {
            //     playerRef.current.cueVideoById({
            //         videoId: playing.id,
            //         startSeconds: start,
            //         endSeconds: end,
            //     });
            // }
        }
    }, [playing]);

    useEffect(() => {
        if (stateEvent) {
            handleStateChange(stateEvent);
        }
    }, [stateEvent]);

    const handleStateChange = (event: YouTubeEvent) => {
        switch (event.data) {
            case YouTube.PlayerState.ENDED:
                pop();
                break;

            default:
                break;
        }
    }

    return(
        <p>{playing ? playing.title : "all done!"}</p>
    );
}