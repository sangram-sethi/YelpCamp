# YelpCamp

A campground listing & review app built with **Node.js, Express, MongoDB (Mongoose), EJS**, featuring:
- User auth (Passport)
- CRUD campgrounds + reviews
- Flash messages
- Image uploads (Cloudinary)
- Maps + geocoding (Mapbox)
- Sessions stored in MongoDB (connect-mongo)

✅ Updated for **Vercel**:
- `app.js` exports the Express app (no `app.listen` inside)
- `server.js` is for local development (starts the server)
- Mongo connection is cached for serverless environments

---

## Tech Stack

- Node.js / Express
- MongoDB Atlas + Mongoose
- EJS + ejs-mate
- Passport (local auth) + express-session
- connect-mongo (session store)
- Cloudinary + multer (image uploads)
- Mapbox (maps + geocoding)
- Helmet (basic security headers)

---

## Local Setup

### 1) Install dependencies
```bash
npm install
