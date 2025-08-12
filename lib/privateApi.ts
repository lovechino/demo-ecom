import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LoginModel } from '@/models/login.model';
import { UserModel } from '@/models/user.model';
import { LoginType } from '@/types/user.types';
import { UserServices } from '@/services/users.services';

// Interface cho auth data trong localStorage (tương tự LoginType)
interface AuthData {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    phone: string;
  };
}

class PrivateApi {
  private api: AxiosInstance;
  private userServices: UserServices;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: AxiosResponse) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor() {
    this.userServices = new UserServices();
    this.api = axios.create({
      baseURL: "https://demo-ecom-back-end.onrender.com",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor để tự động thêm token vào header
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor để xử lý response và refresh token khi cần
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Nếu đang refresh, thêm request vào queue
            return new Promise<AxiosResponse>((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((response) => {
              return response;
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              // Sử dụng UserServices để refresh token
              const newLoginModel = await this.userServices.refreshToken(refreshToken);
              if (newLoginModel) {
                // Cập nhật localStorage với tokens mới
                this.updateTokens(newLoginModel);
                
                // Thực hiện lại các request đã fail
                this.processQueue(null, newLoginModel.getAccessToken());
                
                // Thực hiện lại request gốc
                originalRequest.headers.Authorization = `Bearer ${newLoginModel.getAccessToken()}`;
                return this.api(originalRequest);
              }
            }
          } catch (refreshError) {
            // Nếu refresh thất bại, logout user
            this.logout();
            this.processQueue(refreshError, null);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Lấy access token từ localStorage
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed: AuthData = JSON.parse(authData);
        return parsed.access_token;
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return null;
  }

  // Lấy refresh token từ localStorage
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed: AuthData = JSON.parse(authData);
        return parsed.refresh_token;
      }
    } catch (error) {
      console.error('Error getting refresh token:', error);
    }
    return null;
  }

  // Cập nhật tokens trong localStorage
  private updateTokens(loginModel: LoginModel): void {
    if (typeof window === 'undefined') return;
    
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed: AuthData = JSON.parse(authData);
        const updatedAuth: AuthData = {
          ...parsed,
          access_token: loginModel.getAccessToken(),
          refresh_token: loginModel.getRefreshToken(),
        };
        localStorage.setItem('auth', JSON.stringify(updatedAuth));
      }
    } catch (error) {
      console.error('Error updating tokens:', error);
    }
  }

  // Xử lý queue các request đã fail
  private processQueue(error: unknown, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        // Tạo một mock response để resolve queue
        const mockResponse = {
          data: token,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse;
        resolve(mockResponse);
      }
    });
    
    this.failedQueue = [];
  }

  // Logout user
  private logout(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('auth');
      // Có thể thêm redirect về trang login ở đây
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Các method HTTP cơ bản
  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const deleteConfig: AxiosRequestConfig = {
      ...config,
      data: data
    };
    const response = await this.api.delete<T>(url, deleteConfig);
    return response.data;
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  // Lấy instance axios gốc nếu cần
  public getInstance(): AxiosInstance {
    return this.api;
  }

  // Method để kiểm tra xem user có đang đăng nhập không
  public isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  // Method để lấy thông tin user hiện tại
  public getCurrentUser(): AuthData['user'] | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed: AuthData = JSON.parse(authData);
        return parsed.user;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  }
}

// Export instance mặc định
const privateApi = new PrivateApi();
export default privateApi;

// Export class nếu muốn tạo nhiều instance
export { PrivateApi };
