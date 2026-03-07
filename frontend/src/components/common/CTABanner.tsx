import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-400/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/8 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Ready to simplify your city life?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Join thousands of happy customers who trust Urbanease for all their
            home service needs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-xl px-8"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 rounded-xl px-8 bg-transparent"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <p className="text-zinc-600 text-sm">
          Are you a service provider?{" "}
          <Link
            href="/auth/signup"
            className="text-amber-400 hover:text-amber-300 hover:underline transition-colors"
          >
            Join as a Provider →
          </Link>
        </p>
      </div>
    </section>
  );
}
