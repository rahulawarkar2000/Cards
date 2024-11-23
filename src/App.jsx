import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from '../src/pages/Signup';
import Dashboard from './pages/Dashboard';
import AddCard from './pages/Addcard'; 
import Description from './pages/Description';

import ProtectedRoute from '../proctected_routes/proctected_route';
import Update from './pages/Update';
import './App.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    
      <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
  
    <Route path="/add-card" element={<AddCard />} />  {/* Add this route */}
    <Route path="/description/:cardId" element={<Description />} />
    <Route path="/update/:cardId" element={<Update />} />

    </Routes>
  );
}

export default App;
