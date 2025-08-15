import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
   await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
         console.log('db connected');
      })
      .catch((err) => {
         console.log('error', err);
      });
};
