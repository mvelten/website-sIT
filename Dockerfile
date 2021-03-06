FROM phusion/baseimage

RUN apt-get update

ADD nodejs-5 /usr/local/bin/nodejs-5
RUN /usr/local/bin/nodejs-5 && apt-get install -y nodejs

RUN mkdir /etc/service/sit-website
ADD start /etc/service/sit-website/run

ADD app /opt/sit-website

RUN cd /opt/sit-website && npm i --production

EXPOSE 3000
CMD ["/sbin/my_init"]
