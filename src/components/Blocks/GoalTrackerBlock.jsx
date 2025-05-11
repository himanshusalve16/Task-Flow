import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const GoalTrackerContainer = styled.div`
  width: 100%;
  padding: 8px 0;
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const GoalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const GoalEditButton = styled.button`
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
`;

const ProgressContainer = styled.div`
  margin-bottom: 16px;
`;

const ProgressBarOuter = styled.div`
  height: 20px;
  background-color: ${props => props.theme.backgroundTertiary};
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarInner = styled.div`
  height: 100%;
  background: ${props => 
    props.$progress >= 100
    ? '#10b981' // success color for completed goals
    : props.theme.primary};
  width: ${props => Math.min(100, props.$progress)}%;
  border-radius: 6px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const ProgressValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.theme.text};
  display: flex;
  align-items: baseline;
  
  span {
    font-size: 18px;
    color: ${props => props.theme.textSecondary};
    margin-left: 4px;
  }
`;

const EditForm = styled.form`
  margin-top: 16px;
  padding: 16px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: ${props => props.flex || 1};
`;

const FormLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const FormInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const CurrentValueControl = styled.div`
  display: flex;
  align-items: center;
  
  button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.backgroundTertiary};
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.primary};
      color: white;
    }
  }
  
  input {
    width: 60px;
    text-align: center;
    margin: 0 8px;
  }
`;

const GoalTrackerBlock = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [currentValue, setCurrentValue] = useState(0);
  const [targetValue, setTargetValue] = useState(100);
  const [unit, setUnit] = useState('%');
  
  // Initialize from data
  useEffect(() => {
    if (data && data.content) {
      setGoalTitle(data.content.title || 'Goal');
      setCurrentValue(data.content.current || 0);
      setTargetValue(data.content.target || 100);
      setUnit(data.content.unit || '%');
    }
  }, [data]);
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (targetValue === 0) return 0;
    return (currentValue / targetValue) * 100;
  };
  
  const progress = calculateProgress();
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onUpdate({
      content: {
        title: goalTitle,
        current: currentValue,
        target: targetValue,
        unit
      }
    });
    
    setIsEditing(false);
  };
  
  // Increment current value
  const incrementValue = () => {
    const newValue = currentValue + 1;
    setCurrentValue(newValue);
    
    onUpdate({
      content: {
        title: goalTitle,
        current: newValue,
        target: targetValue,
        unit
      }
    });
  };
  
  // Decrement current value
  const decrementValue = () => {
    if (currentValue <= 0) return;
    
    const newValue = currentValue - 1;
    setCurrentValue(newValue);
    
    onUpdate({
      content: {
        title: goalTitle,
        current: newValue,
        target: targetValue,
        unit
      }
    });
  };
  
  // Handle current value change directly
  const handleValueChange = (e) => {
    const newValue = parseInt(e.target.value) || 0;
    setCurrentValue(newValue);
    
    onUpdate({
      content: {
        title: goalTitle,
        current: newValue,
        target: targetValue,
        unit
      }
    });
  };
  
  return (
    <GoalTrackerContainer>
      <GoalHeader>
        <GoalTitle>{goalTitle}</GoalTitle>
        <GoalEditButton onClick={() => setIsEditing(!isEditing)}>
          <FiEdit2 size={16} />
        </GoalEditButton>
      </GoalHeader>
      
      <ProgressContainer>
        <ProgressBarOuter>
          <ProgressBarInner $progress={progress} />
        </ProgressBarOuter>
        
        <ProgressText>
          <div>{progress.toFixed(1)}% complete</div>
          <div>
            {currentValue} / {targetValue} {unit}
          </div>
        </ProgressText>
      </ProgressContainer>
      
      <ProgressStats>
        <ProgressValue>
          {currentValue}<span>{unit}</span>
        </ProgressValue>
        
        <CurrentValueControl>
          <button onClick={decrementValue}>-</button>
          <FormInput
            type="number"
            value={currentValue}
            onChange={handleValueChange}
            min="0"
            max={targetValue}
          />
          <button onClick={incrementValue}>+</button>
        </CurrentValueControl>
      </ProgressStats>
      
      {isEditing && (
        <EditForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Goal Title</FormLabel>
            <FormInput
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Enter a title for your goal"
              required
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <FormLabel>Current Value</FormLabel>
              <FormInput
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value) || 0)}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Target Value</FormLabel>
              <FormInput
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value) || 0)}
                min="1"
                required
              />
            </FormGroup>
            
            <FormGroup flex={0.5}>
              <FormLabel>Unit</FormLabel>
              <FormInput
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg, miles, %"
              />
            </FormGroup>
          </FormRow>
          
          <FormActions>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </FormActions>
        </EditForm>
      )}
    </GoalTrackerContainer>
  );
};

export default GoalTrackerBlock; 