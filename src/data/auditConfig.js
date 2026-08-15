// Central configuration for every audit type.
// Keeping copy + structure here means components stay generic and the
// content can be edited without touching any markup.

export const AUDIT_TYPES = {
  home: 'home',
  product: 'product',
  full: 'full',
};

export const auditOptions = [
  {
    id: AUDIT_TYPES.home,
    title: 'Home Page Audit',
    badge: { label: 'FREE AI', tone: 'free' },
    cardDescription: 'Instant review of your highest-traffic entry point.',
  },
  {
    id: AUDIT_TYPES.product,
    title: 'Product Page Audit',
    badge: { label: 'FREE AI', tone: 'free' },
    cardDescription: 'Where purchase decisions are won or lost.',
  },
  {
    id: AUDIT_TYPES.full,
    title: 'Full Site Audit',
    badge: { label: 'PAID · HUMAN-LED', tone: 'paid' },
    cardDescription: 'A strategist-led review of the complete journey.',
  },
];

export const auditContent = {
  [AUDIT_TYPES.home]: {
    eyebrow: 'FREE AI AUDIT',
    heading: 'Get an instant\nhomepage conversion\nreview.',
    description:
      'Enter your homepage URL to receive a fast assessment of conversion clarity, friction and priority opportunities.',
    fieldLabel: 'HOMEPAGE URL',
    placeholder: 'https://yourbrand.com',
    ctaLabel: 'Generate Free Audit',
    supportText: 'No credit card required. Results in approximately one minute.',
    deliverablesEyebrow: "WHAT YOU'LL RECEIVE",
    deliverables: [
      {
        icon: 'gauge',
        title: 'Conversion score',
        description: 'How your page performs against CRO heuristics.',
      },
      {
        icon: 'target',
        title: 'Priority opportunities',
        description: 'What to fix first for maximum impact.',
      },
      {
        icon: 'sparkles',
        title: 'AI-supported insights',
        description: 'Clear, actionable reasoning behind each finding.',
      },
      {
        icon: 'arrowRight',
        title: 'Recommended next actions',
        description: 'Concrete steps to improve conversion.',
      },
    ],
    footerText:
      'Every finding is scored, evidenced and ranked so your team knows exactly what to fix first.',
  },

  [AUDIT_TYPES.product]: {
    eyebrow: 'FREE AI AUDIT',
    heading: 'Review the page where\npurchase decisions happen.',
    description:
      'Enter a product page URL to see how clearly it communicates value, builds trust and removes friction.',
    fieldLabel: 'PRODUCT PAGE URL',
    placeholder: 'https://yourbrand.com/product',
    ctaLabel: 'Generate Free Audit',
    supportText: 'No credit card required. Results in approximately one minute.',
    deliverablesEyebrow: "WHAT YOU'LL RECEIVE",
    deliverables: [
      {
        icon: 'tag',
        title: 'Product-page conversion score',
        description: 'Benchmarked against category expectations.',
      },
      {
        icon: 'messageWarning',
        title: 'Offer and messaging gaps',
        description: 'Where value fails to land with buyers.',
      },
      {
        icon: 'shieldCheck',
        title: 'Trust and friction issues',
        description: 'What creates hesitation before add-to-cart.',
      },
      {
        icon: 'listChecks',
        title: 'Prioritised improvements',
        description: 'Ranked by expected commercial impact.',
      },
    ],
    footerText:
      'Every finding is scored, evidenced and ranked so your team knows exactly what to fix first.',
  },

  [AUDIT_TYPES.full]: {
    eyebrow: 'HUMAN-LED CRO AUDIT',
    heading: 'A deeper investigation into your\ncomplete conversion journey.',
    description:
      'Our strategists review your data, customer behaviour and website experience to identify the issues with the greatest commercial impact.',
    ctaLabel: 'Request an Audit Consultation',
    supportText: 'Your information is confidential and will not be shared.',
    pricingLine: {
      prefix: 'Full audit engagements from ',
      amount: '$3,500',
      suffix: ' · One-time engagement',
    },
    deliverablesEyebrow: "WHAT'S INCLUDED",
    deliverables: [
      {
        icon: 'layers',
        title: 'Full-site conversion review',
        description: 'Every step of the customer journey assessed.',
      },
      {
        icon: 'barChart',
        title: 'Analytics and tracking audit',
        description: 'Events, funnels and data integrity verified.',
      },
      {
        icon: 'lineChart',
        title: 'GA4 review',
        description: 'Setup, configuration and reporting quality.',
      },
      {
        icon: 'mousePointer',
        title: 'Heatmap and behavioural analysis',
        description: 'How real users actually interact.',
      },
      {
        icon: 'target',
        title: 'Competitor and category benchmarking',
        description: 'Where you sit against the market.',
      },
      {
        icon: 'listChecks',
        title: 'Prioritised action plan',
        description: 'A ranked roadmap your team can execute.',
      },
    ],
    footerText:
      'Reviewed by DIGITXL strategists using analytics, behavioural evidence and conversion heuristics — not automated recommendations alone.',
  },
};

export const loadingSteps = [
  'Analyzing page…',
  'Checking conversion structure…',
  'Reviewing messaging…',
  'Evaluating trust signals…',
  'Generating recommendations…',
];
