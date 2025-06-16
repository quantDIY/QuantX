document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

const socket = new WebSocket('wss://your-backend-server.com/socket');

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  document.getElementById('content').innerText = JSON.stringify(data, null, 2);
});
