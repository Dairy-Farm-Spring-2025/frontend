# Bước 1: Build ứng dụng React
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build   # Build ứng dụng React

# Bước 2: Sử dụng Nginx để phục vụ ứng dụng
FROM nginx:stable-alpine

# Copy build từ container build sang container Nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf   # Thêm cấu hình Nginx nếu cần

EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
