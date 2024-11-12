import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'; // Import the CSS file

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // State for showing the popup
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, email, password, confirmPassword } = formData;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage('Please fill out all fields.');
            return;
        }

        if (email.length < 15) {
            setErrorMessage('Email must be at least 10 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', { username, email, password });
            console.log('Signup success:', response.data);
            
            // Show success message popup
            setShowPopup(true);

            // Hide popup and redirect to login page after 2 seconds
            setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            setErrorMessage(error.response ? error.response.data.message : 'An error occurred during signup.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/');
    };

    const toggleShowPassword = () => {
        setShowPassword((prevShow) => !prevShow);
    };

    return (
        <div className="signup-container w-full h-screen">
            <div className="glass-effect fade-in"> {/* Apply glass effect here */}
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                {errorMessage && (
                    <div className="text-red-500 text-center mb-4">{errorMessage}</div>
                )}
                {showPopup && (
                    <div className="popup">Signup successful! Redirecting to login page...</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-left mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-left mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-left mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-left mb-2">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={toggleShowPassword}
                        />
                        <label htmlFor="showPassword">Show Password</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                    >
                        Sign Up
                    </button>
                </form>
                <button
                    onClick={handleLoginRedirect}
                    className="w-full mt-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                >
                    Already have an account? Log In
                </button>
            </div>
        </div>
    );
}

export default Signup;
