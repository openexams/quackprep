import { initTestAccount } from "@backend/models/auth";

export default async function globalSetup() {
  await initTestAccount();
}
