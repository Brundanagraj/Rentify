const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Message = require('./models/Message');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rentify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const User = mongoose.model('User', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  userType: String, // 'seller' or 'buyer'
}));

const Property = mongoose.model('Property', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  place: String,
  area: Number,
  bedrooms: Number,
  bathrooms: Number,
  nearby: String,
}));

// Routes
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, userType } = req.body;
  const user = new User({ firstName, lastName, email, phone, userType });
  await user.save();
  res.send(user);
});

app.post('/post-property', async (req, res) => {
  const { owner, place, area, bedrooms, bathrooms, nearby } = req.body;
  const property = new Property({ owner, place, area, bedrooms, bathrooms, nearby });
  await property.save();
  res.send(property);
});

app.get('/properties', async (req, res) => {
  const properties = await Property.find().populate('owner');
  res.send(properties);
});

// New Route: Filter Properties
app.get('/filter-properties', async (req, res) => {
  const { place, area, bedrooms, bathrooms } = req.query;
  const filters = {};

  if (place) filters.place = place;
  if (area) filters.area = area;
  if (bedrooms) filters.bedrooms = bedrooms;
  if (bathrooms) filters.bathrooms = bathrooms;

  const properties = await Property.find(filters).populate('owner');
  res.send(properties);
});

// New Route: Update Property
app.put('/update-property/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const property = await Property.findByIdAndUpdate(id, updates, { new: true });
  res.send(property);
});

// New Route: Delete Property
app.delete('/delete-property/:id', async (req, res) => {
  const { id } = req.params;
  await Property.findByIdAndDelete(id);
  res.send({ message: 'Property deleted successfully' });
});


app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});