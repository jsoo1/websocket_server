PREFIX = /usr/local

websocket_server: websocket_server.js
	echo '#! /usr/bin/env node' | cat - websocket_server.js > $@

websocket_server.js: node_modules
	npx webpack -- --stats-error-details

install: $(PREFIX)/bin/websocket_server

$(PREFIX)/bin/websocket_server: websocket_server
	doas $(INSTALL) websocket_server $@

node_modules:
	npm ci

clean:
	rm -rvf node_modules websocket_server.js websocket_server || true

.PHONY: clean install node_modules
