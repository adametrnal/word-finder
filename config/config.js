var Config = {};

Config.mongoEnv = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    'localhost';

Config.dbInfo = {
    mongoHost: "",
    mongoPort: "",
    dbName: ""
}

if (Config.mongoEnv !== 'localhost') {
    Config.mongoHost = 'ds047057.mongolab.com';
    Config.mongoPort = 47057;
    Config.dbName = 'heroku_app14477971';
    Config.userName = 'heroku_app14477971';
    Config.password = '6d42irhc81cd0ep4jb3d3t4hef';
} else {
    Config.mongoHost = 'localHost';
    Config.mongoPort = 27017;
    Config.dbName = 'dictionary-db';
}

console.log("env: " + Config.mongoEnv + ", host:" + Config.mongoHost);

// Export the Config object for use in other modules.
exports.Config = Config;