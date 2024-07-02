import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';
import taskRoutes from './routes/taskRoutes';
// import './scheduler/taskScheduler';  // Import the scheduler to start the cron job

const app = express();
app.use(bodyParser.json());
app.use('/api', taskRoutes);

const startServer = async () => {
  await sequelize.sync();
  app.listen(6000, () => {
    console.log('Server is running on port 6000');
  });
};

startServer();
