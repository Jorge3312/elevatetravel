# Stage 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine
WORKDIR /app

# Copy package files and install only production dependencies to keep the image lightweight
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from the build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
