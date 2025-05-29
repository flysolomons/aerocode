# Use Node.js LTS (v20 at time of writing) as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the frontend code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port (Next.js default is 3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]