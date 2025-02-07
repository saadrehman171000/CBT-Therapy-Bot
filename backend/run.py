import sys
import os

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    from src.main import app
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 