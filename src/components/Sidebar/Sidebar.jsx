import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEdit2, FiFolder, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button, FlexContainer } from '../../styles/AppStyles';

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100%;
  background-color: ${props => props.theme.background};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-250px'};
    top: 60px;
    z-index: 99;
    transition: left 0.3s ease;
    height: calc(100vh - 60px);
    box-shadow: ${props => props.isOpen ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 12px;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const WorkspaceItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  background-color: ${props => props.active ? `${props.theme.primary}10` : 'transparent'};
  transition: background-color 0.2s;
  border-radius: 4px;
  margin: 0 8px;
  
  &:hover {
    background-color: ${props => props.theme.backgroundTertiary};
  }
`;

const WorkspaceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${props => props.active ? '600' : '400'};
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WorkspaceIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.color || props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
`;

const PagesList = styled.div`
  margin-top: 4px;
  margin-left: 16px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const PageItem = styled.div`
  padding: 6px 8px 6px 16px;
  margin: 2px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  background-color: ${props => props.active ? `${props.theme.primary}10` : 'transparent'};
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme.backgroundTertiary};
  }
`;

const PageIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
`;

const PageName = styled.div`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${props => props.active ? '500' : 'normal'};
`;

const SidebarFooter = styled.div`
  padding: 16px;
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.border};
`;

const WorkspaceActions = styled.div`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.backgroundTertiary};
    color: ${props => props.theme.text};
  }
  
  &.danger:hover {
    color: ${props => props.theme.danger};
  }
`;

