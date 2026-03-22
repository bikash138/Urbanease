export const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Terms & conditions", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "For customers",
    links: [
      { label: "Categories", href: "/categories" },
      { label: "Providers", href: "/providers" },
      { label: "Search", href: "/search" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "For professionals",
    links: [
      {
        label: "Register as a professional",
        href: "/auth/signup",
      },
    ],
  },
] as const;
