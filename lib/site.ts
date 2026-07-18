import type { IconKey } from "@/components/ui/icons";

/**
 * Central content + configuration for the Modern Fire Safety Solution site.
 * Editing copy, contact details, services and imagery all happens here.
 *
 * IMAGES: hosted on a public CDN so the site renders out of the box. To
 * self-host, run `node scripts/fetch-assets.mjs` (downloads them into
 * /public/images) and swap the URLs below for local paths like
 * "/images/hero.jpg". See README.
 */

export const company = {
  name: "Modern Fire Safety Solution",
  shortName: "Modern Fire",
  tagline: "Complete Fire Safety Solution",
  yearsExperience: "20+",
  address: "H.No. 599/10 GF, Aali Vihar, Sarita Vihar, New Delhi",
  phones: ["9717535602", "7838670142"],
  email: "modarnfiresafetysolution@gmail.com",
  // E.164 (India +91) for tel/WhatsApp links
  phonePrimaryE164: "+919717535602",
  whatsapp: "919717535602",
  mapQuery: "Aali Vihar, Sarita Vihar, New Delhi",
} as const;

export const IMAGES = {
  hero: "https://pub.hyperagent.com/api/published/pbf01KXRKQ7GV_311XE7KYXWDPE5Q9/hero.jpg",
  about: "https://pub.hyperagent.com/api/published/pbf01KXRKQ7XD_MW4C9D43DR16X704/about.jpg",
  training: "https://pub.hyperagent.com/api/published/pbf01KXRKQ8F1_X699MZNCXKXSZFG3/training.jpg",
  extinguisher: "https://pub.hyperagent.com/api/published/pbf01KXRKQ9C9_6GS7EEAMBA0H4NRS/product-extinguisher.jpg",
  alarm: "https://pub.hyperagent.com/api/published/pbf01KXRKQ9NB_V4JRJXTE45TV6XBS/product-alarm.jpg",
  hoseReel: "https://pub.hyperagent.com/api/published/pbf01KXRKQ9YA_SJM4X0TYCBESWRQK/product-hosereel.jpg",
  buckets: "https://pub.hyperagent.com/api/published/pbf01KXRKQABW_PTR29YB8HCWGTJGA/product-buckets.jpg",
  smoke: "https://pub.hyperagent.com/api/published/pbf01KXRKQAV9_2H4H05GXAHFPFKNT/product-smoke.jpg",
  sprinkler: "https://pub.hyperagent.com/api/published/pbf01KXRKQB78_CK76WP693M2QBKGB/product-sprinkler.jpg",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Training", href: "#training" },
  { label: "Help", href: "#help" },
  { label: "Contact", href: "#contact" },
] as const;

export type IconName = IconKey;

export const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "100%", label: "Authorised Dealer" },
  { value: "24/7", label: "Support & AMC" },
] as const;

export const services: { title: string; desc: string; icon: IconName }[] = [
  { title: "Fire Safety Installation", icon: "install",
    desc: "End-to-end design and installation of fire protection systems for homes, offices and industrial sites." },
  { title: "Fire Alarm System", icon: "alarm",
    desc: "Early-warning detection and addressable alarm panels, wired and tested to national safety standards." },
  { title: "Fire Hydrant System", icon: "hydrant",
    desc: "High-pressure hydrant and sprinkler networks engineered for reliable coverage when it matters most." },
  { title: "Fire Extinguisher Supply", icon: "extinguisher",
    desc: "Genuine, certified extinguishers for every class of fire — supplied, mounted and clearly signed." },
  { title: "Refilling & AMC", icon: "refill",
    desc: "Scheduled refilling and annual maintenance contracts that keep every unit service-ready year round." },
  { title: "Testing & Commissioning", icon: "testing",
    desc: "Documented testing, certification and commissioning so you pass inspection with confidence." },
];

export const whyChooseUs: { title: string; icon: IconName }[] = [
  { title: "20+ Years Experience", icon: "badge" },
  { title: "Professional Team", icon: "team" },
  { title: "Authorised Dealer", icon: "shield" },
  { title: "Quality Products", icon: "quality" },
  { title: "Fast & Safe Service", icon: "bolt" },
];

export const training: { no: string; title: string; desc: string }[] = [
  { no: "01", title: "Basic Fire Training", desc: "Foundations of fire safety awareness for every employee." },
  { no: "02", title: "Hands-on Fire Drill", desc: "Practical extinguisher and evacuation drills in controlled conditions." },
  { no: "03", title: "Industrial Training", desc: "Site-specific protocols for high-risk manufacturing and warehousing." },
  { no: "04", title: "Commercial Training", desc: "Compliance-focused sessions for offices, retail and hospitality teams." },
  { no: "05", title: "Compliance & Safety Support", desc: "Ongoing guidance, audits and documentation to stay inspection-ready." },
];

export const products: { title: string; desc: string; img: string }[] = [
  { title: "Fire Extinguishers", desc: "ABC, CO₂, foam & water — for every class of fire.", img: IMAGES.extinguisher },
  { title: "Fire Alarm Systems", desc: "Panels, sounders & manual call points.", img: IMAGES.alarm },
  { title: "Hose Reels", desc: "Wall-mounted reels with certified hose & nozzle.", img: IMAGES.hoseReel },
  { title: "Fire Buckets", desc: "Sand & water buckets with sturdy stands.", img: IMAGES.buckets },
  { title: "Smoke Detectors", desc: "Photoelectric & ionisation ceiling detectors.", img: IMAGES.smoke },
  { title: "Other Equipment", desc: "Sprinkler heads, signage & accessories.", img: IMAGES.sprinkler },
];

export const helpSteps: { title: string; desc: string; icon: IconName }[] = [
  { title: "Site Inspection", icon: "inspect",
    desc: "On-site risk assessment of your current setup." },
  { title: "Installation & Commissioning", icon: "commission",
    desc: "Professional install and full sign-off of new systems." },
  { title: "Refilling & AMC", icon: "refill",
    desc: "Refilling and annual maintenance kept on schedule." },
  { title: "Annual Maintenance Contract", icon: "contract",
    desc: "One partner, one contract — total coverage all year." },
  { title: "Consultation", icon: "consult",
    desc: "Expert advice to plan compliant fire safety." },
];

export const footerServices = [
  "Fire Alarm System",
  "Fire Hydrant System",
  "Extinguisher Supply",
  "Refilling & AMC",
] as const;
