import React from "react";
import { useQuery, gql } from "@apollo/client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './Table.css';

const GET_TABLE_DATA = gql`
  query GetTableData {
    getTableData {
      columns {
        headerName
        field
      }
      rows
    }
  }
`;

const TableGrid = () => {
  // Use Apollo's useQuery hook to fetch the data from GraphQL
  const { loading, error, data } = useQuery(GET_TABLE_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Map the columns and set their definitions
  const columnDefs = data.getTableData.columns.map((col, index) => {
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

  // Extract rows directly from the data
  const rowData = data.getTableData.rows;

  return (
    <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={'multiple'}
      />
    </div>
  );
};

export default TableGrid;
