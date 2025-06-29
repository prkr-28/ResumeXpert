import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './pages/landingpage';
import UserProvider from './context/userContext';
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
