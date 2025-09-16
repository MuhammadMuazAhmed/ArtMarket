# 🎨 Art Marketplace - Full-Stack Web Application

A modern, secure, and feature-rich art marketplace platform built with React, Node.js, and MongoDB. Connect artists with art enthusiasts, showcase creative works, and facilitate art sales in a beautiful, responsive environment.

## ✨ Features

### 🎭 **User Management & Authentication**

- **Secure Registration & Login**: JWT-based authentication with password hashing
- **Role-Based Access**: Separate buyer and seller accounts with different permissions
- **Profile Management**: Comprehensive user profiles with customizable information
- **Education & Skills**: Artists can showcase their educational background and technical skills
- **Contact Information**: Secure contact details management

### 🖼️ **Artwork Management**

- **Artwork Showcase**: Beautiful gallery display with high-quality image support
- **Advanced Filtering**: Filter by style, medium, size, technique, and price range
- **Search Functionality**: Intelligent search across artwork titles and descriptions
- **Artwork Details**: Comprehensive information including dimensions, materials, and pricing
- **Image Upload**: Secure file upload with validation and optimization

### 🔍 **Discovery & Browsing**

- **Responsive Gallery**: Mobile-first design that works on all devices
- **Category Organization**: Organized by artistic styles and techniques
- **Price Filtering**: Range-based price filtering for budget-conscious buyers
- **Sorting Options**: Multiple sorting criteria for optimal browsing experience


### 🛡️ **Security Features**

- **HTTP Headers Protection**: Helmet.js for comprehensive security headers
- **Rate Limiting**: API protection against abuse and brute force attacks
- **Input Validation**: Comprehensive data sanitization and validation
- **CORS Protection**: Restricted cross-origin access for security
- **File Upload Security**: Secure image upload with type and size validation
- **XSS Protection**: Cross-site scripting attack prevention
- **Environment Security**: Secure configuration management

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for all screen sizes from mobile to desktop
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG compliant design for inclusive user experience
- **Performance**: Optimized loading and smooth interactions

## 🏗️ Architecture

### **Frontend (React + Vite)**

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool for rapid development
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Context API**: State management for user authentication and app state
- **React Router**: Client-side routing for seamless navigation

### **Backend (Node.js + Express)**

- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **Multer**: File upload handling with security validation

### **Security Layer**

- **Helmet.js**: Security headers and protection
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Data sanitization and validation
- **CORS**: Cross-origin resource sharing control
- **File Upload Security**: Secure file handling

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd art-marketplace
   ```

2. **Install frontend dependencies**

   ```bash
   cd my-app
   npm install
   ```


3. **Environment Setup**

   ```bash
   # Copy environment template
   cp env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**

   - Start MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` in your `.env` file

5. **Generate Security Keys**

   ```bash
   # Generate JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Add to .env file
   JWT_SECRET=your_generated_secret_here
   ```

### **Running the Application**

1. **Start Frontend Development Server**

   ```bash
   cd my-app
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

2. **Build for Production**
   ```bash
   cd my-app
   npm run build
   npm run preview
   ```


# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp


### **Security Configuration**

The application includes comprehensive security measures:

- **Helmet.js**: HTTP security headers
- **Rate Limiting**: API abuse prevention
- **Input Validation**: XSS and injection protection
- **File Upload Security**: Secure image handling
- **CORS Protection**: Origin validation

## 📱 Usage Guide

### **For Artists (Sellers)**

1. **Register** as a seller account
2. **Complete Profile** with education, skills, and contact information
3. **Upload Artwork** with detailed descriptions and pricing
4. **Manage Portfolio** with multiple artwork pieces
5. **Track Sales** and manage your art business

### **For Art Enthusiasts (Buyers)**

1. **Browse Gallery** with advanced filtering options
2. **Search Artworks** by style, medium, or keywords
3. **View Details** of each artwork with high-quality images
4. **Make Purchases** securely through the platform
5. **Track Orders** and purchase history

### **Features by Role**

#### **Buyer Features**

- Browse artwork gallery
- Advanced search and filtering
- Secure purchase process
- Order history tracking
- User profile management

#### **Seller Features**

- Artwork upload and management
- Portfolio customization
- Sales tracking
- Profile enhancement
- Artwork analytics

## 🛠️ Development

### **Project Structure**

```
my-app/
├── src/                    # Frontend source code
│   ├── Components/        # Reusable React components
│   ├── Context/          # React context providers
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   └── assets/           # Static assets
└── README.md             # This file
```

### **Available Scripts**

#### **Frontend**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```



## 🔒 Security Features

### **Implemented Protections**

- ✅ **XSS Prevention**: Input sanitization and CSP headers
- ✅ **CSRF Protection**: CORS origin validation
- ✅ **SQL Injection**: MongoDB with parameterized queries
- ✅ **File Upload Security**: Type validation and size limits
- ✅ **Rate Limiting**: API abuse prevention
- ✅ **Authentication Security**: JWT with secure storage
- ✅ **Data Validation**: Comprehensive input validation
- ✅ **Security Headers**: Helmet.js protection

### **Security Best Practices**

- Environment variable management
- Secure file upload handling
- Input sanitization and validation
- Rate limiting and abuse prevention
- Comprehensive error handling
- Security monitoring and logging

## 📊 Performance

### **Optimizations**

- **Image Optimization**: Compressed and optimized artwork images
- **Lazy Loading**: Efficient image loading for better performance
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Strategic caching for improved response times
- **Database Indexing**: Optimized MongoDB queries

### **Monitoring**

- API response times
- Database query performance
- File upload speeds
- User interaction metrics
- Error rate tracking

## 🚀 Deployment

### **Production Checklist**

- [ ] Environment variables configured
- [ ] Strong JWT secrets generated
- [ ] HTTPS enabled
- [ ] Database optimized
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] File upload security enabled
- [ ] Error monitoring configured

### **Deployment Options**

- **Vercel**: Frontend deployment
- **Railway/Heroku**: Backend deployment
- **MongoDB Atlas**: Database hosting
- **AWS S3**: File storage (optional)
- **Cloudflare**: CDN and security

## 🤝 Contributing

## 📚 Documentation

### **Additional Resources**

- [API Documentation](./backend/README.md)
- [Security Guide](./backend/SECURITY.md)
- [Frontend Components](./src/README.md)
- [Database Schema](./backend/models/README.md)

### **External Resources**

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)




---

**🎨 Art Marketplace** - Connecting artists with art enthusiasts worldwide.

_Built with ❤️ using React, Node.js, and MongoDB_
