import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import CloseButton from '../../img/closebutton.png';

function ForgotPasswordModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setMessage(''); // Clear previous messages

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setMessage("Failed to send password reset email: " + error.message);
        }
    };

    if (!isOpen) return null; // Don't render if modal is not open

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}><img src={CloseButton}/></span>
                <h1>Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="InputZone">
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    </div>
                    <button type="submit">Reset Password</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default ForgotPasswordModal;
