FROM nginx
COPY zjBIM/ dist/
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/
