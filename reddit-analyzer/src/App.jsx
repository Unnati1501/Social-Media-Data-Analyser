import { useState, useEffect } from "react";
import axios from "axios";

import "./styles/Dashboard.css";

import AnalyticsCard from "./components/AnalyticsCard";
import RatingChart from "./components/RatingChart";
import SentimentChart from "./components/SentimentChart";
import KeywordCloud from "./components/KeywordCloud";

function App() {
  const [appName, setAppName] = useState("");
  const [appData, setAppData] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/history"
      );

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchApp = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/app/${appName}`
      );

      setAppData(response.data);

      await fetchHistory();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>📊 App Analytics Hub</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter app name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={searchApp}
          style={{
            padding: "10px 20px",
          }}
        >
          Search
        </button>
      </div>

      {appData && (
        <>
          <h2>{appData.name}</h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <AnalyticsCard
              title="⭐ Rating"
              value={appData.rating}
            />

            <AnalyticsCard
              title="📥 Downloads"
              value={appData.downloads}
            />

            <AnalyticsCard
              title="📝 Reviews"
              value={appData.reviews}
            />
          </div>

          <RatingChart
            data={appData.ratings || []}
          />

          <br />

          <SentimentChart
            data={appData.sentiment || []}
          />

          <br />

          <KeywordCloud
            keywords={appData.keywords || []}
          />

          <br />

          <h2>AI Insights</h2>

          <ul>
            {(appData.insights || []).map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>

          <br />

          <h2>Competitors</h2>

          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>App</th>
                <th>Rating</th>
                <th>Downloads</th>
              </tr>
            </thead>

            <tbody>
              {(appData.competitors || []).map(
                (app) => (
                  <tr key={app.name}>
                    <td>{app.name}</td>
                    <td>{app.rating}</td>
                    <td>{app.downloads}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <br />

          <h2>Recent Reviews</h2>

          <ul>
            {(appData.sampleReviews || []).map(
              (review, index) => (
                <li key={index}>{review}</li>
              )
            )}
          </ul>
        </>
      )}

      <br />

      <h2>Recent Searches</h2>

      <ul>
        {history.map((item) => (
          <li key={item._id}>
            {item.appName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;