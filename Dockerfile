# Use Node.js LTS base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy all files (including .env.production explicitly)
COPY . .
COPY .env.production .env

# Build the app (Next.js or React)
RUN npm run build

# Set environment variable for production mode
ENV NODE_ENV=production

# Expose the port (adjust for your framework: 3000 for Next.js, 80 for Nginx)
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
