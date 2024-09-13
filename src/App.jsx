import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [data, setData] = useState([]);
  const [flowRate, setFlowRate] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/water");
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/water", {
        flowRate,
        quantity,
      });
      fetchData();
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Smart Water Meter System
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Flow Rate"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Data</h2>
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item._id} className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <span>{item.flowRate} L/min</span>
                <span>{item.quantity} L</span>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
