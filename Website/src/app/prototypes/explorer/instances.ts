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
    prototypeFile: "/brand/explorer-prototype_catepd.html",
    logo: "/brand/assets/cat-icon.png",
    accentColor: "#FFCC00",
    createdAt: "2025-02-20",
    password: "electricpower",
  },
];
