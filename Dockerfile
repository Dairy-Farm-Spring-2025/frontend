# Stage 1: Build ứng dụng React
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Build ứng dụng React, tạo thư mục dist

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html  # Sửa từ /app/build thành /app/dist
