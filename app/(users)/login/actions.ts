"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/serveur";

export async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const supabase = await createClient();
    const {error} = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        redirect("/login?error=1");
    }

    revalidatePath("/", "layout");
    redirect("/");
}
