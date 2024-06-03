# UniDomus

UniDomus is a comprehensive platform for real estate listings and roommate matching. This repository contains the source code for both the frontend and backend of the UniDomus application.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

UniDomus offers a robust solution for managing real estate listings and finding suitable roommates. The application includes features such as:

- Listing real estate properties with detailed information.
- User registration and authentication.
- Roommate matching based on user preferences.
- Notifications and messaging system.
- Administrative functionalities for managing users and listings.

## Project Structure

The project is divided into two main parts: Frontend and Backend.

### Frontend

The frontend part of the project is located in the `FrontEnd` directory and is built with modern JavaScript frameworks and tools.

- **Configuration Files**

  - `.eslintrc.cjs`: Configuration for ESLint.
  - `postcss.config.js`: Configuration for PostCSS.
  - `tailwind.config.js`: Configuration for Tailwind CSS.
  - `vite.config.js`: Configuration for Vite.

- **Public Folder**

  - Contains static assets like images and logos.

- **Source Folder (`src`)**
  - **assets**: Static files like images and SVGs.
  - **components**: Reusable UI components like forms, buttons, and layout components.
  - **context**: React context files for state management.
  - **hooks**: Custom React hooks for various functionalities.
  - **pages**: Individual pages of the application.
  - **sections**: Larger sections of pages, often composed of multiple components.
  - `App.jsx`: Main application component.
  - `AuthContext.jsx`: Context for managing authentication.
  - `index.css`: Global CSS styles.
  - `main.jsx`: Entry point of the React application.

### Backend

The backend part of the project is located in the `Server/root` directory and is built with Node.js and Express.

- **Configuration Files**

  - `app.js`: Initializes the Express app.
  - `index.js`: Entry point for the server.
  - `swagger.yaml`: OpenAPI specification for the API.

- **Source Folder (`src`)**
  - **controllers**: Logic for handling requests and responses for different routes.
  - **database**: Database connection and query files.
  - **middleware**: Custom middleware functions for authentication and other purposes.
  - **models**: Mongoose models for different data schemas.
  - **routes**: Route definitions for the API.
  - **services**: Service files for additional functionalities like email services.
  - **tests**: Test files for different components of the backend.
  - **utils**: Utility functions used across the backend.
  - **validators**: Validation functions for input data.

## Installation

### Prerequisites

- Node.js (v12.x or higher)
- npm (v6.x or higher) or yarn
- MongoDB

### Clone the Repository

```sh
git clone https://github.com/HellNF/UniDomus.git
cd UniDomus
```

### Frontend Setup

```sh
cd FrontEnd
npm install
```

### Backend Setup

```sh
cd Server/root
npm install
```

### Environment Variables

Create a `.env` file in the `Server/root` directory and add the necessary environment variables:

```
MONGODB_URI=mongodb://localhost:27017/unidomus
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
```

### Start the Application

#### Start Backend Server

```sh
cd Server/root
npm start
```

#### Start Frontend Server

```sh
cd FrontEnd
npm run dev
```

## Usage

After starting both the backend and frontend servers, you can access the application by navigating to `http://localhost:3000` in your web browser.

## API Documentation

The API is documented using OpenAPI 3.0. The documentation can be found in the `swagger.yaml` file located in the `Server/root` directory.

## Contributing

Contributions are welcome! Please create a pull request or open an issue for any changes or additions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
