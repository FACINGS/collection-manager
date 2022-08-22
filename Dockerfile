FROM node:16-alpine
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app
# Installing dependencies
COPY package.json ./
RUN yarn install
# Copying source files
COPY . .
RUN chown -R node /app
USER node
# Running the app
CMD [ "yarn", "dev" ]