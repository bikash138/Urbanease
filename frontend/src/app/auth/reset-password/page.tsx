"use client";

import { Suspense } from "react";
import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AuthPageLayout,
  AuthBrand,
  ResetPasswordForm,
} from "@/components/auth";

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <AuthBrand icon={KeyRound} subtitle="Choose a new password" />
      <Suspense
        fallback={
          <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl animate-pulse">
            <CardContent className="h-64" />
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
