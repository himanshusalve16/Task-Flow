import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiCheck, FiCircle } from 'react-icons/fi';

const TodoBlockContainer = styled.div`
  width: 100%;
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.border}40;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TodoCheckbox = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? props.theme.primary : props.theme.textSecondary};
  background-color: ${props => props.checked ? props.theme.primary : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const TodoText = styled.input`
  border: none;
  background: transparent;
  color: ${props => props.theme.text};
  font-size: 16px;
  flex-grow: 1;
  outline: none;
  padding: 4px 0;
  text-decoration: ${props => props.checked ? 'line-through' : 'none'};
  opacity: ${props => props.checked ? 0.6 : 1};
  
  &:focus {
    border-bottom: 1px solid ${props => props.theme.border};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.6;
  }
`;

const TodoDeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
  
  ${TodoItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: ${props => props.theme.danger};
    background-color: ${props => props.theme.backgroundTertiary};
  }
`;

const AddTodoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  padding: 8px 0;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${props => props.theme.backgroundTertiary};
  border-radius: 3px;
  margin-top: 8px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background-color: ${props => props.theme.primary};
  height: 100%;
  border-radius: 8px;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const TodoStats = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
`;

const TodoBlock = ({ data, onUpdate }) => {
  const [todos, setTodos] = useState([]);
  
  // Initialize todos from data
  useEffect(() => {
    if (data && data.content) {
      setTodos(data.content);
    } else {
      setTodos([]);
    }
  }, [data]);
  
  // Calculate progress
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Toggle todo completion
  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    onUpdate({ content: updatedTodos });
  };
  
  // Update todo text
  const updateTodoText = (id, text) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    onUpdate({ content: updatedTodos });
  };
  
  // Delete a todo
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    onUpdate({ content: updatedTodos });
  };
  
  // Add a new todo
  const addTodo = () => {
    const newTodo = {
      id: uuidv4(),
      text: '',
      completed: false
    };
    
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    onUpdate({ content: updatedTodos });
  };
  
  return (
    <TodoBlockContainer>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
      
      <TodoList>
        {todos.map(todo => (
          <TodoItem key={todo.id}>
            <TodoCheckbox 
              checked={todo.completed}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed && <FiCheck size={12} />}
            </TodoCheckbox>
            
            <TodoText
              value={todo.text}
              onChange={(e) => updateTodoText(todo.id, e.target.value)}
              placeholder="Enter a task..."
              checked={todo.completed}
            />
            
            <TodoDeleteButton onClick={() => deleteTodo(todo.id)}>
              <FiTrash2 size={14} />
            </TodoDeleteButton>
          </TodoItem>
        ))}
      </TodoList>
      
      <AddTodoButton onClick={addTodo}>
        <FiPlus size={16} />
        Add Task
      </AddTodoButton>
      
      {totalCount > 0 && (
        <TodoStats>
          <span>{completedCount} of {totalCount} completed</span>
          <span>{Math.round(progress)}%</span>
        </TodoStats>
      )}
    </TodoBlockContainer>
  );
};

export default TodoBlock; 