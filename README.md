# Technical Test for React/Node.js Developer: Practical Coding Challenge

## Task: Build an Interactive Recipe Finder

### Objective

Develop a Recipe Finder application using React and Node.js. Users should be able to search for recipes based on their ingredients, save their favorite recipes, and view recipe details.

### Requirements

#### Search Recipes

- Display an input field where users can type in ingredients they have (e.g., "garlic, broccoli").
- As users type, display a list of recipes that match the ingredients entered. For simplicity, this can be a mock data set (stored in a database) you provide in the application.
- The results should update in real time as ingredients are added or removed.

#### Backend REST API (Node.js)

- Create a Node.js REST API to serve the recipes.
- Use Express.js to set up your server and routes.
- Store your recipe data in a MongoDB database and serve it using the API.
- Implement routes for fetching all recipes, fetching a single recipe by ID, and saving a favorite recipe.

#### Recipe Details

When a recipe is clicked from the list, display its details on a new page or modal. This should include:

- Recipe name
- Ingredients required
- Cooking instructions
- An image of the dish (this can be a placeholder if actual images are not available)

### Bonus Requirements

The following requirements are optional and should be addressed only if time permits:

- **Sorting:** Implement a sorting mechanism in the search results (e.g., sort by the number of ingredients or alphabetical order).
- **Animations:** Use animations/transitions for a smoother user experience when switching between dark and light modes or displaying recipe details.
- **Favorite Recipes:**
    - Provide a "favorite" button (a star icon, for instance) next to each recipe in the list.
    - The recipe should be added to a "favorites" list when clicked.
    - Users should be able to view their list of favorite recipes from a separate page or section.
    - Favorite recipes should persist across browser sessions. You can use `localStorage` for this.
- **Responsive Design:**
    - Ensure the application is mobile-responsive and provides a seamless experience across devices.
- **Styling and Theming:**
    - Use styled-components or a similar library to theme the application.
    - Implement a dark and light mode toggle button. Switching between modes should change the application's theme accordingly.

### Integration

- Integrate the React frontend with the Node.js backend API. Make asynchronous requests to fetch and display recipes.
- Handle potential errors gracefully, displaying appropriate error messages to the user.

### Guidelines

- Prioritize code quality, modularity, and readability.
- Avoid using boilerplate code or complete solutions available online.
- Utilize React hooks and functional components.
- Use Node.js APIs to populate results.

#### For the Node.js API:

- Use middleware where appropriate for tasks such as error handling and logging.
- Ensure proper HTTP status codes are sent in responses.
- Add comments to your code explaining the purpose of each route and any middleware used.

### Delivery

The solution should be available to us via a public GitHub repository and must contain a Readme file with instructions to clone, build, run and test both projects. We also want an overview of packages and third-party libraries that might have been used, with a reasoning regarding its choice.

### Evaluation

We will evaluate the solution based on:

- Requirements being met
- Project structure
- Design principles being applied
- Code standards being followed
