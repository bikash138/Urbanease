"use client";

import { Suspense } from "react";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AuthPageLayout,
  AuthBrand,
  ForgotPasswordForm,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout>
      <AuthBrand icon={Mail} subtitle="Reset access to your account" />
      <Suspense
        fallback={
          <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl animate-pulse">
            <CardContent className="h-64" />
          </Card>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
