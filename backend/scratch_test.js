import mongoose from 'mongoose';
import { config } from 'dotenv';
config({path: './.env'});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exam-proctoring')
  .then(async () => {
    const db = mongoose.connection.db;
    const exams = await db.collection('exams').find({ title: /math/i }).toArray();
    console.log(JSON.stringify(exams, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
