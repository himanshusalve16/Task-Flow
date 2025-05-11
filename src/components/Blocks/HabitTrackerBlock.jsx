import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const HabitTrackerContainer = styled.div`
  width: 100%;
`;

const HabitTrackerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HabitTrackerTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${props => props.theme.text};
`;

const HabitGrid = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const HabitTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 600px;
`;

const HabitTableHeader = styled.th`
  padding: 10px;
  text-align: ${props => props.align || 'center'};
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.backgroundSecondary};
  position: sticky;
  top: 0;
`;

const HabitNameCell = styled.td`
  padding: 12px 8px;
  border-bottom: 1px solid ${props => props.theme.border}40;
  width: 180px;
  position: relative;
  font-weight: 500;
  
  &:hover .habit-actions {
    opacity: 1;
  }
`;

const HabitCell = styled.td`
  padding: 0;
  width: 40px;
  height: 40px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid ${props => props.theme.border}40;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.backgroundTertiary}40;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 6px;
    right: 6px;
    border-radius: 4px;
    background-color: ${props => props.completed 
      ? props.theme.primary 
      : props.theme.backgroundTertiary};
    opacity: ${props => props.completed ? 1 : 0.2};
    transition: all 0.2s;
  }
  
  ${props => props.streak > 1 && `
    &::after {
      content: '${props.streak}';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: 700;
      color: ${props.completed ? 'white' : props.theme.textSecondary};
    }
  `}
`;

const HabitActions = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const HabitButton = styled.button`
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
    color: ${props => props.danger ? props.theme.danger : props.theme.text};
  }
`;

const AddHabitForm = styled.form`
  margin-top: 16px;
  padding: 12px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
`;

const FormInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const HabitTrackerBlock = ({ data, onUpdate }) => {
  const [habits, setHabits] = useState([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [days, setDays] = useState([]);
  
  // Initialize data
  useEffect(() => {
    if (data && data.content) {
      if (data.content.habits) {
        setHabits(data.content.habits);
      }
      
      if (data.content.startDate) {
        setStartDate(new Date(data.content.startDate));
      } else {
        // Set start date to beginning of current week if not provided
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek;
        const startOfWeek = new Date(today.setDate(diff));
        setStartDate(startOfWeek);
      }
    }
  }, [data]);
  
  // Generate days
  useEffect(() => {
    const generateDays = () => {
      const result = [];
      const date = new Date(startDate);
      
      // Generate 14 days
      for (let i = 0; i < 14; i++) {
        result.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      
      return result;
    };
    
    setDays(generateDays());
  }, [startDate]);
  
  // Save changes
  const saveChanges = (updatedHabits) => {
    onUpdate({
      content: {
        habits: updatedHabits,
        startDate: startDate.toISOString()
      }
    });
  };
  
  // Format date as day name
  const formatDay = (date) => {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };
  
  // Format date as day number
  const formatDayNumber = (date) => {
    return date.getDate();
  };
  
  // Add a new habit
  const handleAddHabit = (e) => {
    e.preventDefault();
    
    if (newHabitName.trim()) {
      const newHabit = {
        id: uuidv4(),
        name: newHabitName.trim(),
        completedDates: []
      };
      
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      saveChanges(updatedHabits);
      
      // Reset form
      setNewHabitName('');
      setIsAddingHabit(false);
    }
  };
  
  // Delete a habit
  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
      saveChanges(updatedHabits);
    }
  };
  
  // Edit a habit
  const startEditingHabit = (habit) => {
    setEditingHabit(habit.id);
    setEditName(habit.name);
  };
  
  // Save habit edit
  const saveHabitEdit = () => {
    if (editName.trim()) {
      const updatedHabits = habits.map(habit => {
        if (habit.id === editingHabit) {
          return { ...habit, name: editName.trim() };
        }
        return habit;
      });
      
      setHabits(updatedHabits);
      saveChanges(updatedHabits);
      setEditingHabit(null);
    }
  };
  
  // Check if a date is completed for a habit
  const isDateCompleted = (habit, date) => {
    return habit.completedDates.some(d => 
      new Date(d).toDateString() === date.toDateString()
    );
  };
  
  // Toggle a date for a habit
  const toggleHabitDate = (habitId, date) => {
    const dateString = date.toISOString();
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = isDateCompleted(habit, date);
        
        if (isCompleted) {
          // Remove date if already completed
          return {
            ...habit,
            completedDates: habit.completedDates.filter(d => 
              new Date(d).toDateString() !== date.toDateString()
            )
          };
        } else {
          // Add date if not completed
          return {
            ...habit,
            completedDates: [...habit.completedDates, dateString]
          };
        }
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveChanges(updatedHabits);
  };
  
  // Calculate streak for a habit and date
  const calculateStreak = (habit, date) => {
    let streak = 0;
    const checkDate = new Date(date);
    
    // Go backwards from this date to count consecutive completed days
    while (isDateCompleted(habit, checkDate)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  };
  
  // Move dates range backwards
  const handleMovePrevious = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setStartDate(newStartDate);
    
    saveChanges(habits);
  };
  
  // Move dates range forwards
  const handleMoveNext = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setStartDate(newStartDate);
    
    saveChanges(habits);
  };
  
  // Get current week range as string
  const getDateRangeString = () => {
    if (!startDate || !days || days.length === 0) {
      return 'Loading...';
    }
    const start = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const end = days[days.length - 1]?.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) || '';
    return `${start} - ${end}`;
  };
  
  return (
    <HabitTrackerContainer>
      <HabitTrackerHeader>
        <HabitTrackerTitle>Habit Tracker</HabitTrackerTitle>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleMovePrevious}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ←
          </button>
          
          <span style={{ fontSize: '14px', color: '#666' }}>
            {getDateRangeString()}
          </span>
          
          <button
            onClick={handleMoveNext}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            →
          </button>
        </div>
      </HabitTrackerHeader>
      
      {habits.length > 0 ? (
        <HabitGrid>
          <HabitTable>
            <thead>
              <tr>
                <HabitTableHeader align="left">Habit</HabitTableHeader>
                {days.map((day, i) => (
                  <HabitTableHeader key={i}>
                    <div>{formatDay(day)}</div>
                    <div>{formatDayNumber(day)}</div>
                  </HabitTableHeader>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id}>
                  <HabitNameCell>
                    {editingHabit === habit.id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <FormInput
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveHabitEdit()}
                          autoFocus
                        />
                        <HabitButton onClick={saveHabitEdit} title="Save">
                          <FiCheck size={16} />
                        </HabitButton>
                        <HabitButton onClick={() => setEditingHabit(null)} title="Cancel">
                          <FiX size={16} />
                        </HabitButton>
                      </div>
                    ) : (
                      <>
                        {habit.name}
                        <HabitActions className="habit-actions">
                          <HabitButton onClick={() => startEditingHabit(habit)} title="Edit">
                            <FiEdit2 size={14} />
                          </HabitButton>
                          <HabitButton danger onClick={() => handleDeleteHabit(habit.id)} title="Delete">
                            <FiTrash2 size={14} />
                          </HabitButton>
                        </HabitActions>
                      </>
                    )}
                  </HabitNameCell>
                  
                  {days.map((day, i) => {
                    const completed = isDateCompleted(habit, day);
                    const streak = completed ? calculateStreak(habit, day) : 0;
                    
                    return (
                      <HabitCell
                        key={i}
                        completed={completed}
                        streak={streak}
                        onClick={() => toggleHabitDate(habit.id, day)}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </HabitTable>
        </HabitGrid>
      ) : (
        <EmptyState>
          No habits added yet. Click the "Add Habit" button to get started.
        </EmptyState>
      )}
      
      {isAddingHabit ? (
        <AddHabitForm onSubmit={handleAddHabit}>
          <FormRow>
            <FormInput
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name"
              autoFocus
              required
            />
          </FormRow>
          
          <FormRow style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setIsAddingHabit(false)}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
            >
              Add Habit
            </button>
          </FormRow>
        </AddHabitForm>
      ) : (
        <button
          onClick={() => setIsAddingHabit(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '16px',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <FiPlus size={16} />
          Add Habit
        </button>
      )}
    </HabitTrackerContainer>
  );
};

export default HabitTrackerBlock; 