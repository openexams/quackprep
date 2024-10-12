import mysql from "mysql2/promise.js";
import { MYSQL_CONFIG } from "../config/config.js";

/**
 * Used to follow a standard for making and executing mysql querys
 */
export default class sqlExe {
  static pool = mysql.createPool(MYSQL_CONFIG);

  /**
   * This is a good function for executing querys, just send it the sql command you want to run and
   * the inputs (variables) you want it to have.
   *
   * @param {String} sqlCommand sql command that simple, uses params as input vars
   * @param {Object} params
   * @returns {Array<Object>} returns an array of objects from your sql query
   * @throws {Error} throws a sql error, make sure to use try & catch
   */
  static async executeCommand(sqlCommand, params) {
    try {
      const response = await sqlExe.pool.execute(sqlCommand, params);
      return response[0];
    } catch (error) {
      console.log("Failed @executeCommand\n", error);
      throw error;
    }
  }

  static async test() {
    try {
      await sqlExe.pool.query("SELECT * FROM answers_current LIMIT 1");
      console.log("Connected to quackprep");
    } catch (error) {
      console.error("Failed connection to quackprep");
      console.log(error);
    }
  }
}
