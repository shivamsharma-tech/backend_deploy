# Step 1: Use official Node.js 18 image
FROM node:18

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy Prisma files and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Step 5: Copy the rest of your application
COPY . .

# Step 6: Expose required ports
EXPOSE 4000 5000

# Step 7: Start the application
CMD ["npm", "run", "dev"]
