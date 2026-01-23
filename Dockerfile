# Base image that includes both Python and Node.js
FROM nikolaik/python-nodejs:python3.10-nodejs20

# Set working directory
WORKDIR /app

# Install system dependencies required for OpenCV and graphics libraries
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# 1. Setup Python Environment
COPY scripts/requirements.txt ./scripts/
# Use headless OpenCV to avoid X11 dependencies in server environments
RUN pip install --no-cache-dir -r scripts/requirements.txt
# Ensure opencv-python-headless is installed for server (overriding requirements if needed)
RUN pip install opencv-python-headless

# 2. Setup Node.js Environment
COPY package*.json ./
RUN npm install

# 3. Copy Source Code
COPY . .

# 4. Build Next.js App
# MONGODB_URI is checked at build time by db.js, provide a mock value
ENV MONGODB_URI=mongodb://mock_build_uri
RUN npm run build

# 5. Set Environment Variables
# Tell the app to use 'python' (system python in container) instead of venv
ENV PYTHON_PATH=/usr/bin/python3
ENV NODE_ENV=production

# 6. Expose Port
EXPOSE 3000

# 7. Start Command
CMD ["npm", "start"]
