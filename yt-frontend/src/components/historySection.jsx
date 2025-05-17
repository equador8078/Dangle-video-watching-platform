import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryCard from "./historyCard";

const HistorySection = () => {
    const [historyVideos, setHistoryVideos] = useState([]);

    const deleteHistory=async(videoId)=>{
        try{
            await axios.delete(`http://localhost:3200/user/deleteHistory/${videoId}`,
                {withCredentials:true}
            )
            setHistoryVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
        }
        catch(error){
            console.log("Some error occurred at auth context delete history", error)
        }
    }

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3200/videos/historyVideos",
                    { withCredentials: true }
                );
                setHistoryVideos(response.data);
            } catch (error) {
                console.log("Error occurred while fetching history videos", error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="min-h-screen ml-20">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 ">
                    Video History
                </h1>

                <div className="space-y-5 max-w-4xl mx-auto">
                    {Array.isArray(historyVideos) && historyVideos.length > 0 ? (
                        historyVideos.map((video) => (
                            <div key={video._id}>
                                <HistoryCard video={video} deleteHistory={deleteHistory} />
                            </div>
                        ))
                    ) : (
                        <p className="text-xl text-gray-500">No history videos found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistorySection;