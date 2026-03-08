"use client";

import { Suspense } from "react";
import { LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AuthPageLayout,
  AuthBrand,
  SigninForm,
} from "@/components/auth";

export default function SigninPage() {
  return (
    <AuthPageLayout>
      <AuthBrand icon={LogIn} subtitle="Your urban services platform" />
      <Suspense
        fallback={
          <Card className="border border-amber-200/80 bg-amber-50/70 shadow-xl animate-pulse">
            <CardContent className="h-64" />
          </Card>
        }
      >
        <SigninForm />
      </Suspense>
    </AuthPageLayout>
  );
}
