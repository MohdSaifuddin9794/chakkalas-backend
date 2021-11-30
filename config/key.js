const require = createRequire(import.meta.url);
const GlobalConfig = require('./config.json');
dotenv.config();
const {
  Webserver: { clientPath, serverPath },
} = GlobalConfig[process.env.NODE_ENV];

export const configUrl = {clientPath, serverPath}