import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/themes';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import { AppContainer, MainContent } from './styles/AppStyles';
import { LocalStorageProvider } from './context/LocalStorageContext';
import { WorkspaceProvider } from './context/WorkspaceContext';

function App() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
  };
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <LocalStorageProvider>
        <WorkspaceProvider>
          <GlobalStyles />
          <Router>
            <AppContainer>
              <Header toggleTheme={toggleTheme} theme={theme} />
              <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 60px)' }}>
                <Sidebar />
                <MainContent>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/workspace/:workspaceId" element={<Dashboard />} />
                    <Route path="/workspace/:workspaceId/page/:pageId" element={<Dashboard />} />
                  </Routes>
                </MainContent>
              </div>
            </AppContainer>
          </Router>
        </WorkspaceProvider>
      </LocalStorageProvider>
    </ThemeProvider>
  );
}

export default App; 