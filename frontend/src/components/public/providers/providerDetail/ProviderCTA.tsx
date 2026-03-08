import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProviderCTAProps {
  providerName: string;
  bookHref: string;
  subtext: string;
  buttonText: string;
}

export function ProviderCTA({
  providerName,
  bookHref,
  subtext,
  buttonText,
}: ProviderCTAProps) {
  return (
    <section className="py-16 bg-zinc-900 mt-10">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Ready to book {providerName}?
        </h2>
        <p className="text-zinc-400">{subtext}</p>
        <Link href={bookHref}>
          <Button
            size="lg"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-xl px-8"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
