import React, { useState, useCallback } from "react";
import axios from "axios";
import "./index.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Import the external CSS file

const FLOW_RATE_THRESHOLD = 100; // Example threshold value, adjust as needed
const OVERFLOW_DURATION = 5000; // Duration in milliseconds to consider as overflow

function App() {
  const [data, setData] = useState([]);
  const [flowRate, setFlowRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowTimeout, setOverflowTimeout] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get("http://localhost:5000/api/water");
      setData(result.data);

      // Check for overflow condition
      const currentFlowRate = result.data[result.data.length - 1]?.flowRate;
      if (currentFlowRate > FLOW_RATE_THRESHOLD) {
        if (!overflowTimeout) {
          const timeout = setTimeout(() => {
            setIsOverflowing(true);
            toast.error("Water is overflowing!");
          }, OVERFLOW_DURATION);
          setOverflowTimeout(timeout);
        }
      } else {
        if (overflowTimeout) {
          clearTimeout(overflowTimeout);
          setOverflowTimeout(null);
        }
        setIsOverflowing(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [overflowTimeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flowRate || !quantity) {
      toast.error("Both fields are required");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/water", {
        flowRate,
        quantity,
      });
      fetchData();
      setFlowRate("");
      setQuantity("");
      toast.success("Data submitted successfully");
    } catch (error) {
      console.error("Error submitting data", error);
      toast.error("Error submitting data");
    }
  };

  const handleClearData = async () => {
    if (data.length === 0) {
      toast.error("No data to clear");
      return;
    }
    try {
      // Clear data from UI
      setData([]);
      toast.success("Data cleared successfully");
    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Error clearing data");
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Smart Water Meter System</h1>
        <form onSubmit={handleSubmit} className="app-form">
          <input
            type="number"
            placeholder="Flow Rate"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        <button onClick={fetchData} className="fetch-button">
          Fetch Data
        </button>
        <button onClick={handleClearData} className="clear-button">
          Clear Data
        </button>

        {loading && <p className="loading-text">Loading...</p>}
        {isOverflowing && (
          <p className="overflow-alert">Water is overflowing!</p>
        )}
        <h2 className="data-title">Data</h2>
        <ul className="data-list">
          {data.map((item) => (
            <motion.li
              key={item._id}
              className="data-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="data-details">
                <span>{item.flowRate} L/min</span>
                <span>{item.quantity} L</span>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </motion.li>
          ))}
        </ul>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
