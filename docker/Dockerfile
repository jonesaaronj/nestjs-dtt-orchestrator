# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS development

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (or package-lock.json)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]