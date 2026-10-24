/* ==========================================================================
   CarouselCreator — Main Application Engine (v3)
   1080×1350 Continuous Panoramic Instagram Carousel Studio (Games & Magic)
   - Shift-lock axis movement (X / Y) from start point
   - Shift-rotate global 45° snapping
   - Space + Left Drag & Alt + Middle Mouse Canvas Panning
   - Snapping to Blue Visual Guidelines (Center X/Y, Margins, Bottom Bar)
   - Layer Overview filtered to currently active slide (overarching elements visible on all touched slides)
   - Streamlined Inspector: Controls popover via ⓘ button, removed XYZ/rotation/align-center buttons
   - Resizing text objects scales font size proportionally (Photoshop-style)
   - Typography Toggle Buttons: Bold, Italic, Underline, Strikethrough, ALL CAPS
   - Text Editor Style Color Icons (Text Color, Accent Color, Box Background)
   - Preset-dependent Font Family dropdown
   - Magic Preset: Vertical username in top right corner (x=1014, y=66), Custom emblem upload button,
     Playfair Display SC for page numbers (never Caudex)
   - GameDev Preset: Correct color-picked deep slate text (#162D43), warm cream paper (#F7F3EA),
     bottom pattern bar runs across with only swipe cutout, staggered dot pattern on Idea,
     larger blueprint grid scaling on Idea
   ========================================================================== */

