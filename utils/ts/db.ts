import mongoose from "mongoose";

// mongoose.connection.on("connected", () => {
//   console.log("DB Connection Established");
// });

// mongoose.connection.on("reconnected", () => {
//   console.log("DB Connection Reestablished");
// });

// mongoose.connection.on("disconnected", () => {
//   console.log("DB Connection Disconnected");
// });

// mongoose.connection.on("error", (error) => {
//   console.log("DB Connection ERROR: " + error);
// });

export const connectToDB = async () => {
  if (!process.env.MONGODB_URI) {
    return;
  }
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB initial connected");
    return connection;
  } catch (error) {
    console.log("DB initial connection error", error);
    return;
  }
};
