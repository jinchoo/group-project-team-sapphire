import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import {
  storage,
  roomsCollection,
  productsCollection,
} from "../firebase/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createThunkCondition } from "./utils";

const thunkCondition = createThunkCondition("rooms");

export const createRoom = createAsyncThunk(
  "rooms/create",
  async (formData, { rejectWithValue }) => {
    try {
      const roomsRef = ref(storage, "rooms/" + formData.photo.name);

      const { name, capacity, photo } = formData;

      const snapshot = await uploadBytes(roomsRef, photo);
      const photoLink = await getDownloadURL(snapshot.ref);

      return await addDoc(roomsCollection, {
        name,
        capacity,
        photo: photoLink,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  thunkCondition
);

const getRoomProducts = async (roomId) => {
  const productsQuery = query(productsCollection, where("room", "==", roomId));

  const products = await getDocs(productsQuery).then((productDocs) => {
    let productData = [];

    productDocs.forEach((productDoc) => {
      productData.push({ ...productDoc.data(), id: productDoc.id });
    });

    return productData;
  });

  return products;
};

export const getRoomsList = createAsyncThunk(
  "rooms/getRoomList",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      let rooms = await getDocs(roomsCollection).then((roomDocs) => {
        let roomData = [];
        roomDocs.forEach(async (roomDoc) => {
          roomData.push({ ...roomDoc.data(), id: roomDoc.id });
        });
        return roomData;
      });

      rooms = await Promise.all(
        rooms.map(async (room) => {
          let products = await getRoomProducts(room.id);

          return { ...room, products };
        })
      );

      return fulfillWithValue(rooms);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  thunkCondition
);

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    resetRoomsSlice: (state, action) => {
      state.rooms = [];
      state.loading = "idle";
    },
  },
  extraReducers: {
    [createRoom.pending]: (state, action) => {
      state.loading = "pending";
    },
    [createRoom.fulfilled]: (state, action) => {
      state.loading = "fulfilled";
    },
    [createRoom.rejected]: (state, action) => {
      state.loading = "rejected";
      state.error = action.payload.message;
    },

    [getRoomsList.pending]: (state, action) => {
      state.loading = "pending";
    },
    [getRoomsList.fulfilled]: (state, action) => {
      state.loading = "fulfilled";
      state.rooms = action.payload;
    },
    [getRoomsList.rejected]: (state, action) => {
      state.loading = "rejected";
      state.error = action.payload.message;
    },
  },
});

export const { resetRoomsSlice } = roomsSlice.actions;

export default roomsSlice.reducer;

// // Add a new document in collection "demoUsers"
// const _createTestUser = async (user) => {
//   // setDoc gives you control of documents id, if you want autogenerated id's see addDoc https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9
//   await setDoc(doc(db, 'demoUsers', String(user.id)), user)
//   console.log('Document written with ID: ', user.id)
// }
