# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm clean-install & npm i && npm install --legacy-peer-deps && npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /dist/spring-integration-graph-viewer/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
