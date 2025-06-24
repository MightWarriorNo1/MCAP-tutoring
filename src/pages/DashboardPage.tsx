import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import TutorDashboard from '../components/Dashboard/TutorDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Layout from '../components/Layout/Layout';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'tutor':
        return <TutorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Loading dashboard...</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

export default DashboardPage;