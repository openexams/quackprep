import { deleteTestAccount } from "@backend/models/auth";

export default async function globalTeardown() {
  await deleteTestAccount();
}
