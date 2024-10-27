#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy

# Start the production server
echo "Starting the production server..."
npm run start