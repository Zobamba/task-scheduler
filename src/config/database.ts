import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgresql://onahbernardchizoba:DhEbtkn39CwO@ep-round-moon-23141132.us-east-2.aws.neon.tech/task-scheduler?sslmode=require', {
  dialect: 'postgres',
});

export default sequelize;
