import { Request, Response } from 'express';
import Task from '../models/task';
import schedule, { Job } from 'node-schedule';
import ExecutionLog from '../models/executionLog';

interface ScheduledJob {
  [key: string]: Job;
}

const scheduledJobs: ScheduledJob = {};

const scheduleTask = (task: any) => {
  const { type, executionTime, cronExpression, payload, id } = task;

  if (type === 'one-time') {
    const job = schedule.scheduleJob(new Date(executionTime), async () => {
      await executeTask(payload, id);
      delete scheduledJobs[id]; // Remove job after execution
    });
    scheduledJobs[id] = job;
  } else if (type === 'recurring') {
    const job = schedule.scheduleJob(cronExpression, async () => {
      await executeTask(payload, id);
    });
    scheduledJobs[id] = job;
  }
};

const executeTask = async (payload: string, taskId: string) => {
  console.log('Executing task:', payload);

  await ExecutionLog.create({ taskId, executedAt: new Date() });
};

export const createTask = async (req: Request, res: Response) => {
  const { type, executionTime, cronExpression, payload } = req.body;
  
  const task = await Task.create({ type, executionTime, cronExpression, payload });

  scheduleTask(task);

  res.send('Task scheduled successfully');
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, executionTime, cronExpression, payload } = req.body;

  await Task.update({ type, executionTime, cronExpression, payload }, { where: { id } });

  if (scheduledJobs[id]) {
    scheduledJobs[id].cancel();
  }
  const updatedTask = await Task.findByPk(id);
  if (updatedTask) {
    scheduleTask(updatedTask);
  }

  res.send('Task updated successfully');
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (scheduledJobs[id]) {
    scheduledJobs[id].cancel();
    delete scheduledJobs[id];
  }

  await Task.destroy({ where: { id } });

  res.send('Task deleted successfully');
};
