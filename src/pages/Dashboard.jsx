import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { GoPlusCircle } from "react-icons/go";

function Dashboard() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ratings, setRatings] = useState({});
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    fetchCards();
    getCategories();
  }, []);

  const fetchCards = async (categoryID = "") => {
    setLoading(true);
    try {
      const url = categoryID
        ? `http://localhost:3000/cards/get-cards?categoryID=${categoryID}`
        : `http://localhost:3000/cards/get-cards`;
      const response = await axios.get(url);
      setCards(response.data);

      const initialRatings = response.data.reduce((acc, card) => {
        acc[card.id] = card.rating || 0;
        return acc;
      }, {});
      setRatings(initialRatings);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryID = e.target.value;
    setSelectedCategory(categoryID);
    fetchCards(categoryID);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !categoryId) {
      alert("Please enter both Category ID and Category Name");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/categories/category", {
        id: categoryId,
        name: newCategoryName,
      });

      if (response.status === 201) {
        setNewCategoryName("");
        setCategoryId("");
        setShowAddCategoryForm(false);
        getCategories();
        alert("Category added successfully!");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryId) {
      alert("Please enter the Category ID to delete");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/categories/${categoryId}`);
      if (response.status === 200) {
        setCategoryId("");
        setNewCategoryName("");
        setShowAddCategoryForm(false);
        getCategories(); // Refresh categories after deletion
        alert("Category deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const renderStars = (rating, cardId) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          onClick={() => addRating(i, cardId)}
          className={`w-4 h-4 cursor-pointer ${i <= (ratings[cardId] || rating) ? "text-yellow-400" : "text-gray-300"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27L16.18 18l-1.64-7.03L19 7.24l-7.19-.61L10 .25 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div>
      <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 mb-4 mt-4 absolute left-1/2 transform -translate-x-1/2">
          <input
            className="w-80 rounded-md px-2 py-1 outline-none text-black text-sm"
            type="text"
            placeholder="Search anything..."
          />
          <CiSearch className="text-2xl text-white" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <select
            className="bg-white text-black rounded-md px-3 py-1"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <GoPlusCircle
            onClick={() => setShowAddCategoryForm(true)}
            className="text-2xl text-white cursor-pointer"
          />
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="p-2 text-base rounded-md bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Background Blur & Fixed Size Form */}
      {showAddCategoryForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Manage Category</h2>
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category ID"
            />
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category Name"
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowAddCategoryForm(false)}
                className="bg-gray-300 px-4 py-2 rounded-md w-24"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-24"
              >
                Add Category
              </button>
              <button
                onClick={handleDeleteCategory}
                className="bg-red-600 text-white px-4 py-2 rounded-md w-24"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto my-12 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Product Cards</h2>
        <button
          onClick={() => navigate("/add-card")}
          className="p-2 bg-blue-600 text-white rounded mb-6"
        >
          Add New Card
        </button>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow-lg flex flex-col justify-between h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm mb-2 line-clamp-1">{item.description}</p>
                <p className="font-semibold text-lg text-blue-600">${item.price}</p>
                <div className="flex mt-2">{renderStars(item.rating, item.id)}</div>
                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/description/${item.id}`)}
                    className="w-full p-2 bg-blue-500 text-white rounded-lg mt-4"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;