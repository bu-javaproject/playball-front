export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  hasNext: boolean;
}
