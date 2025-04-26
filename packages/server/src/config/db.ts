import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    'Error: DATABASE_URL is not defined in the environment variables.',
  );
  process.exit(1); 
}

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); 
  }
};

export default connectDB;
