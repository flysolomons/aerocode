import React,{useState} from "react";


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

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const {
    data,
    table_caption,
    first_row_is_table_header,
    first_col_is_header,
  } = tableData;

  // Separate header and body data
  const headerRow = first_row_is_table_header ? data[0] : null;
  const bodyData = first_row_is_table_header ? data.slice(1) : data;

  // Search Functionality
   // Filter rows based on search term
  const filteredData = bodyData.filter((row) =>
    row.some((cell) =>
      cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Download functionality
  // Function to convert table data to CSV
  const convertToCSV = (data: string[][], headers?: string[] | null) => {
    const rows = headers ? [headers, ...data] : data;
    return rows
      .map((row) =>
        row
          .map((cell) => `"${cell?.toString().replace(/"/g, '""') || ""}"`)
          .join(",")
      )
      .join("\n");
  };

  // Function to download table as CSV
  const handleDownload = () => {
    const csv = convertToCSV(bodyData, headerRow);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${table_caption || `table-${Date.now()}`}.csv`; // Unique file name
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Email functionality
  // Function to trigger email with table data
  const handleEmail = () => {
    const csv = convertToCSV(bodyData, headerRow);
    const subject = encodeURIComponent(`Table: ${table_caption || "Data"}`);
    const body = encodeURIComponent(`Table Data:\n\n${csv}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };


  return (
    <div className="table-block-container my-2">
      {table_caption && (
        <div className="flex text-center mb-4 lg:w-[500px] bg-white shadow-sm rounded-md">
          <h3 className="text-lg text-left  font-bold text-blue-400 p-2   ">
            {table_caption}
          </h3>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-md bg-white shadow-md">
        <table className="min-w-full table-fixed">
          {headerRow && (
            <thead className="bg-gray-50">
              <tr>
                {/* Search Icon and Input in Header */}
                <th
                  colSpan={headerRow.length}
                  className="px-6 py-4 text-right text-sm font-semibold text-blue-400 tracking-wide"
                >
                  <div className="flex justify-end items-center">
                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-white shadow-sm hover:bg-gray-200 rounded-sm transition-colors duration-150"
                      aria-label="Download as CSV"
                    >
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                    {/* Email Button */}
                    <button
                      onClick={handleEmail}
                      className="p-2 bg-white shadow-sm mx-2 hover:bg-gray-200 rounded-sm transition-colors duration-150"
                      aria-label="Email table data"
                    >
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    {!isSearchOpen ? (
                      <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 bg-white shadow-sm hover:bg-gray-200 rounded-sm transition-colors duration-150"
                        aria-label="Open search"
                      >
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                        <input
                          type="text"
                          placeholder="Search table..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none  w-64 font-normal"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setIsSearchOpen(false);
                          }}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-150"
                          aria-label="Close search"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </th>
              </tr>
              <tr>
                
                {headerRow.map((cell, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-sm font-semibold  text-blue-400 tracking-wide"
                    style={{ width: `${100 / headerRow.length}%` }}
                  >
                    {cell || ""}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody className="bg-white">
             {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={headerRow?.length || data[0].length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No results found
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
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
              ))
            )}
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
