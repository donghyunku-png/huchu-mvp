/**
 * API 클라이언트 - JWT 토큰 기반 인증 요청 유틸리티
 */

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

class ApiClient {
  private baseUrl = '';

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // 토큰 만료 또는 미인증
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-user');
        localStorage.removeItem('auth-company');
        window.location.href = '/login';
      }
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || `요청 실패 (${response.status})`);
    }

    return json.data ?? json;
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export type { ApiResponse };
