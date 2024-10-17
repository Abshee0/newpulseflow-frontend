import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import data from "../data/data.json";
import * as boardService from "../services/boardService";

// Thunks to interact with backend API
export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await boardService.getBoards();
      return response; // This is the boards data from MongoDB
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addNewBoard = createAsyncThunk(
  "boards/addNewBoard",
  async (boardData, { rejectWithValue }) => {
    try {
      const response = await boardService.createBoard(boardData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async ({ id, boardData }, { rejectWithValue }) => {
    try {
      const response = await boardService.updateBoard(id, boardData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (id, { rejectWithValue }) => {
    try {
      const response = await boardService.deleteBoard(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    editBoard: (state, action) => {
      const { id, name, columns } = action.payload;
      const board = state.boards.find((board) => board._id === id);
      if (board) {
        board.name = name;
        board.columns = columns;
      }
    },
    deleteBoard: (state, action) => {
      const id = action.payload;
      state.boards = state.boards.filter((board) => board._id !== id);
    },
    setBoardActive: (state, action) => {
      const id = action.payload;
      state.boards.forEach((board) => {
        board.isActive = board._id === id;
      });
    },
    addTask: (state, action) => {
      const { title, status, description, subtasks, newColIndex } = action.payload;
      const task = { title, description, subtasks, status };
      const board = state.boards.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === newColIndex);
      column.tasks.push(task);
    },
    editTask: (state, action) => {
      const {
        title,
        status,
        description,
        subtasks,
        prevColIndex,
        newColIndex,
        taskIndex,
      } = action.payload;
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === prevColIndex);
      const task = column.tasks.find((task, index) => index === taskIndex);
      task.title = title;
      task.status = status;
      task.description = description;
      task.subtasks = subtasks;
      if (prevColIndex === newColIndex) return;
      column.tasks = column.tasks.filter((task, index) => index !== taskIndex);
      const newCol = board.columns.find((col, index) => index === newColIndex);
      newCol.tasks.push(task);
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = state.find((board) => board.isActive);
      const prevCol = board.columns.find((col, i) => i === prevColIndex);
      const task = prevCol.tasks.splice(taskIndex, 1)[0];
      board.columns.find((col, i) => i === colIndex).tasks.push(task);
    },
    setSubtaskCompleted: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      const subtask = task.subtasks.find((subtask, i) => i === payload.index);
      subtask.isCompleted = !subtask.isCompleted;
    },
    setTaskStatus: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const columns = board.columns;
      const col = columns.find((col, i) => i === payload.colIndex);
      if (payload.colIndex === payload.newColIndex) return;
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      task.status = payload.status;
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
      const newCol = columns.find((col, i) => i === payload.newColIndex);
      newCol.tasks.push(task);
    },
    deleteTask: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchBoards.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchBoards.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.boards = action.payload;  // Set the boards data
    })
    .addCase(fetchBoards.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export const { addBoard, editBoard, setBoardActive } = boardsSlice.actions;
export default boardsSlice.reducer;