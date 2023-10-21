import { UserItem } from '@/interfaces/user.interface';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { HYDRATE } from 'next-redux-wrapper';
import nookies, { parseCookies } from 'nookies';
import { AuthFormData } from '@/interfaces/auth.interface';
import { AppState } from './store';
import { AxiosError } from 'axios';
//=========================================================================================================================
interface AuthSliceState {
	dataUser: null | UserItem,
	status: string
}

interface RespError {
	message: string;
}
//=========================================================================================================================

// Авторизация пользователя
export const fetchLoginData = createAsyncThunk<UserItem, AuthFormData, { rejectValue: string }>(
	'auth/fetchLoginData', async (params: AuthFormData, { rejectWithValue }) => {
		try {
			const { data } = await axios.post('/auth/login', params);
			if (data.token) {
				nookies.set(undefined, 'token', data.token, {
					maxAge: 30 * 24 * 60 * 60,
					path: '/',
				});
			}
			return data;
		} catch (error) {
			const err = error as AxiosError<RespError>;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data.message);
		}
	});

// Получение данных пользователя и проверка прав доступа
export const fetchGetMe = createAsyncThunk(
	'auth/fetchGetMe', async (token: string) => {
		try {
			const { data } = await axios.get<UserItem>('/auth/me', {
				headers: { Authorization: token }
			});
			return data;
		} catch (error) {
			console.log(error);
		}
	});

// Обновление данных пользователя
export const fetchUpdateData = createAsyncThunk(
	'auth/fetchUpdateData', async (params: AuthFormData) => {
		try {
			const cookies = parseCookies();
			const { data } = await axios.post<UserItem>('/auth/update', params, {
				headers: { Authorization: cookies.token ? cookies.token : '' }
			});
			return data;
		} catch (error) {
			console.log(error);
		}
	});

const initialState: AuthSliceState = {
	dataUser: null,
	status: 'loading'
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.dataUser = null;
		},
		setDataUser(state, action: PayloadAction<UserItem>) {
			state.dataUser = action.payload;
			state.status = 'success';
		},
	},
	extraReducers: {
		// Login
		[fetchLoginData.pending.toString()]: (state) => {
			state.status = 'pending';
		},
		[fetchLoginData.fulfilled.toString()]: (state, action: PayloadAction<UserItem>) => {
			state.status = 'success';
			state.dataUser = action.payload;
		},
		[fetchLoginData.rejected.toString()]: (state) => {
			state.status = 'rejected';
		},

		// GetMe
		[fetchGetMe.pending.toString()]: (state) => {
			state.status = 'pending';
		},
		[fetchGetMe.fulfilled.toString()]: (state, action: PayloadAction<UserItem>) => {
			state.status = 'success';
			state.dataUser = action.payload;
		},
		[fetchGetMe.rejected.toString()]: (state) => {
			state.status = 'rejected';
		},

		// Update
		[fetchUpdateData.pending.toString()]: (state) => {
			state.status = 'pending';
		},
		[fetchUpdateData.fulfilled.toString()]: (state, action: PayloadAction<UserItem>) => {
			state.status = 'success';
			state.dataUser = action.payload;
		},
		[fetchUpdateData.rejected.toString()]: (state) => {
			state.status = 'rejected';
		},

		// Гидрация
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.auth,
			};
		},
	},

});

export const { logout, setDataUser } = authSlice.actions;

export const dataUserSelect = (state: AppState) => state.auth.dataUser;

export const authReducer = authSlice.reducer;