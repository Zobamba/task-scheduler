import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Task extends Model {
  id: any;
}

Task.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    executionTime: {
      type: DataTypes.DATE,
    },
    cronExpression: {
      type: DataTypes.STRING,
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Task',
  }
);

export default Task;
