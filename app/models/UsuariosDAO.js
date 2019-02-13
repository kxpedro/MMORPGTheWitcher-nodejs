var crypto = require('crypto');

function UsuariosDAO(connection){
    this._connection = connection();    
};

UsuariosDAO.prototype.inserirUsuario = async function(usuario){
    try {
        const db = await this._connection;        
        var senha_crypto = crypto.createHash("md5").update(usuario.senha).digest("hex");

        usuario.senha = senha_crypto;
        await db.collection('usuario').insertOne(usuario);

    } catch (error) {
        console.error('Tivemos um problema no model inserirUsuario: ', error);
    }
};

UsuariosDAO.prototype.autenticar = async function(usuario, req, res){
    try {
        const db = await this._connection;
        var senha_crypto = crypto.createHash("md5").update(usuario.senha).digest("hex");
        
        usuario.senha = senha_crypto;
        await db.collection('usuario').find(usuario).toArray(function(err, result){            
            if(result[0] != undefined){
                req.session.autorizado = true;
                req.session.usuario = result[0].usuario;
                req.session.reino = result[0].reino;
            }
            if(req.session.autorizado){
                res.redirect('jogo');
            }else{
                res.render('index', {validacao:{}});
            }
        });
    } catch (error) {
        console.error('Tivemos um problema no model autenticar: '+error);
    }
};

module.exports = function(){
    return UsuariosDAO;
};
