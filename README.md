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

The API is documented using OpenAPI 3.0. The documentation can be found either in the `swagger.yaml` file located in the `Server/root` directory or at https://unidomus.docs.apiary.io/#.

## Contributing

Contributions are welcome! Please create a pull request or open an issue for any changes or additions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

UniDomus is a comprehensive platform for real estate listings and roommate matching. This repository contains the source code for both the frontend and backend of the UniDomus application.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [FAQ](#faq)
- [Contact](#contact)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)

## Overview

UniDomus offers a robust solution for managing real estate listings and finding suitable roommates. The application includes features such as:

- Listing real estate properties with detailed information.
- User registration and authentication.
- Roommate matching based on user preferences.
- Notifications and messaging system.
- Administrative functionalities for managing users and listings.

### App Functionalities

- **User Authentication**:

  - **Registration**: Users can register by providing necessary details.
  - **Login**: Users can login using their email and password or via Google authentication.
  - **Password Reset**: Users can request a password reset link via email.

- **Property Listings**:

  - **Create Listing**: Users can create new property listings with detailed information including address, photos, price, and description.
  - **View Listings**: Users can browse and search for listings.
  - **Update Listing**: Users can update details of their own listings.
  - **Delete Listing**: Users can delete their own listings.

- **Roommate Matching**:

  - **Find Matches**: Users can find potential roommates based on preferences and criteria.
  - **Send Requests**: Users can send roommate requests.
  - **Manage Matches**: Users can accept, reject, or communicate with potential roommates.

- **Messaging**:

  - **In-App Chat**: Users can send and receive messages within the app.
  - **Message Notifications**: Users receive notifications for new messages.

- **Notifications**:

  - **System Notifications**: Users receive notifications for various activities like new matches, messages, and listing updates.
  - **Email Notifications**: For high-priority notifications, users receive email alerts.

- **Administrative Features**:

  - **User Management**: Admins can view, ban, unban, and delete users.
  - **Property Management**: Admins can view, approve, and remove listings.
  - **Report Handling**: Admins can manage and resolve user reports for inappropriate content or behavior.

- **Map Integration**:

  - **Location-Based Search**: Users can search for properties based on location using integrated map services.
  - **Geocoding**: Convert addresses to coordinates for map display.

- **Favorites**:
  - **Save Listings**: Users can save property listings as favorites for quick access.

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

### Directory Tree

```plaintext
UniDomus
├── .gitignore
├── .vscode
├── FrontEnd
│   ├── .eslintrc.cjs
│   ├── .gitignore
│   ├── README.md
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── UniDomusLogo.png
│   │   └── UniDomusLogoWhite.png
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   ├── assets
│   │   │   ├── UniDomusLogo.png
│   │   │   ├── UniDomusLogoWhite.png
│   │   │   ├── calendar.svg
│   │   │   ├── deleteListing.svg
│   │   │   ├── deleteUser.svg
│   │   │   ├── favorite.svg
│   │   │   ├── favorite_filled.svg
│   │   │   ├── genericUser.svg
│   │   │   ├── judge.svg
│   │   │   ├── location.svg
│   │   │   ├── report.svg
│   │   │   ├── report2.svg
│   │   │   ├── search.svg
│   │   │   ├── send.svg
│   │   │   ├── square_foot.svg
│   │   │   ├── trash.svg
│   │   │   ├── typology.svg
│   │   │   └── unban.svg
│   │   ├── components
│   │   │   ├── AddListingForm.jsx
│   │   │   ├── BanPopup.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Carousel.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── ChatOld.jsx
│   │   │   ├── DisplayListings.jsx
│   │   │   ├── DisplayTenants.jsx
│   │   │   ├── EditProfileForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── Homepage.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ListingDetails.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── MapComponent.jsx
│   │   │   ├── MatchList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PasswordResetForm.jsx
│   │   │   ├── PopoverInfo.jsx
│   │   │   ├── RegistrationForm.jsx
│   │   │   ├── ReportDetails.jsx
│   │   │   ├── ReportPopup.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Slider.jsx
│   │   │   └── TenantDetails.jsx
│   │   ├── constant.js
│   │   ├── context
│   │   │   └── LoadContext.jsx
│   │   ├── data
│   │   ├── hooks
│   │   │   ├── useBan.jsx
│   │   │   ├── useMatches.jsx
│   │   │   └── useReport.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── AddListing.jsx
│   │   │   ├── ChatApp.jsx
│   │   │   ├── ChatsList.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── FindAFlat.jsx
│   │   │   ├── FindATenant.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ListingDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MatchDisplayer.jsx
│   │   │   ├── PasswordReset.jsx
│   │   │   ├── Registration.jsx
│   │   │   ├── TenantDetails.jsx
│   │   │   ├── TestPage.jsx
│   │   │   └── ViewReports.jsx
│   │   └── sections
│   │       └── homePage.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── LICENSE
├── README.md
└── Server
    └── root
        ├── app.js
        ├── index.js
        ├── package.json
        ├── src
        │   ├── controllers
        │   │   ├── listingController.js
        │   │   ├── matchController.js
        │   │   ├── notificationController.js
        │   │   ├── reportController.js
        │   │   ├── tokenController.js
        │   │   └── userController.js
        │   ├──

 database
        │   │   ├── connection.js
        │   │   └── databaseQueries.js
        │   ├── middleware
        │   │   ├── authentication.js
        │   │   └── tokenChecker.js
        │   ├── models
        │   │   ├── enums.js
        │   │   ├── listingModel.js
        │   │   ├── matchModel.js
        │   │   ├── notificationModel.js
        │   │   ├── reportModel.js
        │   │   ├── tokenModel.js
        │   │   └── userModel.js
        │   ├── routes
        │   │   ├── index.js
        │   │   ├── listingRoutes.js
        │   │   ├── matchRoutes.js
        │   │   ├── notificationRoutes.js
        │   │   ├── reportRoutes.js
        │   │   ├── tokenRoutes.js
        │   │   └── userRoutes.js
        │   ├── services
        │   │   └── emailService.js
        │   ├── socket.js
        │   ├── tests
        │   │   ├── listingController.test.js
        │   │   ├── matchController.test.js
        │   │   ├── notificationController.test.js
        │   │   ├── reportController.test.js
        │   │   ├── tokenController.test.js
        │   │   ├── userController.test.js
        │   │   └── validationFunctions.test.js
        │   ├── utils
        │   │   ├── dateUtils.js
        │   │   └── tokenUtils.js
        │   └── validators
        │       └── validationFunctions.js
        └── swagger.yaml
```

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

```plaintext
MONGODB_URI=mongodb://<your_mongo_host>:<your_mongo_port>/<your_database_name>
JWT_SECRET=<your_jwt_secret>
GOOGLE_API_KEY=<your_google_api_key>
SENDGRID_API_KEY=<your_sendgrid_api_key>
PORT=<your_port>
BASE_URL=http://<your_base_url>
SUPER_SECRET=<your_super_secret>
FRONTEND_BASE=http://<your_frontend_base_url>
GEOCODING_API_KEY=<your_geocoding_api_key>

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

The API is documented using OpenAPI 3.0. The documentation can be found either in the `swagger.yaml` file located in the `Server/root` directory or at https://unidomus.docs.apiary.io/#.

## Contributing

Contributions are welcome! Please create a pull request or open an issue for any changes or additions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Features

- Listing real estate properties with detailed information.
- User registration and authentication.
- Roommate matching based on user preferences.
- Notifications and messaging system.
- Administrative functionalities for managing users and listings.
- Map integration for location-based searches.
- Favorite listings feature for users.

## Technologies Used

### Frontend

- React
- Tailwind CSS
- Vite
- ESLint
- PostCSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication
- SendGrid for email services
- OpenAPI for API documentation

## Screenshots

Include screenshots of the application here. For example:

![Home Page](path_to_screenshot/homepage.png)
![Listing Page](path_to_screenshot/listingpage.png)

## FAQ

### How do I reset my password?

To reset your password, go to the login page and click on "Forgot Password." Follow the instructions sent to your email.

### How do I list a property?

After logging in, navigate to the "Add Listing" page from the dashboard and fill out the necessary details about the property.

### How can I contact support?

For support, you can reach out to us at support@unidomus.com.

## Contact

For any queries or support, please contact:

- **Email**: support@unidomus.com
- **GitHub Issues**: [GitHub Issues Page](https://github.com/HellNF/UniDomus/issues)

## Development Setup

To set up a development environment, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/HellNF/UniDomus.git
   cd UniDomus
   ```

2. **Install dependencies**:

   ```sh
   cd FrontEnd
   npm install

   cd ../Server/root
   npm install
   ```

3. **Set up environment variables** as described in the [Installation](#installation) section.

4. **Start the application**:

   ```sh
   cd Server/root
   npm start

   cd ../../FrontEnd
   npm run dev
   ```

### Testing

To ensure the robustness and reliability of the application, a comprehensive suite of tests has been implemented.

1. **Test Dependencies**:

   ```sh
   cd Server/root
   npm install --save-dev jest supertest
   ```

2. **Running Tests**:

   ```sh
   npm test
   ```

3. **Test Structure**:

   - **Unit Tests**: Validate individual functions and methods in isolation.
   - **Integration Tests**: Ensure different parts of the application work together correctly.
   - **End-to-End Tests**: Simulate user interactions to test the application as a whole.

4. **Coverage Reports**:

   - **Generate Coverage Report**:
     ```sh
     npm run test:coverage
     ```
   - **View Coverage Report**: The report will be generated in the `coverage` directory. Open `index.html` in a browser to view detailed coverage.

5. **Test Files**:
   - **Controller Tests**: Ensure all controller methods are functioning correctly (`tests/listingController.test.js`, `tests/matchController.test.js`, `tests/notificationController.test.js`, `tests/reportController.test.js`, `tests/tokenController.test.js`, `tests/userController.test.js`).
   - **Model Tests**: Validate schema definitions and model methods.
   - **Utility Tests**: Check utility functions for correctness (`tests/validationFunctions.test.js`).

## Example Test Snippets

Here are some example snippets of how tests are structured:

**Example Unit Test** (`tests/validationFunctions.test.js`):

```js
const { isValidEmail } = require("../validators/validationFunctions");

test("validates correct email format", () => {
  expect(isValidEmail("test@example.com")).toBe(true);
  expect(isValidEmail("invalid-email")).toBe(false);
});
```

**Example Integration Test** (`tests/listingController.test.js`):

```js
const request = require("supertest");
const app = require("../app");
const Listing = require("../models/listingModel");

describe("Listing API", () => {
  it("should create a new listing", async () => {
    const response = await request(app)
      .post("/listings")
      .send({
        address: {
          street: "123 Main St",
          city: "Milan",
          cap: "20100",
          houseNum: "1",
          province: "MI",
          country: "Italy",
        },
        price: 100,
        typology: "Apartment",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("address");
  });

  it("should fetch all listings", async () => {
    const response = await request(app).get("/listings");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

## Deployment

To deploy the application, follow these steps:

1. **Build the frontend**:

   ```sh
   cd FrontEnd
   npm run build
   ```

2. **Deploy the backend and frontend** to your preferred hosting service. Make sure to set up environment variables in your hosting environment.

## Troubleshooting

### Common Issues

- **MongoDB Connection Error**: Ensure MongoDB is running and the connection URI is correct.
- **Environment Variables**: Make sure all required environment variables are set correctly.
- **Port Conflicts**: Ensure the ports 5050 (backend) and 3000 (frontend) are not being used by other applications.

- **MongoDB Connection Error**:

  - Ensure MongoDB is running and accessible.
  - Verify the `MONGODB_URI` environment variable is correctly set.

- **Environment Variables**:

  - Check that all required environment variables are set in the `.env` file.

- **Port Conflicts**:

  - Ensure the ports 5050 (backend) and 5173 (frontend) are available and not in use by other applications.

- **API Errors**:
  - Check server logs for detailed error messages.
  - Ensure all necessary services (e.g., email service) are correctly configured.

Adding these sections will provide comprehensive guidance on the application's functionalities and testing procedures, making it easier for developers to understand and contribute to the project.
