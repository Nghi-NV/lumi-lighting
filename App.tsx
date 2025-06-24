import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import NewProjectPage from './pages/NewProjectPage';
import DesignPage from './pages/DesignPage';
import PricingPage from './pages/PricingPage';
import ProjectsListPage from './pages/ProjectsListPage'; // Import the new page

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsListPage />} /> {/* Add new route */}
            <Route path="/new-project" element={<NewProjectPage />} />
            <Route path="/design/:projectId" element={<DesignPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            {/* Add more routes here, e.g., for dashboard, admin, user profile */}
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;