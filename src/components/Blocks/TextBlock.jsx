import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const TextBlockContainer = styled.div`
  width: 100%;
`;

const Editor = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }
`;

const Preview = styled.div`
  padding: 8px;
  cursor: text;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }
  
  h1 {
    font-size: 1.8em;
  }
  
  h2 {
    font-size: 1.5em;
  }
  
  h3 {
    font-size: 1.3em;
  }
  
  p {
    margin-bottom: 1em;
    line-height: 1.6;
  }
  
  ul, ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }
  
  li {
    margin-bottom: 0.3em;
  }
  
  a {
    color: ${props => props.theme.primary};
    text-decoration: underline;
  }
  
  blockquote {
    border-left: 3px solid ${props => props.theme.border};
    padding-left: 1em;
    margin-left: 0;
    color: ${props => props.theme.textSecondary};
  }
  
  code {
    background: ${props => props.theme.code};
    color: ${props => props.theme.codeText};
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: ${props => props.theme.code};
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;
    
    code {
      background: none;
      padding: 0;
      border-radius: 0;
    }
  }
  
  img {
    max-width: 100%;
    border-radius: 6px;
  }
  
  hr {
    border: none;
    border-top: 1px solid ${props => props.theme.border};
    margin: 1.5em 0;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  th, td {
    border: 1px solid ${props => props.theme.border};
    padding: 0.5em;
  }
  
  th {
    background: ${props => props.theme.backgroundTertiary};
  }
`;

const PlaceholderText = styled.div`
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const TextBlock = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  
  // Initialize text from data
  useEffect(() => {
    if (data && data.content) {
      setText(data.content);
    } else {
      setText('');
    }
  }, [data]);
  
  // Save changes when exiting edit mode
  const handleBlur = () => {
    if (text !== data.content) {
      onUpdate({ content: text });
    }
    setIsEditing(false);
  };
  
  // Render editor when editing, preview when not
  return (
    <TextBlockContainer>
      {isEditing ? (
        <Editor
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          placeholder="Type here. Supports Markdown formatting..."
        />
      ) : (
        <Preview onClick={() => setIsEditing(true)}>
          {text ? (
            <ReactMarkdown>{text}</ReactMarkdown>
          ) : (
            <PlaceholderText>Click to add text...</PlaceholderText>
          )}
        </Preview>
      )}
    </TextBlockContainer>
  );
};

export default TextBlock; 