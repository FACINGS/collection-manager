FROM node:16-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Installing dependencies
COPY ./yarn.lock ./
COPY ./package*.json ./

# Install dependencies
RUN yarn install


# Copying source files
COPY ./ ./

# Build app
RUN yarn build

RUN chown -R node .next

# Expose the listening port
EXPOSE 3000

# The node user is provided in the Node.js Alpine base image

USER node

# Run npm start script with PM2 when container starts
#CMD [ "pm2-runtime", "start", "yarn" ]

CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
