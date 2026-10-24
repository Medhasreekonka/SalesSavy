# SalesSavvy — Full-Stack E-Commerce Application

SalesSavvy is a full-stack e-commerce web application built with React, Spring Boot, and MySQL. It provides product browsing, user authentication, shopping cart management, order processing, and Razorpay payment integration.

## Features

- User registration and login with authentication
- Product browsing and category-based organization
- Shopping cart management
- Order creation and order history
- Razorpay payment gateway integration
- MySQL database for persistent application data
- Docker and Docker Compose configuration

## Tech Stack

**Frontend:** React, JavaScript, HTML, CSS  
**Backend:** Java, Spring Boot, Spring Data JPA  
**Database:** MySQL  
**Build Tool:** Maven  
**Containerization:** Docker, Docker Compose  
**Payment Integration:** Razorpay

## Run Locally

### Prerequisites
- Java and Maven (or the included Maven Wrapper)
- Node.js and npm
- MySQL, or Docker Desktop with Docker Compose

### Backend
1. Configure database credentials and other secrets using environment variables.
2. Build the Spring Boot application:

   `mvnw.cmd clean package -DskipTests`

3. Run the generated JAR with the required environment variables configured.

### Frontend
1. Open the frontend directory.
2. Install dependencies using `npm install`.
3. Configure the backend API URL.
4. Start the development server using `npm run dev`.

### Docker
Configure the required environment variables in a local `.env` file, then run:

`docker compose up --build -d`

Never commit `.env` files, real credentials, payment secrets, or database dumps.

## Project Status

The application has been tested locally with Docker and MySQL. Public deployment and production configuration are separate steps.


[GitHub Profile](https://github.com/Medhasreekonka)
