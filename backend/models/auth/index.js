import sqlExe from "#db/dbFunctions.js";
import bcrypt from "bcrypt";
import {
  TEST_ACCOUNT_EMAIL,
  TEST_ACCOUNT_PASS,
  TEST_ACCOUNT_USER,
} from "../../../constants.js";

export async function initTestAccount() {
  await sqlExe.executeCommand(
    `INSERT INTO users (username,password_hash,email,provider,provider_id) VALUES(:username,:password_hash,:email,'local', 1)`,
    {
      username: TEST_ACCOUNT_USER,
      password_hash: await bcrypt.hash(TEST_ACCOUNT_PASS, 10),
      email: TEST_ACCOUNT_EMAIL,
    }
  );
}

export async function deleteTestAccount() {
  await sqlExe.executeCommand("DELETE FROM users WHERE username = :username", {
    username: TEST_ACCOUNT_USER,
  });
}

export async function setLastLoginNow(user_id) {
  if (!user_id) {
    throw new Error("Need user id idiot to dev from dev");
  }
  await sqlExe.executeCommand(
    `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = :user_id`,
    { user_id }
  );
}

export async function findUserIdByProviderId(provider, provider_id) {
  const params = { provider: provider, provider_id: provider_id };
  const result = await sqlExe.executeCommand(
    "SELECT u.provider_id, u.id FROM users u WHERE u.provider = :provider AND u.provider_id = :provider_id",
    params
  );
  if (result?.[0]?.provider_id) return result?.[0].id;
  return false;
}

export async function register(username, email, hashedPass) {
  const params = {
    username,
    email,
    hashedPass,
  };
  const result = await sqlExe.executeCommand(
    `INSERT INTO users (username,password_hash,email, provider,provider_id)
    VALUES(:username,:hashedPass,:email,"local",0);`,
    params
  );
  return result.insertId;
}

export async function OAuthRegister(
  firstName,
  lastName,
  username,
  email,
  icon,
  provider,
  provider_id
) {
  const params = {
    firstName,
    lastName,
    username,
    email,
    icon,
    provider,
    provider_id,
  };
  const result = await sqlExe.executeCommand(
    `INSERT INTO users 
          (username,email,first_name,last_name,provider,provider_id, icon)
    VALUES(:username,:email,:firstName,:lastName,:provider,:provider_id, :icon);`,
    params
  );
  return result.insertId;
}

/**
 * Finds the User by email and password and when found returns the users id. returns a -1 for email nf and -2 for password no match
 * @param {String} email
 * @param {String} password
 * @returns
 */
export async function findLocalUserByEmailPassword(email, password) {
  const exists = await sqlExe.executeCommand(
    `SELECT * FROM users u where email = :email AND provider = 'local'`, // IMPORTANT
    { email }
  );

  if (!exists?.[0] || exists?.[0].email !== email) {
    return -1;
  } else if (!(await bcrypt.compare(password, exists?.[0].password_hash))) {
    return -2;
  }
  const curUser = exists?.[0];
  return {
    // DONT RET PASSWORD
    id: curUser.id,
    username: curUser.username,
    email: curUser.email,
    first_name: curUser.first_name,
    last_name: curUser.last_name,
    icon: curUser.icon,
    is_creator: curUser.is_creator,
  };
}
/**
 *
 * @param {String} username
 * @returns {Object} user without password
 */
export async function getUserByUsername(username) {
  const curUser = (
    await sqlExe.executeCommand(
      `SELECT * FROM users u where username = :username`,
      { username }
    )
  )?.[0];
  if (!curUser?.id) return null;
  return {
    // DONT RET PASSWORD
    id: curUser.id,
    username: curUser.username,
    email: curUser.email,
    first_name: curUser.first_name,
    last_name: curUser.last_name,
    icon: curUser.icon,
    is_creator: curUser.is_creator,
  };
}

// good to send to client
export async function findUserById(id) {
  const exists = await sqlExe.executeCommand(
    `SELECT u.icon, u.id,u.username,u.email,u.first_name,u.last_name,u.is_creator FROM users u WHERE id = :id`,
    { id }
  );
  if (!exists?.[0]) {
    return -1;
  } else {
    return exists?.[0];
  }
}

// returns the api key users user_id
export async function checkApiKey(key) {
  if (!key) {
    return null;
  }
  const result = await sqlExe.executeCommand(
    `SELECT * FROM api_keys WHERE api_key = :key`,
    { key }
  );

  if (result?.[0]) {
    return result?.[0].user_id;
  }
  return null;
}
