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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />}/>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/projects/recurring-fundraiser" element={<CreateFundraiserForm />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/project-confirm/:id" element={<ProjectConfirm />} />
        <Route path="/dashboard-creator/:id" element={<DashboardCreator />} />
        <Route path="/dashboard-donor/:id" element={<DashboardDonor />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/projects/approvedProjectsList" element={<ApprovedProjectsList />} />
        <Route path="/donations/stripe" element={<StripeDonationForm />} />
        <Route path="/projects/:creatorId" element={<CreatorProjectsList />} />
      </Routes>
    </Router>
  );
};

export default App;