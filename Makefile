all: install build test

install:
	npm install

build:
	npm run build

test:
	npm test

clean:
	rm -rf node_modules dist
