import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors(config.corsOptions));

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
