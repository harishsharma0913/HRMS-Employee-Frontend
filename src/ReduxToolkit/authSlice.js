import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../Services/api';

export const getMyLeaves = createAsyncThunk(
  "auth/getMyLeaves",
  async ({ empId }, thunkAPI) => {
    console.log("Fetching leaves for employee ID:", empId);
    try {
      const response = await api.get(`/login/leave/${empId}`);
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch leaves');
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching leaves");
    }
  }
);

export const getMyLeavesFiltered = createAsyncThunk(
  "auth/getMyLeavesFiltered",
  async ({ empId, status, type, from, to, page, limit }, thunkAPI) => {
    try {
      const response = await api.get(`/login/leave/${empId}`, {
        params: { status, type, from, to, page, limit },
      }); 
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch filtered leaves');
      }      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching filtered leaves");
    }
  }
);

export const fetchEmployeeData = createAsyncThunk(
  'auth/fetchEmployeeData',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/login/employee/me');
      if (!res.status) {
        throw new Error(res.message || 'Failed to fetch employee data');
      }      
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err || 'Failed to fetch employee');
    }
  }
);

export const applyLeave = createAsyncThunk(
  'auth/applyLeave',
  async (leaveData, thunkAPI) => {
    try {
      const res = await api.post('/login/leave', leaveData);
      if (!res.status) {
        throw new Error(res.message || 'Failed to apply leave');
      }
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err || 'Failed to apply leave');
    }
  }
);

export const cancelLeave = createAsyncThunk(
  'auth/cancelLeave',
  async (leaveId, thunkAPI) => {
    try {
      const response = await api.patch(`/login/leave/${leaveId}`, {
        status: 'Cancelled',
      });      
      if (!response.status) {
        throw new Error(response.message || 'Failed to cancel leave');
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error cancelling leave');
    }
  }
);

export const submitSupportTicket = createAsyncThunk(
  'auth/submitSupportTicket',
  async ({ employeeId, ticketData }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("subject", ticketData.subject);
      formData.append("category", ticketData.category);
      formData.append("priority", ticketData.priority);
      formData.append("description", ticketData.description);
      
      if (ticketData.attachments) {
        formData.append("attachments", ticketData.attachments);
      }

      const response = await api.postFormData(`/login/ticket/${employeeId}`, formData);
      if (!response.status) {
        throw new Error(response.message || 'Failed to submit ticket');
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Failed to submit ticket');
    }
  }
);

export const getMyTickets = createAsyncThunk(
  'auth/getMyTickets',
  async (employeeId, thunkAPI) => {
    try {
      const response = await api.get(`/login/ticket/${employeeId}`);
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch tickets');
      }
      return response.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Error fetching tickets');
    }
  }
);


// 🔰 INITIAL STATE
const initialState = {
  token: localStorage.getItem('token') || null,
  employee: JSON.parse(localStorage.getItem('employee')) || null,
  loading: false,
  error: null,

  leaveLoading: false,
  leaveSuccess: false,
  leaveError: null,
  leaveData: null,

  leaves: [],
  leavesFiltered: [],

  leavesLoading: false,
  leavesError: null,
  
  tickets: [],
  ticketLoading: false,
  ticketSuccess: false,
  ticketError: null,
};

// 🔧 SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('employee', JSON.stringify(action.payload.employee));
    },
    logout: (state) => {
      state.token = null;
      state.employee = null;
      localStorage.removeItem('token');
      localStorage.removeItem('employee');
    },
    resetLeaveState: (state) => {
      state.leaveLoading = false;
      state.leaveSuccess = false;
      state.leaveError = null;
      state.leaveData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ fetchEmployeeData
      .addCase(fetchEmployeeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeData.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ applyLeave
      .addCase(applyLeave.pending, (state) => {
        state.leaveLoading = true;
        state.leaveSuccess = false;
        state.leaveError = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.leaveLoading = false;
        state.leaveSuccess = true;
        state.leaveData = action.payload;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.leaveLoading = false;
        state.leaveError = action.payload;
      })                                                         
       // Unfiltered Leaves
    .addCase(getMyLeaves.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getMyLeaves.fulfilled, (state, action) => {
      state.loading = false;
      state.leaves = action.payload;
    })
    .addCase(getMyLeaves.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Filtered Leaves
    .addCase(getMyLeavesFiltered.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getMyLeavesFiltered.fulfilled, (state, action) => {
      state.loading = false;
      state.leavesFiltered = action.payload;
    })
    .addCase(getMyLeavesFiltered.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

      // ✅ cancelLeave
      .addCase(cancelLeave.pending, (state) => {
        state.leaveLoading = true;
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.leaveLoading = false;
      })
      .addCase(cancelLeave.rejected, (state, action) => {
        state.leaveLoading = false;
        state.leaveError = action.payload;
      })

.addCase(submitSupportTicket.pending, (state) => {
  state.ticketLoading = true;
  state.ticketSuccess = false;
  state.ticketError = null;
})
.addCase(submitSupportTicket.fulfilled, (state, action) => {
  state.ticketLoading = false;
  state.ticketSuccess = true;
  state.ticketError = null;
})
.addCase(submitSupportTicket.rejected, (state, action) => {
  state.ticketLoading = false;
  state.ticketSuccess = false;
  state.ticketError = action.payload;
})

  .addCase(getMyTickets.pending, (state) => {
  state.ticketLoading = true;
  state.ticketError = null;
})
.addCase(getMyTickets.fulfilled, (state, action) => {
  state.ticketLoading = false;
  state.tickets = action.payload;
})
.addCase(getMyTickets.rejected, (state, action) => {
  state.ticketLoading = false;
  state.ticketError = action.payload;
});
  },
});

// ⛳ EXPORTS
export const { loginSuccess, logout, resetLeaveState } = authSlice.actions;
export default authSlice.reducer;
