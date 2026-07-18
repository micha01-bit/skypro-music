import { refreshAccessToken } from "@/app/services/auth/authApi";
import { setAccessToken } from "@/store/features/authSlice";
import { AppDispatch } from "@/store/store";
import { AxiosError } from "axios";


export const reAuth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    return await apiFunction('');
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken(refresh); 

        dispatch(setAccessToken(newAccessToken));
        
        return await apiFunction(newAccessToken);
      } catch (refreshError) {
        throw refreshError;
      }
    }

    throw error;
  }
};