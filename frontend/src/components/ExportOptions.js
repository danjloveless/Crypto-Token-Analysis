import React from 'react';

const ExportOptions = ({ data }) => {
  const handleExport = (format) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `token_data.${format}`;
    a.click();
  };

  return (
    <div>
      <button onClick={() => handleExport('json')}>Export as JSON</button>
      <button onClick={() => handleExport('csv')}>Export as CSV</button>
    </div>
  );
};

export default ExportOptions;