const WorkspaceForm = styled.form`
  padding: 8px 16px;
  margin: 0 8px;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 4px;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ColorOption = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'white' : 'transparent'};
  outline: ${props => props.selected ? `1px solid ${props.color}` : 'none'};
  background-color: ${props => props.color};
  cursor: pointer;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const { 
    workspaces, 
    currentWorkspaceId, 
    currentPageId,
    setCurrentWorkspaceId,
    setCurrentPageId,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    createPage,
    updatePage,
    deletePage
  } = useWorkspace();
  
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({});
  const [hoveredWorkspace, setHoveredWorkspace] = useState(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState('');
  
  const COLORS = [
    '#2563eb', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#10b981', // Green
    '#14b8a6', // Teal
    '#6b7280', // Gray
  ];
  
  // Toggle workspace expansion
  const toggleWorkspaceExpand = (workspaceId) => {
    setExpandedWorkspaces({
      ...expandedWorkspaces,
      [workspaceId]: !expandedWorkspaces[workspaceId]
    });
  };
  
  // Handle workspace click
  const handleWorkspaceClick = (workspaceId) => {
    setCurrentWorkspaceId(workspaceId);
    navigate(`/workspace/${workspaceId}`);
    
    // Auto-expand the clicked workspace
    if (!expandedWorkspaces[workspaceId]) {
      toggleWorkspaceExpand(workspaceId);
    }
  };
  
  // Handle page click
  const handlePageClick = (workspaceId, pageId) => {
    setCurrentWorkspaceId(workspaceId);
    setCurrentPageId(pageId);
    navigate(`/workspace/${workspaceId}/page/${pageId}`);
  };
  
  // Handle creating a new workspace
  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    
    if (newWorkspaceName.trim()) {
      const newWorkspace = createWorkspace(newWorkspaceName.trim(), selectedColor);
      setCurrentWorkspaceId(newWorkspace.id);
      navigate(`/workspace/${newWorkspace.id}`);
      
      // Reset form
      setNewWorkspaceName('');
      setIsCreatingWorkspace(false);
    }
  };
  
  // Handle editing a workspace
  const handleEditWorkspace = (e) => {
    e.preventDefault();
    
    if (editWorkspaceName.trim() && isEditingWorkspace) {
      updateWorkspace(isEditingWorkspace, {
        name: editWorkspaceName.trim(),
        color: selectedColor
      });
      
      // Reset form
      setEditWorkspaceName('');
      setIsEditingWorkspace(null);
    }
  };
  
  // Handle deleting a workspace
  const handleDeleteWorkspace = (workspaceId) => {
    if (window.confirm('Are you sure you want to delete this workspace? All pages will be lost.')) {
      deleteWorkspace(workspaceId);
    }
  };
  
  // Start editing a workspace
  const startEditingWorkspace = (workspace) => {
    setIsEditingWorkspace(workspace.id);
    setEditWorkspaceName(workspace.name);
    setSelectedColor(workspace.color);
  };
  
  // Handle creating a new page
  const handleCreatePage = (workspaceId) => {
    const newPage = createPage('Untitled Page', '📄', workspaceId);
    if (newPage) {
      setCurrentWorkspaceId(workspaceId);
      setCurrentPageId(newPage.id);
      navigate(`/workspace/${workspaceId}/page/${newPage.id}`);
      
      // Ensure the workspace is expanded
      if (!expandedWorkspaces[workspaceId]) {
        toggleWorkspaceExpand(workspaceId);
      }
    }
  };
  
  // Handle deleting a page
  const handleDeletePage = (e, workspaceId, pageId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this page?')) {
      deletePage(pageId, workspaceId);
    }
  };
  
  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarHeader>Workspaces</SidebarHeader>
        
        {workspaces.map(workspace => (
          <React.Fragment key={workspace.id}>
            {isEditingWorkspace === workspace.id ? (
              <WorkspaceForm onSubmit={handleEditWorkspace}>
                <input
                  type="text"
                  value={editWorkspaceName}
                  onChange={(e) => setEditWorkspaceName(e.target.value)}
                  placeholder="Workspace name"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid',
                    borderColor: 'inherit',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    marginBottom: '8px'
                  }}
                  autoFocus
                />
                
                <ColorPicker>
                  {COLORS.map(color => (
                    <ColorOption
                      key={color}
                      color={color}
                      selected={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    />
                  ))}
                </ColorPicker>
                
                <FlexContainer $justifyContent="flex-end" style={{ marginTop: '8px' }}>
                  <Button
                    type="button"
                    onClick={() => setIsEditingWorkspace(null)}
                    style={{ marginRight: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" $primary>
                    Save
                  </Button>
                </FlexContainer>
              </WorkspaceForm>
            ) : (
              <WorkspaceItem
                active={workspace.id === currentWorkspaceId}
                onClick={() => handleWorkspaceClick(workspace.id)}
                onMouseEnter={() => setHoveredWorkspace(workspace.id)}
                onMouseLeave={() => setHoveredWorkspace(null)}
              >
                <WorkspaceTitle
                  active={workspace.id === currentWorkspaceId}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWorkspaceExpand(workspace.id);
                  }}
                >
                  {expandedWorkspaces[workspace.id] ? (
                    <FiChevronDown size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  )}
                  <WorkspaceIcon color={workspace.color}>
                    <FiFolder size={10} />
                  </WorkspaceIcon>
                  {workspace.name}
                </WorkspaceTitle>
                
                <WorkspaceActions isVisible={hoveredWorkspace === workspace.id}>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreatePage(workspace.id);
                    }}
                    title="New page"
                  >
                    <FiPlus size={14} />
                  </ActionButton>
                  
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingWorkspace(workspace);
                    }}
                    title="Edit workspace"
                  >
                    <FiEdit2 size={14} />
                  </ActionButton>
                  
                  <ActionButton
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkspace(workspace.id);
                    }}
                    title="Delete workspace"
                  >
                    <FiTrash2 size={14} />
                  </ActionButton>
                </WorkspaceActions>
              </WorkspaceItem>
            )}
            
            <PagesList isOpen={expandedWorkspaces[workspace.id]}>
              {workspace.pages.map(page => (
                <PageItem
                  key={page.id}
                  active={page.id === currentPageId}
                  onClick={() => handlePageClick(workspace.id, page.id)}
                >
                  <PageIcon>{page.icon}</PageIcon>
                  <PageName active={page.id === currentPageId}>{page.name}</PageName>
                  
                  <ActionButton
                    className="danger"
                    onClick={(e) => handleDeletePage(e, workspace.id, page.id)}
                    title="Delete page"
                    style={{ visibility: page.id === currentPageId ? 'visible' : 'hidden' }}
                  >
                    <FiTrash2 size={14} />
                  </ActionButton>
                </PageItem>
              ))}
            </PagesList>
          </React.Fragment>
        ))}
        
        {isCreatingWorkspace ? (
          <WorkspaceForm onSubmit={handleCreateWorkspace}>
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid',
                borderColor: 'inherit',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'inherit',
                marginBottom: '8px'
              }}
              autoFocus
            />
            
            <ColorPicker>
              {COLORS.map(color => (
                <ColorOption
                  key={color}
                  color={color}
                  selected={selectedColor === color}
                  onClick={() => setSelectedColor(color)}
                  type="button"
                />
              ))}
            </ColorPicker>
            
            <FlexContainer $justifyContent="flex-end" style={{ marginTop: '8px' }}>
              <Button
                type="button"
                onClick={() => setIsCreatingWorkspace(false)}
                style={{ marginRight: '8px' }}
              >
                Cancel
              </Button>
              <Button type="submit" $primary>
                Create
              </Button>
            </FlexContainer>
          </WorkspaceForm>
        ) : (
          <WorkspaceItem
            onClick={() => setIsCreatingWorkspace(true)}
            style={{ color: '#666' }}
          >
            <WorkspaceTitle>
              <FiPlus size={16} />
              Add Workspace
            </WorkspaceTitle>
          </WorkspaceItem>
        )}
      </SidebarSection>
      
      <SidebarFooter>
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
          TrackFlow v1.0.0
          <div style={{ marginTop: '4px' }}>
            All data is stored locally
          </div>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar; 