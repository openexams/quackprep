import sqlExe from "#db/dbFunctions.js";
import bcrypt from "bcrypt";

export async function checkIfProviderIdExistsInUsers(provider, provider_id) {
  const params = { provider: provider, provider_id: provider_id };
  const result = await sqlExe.executeCommand(
    "SELECT u.provider_id, u.id FROM users u WHERE u.provider = :provider AND u.provider_id = :provider_id",
    params
  );
  if (result?.[0]?.provider_id) return result?.[0].id;
  return false;
}

export async function getUserCount() {
  return await sqlExe.executeCommand("SELECT COUNT(*) AS COUNT FROM users");
}

export async function register(
  firstName,
  lastName,
  username,
  email,
  hashedPass
) {
  const params = {
    firstName,
    lastName,
    username,
    email,
    hashedPass,
  };
  const result = await sqlExe.executeCommand(
    `INSERT INTO users (username,password_hash,email,first_name,last_name, provider,provider_id)
    VALUES(:username,:hashedPass,:email,:firstName,:lastName,"local",0);`,
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
    id: curUser.id,
    username: curUser.username,
    email: curUser.email,
    first_name: curUser.first_name,
    last_name: curUser.last_name,
    icon: curUser.icon,
    is_creator: curUser.is_creator,
  };
}

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
