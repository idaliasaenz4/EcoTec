const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const routeConfig = require('./routes/routes.js');
const fs = require('fs');
const http = require('http');
const PORT = process.env.PORT || 3003;
const app = express();
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);



// Configuración de CORS para permitir solicitudes desde dominios específicos
const allowedOrigins = ['https://manejador.azurewebsites.net', 'http://dhoubuntu.fullstack.com.mx', 'http://localhost:3003','https://manejador.azurewebsites.net:3003'];
const corsOptions = {
    origin: allowedOrigins
};
app.use(cors(corsOptions));

// Middleware para manejar solicitudes POST y PUT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, './public')));

app.get('/public/swaggerh', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'swaggerh.html'));
});

app.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.json'));
});

// Configuración de express-session
app.use(session({
    secret: 'Lainod', // Cambiar a una cadena aleatoria y segura
    resave: false,
    saveUninitialized: true
}));

// Configurar rutas
routeConfig(app);

// Handling not found routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, './public', '404.html'));
});

//Esto es para las cookies de terceros
app.use((req, res, next) => {
    res.cookie('mycookie', 'value', { sameSite: 'None', secure: true });
    next();
  });

//Configuracion para el socket
// Variable para llevar el conteo
let contadorConexiones = 0;
// Objeto de mensaje inicial
const initialMessage = {
    id: 1,
    texto: "¡Hola a Todo Mundo! Soy un mensaje del servidor.",
    autor: "Servidor"
};
// Inicializar el arreglo de mensajes con el mensaje inicial
const messages = [initialMessage];

// Emitir un evento 'message' de vuelta al cliente cuando se conecte
io.on('connection', function (socket) {
    contadorConexiones++; // Incrementar el contador
    console.log('Alguien se ha conectado con socket');
    console.log('Número de conexiones: ' + contadorConexiones); // Imprimir el contador
    
    // Emitir el mensaje inicial al cliente cuando se conecta
    socket.emit("message", messages);

   // Manejar el evento 'new-message' enviado por el cliente
    socket.on("new-message", function(data) {
    // Modificar la estructura del mensaje para incluir el nombre de usuario
    const newMessage = {
        autor: data.autor,
        texto: data.texto
    };
    
    // Agregar el nuevo mensaje al arreglo de mensajes
    messages.push(newMessage);
    
    // Emitir el arreglo de mensajes actualizado de vuelta a todos los clientes
    io.emit('respuesta', messages);
   
});

// Manejar el evento de inicio de sesión
socket.on('login', function(credentials) {
    // Verificar las credenciales y enviar respuesta al cliente
    if (credentials.username === validUsername && credentials.password === validPassword) {
        socket.emit('login-response', { success: true, message: 'Login successful' });
    } else {
        socket.emit('login-response', { success: false, message: 'Invalid username or password' });
    }
});
});


// Iniciar el servidor HTTP
server.listen(PORT, () => {
    console.log(`Server running at https://manejador.azurewebsites.net:${PORT}/`);
});

module.exports = app; // Exportar app para uso en otros archivos
