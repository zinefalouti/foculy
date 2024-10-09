import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import LoginBg from "../../img/loginbg.png";
import LoginHeader from "./loginHeader";
import PassToggle from "../../img/passwordtoggle.png";
import ForgotPasswordModal from "./forgotpassmodal";

function Login({ isDark = false, ToggleTheme }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State for 'Remember Me' checkbox
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Set persistence based on the Remember Me checkbox
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

      await setPersistence(auth, persistence); // Set Firebase persistence

      // Now sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Login successful! Redirecting to dashboard...");

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to login: Please enter the correct credentials.");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    
  const toggleForgotPasswordModal = () => {
      setForgotPasswordOpen(!isForgotPasswordOpen);
  };

  return (
    <div className="LoginPanel grid grid-cols-12 container mx-auto">
      <div className="col-span-12 lg:col-span-6 xl:col-span-8 p-16">
        <LoginHeader isDark={isDark} handleChange={ToggleTheme} />
        <h1 className="mt-10 mb-12">Dive Back into <span>Foculy</span></h1>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              <img src={PassToggle} alt="Toggle Password" />
            </button>
          </div>
          <div className="CheckArea">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} // Update rememberMe state
              />
              <span className="checkmark"></span>
              Remember Me
            </label>
            <h4><a href="#" onClick={toggleForgotPasswordModal}>Forgot Password?</a></h4>

          </div>

          <div className="ButtonsArea">
            <button type="submit" className="TheButton">Login</button>
            <Link to="/register" className="SideButton">Register</Link>
          </div>
        </form>
        <ForgotPasswordModal 
                isOpen={isForgotPasswordOpen} 
                onClose={toggleForgotPasswordModal} 
            />
      </div>
      <div className="hidden lg:block lg:col-span-6 xl:col-span-4">
        <img src={LoginBg} alt="Foculy Login" />
      </div>
    </div>
  );
}

export default Login;
