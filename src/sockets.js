
function sockets(io){

    io.on('connection', async socket => {

        console.log('nuevo usuario conectado: ',socket.id);

        socket.on('updatelistimages', () => {
            // console.log('actualizar lista de imagenes')
            io.sockets.emit('updatelistimages');
        });

        
        socket.on('updatelistusers', () => {
            console.log('actualizar lista de usuarios');
            io.sockets.emit('updatelistusers');
        });



        socket.on('disconnect', data => {
            console.log(`Usuario ${socket.id} se ha desconectado`);
        })
    });
    
}

export default sockets;