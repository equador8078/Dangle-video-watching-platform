import { useState } from "react";
import { User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUp = () => {
    const [fullName, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("https://dangle-video-watching-platform-2.onrender.com/user/signup", {
                fullName, password, email
            })
            console.log(response.data.message);
            setError("");
            navigate("/user/login")
            window.alert("Sign up successfully! Please login!")
            // window.alert(response.data.message);
        }
        catch (error) {
            console.log(error)
            if (error.response && error.response.status == 400) {
                setError("User already exists. Please log in");
                window.alert("User already exists!")
            } else {
                setError("Something went wrong!! Please try again!!");
                window.alert("User not exists!")
            }
        }
        console.log("Sign up successful!");
        return;
    };

    return (
        <>

                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">

                        {/* Close Button */}
                        <button
                            className="absolute px-2 py-1 top-2 right-2 text-xl border rounded-md font-bold cursor-pointer hover:bg-red-500 hover:text-white hover:border-black border border-transparent"
                            onClick={() => navigate('/videos/home')}                        >
                            X
                        </button>

                        {/* Sign Up Form */}
                        <div className="inline-flex items-center mb-6">
                            <User size={30} />
                            <h2 className="text-2xl font-semibold ml-2">Sign Up</h2>
                        </div>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={fullName}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mb-4 border rounded-md"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mb-4 border rounded-md"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mb-4 border rounded-md"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 mb-6 border rounded-md"
                        />
                        <button
                            className="w-full p-2 bg-green-600 text-white rounded-md mb-4"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>

                        {/* "Already have an account?" Section */}
                        <div className="flex justify-center">
                            <span>Already have an account? </span>
                            <button className="text-blue-600 ml-2" onClick={() => navigate("/user/login")}>Log In</button>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default SignUp;
