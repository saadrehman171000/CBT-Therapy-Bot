export interface ChatResponse {
  response: string;
  sentiment: {
    primary_emotion: string;
    emotion_intensity: number;
    identified_mood: string;
  };
  conversation_id: number;
}

export interface ExerciseResponse {
  success: boolean;
  message: string;
  data?: any;
}

class ChatbotAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:5000'; // Your Python backend URL
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async saveExercise(exerciseType: string, data: any): Promise<ExerciseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/${exerciseType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getProgress(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/progress`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export const chatbotAPI = new ChatbotAPI(); 