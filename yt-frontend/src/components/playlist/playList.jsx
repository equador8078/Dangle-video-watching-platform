import PlaylistCard from "./playlistCard";
import axios from "axios";
import { FolderOpen  } from "lucide-react"
import PlaylistVideo from "./playlistVideo";
import { useEffect, useState } from "react";

const PlaylistSection = () => {
    const [playlists, setPlaylists] = useState([]);
    const [videosArray, setVideosArray] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [singlePlaylist, setSinglePlaylist]=useState(null);
    const [playlistRefresh, setPlaylistRefresh]=useState(false);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get("https://dangle-video-watching-platform-2.onrender.com/user/playlists", {
                    withCredentials: true
                });
                setPlaylists(response.data);
            } catch (error) {
                console.log("Error fetching playlists", error);
            }
        };
        fetchPlaylists();
        setSinglePlaylist(null);
        setVideosArray([])
    }, [playlistRefresh]);

    useEffect(() => {
        const loadVideos = async () => {
            if (singlePlaylist) {
                await fetchPlaylistVideos(singlePlaylist);
            } else {
                setVideosArray([]);
            }
        };
        loadVideos();
    }, [singlePlaylist]);

    const fetchPlaylistVideos = async (playlist) => {
        if(isLoading) return;
        setIsLoading(true);
        setSinglePlaylist(playlist);
        try {
            if(playlist.videos && playlist.videos.length>0){
            const response = await axios.get("https://dangle-video-watching-platform-2.onrender.com/user/playlistVideos", {
                params: {
                    videoIds: playlist.videos
                },
                withCredentials: true
            });
            setVideosArray(response.data);
        }
        else{
            setVideosArray([]);
        }
        } catch (error) {
            console.log("Error fetching playlist videos", error);
        }
        finally{
            setIsLoading(false);
        }
    };

    const deletePlaylistVideo=async(playlistId,videoId)=>{
        try{
            const response=await axios.delete(`https://dangle-video-watching-platform-2.onrender.com/user/deletePlaylistVideo/${playlistId}/video/${videoId}`,
                {withCredentials:true}
            )
            const updatedPlaylist=response.data.playlist;
            setSinglePlaylist(updatedPlaylist)
            console.log("updated playlist", updatedPlaylist)

            if(updatedPlaylist.videos.length===0){
                setVideosArray([]);
            }
            else{
                fetchPlaylistVideos(updatedPlaylist)
                // setVideosArray((prev)=>prev.filter((video)=>video._id!==videoId))
            }
        }catch(error){
            console.log("error deleting video",error)
        }
    }

    return (
        <div className="flex lg:h-180 md:h-150  sm:h-130 ">

            <div className="min-h-[calc(79vh-40px)] mt-20 mb-20 text-white rounded-2xl ml-20 bg-slate-900 lg:w-90 md:w-70 sm:w-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6">Playlists</h1>
                    <div className="flex grid ">
                        {playlists.length>0 && Array.isArray(playlists) ? (
                            playlists.map((playlist) => (
                                <button key={playlist._id} onClick={() => fetchPlaylistVideos(playlist)}>
                                    <PlaylistCard playlist={playlist} setPlaylistRefresh={setPlaylistRefresh} setVideosArray={setVideosArray}/>
                                </button>
                            ))
                        ) : (
                            <h1 className="text-2xl">No playlist created!</h1>
                        )}
                    </div>
                </div>
            </div>

            <div className="min-h-[calc(79vh-40px)] mt-20 mb-20 min-w-[500px] text-white rounded-2xl ml-20 xl:w-220 lg:170 md:w-150 sm:w-90 xs:w-60 bg-gray-800">
                <div className="container px-12 py-8">
                    <h1 className="text-3xl md:text-4xl mb-3 font-bold mb">
                        {singlePlaylist ? singlePlaylist.playlistName : "Please select a playlist"}
                    </h1>
                    <div className="">
                        <div className="max-h-[500px] rounded-2xl w-200 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">

                            {singlePlaylist && videosArray.length > 0  ? (
                                videosArray
                                .filter((video)=>video.archive===false)
                                .map((video) => (
                                        <PlaylistVideo key={video._id} video={video} playlistId={singlePlaylist._id} deletePlaylistVideo={deletePlaylistVideo}/>
                                    
                                ))
                            ) : (
                                <div className="flex justify-center gap-4 items-center text-center h-screen text-3xl md:text-4xl font-bold mb-8">
                                    <FolderOpen size={50}></FolderOpen>
                                <h1 className="">
                                    Playlist is empty
                                </h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistSection;
