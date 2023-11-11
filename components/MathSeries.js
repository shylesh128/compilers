import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const MathSeriesVisualizer = () => {
  const [formula, setFormula] = useState("");
  const [seriesData, setSeriesData] = useState([]);
  const [range, setRange] = useState(10);
  const [showQuadrant1, setShowQuadrant1] = useState(true);
  const [showQuadrant2, setShowQuadrant2] = useState(true);
  const [showQuadrant3, setShowQuadrant3] = useState(true);
  const [showQuadrant4, setShowQuadrant4] = useState(true);
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
            data: data.map((value, index) => {
              // Check the quadrant of the data point and include it only if the corresponding quadrant is selected.
              if (
                (value >= 0 && value <= range && showQuadrant1) ||
                (value < 0 && showQuadrant2) ||
                (value > range && showQuadrant3) ||
                (value < 0 && value > -range && showQuadrant4)
              ) {
                return value;
              }
              return null; // Exclude data points outside selected quadrants.
            }),
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
          placeholder="Enter your mathematical formula but use single variable n"
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

        <label>Show Quadrants</label>
        <div>
          <label>Show Quadrant 1</label>
          <input
            type="checkbox"
            checked={showQuadrant1}
            onChange={() => setShowQuadrant1(!showQuadrant1)}
          />
        </div>
        <div>
          <label>Show Quadrant 2</label>
          <input
            type="checkbox"
            checked={showQuadrant2}
            onChange={() => setShowQuadrant2(!showQuadrant2)}
          />
        </div>
        <div>
          <label>Show Quadrant 3</label>
          <input
            type="checkbox"
            checked={showQuadrant3}
            onChange={() => setShowQuadrant3(!showQuadrant3)}
          />
        </div>
        <div>
          <label>Show Quadrant 4</label>
          <input
            type="checkbox"
            checked={showQuadrant4}
            onChange={() => setShowQuadrant4(!showQuadrant4)}
          />
        </div>

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
