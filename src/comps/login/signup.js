import React, { useState } from 'react';
import SignUpBg from '../../img/signupbg.png';
import LoginHeader from './loginHeader';
import PassToggle from '../../img/passwordtoggle.png';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp({isDark=false, ToggleTheme}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate(); // Initialize useNavigate

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error messages
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // After successful signup, redirect to /onboarding
      navigate('/onboarding');
    } catch (error) {
      console.error("Error registering:", error);
      setError(error.message); // Set error message to display
    }
  };

  return (
    <div className="LoginPanel grid grid-cols-12 container mx-auto">
      <div className="col-span-12 lg:col-span-6 xl:col-span-8 p-16">
        <LoginHeader isDark={isDark} handleChange={ToggleTheme} />

        <h1 className="mt-10 mb-12">
          Time To Join <span>Foculy</span>
        </h1>

        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

        <form onSubmit={handleRegister}>
          <div className="InputZone">
            <h4>Email Address</h4>
            <input
              type="email"
              id="email"
              placeholder="elizabethpierce@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="InputZone relative">
            <h4>Password</h4>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="PasswordToggle absolute right-0 top-0 mt-3 mr-3"
              onClick={togglePasswordVisibility}
            >
              <img src={PassToggle} alt="toggle visibility" />
            </button>
          </div>

          <h4 className="mt-6"><a href="#">Forgot Password?</a></h4>

          <div className="ButtonsArea">
            <button type="submit" className="TheButton">Register</button>
            <Link to="/login"><button type="button" className="SideButton">Login</button></Link>
          </div>
        </form>
      </div>
      <div className="hidden lg:block lg:col-span-6 xl:col-span-4">
        <img src={SignUpBg} alt="Foculy SignUp" />
      </div>
    </div>
  );
}

export default SignUp;
