export const projects = [
  {
    slug: "eeg-seizure-classification",
    title: "EEG Seizure Classification (CHB-MIT)",
    subtitle: "Ensemble ML + ROC/AUC evaluation · Currently in active development",
    tags: ["Healthcare AI", "Neuroscience"],
    modelTypes: ["Healthcare AI", "Neuroscience"],
    languages: ["Python"],
    stack: ["Python", "scikit-learn", "NumPy"],
    metrics: ["AUC: TBD", "F1: TBD"],
    links: {
      github: "https://github.com/AaronHo3/eeg_seizure_classification",
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
    underConstruction: true,
    tags: ["Healthcare AI", "Medical Imaging"],
    modelTypes: ["Healthcare AI", "Medical Imaging"],
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
    slug: "chest-cancer-efficientnet-deit-smallvit",
    title: "Chest Cancer Classification (EfficientNet + DeiT + SmallViT)",
    subtitle: "Comparative deep learning pipeline for chest image diagnosis · Currently in active development",
    tags: ["Healthcare AI", "Medical Imaging"],
    modelTypes: ["Healthcare AI", "Medical Imaging"],
    languages: ["Python"],
    stack: ["Python", "PyTorch", "EfficientNet", "DeiT", "SmallViT"],
    metrics: ["Accuracy: TBD", "F1: TBD", "ROC-AUC: TBD"],
    links: {
      github: "https://github.com/AaronHo3/chest_cancer_efficientnet_DeiT_smallViT",
      demo: "",
      report: "",
    },
    summary:
      "Built a chest cancer image classification project that benchmarks CNN and transformer-based models in a single reproducible training and evaluation workflow.",
    bullets: [
      "Compared EfficientNet, DeiT, and SmallViT architectures for chest cancer classification performance.",
      "Structured the codebase for consistent preprocessing, training, and evaluation across multiple model families.",
    ],
  },
  {
    slug: "imagined-handwriting-decoding",
    title: "Neural Decoding (Imagined Handwriting)",
    subtitle: "Poisson HMM vs RCNN sequence decoder",
    underConstruction: true,
    tags: ["Neuroscience", "Healthcare AI"],
    modelTypes: ["Neuroscience", "Healthcare AI"],
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
    subtitle: "Linked interactions + filtering · Currently in active development",
    tags: ["Data Visualization / Dashboards", "Miscellaneous"],
    modelTypes: ["Data Visualization / Dashboards", "Miscellaneous"],
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
    tags: ["Sports Analytics", "Data Visualization / Dashboards"],
    modelTypes: ["Sports Analytics", "Data Visualization / Dashboards"],
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
  {
    slug: "nba-statistics-dashboard",
    title: "NBA Statistics Analytical Dashboard",
    subtitle: "Player role prediction, era comparisons, and team evolution tracking",
    tags: ["Sports Analytics", "Data Visualization / Dashboards"],
    modelTypes: ["Sports Analytics", "Data Visualization / Dashboards"],
    languages: ["Python"],
    stack: ["Streamlit", "Pandas", "Plotly", "Python"],
    metrics: [
      "Player stat percentiles",
      "Position prediction accuracy",
      "Cross-era statistical comparisons",
      "Franchise/team evolution trends",
    ],
    links: {
      github: "https://github.com/AaronHo3",
      dashboard: "https://nbastatistics-zkezxylgqwponqvm5bg677.streamlit.app/",
      demo: "",
      report: "",
    },
    summary:
      "Developed a multi-module NBA analytics platform that combines descriptive dashboards with predictive modeling, including a player position predictor, percentile-based player profiling, era-to-era comparison views, and team evolution analysis over time.",
    bullets: [
      "Implemented a player position prediction workflow and integrated model outputs directly into interactive exploration pages.",
      "Built percentile rank views for player stats, side-by-side historical era comparisons, and longitudinal team trend panels to show how play styles and performance shifted.",
    ],
  },
  {
    slug: "uci-heart-disease-ml",
    title: "UCI Heart Disease Prediction Model",
    subtitle: "Random Forest + PCA + Logistic Regression + HGB",
    tags: ["Healthcare AI", "Miscellaneous"],
    modelTypes: ["Healthcare AI", "Miscellaneous"],
    languages: ["Python"],
    stack: ["Python", "scikit-learn", "Pandas", "NumPy"],
    metrics: [
      "Test ROC-AUC",
      "Accuracy (tuned threshold)",
      "5-fold CV ROC-AUC (best search)",
    ],
    links: {
      github: "https://github.com/AaronHo3/UCI_Heart_Disease_ML",
      demo: "",
      report: "",
    },
    summary:
      "Built a heart disease prediction pipeline on the UCI dataset, comparing tree-based and linear baselines with dimensionality reduction.",
    bullets: [
      "Implemented and evaluated Random Forest, PCA + Logistic Regression, and HistGradientBoosting approaches.",
      "Focused on reproducible model training and clear metric-based comparison in a code-first GitHub repository.",
    ],
  },
];
