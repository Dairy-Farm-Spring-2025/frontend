# Stage 1: Build ứng dụng React
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Build ứng dụng React, tạo thư mục dist

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine
# Tạo thư mục đích nếu chưa tồn tại
RUN mkdir -p /usr/share/nginx/html
# Sao chép file dist từ stage build
COPY --from=build /app/dist /usr/share/nginx/html
# Sao chép file nginx.conf vào image
COPY nginx.conf /etc/nginx/nginx.conf
