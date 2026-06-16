import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
} from "recharts";

function SentimentChart({ data }) {
  return (
    <>
      <h2>User Sentiment</h2>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </>
  );
}

export default SentimentChart;