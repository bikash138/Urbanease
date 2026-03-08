import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, CalendarCheck } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Search a Service",
    description:
      "Browse hundreds of urban services across categories. Find exactly what you need.",
    icon: Search,
  },
  {
    step: "2",
    title: "Book a Slot",
    description:
      "Choose your preferred time — morning, afternoon, or night. Book in minutes.",
    icon: CalendarCheck,
  },
  {
    step: "3",
    title: "Sit Back & Relax",
    description:
      "Our verified professionals arrive at your door. Satisfaction guaranteed.",
    icon: CheckCircle2,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <Badge
            variant="outline"
            className="text-zinc-600 border-zinc-200 bg-white"
          >
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold text-zinc-900">
            Simple as 1, 2, 3
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            From search to service — we&apos;ve made booking urban services as
            easy as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map(({ step, title, description, icon: Icon }) => (
            <div key={step} className="relative text-center space-y-5">
              <div className="relative inline-flex">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto border border-zinc-200">
                  <Icon className="w-7 h-7 text-zinc-700" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-zinc-900 text-xs font-bold flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
