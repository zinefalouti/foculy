import React, { useState, useEffect } from 'react';
import AddIcon from '../../img/add.png';
import User from '../../img/user.png';
import UserNight from '../../img/user-night.png';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';  // Import auth and db
import { doc, getDoc } from 'firebase/firestore';  // Import Firestore methods
import Hamburger from '../../img/hamburger.png';
import MobileSidebar from './sidebarmobile'; // Import the new sidebar
import CloseIcon from '../../img/closebutton.png'; // Import the close icon image

function Header({ isDark }) {
  const [firstName, setFirstName] = useState(''); // State to store the first name
  const [loading, setLoading] = useState(true);  // Loading state to handle async calls
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

  useEffect(() => {
    // Fetch the current user's first name from Firestore
    const fetchFirstName = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // Get user's document from the 'users' collection
          const userDocRef = doc(db, 'users', currentUser.uid);  // Assuming the user's doc ID is the UID
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFirstName(userData.firstName || '');  // Set firstName from Firestore
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstName();
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading message while fetching the data
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <>
      <div className="grid grid-cols-12 Header gap-2">
        {/* Hamburger Icon */}
        <div className="block md:hidden col-span-4 Hamburger">
          <button onClick={toggleSidebar}>
            <img src={Hamburger} alt="Toggle Sidebar" />
          </button>
        </div>

        {/* Add Task Button */}
        <div className="col-span-8 md:col-span-12 lg:col-span-3">
          <Link className="SidebarButton Active" to="/dashboard/tasks/addtask">
            <img src={AddIcon} alt="Add Task" /> New Task
          </Link>
        </div>

        {/* Welcome Message and User Profile */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="headerleft">
            <h2>Welcome Back, <span>{firstName}</span></h2>
            <Link to="/profile">
              <img src={isDark ? UserNight : User} alt="User Profile" />
            </Link>
          </div>
        </div>
      </div>

      {/* Close button in header when sidebar is open */}
      {isSidebarOpen && (
        <div className="CloseButtonContainer">
          <button className="CloseButton" onClick={toggleSidebar}>
            <img src={CloseIcon} alt="Close Sidebar" />
          </button>
        </div>
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default Header;
