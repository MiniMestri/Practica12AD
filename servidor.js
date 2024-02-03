var servidor = require('http');
var archivos = require('fs');

servidor.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    archivos.readFile('plantillas/cabecera.html', function(err, cabeceraData) {
        if (err) {
            return finalizarConError(res, "<h1>Error interno del servidor</h1>");
        }

        res.write(cabeceraData);
        switch(req.url) {
            case "/":
                enviarArchivo('html/home.html', res);
                break;
            case "/blog":
                enviarArchivo('html/blog.html', res);
                break;
            case "/compra":
                enviarArchivo('html/tienda.html', res);
                break;
            case "/contacto":
                enviarArchivo('html/contacto.html', res);
                break;
            default:
                res.end("<h1>ERROR 404</h1>");
        }
    });

    function enviarArchivo(rutaArchivo, respuesta) {
        archivos.readFile(rutaArchivo, function(err, data) {
            respuesta.write(data);

            archivos.readFile('plantillas/cuerpo.html', function(err, cuerpoData) {
                respuesta.write(cuerpoData);

                archivos.readFile('plantillas/pie.html', function(err, pieData) {
                    respuesta.write(pieData);
                    res.end(); 
                });
            });
        });
    }

}).listen(8080);