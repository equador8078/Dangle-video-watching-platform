import { useEffect, useState, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {data} = await axios.get('https://dangle-video-watching-platform-2.onrender.com/user/me',
                    { withCredentials: true }
                );

                if(data.user) setUser(data.user);
            }

            catch (error) {
                console.log("some error occurred at AuthProvider", error);
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        }
        checkAuth();

    }, [])

        const logout=async ()=>{
            try{
                await axios.post('https://dangle-video-watching-platform-2.onrender.com/user/logout',
                    {},{withCredentials:true}
                )
                setUser(null);
            }
            catch(error){
                console.log("Some error occurred while logging out at Auth", error)
            }
        }


    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};