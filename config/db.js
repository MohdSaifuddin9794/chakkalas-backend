import mongoose from 'mongoose';
export const mongoConnect = async () => {
  try {
    const DB = process.env.MONGO_CONNECT_URL_LOCAL.replace(
      '<PASSWORD>', 
      process.env.DATABASE_PASSWORD
      );
    //     mongoose.set('useCreateIndex', true);
    await mongoose.connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log('Connected to Mongo database');
  } catch (e) {
    console.log(`Error connecting to mongo database ${e}`);
  }
};