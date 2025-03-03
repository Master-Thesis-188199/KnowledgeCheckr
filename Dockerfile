# First Step - Install Packages in seperate step for caching purposes.
FROM node:23.7.0-alpine AS package-installer
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

# Second Step - Build the application
FROM node:23.7.0-alpine AS builder

WORKDIR /app

COPY --from=package-installer /app/node_modules /app/node_modules
COPY . .

RUN npm run production:build

# Final Stage: Run the Application
FROM node:23.7.0-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary build artifacts from the builder stage
COPY --from=builder app/package.json /app/package.json
COPY --from=builder app/yarn.lock /app/yarn.lock
COPY --from=builder app/next.config.ts /app/next.config.ts
COPY --from=builder app/.next/standalone /app/.next/standalone

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "production:start"]
