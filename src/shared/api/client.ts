import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type { ApiResponse } from '@/shared/types/api';

import { ApiError } from './errors';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    `${API_BASE_URL}/api/auth/refresh`,
    { refreshToken },
  );

  if (!response.data.success || !response.data.data) {
    throw new ApiError(response.data.message || '토큰 재발급에 실패했습니다.', 401, response.data);
  }

  const nextTokens = response.data.data;
  setTokens(nextTokens);

  return nextTokens.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status ?? 0;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });

        const nextAccessToken = await refreshPromise;

        if (nextAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        clearTokens();
      }
    }

    const message = error.response?.data?.message ?? error.message ?? 'API 요청에 실패했습니다.';
    throw new ApiError(message, status, error.response?.data);
  },
);

export async function unwrapApiResponse<T>(request: Promise<{ data: ApiResponse<T> }>) {
  const response = await request;
  const body = response.data;

  if (!body.success) {
    throw new ApiError(body.message || 'API 요청에 실패했습니다.', 200, body);
  }

  return body.data;
}
