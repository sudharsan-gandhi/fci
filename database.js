const   NodeCouchDb 	= 	require('node-couchdb');
        
module.exports.db = new NodeCouchDb();
module.exports.dbName = 'fci';