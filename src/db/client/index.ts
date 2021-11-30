import util from 'util';
import mongoose, {ClientSession, Mongoose} from 'mongoose';
import {LambdaLog} from 'lambda-log';

let cachedDB: Mongoose | null = null;
const logger = new LambdaLog();
const LOGGER_PREFIX = 'MongoDB Connector v1';
const uriString = util.format('mongodb+srv://%s:%s@%s%s%s', process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB, '?retryWrites=true&w=majority')
export default class MongooseConnector {
  public static async connectToDatabase(): Promise<void> {
    logger.info(`${LOGGER_PREFIX} - Connect function invoked`);

    if (cachedDB) {
      const hasAConnection = mongoose.connections.find((connection) => connection.readyState === 1);
      if (hasAConnection) {
        logger.info(`${LOGGER_PREFIX} - Reusing connection`);
        return;
      }
    }

    try {
      cachedDB = await mongoose.connect(uriString);
      logger.info(`${LOGGER_PREFIX} - New connection`);
    } catch (err) {
      logger.error(err);
      cachedDB = null;
    }
  }

  public static async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public static async startSession(): Promise<ClientSession> {
    return await mongoose.startSession();
  }
}

mongoose.connection.on('opening', () => {
  logger.info(`${LOGGER_PREFIX} - Reconnecting... => ${mongoose.connection.readyState}`);
});

mongoose.connection.on('disconnected', () => {
  logger.error(`${LOGGER_PREFIX} - Could not connect to database`);
});

mongoose.connection.once('open', () => {
  logger.info(`${LOGGER_PREFIX} - Connected to MongoDB`);
});

mongoose.connection.on('reconnected', () => {
  logger.info(`${LOGGER_PREFIX} - MongoDB reconnected!`);
});
