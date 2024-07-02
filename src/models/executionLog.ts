import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ExecutionLog extends Model {}

ExecutionLog.init(
  {
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    executedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ExecutionLog',
  }
);

export default ExecutionLog;
