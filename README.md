# ResumeXpert 📄

A modern, full-stack resume builder application that helps users create professional resumes with ease. Built with React.js frontend and Node.js backend.

## 🚀 Features

-  **User Authentication** - Secure login and registration system
-  **Resume Creation** - Create multiple resumes with different templates
-  **Interactive Resume Editor** - Real-time editing with live preview
-  **Multiple Templates** - Choose from various professional resume templates
-  **Image Upload** - Upload profile pictures and other images
-  **PDF Export** - Export resumes as PDF files
-  **Dashboard** - Manage all your resumes from a centralized dashboard
-  **Responsive Design** - Works seamlessly on desktop and mobile devices
-  **Progress Tracking** - See completion percentage for each resume section

## 🛠️ Tech Stack

### Frontend

-  **React.js** - Modern UI library
-  **Vite** - Fast build tool and development server
-  **React Router** - Client-side routing
-  **Axios** - HTTP client for API calls
-  **Tailwind CSS** - Utility-first CSS framework
-  **React Hot Toast** - Toast notifications
-  **Lucide React** - Beautiful icons
-  **Moment.js** - Date manipulation
-  **HTML2Canvas & jsPDF** - PDF generation
-  **Framer Motion** - Smooth animations

### Backend

-  **Node.js** - Runtime environment
-  **Express.js** - Web application framework
-  **MongoDB** - NoSQL database
-  **Mongoose** - MongoDB object modeling
-  **JWT** - JSON Web Tokens for authentication
-  **bcryptjs** - Password hashing
-  **Multer** - File upload handling
-  **CORS** - Cross-origin resource sharing
-  **dotenv** - Environment variable management

## 📁 Project Structure

```
resume_builder/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── utils/          # Helper functions and utilities
│   │   └── assets/         # Static assets and styles
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## 🚦 Getting Started

### Prerequisites

-  Node.js (v14 or higher)
-  npm or yarn
-  MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/prkr-28/ResumeXpert.git
   cd ResumeXpert
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm start
   ```

   The backend server will run on `http://localhost:4000`

2. **Start the Frontend Development Server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` or `http://localhost:5174`

3. **Access the Application**
   Open your browser and navigate to the frontend URL

## 🎯 Core Features

### Dashboard

-  View all created resumes
-  Create new resumes
-  Delete existing resumes
-  Track completion progress for each resume
-  See recent activity and resume statistics

### Resume Editor

-  **Profile Information** - Full name, designation, summary
-  **Contact Details** - Email, phone, address
-  **Work Experience** - Company, role, duration, description
-  **Education** - Degree, institution, dates
-  **Skills** - Categorized skill sets
-  **Projects** - Project details with technologies and links
-  **Certifications** - Professional certifications
-  **Languages** - Language proficiency levels
-  **Interests** - Personal interests and hobbies

### Templates

-  Multiple professional resume templates
-  Real-time preview while editing
-  Responsive design for different screen sizes

## 🔒 Authentication

The application includes a complete authentication system:

-  User registration with email verification
-  Secure login with JWT tokens
-  Password hashing using bcrypt
-  Protected routes for authenticated users
-  User profile management

## 📱 API Endpoints

### Authentication Routes

-  `POST /api/auth/register` - User registration
-  `POST /api/auth/login` - User login
-  `GET /api/auth/profile` - Get user profile

### Resume Routes

-  `GET /api/resume` - Get all user resumes
-  `POST /api/resume` - Create new resume
-  `GET /api/resume/:id` - Get specific resume
-  `PUT /api/resume/:id` - Update resume
-  `DELETE /api/resume/:id` - Delete resume
-  `POST /api/resume/:id/upload-images` - Upload images

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**prkr-28**

-  GitHub: [@prkr-28](https://github.com/prkr-28)

## 🙏 Acknowledgments

-  Thanks to all the open-source libraries that made this project possible
-  Inspired by modern resume builders and professional design principles

---

⭐ If you found this project helpful, please give it a star on GitHub!
