FROM nginx


COPY zjBIM/ zjBIM/
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/
