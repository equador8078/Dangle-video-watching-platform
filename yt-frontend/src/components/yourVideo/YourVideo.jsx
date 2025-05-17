import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VideoCard from '../VideoCard';
import axios from 'axios';

const YourVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [refresh, setRefresh] = useState(false);
    const { user } = useAuth();
    const isCreator=true;

    useEffect(() => {
        if (!user) {
            setMessage("Please login to see your videos!! 😕");
            return;
        }
        
        const fetchUserVideo = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:3200/videos/userVideos", {
                    withCredentials: true
                });
                
                if (response.data.status === 400) {
                    setMessage(response.data.message);
                    setLoading(false);
                    return;
                }
                
                setVideos(response.data.videosWithOwner || []);
            } catch (error) {
                console.log("Some error occurred:", error);
                setMessage("Failed to load videos. Please try again.");
            }
            setLoading(false);
        };

        fetchUserVideo();
    }, [user,refresh]);

    return (
        <>
            {loading ? (
                <h1 className='text-4xl font-bold p-10'>Loading...</h1>
            ) : (
                <div className='video-section w-full p-4'>
                    <div className="video-card-container flex flex-wrap gap-x-3 gap-y-10">
                        {user ? (
                            videos.length > 0 ? (
                                videos.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        video={video}
                                        isCreator={isCreator}
                                        setRefresh={() => setRefresh(prev => !prev)}
                                    />
                                ))
                            ) : (
                                <h1 className='text-4xl font-bold p-10'>You have no videos posted!!</h1>
                            )
                        ) : (
                            <h1 className='text-4xl font-bold p-10'>{message}</h1>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default YourVideo;
