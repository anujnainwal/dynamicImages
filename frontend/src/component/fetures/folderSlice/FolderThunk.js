import axios from "axios";
import axiosInstance from "../../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
//Get All FaFolder
export const getAllFolder = createAsyncThunk(
  "/folder/getFolders",
  async ({ rejectWithValue }) => {
    try {
      const folder = await axiosInstance.get("/folder/folders");
      return folder.data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.resposnse);
    }
  }
);

//Create Folder

export const createFolder = createAsyncThunk(
  "/folder/createFolder",
  async (data, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.post("/folders/createFolder");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);

//Rename Folder

export const renameFolder = createAsyncThunk(
  "/folder/renameFolder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/folder/renameFolder");
      return response.data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response);
    }
  }
);

//Delete Folder
export const deleteFolder = createAsyncThunk(
  "/folder/deleteFolder",
  async (data, { rejectWithValue }) => {
    try {
    } catch (error) {
      rejectWithValue(error.response);
    }
  }
);
