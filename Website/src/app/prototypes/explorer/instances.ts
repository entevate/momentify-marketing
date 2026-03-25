export interface ExplorerInstance {
  slug: string;
  name: string;
  company: string;
  industry: string;
  prototypeFile: string;
  logo?: string;
  accentColor: string;
  createdAt: string;
  password?: string;
  bezel?: "ipad-landscape";
  gateLogo?: string;
}

export const instances: ExplorerInstance[] = [
  {
    slug: "momentify",
    name: "Momentify Explorer",
    company: "Momentify",
    industry: "Demo",
    prototypeFile: "/brand/explorer-prototype_momentify.html",
    logo: "/brand/assets/Momentify-Icon.svg",
    accentColor: "#0CF4DF",
    createdAt: "2025-01-01",
  },
  {
    slug: "phil",
    name: "PHIL Aggregates",
    company: "Philippi-Hagenbuch",
    industry: "Aggregates",
    prototypeFile: "/brand/explorer-prototype_phil.html",
    logo: "/brand/phil-logo.png",
    accentColor: "#F16A21",
    createdAt: "2025-03-15",
    password: "philsystems",
  },
  {
    slug: "cat",
    name: "CAT Electric Power",
    company: "Caterpillar",
    industry: "Electric Power",
    prototypeFile: "/brand/explorer-prototype_cat.html",
    logo: "/brand/assets/cat-icon.png",
    accentColor: "#FFCC00",
    createdAt: "2025-02-20",
    password: "electricpower",
  },
  {
    slug: "cat-gdl",
    name: "CAT GDL - SkillsUSA IPEX",
    company: "Caterpillar",
    industry: "Global Dealer Learning",
    prototypeFile: "/brand/explorer-prototype_catgdl-dashboard.html",
    logo: "/brand/assets/cat-icon.png",
    accentColor: "#FFCC00",
    createdAt: "2025-03-23",
    password: "skillsusaIPEX",
  },
  {
    slug: "freeman",
    name: "Freeman Explorer",
    company: "Freeman",
    industry: "Event Services",
    prototypeFile: "/brand/explorer-prototype_freeman_explorer.html",
    logo: "/brand/assets/freeman-icon.png",
    gateLogo: "/brand/assets/freeman-logo.svg",
    accentColor: "#5ED6FF",
    createdAt: "2025-03-24",
    password: "freeman2026",
    bezel: "ipad-landscape",
  },
  {
    slug: "pac",
    name: "PAC Explorer",
    company: "Pacific Aerospace Consulting",
    industry: "Defense & Aerospace",
    prototypeFile: "/brand/explorer-prototype_pac.html",
    logo: "/brand/assets/pac-icon.svg",
    accentColor: "#4db8ff",
    createdAt: "2025-03-25",
    password: "pac2026",
    bezel: "ipad-landscape",
  },
];
