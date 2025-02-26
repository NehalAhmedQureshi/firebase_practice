'use server'
import { cookies } from "next/headers";

export async function createCookie({ value }) {
  try {
    let cookieStore = await cookies();
    cookieStore.set(process.env.NEXT_PUBLIC_ACCESS_TOKEN, value);
    return {success : true};
  } catch (error) {
    return error;
  }
}
