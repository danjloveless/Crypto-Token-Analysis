import React from 'react';

const DataDisplay = ({ data }) => {
  return (
    <div>
      <h2>Token Details</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataDisplay;
