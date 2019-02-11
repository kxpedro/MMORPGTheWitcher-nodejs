function UsuariosDAO(connection){
    this._connection = connection();    
};

UsuariosDAO.prototype.inserirUsuario = async function(usuario){
    try {
        const db = await this._connection;
        await db.collection('usuario').insertOne(usuario);
    } catch (error) {
        console.error('Tivemos um problema no model inserirUsuario');
    }
};

UsuariosDAO.prototype.autenticar = async function(usuario, req, res){
    try {
        const db = await this._connection;
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