import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StripeDonationForm from './components/StripeDonationForm';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import CreateFundraiserForm from './pages/CreateFundraiserForm';
import ProjectsList from './pages/ProjectsList';
import ProjectDetails from './pages/ProjectDetails';
import ProjectConfirm from './pages/ProjectConfirm';
import DashboardCreator from './pages/DashboardCreator';
import DashboardDonor from './pages/DashboardDonor';
import DashboardAdmin from './pages/DashboardAdmin';
import ApprovedProjectsList from './pages/approvedProjectsList';
import CreatorProjectsList from './pages/ProjectsByCreator';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route path="/register" element={<RegistrationForm />}/>
        <Route path="/login" element={<LoginForm />} />
        
        {/* Project Routes */}
        <Route path="/projects/recurring-fundraiser" element={<CreateFundraiserForm />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/project-confirm/:id" element={<ProjectConfirm />} />
        <Route path="/projects/approvedProjectsList" element={<ApprovedProjectsList />} />
        <Route path="/projects/creator/:creatorId" element={<CreatorProjectsList />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard-creator/:id" element={<DashboardCreator />} />
        <Route path="/dashboard-donor/:id" element={<DashboardDonor />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        
        {/* Payment Routes */}
        <Route path="/donations/stripe" element={<StripeDonationForm />} />
      </Routes>
    </Router>
  );
};

export default App;