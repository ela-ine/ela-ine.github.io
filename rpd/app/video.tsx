'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';

export interface Video {
    id?: string,
    title?: string,
    channel?: string,
}

const QueueContext = createContext({ head: {}, queue: [], push: (_) => {}, pop: () => {}});
export const useQueueContext = () => useContext(QueueContext);

export function Queue({ children, videos }) {
    const [head, setHead] = useState<Video>(videos[0]);
    const [queue, setQueue] = useState<Video[]>(videos.slice(1));
    useEffect(() => {
        console.log('queue', head, queue); // Log the count after the state has been updated
      }, [queue, head]); // Run this effect whenever the count state changes

    const popQueue = () => {
        if (queue.length == 0) {
            setHead(null);
            return;
        }
        setHead(queue[0]);
        setQueue([...queue.slice(1)]);
        console.log("pop!");
    }

    const pushQueue = (x) => {
        setQueue(prev => [x, ...prev]);
    }

    return(
        <QueueContext.Provider value={{ head: head, queue: queue, push: pushQueue, pop: popQueue }}>
            { children }
        </QueueContext.Provider>

    )
}

export default function PlayerComponent() {
    const { head, queue, push, pop } = useQueueContext();
    const [player, setPlayer] = useState<YouTubePlayer>();
    const playing: Video = head;

    console.log('playercomponent init...', queue.length);

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

    useEffect(() => {
        console.log('useeffect', player);
        if (player) {
            console.log('next playing...', head);
            player.cueVideoById({
                videoId: playing.id,
                startSeconds: start,
                endSeconds: end,
            });
        }
    }, [head]);

    function addToQueue(video: Video) {
        push(video);
    }

    function removeFromQueue(id: string) {
        const i = queue.findIndex((video) => {
            video.id == id;
        });
        if (i >= 0) {
            queue.splice(i, 1);
        }
    }

    const handleReady = (event: YouTubeEvent) => {
        event.target.playVideo();
        // setPlayer(event.target);
        console.log('player ready!', playing);
    }

    const handleState = (event: YouTubeEvent) => {
        console.log('playnext', event.data);

        if (event.data == YouTube.PlayerState.CUED) {
            event.target.playVideo();
        }
        
        if (event.data == YouTube.PlayerState.ENDED) {
            console.log('playnext', queue);
            pop();
        }
    }
    
    if (!playing) {
        return null;
    }

    const style = { width: "1500px", height: "800px", color: "yellow" };
    return (
        <div style={style}>
            <YouTube
                videoId={playing.id}
                opts={options}
                onReady={handleReady}
                onStateChange={handleState}
            />
        </div>
    );
}