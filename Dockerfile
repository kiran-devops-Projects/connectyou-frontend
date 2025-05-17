# Use Node.js LTS base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (you need devDeps for build step)
RUN npm install

# Copy rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Set environment variable for production mode (runtime)
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
