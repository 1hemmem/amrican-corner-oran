'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client'; //import the auth client

//TODO: add interactivity to this component
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isloading, setIsLoading] = useState(false);

  async function HandleLogin() {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: '/admin', // optional
      },
      {
        onRequest: () => {
          setErrorMsg('');
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);

          setErrorMsg(ctx.error.message);
        },
      }
    );
    return { data, error };
  };
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-[#002868]">
          Login to your account
        </h1>
        <p className="text-muted-foreground text-sm text-balance text-[#002868]">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <Button
          className="bg-[#002868] hover:bg-[#001d4c]"
          onClick={() => HandleLogin()}
          disabled={isloading}
        >
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
