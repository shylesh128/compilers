import { canvaSnippets } from "@/code/codes";
import { js_beautify } from "js-beautify";
import React, { useEffect, useRef, useState } from "react";

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const codeRef = useRef(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const shapes = [];

  const refreshCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.length = 0;

    const code = codeRef.current.value;

    function drawRectangle(ctx, x, y, width, height) {
      ctx.fillRect(x, y, width, height);
    }

    function drawCircle(ctx, x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    function drawLeaf(ctx, x, y, size, color) {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const randomAmplitude = Math.random() * 30 + 10;
        const newX =
          x + Math.cos(angle) * (size + Math.sin(angle * 8) * randomAmplitude);
        const newY =
          y + Math.sin(angle) * (size + Math.sin(angle * 8) * randomAmplitude);
        ctx.lineTo(newX, newY);
      }

      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawPolygon(ctx, x, y, radius, sides) {
      const angle = (Math.PI * 2) / sides;
      ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
      for (let i = 1; i <= sides; i++) {
        ctx.lineTo(
          x + radius * Math.cos(angle * i),
          y + radius * Math.sin(angle * i)
        );
      }
      ctx.closePath();
      ctx.fill();
    }

    function drawStar(ctx, x, y, radius, color) {
      const outerRadius = radius;
      const innerRadius = radius / 2;

      let rot = (Math.PI / 2) * 3;
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < 5; i++) {
        const x1 = x + Math.cos(rot) * outerRadius;
        const y1 = y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x1, y1);
        rot += (Math.PI / 5) * 2;

        const x2 = x + Math.cos(rot) * innerRadius;
        const y2 = y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x2, y2);
        rot += (Math.PI / 5) * 2;
      }
      ctx.lineTo(x, y - outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawHeart(ctx, x, y, size) {
      const curveHeight = size;
      const curveWidth = size;

      ctx.moveTo(x, y - size * 0.5);
      ctx.quadraticCurveTo(x + curveWidth, y - curveHeight, x, y + size * 0.5);
      ctx.quadraticCurveTo(x - curveWidth, y - curveHeight, x, y - size * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    function drawButterFly(ctx, x, y, size) {
      const controlPoint = size * 0.3;
      const halfSize = size * 0.5;

      ctx.moveTo(x, y - halfSize);
      ctx.bezierCurveTo(
        x + controlPoint,
        y - size,
        x + size,
        y - size,
        x + size,
        y - halfSize
      );
      ctx.bezierCurveTo(x + size, y, x + halfSize, y + size, x, y + halfSize);
      ctx.bezierCurveTo(
        x - halfSize,
        y + size,
        x - size,
        y,
        x - size,
        y - halfSize
      );
      ctx.bezierCurveTo(
        x - size,
        y - size,
        x - controlPoint,
        y - size,
        x,
        y - halfSize
      );
      ctx.fill();
    }

    function drawDiamond(ctx, x, y, size) {
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
    }

    function drawOval(ctx, x, y, size) {
      ctx.moveTo(x, y - size * 0.5);
      ctx.ellipse(x, y, size * 0.5, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawLine(ctx, startX, startY, endX, endY, color) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function drawRoundedRectangle(ctx, x, y, size) {
      const cornerRadius = size;
      ctx.moveTo(x + cornerRadius, y);
      ctx.lineTo(x - cornerRadius, y);
      ctx.quadraticCurveTo(x, y, x, y + cornerRadius);
      ctx.lineTo(x, y - cornerRadius);
      ctx.quadraticCurveTo(x, y, x - cornerRadius, y);
      ctx.lineTo(x + cornerRadius, y);
      ctx.quadraticCurveTo(x, y, x, y - cornerRadius);
      ctx.lineTo(x, y + cornerRadius);
      ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
      ctx.fill();
    }

    function drawArrow(ctx, x, y, size, color) {
      const arrowSize = size * 0.5;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - arrowSize, y - arrowSize);
      ctx.moveTo(x, y);
      ctx.lineTo(x - arrowSize, y + arrowSize);
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function drawFibonacciSpiral(
      ctx,
      centerX,
      centerY,
      scaleFactor,
      numberOfFibonacciNumbers,
      color
    ) {
      const fibonacciSequence = generateFibonacci(numberOfFibonacciNumbers);

      ctx.beginPath();
      fibonacciSequence.forEach((num, index) => {
        const angle = index * 0.2;
        const radius = scaleFactor * Math.sqrt(index);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function generateFibonacci(n) {
      const sequence = [0, 1];
      for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      return sequence;
    }

    function drawSpiral(ctx, x, y, size) {
      ctx.beginPath();
      const numLoops = 10;
      const loopSize = size * 0.1;
      const loopSpacing = size * 0.05;
      const rotationPerLoop = 0.2;
      let currentAngle = 0;

      for (let i = 0; i < numLoops; i++) {
        const radius = loopSize + i * loopSpacing;
        const startAngle = currentAngle;
        const endAngle = startAngle + Math.PI * 2 * rotationPerLoop;
        ctx.arc(x, y, radius, startAngle, endAngle, false);
        currentAngle = endAngle;
      }

      ctx.stroke();
    }

    function drawCloud(ctx, x, y, size) {
      ctx.beginPath();
      const cloudSize = size * 0.8;
      const innerRadius = cloudSize * 0.5;
      const outerRadius = cloudSize * 0.7;
      const angleOffset = Math.PI / 6;
      ctx.moveTo(x + outerRadius, y);
      for (let angle = 0; angle < Math.PI * 2; angle += angleOffset) {
        const innerX = x + innerRadius * Math.cos(angle);
        const innerY = y + innerRadius * Math.sin(angle);
        const outerX = x + outerRadius * Math.cos(angle + angleOffset / 2);
        const outerY = y + outerRadius * Math.sin(angle + angleOffset / 2);
        ctx.quadraticCurveTo(innerX, innerY, outerX, outerY);
      }
      ctx.closePath();
    }

    function drawSpirals(ctx, numberOfSpirals) {
      for (let i = 0; i < numberOfSpirals; i++) {
        // Generate random values
        const x = getRandomInt(50, 450);
        const y = getRandomInt(50, 450);
        const z = getRandomFloat(0.5, 4.0);
        const size = getRandomInt(300, 1000);
        const color = getRandomBlueShade();

        drawFibonacciSpiral(ctx, x, y, z, size, color);
      }
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getRandomBlueShade() {
      const blueShades = [
        "#6495ED",
        "#4169E1",
        "#0000CD",
        "#000080",
        "#1E90FF",
      ];
      return blueShades[Math.floor(Math.random() * blueShades.length)];
    }

    function drawSplash(ctx, x, y, size, color) {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      const amplitudes = [20];

      ctx.beginPath();

      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const halfWaveIndex = Math.floor(Math.PI);
        let amplitudeIndex = halfWaveIndex % amplitudes.length;

        if (
          angle > 0 &&
          halfWaveIndex > 0 &&
          amplitudes[amplitudeIndex] === amplitudes[amplitudeIndex - 1]
        ) {
          amplitudeIndex = (amplitudeIndex + 1) % amplitudes.length;
        }

        const amplitude = amplitudes[amplitudeIndex];
        const newX =
          x + Math.cos(angle) * (size + Math.sin(angle * 8) * amplitude);
        const newY =
          y + Math.sin(angle) * (size + Math.sin(angle * 8) * amplitude);

        ctx.lineTo(newX, newY);
      }

      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawStarburst(ctx, x, y, size) {
      ctx.beginPath();
      const numRays = 8;
      const rayLength = size * 0.7;
      const angleOffset = (Math.PI * 2) / numRays;
      const halfAngleOffset = angleOffset / 2; // Half of the angle offset

      for (let i = 0; i < numRays; i++) {
        const angle = i * angleOffset;
        const startX = x + Math.sin(angle) * rayLength;
        const startY = y - Math.cos(angle) * rayLength;

        // Draw an additional line segment to the midpoint between two rays
        const midAngle = angle + halfAngleOffset;
        const midX = x + Math.sin(midAngle) * (rayLength / 2);
        const midY = y - Math.cos(midAngle) * (rayLength / 2);

        ctx.moveTo(startX, startY);
        ctx.lineTo(midX, midY);
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    function drawCrescent(ctx, x, y, size) {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2, false);
      ctx.moveTo(x + size, y);
      ctx.arc(x, y, size, 0, Math.PI / 2, true);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
    }

    function drawCross(ctx, x, y, size, color) {
      const crossSize = size * 0.5;
      ctx.moveTo(x - crossSize, y);
      ctx.lineTo(x + crossSize, y);
      ctx.moveTo(x, y - crossSize);
      ctx.lineTo(x, y + crossSize);
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function current(ctx) {
      ctx.beginPath();
      ctx.arc(200, 200, 70, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "blue";
      ctx.fill();

      const amplitudes = [5, 10, 15, 20, 25, 30]; // Amplitudes for each half wave
      const frequency = 0.02; // Frequency of the sine wave

      ctx.beginPath();

      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const halfWaveIndex = Math.floor(Math.PI / 2); // Identify the half wave index
        let amplitudeIndex = halfWaveIndex % amplitudes.length; // Get the corresponding amplitude index

        if (
          angle > 0 &&
          halfWaveIndex > 0 &&
          amplitudes[amplitudeIndex] === amplitudes[amplitudeIndex - 1]
        ) {
          amplitudeIndex = (amplitudeIndex + 1) % amplitudes.length;
        }

        const amplitude = amplitudes[amplitudeIndex]; // Get the corresponding amplitude
        const x =
          200 + Math.cos(angle) * (100 + Math.sin(angle * 8) * amplitude);
        const y =
          200 + Math.sin(angle) * (100 + Math.sin(angle * 8) * amplitude);

        ctx.lineTo(x, y);
      }

      ctx.fillStyle = "red";
      ctx.fill();
    }

    function drawButterflies(ctx, num) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < num; i++) {
        var x = Math.random() * 500;
        var y = Math.random() * 500;
        var size = Math.random() * 20 + 20;

        drawButterFly(ctx, x, y, size);
      }
    }

    function drawSineWave(ctx, x, y, amplitude, frequency, color) {
      const wavelength = ctx.canvas.width; // Full width of the canvas

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i <= wavelength; i++) {
        const xPos = x + i;
        const yPos =
          y - amplitude * Math.sin((i / wavelength) * frequency * 2 * Math.PI);
        ctx.lineTo(xPos, yPos);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function drawCosWave(ctx, x, y, amplitude, frequency, color) {
      const wavelength = ctx.canvas.width; // Full width of the canvas

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i <= wavelength; i++) {
        const xPos = x + i;
        const yPos =
          y - amplitude * Math.cos((i / wavelength) * frequency * 2 * Math.PI);
        ctx.lineTo(xPos, yPos);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function drawTanWave(ctx, x, y, amplitude, frequency, color) {
      const wavelength = ctx.canvas.width; // Full width of the canvas

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i <= wavelength; i++) {
        const xPos = x + i;
        const yPos =
          y - amplitude * Math.tan((i / wavelength) * frequency * 2 * Math.PI);
        ctx.lineTo(xPos, yPos);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function leafs(ctx) {
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 500;
        const y = Math.random() * 500;
        const size = Math.random() < 0.5 ? 100 : 75;
        const greenShade = Math.floor(Math.random() * 155) + 100;
        const color = `rgb(0, ${greenShade}, 0)`;
        drawLeaf(ctx, x, y, size, color);
      }
    }

    const formattedCode = js_beautify(code);

    try {
      eval(formattedCode);
    } catch (e) {
      alert(`Error: ${e}`);
    }

    // Enable download button
    const downloadButton = document.getElementById("downloadButton");
    downloadButton.href = canvas.toDataURL();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const formatCode = () => {
    const codeTextArea = codeRef.current;
    const code = codeTextArea.value;
    const formattedCode = js_beautify(code);
    codeTextArea.value = formattedCode;
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;

    const dataURL = canvas.toDataURL();

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  const showSuggestions = () => {
    const code = codeRef.current.value;
    const lines = code.split("\n");
    const newFilteredSuggestions = lines.map((line) =>
      canvaSnippets.filter((suggestion) => suggestion.includes(line))
    );
    setFilteredSuggestions(newFilteredSuggestions);
  };

  const replaceLineWithSuggestion = (lineIndex, suggestion) => {
    const codeTextArea = codeRef.current;
    const code = codeTextArea.value;
    const lines = code.split("\n");
    lines[lineIndex] = suggestion;
    const modifiedCode = lines.join("\n");
    codeTextArea.value = modifiedCode;
    setSuggestionsVisible(false);
  };

  const filterSuggestions = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredSuggestionLists = filteredSuggestions.map((suggestionList) =>
      suggestionList.filter((suggestion) =>
        suggestion.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    setFilteredSuggestions(filteredSuggestionLists);
  };

  const showSuggestionsToggle = () => {
    console.log(suggestionsVisible);
    if (!suggestionsVisible) {
      showSuggestions();
    }
    setSuggestionsVisible(!suggestionsVisible);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
  }, [canvasRef]);

  return (
    <div id="container">
      <div id="code-editor">
        <textarea id="code" spellCheck="false" ref={codeRef}></textarea>
        <div
          id="suggestions-container"
          style={{
            display: suggestionsVisible ? "block" : "none",
          }}
        >
          <div>
            <input
              type="text"
              id="searchInput"
              style={{
                display: suggestionsVisible ? "block" : "none",
              }}
              placeholder="Search suggestions..."
              onInput={filterSuggestions}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div id="suggestions">
            {filteredSuggestions.map((suggestionList, index) => (
              <div key={index}>
                {suggestionList.map((suggestion, suggestionIndex) => (
                  <div
                    key={suggestionIndex}
                    className="suggestion"
                    onClick={() => {
                      replaceLineWithSuggestion(index, suggestion);
                      setSuggestionsVisible(false); // Move this line here
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <button onClick={clearCanvas}>Clear</button>
          <button onClick={refreshCanvas}>Run</button>
          <button onClick={formatCode}>Format</button>
          <button onClick={showSuggestionsToggle}>Snippets</button>

          <button onClick={downloadCanvas} id="downloadButton">
            Download
          </button>
        </div>
      </div>
      <div id="canvas-container">
        <canvas id="canvas" ref={canvasRef} width="500" height="500"></canvas>
      </div>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.8/beautify.min.js"
        integrity="sha512-QlM6B393C0vSZkj8UhK4NCgfULmwlkACC5VB4oaNRuuhds7UeEhxywzr0GFpL7A7R0SBDZPsqOU8v4eu2Lk3ag=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></script>
    </div>
  );
};

export default CanvasPage;
