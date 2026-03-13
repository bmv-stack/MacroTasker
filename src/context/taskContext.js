import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getDBConnection,
  getTask,
  saveTask,
  deleteTask as deleteTaskFromDB,
  createTable,
  updateTaskStatus,
} from '../database/db';
import { Colors } from '../themes/color';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await getDBConnection();
        await createTable(db);
        const storedTasks = await getTask(db);
        setTasks(storedTasks);
      } catch (error) {
        console.error('Initialization error', error);
      }
    };
    loadData();
  }, []);

  const addNewTask = async task => {
    const taskWithColor = {
      ...task,
      color: task.color || Colors.taskCardPalette[Math.floor(Math.random() * Colors.taskCardPalette.length)],
    };
    const db = await getDBConnection();
    await saveTask(db, taskWithColor);
    const updatedTask = await getTask(db);
    setTasks(updatedTask);
  };

  const deleteTask = async id => {
    const db = await getDBConnection();
    await deleteTaskFromDB(db, id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = async id => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;

    const newStatus = taskToUpdate.completed ? 0 : 1;
    const db = await getDBConnection();

    await updateTaskStatus(db, id, newStatus);

    const updatedTasks = await getTask(db);
    setTasks(updatedTasks);
  };

  const updateTask = async updatedTask => {
    const existingTask = tasks.find(t => t.id === updatedTask.id);
    const taskToSave = {
      ...existingTask,
      ...updatedTask,
    };
    const db = await getDBConnection();
    await saveTask(db, taskToSave);
    const storedTasks = await getTask(db);
    setTasks(storedTasks);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addNewTask, deleteTask, completeTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);