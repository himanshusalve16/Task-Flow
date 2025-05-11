import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './LocalStorageContext';

const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const { saveData, getData } = useLocalStorage();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load workspaces from localStorage on mount
  useEffect(() => {
    const loadWorkspaces = () => {
      setIsLoading(true);
      const savedWorkspaces = getData('workspaces', []);
      
      if (savedWorkspaces.length === 0) {
        // Create default workspace if none exists
        const defaultWorkspace = createDefaultWorkspace();
        setWorkspaces([defaultWorkspace]);
        setCurrentWorkspaceId(defaultWorkspace.id);
        setCurrentPageId(defaultWorkspace.pages[0].id);
        saveData('workspaces', [defaultWorkspace]);
      } else {
        setWorkspaces(savedWorkspaces);
        
        // Load last active workspace and page
        const lastActiveWorkspaceId = getData('lastActiveWorkspace');
        const lastActivePageId = getData('lastActivePage');
        
        const workspaceExists = lastActiveWorkspaceId && 
          savedWorkspaces.some(w => w.id === lastActiveWorkspaceId);
        
        if (workspaceExists) {
          setCurrentWorkspaceId(lastActiveWorkspaceId);
          
          const workspace = savedWorkspaces.find(w => w.id === lastActiveWorkspaceId);
          const pageExists = lastActivePageId && 
            workspace.pages.some(p => p.id === lastActivePageId);
            
          if (pageExists) {
            setCurrentPageId(lastActivePageId);
          } else if (workspace.pages.length > 0) {
            setCurrentPageId(workspace.pages[0].id);
          }
        } else if (savedWorkspaces.length > 0) {
          setCurrentWorkspaceId(savedWorkspaces[0].id);
          
          if (savedWorkspaces[0].pages.length > 0) {
            setCurrentPageId(savedWorkspaces[0].pages[0].id);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    loadWorkspaces();
  }, []);
  
  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && workspaces.length > 0) {
      saveData('workspaces', workspaces);
    }
  }, [workspaces, isLoading]);
  
  // Save last active workspace and page
  useEffect(() => {
    if (currentWorkspaceId) {
      saveData('lastActiveWorkspace', currentWorkspaceId);
    }
    
    if (currentPageId) {
      saveData('lastActivePage', currentPageId);
    }
  }, [currentWorkspaceId, currentPageId]);
  
  // Helper function to create a default workspace
  const createDefaultWorkspace = () => {
    const defaultPageId = uuidv4();
    
    return {
      id: uuidv4(),
      name: 'Personal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [
        {
          id: defaultPageId,
          name: 'Getting Started',
          icon: '📝',
          blocks: [
            {
              id: uuidv4(),
              type: 'text',
              content: '# Welcome to TrackFlow\n\nThis is your first workspace. You can create pages, add blocks, and customize everything to your needs.',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: uuidv4(),
              type: 'todo',
              content: [
                { id: uuidv4(), text: 'Create your first task list', completed: false },
                { id: uuidv4(), text: 'Try out the different block types', completed: false },
                { id: uuidv4(), text: 'Customize your workspace', completed: false }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      color: '#2563eb'
    };
  };
  
  // Get current workspace
  const getCurrentWorkspace = () => {
    if (!currentWorkspaceId) return null;
    return workspaces.find(w => w.id === currentWorkspaceId) || null;
  };
  
  // Get current page
  const getCurrentPage = () => {
    const workspace = getCurrentWorkspace();
    if (!workspace || !currentPageId) return null;
    return workspace.pages.find(p => p.id === currentPageId) || null;
  };
  
  // Create a new workspace
  const createWorkspace = (name, color = '#2563eb') => {
    const newWorkspace = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [],
      color
    };
    
    setWorkspaces([...workspaces, newWorkspace]);
    return newWorkspace;
  };
  
  // Update a workspace
  const updateWorkspace = (id, updates) => {
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === id) {
        return {
          ...workspace,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
  };
  
  // Delete a workspace
  const deleteWorkspace = (id) => {
    const updatedWorkspaces = workspaces.filter(workspace => workspace.id !== id);
    setWorkspaces(updatedWorkspaces);
    
    if (currentWorkspaceId === id) {
      if (updatedWorkspaces.length > 0) {
        setCurrentWorkspaceId(updatedWorkspaces[0].id);
        if (updatedWorkspaces[0].pages.length > 0) {
          setCurrentPageId(updatedWorkspaces[0].pages[0].id);
        } else {
          setCurrentPageId(null);
        }
      } else {
        setCurrentWorkspaceId(null);
        setCurrentPageId(null);
      }
    }
  };
  
  // Create a new page in the current workspace
  const createPage = (name, icon = '📄', workspaceId = currentWorkspaceId) => {
    if (!workspaceId) return null;
    
    const newPage = {
      id: uuidv4(),
      name,
      icon,
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          pages: [...workspace.pages, newPage],
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    return newPage;
  };
  
  // Update a page
  const updatePage = (pageId, updates, workspaceId = currentWorkspaceId) => {
    if (!workspaceId) return false;
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedPages = workspace.pages.map(page => {
          if (page.id === pageId) {
            return {
              ...page,
              ...updates,
              updatedAt: new Date().toISOString()
            };
          }
          return page;
        });
        
        return {
          ...workspace,
          pages: updatedPages,
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    return true;
  };
  
  // Delete a page
  const deletePage = (pageId, workspaceId = currentWorkspaceId) => {
    if (!workspaceId) return false;
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedPages = workspace.pages.filter(page => page.id !== pageId);
        
        return {
          ...workspace,
          pages: updatedPages,
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    
    if (currentPageId === pageId) {
      const workspace = updatedWorkspaces.find(w => w.id === workspaceId);
      if (workspace && workspace.pages.length > 0) {
        setCurrentPageId(workspace.pages[0].id);
      } else {
        setCurrentPageId(null);
      }
    }
    
    return true;
  };
  
  // Add a block to a page
  const addBlock = (blockData, pageId = currentPageId, workspaceId = currentWorkspaceId) => {
    if (!pageId || !workspaceId) return null;
    
    const newBlock = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...blockData
    };
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedPages = workspace.pages.map(page => {
          if (page.id === pageId) {
            return {
              ...page,
              blocks: [...page.blocks, newBlock],
              updatedAt: new Date().toISOString()
            };
          }
          return page;
        });
        
        return {
          ...workspace,
          pages: updatedPages,
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    return newBlock;
  };
  
  // Update a block
  const updateBlock = (blockId, updates, pageId = currentPageId, workspaceId = currentWorkspaceId) => {
    if (!blockId || !pageId || !workspaceId) return false;
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedPages = workspace.pages.map(page => {
          if (page.id === pageId) {
            const updatedBlocks = page.blocks.map(block => {
              if (block.id === blockId) {
                return {
                  ...block,
                  ...updates,
                  updatedAt: new Date().toISOString()
                };
              }
              return block;
            });
            
            return {
              ...page,
              blocks: updatedBlocks,
              updatedAt: new Date().toISOString()
            };
          }
          return page;
        });
        
        return {
          ...workspace,
          pages: updatedPages,
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    return true;
  };
  
  // Delete a block
  const deleteBlock = (blockId, pageId = currentPageId, workspaceId = currentWorkspaceId) => {
    if (!blockId || !pageId || !workspaceId) return false;
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        const updatedPages = workspace.pages.map(page => {
          if (page.id === pageId) {
            const updatedBlocks = page.blocks.filter(block => block.id !== blockId);
            
            return {
              ...page,
              blocks: updatedBlocks,
              updatedAt: new Date().toISOString()
            };
          }
          return page;
        });
        
        return {
          ...workspace,
          pages: updatedPages,
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    return true;
  };
  
  // Create a page from a template
  const createPageFromTemplate = (templateId, name, workspaceId = currentWorkspaceId) => {
    if (!templateId || !workspaceId) return null;
    
    // Find template
    let template = null;
    
    // Look for template in all workspaces
    for (const workspace of workspaces) {
      const found = workspace.pages.find(page => page.id === templateId);
      if (found) {
        template = found;
        break;
      }
    }
    
    if (!template) return null;
    
    // Create new page based on template
    const newPage = {
      id: uuidv4(),
      name,
      icon: template.icon,
      blocks: template.blocks.map(block => ({
        ...block,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          pages: [...workspace.pages, newPage],
          updatedAt: new Date().toISOString()
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    return newPage;
  };
  
  const value = {
    workspaces,
    currentWorkspaceId,
    currentPageId,
    isLoading,
    setCurrentWorkspaceId,
    setCurrentPageId,
    getCurrentWorkspace,
    getCurrentPage,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    createPage,
    updatePage,
    deletePage,
    addBlock,
    updateBlock,
    deleteBlock,
    createPageFromTemplate
  };
  
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}; 