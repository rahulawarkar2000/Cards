import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Update = () => {
  const { cardId } = useParams(); // Get the card ID from the URL
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // State for categories
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryID: '', // Add categoryId to formData
    image: null, // For file upload
  });

  

  // Fetch categories and card details when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories/categories');
        console.log(response); // Adjust the endpoint if necessary
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCardDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cards/cards/${cardId}`);
        const card = response.data;
        setFormData({
          title: card.title,
          description: card.description,
          price: card.price,
          categoryId: card. categoryID, // Set the card's category
          image: card.image, // Set the image URL or keep it as null
        });
      } catch (error) {
        console.error('Error fetching card details:', error);
      }
    };

    fetchCategories();
    fetchCardDetails();
  }, [cardId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCard = new FormData();
      updatedCard.append('title', formData.title);
      updatedCard.append('description', formData.description);
      updatedCard.append('price', formData.price);
      updatedCard.append('categoryID', formData.categoryID);
      
  
      // Only append the image if a new file has been selected
      if (formData.image && typeof formData.image !== 'string') {
        updatedCard.append('image', formData.image);
      }
  
    // Debugging for categoryId
  
      await axios.put(`http://localhost:3000/cards/cards/${cardId}`, formData, { // Use updatedCard here
        headers: { 'Content-Type': 'multipart/form-data' },
      });


  
      navigate('/dashboard'); // Redirect after update
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };
  

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-6">
      <h2 className="text-2xl font-bold mb-6">Update Card</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" name="image" onChange={handleFileChange} className="mt-1 block w-full" />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Update Card
        </button>
      </form>
    </div>
  );
};

export default Update;
