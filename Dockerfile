# Use the official Node.js image as the base image
FROM node:lts as base

# Set the working directory
WORKDIR /src

# Build

FROM base as build

COPY --link package.json package-lock.json ./
RUN npm install
RUN npm install pg --save

COPY --link . .
COPY --link .env .

RUN npm run build

# Run
FROM base

ENV PORT=3000
ENV NODE_ENV=production

COPY --from=build /src/.output /src/.output

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]