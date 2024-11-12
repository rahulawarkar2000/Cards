import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [categoryID, setCategoryID] = useState('');
  const [categories, setCategories] = useState([]); // New state for categories
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories/categories');
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image.');
      return;
    }

    setError(''); // Clear any previous errors

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('image', image);
      formData.append('categoryID', categoryID); // Use categoryID

      const response = await axios.post('http://localhost:3000/cards/card', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Data successfully added:', response.data);
      navigate('/dashboard');
    } catch (error) {
      setError('Something went wrong, data not added.');
      console.error('Data not added:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Add Product</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token'); // Remove token from localStorage
            navigate('/'); // Redirect to login page
          }}
          className="p-2 text-base rounded-md bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      {/* Add Product Form */}
      <div className="max-w-4xl mx-auto my-12 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Title"
            className="p-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Product Price"
            className="p-2 border rounded"
            required
          />
          <select
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 border rounded"
            name="image"
            required
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCard;
