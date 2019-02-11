module.exports.jogo = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', {validacao: {}});
        return;
    }else{
        var msg = '';
        if(req.query.msg != ''){
            msg = req.query.msg;
        }

        var connection = application.config.dbConnection;        
        var JogoDAO = new application.app.models.JogoDAO(connection);
    
        JogoDAO.iniciaJogo(req, res, req.session.usuario, msg);                    
    }
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        res.render('index', {validacao: {}});
    });
}

module.exports.populacao = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', {validacao: {}});
        return;
    }

    res.render('populacao');
}

module.exports.objetivos = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', {validacao: {}});
        return;
    }

    var connection = application.config.dbConnection;        
    var JogoDAO = new application.app.models.JogoDAO(connection);
    var usuario = req.session.usuario;
        
    JogoDAO.getAcoes(usuario, res);
}

module.exports.ordens = function(application, req, res){  
    var dadosForm = req.body;    

    req.assert('acao', 'Selecione uma ordem').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();
    if(erros){
        res.redirect('jogo?msg=A');
        return
    }
    
    var connection = application.config.dbConnection;        
    var JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.Acao(dadosForm);
    
    res.redirect('jogo?msg=B');
}

module.exports.revogar_ordem = function(application, req, res){  
    var url_query = req.query;

    var connection = application.config.dbConnection;        
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.revogarOrdem(url_query.id_acao, res);

}