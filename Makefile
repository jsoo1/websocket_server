PREFIX = /usr/local

out/bin/websocket_server: out/bin/websocket_server.js
	echo '#! /usr/local/bin/node' | cat - $< > $@

out/bin/websocket_server.js: server.js node_modules/express/index.js node_modules/ws/index.js
	npx webpack -- --stats-error-details --output-path out/bin
	touch $@ # Because webpack seems to not use mtime as dirty bit

install: $(PREFIX)/bin/websocket_server $(PREFIX)/etc/rc.d/websocket_server $(PREFIX)/etc/syslog.d/websocket_server.conf

$(PREFIX)/%: out/%
	install $< $@

$(PREFIX)/etc/%: %
	install $< $@

node_modules/express/index.js node_modules/ws/index.js: package.json package-lock.json
	npm ci

clean:
	rm -rvf node_modules out || true

.PHONY: clean install
