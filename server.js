const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com'); 

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');

    mqttClient.on('message', (topic, message) => {
        socket.emit('message', message.toString());
    });

    socket.on('sendMessage', (msg) => {
        mqttClient.publish('chat/topic', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mqttClient.subscribe('chat/topic');
