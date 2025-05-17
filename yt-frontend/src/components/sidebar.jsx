import { ListVideo, Home, Video, ThumbsUp, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SubscriptionList from "./SubricptionList";
import { useEffect, useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const {user}=useAuth();

    const {fetchSubscription,subscriptionList}=useSubscription();
    

    return (
        <div>
            <div className={`fixed z-10 top-17 left-0 h-full bg-white shadow-md transition-transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                w-64 p-4 sm:w-40 md:w-48 lg:w-64 duration-300 ease-in-out`}
            >
                <div className="mt-3 grid grid-cols-1 gap-2">
                    <Link to="/videos/home">
                        <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
                            <Home size={20} /> <span>Home</span>
                        </div>
                    </Link>

                    <Link to="/user/history">
                        <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
                            <History size={20} /> <span>History</span>
                        </div>
                    </Link>

                    <Link to={"/videos/yourVideo"}>
                        <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
                            <Video size={20} /> <span>Your Videos</span>
                        </div>
                    </Link>

                    <Link to="/user/playList">
                        <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
                            <ListVideo size={20} /> <span>Playlist</span>
                        </div>
                    </Link>
                </div>

                <hr className="mt-10"></hr>
                    <h1 className="font-bold text-xl mt-2">Subscriptions</h1>
                {user ?
                    (subscriptionList && subscriptionList.length>0 ? (
                        subscriptionList.map((creator)=>(
                            <SubscriptionList key={creator.creator._id} isOpen={isOpen} creator={creator.creator} fetchSubscription={fetchSubscription}/>
                        ))
                    ):(
                        <h1 className="mt-2">Subscribed to nobody!</h1>
                    )
                ):(
                        <p>Please login first!</p>
                    )
                }

            </div>
        </div>
    );
};

export default Sidebar;
