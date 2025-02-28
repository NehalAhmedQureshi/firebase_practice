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
export async function getCookie() {
  try {
    let cookieStore = await cookies();
    let result = cookieStore.get(process.env.NEXT_PUBLIC_ACCESS_TOKEN);
    return result;
  } catch (error) {
    return error;
  }
}
