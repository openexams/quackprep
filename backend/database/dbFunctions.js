import mysql from "mysql2/promise.js";
import { MYSQL_CONFIG } from "../config/config.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import "#utils/utils.js";

/**
 * Used to follow a standard for making and executing mysql querys
 */
export default class sqlExe {
  static pool = mysql.createPool(MYSQL_CONFIG);

  /**
   * This is a good function for executing querys, just send it the sql command you want to run and
   * the inputs (variables) you want it to have.
   * send params they must
   *
   * @param {String} sqlCommand sql command that simple, uses params as input vars
   * @param {Object} params
   * @param {Object} options extra options
   * @param {String} options.verifyUserOwnsRowId (table name to check) will make sure the user owns the row id they are trying to edit, if not it wont run.
   * @param {Boolean} options.verifyText will make sure the text is clean does not have bad words. Will reject if sqlQuery is not clean.
   * @returns {Object[] | Object} returns an array of objects from your sql query
   * @throws {Error} throws a sql error, make sure to use try & catch
   */
  static async executeCommand(sqlCommand, params = null, options = null) {
    dlog("params sent:", params);
    dlog("sql command:", sqlCommand.slice(0, 10));
    try {
      // this should only run if editing, not if creating

      if (
        options?.verifyUserOwnsRowId &&
        params?.id &&
        !(await verifyUserOwnsRowId(
          params.id,
          params?.user_id,
          options.verifyUserOwnsRowId
        ))
      ) {
        throw new Error("user does not own row they are trying to edit");
        return;
      }

      const response = await sqlExe.pool.execute(sqlCommand, params);
      return response[0];
    } catch (error) {
      console.log("Failed @executeCommand\n", error);
      throw error;
    }
  }

  /**
   * Query instead of execute, allows for paramater sub on client side
   *
   * @param {String} sqlCommand sql command that simple, uses params as input vars
   * @param {Object} params
   * @returns {Array<Object>} returns an array of objects from your sql query
   * @throws {Error} throws a sql error, make sure to use try & catch
   */
  static async queryCommand(sqlCommand, params = null) {
    try {
      const response = await sqlExe.pool.query(sqlCommand, params);
      return response?.[0];
    } catch (error) {
      console.log("Failed @queryCommand\n", error);
      throw error;
    }
  }

  static async testConnection() {
    try {
      await sqlExe.pool.query("SELECT 1");
      console.log("Connected to quackprep");
    } catch (error) {
      console.error("Failed connection to quackprep");
      console.log(error);
    }
  }
}
