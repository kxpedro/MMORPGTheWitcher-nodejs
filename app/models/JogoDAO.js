var ObjectID = require('mongodb').ObjectID;

function JogoDAO(connection){
    this._connection = connection();    
};

JogoDAO.prototype.gerarParametros = async function(usuario){
    try {
        const db = await this._connection;
        await db.collection('jogo').insertOne({
            usuario: usuario,
            contratos: 0,
            recursos: 15,
            populacao: 10,
            defesa: Math.floor(Math.random()*100),
            dano: Math.floor(Math.random()*100),
            ouro: 100,
            magia: Math.floor(Math.random()*10)
        });
    } catch (error) {
        console.error('Tivemos um problema no model gerarParametros: '+error);
    }
};

JogoDAO.prototype.iniciaJogo = async function(req, res, usuario, msg){
    try {
        const db = await this._connection;
        await db.collection('jogo').find({usuario: usuario}).toArray(function(err, result){      
            res.render('jogo', {reino: req.session.reino, jogo: result[0], msg: msg});        
        });
    } catch (error) {
        console.error('Tivemos um problema no model iniciaJogo: '+error);
    }
};


JogoDAO.prototype.Acao = async function(acao){
    try {
        var date = new Date();
        var tempo = null;
        var ouroA = null;
        var recursosA = null;
        var populacaoA = null;
        var defesaA = null;
        var danoA = null;
        var magiaA = null;

        const db = await this._connection;    

        switch(parseInt(acao.acao)){
            case 1: tempo = 2 * 0.1 * 60000; break;
            case 2: tempo = 2 * 0.1 * 60000; break;
            case 3: tempo = 8 * 0.1 * 60000; break;
            case 4: tempo = 6 * 0.1 * 60000; break;
            case 5: tempo = 3 * 0.1 * 60000; break;
            case 6: tempo = 3 * 0.1 * 60000; break;
            case 7: tempo = 5 * 0.1 * 60000; break;
            case 8: tempo = 2 * 0.1 * 60000; break;
            default: break;
        }
        acao.acao_termina_em = date.getTime() + (tempo*acao.quantidade);
        
        await db.collection('acao').insertOne({
            acao: acao.acao,
            quantidade: acao.quantidade,
            usuario: acao.usuario,
            acao_termina_em: acao.acao_termina_em
        });

        switch(parseInt(acao.acao)){
            case 1: 
                ouroA = +10 * acao.quantidade;
                recursosA = +0;
                populacaoA = +0;
                defesaA = +0;
                danoA = +0;
                magiaA = +0;        
                break;
            case 2:
                ouroA = -10 * acao.quantidade;
                recursosA = +0;
                populacaoA = +1 * acao.quantidade;
                defesaA = +0;
                danoA = +0;
                magiaA = +0;  
                break;
            case 3: 
                ouroA = -20 * acao.quantidade; 
                recursosA = +0;
                populacaoA = +0;
                defesaA = +10 * acao.quantidade;
                danoA = +10 * acao.quantidade;
                magiaA = +0;  
                break;
            case 4: 
                ouroA = -50 * acao.quantidade; 
                recursosA = +0;
                populacaoA = +0;
                defesaA = +2 * acao.quantidade;
                danoA = +2 * acao.quantidade;
                magiaA = +0;  
                break;
            case 5:     
                ouroA = -25 * acao.quantidade;
                recursosA = +0;
                populacaoA = +0;
                defesaA = +1 * acao.quantidade;
                danoA = +2 * acao.quantidade;
                magiaA = +0;   
                break;
            case 6: 
                ouroA = -10 * acao.quantidade; 
                recursosA = +0;
                populacaoA = +0;
                defesaA = +2 * acao.quantidade;
                danoA = +1 * acao.quantidade;
                magiaA = +0;  
                break;
            case 7: 
                ouroA = -15 * acao.quantidade; 
                recursosA = +0;
                populacaoA = -1 * acao.quantidade;
                defesaA = +0;
                danoA = +0;
                magiaA = +5 * acao.quantidade;
                break;
            case 8: 
                ouroA = -30 * acao.quantidade; 
                recursosA = +0;
                populacaoA = -1 * acao.quantidade;
                defesaA = +0;
                danoA = +0;
                magiaA = +0;
                break;
            default: break;
        }

        await db.collection('jogo').updateMany(
            {usuario: acao.usuario},
            {$inc: {ouro: ouroA, recursos: recursosA, populacao: populacaoA, defesa: defesaA, dano: danoA, magia: magiaA}},            
        );

    } catch (error) {
        console.error('Tivemos um problema no model Acao: '+error);
    }
};

JogoDAO.prototype.getAcoes = async function(usuario, res){
    try {
        const db = await this._connection;
        await db.collection('acao').find({usuario: usuario}).toArray(function(err, result){   
            var date = new Date();
            var momento_atual = date.getTime();
            res.render('objetivos', {acoes: result, acao_termina_em: {$gt:momento_atual}});
        });
    } catch (error) {
        console.error('Tivemos um problema no model getAcoes: '+error);
    }
};

JogoDAO.prototype.revogarOrdem = async function(_id, res){
    try {
        const db = await this._connection;
        await db.collection('acao').removeOne(
            {_id: ObjectID(_id)},
            function(err, result){
                res.redirect("/jogo?msg=D");
            }
        );
    } catch (error) {
        console.error('Tivemos um problema no model revogarOrdem: '+error);
    }
};

module.exports = function(){
    return JogoDAO;
};