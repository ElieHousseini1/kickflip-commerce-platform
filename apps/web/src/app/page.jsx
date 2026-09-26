import { redirect } from "next/navigation";
import { getSession } from "@/services/server-api";

export default async function Home() {
  redirect((await getSession()) ? "/products" : "/login");
}
