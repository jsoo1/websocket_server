#! /usr/local/bin/node

// Copyright (c) 2021 Steve Seguin. All Rights Reserved.
//  Use of this source code is governed by the APGLv3 open-source 
//
///// INSTALLATION
// sudo apt-get update
// sudo apt-get upgrade
// sudo apt-get install nodejs -y
// sudo apt-get install npm -y
// sudo npm install express
// sudo npm install ws
// sudo npm install fs
// sudo add-apt-repository ppa:certbot/certbot  
// sudo apt-get install certbot -y
// sudo certbot certonly // register your domain
// sudo nodejs server.js // port 443 needs to be open. THIS STARTS THE SERVER
//
//// Finally, if using this with a ninja deploy, update index.html of the ninja installation as needed, such as with:
//  session.wss = "wss://wss.contribute.cam:443";
//  session.customWSS = true;  #  Please refer to the vdo.ninja instructions for exact details on settings; this is just a demo.
/////////////////////////

"use strict";
var fs = require("fs");
var {env, pid, exit} = require("process");
var https = require("https");
var express = require("express");
var app = express();
var WebSocket = require("ws");

const {
  websocket_server_pidfile,
  websocket_server_port,
  websocket_server_privkey,
  websocket_server_fullchain,
} = env;

if (websocket_server_privkey === undefined) {
  console.error('websocket_server_privkey not set');

  exit(1);
}

if (websocket_server_fullchain === undefined) {
  console.error('websocket_server_fullchain not set');

  exit(1);
}

console.log({pid, websocket_server_pidfile});

if (websocket_server_pidfile !== undefined) {
  fs.writeFile(websocket_server_pidfile, `${pid}`, () => console.log(`wrote ${websocket_server_pidfile}`));
}

const port = websocket_server_port !== undefined ? parseInt(websocket_server_port, 10) : 3000;

if (isNaN(port)) {
  console.error(`parsing port failed, got: ${websocket_server_port}`);

  exit(1);
}

const key = fs.readFileSync(websocket_server_privkey);
const cert = fs.readFileSync(websocket_server_fullchain);

var server = https.createServer({key,cert}, app);
var websocketServer = new WebSocket.Server({ server });

websocketServer.on('connection', (webSocketClient) => {
    webSocketClient.on('message', (message) => {
            websocketServer.clients.forEach( client => {
                    if (webSocketClient!=client){
                        client.send(message.toString());
                    }
            });
    });
});
server.listen(port, () => {console.log(`Server started on port ${port}`) });


