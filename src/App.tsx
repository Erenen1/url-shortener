import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LogViewer from './components/LogViewer';
import Sidebar from './components/Sidebar';
import WorldMap from './features/analytics/components/WorldMap';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={
              <div className="p-4 sm:p-6 lg:p-8 bg-gray-50">
                <div className="max-w-[1600px] mx-auto">
                  <Dashboard />
                </div>
              </div>
            } />
            <Route path="/map" element={<WorldMap />} />
            <Route path="/logs" element={
              <div className="p-4 sm:p-6 lg:p-8 bg-gray-50">
                <div className="max-w-[1600px] mx-auto">
                  <LogViewer />
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
