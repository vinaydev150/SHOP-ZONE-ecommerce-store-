# E-Commerce Store

Hello ,this is Vinay D and ive built A full-stack e-commerce application built with **Spring Boot 4.0** (backend) and **React + Vite** (frontend). Features JWT-based authentication, product browsing, shopping cart, and order management.

## 📁 Project Structure

```
ECommerce-store/
├── backend/           # Spring Boot REST API
│   ├── src/main/java/com/ecommerce/backend/
│   │   ├── config/   # JWT & Security configuration
│   │   ├── controller/   # REST endpoints
│   │   ├── service/  # Business logic
│   │   ├── entity/   # JPA entities
│   │   ├── dto/      # Data transfer objects
│   │   └── exception/    # Custom exceptions
│   ├── pom.xml       # Maven dependencies
│   └── mvnw/mvnw.cmd # Maven wrapper
│
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/   # Reusable components
│   │   ├── features/ # Redux slices
│   │   ├── api/      # Axios client
│   │   └── app/      # Redux store
│   ├── package.json  # npm dependencies
│   └── vite.config.js    # Vite config
│
├── .env              # Environment variables (do NOT commit)
├── .env.example      # Environment template
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn**

### 1️⃣ Set Up Environment

Copy the example environment file and it already has a generated secure JWT secret:

```bash
# The .env file is already created with a secure JWT secret
# No additional setup needed for environment variables
```

### 2️⃣ Run Backend

```bash
cd backend

# The JWT secret is already loaded from .env file automatically
# No manual setup needed!

# Start the backend server
.\mvnw.cmd spring-boot:run
# Backend runs on http://localhost:8080
```

**Note:** The `.env` file contains the actual JWT secret. Keep it private and never commit it to GitHub.

### 3️⃣ Run Frontend

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

## 📊 Technology Stack

### Backend
- **Spring Boot 4.0** — REST API framework
- **Spring Data JPA** — ORM & database
- **Spring Security** — Authentication & authorization
- **JWT (JJWT)** — Token-based authentication
- **H2 Database** — In-memory database
- **Lombok** — Code generation

### Frontend
- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **Redux Toolkit** — State management
- **Axios** — HTTP client
- **React Router 7** — Client-side routing

## 🔐 Authentication Flow

1. **Register** → `POST /api/auth/register` (email, name, password)
2. **Login** → `POST /api/auth/login` (email, password)
3. **Get Token** → Response includes JWT token
4. **Protected Requests** → Add `Authorization: Bearer <token>` header

### Test Credentials

**Admin:**
- Email: `admin@store.com`
- Password: `admin123`

**Customer:**
- Email: `john@store.com`
- Password: `john123`

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Login & get JWT token

### Products
- `GET /api/products` — Get all products
- `GET /api/products/{id}` — Get product details
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/{id}` — Update product (admin only)
- `DELETE /api/products/{id}` — Delete product (admin only)

### Orders
- `GET /api/orders` — Get user's orders
- `POST /api/orders` — Create new order
- `GET /api/orders/{id}` — Get order details

## 🛒 Key Features

✅ **User Authentication** — Secure JWT-based login  
✅ **Product Catalog** — Browse & filter products  
✅ **Shopping Cart** — Add/remove items (Redux state)  
✅ **Order Management** — Create & view orders  
✅ **Role-Based Access** — Admin & customer roles  
✅ **H2 Console** — Database UI at `http://localhost:8080/h2-console`  
✅ **CORS Support** — Frontend-backend communication  

## 🔑 Security Notes

- ⚠️ **Never commit `.env` file** — It contains sensitive secrets
- ✅ **Use strong JWT secrets** — Currently using cryptographically secure key
- ✅ **Passwords encrypted** — BCrypt hashing for user passwords
- ✅ **CORS configured** — Limited to frontend origin
- ✅ **H2 Console disabled in production** — Set to development only

## 🧪 Database Access

Access the H2 in-memory database UI:

```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:ecommercedb
Username: sa
Password: (leave blank)
```

**Note:** Database resets when backend restarts (in-memory).

## 📦 Build & Deploy

### Backend Production Build
```bash
cd backend
.\mvnw.cmd -DskipTests clean package
# JAR created: target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build
```bash
cd frontend
npm run build
# Optimized build: dist/
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Set `JWT_SECRET` environment variable |
| CORS errors | Check frontend URL in SecurityConfig |
| H2 console 403 | Enable in `application.properties` |
| npm install fails | Delete `node_modules` & `package-lock.json`, reinstall |
| Port already in use | Change port in properties or kill the process |

## 📄 License

This project is open source and available under the MIT License.

---

**Happy coding! 🚀**
