import { useState } from "react";
import api from "../services/api";

function AddStockForm({ onSuccess }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [symbol, setSymbol] = useState("");
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchStocks = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/api/stocks/search?q=${value}`
      );

      setSuggestions(res.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectStock = (stock) => {
    setSearch(stock.name);
    setSymbol(stock.symbol);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!symbol) {
      alert("Please select a company");
      return;
    }

    try {
      await api.post("/api/portfolio/add", {
        email,
        symbol,
        quantity: Number(quantity),
        buy_price: Number(buyPrice),
      });

      alert("✅ Stock Added Successfully");

      setSearch("");
      setSymbol("");
      setQuantity("");
      setBuyPrice("");
      setSuggestions([]);

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error(error);
      alert("❌ Failed to add stock");
    }
  };
    return (
    <div className="bg-gray-800 p-6 rounded-xl mb-10">
      <h2 className="text-2xl font-bold mb-6">
        ➕ Add Stock
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >

        {/* Search Company */}
        <div className="relative">

          <input
            type="text"
            placeholder="Search Company..."
            value={search}
            onChange={(e) => searchStocks(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {loading && (
            <div className="absolute right-3 top-3 text-gray-400 text-sm">
              Searching...
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">

              {suggestions.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => selectStock(stock)}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-800"
                >
                  <div className="font-semibold text-white">
                    {stock.name}
                  </div>

                  <div className="text-sm text-gray-400">
                    {stock.symbol} • {stock.exchange}
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Buy Price */}
        <input
          type="number"
          placeholder="Buy Price"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="bg-blue-600 rounded hover:bg-blue-700 transition-all duration-200 font-semibold"
        >
          Add Stock
        </button>

      </form>

      {/* Selected Stock */}
      {symbol && (
        <div className="mt-4 text-green-400">
          Selected Symbol:
          <span className="font-bold ml-2">
            {symbol}
          </span>
        </div>
      )}
    </div>
  );
}

export default AddStockForm;