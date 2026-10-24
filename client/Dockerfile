FROM node:22.23.4-alpine AS build

WORKDIR /app

RUN apk add --no-cache ca-certificates \
    && update-ca-certificates

COPY package*.json ./

RUN npm ci

COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_RAZORPAY_KEY_ID

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_RAZORPAY_KEY_ID=$REACT_APP_RAZORPAY_KEY_ID

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache ca-certificates \
    && update-ca-certificates

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]