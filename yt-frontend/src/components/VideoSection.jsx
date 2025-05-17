import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoCard from './VideoCard';
import { useAIPanel } from "../context/PanelContext";

const VideoSection = () => {
    const { type } = useParams();
    const [videos, setVideo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    const { togglePanel, isAIPanelOpen } = useAIPanel();

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`https://dangle-video-watching-platform-2.onrender.com/videos/getAllVideos`,
                    {
                        params: {
                            isPlaylistVideos: false,
                            playlistVideoId: []
                        },
                        withCredentials: true
                    }
                );
                setVideo(response.data);
            }
            catch (error) {
                console.error("Error fetching videos", error);
                setVideo([]);
            }
            finally {
                setLoading(false)
            }
        }
        fetchVideos();
    }, [type]);

    const sendPromptToAi = async (prompt) => {
        setChatMessages((prev) => [...prev, { sender: "user", text: prompt }])
        setChatLoading(true);
        setPrompt("");
        try {
            const response = await axios.post("https://dangle-video-watching-platform-2.onrender.com/ai/getAiRecommendedVideos",
                {
                    prompt: prompt,
                })
            if (response) {
                setChatMessages((prev) => [...prev, { sender: "ai", text: response.data.reply }])
                setVideo(response.data.videos || [])
            }
            else {
                console.log("No response has been received!")
            }
        }
        catch (error) {
            console.log("error while sending prompt ", error);
            return;
        }
        finally {
            setChatLoading(false);
        }
    }

    return (
        <div className="video-section w-full p-4">
            <div className="relative w-full h-full">
                <div className="flex w-full transition-all duration-700 ease-in-out relative">
                    {/* Left Panel: Video List */}
                    <div
                        className={`transition-all duration-700 ${isAIPanelOpen ? "w-1/2" : "w-full"
                            }`}
                    >
                    <div
                    className="
                    mt-3
                    video-card-container
                    flex flex-wrap
                    gap-x-3 gap-y-10
                    overflow-y-auto
                    "
                        >
                            {Array.isArray(videos) &&
                                videos
                                .filter((video)=>video.archive===false)
                                .map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))}
                        </div>
                    </div>

                    {/* Right Panel: Fixed Height & Scrollable */}
                    {isAIPanelOpen && (
                        <div className="bg-gray-100 w-1/2 h-screen sticky top-30 transition-all border rounded-md duration-700 flex flex-col" style={{ maxHeight: "80vh" }}>
                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
                                <div
                                    onClick={togglePanel}
                                    className="hover:bg-gray-300 text-black font-bold w-40 p-1 border rounded-md cursor-pointer flex items-center justify-center mb-4"
                                >
                                    Close chat
                                </div>

                                <p className="text-lg font-semibold">Search with Dangle AI</p>
                                <p className="text-sm text-gray-600 mb-4">Get precise results and search with Dangle AI.</p>

                                {/* Chat Messages */}
                                <div className="space-y-3">
                                    {chatMessages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`max-w-[80%] px-4 py-2 rounded-md text-sm whitespace-pre-line ${msg.sender === "user"
                                                ? "bg-gray-700 text-white self-end ml-auto"
                                                : "bg-gray-300 text-black self-start"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="bg-gray-300 text-black px-4 py-2 rounded-md text-sm self-start animate-pulse max-w-[80%]">
                                            Searching...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input at the bottom */}
                            <div className="border-t p-2 bg-white">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Type here..."
                                        className="w-full bg-gray-100 border border-gray-300 rounded-md pr-12 pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button
                                        onClick={() => sendPromptToAi(prompt)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default VideoSection;