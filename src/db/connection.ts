import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log(`MongoDB was connected`);
    });
    connection.on("error", (err) => {
      console.log(`Something Error Was Coming While connect to DB ` + err);
      process.exit()
    });
  } catch (error) {
    console.log(`Something Error While Connect to Database ${error}`);
  }
};

export { ConnectDB };
