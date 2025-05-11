import React, { createContext, useContext, useState, useEffect } from 'react';

const LocalStorageContext = createContext();

export const useLocalStorage = () => useContext(LocalStorageContext);

export const LocalStorageProvider = ({ children }) => {
  const PREFIX = 'trackflow_';
  
  // Function to save data to localStorage
  const saveData = (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(`${PREFIX}${key}`, serializedData);
      return true;
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      return false;
    }
  };
  
  // Function to get data from localStorage
  const getData = (key, defaultValue = null) => {
    try {
      const serializedData = localStorage.getItem(`${PREFIX}${key}`);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Error getting data from localStorage:', error);
      return defaultValue;
    }
  };
  
  // Function to remove data from localStorage
  const removeData = (key) => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
      return false;
    }
  };
  
  // Function to get all keys from localStorage with our prefix
  const getAllKeys = () => {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(PREFIX))
        .map(key => key.replace(PREFIX, ''));
    } catch (error) {
      console.error('Error getting all keys from localStorage:', error);
      return [];
    }
  };
  
  // Function to export all data
  const exportAllData = () => {
    try {
      const keys = getAllKeys();
      const exportData = {};
      
      keys.forEach(key => {
        exportData[key] = getData(key);
      });
      
      return {
        data: exportData,
        timestamp: new Date().toISOString(),
        appVersion: '1.0.0'
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  };
  
  // Function to import data
  const importData = (importedData) => {
    try {
      if (!importedData || !importedData.data) {
        throw new Error('Invalid import data');
      }
      
      // Clear existing data
      const keys = getAllKeys();
      keys.forEach(key => removeData(key));
      
      // Import new data
      Object.keys(importedData.data).forEach(key => {
        saveData(key, importedData.data[key]);
      });
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };
  
  // Function to reset all data
  const resetAllData = () => {
    try {
      const keys = getAllKeys();
      keys.forEach(key => removeData(key));
      return true;
    } catch (error) {
      console.error('Error resetting data:', error);
      return false;
    }
  };
  
  const value = {
    saveData,
    getData,
    removeData,
    getAllKeys,
    exportAllData,
    importData,
    resetAllData
  };
  
  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}; 