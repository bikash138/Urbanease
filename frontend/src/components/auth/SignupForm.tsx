"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { signupSchema, type SignupFormValues } from "@/schemas/auth.schema";
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
import { Loader2 } from "lucide-react";

import { ErrorBanner } from "./ErrorBanner";
import { authInputClassName } from "./form-input-classes";

export function SignupForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const { signup, isLoading, error } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    await signup(data, { callbackUrl });
  }

  return (
    <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl shadow-amber-900/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-zinc-900">Create account</CardTitle>
        <CardDescription className="text-zinc-500">
          Fill in the details below to get started
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && <ErrorBanner message={error} />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="signup-name"
                      placeholder="Bikash Shaw"
                      autoComplete="name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="signup-email"
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
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    I am a...
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {(["CUSTOMER", "PROVIDER"] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          id={`signup-role-${role.toLowerCase()}`}
                          onClick={() => field.onChange(role)}
                          className={`h-11 rounded-lg border text-sm font-medium transition-all duration-200 ${
                            field.value === role
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                              : "border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                          }`}
                        >
                          {role === "CUSTOMER"
                            ? "🛒 Customer"
                            : "🔧 Provider"}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <Button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-all duration-200 mt-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="pb-6">
        <p className="text-sm text-zinc-500 text-center w-full">
          Already have an account?{" "}
          <Link
            href={
              callbackUrl
                ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/auth/signin"
            }
            className="text-zinc-900 hover:text-zinc-700 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
