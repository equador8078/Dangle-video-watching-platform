import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit, Trash2, Archive } from "lucide-react";
import PlaylistPop from "./playlist/playlistPop";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ActionMenu = ({ video, isCreator, setRefresh }) => {
    const [open, setOpen] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [archiveToggle, setArchiveToggle] = useState(false);
    const dropDownRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth()

    useEffect(() => {
        const handleClickedOutside = (event) => {
            if (open && dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setOpen(false);
                setShowPlaylist(false);
            }
        };

        document.addEventListener("mousedown", handleClickedOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickedOutside);
        };
    }, [open]);

    const handelDeleteVideo = async (videoId, publicId) => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(
                "http://localhost:3200/videos/deleteVideo",
                {
                    data: { videoId, publicId },
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            alert("Video deleted successfully!!");
            setRefresh(prev => !prev)
        } catch (error) {
            console.error("Deletion error:", error);
            alert("Error deleting video");
        }
        finally {
            setDeleteLoading(false)
        }
        navigate('/videos/yourVideo', { state: { refresh } });
    };

    const handelUpdateArchive = async () => {
        try {
            await axios.post("http://localhost:3200/videos/updateArchive",
                {
                    videoId: video._id,
                    forUpdatingArchive: true,
                }
            )
            setArchiveToggle(prev => !prev);
        }
        catch (error) {
            console.log("Front end error while updating archive", error);
            return;
        }
    }

    const handelArchiveStatusFetch = async () => {
        try {
            const response = await axios.post("http://localhost:3200/videos/updateArchive",
                {
                    videoId: video._id,
                    forUpdatingArchive: false,
                }
            )
            setArchiveToggle(response.data.isArchive);
        }
        catch (error) {
            console.log("Front end error while updating archive", error);
            return;
        }
    }

    useEffect(() => {
        handelArchiveStatusFetch();
    }, [open])

    const handleShare = async () => {
        const shareUrl= `http://localhost:5173/videos/played/${video._id}`
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Check this out!",
                    text: "Here's something interesting",
                    url: shareUrl,
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Sharing failed:", err);
        }
    };

    return (
        <div className="relative inline-block" ref={dropDownRef}>
            <button
                className="p-2 cursor-pointer bg-white mt-2 me-2 z-0 rounded-full"
                onClick={() => { setOpen(!open); setShowPlaylist(false); }}
            >
                <MoreVertical size={20} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg p-2 border border-gray-200">
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            { user ? setShowPlaylist(!showPlaylist) : window.alert("LogIn to save to playlist !!") }
                        }}
                    >
                        Save to playlist
                    </button>
                    <button onClick={()=>handleShare()} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Share
                    </button>

                    {isCreator && (
                        <>
                            <hr className="mt-1"></hr>
                            <div className="flex-col mt-1 justify-center text-black">
                                <p className="block w-full text-left px-1 py-2 font-bold">Creator's tool:</p>

                                <button
                                    className="flex gap-x-3 p-1 block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { navigate("/videos/upload", { state: { video } }) }}
                                >
                                    <Edit size={20} />Edit
                                </button>

                                <button className="flex gap-x-3 p-1 block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { handelUpdateArchive() }}
                                >
                                    <Archive size={20} />{archiveToggle ? "Unarchive" : "Archive"}
                                </button>
                                <button className="flex gap-x-3 p-1 block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { handelDeleteVideo(video._id, video.publicId) }}>
                                    {deleteLoading ? "Deleting..." : ((<><Trash2 size={20} />Delete</>))}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {showPlaylist && <PlaylistPop videoId={video._id} setOpen={setOpen} setShowPlaylist={setShowPlaylist} />}
        </div>
    );
};

export default ActionMenu;
