# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Allow CORS for the frontend (adjust for your frontend URL if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://frontend:3000"],  # Replace with your frontend URL if different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/table-data")
async def get_table_data() -> dict:
    
    file_path = "data/EWTL.xlsx"
    
    # Load the file using pandas
    try:
        df = pd.read_excel(file_path)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return {"error": "file not found"}

    # Extract column information dynamically
    columns = [{"headerName": col, "field": col} for col in df.columns]

    # Convert rows to a list of dictionaries
    rows = df.to_dict(orient="records")

    return {"columns": columns, "rows": rows}

