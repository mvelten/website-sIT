FROM ubuntu:14.04

RUN apt-get update && apt-get install npm nodejs

ADD app /opt/sit
ADD start /opt/sit/start

RUN cd /opt/sit && npm i --production

CMD ["/opt/sit/start"]

