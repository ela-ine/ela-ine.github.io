'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { usePlayerContext } from './player';

export interface Video {
    id?: string,
    title?: string,
    channel?: string,
}

interface QueueContextType {
    head: Video,
    queue: Video[],
    push: (_: Video) => void,
    pop: (_: void) => void
}

const QueueContext = createContext<QueueContextType | null>(null);
export const useQueueContext = () => useContext(QueueContext);

export function Queue({ children, videos }) {
    const [head, setHead] = useState<Video>(videos[0]);
    const [queue, setQueue] = useState<Video[]>(videos.slice(1));

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

export default function QueueVideos() {
    const { head, queue, push, pop } = useQueueContext();
    const { initialized, playerRef, stateEvent } = usePlayerContext();

    console.log('queue videos init...', queue.length);

    const start = 0;
    const end = 5;

    useEffect(() => {
        if (initialized && playerRef?.current) {
            console.log('next playing...', head);
            if (playerRef.current && head) {
                playerRef.current.cueVideoById({
                    videoId: head.id,
                    startSeconds: start,
                    endSeconds: end,
                });
            }
        }
    }, [head]);

    useEffect(() => {
        if (stateEvent) {
            handleStateChange(stateEvent);
        }
    }, [stateEvent]);

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

    const handleStateChange = (event: YouTubeEvent) => {
        switch (event.data) {
            case YouTube.PlayerState.CUED:
                event.target.playVideo();
                break;
                
            case YouTube.PlayerState.ENDED:
                pop();
                break;

            default:
                break;
        }
    }

    return(
        <p>{head ? head.title : "all done!"}</p>
    );
}