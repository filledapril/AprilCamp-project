require('dotenv').config()
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./dataHelpers');
const Campground = require('../models/campground');

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 200) + 15;
        const camp = new Campground({
            author: '6368e50f03e778a2235e6f37',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis porro, ad soluta fugiat omnis impedit similique dolorem cumque laudantium modi officiis quidem repellendus illo magni vel aperiam cum voluptas blanditiis?',
            price,
            geometry: { 
              type: 'Point', 
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
           },
            images: [
              {
                url: 'https://res.cloudinary.com/dxfgobu8n/image/upload/v1668093866/Aprilcamp/yruvy9yrkkloq5a8ygba.jpg',
                filename: 'Aprilcamp/yruvy9yrkkloq5a8ygba',
              },
              {
                url: 'https://res.cloudinary.com/dxfgobu8n/image/upload/v1668093867/Aprilcamp/o8gcvpzqprnudwsgdl3g.jpg',
                filename: 'Aprilcamp/o8gcvpzqprnudwsgdl3g',
              }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})