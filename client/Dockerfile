# build React
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# serve build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80