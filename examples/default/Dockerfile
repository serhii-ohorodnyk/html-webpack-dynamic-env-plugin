FROM kyma/docker-nginx

# copy static web app to /var/www folder
COPY /dist/webpack-4 /var/www

# config env variables and spin up nginx proxy-server
CMD /var/www/config-env.sh /var/www/index.html.template /var/www/index.html && nginx
