function AIRecommendation({ recommendation }) {
  if (!recommendation) return null;

  const getColor = () => {
    switch (recommendation.recommendation) {
      case "BUY":
        return "bg-green-600";

      case "HOLD":
        return "bg-yellow-500";

      case "SELL":
        return "bg-red-600";

      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className={`mt-5 rounded-lg p-4 ${getColor()}`}>

      <h3 className="text-lg font-bold">
        🤖 AI Recommendation
      </h3>

      <p className="text-2xl font-bold mt-2">
        {recommendation.recommendation}
      </p>

      <p className="mt-2">
        Confidence : {recommendation.score}%
      </p>

      <ul className="mt-3 list-disc ml-5 text-sm">
        {recommendation.reason.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>
  );
}

export default AIRecommendation;