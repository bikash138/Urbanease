"use client";

import Link from "next/link";
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
import { AlertCircle, Loader2, UserPlus } from "lucide-react";

export default function SignupPage() {
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
    await signup(data);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle warm tint */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(251,243,219,0.6)_0%,transparent_70%)]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 mb-4 shadow-lg shadow-zinc-900/20">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Urbanease
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Join our platform today</p>
        </div>

        <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl shadow-amber-900/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-zinc-900">
              Create account
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Fill in the details below to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Role toggle */}
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
                href="/auth/signin"
                className="text-zinc-900 hover:text-zinc-700 font-semibold underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
