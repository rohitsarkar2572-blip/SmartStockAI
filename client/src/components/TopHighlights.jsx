import { TrendingUp, TrendingDown } from "lucide-react";

function TopHighlights({ highlights }) {
  if (!highlights) return null;

  const { top_gainer, top_loser } = highlights;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {/* Top Gainer */}
      <div className="bg-green-900 rounded-xl p-6 shadow-lg">

        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-400" size={28} />
          <h2 className="text-2xl font-bold text-white">
            Top Gainer
          </h2>
        </div>

        {top_gainer ? (
          <>
            <h3 className="text-3xl font-bold text-green-300">
              {top_gainer.symbol}
            </h3>

            <p
              className={`text-xl mt-3 font-semibold ${
                top_gainer.profit >= 0
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {top_gainer.profit >= 0 ? "+" : ""}
              ${top_gainer.profit.toFixed(2)}
            </p>

            <p
              className={`text-lg font-semibold ${
                top_gainer.profit_percent >= 0
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {top_gainer.profit_percent >= 0 ? "+" : ""}
              {top_gainer.profit_percent.toFixed(2)}%
            </p>
          </>
        ) : (
          <p className="text-gray-300">No Data</p>
        )}

      </div>

      {/* Top Loser */}
      <div className="bg-red-900 rounded-xl p-6 shadow-lg">

        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-red-400" size={28} />
          <h2 className="text-2xl font-bold text-white">
            Top Loser
          </h2>
        </div>

        {top_loser ? (
          <>
            <h3 className="text-3xl font-bold text-red-300">
              {top_loser.symbol}
            </h3>

            <p
              className={`text-xl mt-3 font-semibold ${
                top_loser.profit >= 0
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {top_loser.profit >= 0 ? "+" : ""}
              ${top_loser.profit.toFixed(2)}
            </p>

            <p
              className={`text-lg font-semibold ${
                top_loser.profit_percent >= 0
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {top_loser.profit_percent >= 0 ? "+" : ""}
              {top_loser.profit_percent.toFixed(2)}%
            </p>
          </>
        ) : (
          <p className="text-gray-300">No Data</p>
        )}

      </div>

    </div>
  );
}

export default TopHighlights;