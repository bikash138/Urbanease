"use client";

import { Suspense } from "react";
import { UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AuthPageLayout,
  AuthBrand,
  SignupForm,
} from "@/components/auth";

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <AuthBrand icon={UserPlus} subtitle="Join our platform today" />
      <Suspense
        fallback={
          <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl animate-pulse">
            <CardContent className="h-64" />
          </Card>
        }
      >
        <SignupForm />
      </Suspense>
    </AuthPageLayout>
  );
}
