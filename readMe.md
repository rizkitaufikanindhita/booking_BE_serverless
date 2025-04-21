# Backend for Booking Room App

This is the backend server for the **Booking Room App**, which manages the logic for room bookings, user authentication, and scheduling. The backend is built using **Node.js** and **Express** with **MongoDB** for data storage and other supporting libraries for security and validation.

## Technologies Used

### Backend:

-   **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building fast, scalable network applications.
-   **Express**: A fast, unopinionated, minimalist web framework for Node.js that simplifies routing and handling HTTP requests.
-   **MongoDB**: A NoSQL database for storing room booking data, user details, and other information.
-   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, used to model the application's data structure.
-   **JWT (JSON Web Tokens)**: Used for secure user authentication and session management.
-   **bcrypt**: A library for hashing passwords and ensuring secure authentication.
-   **dotenv**: A zero-dependency module to load environment variables from a `.env` file into `process.env`.
-   **CORS (Cross-Origin Resource Sharing)**: A package to enable cross-origin requests, useful when your frontend and backend are hosted on different domains or ports.
-   **Zod**: A TypeScript-first schema validation library for ensuring valid data in the API requests.
-   **Moment-Timezone**: A library for parsing, validating, manipulating, and displaying dates and times, with support for timezones.
-   Docker: A platform that allows you to package and run applications in containers, ensuring consistency across different environments. Used here to containerize both the backend server and MongoDB for development and production.

## Features

-   **Room Booking API**: Allows users to view available rooms, create bookings, and manage their bookings.
-   **User Authentication**: Secure authentication using JWT for managing user sessions.
-   **CRUD Operations**: Create, Read, Update, Delete room bookings.
-   **Data Validation**: Using Zod to validate incoming requests.
-   **Security**: Passwords are hashed with bcrypt for secure storage.
