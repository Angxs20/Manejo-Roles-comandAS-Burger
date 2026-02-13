import { connect } from './DatabaseConnection';
import { RowDataPacket } from 'mysql2/promise';

class DatabaseMethods {
  static async query_one(sql: { query: string; params: any[] }) {
    let connection;
    try {
      connection = await connect();
      const [rows] = await connection.execute<RowDataPacket[]>(sql.query, sql.params);
      const result = rows[0] || null;
      return { error: false, msg: result };
    } catch (error) {
      return { error: true, msg: 'error_query_one' };
    } finally {
      if (connection) connection.end();
    }
  }

  static async query(sql: { query: string; params: any[] }) {
    let connection;
    try {
      connection = await connect();
      const [rows] = await connection.execute<RowDataPacket[]>(sql.query, sql.params);
      return { error: false, msg: rows };
    } catch (error) {
      return { error: true, msg: 'error_query' };
    } finally {
      if (connection) connection.end();
    }
  }

  static async query_with_named_params(sql: { query: string; params: any }) {
    let connection;
    try {
      connection = await connect();
      const [rows] = await connection.execute<RowDataPacket[]>(sql.query, sql.params);
      return { error: false, msg: rows };
    } catch (error) {
      return { error: true, msg: 'error_query' };
    } finally {
      if (connection) connection.end();
    }
  }

  static async save(sql: { query: string; params: any[] }) {
    let connection;
    try {
      connection = await connect();
      await connection.execute(sql.query, sql.params);
      return { error: false, msg: 'query_executed' };
    } catch (error) {
      return { error: true, msg: 'error_save' };
    } finally {
      if (connection) connection.end();
    }
  }

  static async save_transaction(queries: { query: string; params: any[] }[]) {
    let connection;
    try {
      connection = await connect();
      await connection.beginTransaction();
      for (let sql of queries) {
        await connection.execute(sql.query, sql.params);
      }
      await connection.commit();
      return { error: false, msg: 'queries_executed' };
    } catch (error) {
      if (connection) await connection.rollback();
      return { error: true, msg: 'error_save' };
    } finally {
      if (connection) connection.end();
    }
  }
}

export { DatabaseMethods };
