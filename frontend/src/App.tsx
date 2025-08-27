import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { client } from './lib/appolo';
import { OrganizationProvider } from './contexts/OrganizationContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';

function App() {
  return (
    <ApolloProvider client={client}>
      <OrganizationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:projectId" element={<ProjectView />} />
            </Routes>
          </Layout>
        </Router>
      </OrganizationProvider>
    </ApolloProvider>
  );
}

export default App;