import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PropertyListing() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/properties');
      setProperties(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch properties');
    }
  };

  return (
    <div>
      <h2>Available Rental Properties</h2>
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            <h3>{property.title}</h3>
            <p>Description: {property.description}</p>
            <button onClick={() => handleInterest(property)}>I'm Interested</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PropertyListing;
