import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMoon, FiSun, FiMenu, FiPlus, FiSettings, FiDownload, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLocalStorage } from '../../context/LocalStorageContext';
import { Button, FlexContainer } from '../../styles/AppStyles';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: ${props => props.theme.background};
  border-bottom: 1px solid ${props => props.theme.border};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  box-shadow: ${props => props.theme.shadow};
  padding: 8px 0;
  z-index: 10;
  margin-top: 8px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const UserMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  background: transparent;
  border: none;
  text-align: left;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;

  &:hover {
    background-color: ${props => props.theme.backgroundTertiary};
  }

  &.danger {
    color: ${props => props.theme.danger};
  }
`;

const Header = ({ toggleTheme, theme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { 
    getCurrentWorkspace, 
    createPage,
    setCurrentPageId 
  } = useWorkspace();
  const { exportAllData, importData, resetAllData } = useLocalStorage();
  
  const workspace = getCurrentWorkspace();
  
  const handleCreatePage = () => {
    const newPage = createPage('Untitled Page');
    if (newPage) {
      setCurrentPageId(newPage.id);
    }
    setMenuOpen(false);
  };
  
  const handleExportData = () => {
    const data = exportAllData();
    if (!data) return;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMenuOpen(false);
  };
  
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          importData(data);
          window.location.reload(); // Reload to reflect changes
        } catch (error) {
          console.error('Failed to import data:', error);
          alert('Failed to import data. Please make sure the file is a valid TrackFlow backup.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
    setMenuOpen(false);
  };
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetAllData();
      window.location.reload(); // Reload to reflect changes
    }
    setMenuOpen(false);
  };
  
  return (
    <HeaderContainer>
      <FlexContainer>
        <MenuButton>
          <FiMenu />
        </MenuButton>
        <Logo>
          <span>TrackFlow</span>
        </Logo>
      </FlexContainer>
      
      <FlexContainer gap="16px">
        <Button onClick={handleCreatePage}>
          <FiPlus size={16} />
          New Page
        </Button>
        
        <Button onClick={() => toggleTheme()}>
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
        </Button>
        
        <UserMenu>
          <Button onClick={() => setMenuOpen(!menuOpen)}>
            <FiSettings size={16} />
          </Button>
          
          <UserMenuDropdown isOpen={menuOpen}>
            <UserMenuItem onClick={handleExportData}>
              <FiDownload size={14} />
              Export Data
            </UserMenuItem>
            <UserMenuItem onClick={handleImportData}>
              <FiUpload size={14} />
              Import Data
            </UserMenuItem>
            <UserMenuItem className="danger" onClick={handleResetData}>
              <FiTrash2 size={14} />
              Reset All Data
            </UserMenuItem>
          </UserMenuDropdown>
        </UserMenu>
      </FlexContainer>
    </HeaderContainer>
  );
};

export default Header; 