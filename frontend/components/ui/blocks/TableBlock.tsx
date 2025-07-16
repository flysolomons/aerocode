import React from "react";

interface TableData {
  cell: any[];
  data: string[][];
  mergeCells: any[];
  table_caption?: string;
  first_col_is_header: boolean;
  table_header_choice: string;
  first_row_is_table_header: boolean;
}

interface TableBlockProps {
  tableData: TableData;
}

const TableBlock: React.FC<TableBlockProps> = ({ tableData }) => {
  if (!tableData || !tableData.data || tableData.data.length === 0) {
    return null;
  }

  const { data, table_caption, first_row_is_table_header, first_col_is_header } = tableData;
  
  // Separate header and body data
  const headerRow = first_row_is_table_header ? data[0] : null;
  const bodyData = first_row_is_table_header ? data.slice(1) : data;

  return (
    <div className="table-block-container my-8">
      {table_caption && (
        <div className="table-caption text-center mb-4">
          <h3 className="text-lg font-semibold">{table_caption}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          {headerRow && (
            <thead>
              <tr className="bg-gray-100">
                {headerRow.map((cell, index) => (
                  <th
                    key={index}
                    className={`border border-gray-300 px-4 py-2 text-left font-semibold ${
                      first_col_is_header && index === 0 ? "bg-gray-200" : ""
                    }`}
                  >
                    {cell || ""}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          <tbody>
            {bodyData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => {
                  const isFirstColumn = first_col_is_header && cellIndex === 0;
                  const Tag = isFirstColumn ? "th" : "td";
                  
                  return (
                    <Tag
                      key={cellIndex}
                      className={`border border-gray-300 px-4 py-2 ${
                        isFirstColumn ? "font-semibold bg-gray-100" : ""
                      }`}
                      scope={isFirstColumn ? "row" : undefined}
                    >
                      {cell || ""}
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBlock;