# Next.js Authentication & User Management System

A secure, full-featured authentication and user management system built with Next.js, featuring robust authentication, profile management, and modern UI/UX design.

## 📸 Project Preview

<p align="center">
  <img src="https://github.com/Figrac0/NextAuth-RouteGuard/blob/main/public/main.gif" alt="Project Demo GIF - Full Authentication Flow" width="800"/><br/>
  
</p>

---

<p align="center">
  <img src="https://github.com/Figrac0/NextAuth-RouteGuard/blob/main/public/1.jpg" alt="Login Page - Secure Authentication Interface" width="400"/><br/>
  
</p>

---

<p align="center">
  <img src="https://github.com/Figrac0/NextAuth-RouteGuard/blob/main/public/2.jpg" alt="Training Dashboard - Premium Fitness Platform" width="400"/><br/>
  
</p>

---

<p align="center">
  <img src="https://github.com/Figrac0/NextAuth-RouteGuard/blob/main/public/3.jpg" alt="Training Dashboard - Premium Fitness Platform" width="400"/><br/>
  
</p>

---
<p align="center">
  <img src="https://github.com/Figrac0/NextAuth-RouteGuard/blob/main/public/4.jpg" alt="Training Dashboard - Premium Fitness Platform" width="400"/><br/>
  
</p>

---

## 🚀 Features

### 🔐 **Core Authentication System**
- **Secure Credential Authentication** using NextAuth.js with JWT sessions
- **Password Hashing** with bcryptjs (12 rounds of salt)
- **Protected Routes** with server-side and client-side guards
- **Session Management** with automatic token refresh
- **Input Validation** for all authentication forms

### 👤 **User Features**
- **Profile Management** with detailed user information
- **Password Change** with secure verification flow
- **Activity Tracking** with recent actions log
- **Security Log** monitoring account activities
- **Settings Management** for themes, notifications, and privacy

## 🛠️ **Technology Stack**

### **Frontend**
- **Next.js 13** - React framework with App Router support
- **React 18** with hooks and functional components
- **CSS Modules** for component-scoped styling
- **React Hot Toast** for notifications

### **Backend**
- **NextAuth.js 4.22** - Complete authentication solution
- **MongoDB 5.7** - NoSQL database for user data
- **bcryptjs 2.4.3** - Password hashing and verification

## 🔧 **Authentication Implementation**

### **Password Security**
Passwords are securely hashed using bcrypt with 12 salt rounds:

```javascript
// lib/auth.js
export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
```

## NextAuth Configuration

The authentication is configured with CredentialsProvider and JWT sessions:

```javascript
// pages/api/auth/[...nextauth].js
export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                // Verify user credentials against MongoDB
                const user = await usersCollection.findOne({
                    email: credentials.email,
                });
                
                // Verify hashed password
                const isValid = await verifyPassword(
                    credentials.password,
                    user.password,
                );
                
                return { email: user.email };
            },
        }),
    ],
};
```

## API Routes

### 1. User Registration (`/api/auth/signup`)
- **Method**: `POST`
- **Validation**: Email format, password length (min 6 chars)
- **Security**: Password hashing before storage
- **Database**: Checks for existing users before creation

```javascript
// pages/api/auth/signup.js
const hashedPassword = await hashPassword(password);
await db.collection("users").insertOne({
    email: email,
    password: hashedPassword,
    createdAt: new Date(),
});
```

### 2. Password Change (`/api/user/change-password`)
- **Method**: `PATCH`
- **Authentication**: Requires valid session via `getServerSession()`
- **Security**:
  - Verifies old password against stored hash
  - Prevents reusing old password
  - Validates new password requirements
- **Database**: Updates password with new hash

```javascript
// pages/api/user/change-password.js
const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);
const hashedPassword = await hashPassword(newPassword);
await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
);
```

## Database Connection

Secure MongoDB connection with proper error handling:

```javascript
// lib/db.js
export async function connectToDatabase() {
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
    );
    return client;
}
```

## 📁 Project Structure

```text
/components
  ├── auth/              # Authentication components
  ├── layout/            # Layout components
  ├── profile/           # User profile components
  ├── settings/          # Settings components
  └── starting-page/     # Landing page components

/pages
  ├── api/
  │   ├── auth/          # Authentication API routes
  │   └── user/          # User management API routes
  ├── auth.js            # Login/Register page
  ├── index.js           # Home page
  ├── profile.js         # Profile page
  └── settings.js        # Settings page

/lib
  ├── auth.js           # Password utilities
  └── db.js            # Database connection

/public                 # Static assets
/styles                # Global styles
```

## 🛡️ Security Features

### Session Protection
- **JWT-based sessions** with server-side validation
- **Protected API routes** using `getServerSession()`
- **Route guards** for client and server-side pages

### Password Security
- **BCrypt hashing** with 12 salt rounds
- **Password validation** (min 6 characters)
- **Old password verification** before changes
- **Password strength indicators**

### Input Validation
- **Email format validation** on client and server
- **Password confirmation** matching
- **Form validation** with error messages

## 🎨 UI/UX Features

### Authentication Forms
- **Responsive design** with mobile support
- **Loading states** and user feedback
- **Form validation** with real-time errors
- **Success/error notifications**

### Profile Interface
- **User activity dashboard** with statistics
- **Security log** with recent actions
- **Password change form** with validation
- **Quick actions** for common tasks

### Settings Management
- **Theme selection** with preview
- **Notification toggles**
- **Privacy controls**
- **Language selection**

## 🚦 Getting Started

### Prerequisites
- Node.js >= 16.0.0
- MongoDB database (local or Atlas)
- Environment variables configured

### Environment Variables
Create a `.env.local` file with:
```text
MONGODB_USER=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster
MONGODB_DATABASE=your_database
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## 🔒 Security Best Practices Implemented

1. **Never store plain text passwords** - Always hash with bcrypt
2. **Use environment variables** for sensitive data
3. **Validate input on both client and server**
4. **Use HTTPS in production**
5. **Implement rate limiting** (recommended for production)
6. **Regular session expiration**
7. **Secure HTTP headers** (configured via Next.js)

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Verify environment variables and network access
2. **Authentication Failures**: Check password hashing and verification
3. **Session Issues**: Ensure `NEXTAUTH_SECRET` is set and consistent

### Debugging
- Check browser console for client errors
- Monitor server logs for API errors
- Verify database connectivity

## 📈 Future Enhancements

Potential features to add:
- Two-factor authentication (2FA)
- Social login (Google, GitHub, etc.)
- Email verification
- Password reset functionality
- User roles and permissions
- API rate limiting
- Audit logging

