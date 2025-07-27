import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminSidebar from './Components/AdminSidebar/AdminSidebar';
import AdminHeader from './Components/AdminHeader/AdminHeader';
import Dashboard from './Pages/Dashboard';
import PaymentDetails from './Pages/PaymentDetails';
import SubscribedPlans from './Pages/SubscribedPlans';
import Activity from './Pages/Activity';
import Home from './Pages/Home';
import Auth from './Pages/Auth';
import About from './Pages/About';
import Contact from './Pages/Contact';
// At the top
import MyInfo from './Components/MyInfo/MyInfo';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderAdminPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'payment-details':
        return <PaymentDetails />;
      case 'subscribed-plans':
        return <SubscribedPlans />;
      case 'activity':
        return <Activity />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/myinfo" element={<MyInfo />} />


        {/* Admin Dashboard Routes */}
        <Route
          path="/admin/*"
          element={
            <div className="admin-container">
              <AdminSidebar activePage={activePage} setActivePage={setActivePage} />
              <div className="admin-main">
                <AdminHeader />
                {renderAdminPage()}
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;