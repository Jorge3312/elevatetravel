# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the project for production
RUN npm run build -- --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build artifacts from the build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
