import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import CreateFundraiserForm from './components/CreateFundraiserForm';
import ProjectDetails from './components/ProjectDetails';
import DashboardCreator from './pages/DashboardCreator';
import DashboardDonor from './pages/DashboardDonor';
import DashboardAdmin from './pages/DashboardAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm />}/>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/recurring-fundraiser" element={<CreateFundraiserForm />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/dashboard-creator/:id" element={<DashboardCreator />} />
        <Route path="/dashboard-donor/:id" element={<DashboardDonor />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
