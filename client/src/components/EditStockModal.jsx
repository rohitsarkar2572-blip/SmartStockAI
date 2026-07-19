import { useEffect, useState } from "react";
import api from "../services/api";

function EditStockModal({ stock, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  useEffect(() => {
    if (stock) {
      setQuantity(stock.quantity);
      setBuyPrice(stock.buy_price);
    }
  }, [stock]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/portfolio/update/${stock._id}`, {
        quantity: Number(quantity),
        buy_price: Number(buyPrice),
      });

      alert("✅ Stock Updated Successfully");

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      alert("❌ Failed to update stock");
    }
  };

  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

      <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6">
          ✏️ Edit {stock.symbol}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-white mb-2">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">
              Buy Price
            </label>

            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditStockModal;