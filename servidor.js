var servidor = require('http');
var archivos = require('fs');
var mysql = require('mysql')

var conexion = mysql.createConnection({
                host:"localhost",
                user:"node",
                password:"1234",
                database:"nodejs"
            });

conexion.connect(function(err){
                if(err) throw err;
                console.log("conectado")
 })


function insertarHora(){
fecha = new Date()
    conexion.query(`
        INSERT INTO registro VALUES(
            NULL,
            `+fecha.getFullYear()+`,
            `+(fecha.getMonth()+1)+`,
            `+fecha.getDate()+`,
            `+fecha.getHours()+`,
            `+fecha.getMinutes()+`,
            `+fecha.getSeconds()+`
        )
    `,function(err,result){
        if(err) throw err;
        console.log("Se ha insertado el registro")
        });
}

insertarHora();

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
                conexion.query(`
                SELECT * FROM registro
            `,function(err,result,fields){
                if(err) throw err;
                for(let i = 0;i<result.length;i++){  
                    res.write(`
                        <article>
                            <h2>ID: </h2>
                            <h2>`+result[i].id+`</h2>
                            <h2>HORA: </h2><p>`+result[i].hora+`</p>
                            <h2>MINUTO: </h2><p>`+result[i].minuto+`<p>
                            <h2>SEGUNDO: </h2><p>`+result[i].segundo+`<p>
                            <h2>AÑO: </h2><p>`+result[i].fecha+`<p>
                            <h2>MES: </h2><p>`+result[i].mes+`<p>
                            <h2>DIA: </h2><p>`+result[i].dia+`<p>
                        </article>
                    `)
               } 
            })
                
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
