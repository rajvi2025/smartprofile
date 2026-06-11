import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const cleanPassword = password.replace(/[^\x00-\x7F]/g, "");
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { id: data.id, email: data.email } });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
