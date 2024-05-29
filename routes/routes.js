// Importa bcryptjs y express-session
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../data/config');
const jwt = require('jsonwebtoken');
const secretKey = 'Lainod'; // Clave secreta para firmar los tokens
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { generarToken, verificarToken } = require('./auth'); // Importar funciones de autenticación

const app = (app) => {
    // Ruta de la aplicación
    // Mostrar mensaje de bienvenida en la ruta raíz
    app.get('/api/', (request, response) => {
        response.json({ message: '¡Bienvenido a Node.js Express REST API!' });
    });
// Ruta para generar el token
app.post('/api/token', (req, res) => {
    try {
      // Suponiendo que req.body contiene los datos del usuario autenticado,
      // y que req.body.id es el ID único del usuario
      const payload = { userId: req.body.id };
      const token = generarToken(payload);
      res.json({ token }); // Devuelve el token como objeto JSON
    } catch (error) {
      console.error('Error al generar el token:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

    // Agrega protección con token JWT a la ruta para mostrar un solo usuario por ID
    app.get('/api/users/:id', (request, response) => {
        const id = request.params.id;

        // Verifica el token antes de ejecutar la consulta en la base de datos
        const token = request.headers.authorization;
        const decodedToken = verificarToken(token);

        if (!decodedToken) {
            return response.status(401).json({ error: 'Token inválido' });
        }

        pool.query('SELECT * FROM users WHERE id = ?', id, (error, results) => {
            if (error) {
                console.error('Error al obtener usuarios:', error);
                return response.status(500).json({ error: 'Error interno del servidor' });
            }
            response.json(results);
        });
    });

    // Mostrar todos los Usuarios Token
    app.get('/api/users', (request, response) => {
        const token = request.headers['authorization']; // Obtener el token del encabezado de autorización
        if (!token) {
            return response.status(401).json({ error: 'Token no proporcionado' }); // Si no hay token, devolver un error de no autorizado
        }

        const decodedToken = verificarToken(token); // Verificar el token
        if (!decodedToken) {
            return response.status(401).json({ error: 'Token inválido' }); // Si el token no es válido, devolver un error de no autorizado
        }

        // Si el token es válido, proceder con la consulta a la base de datos para mostrar todos los usuarios
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                console.error('Error al obtener usuarios:', error);
                return response.status(500).json({ error: 'Error interno del servidor' });
            }
            response.status(200).json(results); // Enviar los resultados de la consulta como respuesta en formato JSON con el código de estado 200
        });
    });

    // Agregar un nuevo usuario Token
    app.post('/api/users', (request, response) => {
        const token = request.headers['authorization']; // Obtener el token del encabezado de autorización
        if (!token) {
            return response.status(401).json({ error: 'Token no proporcionado' }); // Si no hay token, devolver un error de no autorizado
        }

        const decodedToken = verificarToken(token); // Verificar el token
        if (!decodedToken) {
            return response.status(401).json({ error: 'Token inválido' }); // Si el token no es válido, devolver un error de no autorizado
        }

        const userData = request.body;
        const plaintextPassword = userData.contrasea; // Obtén la contraseña sin hashear desde la solicitud

        // Hashea la contraseña antes de almacenarla en la base de datos
        bcrypt.hash(plaintextPassword, 10, (err, hash) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return response.status(500).json({ error: 'Error interno del servidor' });
            }

            // Almacena el usuario en la base de datos con la contraseña hasheada
            pool.query('INSERT INTO users (nombre, contrasea) VALUES (?, ?)', [userData.nombre, hash], (error, result) => {
                if (error) {
                    console.error('Error al agregar un nuevo usuario:', error);
                    return response.status(500).json({ error: 'Error interno del servidor' });
                }
                console.log('Usuario agregado con éxito');
                response.status(201).send(`Usuario agregado con ID: ${result.insertId}`);
            });
        });
    });

    // Actualizar un usuario Token
    app.put('/api/users/:id', (request, response) => {
        const token = request.headers['authorization']; // Obtener el token del encabezado de autorización
        if (!token) {
            return response.status(401).json({ error: 'Token no proporcionado' }); // Si no hay token, devolver un error de no autorizado
        }

        const decodedToken = verificarToken(token); // Verificar el token
        if (!decodedToken) {
            return response.status(401).json({ error: 'Token inválido' }); // Si el token no es válido, devolver un error de no autorizado
        }

        const id = request.params.id;
        const userData = request.body;
        const plaintextPassword = userData.contrasea; // Obtén la nueva contraseña sin hashear desde la solicitud

        // Hashea la nueva contraseña antes de actualizarla en la base de datos
        bcrypt.hash(plaintextPassword, 10, (err, hash) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return response.status(500).json({ error: 'Error interno del servidor' });
            }

            // Actualiza el usuario en la base de datos con la contraseña hasheada
            pool.query('UPDATE users SET nombre = ?, contrasea = ? WHERE id = ?', [userData.nombre, hash, id], (error, result) => {
                if (error) {
                    console.error('Error al actualizar el usuario:', error);
                    return response.status(500).json({ error: 'Error interno del servidor' });
                }
                console.log('Usuario actualizado con éxito');
                response.send("Usuario actualizado correctamente");
            });
        });
    });

    // Borrar un Usuario Token
    app.delete('/api/users/:id', (request, response) => {
        const token = request.headers['authorization']; // Obtener el token del encabezado de autorización
        if (!token) {
            return response.status(401).json({ error: 'Token no proporcionado' }); // Si no hay token, devolver un error de no autorizado
        }

        const decodedToken = verificarToken(token); // Verificar el token
        if (!decodedToken) {
            return response.status(401).json({ error: 'Token inválido' }); // Si el token no es válido, devolver un error de no autorizado
        }

        const id = request.params.id;

        pool.query('DELETE FROM users WHERE id = ?', [id], (error, result) => {
            if (error) {
                console.error('Error al eliminar el usuario:', error);
                return response.status(500).json({ error: 'Error interno del servidor' });
            }
            console.log('Usuario eliminado con éxito');
            response.send("Usuario eliminado correctamente");
        });
    });

    // Ruta para iniciar sesión y generar un token JWT
    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;

        pool.query('SELECT * FROM users WHERE nombre = ?', [username], (err, results) => {
            if (err) {
                console.error('Error al buscar usuario en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            if (results.length === 0) {
                return res.status(401).send('Credenciales inválidas');
            }

            const user = results[0];

            bcrypt.compare(password, user.contrasea, (err, result) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    return res.status(500).send('Error interno del servidor');
                }

                if (result) {
                    // Generar token JWT al iniciar sesión exitosamente
                    const payload = { username: username };
                    const token = jwt.sign(payload, secretKey, { expiresIn: '3h' }); // Genera el token con un tiempo de expiración de 3 horas
                    res.send({ token: token });
                } else {
                    res.status(401).send('Credenciales inválidas');
                }
            });
        });
    });

    // Resetear contraseña
    app.post('/api/login/reset-password/:id', (request, response) => {
        const id = request.params.id;
        const newPassword = request.body.newPassword;

        // Hashea la nueva contraseña antes de almacenarla en la base de datos
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return response.status(500).send('Error interno del servidor');
            }

            // Actualiza la contraseña del usuario en la base de datos con la contraseña hasheada
            pool.query('UPDATE users SET contrasea = ? WHERE id = ?', [hash, id], (error, result) => {
                if (error) {
                    console.error('Error al actualizar la contraseña del usuario:', error);
                    return response.status(500).send('Error interno del servidor');
                }
                console.log('Contraseña del usuario actualizada con éxito');
                response.send("Contraseña del usuario actualizada correctamente");
            });
        });
    });

    // Definir la ruta para confirmar la contraseña antes de editar un usuario
    app.post('/api/users/confirm-password/:id', (req, res) => {
        const token = req.headers['authorization']; // Obtener el token del encabezado de autorización
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' }); // Si no hay token, devolver un error de no autorizado
        }

        const decodedToken = verificarToken(token); // Verificar el token
        if (!decodedToken) {
            return res.status(401).json({ error: 'Token inválido' }); // Si el token no es válido, devolver un error de no autorizado
        }

        const userId = req.params.id;
        const enteredPassword = req.body.password;

        // Verificar la contraseña ingresada con la contraseña almacenada en la base de datos
        pool.query('SELECT contrasea FROM users WHERE id = ?', userId, (err, results) => {
            if (err) {
                console.error('Error al buscar contraseña en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            if (results.length === 0) {
                return res.status(404).send('Usuario no encontrado');
            }

            const storedPasswordHash = results[0].contrasea;

            // Compara la contraseña ingresada con la contraseña almacenada
            bcrypt.compare(enteredPassword, storedPasswordHash, (err, result) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    return res.status(500).send('Error interno del servidor');
                }

                if (result) {
                    // Si la contraseña es correcta, enviar una respuesta exitosa
                    return res.status(200).send('Contraseña correcta');
                } else {
                    // Si la contraseña es incorrecta, enviar un mensaje de error
                    return res.status(401).send('Contraseña incorrecta');
                }
            });
        });
    });

    //---------------------------------------------------------------------------------------------------
    
    // Ruta para obtener todos los reportes
    app.get('/api/reportes', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = verificarToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    pool.query('SELECT * FROM Reportes', (error, results) => {
        if (error) {
            console.error('Error al obtener reportes:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(200).json(results);
    });
});

    // Ruta para obtener un solo reporte por ID
    app.get('/api/reportes/:id', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = verificarToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const id = req.params.id;
    pool.query('SELECT * FROM Reportes WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el reporte:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

    // Ruta para crear un nuevo reporte
    app.post('/api/reportes', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = verificarToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const { titulo, descripcion, numero_control, correo, tipo_reporte } = req.body;
    const nuevoReporte = { titulo, descripcion, numero_control, correo, tipo_reporte };

    pool.query('INSERT INTO Reportes SET ?', nuevoReporte, (error, result) => {
        if (error) {
            console.error('Error al crear el reporte:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(201).json({ message: 'Reporte creado con éxito', id: result.insertId });
    });
});

    // Ruta para actualizar un reporte por ID
    app.put('/api/reportes/:id', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = verificarToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const id = req.params.id;
    const { titulo, descripcion, numero_control, correo, tipo_reporte } = req.body;
    const reporteActualizado = { titulo, descripcion, numero_control, correo, tipo_reporte };

    pool.query('UPDATE Reportes SET ? WHERE id = ?', [reporteActualizado, id], (error, result) => {
        if (error) {
            console.error('Error al actualizar el reporte:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(200).json({ message: 'Reporte actualizado con éxito' });
    });
});

    // Ruta para eliminar un reporte por ID
    app.delete('/api/reportes/:id', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = verificarToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const id = req.params.id;

    pool.query('DELETE FROM Reportes WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.error('Error al eliminar el reporte:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(200).json({ message: 'Reporte eliminado con éxito' });
    });
});

    // Ruta para Subir evidencia
    app.post('/api/reportes/:id/evidencia', upload.single('evidencia_imagen'), (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = verificarToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const id = req.params.id;
    const evidenciaImagen = req.file ? req.file.buffer : null;

    if (!evidenciaImagen) {
        return res.status(400).json({ error: 'No se ha proporcionado una imagen' });
    }

    pool.query('UPDATE Reportes SET evidencia_imagen = ? WHERE id = ?', [evidenciaImagen, id], (error, result) => {
        if (error) {
            console.error('Error al subir la evidencia:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(200).json({ message: 'Evidencia subida con éxito' });
    });
});

};

// Exportar el app
module.exports = app;
