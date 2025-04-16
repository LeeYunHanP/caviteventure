// src/lib/sessionDb.ts
import dbConnect from "./dbConnect";
import Session from "@/models/Session";

export async function createSessionInDB(userId: string, token: string) {
  await dbConnect();
  await Session.create({ userId, token });
}

export async function findSessionInDB(token: string) {
  await dbConnect();
  return Session.findOne({ token });
}

export async function deleteSessionInDB(token: string) {
  await dbConnect();
  return Session.deleteOne({ token });
}
