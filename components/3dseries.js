import { OrbitControls } from "@react-three/drei";
import React, { useState } from "react";
import { Canvas } from "react-three-fiber";

const EquationVisualizer3D = () => {
  const [equation, setEquation] = useState("Math.sin(u) * Math.cos(v)");
  const [grid, setGrid] = useState([]);

  const generatePlot = () => {
    const numPoints = 100;
    const newGrid = [];

    for (let i = 0; i < numPoints; i++) {
      for (let j = 0; j < numPoints; j++) {
        const u = (i / numPoints) * Math.PI * 2;
        const v = (j / numPoints) * Math.PI;

        const x = eval(equation.replace("u", u).replace("v", v));
        const y = u;
        const z = v;

        newGrid.push([x, y, z]);
      }
    }

    setGrid(newGrid);
  };

  return (
    <div id="container">
      <div id="code-editor">
        <input
          type="text"
          placeholder="Enter your 3D equation (e.g., Math.sin(u) * Math.cos(v))"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
        />
        <button onClick={generatePlot}>Generate Plot</button>
      </div>
      <div
        id="terminal-container"
        style={{
          "@media (maxWidth: 768px)": {
            display: "none",
          },
        }}
      >
        <Canvas camera={{ position: [5, 5, 5] }}>
          <axesHelper />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />

          {grid.length > 0 && <PlotPoints grid={grid} />}
        </Canvas>
      </div>
    </div>
  );
};

const PlotPoints = ({ grid }) => {
  return (
    <group>
      {grid.map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry attach="geometry" args={[0.02, 32, 32]} />
          <meshBasicMaterial attach="material" color="red" />
        </mesh>
      ))}
    </group>
  );
};

export default EquationVisualizer3D;
