// Central place for every editable placeholder: name, contact info, stats, payment accounts.
// All values below are placeholders. Replace them with the academy's real details before launch.
export const siteConfig = {
  academyName: "Al-Fajr Learning Academy",
  shortName: "Al-Fajr",
  tagline: "Live online classes for learners in every time zone",
  description:
    "One-to-one and small-group tutoring for international curricula, academic writing coaching, and Quran and Islamic studies, taught live by vetted teachers.",
  url: "https://alfajracademy.com",

  contact: {
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    email: "hello@alfajracademy.com",
    admissionsEmail: "admissions@alfajracademy.com",
    address: "Suite 4, Model Town, Multan, Punjab, Pakistan",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13000!2d71.5249!3d30.1575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    // Admissions desk hours in GMT so international families can convert easily.
    officeHours: [
      { days: "Monday to Friday", hours: "04:00 to 15:00 GMT" },
      { days: "Saturday", hours: "05:00 to 13:00 GMT" },
      { days: "Sunday", hours: "WhatsApp only" },
    ],
    responseTime: "We reply to every enquiry within one working day.",
  },

  social: {
    facebook: "https://facebook.com/alfajracademy",
    instagram: "https://instagram.com/alfajracademy",
    youtube: "https://youtube.com/@alfajracademy",
  },

  stats: [
    { label: "Students taught", value: 2400, suffix: "+" },
    { label: "Vetted teachers", value: 85, suffix: "+" },
    { label: "Countries", value: 14, suffix: "" },
    { label: "Years teaching", value: 9, suffix: "" },
  ],

  // Average parent rating shown on the hero badge. Placeholder: update with your real review score.
  rating: 4.9,

  // Payment accounts shown on the Payments page. No prices are published on the site:
  // each family receives a fee plan after their assessment call.
  paymentMethods: {
    internationalBank: {
      label: "International bank transfer",
      region: "All countries",
      rows: [
        { label: "Bank", value: "Meezan Bank" },
        { label: "Account title", value: "Al-Fajr Learning Academy" },
        { label: "IBAN", value: "PK36MEZN0001230123456789", copyable: true },
        { label: "SWIFT / BIC", value: "MEZNPKKA", copyable: true },
      ],
    },
    wise: {
      label: "Wise",
      region: "UK, EU, US, Canada, Australia",
      rows: [
        { label: "Account holder", value: "Al-Fajr Learning Academy" },
        { label: "Wise email", value: "payments@alfajracademy.com", copyable: true },
      ],
    },
    paypal: {
      label: "PayPal or card",
      region: "Anywhere PayPal is supported",
      rows: [
        { label: "PayPal email", value: "payments@alfajracademy.com", copyable: true },
        { label: "Note", value: "Send as goods and services and add your student ID" },
      ],
    },
    local: {
      label: "JazzCash or local bank",
      region: "Pakistan",
      rows: [
        { label: "Account title", value: "Al-Fajr Learning Academy" },
        { label: "JazzCash number", value: "0300-1234567", copyable: true },
        { label: "Bank account", value: "0123456789012", copyable: true },
      ],
    },
  },

  currencies: ["USD", "GBP", "EUR", "CAD", "AUD", "AED", "SAR", "PKR"] as const,

  whatsappNumber: "923001234567",
};

export type SiteConfig = typeof siteConfig;
export type Currency = (typeof siteConfig.currencies)[number];
