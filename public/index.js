const socket= io();

socket.on('myMessage', (data)=>{
    alert("escuchando");
})