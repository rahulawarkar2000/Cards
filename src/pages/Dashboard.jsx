import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";

function Dashboard() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category state
  const [Rating,updaterating] = useState([]);
  // Fetch cards and categories from the backend
  useEffect(() => {
    fetchCards();
    getCategories();
  }, []);

  // Fetch cards based on selected category
  const fetchCards = async (categoryID = '') => {
    setLoading(true);
    try {
      const url = categoryID
        ? `http://localhost:3000/cards/get-cards?categoryID=${categoryID}`
        : `http://localhost:3000/cards/get-cards`;
      const response = await axios.get(url);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories/categories');
      setCategories(response.data); // Set all categories in state
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryID = e.target.value;
    setSelectedCategory(categoryID); // Set selected category state
    fetchCards(categoryID); // Fetch cards based on the selected category
  }

  // Navigate to add new card
  const handleAddCard = () => {
    navigate('/add-card');
  };

  // Navigate to detailed view for a card
  const handleViewMore = (cardId) => {
    navigate(`/description/${cardId}`);
  };

  // Render star rating based on card rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
      {/* Header with Search and Category Filter */}
      <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard</h1>

        {/* Search Box */}
        <div className="flex items-center gap-2 mb-4 mt-4 absolute left-1/2 transform -translate-x-1/2">
    <input
      className="w-80 rounded-md px-2 py-1 outline-none text-black text-sm"
      type="text"
      placeholder="Search anything..."
    />
    <CiSearch className="text-2xl text-white" />
  </div> 
        {/* Category Dropdown and Logout */}
        <div>
          <select
            className="bg-white text-black rounded-md px-3 py-1 mr-4"
            value={selectedCategory}
            onChange={handleCategoryChange} // Use onChange here
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="p-2 text-base rounded-md bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto my-12 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Product Cards</h2>

        {/* Add New Card Button */}
        <button
          onClick={handleAddCard}
          className="p-2 bg-blue-600 text-white rounded mb-6"
        >
          Add New Card
        </button>

        {/* Loading Indicator */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-lg flex flex-col justify-between h-full"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm mb-2">{item.description}</p>
                <p className="font-semibold text-lg text-blue-600">${item.price}</p>

                <div className="flex mt-2">
                  {renderStars(item.rating)}
                  <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleViewMore(item.id)}
                    className="w-full p-2 bg-blue-500 text-white rounded-lg mt-4"
                  >
                    View More
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
