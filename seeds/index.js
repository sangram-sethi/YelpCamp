const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places} = require('./seedHelpers');

main().catch(err => console.log(err));
main().then(() => console.log("Connected to db!!!"));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
}

const getRandom = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 1; i <= 300; i++) {
        const camp = new Campground({
            author: '663700220530f8d86722d19f',
            location: `${getRandom(cities).city}, ${getRandom(cities).city}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`,
            images: [
              {
                url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480895/YelpCamp/os4n3ndjsltbvjmkvwti.jpg',
                filename: 'YelpCamp/os4n3ndjsltbvjmkvwti',
              },
              {
                url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480898/YelpCamp/bywejgf55ja1n7ug4q6g.jpg',
                filename: 'YelpCamp/bywejgf55ja1n7ug4q6g',
              },
              {
                url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480906/YelpCamp/quh2tib3izpy5c9crvz3.jpg',
                filename: 'YelpCamp/quh2tib3izpy5c9crvz3',
              },
              {
                url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480906/YelpCamp/ewududllkkfdx1lvfx8x.jpg',
                filename: 'YelpCamp/ewududllkkfdx1lvfx8x',
              },
              {
                url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480911/YelpCamp/nalgkqovihk43duimjif.jpg',
                filename: 'YelpCamp/nalgkqovihk43duimjif',
              }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum accusamus dolorum ea rem, recusandae nostrum at impedit id veritatis suscipit consequatur quis assumenda quas vitae sint praesentium fugit quos. Consequatur.",
            price: Math.floor(Math.random() * 20) + 10,
            geometry: {
              type: "Point",
              coordinates: [
                getRandom(cities).longitude,
                getRandom(cities).latitude,
              ]
            }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});