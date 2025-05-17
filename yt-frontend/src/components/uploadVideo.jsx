import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Upload = () => {
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [videoURL, setVideoURL] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("ENTERTAINMENT");
    const [isEditing, setIsEditing] = useState(false)
    const [videoId, setVideoId] = useState("");

    const textAreaRef = useRef(null);

    const navigate = useNavigate();

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            const url = URL.createObjectURL(file);
            setVideoURL(url);
        }
    };

    useEffect(() => {

        if (location.state?.video) {
            const { _id, title, description, category } = location.state.video;
            setIsEditing(true);
            setVideoId(_id)
            setTitle(title);
            setDescription(description);
            setCategory(category);
        }
    }, [location])

    const handelDescriptionChange = (e) => {
        setDescription(e.target.value);
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }


    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpload = async () => {
        if (!video) {
            alert("Please select a video to upload!");
            return;
        }

        const formData = new FormData();
        formData.append("video", video);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);

        try {
            setLoading(true);
            setProgress(0);

            const response = await axios.post(
                "https://dangle-video-watching-platform-2.onrender.com/videos/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                }
            );

            alert("Video uploaded successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Failed to upload video");
        } finally {
            setLoading(false);
        }
        navigate('/videos/home')
    };

    const handelUpdateVideo = async () => {
        setLoading(true)
        setProgress(0);

        try {
            const response = await axios
                .put(`https://dangle-video-watching-platform-2.onrender.com/videos/updateVideo/${videoId}`,
                    { title, description, category },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                )
            alert("Video details Updated successfully!");

        }
        catch (error) {
            console.log("Error updating video details ", error);
            alert("Failed to update video");
        }
        finally {
            setLoading(false);
        }
        navigate('/videos/yourVideo')
    }

    return (
        <div className="container w-900  mt-10 ml-20 py-2 mx-auto  p-6 bg-white rounded-lg shadow-md">
            {/* Upload Video Section */}
            <div className="p-6 text-black text-lg font-bold rounded-md">
                {!isEditing && <>
                    <label className="font-semibold">Select the video: </label>
                    <button
                        onClick={handleButtonClick}
                        className="mt-1 text-sm p-2 px-3 border border-gray-500 bg-gray-100 text-black rounded-md hover:bg-gray-400"
                    >
                        Upload Video
                    </button>
                    <input
                        type="file"
                        accept="video/*"
                        ref={fileInputRef}
                        onChange={handleVideoChange}
                        className="hidden"
                    />

                    {/* Video Preview */}
                    {video && (
                        <div className="mt-4 bg-white p-2">
                            <video
                                src={videoURL}
                                controls
                                className="mt-2 w-full max-w-[500px] max-h-[300px] rounded-md shadow-md border border-gray-300"
                            />
                        </div>
                    )}
                </>}
            </div>

            {/* Title Input */}
            <div className="p-4 mt-4 rounded-md">
                <label className="font-semibold">Title</label>
                <input
                    type="text"
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-400 rounded"
                />
            </div>

            {/* Description Input */}
            <div className="p-4 mt-4 rounded-md">
                <label className="font-semibold">Description</label>
                <textarea
                    ref={textAreaRef}
                    placeholder="Enter video description"
                    value={description}
                    onChange={handelDescriptionChange}
                    className="w-full p-2 mt-1 border border-gray-400 rounded"
                    style={{ minHeight: "50px" }}
                ></textarea>
            </div>

            {/* Category Selection Dropdown */}
            <div className="p-4 mt-4 rounded-md">
                <label className="font-semibold">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-400 rounded"
                >
                    <option value="MUSIC">Music</option>
                    <option value="SPORTS">Sports</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="EDUCATION">Education</option>
                    <option value="GAMING">Gaming</option>
                </select>
            </div>

            {/* Upload Button & Progress Bar */}
            <div className="p-4 mt-4 rounded-md text-center">
                <button
                    onClick={isEditing ? handelUpdateVideo : handleUpload}
                    disabled={loading}
                    className={`px-6 py-2 font-bold rounded-lg transition ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Uploading..." : isEditing ? "Update" : "Publish"}
                </button>

                {/* Progress Bar */}
                {loading && (
                    <div className="mt-4 w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-blue-500 h-4 rounded-full animate-pulse transition-all duration-500 ease-in-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
