import React from 'react';
import Layout from '../components/Layout/Layout';
import StudyPlanGenerator from '../components/AI/StudyPlanGenerator';

const StudyPlanPage: React.FC = () => {
  return (
    <Layout>
      <StudyPlanGenerator />
    </Layout>
  );
};

export default StudyPlanPage;