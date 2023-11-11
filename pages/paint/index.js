import React, { useState, useEffect, useRef } from "react";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(400);
  const [canvasHeight, setCanvasHeight] = useState(100);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    window.devicePixelRatio = 2;

    var scale = window.devicePixelRatio;

    canvas.width = Math.floor(canvasWidth * scale);
    canvas.height = Math.floor(canvasHeight * scale);
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the user input value on the canvas
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(userInput, 10, 30);
  }, [userInput, canvasWidth, canvasHeight]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleWidthChange = (e) => {
    setCanvasWidth(parseInt(e.target.value) || 0);
  };

  const handleHeightChange = (e) => {
    setCanvasHeight(parseInt(e.target.value) || 0);
  };

  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <div>
        <label htmlFor="width">Canvas Width:</label>
        <input
          type="number"
          id="width"
          value={canvasWidth}
          onChange={handleWidthChange}
        />
      </div>
      <div>
        <label htmlFor="height">Canvas Height:</label>
        <input
          type="number"
          id="height"
          value={canvasHeight}
          onChange={handleHeightChange}
        />
      </div>
      <input
        type="text"
        placeholder="Enter your value"
        value={userInput}
        onChange={handleInputChange}
      />
      <div
        style={{
          width: "100vw",
          height: "100%",
          overflow: "auto",
          backgroundColor: "#ffffff",
          opacity: 1,
          backgroundImage:
            "repeating-linear-gradient(45deg, #878787 25%, transparent 25%, transparent 75%, #878787 75%, #878787), repeating-linear-gradient(45deg, #878787 25%, #ffffff 25%, #ffffff 75%, #878787 75%, #878787)",
          backgroundPosition: "0 0, 6px 6px",
          backgroundSize: "12px 12px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black", backgroundColor: "white" }}
        ></canvas>
      </div>
    </div>
  );
};

export default Index;
