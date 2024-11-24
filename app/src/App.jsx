import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './Pages/auth';
import Chat from './Pages/Chat';
import Profile from './Pages/Profile';
import { useAppStore } from './Store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/Constants';

// Private route to handle authenticated user access
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // Corrected boolean logic
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Auth route to redirect authenticated users away from login

const App = () => {
  const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo; // Corrected boolean logic
     return isAuthenticated ? <Navigate to="/chat" /> : children;
  };
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true); // Correctly initialized `loading`

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false); // Corrected state setter function name
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<PrivateRoute><Chat/></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// pass rhMKfeKJNi2nrCUq
//name rathodpratik1928
//url mongodb+srv://rathodpratik1928:rhMKfeKJNi2nrCUq@chatapp.c5vx2.mongodb.net/