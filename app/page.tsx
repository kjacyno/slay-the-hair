import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-6 py-16 md:px-10">
        <div className="max-w-2xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Slay the Hair
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Book salon visits without phone calls or double bookings.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            Create an account to request access, then schedule appointments with
            approved hairdressers once an admin confirms your profile.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/auth/sign-up">Create account</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>

        <div className="grid gap-4 border-t pt-8 text-sm text-muted-foreground md:grid-cols-3">
          <p>Clients wait for approval before booking.</p>
          <p>Appointments can be short or long visits.</p>
          <p>Hairdresser schedules keep available hours clear.</p>
        </div>
      </section>
    </main>
  );
}
