# Stage 1 — build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx @angular/cli@18 build --configuration production

# Stage 2 — serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/invoice-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
