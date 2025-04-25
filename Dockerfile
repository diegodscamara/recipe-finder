FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# RUN npm install # Removed: Install dependencies at runtime in docker-compose

# RUN npm i -g serve # Optional: Keep if needed for production image, remove if only for dev

# Copy the rest of the application code
COPY . .

# RUN npm run build # Removed: Build step is for production image, not dev

EXPOSE 5173

# Default command can be set, but is overridden by docker-compose for dev
# CMD [ "npm", "run", "dev" ]