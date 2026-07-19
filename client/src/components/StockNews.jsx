import { ExternalLink, Newspaper } from "lucide-react";

const StockNews = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Newspaper className="text-blue-600" />
          Latest News
        </h2>

        <p className="text-gray-500">
          No news available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mt-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Newspaper className="text-blue-600" />
        Latest News
      </h2>

      <div className="space-y-4">
        {news.map((article, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-lg">
              {article.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {article.description}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {article.source}
              </span>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                Read More
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockNews;