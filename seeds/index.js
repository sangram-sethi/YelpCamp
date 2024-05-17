// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();
// const dbUrl = process.env.DB_URL;
// const Campground = require('../models/campground');
// const cities = require('./cities');
// const { descriptors, places} = require('./seedHelpers');

// main().catch(err => console.log(err));
// main().then(() => console.log("Connected to db!!!"));

// async function main() {
//   await mongoose.connect(dbUrl);
// }

// const getRandom = array => array[Math.floor(Math.random() * array.length)];

// const seedDB = async() => {
//     await Campground.deleteMany({});
//     for(let i = 1; i <= 50; i++) {
//         const camp = new Campground({
//             author: '6645b61d0140a6cff4b91596',
//             location: `${getRandom(cities).city}, ${getRandom(cities).city}`,
//             title: `${getRandom(descriptors)} ${getRandom(places)}`,
//             images: [
//               {
//                 url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480895/YelpCamp/os4n3ndjsltbvjmkvwti.jpg',
//                 filename: 'YelpCamp/os4n3ndjsltbvjmkvwti',
//               },
//               {
//                 url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480898/YelpCamp/bywejgf55ja1n7ug4q6g.jpg',
//                 filename: 'YelpCamp/bywejgf55ja1n7ug4q6g',
//               },
//               {
//                 url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480906/YelpCamp/quh2tib3izpy5c9crvz3.jpg',
//                 filename: 'YelpCamp/quh2tib3izpy5c9crvz3',
//               },
//               {
//                 url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480906/YelpCamp/ewududllkkfdx1lvfx8x.jpg',
//                 filename: 'YelpCamp/ewududllkkfdx1lvfx8x',
//               },
//               {
//                 url: 'https://res.cloudinary.com/dskqqluiy/image/upload/v1715480911/YelpCamp/nalgkqovihk43duimjif.jpg',
//                 filename: 'YelpCamp/nalgkqovihk43duimjif',
//               }
//             ],
//             description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum accusamus dolorum ea rem, recusandae nostrum at impedit id veritatis suscipit consequatur quis assumenda quas vitae sint praesentium fugit quos. Consequatur.",
//             price: Math.floor(Math.random() * 20) + 10,
//             geometry: {
//               type: "Point",
//               coordinates: [
//                 getRandom(cities).longitude,
//                 getRandom(cities).latitude,
//               ]
//             }
//         });
//         await camp.save();
//     }
// }

// seedDB().then(() => {
//     mongoose.connection.close();
// });

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yourDatabase'; // Ensure a fallback for local development
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to db!!!"))
  .catch(err => console.log("Connection error: ", err));

const getRandom = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  try {
    await Campground.deleteMany({});
    console.log('Old campgrounds removed.');

    for (let i = 1; i <= 50; i++) {
      const randomCity = getRandom(cities); // Get one random city for consistency
      const camp = new Campground({
        author: '6645b61d0140a6cff4b91596',
        location: `${randomCity.city}, ${randomCity.state}`,
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
            randomCity.longitude,
            randomCity.latitude,
          ]
        }
      });
      await camp.save();
    }
    console.log('All campgrounds have been added.');
  } catch (err) {
    console.error('Error seeding the database: ', err);
  } finally {
    mongoose.connection.close()
      .then(() => console.log('Database connection closed.'))
      .catch(err => console.log('Error closing the connection: ', err));
  }
}

seedDB();