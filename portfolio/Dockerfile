# Stage 1: Build the Vite application
FROM node:20-alpine AS build

WORKDIR /portfolio

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application for production
RUN npm run build-local

# Stage 2: Serve the built application
FROM nginx:1.25-alpine

COPY --from=build /portfolio/nginx/default.conf /etc/nginx/conf.d

# Copy built files to the nginx web server root
COPY --from=build /portfolio/dist /usr/share/nginx/html

# Expose the port the server runs on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
