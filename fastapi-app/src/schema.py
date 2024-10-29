import strawberry
from typing import List
from strawberry.scalars import JSON
import pandas as pd

@strawberry.type
class Column:
    headerName: str
    field: str

@strawberry.type
class TableData:
    columns: List[Column]
    rows: List[JSON]  

@strawberry.type
class Query:
    @strawberry.field
    def get_table_data(self) -> TableData:

        file_path = "data/EWTL.xlsx"
    
        # Load the file using pandas
        try:
            df = pd.read_excel(file_path)
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            return TableData(columns=[], rows=[]) 
        
        columns = [Column(headerName=col, field=col) for col in df.columns]
        try:
        # Convert DataFrame to JSON-compatible format
            rows = df.astype(str).to_dict(orient="records")
        except Exception as e:
            print(f"Error converting rows to JSON: {str(e)}")
            rows = []

        return TableData(columns=columns, rows=rows)

# Create the schema
schema = strawberry.Schema(query=Query)


