import { TRIAL_CREDITS } from "./plans.ts";
import type { Profile } from "./types.ts";

export type ProfileRow = {
  user_id: string;
  plan: string;
  credits: number;
  created_at: string;
};

export function profileFromRow(row: ProfileRow, fallbackUserId: string): Profile {
  return {
    userId: row.user_id || fallbackUserId,
    plan: row.plan,
    credits: Number(row.credits),
    createdAt: row.created_at,
  };
}

export async function loadOrCreateProfile(userId: string): Promise<Profile> {
  const { getSql } = await import("../db");
  const sql = await getSql();
  const existing = await sql<ProfileRow>`
    select user_id, plan, credits, created_at from profiles where user_id = ${userId} limit 1`;
  if (existing[0]) return profileFromRow(existing[0], userId);

  await sql`insert into profiles (user_id, plan, credits) values (${userId}, ${"trial"}, ${TRIAL_CREDITS})`;
  const created = await sql<ProfileRow>`
    select user_id, plan, credits, created_at from profiles where user_id = ${userId} limit 1`;
  const row = created[0];
  if (row) return profileFromRow(row, userId);
  return {
    userId,
    plan: "trial",
    credits: TRIAL_CREDITS,
    createdAt: new Date().toISOString(),
  };
}
