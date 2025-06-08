# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
WORKDIR .
RUN npm install && npm run build

# Production stage
FROM nginx:alpine
COPY --from=build ./dist/spring-integration-graph-viewer/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
