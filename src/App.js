import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Slider } from "@mui/material";

function simulateAloha(numNodes, numRounds, arrivalProb, slotted = false) {
  const results = [];

  for (let round = 1; round <= numRounds; round++) {
    const attempts = [];

    for (let node = 0; node < numNodes; node++) {
      if (Math.random() < arrivalProb) {
        attempts.push(node);
      }
    }

    const result = {
      round,
      attempts: attempts.length,
      success: attempts.length === 1 ? 1 : 0,
      collisions: attempts.length > 1 ? 1 : 0,
    };

    if (!slotted && Math.random() < 0.5) {
      result.success = 0;
      result.collisions = attempts.length > 0 ? 1 : 0;
    }

    results.push(result);
  }

  return results;
}

export default function AlohaLiveSimulator() {
  const [numNodes, setNumNodes] = useState(20);
  const [numRounds, setNumRounds] = useState(100);
  const [arrivalProb, setArrivalProb] = useState(0.1);
  const [pureData, setPureData] = useState([]);
  const [slottedData, setSlottedData] = useState([]);

  const rerunSimulation = () => {
    setPureData(simulateAloha(numNodes, numRounds, arrivalProb, false));
    setSlottedData(simulateAloha(numNodes, numRounds, arrivalProb, true));
  };

  useEffect(() => {
    rerunSimulation();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
        Live ALOHA vs Slotted ALOHA Simulation
      </h1>

      <div style={{ maxWidth: 800, margin: '2rem auto' }}>
        <label>Number of Nodes: {numNodes}</label>
        <Slider min={5} max={100} value={numNodes} onChange={(e, val) => setNumNodes(val)} />

        <label>Number of Rounds: {numRounds}</label>
        <Slider min={10} max={200} value={numRounds} onChange={(e, val) => setNumRounds(val)} />

        <label>Arrival Probability: {arrivalProb.toFixed(2)}</label>
        <Slider min={0.01} max={0.5} step={0.01} value={arrivalProb} onChange={(e, val) => setArrivalProb(val)} />

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={rerunSimulation} style={{ backgroundColor: '#3B82F6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            Rerun Simulation
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <h2 style={{ textAlign: 'center' }}>Pure ALOHA</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" fill="#10B981" name="Success" />
              <Bar dataKey="collisions" fill="#EF4444" name="Collision" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <h2 style={{ textAlign: 'center' }}>Slotted ALOHA</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={slottedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" fill="#3B82F6" name="Success" />
              <Bar dataKey="collisions" fill="#F59E0B" name="Collision" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
