import { connect } from "mongoose";
import { config } from "dotenv";
config();
const connectDb = async () => {
  try {
    const db = process.env.DATABASE.replace(
      "PASSWORD",
      process.env.DATABASE_PASSWORD
    );
    connect(db);
    console.log("db connecting ...");
  } catch (error) {
    console.log("error to connect db ");
  }
};
export default connectDb;
