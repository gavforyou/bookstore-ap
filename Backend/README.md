# Course Booking API Backend

A Node.js and Express backend API for a course booking system with user authentication, course management, and enrollment features.

## Project Structure

```
Backend/
├── controllers/
│   ├── course.js       # Course management controllers
│   ├── enrollment.js   # Enrollment controllers
│   └── user.js         # User authentication and profile controllers
├── models/
│   ├── Course.js       # Course schema and model
│   ├── Enrollment.js   # Enrollment schema and model
│   └── User.js         # User schema and model
├── routes/
│   ├── course.js       # Course routes
│   ├── enrollment.js   # Enrollment routes
│   └── user.js         # User routes
├── validators/
│   ├── courseValidator.js      # Course validation middleware
│   ├── enrollmentValidator.js  # Enrollment validation middleware
│   └── userValidator.js        # User validation middleware
├── auth.js             # Authentication and authorization middleware
├── index.js            # Express app setup and entry point
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md           # This file
```

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Ensure MongoDB is running locally on port 27017

## Configuration

Create a `.env` file in the Backend directory with the following variables:

```
PORT=4000
MONGODB_STRING="mongodb://localhost:27017/course-booking-API"
JWT_SECRET_KEY="CourseBookingAPI"
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:4000`

## API Endpoints

### User Routes (`/users`)
- `POST /check-email` - Check if email exists
- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /details` - Get user profile (requires auth)
- `PATCH /reset-password` - Reset password (requires auth)
- `PUT /update-profile` - Update user profile (requires auth)
- `PATCH /set-as-admin/:userId` - Promote user to admin (requires auth + admin)

### Course Routes (`/courses`)
- `POST /` - Add a new course (requires auth + admin)
- `GET /all` - Get all courses (requires auth + admin)
- `GET /` - Get all active courses
- `GET /:id` - Get specific course
- `PATCH /:courseId` - Update course (requires auth + admin)
- `PATCH /:courseId/archive` - Archive course (requires auth + admin)
- `PATCH /:courseId/activate` - Activate course (requires auth + admin)
- `POST /searchByName` - Search courses by name
- `POST /searchByPrice` - Search courses by price range

### Enrollment Routes (`/enrollments`)
- `POST /enroll` - Enroll user in courses (requires auth, students only)
- `GET /get-enrollments` - Get user enrollments (requires auth)

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-based Access Control**: Admin and student roles
- **Course Management**: CRUD operations for courses
- **Enrollment System**: Students can enroll in courses
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Login attempt rate limiting to prevent brute-force attacks
- **Error Handling**: Standardized error responses
- **CORS Support**: Configured for frontend integration

## Technologies Used

- **Express.js**: Web framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Security Notes

- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens are used for authentication
- Admin routes are protected with role-based middleware
- Rate limiting is implemented on login routes
- All inputs are validated before processing
