#! /usr/local/bin/node

// Copyright (c) 2021 Steve Seguin. All Rights Reserved.
//  Use of this source code is governed by the APGLv3 open-source 
//
///// INSTALLATION
// su
// pkg update
// pkg upgrade
// pkg install npm
// make && make install
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

const port = parseInt(websocket_server_port, 10);

if (isNaN(port)) {
  console.error(`parsing websocket_server_port failed, got: ${websocket_server_port}`);

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


