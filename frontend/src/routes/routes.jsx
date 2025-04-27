import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import TaskTracker from '../components/TaskBoard/TaskBoard';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Notfound from '../pages/notfound.jsx'
const Routing = () => {
  return (
      <Routes>
        <Route path="/" element={<TaskTracker />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='*' element={<Notfound/>}/>
      </Routes>
  );
};

export default Routing;
