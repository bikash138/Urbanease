"use client";

import { Suspense } from "react";
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
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  ShieldCheck,
} from "lucide-react";

function SigninForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const registeredEmail = searchParams.get("email") ?? "";
  const registeredPassword = searchParams.get("password") ?? "";

  const { signin, isLoading, error } = useAuth();

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
    await signin(data);
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
        {/* Success banner after signup */}
        {registered === "true" && (
          <div className="flex items-center gap-3 rounded-lg bg-zinc-100 border border-zinc-200 px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0" />
            <p className="text-sm text-zinc-700">
              Account created! Your details have been pre-filled.
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
                      className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 h-11"
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
                      className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 h-11"
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
            href="/auth/signup"
            className="text-zinc-900 hover:text-zinc-700 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        {/* Admin signin button */}
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

// Page — wraps the inner form in Suspense (required by Next.js for useSearchParams)
export default function SigninPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle warm tint */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(251,243,219,0.6)_0%,transparent_70%)]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 mb-4 shadow-lg shadow-zinc-900/20">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Urbanease
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your urban services platform
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl animate-pulse">
              <CardContent className="h-64" />
            </Card>
          }
        >
          <SigninForm />
        </Suspense>
      </div>
    </div>
  );
}
