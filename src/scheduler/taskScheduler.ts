import schedule from 'node-schedule';
import Task from '../models/task';
import { Op } from 'sequelize';
import ExecutionLog from '../models/executionLog';

// Function to execute a task
const executeTask = async (payload: string, taskId: string) => {
  console.log('Executing task:', payload);

  await ExecutionLog.create({ taskId, executedAt: new Date() });

  // Remove tasks after execution
  await Task.destroy({ where: { id: taskId } });
};

// Cron job to check for due tasks every second
schedule.scheduleJob('* * * * * *', async () => {
  const now = new Date();
  const tenSecondsFromNow = new Date(now.getTime() + 10000);

  const formattedDate = tenSecondsFromNow.toISOString();

  // Find one-time and recurring tasks that are due within the next 10 seconds
  const dueTasks = await Task.findAll({
    where: {
      [Op.or]: [
        {
          type: 'one-time',
          executionTime: {
            [Op.lte]: formattedDate,
            [Op.gt]: now,
          },
        },
        {
          type: 'recurring',
          executionTime: {
            [Op.lte]: formattedDate,
            [Op.gt]: now,
          },
        },
      ],
    },
  });

  console.log('Due tasks:', dueTasks);

  // Execute due tasks
  for (const task of dueTasks) {
    await executeTask(task.getDataValue('payload'), task.id.toString());
  }
});
