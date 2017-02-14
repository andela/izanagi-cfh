var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');
var keys = rootPath + '/keys.txt';

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: 'mongodb://<dbuser>:<dbpassword>@ds139705.mlab.com:39705/izanagi-cfh'
};
