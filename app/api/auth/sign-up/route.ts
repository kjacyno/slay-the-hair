import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/client";

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.e164(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in all fields with valid values." },
      { status: 400 }
    );
  }

  const { email, password, firstName, lastName, phone } = parsed.data;
  const supabase =  createClient();
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/protected`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json(
      { error: "Could not create the authentication account." },
      { status: 500 }
    );
  }

  try {
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        firstName,
        lastName,
        phone,
        role: "CLIENT",
        isApproved: false,
      },
    });
  } catch {
    await supabase.auth.signOut();

    return NextResponse.json(
      { error: "Could not create the user profile." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
