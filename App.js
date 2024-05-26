import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState({
    place: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'buyer',
    place: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    nearby: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/properties').then((response) => {
      setProperties(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/register', form).then((response) => {
      setUsers([...users, response.data]);
      alert('User registered successfully!');
    });
  };

  const handlePostProperty = (e) => {
    e.preventDefault();
    const propertyData = {
      owner: users.find((user) => user.email === form.email)._id,
      place: form.place,
      area: form.area,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      nearby: form.nearby,
    };
    axios.post('http://localhost:5000/post-property', propertyData).then((response) => {
      setProperties([...properties, response.data]);
      alert('Property posted successfully!');
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    axios.get('http://localhost:5000/filter-properties', { params: filter }).then((response) => {
      setProperties(response.data);
    });
  };

  const handleUpdateProperty = (property) => {
    const updatedProperty = {
      ...property,
      place: prompt("Enter new place", property.place),
      area: prompt("Enter new area", property.area),
      bedrooms: prompt("Enter new number of bedrooms", property.bedrooms),
      bathrooms: prompt("Enter new number of bathrooms", property.bathrooms),
      nearby: prompt("Enter new nearby facilities", property.nearby),
    };
    axios.put(`http://localhost:5000/update-property/${property._id}`, updatedProperty).then((response) => {
      setProperties(properties.map((prop) => (prop._id === property._id ? response.data : prop)));
    });
  };
  
  const handleDeleteProperty = (id) => {
    axios.delete(`http://localhost:5000/delete-property/${id}`).then(() => {
      setProperties(properties.filter((property) => property._id !== id));
    });
  };
  

  return (
    <div className="App">
      <h1>Rentify</h1>

      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <select name="userType" onChange={handleChange}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit">Register</button>
      </form>

      {form.userType === 'seller' && (
        <form onSubmit={handlePostProperty}>
          <h2>Post Property</h2>
          <input name="place" placeholder="Place" onChange={handleChange} />
          <input name="area" placeholder="Area" onChange={handleChange} />
          <input name="bedrooms" placeholder="Bedrooms" onChange={handleChange} />
          <input name="bathrooms" placeholder="Bathrooms" onChange={handleChange} />
          <input name="nearby" placeholder="Nearby" onChange={handleChange} />
          <button type="submit">Post Property</button>
        </form>
      )}

      <form onSubmit={handleFilter}>
        <h2>Filter Properties</h2>
        <input name="place" placeholder="Place" onChange={handleFilterChange} />
        <input name="area" placeholder="Area" onChange={handleFilterChange} />
        <input name="bedrooms" placeholder="Bedrooms" onChange={handleFilterChange} />
        <input name="bathrooms" placeholder="Bathrooms" onChange={handleFilterChange} />
        <button type="submit">Filter</button>
      </form>

      <h2>Properties</h2>
      <ul>
        {properties.map((property) => (
          <li key={property._id}>
            {property.place} - {property.area} sqft - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms - Owner: {property.owner.firstName} {property.owner.lastName}
            {property.owner.email === form.email && (
              <div>
                <button onClick={() => handleUpdateProperty(property)}>Update</button>
                <button onClick={() => handleDeleteProperty(property._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
