const mongo = require('mongodb').MongoClient;
 
const url = 'mongodb://localhost:27017/mmorpg_witcher';
const dbName = 'mmorpg_witcher';
 
const connMongo = async function() {
    const client = new mongo(url, { useNewUrlParser: true });
 
    try {
        await client.connect(); 
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Tivemos um erro', error);
    }
};
 
module.exports = function(){
    return connMongo;
}