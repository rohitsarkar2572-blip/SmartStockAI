import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
];

function PortfolioPieChart({ portfolio }) {
  const data = portfolio.map((stock) => ({
    name: stock.symbol,
    value: stock.current_value,
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-10">

      <h2 className="text-2xl font-bold text-white mb-6">
        🥧 Portfolio Allocation
      </h2>

      <div className="w-full h-96">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={130}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default PortfolioPieChart;