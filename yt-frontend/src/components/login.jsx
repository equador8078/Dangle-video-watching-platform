import { use, useState } from "react";
import { User } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from 'axios'

const Login = () => {
    const { setUser } = useAuth();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handelLogin = async () => {

        try {
            const response = await axios.post("http://localhost:3200/user/login", {
                email, password
            }, { withCredentials: true });
            console.log(response.data)

            if (response.status === 200) {
                setUser({
                    fullName: response.data.user.fullName,
                    email: response.data.user.email,
                    profileImg: response.data.user.profileImg
                });
                navigate("/videos/home")
            }
            else {
                setError(response.data.message || "Login failed! Please try again.");
            }

            window.alert(response.data.message);
        } catch (error) {
            console.error("Some error occurred", error);
            if (error.status == 401) {
                window.alert("Invalid email or password!!");
            }
        }


    }

    return (
        <>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm w-full h-full flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">

                    <button
                        className="absolute px-2 py-1 top-2 right-2 text-xl font-bold border rounded-md cursor-pointer hover:bg-red-500 hover:text-white hover:border-black border border-transparent"
                        onClick={() => navigate('/videos/home')}
                    >
                        X
                    </button>

                    {/* Login Form */}
                    <div className=" inline-flex ">
                        <User size={30} /><h2 className="text-2xl font-semibold mb-6 ml-2">Login</h2>
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 mb-4 border rounded-md"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-6 border rounded-md"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full p-2 bg-blue-600 text-white rounded-md cursor-pointer"
                        onClick={handelLogin}>
                        Login
                    </button>
                    <div className="flex justify-center">
                        <span>Do not have an account? </span>
                        <Link to={'/user/signup'} className="text-blue-600 ml-2" >Create Account</Link>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Login;