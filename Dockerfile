# Step 1: Define the base image to use
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate
# Step 5: Copy all other files to the working directory in the container
COPY . .

# Step 6: Expose multiple ports
EXPOSE 4000 5000 

# Step 7: Define the command to run the app
CMD ["sh", "-c", "npm run dev & PORT=5000 npm run dev && wait"]