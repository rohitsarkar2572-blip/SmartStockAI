import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function PortfolioBarChart({ portfolio }) {
  const data = portfolio.map((stock) => ({
    symbol: stock.symbol,
    Investment: stock.investment,
    CurrentValue: stock.current_value,
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-10">

      <h2 className="text-2xl font-bold text-white mb-6">
        📊 Investment vs Current Value
      </h2>

      <div className="w-full h-96">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="symbol" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Investment"
              fill="#3B82F6"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="CurrentValue"
              fill="#10B981"
              radius={[5, 5, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default PortfolioBarChart;