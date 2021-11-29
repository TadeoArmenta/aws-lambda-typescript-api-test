//import util from 'util';
import mongoose, {ClientSession, Mongoose} from 'mongoose';
import {LambdaLog} from 'lambda-log';

let cachedDB: Mongoose | null = null;
const logger = new LambdaLog();
const LOGGER_PREFIX = 'MongoDB Connector v1';
// const uriString =
//     process.env.NODE_ENV === 'production'
//         ? util.format('mongodb+srv://%s:%s@%s', process.env.MONGO_USER, process.env.MONGO_PASS, process.env.MONGO_IP)
//         : 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const uriString = 'mongodb+srv://apiRoot:BpTNKCgFmhYcSfnm@cluster0.hkbeh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
export default class NewMongoConnector {
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
