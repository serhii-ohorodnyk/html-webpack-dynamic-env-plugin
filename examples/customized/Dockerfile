FROM kyma/docker-nginx

# copy static web app to /var/www folder
COPY /dist/webpack-4 /var/www

# config env variables and spin up nginx proxy-server
CMD cd /var/www && \
  ./cv.sh index.tmpl index.html && \
  ./cv.sh subfolder/second.tmpl second.html && \
  nginx
