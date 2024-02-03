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

fecha = new Date()
conexion.connect(function(err){
    if(err) throw err;
    console.log("conectado")
    conexion.query(`
        INSERT INTO registro VALUES(
            NULL,
            `+fecha.getFullYear()+`,
            `+(fecha.getMonth+1)`,
            `+fecha.getDate()+`,
            `+fecha.getHours()+`,
            `+fecha.getMinutes()+`,
            `+fecha.getSeconds()+`
        )
    `,function(err,result){
        if(err) throw err;
        console.log("Se ha insertado el registro")
        });
    })
})

