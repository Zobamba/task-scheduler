import { Request, Response } from 'express';
import ExecutionLog from '../models/executionLog';

export const getExecutionLogs = async (req: Request, res: Response) => {
  const logs = await ExecutionLog.findAll();
  res.json(logs);
};
