require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');

const MOCK_ACCOMMODATIONS = [
  {
    name: 'Luxury Villa with Table Mountain Views',
    type: 'Villa',
    price: 350,
    location: 'Cape Town, Western Cape',
    description: 'Experience pure luxury in this architecturally designed villa nestled against the slopes of Table Mountain. Features infinity pool, spacious sun decks, high-end kitchen, and floor-to-ceiling glass windows displaying panoramic ocean views.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Kitchen', 'Free Parking', 'Gym', 'TV']
  },
  {
    name: 'Modern Apartment near V&A Waterfront',
    type: 'Apartment',
    price: 120,
    location: 'Cape Town, Western Cape',
    description: 'A stylish, light-filled apartment located walking distance from the V&A Waterfront. Perfect for business travelers or couples looking to explore the city. Includes secure parking and high-speed fiber internet.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Free Parking', 'TV', 'Workspace']
  },
  {
    name: 'Luxury Bush Lodge & Private Safari Spa',
    type: 'Entire home',
    price: 450,
    location: 'Kruger National Park, Mpumalanga',
    description: 'Immerse yourself in nature in this private luxury game lodge. View wild elephants and giraffes drinking from the adjacent watering hole right from your private plunge pool. Fully serviced with an optional private chef.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    amenities: ['Pool', 'Air Conditioning', 'Kitchen', 'Free Parking', 'Gym', 'TV']
  },
  {
    name: 'Trendy Loft in Maboneng Cultural Precinct',
    type: 'Apartment',
    price: 85,
    location: 'Johannesburg, Gauteng',
    description: 'Live like a local in this creative, industrial loft in the heart of Maboneng. Surrounded by art galleries, boutique coffee shops, and bustling street markets. High ceilings, exposed brick walls, and vibrant urban vibes.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    amenities: ['WiFi', 'Kitchen', 'TV', 'Workspace']
  },
  {
    name: 'Oceanfront Penthouse with Infinite Sea Views',
    type: 'Villa',
    price: 280,
    location: 'Durban, KwaZulu-Natal',
    description: 'Stunning beachfront penthouse overlooking the golden miles of Durban. Listen to the ocean waves crash below as you drink your morning coffee on the private wrap-around terrace. Steps away from direct beach access.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Kitchen', 'Free Parking', 'TV']
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Cleaning up existing accommodations...');

    // Clear current listings
    await Accommodation.deleteMany({});
    console.log('Accommodations cleared.');

    // Look for a host user to link the listings to
    let ownerUser = await User.findOne({ email: 'host@test.com' });

    if (!ownerUser) {
      // Look for any user if test host doesn't exist
      ownerUser = await User.findOne({});
    }

    if (!ownerUser) {
      // If the database is completely empty, create a default host account
      console.log('No user records found. Creating default host user (host@test.com)...');
      ownerUser = await User.create({
        name: 'Jane Doe (Local Host)',
        email: 'host@test.com',
        password: 'password123' // Hashed automatically by our pre-save mongoose hook
      });
      console.log('Default host user created.');
    }

    // Set owner ID for mock data
    const accommodationsWithOwner = MOCK_ACCOMMODATIONS.map((item) => ({
      ...item,
      owner: ownerUser._id
    }));

    console.log(`Seeding ${accommodationsWithOwner.length} accommodations...`);
    await Accommodation.insertMany(accommodationsWithOwner);
    console.log('Database seeded successfully!');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();
