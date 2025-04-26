# Recipe Finder Application

This project is an interactive Recipe Finder application built with React (using Vite and TypeScript) for the frontend and Node.js (with Express and TypeScript) for the backend API, using MongoDB as the database.

Users can search for recipes by ingredients, view details, toggle dark/light mode, and manage their favorite recipes.

## Features

*   **Ingredient Search:** Find recipes containing specific ingredients (case-insensitive).
*   **Recipe List:** Display search results with recipe names and images.
*   **Recipe Details:** View full details (name, image, ingredients, instructions) in a modal.
*   **Sorting:** Sort search results by Newest, Name (A-Z), or Name (Z-A).
*   **Favorites:** Mark/unmark recipes as favorites (persisted in `localStorage`). Filter the list to show only favorites.
*   **Dark/Light Mode:** Toggle application theme.
*   **Responsive Design:** Adapts to different screen sizes.

## Tech Stack

### Core Technologies

*   **Frontend:** React 19+, Vite, TypeScript
*   **Backend:** Node.js (LTS), Express.js, TypeScript
*   **Database:** MongoDB (via Mongoose ODM)
*   **Styling:** Tailwind CSS, Shadcn UI
*   **State Management:** Zustand (theme), TanStack React Query (server state), `localStorage` (favorites)
*   **Testing:** Jest, React Testing Library (RTL), Supertest
*   **Icons:** `lucide-react`
*   **Containerization:** Docker, Docker Compose

### Key Libraries & Reasoning

*   **`Vite`:** Fast frontend build tool and development server.
*   **`TypeScript`:** Provides static typing for improved code quality and maintainability across the stack.
*   **`Tailwind CSS` / `Shadcn UI`:** Utility-first CSS framework and component library for rapid, consistent UI development.
*   **`TanStack React Query`:** Efficiently manages server state, caching, and data fetching on the client.
*   **`Zustand`:** Minimalist state management for simple global state like the theme.
*   **`Mongoose`:** Object Data Modeling (ODM) library for MongoDB and Node.js, simplifying database interactions.
*   **`Jest` / `RTL` / `Supertest`:** Standard testing libraries for unit, component, integration (frontend), and API testing (backend).
*   **`mongodb-memory-server`:** Used for running isolated MongoDB instances during backend testing.
*   **`Docker` / `Docker Compose`:** For containerizing the application and simplifying development environment setup.

## Project Structure

The project is a monorepo managed by npm workspaces:

*   `packages/client/`: Contains the React frontend application.
*   `packages/server/`: Contains the Node.js/Express backend API.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/diegodscamara/recipe-finder
    cd recipe-finder
    ```

2.  **Install dependencies:**
    This command will install dependencies for both the root workspace and the client/server packages.
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    *   Navigate to the server package: `cd packages/server`
    *   Create a `.env` file by copying the example: `cp .env.example .env` (assuming you create a `.env.example`)
    *   Edit the `.env` file and add your MongoDB connection string:
        ```dotenv
        DATABASE_URL=your_mongodb_connection_string
        PORT=3001 # Optional: specify a port for the server
        ```
    *   *Note:* For local development without a separate MongoDB instance, you can use the connection string provided by the Docker Compose setup (see below).

## Running the Application

### Option 1: Using Docker Compose (Recommended for Development)

This method starts the frontend, backend, and a MongoDB database instance in containers.

1.  Make sure you have Docker and Docker Compose installed.
2.  From the project root directory, run:
    ```bash
    docker-compose up -d --build
    ```
    *   `-d` runs the containers in detached mode.
    *   `--build` rebuilds the images if necessary.
3.  **Access:**
    *   Frontend: `http://localhost:5173`
    *   Backend API: `http://localhost:3001`
    *   The server container uses the `DATABASE_URL=mongodb://mongo:27017/recipe-finder` connection string defined in `docker-compose.yml` to connect to the MongoDB container.
4.  **Seed Database (Optional):** To populate the database with sample recipes, run the seed script *inside the running server container*:
    ```bash
    docker-compose exec server npm run seed
    ```
5.  **Stop Containers:**
    ```bash
    docker-compose down
    ```

### Option 2: Running Services Manually

1.  **Start MongoDB:** Ensure you have a local MongoDB instance running or use a cloud service like MongoDB Atlas. Make sure the `DATABASE_URL` in `packages/server/.env` points to it.

2.  **Start Backend Server:**
    *   Navigate to the server package: `cd packages/server`
    *   Run the development server: `npm run dev`
    *   The server will typically run on `http://localhost:3001` (or the `PORT` specified in `.env`).

3.  **Seed Database (Optional):** If running the server manually, seed the database:
    *   While in `packages/server`, run: `npm run seed`

4.  **Start Frontend Server:**
    *   Navigate to the client package: `cd packages/client`
    *   Run the development server: `npm run dev`
    *   The client will typically run on `http://localhost:5173`.

## Running Tests

1.  **Run Client Tests:**
    *   Navigate to the client package: `cd packages/client`
    *   Run: `npm run test`

2.  **Run Server Tests:**
    *   Navigate to the server package: `cd packages/server`
    *   Run: `npm run test`
