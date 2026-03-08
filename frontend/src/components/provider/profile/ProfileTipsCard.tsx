"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PROFILE_TIPS } from "./constants";

export function ProfileTipsCard() {
  return (
    <Card className="border-0 shadow-sm bg-violet-50">
      <CardContent className="pt-5 pb-5">
        <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-2">
          Tips for a great profile
        </p>
        <ul className="space-y-1">
          {PROFILE_TIPS.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-1.5 text-xs text-violet-700"
            >
              <span className="mt-0.5 shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
