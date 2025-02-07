import asyncio
from src.bot.chatbot import CBTChatbot
import atexit
import signal
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, Any
from src.tracking.progress_tracker import ProgressTracker

app = FastAPI()
chatbot = None
progress_tracker = None

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def initialize():
    global chatbot, progress_tracker
    if chatbot is None:
        chatbot = CBTChatbot()
    if progress_tracker is None:
        progress_tracker = ProgressTracker()
    return chatbot, progress_tracker

async def shutdown(signal=None):
    """Clean shutdown of the bot"""
    print('\nShutting down gracefully...')
    try:
        if chatbot:
            await chatbot.save_session()
        await asyncio.sleep(0.1)  # Give GRPC time to clean up
    except Exception as e:
        print(f"Error during shutdown: {e}")
    finally:
        tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
        [task.cancel() for task in tasks]
        await asyncio.gather(*tasks, return_exceptions=True)

@app.on_event("startup")
async def startup_event():
    await initialize()

@app.on_event("shutdown")
async def shutdown_event():
    await shutdown()

@app.post("/chat")
async def chat(message: Dict[str, str]) -> Dict[str, Any]:
    try:
        bot, _ = await initialize()
        result = await bot.process_message(message["message"])
        
        # Debug logging
        print("Chat result:", result)
        print("Progress data:", bot.progress_tracker.get_progress())
        
        return result
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return {"error": str(e)}

@app.post("/exercises/{exercise_type}")
async def save_exercise(exercise_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        bot, _ = await initialize()
        
        # Add exercise data to progress tracker
        bot.progress_tracker.add_exercise({
            "type": exercise_type,
            "completedAt": data.get("completedAt"),
            "steps": data.get("steps", 0),
            "responses": data.get("responses", {})
        })
        
        return {
            "success": True,
            "message": f"{exercise_type.capitalize()} exercise completed successfully!"
        }
    except Exception as e:
        print(f"Error saving exercise: {e}")
        return {
            "success": False,
            "message": str(e)
        }

@app.get("/progress")
async def get_progress() -> Dict[str, Any]:
    try:
        bot, _ = await initialize()
        progress_data = bot.progress_tracker.get_progress()
        
        # Debug logging
        print("Returning progress data:", progress_data)
        
        return progress_data
    except Exception as e:
        print(f"Error in progress endpoint: {e}")
        return {"error": str(e)}

async def cli_mode():
    """Run the bot in CLI mode"""
    bot, _ = await initialize()
    
    print("CBT Therapeutic Chatbot")
    print("Type 'quit' to exit")
    print("-" * 50)

    while True:
        try:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                print("Goodbye!")
                break
            
            try:
                result = await bot.process_message(user_input)
                print("\nBot:", result["response"])
                print("\nSentiment Analysis:")
                print(f"Primary Emotion: {result['sentiment']['primary_emotion']}")
                print(f"Emotion Intensity: {result['sentiment']['emotion_intensity']}/10")
                print(f"Mood: {result['sentiment']['identified_mood']}")
                
            except Exception as e:
                print(f"\nError: {str(e)}")
        except KeyboardInterrupt:
            break

    await bot.save_session()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        # Run in CLI mode
        asyncio.run(cli_mode())
    else:
        # Run as FastAPI server
        uvicorn.run(app, host="0.0.0.0", port=5000) 