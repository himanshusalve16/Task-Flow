import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiEdit2 } from 'react-icons/fi';

const JournalBlockContainer = styled.div`
  width: 100%;
  padding: 8px 0;
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const JournalDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
`;

const MoodSelector = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MoodLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const MoodOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const MoodOption = styled.button`
  background: ${props => props.selected 
    ? `${props.theme.primary}20` 
    : 'transparent'};
  border: 1px solid ${props => props.selected 
    ? props.theme.primary 
    : props.theme.border};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  
  &:hover {
    background: ${props => props.theme.backgroundTertiary};
    transform: scale(1.1);
  }
  
  ${props => props.selected && `
    transform: scale(1.1);
  `}
`;

const JournalContent = styled.div`
  margin-top: 16px;
`;

const JournalTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

const JournalText = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${props => props.theme.text};
  background: ${props => props.theme.backgroundSecondary};
  padding: 12px;
  border-radius: 8px;
  cursor: text;
  min-height: 120px;
`;

const JournalPlaceholder = styled.div`
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const DatePickerContainer = styled.div`
  position: relative;
`;

const DateInput = styled.input`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  width: 130px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😠', label: 'Angry' }
];

const JournalBlock = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mood, setMood] = useState('😊');
  const [text, setText] = useState('');
  
  // Initialize from data
  useEffect(() => {
    if (data && data.content) {
      if (data.content.date) {
        setDate(new Date(data.content.date));
      }
      
      if (data.content.mood) {
        setMood(data.content.mood);
      }
      
      if (data.content.text) {
        setText(data.content.text);
      }
    }
  }, [data]);
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Handle date change
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
    
    onUpdate({
      content: {
        date: newDate.toISOString(),
        mood,
        text
      }
    });
  };
  
  // Handle mood change
  const handleMoodChange = (newMood) => {
    setMood(newMood);
    
    onUpdate({
      content: {
        date: date.toISOString(),
        mood: newMood,
        text
      }
    });
  };
  
  // Handle text change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  // Save text when exiting edit mode
  const handleTextBlur = () => {
    onUpdate({
      content: {
        date: date.toISOString(),
        mood,
        text
      }
    });
    
    setIsEditing(false);
  };
  
  return (
    <JournalBlockContainer>
      <JournalHeader>
        <JournalDate>
          <FiCalendar size={16} />
          <DatePickerContainer>
            <DateInput
              type="date"
              value={formatDateForInput(date)}
              onChange={handleDateChange}
            />
          </DatePickerContainer>
        </JournalDate>
        
        <MoodSelector>
          <MoodLabel>Mood:</MoodLabel>
          <MoodOptions>
            {moods.map(({ emoji, label }) => (
              <MoodOption
                key={emoji}
                selected={mood === emoji}
                onClick={() => handleMoodChange(emoji)}
                title={label}
              >
                {emoji}
              </MoodOption>
            ))}
          </MoodOptions>
        </MoodSelector>
      </JournalHeader>
      
      <JournalContent>
        {isEditing ? (
          <JournalTextarea
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            placeholder="Write about your day, thoughts, or ideas..."
            autoFocus
          />
        ) : (
          <JournalText onClick={() => setIsEditing(true)}>
            {text ? (
              text
            ) : (
              <JournalPlaceholder>
                Click to write about your day, thoughts, or ideas...
              </JournalPlaceholder>
            )}
          </JournalText>
        )}
      </JournalContent>
    </JournalBlockContainer>
  );
};

export default JournalBlock; 