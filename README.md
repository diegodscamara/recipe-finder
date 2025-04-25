# Conway's Game of Life - React Implementation

This project is a React application simulating John Conway's classic cellular automaton, the [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). It's built using React 19, TypeScript, Vite, and Tailwind CSS, focusing on clean code, testability, and adherence to modern web development practices.

## 📜 Problem Description

The Game of Life is not a game in the conventional sense, but a "zero-player game" where the evolution of the system is determined solely by its initial state. It consists of a grid of cells, each of which can be in one of two states: alive or dead. The state of each cell in the next generation is determined by a set of rules based on its neighbors in the current generation.

This application provides an interactive visualization of the Game of Life simulation.

## ✨ Features

*   **Interactive Grid**: Click on cells to toggle their state between alive (typically colored) and dead (typically background color).
*   **Step Forward**: Advance the simulation by a single generation using the "Step" button.
*   **Play/Pause**: Automatically advance generations at a set interval. The simulation can be started and stopped at any time.
*   **Advance X Generations**: Manually input a number 'X' and advance the simulation by that many generations instantly.
*   **Reset**: Clear the grid back to an empty (all dead) state.
*   **Predefined Patterns**: Load simple starting patterns like "Blinker" and "Glider" onto the grid.
*   **Self-Contained Logic**: All simulation logic is handled purely in the frontend TypeScript code (`src/utils/gameLogic.ts`), isolated from the UI components.

## 🧠 Assumptions

*   **Grid Size**: The grid has a fixed size (currently 20x30), defined in `App.tsx`.
*   **Edge Behavior**: The edges of the grid act as boundaries. Cells outside the grid are considered dead (non-wrapping/finite grid).
*   **Performance**: Optimized for typical browser performance on grids up to roughly 100x100.

## 🏛️ Solution Architecture & Design

The application follows a component-based architecture with a clear separation of concerns:

*   **Core Logic (`src/utils/gameLogic.ts`):** The fundamental rules of Conway's Game of Life (`getNextGeneration`, `countLiveNeighbors`) are implemented as pure, testable functions, completely independent of React or any UI framework. This ensures the logic is portable and easy to unit test.
*   **State Management (`src/hooks/useGameOfLife.ts`):** A custom React hook, `useGameOfLife`, encapsulates all the game's state (the board, play/pause status) and the actions that modify it (stepping, toggling cells, resetting, etc.). This approach centralizes state logic, makes it reusable, and keeps the main `App` component cleaner. It uses standard React hooks (`useState`, `useCallback`, `useRef`, `useEffect`) for state updates, memoization of callbacks, and managing the simulation interval.
*   **UI Components (`src/components/`):**
    *   `Grid.tsx`: Responsible solely for rendering the current board state. It receives the board and a cell click handler as props. It's wrapped in `React.memo` to prevent unnecessary re-renders when props don't change.
    *   `Controls.tsx`: Provides the user interface elements (buttons, input) for controlling the simulation. It receives the current state (e.g., `isPlaying`) and callback functions (`onPlayPause`, `onStep`, etc.) as props.
*   **Application Composition (`src/App.tsx`):** The main `App` component orchestrates the application. It initializes the `useGameOfLife` hook to get the state and action handlers, and then passes these down as props to the `Controls` and `Grid` components. It's responsible for the overall layout.

This separation makes the application easier to understand, test, and maintain. State logic is decoupled from the UI, and the core simulation rules are independent of the React framework.

## 🏁 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) (or `yarn`, `pnpm`)
*   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Optional, for containerized development/deployment)

### Installation & Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/diegodscamara/game-of-life
    cd game-of-life
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified by Vite) in your browser.

### Running with Docker (Optional)

1.  Ensure Docker Desktop is running.
2.  Build and start the development container:
    ```bash
    docker compose up --build
    ```
    The application will be available at [http://localhost:5173](http://localhost:5173).

## 🛠️ Available Scripts

*   `npm run dev`: Starts the Vite development server with HMR.
*   `npm run build`: Builds the production-ready application to the `dist/` folder.
*   `npm test`: Runs the Jest test suite in watch mode.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for testing.

## 🧪 Testing

*   **Unit Tests**: The core simulation logic (`getNextGeneration`, `countLiveNeighbors`) is unit-tested using Jest. Coverage target is 90%+.
*   **Integration Tests**: Basic UI interactions (controls, cell toggling) are tested using React Testing Library.

Run tests using `npm test`.

## 📁 Project Structure

```
game-of-life/
├── public/             # Static assets
├── src/
│   ├── components/     # React UI components (Grid, Controls, ui/*)
│   ├── hooks/          # Custom React hooks (useGameOfLife)
│   ├── utils/          # Core simulation logic (gameLogic.ts)
│   ├── types/          # TypeScript type definitions (cell.ts)
│   ├── assets/         # Static assets used by components
│   ├── lib/            # Shared utility functions (cn)
│   ├── App.tsx         # Main application component, layout
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles, Tailwind directives
├── tests/              # Jest/RTL tests (__tests__ or separate dir)
├── .github/            # CI/CD workflows (if applicable)
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── Dockerfile          # Docker build configuration
├── docker-compose.yml  # Docker compose for development
├── jest.config.ts      # Jest configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration (root)
└── vite.config.ts      # Vite configuration
```
*(Configuration files like `.gitignore`, `package.json`, etc. are standard and omitted for brevity)*

## 💻 Technology Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/) inspired structure (using `tailwind-merge`, `clsx`, `cva`)
*   **Icons:** [@phosphor-icons/react](https://phosphoricons.com/)
*   **Testing:** [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [jest-dom](https://github.com/testing-library/jest-dom)
*   **Linting:** [ESLint](https://eslint.org/)
*   **Formatting:** [Prettier](https://prettier.io/)
*   **Containerization:** [Docker](https://www.docker.com/)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
