'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { usePlayerContext } from './player';
import { Video, useStore } from './common';


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

export default function VideoQueue({ playing, pop, initialized }) {
    // const { head: playing, pop } = useQueueContext();
    // const { initialized, playerRef, stateEvent } = usePlayerContext();

    const endEvent = useStore(state => state.endEvent);
    const player = useStore(state => state.player);

    const start = 0;
    const end = 5;

    useEffect(() => {
        if (playing && initialized && player) {
            // if (playing && initialized && playerRef?.current) {
            console.log('useeffect playing triggered!');
            // playerRef.current;
            // if (playerRef.current && playing) {
                player.cueVideoById({
                    // playerRef.current.cueVideoById({
                    videoId: playing.id,
                    startSeconds: start,
                    endSeconds: end,
                });
            // }
        }
    }, [playing]);

    useEffect(() => {
        if (endEvent) {
            handleStateChange(endEvent);
        }
    }, [endEvent]);

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