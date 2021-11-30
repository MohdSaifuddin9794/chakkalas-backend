export const SocketConnection = (io) => {
    io.notification = [];
    io.users = [];
    io.on('connection', async (socket) => {
      socket.on('join', (roomid) => {
        socket.join(roomid);
      });
      socket.on('disconnect', async () => {
        try {
          console.log('disconnected', socket.id);
        } catch (e) {
          return 0;
        }
      });
      socket.on('error', function (err) {
        console.log(err);
      });
    });
  };