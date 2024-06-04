import { Queue } from "./video";
import getVideosFromPlaylist from "./google";
import QueueVideos from "./video";
import Player, { PlayerProvider } from "./player";

// const google = new GoogleClient();

export default async function Home() {
    console.log('home rendering...');
    
    const videos = await getVideosFromPlaylist('PLSGEqKTEpB0Fcnt2VXFGrIZgSTMQnQ6Rf');

    return (
        <PlayerProvider>
            <Player video={videos[0]}></Player>
            <Queue videos={videos}>
                <QueueVideos />
            </Queue>
        </PlayerProvider>
    );
}