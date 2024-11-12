import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Description() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cards/cards/${cardId}`);
        setCard(response.data);
      } catch (error) {
        console.error('Error fetching card details:', error);
      }
    };

    fetchCard();
  }, [cardId]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/cards/cards/${cardId}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleUpdate = () => {
    navigate(`/update/${cardId}`);
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
