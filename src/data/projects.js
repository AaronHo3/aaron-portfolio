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
 *   hidden: boolean                          // true = not listed, not routable, not in related projects;
 *                                            //   delete the line to show the project again
 *   headlineStats: [{ value, label }]        // big stat callouts at the top
 *   caseStudy: {
 *     problem:      string | [string],        // motivation; an array renders as paragraphs
 *     approach:     string | [string],        // the strategy; an array renders as paragraphs
 *     architecture: [string],                 // ordered method/pipeline steps
 *     findings:     [string | { title, text }],// (optional) key takeaways; title = short heading
 *     results:      [{ metric, value, note }],// results table rows
 *     limitations:  [string],                 // honest constraints
 *     future:       [string],                 // future work / open questions
 *   }
 *
 * Optional presentation fields (cards and case-study header). Keep them
 * consistent with the full content above; never add numbers that are not
 * already stated in this entry.
 *
 *   displayTitle:  string    // short card/page title, e.g. "GutSense" (full `title` is kept)
 *   intro:         string    // case-study opening: the question or purpose first, methods later
 *   cardSummary:   string    // card description: the question or product, ~20-35 words
 *   highlight:     string    // card takeaway: the main finding with enough context, ~12-25 words
 *   thumbnail:     string    // simplified card image in public/thumbnails/ (16:9)
 *   imageCaption:  string    // caption for `image` on the case-study page
 *   imageSize:     [w, h]    // intrinsic size of `image` if not 1600x900 (prevents layout shift)
 *   context:       string    // where/why the work happened (event, dataset, team)
 *   status:        string    // maturity and honest scope, e.g. "Prototype; not clinically validated"
 *   channels:      [{ name, text }] // (Score the Story) the two control channels
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
      "OpenAI Embeddings",
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
    imageSize: [1640, 1052],
    displayTitle: "GutSense",
    intro:
      "Colorectal cancer is highly survivable when caught early, but screening is invasive and easy to put off. At MIT Grand Hack 2026, our team prototyped a continuous at-home alternative: a designed toilet-mounted biosensor feeding an 8-biomarker risk model, with clinical narratives grounded in each patient's own records.",
    cardSummary:
      "A hackathon prototype for continuous colorectal-cancer screening that turns eight stool biomarkers into a risk score and clinical narratives grounded in the patient's records.",
    highlight:
      "3rd Place, InterSystems Challenge, MIT Grand Hack 2026. The risk model was trained on synthetic data.",
    thumbnail: "/thumbnails/gutsense.svg",
    imageCaption: "System architecture of the prototype: biosensor design, 8-biomarker risk engine, IRIS vector retrieval over FHIR records, and Claude-generated narratives. The biosensor is an architectural specification, not a fabricated device.",
    context: "Team project, MIT Grand Hack 2026 (InterSystems Challenge)",
    status: "Hackathon prototype. Risk model trained on synthetic data; not clinically validated.",
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
        "The risk MLP was trained on 5,000 synthetic patient samples whose labels come from the sigmoid scoring formula itself, so it approximates that formula rather than learning from clinical outcomes; validation on labeled clinical CRC cohorts is the critical next step.",
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
    displayTitle: "Score the Story",
    intro:
      "Live narration, from theater to tabletop games to audiobooks, has no music that follows the moment. I built a real-time instrument where a narrator's voice is the controller: how they speak shapes the texture, what they say sets the scene, and DeepMind's Magenta RealTime 2 composes the score live.",
    cardSummary:
      "Can music follow a story while it is being told? A real-time instrument where a narrator's voice steers a live generative score, with no pre-composed music.",
    highlight:
      "Pairing how something is said with what is said made the score feel intentional. Evaluation is qualitative so far.",
    thumbnail: "/thumbnails/score-the-story.svg",
    imageCaption: "Signal flow: live narration feeds a prosody channel (how it is said) and a Whisper-to-Claude semantic channel (what is said), which together steer Magenta RealTime 2 to generate the score in real time.",
    context: "Google DeepMind challenge, Music Technology Hackathon 2026",
    status: "Working prototype. Evaluation is qualitative so far.",
    channels: [
      {
        "name": "Prosody: how it is said",
        "text": "Energy, pitch, speech rate, and spectral brightness are extracted from live narration and mapped, via running auto-gain normalization, to MRT2 controls: energy drives density/chaos, brightness drives a dark-to-bright prompt blend, and silence pulls the texture sparse."
      },
      {
        "name": "Semantics: what is said",
        "text": "Whisper transcribes the narration and Claude reads the transcript to emit two scene style poles (a darker/tenser pole and a brighter/triumphant pole) that MRT2 embeds and morphs between, replacing brittle keyword maps with live language understanding."
      }
    ],
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
        {
          title: "Two channels cover each other's blind spots",
          text: "Separating how it's said (prosody) from what's said (semantics) is what makes the score feel intentional rather than reactive and jittery - each channel covers the other's blind spot.",
        },
        {
          title: "Normalization matters more than the exact mapping",
          text: "Smoothing and running normalization matter more than the exact feature-to-parameter mapping: auto-gain keeps the instrument expressive across different speakers and rooms with no per-user calibration.",
        },
        {
          title: "A deterministic identity is enough",
          text: "A deterministic timbre-to-identity mapping is enough to give each narrator a recognizable musical signature without training a learned speaker model.",
        },
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
    title: "Neural Decoding | What Actually Limits Brain-to-Text",
    subtitle:
      "Brain-to-text decoders are trained on labels no one ever observed. I injected controlled error into those labels across 198 runs to find out which kind of alignment mistake actually costs accuracy, and pre-registered the hypothesis it went on to refute",
    tags: ["Neuroscience", "Healthcare AI"],
    modelTypes: ["Neuroscience", "Healthcare AI"],
    languages: ["Python"],
    stack: ["Python", "PyTorch", "NumPy", "SciPy", "Matplotlib", "pytest"],
    metrics: [
      "Timing errors on 17% of frame labels cost 0 pp; identity errors on the same 17% cost 6.8 pp",
      "Identity errors are 2.4-10.8x steeper than timing errors, across every architecture",
      "Sequence truncation inverted the architecture conclusion: 1.64 pp spread became 17.55 pp",
      "Pre-registered hypothesis refuted and inverted (0.54x); reported unmodified",
      "198 runs, 0 failures, 18 conditions bit-identical on independent re-run",
    ],
    links: {
      github: "https://github.com/AaronHo3/neural_decoding_imagined_handwriting",
      demo: "",
      report:
        "https://github.com/AaronHo3/neural_decoding_imagined_handwriting/blob/main/docs/RQ1_alignment_error_types.md",
    },
    summary:
      "In the standard brain-to-text pipeline (Willett et al., Nature 2021) a hidden Markov model force-aligns neural recordings to prompted text, assigning a character label to every 10 ms bin, and the decoder trains on those labels. Nobody ever observed which character the participant was imagining at a given bin, so the supervision is an estimate and every decoder inherits its error. The field has studied decoder architectures and language models extensively while treating this alignment stage as fixed infrastructure. I measured what it actually costs by injecting controlled corruption into the labels and observing the response across two corruption models, five severity levels, three architectures, three seeds and two sequence lengths. The result is an asymmetry: mistiming a character boundary is nearly free, while mislabeling a character is expensive. A secondary and more cautionary finding is that an earlier version of this same experiment, run at truncated sequence length, produced the opposite architecture conclusion, and only a pre-committed control caught it.",
    bullets: [
      "Found that alignment error TYPE matters far more than error RATE: displacing character boundaries so up to 17% of frame labels change has no measurable effect on the best decoder (-1.0, -0.7, -0.7 pp at 4%, 8%, 17% of frames), while relabeling the same proportion to the wrong character costs +2.8, +4.6 and +6.8 pp and keeps climbing to +17.1 pp. Corruption is 2.4x steeper than jitter for the RCNN, 3.3x for the GRU, and 10.8x for the Conformer. The mechanism is that 51-frame posterior smoothing against 75-frame characters absorbs mistimed boundaries, while a wrong identity is unrecoverable at any smoothing width and teaches the network a wrong mapping. The practical consequence is a design target: a forced aligner needs to be identity-correct, not temporally precise.",
      "Caught a confound that had inverted my own conclusion. Run at 1500-bin truncated sequences, the three decoders looked statistically indistinguishable (1.64 pp architecture spread against a 2.32 pp seed noise floor) and label quality appeared to dominate 3.77x. Re-running the identical grid at full 3000-bin length separated them by 17.55 pp (RCNN 67.3%, GRU 74.2%, Conformer 86.5% clean CER) and inverted the ratio to 0.54x. Truncation compresses character error rate toward a ceiling and erases the architecture signal, so benchmarks on this dataset at reduced sequence length may be measuring the ceiling rather than the model. Both grids are committed as paired evidence.",
      "Built the study so the refutation was possible: hypotheses, sweep grids and falsification criteria written down before any run; the deciding control's interpretation rule fixed in advance; every run emitting a JSON artifact with metrics, config, seed and git SHA (stamped '-dirty' on a modified tree); figures generated only from artifacts; and 37 tests including an integrity suite that fails if a number in the write-up drifts from the data backing it. 18 conditions run twice independently returned bit-identical error rates, so the quoted noise floor is initialization variance alone. That determinism was observed empirically on one GPU configuration rather than enforced by cuDNN flags, so it is a statement about these results, not a portable guarantee.",
    ],
    image: "/previews/neural-decoding.svg",
    displayTitle: "Neural Decoding",
    intro:
      "Brain-to-text decoders learn from character labels that no one ever observed; a forced aligner estimates them. I measured which kinds of label error actually cost accuracy by injecting controlled errors across 198 training runs, and I report the pre-registered hypothesis that the results refuted.",
    cardSummary:
      "Testing how errors in training labels affect brain-to-text decoders, across 198 controlled runs on an imagined-handwriting dataset from one participant.",
    highlight:
      "In this study, character identity errors cost far more accuracy than timing errors: 2.4 to 10.8 times steeper.",
    thumbnail: "/thumbnails/neural-decoding.svg",
    imageCaption: "Study overview: boundary jitter (right characters, wrong times) versus identity corruption (right times, wrong characters), injected in controlled amounts and measured as character error rate cost. Data: Willett et al. (2021) intracortical handwriting recordings.",
    context: "Research project on the Willett et al. (2021) imagined-handwriting dataset",
    headlineStats: [
      {
        value: "17% → 0 pp",
        label:
          "Up to 17% of frame labels can be mistimed at no measurable cost. The same 17% relabeled to the wrong character costs 6.8 pp of character error rate",
      },
      {
        value: "2.4-10.8×",
        label:
          "How much steeper character-identity errors are than boundary-timing errors, consistently across all three decoder architectures",
      },
      {
        value: "1.6 → 17.6 pp",
        label:
          "Architecture spread once sequence truncation is removed. At truncated length the decoders looked indistinguishable; the effect was a ceiling artifact",
      },
    ],
    caseStudy: {
      problem: [
        "Willett et al. (2021) decode imagined handwriting at over 90 characters per minute, and their pipeline has become the template for the field. It has three stages: an HMM force-aligns neural recordings against the prompted sentence to produce a character label for every 10 ms bin, a recurrent network trains on those labels, and a language model rescores the output.",
        "Stage two is supervised entirely by stage one, and stage one's labels are not ground truth. They come from a generative model fit to isolated single letters and transferred to continuous sentences, and no one observed the true label of any individual bin.",
        "Subsequent work has explored decoders and language models thoroughly while adopting the alignment stage as given, so the literature does not report how much decoding error is attributable to alignment error, nor which KIND of alignment error is expensive.",
        "Forced alignment can fail two ways: it can find the right characters but mislocate the transitions, or it can assign the wrong character entirely. Those are different failures with different fixes.",
      ],
      approach: [
        "Ground truth for frame labels does not exist, so the absolute cost of alignment error cannot be measured directly. What can be measured is the derivative: degrade the labels by a known amount and observe the response.",
        "I treated controlled corruption as an instrument rather than as an attempt to improve anything, using two corruption models chosen to mirror the two real failure modes, applied to training labels only so the evaluation metric is never perturbed.",
        "The test set is 10 sentences, fixed by the dataset and not negotiable, which is too few to support pairwise comparisons. So every experiment is a dose-response sweep across five pre-specified severity levels with three seeds: a monotone trend in a predicted direction is evidence even when adjacent points are individually indistinguishable, whereas a single A-beats-B gap is not. The sweep, not the comparison, is the unit of evidence.",
        "Hypotheses and falsification criteria were fixed in writing before anything ran.",
      ],
      architecture: [
        "Take Willett et al.'s own precomputed HMM forced-alignment output as the zero-corruption reference condition, treating it as the best available labels rather than as ground truth.",
        "Inject boundary jitter: displace each character-segment boundary by a Gaussian perturbation (sigma 0 to 40 frames), then repair ordering so segments stay monotone. Character identity and sequence are preserved; only transition times move.",
        "Inject segment corruption: relabel each character segment to a uniformly random different character with probability 0 to 0.40. Boundaries are preserved exactly; only identities change.",
        "Record the MEASURED fraction of frames whose label actually changed, so the x-axis is a real observed quantity and the two corruption models can be compared at matched damage rather than at matched knob settings.",
        "Train three decoders per condition (GRU, Conv1D+GRU hybrid, Conformer) for 80 epochs, decode via posterior smoothing, temporal collapse, and beam search rescored by a character bigram language model, and score character error rate against the true prompt text.",
        "Sweep the full grid at three seeds, then repeat the entire grid at a second sequence length after a baseline disagreement suggested truncation was distorting the result.",
      ],
      findings: [
        {
          title: "Error type matters more than error rate",
          text: "Alignment error type dominates alignment error rate. For the best decoder, displacing boundaries so 4%, 8% and 17% of frame labels change moves character error rate by -1.0, -0.7 and -0.7 pp: no effect, well inside the 4.17 pp noise floor. Corrupting identities over the same range costs +2.8, +4.6 and +6.8 pp immediately and roughly linearly, then accelerates to +17.1 pp. Across architectures corruption is 2.4x to 10.8x steeper than jitter. This is a mechanistic result rather than a correlation, and it gives aligner design a concrete target: prioritize getting the character sequence right over tightening boundary placement.",
        },
        {
          title: "Sequence truncation inverted the architecture conclusion",
          text: "Sequence truncation can invert an architecture conclusion. The first full grid, run at 1500-bin sequences to afford the run count, showed a 1.64 pp architecture spread sitting BELOW the 2.32 pp seed noise floor, implying the three decoders were indistinguishable and that label quality dominated them 3.77x. The identical grid at 3000 bins gives a 17.55 pp architecture spread and a 0.54x ratio. Truncating to 15 seconds cuts the tail off longer test sentences, inflating error toward a ceiling near 78% for every condition and compressing every effect. The failure was silent: each number was reproducible, seeds agreed, trends were monotone, and the conclusion was still an artifact.",
        },
        {
          title: "The pre-registered hypothesis was refuted, and inverted",
          text: "The pre-registered central hypothesis was refuted, and inverted. It predicted label quality would dominate architecture; at full sequence length architecture dominates label quality roughly two to one. Both effects clear the noise floor, so both are real. A second hypothesis, that architecture rankings would be unstable under label noise, was also refuted: the RCNN wins at 9 of 10 corruption levels. Both predictions are reported unmodified, and the interpretation rule that produced the verdict was written down before the deciding control ran.",
        },
        {
          title: "Why the surviving finding is more useful",
          text: "The finding that survived is more useful than the one predicted. 'Label quality matters more than architecture' would have been a claim about relative magnitudes, sensitive to which architectures happened to be in the comparison set. 'Timing errors are nearly free while identity errors are expensive' is a claim about mechanism, and it held across every architecture and strengthened once the truncation confound was removed.",
        },
      ],
      results: [
        { metric: "Boundary jitter, 17% of frames", value: "-0.7 pp", note: "No measurable cost (RCNN); noise floor is 4.17 pp" },
        { metric: "Identity corruption, 20% of frames", value: "+6.8 pp", note: "Same decoder, comparable damage rate" },
        { metric: "Corruption vs jitter steepness", value: "2.4-10.8×", note: "RCNN 2.4x, GRU 3.3x, Conformer 10.8x" },
        { metric: "Architecture spread, truncated", value: "1.64 pp", note: "Below the 2.32 pp noise floor: decoders looked identical" },
        { metric: "Architecture spread, full length", value: "17.55 pp", note: "Same grid, 3000-bin sequences; 4.2x the noise floor" },
        { metric: "Best clean-label CER", value: "67.3%", note: "RCNN; GRU 74.2%, Conformer 86.5%" },
        { metric: "Pre-registered hypothesis", value: "Refuted", note: "Predicted label quality dominates; ratio came out 0.54x" },
        { metric: "Reproducibility", value: "0.000000 pp", note: "Max CER difference across 18 independently repeated conditions; observed on one GPU configuration, not enforced by cuDNN flags" },
      ],
      limitations: [
        "One participant, one session. All results come from a single session of participant T5 in the Willett et al. dataset; nothing here establishes generality across subjects, implant sites, or recording sessions.",
        "Ten test sentences, fixed by the dataset partition. Addressed by sweep design rather than solved: individual cells remain unstable (one condition shows an 11.4 pp seed spread against a 4.17 pp mean), so trends are reportable and individual cells are not.",
        "The corruption models are stylized proxies, not measured failure modes of a real aligner. This measures sensitivity to a MODEL of alignment error, and a real aligner's mistakes are likely correlated with the neural data in ways this does not capture.",
        "The zero-corruption reference is Willett et al.'s HMM output, which contains unknown error of its own. All effects are relative to that baseline, so the true cost of alignment error is underestimated by whatever the baseline already contains.",
        "A character bigram language model, far weaker than the RNN language model in the original work. Absolute error rates here are high and are not the contribution; no comparison to Willett's 5.32% CER would be meaningful.",
        "No hyperparameter search. The Conformer in particular may be undertrained rather than fundamentally unsuited, so its result should not be read as evidence about attention mechanisms in general.",
      ],
      future: [
        "Cross-session calibration efficiency, the clinically important question this does not answer: intracortical recordings drift over weeks, so when a decoder meets a new session, how little new data recovers accuracy and which adaptation strategy is most efficient at small budgets? If per-channel statistics recalibration alone suffices at 5 sentences, drift is largely first-order and roughly two minutes of calibration would do, which is a real quality-of-life result for someone using such a device daily.",
        "Alignment-free training: CTC needs no frame labels and is therefore immune to the corruption studied here. Given a matched decoding pipeline, is there a label-quality threshold below which abandoning forced alignment is the better choice? The asymmetry result implies any such threshold is governed by identity error rate rather than boundary precision.",
        "Measuring a real aligner's error modes by running the Gaussian and Poisson HMM implementations in this repository against the reference labels, to establish where an actual aligner sits on these dose-response curves.",
        "Resolving the Conformer: its poor showing is corroborated by an independent run, but undertraining has not been excluded. Gradient accumulation, longer warmup, or a restricted attention window would separate a data-hunger explanation from an optimization one.",
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
    displayTitle: "Heart Disease",
    intro:
      "I tested whether heart-disease models remain reliable when transferred to a hospital they have never seen. Holding out each of four UCI hospital cohorts (n=920) in turn, I checked not just accuracy but whether the probabilities, decisions, and error rates held up across sites and patient groups.",
    cardSummary:
      "Do heart-disease models stay reliable at a hospital they have never seen? A methodology study across four UCI hospital cohorts (n=920).",
    highlight:
      "Pooled cross-validation overstated transfer: logistic regression AUC fell from 0.88 to 0.80 at held-out hospitals.",
    thumbnail: "/thumbnails/heart-disease.svg",
    imageCaption: "Study design schematic: leave-one-hospital-out validation across four cohorts, three model families under nested cross-validation, then calibration and decision-curve analysis.",
    context: "Methodology study on the UCI heart-disease cohorts",
    status: "A methodology study and learning exercise, not a medical device or deployable tool.",
    headlineStats: [
      { value: "0.88 → 0.80", label: "Pooled-CV AUC vs. mean AUC inside a held-out hospital, for the best-transferring model; gradient boosting falls further, 0.87 to 0.78" },
      { value: "2.4×", label: "At a single threshold the model misses disease in women 2.4x as often as in men (a label-shift harm)" },
      { value: "7 ≈ 13", label: "A 7-feature clinical baseline ties the full 13-feature model (DeLong p = 0.68): complexity didn't help" },
    ],
    caseStudy: {
      problem:
        "Heart-disease prediction on the UCI cohorts is one of the most over-fit benchmarks in machine learning, so another high accuracy number proves almost nothing. The questions that actually decide whether a clinical model is trustworthy go unasked: does a model trained at one set of hospitals generalize to a hospital it has never seen, are its probabilities calibrated well enough to act on, does it improve decisions over a simple standard of care, is it equally accurate for every patient, and can it say when it does not know?",
      approach: [
        "I treated the dataset's four hospital cohorts as a built-in multi-site experiment and rebuilt the study around external validity and clinical usefulness rather than leaderboard accuracy.",
        "Linear and tree-based models are evaluated both the usual pooled way and with leave-one-hospital-out validation, then stress-tested with calibration analysis, decision-curve net benefit, interpretability, conformal uncertainty, and a subgroup fairness audit.",
        "Every discrimination number carries a 95% bootstrap confidence interval and every model comparison carries a DeLong test, so the write-up can distinguish a real effect from noise.",
      ],
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
        {
          title: "Generalization: a consistent out-of-hospital gap",
          text: "The generalization gap is real and consistent: scored as the mean AUC inside each held-out hospital, transfer costs 0.077 AUC for logistic regression (0.879 to 0.802), 0.082 for random forest (0.876 to 0.794), and 0.088 for gradient boosting (0.866 to 0.778). The simplest model transfers best, because the flexible learners are partly fitting site-specific structure. Pooling every out-of-site prediction into one AUC looks milder, but that scoring rewards ranking a high-prevalence cohort above a low-prevalence one, which is exactly the prevalence-proxy effect the missingness analysis isolates.",
        },
        {
          title: "Calibration: per-site failure under label shift",
          text: "A single number hides outright failure: held out per site, gradient boosting ranges from 0.84 at Hungary down to 0.66 [0.56, 0.76] at VA Long Beach, barely better than chance. Predicted probabilities barely move (about 0.47 to 0.64) while true prevalence spans 0.36 to 0.94, so every site sits below the calibration diagonal and ECE climbs to 0.30. The model exports the prevalence it was trained on.",
        },
        {
          title: "Model complexity did not pay off",
          text: "Complexity didn't pay off: nested-CV AUCs are 0.880 / 0.875 / 0.880 with all three pairwise DeLong tests non-significant (p = 0.35, 0.96, 0.33), and a 7-feature clinical baseline (AUC 0.881) is statistically indistinguishable from the 13-feature gradient-boosting model (0.874), DeLong p = 0.68. On net benefit the full model only overtakes treat-all above a 0.14 threshold, while the simpler proxy beats treat-all across nearly the entire threshold range.",
        },
        {
          title: "Missing data is a hospital fingerprint",
          text: "The missing data is a hospital fingerprint, not clinical information: the missingness pattern alone predicts which hospital a patient came from with 86% accuracy, and 'predicts' disease at AUC 0.747 pooled but 0.498, exactly chance, within the one complete cohort. Re-adding the site column as a feature inflates pooled AUC by 0.025, which is why it stays out.",
        },
        {
          title: "Fairness: equal AUC hid an equity gap",
          text: "Equal AUC hid an equity gap: discrimination is essentially identical between sexes (0.869 vs 0.855), yet at a single 0.5 threshold the model misses disease in women 2.4x as often as in men (FNR 0.36 vs 0.15). The mechanism is the same label shift as everything above, since women's prevalence here is 26% against 63% for men, and it mirrors the real-world under-diagnosis of heart disease in women.",
        },
        {
          title: "Uncertainty and face validity",
          text: "The model is trustworthy where it should be: all 8 features checked against established cardiology are learned in the correct direction, and split-conformal prediction hits its 90% coverage target (0.908 over 100 random splits) while returning an honest 'uncertain' set for 27% of patients, an actionable refer-for-more-testing signal that a bare probability cannot express.",
        },
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
  {
    slug: "fantasy-basketball-draft-copilot",
    title: "Fantasy Draft Copilot | ESPN Nine-Category Draft Assistant",
    subtitle:
      "A side project for my ESPN fantasy basketball league with friends: a local draft assistant that ranks my next pick using learned player projections, the league's exact rules, and Monte Carlo matchup simulation, then tests its own advice in mock drafts",
    tags: ["Sports Analytics", "Side Project"],
    modelTypes: ["Sports Analytics"],
    languages: ["Python", "TypeScript"],
    stack: ["FastAPI", "React", "scikit-learn", "NumPy", "pandas", "SciPy", "SQLite", "nba_api", "pytest", "Vitest", "Playwright"],
    metrics: [
      "+0.53 ± 0.13 categories per matchup over value-order drafting (120 paired mock drafts, 2025-26)",
      "Learned ensemble ranked players better than the baseline in all 4 holdout seasons",
      "Monte Carlo refinement layer did not beat the simple ranking; kept as supplementary",
      "Runs locally: no accounts, no ESPN credentials",
    ],
    links: {
      github: "https://github.com/AaronHo3/fantasy_draft_simulator",
      demo: "",
      report: "https://github.com/AaronHo3/fantasy_draft_simulator/blob/Main/docs/MODEL_CARD.md",
    },
    summary:
      "A local-first draft assistant for ESPN nine-category fantasy basketball. You record picks as they happen and get a ranked, explained shortlist for your next pick: who adds the most value above the player you could still get next turn, which lineup slot they fill, what they add to each category, and how likely they are to be gone before you pick again.",
    bullets: [
      "Built player projections from ten seasons of NBA data with a ridge and gradient-boosting ensemble, validated on four held-out seasons and blended with ESPN's published projections.",
      "Encoded the league's exact rules (ESPN eligibility, roster slots, position caps, ties, punts) and a Monte Carlo draft-and-matchup simulation for lookahead and a punt advisor.",
      "Tested the advice in paired mock drafts and kept the parts that held up, dropping or demoting the parts that did not.",
    ],
    displayTitle: "Fantasy Draft Copilot",
    intro:
      "I wanted a tool for my ESPN league with friends that answers 'who should I take now, and why?', and I wanted to know whether its advice beats ordinary drafting before trusting it on draft day. The copilot ranks each pick with learned projections and the league's exact rules, and I tested every layer in mock drafts.",
    cardSummary:
      "A side project for my fantasy basketball league with friends: a draft assistant that ranks my next pick and tests its own advice in mock drafts.",
    highlight:
      "Beat value-order drafting by 0.53 categories per matchup in retrospective mock drafts, but no better than projected value alone.",
    thumbnail: "/thumbnails/fantasy-draft-copilot.svg",
    context: "Personal side project for an ESPN league with friends",
    status: "Working local app. Evaluation is retrospective and potentially leaky, not a rigorous draft backtest.",
    headlineStats: [
      { value: "+0.53", label: "Categories won per weekly matchup over value-order drafting (±0.13, 120 paired mock drafts, 2025-26)" },
      { value: "4 of 4", label: "Held-out seasons where the learned ensemble ranked players better than the hand-tuned baseline" },
      { value: "−0.32", label: "The Monte Carlo refinement layer versus the same bot (±0.31): not better, so it stays supplementary" },
    ],
    caseStudy: {
      problem: [
        "In a nine-category head-to-head league, the best pick depends on more than a player's overall rank: which categories your roster already covers, which lineup slots are still open, and who will still be available at your next turn.",
        "I wanted a tool for my own league that answers 'who should I take now, and why?', and I wanted to know whether its advice actually beats drafting by value order before trusting it on draft day.",
      ],
      approach: [
        "The copilot is a local web app (FastAPI and React) where picks are recorded as they happen. It ranks the next pick by value above replacement, where replacement is the best player likely to still be there at my following pick, and explains each suggestion by slot and category.",
        "Projections come from a learned model trained on ten seasons of NBA data and validated on four held-out seasons, blended with ESPN's published projections. A Monte Carlo layer simulates the rest of the draft and weekly matchups for lookahead and a punt advisor. Each layer was then tested in paired mock drafts against the same seat drafting another way.",
      ],
      architecture: [
        "Fetch NBA box-score history (nba_api) and ESPN's public player, eligibility, ADP and schedule endpoints, with no accounts or credentials.",
        "Project per-game production in nine categories plus minutes and games with an ensemble of ridge regression and gradient boosting per stat, trained only on seasons before the projection year, and keep shooting coherent (makes never exceed attempts).",
        "Standardize categories robustly over a fantasy-relevant pool, apply strategy weights (including punts), and rank by value above replacement at my next pick, with lineup legality solved as an assignment problem.",
        "Optionally refine the shortlist with draft rollouts and a correlated weekly matchup simulation, and estimate how likely each player is to be taken before my next pick.",
        "Evaluate every strategy in 120 paired mock drafts per setting (12 seats × 10 seeds), scored by the realized categories each finished roster wins per matchup.",
      ],
      findings: [
        {
          title: "The ranking beat value-order drafting, but not projected value alone",
          text: "Against a bot drafting by value order with positional need, the copilot's fast ranking won +0.53 ± 0.13 more categories per weekly matchup (79 better, 34 worse, 7 equal in 120 paired drafts) and about one category more than drafting from last season's numbers. It was not distinguishable from simply drafting by projected value (+0.06 ± 0.06), so the projection model, not the ranking logic, carried the result.",
        },
        {
          title: "The simulation layer did not earn its place",
          text: "The refined layer (draft rollouts plus weekly matchup simulation) scored −0.32 ± 0.31 against the same bot at a 2-second budget over 20 drafts, and −0.14 ± 0.29 at 8 seconds. More compute did not rescue it, so the shortlist stays ordered by the fast ranking and the simulation columns are labeled as not yet validated.",
        },
        {
          title: "Learned projections ranked players better in every holdout season",
          text: "Rank correlation between projected and realized fantasy value for the ensemble versus the hand-tuned baseline was 0.740 vs 0.720 (2022-23), 0.784 vs 0.775 (2023-24), 0.759 vs 0.718 (2024-25) and 0.659 vs 0.644 (2025-26). In paired drafts the ensemble's edge over the baseline averaged +0.38 categories per matchup and was never negative, though individual years ranged from +0.01 to +0.81 with standard errors near 0.1.",
        },
        {
          title: "Raw injury history is a trap",
          text: "Using last season's games played directly ranked players worse than the model's games-played projection in both years tested, and it lost categories in paired drafts in both years (−0.14 and −0.48 per matchup). Injuries do not repeat cleanly, so the model's projection, which regresses heavily toward the league norm, is used instead.",
        },
        {
          title: "An intuitive heuristic made drafts worse",
          text: "Weighting categories with diminishing returns (worth less where the roster is already strong) sounded right for head-to-head categories, but at its natural scale it cost 1.23 categories per matchup in 2025-26 and was at best a wash at gentler settings, so it was left off.",
        },
      ],
      results: [
        { metric: "Fast ranking vs value-order bot", value: "+0.53", note: "± 0.13 categories per matchup; 120 paired drafts, 2025-26" },
        { metric: "Fast ranking vs projected value alone", value: "+0.06", note: "± 0.06; not distinguishable" },
        { metric: "Drafting from last season's numbers vs bot", value: "−0.54", note: "± 0.11; the naive approach loses" },
        { metric: "Refined simulation layer vs bot", value: "−0.32", note: "± 0.31 at a 2 s budget (20 drafts); −0.14 ± 0.29 at 8 s" },
        { metric: "Ensemble vs baseline rank correlation", value: "4 of 4", note: "Better in every holdout season, 2022-23 to 2025-26" },
        { metric: "Fast recommendation latency", value: "8.9 ms", note: "p50 on a 600-player synthetic league (p95 10.3 ms)" },
      ],
      limitations: [
        "The evaluation is retrospective and potentially leaky: scoring uses eventual games played and final rosters, and past preseason ADP is not available, so opponents are a value-order bot rather than real drafters.",
        "Eligibility comes from the current ESPN snapshot rather than each past preseason, and holdout universes exclude rookies and players without a current ESPN link.",
        "Draft-edge results vary a lot by season (standard errors near 0.1 against single-year swings up to 0.8), so small margins should be read as ties.",
        "No injury forecasting: injury status is a label, and availability is a shrunk historical rate.",
        "The 50/50 blend with ESPN's projections is not validated, because the 2026-27 season has not been played yet.",
      ],
      future: [
        "Re-test the simulation layer with ADP-based opponents and more seeds, and remove it from the default flow if it still shows no gain.",
        "Measure coverage of the 80% projection intervals, which has not been run yet.",
        "Score the ESPN blend weight once the 2026-27 season can be evaluated, and re-check the ensemble as seasons accumulate.",
      ],
    },
  },
  {
    slug: "courtside-research-nba-analytics",
    hidden: true, // hidden for now; delete this line to show it again
    title: "Courtside Research | NBA Player & Team Analytics Workbench",
    subtitle:
      "A local-first research tool for exploring NBA players and teams from every angle the public data supports: league-wide scatter exploration, player profiles, a shot chart lab, offender-vs-defender matchups, lineups and on/off, transparent rankings, and a methodology page that documents every number",
    tags: ["Sports Analytics", "Side Project"],
    modelTypes: ["Sports Analytics"],
    languages: ["Python", "TypeScript"],
    stack: ["FastAPI", "pandas", "NumPy", "SciPy", "DuckDB", "Parquet", "React", "Vite", "Tailwind", "Plotly.js", "D3", "TanStack", "nba_api", "pytest", "Vitest", "Playwright", "Docker"],
    metrics: [
      "Eight analysis views over a resumable nba_api ingestion pipeline",
      "Live-ingested 2023-24 to 2025-26; season totals verified against summed game logs",
      "Clearly labelled synthetic demo league so the app works when stats.nba.com is unreachable",
    ],
    links: {
      github: "", // repo is private; add https://github.com/AaronHo3/nba_advanced_statistics once public
      demo: "",
      report: "",
    },
    summary:
      "A local-first workbench for exploring NBA players and teams: league-wide scatter exploration, player profiles with measurement provenance, an interactive shot chart lab, offender-vs-defender matchups, multi-player comparison, team rosters, lineups and on/off, transparent rankings, and a methodology page that documents every number.",
    bullets: [
      "Built a resumable nba_api ingestion pipeline that caches every raw response, writes normalized Parquet per data family, and records the status and coverage of each family, season, and season type in a manifest.",
      "Served the data through FastAPI and DuckDB to a React, Plotly, and D3 front end with a league explorer, player profiles, shooting lab, matchups, comparison, teams, rankings, and a methodology page.",
      "Added a deterministic, visibly labelled synthetic league so the app stays usable when stats.nba.com blocks the network, and kept it strictly separate from real data.",
    ],
    displayTitle: "Courtside Research",
    intro:
      "Public NBA data is rich but scattered across dozens of endpoints with different shapes and quirks. I built a local workbench to explore players and teams from every angle that data supports, where each number on screen can be traced back to how it was measured and computed.",
    cardSummary:
      "A local workbench for exploring NBA players and teams from every angle the public data supports, where each number traces back to how it was measured.",
    highlight:
      "Live data for 2023-24 to 2025-26 matched summed game logs after three provider quirks were fixed.",
    thumbnail: "/thumbnails/courtside-research.svg",
    context: "Personal side project",
    status: "Working local app. Real data ingested and verified for 2023-24 to 2025-26; code repository is currently private.",
    headlineStats: [
      { value: "8", label: "Analysis views: league explorer, player profiles, shooting lab, matchups, compare, teams, rankings, methodology" },
      { value: "3", label: "Seasons ingested live from stats.nba.com (2023-24 to 2025-26), with season totals checked against summed game logs" },
      { value: "2", label: "Data namespaces, real and a labelled synthetic demo, that never mix" },
    ],
    caseStudy: {
      problem: [
        "Public NBA data is rich but scattered across dozens of endpoints with different shapes, coverage start dates, and quirks, and the provider blocks or rate-limits many networks.",
        "I wanted one place to explore players and teams from every angle the public data supports, where each number on screen can be traced back to how it was measured and computed.",
      ],
      approach: [
        "The app is local-first: the browser never talks to the provider. A backend pipeline fetches cheap league summaries first and expensive families (game logs, lineups, on/off, defensive dashboards, matchups, league-wide shots) last, caching every raw response so runs resume where they stopped.",
        "Normalized data is stored as Parquet and queried through DuckDB by a FastAPI backend, and a React front end turns it into eight views. A methodology page documents formulas, thresholds, uncertainty, shooting geometry, and ranking construction, and a coverage matrix shows exactly which seasons and families are available.",
      ],
      architecture: [
        "Ingest with nba_api in a resumable pipeline: every raw response is cached, every normalized family is written to Parquet, and a manifest records status (ok, missing, stale, failed, partial), row counts, fetch times, and source for each family, season, and season type.",
        "Serve two namespaces, real NBA data and a deterministic synthetic demo league, which never mix; the demo is labelled on every page so it cannot be mistaken for real data.",
        "Compute analytics in the backend: metrics, uncertainty (Wilson intervals for shooting), shrinkage toward a league-wide prior for matchup efficiency, court geometry and shooting bins, percentiles, and user-defined composite ranking lenses.",
        "Present it in eight views: league explorer, player profile with measurement provenance, shooting lab with an interactive shot chart, offender-vs-defender matchups, multi-player comparison, team rosters with lineups and on/off, rankings, and a data and methods page.",
        "Test with pytest (analytics, data, demo invariants, API contract, ingestion fixtures), Vitest, and Playwright smoke tests; ship with Docker Compose.",
      ],
      findings: [
        {
          title: "Real totals reconcile with game logs",
          text: "The pipeline was run live against stats.nba.com for the 2025-26 regular season (all families) and for 2024-25 and 2023-24 from a residential US connection, and a verification step confirmed that player-season and team-season totals equal the provider's summed game logs.",
        },
        {
          title: "The provider data needed reconciling before analysis",
          text: "That live run surfaced three provider quirks, all handled in the pipeline: per-team player rows carry the player's current team id rather than the team for that stint; one turnover percentage is published on a 0-100 scale while every other percentage is a fraction; and the defensive dashboard names its made, attempted, and normal columns differently for each defense category.",
        },
      ],
      limitations: [
        "No adjusted impact metrics (no RAPM, EPM, RAPTOR, LEBRON or similar). On/off, plus-minus, net rating, and PIE are shown as the provider publishes them, unadjusted for teammates, opponents, minutes, or garbage time.",
        "No play-by-play possessions: per-100 rates inherit the provider's possession estimates, and no lineup or on/off figure is rebuilt from play-by-play.",
        "Shooting has no defender distance, shot clock, or shot-quality model, and Wilson intervals assume independent attempts, so they are somewhat too narrow.",
        "Matchup possessions are fractional and scheme-dependent, and shrinkage uses one league-wide prior rather than a position- or role-specific one.",
        "Ranking percentiles are computed within a season and do not remove era effects; overlapping components in a lens can double-count a signal.",
        "Historical coverage depends on the provider: matchups start in 2017-18, defensive dashboards in 2013-14, and shot locations in 1996-97. When stats.nba.com is unreachable, only the synthetic demo is available.",
      ],
    },
  },
];
