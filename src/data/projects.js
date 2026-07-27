/**
 * Project schema
 * ----------------------------------------------------------------------------
 * Core fields (all projects): slug, title, subtitle, tags, modelTypes,
 *   languages, stack, metrics, links, summary, bullets.
 *
 * Optional case-study fields (flagship projects). When present, ProjectDetail
 * renders a rich, paper-style write-up. Add these incrementally per project:
 *
 *   image: string                            // preview screenshot, e.g. "/previews/gutsense.png"
 *                                            //   (drop files in public/previews/, served from site root)
 *   inProgress: boolean                      // work-in-progress; shows an "In progress" badge + Lab strip
 *   headlineStats: [{ value, label }]        // big stat callouts at the top
 *   caseStudy: {
 *     problem:      string,                   // motivation: why this matters
 *     approach:     string,                   // the strategy, in one paragraph
 *     architecture: [string],                 // ordered method/pipeline steps
 *     findings:     [string],                 // (optional) key takeaways
 *     results:      [{ metric, value, note }],// results table rows
 *     limitations:  [string],                 // honest constraints
 *     future:       [string],                 // future work / open questions
 *   }
 * ----------------------------------------------------------------------------
 */
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
    image: "/previews/gutsense-architecture.webp",
    headlineStats: [
      { value: "3rd", label: "Place · InterSystems Challenge, MIT Grand Hack 2026" },
      { value: "8", label: "Biomarkers in the neural-net risk engine" },
      { value: "RAG", label: "IRIS vector search over FHIR patient history" },
    ],
    caseStudy: {
      problem:
        "Colorectal cancer is highly survivable when caught early, yet screening compliance stays low because colonoscopy is invasive and inconvenient. The cost of that friction is late-stage diagnoses that are far harder, and far more expensive, to treat.",
      approach:
        "We built an end-to-end platform around a toilet-mounted biosensor that passively streams eight stool biomarkers, scores colorectal-cancer risk with a neural network, and grounds AI-generated clinical narratives in the patient's own EHR history, turning a one-off screening test into continuous, context-aware monitoring.",
      architecture: [
        "A toilet-mounted biosensor passively captures 8 stool biomarkers (hemoglobin FIT, calprotectin, MMP-9, MPO, MMP-8, fibrinogen, haptoglobin, PGRP-S).",
        "A 13-input MLP risk engine with sigmoid feature engineering scores CRC risk on a 0-100 scale.",
        "InterSystems IRIS stores FHIR-formatted observations and runs cosine-similarity vector search to surface the 3 most similar historical cases.",
        "The Claude API generates patient- and physician-facing narratives and referral letters, grounded via tool use in the retrieved patient context.",
      ],
      results: [
        { metric: "Risk engine", value: "8-biomarker MLP", note: "13 inputs → 0-100 CRC risk score" },
        { metric: "Retrieval", value: "Vector RAG", note: "Cosine similarity over FHIR embeddings, top-3 cases" },
        { metric: "Narratives", value: "Claude tool use", note: "Patient + physician outputs grounded in EHR" },
        { metric: "Competition", value: "3rd Place", note: "InterSystems Challenge, MIT Grand Hack 2026" },
      ],
      limitations: [
        "The biosensor is an architectural design and data-flow spec, not yet a fabricated device.",
        "The risk engine runs on feature-engineered/synthetic inputs; validation on labeled clinical CRC cohorts is the critical next step.",
        "Generated narratives require clinician-in-the-loop review before any real-world clinical use.",
      ],
      future: [
        "Validate and calibrate the risk model against labeled clinical CRC datasets.",
        "Add uncertainty estimates to the risk score for safer triage decisions.",
        "Prototype the biosensor readout pipeline end-to-end.",
      ],
    },
  },
  {
    slug: "score-the-story-live-scoring",
    title: "Score the Story | Real-Time Speech-Driven Music Scoring",
    subtitle:
      "Live generative film scoring on DeepMind's Magenta RealTime 2 (MRT2) | prosody plus Whisper/Claude semantic style direction drive a continuously morphing score as a narrator speaks",
    tags: ["Generative AI", "Audio AI", "Hackathon"],
    modelTypes: ["Generative AI"],
    languages: ["Python"],
    stack: [
      "Python",
      "Magenta RealTime 2",
      "Claude API",
      "Whisper",
      "librosa",
      "NumPy",
      "MIDI / AU (DAW)",
    ],
    metrics: [
      "Google DeepMind challenge submission, Music Technology Hackathon 2026",
      "Real-time voice-to-score, no pre-composed music",
      "Dual control: prosody + LLM semantic style direction",
      "MFCC speaker-signature identity layer",
      "Valence/arousal style-space engine",
    ],
    links: {
      github: "https://github.com/AaronHo3/score-the-story",
      demo: "",
      report: "",
    },
    summary:
      "A real-time instrument where the human voice is the controller: as a narrator speaks, the system listens on two channels at once - prosody (how it is said) and semantics (what is said via Whisper + Claude) - and drives DeepMind's Magenta RealTime 2 autoregressive model to compose a continuously morphing score live, with no pre-composed music and no manual controls. Built for the Google DeepMind challenge at the Music Technology Hackathon 2026.",
    bullets: [
      "Built a real-time pipeline that extracts prosodic features (energy, pitch, speech rate, spectral brightness) from live narration and maps them, via running auto-gain normalization, to MRT2 controls: energy drives density/chaos, brightness drives a dark-to-bright prompt blend, and silence pulls the texture sparse.",
      "Added a semantic layer where Whisper transcribes the narration and Claude reads the transcript to emit two scene style poles (a darker/tenser pole and a brighter/triumphant pole) that MRT2 embeds and morphs between, replacing brittle keyword maps with live language understanding.",
      "Designed an MFCC-based speaker-signature layer that deterministically maps vocal timbre to palette, key, and tempo, so the same narrator yields a recognizable musical identity, plus a shared harmony module that keeps the live take and its rendered keepsake in tune.",
    ],
    image: "/previews/score-the-story.svg",
    headlineStats: [
      { value: "DeepMind", label: "Built for the Google DeepMind challenge at the Music Technology Hackathon 2026" },
      { value: "2 channels", label: "Prosody (how it's said) + Whisper/Claude semantics (what's said)" },
      { value: "Real-time", label: "Voice-to-score at 48 kHz, no pre-composed music" },
    ],
    caseStudy: {
      problem:
        "Scores for film, games, and storytelling are composed ahead of time, so live narration - theater, tabletop RPGs, audiobooks, improv - has no music that actually follows the moment. The reactive-music tools that do exist lean on brittle keyword maps that break the instant the wording changes. The open question: can music track both the meaning and the delivery of speech, in real time, without a human at a mixing board?",
      approach:
        "I built a real-time instrument where the voice is the controller, splitting the signal into two complementary channels. Prosody - how something is said - continuously drives musical texture and intensity, while a Whisper-to-Claude director reads the transcript and sets the semantic direction of the scene. DeepMind's Magenta RealTime 2 autoregressive model generates the audio live, morphing between style poles as the narrator speaks.",
      architecture: [
        "Capture the microphone stream and extract prosodic features every frame: energy, pitch, speech rate, and spectral brightness.",
        "Normalize each feature with a running auto-gain baseline, then map them to MRT2 controls - energy to density/chaos, brightness to a dark-to-bright prompt blend, silence to a sparser texture - with smoothing so transitions feel musical, not twitchy.",
        "In parallel, Whisper transcribes the narration and Claude emits two scene style descriptions (a darker/tenser pole and a brighter/triumphant pole), with no hardcoded keyword maps.",
        "An MFCC speaker-signature layer fingerprints vocal timbre and deterministically sets palette, key, and tempo, giving each narrator a consistent musical identity.",
        "MRT2 embeds both style poles and the voice blends continuously between them, rendering a 48 kHz score in real time via either the native magenta-rt engine or the MRT2 AU plugin driven over MIDI.",
      ],
      findings: [
        "Separating how it's said (prosody) from what's said (semantics) is what makes the score feel intentional rather than reactive and jittery - each channel covers the other's blind spot.",
        "Smoothing and running normalization matter more than the exact feature-to-parameter mapping: auto-gain keeps the instrument expressive across different speakers and rooms with no per-user calibration.",
        "A deterministic timbre-to-identity mapping is enough to give each narrator a recognizable musical signature without training a learned speaker model.",
      ],
      results: [
        { metric: "Generative core", value: "MRT2", note: "DeepMind Magenta RealTime 2 autoregressive model, 48 kHz" },
        { metric: "Control channels", value: "Prosody + semantics", note: "Voice features alongside Whisper/Claude style poles" },
        { metric: "Style space", value: "Valence/arousal", note: "N-pole blend the voice navigates continuously" },
        { metric: "Identity", value: "MFCC signature", note: "Same voice maps to same palette, key, and tempo" },
        { metric: "Backends", value: "Native + MIDI", note: "magenta-rt engine or MRT2 AU in a DAW" },
      ],
      limitations: [
        "Evaluation is qualitative so far - no formal listening study or quantitative musicality metrics yet.",
        "Real-time MRT2 generation is compute-heavy; latency and quality depend on local hardware (Apple Silicon MLX path).",
        "Semantic direction via Whisper + Claude lags instantaneous prosody by a few seconds, so scene changes resolve gradually rather than instantly.",
        "Single-narrator only - no multi-speaker diarization or polyphonic voice control.",
      ],
      future: [
        "Run a structured listening study comparing prosody-only, semantics-only, and combined control.",
        "Swap the MFCC fingerprint for learned speaker embeddings (ECAPA / resemblyzer) for a purer identity vector.",
        "Cut latency with streaming transcription and predictive pre-fetch of the next style pole.",
        "Extend to multi-speaker scoring for dialogue and ensemble narration.",
      ],
    },
  },
  {
    slug: "eeg-seizure-classification",
    hidden: true,
    title: "EEG Seizure Classification (CHB-MIT)",
    subtitle: "Ensemble ML + ROC/AUC evaluation",
    inProgress: true,
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
    hidden: true,
    title: "Lung Nodule Segmentation + Classification (LUNA16)",
    subtitle: "U-Net patches + ResNet50 classifier",
    underConstruction: true,
    inProgress: true,
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
    hidden: true,
    title: "Chest Cancer Classification (EfficientNet + DeiT + SmallViT)",
    subtitle: "Comparative deep learning pipeline for chest image diagnosis",
    inProgress: true,
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
      "Benchmarked GRU, RCNN, Conformer, and CTC decoders on 192-channel intracortical neural recordings, showing architecture ranking reverses with data scale: RCNN leads with 89 sentences but Conformer wins with 574 sentences (55.86% CER).",
      "Implemented Gaussian and novel Poisson HMM forced alignment with hard and soft probability targets, demonstrating that alignment quality dominates decoding performance (17+ pp gap between Gaussian and Poisson HMM).",
      "Showed multi-session training across 10 recording sessions yields a 10.1 pp CER improvement, and soft probability labels boost frame accuracy by 1.8-5.0 pp at zero additional cost.",
    ],
    image: "/previews/neural-decoding.svg",
    headlineStats: [
      { value: "55.86%", label: "Best character error rate (Conformer, multi-session)" },
      { value: "4", label: "Decoder architectures benchmarked head-to-head" },
      { value: "+17pp", label: "Gain from Poisson vs Gaussian HMM alignment" },
    ],
    caseStudy: {
      problem:
        "Restoring communication for people who cannot speak or move means decoding intended movement directly from neural activity. Brain-to-text from intracortical recordings is promising but noisy, and it is unclear which decoder architectures and alignment strategies actually drive performance.",
      approach:
        "I ran a systematic, controlled comparison: four neural sequence decoders crossed with three HMM forced-alignment strategies, on 192-channel intracortical recordings, building directly on Willett et al. (Nature 2021). The goal was to isolate what matters: architecture, alignment, or data scale.",
      architecture: [
        "Preprocess 192-channel intracortical neural recordings into windowed, labeled sequences.",
        "Force-align with Gaussian and a novel Poisson HMM, using both hard and soft probability targets.",
        "Decode with four architectures: GRU, RCNN, Conformer, and CTC.",
        "Evaluate by character error rate (CER) across single- and multi-session training regimes.",
      ],
      findings: [
        "Architecture ranking reverses with data scale: RCNN leads at 89 sentences, but Conformer wins at 574 sentences (55.86% CER).",
        "Alignment quality dominates: a 17+ pp gap separates Poisson from Gaussian HMM forced alignment.",
        "Multi-session training (10 sessions) improves CER by 10.1 pp; soft probability labels add 1.8-5.0 pp frame accuracy at zero extra cost.",
      ],
      results: [
        { metric: "Best CER (multi-session)", value: "55.86%", note: "Conformer, 574 sentences" },
        { metric: "Best single-session CER", value: "65.97%", note: "RCNN, 89 sentences" },
        { metric: "Alignment effect", value: "+17 pp", note: "Poisson vs Gaussian HMM" },
        { metric: "Multi-session training", value: "+10.1 pp", note: "CER, across 10 sessions" },
        { metric: "Soft labels", value: "+1.8-5.0 pp", note: "Frame accuracy, zero added cost" },
      ],
      limitations: [
        "Best CER (~56%) is well short of deployable accuracy. This is a methodology study, not a product.",
        "Evaluated on a single public dataset (Willett et al.); cross-subject generalization is untested.",
        "Offline decoding only, with no real-time or closed-loop evaluation.",
      ],
      future: [
        "Explore self-supervised pretraining on larger neural corpora.",
        "Test transfer across subjects and recording sessions.",
        "Move toward real-time decoding under closed-loop latency constraints.",
      ],
    },
  },
  {
    slug: "uci-heart-disease-ml",
    title: "Heart Disease | Multi-Site Clinical ML Study",
    subtitle:
      "Does a heart-disease model trained at one set of hospitals work at a hospital it has never seen? Leave-one-hospital-out external validation, calibration, decision curves, conformal abstention, and a fairness audit across 4 cohorts (n=920)",
    tags: ["Healthcare AI", "Clinical ML"],
    modelTypes: ["Healthcare AI"],
    languages: ["Python"],
    stack: [
      "Python",
      "scikit-learn",
      "SHAP",
      "SciPy",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "pytest",
      "GitHub Actions CI",
    ],
    metrics: [
      "Generalization gap: pooled-CV AUC 0.88 falls to 0.80 out-of-hospital",
      "All 3 model families indistinguishable by AUC (all DeLong p > 0.3)",
      "7-feature clinical baseline ties the full model (p = 0.68)",
      "Fairness: misses disease in women 2.4x as often as men",
      "Split-conformal coverage 0.908 at a 90% target",
    ],
    links: {
      github: "https://github.com/AaronHo3/UCI_Heart_Disease_ML",
      demo: "",
      report: "https://github.com/AaronHo3/UCI_Heart_Disease_ML/blob/main/REPORT.md",
    },
    summary:
      "A clinical-ML methodology study on the UCI heart-disease cohorts (n=920) that asks the question the leaderboard ignores: does a classifier trained on some hospitals work on a hospital it has never seen? The prediction itself is easy and well-trodden, so the project spends its effort on trustworthiness instead. The answer is sobering and is the point: pooled cross-validation (AUC 0.88) overstates transfer into an unseen hospital by roughly 0.08 to 0.09 AUC, probability calibration breaks under cross-site label shift, the three model families are statistically indistinguishable, and a 7-feature clinical baseline ties the full model. Every discrimination number carries a 95% bootstrap confidence interval and every model comparison carries a DeLong test.",
    bullets: [
      "Reframed a standard 3-model comparison into a multi-site external-validity study: holding out each of the Cleveland, Hungary, Switzerland, and VA cohorts in turn drops pooled-CV AUC 0.879 to 0.802 for logistic regression, 0.876 to 0.794 for random forest, and 0.866 to 0.778 for gradient boosting, so the simplest model transfers best while one site (VA Long Beach) collapses to AUC 0.66 [0.56, 0.76].",
      "Made the numbers honest: nested cross-validation to strip tuning bias, bootstrap 95% CIs on every metric, and DeLong tests showing the three models are statistically indistinguishable (every pairwise p > 0.3) and that a 7-feature clinical baseline ties the full 13-feature model (p = 0.68), so the added complexity buys nothing a clinician could act on.",
      "Traced one root cause, label shift across sites (prevalence 36% to 94%), through calibration drift (ECE up to 0.30), a missingness probe that predicts the hospital at 86% accuracy but disease at chance within a single cohort, and a fairness audit where a global threshold misses women's disease 2.4x as often as men's, then shipped SHAP (8/8 features cardiologically correct), split-conformal abstention (0.908 coverage at a 90% target, defers on 27%), a model card, a datasheet, 27 unit tests, and CI.",
    ],
    image: "/previews/uci-heart-disease.svg",
    headlineStats: [
      { value: "0.88 → 0.80", label: "Pooled-CV AUC vs. mean AUC inside a held-out hospital, for the best-transferring model; gradient boosting falls further, 0.87 to 0.78" },
      { value: "2.4×", label: "At a single threshold the model misses disease in women 2.4x as often as in men (a label-shift harm)" },
      { value: "7 ≈ 13", label: "A 7-feature clinical baseline ties the full 13-feature model (DeLong p = 0.68): complexity didn't help" },
    ],
    caseStudy: {
      problem:
        "Heart-disease prediction on the UCI cohorts is one of the most over-fit benchmarks in machine learning, so another high accuracy number proves almost nothing. The questions that actually decide whether a clinical model is trustworthy go unasked: does a model trained at one set of hospitals generalize to a hospital it has never seen, are its probabilities calibrated well enough to act on, does it improve decisions over a simple standard of care, is it equally accurate for every patient, and can it say when it does not know?",
      approach:
        "I treated the dataset's four hospital cohorts as a built-in multi-site experiment and rebuilt the study around external validity and clinical usefulness rather than leaderboard accuracy. Linear and tree-based models are evaluated both the usual pooled way and with leave-one-hospital-out validation, then stress-tested with calibration analysis, decision-curve net benefit, interpretability, conformal uncertainty, and a subgroup fairness audit. Every discrimination number carries a 95% bootstrap confidence interval and every model comparison carries a DeLong test, so the write-up can distinguish a real effect from noise.",
      architecture: [
        "Aggregate the four UCI cohorts (n=920), keep the hospital column strictly as a grouping variable rather than a feature, and recode the known data-quality artifact (cholesterol coded 0 across all of Switzerland and part of VA) as missing.",
        "Train scikit-learn pipelines (logistic regression, random forest, histogram gradient boosting) under 5-fold outer / 3-fold inner nested cross-validation so hyperparameter tuning does not optimistically bias the reported metrics.",
        "Evaluate two ways: pooled stratified CV and leave-one-hospital-out, quantifying the cross-site generalization gap and tracing it to label, covariate, and feature-support shift between cohorts.",
        "Assess trustworthiness with reliability curves (Brier, ECE), Platt and isotonic recalibration, decision-curve net benefit against treat-all and treat-none, and a parsimonious 7-feature clinical-proxy baseline.",
        "Probe the missing data directly: test whether the missingness pattern is clinical signal or a hospital-identity shortcut, and check whether the choice of imputer (median, MICE, KNN) changes any conclusion.",
        "Explain predictions with SHAP, permutation importance, and partial dependence, cross-check the direction of every effect against cardiology, then add split-conformal prediction sets and a sex and age subgroup fairness audit.",
        "Lock it down for reproducibility: a single seed throughout, one make target per analysis, a provenance manifest recording commit and library versions, 27 unit and smoke tests, and CI.",
      ],
      findings: [
        "The generalization gap is real and consistent: scored as the mean AUC inside each held-out hospital, transfer costs 0.077 AUC for logistic regression (0.879 to 0.802), 0.082 for random forest (0.876 to 0.794), and 0.088 for gradient boosting (0.866 to 0.778). The simplest model transfers best, because the flexible learners are partly fitting site-specific structure. Pooling every out-of-site prediction into one AUC looks milder, but that scoring rewards ranking a high-prevalence cohort above a low-prevalence one, which is exactly the prevalence-proxy effect the missingness analysis isolates.",
        "A single number hides outright failure: held out per site, gradient boosting ranges from 0.84 at Hungary down to 0.66 [0.56, 0.76] at VA Long Beach, barely better than chance. Predicted probabilities barely move (about 0.47 to 0.64) while true prevalence spans 0.36 to 0.94, so every site sits below the calibration diagonal and ECE climbs to 0.30. The model exports the prevalence it was trained on.",
        "Complexity didn't pay off: nested-CV AUCs are 0.880 / 0.875 / 0.880 with all three pairwise DeLong tests non-significant (p = 0.35, 0.96, 0.33), and a 7-feature clinical baseline (AUC 0.881) is statistically indistinguishable from the 13-feature gradient-boosting model (0.874), DeLong p = 0.68. On net benefit the full model only overtakes treat-all above a 0.14 threshold, while the simpler proxy beats treat-all across nearly the entire threshold range.",
        "The missing data is a hospital fingerprint, not clinical information: the missingness pattern alone predicts which hospital a patient came from with 86% accuracy, and 'predicts' disease at AUC 0.747 pooled but 0.498, exactly chance, within the one complete cohort. Re-adding the site column as a feature inflates pooled AUC by 0.025, which is why it stays out.",
        "Equal AUC hid an equity gap: discrimination is essentially identical between sexes (0.869 vs 0.855), yet at a single 0.5 threshold the model misses disease in women 2.4x as often as in men (FNR 0.36 vs 0.15). The mechanism is the same label shift as everything above, since women's prevalence here is 26% against 63% for men, and it mirrors the real-world under-diagnosis of heart disease in women.",
        "The model is trustworthy where it should be: all 8 features checked against established cardiology are learned in the correct direction, and split-conformal prediction hits its 90% coverage target (0.908 over 100 random splits) while returning an honest 'uncertain' set for 27% of patients, an actionable refer-for-more-testing signal that a bare probability cannot express.",
      ],
      results: [
        { metric: "Generalization gap", value: "0.88 → 0.80", note: "Pooled-CV vs. mean within-held-out-hospital AUC (logistic regression); RF 0.88 → 0.79, GB 0.87 → 0.78" },
        { metric: "Worst-site AUC", value: "0.66", note: "VA Long Beach held out [0.56, 0.76], near chance under heavy shift" },
        { metric: "Model comparison", value: "all p > 0.3", note: "Nested-CV AUC 0.880 / 0.875 / 0.880; 3 families indistinguishable (DeLong)" },
        { metric: "Clinical baseline", value: "7 ≈ 13", note: "7-feature proxy 0.881 vs. full model 0.874; DeLong p = 0.68" },
        { metric: "Net benefit", value: "0.14", note: "Threshold above which the full model beats treat-all; the 7-feature proxy beats it almost everywhere" },
        { metric: "Calibration drift", value: "0.03 → 0.31", note: "Logistic-regression ECE pooled in-distribution vs. its worst held-out site (Switzerland)" },
        { metric: "Missingness probe", value: "86% vs. chance", note: "Predicts the hospital at 0.855 accuracy but disease at AUC 0.498 within Cleveland" },
        { metric: "Fairness (sex)", value: "2.4×", note: "FNR 0.36 (women) vs. 0.15 (men) at a single 0.5 threshold" },
        { metric: "Conformal coverage", value: "0.908", note: "90% target met over 100 splits; abstains on 27% of patients" },
        { metric: "Face validity", value: "8/8", note: "Every feature checked against cardiology priors has the correct signed coefficient" },
      ],
      limitations: [
        "Small, decades-old data (n=920 across 4 cohorts): a methodology study and a learning exercise, not a medical device or a deployable tool, with limited subgroup power, especially for women.",
        "Switzerland and VA Long Beach have few negatives and heavy missingness, so their per-site numbers carry wide CIs and shouldn't be point-read. Switzerland has only 8 negatives and its interval spans 0.35 of AUC.",
        "Feature-support shift bounds transfer: outside Cleveland the classically most predictive features are largely absent (ca 98% missing, thal 78%, slope 50%), and swapping median imputation for MICE or KNN moves AUC by less than its own confidence interval, so no imputer recovers them.",
        "The clinical proxy is a plain 7-variable logistic regression, not a validated score, since the data lacks the HDL, smoking, and diabetes detail Framingham and ASCVD need. Split-conformal guarantees marginal, not per-subgroup, coverage, and the sex breakdown shows the gap (0.792 for men vs 0.840 for women at a 0.80 target).",
        "The fairness audit reports the gaps but does not fix them: group-aware thresholds are proposed, not fitted or evaluated. Conformal prediction is also run in-distribution only, where the exchangeability its guarantee depends on actually holds.",
      ],
      future: [
        "Fit group-conditional (Mondrian) conformal prediction and group-aware, prevalence-adjusted thresholds, then re-audit the women's false-negative gap to confirm the fix actually closes it.",
        "Apply label-shift correction, such as prevalence re-weighting or domain adaptation, to recover the cross-site calibration that recalibrating on the source hospitals cannot.",
        "Replicate on a prospective, multi-site cohort with consistent feature collection, which would remove the feature-support shift that bounds transfer here.",
        "Carry the study's own recommendation forward: logistic regression with group-aware thresholds and conformal abstention, since it transfers best, is interpretable, is statistically as accurate as anything more complex, and can quantify its uncertainty with a guarantee.",
      ],
    },
  },
];