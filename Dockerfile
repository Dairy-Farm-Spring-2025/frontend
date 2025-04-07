# Build react app
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve react build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 70
