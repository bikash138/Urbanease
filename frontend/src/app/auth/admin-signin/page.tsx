"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import {
  adminSigninSchema,
  type AdminSigninFormValues,
} from "@/schemas/auth.schema";
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
import { ArrowLeft, Loader2, Shield } from "lucide-react";

export default function AdminSigninPage() {
  const { adminSignin, isLoading } = useAuth();

  const form = useForm<AdminSigninFormValues>({
    resolver: zodResolver(adminSigninSchema),
    defaultValues: {
      email: "",
      password: "",
      adminKey: "",
    },
  });

  async function onSubmit(data: AdminSigninFormValues) {
    await adminSignin(data);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-amber-950/30 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back link */}
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to signin
        </Link>

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 mb-4 shadow-lg shadow-amber-500/25">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Admin Access
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Restricted to authorized personnel only
          </p>
        </div>

        <Card className="border-amber-700/20 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-amber-900/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              {/* Threat indicator dots */}
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <CardTitle className="text-xl text-white">
                Secure Admin Sign In
              </CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Your credentials and admin key are required
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Warning notice */}
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/8 border border-amber-500/15 px-4 py-3">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/80 leading-relaxed">
                This portal is monitored. Unauthorized access attempts are
                logged and may result in account suspension.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">
                        Admin Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="admin-signin-email"
                          type="email"
                          placeholder="admin@urbanease.com"
                          autoComplete="email"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="admin-signin-password"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-700" />
                  <span className="text-xs text-slate-500 font-medium">
                    ADMIN KEY
                  </span>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>

                <FormField
                  control={form.control}
                  name="adminKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">
                        Admin Key
                        <span className="ml-2 text-[10px] font-normal text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          REQUIRED
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="admin-signin-key"
                          type="password"
                          placeholder="Enter your secret admin key"
                          autoComplete="off"
                          className="bg-slate-700/50 border-amber-700/30 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 h-11 font-mono tracking-wider"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  id="admin-signin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium shadow-lg shadow-amber-500/20 transition-all duration-200 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Access Admin Panel
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pb-6">
            <p className="text-xs text-slate-500 text-center w-full">
              Not an admin?{" "}
              <Link
                href="/auth/signin"
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                Go back to regular signin
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
