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

  const {
    data,
    table_caption,
    first_row_is_table_header,
    first_col_is_header,
  } = tableData;

  // Separate header and body data
  const headerRow = first_row_is_table_header ? data[0] : null;
  const bodyData = first_row_is_table_header ? data.slice(1) : data;

  return (
    <div className="table-block-container my-8">
      {table_caption && (
        <div className="table-caption text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {table_caption}
          </h3>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-xl bg-white shadow-md">
        <table className="min-w-full table-fixed">
          {headerRow && (
            <thead className="bg-blue-50">
              <tr>
                {headerRow.map((cell, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-sm font-semibold text-blue-400 tracking-wide"
                    style={{ width: `${100 / headerRow.length}%` }}
                  >
                    {cell || ""}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody className="bg-white">
            {bodyData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-100 hover:bg-yellow-50 transition-colors duration-150"
              >
                {row.map((cell, cellIndex) => {
                  const isFirstColumn = first_col_is_header && cellIndex === 0;
                  const Tag = isFirstColumn ? "th" : "td";

                  return (
                    <Tag
                      key={cellIndex}
                      className={`px-6 py-4 text-sm text-left ${
                        isFirstColumn
                          ? "font-semibold text-gray-900 bg-gray-50/80"
                          : "text-gray-600"
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {bodyData.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-lg">📋</span>
              </div>
              <span className="text-sm text-gray-500">No data available</span>
            </div>
          </div>
        ) : (
          bodyData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="space-y-3">
                {row.map((cell, cellIndex) => {
                  // Get the header for this column
                  const columnHeader = headerRow
                    ? headerRow[cellIndex]
                    : `Column ${cellIndex + 1}`;

                  // Skip empty cells
                  if (cell === null || cell === undefined || cell === '') return null;

                  return (
                    <div key={cellIndex}>
                      <div className="text-xs text-gray-400 mb-1">
                        {columnHeader || `Column ${cellIndex + 1}`}
                      </div>
                      <div
                        className={`text-sm ${
                          first_col_is_header && cellIndex === 0
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {cell}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TableBlock;
