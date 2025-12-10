import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api";

// ==================== SEND OTP ====================
export const sendOtp = createAsyncThunk(
  "forgotPassword/sendOtp",
  async ({email}, { rejectWithValue }) => {
    try {
      const response = await api.post("/login/send-otp",{email});

      if (!response.status) {
        return rejectWithValue(response.message || "Failed to send OTP");
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// ==================== VERIFY OTP ====================
export const verifyOtp = createAsyncThunk(
  "forgotPassword/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login/verify-otp", { email, otp });

      if (!response.status) {
        return rejectWithValue(response.message || "OTP verification failed");
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// ==================== RESET PASSWORD ====================
export const resetPassword = createAsyncThunk(
  "forgotPassword/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login/reset-password", { email, newPassword });

      if (!response.status) {
        return rejectWithValue(response.message || "Password reset failed");
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: "",
  },

  reducers: {
    resetForgotState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    // SEND OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // VERIFY OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // RESET PASSWORD
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetForgotState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
