import React from 'react';
import { Routes, Route,  } from 'react-router-dom';
import Logout from "./Pages/Logout" 
import Signup from './Pages/Signup';
import Login from './Pages/LoginPage';
import Notefound from './Pages/ErrorPage.jsx';
import TaskDashboard from './components/Layout/TaskDashboard.jsx';


const App = () => {
    return (
      <>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<TaskDashboard />} />
          <Route path="*" element={<Notefound />} />
        </Routes>
      </>
    );
};

export default App;