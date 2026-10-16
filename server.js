import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta para recibir los datos del Drag & Drop
app.post('/guardar', (express), (req, res) => {
    const { usuario, codigo, tipo } = req.body;
    const nombreCarpeta = usuario && usuario.trim() !== "" ? usuario.trim() : `usuario_${Date.now()}`;
    const rutaCarpeta = path.join(process.cwd(), 'entregas_alumnos', nombreCarpeta);

    // Crear la carpeta del alumno si no existe
    if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta, { recursive: true });
    }

    // Guardar según lo que arrastren/peguen
    if (tipo === 'enlace') {
        fs.writeFileSync(path.join(rutaCarpeta, 'link.url'), `[InternetShortcut]\nURL=${codigo}`);
    } else {
        fs.writeFileSync(path.join(rutaCarpeta, 'sketch.js'), codigo);
    }

    res.json({ success: true, mensaje: `Carpeta creada para ${nombreCarpeta}` });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});