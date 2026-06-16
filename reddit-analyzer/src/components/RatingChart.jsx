import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function RatingChart({ data }) {
  return (
    <>
      <h2>Rating Distribution</h2>

      <BarChart
        width={600}
        height={300}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stars" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </>
  );
}

export default RatingChart;