import React from 'react';

const StockDetail = ({ data }) => {
  if (!data) return null;

  const timeSeries = data['Time Series (Daily)'];
  const latestDate = Object.keys(timeSeries)[0];
  const details = timeSeries[latestDate];

  return (
    <div className="stock-card">
      <h2>{data['Meta Data']['2. Symbol']}</h2>
      <p><strong>Date:</strong> {latestDate}</p>
      <p><strong>Open:</strong> {details['1. open']}</p>
      <p><strong>High:</strong> {details['2. high']}</p>
      <p><strong>Low:</strong> {details['3. low']}</p>
      <p><strong>Close:</strong> {details['4. close']}</p>
      <p><strong>Volume:</strong> {details['5. volume']}</p>
    </div>
  );
};

export default StockDetail;
