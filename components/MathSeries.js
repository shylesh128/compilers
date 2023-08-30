import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // import chart.js

const MathSeriesVisualizer = () => {
  const [formula, setFormula] = useState("");
  const [seriesData, setSeriesData] = useState([]);
  const [range, setRange] = useState(10);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  const calculateSeries = (formula) => {
    const series = [];
    for (let x = 0; x <= range; x++) {
      series.push(eval(formula));
    }
    return series;
  };

  const renderChart = (data) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const ctx = chartContainerRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: data.length }, (_, i) => i + 1),
        datasets: [
          {
            label: "Series Data",
            data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });
  };

  const handleGenerateSeries = () => {
    try {
      const data = calculateSeries(formula);
      setSeriesData(data);
      renderChart(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="container">
      <div id="code-editor">
        <label>Formula</label>
        <input
          type="text"
          placeholder="Enter your mathematical formula but use single veriable n"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          style={{
            backgroundColor: "#333",
            color: "white",
          }}
        ></input>
        <label>Range</label>
        <input
          type="number"
          placeholder="Enter your range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          style={{
            backgroundColor: "#333",
            color: "white",
            width: "100%",
          }}
          max={10000}
        ></input>

        <button onClick={handleGenerateSeries}>Generate Series</button>
        <div className="series-data">{seriesData.join(", ")}</div>
      </div>
      <div
        id="terminal-container"
        style={{
          "@media (maxWidth: 768px)": {
            display: "none",
          },
        }}
      >
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default MathSeriesVisualizer;
