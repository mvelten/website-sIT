FROM phusion/baseimage

RUN apt-get update

ADD nodejs-5 /usr/local/bin/nodejs-5
RUN /usr/local/bin/nodejs-5 && apt-get install -y nodejs

RUN mkdir /etc/service/sit
ADD start /etc/service/sit/run

ADD app /opt/sit

RUN cd /opt/sit && npm i --production

EXPOSE 3000
CMD ["/sbin/my_init"]

