FROM node:23.0.0

COPY package*.json ./
RUN ls
ARG CLEAN_CACHE=false
RUN echo "a $CLEAN_CACHE"
RUN if [ "$CLEAN_CACHE" = "true" ] ; then npm cache clean --force ; fi
RUN npm ci --verbose

COPY . .
RUN ls
EXPOSE 3000