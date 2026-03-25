export const projects = [
  {
    slug: "gutsense-crc-screening",
    title: "GutSense | Continuous CRC Screening Platform",
    subtitle:
      "8-biomarker neural net + IRIS vector RAG + Claude AI narratives | 3rd Place, MIT Grand Hack (InterSystems Challenge)",
    tags: ["Healthcare AI", "Hackathon"],
    modelTypes: ["Healthcare AI", "Hackathon"],
    languages: ["Python", "TypeScript"],
    stack: [
      "React",
      "FastAPI",
      "SQLAlchemy",
      "InterSystems IRIS",
      "Claude API",
      "scikit-learn",
      "SQLite",
      "Tailwind CSS",
    ],
    metrics: [
      "8-biomarker neural net risk engine (13-input MLP)",
      "IRIS vector RAG via cosine similarity on FHIR embeddings",
      "Claude AI patient + physician narratives with tool use",
      "3rd Place, InterSystems Challenge @ MIT Grand Hack 2026",
    ],
    links: {
      github: "https://github.com/AaronHo3/GutSense",
      demo: "",
      report: "",
    },
    summary:
      "Built an end-to-end colorectal cancer early-detection platform where a toilet-mounted biosensor passively streams 8 stool biomarkers to a neural network risk scoring engine. InterSystems IRIS ingests each patient's EHR and medical history to power a vector RAG pipeline, delivering contextually personalized AI-generated clinical narratives and referral letters via the Claude API.",
    bullets: [
      "Designed an 8-biomarker neural network risk engine (sigmoid feature engineering + 13-input MLP) scoring CRC risk 0-100 from hemoglobin FIT, calprotectin, MMP-9, MPO, MMP-8, fibrinogen, haptoglobin, and PGRP-S.",
      "Leveraged InterSystems IRIS as the health data backbone to store FHIR-formatted patient observations and run cosine-similarity vector search, surfacing the 3 most similar historical cases to enrich Claude's clinical reasoning with real patient context.",
      "Researched and designed the toilet-mounted biosensor hardware architecture, outlining sensor layout, biomarker data flow, and clinical integration pathways for passive at-home screening.",
    ],
  },
  {
    slug: "eeg-seizure-classification",
    title: "EEG Seizure Classification (CHB-MIT)",
    subtitle:
      "Ensemble ML + ROC/AUC evaluation · Currently in active development",
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
    subtitle:
      "Comparative deep learning pipeline for chest image diagnosis · Currently in active development",
    tags: ["Healthcare AI", "Medical Imaging"],
    modelTypes: ["Healthcare AI", "Medical Imaging"],
    languages: ["Python"],
    stack: ["Python", "PyTorch", "EfficientNet", "DeiT", "SmallViT"],
    metrics: ["Accuracy: TBD", "F1: TBD", "ROC-AUC: TBD"],
    links: {
      github:
        "https://github.com/AaronHo3/chest_cancer_efficientnet_DeiT_smallViT",
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
    subtitle:
      "Conformer + RCNN + GRU + CTC decoders with Gaussian/Poisson HMM alignment on Willett et al. intracortical data",
    tags: ["Neuroscience", "Healthcare AI"],
    modelTypes: ["Neuroscience", "Healthcare AI"],
    languages: ["Python"],
    stack: ["Python", "PyTorch", "scikit-learn", "NumPy", "SciPy"],
    metrics: [
      "Best CER: 55.86% (Conformer, multi-session)",
      "Best single-session CER: 65.97% (RCNN)",
      "4 decoder architectures benchmarked",
      "3 alignment strategies compared",
    ],
    links: {
      github: "https://github.com/AaronHo3/neural_decoding_imagined_handwriting",
      demo: "",
      report: "",
    },
    summary:
      "Systematic comparison of four neural sequence decoders (GRU, RCNN, Conformer, CTC) across three HMM alignment strategies for brain-to-text communication from intracortical recordings, building on Willett et al. (Nature 2021).",
    bullets: [
      "Benchmarked GRU, RCNN, Conformer, and CTC decoders on 192-channel intracortical neural recordings, showing architecture ranking reverses with data scale — RCNN leads with 89 sentences but Conformer wins with 574 sentences (55.86% CER).",
      "Implemented Gaussian and novel Poisson HMM forced alignment with hard and soft probability targets, demonstrating that alignment quality dominates decoding performance (17+ pp gap between Gaussian and Poisson HMM).",
      "Showed multi-session training across 10 recording sessions yields a 10.1 pp CER improvement, and soft probability labels boost frame accuracy by 1.8–5.0 pp at zero additional cost.",
    ],
  },
  {
    slug: "gapminder-dashboard",
    title: "Interactive Gapminder Dashboard (Vue + D3)",
    subtitle:
      "Linked interactions + filtering · Currently in active development",
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
      dashboard:
        "https://vnlmen2023sportsdashboard-yqbyypuok5ovmdrfrlrhy7.streamlit.app/",
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
    subtitle:
      "Player role prediction, era comparisons, and team evolution tracking",
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
      dashboard:
        "https://nbastatistics-zkezxylgqwponqvm5bg677.streamlit.app/",
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