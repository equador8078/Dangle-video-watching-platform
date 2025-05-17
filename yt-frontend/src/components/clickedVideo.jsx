import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import SideVideo from "./SideVideos";

const ClickedVideo = () => {
    const [video, setVideo] = useState(null);
    const { videoId } = useParams();
    const [likes, setLikes] = useState([]);
    const [sideVideos, setSideVideos] = useState(null);
    const [dislikes, setDislikes] = useState([]);
    const [active, setActive] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showFullDescription, setShowFullDescription] = useState(false);
    const fetched = useRef(false);
    const { user } = useAuth();

    const { handelSubscription, subscriptionList } = useSubscription();
    const [isSubscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (!video) return;
        const isSub = subscriptionList?.some((c) => c.creator?._id === video.owner?._id);
        setSubscribed(isSub);
    }, [subscriptionList, video])

    const handelFetchSideVideos = async () => {
        try {
            const response = await axios.get(`http://localhost:3200/videos/fetchSideVideos/${videoId}`,
                { withCredentials: true }
            )
            setSideVideos(response.data || null);
        }
        catch (error) {
            console.log("Error while fetching side video ", error);
            return;
        }
    }

    const handelVideoFetch = async () => {

        try {
            const response = await axios.get(`http://localhost:3200/videos/getAVideo/${videoId}`,
                { withCredentials: true }
            );
            if (!response.data) {
                console.log("No data fetched!!")
            }
            setVideo(response.data);
            setLikes(response.data.likesCount)
            setDislikes(response.data.dislikeCount)
            await handelFetchSideVideos();
            await handleFetchComments();

            if (user) {
                const hasLiked = response.data.likesCount.some(id => id.toString() === user._id.toString());
                const hasDisliked = response.data.dislikeCount.some(id => id.toString() === user._id.toString());
                setActive(hasLiked ? "like" : hasDisliked ? "dislike" : null)
            }

        }
        catch (error) {
            console.log("error fetching video: ", error)
        }
    }

    useEffect(() => {
        handelVideoFetch();
    }, [videoId]);

    const handelLikeDislike = async (liked, videoId) => {
        try {
            const response = await axios.put('http://localhost:3200/videos/updateLikeDislike',
                {
                    liked: liked,
                    videoId: videoId
                },
                { withCredentials: true }
            )

            const updatedVideo = response.data.video
            setLikes(updatedVideo.likesCount);
            setDislikes(updatedVideo.dislikeCount);

            if (user) {
                const hasLiked = updatedVideo.likesCount.includes(user._id);
                const hasDisliked = updatedVideo.dislikeCount.includes(user._id);
                setActive(hasLiked ? "like" : hasDisliked ? "dislike" : null)
            }
        }
        catch (error) {
            console.log("error updating likes and dislikes", error)
        }
    }

    const handleFetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3200/comment/fetchAllComments/${videoId}`);
            setComments(response.data.commentsWithOwner);
        }
        catch (error) {
            console.log("Some error occurred while fetching comments!!", error);
            return;
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post("http://localhost:3200/comment/addComment",
                {
                    videoId: video._id,
                    content: newComment,
                    userId: user._id,
                }
            )
            setNewComment("");
            await handleFetchComments()
        }
        catch (error) {
            console.log("Error occurred while adding new comment ", error);
            return;
        }
    };

    return (

        <div className="flex flex-col lg:flex-row w-full min-h-screen gap-4 px-4 py-4 box-border overflow-x-hidden">
            <div className='w-full h-full sticky top-0 self-start lg:w-2/3 h-64 lg:h-auto'>
                {video ? (
                    <div className="w-full max-w-6xl rounded-4xl border bg-slate-900">
                        <div className="p-4 sm:p-6 video-container w-full">
                            {/* Video */}
                            <video
                                src={video.videoURL}
                                controls
                                className="w-full bg-black max-h-[500px] border border-white rounded-4xl"
                            ></video>

                            {/* Title */}
                            <div className="mt-3 text-2xl font-bold text-white">
                                <h1>{video.title}</h1>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 text-white space-y-4 sm:space-y-0">
                                {/* Profile Image and Name */}
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={video.owner.profileImg}
                                        alt="Profile"
                                        className="rounded-full w-12 h-12 object-cover"
                                    />
                                    <div className="text-xl font-bold">{video.owner.fullName}</div>
                                </div>

                                {/* Subscribe Button */}
                                <button
                                    className="px-4 py-2 rounded-3xl bg-red-700 font-bold shadow shadow-red-900 w-fit"
                                    onClick={() => {
                                        handelSubscription(video.owner._id);
                                        setSubscribed(prev => !prev);
                                    }}
                                >
                                    {isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>

                                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                    {/* Like Button */}
                                    <motion.button
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 ${active === "like"
                                            ? "bg-green-500 shadow-lg"
                                            : "bg-gray-700 hover:bg-green-500"
                                            }`}
                                        onClick={() => handelLikeDislike(true, video._id)}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp size={20} />
                                            <span>{likes.length}</span>
                                            <span>Likes</span>
                                        </div>
                                    </motion.button>

                                    {/* Dislike Button */}
                                    <motion.button
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 ${active === "dislike"
                                            ? "bg-red-500 shadow-lg"
                                            : "bg-gray-700 hover:bg-red-500"
                                            }`}
                                        onClick={() => handelLikeDislike(false, video._id)}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <ThumbsDown size={20} />
                                            <span>{dislikes.length}</span>
                                            <span>Dislikes</span>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Video Details */}
                            <div className="mt-4 p-4 rounded-xl bg-slate-800">
                                <div className="flex flex-col sm:flex-row gap-2 text-lg font-bold text-white">
                                    <p> {video.views} views</p>
                                    <p>
                                        {new Date(video.uploadDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div
                                    className={`mt-3 text-white w-full transition-all duration-300 ease-in-out overflow-hidden ${showFullDescription ? "max-h-[500px]" : "max-h-[100px]"
                                        }`}
                                >
                                    <pre className="whitespace-pre-wrap break-words">
                                        {video.description}
                                    </pre>
                                </div>

                                <button
                                    className="text-blue-300 hover:underline mt-1"
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                >
                                    {showFullDescription ? "Show Less" : "Show More"}
                                </button>
                            </div>

                            <div className="comments text-white">
                                <h1 className="font-bold text-3xl mt-4">Comments</h1>
                                        {user && <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Type your comment here..."
                                        className="border rounded-md w-full py-1 pl-3 text-lg"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                                    >
                                        Post
                                    </button>
                                </div>}

                                {/* Render comments */}
                                <div className="mt-4 space-y-3">
                                    {comments.length === 0 ? (
                                        <p className="text-gray-300">No comments yet.</p>
                                    ) : (
                                        comments.map((comment) => (
                                            <div key={comment._id} className="bg-gray-800 p-4 rounded-md shadow-md mb-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={comment.commentOwner.profileImg}
                                                        alt="profile"
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <p className="text-white font-semibold text-lg">{comment.commentOwner.fullName}</p>
                                                </div>
                                                <p className="text-gray-200 mt-2 ml-1 text-base break-words">{comment.content}</p>
                                            </div>

                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading video...</p>
                )}
            </div>
            <div className='w-full lg:w-1/3 h-full '>
                <h1 className='font-bold text-4xl mb-3'>Recommended Videos</h1>

                <div className='h-full overflow-y-auto'>
                    {sideVideos && sideVideos.length > 0 && (
                        <div className="mb-10">
                            <div className="flex flex-col gap-4">
                                {sideVideos
                                    .filter((v) => v._id != video._id)
                                    .map((video) => (
                                        <SideVideo key={video._id} video={video} />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default ClickedVideo;