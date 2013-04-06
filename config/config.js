var Config = {};

Config.mongoEnv = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    'localhost';

Config.dbInfo = {
    mongoHost: "",
    mongoPort: "",
    dbName: ""
}

if (Config.mongoEnv !== 'localhost') {
    Config.mongoHost = 'ABC';
    Config.mongoPort = 123;
    Config.dbName = 'ABC';
    Config.userName = 'ABC';
    Config.password = 'ABC';
} else {
    Config.mongoHost = 'localHost';
    Config.mongoPort = 27017;
    Config.dbName = 'dictionary-db';
}

console.log("env: " + Config.mongoEnv + ", host:" + Config.mongoHost);

// Export the Config object for use in other modules.
exports.Config = Config;