const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const User = require("../models/User");
const House = require("../models/House");
const Service = require("../models/Service");
const ObjectId = mongoose.Types.ObjectId;

const AVAILABLE_CITIES = ["Los Angeles", "New York", "Miami", "Houston"];

// Example Users
const users = [
  {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/1.png",
    email_verified: true,
    role: "host",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/2.png",
    email_verified: true,
    role: "guest",
  },
  {
    firstname: "Michael",
    lastname: "Johnson",
    email: "michael.j@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/3.png",
    email_verified: true,
    role: "host",
  },
  {
    firstname: "Sarah",
    lastname: "Williams",
    email: "sarah.w@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/4.png",
    email_verified: true,
    role: "guest",
  },
  {
    firstname: "David",
    lastname: "Brown",
    email: "david.b@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/5.png",
    email_verified: true,
    role: "host",
  },
  {
    firstname: "Emily",
    lastname: "Davis",
    email: "emily.d@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/6.png",
    email_verified: true,
    role: "guest",
  },
  {
    firstname: "Robert",
    lastname: "Wilson",
    email: "robert.w@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/7.png",
    email_verified: true,
    role: "host",
  },
  {
    firstname: "Lisa",
    lastname: "Anderson",
    email: "lisa.a@example.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    main_picture: "/profile_pictures/8.png",
    email_verified: true,
    role: "guest",
  },
  {
    firstname: "Admin",
    lastname: "User",
    email: "admin@stay.com",
    password: passwordHash.generate("123456789", {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5,
    }),
    email_verified: true,
    role: "guest",
    is_admin: true,
    approval_status: "approved",
    is_profile_completed: true,
  },
];
const services = [
  {
    icon: "/house_images/icons/safety.png",
    title: "Housekeeper",
    description: "Professional cleaning and housekeeping services",
  },
  {
    icon: "/house_images/icons/safety.png",
    title: "Personal Assistant",
    description: "Dedicated assistant for your daily needs and errands",
  },
  {
    icon: "/house_images/icons/safety.png",
    title: "Private Cook",
    description: "Experienced chef for personalized meal preparation",
  },
  {
    icon: "/house_images/icons/safety.png",
    title: "Nanny Service",
    description: "Professional childcare and babysitting services",
  }
];
// Example Houses
const houses = [
  {
    title: "Luxury Beachfront Villa",
    description: "Stunning villa with private beach access and panoramic ocean views",
    location: "Miami",
    main_picture: "/house_images/house1.jpg",
    amenities: [],
    price_per_night: 450,
  },
  {
    title: "Downtown Modern Loft",
    description: "Stylish loft in the heart of the city",
    location: "New York",
    main_picture: "/house_images/house2.jpg",
    amenities: [],
    price_per_night: 350,
  },
  {
    title: "Luxury High-Rise Apartment",
    description: "Modern apartment with city skyline views",
    location: "Los Angeles",
    main_picture: "/house_images/house3.jpg",
    amenities: [],
    price_per_night: 200,
  },
  {
    title: "Modern Urban Oasis",
    description: "Contemporary home with pool and city views",
    location: "Houston",
    main_picture: "/house_images/house4.jpg",
    amenities: [],
    price_per_night: 275,
  },
  {
    title: "Mountain Lodge Retreat",
    description: "Spacious lodge with mountain views and outdoor hot tub",
    location: "Miami",
    main_picture: "/house_images/house2.jpg",
    amenities: [],
    price_per_night: 350,
  },
  {
    title: "Lakefront Cottage",
    description: "Charming cottage with private dock and lake views",
    location: "Lake Tahoe, CA",
    main_picture: "/house_images/house4.jpg",
    amenities: [],
    price_per_night: 275,
  },
  {
    title: "Desert Oasis Villa",
    description: "Modern villa with private pool and desert views",
    location: "Scottsdale, AZ",
    main_picture: "/house_images/house5.jpg",
    amenities: [],
    price_per_night: 300,
  },
  {
    title: "Historic Brownstone",
    description: "Beautifully restored brownstone in historic district",
    location: "Boston, MA",
    main_picture: "/house_images/house1.jpg",
    amenities: [],
    price_per_night: 400,
  },
  {
    title: "Oceanview Penthouse",
    description: "Luxury penthouse with panoramic ocean views",
    location: "San Diego, CA",
    main_picture: "/house_images/house2.jpg",
    amenities: [],
    price_per_night: 500,
  },
  {
    title: "Rustic Farm Cottage",
    description: "Peaceful cottage on working farm",
    location: "Vermont",
    main_picture: "/house_images/house3.jpg",
    amenities: [],
    price_per_night: 150,
  },
  {
    title: "City Center Studio",
    description: "Compact and stylish studio in downtown",
    location: "Chicago, IL",
    main_picture: "/house_images/house4.jpg",
    amenities: [],
    price_per_night: 120,
  },
  {
    title: "Ski-in/Ski-out Chalet",
    description: "Luxury chalet with direct ski slope access",
    location: "Park City, UT",
    main_picture: "/house_images/house5.jpg",
    amenities: [],
    price_per_night: 600,
  },
  {
    title: "Tropical Paradise Villa",
    description: "Luxurious villa surrounded by tropical gardens",
    location: "Maui, HI",
    main_picture: "/house_images/house1.jpg",
    amenities: [],
    price_per_night: 550,
  },
  {
    title: "Urban Micro Apartment",
    description: "Efficient and modern micro living space",
    location: "Seattle, WA",
    main_picture: "/house_images/house2.jpg",
    amenities: [],
    price_per_night: 100,
  },
  {
    title: "Vineyard Guest House",
    description: "Charming house in wine country",
    location: "Napa Valley, CA",
    main_picture: "/house_images/house3.jpg",
    amenities: [],
    price_per_night: 325,
  },
  {
    title: "Historic Canal House",
    description: "17th century canal house with modern amenities",
    location: "New Orleans, LA",
    main_picture: "/house_images/house4.jpg",
    amenities: [],
    price_per_night: 275,
  },
  {
    title: "Mountain View Tiny House",
    description: "Cozy tiny house with spectacular mountain views",
    location: "Boulder, CO",
    main_picture: "/house_images/house5.jpg",
    amenities: [],
    price_per_night: 125,
  },
  {
    title: "Riverside Cabin",
    description: "Peaceful cabin with river access",
    location: "Portland, OR",
    main_picture: "/house_images/house2.jpg",
    amenities: [],
    price_per_night: 200,
  },
  {
    title: "Golf Resort Villa",
    description: "Luxury villa on championship golf course",
    location: "Phoenix, AZ",
    main_picture: "/house_images/house3.jpg",
    amenities: [],
    price_per_night: 400,
  },
  {
    title: "Beachside Bungalow",
    description: "Cozy bungalow steps from the beach",
    location: "Santa Barbara, CA",
    main_picture: "/house_images/house4.jpg",
    amenities: [],
    price_per_night: 250,
  },
  {
    title: "Downtown Penthouse",
    description: "Luxurious penthouse with city views",
    location: "Los Angeles",
    main_picture: "/house_images/house5.jpg",
    amenities: [],
    price_per_night: 450,
  },
].map((house, index) => ({
  ...house,
  location: AVAILABLE_CITIES[index % AVAILABLE_CITIES.length],
}));
const picture_urls = [
  "/house_images/253a505c-0d83-46db-876c-2906cbbeb55c.avif",
  "/house_images/c5cf5a45-e685-4e0c-b9f0-4d48ee90abcd.avif",
  "/house_images/9ad87737-7efb-440c-960f-0dca8738feeb.avif",
  "/house_images/d6b9b726-257b-4bee-a327-f54e756bcd4e.avif",
  "/house_images/fd17e793-c0c3-42ac-82a4-1adf71e06b12.avif",
  "/house_images/05acbf7c-7f8c-47fc-870d-562cb3b37e56.avif",
  "/house_images/c3353762-cd74-49ea-af54-1700ad481e48.avif",
  "/house_images/e0c0fe14-a5bb-4a83-90ae-b29e81c3ffcf.avif",
  "/house_images/f411d9eb-618f-4d0c-8740-37aaa87b0e88.avif",
];
const getRandomService = (services, count) => {
  const serviceCount = Math.min(count, services.length);
  const tmpServices = [];
  const availableIndices = [...Array(services.length).keys()];
  
  for (let i = 0; i < serviceCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const serviceIndex = availableIndices[randomIndex];
    
    availableIndices.splice(randomIndex, 1);
    
    tmpServices.push(services[serviceIndex]._id);
  }
  
  return tmpServices;
};
const getRandomPicture = (count) => {
  const tmpPictures = [];
  for (let i = 0; i < count; i++) {
    let random = Math.floor(Math.random() * picture_urls.length);
    while (tmpPictures.includes(picture_urls[random]))
      random = Math.floor(Math.random() * picture_urls.length);
    tmpPictures.push(picture_urls[random]);
  }
  return tmpPictures;
};
const initializeData = async () => {
  try {
    // Clear existing data
    await House.deleteMany({});

    // Insert users first
    const createdUsers = await User.insertMany(users);
    const createdServices = await Service.insertMany(services);

    // Add owner_id to houses
    const housesWithOwner = houses.map((house) => ({
      ...house,
      owner_id: createdUsers.filter((user) => user.role === "host")[
        Math.floor(
          Math.random() *
            createdUsers.filter((user) => user.role === "host").length
        )
      ]._id,
      amenities: getRandomService(
        createdServices,
        Math.floor(Math.random() * 4) + 1
      ),
      reviews: Array.from(
        { length: Math.floor(Math.random() * 10) },
        (_, index) => ({
          user_id: createdUsers.filter((user) => user.role === "guest")[
            Math.floor(
              Math.random() *
                createdUsers.filter((user) => user.role === "guest").length
            )
          ]._id,
          rating: Math.floor(Math.random() * 4) + 1,
          comment: "Exceptional stay!",
          created_at: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
          ),
        })
      ),
      quests: Math.floor(Math.random() * 10) + 1, 
      rooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 6),
      picture_urls: getRandomPicture(
        Math.floor(Math.random() * (picture_urls.length - 3)) + 3
      ),
    }));

    // Insert houses
    const createdHouses = await House.insertMany(housesWithOwner);

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

module.exports = initializeData;
