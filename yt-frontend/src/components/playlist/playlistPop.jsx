import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const PlaylistPop = ({ videoId, setShowPlaylist,setOpen }) => {
    const [playlists, setPlaylists] = useState([]);
    const [creatingPlaylist, setCreatingPlaylist] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu]=useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const {user}=useAuth()

    useEffect(() => {
        const handleFetchPlaylists = async () => {
            try {
                const response = await axios.get(`https://dangle-video-watching-platform-2.onrender.com/user/playlists`, {
                    withCredentials: true,
                });
                setPlaylists(response.data);
            } catch (error) {
                console.log("Error fetching playlists", error);
            }
        };
        handleFetchPlaylists();
    }, [creatingPlaylist]);


    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            console.log("Creating playlist...");
            const response=await axios.post(
                `https://dangle-video-watching-platform-2.onrender.com/user/createPlaylist`,
                { playlistName: newPlaylistName },
                { withCredentials: true }
            );
            setCreatingPlaylist(false);
            setNewPlaylistName("");
        } catch (error) {
            console.log("Error creating playlist", error);
        }
    };

    // Handle Adding to Playlist
    const handleAddToPlaylist = async (playlistId) => {
        try {
            await axios.post(
                `https://dangle-video-watching-platform-2.onrender.com/user/addToPlaylist`,
                {playlistId:playlistId,
                videoId:videoId
                },
                { withCredentials: true }
            );
            setShowPlaylist(false);
            setOpen(false);

        } catch (error) {
            console.log("Frontend error saving playlist");
        }
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white shadow-lg rounded-lg p-2 border border-gray-200">
            {/* Create Playlist Button */}
            <button
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => setCreatingPlaylist(true)}
            >
                <Plus size={16} className="mr-2" />
                Create Playlist
            </button>

            {creatingPlaylist && (
                <div className="p-2">
                    <input
                        type="text"
                        className="block w-full px-4 py-2 border rounded-md focus:outline-none"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Enter playlist name"
                    />
                    <button
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        onClick={handleCreatePlaylist}
                    >
                        Save Playlist
                    </button>
                </div>
            )}

            {playlists.length > 0 ? (
                playlists.map((playlist) => (
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        key={playlist._id}
                        onClick={() => handleAddToPlaylist(playlist._id)}
                    >
                        {playlist.playlistName}
                    </button>
                ))
            ) : (
                <p className="block w-full text-left px-4 py-2">No playlists</p>
            )}
            <div>
                
            </div>
        </div>
    );
};

export default PlaylistPop;
