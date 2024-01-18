import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import WelcomePage from './WelcomePage';
import Signup from './SignupPage';
import Login from './LoginPage';
import HomePage from './HomePage';
import Profile from './Profile';
import UserInformation from './UserInformation';
import FamilyHistory from './FamilyHistory';
import MedicalHistory from './MedicalHistory';
import SymptomTracker from './SymptomTracker';
import Results from './Results';
import About from './About';




ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userinformation" element={<UserInformation />} />
        <Route path="/familyhistory" element={<FamilyHistory />} />
        <Route path="/medicalhistory" element={<MedicalHistory />} />
        <Route path="/symptomtracker" element={<SymptomTracker />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
