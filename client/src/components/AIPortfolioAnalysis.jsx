const AIPortfolioAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const riskColor = {
    Low: "text-green-400",
    Medium: "text-yellow-400",
    High: "text-red-400",
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">
        🤖 AI Portfolio Analysis
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-200">Portfolio Score</p>
          <h3 className="text-3xl font-bold">
            {analysis.score}/100
          </h3>
        </div>

        <div>
          <p className="text-gray-200">Risk Level</p>
          <h3 className={`text-2xl font-bold ${riskColor[analysis.risk]}`}>
            {analysis.risk}
          </h3>
        </div>

        <div>
          <p className="text-gray-200">Diversification</p>
          <h3 className="text-2xl font-bold">
            {analysis.diversification}
          </h3>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        AI Suggestions
      </h3>

      <ul className="list-disc pl-5 space-y-2">
        {analysis.suggestions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default AIPortfolioAnalysis;