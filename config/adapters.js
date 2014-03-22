/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

var url = require('url');

if(process.env.MONGOHQ_URL){
  var params = url.parse(process.env.MONGOHQ_URL);
  
  var mongo = {
    host: params.host,
    port: params.port,
    user: params.auth.split(':')[0],
    password: params.auth.split(':')[1],
    database: params.path.slice(1)
  };
}

else {
	var mongo = {};
}

console.log(mongo);

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'mongohq',
  
  // Persistent adapter for DEVELOPMENT ONLY
  // (data is preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },
  
  // MySQL is the world's most popular relational database.
  // Learn more: http://en.wikipedia.org/wiki/MySQL
  'mysql-local': {
    module: 'sails-mysql',
    // Psst.. You can put your password in config/local.js instead
    // so you don't inadvertently push it up if you're using version control
  },
  
  'mongo-local': {
    module: 'sails-mongo',
    database: 'hm'
  },
  
  'mongohq': {
    module: 'sails-mongo',
    host: mongo.host,
    port: mongo.port,
    user: mongo.user,
    password: mongo.password,
    database: mongo.database,
  }
};