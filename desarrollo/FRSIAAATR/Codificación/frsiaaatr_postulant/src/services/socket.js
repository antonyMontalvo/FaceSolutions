/*
    Init of services real time
*/

var init = function (app) {
    const server = require('http').Server(app),
        io = require('socket.io')(server, {
            path: '/continuos',
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });

    io.on('connection', function (socket) {
        let socketid = socket.id;
        console.log('Connected: ', socketid);
        socket.emit('Connected')
        
        socket.on('process', function () {
            console.log('process')
            io.sockets.emit('hi', 'everyone') //Emite para todos los sockets
            io.emit('hi', 'everyone') //Emite para todos los sockets
            socket.emit('hi', 'everyone'); //Emite para el socket conectado (cliente)
        })
        
        socket.on('notifications', function () {
            
        })
        socket.on('disconnect', function () {
            console.log('Disconnecting...')
        });
    });
    
    // io.emit('hi', 'everyone');


    return server
}

module.exports = init
