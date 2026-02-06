export interface Interviewer {
  id: string;
  name: string;
  avatar?: string;
  locked: boolean;
  description?: string;
}

export interface SessionConfig {
  role?: string;
  domain?: string;
  userId?: string;
  userName?: string;
}

export interface Message {
  role: 'ai' | 'user';
  text: string;
  time: string;
  timestamp?: Date;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  role?: string;
  domain?: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'interrupted';
  messages: Message[];
  analytics?: {
    duration: number;
    questionsAsked: number;
    averageResponseTime: number;
    confidence: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StartSessionResponse {
  sessionId: string;
  firstQuestion: string;
  interviewerVideo: string;
}

export interface MessageResponse {
  response: string;
  confidence: number;
}

export interface FeedbackData {
  rating: number;
  comments?: string;
}