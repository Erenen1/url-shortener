import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LogViewer from './components/LogViewer';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-page">
        <Sidebar />
        <main className="flex-grow p-sm bg-page">
          <div className="max-w-[1600px] mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/logs" element={<LogViewer />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
