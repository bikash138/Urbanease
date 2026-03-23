"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordAPI } from "@/api/auth.api";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
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
import { authInputClassName } from "./form-input-classes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const signinHref =
    callbackUrl != null
      ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/auth/signin";

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Invalid or missing reset link.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await resetPasswordAPI({
        token,
        password: data.password,
      });
      toast.success(
        response.message ?? "Password updated. Sign in with your new password.",
      );
      router.push(signinHref);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl shadow-amber-900/5">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-900">Invalid link</CardTitle>
          <CardDescription className="text-balance text-zinc-500">
            Link has missing a token. Request a new link.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pb-6">
          <Button asChild className="w-full h-11 bg-zinc-900 hover:bg-zinc-800">
            <Link href="/auth/forgot-password">Request new link</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl shadow-amber-900/5">
      <CardHeader>
        <CardTitle className="text-xl text-zinc-900">Set new password</CardTitle>
        <CardDescription className="text-zinc-500">
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    New password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="reset-password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm font-medium">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="reset-confirm-password"
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

            <Button
              id="reset-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-all duration-200 mt-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
        <p className="text-sm text-zinc-500 text-center">
          <Link
            href={signinHref}
            className="text-zinc-900 hover:text-zinc-700 font-semibold underline underline-offset-4 transition-colors"
          >
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
