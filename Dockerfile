FROM node:6.9.3
RUN useradd --create-home -s /bin/bash user
WORKDIR /home/user
USER user
EXPOSE 8001
COPY openshift-navigate-cloud ./openshift-navigate-cloud
CMD node openshift-navigate-cloud/application.js
