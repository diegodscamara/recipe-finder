import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db'; 
import recipeRoutes from './routes/recipeRoutes'; 
import errorHandler from './middleware/errorHandler'; 

dotenv.config();  

connectDB();

const app = express();
const PORT = process.env.PORT || 3000; 

const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200, 
};
app.use(cors(corsOptions));

app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
  res.send('Recipe Finder API is running!');
});
app.use('/api/recipes', recipeRoutes); 

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; 
