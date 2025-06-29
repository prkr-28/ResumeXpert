import mongoose from 'mongoose';
export const connectDB = async () => {
  await mongoose
    .connect(
      'mongodb+srv://priyanshu402muz:OdOYSJLx9LI0T5UJ@cluster0.3xuszzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => {
      console.log('db connected');
    })
    .catch((err) => {
      console.log('error', err);
    });
};
