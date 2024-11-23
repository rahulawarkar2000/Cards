import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Description() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [rating, setRating] = useState(0); // To store current rating
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cards/cards/${cardId}`);
        setCard(response.data);
        setRating(response.data.rating || 0); // Set initial rating
      } catch (error) {
        console.error('Error fetching card details:', error);
      }
    };

    fetchCard();
  }, [cardId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/cards/cards/${cardId}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleUpdate = () => {
    navigate(`/update/${cardId}`);
  };

  const addRating = async (newRating) => {
    try {
      setRating(newRating); // Optimistically update rating
      const response = await axios.post('http://localhost:3000/api/rating/add-rating', {
        rating: newRating,
        userID: 1, // Replace with actual user ID if available
        cardID: cardId,
      });
      if (response.status === 201) {
        alert("Rating submitted successfully!");
      }
    } catch (error) {
      console.error("Error adding rating:", error);
      alert("Failed to submit rating");
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          onClick={() => addRating(i)}
          className={`w-6 h-6 cursor-pointer ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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

  if (!card) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto my-12 p-6 bg-white shadow-lg rounded-lg" style={{ width: '90%', maxWidth: '800px' }}>
      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <div className="lg:w-1/2 w-full lg:mr-6 mb-6 lg:mb-0">
          <div className="border border-gray-300 rounded-lg overflow-hidden h-80 shadow-sm">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{card.title}</h2>
          <p className="text-lg mb-2 text-gray-600">{card.description}</p>
          <p className="text-xl font-semibold mb-4 text-blue-500">${card.price}</p>

          {/* Rating Section */}
          <div className="flex items-center mt-4">
            <span className="text-lg font-semibold text-gray-800 mr-2">Rating:</span>
            {renderStars()}
            <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
          </div>

          <div className="flex justify-start space-x-4 mt-6">
            <button
              onClick={handleUpdate}
              className="p-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all"
            >
              Update Card
            </button>
            <button
              onClick={handleDelete}
              className="p-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
            >
              Delete Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;
