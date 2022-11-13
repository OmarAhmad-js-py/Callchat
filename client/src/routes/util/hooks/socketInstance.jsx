import io from 'socket.io-client';

const socket = io.connect("localhost:8000", { reconnect: true });

export default socket
