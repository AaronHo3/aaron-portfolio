export const projects = [
  {
    slug: "eeg-seizure-classification",
    title: "EEG Seizure Classification (CHB-MIT)",
    subtitle: "Ensemble ML + ROC/AUC evaluation",
    tags: ["EEG", "ML", "Classification"],
    modelTypes: ["Classical ML", "Ensemble", "Classification"],
    languages: ["Python"],
    stack: ["Python", "scikit-learn", "NumPy"],
    metrics: ["AUC: TBD", "F1: TBD"],
    links: {
      github: "https://github.com/AaronHo3",
      demo: "",
      report: "",
    },
    summary:
      "Built a seizure vs non-seizure classifier with patient-level cross-validation, comparing RF/LR/kNN and a soft voting ensemble.",
    bullets: [
      "Windowed EDF signals into labeled segments; engineered features; evaluated via ROC/AUC and MCC.",
      "Compared within-patient and across-patient generalization; documented reproducible pipeline.",
    ],
  },
  {
    slug: "luna16-nodule-segmentation",
    title: "Lung Nodule Segmentation + Classification (LUNA16)",
    subtitle: "U-Net patches + ResNet50 classifier",
    tags: ["CT", "Deep Learning", "U-Net", "ResNet"],
    modelTypes: ["Deep Learning", "Segmentation", "Classification"],
    languages: ["Python"],
    stack: ["PyTorch", "U-Net", "ResNet50"],
    metrics: ["Dice: TBD", "AUC: TBD"],
    links: {
      github: "https://github.com/AaronHo3",
      demo: "",
      report: "",
    },
    summary:
      "Patch-based U-Net segmentation pipeline designed to plug into a ResNet50 classifier for benign vs malignant screening.",
    bullets: [
      "Trained U-Net on 128×128 patches centered on nodules with augmentation and Dice+BCE loss.",
      "Prepared segmentation outputs for downstream classification using 224×224 ResNet-compatible crops.",
    ],
  },
  {
    slug: "imagined-handwriting-decoding",
    title: "Neural Decoding (Imagined Handwriting)",
    subtitle: "Poisson HMM vs RCNN sequence decoder",
    tags: ["BCI", "Sequence Models", "Time Series"],
    modelTypes: ["Sequence Models", "Probabilistic Models", "Deep Learning"],
    languages: ["Python"],
    stack: ["Python", "PyTorch", "State-space models"],
    metrics: ["Trajectory fidelity: TBD"],
    links: {
      github: "https://github.com/AaronHo3",
      demo: "",
      report: "",
    },
    summary:
      "Benchmarked probabilistic and deep sequence models to decode intended handwriting from intracortical spiking activity.",
    bullets: [
      "Modeled spike counts with a Poisson HMM and compared against an RCNN sequence decoder.",
      "Evaluated decoding quality with trajectory-based metrics and qualitative reconstructions.",
    ],
  },
  {
    slug: "gapminder-dashboard",
    title: "Interactive Gapminder Dashboard (Vue + D3)",
    subtitle: "Linked interactions + filtering",
    tags: ["Visualization", "Vue", "D3"],
    modelTypes: ["Visualization"],
    languages: ["JavaScript"],
    stack: ["Vue 3", "D3.js", "Bootstrap"],
    metrics: ["4 linked charts"],
    links: {
      github: "https://github.com/AaronHo3",
      demo: "",
      report: "",
    },
    summary:
      "Built a multi-chart dashboard with coordinated views, search, sorting, and responsive layout using the Vue Composition API.",
    bullets: [
      "Implemented linked interactions between charts via props/events and shared dashboard state.",
      "Converted vanilla D3 prototypes into reusable Vue components with clean project architecture.",
    ],
  },
  {
    slug: "mens-2023-vnl-dashboard",
    title: "Men's 2023 Volleyball Nations League Analytical Dashboard",
    subtitle: "Interactive team and player performance analysis",
    tags: ["Sports Analytics", "Visualization", "Streamlit"],
    modelTypes: ["Sports Analytics", "Interactive Dashboard", "Exploratory Analysis"],
    languages: ["Python"],
    stack: ["Streamlit", "Pandas", "Plotly", "Python"],
    metrics: [
      "Win/Loss trends",
      "Attack efficiency",
      "Serve and block production",
      "Team comparison rankings",
    ],
    links: {
      github: "https://github.com/AaronHo3",
      dashboard: "https://vnlmen2023sportsdashboard-yqbyypuok5ovmdrfrlrhy7.streamlit.app/",
      demo: "",
      report: "",
    },
    summary:
      "Built an interactive Streamlit analytics dashboard for the 2023 Men's Volleyball Nations League to compare team and player performance across core match stats.",
    bullets: [
      "Added filters and cross-team comparisons to quickly explore performance differences and trends.",
      "Designed visuals that surface offensive, defensive, and serving metrics in a single overview workflow.",
    ],
  },
];
