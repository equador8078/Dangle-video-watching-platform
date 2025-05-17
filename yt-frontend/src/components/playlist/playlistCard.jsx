import axios from "axios"

const PlaylistCard = ({ playlist, setPlaylistRefresh, setVideosArray }) => {

    const deletePlaylist = async () => {
        try {
            const response = await axios.delete(`http://localhost:3200/user/deletePlaylist/${playlist._id}`);
        }
        catch (error) {
            console.log("error while deleting playlist ", error)
        }
        finally {
            setPlaylistRefresh(prev => !prev);
            setVideosArray([])
        }
    }

    return (
        <div
            className="bg-white text-black transition-transform duration-200 hover:-translate-y-2 hover:scale-105
    mt-5 text-lg md:text-xl font-semibold rounded-2xl hover:bg-gray-200
    cursor-pointer flex flex-col justify-center items-center w-full max-w-sm p-6 relative mx-auto"
        >
            {/* Delete Button */}
            <div
                className="absolute top-2 right-2 text-lg md:text-xl px-2 py-1 hover:bg-red-500 hover:text-white rounded cursor-pointer"
                onClick={deletePlaylist}
            >
                X
            </div>

            {/* Playlist Name */}
            <h1 className="text-center break-words">{playlist.playlistName}</h1>
        </div>
    );

}
export default PlaylistCard;