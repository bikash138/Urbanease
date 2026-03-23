"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAPI } from "@/api/auth.api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth.schema";
import { extractErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
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
import { useState } from "react";
import { authInputClassName } from "./form-input-classes";

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    try {
      const response = await forgotPasswordAPI(data);
      toast.success(
        response.message ??
          "If an account exists for that email, you will receive reset instructions shortly.",
      );
      const params = new URLSearchParams();
      params.set("email", data.email);
      if (callbackUrl != null) params.set("callbackUrl", callbackUrl);
      router.push(`/auth/signin?${params.toString()}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const signinHref =
    callbackUrl != null
      ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/auth/signin";

  return (
    <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl shadow-amber-900/5">
      <CardHeader>
        <CardTitle className="text-xl text-zinc-900">Forgot password</CardTitle>
        <CardDescription className="text-balance text-zinc-500">
          We&apos;ll send you a reset link if an account exists.
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
                      id="forgot-email"
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

            <Button
              id="forgot-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-all duration-200 mt-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
        <p className="text-sm text-zinc-500 text-center">
          Remember your password?{" "}
          <Link
            href={signinHref}
            className="text-zinc-900 hover:text-zinc-700 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
