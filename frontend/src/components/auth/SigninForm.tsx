"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { signinSchema, type SigninFormValues } from "@/schemas/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";

import { authInputClassName } from "./form-input-classes";

export function SigninForm() {
  const searchParams = useSearchParams();
  const registeredEmail = searchParams.get("email") ?? "";
  const registeredPassword = searchParams.get("password") ?? "";
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;

  const { signin, isLoading } = useAuth();

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: registeredEmail,
      password: registeredPassword,
    },
  });

  useEffect(() => {
    if (registeredEmail) form.setValue("email", registeredEmail);
    if (registeredPassword) form.setValue("password", registeredPassword);
  }, [registeredEmail, registeredPassword, form]);

  async function onSubmit(data: SigninFormValues) {
    await signin(data, { callbackUrl });
  }

  return (
    <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl shadow-amber-900/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-zinc-900">Welcome back</CardTitle>
        <CardDescription className="text-zinc-500">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={authInputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={authInputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <Button
              id="signin-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-all duration-200 mt-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
        <p className="text-sm text-zinc-500 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href={
              callbackUrl
                ? `/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/auth/signup"
            }
            className="text-zinc-900 hover:text-zinc-700 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </p>

        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <Link href="/auth/admin-signin" className="w-full">
          <Button
            id="goto-admin-signin-btn"
            variant="outline"
            className="w-full h-10 border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-400 transition-all duration-200 gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Sign in as Admin
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
