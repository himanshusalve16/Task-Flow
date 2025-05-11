import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiX, FiMoreHorizontal, FiCopy } from 'react-icons/fi';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Card, Button, FlexContainer } from '../../styles/AppStyles';
import TodoBlock from '../Blocks/TodoBlock';
import TextBlock from '../Blocks/TextBlock';
import CalendarBlock from '../Blocks/CalendarBlock';
import HabitTrackerBlock from '../Blocks/HabitTrackerBlock';
import GoalTrackerBlock from '../Blocks/GoalTrackerBlock';
import JournalBlock from '../Blocks/JournalBlock';

const DashboardContainer = styled.div`
  padding: 0;
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const PageIcon = styled.span`
  font-size: 28px;
  margin-right: 4px;
  cursor: pointer;
`;

const PageNameInput = styled.input`
  font-size: 28px;
  font-weight: 700;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  width: 100%;
  padding: 4px 0;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    background: ${props => props.theme.backgroundTertiary}40;
  }
`;

const PageEmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const BlockContainer = styled(Card)`
  margin-bottom: 16px;
  position: relative;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  ${props => props.$isDragging && `
    box-shadow: ${props.theme.shadow}, 0 0 0 2px ${props.theme.primary}40;
  `}
  
  &:hover .block-actions {
    opacity: 1;
  }
`;

const BlockActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
`;

const ActionIconButton = styled.button`
  background: ${props => props.theme.backgroundTertiary};
  color: ${props => props.theme.text};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const AddBlockMenu = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadow};
  padding: 8px;
  margin-bottom: 24px;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const BlockTypeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.theme.backgroundTertiary};
  }
`;

const IconPickerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const IconPickerContent = styled(Card)`
  width: 400px;
  max-width: 90%;
  max-height: 70vh;
  overflow-y: auto;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: ${props => props.theme.backgroundSecondary};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.backgroundTertiary};
  }
`;

