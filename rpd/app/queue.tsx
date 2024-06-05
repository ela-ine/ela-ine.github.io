'use client';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { Video, YouTubePlayer } from './common';
import Submit from './submit';
import { getVideo, getVideosFromPlaylist } from './gapi';

interface Props {
    initialized: boolean,
    playerRef: YouTubePlayer,
    stateEvent: any,
    setFirst: any
}

export default function VideoQueue(props) {
    const { initialized, playerRef, stateEvent, setFirst } = props;
    const [videos, setVideos] = useState([]);
    const [playing, setPlaying] = useState<Video>();
    const [loading, setLoading] = useState(false);
    const start = 0;
    const end = 5;

    useEffect(() => {
        console.log('useeffect', initialized, playerRef);
        if (initialized && playerRef?.current) {
            console.log('next playing...', playing);
            if (playerRef.current && playing) {
                playerRef.current.cueVideoById({
                    videoId: playing.id,
                    startSeconds: start,
                    endSeconds: end,
                });
            }
        }
    }, [playing]);

    useEffect(() => {
        if (stateEvent) {
            handleStateChange(stateEvent);
        }
    }, [stateEvent]);


    const getPlaylist = async (id) => { 
        const playlist = await getVideosFromPlaylist(id);
        console.log("getting videos...", playlist);
        setPlaying(playlist[0]);
        setVideos(playlist.slice(1));
        setFirst(playlist[0])
        setLoading(false);
    };

    const pop = () => {
        if (videos.length == 0) {
            setPlaying(null);
            return;
        }
        setPlaying(videos[0]);
        setVideos([...videos.slice(1)]);
        setLoading(false);
        console.log("pop!");
    }

    const push = async (x) => {
        setLoading(true);
        const v = await getVideo(x);
        if (playerRef.current.getPlayerState()) {
            setVideos([v, ...videos]);
        } else {
            console.log("queueing video...", v, playing);
            setPlaying(v);
        }
        setLoading(false);
    }

    const loadPlaylist = (val) => {
        setLoading(true);
        getPlaylist(val);
    };

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
        <div>
            <Submit 
                label={"Queue playlist:"} 
                initialValue={'PLSGEqKTEpB0FDOYLNSJeKrEZeIT_iehIh'} 
                handleSubmit={loadPlaylist} />
            <Submit 
                label={"Queue video:"} 
                initialValue={'klBnLJSKHBA'} 
                handleSubmit={(v) => push(v)} />
            { loading && !initialized && <b>loading...</b> }
            { loading && initialized && <b>loading... will play after this video</b> }
        </div>
    );
}