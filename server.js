#! /usr/local/bin/node

// Copyright (c) 2021 Steve Seguin. All Rights Reserved.
//  Use of this source code is governed by the APGLv3 open-source 
//
///// INSTALLATION
// su
// pkg update
// pkg upgrade
// pkg install npm doas
// make && doas make install
//
//// Finally, if using this with a ninja deploy, update index.html of the ninja installation as needed, such as with:
//  session.wss = "wss://wss.contribute.cam:443";
//  session.customWSS = true;  #  Please refer to the vdo.ninja instructions for exact details on settings; this is just a demo.
/////////////////////////

"use strict";
var fs = require("fs");
var {env, pid, exit} = require("process");
var http = require("http");
var express = require("express");
var app = express();
var WebSocket = require("ws");

const { websocket_server_port } = env;

const port = parseInt(websocket_server_port, 10);

if (isNaN(port)) {
  console.error(`parsing websocket_server_port failed, got: ${websocket_server_port}`);

  exit(1);
}

var server = http.createServer(app);
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


