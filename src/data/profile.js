/**
 * Profile content shared by the header, footer, Home, About, and Contact.
 * ----------------------------------------------------------------------------
 * Source of truth for experience and education: public/Aaron_Ho_Resume.pdf.
 * Keep roles and dates exactly as titled there; do not inflate titles or
 * attribute team or product outcomes to Aaron.
 * ----------------------------------------------------------------------------
 */
export const profile = {
  name: "Aaron Ho",
  tagline: "AI/ML for biotech and healthcare",
  email: "aaronho0218@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/aaronho3/",
    github: "https://github.com/AaronHo3",
  },
  resumePath: "Aaron_Ho_Resume.pdf", // served from public/
};

/**
 * Most recent first. `unit` and `summary` are optional; `summary` paraphrases the
 * resume bullet with no outcomes added. `homeLine` (optional) is the short label
 * in the Home page's one-line experience summary; omit it to leave a role out.
 */
export const experience = [
  {
    org: "Sanofi",
    unit: "Manufacturing Sciences, Analytics, and Technology (MSAT)",
    role: "Data Science and Digital Transformation Co-op",
    homeLine: "Sanofi, data science co-op",
    dates: "Jan 2026 to Jun 2026",
    summary:
      "Modified and tested a digital twin simulation of the Cerezyme perfusion process, and added automated inputs, testing, and version-control checks to the modeling code.",
  },
  {
    org: "Abbott",
    unit: "Cardiac Rhythm Management",
    role: "Computer Engineering Co-op",
    homeLine: "Abbott, computer engineering co-op",
    dates: "May 2025 to Dec 2025",
    summary:
      "Verification and validation testing for an AI-based atrial-fibrillation and pause-detection system used with insertable cardiac monitors; built a Python and Arduino tool to reposition devices during testing.",
  },
  {
    org: "USC Song Lab",
    homeLine: "USC Song Lab, research assistant",
    unit: "Neural Modeling and Brain Interface Lab",
    role: "Research Assistant",
    dates: "Jan 2025 to May 2025",
    summary:
      "Spike sorting of 384-channel Neuropixels recordings with Kilosort4, with a reproducible preprocessing and unit quality-control workflow.",
  },
  {
    org: "Mount Auburn Hospital",
    unit: "Watertown, MA",
    role: "Certified Medical Assistant",
    dates: "Jun 2023 to Jun 2024",
  },
  {
    org: "Brigham and Women's Hospital",
    homeLine: "Brigham and Women's Hospital, research assistant",
    unit: "Kwiatkowski Lab",
    role: "Research Assistant",
    dates: "Aug 2020 to May 2022",
    summary: "Wet-lab research on mTORC1 regulators (DEPTOR, PRAS40) in TSC-deficient cell and mouse tumor models.",
  },
];

export const education = [
  {
    school: "University of Southern California",
    degree: "M.S. Biomedical Data Analytics",
    detail: "Graduated May 2026. Focus: AI-driven biomedical modeling and decision analytics.",
  },
  {
    school: "Boston University",
    degree: "B.A. Biochemistry & Molecular Biology",
    detail: "Graduated with honors; completed and defended an undergraduate thesis.",
  },
];
