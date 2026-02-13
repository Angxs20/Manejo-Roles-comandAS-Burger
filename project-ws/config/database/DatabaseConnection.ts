import mysql, { Connection } from 'mysql2/promise';
import { HOST_MYSQL, USER_MYSQL, PASSWORD_MYSQL, DATABASE_MYSQL } from '../../global/Environment'

const dbConfig = {
  host: HOST_MYSQL,
  user: USER_MYSQL,
  password: PASSWORD_MYSQL,
  database: DATABASE_MYSQL
};

const connect = async (): Promise<Connection> => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

export { connect };
