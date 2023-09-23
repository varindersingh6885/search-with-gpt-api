import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Atlas connected!");
  } catch (error) {
    console.log("Atlas Failed to connect!");
  }
};

export { dbConnect };
