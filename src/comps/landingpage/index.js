import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import the function to check authentication state

function LandingPage() {
  const [user, setUser] = useState(null); // State to track if the user is logged in

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update state based on login status
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Landing Page</h1>

      {/* Conditionally render based on whether the user is logged in */}
      {user ? (
        <h2><Link to="/dashboard">Access Foculy</Link></h2>
      ) : (
        <>
          <h2><Link to="/login">Login</Link></h2>
          <h2><Link to="/register">Register</Link></h2>
        </>
      )}
    </div>
  );
}

export default LandingPage;
