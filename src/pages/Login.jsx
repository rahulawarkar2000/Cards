import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // To handle error messages
  const [successMessage, setSuccessMessage] = useState(''); // To handle success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      console.log(response.data); // Log the response to see if the token exists

      if (response.status === 200) {
        // Store the token in local storage
        localStorage.setItem('token', response.data.token);
        
        // Set success message
        setSuccessMessage('Login successful! Redirecting to dashboard...');

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000); // Redirects after 2 seconds
      } else {
        setErrorMessage('Invalid login credentials');
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Error logging in. Please try again.');
    }
  };

  const handleSignup = () => {
    // Redirect to signup page 
    navigate('/signup');
  };

  return (
    <div className="login-container flex items-center justify-center h-screen">
    <div className="fade-in w-full max-w-md">
        <div className="card-container"> {/* Glass effect applied here */}
            <h2 className="text-2xl font-bold mb-6">👤 Login</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col text-left">
                    <label htmlFor="email" className="text-lg">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-2 text-base rounded-md border border-gray-300 mt-2"
                    />
                </div>
                <div className="flex flex-col text-left">
                    <label htmlFor="password" className="text-lg">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-2 text-base rounded-md border border-gray-300 mt-2"
                    />
                </div>
                <button type="submit" className="p-2 text-base rounded-md bg-green-600 text-white mt-4 hover:bg-green-700">
                    Login
                </button>
            </form>
            <button
                onClick={handleSignup}
                className="p-2 text-base rounded-md bg-blue-600 text-white mt-4 hover:bg-blue-700"
            >
                Sign Up
            </button>
        </div>
    </div>
</div>
  );
}

export default Login;
