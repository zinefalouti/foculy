import "./styles/custom.css";
import "./index.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import { auth } from './firebase'; // Firebase import
import { onAuthStateChanged } from 'firebase/auth';

// Components
import Login from "./comps/login/login";
import SignUp from "./comps/login/signup";
import Dashboard from "./comps/dashboard/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";
import Onboarding from "./comps/onboarding/onboarding";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toggle theme
  const toggleTheme = () => setIsDark((prevIsDark) => !prevIsDark);

  // Monitor Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Show loading screen while waiting for Firebase auth state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <Routes>
        {/* Redirect "/" based on user authentication status */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Routes for unauthenticated users only: Redirect if logged in */}
        <Route 
          path="/login" 
          element={
            <AuthRedirectRoute user={user}>
              <Login isDark={isDark} ToggleTheme={toggleTheme} />
            </AuthRedirectRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRedirectRoute user={user}>
              <SignUp isDark={isDark} ToggleTheme={toggleTheme} />
            </AuthRedirectRoute>
          } 
        />

        {/* Protected route for authenticated users only: Dashboard */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard isDark={isDark} ToggleTheme={toggleTheme}/>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/onboarding/*" 
          element={
            <ProtectedRoute user={user}>
              <Onboarding isDark={isDark} Switcher={toggleTheme} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
