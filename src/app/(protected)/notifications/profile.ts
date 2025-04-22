"use server";

import { initDatabase } from "@/actions/database";
import { Notice } from "../../types/Notice";
/*import { createClient } from "redis";

export async function saveFriendCode(email: string, friendCode: string) {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await client.set(`friendCode-${email.toLowerCase()}`, friendCode);
  await client.disconnect();
}

export async function loadFriendCode(email: string): Promise<string | null> {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const value = await client.get(`friendCode-${email.toLowerCase()}`);

  return value;
} */

export async function loadNotif(email: string): Promise<Notice[]> {
  const { client, close } = await initDatabase();

  const res = await client.query<Notice>(
    `SELECT 
    sender_id, 
    offered_card_id, 
    requested_card_id, 
    status, 
    created_at, 
    sender.email as sender_email,
    receiver.email as receiver_email,
    sender.pseudo as sender_name,
    receiver.pseudo as receiver_name,
    offered.card_id as offered_func_id, 
    requested.card_id as requested_func_id, 
    offered.card_name as offered_name, 
    requested.card_name as requested_name 
    
    from trade_requests tr  
    join users sender on sender.id = tr.sender_id 
    join users receiver on receiver.id = tr.receiver_id 
    join cards offered on offered.id = offered_card_id 
    join cards requested on requested.id = requested_card_id 
    
    WHERE receiver_id in (select id from users where email = $1)
    OR sender_id in (select id from users where email = $1)`,
    [email]
  );

  console.log(res.rows[0].created_at, typeof res.rows[0].created_at);

  await close();

  return res.rows;
}
