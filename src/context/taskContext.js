import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        { id: '1', title: 'Sample Task', date: '25/06/26', time: '10:00 AM', priority: 'Normal', color: '#87CEEB', completed: false }
    ]);

    const addNewTask = (task) => {
        const colors = ['#C1E1C1', '#FDFD96', '#E6B3E6', '#AEC6CF', '#FFB7B2'];
        const taskWithColor = {
            ...task,
            color: task.color || colors[Math.floor(Math.random() * colors.length)]
        }
        setTasks([taskWithColor, ...tasks]);
    }

    const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

    const completeTask = (id) => setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    const updateTask = (updatedTask) => setTasks(tasks.map(t =>
        t.id === updatedTask.id ? updatedTask : t
    ));

    return (
        <TaskContext.Provider value={{ tasks, addNewTask, deleteTask, completeTask, updateTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);