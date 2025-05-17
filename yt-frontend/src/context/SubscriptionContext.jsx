import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const [subscriptionList, setSubscriptionList] = useState([]);
    const { user } = useAuth();


    const fetchSubscription = async () => {
        if (!user) {
            setSubscriptionList([]);
            return;
        }
        try {
            const response = await axios.get(`https://dangle-video-watching-platform-2.onrender.com/user/getCreatorDetails`,
                { withCredentials: true }
            )
            setSubscriptionList(response.data.creatorsWithDetails)
        }
        catch (error) {
            console.log("Some error occurred while fetching subscriptions", error)
        }
    }

    const handelSubscription = async (creatorId) => {
        try {
            const response = await axios.put(`https://dangle-video-watching-platform-2.onrender.com/user/updateSubscription`,
                { creatorId: creatorId },
                { withCredentials: true }
            )
            fetchSubscription();
        }
        catch (error) {
            console.log("Error occurred at frontend related to handel subscription", error);
        }
    }

    useEffect(() => {
        fetchSubscription();
    }, [user]);

    return (
        <SubscriptionContext.Provider value={{ handelSubscription, fetchSubscription, subscriptionList }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('use subscription must be used within an Subscription provider');
    }
    return context;
}