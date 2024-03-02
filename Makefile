PREFIX = /usr/local

websocket_server: websocket_server.js
	echo '#! /usr/local/bin/node' | cat - $< > $@

websocket_server.js: server.js node_modules/express/index.js node_modules/ws/index.js
	npx webpack -- --stats-error-details
	touch $@ # Because webpack seems to not use mtime as dirty bit

install: $(PREFIX)/bin/websocket_server $(PREFIX)/etc/rc.d/websocket_server $(PREFIX)/etc/syslog.d/websocket_server.conf

$(PREFIX)/etc/rc.d/websocket_server: rc.d/websocket_server
	$(INSTALL) rc.d/websocket_server $@

$(PREFIX)/etc/syslog.d/websocket_server.conf: syslog.d/websocket_server.conf
	$(INSTALL) syslog.d/websocket_server.conf $@

$(PREFIX)/bin/websocket_server: websocket_server
	$(INSTALL) websocket_server $@

node_modules/express/index.js node_modules/ws/index.js: package.json package-lock.json
	npm ci

clean:
	rm -rvf node_modules websocket_server.js websocket_server || true

.PHONY: clean install
