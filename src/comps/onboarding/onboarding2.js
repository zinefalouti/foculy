import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Onboarding2() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState(null);  // Track user ID separately
  const navigate = useNavigate();

  // Check for user authentication on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);  // Store the authenticated user's ID
      } else {
        navigate("/login");  // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();  // Clean up the listener on unmount
  }, [navigate]);

  const handleNext = async (e) => {
    e.preventDefault();

    // Check if fields are filled
    if (!firstName || !lastName) {
      alert("Please fill in all fields.");
      return;
    }

    // Ensure user ID is available
    if (!userId) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    try {
      // Save user data to Firestore using userId
      const userDoc = doc(db, "users", userId);  // Use the stored userId
      await setDoc(userDoc, {
        firstName,
        lastName,
        // Additional user data can go here
      }, { merge: true });

      console.log("User data saved successfully");

      // Navigate to the next onboarding step
      navigate("/onboarding/onboard3");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("An error occurred while saving your data. Please try again.");
    }
  };

  return (
    <>
      <div className="onboardinghead">
        <h4>Setup your profile</h4>
        <h1>
          Setup Your <span>Foculy</span>
        </h1>
        <h2>2/3</h2>
      </div>
      <div className="onboardbody">
        <form onSubmit={handleNext}>
          <div className="InputZone">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Elizabeth"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="InputZone">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Pierce"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="VSpacer">
            <input
              type="submit"
              className="TheButton"
              value="Next"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default Onboarding2;

