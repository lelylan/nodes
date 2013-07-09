NODE_ENV:=development
MONGOLAB_JOBS_HOST:=mongodb://localhost:27017
MONGOLAB_JOBS_DB:=jobs_test
MONGOLAB_DEVICES_URL:=mongodb://localhost:27017/devices_test
#DEBUG:=lelylan
PORT:=18004
ENV:=NODE_ENV=${NODE_ENV} MONGOLAB_JOBS_HOST=${MONGOLAB_JOBS_HOST} MONGOLAB_JOBS_DB=${MONGOLAB_JOBS_DB} MONGOLAB_DEVICES_URL=${MONGOLAB_DEVICES_URL} DEBUG=${DEBUG} PORT=${PORT}

test:
	${ENV} ./node_modules/.bin/mocha --recursive test

bail:
	${ENV} ./node_modules/.bin/mocha --recursive test --bail --reporter spec

ci:
	${ENV} ./node_modules/.bin/mocha --recursive --watch test

.PHONY: test
