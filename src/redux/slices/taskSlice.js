import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDBConnection,
  getTask,
  saveTask,
  deleteTask as deleteTaskFromDB,
  updateTaskStatus,
} from '../../database/db';
import { lightTheme, darkTheme } from '../../themes/color';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const db = await getDBConnection();
  return await getTask(db);
});

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (task, { getState }) => {
    const state = getState();
    const existingTask = state.tasks.items.find(t => t.id === task.id);
    const theme = state.tasks.isDarkMode ? darkTheme : lightTheme;
    const palette = theme.taskCardPalette;

    const taskWithColor = {
      ...task,
      color:
        existingTask?.color ||
        palette[Math.floor(Math.random() * palette.length)],
    };

    const db = await getDBConnection();
    await saveTask(db, taskWithColor);
    return await getTask(db);
  },
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async id => {
  const db = await getDBConnection();
  await deleteTaskFromDB(db, id);
  return id;
});

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (id, { getState }) => {
    const state = getState();
    const taskToUpdate = state.tasks.items.find(t => t.id === id);
    if (!taskToUpdate) {
      throw new Error('Task not found');
    }

    const newStatus = taskToUpdate.completed ? 0 : 1;
    const db = await getDBConnection();
    await updateTaskStatus(db, id, newStatus);
    return { id, completed: newStatus === 1 };
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    isDarkMode: false,
  },
  reducers: {
    toggleTheme: state => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.error('Failed to fetch tasks:', action.error);
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addNewTask.rejected, (state, action) => {
        console.error('Failed to add task:', action.error);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        console.error('Failed to delete task:', action.error);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const task = state.items.find(t => t.id === action.payload.id);
        if (task) {
          task.completed = action.payload.completed;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        console.error('Failed to complete task:', action.error);
      });
  },
});

export const { toggleTheme } = taskSlice.actions;
export default taskSlice.reducer;
