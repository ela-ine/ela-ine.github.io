import GoogleClient from "./google";
import PlayerComponent, { Queue, useQueueContext } from "./video";
import { Component, useEffect, useState } from 'react';
import getVideosFromPlaylist from "./google";

// const google = new GoogleClient();

export default async function Home() {
    console.log('home rendering...');
    
    const videos = await getVideosFromPlaylist('PLSGEqKTEpB0Fcnt2VXFGrIZgSTMQnQ6Rf');

    return (
        <Queue videos={videos}>
            <PlayerComponent />
        </Queue>
    );
}