const Dashboard = () => {
  const { workspaceId, pageId } = useParams();
  const { 
    getCurrentWorkspace,
    getCurrentPage,
    setCurrentWorkspaceId,
    setCurrentPageId,
    updatePage,
    addBlock,
    updateBlock,
    deleteBlock,
    createPageFromTemplate
  } = useWorkspace();
  
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [pageName, setPageName] = useState('');
  const [blocks, setBlocks] = useState([]);
  
  // Common emoji icons for pages
  const commonIcons = [
    '📝', '📅', '✅', '🎯', '📊', '🧠', '💡', '📚', 
    '🏋️', '🍎', '🌱', '💼', '🏠', '💰', '⚙️', '🔍',
    '❤️', '🌞', '🌙', '💤', '⏰', '🔔', '📌', '🎵'
  ];
  
  // Get current workspace and page
  const workspace = getCurrentWorkspace();
  const page = getCurrentPage();
  
  // Update current workspace and page IDs from URL parameters
  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId);
    }
    
    if (pageId) {
      setCurrentPageId(pageId);
    }
  }, [workspaceId, pageId, setCurrentWorkspaceId, setCurrentPageId]);
  
  // Update local state when page changes
  useEffect(() => {
    if (page) {
      setPageName(page.name);
      setBlocks(page.blocks);
    } else {
      setPageName('');
      setBlocks([]);
    }
  }, [page]);
  
  // Update page name when user changes it
  const handleUpdatePageName = () => {
    if (page && pageName !== page.name) {
      updatePage(page.id, { name: pageName });
    }
  };
  
  // Update page icon
  const handleUpdatePageIcon = (icon) => {
    if (page) {
      updatePage(page.id, { icon });
      setIsIconPickerOpen(false);
    }
  };
  
  // Add a new block
  const handleAddBlock = (type) => {
    let newBlockData;
    
    switch (type) {
      case 'todo':
        newBlockData = {
          type: 'todo',
          content: []
        };
        break;
        
      case 'text':
        newBlockData = {
          type: 'text',
          content: ''
        };
        break;
        
      case 'calendar':
        newBlockData = {
          type: 'calendar',
          content: {
            selectedDate: new Date().toISOString(),
            events: []
          }
        };
        break;
        
      case 'habit':
        newBlockData = {
          type: 'habit',
          content: {
            habits: [],
            startDate: new Date().toISOString()
          }
        };
        break;
        
      case 'goal':
        newBlockData = {
          type: 'goal',
          content: {
            title: 'New Goal',
            target: 100,
            current: 0,
            unit: '%'
          }
        };
        break;
        
      case 'journal':
        newBlockData = {
          type: 'journal',
          content: {
            date: new Date().toISOString(),
            mood: '😊',
            text: ''
          }
        };
        break;
        
      default:
        return;
    }
    
    const newBlock = addBlock(newBlockData);
    if (newBlock) {
      setBlocks([...blocks, newBlock]);
    }
    
    setIsAddingBlock(false);
  };
  
  // Update a block
  const handleUpdateBlock = (blockId, updates) => {
    if (updateBlock(blockId, updates)) {
      setBlocks(blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      ));
    }
  };
  
  // Delete a block
  const handleDeleteBlock = (blockId) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      if (deleteBlock(blockId)) {
        setBlocks(blocks.filter(block => block.id !== blockId));
      }
    }
  };
  
  // Handle drag and drop of blocks
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setBlocks(items);
    
    // Update the page with the new block order
    if (page) {
      updatePage(page.id, { blocks: items });
    }
  };
  
  // Render blocks based on their type
  const renderBlock = (block, index) => {
    const commonProps = {
      data: block,
      onUpdate: (updates) => handleUpdateBlock(block.id, updates),
      onDelete: () => handleDeleteBlock(block.id)
    };
    
    switch (block.type) {
      case 'todo':
        return <TodoBlock {...commonProps} />;
        
      case 'text':
        return <TextBlock {...commonProps} />;
        
      case 'calendar':
        return <CalendarBlock {...commonProps} />;
        
      case 'habit':
        return <HabitTrackerBlock {...commonProps} />;
        
      case 'goal':
        return <GoalTrackerBlock {...commonProps} />;
        
      case 'journal':
        return <JournalBlock {...commonProps} />;
        
      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };
  
  // Save this page as a template
  const handleSaveAsTemplate = () => {
    if (!page) return;
    
    const templateName = window.prompt('Enter template name:', `${page.name} Template`);
    if (templateName) {
      // Create a new page with the same blocks, but a different name
      createPageFromTemplate(page.id, templateName);
    }
  };
  
  if (!workspace || !page) {
    return (
      <DashboardContainer>
        <PageEmptyState>
          <h2>Select a page from the sidebar</h2>
          <p>Or create a new page to get started</p>
        </PageEmptyState>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>
          <PageIcon onClick={() => setIsIconPickerOpen(true)}>
            {page.icon}
          </PageIcon>
          <PageNameInput
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            onBlur={handleUpdatePageName}
            placeholder="Untitled"
          />
        </PageTitle>
        
        <FlexContainer $justifyContent="flex-end">
          <Button onClick={handleSaveAsTemplate}>
            <FiCopy size={14} />
            Save as Template
          </Button>
        </FlexContainer>
      </PageHeader>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks" isDropDisabled={false}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {blocks.map((block, index) => (
                <Draggable
                  key={block.id}
                  draggableId={block.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <BlockContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      $isDragging={snapshot.isDragging}
                    >
                      <BlockActions className="block-actions">
                        <ActionIconButton
                          onClick={() => handleDeleteBlock(block.id)}
                          title="Delete block"
                        >
                          <FiX size={16} />
                        </ActionIconButton>
                      </BlockActions>
                      
                      {renderBlock(block, index)}
                    </BlockContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <AddBlockMenu isVisible={isAddingBlock}>
        <BlockTypeButton onClick={() => handleAddBlock('text')}>
          <span>📝</span> Text
        </BlockTypeButton>
        <BlockTypeButton onClick={() => handleAddBlock('todo')}>
          <span>✅</span> Task Checklist
        </BlockTypeButton>
        <BlockTypeButton onClick={() => handleAddBlock('calendar')}>
          <span>📅</span> Calendar
        </BlockTypeButton>
        <BlockTypeButton onClick={() => handleAddBlock('habit')}>
          <span>📊</span> Habit Tracker
        </BlockTypeButton>
        <BlockTypeButton onClick={() => handleAddBlock('goal')}>
          <span>🎯</span> Goal Tracker
        </BlockTypeButton>
        <BlockTypeButton onClick={() => handleAddBlock('journal')}>
          <span>🧠</span> Journal
        </BlockTypeButton>
      </AddBlockMenu>
      
      <Button
        $primary
        onClick={() => setIsAddingBlock(!isAddingBlock)}
        style={{ marginBottom: '40px' }}
      >
        <FiPlus size={16} />
        {isAddingBlock ? 'Cancel' : 'Add Block'}
      </Button>
      
      {isIconPickerOpen && (
        <IconPickerModal onClick={() => setIsIconPickerOpen(false)}>
          <IconPickerContent onClick={(e) => e.stopPropagation()}>
            <h3>Choose an icon</h3>
            <IconGrid>
              {commonIcons.map(icon => (
                <IconButton
                  key={icon}
                  onClick={() => handleUpdatePageIcon(icon)}
                >
                  {icon}
                </IconButton>
              ))}
            </IconGrid>
          </IconPickerContent>
        </IconPickerModal>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 