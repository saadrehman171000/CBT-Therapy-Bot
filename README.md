# CBT Therapy Bot 🤖💭

A modern web application that combines Cognitive Behavioral Therapy (CBT) techniques with AI to provide accessible mental health support. The bot offers therapeutic conversations, guided exercises, and progress tracking to help users improve their mental well-being.

## 🌟 Features

### 💬 Interactive CBT Chat
- Real-time conversations with an AI therapist
- Emotion and sentiment analysis
- Therapeutic responses based on CBT principles
- Message history tracking

### 🎯 Guided CBT Exercises
- **Mindfulness Meditation** (5 minutes)
  - Guided meditation for anxiety reduction
  - Step-by-step instructions with timer
  
- **Deep Breathing** (3 minutes)
  - Structured breathing exercises
  - Timed breathing patterns
  
- **Gratitude Journal** (5 minutes)
  - Guided gratitude reflection
  - Mood improvement exercises
  
- **Thought Record** (10 minutes)
  - Cognitive restructuring practice
  - Negative thought pattern analysis

### 📊 Progress Tracking
- Visual mood tracking over time
- Exercise completion history
- Daily streak monitoring
- Session statistics
- Emotional intensity patterns

## 🛠️ Technology Stack

### Frontend
- Next.js 13+ (React)
- TypeScript
- Tailwind CSS
- Chart.js for data visualization

### Backend
- FastAPI (Python)
- Google's Gemini Pro AI
- TextBlob for sentiment analysis
- SQLite for data storage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Google Gemini API key

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/saadrehman171000/CBT-Therapy-Bot.git
    cd cbt-therapy-bot
    ```

2. Install frontend dependencies

    ```bash
    cd frontend
    npm install
    ```

3. Install backend dependencies

    ```bash
    cd ..
    cd backend
    pip install -r requirements.txt
    ```

4. Set up environment variables

    Create `.env` file in the root directory and add:

    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

5. Start the development servers

    **Backend:**

    ```bash
    cd backend
    python run.py
    ```

    **Frontend:**

    ```bash
    cd frontend
    npm run dev
    ```

    The application will be available at `http://localhost:3000`

## 📱 Usage

1. **Start a Chat Session**
   - Navigate to the Chat section
   - Share your thoughts and feelings
   - Receive therapeutic responses and suggestions

2. **Try CBT Exercises**
   - Choose from available exercises
   - Follow the step-by-step guide
   - Use the interactive timer
   - Track your completion

3. **Monitor Progress**
   - View your mood trends
   - Check exercise completion history
   - Track your daily streak
   - Review session statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- CBT principles and techniques from established therapeutic practices
- Open-source community for various tools and libraries

## ⚠️ Disclaimer

This application is not a replacement for professional mental health treatment. If you're experiencing serious mental health issues, please consult with a qualified mental health professional.

## 📞 Support

For support, please open an issue in the GitHub repository or contact saadrehman17100@gmail.com.