(function () {
  'use strict';

  const SLIDE_W = 1080;
  const SLIDE_H = 1350;
  const ASSETS = window.CAROUSEL_ASSETS || {};

  // Roman Numeral Helper for Magic Page Numbers
  function toRoman(num) {
    const map = [
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    let n = Math.max(1, Math.floor(num));
    for (const [val, sym] of map) {
      while (n >= val) {
        result += sym;
        n -= val;
      }
    }
    return result;
  }

  // ==================== 6 PRESET THEMES ====================
  const THEMES = {
    'games-love': {
      id: 'games-love',
      name: 'Games (Love)',
      domain: 'gameDev',
      igHandle: 'gamedev.consulting',
      igSub: 'Game Design Analysis & Playtesting',
      frameHandle: '@CreativeProblemSolver',
      topicTag: 'EPISODE',
      topSubtitleText: 'Things I *LOVE* in games #0001',
      bottomSubtitleText: 'and what to *LEARN* from that',
      outerColor: '#219652', // Exact color-picked green
      innerBgColor: '#F7F3EA', // Exact color-picked warm cream paper
      innerGridAsset: 'grid_graph',
      gridScale: 1.0,
      patternType: 'chevrons',
      textColor: '#162D43', // Exact color-picked deep slate / navy
      accentColor: '#219652',
      usernameColor: '#162D43',
      headlineDefaults: {
        fontFamily: 'JetBrains Mono',
        fontSize: 140,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: -0.02,
        color: '#162D43',
        accentColor: '#219652',
        uppercase: true,
        embossed: false,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: 'Rubik',
        fontSize: 44,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.22,
        letterSpacing: 0,
        color: '#162D43',
        accentColor: '#219652',
        uppercase: false,
        embossed: false,
        align: 'left'
      },
      description: 'Green #219652 frame • Inward chevrons • Warm paper #F7F3EA • Deep slate #162D43 text • Slide 1-only notch with topic tag • Combined bottom swipe • Centered greyed-out username box.'
    },

    'games-hate': {
      id: 'games-hate',
      name: 'Games (Hate)',
      domain: 'gameDev',
      igHandle: 'gamedev.consulting',
      igSub: 'Game Design Analysis & Playtesting',
      frameHandle: '@CreativeProblemSolver',
      topicTag: 'SURVIVAL',
      topSubtitleText: 'Things I *HATE* in games #0001',
      bottomSubtitleText: 'and how to *FIX* them',
      outerColor: '#B8231C', // Exact color-picked red
      innerBgColor: '#F7F3EA', // Exact color-picked warm cream paper
      innerGridAsset: 'grid_graph',
      gridScale: 1.0,
      patternType: 'stripes',
      textColor: '#162D43', // Exact color-picked deep slate / navy
      accentColor: '#B8231C',
      usernameColor: '#162D43',
      headlineDefaults: {
        fontFamily: 'JetBrains Mono',
        fontSize: 140,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: -0.02,
        color: '#162D43',
        accentColor: '#B8231C',
        uppercase: true,
        embossed: false,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: 'Rubik',
        fontSize: 44,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.22,
        letterSpacing: 0,
        color: '#162D43',
        accentColor: '#B8231C',
        uppercase: false,
        embossed: false,
        align: 'left'
      },
      description: 'Red #B8231C frame • Hazard stripes • Warm paper #F7F3EA • Deep slate #162D43 text • Slide 1-only notch with topic tag • Combined bottom swipe • Centered greyed-out username box.'
    },

    'games-idea': {
      id: 'games-idea',
      name: 'Games (Idea)',
      domain: 'gameDev',
      igHandle: 'gamedev.consulting',
      igSub: 'Game Design Analysis & Playtesting',
      frameHandle: '@CreativeProblemSolver',
      topicTag: 'IDEAS',
      topSubtitleText: 'Things I *MISS* in games #000.1',
      bottomSubtitleText: 'and how to *IMPLEMENT* them',
      outerColor: '#E67F22', // Exact color-picked orange
      innerBgColor: '#1C3752', // Exact color-picked blueprint navy
      innerGridAsset: 'grid_blueprint',
      gridScale: 1.8, // Scaled-up blueprint grid covering entire blue background
      patternType: 'dots',
      textColor: '#FAFBF7', // Off-white
      accentColor: '#E67F22',
      usernameColor: '#CBD5E1', // Crisp light gray for high contrast against dark blueprint background
      headlineDefaults: {
        fontFamily: 'JetBrains Mono',
        fontSize: 140,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: -0.02,
        color: '#FAFBF7',
        accentColor: '#E67F22',
        uppercase: true,
        embossed: false,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: 'Rubik',
        fontSize: 44,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.22,
        letterSpacing: 0,
        color: '#FAFBF7',
        accentColor: '#E67F22',
        uppercase: false,
        embossed: false,
        align: 'left'
      },
      description: 'Orange #E67F22 frame • Staggered dots • Scaled-up Blueprint grid #1C3752 • Off-white #FAFBF7 text • Slide 1-only notch • Combined bottom swipe • Centered light gray username box.'
    },

    'magic-theory': {
      id: 'magic-theory',
      name: 'Magic Type A (Application)',
      domain: 'magic',
      igHandle: 'celebornmagic',
      igSub: 'Magic Theorist • Trick Creator • Consultant',
      frameHandle: '@CELEBORNMAGIC',
      seriesLabel: 'ART SERIES',
      defaultEmblem: 'emblem_theory',
      bgAsset: 'magic_bg_dark_01',
      bgColor: '#121110',
      swipeAsset: 'swipe_gold',
      textColor: '#CCC5AB',
      pipeColor: '#C19358',
      accentColor: '#C19358',
      headlineDefaults: {
        fontFamily: 'Caudex',
        fontSize: 94,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.06,
        letterSpacing: 0.03,
        color: '#CCC5AB',
        accentColor: '#C19358',
        uppercase: true,
        embossed: false,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: 'Proxima Nova',
        fontSize: 38,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.38,
        letterSpacing: 0.04,
        color: '#CCC5AB',
        accentColor: '#C19358',
        uppercase: false,
        embossed: false,
        align: 'center'
      },
      description: 'Dark blurred background • Open Book emblem • Light beige #CCC5AB text & #C19358 orange pipes • Playfair Display SC page numbers • Dedicated CTA End Slide • Caudex + Proxima Nova.'
    },

    'magic-application': {
      id: 'magic-application',
      name: 'Magic Type B (Theory)',
      domain: 'magic',
      igHandle: 'celebornmagic',
      igSub: 'Magic Theorist • Trick Creator • Consultant',
      frameHandle: '@CELEBORNMAGIC',
      seriesLabel: 'APPLICATION SERIES',
      defaultEmblem: 'emblem_application',
      bgAsset: 'magic_bg_light_01',
      bgColor: '#D69352',
      swipeAsset: 'swipe_gold',
      textColor: '#2B1F17',
      pipeColor: '#EBB168',
      accentColor: '#EBB168',
      headlineDefaults: {
        fontFamily: 'Caudex',
        fontSize: 94,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.06,
        letterSpacing: 0.03,
        color: '#2B1F17',
        accentColor: '#EBB168',
        uppercase: true,
        embossed: true,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: 'Proxima Nova',
        fontSize: 38,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.38,
        letterSpacing: 0.03,
        color: '#2B1F17',
        accentColor: '#EBB168',
        uppercase: false,
        embossed: false,
        align: 'center'
      },
      description: 'Sandy orange texture • Lightbulb emblem • Dark bronze #2B1F17 text with #EBB168 orange dividers & pipes • Dedicated CTA End Slide • Caudex + Proxima Nova.'
    },

    'magic-idea': {
      id: 'magic-idea',
      name: 'Magic Type C (Trick Ideas)',
      domain: 'magic',
      igHandle: 'celebornmagic',
      igSub: 'Magic Theorist • Trick Creator • Consultant',
      frameHandle: '@CELEBORNMAGIC',
      seriesLabel: 'TRICK LAB',
      defaultEmblem: 'emblem_idea_charcoal',
      bgAsset: null,
      bgColor: '#FAF6EE',
      swipeAsset: 'swipe_charcoal',
      textColor: '#2B2B2B',
      pipeColor: '#C19358',
      accentColor: '#C19358',
      headlineDefaults: {
        fontFamily: 'Caudex',
        fontSize: 90,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.08,
        letterSpacing: 0.02,
        color: '#2B2B2B',
        accentColor: '#C19358',
        uppercase: true,
        embossed: false,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: 'Proxima Nova',
        fontSize: 36,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.4,
        letterSpacing: 0.03,
        color: '#3A3A3A',
        accentColor: '#C19358',
        uppercase: false,
        embossed: false,
        align: 'center'
      },
      description: 'Warm minimalist sketchbook page (#FAF6EE) • Charcoal trick emblem • #C19358 orange pipes • Dedicated CTA End Slide • Caudex + Proxima Nova.'
    }
  };

  // ==================== APPLICATION STATE ====================
  const state = {
    themeId: 'magic-theory',
    numSlides: 5,
    activeSlide: 0,
    previewMode: 'strip', // 'strip' | 'simulator'
    zoom: 0.36,
    showSeamGaps: false,
    showGuides: true, // Visual guidelines toggle
    showPageNumbers: false, // Page numbers toggle (off by default)
    showSlide1Notch: true, // Slide 1 top trapezoid notch (Games presets)
    bgTuning: {
      colorOverride: null,
      brightness: 100, // 40..160
      saturation: 100, // 0..200
      textureOpacity: 100 // 0..100
    },
    frameConfig: {
      handle: '@CELEBORNMAGIC',
      series: 'ART SERIES'
    },
    elements: [],
    selectedId: null,
    editingTextId: null,
    nextIdCounter: 100
  };

  function genId(prefix = 'el') {
    state.nextIdCounter += 1;
    return `${prefix}_${state.nextIdCounter}`;
  }

  // ==================== UNDO / REDO HISTORY SYSTEM ====================
  const undoStack = [];
  const redoStack = [];
  const MAX_HISTORY = 50;

  function pushHistorySnapshot() {
    try {
      const snapshot = JSON.stringify({
        elements: state.elements,
        numSlides: state.numSlides,
        themeId: state.themeId,
        bgTuning: state.bgTuning,
        frameConfig: state.frameConfig,
        showSlide1Notch: state.showSlide1Notch,
        showPageNumbers: state.showPageNumbers,
        selectedId: state.selectedId
      });
      if (undoStack.length > 0 && undoStack[undoStack.length - 1] === snapshot) {
        return;
      }
      undoStack.push(snapshot);
      if (undoStack.length > MAX_HISTORY) undoStack.shift();
      redoStack.length = 0;
    } catch (e) {
      console.warn('Failed to push history snapshot', e);
    }
  }

  function undo() {
    if (undoStack.length === 0) return;
    try {
      const current = JSON.stringify({
        elements: state.elements,
        numSlides: state.numSlides,
        themeId: state.themeId,
        bgTuning: state.bgTuning,
        frameConfig: state.frameConfig,
        showSlide1Notch: state.showSlide1Notch,
        showPageNumbers: state.showPageNumbers,
        selectedId: state.selectedId
      });
      redoStack.push(current);
      if (redoStack.length > MAX_HISTORY) redoStack.shift();

      const prev = JSON.parse(undoStack.pop());
      state.elements = prev.elements;
      state.numSlides = prev.numSlides;
      state.themeId = prev.themeId;
      state.bgTuning = prev.bgTuning;
      state.frameConfig = prev.frameConfig;
      state.showSlide1Notch = prev.showSlide1Notch;
      state.showPageNumbers = prev.showPageNumbers;
      state.selectedId = prev.selectedId;
      renderAll();
    } catch (e) {
      console.error('Failed to undo', e);
    }
  }

  function redo() {
    if (redoStack.length === 0) return;
    try {
      const current = JSON.stringify({
        elements: state.elements,
        numSlides: state.numSlides,
        themeId: state.themeId,
        bgTuning: state.bgTuning,
        frameConfig: state.frameConfig,
        showSlide1Notch: state.showSlide1Notch,
        showPageNumbers: state.showPageNumbers,
        selectedId: state.selectedId
      });
      undoStack.push(current);

      const next = JSON.parse(redoStack.pop());
      state.elements = next.elements;
      state.numSlides = next.numSlides;
      state.themeId = next.themeId;
      state.bgTuning = next.bgTuning;
      state.frameConfig = next.frameConfig;
      state.showSlide1Notch = next.showSlide1Notch;
      state.showPageNumbers = next.showPageNumbers;
      state.selectedId = next.selectedId;
      renderAll();
    } catch (e) {
      console.error('Failed to redo', e);
    }
  }

  function getActiveTheme() {
    return THEMES[state.themeId] || THEMES['magic-theory'];
  }

  function getSelectedElement() {
    return state.elements.find(el => el.id === state.selectedId) || null;
  }

  function getSlideSpanInfo(el) {
    const startSlide = Math.max(0, Math.floor(el.x / SLIDE_W));
    const endSlide = Math.min(state.numSlides - 1, Math.floor(Math.max(el.x, el.x + el.w - 1) / SLIDE_W));
    if (startSlide === endSlide) {
      return { text: `Slide ${startSlide + 1}`, primary: startSlide };
    }
    return { text: `Slides ${startSlide + 1}–${endSlide + 1}`, primary: startSlide };
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function normalizeHex(c, fallback = '#FFFFFF') {
    if (!c || typeof c !== 'string') return fallback;
    const trimmed = c.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
    return fallback;
  }

  function formatRichTextHtml(text, accentColor) {
    const escaped = escapeHtml(text || '');
    let formatted = escaped.replace(/\*([^*]+)\*/g, (_, word) => {
      return `<span style="color:${accentColor || '#d49b55'}">${word}</span>`;
    });
    if (formatted.startsWith('| ')) {
      formatted = `<span style="color:${accentColor || '#C19358'};font-weight:700;">|</span> ` + formatted.slice(2);
    }
    return formatted;
  }

  // ==================== DEFAULT TEMPLATE GENERATORS ====================
  function createDefaultElementsForTheme(themeId, numSlides) {
    const theme = THEMES[themeId];
    const els = [];

    if (theme.domain === 'magic') {
      // ----------------- MAGIC CAROUSEL -----------------
      // SLIDE 1 (Hook / Cover)
      // 1) Emblem (Top-Left: 188x188 at x=66, y=66)
      els.push({
        id: genId('emb'),
        type: 'emblem',
        layerGroup: 'foreground',
        role: 'emblem',
        name: 'Magic Emblem',
        emblemVariant: theme.defaultEmblem,
        x: 66,
        y: 66,
        w: 188,
        h: 188,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal'
      });

      // 2) Top Right Vertical Username (| @CELEBORNMAGIC)
      // Placed vertically in the top right corner within both guidelines: top at y=66, right at x=1014
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'handle',
        name: 'Vertical Handle',
        text: '| @CELEBORNMAGIC',
        x: 986,
        y: 66,
        w: 28,
        h: 360,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fontFamily: 'Proxima Nova',
        fontSize: 28,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: 0.08,
        color: theme.id === 'magic-application' ? '#2B1F17' : (theme.id === 'magic-idea' ? '#2B2B2B' : '#CCC5AB'),
        accentColor: theme.pipeColor || '#C19358',
        uppercase: false,
        embossed: false,
        align: 'left'
      });

      // 3) Cover Headline
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'headline',
        text: themeId === 'magic-theory'
          ? 'COLOR\nPSYCHOLOGY'
          : themeId === 'magic-application'
            ? 'THEORY IN\nPRACTICE'
            : 'IMPOSSIBLE\nOBJECT',
        x: 90,
        y: 485,
        w: 900,
        h: 210,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.headlineDefaults,
        fontSize: 94
      });

      // 4) Small Center Divider Line
      els.push({
        id: genId('div'),
        type: 'divider',
        layerGroup: 'foreground',
        x: 350,
        y: 718,
        w: 380,
        h: 4,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.pipeColor,
        noFill: false,
        stroke: '#000000',
        strokeWidth: 0
      });

      // 5) Cover Subtitle
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'subtitle',
        text: themeId === 'magic-theory'
          ? 'HOW CERTAIN COLORS AFFECT\nOUR PERCEPTION'
          : themeId === 'magic-application'
            ? 'APPLYING SILENT SCRIPTING\nTO STAGE ILLUSIONS'
            : 'SKETCHBOOK CONCEPT #01:\nTHE FLOATING HOURGLASS',
        x: 130,
        y: 752,
        w: 820,
        h: 130,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.subtitleDefaults,
        fontSize: 38,
        letterSpacing: 0.05
      });

      // 6) Slide 1 Bottom Elements (Series Name, Swipe Icon, Roman Numeral)
      addMagicSlideFooterElements(els, 0, theme, numSlides);

      // SLIDES 2 .. N-1 (Content Slides)
      for (let s = 1; s < numSlides - 1; s++) {
        addMagicContentSlideLayout(els, s, theme, numSlides);
      }

      // SLIDE N (Dedicated End / CTA Slide, always last!)
      if (numSlides >= 2) {
        addMagicEndSlideLayout(els, numSlides - 1, theme);
      }
    } else {
      // ----------------- GAMES CAROUSEL -----------------
      const word = themeId === 'games-love' ? 'LOVE' : themeId === 'games-hate' ? 'HATE' : 'MISS';
      const bottomWord = themeId === 'games-love' ? 'LEARN' : themeId === 'games-hate' ? 'FIX' : 'IMPLEMENT';

      // 0) Seamless Panoramic Border Patterns (Top and Bottom across all slides)
      els.push({
        id: genId('pat-top'),
        type: 'games-border-pattern',
        layerGroup: 'foreground',
        role: 'border-pattern',
        name: 'Top Border Pattern',
        patternPosition: 'top',
        patternType: theme.patternType || 'chevrons',
        x: 0,
        y: 0,
        w: numSlides * SLIDE_W,
        h: 64,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal'
      });

      els.push({
        id: genId('pat-bot'),
        type: 'games-border-pattern',
        layerGroup: 'foreground',
        role: 'border-pattern',
        name: 'Bottom Border Pattern',
        patternPosition: 'bottom',
        patternType: theme.patternType || 'chevrons',
        x: 0,
        y: 1286,
        w: numSlides * SLIDE_W,
        h: 64,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal'
      });

      // SLIDE 1 (Hook / Cover)
      // 1) Standalone Topic Tag Text (Inside Slide 1 Top Notch)
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'topic-tag',
        name: 'Slide 1 Topic Tag',
        text: theme.topicTag || 'EPISODE',
        x: 357,
        y: 16,
        w: 366,
        h: 46,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fontFamily: 'Rubik',
        fontSize: 30,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: 0.08,
        color: '#111111',
        accentColor: theme.outerColor,
        uppercase: true,
        embossed: false,
        align: 'center'
      });

      // 2) Top Left-Aligned Framing Subtitle
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'subtitle',
        text: theme.topSubtitleText || `Things I *${word}* in games #0001`,
        x: 96,
        y: 315,
        w: 888,
        h: 64,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.subtitleDefaults,
        align: 'left',
        fontSize: 45
      });

      // 3) Giant Centered Keyword (LOOTBOXES in deep slate #162D43 or off-white on Idea)
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'headline',
        text: 'LOOTBOXES',
        x: 76,
        y: 382,
        w: 928,
        h: 165,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.headlineDefaults,
        fontSize: 142,
        align: 'center'
      });

      // 4) Bottom Right-Aligned Framing Subtitle
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'subtitle',
        text: theme.bottomSubtitleText || (themeId === 'games-love' ? 'and what to *LEARN* from that' : themeId === 'games-hate' ? 'and how to *FIX* them' : 'and how to *IMPLEMENT* them'),
        x: 96,
        y: 558,
        w: 888,
        h: 64,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.subtitleDefaults,
        align: 'right',
        fontSize: 45
      });

      // 5) Topic Sketch Triangle Placeholder
      els.push({
        id: genId('tri'),
        type: 'triangle',
        layerGroup: 'foreground',
        x: 370,
        y: 695,
        w: 340,
        h: 310,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.outerColor,
        noFill: true,
        stroke: theme.textColor,
        strokeWidth: 6
      });

      // 6) Slide 1 Bottom Footer: Combined Swipe + Centered Greyed-out Username Box
      addGamesSlideFooterElements(els, 0, theme, numSlides);

      // SLIDES 2 .. N-1 (Content Slides)
      for (let s = 1; s < numSlides - 1; s++) {
        addGamesContentSlideLayout(els, s, theme, numSlides);
      }

      // SLIDE N (Dedicated End / CTA Slide, always last!)
      if (numSlides >= 2) {
        addGamesEndSlideLayout(els, numSlides - 1, theme);
      }
    }

    return els;
  }

  // Magic Slide Footers (Series, Swipe Icon / Diamond, Auto Page Number in Playfair Display SC)
  function addMagicSlideFooterElements(els, s, theme, numSlides) {
    const sx = s * SLIDE_W;
    const isLast = s === numSlides - 1;

    // Series label at bottom-left (| ART SERIES)
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'series',
      text: `| ${theme.seriesLabel}`,
      x: sx + 66,
      y: 1264,
      w: 400,
      h: 36,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      fontFamily: 'Proxima Nova',
      fontSize: 29,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrike: false,
      lineHeight: 1.0,
      letterSpacing: 0.08,
      color: theme.textColor,
      accentColor: theme.pipeColor,
      uppercase: false,
      embossed: false,
      align: 'left'
    });

    if (!isLast) {
      // Bottom center swipe icon on content slides (matches highlights/dividers on Type B, text color on Type A)
      els.push({
        id: genId('swipe'),
        type: 'magic-swipe',
        layerGroup: 'foreground',
        role: 'swipe',
        name: 'Swipe Icon',
        swipeVariant: theme.swipeAsset,
        color: theme.id === 'magic-application' ? (theme.pipeColor || '#EBB168') : theme.textColor,
        fill: theme.id === 'magic-application' ? (theme.pipeColor || '#EBB168') : theme.textColor,
        x: sx + 514,
        y: 1252,
        w: 52,
        h: 52,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal'
      });

      // Bottom right Roman Numeral Page Counter (STRICTLY Playfair Display SC, only when enabled)
      if (state.showPageNumbers) {
        els.push({
          id: genId('txt'),
          type: 'text',
          layerGroup: 'foreground',
          role: 'pagenum',
          isAutoPageNum: true,
          slideIndexRef: s,
          text: toRoman(s + 1),
          x: sx + 880,
          y: 1252,
          w: 134,
          h: 52,
          rotation: 0,
          opacity: 100,
          blendMode: 'normal',
          fontFamily: 'Playfair Display SC',
          fontSize: 44,
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isStrike: false,
          lineHeight: 1.0,
          letterSpacing: 0.04,
          color: theme.textColor,
          accentColor: theme.pipeColor,
          uppercase: false,
          embossed: false,
          align: 'right'
        });
      }
    } else {
      // Last slide: Diamond in center & Bookmark icon on right
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'diamond',
        text: '◇',
        x: sx + 514,
        y: 1252,
        w: 52,
        h: 52,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fontFamily: 'Caudex',
        fontSize: 32,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: 0,
        color: theme.pipeColor,
        accentColor: theme.pipeColor,
        uppercase: false,
        embossed: false,
        align: 'center'
      });

      els.push({
        id: genId('cta-bookmark'),
        type: 'cta-bookmark',
        layerGroup: 'foreground',
        name: 'Bookmark Icon',
        x: sx + 980,
        y: 1258,
        w: 34,
        h: 42,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.textColor
      });
    }
  }

  // Magic Content Slide Layout (Slide 2..N-1)
  function addMagicContentSlideLayout(els, s, theme, numSlides) {
    const sx = s * SLIDE_W;

    // Top right vertical username within both guidelines: top at y=66, right at x=1014
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'handle',
      name: 'Vertical Handle',
      text: '| @CELEBORNMAGIC',
      x: sx + 986,
      y: 66,
      w: 28,
      h: 360,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      fontFamily: 'Proxima Nova',
      fontSize: 28,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrike: false,
      lineHeight: 1.0,
      letterSpacing: 0.08,
      color: theme.id === 'magic-application' ? '#2B1F17' : (theme.id === 'magic-idea' ? '#2B2B2B' : '#CCC5AB'),
      accentColor: theme.pipeColor || '#C19358',
      uppercase: false,
      embossed: false,
      align: 'left'
    });

    // Headline (e.g. PRINCIPLE II)
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'headline',
      text: `PRINCIPLE ${toRoman(s + 1)}`,
      x: sx + 110,
      y: 280,
      w: 860,
      h: 115,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.headlineDefaults,
      fontSize: 76
    });

    // Divider Line
    els.push({
      id: genId('div'),
      type: 'divider',
      layerGroup: 'foreground',
      x: sx + 390,
      y: 415,
      w: 300,
      h: 3,
      rotation: 0,
      opacity: 90,
      blendMode: 'normal',
      fill: theme.pipeColor,
      noFill: false,
      stroke: '#000000',
      strokeWidth: 0
    });

    // Subtitle / Body paragraph
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'subtitle',
      text: 'Double-click any text to edit inline, or drag elements across the slide seam to span multiple slides seamlessly.',
      x: sx + 140,
      y: 485,
      w: 800,
      h: 320,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.subtitleDefaults,
      fontSize: 38
    });

    // Footer elements
    addMagicSlideFooterElements(els, s, theme, numSlides);
  }

  // Magic End / CTA Slide Layout (Always Last Slide)
  function addMagicEndSlideLayout(els, s, theme) {
    const sx = s * SLIDE_W;

    // Top right vertical username within both guidelines: top at y=66, right at x=1014
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'handle',
      name: 'Vertical Handle',
      text: '| @CELEBORNMAGIC',
      x: sx + 986,
      y: 66,
      w: 28,
      h: 360,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      fontFamily: 'Proxima Nova',
      fontSize: 28,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrike: false,
      lineHeight: 1.0,
      letterSpacing: 0.08,
      color: theme.id === 'magic-application' ? '#2B1F17' : (theme.id === 'magic-idea' ? '#2B2B2B' : '#CCC5AB'),
      accentColor: theme.pipeColor || '#C19358',
      uppercase: false,
      embossed: false,
      align: 'left'
    });

    // CTA Title ("Need More Input?" / "Save this for Later")
    const title = theme.id === 'magic-theory' ? 'Need More\nInput?' : 'Save this\nfor Later';
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'headline',
      text: title,
      x: sx + 100,
      y: 340,
      w: 880,
      h: 240,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.headlineDefaults,
      fontSize: 106,
      uppercase: false
    });

    // Divider Line
    els.push({
      id: genId('div'),
      type: 'divider',
      layerGroup: 'foreground',
      x: sx + 260,
      y: 610,
      w: 560,
      h: 3,
      rotation: 0,
      opacity: 90,
      blendMode: 'normal',
      fill: theme.pipeColor,
      noFill: false,
      stroke: '#000000',
      strokeWidth: 0
    });

    // Subtitle
    const sub = theme.id === 'magic-theory' ? 'Comment below :)' : 'Share with your best magic friend.';
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'subtitle',
      text: sub,
      x: sx + 140,
      y: 650,
      w: 800,
      h: 60,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.subtitleDefaults,
      fontSize: 38,
      align: 'center'
    });

    // Center Vector CTA Icons (Heart + Paper Airplane Share)
    els.push({
      id: genId('cta-icons'),
      type: 'magic-cta-icons',
      layerGroup: 'foreground',
      name: 'Heart & Share CTA Icons',
      x: sx + 390,
      y: 745,
      w: 300,
      h: 110,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      stroke: theme.pipeColor
    });

    // Footer with Diamond and Bookmark
    addMagicSlideFooterElements(els, s, theme, s + 1);
  }

  // Games Slide Footers (Combined Swipe Text+Icon, Centered Greyed-out Username Box, Auto Page Counter)
  function addGamesSlideFooterElements(els, s, theme, numSlides) {
    const sx = s * SLIDE_W;
    const isLast = s === numSlides - 1;
    const isIdea = theme.id === 'games-idea';
    const userColor = isIdea ? '#CBD5E1' : (theme.usernameColor || '#162D43');
    const userBoxBg = isIdea ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
    const userBoxBorder = isIdea ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';

    // Centered Username Box at Bottom (light gray on Idea for high contrast, greyed-out slate on Love/Hate)
    els.push({
      id: genId('games-user'),
      type: 'games-username-box',
      layerGroup: 'foreground',
      name: 'Bottom Username Box',
      handleText: theme.frameHandle,
      x: sx + 390,
      y: 1226,
      w: 300,
      h: 38,
      rotation: 0,
      opacity: isIdea ? 85 : 60,
      blendMode: 'normal',
      textColor: userColor,
      boxBg: userBoxBg,
      boxBorder: userBoxBorder
    });

    // Combined Swipe Text + Icon at Bottom Center (on slides 1 .. N-1)
    if (!isLast) {
      els.push({
        id: genId('games-swipe'),
        type: 'games-swipe-combo',
        layerGroup: 'foreground',
        name: 'Combined Bottom Swipe',
        x: sx + 450,
        y: 1282,
        w: 180,
        h: 68,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.outerColor
      });
    }

    // Top Right Auto Page Counter inside inner paper canvas (1/N) (only when enabled)
    if (state.showPageNumbers) {
      els.push({
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'pagenum',
        isAutoPageNum: true,
        slideIndexRef: s,
        text: `${s + 1}/${numSlides}`,
        x: sx + 880,
        y: 84,
        w: 120,
        h: 40,
        rotation: 0,
        opacity: 75,
        blendMode: 'normal',
        fontFamily: 'JetBrains Mono',
        fontSize: 28,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: 0,
        color: theme.textColor,
        accentColor: theme.outerColor,
        uppercase: false,
        embossed: false,
        align: 'right'
      });
    }
  }

  // Games Content Slide Layout (Slide 2..N-1)
  function addGamesContentSlideLayout(els, s, theme, numSlides) {
    const sx = s * SLIDE_W;

    // Headline (POINT #02, etc.)
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'headline',
      text: `POINT #0${s + 1}`,
      x: sx + 96,
      y: 240,
      w: 888,
      h: 120,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.headlineDefaults,
      fontSize: 96,
      align: 'left'
    });

    // Subtitle / Body text
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'subtitle',
      text: `Why *player agency* matters more than random reward loops — and how to design *satisfying* progression instead.`,
      x: sx + 96,
      y: 395,
      w: 888,
      h: 260,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.subtitleDefaults,
      fontSize: 42,
      align: 'left'
    });

    // Sketch Triangle Placeholder
    els.push({
      id: genId('tri'),
      type: 'triangle',
      layerGroup: 'foreground',
      x: sx + 390,
      y: 720,
      w: 300,
      h: 270,
      rotation: 0,
      opacity: 90,
      blendMode: 'normal',
      fill: theme.outerColor,
      noFill: true,
      stroke: theme.textColor,
      strokeWidth: 5
    });

    // Footers
    addGamesSlideFooterElements(els, s, theme, numSlides);
  }

  // Games End / CTA Slide Layout (Always Last Slide)
  function addGamesEndSlideLayout(els, s, theme) {
    const sx = s * SLIDE_W;

    // Headline
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'headline',
      text: 'NEED A\nPLAYTEST?',
      x: sx + 96,
      y: 280,
      w: 888,
      h: 240,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.headlineDefaults,
      fontSize: 110,
      align: 'center'
    });

    // Subtitle
    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'subtitle',
      text: `Drop your thoughts in the *comments* or DM for a *free 30-min consultation* & game audit session!`,
      x: sx + 110,
      y: 560,
      w: 860,
      h: 180,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      ...theme.subtitleDefaults,
      fontSize: 44,
      align: 'center'
    });

    // CTA Box / Button
    els.push({
      id: genId('rect'),
      type: 'rect',
      layerGroup: 'foreground',
      x: sx + 320,
      y: 780,
      w: 440,
      h: 88,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      fill: theme.outerColor,
      noFill: false,
      stroke: '#000000',
      strokeWidth: 4
    });

    els.push({
      id: genId('txt'),
      type: 'text',
      layerGroup: 'foreground',
      role: 'subtitle',
      text: 'DM "PLAYTEST" →',
      x: sx + 330,
      y: 804,
      w: 420,
      h: 46,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      fontFamily: 'JetBrains Mono',
      fontSize: 32,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isStrike: false,
      lineHeight: 1.0,
      letterSpacing: 0.04,
      color: '#FFFFFF',
      accentColor: '#FFFFFF',
      uppercase: true,
      embossed: false,
      align: 'center'
    });

    // Footers
    addGamesSlideFooterElements(els, s, theme, s + 1);
  }

  function syncAutoPageNumbers() {
    state.elements.forEach(el => {
      if (el.isAutoPageNum) {
        const slideIdx = Math.max(0, Math.min(state.numSlides - 1, Math.floor((el.x + el.w / 2) / SLIDE_W)));
        const theme = getActiveTheme();
        if (theme.domain === 'magic') {
          el.text = toRoman(slideIdx + 1);
          el.fontFamily = 'Playfair Display SC'; // Ensure Playfair Display SC
        } else {
          el.text = `${slideIdx + 1}/${state.numSlides}`;
          el.fontFamily = 'JetBrains Mono';
        }
      }
    });
  }

  function togglePageNumbers(forceState) {
    if (typeof forceState === 'boolean') {
      state.showPageNumbers = forceState;
    } else {
      state.showPageNumbers = !state.showPageNumbers;
    }

    if (dom.btnTogglePageNumbers) {
      dom.btnTogglePageNumbers.classList.toggle('active', state.showPageNumbers);
    }

    const theme = getActiveTheme();

    if (state.showPageNumbers) {
      // Add page numbers to slides if not already present
      for (let s = 0; s < state.numSlides; s++) {
        const sx = s * SLIDE_W;
        const isLast = s === state.numSlides - 1;
        const exists = state.elements.some(el => el.role === 'pagenum' && el.slideIndexRef === s);
        if (!exists) {
          if (theme.domain === 'magic') {
            if (!isLast) {
              state.elements.push({
                id: genId('txt'),
                type: 'text',
                layerGroup: 'foreground',
                role: 'pagenum',
                isAutoPageNum: true,
                slideIndexRef: s,
                text: toRoman(s + 1),
                x: sx + 880,
                y: 1252,
                w: 134,
                h: 52,
                rotation: 0,
                opacity: 100,
                blendMode: 'normal',
                fontFamily: 'Playfair Display SC',
                fontSize: 44,
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrike: false,
                lineHeight: 1.0,
                letterSpacing: 0.04,
                color: theme.textColor,
                accentColor: theme.pipeColor,
                uppercase: false,
                embossed: false,
                align: 'right'
              });
            }
          } else {
            state.elements.push({
              id: genId('txt'),
              type: 'text',
              layerGroup: 'foreground',
              role: 'pagenum',
              isAutoPageNum: true,
              slideIndexRef: s,
              text: `${s + 1}/${state.numSlides}`,
              x: sx + 880,
              y: 84,
              w: 120,
              h: 40,
              rotation: 0,
              opacity: 75,
              blendMode: 'normal',
              fontFamily: 'JetBrains Mono',
              fontSize: 28,
              isBold: true,
              isItalic: false,
              isUnderline: false,
              isStrike: false,
              lineHeight: 1.0,
              letterSpacing: 0,
              color: theme.textColor,
              accentColor: theme.outerColor,
              uppercase: false,
              embossed: false,
              align: 'right'
            });
          }
        }
      }
    } else {
      // Remove all page numbers
      state.elements = state.elements.filter(el => el.role !== 'pagenum' && !el.isAutoPageNum);
    }

    renderAll();
  }

  // ==================== DOM REFERENCES ====================
  const dom = {
    themeSelect: document.getElementById('themeSelect'),
    slideCountInput: document.getElementById('slideCountInput'),
    btnRemoveSlide: document.getElementById('btnRemoveSlide'),
    btnAddSlide: document.getElementById('btnAddSlide'),
    btnResetTemplate: document.getElementById('btnResetTemplate'),
    modeStripBtn: document.getElementById('modeStripBtn'),
    modeSimBtn: document.getElementById('modeSimBtn'),
    btnSaveProject: document.getElementById('btnSaveProject'),
    loadProjectInput: document.getElementById('loadProjectInput'),
    btnExportCurrent: document.getElementById('btnExportCurrent'),
    btnExportAll: document.getElementById('btnExportAll'),

    // Left Sidebar
    presetBadgeLabel: document.getElementById('presetBadgeLabel'),
    presetElementsGrid: document.getElementById('presetElementsGrid'),
    bgElementInput: document.getElementById('bgElementInput'),
    freeImageInput: document.getElementById('freeImageInput'),

    btnResetBgTuning: document.getElementById('btnResetBgTuning'),
    bgBaseColorInput: document.getElementById('bgBaseColorInput'),
    bgBaseColorHex: document.getElementById('bgBaseColorHex'),
    bgBrightnessSlider: document.getElementById('bgBrightnessSlider'),
    bgBrightnessVal: document.getElementById('bgBrightnessVal'),
    bgSaturationSlider: document.getElementById('bgSaturationSlider'),
    bgSaturationVal: document.getElementById('bgSaturationVal'),
    bgOpacitySlider: document.getElementById('bgOpacitySlider'),
    bgOpacityVal: document.getElementById('bgOpacityVal'),

    layerCountBadge: document.getElementById('layerCountBadge'),
    layersList: document.getElementById('layersList'),

    // Viewport Toolbar
    activeSlideLabel: document.getElementById('activeSlideLabel'),
    stripOptionsGroup: document.getElementById('stripOptionsGroup'),
    toggleSeamGaps: document.getElementById('toggleSeamGaps'),
    toggleGuides: document.getElementById('toggleGuides'),
    btnTogglePageNumbers: document.getElementById('btnTogglePageNumbers'),
    quickTextBar: document.getElementById('quickTextBar'),
    quickBtnHeadline: document.getElementById('quickBtnHeadline'),
    quickBtnSubtitle: document.getElementById('quickBtnSubtitle'),
    quickBtnEditText: document.getElementById('quickBtnEditText'),
    btnZoomOut: document.getElementById('btnZoomOut'),
    zoomReadout: document.getElementById('zoomReadout'),
    btnZoomIn: document.getElementById('btnZoomIn'),
    btnZoomFit: document.getElementById('btnZoomFit'),
    btnToggleInfo: document.getElementById('btnToggleInfo'),
    viewportInfoPopover: document.getElementById('viewportInfoPopover'),
    btnCloseInfo: document.getElementById('btnCloseInfo'),

    // Viewport Areas
    stripViewport: document.getElementById('stripViewport'),
    stripScrollContainer: document.getElementById('stripScrollContainer'),
    stripStageWrapper: document.getElementById('stripStageWrapper'),
    stripSlidesContainer: document.getElementById('stripSlidesContainer'),
    stripSmartGuidesLayer: document.getElementById('stripSmartGuidesLayer'),
    stripInteractionLayer: document.getElementById('stripInteractionLayer'),

    simulatorViewport: document.getElementById('simulatorViewport'),
    igAvatar: document.getElementById('igAvatar'),
    igUsername: document.getElementById('igUsername'),
    igSubtext: document.getElementById('igSubtext'),
    igFrameContainer: document.getElementById('igFrameContainer'),
    igTrack: document.getElementById('igTrack'),
    igCounterPill: document.getElementById('igCounterPill'),
    igPrevBtn: document.getElementById('igPrevBtn'),
    igNextBtn: document.getElementById('igNextBtn'),
    igDotsContainer: document.getElementById('igDotsContainer'),

    // Right Sidebar Inspector
    inspectorEmptyState: document.getElementById('inspectorEmptyState'),
    inspectorElementState: document.getElementById('inspectorElementState'),
    themeSummaryCard: document.getElementById('themeSummaryCard'),
    frameHandleInput: document.getElementById('frameHandleInput'),
    frameSeriesInput: document.getElementById('frameSeriesInput'),

    inspElementTypeTitle: document.getElementById('inspElementTypeTitle'),
    inspSlideSpanBadge: document.getElementById('inspSlideSpanBadge'),
    inspOpacity: document.getElementById('inspOpacity'),
    inspOpacityVal: document.getElementById('inspOpacityVal'),
    inspBlendMode: document.getElementById('inspBlendMode'),

    btnMovePrevSlide: document.getElementById('btnMovePrevSlide'),
    btnSpanSeam: document.getElementById('btnSpanSeam'),
    btnMoveNextSlide: document.getElementById('btnMoveNextSlide'),

    // Emblem Switcher
    inspEmblemSection: document.getElementById('inspEmblemSection'),
    thumbEmblemTheory: document.getElementById('thumbEmblemTheory'),
    thumbEmblemApp: document.getElementById('thumbEmblemApp'),
    thumbEmblemIdea: document.getElementById('thumbEmblemIdea'),
    thumbEmblemCharcoal: document.getElementById('thumbEmblemCharcoal'),
    uploadCustomEmblemInput: document.getElementById('uploadCustomEmblemInput'),

    // Text Inspector
    inspTextSection: document.getElementById('inspTextSection'),
    inspTextContent: document.getElementById('inspTextContent'),
    inspFontFamily: document.getElementById('inspFontFamily'),
    btnTextBold: document.getElementById('btnTextBold'),
    btnTextItalic: document.getElementById('btnTextItalic'),
    btnTextUnderline: document.getElementById('btnTextUnderline'),
    btnTextStrike: document.getElementById('btnTextStrike'),
    btnTextCaps: document.getElementById('btnTextCaps'),

    inspFontSize: document.getElementById('inspFontSize'),
    inspLineHeight: document.getElementById('inspLineHeight'),
    inspLetterSpacing: document.getElementById('inspLetterSpacing'),
    btnTextAlignLeft: document.getElementById('btnTextAlignLeft'),
    btnTextAlignCenter: document.getElementById('btnTextAlignCenter'),
    btnTextAlignRight: document.getElementById('btnTextAlignRight'),

    inspTextColor: document.getElementById('inspTextColor'),
    textColorSwatchBar: document.getElementById('textColorSwatchBar'),
    inspAccentColor: document.getElementById('inspAccentColor'),
    accentColorSwatchBar: document.getElementById('accentColorSwatchBar'),
    inspTextBgColor: document.getElementById('inspTextBgColor'),
    textBgColorSwatchBar: document.getElementById('textBgColorSwatchBar'),
    inspTextHasBg: document.getElementById('inspTextHasBg'),
    inspTextEmbossed: document.getElementById('inspTextEmbossed'),

    // Pattern Inspector
    inspPatternSection: document.getElementById('inspPatternSection'),
    inspPatternSyncBoth: document.getElementById('inspPatternSyncBoth'),

    // Slide 1 Notch Inspector
    inspSlideSection: document.getElementById('inspSlideSection'),
    toggleSlide1Notch: document.getElementById('toggleSlide1Notch'),
    inspSlideSectionEmpty: document.getElementById('inspSlideSectionEmpty'),
    toggleSlide1NotchEmpty: document.getElementById('toggleSlide1NotchEmpty'),

    // Shape Inspector
    inspShapeSection: document.getElementById('inspShapeSection'),
    inspShapeFill: document.getElementById('inspShapeFill'),
    inspShapeNoFill: document.getElementById('inspShapeNoFill'),
    inspShapeStroke: document.getElementById('inspShapeStroke'),
    inspShapeStrokeWidth: document.getElementById('inspShapeStrokeWidth'),

    // Image Inspector
    inspImageSection: document.getElementById('inspImageSection'),
    inspImgFit: document.getElementById('inspImgFit'),
    inspImgBrightness: document.getElementById('inspImgBrightness'),
    inspImgBrightVal: document.getElementById('inspImgBrightVal'),
    inspImgSaturation: document.getElementById('inspImgSaturation'),
    inspImgSatVal: document.getElementById('inspImgSatVal'),
    inspImgIsBg: document.getElementById('inspImgIsBg'),
    replaceImgInput: document.getElementById('replaceImgInput'),

    btnBringForward: document.getElementById('btnBringForward'),
    btnSendBackward: document.getElementById('btnSendBackward'),
    btnDuplicateEl: document.getElementById('btnDuplicateEl'),
    btnDeleteEl: document.getElementById('btnDeleteEl')
  };

  // ==================== SLIDE BACKGROUND & CANVAS ====================
  function buildSlideBackgroundHTML(slideIndex, theme) {
    const tuning = state.bgTuning;
    const filterStyle = `filter: brightness(${tuning.brightness}%) saturate(${tuning.saturation}%);`;
    const textureOpacity = (tuning.textureOpacity ?? 100) / 100;

    let html = '';
    if (theme.domain === 'magic') {
      const baseBg = tuning.colorOverride || theme.bgColor || '#121110';
      const bgSrc = theme.bgAsset ? ASSETS[theme.bgAsset] : null;

      html += `<div style="position:absolute;inset:0;background:${baseBg};"></div>`;
      if (bgSrc) {
        html += `<img src="${bgSrc}" style="position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover;opacity:${textureOpacity};${filterStyle}pointer-events:none;" alt="" />`;
      } else if (theme.id === 'magic-idea') {
        html += `<div style="position:absolute;inset:28px;border:1.5px solid rgba(193,147,88,0.28);pointer-events:none;"></div>`;
      }
    } else {
      // GAMES CHANNEL: Solid frame color + Thinner frame outline + Unified Inner Paper Canvas
      // Outer colored frame
      const frameColor = theme.outerColor || '#219652';
      const paperBg = tuning.colorOverride || theme.innerBgColor || '#F7F3EA';
      const gridSrc = ASSETS[theme.innerGridAsset] || '';
      const gridScale = theme.gridScale || 1.0;

      html += `<div style="position:absolute;inset:0;background:${frameColor};"></div>`;

      // Unified Inner Paper Canvas Path:
      // Side margin = 26px (thinner outer frame), Top border = 64px, Bottom border = 1286px (height 1222px).
      // On Slide 1 (if notch enabled): Continuous polygon path cutting around the top trapezoid opening.
      // Diagonal meets the horizontal line at the EXACT vertex (723, 64) with round linejoin, eliminating any disconnect!
      const hasNotch = slideIndex === 0 && state.showSlide1Notch;
      const paperPath = hasNotch
        ? 'M 26,64 L 357,64 L 405,155 L 675,155 L 723,64 L 1054,64 L 1054,1286 L 26,1286 Z'
        : 'M 26,64 L 1054,64 L 1054,1286 L 26,1286 Z';

      const scaledW = Math.round(1028 * gridScale);
      const scaledH = Math.round(1222 * gridScale);
      const offsetX = Math.round(26 - (scaledW - 1028) / 2);
      const offsetY = Math.round(64 - (scaledH - 1222) / 2);

      html += `
        <svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;inset:0;pointer-events:none;overflow:visible;">
          <defs>
            <clipPath id="paper_clip_${slideIndex}">
              <path d="${paperPath}" />
            </clipPath>
          </defs>
          <!-- Paper Fill with tuning filter -->
          <path d="${paperPath}" fill="${paperBg}" style="${filterStyle}" />
          <!-- Inner Grid Texture clipped exactly to paper polygon (fills edge to edge with zero gaps) -->
          ${gridSrc ? `
            <g clip-path="url(#paper_clip_${slideIndex})" style="${filterStyle}">
              <image href="${gridSrc}" x="${offsetX}" y="${offsetY}" width="${scaledW}" height="${scaledH}" preserveAspectRatio="xMidYMid slice" opacity="${0.82 * textureOpacity}" />
            </g>
          ` : ''}
          <!-- Continuous 3.5px solid black border with seamless round corner join -->
          <path d="${paperPath}" fill="none" stroke="#000000" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" />
        </svg>
      `;
    }

    return html;
  }

  // Visual Reference Guidelines
  function buildVisualGuidelinesHTML(theme) {
    if (!state.showGuides) return '';
    return `
      <div class="alignment-guides-layer">
        <!-- Horizontal Center Guideline across y=675 -->
        <div class="guide-line-h guide-line-center" style="top:675px;" title="Horizontal Center (y=675)"></div>
        <!-- Vertical Center Guideline across x=540 -->
        <div class="guide-line-v guide-line-center" style="left:540px;" title="Vertical Center (x=540)"></div>
        <!-- Margins -->
        ${theme.domain === 'magic' ? `
          <div class="guide-line-v" style="left:66px;" title="Left Margin / Emblem & Series (x=66)"></div>
          <div class="guide-line-v" style="left:1014px;" title="Right Margin / Vertical Username (x=1014)"></div>
          <div class="guide-line-h" style="top:66px;" title="Top Emblem & Username Top (y=66)"></div>
          <div class="guide-line-h" style="top:1278px;" title="Bottom Series & Counter Center (y=1278)"></div>
        ` : `
          <div class="guide-line-v" style="left:96px;"></div>
          <div class="guide-line-v" style="left:984px;"></div>
          <div class="guide-line-h" style="top:64px;"></div>
          <div class="guide-line-h" style="top:1286px;"></div>
        `}
      </div>
    `;
  }

  // ==================== SCENE ELEMENT HTML BUILDER ====================
  function buildElementInnerHTML(el) {
    if (el.type === 'text') {
      const fontStack = el.fontFamily === 'Proxima Nova'
        ? "'Proxima Nova', 'Montserrat', sans-serif"
        : `'${el.fontFamily}', sans-serif`;
      const textShadow = el.embossed
        ? '1px 2px 0px rgba(235, 178, 110, 0.88), -1px -1px 1px rgba(0, 0, 0, 0.68)'
        : 'none';
      const bgStyle = el.hasBg ? `background:${el.bgColor || 'rgba(0,0,0,0.5)'};padding:4px 10px;border-radius:6px;` : '';

      const textDeco = [el.isUnderline ? 'underline' : '', el.isStrike ? 'line-through' : ''].filter(Boolean).join(' ') || 'none';
      const fontStyle = el.isItalic ? 'italic' : 'normal';
      const fontWeight = el.isBold ? '700' : (el.fontWeight || '400');

      // Top right vertical handle special rendering
      if (el.role === 'handle') {
        return `
          <div class="scene-element-text"
            data-el-id="${el.id}"
            style="
              font-family:${fontStack};
              font-size:${el.fontSize}px;
              font-weight:${fontWeight};
              font-style:${fontStyle};
              line-height:${el.lineHeight};
              letter-spacing:${el.letterSpacing}em;
              color:${el.color};
              writing-mode: vertical-rl;
              text-orientation: mixed;
              user-select: none;
              white-space: nowrap;
            "
          ><span style="color:${el.accentColor || '#C19358'};font-weight:700;">|</span> ${escapeHtml(el.text.replace(/^\|\s*/, ''))}</div>
        `;
      }

      return `
        <div class="scene-element-text"
          data-el-id="${el.id}"
          style="
            font-family:${fontStack};
            font-size:${el.fontSize}px;
            font-weight:${fontWeight};
            font-style:${fontStyle};
            text-decoration:${textDeco};
            line-height:${el.lineHeight};
            letter-spacing:${el.letterSpacing}em;
            color:${el.color};
            text-align:${el.align || 'center'};
            text-transform:${el.uppercase ? 'uppercase' : 'none'};
            text-shadow:${textShadow};
            ${bgStyle}
          "
        >${formatRichTextHtml(el.text, el.accentColor)}</div>
      `;
    }

    if (el.type === 'emblem') {
      const src = el.customSrc || ASSETS[el.emblemVariant] || ASSETS.emblem_theory;
      return `<img src="${src}" style="width:100%;height:100%;object-fit:contain;pointer-events:none;display:block;" alt="Emblem" />`;
    }

    if (el.type === 'magic-swipe') {
      const src = ASSETS[el.swipeVariant] || ASSETS.swipe_gold;
      const swipeColor = el.fill || el.color || (theme.id === 'magic-application' ? (theme.pipeColor || '#EBB168') : theme.textColor) || '#CCC5AB';
      return `
        <div style="
          width:100%;
          height:100%;
          background-color:${swipeColor};
          -webkit-mask: url('${src}') no-repeat center / contain;
          mask: url('${src}') no-repeat center / contain;
          pointer-events:none;
        "></div>
      `;
    }

    if (el.type === 'cta-bookmark') {
      const bColor = el.fill || theme.textColor || (theme.id === 'magic-application' ? '#2B1F17' : '#CCC5AB');
      return `
        <svg width="100%" height="100%" viewBox="0 0 34 42" fill="none" style="display:block;">
          <path d="M3 2H31V40L17 29L3 40V2Z" stroke="${bColor}" stroke-width="3.5" stroke-linejoin="round" />
        </svg>
      `;
    }

    if (el.type === 'magic-cta-icons') {
      return `
        <div style="display:flex;align-items:center;justify-content:center;gap:36px;width:100%;height:100%;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${el.stroke || '#C19358'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${el.stroke || '#C19358'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </div>
      `;
    }

    if (el.type === 'games-border-pattern') {
      const isTop = (el.patternPosition === 'top') || (el.y < 500);
      const patType = el.patternType || 'chevrons';
      if (patType === 'none') {
        return `<div style="width:100%;height:100%;"></div>`;
      }

      const fillUrl = `url(#pat_global_${patType})`;
      let svgSegments = '';

      if (isTop) {
        for (let s = 0; s < state.numSlides; s++) {
          const sx = s * SLIDE_W;
          // All GameDev border patterns (chevrons, stripes, dots) cover the full width
          if (s === 0 && state.showSlide1Notch) {
            // Slide 1 only masks out starting where trapezoid starts [360..720]
            svgSegments += `
              <rect x="${sx}" y="0" width="360" height="64" fill="${fillUrl}" />
              <rect x="${sx + 720}" y="0" width="360" height="64" fill="${fillUrl}" />
            `;
          } else {
            // Full 1080px width (exact integer tiles: 12x90px chevrons, 24x45px dots, seamless slide transitions)
            svgSegments += `
              <rect x="${sx}" y="0" width="1080" height="64" fill="${fillUrl}" />
            `;
          }
        }
      } else {
        // Bottom border (all patterns full width around swipe button [450..630])
        for (let s = 0; s < state.numSlides; s++) {
          const sx = s * SLIDE_W;
          if (s < state.numSlides - 1) {
            // Full width around swipe button [0..450] and [630..1080]
            svgSegments += `
              <rect x="${sx}" y="0" width="450" height="64" fill="${fillUrl}" />
              <rect x="${sx + 630}" y="0" width="450" height="64" fill="${fillUrl}" />
            `;
          } else {
            // End CTA Slide has no swipe button: full 1080px
            svgSegments += `
              <rect x="${sx}" y="0" width="1080" height="64" fill="${fillUrl}" />
            `;
          }
        }
      }

      return `
        <svg width="${el.w}" height="64" viewBox="0 0 ${el.w} 64" style="width:100%;height:100%;display:block;overflow:visible;">
          ${svgSegments}
        </svg>
      `;
    }

    if (el.type === 'games-notch') {
      const fill = el.fill || '#219652';
      return `
        <div style="position:relative;width:100%;height:100%;pointer-events:none;">
          <svg width="366" height="155" viewBox="357 0 366 155" style="position:absolute;left:0;top:0;overflow:visible;">
            <rect x="357" y="0" width="366" height="71" fill="${fill}" />
            <polygon points="359,68 721,68 676,155 404,155" fill="${fill}" />
            <polyline points="359,66.5 404,155 676,155 721,66.5" fill="none" stroke="#000000" stroke-width="3.5" stroke-linejoin="round" />
          </svg>
          <div style="
            position:absolute;
            left:0;
            top:14px;
            width:100%;
            height:50px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-family:'Rubik', sans-serif;
            font-size:32px;
            font-weight:700;
            color:#111111;
            letter-spacing:0.06em;
            text-transform:uppercase;
            user-select:none;
          ">${escapeHtml(el.topicText || 'TOPIC')}</div>
        </div>
      `;
    }

    if (el.type === 'games-swipe-combo') {
      return `
        <div style="
          width:100%;
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          pointer-events:none;
        ">
          ${ASSETS.swipe_white ? `<img src="${ASSETS.swipe_white}" style="width:40px;height:40px;object-fit:contain;pointer-events:none;" alt="" />` : ''}
          <span style="font-family:'JetBrains Mono', monospace;font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:0.04em;">SWIPE</span>
        </div>
      `;
    }

    if (el.type === 'games-username-box') {
      const isIdea = state.themeId === 'games-idea';
      const defaultUserColor = isIdea ? '#CBD5E1' : '#162D43';
      const defaultBoxBg = isIdea ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
      const defaultBoxBorder = isIdea ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
      return `
        <div style="
          width:100%;
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:${el.boxBg || defaultBoxBg};
          border:1px solid ${el.boxBorder || defaultBoxBorder};
          border-radius:6px;
          font-family:'JetBrains Mono', monospace;
          font-size:${el.fontSize || 18}px;
          font-weight:600;
          color:${el.textColor || defaultUserColor};
          letter-spacing:0.04em;
        ">${escapeHtml(el.handleText || '@CreativeProblemSolver')}</div>
      `;
    }

    if (el.type === 'image' || el.type === 'bg-image') {
      const b = el.brightness ?? 100;
      const s = el.saturation ?? 100;
      const filter = `filter: brightness(${b}%) saturate(${s}%);`;
      return `<img src="${el.src}" style="width:100%;height:100%;object-fit:${el.fit || 'cover'};${filter}pointer-events:none;display:block;" alt="" />`;
    }

    if (el.type === 'divider' || el.type === 'rect') {
      const bg = el.noFill ? 'transparent' : (el.fill || '#C19358');
      const border = el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke || '#000000'}` : 'none';
      return `<div style="width:100%;height:100%;background:${bg};border:${border};"></div>`;
    }

    if (el.type === 'triangle') {
      const fill = el.noFill ? 'none' : (el.fill || 'none');
      const stroke = el.stroke || '#162D43';
      const sw = el.strokeWidth ?? 6;
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 180" preserveAspectRatio="none" style="overflow:visible;">
          <polygon points="100,8 192,172 8,172" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        </svg>
      `;
    }

    return '';
  }

  // Combined Panoramic Layer: Background images rendered first, foreground elements second, in the SAME container!
  // This guarantees mix-blend-mode blends seamlessly without isolated stacking contexts.
  function buildUnifiedPanoramicHTML() {
    const bgElements = state.elements.filter(el => el.layerGroup === 'background');
    const fgElements = state.elements.filter(el => el.layerGroup !== 'background');
    const sorted = [...bgElements, ...fgElements];

    return sorted.map(el => {
      const op = (el.opacity ?? 100) / 100;
      const rot = el.rotation || 0;
      const blend = el.blendMode || 'normal';
      return `
        <div class="scene-element ${el.layerGroup === 'background' ? 'scene-bg-element' : ''}"
          data-el-id="${el.id}"
          data-el-type="${el.type}"
          data-el-role="${el.role || ''}"
          style="
            left:${el.x}px;
            top:${el.y}px;
            width:${el.w}px;
            height:${el.h}px;
            opacity:${op};
            transform:rotate(${rot}deg);
            mix-blend-mode:${blend};
          "
        >${buildElementInnerHTML(el)}</div>
      `;
    }).join('');
  }

  // ==================== MAIN RENDER PIPELINE ====================
  function renderAll() {
    syncAutoPageNumbers();

    const theme = getActiveTheme();
    const totalW = state.numSlides * SLIDE_W;
    const gapPx = state.showSeamGaps ? 28 : 0;
    const panoramicHTML = buildUnifiedPanoramicHTML();

    // 1. Render Side-by-Side Strip Slides
    let stripHTML = '';
    for (let i = 0; i < state.numSlides; i++) {
      const isActive = i === state.activeSlide;
      const isEnd = i === state.numSlides - 1;
      const tag = isEnd ? 'END CTA' : (theme.domain === 'magic' ? `SLIDE ${toRoman(i + 1)}` : `SLIDE ${i + 1}`);

      stripHTML += `
        <div class="carousel-slide" data-slide-index="${i}" style="margin-right:${i < state.numSlides - 1 ? gapPx : 0}px;">
          <div class="slide-number-header ${isActive ? 'active-header' : ''}" data-slide-index="${i}">
            <span>${tag}</span>
            <span>1080×1350</span>
          </div>

          <!-- Layer 1: Base Slide Background -->
          <div class="slide-bg-layer" style="position:absolute;inset:0;z-index:10;">
            ${buildSlideBackgroundHTML(i, theme)}
          </div>

          <!-- Layer 2: Unified Panoramic Scene (Background images first, foreground on top, same container for blending) -->
          <div class="slide-panoramic-viewport" style="z-index:20;">
            <div class="slide-panoramic-scene" style="width:${totalW}px;transform:translateX(${-i * SLIDE_W}px);">
              ${panoramicHTML}
            </div>
          </div>

          <!-- Layer 3: Visual Guidelines -->
          ${buildVisualGuidelinesHTML(theme)}
        </div>
      `;
    }
    dom.stripSlidesContainer.innerHTML = stripHTML;

    // Dimensions & Scale
    const fullStripWidth = state.numSlides * SLIDE_W + (state.numSlides - 1) * gapPx;
    dom.stripStageWrapper.style.width = `${fullStripWidth * state.zoom}px`;
    dom.stripStageWrapper.style.height = `${SLIDE_H * state.zoom}px`;
    dom.stripSlidesContainer.style.transform = `scale(${state.zoom})`;
    dom.stripSlidesContainer.style.transformOrigin = '0 0';

    dom.stripSmartGuidesLayer.style.width = `${fullStripWidth}px`;
    dom.stripSmartGuidesLayer.style.transform = `scale(${state.zoom})`;
    dom.stripSmartGuidesLayer.style.transformOrigin = '0 0';

    dom.stripInteractionLayer.style.width = `${fullStripWidth}px`;
    dom.stripInteractionLayer.style.transform = `scale(${state.zoom})`;
    dom.stripInteractionLayer.style.transformOrigin = '0 0';

    renderSelectionOverlay(gapPx);

    // 2. Render Instagram Simulator
    renderSimulator(theme, totalW, panoramicHTML);

    // 3. Update UI Controls, Layers List & Inspector
    updateTopAndViewportBars();
    renderPresetElementsDrawer(theme);
    renderLayersList();
    updateInspector();
  }

  function renderSelectionOverlay(gapPx) {
    const el = getSelectedElement();
    if (!el || state.editingTextId === el.id) {
      dom.stripInteractionLayer.innerHTML = '';
      return;
    }

    const primarySlide = Math.max(0, Math.min(state.numSlides - 1, Math.floor((el.x + el.w / 2) / SLIDE_W)));
    const visualX = el.x + primarySlide * gapPx;

    dom.stripInteractionLayer.innerHTML = `
      <div class="selection-box" id="activeSelectionBox"
        style="
          left:${visualX}px;
          top:${el.y}px;
          width:${el.w}px;
          height:${el.h}px;
          transform:rotate(${el.rotation || 0}deg);
        ">
        <div class="handle-rot" data-handle="rot" title="Drag to rotate (Hold Shift for 45°)"></div>
        <div class="selection-handle handle-nw" data-handle="nw"></div>
        <div class="selection-handle handle-n"  data-handle="n"></div>
        <div class="selection-handle handle-ne" data-handle="ne"></div>
        <div class="selection-handle handle-e"  data-handle="e"></div>
        <div class="selection-handle handle-se" data-handle="se"></div>
        <div class="selection-handle handle-s"  data-handle="s"></div>
        <div class="selection-handle handle-sw" data-handle="sw"></div>
        <div class="selection-handle handle-w"  data-handle="w"></div>
      </div>
    `;
  }

  function renderSimulator(theme, totalW, panoramicHTML) {
    dom.igUsername.textContent = theme.igHandle;
    dom.igSubtext.textContent = theme.igSub;
    dom.igAvatar.textContent = theme.domain === 'magic' ? '✦' : '🎮';

    let trackHTML = '';
    let dotsHTML = '';
    for (let i = 0; i < state.numSlides; i++) {
      trackHTML += `
        <div class="ig-slide-slot" data-slide-index="${i}">
          <div class="ig-slide-scaler">
            <div style="position:absolute;inset:0;z-index:10;">
              ${buildSlideBackgroundHTML(i, theme)}
            </div>
            <div class="slide-panoramic-viewport" style="z-index:20;">
              <div class="slide-panoramic-scene" style="width:${totalW}px;transform:translateX(${-i * SLIDE_W}px);">
                ${panoramicHTML}
              </div>
            </div>
          </div>
        </div>
      `;
      dotsHTML += `<div class="ig-dot ${i === state.activeSlide ? 'active' : ''}" data-dot-index="${i}"></div>`;
    }

    dom.igTrack.innerHTML = trackHTML;
    dom.igDotsContainer.innerHTML = dotsHTML;
    updateSimulatorPosition();
  }

  function updateSimulatorPosition(dragOffsetPx = 0) {
    const frameW = 460;
    const baseTranslate = -state.activeSlide * frameW + dragOffsetPx;
    dom.igTrack.style.transform = `translate3d(${baseTranslate}px, 0, 0)`;
    dom.igCounterPill.textContent = `${state.activeSlide + 1}/${state.numSlides}`;
    dom.igPrevBtn.disabled = state.activeSlide <= 0;
    dom.igNextBtn.disabled = state.activeSlide >= state.numSlides - 1;

    const dots = dom.igDotsContainer.querySelectorAll('.ig-dot');
    dots.forEach((d, idx) => d.classList.toggle('active', idx === state.activeSlide));
  }

  // ==================== LEFT SIDEBAR PRESET ELEMENTS DRAWER ====================
  function renderPresetElementsDrawer(theme) {
    dom.presetBadgeLabel.textContent = theme.domain === 'magic' ? 'Magic' : 'gameDev';

    if (theme.domain === 'magic') {
      dom.presetElementsGrid.innerHTML = `
        <button id="btnToolAddHeadline" class="tool-btn">
          <span class="tool-icon">H</span>
          <span class="tool-label">Add Headline</span>
        </button>
        <button id="btnToolAddSubtitle" class="tool-btn">
          <span class="tool-icon">T</span>
          <span class="tool-label">Add Subtitle</span>
        </button>
        <button id="btnToolAddDivider" class="tool-btn">
          <span class="tool-icon">―</span>
          <span class="tool-label">Gold Divider</span>
        </button>
        <button id="btnToolAddHeartShare" class="tool-btn">
          <span class="tool-icon">♡</span>
          <span class="tool-label">Heart &amp; Share</span>
        </button>
        <button id="btnToolAddRect" class="tool-btn">
          <span class="tool-icon">▭</span>
          <span class="tool-label">Callout Box</span>
        </button>
        <button id="btnToolAddDiamond" class="tool-btn">
          <span class="tool-icon">◇</span>
          <span class="tool-label">Diamond Marker</span>
        </button>
      `;
    } else {
      dom.presetElementsGrid.innerHTML = `
        <button id="btnToolAddGamesHero" class="tool-btn" style="grid-column: span 2;">
          <span class="tool-icon">★</span>
          <span class="tool-label">Framed Header Trio (LOOTBOXES)</span>
        </button>
        <button id="btnToolAddHeadline" class="tool-btn">
          <span class="tool-icon">H</span>
          <span class="tool-label">Add Keyword</span>
        </button>
        <button id="btnToolAddSubtitle" class="tool-btn">
          <span class="tool-icon">T</span>
          <span class="tool-label">Add Subtitle</span>
        </button>
        <button id="btnToolAddTri" class="tool-btn">
          <span class="tool-icon">△</span>
          <span class="tool-label">Sketch Triangle</span>
        </button>
        <button id="btnToolAddUserBox" class="tool-btn">
          <span class="tool-icon">@</span>
          <span class="tool-label">Username Box</span>
        </button>
        <button id="btnToolAddRect" class="tool-btn">
          <span class="tool-icon">▭</span>
          <span class="tool-label">CTA Box</span>
        </button>
        <button id="btnToolAddDivider" class="tool-btn">
          <span class="tool-icon">―</span>
          <span class="tool-label">Divider Line</span>
        </button>
      `;
    }

    bindPresetElementDrawerButtons(theme);
  }

  function bindPresetElementDrawerButtons(theme) {
    const sx = state.activeSlide * SLIDE_W;

    const addH = document.getElementById('btnToolAddHeadline');
    if (addH) addH.onclick = () => {
      const newEl = {
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'headline',
        text: theme.domain === 'magic' ? 'NEW PRINCIPLE' : 'KEYWORD',
        x: sx + 100,
        y: 440,
        w: 880,
        h: 160,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.headlineDefaults
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addS = document.getElementById('btnToolAddSubtitle');
    if (addS) addS.onclick = () => {
      const newEl = {
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'subtitle',
        text: 'Double-click to edit *subtitle* text',
        x: sx + 120,
        y: 640,
        w: 840,
        h: 120,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.subtitleDefaults
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addDiv = document.getElementById('btnToolAddDivider');
    if (addDiv) addDiv.onclick = () => {
      const newEl = {
        id: genId('div'),
        type: 'divider',
        layerGroup: 'foreground',
        x: sx + 350,
        y: 710,
        w: 380,
        h: 4,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.pipeColor || theme.outerColor || '#C19358',
        noFill: false,
        stroke: '#000000',
        strokeWidth: 0
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addRect = document.getElementById('btnToolAddRect');
    if (addRect) addRect.onclick = () => {
      const newEl = {
        id: genId('rect'),
        type: 'rect',
        layerGroup: 'foreground',
        x: sx + 340,
        y: 525,
        w: 400,
        h: 220,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.outerColor || '#C19358',
        noFill: false,
        stroke: '#000000',
        strokeWidth: 3.5
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addHS = document.getElementById('btnToolAddHeartShare');
    if (addHS) addHS.onclick = () => {
      const newEl = {
        id: genId('cta-icons'),
        type: 'magic-cta-icons',
        layerGroup: 'foreground',
        name: 'Heart & Share CTA Icons',
        x: sx + 390,
        y: 745,
        w: 300,
        h: 110,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        stroke: theme.pipeColor
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addDia = document.getElementById('btnToolAddDiamond');
    if (addDia) addDia.onclick = () => {
      const newEl = {
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'diamond',
        text: '◇',
        x: sx + 514,
        y: 1252,
        w: 52,
        h: 52,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fontFamily: 'Caudex',
        fontSize: 32,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        lineHeight: 1.0,
        letterSpacing: 0,
        color: theme.pipeColor,
        accentColor: theme.pipeColor,
        uppercase: false,
        embossed: false,
        align: 'center'
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addTri = document.getElementById('btnToolAddTri');
    if (addTri) addTri.onclick = () => {
      const newEl = {
        id: genId('tri'),
        type: 'triangle',
        layerGroup: 'foreground',
        x: sx + 370,
        y: 680,
        w: 340,
        h: 300,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        fill: theme.outerColor || '#219652',
        noFill: true,
        stroke: theme.textColor || '#162D43',
        strokeWidth: 6
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addUserBox = document.getElementById('btnToolAddUserBox');
    if (addUserBox) addUserBox.onclick = () => {
      const isIdea = theme.id === 'games-idea';
      const userColor = isIdea ? '#CBD5E1' : (theme.usernameColor || '#162D43');
      const userBoxBg = isIdea ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
      const userBoxBorder = isIdea ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
      const newEl = {
        id: genId('games-user'),
        type: 'games-username-box',
        layerGroup: 'foreground',
        name: 'Username Box',
        handleText: theme.frameHandle,
        x: sx + 390,
        y: 1226,
        w: 300,
        h: 38,
        rotation: 0,
        opacity: isIdea ? 85 : 60,
        blendMode: 'normal',
        textColor: userColor,
        boxBg: userBoxBg,
        boxBorder: userBoxBorder
      };
      state.elements.push(newEl);
      state.selectedId = newEl.id;
      renderAll();
    };

    const addHeroTrio = document.getElementById('btnToolAddGamesHero');
    if (addHeroTrio) addHeroTrio.onclick = () => {
      const topEl = {
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'subtitle',
        text: theme.topSubtitleText || `Things I *${theme.id === 'games-love' ? 'LOVE' : theme.id === 'games-hate' ? 'HATE' : 'MISS'}* in games #0001`,
        x: sx + 96,
        y: 315,
        w: 888,
        h: 64,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.subtitleDefaults,
        align: 'left'
      };
      const midEl = {
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'headline',
        text: 'LOOTBOXES',
        x: sx + 76,
        y: 382,
        w: 928,
        h: 165,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.headlineDefaults,
        fontSize: 142,
        align: 'center'
      };
      const botEl = {
        id: genId('txt'),
        type: 'text',
        layerGroup: 'foreground',
        role: 'subtitle',
        text: theme.bottomSubtitleText || (theme.id === 'games-love' ? 'and what to *LEARN* from that' : theme.id === 'games-hate' ? 'and how to *FIX* them' : 'and how to *IMPLEMENT* them'),
        x: sx + 96,
        y: 558,
        w: 888,
        h: 64,
        rotation: 0,
        opacity: 100,
        blendMode: 'normal',
        ...theme.subtitleDefaults,
        align: 'right'
      };
      state.elements.push(topEl, midEl, botEl);
      state.selectedId = midEl.id;
      renderAll();
    };
  }

  // ==================== UI & INSPECTOR UPDATES ====================
  function updateTopAndViewportBars() {
    dom.themeSelect.value = state.themeId;
    dom.slideCountInput.value = state.numSlides;
    dom.activeSlideLabel.textContent = `${state.activeSlide + 1} / ${state.numSlides}`;
    dom.zoomReadout.textContent = `${Math.round(state.zoom * 100)}%`;

    // Background tuning
    const theme = getActiveTheme();
    const curColor = state.bgTuning.colorOverride || (theme.domain === 'magic' ? theme.bgColor : theme.innerBgColor);
    dom.bgBaseColorInput.value = normalizeHex(curColor);
    dom.bgBaseColorHex.value = normalizeHex(curColor).toUpperCase();
    dom.bgBrightnessSlider.value = state.bgTuning.brightness;
    dom.bgBrightnessVal.textContent = `${state.bgTuning.brightness}%`;
    dom.bgSaturationSlider.value = state.bgTuning.saturation;
    dom.bgSaturationVal.textContent = `${state.bgTuning.saturation}%`;
    dom.bgOpacitySlider.value = state.bgTuning.textureOpacity;
    dom.bgOpacityVal.textContent = `${state.bgTuning.textureOpacity}%`;

    // Page Numbers toggle button highlight
    if (dom.btnTogglePageNumbers) {
      dom.btnTogglePageNumbers.classList.toggle('active', Boolean(state.showPageNumbers));
    }

    // Quick text role switcher
    const sel = getSelectedElement();
    if (sel && sel.type === 'text') {
      dom.quickTextBar.classList.remove('hidden');
      dom.quickBtnHeadline.classList.toggle('active', sel.role === 'headline');
      dom.quickBtnSubtitle.classList.toggle('active', sel.role === 'subtitle');
    } else {
      dom.quickTextBar.classList.add('hidden');
    }
  }

  // Filter layer overview to ONLY elements on the currently active slide (or touching it)
  function renderLayersList() {
    const curSlide = state.activeSlide;
    const slideLeft = curSlide * SLIDE_W;
    const slideRight = (curSlide + 1) * SLIDE_W;

    const visibleElements = state.elements.filter(el => {
      return el.x + el.w > slideLeft && el.x < slideRight;
    });

    dom.layerCountBadge.textContent = String(visibleElements.length);
    const reversed = [...visibleElements].reverse();

    dom.layersList.innerHTML = reversed.map(el => {
      const isSelected = el.id === state.selectedId;
      const spanInfo = getSlideSpanInfo(el);
      let label = el.name || el.type.toUpperCase();
      let typeBadge = el.type.slice(0, 3).toUpperCase();
      let badgeCls = '';

      if (el.layerGroup === 'background') {
        typeBadge = 'BG';
        badgeCls = 'bg-badge';
        label = el.name || 'Background Image';
      } else if (el.type === 'text') {
        typeBadge = el.role === 'headline' ? 'H1' : (el.role === 'subtitle' ? 'SUB' : 'TXT');
        label = (el.text || 'Text').replace(/\n/g, ' ').slice(0, 24);
      } else if (el.type === 'emblem') {
        typeBadge = 'EMB';
        label = 'Magic Emblem';
      } else if (el.type === 'games-notch') {
        typeBadge = 'NOTCH';
        label = `Top Notch (${el.topicText || 'EPISODE'})`;
      } else if (el.type === 'games-swipe-combo') {
        typeBadge = 'SWIPE';
        label = 'Bottom Swipe + Icon';
      } else if (el.type === 'games-username-box') {
        typeBadge = 'USER';
        label = el.handleText || 'Username Box';
      } else if (el.type === 'games-border-pattern') {
        typeBadge = 'PAT';
        label = el.name || (el.patternPosition === 'top' ? 'Top Border Pattern' : 'Bottom Border Pattern');
      }

      return `
        <div class="layer-item ${isSelected ? 'active' : ''}" data-layer-id="${el.id}">
          <div class="layer-item-left">
            <span class="layer-type-badge ${badgeCls}">${typeBadge}</span>
            <span class="layer-title">${escapeHtml(label)}</span>
          </div>
          <span class="layer-slide-tag">${spanInfo.text}</span>
        </div>
      `;
    }).join('');
  }

  function updateInspector() {
    const theme = getActiveTheme();
    const sel = getSelectedElement();

    // Summary Card
    dom.themeSummaryCard.innerHTML = `
      <strong style="color:var(--accent-gold);display:block;margin-bottom:4px;">${escapeHtml(theme.name)}</strong>
      <span>${escapeHtml(theme.description)}</span>
    `;
    dom.frameHandleInput.value = state.frameConfig.handle;
    dom.frameSeriesInput.value = state.frameConfig.series;

    if (!sel) {
      dom.inspectorEmptyState.classList.remove('hidden');
      dom.inspectorElementState.classList.add('hidden');
      if (dom.inspSlideSectionEmpty) {
        const isSlide1Games = theme.domain === 'games' && state.activeSlide === 0;
        dom.inspSlideSectionEmpty.classList.toggle('hidden', !isSlide1Games);
        if (dom.toggleSlide1NotchEmpty) {
          dom.toggleSlide1NotchEmpty.checked = Boolean(state.showSlide1Notch);
        }
      }
      return;
    }

    dom.inspectorEmptyState.classList.add('hidden');
    dom.inspectorElementState.classList.remove('hidden');

    const spanInfo = getSlideSpanInfo(sel);
    dom.inspElementTypeTitle.textContent = `${(sel.name || sel.type).toUpperCase()} INSPECTOR`;
    dom.inspSlideSpanBadge.textContent = spanInfo.text;

    dom.inspOpacity.value = Math.round(sel.opacity ?? 100);
    dom.inspOpacityVal.textContent = `${Math.round(sel.opacity ?? 100)}%`;
    dom.inspBlendMode.value = sel.blendMode || 'normal';

    // Show/Hide specific inspector sub-panels
    dom.inspEmblemSection.classList.toggle('hidden', sel.type !== 'emblem');
    dom.inspTextSection.classList.toggle('hidden', sel.type !== 'text' && sel.type !== 'games-username-box');
    dom.inspShapeSection.classList.toggle('hidden', !['divider', 'rect', 'triangle', 'games-notch', 'games-swipe-combo', 'magic-swipe'].includes(sel.type));
    dom.inspImageSection.classList.toggle('hidden', !['image', 'bg-image'].includes(sel.type));
    dom.inspPatternSection.classList.toggle('hidden', sel.type !== 'games-border-pattern');
    if (dom.inspSlideSection) {
      const isSlide1Games = theme.domain === 'games' && state.activeSlide === 0;
      dom.inspSlideSection.classList.toggle('hidden', !isSlide1Games);
      if (dom.toggleSlide1Notch) {
        dom.toggleSlide1Notch.checked = Boolean(state.showSlide1Notch);
      }
    }

    // Emblem Switcher panel
    if (sel.type === 'emblem') {
      dom.thumbEmblemTheory.src = ASSETS.emblem_theory || '';
      dom.thumbEmblemApp.src = ASSETS.emblem_application || '';
      dom.thumbEmblemIdea.src = ASSETS.emblem_idea || '';
      dom.thumbEmblemCharcoal.src = ASSETS.emblem_idea_charcoal || '';

      const buttons = dom.inspEmblemSection.querySelectorAll('.emblem-option-btn');
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.emblem === sel.emblemVariant && !sel.customSrc);
        btn.onclick = () => {
          sel.emblemVariant = btn.dataset.emblem;
          sel.customSrc = null;
          renderAll();
        };
      });
    }

    // Text Inspector (Supports standard text elements & Games username boxes)
    if (sel.type === 'text' || sel.type === 'games-username-box') {
      // Populate preset-dependent font families
      updateFontFamilyOptions(theme);

      const isUserBox = sel.type === 'games-username-box';
      const textVal = isUserBox ? (sel.handleText || '') : (sel.text || '');
      if (document.activeElement !== dom.inspTextContent) {
        dom.inspTextContent.value = textVal;
      }
      dom.inspFontFamily.value = sel.fontFamily || (theme.domain === 'magic' ? 'Caudex' : 'JetBrains Mono');
      dom.inspFontSize.value = Math.round(sel.fontSize || (isUserBox ? 18 : 40));
      dom.inspLineHeight.value = sel.lineHeight ?? 1.15;
      dom.inspLetterSpacing.value = sel.letterSpacing ?? 0;

      // Toggle buttons active state
      dom.btnTextBold.classList.toggle('active', Boolean(sel.isBold));
      dom.btnTextItalic.classList.toggle('active', Boolean(sel.isItalic));
      dom.btnTextUnderline.classList.toggle('active', Boolean(sel.isUnderline));
      dom.btnTextStrike.classList.toggle('active', Boolean(sel.isStrike));
      dom.btnTextCaps.classList.toggle('active', Boolean(sel.uppercase));

      // Color Swatch Bars
      const isIdea = state.themeId === 'games-idea';
      const fallbackColor = isUserBox ? (isIdea ? '#CBD5E1' : '#162D43') : '#FFFFFF';
      const currentColor = isUserBox ? (sel.textColor || fallbackColor) : (sel.color || fallbackColor);
      const colorHex = normalizeHex(currentColor, fallbackColor);
      dom.inspTextColor.value = colorHex;
      dom.textColorSwatchBar.style.background = colorHex;

      const accHex = normalizeHex(sel.accentColor || theme.accentColor, '#C19358');
      dom.inspAccentColor.value = accHex;
      dom.accentColorSwatchBar.style.background = accHex;

      const bgHex = normalizeHex(sel.bgColor, '#000000');
      dom.inspTextBgColor.value = bgHex;
      dom.textBgColorSwatchBar.style.background = sel.hasBg ? bgHex : 'transparent';
      dom.inspTextHasBg.checked = Boolean(sel.hasBg);

      dom.inspTextEmbossed.checked = Boolean(sel.embossed);
    }

    // Shape / Notch / Swipe Inspector
    if (['divider', 'rect', 'triangle', 'games-notch', 'games-swipe-combo', 'magic-swipe'].includes(sel.type)) {
      dom.inspShapeFill.value = normalizeHex(sel.fill || sel.color, theme.textColor || theme.outerColor || '#C19358');
      dom.inspShapeNoFill.checked = Boolean(sel.noFill);
      dom.inspShapeStroke.value = normalizeHex(sel.stroke, '#000000');
      dom.inspShapeStrokeWidth.value = sel.strokeWidth ?? 0;
    }

    // Image / Background Image Inspector
    if (['image', 'bg-image'].includes(sel.type)) {
      dom.inspImgFit.value = sel.fit || 'cover';
      dom.inspImgBrightness.value = sel.brightness ?? 100;
      dom.inspImgBrightVal.textContent = `${sel.brightness ?? 100}%`;
      dom.inspImgSaturation.value = sel.saturation ?? 100;
      dom.inspImgSatVal.textContent = `${sel.saturation ?? 100}%`;
      dom.inspImgIsBg.checked = sel.layerGroup === 'background';
    }

    // Border Pattern Inspector
    if (sel.type === 'games-border-pattern') {
      const curPat = sel.patternType || 'chevrons';
      const pBtns = dom.inspPatternSection.querySelectorAll('.pattern-option-btn');
      pBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pattern === curPat);
      });
    }
  }

  // Populate Font Family dropdown based strictly on preset domain
  function updateFontFamilyOptions(theme) {
    if (theme.domain === 'magic') {
      dom.inspFontFamily.innerHTML = `
        <option value="Caudex">Caudex (Headline / Title)</option>
        <option value="Proxima Nova">Proxima Nova (Body / Secondary)</option>
        <option value="Playfair Display SC">Playfair Display SC (Page Counter)</option>
      `;
    } else {
      dom.inspFontFamily.innerHTML = `
        <option value="JetBrains Mono">JetBrains Mono (Keyword / Mono)</option>
        <option value="Rubik">Rubik (Framing / Body)</option>
      `;
    }
  }

  // ==================== ROLE SWITCHING (HEADLINE <-> SUBTITLE) ====================
  function applyTextRole(el, role) {
    if (!el || el.type !== 'text') return;
    const theme = getActiveTheme();
    const defs = role === 'headline' ? theme.headlineDefaults : theme.subtitleDefaults;
    el.role = role;
    el.fontFamily = defs.fontFamily;
    el.fontSize = defs.fontSize;
    el.isBold = defs.isBold;
    el.isItalic = defs.isItalic;
    el.isUnderline = defs.isUnderline;
    el.isStrike = defs.isStrike;
    el.lineHeight = defs.lineHeight;
    el.letterSpacing = defs.letterSpacing;
    el.color = defs.color;
    el.accentColor = defs.accentColor;
    el.uppercase = defs.uppercase;
    el.embossed = defs.embossed;
    if (role === 'headline' && el.h < 130) el.h = 165;
    renderAll();
  }

  // ==================== CANVA-STYLE SMART SNAPPING & EQUAL SPACING ====================
  function computeCanvaSmartSnapping(activeEl, rawX, rawY) {
    const snapDist = 8; // Snap threshold in px
    let snappedX = rawX;
    let snappedY = rawY;
    const w = activeEl.w;
    const h = activeEl.h;
    const theme = getActiveTheme();

    const snapLines = []; // { type: 'v'|'h', coord, start, end, isCenter }
    const spacingIndicators = []; // { type: 'v'|'h', x, y, size, gap }

    const curSlide = Math.max(0, Math.min(state.numSlides - 1, Math.floor((rawX + w / 2) / SLIDE_W)));
    const slideLeft = curSlide * SLIDE_W;
    const slideRight = slideLeft + SLIDE_W;
    const slideCenterX = slideLeft + 540;
    const slideCenterY = 675;

    // 1. Center Guidelines Snapping (x = 540, y = 675)
    if (Math.abs(rawX + w / 2 - slideCenterX) <= snapDist) {
      snappedX = slideCenterX - w / 2;
      snapLines.push({ type: 'v', coord: slideCenterX, start: 0, end: SLIDE_H, isCenter: true });
    }

    if (Math.abs(rawY + h / 2 - slideCenterY) <= snapDist) {
      snappedY = slideCenterY - h / 2;
      snapLines.push({ type: 'h', coord: slideCenterY, start: slideLeft, end: slideRight, isCenter: true });
    }

    // 2. Blue Guidelines Snapping (Margins & Reference Lines)
    const leftMargin = theme.domain === 'magic' ? 66 : 96;
    const rightMargin = theme.domain === 'magic' ? 1014 : 984;
    const topMargin = theme.domain === 'magic' ? 66 : 68;
    const bottomGuide = theme.domain === 'magic' ? 1278 : 1282;

    // Snap to Left Guideline
    if (Math.abs(rawX - (slideLeft + leftMargin)) <= snapDist) {
      snappedX = slideLeft + leftMargin;
      snapLines.push({ type: 'v', coord: slideLeft + leftMargin, start: 0, end: SLIDE_H });
    }

    // Snap to Right Guideline (Element right edge or left edge)
    if (Math.abs(rawX + w - (slideLeft + rightMargin)) <= snapDist) {
      snappedX = slideLeft + rightMargin - w;
      snapLines.push({ type: 'v', coord: slideLeft + rightMargin, start: 0, end: SLIDE_H });
    } else if (Math.abs(rawX - (slideLeft + rightMargin)) <= snapDist) {
      snappedX = slideLeft + rightMargin;
      snapLines.push({ type: 'v', coord: slideLeft + rightMargin, start: 0, end: SLIDE_H });
    }

    // Snap to Top Guideline
    if (Math.abs(rawY - topMargin) <= snapDist) {
      snappedY = topMargin;
      snapLines.push({ type: 'h', coord: topMargin, start: slideLeft, end: slideRight });
    }

    // Snap to Bottom Guideline (Center or Edge)
    if (Math.abs(rawY + h / 2 - bottomGuide) <= snapDist) {
      snappedY = bottomGuide - h / 2;
      snapLines.push({ type: 'h', coord: bottomGuide, start: slideLeft, end: slideRight });
    } else if (Math.abs(rawY + h - bottomGuide) <= snapDist) {
      snappedY = bottomGuide - h;
      snapLines.push({ type: 'h', coord: bottomGuide, start: slideLeft, end: slideRight });
    }

    // 3. Element-to-Element Edge & Center Snapping
    const otherEls = state.elements.filter(other => other.id !== activeEl.id && Math.abs(other.x - rawX) < SLIDE_W * 1.5);

    for (const other of otherEls) {
      const oLeft = other.x;
      const oCenterX = other.x + other.w / 2;
      const oRight = other.x + other.w;

      const oTop = other.y;
      const oCenterY = other.y + other.h / 2;
      const oBottom = other.y + other.h;

      // X: Left-to-Left
      if (Math.abs(snappedX - oLeft) <= snapDist) {
        snappedX = oLeft;
        snapLines.push({ type: 'v', coord: oLeft, start: Math.min(snappedY, oTop), end: Math.max(snappedY + h, oBottom) });
      }
      // X: Center-to-Center
      else if (Math.abs(snappedX + w / 2 - oCenterX) <= snapDist) {
        snappedX = oCenterX - w / 2;
        snapLines.push({ type: 'v', coord: oCenterX, start: Math.min(snappedY, oTop), end: Math.max(snappedY + h, oBottom), isCenter: true });
      }
      // X: Right-to-Right
      else if (Math.abs(snappedX + w - oRight) <= snapDist) {
        snappedX = oRight - w;
        snapLines.push({ type: 'v', coord: oRight, start: Math.min(snappedY, oTop), end: Math.max(snappedY + h, oBottom) });
      }

      // Y: Top-to-Top
      if (Math.abs(snappedY - oTop) <= snapDist) {
        snappedY = oTop;
        snapLines.push({ type: 'h', coord: oTop, start: Math.min(snappedX, oLeft), end: Math.max(snappedX + w, oRight) });
      }
      // Y: Center-to-Center
      else if (Math.abs(snappedY + h / 2 - oCenterY) <= snapDist) {
        snappedY = oCenterY - h / 2;
        snapLines.push({ type: 'h', coord: oCenterY, start: Math.min(snappedX, oLeft), end: Math.max(snappedX + w, oRight), isCenter: true });
      }
      // Y: Bottom-to-Bottom
      else if (Math.abs(snappedY + h - oBottom) <= snapDist) {
        snappedY = oBottom - h;
        snapLines.push({ type: 'h', coord: oBottom, start: Math.min(snappedX, oLeft), end: Math.max(snappedX + w, oRight) });
      }
    }

    // 4. Canva Equal Spacing Detection (Vertical Equal Gaps between 3 elements)
    const slideEls = otherEls.filter(el => Math.floor(el.x / SLIDE_W) === curSlide);
    if (slideEls.length >= 2) {
      slideEls.sort((a, b) => a.y - b.y);
      for (let i = 0; i < slideEls.length - 1; i++) {
        const topEl = slideEls[i];
        const botEl = slideEls[i + 1];
        if (snappedY >= topEl.y + topEl.h && snappedY + h <= botEl.y) {
          const gapAbove = snappedY - (topEl.y + topEl.h);
          const gapBelow = botEl.y - (snappedY + h);
          if (Math.abs(gapAbove - gapBelow) <= snapDist * 2) {
            const targetGap = Math.round((botEl.y - (topEl.y + topEl.h) - h) / 2);
            if (targetGap > 8) {
              snappedY = topEl.y + topEl.h + targetGap;
              const midX = Math.round((snappedX + w / 2));
              spacingIndicators.push({ type: 'v', x: midX, y: topEl.y + topEl.h, size: targetGap, gap: targetGap });
              spacingIndicators.push({ type: 'v', x: midX, y: snappedY + h, size: targetGap, gap: targetGap });
            }
          }
        }
      }
    }

    return { snappedX: Math.round(snappedX), snappedY: Math.round(snappedY), snapLines, spacingIndicators };
  }

  function renderSmartGuidesOverlay(snapLines, spacingIndicators) {
    let html = '';

    snapLines.forEach(line => {
      const cls = line.isCenter ? 'smart-guide-line-center-snap' : '';
      if (line.type === 'v') {
        html += `<div class="smart-guide-line-v ${cls}" style="left:${line.coord}px;top:${line.start}px;height:${line.end - line.start}px;"></div>`;
      } else {
        html += `<div class="smart-guide-line-h ${cls}" style="top:${line.coord}px;left:${line.start}px;width:${line.end - line.start}px;"></div>`;
      }
    });

    spacingIndicators.forEach(sp => {
      if (sp.type === 'v') {
        html += `
          <div class="smart-spacing-indicator vertical" style="left:${sp.x - 7}px;top:${sp.y}px;height:${sp.size}px;">
            <div class="smart-spacing-badge" style="position:absolute;left:18px;">↕ ${sp.gap}px</div>
          </div>
        `;
      }
    });

    dom.stripSmartGuidesLayer.innerHTML = html;
  }

  function clearSmartGuidesOverlay() {
    dom.stripSmartGuidesLayer.innerHTML = '';
  }

  // ==================== INTERACTION: DRAG, RESIZE, ROTATE, PAN & INLINE EDIT ====================
  let dragSession = null;
  let panSession = null;
  let isSpacePressed = false;

  function clientToStageCoords(clientX, clientY) {
    const rect = dom.stripSlidesContainer.getBoundingClientRect();
    const x = (clientX - rect.left) / state.zoom;
    const y = (clientY - rect.top) / state.zoom;
    return { x, y };
  }

  function setupStripInteractions() {
    // Spacebar detection for canvas panning
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || state.editingTextId) return;

      if (e.code === 'Space' && !isSpacePressed) {
        isSpacePressed = true;
        dom.stripScrollContainer.classList.add('space-ready');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        isSpacePressed = false;
        dom.stripScrollContainer.classList.remove('space-ready');
      }
    });

    // Mousedown on Stage
    dom.stripStageWrapper.addEventListener('mousedown', (e) => {
      // 1. Canvas Panning (Space + Left Click OR Alt + Middle Click OR Middle Click)
      if ((isSpacePressed && e.button === 0) || (e.altKey && e.button === 1) || e.button === 1) {
        e.preventDefault();
        panSession = {
          startX: e.clientX,
          startY: e.clientY,
          scrollLeft: dom.stripScrollContainer.scrollLeft,
          scrollTop: dom.stripScrollContainer.scrollTop
        };
        dom.stripScrollContainer.classList.add('is-panning');
        return;
      }

      if (e.button !== 0) return;

      // Header click switches active slide
      const headerEl = e.target.closest('.slide-number-header');
      if (headerEl) {
        state.activeSlide = Number(headerEl.dataset.slideIndex) || 0;
        renderAll();
        return;
      }

      if (state.editingTextId) {
        const editingDom = e.target.closest(`[data-el-id="${state.editingTextId}"]`);
        if (editingDom) return;
        finishInlineTextEdit();
      }

      const pt = clientToStageCoords(e.clientX, e.clientY);
      const rotHandle = e.target.closest('[data-handle="rot"]');
      const resizeHandle = e.target.closest('.selection-handle');
      const selEl = getSelectedElement();

      // Helper snapshot generator for drag sessions
      const captureSessionSnapshot = () => JSON.stringify({
        elements: state.elements,
        numSlides: state.numSlides,
        themeId: state.themeId,
        bgTuning: state.bgTuning,
        frameConfig: state.frameConfig,
        showSlide1Notch: state.showSlide1Notch,
        showPageNumbers: state.showPageNumbers,
        selectedId: state.selectedId
      });

      // Rotation Handle
      if (rotHandle && selEl) {
        e.preventDefault();
        e.stopPropagation();
        dragSession = {
          mode: 'rotate',
          el: selEl,
          cx: selEl.x + selEl.w / 2,
          cy: selEl.y + selEl.h / 2,
          hasMoved: false,
          preDragSnapshot: captureSessionSnapshot()
        };
        return;
      }

      // Resize Handle
      if (resizeHandle && selEl) {
        e.preventDefault();
        e.stopPropagation();
        dragSession = {
          mode: 'resize',
          handle: resizeHandle.dataset.handle,
          el: selEl,
          startX: pt.x,
          startY: pt.y,
          origX: selEl.x,
          origY: selEl.y,
          origW: selEl.w,
          origH: selEl.h,
          origFontSize: selEl.fontSize || 40,
          hasMoved: false,
          preDragSnapshot: captureSessionSnapshot()
        };
        return;
      }

      // Element or Selection Box click
      const clickedSceneEl = e.target.closest('.scene-element');
      const clickedSelBox = e.target.closest('#activeSelectionBox');
      let targetEl = null;

      if (clickedSelBox && selEl) {
        targetEl = selEl;
      } else if (clickedSceneEl) {
        targetEl = state.elements.find(item => item.id === clickedSceneEl.dataset.elId) || null;
      }

      const clickedSlideCard = e.target.closest('.carousel-slide');
      if (clickedSlideCard) {
        state.activeSlide = Number(clickedSlideCard.dataset.slideIndex) || 0;
      }

      if (targetEl) {
        state.selectedId = targetEl.id;
        state.activeSlide = getSlideSpanInfo(targetEl).primary;
        renderAll();

        dragSession = {
          mode: 'move',
          el: targetEl,
          startX: pt.x,
          startY: pt.y,
          origX: targetEl.x,
          origY: targetEl.y,
          hasMoved: false,
          preDragSnapshot: captureSessionSnapshot()
        };
      } else {
        state.selectedId = null;
        renderAll();
      }
    });

    // Double-click inline text edit (supports unselected element and active selection box click)
    dom.stripStageWrapper.addEventListener('dblclick', (e) => {
      const clickedSelBox = e.target.closest('#activeSelectionBox');
      const clickedSceneEl = e.target.closest('.scene-element');
      let el = null;
      if (clickedSelBox && state.selectedId) {
        el = state.elements.find(item => item.id === state.selectedId);
      } else if (clickedSceneEl) {
        el = state.elements.find(item => item.id === clickedSceneEl.dataset.elId);
      }
      if (el && el.type === 'text') {
        e.preventDefault();
        e.stopPropagation();
        startInlineTextEdit(el);
      }
    });

    // Fast 60fps DOM Sync during dragging/resizing/rotating (prevents massive re-render lag)
    function syncActiveElementTransform(el) {
      const sceneNodes = document.querySelectorAll(`.scene-element[data-el-id="${el.id}"]`);
      sceneNodes.forEach(node => {
        node.style.left = `${el.x}px`;
        node.style.top = `${el.y}px`;
        node.style.width = `${el.w}px`;
        node.style.height = `${el.h}px`;
        node.style.transform = `rotate(${el.rotation || 0}deg)`;
        if (el.type === 'text') {
          const tNode = node.querySelector('.scene-element-text');
          if (tNode) tNode.style.fontSize = `${el.fontSize}px`;
        }
      });
      const selBox = document.getElementById('activeSelectionBox');
      if (selBox) {
        const gapPx = state.showSeamGaps ? 28 : 0;
        const primarySlide = Math.max(0, Math.min(state.numSlides - 1, Math.floor((el.x + el.w / 2) / SLIDE_W)));
        const visualX = el.x + primarySlide * gapPx;
        selBox.style.left = `${visualX}px`;
        selBox.style.top = `${el.y}px`;
        selBox.style.width = `${el.w}px`;
        selBox.style.height = `${el.h}px`;
        selBox.style.transform = `rotate(${el.rotation || 0}deg)`;
      }
    }

    // Mousemove for Drag, Resize, Rotate & Pan
    window.addEventListener('mousemove', (e) => {
      // Pan canvas
      if (panSession) {
        dom.stripScrollContainer.scrollLeft = panSession.scrollLeft - (e.clientX - panSession.startX);
        dom.stripScrollContainer.scrollTop = panSession.scrollTop - (e.clientY - panSession.startY);
        return;
      }

      if (!dragSession) return;
      const pt = clientToStageCoords(e.clientX, e.clientY);
      const { el, mode } = dragSession;

      if (mode === 'move') {
        let dx = pt.x - dragSession.startX;
        let dy = pt.y - dragSession.startY;

        // Shift key locks movement to horizontal or vertical axis from start point
        if (e.shiftKey) {
          if (Math.abs(dx) > Math.abs(dy)) {
            dy = 0;
          } else {
            dx = 0;
          }
        }

        const rawX = dragSession.origX + dx;
        const rawY = dragSession.origY + dy;

        // Smart Canva & Blue Guidelines snapping
        const snap = computeCanvaSmartSnapping(el, rawX, rawY);
        el.x = snap.snappedX;
        el.y = snap.snappedY;
        dragSession.hasMoved = true;

        renderSmartGuidesOverlay(snap.snapLines, snap.spacingIndicators);
        syncActiveElementTransform(el);
      } else if (mode === 'resize') {
        const dx = pt.x - dragSession.startX;
        const dy = pt.y - dragSession.startY;
        const h = dragSession.handle;
        let nx = dragSession.origX;
        let ny = dragSession.origY;
        let nw = dragSession.origW;
        let nh = dragSession.origH;

        const isImage = el.type === 'image' || el.type === 'bg-image';
        const isCorner = ['nw', 'ne', 'se', 'sw'].includes(h);

        // Aspect ratio locked resizing for uploaded images on corner handles
        if (isImage && isCorner) {
          const aspect = dragSession.origW / dragSession.origH;
          if (h === 'se') {
            const d = Math.abs(dx) > Math.abs(dy) ? dx : (dy * aspect);
            nw = Math.max(40, dragSession.origW + d);
            nh = Math.round(nw / aspect);
          } else if (h === 'sw') {
            const d = Math.abs(dx) > Math.abs(dy) ? -dx : (dy * aspect);
            nw = Math.max(40, dragSession.origW + d);
            nh = Math.round(nw / aspect);
            nx = dragSession.origX + (dragSession.origW - nw);
          } else if (h === 'ne') {
            const d = Math.abs(dx) > Math.abs(dy) ? dx : (-dy * aspect);
            nw = Math.max(40, dragSession.origW + d);
            nh = Math.round(nw / aspect);
            ny = dragSession.origY + (dragSession.origH - nh);
          } else if (h === 'nw') {
            const d = Math.abs(dx) > Math.abs(dy) ? -dx : (-dy * aspect);
            nw = Math.max(40, dragSession.origW + d);
            nh = Math.round(nw / aspect);
            nx = dragSession.origX + (dragSession.origW - nw);
            ny = dragSession.origY + (dragSession.origH - nh);
          }
        } else {
          if (h.includes('e')) nw = Math.max(20, dragSession.origW + dx);
          if (h.includes('s')) nh = Math.max(4, dragSession.origH + dy);
          if (h.includes('w')) {
            const possibleW = dragSession.origW - dx;
            if (possibleW >= 20) {
              nw = possibleW;
              nx = dragSession.origX + dx;
            }
          }
          if (h.includes('n')) {
            const possibleH = dragSession.origH - dy;
            if (possibleH >= 4) {
              nh = possibleH;
              ny = dragSession.origY + dy;
            }
          }
        }

        // Photoshop-style text scaling: proportional font size scaling on corner/edge resize
        if (el.type === 'text') {
          const scaleH = nh / dragSession.origH;
          el.fontSize = Math.max(12, Math.min(320, Math.round(dragSession.origFontSize * scaleH)));
        }

        el.x = Math.round(nx);
        el.y = Math.round(ny);
        el.w = Math.round(nw);
        el.h = Math.round(nh);
        dragSession.hasMoved = true;
        syncActiveElementTransform(el);
      } else if (mode === 'rotate') {
        const angleRad = Math.atan2(pt.y - dragSession.cy, pt.x - dragSession.cx);
        let deg = Math.round((angleRad * 180) / Math.PI + 90);

        // Global 45° snapping when Shift is held
        if (e.shiftKey) {
          deg = Math.round(deg / 45) * 45;
        }
        el.rotation = deg;
        dragSession.hasMoved = true;
        syncActiveElementTransform(el);
      }
    });

    // Mouseup: commit final state and sync inspector/layers once (eliminating transform lag)
    window.addEventListener('mouseup', () => {
      if (panSession) {
        panSession = null;
        dom.stripScrollContainer.classList.remove('is-panning');
      }
      if (dragSession) {
        if (dragSession.hasMoved) {
          if (dragSession.preDragSnapshot) {
            undoStack.push(dragSession.preDragSnapshot);
            if (undoStack.length > MAX_HISTORY) undoStack.shift();
            redoStack.length = 0;
          }
          state.activeSlide = Math.max(0, Math.min(state.numSlides - 1, Math.floor((dragSession.el.x + dragSession.el.w / 2) / SLIDE_W)));
          renderAll();
        }
        dragSession = null;
        clearSmartGuidesOverlay();
      }
    });

    // Mouse Wheel Zoom (Scroll wheel to zoom in / out centered at cursor position)
    dom.stripScrollContainer.addEventListener('wheel', (e) => {
      // Don't intercept scroll if user is scrolling inside popovers
      if (e.target.closest('#viewportInfoPopover')) return;

      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom(state.zoom * factor, { clientX: e.clientX, clientY: e.clientY });
    }, { passive: false });
  }

  // ==================== INLINE TEXT EDITING ====================
  function startInlineTextEdit(el) {
    if (!el || el.type !== 'text') return;
    state.selectedId = el.id;
    state.editingTextId = el.id;
    renderAll();

    const container = state.previewMode === 'strip' ? dom.stripSlidesContainer : dom.igTrack;
    const textNode = container.querySelector(`.scene-element-text[data-el-id="${el.id}"]`);
    if (!textNode) return;

    textNode.textContent = el.text;
    textNode.setAttribute('contenteditable', 'true');
    textNode.focus();

    const range = document.createRange();
    range.selectNodeContents(textNode);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const onInput = () => {
      el.text = textNode.innerText;
      if (document.activeElement !== dom.inspTextContent) {
        dom.inspTextContent.value = el.text;
      }
    };

    const onKeyDown = (ev) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        finishInlineTextEdit();
      }
      ev.stopPropagation();
    };

    textNode.addEventListener('input', onInput);
    textNode.addEventListener('keydown', onKeyDown);
    textNode.addEventListener('blur', finishInlineTextEdit, { once: true });
  }

  function finishInlineTextEdit() {
    if (!state.editingTextId) return;
    state.editingTextId = null;
    renderAll();
  }

  // ==================== INSTAGRAM SIMULATOR INTERACTIONS ====================
  function setupSimulatorInteractions() {
    let simDrag = null;

    dom.igPrevBtn.addEventListener('click', () => {
      if (state.activeSlide > 0) {
        state.activeSlide -= 1;
        updateSimulatorPosition();
        updateTopAndViewportBars();
      }
    });

    dom.igNextBtn.addEventListener('click', () => {
      if (state.activeSlide < state.numSlides - 1) {
        state.activeSlide += 1;
        updateSimulatorPosition();
        updateTopAndViewportBars();
      }
    });

    dom.igDotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.ig-dot');
      if (!dot) return;
      state.activeSlide = Number(dot.dataset.dotIndex) || 0;
      updateSimulatorPosition();
      updateTopAndViewportBars();
    });

    dom.igFrameContainer.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ig-nav-arrow')) return;
      simDrag = {
        startX: e.clientX,
        dx: 0,
        moved: false,
        clickedEl: e.target.closest('.scene-element')
      };
      dom.igTrack.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!simDrag) return;
      simDrag.dx = e.clientX - simDrag.startX;
      if (Math.abs(simDrag.dx) > 6) simDrag.moved = true;
      if (simDrag.moved) updateSimulatorPosition(simDrag.dx);
    });

    window.addEventListener('mouseup', () => {
      if (!simDrag) return;
      dom.igTrack.classList.remove('dragging');

      if (simDrag.moved) {
        if (simDrag.dx < -70 && state.activeSlide < state.numSlides - 1) {
          state.activeSlide += 1;
        } else if (simDrag.dx > 70 && state.activeSlide > 0) {
          state.activeSlide -= 1;
        }
        updateSimulatorPosition(0);
        updateTopAndViewportBars();
      } else if (simDrag.clickedEl) {
        state.selectedId = simDrag.clickedEl.dataset.elId;
        renderAll();
      } else {
        state.selectedId = null;
        renderAll();
      }
      simDrag = null;
    });

    dom.igFrameContainer.addEventListener('dblclick', (e) => {
      const clickedSelBox = e.target.closest('#activeSelectionBox');
      const clicked = e.target.closest('.scene-element');
      let el = null;
      if (clickedSelBox && state.selectedId) {
        el = state.elements.find(i => i.id === state.selectedId);
      } else if (clicked) {
        el = state.elements.find(i => i.id === clicked.dataset.elId);
      }
      if (el && el.type === 'text') {
        e.preventDefault();
        e.stopPropagation();
        startInlineTextEdit(el);
      }
    });
  }

  // ==================== DRAG AND DROP IMAGE UPLOAD ====================
  function setupDragAndDrop() {
    const dropZones = [dom.stripViewport, dom.simulatorViewport, dom.igFrameContainer].filter(Boolean);

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.relatedTarget && zone.contains(e.relatedTarget)) return;
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;

        pushHistorySnapshot();

        // Calculate drop coordinates on canvas
        const isSimulator = zone === dom.simulatorViewport || zone === dom.igFrameContainer;
        let dropStageX, dropStageY;

        if (isSimulator) {
          dropStageX = state.activeSlide * SLIDE_W + SLIDE_W / 2;
          dropStageY = SLIDE_H / 2;
        } else {
          const pt = clientToStageCoords(e.clientX, e.clientY);
          dropStageX = pt.x;
          dropStageY = pt.y;
        }

        files.forEach((file, idx) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const naturalW = img.naturalWidth || 600;
              const naturalH = img.naturalHeight || 600;
              const aspect = naturalW / naturalH;

              const w = Math.min(720, Math.max(260, naturalW));
              const h = Math.round(w / aspect);
              const x = Math.round(dropStageX - w / 2) + idx * 30;
              const y = Math.round(dropStageY - h / 2) + idx * 30;

              const newEl = {
                id: genId('img'),
                type: 'image',
                layerGroup: 'foreground',
                name: file.name,
                src: reader.result,
                fit: 'contain',
                x,
                y,
                w,
                h,
                rotation: 0,
                opacity: 100,
                blendMode: 'normal',
                brightness: 100,
                saturation: 100
              };

              state.elements.push(newEl);
              state.selectedId = newEl.id;
              state.activeSlide = Math.max(0, Math.min(state.numSlides - 1, Math.floor((newEl.x + newEl.w / 2) / SLIDE_W)));
              renderAll();
            };
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        });
      });
    });
  }

  // ==================== DYNAMIC SLIDE INSERTION (END SLIDE ALWAYS LAST) ====================
  function insertSlideBeforeEnd() {
    if (state.numSlides >= 15) return;
    pushHistorySnapshot();
    const oldEndSlideIdx = state.numSlides - 1;
    state.numSlides += 1;

    // Shift elements on the old End slide by +1080px
    state.elements.forEach(el => {
      if (el.x >= oldEndSlideIdx * SLIDE_W) {
        el.x += SLIDE_W;
      }
    });

    // Populate newly inserted content slide at oldEndSlideIdx
    const theme = getActiveTheme();
    if (theme.domain === 'magic') {
      addMagicContentSlideLayout(state.elements, oldEndSlideIdx, theme, state.numSlides);
    } else {
      addGamesContentSlideLayout(state.elements, oldEndSlideIdx, theme, state.numSlides);
    }

    // Update border pattern widths to span the entire carousel
    state.elements.forEach(el => {
      if (el.type === 'games-border-pattern') {
        el.w = state.numSlides * SLIDE_W;
      }
    });

    state.activeSlide = oldEndSlideIdx;
    renderAll();
  }

  function removeSlideBeforeEnd() {
    if (state.numSlides <= 2) return;
    pushHistorySnapshot();
    const removeIdx = state.numSlides - 2;
    const endIdx = state.numSlides - 1;

    state.elements = state.elements.filter(el => {
      const span = getSlideSpanInfo(el);
      return span.primary !== removeIdx;
    });

    state.elements.forEach(el => {
      if (el.x >= endIdx * SLIDE_W) {
        el.x -= SLIDE_W;
      }
    });

    state.numSlides -= 1;

    // Update border pattern widths
    state.elements.forEach(el => {
      if (el.type === 'games-border-pattern') {
        el.w = state.numSlides * SLIDE_W;
      }
    });
    if (state.activeSlide >= state.numSlides) state.activeSlide = state.numSlides - 1;
    renderAll();
  }

  // ==================== 1080×1350 PNG EXPORT ENGINE ====================
  const imageCache = new Map();
  function loadImageCached(src) {
    if (!src) return Promise.resolve(null);
    if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function drawImageFit(ctx, img, x, y, w, h, fit = 'cover') {
    if (!img) return;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    if (fit === 'fill' || fit === 'stretch') {
      ctx.drawImage(img, x, y, w, h);
      return;
    }

    const scale = fit === 'contain' ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  function drawRichTextCanvas(ctx, el, localX, localY) {
    if (el.role === 'handle') {
      ctx.save();
      const rightX = localX + el.w;
      const topY = localY;
      ctx.translate(rightX, topY);
      ctx.rotate(Math.PI / 2);
      ctx.globalAlpha = (el.opacity ?? 100) / 100;
      if (el.blendMode && el.blendMode !== 'normal') ctx.globalCompositeOperation = el.blendMode;

      const fontFamily = el.fontFamily === 'Proxima Nova' ? 'Montserrat, sans-serif' : `"${el.fontFamily}", sans-serif`;
      const fontSize = el.fontSize || 28;
      const fontStyle = el.isItalic ? 'italic ' : '';
      const fontWeight = el.isBold ? '700' : (el.fontWeight || '400');
      ctx.font = `${fontStyle}${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';

      // Draw pipe in accent color and handle in main color
      const cleanHandle = (el.text || '@CELEBORNMAGIC').replace(/^\|\s*/, '');
      ctx.fillStyle = el.accentColor || '#C19358';
      ctx.fillText('|', 0, 0);
      const pipeWidth = ctx.measureText('| ').width;

      ctx.fillStyle = el.color || '#CCC5AB';
      ctx.fillText(cleanHandle, pipeWidth, 0);

      ctx.restore();
      return;
    }

    ctx.save();
    const cx = localX + el.w / 2;
    const cy = localY + el.h / 2;
    ctx.translate(cx, cy);
    if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.globalAlpha = (el.opacity ?? 100) / 100;
    if (el.blendMode && el.blendMode !== 'normal') ctx.globalCompositeOperation = el.blendMode;

    const fontFamily = el.fontFamily === 'Proxima Nova' ? 'Montserrat, sans-serif' : `"${el.fontFamily}", sans-serif`;
    const fontSize = el.fontSize || 60;
    const fontStyle = el.isItalic ? 'italic ' : '';
    const fontWeight = el.isBold ? '700' : (el.fontWeight || '400');
    ctx.font = `${fontStyle}${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';

    const rawText = el.uppercase ? (el.text || '').toUpperCase() : (el.text || '');
    const paragraphs = rawText.split('\n');
    const lineHeightPx = fontSize * (el.lineHeight || 1.15);

    paragraphs.forEach((para, pIdx) => {
      const tokens = [];
      let rem = para;
      if (rem.startsWith('| ')) {
        tokens.push({ text: '| ', accent: true, isPipe: true });
        rem = rem.slice(2);
      }
      const regex = /\*([^*]+)\*/;
      while (rem.length > 0) {
        const m = regex.exec(rem);
        if (!m) {
          tokens.push({ text: rem, accent: false });
          break;
        }
        if (m.index > 0) tokens.push({ text: rem.slice(0, m.index), accent: false });
        tokens.push({ text: m[1], accent: true });
        rem = rem.slice(m.index + m[0].length);
      }

      const fullPlain = tokens.map(t => t.text).join('');
      const totalWidth = ctx.measureText(fullPlain).width;
      let startX = -el.w / 2;
      if (el.align === 'center') startX = -totalWidth / 2;
      else if (el.align === 'right') startX = el.w / 2 - totalWidth;

      const lineY = -el.h / 2 + pIdx * lineHeightPx;
      let curX = startX;

      tokens.forEach(tok => {
        if (el.embossed) {
          ctx.fillStyle = 'rgba(235, 178, 110, 0.85)';
          ctx.fillText(tok.text, curX + 1.5, lineY + 2.5);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.fillText(tok.text, curX - 1, lineY - 1);
        }
        if (tok.isPipe) {
          ctx.save();
          const pStyle = el.isItalic ? 'italic ' : '';
          ctx.font = `${pStyle}700 ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = el.accentColor || '#C19358';
          ctx.fillText(tok.text, curX, lineY);
          ctx.restore();
        } else {
          ctx.fillStyle = tok.accent ? (el.accentColor || '#C19358') : (el.color || '#FFFFFF');
          ctx.fillText(tok.text, curX, lineY);
        }
        curX += ctx.measureText(tok.text).width;
      });
    });

    ctx.restore();
  }

  async function renderSlideToCanvas(slideIndex) {
    const canvas = document.createElement('canvas');
    canvas.width = SLIDE_W;
    canvas.height = SLIDE_H;
    const ctx = canvas.getContext('2d');
    const theme = getActiveTheme();
    const tuning = state.bgTuning;

    // 1. Theme Canvas Background
    if (theme.domain === 'magic') {
      ctx.fillStyle = tuning.colorOverride || theme.bgColor || '#121110';
      ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
      if (theme.bgAsset && ASSETS[theme.bgAsset]) {
        const bgImg = await loadImageCached(ASSETS[theme.bgAsset]);
        ctx.save();
        ctx.globalAlpha = (tuning.textureOpacity ?? 100) / 100;
        drawImageFit(ctx, bgImg, 0, 0, SLIDE_W, SLIDE_H, 'cover');
        ctx.restore();
      }
    } else {
      ctx.fillStyle = theme.outerColor || '#219652';
      ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);

      // Thinner Frame (26px sides, 64px top, 1286px bottom) + Unified Continuous Paper Path
      const hasNotch = slideIndex === 0 && state.showSlide1Notch;
      ctx.save();
      ctx.beginPath();
      if (hasNotch) {
        ctx.moveTo(26, 64);
        ctx.lineTo(357, 64);
        ctx.lineTo(405, 155);
        ctx.lineTo(675, 155);
        ctx.lineTo(723, 64);
        ctx.lineTo(1054, 64);
        ctx.lineTo(1054, 1286);
        ctx.lineTo(26, 1286);
      } else {
        ctx.moveTo(26, 64);
        ctx.lineTo(1054, 64);
        ctx.lineTo(1054, 1286);
        ctx.lineTo(26, 1286);
      }
      ctx.closePath();

      // Paper Canvas Fill
      ctx.fillStyle = tuning.colorOverride || theme.innerBgColor || '#F7F3EA';
      ctx.fill();

      // Clip texture to paper path (fills edge to edge with zero gaps)
      if (theme.innerGridAsset && ASSETS[theme.innerGridAsset]) {
        ctx.save();
        ctx.clip();
        const gridImg = await loadImageCached(ASSETS[theme.innerGridAsset]);
        ctx.globalAlpha = 0.82 * ((tuning.textureOpacity ?? 100) / 100);
        const gridScale = theme.gridScale || 1.0;
        const scaledW = Math.round(1028 * gridScale);
        const scaledH = Math.round(1222 * gridScale);
        const offsetX = Math.round(26 - (scaledW - 1028) / 2);
        const offsetY = Math.round(64 - (scaledH - 1222) / 2);
        drawImageFit(ctx, gridImg, offsetX, offsetY, scaledW, scaledH, 'cover');
        ctx.restore();
      }

      // Continuous 3.5px solid black border with seamless round corner join
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }

    // 2. Render Elements in Order (Background images first, foreground on top)
    const sorted = [
      ...state.elements.filter(el => el.layerGroup === 'background'),
      ...state.elements.filter(el => el.layerGroup !== 'background')
    ];

    for (const el of sorted) {
      const localX = el.x - slideIndex * SLIDE_W;
      const localY = el.y;
      if (localX + el.w < 0 || localX > SLIDE_W) continue;

      if (el.type === 'text') {
        drawRichTextCanvas(ctx, el, localX, localY);
      } else if (el.type === 'emblem') {
        const embSrc = el.customSrc || ASSETS[el.emblemVariant] || ASSETS.emblem_theory;
        const emb = await loadImageCached(embSrc);
        if (emb) {
          ctx.save();
          ctx.translate(localX + el.w / 2, localY + el.h / 2);
          if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
          ctx.globalAlpha = (el.opacity ?? 100) / 100;
          if (el.blendMode && el.blendMode !== 'normal') ctx.globalCompositeOperation = el.blendMode;
          drawImageFit(ctx, emb, -el.w / 2, -el.h / 2, el.w, el.h, 'contain');
          ctx.restore();
        }
      } else if (el.type === 'magic-swipe') {
        const swImg = await loadImageCached(ASSETS[el.swipeVariant] || ASSETS.swipe_gold);
        if (swImg) {
          ctx.save();
          ctx.translate(localX + el.w / 2, localY + el.h / 2);
          if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
          ctx.globalAlpha = (el.opacity ?? 100) / 100;
          if (el.blendMode && el.blendMode !== 'normal') ctx.globalCompositeOperation = el.blendMode;

          const swipeColor = el.fill || el.color || (theme.id === 'magic-application' ? (theme.pipeColor || '#EBB168') : theme.textColor) || '#CCC5AB';
          const tintCanvas = document.createElement('canvas');
          tintCanvas.width = el.w;
          tintCanvas.height = el.h;
          const tctx = tintCanvas.getContext('2d');
          drawImageFit(tctx, swImg, 0, 0, el.w, el.h, 'contain');
          tctx.globalCompositeOperation = 'source-in';
          tctx.fillStyle = swipeColor;
          tctx.fillRect(0, 0, el.w, el.h);

          ctx.drawImage(tintCanvas, -el.w / 2, -el.h / 2);
          ctx.restore();
        }
      } else if (el.type === 'games-notch') {
        ctx.save();
        ctx.fillStyle = el.fill || theme.outerColor;
        ctx.fillRect(localX, 0, el.w, 71);
        ctx.beginPath();
        ctx.moveTo(localX + 2, 68);
        ctx.lineTo(localX + el.w - 2, 68);
        ctx.lineTo(localX + el.w - 45, 155);
        ctx.lineTo(localX + 47, 155);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(localX + 2, 66.5);
        ctx.lineTo(localX + 47, 155);
        ctx.lineTo(localX + el.w - 45, 155);
        ctx.lineTo(localX + el.w - 2, 66.5);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.font = '700 32px Rubik, sans-serif';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((el.topicText || 'EPISODE').toUpperCase(), localX + el.w / 2, 38);
        ctx.restore();
      } else if (el.type === 'games-border-pattern') {
        const isTop = (el.patternPosition === 'top') || (el.y < 500);
        const patType = el.patternType || 'chevrons';
        if (patType !== 'none') {
          ctx.save();
          let tileCanvas = document.createElement('canvas');
          let tctx = tileCanvas.getContext('2d');
          if (patType === 'chevrons') {
            tileCanvas.width = 90;
            tileCanvas.height = 64;
            tctx.strokeStyle = '#000000';
            tctx.lineWidth = 8.5;
            tctx.lineCap = 'square';
            tctx.lineJoin = 'miter';
            tctx.globalAlpha = 0.92;
            // Discrete grouped triple-stripe chevrons covering full 64px height with increased spacing (90px tile for seamless transitions & zero cutoff)
            tctx.beginPath();
            tctx.moveTo(10, -2); tctx.lineTo(38, 32); tctx.lineTo(10, 66);
            tctx.moveTo(28, -2); tctx.lineTo(56, 32); tctx.lineTo(28, 66);
            tctx.moveTo(46, -2); tctx.lineTo(74, 32); tctx.lineTo(46, 66);
            tctx.stroke();
          } else if (patType === 'stripes') {
            tileCanvas.width = 32;
            tileCanvas.height = 32;
            tctx.translate(16, 16);
            tctx.rotate((45 * Math.PI) / 180);
            tctx.fillStyle = '#000000';
            tctx.globalAlpha = 0.92;
            tctx.fillRect(-16, -32, 16, 64);
          } else if (patType === 'dots') {
            tileCanvas.width = 45;
            tileCanvas.height = 64;
            tctx.fillStyle = '#000000';
            tctx.globalAlpha = 0.92;
            const drawDot = (cx, cy) => {
              tctx.beginPath();
              tctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
              tctx.fill();
            };
            // Staggered polka dots (45px tile for seamless transitions & zero cutoff)
            // Top edge (cy = 0)
            drawDot(0, 0);
            drawDot(45, 0);
            // Row 1 (cy = 21.33)
            drawDot(22.5, 21.33);
            // Row 2 (cy = 42.67)
            drawDot(0, 42.67);
            drawDot(45, 42.67);
            // Bottom edge (cy = 64)
            drawDot(22.5, 64);
          }

          const pat = ctx.createPattern(tileCanvas, 'repeat');
          ctx.fillStyle = pat;

          const drawSeg = (segX, segW) => {
            ctx.save();
            ctx.translate(localX, el.y);
            const panX = slideIndex * SLIDE_W + segX;
            ctx.fillRect(panX, 0, segW, 64);
            ctx.restore();
          };

          if (isTop) {
            if (slideIndex === 0 && state.showSlide1Notch) {
              drawSeg(0, 360);
              drawSeg(720, 360);
            } else {
              drawSeg(0, 1080);
            }
          } else {
            if (slideIndex < state.numSlides - 1) {
              drawSeg(0, 450);
              drawSeg(630, 450);
            } else {
              drawSeg(0, 1080);
            }
          }
          ctx.restore();
        }
      } else if (el.type === 'games-swipe-combo') {
        ctx.save();
        // Background rectangle removed per user request: sits directly on bottom outline
        if (ASSETS.swipe_white) {
          const sw = await loadImageCached(ASSETS.swipe_white);
          drawImageFit(ctx, sw, localX + 16, localY + 12, 42, 42, 'contain');
        }
        ctx.font = '800 22px "JetBrains Mono", monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('SWIPE', localX + 74, localY + el.h / 2);
        ctx.restore();
      } else if (el.type === 'games-username-box') {
        const isIdea = state.themeId === 'games-idea';
        const defaultUserColor = isIdea ? '#CBD5E1' : '#162D43';
        const defaultBoxBg = isIdea ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
        const defaultBoxBorder = isIdea ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
        ctx.save();
        ctx.fillStyle = el.boxBg || defaultBoxBg;
        ctx.fillRect(localX, localY, el.w, el.h);
        ctx.strokeStyle = el.boxBorder || defaultBoxBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(localX, localY, el.w, el.h);
        ctx.font = `600 ${el.fontSize || 18}px "JetBrains Mono", monospace`;
        ctx.fillStyle = el.textColor || defaultUserColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.handleText || '@CreativeProblemSolver', localX + el.w / 2, localY + el.h / 2);
        ctx.restore();
      } else if (el.type === 'image' || el.type === 'bg-image') {
        const img = await loadImageCached(el.src);
        if (img) {
          ctx.save();
          ctx.translate(localX + el.w / 2, localY + el.h / 2);
          if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
          ctx.globalAlpha = (el.opacity ?? 100) / 100;
          if (el.blendMode && el.blendMode !== 'normal') ctx.globalCompositeOperation = el.blendMode;
          drawImageFit(ctx, img, -el.w / 2, -el.h / 2, el.w, el.h, el.fit || 'cover');
          ctx.restore();
        }
      } else if (el.type === 'divider' || el.type === 'rect') {
        ctx.save();
        ctx.translate(localX + el.w / 2, localY + el.h / 2);
        if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
        ctx.globalAlpha = (el.opacity ?? 100) / 100;
        if (!el.noFill) {
          ctx.fillStyle = el.fill || '#C19358';
          ctx.fillRect(-el.w / 2, -el.h / 2, el.w, el.h);
        }
        if (el.strokeWidth > 0) {
          ctx.strokeStyle = el.stroke || '#000000';
          ctx.lineWidth = el.strokeWidth;
          ctx.strokeRect(-el.w / 2, -el.h / 2, el.w, el.h);
        }
        ctx.restore();
      } else if (el.type === 'triangle') {
        ctx.save();
        ctx.translate(localX + el.w / 2, localY + el.h / 2);
        if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
        ctx.globalAlpha = (el.opacity ?? 100) / 100;
        ctx.beginPath();
        ctx.moveTo(0, -el.h / 2 + 4);
        ctx.lineTo(el.w / 2 - 4, el.h / 2 - 4);
        ctx.lineTo(-el.w / 2 + 4, el.h / 2 - 4);
        ctx.closePath();
        if (!el.noFill) {
          ctx.fillStyle = el.fill || '#219652';
          ctx.fill();
        }
        if (el.strokeWidth > 0) {
          ctx.strokeStyle = el.stroke || '#162D43';
          ctx.lineWidth = el.strokeWidth;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    return canvas;
  }

  async function exportSlidePNG(slideIndex) {
    const canvas = await renderSlideToCanvas(slideIndex);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    const padNum = String(slideIndex + 1).padStart(2, '0');
    a.href = dataUrl;
    a.download = `carousel_${state.themeId}_slide_${padNum}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function exportAllSlidesPNG() {
    for (let i = 0; i < state.numSlides; i++) {
      await exportSlidePNG(i);
      await new Promise(r => setTimeout(r, 180));
    }
  }

  // ==================== EVENT BINDINGS & ACTIONS ====================
  function setZoom(newZoom, focalPoint = null) {
    const oldZoom = state.zoom;
    const clamped = Math.max(0.15, Math.min(1.5, Number(newZoom.toFixed(3))));
    if (Math.abs(clamped - oldZoom) < 0.001) return;

    let offsetX = 0, offsetY = 0;
    if (focalPoint && dom.stripStageWrapper) {
      const stageRect = dom.stripStageWrapper.getBoundingClientRect();
      offsetX = focalPoint.clientX - stageRect.left;
      offsetY = focalPoint.clientY - stageRect.top;
    }

    state.zoom = clamped;
    renderAll();

    if (focalPoint && dom.stripScrollContainer) {
      const scaleRatio = clamped / oldZoom;
      const newOffsetX = offsetX * scaleRatio;
      const newOffsetY = offsetY * scaleRatio;
      dom.stripScrollContainer.scrollLeft += Math.round(newOffsetX - offsetX);
      dom.stripScrollContainer.scrollTop += Math.round(newOffsetY - offsetY);
    }
  }

  function fitZoomToViewport() {
    const rect = dom.stripScrollContainer.getBoundingClientRect();
    if (!rect.height) return;
    const targetH = rect.height - 110;
    setZoom(Math.max(0.22, Math.min(0.65, targetH / SLIDE_H)));
  }

  function applyThemeSelection(newThemeId, resetLayout = false) {
    pushHistorySnapshot();
    const prevTheme = getActiveTheme();
    state.themeId = newThemeId;
    const nextTheme = getActiveTheme();

    state.frameConfig.handle = nextTheme.frameHandle;
    state.frameConfig.series = nextTheme.seriesLabel || '';
    state.bgTuning.colorOverride = null;

    if (resetLayout || prevTheme.domain !== nextTheme.domain) {
      state.elements = createDefaultElementsForTheme(newThemeId, state.numSlides);
      state.selectedId = null;
    } else {
      state.elements.forEach(el => {
        if (el.type === 'text') {
          if (el.role === 'handle') {
            if (nextTheme.domain === 'magic') {
              el.color = nextTheme.id === 'magic-application' ? '#2B1F17' : (nextTheme.id === 'magic-idea' ? '#2B2B2B' : '#CCC5AB');
              el.accentColor = nextTheme.pipeColor || '#C19358';
            } else {
              el.color = nextTheme.usernameColor || nextTheme.textColor;
              el.accentColor = nextTheme.accentColor;
            }
            const curSlide = Math.max(0, Math.min(state.numSlides - 1, Math.floor((el.x + el.w / 2) / SLIDE_W)));
            el.x = curSlide * SLIDE_W + 986;
            el.y = 66;
            el.w = 28;
            el.h = 360;
          } else if (el.role === 'topic-tag') {
            // Update Slide 1 topic badge text if matching default
            if (!el.text || el.text === prevTheme.topicTag) {
              el.text = nextTheme.topicTag || 'EPISODE';
            }
            el.accentColor = nextTheme.outerColor;
          } else if (el.role === 'subtitle' && el.y < 350 && (el.text.startsWith('Things I') || el.text.includes('LOVE') || el.text.includes('HATE') || el.text.includes('MISS'))) {
            // Slide 1 top framing subtitle (e.g. Things I HATE in games #0001 / Things I MISS in games #000.1)
            el.text = nextTheme.topSubtitleText || `Things I *${nextTheme.id === 'games-love' ? 'LOVE' : nextTheme.id === 'games-hate' ? 'HATE' : 'MISS'}* in games #0001`;
            const defs = nextTheme.subtitleDefaults;
            el.fontFamily = defs.fontFamily;
            el.color = defs.color;
            el.accentColor = defs.accentColor;
          } else if (el.role === 'subtitle' && el.y > 500 && (el.text.includes('LEARN') || el.text.includes('FIX') || el.text.includes('IMPLEMENT'))) {
            // Slide 1 bottom framing subtitle (e.g. and how to FIX them / and how to IMPLEMENT them)
            el.text = nextTheme.bottomSubtitleText || (nextTheme.id === 'games-love' ? 'and what to *LEARN* from that' : nextTheme.id === 'games-hate' ? 'and how to *FIX* them' : 'and how to *IMPLEMENT* them');
            const defs = nextTheme.subtitleDefaults;
            el.fontFamily = defs.fontFamily;
            el.color = defs.color;
            el.accentColor = defs.accentColor;
          } else if (el.role === 'headline' && (el.text === 'COLOR\nPSYCHOLOGY' || el.text === 'THEORY IN\nPRACTICE' || el.text === 'IMPOSSIBLE\nOBJECT')) {
            // Magic cover headline
            el.text = newThemeId === 'magic-theory'
              ? 'COLOR\nPSYCHOLOGY'
              : newThemeId === 'magic-application'
                ? 'THEORY IN\nPRACTICE'
                : 'IMPOSSIBLE\nOBJECT';
            const defs = nextTheme.headlineDefaults;
            el.fontFamily = defs.fontFamily;
            el.color = defs.color;
            el.accentColor = defs.accentColor;
            el.isBold = defs.isBold;
            el.embossed = Boolean(defs.embossed);
          } else if (el.role === 'subtitle' && (el.text.includes('PERCEPTION') || el.text.includes('SILENT SCRIPTING') || el.text.includes('SKETCHBOOK CONCEPT'))) {
            // Magic cover subtitle
            el.text = newThemeId === 'magic-theory'
              ? 'HOW CERTAIN COLORS AFFECT\nOUR PERCEPTION'
              : newThemeId === 'magic-application'
                ? 'APPLYING SILENT SCRIPTING\nTO STAGE ILLUSIONS'
                : 'SKETCHBOOK CONCEPT #01:\nTHE FLOATING HOURGLASS';
            const defs = nextTheme.subtitleDefaults;
            el.fontFamily = defs.fontFamily;
            el.color = defs.color;
            el.accentColor = defs.accentColor;
            el.isBold = defs.isBold;
          } else {
            const defs = el.role === 'headline' ? nextTheme.headlineDefaults : nextTheme.subtitleDefaults;
            el.fontFamily = defs.fontFamily;
            el.color = defs.color;
            el.accentColor = defs.accentColor;
            el.embossed = defs.embossed;
            if (el.role === 'subtitle') {
              el.isBold = defs.isBold;
            }
            if (el.role === 'series') {
              el.color = nextTheme.textColor;
              el.accentColor = nextTheme.pipeColor;
            }
          }
        } else if (el.type === 'emblem') {
          el.emblemVariant = nextTheme.defaultEmblem;
          el.customSrc = null;
        } else if (el.type === 'magic-swipe') {
          const swColor = nextTheme.id === 'magic-application' ? (nextTheme.pipeColor || '#EBB168') : nextTheme.textColor;
          el.color = swColor;
          el.fill = swColor;
          el.swipeVariant = nextTheme.swipeAsset;
        } else if (el.type === 'cta-bookmark') {
          el.fill = nextTheme.textColor;
        } else if (el.type === 'magic-cta-icons') {
          el.stroke = nextTheme.pipeColor;
        } else if (el.type === 'divider' || el.type === 'games-notch' || el.type === 'games-swipe-combo') {
          el.fill = nextTheme.pipeColor || nextTheme.outerColor;
        } else if (el.type === 'games-border-pattern') {
          el.patternType = nextTheme.patternType || 'chevrons';
        } else if (el.type === 'triangle') {
          el.fill = nextTheme.outerColor;
          el.stroke = nextTheme.textColor;
        } else if (el.type === 'games-username-box') {
          const isIdea = nextTheme.id === 'games-idea';
          el.textColor = isIdea ? '#CBD5E1' : (nextTheme.usernameColor || '#162D43');
          el.boxBg = isIdea ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
          el.boxBorder = isIdea ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
          el.opacity = isIdea ? 85 : 60;
        }
      });
    }
    renderAll();
  }

  function duplicateSelectedElement() {
    const el = getSelectedElement();
    if (!el) return;
    pushHistorySnapshot();
    const copy = JSON.parse(JSON.stringify(el));
    copy.id = genId(el.type.slice(0, 3));
    copy.x += 36;
    copy.y += 36;
    state.elements.push(copy);
    state.selectedId = copy.id;
    renderAll();
  }

  function deleteSelectedElement() {
    if (!state.selectedId) return;
    pushHistorySnapshot();
    state.elements = state.elements.filter(e => e.id !== state.selectedId);
    state.selectedId = null;
    renderAll();
  }

  function initEventListeners() {
    // Theme & Layout Reset
    dom.themeSelect.addEventListener('change', (e) => applyThemeSelection(e.target.value, false));
    dom.btnResetTemplate.addEventListener('click', () => {
      state.elements = createDefaultElementsForTheme(state.themeId, state.numSlides);
      state.selectedId = null;
      renderAll();
    });

    // Dynamic Add / Remove Slide (End CTA slide is always last!)
    dom.btnAddSlide.addEventListener('click', insertSlideBeforeEnd);
    dom.btnRemoveSlide.addEventListener('click', removeSlideBeforeEnd);
    dom.slideCountInput.addEventListener('change', (e) => {
      const target = Math.max(2, Math.min(15, Number(e.target.value) || 5));
      while (state.numSlides < target) insertSlideBeforeEnd();
      while (state.numSlides > target) removeSlideBeforeEnd();
    });

    // Preview Mode Switcher
    const setPreviewMode = (mode) => {
      state.previewMode = mode;
      dom.modeStripBtn.classList.toggle('active', mode === 'strip');
      dom.modeSimBtn.classList.toggle('active', mode === 'simulator');
      dom.stripViewport.classList.toggle('hidden', mode !== 'strip');
      dom.simulatorViewport.classList.toggle('hidden', mode !== 'simulator');
      dom.stripOptionsGroup.classList.toggle('hidden', mode !== 'strip');
      renderAll();
    };
    dom.modeStripBtn.addEventListener('click', () => setPreviewMode('strip'));
    dom.modeSimBtn.addEventListener('click', () => setPreviewMode('simulator'));

    // Slide Page Numbers Toggle Button (Default: OFF)
    if (dom.btnTogglePageNumbers) {
      dom.btnTogglePageNumbers.addEventListener('click', () => togglePageNumbers());
    }

    // Viewport Options & Zoom
    dom.toggleSeamGaps.addEventListener('change', (e) => {
      state.showSeamGaps = e.target.checked;
      renderAll();
    });
    dom.toggleGuides.addEventListener('change', (e) => {
      state.showGuides = e.target.checked;
      renderAll();
    });
    dom.btnZoomOut.addEventListener('click', () => setZoom(state.zoom - 0.05));
    dom.btnZoomIn.addEventListener('click', () => setZoom(state.zoom + 0.05));
    dom.btnZoomFit.addEventListener('click', fitZoomToViewport);

    // Viewport Info Popover Toggle
    dom.btnToggleInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      dom.viewportInfoPopover.classList.toggle('hidden');
    });
    dom.btnCloseInfo.addEventListener('click', () => {
      dom.viewportInfoPopover.classList.add('hidden');
    });
    window.addEventListener('click', (e) => {
      if (!dom.viewportInfoPopover.classList.contains('hidden') && !e.target.closest('#viewportInfoPopover') && e.target !== dom.btnToggleInfo) {
        dom.viewportInfoPopover.classList.add('hidden');
      }
    });

    // Background Tuning Sliders
    dom.bgBaseColorInput.addEventListener('input', (e) => {
      state.bgTuning.colorOverride = e.target.value;
      dom.bgBaseColorHex.value = e.target.value.toUpperCase();
      renderAll();
    });
    dom.bgBaseColorHex.addEventListener('change', (e) => {
      state.bgTuning.colorOverride = normalizeHex(e.target.value);
      renderAll();
    });
    dom.bgBrightnessSlider.addEventListener('input', (e) => {
      state.bgTuning.brightness = Number(e.target.value);
      dom.bgBrightnessVal.textContent = `${e.target.value}%`;
      renderAll();
    });
    dom.bgSaturationSlider.addEventListener('input', (e) => {
      state.bgTuning.saturation = Number(e.target.value);
      dom.bgSaturationVal.textContent = `${e.target.value}%`;
      renderAll();
    });
    dom.bgOpacitySlider.addEventListener('input', (e) => {
      state.bgTuning.textureOpacity = Number(e.target.value);
      dom.bgOpacityVal.textContent = `${e.target.value}%`;
      renderAll();
    });
    dom.btnResetBgTuning.addEventListener('click', () => {
      state.bgTuning = { colorOverride: null, brightness: 100, saturation: 100, textureOpacity: 100 };
      renderAll();
    });

    // Image Uploads
    const handleImageUpload = (files, isBackgroundPlane) => {
      Array.from(files || []).forEach((file, idx) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const aspect = (img.naturalWidth || 400) / (img.naturalHeight || 400);
            const w = isBackgroundPlane ? SLIDE_W : Math.min(680, Math.max(240, img.naturalWidth || 500));
            const h = isBackgroundPlane ? SLIDE_H : Math.round(w / aspect);
            const sx = state.activeSlide * SLIDE_W;

            const newEl = {
              id: genId(isBackgroundPlane ? 'bgimg' : 'img'),
              type: isBackgroundPlane ? 'bg-image' : 'image',
              layerGroup: isBackgroundPlane ? 'background' : 'foreground',
              name: file.name,
              src: reader.result,
              fit: isBackgroundPlane ? 'cover' : 'contain',
              x: isBackgroundPlane ? sx : sx + Math.round((SLIDE_W - w) / 2) + idx * 30,
              y: isBackgroundPlane ? 0 : Math.round((SLIDE_H - h) / 2) + idx * 30,
              w,
              h,
              rotation: 0,
              opacity: 100,
              blendMode: 'normal',
              brightness: 100,
              saturation: 100
            };
            state.elements.push(newEl);
            state.selectedId = newEl.id;
            renderAll();
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    };

    dom.bgElementInput.addEventListener('change', (e) => {
      handleImageUpload(e.target.files, true);
      e.target.value = '';
    });
    dom.freeImageInput.addEventListener('change', (e) => {
      handleImageUpload(e.target.files, false);
      e.target.value = '';
    });

    // Custom Emblem Image Upload
    dom.uploadCustomEmblemInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      const el = getSelectedElement();
      if (!file || !el || el.type !== 'emblem') return;
      const reader = new FileReader();
      reader.onload = () => {
        el.customSrc = reader.result;
        renderAll();
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    // Quick Floating Role Switcher
    dom.quickBtnHeadline.addEventListener('click', () => applyTextRole(getSelectedElement(), 'headline'));
    dom.quickBtnSubtitle.addEventListener('click', () => applyTextRole(getSelectedElement(), 'subtitle'));
    dom.quickBtnEditText.addEventListener('click', () => startInlineTextEdit(getSelectedElement()));

    // Layers List Selection
    dom.layersList.addEventListener('click', (e) => {
      const item = e.target.closest('.layer-item');
      if (!item) return;
      state.selectedId = item.dataset.layerId;
      const el = getSelectedElement();
      if (el) state.activeSlide = getSlideSpanInfo(el).primary;
      renderAll();
    });

    // Frame Handles in Inspector
    dom.frameHandleInput.addEventListener('input', (e) => {
      state.frameConfig.handle = e.target.value;
      state.elements.forEach(el => {
        if (el.role === 'handle') el.text = `| ${e.target.value}`;
        if (el.type === 'games-username-box') el.handleText = e.target.value;
      });
      renderAll();
    });
    dom.frameSeriesInput.addEventListener('input', (e) => {
      state.frameConfig.series = e.target.value;
      state.elements.forEach(el => {
        if (el.role === 'series') el.text = `| ${e.target.value}`;
        if (el.type === 'games-notch') el.topicText = e.target.value;
      });
      renderAll();
    });

    // Opacity & Blend Mode
    dom.inspOpacity.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (!el) return;
      el.opacity = Number(e.target.value);
      dom.inspOpacityVal.textContent = `${e.target.value}%`;
      renderAll();
    });
    dom.inspBlendMode.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (!el) return;
      el.blendMode = e.target.value;
      renderAll();
    });

    // Slide Navigation
    dom.btnMovePrevSlide.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.x = Math.max(0, el.x - SLIDE_W);
      state.activeSlide = getSlideSpanInfo(el).primary;
      renderAll();
    });
    dom.btnMoveNextSlide.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.x = Math.min((state.numSlides - 1) * SLIDE_W + 900, el.x + SLIDE_W);
      state.activeSlide = getSlideSpanInfo(el).primary;
      renderAll();
    });
    dom.btnSpanSeam.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      const seamSlide = Math.min(state.numSlides - 1, Math.max(1, state.activeSlide + 1));
      el.x = seamSlide * SLIDE_W - Math.round(el.w / 2);
      renderAll();
    });

    // Text Inspector: Formatting Toggles (Bold, Italic, Underline, Strike, All Caps)
    dom.btnTextBold.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.isBold = !el.isBold;
      renderAll();
    });
    dom.btnTextItalic.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.isItalic = !el.isItalic;
      renderAll();
    });
    dom.btnTextUnderline.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.isUnderline = !el.isUnderline;
      renderAll();
    });
    dom.btnTextStrike.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.isStrike = !el.isStrike;
      renderAll();
    });
    dom.btnTextCaps.addEventListener('click', () => {
      const el = getSelectedElement();
      if (!el) return;
      el.uppercase = !el.uppercase;
      renderAll();
    });

    // Text Inspector: Content & Typography
    dom.inspTextContent.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (!el) return;
      if (el.type === 'text') {
        el.text = e.target.value;
      } else if (el.type === 'games-username-box') {
        el.handleText = e.target.value;
      }
      renderAll();
    });
    dom.inspFontFamily.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (el) { el.fontFamily = e.target.value; renderAll(); }
    });
    dom.inspFontSize.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.fontSize = Number(e.target.value) || 40; renderAll(); }
    });
    dom.inspLineHeight.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.lineHeight = Number(e.target.value) || 1.15; renderAll(); }
    });
    dom.inspLetterSpacing.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.letterSpacing = Number(e.target.value) || 0; renderAll(); }
    });

    [dom.btnTextAlignLeft, dom.btnTextAlignCenter, dom.btnTextAlignRight].forEach(btn => {
      btn.addEventListener('click', () => {
        const el = getSelectedElement();
        if (el) { el.align = btn.dataset.align; renderAll(); }
      });
    });

    // Text Editor Colors (Clicking buttons opens hidden native color inputs)
    dom.inspTextColor.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) {
        if (el.type === 'text') {
          el.color = e.target.value;
        } else if (el.type === 'games-username-box') {
          el.textColor = e.target.value;
        }
        dom.textColorSwatchBar.style.background = e.target.value;
        renderAll();
      }
    });
    dom.inspAccentColor.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) {
        el.accentColor = e.target.value;
        dom.accentColorSwatchBar.style.background = e.target.value;
        renderAll();
      }
    });
    dom.inspTextBgColor.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) {
        el.bgColor = e.target.value;
        el.hasBg = true;
        dom.inspTextHasBg.checked = true;
        dom.textBgColorSwatchBar.style.background = e.target.value;
        renderAll();
      }
    });
    dom.inspTextHasBg.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (el) {
        el.hasBg = e.target.checked;
        dom.textBgColorSwatchBar.style.background = el.hasBg ? (el.bgColor || '#000000') : 'transparent';
        renderAll();
      }
    });
    dom.inspTextEmbossed.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (el) { el.embossed = e.target.checked; renderAll(); }
    });

    // Shape / Notch / Swipe Inspector
    dom.inspShapeFill.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) {
        el.fill = e.target.value;
        el.color = e.target.value;
        renderAll();
      }
    });
    dom.inspShapeNoFill.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (el) { el.noFill = e.target.checked; renderAll(); }
    });
    dom.inspShapeStroke.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.stroke = e.target.value; renderAll(); }
    });
    dom.inspShapeStrokeWidth.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.strokeWidth = Number(e.target.value) || 0; renderAll(); }
    });

    // Border Pattern Option Buttons & Sync
    if (dom.inspPatternSection) {
      const pBtns = dom.inspPatternSection.querySelectorAll('.pattern-option-btn');
      pBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sel = getSelectedElement();
          if (!sel || sel.type !== 'games-border-pattern') return;
          const newPattern = btn.dataset.pattern;
          sel.patternType = newPattern;
          if (dom.inspPatternSyncBoth && dom.inspPatternSyncBoth.checked) {
            state.elements.forEach(other => {
              if (other.type === 'games-border-pattern' && other.id !== sel.id) {
                other.patternType = newPattern;
              }
            });
          }
          renderAll();
        });
      });
    }

    // Slide 1 Notch Toggles (both element state and empty slide state)
    if (dom.toggleSlide1Notch) {
      dom.toggleSlide1Notch.addEventListener('change', (e) => {
        state.showSlide1Notch = e.target.checked;
        if (dom.toggleSlide1NotchEmpty) dom.toggleSlide1NotchEmpty.checked = e.target.checked;
        renderAll();
      });
    }
    if (dom.toggleSlide1NotchEmpty) {
      dom.toggleSlide1NotchEmpty.addEventListener('change', (e) => {
        state.showSlide1Notch = e.target.checked;
        if (dom.toggleSlide1Notch) dom.toggleSlide1Notch.checked = e.target.checked;
        renderAll();
      });
    }

    // Image Inspector & Layer Plane
    dom.inspImgFit.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (el) { el.fit = e.target.value; renderAll(); }
    });
    dom.inspImgBrightness.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.brightness = Number(e.target.value); dom.inspImgBrightVal.textContent = `${e.target.value}%`; renderAll(); }
    });
    dom.inspImgSaturation.addEventListener('input', (e) => {
      const el = getSelectedElement();
      if (el) { el.saturation = Number(e.target.value); dom.inspImgSatVal.textContent = `${e.target.value}%`; renderAll(); }
    });
    dom.inspImgIsBg.addEventListener('change', (e) => {
      const el = getSelectedElement();
      if (el) {
        el.layerGroup = e.target.checked ? 'background' : 'foreground';
        el.type = e.target.checked ? 'bg-image' : 'image';
        renderAll();
      }
    });
    dom.replaceImgInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      const el = getSelectedElement();
      if (!file || !el) return;
      const reader = new FileReader();
      reader.onload = () => {
        el.src = reader.result;
        el.name = file.name;
        renderAll();
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    // Layer Actions
    dom.btnBringForward.addEventListener('click', () => {
      const idx = state.elements.findIndex(e => e.id === state.selectedId);
      if (idx >= 0 && idx < state.elements.length - 1) {
        const [item] = state.elements.splice(idx, 1);
        state.elements.splice(idx + 1, 0, item);
        renderAll();
      }
    });
    dom.btnSendBackward.addEventListener('click', () => {
      const idx = state.elements.findIndex(e => e.id === state.selectedId);
      if (idx > 0) {
        const [item] = state.elements.splice(idx, 1);
        state.elements.splice(idx - 1, 0, item);
        renderAll();
      }
    });
    dom.btnDuplicateEl.addEventListener('click', duplicateSelectedElement);
    dom.btnDeleteEl.addEventListener('click', deleteSelectedElement);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || state.editingTextId) return;

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      const el = getSelectedElement();
      if (!el) return;

      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') { pushHistorySnapshot(); e.preventDefault(); el.x -= step; renderAll(); }
      else if (e.key === 'ArrowRight') { pushHistorySnapshot(); e.preventDefault(); el.x += step; renderAll(); }
      else if (e.key === 'ArrowUp') { pushHistorySnapshot(); e.preventDefault(); el.y -= step; renderAll(); }
      else if (e.key === 'ArrowDown') { pushHistorySnapshot(); e.preventDefault(); el.y += step; renderAll(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelectedElement(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicateSelectedElement(); }
    });

    // JSON Save & Load
    dom.btnSaveProject.addEventListener('click', () => {
      const payload = JSON.stringify({
        themeId: state.themeId,
        numSlides: state.numSlides,
        bgTuning: state.bgTuning,
        frameConfig: state.frameConfig,
        elements: state.elements
      }, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `carousel_${state.themeId}.json`;
      a.click();
    });

    dom.loadProjectInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (data.themeId && THEMES[data.themeId]) state.themeId = data.themeId;
          if (data.numSlides) state.numSlides = Math.max(2, Math.min(15, Number(data.numSlides)));
          if (data.bgTuning) Object.assign(state.bgTuning, data.bgTuning);
          if (data.frameConfig) Object.assign(state.frameConfig, data.frameConfig);
          if (Array.isArray(data.elements)) state.elements = data.elements;
          state.selectedId = null;
          renderAll();
        } catch (err) {
          alert('Invalid Carousel JSON file.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // PNG Exports
    dom.btnExportCurrent.addEventListener('click', () => exportSlidePNG(state.activeSlide));
    dom.btnExportAll.addEventListener('click', () => exportAllSlidesPNG());
  }

  // ==================== INITIALIZE STUDIO ====================
  function init() {
    state.elements = createDefaultElementsForTheme(state.themeId, state.numSlides);
    initEventListeners();
    setupStripInteractions();
    setupSimulatorInteractions();
    setupDragAndDrop();
    renderAll();
    setTimeout(fitZoomToViewport, 60);
  }

  init();
})();
