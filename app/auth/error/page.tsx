import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams
  console.log('params', params)

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <Card className='border-destructive/50 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-3xl font-black text-center tracking-tight uppercase text-destructive'>
                Diva Down!
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-center'>
              <p className='text-base font-semibold text-foreground'>
                Honey, the server just threw a total tantrum.
              </p>

              {params?.error ? (
                <div className='rounded-lg bg-muted/60 p-3 border border-border'>
                  <p className='text-xs font-mono font-medium text-destructive break-words'>
                    {decodeURIComponent(params.error)}
                  </p>
                </div>
              ) : (
                <p className='text-sm italic text-muted-foreground'>
                  We don't even know what you did, but it wasn't cute.
                </p>
              )}

              <Link
                href={'/auth/login'}
                className='inline-block text-xs font-semibold tracking-wide text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-all hover:text-primary hover:decoration-primary hover:scale-[1.02] active:scale-95 pt-2'
              >
                Fix your weave, refresh the page, and try that again.
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
