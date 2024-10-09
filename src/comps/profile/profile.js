import React, { useState, useEffect } from 'react';
import PassToggle from '../../img/passwordtoggle.png';
import { auth, db } from '../../firebase'; // Firebase imports
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import ThemeToggle from '../dashboard/themeToggle';

function Profile({ isDark, ToggleFunction }) {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // For re-authentication
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for redirecting the user

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Fetch Firestore user data
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setEmail(currentUser.email); // Get the email from Firebase auth
            setUser(currentUser);
          } else {
            console.error('No user profile found in Firestore.');
            alert('User profile not found. Please contact support.');
          }
        } else {
          console.error('No user is signed in.');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const reauthenticateUser = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword // This is the current password provided by the user for re-authentication
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      console.log('User re-authenticated successfully');
      return true;
    } catch (error) {
      console.error('Error re-authenticating user: ', error);
      alert('Re-authentication failed. Please make sure your current password is correct.');
      return false;
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        throw new Error('No authenticated user found.');
      }

      // Re-authenticate the user before updating sensitive info
      const isReauthenticated = await reauthenticateUser();
      if (!isReauthenticated) return; // Stop if re-authentication fails

      // Update Firestore profile fields
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName,
        lastName,
      });

      // Update email in Firebase Authentication if changed
      if (email !== user.email) {
        await updateEmail(user, email);
        console.log('Email updated successfully.');
      }

      // Update password if the password field is not empty
      if (password) {
        await updatePassword(user, password);
        console.log('Password updated successfully.');
      }

      // After the update, log the user out and redirect them to the login page
      await signOut(auth);
     
      navigate('/login'); // Redirect to login page

    } catch (error) {
      console.error('Error updating profile: ', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <>
      <div className="col-span-12">
        <div className="Detail">
          <h2>Update Your <span>Profile</span></h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="InputZone">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
                required
              />
            </div>
            <div className="InputZone relative">
              <label>Current Password (for re-authentication)</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                required
              />
            </div>
            <div className="InputZone relative">
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
              />
              <button
                type="button"
                className="PasswordToggle absolute right-0 top-0 mt-3 mr-3"
                onClick={togglePasswordVisibility}
              >
                <img src={PassToggle} alt="Toggle Password" />
              </button>
            </div>
            <div className="InputZone">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Elizabeth"
                required
              />
            </div>
            <div className="InputZone">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pierce"
                required
              />
            </div>
            <button type="submit" className="TheButton mt-4">Update</button>
          </form>
        </div>
      </div>

      <ThemeToggle isDark={isDark} ToggleFunction={ToggleFunction} />
    </>
  );
}

export default Profile;
