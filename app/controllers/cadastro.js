module.exports.cadastro = function(application, req, res){
    res.render('cadastro', {validacao: {}, dadosForm:{}});
}
module.exports.cadastrar = function(application, req, res){    
    var dadosForm = req.body;

    req.assert('nome','Nome não pode ser vazio').notEmpty();
    req.assert('usuario','Usuario não pode ser vazio').notEmpty();
    req.assert('senha','Senha não pode ser vazio').notEmpty();
    req.assert('reino','Reino não pode ser vazio').notEmpty();

    var erros = req.validationErrors();
    if(erros){
        res.render('cadastro', {validacao: erros, dadosForm: dadosForm});
        console.log(erros);
        return;
    }else{   
        var connection = application.config.dbConnection;        
        var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
        var JogoDAO = new application.app.models.JogoDAO(connection);

        UsuariosDAO.inserirUsuario(dadosForm);
        JogoDAO.gerarParametros(dadosForm.usuario);        

        res.render('index', {validacao:{}});
    }    
}