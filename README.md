# Dangle 🎥 - A YouTube-Inspired Video Sharing Platform

Dangle is a full-stack video-sharing platform that allows users to upload, manage, watch, and comment on videos. It features AI-powered search and recommendations, secure authentication, and a responsive user interface — built with the MERN stack.

> ⚠️ Best viewed on **desktop Chrome**. Some features may not render optimally in mobile browsers.

---

## 🌐 Live Demo

🔗 [Dangle Live](https://dangle-video-watching-platform-2.onrender.com)  
📦 [Backend Repository](https://github.com/equador8078/Dangle-video-watching-platform/tree/main/yt-backend)  
🎨 [Frontend Repository](https://github.com/equador8078/Dangle-video-watching-platform/tree/main/yt-frontend)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router, Axios, Framer Motion, Lucide
- **Backend:** Express.js, MongoDB, Mongoose, Cloudinary, JWT, Bcrypt
- **AI & ML:** TensorFlow.js, Universal Sentence Encoder (for search & recommendation)
- **Storage & Media:** Cloudinary (video/image upload), Multer
- **Build Tools:** Vite, ESLint, Nodemon, dotenv

---

## ✨ Features

### 🔐 Authentication
- JWT-based secure login and signup
- Cookies for session handling
- Preset avatar selection (no manual image upload)

### 📹 Video Management
- Upload videos (title, description, category)
- Edit, delete, or archive videos (archived = private)
- Cloud storage via Cloudinary

### 💬 Engagement
- Comment section for logged-in users
- Watch history tracking with option to clear
- Playlist creation and management

### 🤖 AI-Powered Enhancements
- **Chat-enabled smart search** using TensorFlow.js + Universal Sentence Encoder
- **Video recommendation system** powered by **cosine similarity** scoring

---

## 📁 Project Structure

.
├── yt-backend/ # Node.js backend (Express + MongoDB)
│ └── index.js # Server entry point
├── yt-frontend/ # React frontend
│ └── src/ # Components, routes, pages
├── .env # Environment variables
├── package.json # Root scripts (backend + frontend)
└── .gitignore # Common ignored files/folders


---


## 📦 Scripts

At the root of the project:

```bash
npm run dev            # Starts backend server using nodemon
npm run build          # Installs frontend & backend dependencies and builds frontend
```


## 🔧 Environment Variables

Create a `.env` file inside the `yt-backend/` directory with the following content:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

