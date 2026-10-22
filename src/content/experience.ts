export type Role = {
  year: number;
  title: string;
  company: string;
  highlight: string;
};

export type Credential = {
  year: number;
  title: string;
  issuer: string;
};

// Newest first
export const roles: Role[] = [
  {
    year: 2025,
    title: "Senior Software Engineer, Frontend",
    company: "Caterpillar",
    highlight:
      "Led Unified View: the redesign of the main Customers page across product, data and engineering.",
  },
  {
    year: 2022,
    title: "Software Engineer, Frontend",
    company: "Caterpillar",
    highlight:
      "Built the Admin Tool UI from Figma designs, mentored new engineers and led a cross-team project that earned a promotion.",
  },
  {
    year: 2020,
    title: "Front-End Web Developer",
    company: "Interfirst Mortgage Company",
    highlight: "Moved the main website to HubSpot CMS.",
  },
  {
    year: 2017,
    title: "Senior Member of Technical Staff",
    company: "AT&T",
    highlight:
      "Introduced and supported VoLTE, WiFi calling and video calling on large-scale telecom networks.",
  },
  {
    year: 2012,
    title: "Member of Technical Staff",
    company: "AT&T",
    highlight:
      "Implemented cloud virtualization on an IMS platform and analyzed calls over SIP and RTP.",
  },
];

// Newest first
export const credentials: Credential[] = [
  { year: 2025, title: "AWS Certified AI Practitioner", issuer: "AWS" },
  { year: 2019, title: "React Nanodegree", issuer: "Udacity" },
  {
    year: 2015,
    title: "Front-End Web Developer Nanodegree",
    issuer: "Udacity",
  },
  {
    year: 2012,
    title: "Master's in Information Technology and Management",
    issuer: "Illinois Institute of Technology",
  },
  {
    year: 2012,
    title: "Ingeniero de Telecomunicación",
    issuer: "Universidad Politécnica de Madrid",
  },
];
