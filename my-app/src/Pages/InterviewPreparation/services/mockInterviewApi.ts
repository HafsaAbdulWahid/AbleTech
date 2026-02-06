import axios from 'axios';
import {
  SessionConfig,
  StartSessionResponse,
  MessageResponse,
  FeedbackData,
  ApiResponse
} from '../types/interview.types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error.response?.data || error.message);
  }
);

export const mockInterviewApi = {
  startSession: async (config: SessionConfig): Promise<StartSessionResponse> => {
    try {
      const response = await apiClient.post<any, ApiResponse<StartSessionResponse>>(
        '/mock-interview/start',
        config
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to start session:', error);
      throw error;
    }
  },

  // Improved streaming method with better error handling
  sendMessageStream: async (
    sessionId: string, 
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (data: { confidence: number; fullResponse: string }) => void,
    onError: (error: any) => void
  ): Promise<void> => {
    let fullResponse = '';
    
    try {
      const url = `${API_BASE}/mock-interview/${sessionId}/message`;
      const token = localStorage.getItem('token');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; 

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                fullResponse += data.content;
                onChunk(data.content);
              } else if (data.type === 'complete') {
                // Use accumulated fullResponse if not provided
                const finalResponse = data.fullResponse || fullResponse;
                onComplete({
                  confidence: data.confidence || 70,
                  fullResponse: finalResponse
                });
              } else if (data.type === 'error') {
                onError(new Error(data.error || 'Unknown streaming error'));
                return;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError, 'Line:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      onError(error);
    }
  },

  // Legacy non-streaming method (fallback)
  sendMessage: async (sessionId: string, message: string): Promise<MessageResponse> => {
    return new Promise((resolve, reject) => {
      let fullResponse = '';
      let confidence = 70;

      mockInterviewApi.sendMessageStream(
        sessionId,
        message,
        (chunk) => {
          fullResponse += chunk;
        },
        (data) => {
          resolve({
            response: data.fullResponse,
            confidence: data.confidence
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  endSession: async (sessionId: string) => {
    try {
      const response = await apiClient.post(
        `/mock-interview/${sessionId}/end`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to end session:', error);
      throw error;
    }
  },

  submitFeedback: async (sessionId: string, feedback: FeedbackData) => {
    try {
      const response = await apiClient.post(
        `/mock-interview/${sessionId}/feedback`,
        feedback
      );
      return response.data;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  },

  getHistory: async (userId: string) => {
    try {
      const response = await apiClient.get(
        `/mock-interview/history/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get history:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await apiClient.get('/mock-interview/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};