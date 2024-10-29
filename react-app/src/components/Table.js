import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import './Table.css';

const TableGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    // Fetch data and columns dynamically from backend
    axios.get("http://localhost:8000/table-data")
      .then((response) => {
        console.log("Data from backend:", response.data); // Verifica los datos recibidos en la consola
      if (response.data.error) {
        console.error(response.data.error);
        return;
      }
        const enhancedColumnDefs = response.data.columns.map((col, index) => {
            if (col.field === "Profit") {
              return {
                ...col,
                editable: true,
                filter: true,
                cellClassRules: {
                  "rating-red": (params) => params.value < 0,
                  "rating-yellow": (params) => params.value >= 0 && params.value < 100,
                  "rating-green": (params) => params.value >= 100,
                },
              };
            }
            return {
              ...col,
              editable: true,
              filter: true,
              floatingFilter: true,
              checkboxSelection: index === 0,
              headerCheckboxSelection: index === 0,
            };
          });
          setColumnDefs(enhancedColumnDefs);
          setRowData(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={'multiple'}
        // pagination={true}
        // paginationPageSize={10}
      />
    </div>
  );
};

export default TableGrid;
