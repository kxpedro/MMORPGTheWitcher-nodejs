module.exports = function(application){
	application.get('/jogo', function(req, res){
		application.app.controllers.jogo.jogo(application, req, res);
	});

	application.get('/sair', function(req, res){
		application.app.controllers.jogo.sair(application, req, res);
	});

	application.get('/populacao', function(req, res){
		application.app.controllers.jogo.populacao(application, req, res);
	});

	application.get('/objetivos', function(req, res){
		application.app.controllers.jogo.objetivos(application, req, res);
	});

	application.post('/ordens', function(req, res){
		application.app.controllers.jogo.ordens(application, req, res);
	});	

	application.get('/ordens', function(req, res){
		res.render('index', {validacao: {}});
	});

	application.get('/revogar_ordem', function(req, res){
		application.app.controllers.jogo.revogar_ordem(application, req, res);
	});
}