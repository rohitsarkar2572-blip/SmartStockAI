import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AIRecommendation from "../components/AIRecommendation";
import StockNews from "../components/StockNews";
import AddStockForm from "../components/AddStockForm";
import EditStockModal from "../components/EditStockModal";
import PortfolioPieChart from "../components/PortfolioPieChart";
import PortfolioBarChart from "../components/PortfolioBarChart";
import TopHighlights from "../components/TopHighlights";
import AIPortfolioAnalysis from "../components/AIPortfolioAnalysis";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const navigate = useNavigate();

  const [marketData, setMarketData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  const [analytics, setAnalytics] = useState({
    total_investment: 0,
    current_value: 0,
    total_profit: 0,
    return_percent: 0,
  });

  const [highlights, setHighlights] = useState(null);
  const [recommendations, setRecommendations] = useState({});
  const [news, setNews] = useState({});
  const [aiAnalysis, setAIAnalysis] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ======================
  // Logout
  // ======================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ======================
  // Load Data
  // ======================

  useEffect(() => {

    if (!email) return;

    fetchMarketOverview();
    fetchPortfolio();
    fetchAnalytics();
    fetchHighlights();
    fetchAIAnalysis();

  }, [email]);

  // ======================
  // Market Overview
  // ======================

  const fetchMarketOverview = async () => {

    try {

      const response = await api.get(
        "/api/stocks/market/overview"
      );

      setMarketData(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  // ======================
  // Portfolio
  // ======================

  const fetchPortfolio = async () => {

    try {

      const response = await api.get(
        `/api/portfolio/summary/${email}`
      );

      const stocks = response.data;

      setPortfolio(stocks);

      fetchRecommendations(stocks);

      fetchNews(stocks);

    } catch (error) {

      console.error(error);

    }

  };

  // ======================
  // Analytics
  // ======================

  const fetchAnalytics = async () => {

    try {

      const response = await api.get(
        `/api/portfolio/analytics/${email}`
      );

      console.log("Analytics Response:", response.data);

      setAnalytics(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  // ======================
  // Highlights
  // ======================

  const fetchHighlights = async () => {

    try {

      const response = await api.get(
        `/api/portfolio/highlights/${email}`
      );

      console.log("Highlights Response:", response.data);

      setHighlights(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const fetchRecommendations = async (stocks) => {

    try {

      const data = {};

      for (const stock of stocks) {

        const response = await api.get(
          `/api/stocks/recommendation/${stock.symbol}`
        );

        data[stock.symbol] = response.data;

      }

      setRecommendations(data);

    } catch (error) {

      console.error(error);

    }

  };

  const fetchAIAnalysis = async () => {

    try {

      const response = await api.get(
        `/api/portfolio/ai-analysis/${email}`
      );

      setAIAnalysis(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const fetchNews = async (stocks) => {

    try {

      const data = {};

      for (const stock of stocks) {

        const response = await api.get(
          `/api/stocks/news/${encodeURIComponent(stock.symbol)}`
        );

        data[stock.symbol] = response.data;

      }

      setNews(data);

    } catch (error) {

      console.error(error);

    }

  };
    // ======================
  // Edit
  // ======================

  const handleEdit = (stock) => {

    setSelectedStock(stock);
    setShowEditModal(true);

  };

  // ======================
  // Delete
  // ======================

  const deleteStock = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this stock?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/api/portfolio/delete/${id}`
      );

      alert("✅ Stock Deleted");

      fetchPortfolio();
      fetchAnalytics();
      fetchHighlights();
      fetchAIAnalysis();

    } catch (error) {

      console.error(error);

      alert("❌ Failed");

    }

  };

  return (

    <div className="dashboard">

      <div className="content">

        {/* ================= NAVBAR ================= */}

        <div className="glass navbar">

          <div>

            <h1 className="logo">
              SmartStockAI
            </h1>

            <p style={{ color: "#9ca3af", marginTop: "6px" }}>
              AI Powered Stock Portfolio Dashboard
            </p>

          </div>

          <div className="user-box">

            <div style={{ textAlign: "right" }}>

              <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                Logged in as
              </p>

              <h3>{email}</h3>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* ================= HERO ================= */}

        <div className="hero">

          <h1>

            Manage Your

            <span> AI Portfolio</span>

          </h1>

          <p>

            Track investments, AI recommendations,
            portfolio analytics and real-time market data.

          </p>

        </div>

        {/* ================= ADD STOCK ================= */}

        <AddStockForm
          onSuccess={() => {

            fetchPortfolio();
            fetchAnalytics();
            fetchHighlights();
            fetchAIAnalysis();

          }}
        />

        {/* ================= ANALYTICS ================= */}

        <h2 className="section-title">
          📊 Portfolio Analytics
        </h2>

        <div className="grid-4">

          {[
            {
              title: "Total Investment",
              value: `$${analytics.total_investment.toFixed(2)}`,
              color: "blue",
              icon: "💰",
            },
            {
              title: "Current Value",
              value: `$${analytics.current_value.toFixed(2)}`,
              color: "green",
              icon: "📈",
            },
            {
              title: "Total Profit",
              value: `$${analytics.total_profit.toFixed(2)}`,
              color: analytics.total_profit >= 0 ? "green" : "red",
              icon: "💵",
            },
            {
              title: "Overall Return",
              value: `${analytics.return_percent.toFixed(2)}%`,
              color: analytics.return_percent >= 0 ? "green" : "red",
              icon: "🚀",
            },
          ].map((card, index) => (

            <motion.div
              key={index}
              className="glass card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{
                scale: 1.05,
              }}
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-400">
                    {card.title}
                  </p>

                  <h2 className={`${card.color} text-3xl font-bold mt-2`}>
                    {card.value}
                  </h2>

                </div>

                <div className="text-5xl">
                  {card.icon}
                </div>

              </div>

            </motion.div>

          ))}

        </div>
                {/* ================= MARKET OVERVIEW ================= */}

        <h2 className="section-title">
          📊 Live Market Overview
        </h2>

        <div className="grid-3">

          {marketData.map((item, index) => (

            <motion.div
              key={item.symbol}
              className="glass market-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
            >

              <div className="flex justify-between items-center mb-4">

                <div>

                  <h3 className="text-xl font-bold">
                    {item.symbol}
                  </h3>

                  <p className="text-gray-400">
                    {item.name}
                  </p>

                </div>

                <div className="text-3xl">
                  📈
                </div>

              </div>

              <h2 className="text-3xl font-bold">
                ${item.price}
              </h2>

              <p
                className={`mt-3 font-semibold ${
                  item.change_percent >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {item.change_percent >= 0 ? "▲" : "▼"}{" "}
                {item.change_percent}%
              </p>

            </motion.div>

          ))}

        </div>

        {/* ================= PORTFOLIO ================= */}

        <h2 className="text-2xl font-bold mt-12 mb-6">
          📂 My Portfolio
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {portfolio.length > 0 ? (

            portfolio.map((stock) => (

              <div
                key={stock._id}
                className="glass card"
              >

                {/* Header */}

                <div className="flex justify-between items-center mb-4">

                  <h3 className="text-xl font-bold">
                    {stock.symbol}
                  </h3>

                  <div className="flex gap-2">

                    <button
                      onClick={() => handleEdit(stock)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-semibold"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deleteStock(stock._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

                {/* Stock Details */}

                <div className="space-y-2">

                  <p>
                    <span className="font-semibold">
                      Quantity :
                    </span>{" "}
                    {stock.quantity}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Buy Price :
                    </span>{" "}
                    ${stock.buy_price}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Current Price :
                    </span>{" "}
                    ${stock.current_price}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Investment :
                    </span>{" "}
                    ${stock.investment}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Current Value :
                    </span>{" "}
                    ${stock.current_value}
                  </p>

                  <p
                    className={
                      stock.profit >= 0
                        ? "text-green-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    Profit : ${stock.profit}
                  </p>

                  <p
                    className={
                      stock.profit_percent >= 0
                        ? "text-green-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    Return : {stock.profit_percent}%
                  </p>

                  <AIRecommendation
                    recommendation={recommendations[stock.symbol]}
                  />

                  <StockNews
                    news={news[stock.symbol]}
                  />

                </div>

              </div>

            ))

          ) : (

            <div className="col-span-3 text-center py-10">

              <h3 className="text-xl text-gray-400">
                📭 No stocks in your portfolio.
              </h3>

            </div>

          )}

        </div>
                {/* ================= PORTFOLIO CHARTS ================= */}

        <PortfolioPieChart portfolio={portfolio} />

        <PortfolioBarChart portfolio={portfolio} />

        {/* ================= TOP HIGHLIGHTS ================= */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            ⭐ Portfolio Highlights
          </h2>

          <TopHighlights
            highlights={highlights}
          />

        </div>

        {/* ================= AI PORTFOLIO ANALYSIS ================= */}

        <AIPortfolioAnalysis
          analysis={aiAnalysis}
        />

        {/* ================= EDIT MODAL ================= */}

        {showEditModal && (

          <EditStockModal
            stock={selectedStock}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {

              fetchPortfolio();
              fetchAnalytics();
              fetchHighlights();
              fetchAIAnalysis();

              setShowEditModal(false);

            }}
          />

        )}

      </div>

    </div>

  );

}

export default Dashboard;