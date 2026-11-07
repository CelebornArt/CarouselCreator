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
    layersFilterMode: 'slide', // 'slide' (active slide only) | 'all' (all slides)
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
    exportBaseNameInput: document.getElementById('exportBaseNameInput'),

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
    dotResetBrightness: document.getElementById('dotResetBrightness'),
    dotResetSaturation: document.getElementById('dotResetSaturation'),
    dotResetOpacity: document.getElementById('dotResetOpacity'),

    layerCountBadge: document.getElementById('layerCountBadge'),
    layersList: document.getElementById('layersList'),
    psLayersActiveSlideTag: document.getElementById('psLayersActiveSlideTag'),
    btnLayersFilterSlide: document.getElementById('btnLayersFilterSlide'),
    btnLayersFilterAll: document.getElementById('btnLayersFilterAll'),
    psQuickBlendSelect: document.getElementById('psQuickBlendSelect'),
    psQuickOpacityInput: document.getElementById('psQuickOpacityInput'),
    psBtnBringForward: document.getElementById('psBtnBringForward'),
    psBtnSendBackward: document.getElementById('psBtnSendBackward'),
    psBtnToggleLock: document.getElementById('psBtnToggleLock'),
    psBtnDuplicate: document.getElementById('psBtnDuplicate'),
    psBtnDelete: document.getElementById('psBtnDelete'),

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

    // Mode Switching & Preset Creator Topbar
    btnSwitchStudio: document.getElementById('btnSwitchStudio'),
    btnSwitchPresetCreator: document.getElementById('btnSwitchPresetCreator'),
    btnNewPreset: document.getElementById('btnNewPreset'),
    btnModifyPreset: document.getElementById('btnModifyPreset'),
    optgroupCustomPresets: document.getElementById('optgroupCustomPresets'),
    workspaceStudio: document.getElementById('workspaceStudio'),
    workspacePresetCreator: document.getElementById('workspacePresetCreator'),

    // Preset Creator Left Sidebar
    creatorPresetDomainBadge: document.getElementById('creatorPresetDomainBadge'),
    creatorPresetNameInput: document.getElementById('creatorPresetNameInput'),
    creatorPresetArchetype: document.getElementById('creatorPresetArchetype'),
    btnCreatorAddColor: document.getElementById('btnCreatorAddColor'),
    creatorColorsList: document.getElementById('creatorColorsList'),
    creatorPatternSelect: document.getElementById('creatorPatternSelect'),
    btnCreatorResetGuides: document.getElementById('btnCreatorResetGuides'),
    btnCreatorAddGuideH: document.getElementById('btnCreatorAddGuideH'),
    btnCreatorAddGuideV: document.getElementById('btnCreatorAddGuideV'),
    creatorGuidesList: document.getElementById('creatorGuidesList'),
    btnCreatorSavePreset: document.getElementById('btnCreatorSavePreset'),
    btnCreatorExportJson: document.getElementById('btnCreatorExportJson'),
    creatorImportJsonInput: document.getElementById('creatorImportJsonInput'),
    topbarCreatorActions: document.getElementById('topbarCreatorActions'),
    btnTopDownloadPreset: document.getElementById('btnTopDownloadPreset'),
    topUploadPresetInput: document.getElementById('topUploadPresetInput'),
    btnTopSaveToStudio: document.getElementById('btnTopSaveToStudio'),
    creatorToggleGaps: document.getElementById('creatorToggleGaps'),

    // Preset Creator Viewport & Board
    creatorToggleGuides: document.getElementById('creatorToggleGuides'),
    btnCreatorZoomOut: document.getElementById('btnCreatorZoomOut'),
    creatorZoomReadout: document.getElementById('creatorZoomReadout'),
    btnCreatorZoomIn: document.getElementById('btnCreatorZoomIn'),
    btnCreatorZoomFit: document.getElementById('btnCreatorZoomFit'),
    creatorStripViewport: document.getElementById('creatorStripViewport'),
    creatorScrollContainer: document.getElementById('creatorScrollContainer'),
    creatorStageWrapper: document.getElementById('creatorStageWrapper'),
    creatorMasterElementsGrid: document.getElementById('creatorMasterElementsGrid'),
    btnCreatorAddNewDefaultEl: document.getElementById('btnCreatorAddNewDefaultEl'),
    btnCreatorCleanUpCanvas: document.getElementById('btnCreatorCleanUpCanvas'),
    creatorSlidesContainer: document.getElementById('creatorSlidesContainer'),
    creatorSmartGuidesLayer: document.getElementById('creatorSmartGuidesLayer'),
    creatorSnapGuidesLayer: document.getElementById('creatorSnapGuidesLayer'),
    creatorInteractionLayer: document.getElementById('creatorInteractionLayer'),

    // Preset Creator Left Sidebar Modifiers
    creatorModifiersList: document.getElementById('creatorModifiersList'),
    btnCreatorAddModifier: document.getElementById('btnCreatorAddModifier'),

    // Preset Creator Inspector
    creatorInspectorEmptyState: document.getElementById('creatorInspectorEmptyState'),
    creatorInspectorElementState: document.getElementById('creatorInspectorElementState'),
    creatorTitleFontSelect: document.getElementById('creatorTitleFontSelect'),
    creatorBodyFontSelect: document.getElementById('creatorBodyFontSelect'),
    creatorFontUploadInput: document.getElementById('creatorFontUploadInput'),
    creatorInspElTitle: document.getElementById('creatorInspElTitle'),
    creatorInspSlideBadge: document.getElementById('creatorInspSlideBadge'),
    creatorInspElName: document.getElementById('creatorInspElName'),
    creatorInspElText: document.getElementById('creatorInspElText'),
    creatorInspElFont: document.getElementById('creatorInspElFont'),
    creatorInspElFontSize: document.getElementById('creatorInspElFontSize'),
    creatorInspElColorSlot: document.getElementById('creatorInspElColorSlot'),
    creatorInspElColor: document.getElementById('creatorInspElColor'),
    creatorInspElColorHex: document.getElementById('creatorInspElColorHex'),
    creatorInspElOpacity: document.getElementById('creatorInspElOpacity'),
    creatorInspElOpacityVal: document.getElementById('creatorInspElOpacityVal'),
    creatorInspElHasBg: document.getElementById('creatorInspElHasBg'),
    creatorInspElBgColorSlot: document.getElementById('creatorInspElBgColorSlot'),
    creatorInspElBgColor: document.getElementById('creatorInspElBgColor'),
    creatorInspElBgOpacity: document.getElementById('creatorInspElBgOpacity'),
    creatorInspElBgOpacityVal: document.getElementById('creatorInspElBgOpacityVal'),
    creatorInspElBorderWidth: document.getElementById('creatorInspElBorderWidth'),
    creatorInspElBorderColorSlot: document.getElementById('creatorInspElBorderColorSlot'),
    creatorInspElBorderColor: document.getElementById('creatorInspElBorderColor'),
    creatorInspElBorderOpacity: document.getElementById('creatorInspElBorderOpacity'),
    creatorInspElBorderOpacityVal: document.getElementById('creatorInspElBorderOpacityVal'),
    creatorInspElEffect: document.getElementById('creatorInspElEffect'),
    creatorInspEffectRow: document.getElementById('creatorInspEffectRow'),
    creatorInspElEffectColorSlot: document.getElementById('creatorInspElEffectColorSlot'),
    creatorInspElEffectColor: document.getElementById('creatorInspElEffectColor'),
    creatorInspElEffectOpacity: document.getElementById('creatorInspElEffectOpacity'),
    creatorInspElEffectOpacityVal: document.getElementById('creatorInspElEffectOpacityVal'),
    creatorInspElAccent: document.getElementById('creatorInspElAccent'),
    creatorInspElAccentHex: document.getElementById('creatorInspElAccentHex'),
    creatorInspElIsMaster: document.getElementById('creatorInspElIsMaster'),
    creatorInspElAutoCount: document.getElementById('creatorInspElAutoCount'),
    creatorInspElAddToAllSlides: document.getElementById('creatorInspElAddToAllSlides'),
    creatorInspLinkAcrossSlidesRow: document.getElementById('creatorInspLinkAcrossSlidesRow'),
    creatorInspElLinkAcrossSlides: document.getElementById('creatorInspElLinkAcrossSlides'),
    creatorInspAnchorGrid: document.getElementById('creatorInspAnchorGrid'),
    btnCreatorDuplicateEl: document.getElementById('btnCreatorDuplicateEl'),
    btnCreatorDeleteEl: document.getElementById('btnCreatorDeleteEl'),

    // Master Default Element Modal Editor ("Mini Slide")
    masterElementEditorModal: document.getElementById('masterElementEditorModal'),
    masterModalTitle: document.getElementById('masterModalTitle'),
    btnMasterModalClose: document.getElementById('btnMasterModalClose'),
    btnMasterModalDone: document.getElementById('btnMasterModalDone'),
    masterModalCanvas: document.getElementById('masterModalCanvas'),
    masterModalPreviewBox: document.getElementById('masterModalPreviewBox'),
    masterModalZoomReadout: document.getElementById('masterModalZoomReadout'),
    btnMasterModalZoomReset: document.getElementById('btnMasterModalZoomReset'),
    masterModalNameInput: document.getElementById('masterModalNameInput'),
    masterModalTextInput: document.getElementById('masterModalTextInput'),
    masterModalAutoCount: document.getElementById('masterModalAutoCount'),
    masterModalFontFamily: document.getElementById('masterModalFontFamily'),
    masterModalFontSize: document.getElementById('masterModalFontSize'),
    masterModalColorSlot: document.getElementById('masterModalColorSlot'),
    masterModalTextColor: document.getElementById('masterModalTextColor'),
    masterModalTextColorHex: document.getElementById('masterModalTextColorHex'),
    masterModalOpacity: document.getElementById('masterModalOpacity'),
    masterModalOpacityVal: document.getElementById('masterModalOpacityVal'),
    masterModalEffect: document.getElementById('masterModalEffect'),
    masterModalEffectRow: document.getElementById('masterModalEffectRow'),
    masterModalEffectColorSlot: document.getElementById('masterModalEffectColorSlot'),
    masterModalEffectColor: document.getElementById('masterModalEffectColor'),
    masterModalEffectOpacity: document.getElementById('masterModalEffectOpacity'),
    masterModalEffectOpacityVal: document.getElementById('masterModalEffectOpacityVal'),
    masterModalAccentColor: document.getElementById('masterModalAccentColor'),
    masterModalAccentColorHex: document.getElementById('masterModalAccentColorHex'),
    masterModalBoxW: document.getElementById('masterModalBoxW'),
    masterModalBoxH: document.getElementById('masterModalBoxH'),
    masterModalBgColor: document.getElementById('masterModalBgColor'),
    masterModalBgColorSlot: document.getElementById('masterModalBgColorSlot'),
    masterModalHasBg: document.getElementById('masterModalHasBg'),
    masterModalBgOpacity: document.getElementById('masterModalBgOpacity'),
    masterModalBgOpacityVal: document.getElementById('masterModalBgOpacityVal'),
    masterModalBorderWidth: document.getElementById('masterModalBorderWidth'),
    masterModalBorderColorSlot: document.getElementById('masterModalBorderColorSlot'),
    masterModalBorderColor: document.getElementById('masterModalBorderColor'),
    masterModalBorderOpacity: document.getElementById('masterModalBorderOpacity'),
    masterModalBorderOpacityVal: document.getElementById('masterModalBorderOpacityVal'),
    masterModalAnchorGrid: document.getElementById('masterModalAnchorGrid'),
    btnMasterAddText: document.getElementById('btnMasterAddText'),
    btnMasterAddShape: document.getElementById('btnMasterAddShape'),
    masterModalImageUpload: document.getElementById('masterModalImageUpload'),
    masterModalExtraLayersList: document.getElementById('masterModalExtraLayersList'),

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
    shapeVectorControls: document.getElementById('shapeVectorControls'),
    inspShapeFill: document.getElementById('inspShapeFill'),
    inspShapeNoFill: document.getElementById('inspShapeNoFill'),
    inspShapeStroke: document.getElementById('inspShapeStroke'),
    inspShapeStrokeWidth: document.getElementById('inspShapeStrokeWidth'),
    shapeImageCustomBox: document.getElementById('shapeImageCustomBox'),
    uploadCustomShapeImageInput: document.getElementById('uploadCustomShapeImageInput'),
    btnResetShapeDefault: document.getElementById('btnResetShapeDefault'),

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
      if (el.customSrc) {
        return `<img src="${el.customSrc}" style="width:100%;height:100%;object-fit:${el.fit || 'contain'};pointer-events:none;display:block;" alt="" />`;
      }
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
      if (el.hidden) return '';
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
          <span class="tool-label">Placeholder Image</span>
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

    // Append Custom Preset Elements if available for custom presets
    const customElements = (theme.isCustom && (theme.customElements || (state.creatorState && state.creatorState.masterElements))) ||
                           (Array.isArray(theme.customElements) ? theme.customElements : []);
    if (customElements.length > 0) {
      customElements.forEach(ce => {
        const btn = document.createElement('button');
        btn.className = 'tool-btn';
        btn.innerHTML = `<span class="tool-icon">${ce.icon || '✦'}</span><span class="tool-label">${escapeHtml(ce.name || 'Custom Element')}</span>`;
        btn.onclick = () => {
          const sx = state.activeSlide * SLIDE_W;
          const cloned = JSON.parse(JSON.stringify(ce));
          cloned.id = genId('custom-el');
          cloned.isMaster = false;
          cloned.x = sx + 120;
          cloned.y = 540;
          state.elements.push(cloned);
          state.selectedId = cloned.id;
          renderAll();
        };
        dom.presetElementsGrid.appendChild(btn);
      });
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
    if (dom.psLayersActiveSlideTag) {
      dom.psLayersActiveSlideTag.textContent = `Slide ${state.activeSlide + 1}`;
    }
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

  // Photopea / Photoshop Style Layers Panel Renderer
  function renderLayersList() {
    const isAll = state.layersFilterMode === 'all';
    const curSlide = state.activeSlide;
    const slideLeft = curSlide * SLIDE_W;
    const slideRight = (curSlide + 1) * SLIDE_W;

    // Filter elements based on active filter pill (Active slide vs All slides)
    const elementsToDisplay = state.elements.filter(el => {
      if (isAll) return true;
      return el.x + el.w > slideLeft && el.x < slideRight;
    });

    dom.layerCountBadge.textContent = String(elementsToDisplay.length);
    if (dom.btnLayersFilterSlide) dom.btnLayersFilterSlide.classList.toggle('active', !isAll);
    if (dom.btnLayersFilterAll) dom.btnLayersFilterAll.classList.toggle('active', isAll);

    // Sync Photoshop quickbar (blend mode & opacity) to currently selected layer
    const sel = getSelectedElement();
    if (dom.psQuickBlendSelect) {
      dom.psQuickBlendSelect.value = sel?.blendMode || 'normal';
      dom.psQuickBlendSelect.disabled = !sel;
    }
    if (dom.psQuickOpacityInput) {
      dom.psQuickOpacityInput.value = sel ? Math.round(sel.opacity ?? 100) : 100;
      dom.psQuickOpacityInput.disabled = !sel;
    }
    if (dom.psBtnToggleLock) {
      dom.psBtnToggleLock.classList.toggle('active', Boolean(sel?.locked));
    }

    // In Photoshop / Photopea, top layers in the stack are rendered at the top of the list
    const reversed = [...elementsToDisplay].reverse();

    if (reversed.length === 0) {
      dom.layersList.innerHTML = `
        <div style="padding: 24px 12px; text-align: center; color: var(--text-muted); font-size: 11px;">
          No layers on this slide
        </div>
      `;
      return;
    }

    dom.layersList.innerHTML = reversed.map(el => {
      const isSelected = el.id === state.selectedId;
      const isHidden = Boolean(el.hidden);
      const isLocked = Boolean(el.locked);
      const spanInfo = getSlideSpanInfo(el);

      // Determine clean label, thumbnail preview, and type badge
      let label = el.name || el.type.toUpperCase();
      let sublabel = '';
      let thumbHtml = '';
      let thumbTypeClass = 'type-shape';

      if (el.layerGroup === 'background') {
        thumbTypeClass = 'type-bg';
        label = el.name || 'Background Plane';
        sublabel = `${el.w}×${el.h}`;
        if (el.src) {
          thumbHtml = `<img src="${el.src}" class="ps-layer-thumb-img" alt="" />`;
        } else {
          thumbHtml = `<span class="ps-layer-thumb-badge">BG</span>`;
        }
      } else if (el.type === 'image') {
        thumbTypeClass = 'type-img';
        label = el.name || 'Image Layer';
        sublabel = `${Math.round(el.w)}×${Math.round(el.h)}`;
        if (el.src) {
          thumbHtml = `<img src="${el.src}" class="ps-layer-thumb-img" alt="" />`;
        } else {
          thumbHtml = `<span class="ps-layer-thumb-badge">IMG</span>`;
        }
      } else if (el.type === 'text') {
        thumbTypeClass = 'type-txt';
        const roleLabel = el.role === 'headline' ? 'Header' : (el.role === 'subtitle' ? 'Subtitle' : (el.role === 'handle' ? 'Handle' : 'Text'));
        label = (el.text || 'Text Layer').replace(/\n/g, ' ').trim().slice(0, 26) || 'Empty Text';
        sublabel = `<span class="ps-layer-role-pill">${roleLabel}</span> ${el.fontSize || 40}px`;
        thumbHtml = `<span class="ps-layer-thumb-badge">T</span>`;
      } else if (el.type === 'emblem') {
        thumbTypeClass = 'type-frame';
        label = 'Corner Emblem';
        sublabel = el.emblemVariant || 'Art-Deco';
        const embSrc = el.customSrc || ASSETS[el.emblemVariant] || ASSETS.emblem_theory;
        if (embSrc) {
          thumbHtml = `<img src="${embSrc}" class="ps-layer-thumb-img" alt="" />`;
        } else {
          thumbHtml = `<span class="ps-layer-thumb-badge">EMB</span>`;
        }
      } else if (el.type === 'triangle') {
        thumbTypeClass = 'type-shape';
        label = el.customSrc ? 'Custom Topic Graphic' : 'Placeholder Image';
        sublabel = el.customSrc ? 'Custom Alpha' : 'Vector Shape';
        if (el.customSrc) {
          thumbHtml = `<img src="${el.customSrc}" class="ps-layer-thumb-img" alt="" />`;
        } else {
          thumbHtml = `<svg width="15" height="15" viewBox="0 0 20 18" fill="none" stroke="#98C379" stroke-width="2"><polygon points="10,2 18,16 2,16"/></svg>`;
        }
      } else if (el.type === 'games-notch') {
        thumbTypeClass = 'type-frame';
        label = `Top Notch (${el.topicText || 'EPISODE'})`;
        sublabel = 'Slide 1 Trapezoid';
        thumbHtml = `<span class="ps-layer-thumb-badge" style="color:#D19A66;">NOTCH</span>`;
      } else if (el.type === 'games-swipe-combo') {
        thumbTypeClass = 'type-frame';
        label = 'Bottom Swipe + Hand';
        sublabel = 'Navigation';
        thumbHtml = `<span class="ps-layer-thumb-badge" style="color:#E5C07B;">SWIPE</span>`;
      } else if (el.type === 'games-username-box') {
        thumbTypeClass = 'type-txt';
        label = el.handleText || '@Username';
        sublabel = 'Handle Box';
        thumbHtml = `<span class="ps-layer-thumb-badge" style="color:#61AFEF;">USER</span>`;
      } else if (el.type === 'games-border-pattern') {
        thumbTypeClass = 'type-frame';
        label = el.name || (el.patternPosition === 'top' ? 'Top Border Pattern' : 'Bottom Border Pattern');
        sublabel = el.patternType || 'Pattern';
        thumbHtml = `<span class="ps-layer-thumb-badge" style="color:#ABB2BF;">PAT</span>`;
      } else if (el.type === 'divider' || el.type === 'rect') {
        thumbTypeClass = 'type-shape';
        label = el.name || (el.type === 'divider' ? 'Divider Line' : 'Rectangle');
        sublabel = `${Math.round(el.w)}×${Math.round(el.h)}`;
        thumbHtml = `<span class="ps-layer-thumb-badge">REC</span>`;
      } else {
        thumbHtml = `<span class="ps-layer-thumb-badge">${el.type.slice(0, 3).toUpperCase()}</span>`;
      }

      // Eye Visibility Icon (Photoshop style)
      const eyeIconSvg = isHidden
        ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

      // Lock Icon
      const lockIconSvg = isLocked
        ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        : ``;

      return `
        <div class="layer-item ps-layer-row ${isSelected ? 'active' : ''} ${isHidden ? 'is-hidden' : ''} ${isLocked ? 'is-locked' : ''}"
             data-layer-id="${el.id}"
             draggable="true">
          <!-- Eye Visibility Toggle -->
          <button class="ps-layer-vis-btn ${isHidden ? 'is-hidden' : ''}" data-action="toggle-vis" title="${isHidden ? 'Show Layer' : 'Hide Layer'}">
            ${eyeIconSvg}
          </button>

          <!-- Layer Thumbnail / Symbol -->
          <div class="ps-layer-thumb ${thumbTypeClass}">
            ${thumbHtml}
          </div>

          <!-- Title and metadata -->
          <div class="ps-layer-info">
            <div class="ps-layer-name" title="${escapeHtml(el.name || label)}">${escapeHtml(label)}</div>
            <div class="ps-layer-subtext">${sublabel}</div>
          </div>

          <!-- Right badges & lock -->
          <div class="ps-layer-actions-right">
            ${isLocked ? `<span class="ps-layer-lock-btn is-locked" data-action="toggle-lock" title="Unlock Layer">${lockIconSvg}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function updateInspector() {
    const theme = getActiveTheme();
    const sel = getSelectedElement();

    // Summary Card (if present)
    if (dom.themeSummaryCard) {
      dom.themeSummaryCard.innerHTML = `
        <strong style="color:var(--accent-gold);display:block;margin-bottom:4px;">${escapeHtml(theme.name)}</strong>
        <span>${escapeHtml(theme.description)}</span>
      `;
    }
    dom.frameHandleInput.value = state.frameConfig.handle;
    const topicTagEl = state.elements.find(el => el.role === 'topic-tag');
    if (topicTagEl && theme.domain === 'games') {
      dom.frameSeriesInput.value = topicTagEl.text;
    } else {
      dom.frameSeriesInput.value = state.frameConfig.series;
    }

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

      // Allow replace/upload custom image on shapes (specifically triangle placeholder on game slides)
      if (dom.shapeImageCustomBox) {
        const canUploadImg = ['triangle', 'rect'].includes(sel.type);
        dom.shapeImageCustomBox.classList.toggle('hidden', !canUploadImg);
        if (canUploadImg && dom.btnResetShapeDefault) {
          dom.btnResetShapeDefault.classList.toggle('hidden', !sel.customSrc);
        }
      }
      if (dom.shapeVectorControls) {
        // Dim vector controls if a custom image is active
        dom.shapeVectorControls.style.opacity = sel.customSrc ? '0.35' : '1';
        dom.shapeVectorControls.style.pointerEvents = sel.customSrc ? 'none' : 'auto';
      }
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
    // Spacebar detection for canvas panning (Studio & Preset Creator)
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || state.editingTextId) return;

      if (e.code === 'Space' && !isSpacePressed) {
        isSpacePressed = true;
        if (dom.stripScrollContainer) dom.stripScrollContainer.classList.add('space-ready');
        if (dom.creatorScrollContainer) dom.creatorScrollContainer.classList.add('space-ready');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        isSpacePressed = false;
        if (dom.stripScrollContainer) dom.stripScrollContainer.classList.remove('space-ready');
        if (dom.creatorScrollContainer) dom.creatorScrollContainer.classList.remove('space-ready');
      }
    });

    // Mousedown on Stage
    dom.stripStageWrapper.addEventListener('mousedown', (e) => {
      // 1. Canvas Panning (Space + Left Click OR Alt + Middle Click OR Middle Click)
      if ((isSpacePressed && e.button === 0) || (e.altKey && e.button === 1) || e.button === 1) {
        e.preventDefault();
        panSession = {
          container: dom.stripScrollContainer,
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
      if (rotHandle && selEl && !selEl.locked) {
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
      if (resizeHandle && selEl && !selEl.locked) {
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

        if (!targetEl.locked) {
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
        }
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
        panSession.container.scrollLeft = panSession.scrollLeft - (e.clientX - panSession.startX);
        panSession.container.scrollTop = panSession.scrollTop - (e.clientY - panSession.startY);
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
        if (panSession.container) panSession.container.classList.remove('is-panning');
        panSession = null;
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
      if (el.hidden) continue;
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
        if (el.customSrc) {
          const customImg = await loadImageCached(el.customSrc);
          if (customImg) {
            drawImageFit(ctx, customImg, -el.w / 2, -el.h / 2, el.w, el.h, el.fit || 'contain');
          }
        } else {
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
        }
        ctx.restore();
      }
    }

    return canvas;
  }

  // Pure-JS in-browser ZIP generator (Store/Uncompressed 0-compression, 100% native client-side zero-dependency)
  function createZipArchiveBlob(files) {
    const crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    function calcCrc32(bytes) {
      let c = 0 ^ (-1);
      for (let i = 0; i < bytes.length; i++) {
        c = (c >>> 8) ^ crcTable[(c ^ bytes[i]) & 0xFF];
      }
      return (c ^ (-1)) >>> 0;
    }

    const fileEntries = [];
    let curOffset = 0;

    for (const f of files) {
      const data = f.data; // Uint8Array
      const nameBytes = new TextEncoder().encode(f.name);

      const localHeader = new Uint8Array(30);
      const dv = new DataView(localHeader.buffer);
      dv.setUint32(0, 0x04034b50, true); // Local file header signature
      dv.setUint16(4, 20, true);         // Version needed to extract (2.0)
      dv.setUint16(6, 0, true);          // General purpose bit flag
      dv.setUint16(8, 0, true);          // Compression method: 0 (stored)
      dv.setUint16(10, 0, true);         // Last mod file time
      dv.setUint16(12, 0, true);         // Last mod file date

      const crc = calcCrc32(data);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, data.length, true); // Compressed size
      dv.setUint32(22, data.length, true); // Uncompressed size
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true); // Extra field length

      fileEntries.push({
        localHeader,
        nameBytes,
        data,
        crc,
        offset: curOffset
      });

      curOffset += localHeader.length + nameBytes.length + data.length;
    }

    const cdStartOffset = curOffset;
    const cdChunks = [];
    let cdSize = 0;

    for (const entry of fileEntries) {
      const cdHeader = new Uint8Array(46);
      const dv = new DataView(cdHeader.buffer);
      dv.setUint32(0, 0x02014b50, true); // Central directory header signature
      dv.setUint16(4, 20, true);         // Version made by
      dv.setUint16(6, 20, true);         // Version needed to extract
      dv.setUint16(8, 0, true);          // Bit flag
      dv.setUint16(10, 0, true);         // Compression method
      dv.setUint16(12, 0, true);         // Mod time
      dv.setUint16(14, 0, true);         // Mod date
      dv.setUint32(16, entry.crc, true);
      dv.setUint32(20, entry.data.length, true); // Compressed size
      dv.setUint32(24, entry.data.length, true); // Uncompressed size
      dv.setUint16(28, entry.nameBytes.length, true);
      dv.setUint16(30, 0, true); // Extra field len
      dv.setUint16(32, 0, true); // Comment len
      dv.setUint16(34, 0, true); // Disk start
      dv.setUint16(36, 0, true); // Internal attrs
      dv.setUint32(38, 0, true); // External attrs
      dv.setUint32(42, entry.offset, true); // Relative offset of local header

      cdChunks.push(cdHeader, entry.nameBytes);
      cdSize += cdHeader.length + entry.nameBytes.length;
    }

    const eocd = new Uint8Array(22);
    const dvEocd = new DataView(eocd.buffer);
    dvEocd.setUint32(0, 0x06054b50, true); // End of central directory signature
    dvEocd.setUint16(4, 0, true);          // Disk number
    dvEocd.setUint16(6, 0, true);          // Start disk
    dvEocd.setUint16(8, files.length, true);  // Number of central directory records on this disk
    dvEocd.setUint16(10, files.length, true); // Total central directory records
    dvEocd.setUint32(12, cdSize, true);        // Size of central directory
    dvEocd.setUint32(16, cdStartOffset, true); // Offset of start of central directory
    dvEocd.setUint16(20, 0, true);             // Comment length

    const finalBlobParts = [];
    for (const e of fileEntries) {
      finalBlobParts.push(e.localHeader, e.nameBytes, e.data);
    }
    finalBlobParts.push(...cdChunks, eocd);

    return new Blob(finalBlobParts, { type: 'application/zip' });
  }

  function getCleanExportBaseName() {
    let name = dom.exportBaseNameInput?.value?.trim() || '';
    if (!name) name = `carousel_${state.themeId}`;
    // Replace spaces and invalid filename characters
    return name.replace(/[^\w.-]/g, '_');
  }

  async function exportSlidePNG(slideIndex) {
    const baseName = getCleanExportBaseName();
    const padNum = String(slideIndex + 1).padStart(2, '0');
    const canvas = await renderSlideToCanvas(slideIndex);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${baseName}_${padNum}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function exportAllSlidesPNG() {
    const baseName = getCleanExportBaseName();
    const originalText = dom.btnExportAll.textContent;
    dom.btnExportAll.textContent = '⏳ Rendering...';
    dom.btnExportAll.disabled = true;

    try {
      const filesForZip = [];

      for (let i = 0; i < state.numSlides; i++) {
        const padNum = String(i + 1).padStart(2, '0');
        const filename = `${baseName}_${padNum}.png`;

        dom.btnExportAll.textContent = `⏳ Rendering ${i + 1}/${state.numSlides}...`;
        const canvas = await renderSlideToCanvas(i);

        // Convert canvas to binary blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const arrayBuf = await blob.arrayBuffer();
        filesForZip.push({
          name: filename,
          data: new Uint8Array(arrayBuf)
        });
      }

      dom.btnExportAll.textContent = '⏳ Zipping...';
      const zipBlob = createZipArchiveBlob(filesForZip);
      const zipUrl = URL.createObjectURL(zipBlob);

      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `${baseName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(zipUrl), 2000);
    } catch (err) {
      console.error('Export ZIP error:', err);
      alert('Error creating ZIP export: ' + err.message);
    } finally {
      dom.btnExportAll.textContent = originalText;
      dom.btnExportAll.disabled = false;
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
    if (creatorState.active) {
      // Studio is locked while in Preset Creator
      dom.themeSelect.value = state.themeId;
      return;
    }
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

    // Slider Default Reset Dots (Click to reset individual slider to default)
    if (dom.dotResetBrightness) {
      dom.dotResetBrightness.addEventListener('click', (e) => {
        e.stopPropagation();
        state.bgTuning.brightness = 100;
        dom.bgBrightnessSlider.value = 100;
        dom.bgBrightnessVal.textContent = '100%';
        renderAll();
      });
    }
    if (dom.dotResetSaturation) {
      dom.dotResetSaturation.addEventListener('click', (e) => {
        e.stopPropagation();
        state.bgTuning.saturation = 100;
        dom.bgSaturationSlider.value = 100;
        dom.bgSaturationVal.textContent = '100%';
        renderAll();
      });
    }
    if (dom.dotResetOpacity) {
      dom.dotResetOpacity.addEventListener('click', (e) => {
        e.stopPropagation();
        state.bgTuning.textureOpacity = 100;
        dom.bgOpacitySlider.value = 100;
        dom.bgOpacityVal.textContent = '100%';
        renderAll();
      });
    }

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

    // Photopea / Photoshop Style Layers Panel Event Listeners
    if (dom.btnLayersFilterSlide) {
      dom.btnLayersFilterSlide.addEventListener('click', () => {
        state.layersFilterMode = 'slide';
        renderLayersList();
      });
    }
    if (dom.btnLayersFilterAll) {
      dom.btnLayersFilterAll.addEventListener('click', () => {
        state.layersFilterMode = 'all';
        renderLayersList();
      });
    }

    if (dom.psQuickBlendSelect) {
      dom.psQuickBlendSelect.addEventListener('change', (e) => {
        const el = getSelectedElement();
        if (!el) return;
        pushHistorySnapshot();
        el.blendMode = e.target.value;
        if (dom.inspBlendMode) dom.inspBlendMode.value = el.blendMode;
        renderAll();
      });
    }

    if (dom.psQuickOpacityInput) {
      dom.psQuickOpacityInput.addEventListener('input', (e) => {
        const el = getSelectedElement();
        if (!el) return;
        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
        el.opacity = val;
        if (dom.inspOpacity) dom.inspOpacity.value = val;
        if (dom.inspOpacityVal) dom.inspOpacityVal.textContent = `${val}%`;
        renderAll();
      });
    }

    if (dom.psBtnBringForward) {
      dom.psBtnBringForward.addEventListener('click', () => {
        if (!state.selectedId) return;
        const idx = state.elements.findIndex(e => e.id === state.selectedId);
        if (idx >= 0 && idx < state.elements.length - 1) {
          pushHistorySnapshot();
          const [item] = state.elements.splice(idx, 1);
          state.elements.splice(idx + 1, 0, item);
          renderAll();
        }
      });
    }

    if (dom.psBtnSendBackward) {
      dom.psBtnSendBackward.addEventListener('click', () => {
        if (!state.selectedId) return;
        const idx = state.elements.findIndex(e => e.id === state.selectedId);
        if (idx > 0) {
          pushHistorySnapshot();
          const [item] = state.elements.splice(idx, 1);
          state.elements.splice(idx - 1, 0, item);
          renderAll();
        }
      });
    }

    if (dom.psBtnToggleLock) {
      dom.psBtnToggleLock.addEventListener('click', () => {
        const el = getSelectedElement();
        if (!el) return;
        pushHistorySnapshot();
        el.locked = !el.locked;
        renderAll();
      });
    }

    if (dom.psBtnDuplicate) {
      dom.psBtnDuplicate.addEventListener('click', duplicateSelectedElement);
    }

    if (dom.psBtnDelete) {
      dom.psBtnDelete.addEventListener('click', deleteSelectedElement);
    }

    // Layers List Interactions (Click, Visibility Toggle, Lock Toggle, and Drag-and-Drop Reordering)
    let layerDragSrcId = null;

    dom.layersList.addEventListener('click', (e) => {
      const item = e.target.closest('.layer-item');
      if (!item) return;
      const targetId = item.dataset.layerId;
      const el = state.elements.find(x => x.id === targetId);
      if (!el) return;

      const visBtn = e.target.closest('[data-action="toggle-vis"]');
      if (visBtn) {
        e.stopPropagation();
        pushHistorySnapshot();
        el.hidden = !el.hidden;
        renderAll();
        return;
      }

      const lockBtn = e.target.closest('[data-action="toggle-lock"]');
      if (lockBtn) {
        e.stopPropagation();
        pushHistorySnapshot();
        el.locked = !el.locked;
        renderAll();
        return;
      }

      state.selectedId = targetId;
      state.activeSlide = getSlideSpanInfo(el).primary;
      renderAll();
    });

    dom.layersList.addEventListener('dragstart', (e) => {
      const item = e.target.closest('.layer-item');
      if (!item) return;
      layerDragSrcId = item.dataset.layerId;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', layerDragSrcId);
      item.style.opacity = '0.5';
    });

    dom.layersList.addEventListener('dragend', (e) => {
      const item = e.target.closest('.layer-item');
      if (item) item.style.opacity = '1';
      document.querySelectorAll('.layer-item').forEach(el => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
    });

    dom.layersList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const targetItem = e.target.closest('.layer-item');
      if (!targetItem || targetItem.dataset.layerId === layerDragSrcId) return;

      const rect = targetItem.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const isTop = relY < rect.height / 2;

      targetItem.classList.toggle('drag-over-top', isTop);
      targetItem.classList.toggle('drag-over-bottom', !isTop);
    });

    dom.layersList.addEventListener('dragleave', (e) => {
      const targetItem = e.target.closest('.layer-item');
      if (targetItem) {
        targetItem.classList.remove('drag-over-top', 'drag-over-bottom');
      }
    });

    dom.layersList.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetItem = e.target.closest('.layer-item');
      if (!targetItem || !layerDragSrcId || targetItem.dataset.layerId === layerDragSrcId) return;

      const targetId = targetItem.dataset.layerId;
      const rect = targetItem.getBoundingClientRect();
      const isInsertBefore = (e.clientY - rect.top) < rect.height / 2;

      // Note: In the DOM layersList, items are rendered in reversed stack order (top layer at index 0)
      const srcIdx = state.elements.findIndex(x => x.id === layerDragSrcId);
      const tgtIdx = state.elements.findIndex(x => x.id === targetId);

      if (srcIdx >= 0 && tgtIdx >= 0) {
        pushHistorySnapshot();
        const [movedItem] = state.elements.splice(srcIdx, 1);
        let newIdx = state.elements.findIndex(x => x.id === targetId);

        // Since list is reversed:
        // Dropping on the top half of target item means placing it higher in stack (after target in elements array)
        if (isInsertBefore) {
          state.elements.splice(newIdx + 1, 0, movedItem);
        } else {
          state.elements.splice(newIdx, 0, movedItem);
        }
        renderAll();
      }

      layerDragSrcId = null;
      document.querySelectorAll('.layer-item').forEach(el => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
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
        if (el.role === 'topic-tag') el.text = e.target.value.toUpperCase();
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

    // Custom Shape Graphic Upload / Reset (Game Slide Triangle placeholder)
    if (dom.uploadCustomShapeImageInput) {
      dom.uploadCustomShapeImageInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        const el = getSelectedElement();
        if (!file || !el || !['triangle', 'rect'].includes(el.type)) return;
        pushHistorySnapshot();
        const reader = new FileReader();
        reader.onload = () => {
          el.customSrc = reader.result;
          el.fit = el.fit || 'contain';
          renderAll();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
    }

    if (dom.btnResetShapeDefault) {
      dom.btnResetShapeDefault.addEventListener('click', () => {
        const el = getSelectedElement();
        if (!el || !el.customSrc) return;
        pushHistorySnapshot();
        el.customSrc = null;
        renderAll();
      });
    }

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

      // In Preset Creator Mode
      if (creatorState.active) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) redoCreator();
          else undoCreator();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redoCreator();
          return;
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteCreatorSelected();
          return;
        }
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          nudgeCreatorSelected(e.key, e.shiftKey ? 10 : 1);
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          duplicateCreatorSelected();
          return;
        }
        return;
      }

      // In Studio Mode: Undo / Redo
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

// ==================== PRESET CREATOR MODULE ====================

  const STORAGE_KEY_CUSTOM_PRESETS = 'carousel_custom_presets_v1';

  // Load custom presets from localStorage
  function loadCustomPresetsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          Object.assign(THEMES, parsed);
          Object.keys(THEMES).forEach(k => {
            if (THEMES[k].customElements && Array.isArray(THEMES[k].customElements)) {
              THEMES[k].customElements.forEach(normalizeMasterElement);
            }
          });
          syncCustomPresetsSelect();
        }
      }
      if (typeof creatorState !== 'undefined') {
        if (Array.isArray(creatorState.masterElements)) {
          creatorState.masterElements.forEach(normalizeMasterElement);
        }
        if (Array.isArray(creatorState.elements)) {
          creatorState.elements.forEach(normalizeMasterElement);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom presets from storage', e);
    }
  }

  function saveCustomPresetsToStorage() {
    try {
      const customOnly = {};
      Object.keys(THEMES).forEach(k => {
        if (THEMES[k].isCustom) customOnly[k] = THEMES[k];
      });
      localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(customOnly));
      syncCustomPresetsSelect();
    } catch (e) {
      console.warn('Failed to save custom presets to storage', e);
    }
  }

  function syncCustomPresetsSelect() {
    if (!dom.optgroupCustomPresets) return;
    const customKeys = Object.keys(THEMES).filter(k => THEMES[k].isCustom);
    if (customKeys.length === 0) {
      dom.optgroupCustomPresets.classList.add('hidden');
      dom.optgroupCustomPresets.innerHTML = '';
    } else {
      dom.optgroupCustomPresets.classList.remove('hidden');
      dom.optgroupCustomPresets.innerHTML = customKeys.map(k => `
        <option value="${k}">${escapeHtml(THEMES[k].name)}</option>
      `).join('');
    }
  }

  function normalizeMasterElement(el) {
    if (!el) return;
    if (el.opacity === undefined) el.opacity = 1;
    if (el.bgOpacity === undefined) el.bgOpacity = 1;
    if (el.borderWidth === undefined) el.borderWidth = 0;
    if (el.borderOpacity === undefined) el.borderOpacity = 1;
    if (!el.w) el.w = 320;
    if (!el.h) el.h = 60;
    if (!el.anchor) el.anchor = 'nw';

    if (!Array.isArray(el.layers)) {
      el.layers = [];
      // Migrate extraLayers if present
      if (Array.isArray(el.extraLayers)) {
        el.extraLayers.forEach((l, idx) => {
          el.layers.push({
            id: l.id || `layer-extra-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            type: l.type || 'shape',
            shapeType: l.shapeType || 'rectangle',
            name: l.name || `Layer ${idx + 1}`,
            x: l.x || 0,
            y: l.y || 0,
            w: l.w || 40,
            h: l.h || 20,
            colorSlot: l.colorSlot || '',
            color: l.color || l.bg || '#219652',
            bg: l.bg || l.color || '#219652',
            opacity: l.opacity !== undefined ? l.opacity : 1,
            radius: l.radius || 0,
            borderWidth: l.borderWidth || 0,
            borderColorSlot: l.borderColorSlot || '',
            borderColor: l.borderColor || '#000000',
            borderOpacity: l.borderOpacity !== undefined ? l.borderOpacity : 1,
            text: l.text || '',
            fontFamily: l.fontFamily || 'Rubik',
            fontSize: l.fontSize || 32,
            isBold: !!l.isBold,
            uppercase: !!l.uppercase,
            textEffect: l.textEffect || 'none',
            effectColorSlot: l.effectColorSlot || '',
            effectColor: l.effectColor || '#ffffff',
            effectOpacity: l.effectOpacity !== undefined ? l.effectOpacity : 0.8,
            align: l.align || 'left',
            autoCount: !!l.autoCount,
            src: l.src || ''
          });
        });
      }
      // Migrate legacy text field if present
      if (el.text !== undefined && el.text !== null && el.text !== '') {
        const hasTextLayer = el.layers.some(l => l.type === 'text');
        if (!hasTextLayer) {
          el.layers.push({
            id: 'layer-text-' + Math.random().toString(36).substr(2, 5),
            type: 'text',
            name: el.role === 'headline' ? 'Title Text' : (el.role === 'subtitle' ? 'Normal Text' : (el.role === 'counter' ? 'Slide Counter' : (el.role === 'swipe' ? 'Swipe Indicator' : (el.role === 'handle' ? 'Handle Text' : 'Text')))),
            x: el.textX !== undefined ? el.textX : (el.role === 'handle' ? 20 : 0),
            y: el.textY !== undefined ? el.textY : (el.role === 'handle' ? 4 : 0),
            w: el.textW !== undefined ? el.textW : (el.role === 'handle' ? Math.max(100, el.w - 30) : el.w),
            h: el.textH !== undefined ? el.textH : (el.role === 'handle' ? Math.max(20, el.h - 8) : el.h),
            text: el.text || '',
            fontFamily: el.fontFamily || 'Rubik',
            fontSize: el.fontSize || 32,
            isBold: !!l?.isBold,
            uppercase: !!l?.uppercase,
            colorSlot: el.colorSlot || '',
            color: el.color || '#162D43',
            opacity: el.opacity !== undefined ? el.opacity : 1,
            accentColor: el.accentColor || '#219652',
            textEffect: el.textEffect || 'none',
            effectColorSlot: el.effectColorSlot || '',
            effectColor: el.effectColor || '#ffffff',
            effectOpacity: el.effectOpacity !== undefined ? el.effectOpacity : 0.8,
            align: el.align || (el.role === 'handle' ? 'left' : (el.anchor === 'nw' ? 'left' : 'center')),
            autoCount: !!el.autoCount
          });
        }
      }
    }

    el.extraLayers = el.layers;
    const primText = el.layers.find(l => l.type === 'text');
    if (primText) {
      if (!el.text) el.text = primText.text;
      if (!el.fontFamily) el.fontFamily = primText.fontFamily;
      if (!el.fontSize) el.fontSize = primText.fontSize;
      if (el.autoCount === undefined) el.autoCount = primText.autoCount;
    }

    // Strict containment: ensure every layer is clamped inside master element boundary [0, el.w] and [0, el.h]
    if (Array.isArray(el.layers)) {
      el.layers.forEach(lay => {
        if (!lay.w || lay.w < 4) lay.w = 40;
        if (!lay.h || lay.h < 4) lay.h = 20;
        if (lay.w > el.w) lay.w = el.w;
        if (lay.h > el.h) lay.h = el.h;
        if ((lay.x || 0) < 0) lay.x = 0;
        if ((lay.y || 0) < 0) lay.y = 0;
        if (((lay.x || 0) + lay.w) > el.w) {
          lay.x = Math.max(0, el.w - lay.w);
        }
        if (((lay.y || 0) + lay.h) > el.h) {
          lay.y = Math.max(0, el.h - lay.h);
        }
      });
    }
  }

  function getDefaultMasterElements() {
    return [
      {
        id: 'master-handle',
        isMaster: true,
        type: 'compound',
        layerGroup: 'foreground',
        role: 'handle',
        name: 'Channel Handle',
        icon: '@',
        text: '@channelName',
        fontFamily: 'Rubik',
        fontSize: 32,
        isBold: true,
        colorSlot: 'col-primary',
        color: '#162D43',
        opacity: 1,
        accentColor: '#219652',
        hasBg: false,
        bgColorSlot: '',
        bgColor: '#ffffff',
        bgOpacity: 1,
        borderWidth: 0,
        borderColorSlot: '',
        borderColor: '#000000',
        borderOpacity: 1,
        textEffect: 'none',
        effectColorSlot: '',
        effectColor: '#ffffff',
        effectOpacity: 0.8,
        anchor: 'nw',
        x: 140,
        y: 85,
        w: 280,
        h: 48,
        rotation: 0,
        layers: [
          {
            id: 'layer-handle-bar',
            type: 'shape',
            shapeType: 'divider',
            name: 'Divider Line',
            x: 0,
            y: 4,
            w: 5,
            h: 40,
            colorSlot: 'col-secondary',
            color: '#219652',
            bg: '#219652',
            opacity: 1,
            radius: 2,
            borderWidth: 0,
            borderColorSlot: '',
            borderColor: '#000000',
            borderOpacity: 1
          },
          {
            id: 'layer-handle-text',
            type: 'text',
            name: 'Handle Text',
            x: 20,
            y: 4,
            w: 240,
            h: 40,
            text: '@channelName',
            fontFamily: 'Rubik',
            fontSize: 32,
            isBold: true,
            uppercase: false,
            colorSlot: 'col-primary',
            color: '#162D43',
            opacity: 1,
            accentColor: '#219652',
            textEffect: 'none',
            effectColorSlot: '',
            effectColor: '#ffffff',
            effectOpacity: 0.8,
            align: 'left',
            autoCount: false
          }
        ]
      },
      {
        id: 'master-title',
        isMaster: true,
        type: 'compound',
        layerGroup: 'foreground',
        role: 'headline',
        name: 'Title',
        icon: 'H',
        text: 'TITLE TEXT',
        fontFamily: 'JetBrains Mono',
        fontSize: 72,
        isBold: true,
        uppercase: true,
        colorSlot: 'col-primary',
        color: '#162D43',
        opacity: 1,
        accentColor: '#219652',
        hasBg: false,
        bgColorSlot: '',
        bgColor: '#ffffff',
        bgOpacity: 1,
        borderWidth: 0,
        borderColorSlot: '',
        borderColor: '#000000',
        borderOpacity: 1,
        textEffect: 'none',
        effectColorSlot: '',
        effectColor: '#ffffff',
        effectOpacity: 0.8,
        anchor: 'c',
        x: 520,
        y: 70,
        w: 480,
        h: 84,
        rotation: 0,
        layers: [
          {
            id: 'layer-title-text',
            type: 'text',
            name: 'Title Text',
            x: 0,
            y: 0,
            w: 480,
            h: 84,
            text: 'TITLE TEXT',
            fontFamily: 'JetBrains Mono',
            fontSize: 72,
            isBold: true,
            uppercase: true,
            colorSlot: 'col-primary',
            color: '#162D43',
            opacity: 1,
            accentColor: '#219652',
            textEffect: 'none',
            effectColorSlot: '',
            effectColor: '#ffffff',
            effectOpacity: 0.8,
            align: 'center',
            autoCount: false
          }
        ]
      },
      {
        id: 'master-text',
        isMaster: true,
        type: 'compound',
        layerGroup: 'foreground',
        role: 'subtitle',
        name: 'Normal Text',
        icon: 'T',
        text: 'Clean descriptive text explaining the core message with an *accent phrase*.',
        fontFamily: 'Rubik',
        fontSize: 34,
        isBold: false,
        colorSlot: 'col-primary',
        color: '#162D43',
        opacity: 1,
        accentColor: '#219652',
        hasBg: false,
        bgColorSlot: '',
        bgColor: '#ffffff',
        bgOpacity: 1,
        borderWidth: 0,
        borderColorSlot: '',
        borderColor: '#000000',
        borderOpacity: 1,
        textEffect: 'none',
        effectColorSlot: '',
        effectColor: '#ffffff',
        effectOpacity: 0.8,
        anchor: 'nw',
        x: 1080,
        y: 70,
        w: 640,
        h: 84,
        rotation: 0,
        layers: [
          {
            id: 'layer-body-text',
            type: 'text',
            name: 'Normal Text',
            x: 0,
            y: 0,
            w: 640,
            h: 84,
            text: 'Clean descriptive text explaining the core message with an *accent phrase*.',
            fontFamily: 'Rubik',
            fontSize: 34,
            isBold: false,
            uppercase: false,
            colorSlot: 'col-primary',
            color: '#162D43',
            opacity: 1,
            accentColor: '#219652',
            textEffect: 'none',
            effectColorSlot: '',
            effectColor: '#ffffff',
            effectOpacity: 0.8,
            align: 'left',
            autoCount: false
          }
        ]
      },
      {
        id: 'master-counter',
        isMaster: true,
        type: 'compound',
        layerGroup: 'foreground',
        role: 'counter',
        name: 'Slide Counter',
        icon: '#',
        text: '-00-',
        autoCount: true,
        fontFamily: 'JetBrains Mono',
        fontSize: 32,
        isBold: true,
        colorSlot: 'col-primary',
        color: '#162D43',
        opacity: 1,
        accentColor: '#219652',
        hasBg: false,
        bgColorSlot: '',
        bgColor: '#ffffff',
        bgOpacity: 1,
        borderWidth: 0,
        borderColorSlot: '',
        borderColor: '#000000',
        borderOpacity: 1,
        textEffect: 'none',
        effectColorSlot: '',
        effectColor: '#ffffff',
        effectOpacity: 0.8,
        anchor: 'c',
        x: 1800,
        y: 85,
        w: 120,
        h: 48,
        rotation: 0,
        layers: [
          {
            id: 'layer-counter-text',
            type: 'text',
            name: 'Slide Counter',
            x: 0,
            y: 0,
            w: 120,
            h: 48,
            text: '-00-',
            autoCount: true,
            fontFamily: 'JetBrains Mono',
            fontSize: 32,
            isBold: true,
            uppercase: false,
            colorSlot: 'col-primary',
            color: '#162D43',
            opacity: 1,
            accentColor: '#219652',
            textEffect: 'none',
            effectColorSlot: '',
            effectColor: '#ffffff',
            effectOpacity: 0.8,
            align: 'center'
          }
        ]
      },
      {
        id: 'master-swipe',
        isMaster: true,
        type: 'compound',
        layerGroup: 'foreground',
        role: 'swipe',
        name: 'Swipe Indicator',
        icon: '→',
        text: 'Swipe →',
        fontFamily: 'Rubik',
        fontSize: 30,
        isBold: true,
        colorSlot: 'col-primary',
        color: '#162D43',
        opacity: 1,
        accentColor: '#219652',
        hasBg: false,
        bgColorSlot: '',
        bgColor: '#ffffff',
        bgOpacity: 1,
        borderWidth: 0,
        borderColorSlot: '',
        borderColor: '#000000',
        borderOpacity: 1,
        textEffect: 'none',
        effectColorSlot: '',
        effectColor: '#ffffff',
        effectOpacity: 0.8,
        anchor: 'c',
        x: 2000,
        y: 85,
        w: 140,
        h: 48,
        rotation: 0,
        layers: [
          {
            id: 'layer-swipe-text',
            type: 'text',
            name: 'Swipe Indicator',
            x: 0,
            y: 0,
            w: 140,
            h: 48,
            text: 'Swipe →',
            autoCount: false,
            fontFamily: 'Rubik',
            fontSize: 30,
            isBold: true,
            uppercase: false,
            colorSlot: 'col-primary',
            color: '#162D43',
            opacity: 1,
            accentColor: '#219652',
            textEffect: 'none',
            effectColorSlot: '',
            effectColor: '#ffffff',
            effectOpacity: 0.8,
            align: 'center'
          }
        ]
      }
    ];
  }

  // Preset Creator Dimensions
  const CREATOR_STAGING_H = 320;
  const CREATOR_STAGING_MARGIN = 36;
  const CREATOR_SLIDES_TOP = CREATOR_STAGING_H + CREATOR_STAGING_MARGIN; // 356
  const CREATOR_CANVAS_H = CREATOR_SLIDES_TOP + SLIDE_H; // 1706

  // Color and Styling Resolution Helpers
  function resolveColorWithAlpha(hex, alpha = 1) {
    if (!hex) hex = '#000000';
    const clean = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16);
      g = parseInt(clean[1] + clean[1], 16);
      b = parseInt(clean[2] + clean[2], 16);
    } else if (clean.length >= 6) {
      r = parseInt(clean.substring(0, 2), 16);
      g = parseInt(clean.substring(2, 4), 16);
      b = parseInt(clean.substring(4, 6), 16);
    }
    const a = Math.max(0, Math.min(1, Number(alpha)));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function resolveSlotColor(slotId, customHex, fallbackHex = '#162D43') {
    if (slotId) {
      const found = (creatorState.colors || []).find(c => c.id === slotId);
      if (found) return found.hex;
    }
    return customHex || fallbackHex;
  }

  function populateColorSlotDropdown(selectEl, selectedSlot) {
    if (!selectEl) return;
    selectEl.innerHTML = `
      <option value="">-- Custom Color --</option>
      ${(creatorState.colors || []).map(c => `
        <option value="${c.id}" ${selectedSlot === c.id ? 'selected' : ''}>${escapeHtml(c.name)} (${c.hex})</option>
      `).join('')}
    `;
  }

  function resolveTextEffectShadow(effectType, effectColor, effectAlpha) {
    if (effectType === 'emboss') {
      const col = resolveColorWithAlpha(effectColor || '#EBB26E', effectAlpha !== undefined ? effectAlpha : 0.88);
      return `1px 2px 0px ${col}, -1px -1px 1px rgba(0, 0, 0, 0.65)`;
    } else if (effectType === 'glow') {
      const col = resolveColorWithAlpha(effectColor || '#ffffff', effectAlpha !== undefined ? effectAlpha : 0.8);
      const colOuter = resolveColorWithAlpha(effectColor || '#ffffff', (effectAlpha !== undefined ? effectAlpha : 0.8) * 0.5);
      return `0 0 10px ${col}, 0 0 24px ${colOuter}`;
    }
    return 'none';
  }

  // Preset Creator State
  const creatorState = {
    active: false,
    presetId: 'custom-preset-1',
    name: 'My Custom Preset',
    archetype: 'games', // 'games' or 'magic'
    patternType: 'chevrons',
    titleFont: 'JetBrains Mono',
    bodyFont: 'Rubik',
    zoom: 0.28,
    selectedId: null,
    selectedGuideId: null,
    showSeamGaps: false,
    // Global Preset Colors: Background, Primary, Secondary by default
    colors: [
      { id: 'col-bg', name: 'Background', hex: '#F7F3EA' },
      { id: 'col-primary', name: 'Primary', hex: '#162D43' },
      { id: 'col-secondary', name: 'Secondary', hex: '#219652' }
    ],
    // Global Text Modifiers / Accents: syntax triggers on text
    modifiers: [
      { id: 'mod-1', symbol: '*', name: 'Accent Highlight', hex: '#219652' }
    ],
    // Custom uploaded fonts: Array of { name, url }
    customFonts: [],
    // Master Default Elements (Free-floating canvas elements placed above slides by default)
    masterElements: getDefaultMasterElements(),
    // Elements on the 3 slides
    elements: [],
    // Custom guidelines
    guidelines: [
      { id: 'g1', type: 'h', coord: 66, label: 'Top Margin' },
      { id: 'g2', type: 'h', coord: 675, label: 'Vertical Center', isFixedCenter: true },
      { id: 'g3', type: 'h', coord: 1286, label: 'Bottom Margin' },
      { id: 'g4', type: 'v', coord: 96, label: 'Left Margin' },
      { id: 'g5', type: 'v', coord: 540, label: 'Horizontal Center', isFixedCenter: true },
      { id: 'g6', type: 'v', coord: 984, label: 'Right Margin' }
    ]
  };

  state.creatorState = creatorState;

  // Preset Creator Undo/Redo & History Engine
  const creatorHistory = [];
  let creatorHistoryIndex = -1;
  const MAX_CREATOR_HISTORY = 40;

  function pushCreatorHistorySnapshot() {
    if (creatorHistoryIndex < creatorHistory.length - 1) {
      creatorHistory.splice(creatorHistoryIndex + 1);
    }
    const snap = JSON.stringify({
      elements: creatorState.elements,
      masterElements: creatorState.masterElements,
      guidelines: creatorState.guidelines,
      colors: creatorState.colors,
      modifiers: creatorState.modifiers,
      showSeamGaps: creatorState.showSeamGaps,
      selectedId: creatorState.selectedId,
      selectedGuideId: creatorState.selectedGuideId
    });
    creatorHistory.push(snap);
    if (creatorHistory.length > MAX_CREATOR_HISTORY) {
      creatorHistory.shift();
    } else {
      creatorHistoryIndex++;
    }
  }

  function undoCreator() {
    if (creatorHistoryIndex > 0) {
      creatorHistoryIndex--;
      applyCreatorHistorySnapshot(creatorHistory[creatorHistoryIndex]);
    }
  }

  function redoCreator() {
    if (creatorHistoryIndex < creatorHistory.length - 1) {
      creatorHistoryIndex++;
      applyCreatorHistorySnapshot(creatorHistory[creatorHistoryIndex]);
    }
  }

  function applyCreatorHistorySnapshot(snapStr) {
    try {
      const snap = JSON.parse(snapStr);
      creatorState.elements = snap.elements || [];
      creatorState.masterElements = snap.masterElements || [];
      creatorState.guidelines = snap.guidelines || [];
      if (snap.colors) creatorState.colors = snap.colors;
      if (snap.modifiers) creatorState.modifiers = snap.modifiers;
      if (snap.showSeamGaps !== undefined) creatorState.showSeamGaps = snap.showSeamGaps;
      creatorState.selectedId = snap.selectedId || null;
      creatorState.selectedGuideId = snap.selectedGuideId || null;
      renderPresetCreatorAll();
    } catch (e) {}
  }

  function deleteCreatorSelected() {
    if (creatorState.selectedGuideId) {
      const g = creatorState.guidelines.find(x => x.id === creatorState.selectedGuideId);
      if (g && (g.isFixedCenter || (g.type === 'h' && g.coord === 675) || (g.type === 'v' && g.coord === 540))) {
        return;
      }
      pushCreatorHistorySnapshot();
      creatorState.guidelines = creatorState.guidelines.filter(g => g.id !== creatorState.selectedGuideId);
      creatorState.selectedGuideId = null;
      renderPresetCreatorAll();
      return;
    }
    if (creatorState.selectedId) {
      pushCreatorHistorySnapshot();
      const elIdx = creatorState.elements.findIndex(x => x.id === creatorState.selectedId);
      if (elIdx >= 0) {
        creatorState.elements.splice(elIdx, 1);
        creatorState.selectedId = null;
        renderPresetCreatorAll();
        return;
      }
      const mIdx = creatorState.masterElements.findIndex(x => x.id === creatorState.selectedId);
      if (mIdx >= 0) {
        const m = creatorState.masterElements[mIdx];
        if (!['master-handle', 'master-title', 'master-text'].includes(m.id)) {
          creatorState.masterElements.splice(mIdx, 1);
          creatorState.selectedId = null;
          renderPresetCreatorAll();
        }
      }
    }
  }

  function nudgeCreatorSelected(key, step) {
    if (creatorState.selectedGuideId) {
      const g = creatorState.guidelines.find(x => x.id === creatorState.selectedGuideId);
      if (g && (g.isFixedCenter || (g.type === 'h' && g.coord === 675) || (g.type === 'v' && g.coord === 540))) {
        return;
      }
      if (g) {
        pushCreatorHistorySnapshot();
        if (key === 'ArrowUp' || key === 'ArrowLeft') g.coord = Math.max(0, g.coord - step);
        if (key === 'ArrowDown' || key === 'ArrowRight') g.coord += step;
        renderPresetCreatorAll();
      }
      return;
    }
    const el = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
               creatorState.elements.find(x => x.id === creatorState.selectedId);
    if (el) {
      pushCreatorHistorySnapshot();
      if (key === 'ArrowLeft') el.x -= step;
      else if (key === 'ArrowRight') el.x += step;
      else if (key === 'ArrowUp') el.y -= step;
      else if (key === 'ArrowDown') el.y += step;
      if (el.linkAcrossSlides) syncLinkedSlideElements(el);
      renderPresetCreatorAll();
    }
  }

  function duplicateCreatorSelected() {
    const el = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
               creatorState.elements.find(x => x.id === creatorState.selectedId);
    if (!el) return;
    pushCreatorHistorySnapshot();
    const copy = JSON.parse(JSON.stringify(el));
    copy.id = genId('c-el');
    if (el.isMaster) {
      copy.name = `${el.name} (Copy)`;
      copy.x += 40;
      copy.y += 40;
      creatorState.masterElements.push(copy);
    } else {
      copy.x += 40;
      copy.y += 40;
      creatorState.elements.push(copy);
    }
    creatorState.selectedId = copy.id;
    renderPresetCreatorAll();
  }

  // Option A: Automatically sync master element transformations & styles to existing slide instances
  function syncMasterElementToInstances(masterEl) {
    if (!masterEl || !masterEl.isMaster) return;
    normalizeMasterElement(masterEl);
    creatorState.elements.forEach(inst => {
      if (inst.masterId === masterEl.id) {
        const oldW = inst.w || 320;
        const oldH = inst.h || 60;
        inst.layers = JSON.parse(JSON.stringify(masterEl.layers || []));
        inst.extraLayers = JSON.parse(JSON.stringify(masterEl.layers || []));
        inst.name = masterEl.name;
        inst.fontFamily = masterEl.fontFamily;
        inst.fontSize = masterEl.fontSize;
        inst.isBold = masterEl.isBold;
        inst.uppercase = masterEl.uppercase;
        inst.colorSlot = masterEl.colorSlot;
        inst.color = masterEl.color;
        inst.opacity = masterEl.opacity !== undefined ? masterEl.opacity : 1;
        inst.accentColor = masterEl.accentColor;
        inst.hasBg = masterEl.hasBg;
        inst.bgColorSlot = masterEl.bgColorSlot;
        inst.bgColor = masterEl.bgColor;
        inst.bgOpacity = masterEl.bgOpacity !== undefined ? masterEl.bgOpacity : 1;
        inst.borderWidth = masterEl.borderWidth;
        inst.borderColorSlot = masterEl.borderColorSlot;
        inst.borderColor = masterEl.borderColor;
        inst.borderOpacity = masterEl.borderOpacity !== undefined ? masterEl.borderOpacity : 1;
        inst.textEffect = masterEl.textEffect;
        inst.effectColorSlot = masterEl.effectColorSlot;
        inst.effectColor = masterEl.effectColor;
        inst.effectOpacity = masterEl.effectOpacity !== undefined ? masterEl.effectOpacity : 0.8;
        inst.textX = 0;
        inst.textY = 0;
        inst.textW = masterEl.w;
        inst.textH = masterEl.h;
        inst.anchor = masterEl.anchor;
        inst.w = masterEl.w;
        inst.h = masterEl.h;
      }
    });
  }

  // Synchronize element across slides when 'link across slides' is checked
  // User requirement: "if link is active please do replace current values not add on top of them (to prevent previous singular adjustments breaking the link)"
  function syncLinkedSlideElements(sourceEl) {
    if (!sourceEl || !sourceEl.linkAcrossSlides) return;
    const groupId = sourceEl.linkGroupId || sourceEl.masterId || sourceEl.id;
    const currentSlide = Math.floor(sourceEl.x / SLIDE_W);
    const localX = sourceEl.x - currentSlide * SLIDE_W;

    creatorState.elements.forEach(other => {
      if (other.id !== sourceEl.id) {
        const otherGroup = other.linkGroupId || other.masterId || other.id;
        if (otherGroup === groupId || (other.role && other.role === sourceEl.role && other.addedToAllSlides)) {
          const otherSlide = Math.floor(other.x / SLIDE_W);
          other.x = otherSlide * SLIDE_W + localX;
          other.y = sourceEl.y;
          other.w = sourceEl.w;
          other.h = sourceEl.h;
          other.rotation = sourceEl.rotation || 0;
          other.opacity = sourceEl.opacity;
          other.fontSize = sourceEl.fontSize;
          other.linkAcrossSlides = true;
          other.linkGroupId = groupId;
        }
      }
    });
  }

  function initCreatorElements() {
    // Default preset starts with clean white slides, no texts whatsoever
    creatorState.elements = [];
  }

  function setAppWorkspaceMode(mode) {
    if (mode === 'creator') {
      creatorState.active = true;
      document.body.classList.add('mode-creator');
      if (dom.topbar) dom.topbar.classList.add('is-mode-creator');
      dom.btnSwitchStudio.classList.remove('active');
      dom.btnSwitchPresetCreator.classList.add('active');
      dom.workspaceStudio.classList.add('hidden');
      dom.workspacePresetCreator.classList.remove('hidden');
      renderPresetCreatorAll();
      setTimeout(fitCreatorZoom, 60);
    } else {
      creatorState.active = false;
      document.body.classList.remove('mode-creator');
      if (dom.topbar) dom.topbar.classList.remove('is-mode-creator');
      dom.btnSwitchStudio.classList.add('active');
      dom.btnSwitchPresetCreator.classList.remove('active');
      dom.workspaceStudio.classList.remove('hidden');
      dom.workspacePresetCreator.classList.add('hidden');
      renderAll();
      setTimeout(fitZoomToViewport, 60);
    }
  }

  function openPresetInCreator(presetId) {
    const p = THEMES[presetId];
    if (!p) return;
    creatorState.presetId = p.id;
    creatorState.name = p.name;
    creatorState.archetype = p.domain === 'magic' ? 'magic' : 'games';
    creatorState.patternType = p.patternType || 'chevrons';
    creatorState.titleFont = (p.headlineDefaults && p.headlineDefaults.fontFamily) || 'JetBrains Mono';
    creatorState.bodyFont = (p.subtitleDefaults && p.subtitleDefaults.fontFamily) || 'Rubik';

    // Build palette colors from theme if not already customized
    if (Array.isArray(p.paletteColors) && p.paletteColors.length > 0) {
      creatorState.colors = JSON.parse(JSON.stringify(p.paletteColors));
    } else {
      creatorState.colors = [
        { id: 'col-bg', name: 'Background', hex: p.innerBgColor || '#F7F3EA' },
        { id: 'col-primary', name: 'Primary Text', hex: p.textColor || '#162D43' },
        { id: 'col-secondary', name: 'Secondary / Accent', hex: p.accentColor || '#219652' },
        { id: 'col-frame', name: 'Outer Frame', hex: p.outerColor || '#219652' }
      ];
    }

    if (Array.isArray(p.modifiers) && p.modifiers.length > 0) {
      creatorState.modifiers = JSON.parse(JSON.stringify(p.modifiers));
    } else {
      creatorState.modifiers = [
        { id: 'mod-1', symbol: '*', name: 'Accent Highlight', hex: p.accentColor || '#219652' }
      ];
    }

    if (Array.isArray(p.customGuidelines) && p.customGuidelines.length > 0) {
      creatorState.guidelines = JSON.parse(JSON.stringify(p.customGuidelines));
    }

    // Update form controls
    if (dom.creatorPresetNameInput) dom.creatorPresetNameInput.value = creatorState.name;
    if (dom.creatorPresetArchetype) dom.creatorPresetArchetype.value = creatorState.archetype;
    if (dom.creatorPatternSelect) dom.creatorPatternSelect.value = creatorState.patternType;
    if (dom.creatorTitleFontSelect) dom.creatorTitleFontSelect.value = creatorState.titleFont;
    if (dom.creatorBodyFontSelect) dom.creatorBodyFontSelect.value = creatorState.bodyFont;

    // Load master elements if defined
    if (Array.isArray(p.customElements) && p.customElements.length > 0) {
      creatorState.masterElements = JSON.parse(JSON.stringify(p.customElements));
    } else {
      // Configure default master channel handle with preset's frameHandle
      const handleEl = creatorState.masterElements.find(x => x.id === 'master-handle');
      if (handleEl && p.frameHandle) {
        handleEl.text = `| ${p.frameHandle}`;
      }
    }

    initCreatorElements();
    setAppWorkspaceMode('creator');
  }

  function createNewPreset() {
    const newId = 'custom-' + Date.now();
    creatorState.presetId = newId;
    creatorState.name = 'New Preset ' + (Object.keys(THEMES).filter(k => THEMES[k].isCustom).length + 1);
    creatorState.archetype = 'games';
    creatorState.patternType = 'clean';
    creatorState.titleFont = 'JetBrains Mono';
    creatorState.bodyFont = 'Rubik';
    creatorState.colors = [
      { id: 'col-bg', name: 'Background', hex: '#ffffff' },
      { id: 'col-primary', name: 'Primary Text', hex: '#111111' },
      { id: 'col-secondary', name: 'Secondary / Accent', hex: '#666666' },
      { id: 'col-frame', name: 'Outer Frame', hex: '#ffffff' }
    ];
    creatorState.modifiers = [
      { id: 'mod-1', symbol: '*', name: 'Accent Highlight', hex: '#666666' }
    ];

    if (dom.creatorPresetNameInput) dom.creatorPresetNameInput.value = creatorState.name;
    if (dom.creatorPresetArchetype) dom.creatorPresetArchetype.value = creatorState.archetype;
    if (dom.creatorPatternSelect) dom.creatorPatternSelect.value = creatorState.patternType;

    // Default preset is purely white with NO texts on slides whatsoever, just Master Elements at the top
    creatorState.elements = [];
    creatorState.selectedId = null;
    creatorState.selectedGuideId = null;
    setAppWorkspaceMode('creator');
  }

  function saveCurrentCreatorPreset() {
    const id = creatorState.presetId || ('custom-' + Date.now());
    const isMagic = creatorState.archetype === 'magic';

    const primaryCol = creatorState.colors.find(c => c.id === 'col-primary')?.hex || '#162D43';
    const secondaryCol = creatorState.colors.find(c => c.id === 'col-secondary')?.hex || '#219652';
    const bgCol = creatorState.colors.find(c => c.id === 'col-bg')?.hex || '#F7F3EA';
    const frameCol = creatorState.colors.find(c => c.id === 'col-frame')?.hex || secondaryCol;

    const handleEl = creatorState.masterElements.find(x => x.role === 'handle');
    const detectedHandle = handleEl ? handleEl.text.replace(/^\|\s*/, '') : '@mychannel';

    const presetObj = {
      id: id,
      isCustom: true,
      name: creatorState.name || 'Custom Preset',
      domain: isMagic ? 'magic' : 'gameDev',
      igHandle: detectedHandle.replace(/^@/, ''),
      igSub: isMagic ? 'Editorial & Visual Theory' : 'Game Design Analysis & Systems',
      frameHandle: detectedHandle,
      outerColor: frameCol,
      innerBgColor: bgCol,
      textColor: primaryCol,
      accentColor: secondaryCol,
      patternType: creatorState.patternType,
      paletteColors: JSON.parse(JSON.stringify(creatorState.colors)),
      modifiers: JSON.parse(JSON.stringify(creatorState.modifiers || [])),
      customGuidelines: JSON.parse(JSON.stringify(creatorState.guidelines)),
      customElements: JSON.parse(JSON.stringify(creatorState.masterElements)),
      headlineDefaults: {
        fontFamily: creatorState.titleFont,
        fontSize: 130,
        isBold: true,
        color: primaryCol,
        accentColor: secondaryCol,
        uppercase: true,
        align: 'center'
      },
      subtitleDefaults: {
        fontFamily: creatorState.bodyFont,
        fontSize: 44,
        isBold: true,
        color: primaryCol,
        accentColor: secondaryCol,
        align: 'left'
      },
      description: `Custom ${creatorState.name} preset.`
    };

    THEMES[id] = presetObj;
    saveCustomPresetsToStorage();
    state.themeId = id;
    dom.themeSelect.value = id;
    populatePresetElementsDrawer(presetObj);
    alert(`Preset "${presetObj.name}" saved successfully!`);
    setAppWorkspaceMode('studio');
  }

  function exportCreatorPresetJson() {
    const p = {
      presetId: creatorState.presetId,
      name: creatorState.name,
      archetype: creatorState.archetype,
      patternType: creatorState.patternType,
      titleFont: creatorState.titleFont,
      bodyFont: creatorState.bodyFont,
      colors: creatorState.colors,
      modifiers: creatorState.modifiers,
      masterElements: creatorState.masterElements,
      guidelines: creatorState.guidelines,
      elements: creatorState.elements
    };
    const payload = JSON.stringify(p, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `preset_${(creatorState.name || 'custom').toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
  }

  function importCreatorPresetJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (d.name) creatorState.name = d.name;
        if (d.archetype) creatorState.archetype = d.archetype;
        if (d.patternType) creatorState.patternType = d.patternType;
        if (d.titleFont) creatorState.titleFont = d.titleFont;
        if (d.bodyFont) creatorState.bodyFont = d.bodyFont;
        if (Array.isArray(d.colors)) creatorState.colors = d.colors;
        if (Array.isArray(d.modifiers)) creatorState.modifiers = d.modifiers;
        if (Array.isArray(d.masterElements)) creatorState.masterElements = d.masterElements;
        if (Array.isArray(d.guidelines)) creatorState.guidelines = d.guidelines;
        if (Array.isArray(d.elements)) creatorState.elements = d.elements;

        // Sync inputs
        if (dom.creatorPresetNameInput) dom.creatorPresetNameInput.value = creatorState.name;
        if (dom.creatorPresetArchetype) dom.creatorPresetArchetype.value = creatorState.archetype;
        if (dom.creatorPatternSelect) dom.creatorPatternSelect.value = creatorState.patternType;
        if (dom.creatorTitleFontSelect) dom.creatorTitleFontSelect.value = creatorState.titleFont;
        if (dom.creatorBodyFontSelect) dom.creatorBodyFontSelect.value = creatorState.bodyFont;

        renderPresetCreatorAll();
        alert('Preset uploaded successfully!');
      } catch (e) {
        alert('Invalid preset JSON file.');
      }
    };
    reader.readAsText(file);
  }

  // Format rich text helper supporting custom syntax triggers from creatorState.modifiers
  function formatCreatorRichTextHtml(text, slideIndex = null, autoCount = false) {
    let out = text || '';

    // If autoCount is true or text includes -00-, substitute with slide count
    // User requirement: "numbers to be counted per slide (e.g. -00- turns a number into count, starting on the first default slide (slide 2))"
    if (slideIndex !== null && (autoCount || out.includes('-00-'))) {
      if (slideIndex === 0) {
        // Slide 1 (Hook / Cover)
        out = out.replace(/-00-/g, '00');
      } else {
        // Slide 2 is count 01, Slide 3 is count 02, etc.
        const countStr = String(slideIndex).padStart(2, '0');
        out = out.replace(/-00-/g, countStr);
      }
    }

    out = escapeHtml(out);

    // Apply global text modifiers / accents
    (creatorState.modifiers || []).forEach(m => {
      const sym = (m.symbol || '').trim();
      if (!sym) return;
      const escapedSym = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(`${escapedSym}([^${escapedSym}]+)${escapedSym}`, 'g');
      out = out.replace(reg, (_, word) => {
        return `<span style="color:${m.hex};display:inline;">${word}</span>`;
      });
    });

    // Fallback: standard asterisk accent if no modifiers matched and * is present
    if (!(creatorState.modifiers || []).some(m => m.symbol === '*')) {
      const secondaryCol = creatorState.colors.find(c => c.id === 'col-secondary')?.hex || '#219652';
      out = out.replace(/\*([^*]+)\*/g, (_, word) => {
        return `<span style="color:${secondaryCol};display:inline;">${word}</span>`;
      });
    }

    if (out.startsWith('| ')) {
      const secondaryCol = creatorState.colors.find(c => c.id === 'col-secondary')?.hex || '#219652';
      out = `<span style="color:${secondaryCol};font-weight:700;">|</span> ` + out.slice(2);
    }
    return out;
  }

  // Render Preset Creator 3-slide board and free-floating canvas elements
  function renderPresetCreatorAll() {
    renderCreatorColorsList();
    renderCreatorModifiersList();
    renderCreatorSlides();
    renderCreatorGuidelines();
    renderCreatorInspector();
  }

  function renderCreatorColorsList() {
    if (!dom.creatorColorsList) return;
    dom.creatorColorsList.innerHTML = creatorState.colors.map(col => {
      const isDefaultCol = ['col-bg', 'col-primary', 'col-secondary'].includes(col.id);
      return `
        <div class="creator-color-item" data-col-id="${col.id}">
          <div class="creator-color-item-row">
            <input type="color" class="creator-color-swatch-box" data-col-id="${col.id}" value="${normalizeHex(col.hex)}" />
            <input type="text" class="creator-color-name-input" data-col-id="${col.id}" value="${escapeHtml(col.name)}" />
            <span class="creator-color-hex-val">${col.hex}</span>
            ${!isDefaultCol ? `
              <button class="btn-guide-action btn-delete-color" data-col-id="${col.id}" title="Delete Color">✕</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Bind color palette inputs
    dom.creatorColorsList.querySelectorAll('input[type="color"]').forEach(inp => {
      inp.oninput = (e) => {
        const id = inp.getAttribute('data-col-id');
        const c = creatorState.colors.find(x => x.id === id);
        if (c) {
          c.hex = e.target.value;
          const hexSpan = inp.closest('.creator-color-item')?.querySelector('.creator-color-hex-val');
          if (hexSpan) hexSpan.textContent = c.hex;
          renderCreatorSlides();
        }
      };
      inp.onchange = () => {
        pushCreatorHistorySnapshot();
        renderPresetCreatorAll();
      };
    });

    dom.creatorColorsList.querySelectorAll('.creator-color-name-input').forEach(inp => {
      inp.oninput = (e) => {
        const id = inp.getAttribute('data-col-id');
        const c = creatorState.colors.find(x => x.id === id);
        if (c) {
          c.name = e.target.value;
          renderCreatorInspector();
        }
      };
    });

    dom.creatorColorsList.querySelectorAll('.btn-delete-color').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-col-id');
        pushCreatorHistorySnapshot();
        creatorState.colors = creatorState.colors.filter(x => x.id !== id);
        renderPresetCreatorAll();
      };
    });
  }

  function renderCreatorModifiersList() {
    if (!dom.creatorModifiersList) return;
    if (!creatorState.modifiers || creatorState.modifiers.length === 0) {
      dom.creatorModifiersList.innerHTML = `<span style="font-size:11px;color:var(--text-secondary);font-style:italic;">No text modifiers defined</span>`;
      return;
    }

    dom.creatorModifiersList.innerHTML = creatorState.modifiers.map(mod => {
      return `
        <div class="creator-color-item" data-mod-id="${mod.id}">
          <div class="creator-color-item-row">
            <input type="text" class="creator-mod-symbol-input" data-mod-id="${mod.id}" value="${escapeHtml(mod.symbol || '*')}" style="width:28px;text-align:center;font-weight:700;font-family:monospace;" title="Modifier trigger symbol (e.g. *, _, ~)" />
            <input type="color" class="creator-color-swatch-box" data-mod-id="${mod.id}" value="${normalizeHex(mod.hex)}" />
            <input type="text" class="creator-color-name-input" data-mod-id="${mod.id}" value="${escapeHtml(mod.name)}" />
            <button class="btn-guide-action btn-delete-modifier" data-mod-id="${mod.id}" title="Delete Modifier">✕</button>
          </div>
        </div>
      `;
    }).join('');

    dom.creatorModifiersList.querySelectorAll('input[type="color"]').forEach(inp => {
      inp.oninput = (e) => {
        const id = inp.getAttribute('data-mod-id');
        const m = (creatorState.modifiers || []).find(x => x.id === id);
        if (m) {
          m.hex = e.target.value;
          renderCreatorSlides();
        }
      };
      inp.onchange = () => {
        pushCreatorHistorySnapshot();
        renderCreatorSlides();
      };
    });

    dom.creatorModifiersList.querySelectorAll('.creator-mod-symbol-input').forEach(inp => {
      inp.oninput = (e) => {
        const id = inp.getAttribute('data-mod-id');
        const m = (creatorState.modifiers || []).find(x => x.id === id);
        if (m) {
          m.symbol = e.target.value;
          renderCreatorSlides();
        }
      };
    });

    dom.creatorModifiersList.querySelectorAll('.creator-color-name-input').forEach(inp => {
      inp.oninput = (e) => {
        const id = inp.getAttribute('data-mod-id');
        const m = (creatorState.modifiers || []).find(x => x.id === id);
        if (m) m.name = e.target.value;
      };
    });

    dom.creatorModifiersList.querySelectorAll('.btn-delete-modifier').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-mod-id');
        pushCreatorHistorySnapshot();
        creatorState.modifiers = (creatorState.modifiers || []).filter(x => x.id !== id);
        renderCreatorModifiersList();
        renderCreatorSlides();
      };
    });
  }

  function renderCreatorSlides() {
    if (!dom.creatorSlidesContainer) return;
    const numSlides = 3;
    const gapPx = creatorState.showSeamGaps ? 28 : 0;
    let slidesHtml = '';

    dom.creatorSlidesContainer.classList.toggle('show-gaps', Boolean(creatorState.showSeamGaps));

    const frameCol = creatorState.colors.find(c => c.id === 'col-frame')?.hex ||
                     creatorState.colors.find(c => c.id === 'col-secondary')?.hex || '#ffffff';
    const bgCol = creatorState.colors.find(c => c.id === 'col-bg')?.hex || '#ffffff';

    for (let s = 0; s < numSlides; s++) {
      const slideType = s === 0 ? 'Slide 1 (Hook / Cover)' : (s === 1 ? 'Slide 2 (Default Content)' : 'Slide 3 (End CTA)');
      const marginRight = (s < numSlides - 1) ? gapPx : 0;

      slidesHtml += `
        <div class="carousel-slide creator-slide" data-slide-index="${s}" style="width:${SLIDE_W}px;height:${SLIDE_H}px;position:relative;background:${frameCol};margin-right:${marginRight}px;flex-shrink:0;">
          <div style="position:absolute;top:-30px;left:0;font-size:12px;font-weight:700;color:var(--text-secondary);letter-spacing:0.04em;">
            ${slideType}
          </div>
          <div style="position:absolute;top:66px;left:96px;width:${SLIDE_W - 192}px;height:${SLIDE_H - 132}px;background:${bgCol};border:2px solid rgba(0,0,0,0.12);border-radius:12px;"></div>
        </div>
      `;
    }

    dom.creatorSlidesContainer.innerHTML = slidesHtml;

    // Render interactive elements layer (BOTH Master Elements and Slide Instances)
    if (dom.creatorInteractionLayer) {
      let elementsHtml = '';
      const selectedEl = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
                         creatorState.elements.find(x => x.id === creatorState.selectedId);

      // 1. Render Free-floating Master Elements
      creatorState.masterElements.forEach(m => {
        const isSel = creatorState.selectedId === m.id;
        elementsHtml += renderCreatorSceneElementHTML(m, isSel);
      });

      // 2. Render Slide Instances
      creatorState.elements.forEach(el => {
        const isSel = creatorState.selectedId === el.id;
        elementsHtml += renderCreatorSceneElementHTML(el, isSel);
      });

      // 3. Render Active Selection Box with all 8 resize handles + rotation handle
      if (selectedEl) {
        const isStaging = selectedEl.isMaster || selectedEl.y < CREATOR_SLIDES_TOP;
        const slideIdx = isStaging ? 0 : Math.max(0, Math.min(2, Math.floor(selectedEl.x / SLIDE_W)));
        const visualSelX = isStaging ? selectedEl.x : (selectedEl.x + slideIdx * gapPx);

        elementsHtml += `
          <div id="creatorActiveSelectionBox" class="selection-box creator-selection-box" style="
            position:absolute;
            left:${visualSelX}px;
            top:${selectedEl.y}px;
            width:${selectedEl.w}px;
            height:${selectedEl.h}px;
            transform: rotate(${selectedEl.rotation || 0}deg);
            pointer-events:auto;
            z-index:120;
          ">
            ${selectedEl.isMaster ? `
              <span class="creator-master-badge-tag">${escapeHtml(selectedEl.name)}</span>
              <button class="creator-master-plus-btn btn-spawn-instance" data-master-id="${selectedEl.id}" title="Add instance to slide">+</button>
            ` : ''}
            <div class="selection-handle handle-rot" data-creator-handle="rot" title="Rotate element"></div>
            <div class="selection-handle handle-nw"  data-creator-handle="nw"></div>
            <div class="selection-handle handle-n"   data-creator-handle="n"></div>
            <div class="selection-handle handle-ne"  data-creator-handle="ne"></div>
            <div class="selection-handle handle-e"   data-creator-handle="e"></div>
            <div class="selection-handle handle-se"  data-creator-handle="se"></div>
            <div class="selection-handle handle-s"   data-creator-handle="s"></div>
            <div class="selection-handle handle-sw"  data-creator-handle="sw"></div>
            <div class="selection-handle handle-w"   data-creator-handle="w"></div>
          </div>
        `;
      }

      dom.creatorInteractionLayer.innerHTML = elementsHtml;
      bindCreatorElementsInteractions();
    }
  }

  function renderCreatorSceneElementHTML(el, isSel) {
    normalizeMasterElement(el);
    const gapPx = creatorState.showSeamGaps ? 28 : 0;
    const isStaging = el.isMaster || el.y < CREATOR_SLIDES_TOP;
    const slideIdx = isStaging ? null : Math.max(0, Math.min(2, Math.floor(el.x / SLIDE_W)));
    const visualX = isStaging ? el.x : (el.x + (slideIdx || 0) * gapPx);
    const rot = el.rotation || 0;

    // Border / Outline styling
    const borderW = Number(el.borderWidth) || 0;
    const borderStyle = borderW > 0
      ? `${borderW}px solid ${resolveColorWithAlpha(resolveSlotColor(el.borderColorSlot, el.borderColor || '#000000'), el.borderOpacity !== undefined ? el.borderOpacity : 1)}`
      : 'none';

    // Render all layers in el.layers cleanly with 0 offsets
    const innerContentHtml = (el.layers || []).map(layer => {
      if (layer.type === 'shape') {
        const shapeBg = resolveColorWithAlpha(resolveSlotColor(layer.colorSlot, layer.color || layer.bg || '#219652'), layer.opacity !== undefined ? layer.opacity : 1);
        const shapeBorderW = Number(layer.borderWidth) || 0;
        const shapeBorder = shapeBorderW > 0
          ? `${shapeBorderW}px solid ${resolveColorWithAlpha(resolveSlotColor(layer.borderColorSlot, layer.borderColor || '#000000'), layer.borderOpacity !== undefined ? layer.borderOpacity : 1)}`
          : 'none';
        let rad = `${layer.radius || 0}px`;
        if (layer.shapeType === 'circle') rad = '50%';
        else if (layer.shapeType === 'pill') rad = '9999px';

        return `<div style="position:absolute;left:${layer.x || 0}px;top:${layer.y || 0}px;width:${layer.w || 120}px;height:${layer.h || 36}px;max-width:${el.w}px;max-height:${el.h}px;background:${shapeBg};border:${shapeBorder};border-radius:${rad};pointer-events:none;z-index:2;box-sizing:border-box;"></div>`;
      } else if (layer.type === 'image' && layer.src) {
        return `<img src="${layer.src}" style="position:absolute;left:${layer.x || 0}px;top:${layer.y || 0}px;width:${layer.w || 100}px;height:${layer.h || 100}px;max-width:${el.w}px;max-height:${el.h}px;object-fit:contain;opacity:${layer.opacity !== undefined ? layer.opacity : 1};pointer-events:none;z-index:2;" />`;
      } else if (layer.type === 'text') {
        const lFont = `'${layer.fontFamily || 'Rubik'}', sans-serif`;
        const lColor = resolveColorWithAlpha(resolveSlotColor(layer.colorSlot, layer.color || '#162D43'), layer.opacity !== undefined ? layer.opacity : 1);
        const lShadow = resolveTextEffectShadow(layer.textEffect || 'none', resolveSlotColor(layer.effectColorSlot, layer.effectColor || '#ffffff'), layer.effectOpacity !== undefined ? layer.effectOpacity : 0.8);
        const textAlign = layer.align || 'left';
        let justify = 'flex-start';
        if (textAlign === 'center') justify = 'center';
        else if (textAlign === 'right') justify = 'flex-end';

        return `<div style="position:absolute;left:${layer.x || 0}px;top:${layer.y || 0}px;width:${layer.w || 200}px;height:${layer.h || 40}px;max-width:${el.w}px;max-height:${el.h}px;overflow:hidden;font-family:${lFont};font-size:${layer.fontSize || 32}px;font-weight:${layer.isBold ? '700' : '400'};color:${lColor};opacity:${layer.opacity !== undefined ? layer.opacity : 1};text-shadow:${lShadow};text-transform:${layer.uppercase ? 'uppercase' : 'none'};text-align:${textAlign};line-height:1.15;pointer-events:none;z-index:4;display:flex;align-items:center;justify-content:${justify};box-sizing:border-box;"><div style="width:100%;white-space:pre-wrap;word-break:break-word;">${formatCreatorRichTextHtml(layer.text || '', (slideIdx !== null ? slideIdx + 1 : 1), layer.autoCount)}</div></div>`;
      }
      return '';
    }).join('');

    return `
      <div class="scene-element creator-scene-element ${el.isMaster ? 'is-master-element' : ''} ${isSel ? 'selected' : ''}"
        data-creator-el-id="${el.id}"
        data-is-master="${Boolean(el.isMaster)}"
        style="
          position:absolute;
          left:${visualX}px;
          top:${el.y}px;
          width:${el.w}px;
          height:${el.h}px;
          border:${borderStyle};
          box-sizing:border-box;
          transform: rotate(${rot}deg);
          pointer-events:auto;
          cursor:grab;
          user-select:none;
          z-index:${isSel ? 60 : (el.isMaster ? 35 : 20)};
        "
        title="${el.isMaster ? `Master Element: ${el.name} (Double-click to edit)` : `Slide Instance: ${el.name}`}"
      >
        ${el.isMaster && !isSel ? `
          <span class="creator-master-badge-tag" style="opacity:0.75;">${escapeHtml(el.name)}</span>
          <button class="creator-master-plus-btn btn-spawn-instance" data-master-id="${el.id}" title="Add instance to slide">+</button>
        ` : ''}

        ${el.hasBg ? `
          <div style="position:absolute;inset:0;background:${resolveColorWithAlpha(resolveSlotColor(el.bgColorSlot, el.bgColor || '#ffffff'), el.bgOpacity !== undefined ? el.bgOpacity : 1)};border-radius:6px;pointer-events:none;z-index:1;"></div>
        ` : ''}

        ${innerContentHtml}
      </div>
    `;
  }

  // Preset Creator Dynamic Guideline Docking & Snapping Engine
  function computeCreatorSnapping(activeEl, rawX, rawY) {
    const snapDist = 12; // Snap threshold in px
    let snappedX = rawX;
    let snappedY = rawY;
    const w = activeEl.w || 320;
    const h = activeEl.h || 60;
    const snapLines = [];
    const gapPx = creatorState.showSeamGaps ? 28 : 0;
    const totalW = 3 * SLIDE_W + 2 * gapPx;

    // 1. Dock to Guidelines (Margins & Centers across slides)
    // Canvas coordinate space: Staging zone = y:0..CREATOR_STAGING_H, Slides = y:CREATOR_SLIDES_TOP..CREATOR_CANVAS_H
    (creatorState.guidelines || []).forEach(g => {
      if (g.type === 'h') {
        const guideY = CREATOR_SLIDES_TOP + g.coord;

        // Top edge
        if (Math.abs(rawY - guideY) <= snapDist) {
          snappedY = guideY;
          snapLines.push({ type: 'h', coord: guideY, start: 0, end: totalW, isCenter: g.isFixedCenter });
        }
        // Center
        else if (Math.abs((rawY + h / 2) - guideY) <= snapDist) {
          snappedY = guideY - h / 2;
          snapLines.push({ type: 'h', coord: guideY, start: 0, end: totalW, isCenter: g.isFixedCenter });
        }
        // Bottom edge
        else if (Math.abs((rawY + h) - guideY) <= snapDist) {
          snappedY = guideY - h;
          snapLines.push({ type: 'h', coord: guideY, start: 0, end: totalW, isCenter: g.isFixedCenter });
        }
      } else if (g.type === 'v') {
        for (let s = 0; s < 3; s++) {
          const guideX = s * (SLIDE_W + gapPx) + g.coord;

          // Left edge
          if (Math.abs(rawX - guideX) <= snapDist) {
            snappedX = guideX;
            snapLines.push({ type: 'v', coord: guideX, start: CREATOR_SLIDES_TOP, end: CREATOR_CANVAS_H, isCenter: g.isFixedCenter });
            break;
          }
          // Center
          else if (Math.abs((rawX + w / 2) - guideX) <= snapDist) {
            snappedX = guideX - w / 2;
            snapLines.push({ type: 'v', coord: guideX, start: CREATOR_SLIDES_TOP, end: CREATOR_CANVAS_H, isCenter: g.isFixedCenter });
            break;
          }
          // Right edge
          else if (Math.abs((rawX + w) - guideX) <= snapDist) {
            snappedX = guideX - w;
            snapLines.push({ type: 'v', coord: guideX, start: CREATOR_SLIDES_TOP, end: CREATOR_CANVAS_H, isCenter: g.isFixedCenter });
            break;
          }
        }
      }
    });

    // 2. Dock to Staging Area Vertical Center (if moving inside staging area y: 0..CREATOR_STAGING_H)
    if (rawY < CREATOR_STAGING_H) {
      const stagingCenterY = 160;
      if (Math.abs((rawY + h / 2) - stagingCenterY) <= snapDist) {
        snappedY = stagingCenterY - h / 2;
        snapLines.push({ type: 'h', coord: stagingCenterY, start: 0, end: totalW, isCenter: true });
      }
    }

    // 3. Dock to other elements (both master elements and slide instances)
    const allEls = [...creatorState.masterElements, ...creatorState.elements];
    const otherEls = allEls.filter(o => o.id !== activeEl.id);

    for (const other of otherEls) {
      const oLeft = other.x;
      const oCenterX = other.x + (other.w || 320) / 2;
      const oRight = other.x + (other.w || 320);

      const oTop = other.y;
      const oCenterY = other.y + (other.h || 60) / 2;
      const oBottom = other.y + (other.h || 60);

      if (Math.abs(oLeft - rawX) > SLIDE_W * 1.5 && Math.abs(oTop - rawY) > 800) continue;

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

    return {
      snappedX: Math.round(snappedX),
      snappedY: Math.round(snappedY),
      snapLines
    };
  }

  function computeCreatorResizeSnapping(targetEl, handle, rawX, rawY, rawW, rawH) {
    const snapDist = 12;
    let newX = rawX;
    let newY = rawY;
    let newW = rawW;
    let newH = rawH;
    const snapLines = [];
    const gapPx = creatorState.showSeamGaps ? 28 : 0;
    const totalW = 3 * SLIDE_W + 2 * gapPx;

    (creatorState.guidelines || []).forEach(g => {
      if (g.type === 'v') {
        for (let s = 0; s < 3; s++) {
          const guideX = s * (SLIDE_W + gapPx) + g.coord;
          if (handle.includes('e')) {
            if (Math.abs((newX + newW) - guideX) <= snapDist) {
              newW = Math.max(40, guideX - newX);
              snapLines.push({ type: 'v', coord: guideX, start: CREATOR_SLIDES_TOP, end: CREATOR_CANVAS_H, isCenter: g.isFixedCenter });
            }
          }
          if (handle.includes('w')) {
            if (Math.abs(newX - guideX) <= snapDist) {
              const rightEdge = targetEl.x + (targetEl.w || 320);
              newX = guideX;
              newW = Math.max(40, rightEdge - guideX);
              snapLines.push({ type: 'v', coord: guideX, start: CREATOR_SLIDES_TOP, end: CREATOR_CANVAS_H, isCenter: g.isFixedCenter });
            }
          }
        }
      } else if (g.type === 'h') {
        const guideY = CREATOR_SLIDES_TOP + g.coord;
        if (handle.includes('s')) {
          if (Math.abs((newY + newH) - guideY) <= snapDist) {
            newH = Math.max(20, guideY - newY);
            snapLines.push({ type: 'h', coord: guideY, start: 0, end: totalW, isCenter: g.isFixedCenter });
          }
        }
        if (handle.includes('n')) {
          if (Math.abs(newY - guideY) <= snapDist) {
            const bottomEdge = targetEl.y + (targetEl.h || 60);
            newY = guideY;
            newH = Math.max(20, bottomEdge - guideY);
            snapLines.push({ type: 'h', coord: guideY, start: 0, end: totalW, isCenter: g.isFixedCenter });
          }
        }
      }
    });

    return { newX, newY, newW, newH, snapLines };
  }

  function renderCreatorSnapGuidesOverlay(snapLines) {
    if (!dom.creatorSnapGuidesLayer) return;
    if (!snapLines || snapLines.length === 0) {
      dom.creatorSnapGuidesLayer.innerHTML = '';
      return;
    }
    let html = '';
    snapLines.forEach(line => {
      const cls = line.isCenter ? 'smart-guide-line-center-snap' : '';
      if (line.type === 'v') {
        html += `<div class="smart-guide-line-v ${cls}" style="left:${line.coord}px;top:${line.start}px;height:${line.end - line.start}px;"></div>`;
      } else {
        html += `<div class="smart-guide-line-h ${cls}" style="top:${line.coord}px;left:${line.start}px;width:${line.end - line.start}px;"></div>`;
      }
    });
    dom.creatorSnapGuidesLayer.innerHTML = html;
  }

  function clearCreatorSnapGuidesOverlay() {
    if (dom.creatorSnapGuidesLayer) {
      dom.creatorSnapGuidesLayer.innerHTML = '';
    }
  }

  function bindCreatorElementsInteractions() {
    if (!dom.creatorInteractionLayer) return;

    // Double-click rapid click tracker for rock-solid edit mode entry
    let lastCreatorClickTime = 0;
    let lastCreatorClickId = null;

    // Helper: start drag/transform session
    const startDragSession = (e, targetEl, handle) => {
      if (handle) {
        e.preventDefault();
      }
      e.stopPropagation();

      let hasMoved = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = targetEl.x;
      const origY = targetEl.y;
      const origW = targetEl.w || 320;
      const origH = targetEl.h || 60;
      const origFontSize = targetEl.fontSize || 32;
      const origTextX = targetEl.textX !== undefined ? targetEl.textX : 0;
      const origTextY = targetEl.textY !== undefined ? targetEl.textY : 0;
      const origTextW = targetEl.textW !== undefined ? targetEl.textW : origW;
      const origTextH = targetEl.textH !== undefined ? targetEl.textH : origH;
      const origExtraLayers = JSON.parse(JSON.stringify(targetEl.extraLayers || []));
      const origLayers = Array.isArray(targetEl.layers) ? JSON.parse(JSON.stringify(targetEl.layers)) : null;
      const origRight = origX + origW;
      const origBottom = origY + origH;
      const origRot = targetEl.rotation || 0;
      const currentZoom = creatorState.zoom || 0.28;

      // Element center for rotation
      const rect = dom.creatorInteractionLayer.getBoundingClientRect();
      const elCenterX = rect.left + (origX + origW / 2) * currentZoom;
      const elCenterY = rect.top + (origY + origH / 2) * currentZoom;
      const startAngle = Math.atan2(e.clientY - elCenterY, e.clientX - elCenterX) * (180 / Math.PI);

      const onMouseMove = (moveEvt) => {
        const dist = Math.hypot(moveEvt.clientX - startX, moveEvt.clientY - startY);
        if (!hasMoved && dist > 3) {
          hasMoved = true;
          pushCreatorHistorySnapshot();
        }
        if (!hasMoved) return;

        moveEvt.preventDefault();

        const dx = (moveEvt.clientX - startX) / currentZoom;
        const dy = (moveEvt.clientY - startY) / currentZoom;

        if (handle === 'rot') {
          const currentAngle = Math.atan2(moveEvt.clientY - elCenterY, moveEvt.clientX - elCenterX) * (180 / Math.PI);
          targetEl.rotation = Math.round(origRot + (currentAngle - startAngle));
          clearCreatorSnapGuidesOverlay();
        } else if (handle) {
          const isSide = handle === 'e' || handle === 'w' || handle === 's' || handle === 'n';
          let newX = origX;
          let newY = origY;
          let newW = origW;
          let newH = origH;

          if (isSide) {
            // Dragging an individual side handle ONLY moves that edge/point!
            if (handle === 'e') {
              newW = Math.max(40, Math.round(origW + dx));
              newH = origH;
              newX = origX;
              newY = origY;
            } else if (handle === 'w') {
              newW = Math.max(40, Math.round(origW - dx));
              newH = origH;
              newX = origRight - newW;
              newY = origY;
            } else if (handle === 's') {
              newW = origW;
              newH = Math.max(20, Math.round(origH + dy));
              newX = origX;
              newY = origY;
            } else if (handle === 'n') {
              newW = origW;
              newH = Math.max(20, Math.round(origH - dy));
              newX = origX;
              newY = origBottom - newH;
            }
          } else {
            // Corner handles ('se', 'nw', 'ne', 'sw'): opposite corner is strictly pinned!
            const rawW = handle.includes('w') ? Math.max(40, Math.round(origW - dx)) : Math.max(40, Math.round(origW + dx));
            const rawH = handle.includes('n') ? Math.max(20, Math.round(origH - dy)) : Math.max(20, Math.round(origH + dy));
            const scale = Math.max(0.1, Math.max(rawW / origW, rawH / origH));
            newW = Math.max(40, Math.round(origW * scale));
            newH = Math.max(20, Math.round(origH * scale));

            if (handle === 'se') {
              newX = origX;
              newY = origY;
            } else if (handle === 'nw') {
              newX = origRight - newW;
              newY = origBottom - newH;
            } else if (handle === 'ne') {
              newX = origX;
              newY = origBottom - newH;
            } else if (handle === 'sw') {
              newX = origRight - newW;
              newY = origY;
            }
          }

          const resizeSnap = computeCreatorResizeSnapping(targetEl, handle, newX, newY, newW, newH);
          targetEl.x = resizeSnap.newX;
          targetEl.y = resizeSnap.newY;
          targetEl.w = resizeSnap.newW;
          targetEl.h = resizeSnap.newH;

          // Scale font size, text box, and layers
          const scaleX = targetEl.w / origW;
          const scaleY = targetEl.h / origH;
          const minScale = Math.min(scaleX, scaleY);

          targetEl.fontSize = Math.max(10, Math.round(origFontSize * minScale));
          targetEl.textX = Math.round(origTextX * scaleX);
          targetEl.textY = Math.round(origTextY * scaleY);
          targetEl.textW = Math.max(20, Math.round(origTextW * scaleX));
          targetEl.textH = Math.max(10, Math.round(origTextH * scaleY));
          if (Array.isArray(targetEl.layers) && Array.isArray(origLayers)) {
            targetEl.layers.forEach((lay, idx) => {
              const oLay = origLayers[idx];
              if (oLay) {
                lay.x = Math.round((oLay.x || 0) * scaleX);
                lay.y = Math.round((oLay.y || 0) * scaleY);
                lay.w = Math.max(6, Math.round((oLay.w || 20) * scaleX));
                lay.h = Math.max(4, Math.round((oLay.h || 10) * scaleY));
                if (oLay.fontSize !== undefined) {
                  lay.fontSize = Math.max(8, Math.round(oLay.fontSize * minScale));
                }
              }
            });
            targetEl.extraLayers = targetEl.layers;
          } else if (Array.isArray(targetEl.extraLayers) && Array.isArray(origExtraLayers)) {
            targetEl.extraLayers.forEach((lay, idx) => {
              const oLay = origExtraLayers[idx];
              if (oLay) {
                lay.x = Math.round((oLay.x || 0) * scaleX);
                lay.y = Math.round((oLay.y || 0) * scaleY);
                lay.w = Math.max(6, Math.round((oLay.w || 20) * scaleX));
                lay.h = Math.max(4, Math.round((oLay.h || 10) * scaleY));
                if (oLay.fontSize !== undefined) {
                  lay.fontSize = Math.max(8, Math.round(oLay.fontSize * minScale));
                }
              }
            });
          }

          renderCreatorSnapGuidesOverlay(resizeSnap.snapLines);
        } else {
          const rawX = Math.round(origX + dx);
          const rawY = Math.round(origY + dy);
          const snap = computeCreatorSnapping(targetEl, rawX, rawY);
          targetEl.x = snap.snappedX;
          targetEl.y = snap.snappedY;
          renderCreatorSnapGuidesOverlay(snap.snapLines);
        }

        // Option A: If resizing a master element, update instances
        if (targetEl.isMaster && handle && handle !== 'rot') {
          syncMasterElementToInstances(targetEl);
        }

        // Requirement 2: If linked across slides, synchronize counterpart slides
        if (targetEl.linkAcrossSlides) {
          syncLinkedSlideElements(targetEl);
        }

        // Live visual update
        const elDom = dom.creatorInteractionLayer.querySelector(`[data-creator-el-id="${targetEl.id}"]`);
        const gapPx = creatorState.showSeamGaps ? 28 : 0;
        const isStaging = targetEl.isMaster || targetEl.y < CREATOR_SLIDES_TOP;
        const slideIdx = isStaging ? 0 : Math.max(0, Math.min(2, Math.floor(targetEl.x / SLIDE_W)));
        const visualRenderX = isStaging ? targetEl.x : (targetEl.x + slideIdx * gapPx);

        if (elDom) {
          elDom.style.left = `${visualRenderX}px`;
          elDom.style.top = `${targetEl.y}px`;
          elDom.style.width = `${targetEl.w}px`;
          elDom.style.height = `${targetEl.h}px`;
          elDom.style.transform = `rotate(${targetEl.rotation || 0}deg)`;
          const textEl = elDom.querySelector('.creator-element-text-content');
          if (textEl) {
            const textWrap = textEl.parentElement;
            if (textWrap && textWrap !== elDom) {
              textWrap.style.left = `${targetEl.textX !== undefined ? targetEl.textX : 0}px`;
              textWrap.style.top = `${targetEl.textY !== undefined ? targetEl.textY : 0}px`;
              textWrap.style.width = `${targetEl.textW !== undefined ? targetEl.textW : targetEl.w}px`;
              textWrap.style.height = `${targetEl.textH !== undefined ? targetEl.textH : targetEl.h}px`;
            }
            textEl.style.fontSize = `${targetEl.fontSize || 32}px`;
          }
        }
        const selBox = document.getElementById('creatorActiveSelectionBox');
        if (selBox) {
          selBox.style.left = `${visualRenderX}px`;
          selBox.style.top = `${targetEl.y}px`;
          selBox.style.width = `${targetEl.w}px`;
          selBox.style.height = `${targetEl.h}px`;
          selBox.style.transform = `rotate(${targetEl.rotation || 0}deg)`;
        }
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        clearCreatorSnapGuidesOverlay();
        if (hasMoved) {
          renderPresetCreatorAll();
        }
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    // Click & Drag on Elements
    dom.creatorInteractionLayer.querySelectorAll('.creator-scene-element').forEach(box => {
      box.onmousedown = (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.creator-master-plus-btn')) return;

        const id = box.getAttribute('data-creator-el-id');
        const el = creatorState.masterElements.find(x => x.id === id) ||
                   creatorState.elements.find(x => x.id === id);
        if (!el) return;

        // Double click detection fallback (enters modal or inspector text)
        const now = Date.now();
        if (lastCreatorClickId === id && (now - lastCreatorClickTime) < 420) {
          lastCreatorClickTime = 0;
          lastCreatorClickId = null;
          if (el.isMaster) {
            openMasterElementEditor(el.id);
            return;
          } else if (dom.creatorInspElText) {
            dom.creatorInspElText.focus();
            dom.creatorInspElText.select();
            return;
          }
        }
        lastCreatorClickTime = now;
        lastCreatorClickId = id;

        if (creatorState.selectedId !== id) {
          creatorState.selectedId = id;
          creatorState.selectedGuideId = null;
          renderPresetCreatorAll();
          const freshEl = creatorState.masterElements.find(x => x.id === id) ||
                          creatorState.elements.find(x => x.id === id);
          if (freshEl) startDragSession(e, freshEl, null);
        } else {
          startDragSession(e, el, null);
        }
      };

      box.ondblclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = box.getAttribute('data-creator-el-id');
        const isMaster = box.getAttribute('data-is-master') === 'true';
        if (isMaster) {
          openMasterElementEditor(id);
        } else if (dom.creatorInspElText) {
          dom.creatorInspElText.focus();
          dom.creatorInspElText.select();
        }
      };
    });

    // Active Selection Box Drag & Rotate & Handles
    const activeSelBox = document.getElementById('creatorActiveSelectionBox');
    if (activeSelBox) {
      activeSelBox.onmousedown = (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.creator-master-plus-btn')) return;

        const selEl = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
                      creatorState.elements.find(x => x.id === creatorState.selectedId);
        if (!selEl) return;

        const handleEl = e.target.closest('[data-creator-handle]');
        const handle = handleEl ? handleEl.getAttribute('data-creator-handle') : null;

        if (!handle) {
          const now = Date.now();
          if (lastCreatorClickId === selEl.id && (now - lastCreatorClickTime) < 420) {
            lastCreatorClickTime = 0;
            lastCreatorClickId = null;
            if (selEl.isMaster) {
              openMasterElementEditor(selEl.id);
              return;
            } else if (dom.creatorInspElText) {
              dom.creatorInspElText.focus();
              dom.creatorInspElText.select();
              return;
            }
          }
          lastCreatorClickTime = now;
          lastCreatorClickId = selEl.id;
        }

        startDragSession(e, selEl, handle);
      };

      activeSelBox.ondblclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selEl = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
                      creatorState.elements.find(x => x.id === creatorState.selectedId);
        if (selEl?.isMaster) {
          openMasterElementEditor(selEl.id);
        } else if (dom.creatorInspElText) {
          dom.creatorInspElText.focus();
          dom.creatorInspElText.select();
        }
      };
    }

    // Spawn instance '+' button
    dom.creatorInteractionLayer.querySelectorAll('.btn-spawn-instance').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const masterId = btn.getAttribute('data-master-id');
        const m = creatorState.masterElements.find(x => x.id === masterId);
        if (!m) return;
        pushCreatorHistorySnapshot();
        const copy = JSON.parse(JSON.stringify(m));
        copy.id = genId('c-el');
        copy.isMaster = false;
        copy.masterId = m.id;
        if (m.role === 'handle') {
          copy.x = 1080 + 120;
          copy.y = CREATOR_SLIDES_TOP + 75;
        } else if (m.role === 'headline') {
          copy.x = 1080 + 120;
          copy.y = CREATOR_SLIDES_TOP + 320;
        } else if (m.role === 'subtitle') {
          copy.x = 1080 + 120;
          copy.y = CREATOR_SLIDES_TOP + 480;
        } else if (m.role === 'counter') {
          copy.x = 1080 + 450;
          copy.y = CREATOR_SLIDES_TOP + 1200;
        } else if (m.role === 'swipe') {
          copy.x = 1080 + 720;
          copy.y = CREATOR_SLIDES_TOP + 1200;
        } else {
          copy.x = 1080 + 120;
          copy.y = CREATOR_SLIDES_TOP + 350;
        }
        copy.rotation = 0;
        creatorState.elements.push(copy);
        creatorState.selectedId = copy.id;
        renderPresetCreatorAll();
      };
    });
  }

  function renderCreatorGuidelines() {
    if (!dom.creatorGuidesList) return;
    // Hide center guidelines (isFixedCenter or 675 / 540) from guidelines layers panel
    const visibleGuides = creatorState.guidelines.filter(g => !g.isFixedCenter && !(g.type === 'h' && g.coord === 675) && !(g.type === 'v' && g.coord === 540));

    dom.creatorGuidesList.innerHTML = visibleGuides.map(g => {
      const isSel = creatorState.selectedGuideId === g.id;
      return `
        <div class="creator-guide-item ${isSel ? 'is-selected' : ''}" data-guide-id="${g.id}">
          <div class="creator-guide-item-meta">
            <span class="creator-guide-type-tag">${g.type.toUpperCase()}</span>
            <span style="color:var(--text-primary);font-size:11px;">${escapeHtml(g.label || (g.type === 'h' ? 'Horizontal Guide' : 'Vertical Guide'))}</span>
          </div>
          <div class="creator-guide-actions">
            <button class="btn-guide-action btn-mirror-guide" data-guide-id="${g.id}" title="Mirror guideline opposite side">⇆ Mirror</button>
            <button class="btn-guide-action btn-delete-guide" data-guide-id="${g.id}" title="Delete Guideline">✕</button>
          </div>
        </div>
      `;
    }).join('');

    // Bind guideline list actions
    dom.creatorGuidesList.querySelectorAll('.creator-guide-item').forEach(item => {
      item.onclick = (e) => {
        if (e.target.closest('button')) return;
        const id = item.getAttribute('data-guide-id');
        creatorState.selectedGuideId = id;
        renderCreatorGuidelines();
      };
    });

    dom.creatorGuidesList.querySelectorAll('.btn-mirror-guide').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-guide-id');
        const g = creatorState.guidelines.find(x => x.id === id);
        if (!g) return;
        pushCreatorHistorySnapshot();
        // Mirror opposite side: for H (1350 - coord), for V (1080 - coord)
        const mirroredCoord = g.type === 'h' ? (SLIDE_H - g.coord) : (SLIDE_W - g.coord);
        const newGuide = {
          id: 'g-' + Date.now(),
          type: g.type,
          coord: mirroredCoord,
          label: `Mirrored ${g.type.toUpperCase()}=${mirroredCoord}`
        };
        creatorState.guidelines.push(newGuide);
        creatorState.selectedGuideId = newGuide.id;
        renderPresetCreatorAll();
      };
    });

    dom.creatorGuidesList.querySelectorAll('.btn-delete-guide').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-guide-id');
        pushCreatorHistorySnapshot();
        creatorState.guidelines = creatorState.guidelines.filter(x => x.id !== id);
        if (creatorState.selectedGuideId === id) creatorState.selectedGuideId = null;
        renderPresetCreatorAll();
      };
    });

    // Render interactive guideline overlays on slides (Draggable and selectable)
    if (dom.creatorSmartGuidesLayer) {
      if (!dom.creatorToggleGuides || !dom.creatorToggleGuides.checked) {
        dom.creatorSmartGuidesLayer.innerHTML = '';
        return;
      }
      let guidesHtml = '';
      const gapPx = creatorState.showSeamGaps ? 28 : 0;
      const totalW = 3 * SLIDE_W + 2 * gapPx;
      creatorState.guidelines.forEach(g => {
        const isCenter = g.isFixedCenter || (g.type === 'h' && g.coord === 675) || (g.type === 'v' && g.coord === 540);
        const isSel = creatorState.selectedGuideId === g.id;

        if (isCenter) {
          if (g.type === 'h') {
            guidesHtml += `
              <div class="creator-fixed-guide-h creator-fixed-guide-center"
                data-guide-id="${g.id}"
                data-is-center="true"
                style="top:${g.coord}px;width:${totalW}px;"
                title="Horizontal Center (Y=${g.coord}px) - Fixed"
              ></div>
            `;
          } else {
            for (let s = 0; s < 3; s++) {
              const x = s * (SLIDE_W + gapPx) + g.coord;
              guidesHtml += `
                <div class="creator-fixed-guide-v creator-fixed-guide-center"
                  data-guide-id="${g.id}"
                  data-is-center="true"
                  style="left:${x}px;height:${SLIDE_H}px;"
                  title="Vertical Center (X=${g.coord}px) - Fixed"
                ></div>
              `;
            }
          }
        } else {
          if (g.type === 'h') {
            guidesHtml += `
              <div class="creator-interactive-guide-h ${isSel ? 'is-selected' : ''}"
                data-guide-id="${g.id}"
                tabindex="0"
                style="top:${g.coord}px;width:${totalW}px;"
                title="Click & Drag horizontal guide at Y=${g.coord}px"
              ></div>
            `;
          } else {
            for (let s = 0; s < 3; s++) {
              const x = s * (SLIDE_W + gapPx) + g.coord;
              guidesHtml += `
                <div class="creator-interactive-guide-v ${isSel ? 'is-selected' : ''}"
                  data-guide-id="${g.id}"
                  tabindex="0"
                  style="left:${x}px;height:${SLIDE_H}px;"
                  title="Click & Drag vertical guide at X=${g.coord}px"
                ></div>
              `;
            }
          }
        }
      });
      dom.creatorSmartGuidesLayer.innerHTML = guidesHtml;
      bindCreatorGuidelinesDragging();
    }
  }

  // Interactive Dragging & Arrow Key Movement for Guidelines
  function bindCreatorGuidelinesDragging() {
    if (!dom.creatorSmartGuidesLayer) return;

    dom.creatorSmartGuidesLayer.querySelectorAll('.creator-interactive-guide-h, .creator-interactive-guide-v').forEach(guideEl => {
      const guideId = guideEl.getAttribute('data-guide-id');
      const g = creatorState.guidelines.find(x => x.id === guideId);
      if (!g) return;
      if (g.isFixedCenter || (g.type === 'h' && g.coord === 675) || (g.type === 'v' && g.coord === 540)) return;

      guideEl.onmousedown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        pushCreatorHistorySnapshot();
        creatorState.selectedGuideId = g.id;
        renderCreatorGuidelines();

        const startX = e.clientX;
        const startY = e.clientY;
        const startCoord = g.coord;
        const currentZoom = creatorState.zoom || 0.28;

        const onMouseMove = (moveEvt) => {
          if (g.type === 'h') {
            const dy = (moveEvt.clientY - startY) / currentZoom;
            g.coord = Math.max(0, Math.min(SLIDE_H, Math.round(startCoord + dy)));
            g.label = `Custom Y=${g.coord}`;
          } else {
            const dx = (moveEvt.clientX - startX) / currentZoom;
            g.coord = Math.max(0, Math.min(SLIDE_W, Math.round(startCoord + dx)));
            g.label = `Custom X=${g.coord}`;
          }
          // Real-time update
          renderCreatorGuidelines();
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          renderPresetCreatorAll();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };

      // Arrow keys movement
      guideEl.onkeydown = (e) => {
        let delta = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = e.shiftKey ? -10 : -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = e.shiftKey ? 10 : 1;

        if (delta !== 0) {
          e.preventDefault();
          pushCreatorHistorySnapshot();
          if (g.type === 'h') {
            g.coord = Math.max(0, Math.min(SLIDE_H, g.coord + delta));
            g.label = `Custom Y=${g.coord}`;
          } else {
            g.coord = Math.max(0, Math.min(SLIDE_W, g.coord + delta));
            g.label = `Custom X=${g.coord}`;
          }
          renderPresetCreatorAll();
        }
      };
    });
  }

  function renderCreatorInspector() {
    const sel = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
                creatorState.elements.find(x => x.id === creatorState.selectedId);

    if (!sel) {
      if (dom.creatorInspectorEmptyState) dom.creatorInspectorEmptyState.classList.remove('hidden');
      if (dom.creatorInspectorElementState) dom.creatorInspectorElementState.classList.add('hidden');
      return;
    }

    if (dom.creatorInspectorEmptyState) dom.creatorInspectorEmptyState.classList.add('hidden');
    if (dom.creatorInspectorElementState) dom.creatorInspectorElementState.classList.remove('hidden');

    if (dom.creatorInspElTitle) dom.creatorInspElTitle.textContent = sel.name || 'ELEMENT INSPECTOR';
    if (dom.creatorInspSlideBadge) dom.creatorInspSlideBadge.textContent = sel.isMaster ? 'Master Element' : `Slide ${Math.floor(sel.x / SLIDE_W) + 1}`;
    if (dom.creatorInspElName) dom.creatorInspElName.value = sel.name || '';
    if (dom.creatorInspElText) dom.creatorInspElText.value = sel.text || '';
    if (dom.creatorInspElFont) dom.creatorInspElFont.value = sel.fontFamily || 'Rubik';
    if (dom.creatorInspElFontSize) dom.creatorInspElFontSize.value = sel.fontSize || 40;

    // Text Color Slot & Pickers
    populateColorSlotDropdown(dom.creatorInspElColorSlot, sel.colorSlot);
    const activeColor = resolveSlotColor(sel.colorSlot, sel.color, '#162D43');
    if (dom.creatorInspElColor) dom.creatorInspElColor.value = normalizeHex(activeColor);
    if (dom.creatorInspElColorHex) dom.creatorInspElColorHex.value = activeColor;
    const textOp = sel.opacity !== undefined ? sel.opacity : 1;
    if (dom.creatorInspElOpacity) dom.creatorInspElOpacity.value = Math.round(textOp * 100);
    if (dom.creatorInspElOpacityVal) dom.creatorInspElOpacityVal.textContent = `${Math.round(textOp * 100)}%`;

    // Base Shape / Background Color & Opacity
    if (dom.creatorInspElHasBg) dom.creatorInspElHasBg.checked = Boolean(sel.hasBg);
    populateColorSlotDropdown(dom.creatorInspElBgColorSlot, sel.bgColorSlot);
    const activeBgColor = resolveSlotColor(sel.bgColorSlot, sel.bgColor, '#ffffff');
    if (dom.creatorInspElBgColor) dom.creatorInspElBgColor.value = normalizeHex(activeBgColor);
    const bgOp = sel.bgOpacity !== undefined ? sel.bgOpacity : 1;
    if (dom.creatorInspElBgOpacity) dom.creatorInspElBgOpacity.value = Math.round(bgOp * 100);
    if (dom.creatorInspElBgOpacityVal) dom.creatorInspElBgOpacityVal.textContent = `${Math.round(bgOp * 100)}%`;

    // Outline / Border
    if (dom.creatorInspElBorderWidth) dom.creatorInspElBorderWidth.value = sel.borderWidth || 0;
    populateColorSlotDropdown(dom.creatorInspElBorderColorSlot, sel.borderColorSlot);
    const activeBorderColor = resolveSlotColor(sel.borderColorSlot, sel.borderColor, '#000000');
    if (dom.creatorInspElBorderColor) dom.creatorInspElBorderColor.value = normalizeHex(activeBorderColor);
    const borderOp = sel.borderOpacity !== undefined ? sel.borderOpacity : 1;
    if (dom.creatorInspElBorderOpacity) dom.creatorInspElBorderOpacity.value = Math.round(borderOp * 100);
    if (dom.creatorInspElBorderOpacityVal) dom.creatorInspElBorderOpacityVal.textContent = `${Math.round(borderOp * 100)}%`;

    // Text Effect (Glow / Emboss)
    const eff = sel.textEffect || 'none';
    if (dom.creatorInspElEffect) dom.creatorInspElEffect.value = eff;
    if (dom.creatorInspEffectRow) {
      if (eff === 'none') {
        dom.creatorInspEffectRow.classList.add('hidden');
      } else {
        dom.creatorInspEffectRow.classList.remove('hidden');
        populateColorSlotDropdown(dom.creatorInspElEffectColorSlot, sel.effectColorSlot);
        const activeEffColor = resolveSlotColor(sel.effectColorSlot, sel.effectColor, eff === 'emboss' ? '#EBB26E' : '#ffffff');
        if (dom.creatorInspElEffectColor) dom.creatorInspElEffectColor.value = normalizeHex(activeEffColor);
        const effOp = sel.effectOpacity !== undefined ? sel.effectOpacity : 0.8;
        if (dom.creatorInspElEffectOpacity) dom.creatorInspElEffectOpacity.value = Math.round(effOp * 100);
        if (dom.creatorInspElEffectOpacityVal) dom.creatorInspElEffectOpacityVal.textContent = `${Math.round(effOp * 100)}%`;
      }
    }

    if (dom.creatorInspElAccent) dom.creatorInspElAccent.value = normalizeHex(sel.accentColor || '#219652');
    if (dom.creatorInspElAccentHex) dom.creatorInspElAccentHex.value = sel.accentColor || '#219652';
    if (dom.creatorInspElIsMaster) dom.creatorInspElIsMaster.checked = Boolean(sel.isMaster);
    if (dom.creatorInspElAutoCount) dom.creatorInspElAutoCount.checked = Boolean(sel.autoCount);
    if (dom.creatorInspElAddToAllSlides) dom.creatorInspElAddToAllSlides.checked = Boolean(sel.addedToAllSlides);

    // Link across slides visibility & state
    if (dom.creatorInspLinkAcrossSlidesRow) {
      if (!sel.isMaster && sel.addedToAllSlides) {
        dom.creatorInspLinkAcrossSlidesRow.classList.remove('hidden');
        if (dom.creatorInspElLinkAcrossSlides) {
          dom.creatorInspElLinkAcrossSlides.checked = Boolean(sel.linkAcrossSlides);
        }
      } else {
        dom.creatorInspLinkAcrossSlidesRow.classList.add('hidden');
      }
    }

    // Anchor Point grid
    if (dom.creatorInspAnchorGrid) {
      const anchor = sel.anchor || 'nw';
      dom.creatorInspAnchorGrid.querySelectorAll('.anchor-cell').forEach(cell => {
        cell.classList.toggle('active', cell.getAttribute('data-anchor') === anchor);
      });
    }
  }

  // ==================== MASTER ELEMENT MINI-SLIDE MODAL EDITOR ====================
  let activeMasterEditId = null;
  let activeAccordionLayerIdx = null;
  const modalSelectedLayerIds = new Set();
  let modalZoom = 1.0;
  const modalPan = { x: 0, y: 0 };
  const modalHistory = [];
  let modalHistoryIndex = -1;
  const MAX_MODAL_HISTORY = 30;

  function pushModalHistorySnapshot() {
    const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
    if (!el) return;
    if (modalHistoryIndex < modalHistory.length - 1) {
      modalHistory.splice(modalHistoryIndex + 1);
    }
    const snap = JSON.stringify({
      layers: el.layers,
      w: el.w,
      h: el.h,
      anchor: el.anchor,
      hasBg: el.hasBg,
      bgColorSlot: el.bgColorSlot,
      bgColor: el.bgColor,
      bgOpacity: el.bgOpacity,
      borderWidth: el.borderWidth,
      borderColorSlot: el.borderColorSlot,
      borderColor: el.borderColor,
      borderOpacity: el.borderOpacity,
      name: el.name
    });
    modalHistory.push(snap);
    if (modalHistory.length > MAX_MODAL_HISTORY) {
      modalHistory.shift();
    } else {
      modalHistoryIndex++;
    }
  }

  function undoModal() {
    if (modalHistoryIndex > 0) {
      modalHistoryIndex--;
      applyModalSnapshot(modalHistory[modalHistoryIndex]);
    }
  }

  function redoModal() {
    if (modalHistoryIndex < modalHistory.length - 1) {
      modalHistoryIndex++;
      applyModalSnapshot(modalHistory[modalHistoryIndex]);
    }
  }

  function applyModalSnapshot(raw) {
    const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
    if (!el || !raw) return;
    const snap = JSON.parse(raw);
    el.layers = snap.layers || [];
    el.extraLayers = el.layers;
    el.w = snap.w || 320;
    el.h = snap.h || 60;
    el.anchor = snap.anchor || 'nw';
    el.hasBg = snap.hasBg;
    el.bgColorSlot = snap.bgColorSlot;
    el.bgColor = snap.bgColor;
    el.bgOpacity = snap.bgOpacity;
    el.borderWidth = snap.borderWidth;
    el.borderColorSlot = snap.borderColorSlot;
    el.borderColor = snap.borderColor;
    el.borderOpacity = snap.borderOpacity;
    if (snap.name) el.name = snap.name;

    if (dom.masterModalBoxW) dom.masterModalBoxW.value = el.w;
    if (dom.masterModalBoxH) dom.masterModalBoxH.value = el.h;
    if (dom.masterModalNameInput) dom.masterModalNameInput.value = el.name || '';
    if (dom.masterModalHasBg) dom.masterModalHasBg.checked = Boolean(el.hasBg);
    if (dom.masterModalBorderWidth) dom.masterModalBorderWidth.value = el.borderWidth || 0;

    syncMasterElementToInstances(el);
    renderMasterModalPreview();
    renderMasterExtraLayersList();
  }

  function fitModalViewport(el) {
    if (!dom.masterModalCanvas || !el) return;
    const cw = dom.masterModalCanvas.clientWidth || 540;
    const ch = dom.masterModalCanvas.clientHeight || 420;
    const fw = el.w || 320;
    const fh = el.h || 60;
    const fitZ = Math.min(2.0, Math.max(0.35, Math.min((cw - 100) / fw, (ch - 100) / fh)));
    modalZoom = Number(fitZ.toFixed(2));
    modalPan.x = Math.round((cw - fw * modalZoom) / 2);
    modalPan.y = Math.round((ch - fh * modalZoom) / 2);
    if (dom.masterModalZoomReadout) {
      dom.masterModalZoomReadout.textContent = `${Math.round(modalZoom * 100)}%`;
    }
  }

  function updateModalStageTransform() {
    const stage = document.getElementById('masterModalStage');
    if (stage) {
      stage.style.transform = `translate(${modalPan.x}px, ${modalPan.y}px) scale(${modalZoom})`;
    }
  }

  function openMasterElementEditor(masterId) {
    const el = creatorState.masterElements.find(x => x.id === masterId);
    if (!el || !dom.masterElementEditorModal) return;

    normalizeMasterElement(el);
    activeMasterEditId = masterId;
    activeAccordionLayerIdx = null;
    modalSelectedLayerIds.clear();
    modalHistory.length = 0;
    modalHistoryIndex = -1;

    if (dom.masterModalTitle) dom.masterModalTitle.textContent = el.name || 'Master Element';
    if (dom.masterModalNameInput) dom.masterModalNameInput.value = el.name || '';
    if (dom.masterModalBoxW) dom.masterModalBoxW.value = el.w || 320;
    if (dom.masterModalBoxH) dom.masterModalBoxH.value = el.h || 60;

    // Anchor Grid Highlight
    if (dom.masterModalAnchorGrid) {
      const anchor = el.anchor || 'nw';
      dom.masterModalAnchorGrid.querySelectorAll('.anchor-cell').forEach(cell => {
        cell.classList.toggle('active', cell.getAttribute('data-anchor') === anchor);
      });
    }

    // Container Background Fill
    if (dom.masterModalHasBg) dom.masterModalHasBg.checked = Boolean(el.hasBg);
    populateColorSlotDropdown(dom.masterModalBgColorSlot, el.bgColorSlot);
    const activeBgCol = resolveSlotColor(el.bgColorSlot, el.bgColor, '#ffffff');
    if (dom.masterModalBgColor) dom.masterModalBgColor.value = normalizeHex(activeBgCol);
    if (dom.masterModalBgOpacity) dom.masterModalBgOpacity.value = Math.round((el.bgOpacity !== undefined ? el.bgOpacity : 1) * 100);
    if (dom.masterModalBgOpacityVal) dom.masterModalBgOpacityVal.textContent = `${Math.round((el.bgOpacity !== undefined ? el.bgOpacity : 1) * 100)}%`;

    // Container Outline / Border
    if (dom.masterModalBorderWidth) dom.masterModalBorderWidth.value = el.borderWidth || 0;
    populateColorSlotDropdown(dom.masterModalBorderColorSlot, el.borderColorSlot);
    const activeBorderCol = resolveSlotColor(el.borderColorSlot, el.borderColor, '#000000');
    if (dom.masterModalBorderColor) dom.masterModalBorderColor.value = normalizeHex(activeBorderCol);
    if (dom.masterModalBorderOpacity) dom.masterModalBorderOpacity.value = Math.round((el.borderOpacity !== undefined ? el.borderOpacity : 1) * 100);
    if (dom.masterModalBorderOpacityVal) dom.masterModalBorderOpacityVal.textContent = `${Math.round((el.borderOpacity !== undefined ? el.borderOpacity : 1) * 100)}%`;

    dom.masterElementEditorModal.classList.remove('hidden');

    fitModalViewport(el);
    pushModalHistorySnapshot(); // Snapshot 0: Initial state on open

    renderMasterModalPreview();
    renderMasterExtraLayersList();
  }

  function closeMasterElementEditor() {
    if (!dom.masterElementEditorModal) return;
    dom.masterElementEditorModal.classList.add('hidden');
    const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
    if (el) syncMasterElementToInstances(el);
    activeMasterEditId = null;
    activeAccordionLayerIdx = null;
    modalSelectedLayerIds.clear();
    renderPresetCreatorAll();
  }

  function renderMasterModalPreview() {
    const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
    if (!el || !dom.masterModalPreviewBox) return;

    normalizeMasterElement(el);

    const bgOp = el.bgOpacity !== undefined ? el.bgOpacity : 1;
    const bgFill = el.hasBg ? resolveColorWithAlpha(resolveSlotColor(el.bgColorSlot, el.bgColor || '#ffffff'), bgOp) : 'transparent';
    const borderW = Number(el.borderWidth) || 0;
    const borderCol = resolveColorWithAlpha(resolveSlotColor(el.borderColorSlot, el.borderColor || '#000000'), el.borderOpacity !== undefined ? el.borderOpacity : 1);
    const modalBorder = borderW > 0 ? `${borderW}px solid ${borderCol}` : '1.5px dashed var(--accent-gold, #c19358)';

    let layersHtml = '';
    (el.layers || []).forEach(layer => {
      const isSel = modalSelectedLayerIds.has(layer.id);
      const isSingleSel = isSel && modalSelectedLayerIds.size === 1;

      if (layer.type === 'shape') {
        const shapeBg = resolveColorWithAlpha(resolveSlotColor(layer.colorSlot, layer.color || layer.bg || '#219652'), layer.opacity !== undefined ? layer.opacity : 1);
        const sBorderW = Number(layer.borderWidth) || 0;
        const sBorderCol = resolveColorWithAlpha(resolveSlotColor(layer.borderColorSlot, layer.borderColor || '#000000'), layer.borderOpacity !== undefined ? layer.borderOpacity : 1);
        const shapeBorder = sBorderW > 0 ? `${sBorderW}px solid ${sBorderCol}` : 'none';
        let rad = `${layer.radius || 0}px`;
        if (layer.shapeType === 'circle') rad = '50%';
        else if (layer.shapeType === 'pill') rad = '9999px';

        layersHtml += `
          <div class="master-modal-element-layer ${isSel ? 'is-selected' : ''}" data-layer-id="${layer.id}" style="
            position:absolute;
            left:${layer.x || 0}px;
            top:${layer.y || 0}px;
            width:${layer.w || 120}px;
            height:${layer.h || 36}px;
            background:${shapeBg};
            border:${shapeBorder};
            border-radius:${rad};
            cursor:move;
            box-sizing:border-box;
            z-index:5;
          ">
            ${isSingleSel ? `<div class="modal-shape-handle" data-layer-handle="${layer.id}"></div>` : ''}
          </div>
        `;
      } else if (layer.type === 'image' && layer.src) {
        layersHtml += `
          <div class="master-modal-element-layer ${isSel ? 'is-selected' : ''}" data-layer-id="${layer.id}" style="
            position:absolute;
            left:${layer.x || 0}px;
            top:${layer.y || 0}px;
            width:${layer.w || 100}px;
            height:${layer.h || 100}px;
            cursor:move;
            z-index:5;
          ">
            <img src="${layer.src}" style="width:100%;height:100%;object-fit:contain;opacity:${layer.opacity !== undefined ? layer.opacity : 1};pointer-events:none;" />
            ${isSingleSel ? `<div class="modal-shape-handle" data-layer-handle="${layer.id}"></div>` : ''}
          </div>
        `;
      } else if (layer.type === 'text') {
        const lFont = `'${layer.fontFamily || 'Rubik'}', sans-serif`;
        const lColor = resolveColorWithAlpha(resolveSlotColor(layer.colorSlot, layer.color || '#162D43'), layer.opacity !== undefined ? layer.opacity : 1);
        const lShadow = resolveTextEffectShadow(layer.textEffect || 'none', resolveSlotColor(layer.effectColorSlot, layer.effectColor || '#ffffff'), layer.effectOpacity !== undefined ? layer.effectOpacity : 0.8);
        const textAlign = layer.align || 'left';
        let justify = 'flex-start';
        if (textAlign === 'center') justify = 'center';
        else if (textAlign === 'right') justify = 'flex-end';

        layersHtml += `<div class="master-modal-element-layer ${isSel ? 'is-selected' : ''}" data-layer-id="${layer.id}" style="position:absolute;left:${layer.x || 0}px;top:${layer.y || 0}px;width:${layer.w || 200}px;height:${layer.h || 40}px;max-width:${el.w}px;max-height:${el.h}px;overflow:hidden;font-family:${lFont};font-size:${layer.fontSize || 32}px;font-weight:${layer.isBold ? '700' : '400'};color:${lColor};opacity:${layer.opacity !== undefined ? layer.opacity : 1};text-shadow:${lShadow};text-transform:${layer.uppercase ? 'uppercase' : 'none'};text-align:${textAlign};line-height:1.15;cursor:move;box-sizing:border-box;z-index:6;display:flex;align-items:center;justify-content:${justify};"><div style="width:100%;pointer-events:none;white-space:pre-wrap;word-break:break-word;">${formatCreatorRichTextHtml(layer.text || 'Sample Text', 1, layer.autoCount)}</div>${isSingleSel ? `<div class="modal-shape-handle" data-layer-handle="${layer.id}"></div>` : ''}</div>`;
      }
    });

    dom.masterModalPreviewBox.innerHTML = `
      <div id="masterModalStage" style="
        position:absolute;
        left:0;
        top:0;
        width:0;
        height:0;
        transform:translate(${modalPan.x}px, ${modalPan.y}px) scale(${modalZoom});
        transform-origin:0 0;
        pointer-events:none;
      ">
        <div id="masterModalPreviewBoxWrapper" class="master-modal-base-box" style="
          position:absolute;
          left:0;
          top:0;
          width:${el.w}px;
          height:${el.h}px;
          box-shadow:0 8px 32px rgba(0,0,0,0.45);
          border:${modalBorder};
          border-radius:6px;
          box-sizing:border-box;
          padding:0;
          overflow:visible !important;
          user-select:none;
          pointer-events:auto;
        ">
          ${el.hasBg ? `
            <div class="master-preview-bg-fill" style="
              position:absolute;
              inset:0;
              background:${bgFill};
              border-radius:inherit;
              pointer-events:none;
              z-index:1;
            "></div>
          ` : ''}

          <div id="modalSmartGuidesOverlay" style="position:absolute;inset:-2000px;pointer-events:none;z-index:100;overflow:visible;"></div>

          ${layersHtml}

          <!-- 8 Container Frame Boundary Handles -->
          <div class="modal-bbox-handle handle-nw" data-modal-handle="nw" title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-n"  data-modal-handle="n"  title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-ne" data-modal-handle="ne" title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-e"  data-modal-handle="e"  title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-se" data-modal-handle="se" title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-s"  data-modal-handle="s"  title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-sw" data-modal-handle="sw" title="Drag to resize frame"></div>
          <div class="modal-bbox-handle handle-w"  data-modal-handle="w"  title="Drag to resize frame"></div>
        </div>
      </div>
    `;

    bindMasterModalInteractions(el);
  }

  function bindMasterModalInteractions(el) {
    if (!dom.masterModalPreviewBox || !dom.masterModalCanvas) return;

    // 1. Mouse Wheel Zoom centered on cursor
    dom.masterModalCanvas.onwheel = (e) => {
      e.preventDefault();
      const rect = dom.masterModalCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.max(0.25, Math.min(3.0, Number((modalZoom * factor).toFixed(3))));
      if (Math.abs(newZoom - modalZoom) < 0.005) return;

      modalPan.x = Math.round(mouseX - ((mouseX - modalPan.x) / modalZoom) * newZoom);
      modalPan.y = Math.round(mouseY - ((mouseY - modalPan.y) / modalZoom) * newZoom);
      modalZoom = newZoom;

      if (dom.masterModalZoomReadout) {
        dom.masterModalZoomReadout.textContent = `${Math.round(modalZoom * 100)}%`;
      }
      renderMasterModalPreview();
    };

    const wrapper = document.getElementById('masterModalPreviewBoxWrapper');

    // 2a. Move whole container frame surface (click on wrapper background/border, not on handle or layer)
    if (wrapper) {
      wrapper.onmousedown = (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('[data-modal-handle]') || e.target.closest('[data-layer-id]')) return;
        if (isSpacePressed) return;
        e.preventDefault();
        e.stopPropagation();

        let hasMovedBox = false;
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        const origLayersPos = (el.layers || []).map(l => ({ id: l.id, x: l.x || 0, y: l.y || 0 }));
        let curBoxX = 0;
        let curBoxY = 0;

        const onBoxMove = (me) => {
          hasMovedBox = true;
          const dx = (me.clientX - startClientX) / modalZoom;
          const dy = (me.clientY - startClientY) / modalZoom;
          curBoxX = Math.round(dx);
          curBoxY = Math.round(dy);

          wrapper.style.left = `${curBoxX}px`;
          wrapper.style.top = `${curBoxY}px`;

          wrapper.querySelectorAll('.master-modal-element-layer').forEach(layerEl => {
            const lId = layerEl.getAttribute('data-layer-id');
            const origL = origLayersPos.find(l => l.id === lId);
            if (origL) {
              layerEl.style.left = `${origL.x - curBoxX}px`;
              layerEl.style.top = `${origL.y - curBoxY}px`;
            }
          });
        };

        const onBoxUp = () => {
          window.removeEventListener('mousemove', onBoxMove);
          window.removeEventListener('mouseup', onBoxUp);
          if (!hasMovedBox) return;

          (el.layers || []).forEach(lay => {
            const origL = origLayersPos.find(l => l.id === lay.id);
            if (origL) {
              lay.x = origL.x - curBoxX;
              lay.y = origL.y - curBoxY;
            }
          });

          el.x = (el.x || 0) + curBoxX;
          el.y = (el.y || 0) + curBoxY;

          const instances = creatorState.elements.filter(x => x.masterId === el.id);
          instances.forEach(inst => {
            inst.x = (inst.x || 0) + curBoxX;
            inst.y = (inst.y || 0) + curBoxY;
            inst.w = el.w;
            inst.h = el.h;
            inst.layers = JSON.parse(JSON.stringify(el.layers));
          });

          modalPan.x = Math.round(modalPan.x + curBoxX * modalZoom);
          modalPan.y = Math.round(modalPan.y + curBoxY * modalZoom);

          pushModalHistorySnapshot();
          renderMasterModalPreview();
          renderPresetCreatorAll();
        };

        window.addEventListener('mousemove', onBoxMove);
        window.addEventListener('mouseup', onBoxUp);
      };
    }

    // 2b. Container Frame individual boundary points/handles resize
    dom.masterModalPreviewBox.querySelectorAll('[data-modal-handle]').forEach(handleEl => {
      handleEl.onmousedown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        let hasResized = false;
        const handle = handleEl.getAttribute('data-modal-handle');
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        const origW = el.w || 320;
        const origH = el.h || 60;
        const origRight = origW;
        const origBottom = origH;
        const origLayersPos = (el.layers || []).map(l => ({ id: l.id, x: l.x || 0, y: l.y || 0 }));

        let curBoxX = 0;
        let curBoxY = 0;
        let curW = origW;
        let curH = origH;

        // Bounding envelope of all layers to ensure frame cannot shrink smaller than contained content
        let minLayerLeft = 0;
        let minLayerTop = 0;
        let maxLayerRight = 20;
        let maxLayerBottom = 10;
        (el.layers || []).forEach(l => {
          const lx = l.x || 0;
          const ly = l.y || 0;
          const lw = l.w || 40;
          const lh = l.h || 20;
          minLayerLeft = Math.min(minLayerLeft, lx);
          minLayerTop = Math.min(minLayerTop, ly);
          maxLayerRight = Math.max(maxLayerRight, lx + lw);
          maxLayerBottom = Math.max(maxLayerBottom, ly + lh);
        });

        const onHandleMove = (me) => {
          hasResized = true;
          const dx = (me.clientX - startClientX) / modalZoom;
          const dy = (me.clientY - startClientY) / modalZoom;

          let newLeft = 0;
          let newTop = 0;
          let newRight = origRight;
          let newBottom = origBottom;

          if (handle.includes('e')) {
            newRight = Math.max(maxLayerRight, Math.round(origRight + dx));
          } else if (handle.includes('w')) {
            newLeft = Math.min(minLayerLeft, Math.round(dx));
          }

          if (handle.includes('s')) {
            newBottom = Math.max(maxLayerBottom, Math.round(origBottom + dy));
          } else if (handle.includes('n')) {
            newTop = Math.min(minLayerTop, Math.round(dy));
          }

          curBoxX = newLeft;
          curBoxY = newTop;
          curW = Math.max(20, newRight - newLeft);
          curH = Math.max(10, newBottom - newTop);

          if (wrapper) {
            wrapper.style.left = `${curBoxX}px`;
            wrapper.style.top = `${curBoxY}px`;
            wrapper.style.width = `${curW}px`;
            wrapper.style.height = `${curH}px`;

            wrapper.querySelectorAll('.master-modal-element-layer').forEach(layerEl => {
              const lId = layerEl.getAttribute('data-layer-id');
              const origL = origLayersPos.find(l => l.id === lId);
              if (origL) {
                layerEl.style.left = `${origL.x - curBoxX}px`;
                layerEl.style.top = `${origL.y - curBoxY}px`;
              }
            });
          }

          if (dom.masterModalBoxW) dom.masterModalBoxW.value = curW;
          if (dom.masterModalBoxH) dom.masterModalBoxH.value = curH;
        };

        const onHandleUp = () => {
          window.removeEventListener('mousemove', onHandleMove);
          window.removeEventListener('mouseup', onHandleUp);
          if (!hasResized) return;

          el.w = curW;
          el.h = curH;

          (el.layers || []).forEach(lay => {
            const origL = origLayersPos.find(l => l.id === lay.id);
            if (origL) {
              lay.x = origL.x - curBoxX;
              lay.y = origL.y - curBoxY;
            }
          });

          el.x = (el.x || 0) + curBoxX;
          el.y = (el.y || 0) + curBoxY;

          const instances = creatorState.elements.filter(x => x.masterId === el.id);
          instances.forEach(inst => {
            inst.x = (inst.x || 0) + curBoxX;
            inst.y = (inst.y || 0) + curBoxY;
            inst.w = el.w;
            inst.h = el.h;
            inst.layers = JSON.parse(JSON.stringify(el.layers));
          });

          modalPan.x = Math.round(modalPan.x + curBoxX * modalZoom);
          modalPan.y = Math.round(modalPan.y + curBoxY * modalZoom);

          pushModalHistorySnapshot();
          renderMasterModalPreview();
          renderPresetCreatorAll();
        };

        window.addEventListener('mousemove', onHandleMove);
        window.addEventListener('mouseup', onHandleUp);
      };
    });

    // 3. Layer Moving, Snapping, and Corner Resizing
    dom.masterModalPreviewBox.querySelectorAll('[data-layer-id]').forEach(layerEl => {
      layerEl.onmousedown = (e) => {
        if (e.button !== 0) return;
        if (isSpacePressed) return;
        e.preventDefault();
        e.stopPropagation();

        const layerId = layerEl.getAttribute('data-layer-id');
        const isHandle = Boolean(e.target.closest('[data-layer-handle]'));

        if (e.shiftKey) {
          if (modalSelectedLayerIds.has(layerId)) {
            modalSelectedLayerIds.delete(layerId);
          } else {
            modalSelectedLayerIds.add(layerId);
          }
          renderMasterExtraLayersList();
          renderMasterModalPreview();
          return;
        }

        if (!modalSelectedLayerIds.has(layerId)) {
          modalSelectedLayerIds.clear();
          modalSelectedLayerIds.add(layerId);
          const lIdx = el.layers.findIndex(l => l.id === layerId);
          if (lIdx !== -1) activeAccordionLayerIdx = lIdx;
          renderMasterExtraLayersList();
          renderMasterModalPreview();
        }

        let hasMoved = false;
        const startClientX = e.clientX;
        const startClientY = e.clientY;

        const origPositions = {};
        modalSelectedLayerIds.forEach(id => {
          const lay = el.layers.find(l => l.id === id);
          if (lay) {
            origPositions[id] = { x: lay.x || 0, y: lay.y || 0, w: lay.w || 40, h: lay.h || 20, fontSize: lay.fontSize };
          }
        });

        const onLayerMove = (moveEvt) => {
          hasMoved = true;
          const rawDx = (moveEvt.clientX - startClientX) / modalZoom;
          const rawDy = (moveEvt.clientY - startClientY) / modalZoom;

          if (isHandle && modalSelectedLayerIds.size === 1) {
            const lay = el.layers.find(l => l.id === layerId);
            const orig = origPositions[layerId];
            if (lay && orig) {
              const maxW = Math.max(10, el.w - (lay.x || 0));
              const maxH = Math.max(6, el.h - (lay.y || 0));
              lay.w = Math.max(10, Math.min(maxW, Math.round(orig.w + rawDx)));
              lay.h = Math.max(6, Math.min(maxH, Math.round(orig.h + rawDy)));
              if (lay.type === 'text') {
                const scale = Math.max(0.2, lay.w / orig.w);
                lay.fontSize = Math.max(10, Math.round((orig.fontSize || 32) * scale));
              }
              renderMasterModalPreview();
            }
            return;
          }

          // Smart Snapping for layer(s) drag
          let selMinX = Infinity, selMaxX = -Infinity, selMinY = Infinity, selMaxY = -Infinity;
          modalSelectedLayerIds.forEach(id => {
            const o = origPositions[id];
            if (o) {
              const curX = o.x + rawDx;
              const curY = o.y + rawDy;
              selMinX = Math.min(selMinX, curX);
              selMaxX = Math.max(selMaxX, curX + o.w);
              selMinY = Math.min(selMinY, curY);
              selMaxY = Math.max(selMaxY, curY + o.h);
            }
          });
          const selW = selMaxX - selMinX;
          const selH = selMaxY - selMinY;
          const selCenterX = selMinX + selW / 2;
          const selCenterY = selMinY + selH / 2;

          // Target coordinates to snap to
          const candX = [0, el.w / 2, el.w];
          const candY = [0, el.h / 2, el.h];
          (el.layers || []).forEach(other => {
            if (!modalSelectedLayerIds.has(other.id)) {
              const ox = other.x || 0;
              const oy = other.y || 0;
              const ow = other.w || 40;
              const oh = other.h || 20;
              candX.push(ox, ox + ow / 2, ox + ow);
              candY.push(oy, oy + oh / 2, oy + oh);
            }
          });

          const snapThresh = 8;
          let snapDx = 0;
          let snapDy = 0;
          let snappedLineX = null;
          let snappedLineY = null;

          let bestDistX = snapThresh + 1;
          candX.forEach(cx => {
            let d = Math.abs(selMinX - cx);
            if (d < bestDistX) { bestDistX = d; snapDx = cx - selMinX; snappedLineX = cx; }
            d = Math.abs(selCenterX - cx);
            if (d < bestDistX) { bestDistX = d; snapDx = cx - selCenterX; snappedLineX = cx; }
            d = Math.abs(selMaxX - cx);
            if (d < bestDistX) { bestDistX = d; snapDx = cx - selMaxX; snappedLineX = cx; }
          });

          let bestDistY = snapThresh + 1;
          candY.forEach(cy => {
            let d = Math.abs(selMinY - cy);
            if (d < bestDistY) { bestDistY = d; snapDy = cy - selMinY; snappedLineY = cy; }
            d = Math.abs(selCenterY - cy);
            if (d < bestDistY) { bestDistY = d; snapDy = cy - selCenterY; snappedLineY = cy; }
            d = Math.abs(selMaxY - cy);
            if (d < bestDistY) { bestDistY = d; snapDy = cy - selMaxY; snappedLineY = cy; }
          });

          const finalDx = Math.round(rawDx + snapDx);
          const finalDy = Math.round(rawDy + snapDy);

          // Calculate collective bounding box for selected layers to strictly clamp within frame
          let groupMinX = Infinity, groupMaxX = -Infinity, groupMinY = Infinity, groupMaxY = -Infinity;
          modalSelectedLayerIds.forEach(id => {
            const o = origPositions[id];
            if (o) {
              groupMinX = Math.min(groupMinX, o.x + finalDx);
              groupMaxX = Math.max(groupMaxX, o.x + finalDx + o.w);
              groupMinY = Math.min(groupMinY, o.y + finalDy);
              groupMaxY = Math.max(groupMaxY, o.y + finalDy + o.h);
            }
          });

          let adjDx = finalDx;
          let adjDy = finalDy;
          if (groupMinX < 0) adjDx -= groupMinX;
          if (groupMaxX > el.w) adjDx -= (groupMaxX - el.w);
          if (groupMinY < 0) adjDy -= groupMinY;
          if (groupMaxY > el.h) adjDy -= (groupMaxY - el.h);

          modalSelectedLayerIds.forEach(id => {
            const lay = el.layers.find(l => l.id === id);
            const orig = origPositions[id];
            if (lay && orig) {
              const w = lay.w || orig.w || 40;
              const h = lay.h || orig.h || 20;
              const maxAllowedX = Math.max(0, el.w - w);
              const maxAllowedY = Math.max(0, el.h - h);
              lay.x = Math.max(0, Math.min(maxAllowedX, Math.round(orig.x + adjDx)));
              lay.y = Math.max(0, Math.min(maxAllowedY, Math.round(orig.y + adjDy)));
            }
          });

          // Live DOM positioning for smooth drag
          dom.masterModalPreviewBox.querySelectorAll('.master-modal-element-layer').forEach(lDom => {
            const id = lDom.getAttribute('data-layer-id');
            const lay = el.layers.find(l => l.id === id);
            if (lay) {
              lDom.style.left = `${lay.x}px`;
              lDom.style.top = `${lay.y}px`;
            }
          });

          // Render snap guide lines
          const overlay = document.getElementById('modalSmartGuidesOverlay');
          if (overlay) {
            let lines = '';
            if (snappedLineX !== null) {
              lines += `<div class="modal-smart-guide-line modal-guide-v" style="position:absolute;left:${snappedLineX}px;top:-400px;height:${el.h + 800}px;"></div>`;
            }
            if (snappedLineY !== null) {
              lines += `<div class="modal-smart-guide-line modal-guide-h" style="position:absolute;top:${snappedLineY}px;left:-400px;width:${el.w + 800}px;"></div>`;
            }
            overlay.innerHTML = lines;
          }
        };

        const onLayerUp = () => {
          window.removeEventListener('mousemove', onLayerMove);
          window.removeEventListener('mouseup', onLayerUp);
          const overlay = document.getElementById('modalSmartGuidesOverlay');
          if (overlay) overlay.innerHTML = '';
          if (hasMoved) pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        };

        window.addEventListener('mousemove', onLayerMove);
        window.addEventListener('mouseup', onLayerUp);
      };
    });

    // 4. Blank Canvas: Pan (Space/Middle Click) OR Marquee Drag Selection
    dom.masterModalCanvas.onmousedown = (e) => {
      if (e.target.closest('[data-modal-handle]') || e.target.closest('[data-layer-id]')) return;

      // Pan viewport: Space + Left Click OR Middle Click
      if (e.button === 1 || (e.button === 0 && (isSpacePressed || e.altKey))) {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const origPanX = modalPan.x;
        const origPanY = modalPan.y;
        dom.masterModalCanvas.style.cursor = 'grabbing';

        const onPanMove = (me) => {
          modalPan.x = origPanX + (me.clientX - startX);
          modalPan.y = origPanY + (me.clientY - startY);
          updateModalStageTransform();
        };
        const onPanUp = () => {
          window.removeEventListener('mousemove', onPanMove);
          window.removeEventListener('mouseup', onPanUp);
          dom.masterModalCanvas.style.cursor = isSpacePressed ? 'grab' : 'default';
        };
        window.addEventListener('mousemove', onPanMove);
        window.addEventListener('mouseup', onPanUp);
        return;
      }

      // Marquee selection box on empty canvas
      if (e.button === 0) {
        const rect = dom.masterModalCanvas.getBoundingClientRect();
        const startCanvasX = e.clientX - rect.left;
        const startCanvasY = e.clientY - rect.top;
        let marqueeEl = null;

        const onMarqueeMove = (me) => {
          const curCanvasX = me.clientX - rect.left;
          const curCanvasY = me.clientY - rect.top;
          const minX = Math.min(startCanvasX, curCanvasX);
          const maxX = Math.max(startCanvasX, curCanvasX);
          const minY = Math.min(startCanvasY, curCanvasY);
          const maxY = Math.max(startCanvasY, curCanvasY);

          if (Math.hypot(curCanvasX - startCanvasX, curCanvasY - startCanvasY) > 5) {
            if (!marqueeEl) {
              marqueeEl = document.createElement('div');
              marqueeEl.className = 'master-modal-marquee';
              dom.masterModalCanvas.appendChild(marqueeEl);
            }
            marqueeEl.style.left = `${minX}px`;
            marqueeEl.style.top = `${minY}px`;
            marqueeEl.style.width = `${maxX - minX}px`;
            marqueeEl.style.height = `${maxY - minY}px`;

            const stageMinX = (minX - modalPan.x) / modalZoom;
            const stageMaxX = (maxX - modalPan.x) / modalZoom;
            const stageMinY = (minY - modalPan.y) / modalZoom;
            const stageMaxY = (maxY - modalPan.y) / modalZoom;

            modalSelectedLayerIds.clear();
            (el.layers || []).forEach(lay => {
              const lx1 = lay.x || 0;
              const ly1 = lay.y || 0;
              const lx2 = lx1 + (lay.w || 40);
              const ly2 = ly1 + (lay.h || 20);
              const intersects = (lx1 <= stageMaxX && lx2 >= stageMinX && ly1 <= stageMaxY && ly2 >= stageMinY);
              if (intersects) {
                modalSelectedLayerIds.add(lay.id);
              }
            });

            dom.masterModalPreviewBox.querySelectorAll('.master-modal-element-layer').forEach(layerDom => {
              const id = layerDom.getAttribute('data-layer-id');
              layerDom.classList.toggle('is-selected', modalSelectedLayerIds.has(id));
            });
          }
        };

        const onMarqueeUp = () => {
          window.removeEventListener('mousemove', onMarqueeMove);
          window.removeEventListener('mouseup', onMarqueeUp);
          if (marqueeEl) {
            marqueeEl.remove();
            renderMasterExtraLayersList();
            renderMasterModalPreview();
          } else {
            modalSelectedLayerIds.clear();
            activeAccordionLayerIdx = null;
            renderMasterExtraLayersList();
            renderMasterModalPreview();
          }
        };

        window.addEventListener('mousemove', onMarqueeMove);
        window.addEventListener('mouseup', onMarqueeUp);
      }
    };
  }

  function renderMasterExtraLayersList() {
    const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
    if (!el || !dom.masterModalExtraLayersList) return;

    if (!el.layers || el.layers.length === 0) {
      dom.masterModalExtraLayersList.innerHTML = `<span style="font-size:11px;color:var(--text-secondary);font-style:italic;">No layers added yet. Use buttons above to add text or shapes.</span>`;
      return;
    }

    dom.masterModalExtraLayersList.innerHTML = el.layers.map((lay, idx) => {
      const isOpen = activeAccordionLayerIdx === idx;
      const isSel = modalSelectedLayerIds.has(lay.id);
      const isShape = lay.type === 'shape';
      const isText = lay.type === 'text';
      const isImage = lay.type === 'image';
      const layerBg = resolveSlotColor(lay.colorSlot, lay.color || lay.bg || '#219652');
      const layerOp = lay.opacity !== undefined ? lay.opacity : 1;
      const borderW = lay.borderWidth || 0;
      const borderCol = resolveSlotColor(lay.borderColorSlot, lay.borderColor || '#000000');
      const textCol = resolveSlotColor(lay.colorSlot, lay.color || '#162D43');

      const icon = isText ? '📝' : (isShape ? '🔷' : '🖼');
      const defaultName = isText ? `Text #${idx + 1}` : (isShape ? `Shape #${idx + 1}` : `Image #${idx + 1}`);

      return `
        <div class="master-layer-accordion-item ${isOpen ? 'is-open' : ''} ${isSel ? 'is-selected' : ''}" data-layer-idx="${idx}" data-layer-id="${lay.id}">
          <div class="master-layer-accordion-header" data-layer-idx="${idx}">
            <span class="master-layer-accordion-title">
              ${icon} ${escapeHtml(lay.name || defaultName)}
            </span>
            <div style="display:flex;align-items:center;gap:4px;">
              ${idx > 0 ? `<button class="btn-guide-action btn-move-layer-up" data-layer-idx="${idx}" title="Move Layer Up">▲</button>` : ''}
              ${idx < el.layers.length - 1 ? `<button class="btn-guide-action btn-move-layer-down" data-layer-idx="${idx}" title="Move Layer Down">▼</button>` : ''}
              <button class="btn-guide-action btn-del-extra-layer" data-layer-idx="${idx}" title="Remove Layer">✕</button>
            </div>
          </div>
          ${isOpen ? `
            <div class="master-layer-accordion-body">
              <div class="creator-prop-row">
                <label>Layer Name</label>
                <input type="text" class="creator-input layer-prop-name" data-layer-idx="${idx}" value="${escapeHtml(lay.name || '')}" placeholder="Layer name" />
              </div>

              ${isText ? `
                <div class="creator-prop-row">
                  <label>Text Content</label>
                  <textarea rows="2" class="creator-input layer-prop-text" data-layer-idx="${idx}">${escapeHtml(lay.text || '')}</textarea>
                </div>

                <div class="creator-prop-row">
                  <label>Font Family</label>
                  <select class="creator-select layer-prop-fontfamily" data-layer-idx="${idx}">
                    <option value="Rubik" ${(lay.fontFamily || 'Rubik') === 'Rubik' ? 'selected' : ''}>Rubik</option>
                    <option value="JetBrains Mono" ${lay.fontFamily === 'JetBrains Mono' ? 'selected' : ''}>JetBrains Mono</option>
                    <option value="Caudex" ${lay.fontFamily === 'Caudex' ? 'selected' : ''}>Caudex</option>
                    <option value="Playfair Display SC" ${lay.fontFamily === 'Playfair Display SC' ? 'selected' : ''}>Playfair Display SC</option>
                    <option value="Montserrat" ${lay.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                  </select>
                </div>

                <div class="creator-prop-row">
                  <label>Font Size (px)</label>
                  <input type="number" class="creator-input layer-prop-fontsize" data-layer-idx="${idx}" min="10" max="250" value="${lay.fontSize || 32}" />
                </div>

                <div class="creator-prop-row" style="display:flex;gap:12px;">
                  <label class="checkbox-label" style="font-size:11px;">
                    <input type="checkbox" class="layer-prop-bold" data-layer-idx="${idx}" ${lay.isBold ? 'checked' : ''} />
                    <span>Bold</span>
                  </label>
                  <label class="checkbox-label" style="font-size:11px;">
                    <input type="checkbox" class="layer-prop-uppercase" data-layer-idx="${idx}" ${lay.uppercase ? 'checked' : ''} />
                    <span>UPPERCASE</span>
                  </label>
                  <label class="checkbox-label" style="font-size:11px;">
                    <input type="checkbox" class="layer-prop-autocount" data-layer-idx="${idx}" ${lay.autoCount ? 'checked' : ''} />
                    <span>Auto Counter (-00-)</span>
                  </label>
                </div>

                <div class="creator-prop-row">
                  <label>Text Color</label>
                  <div class="creator-color-prop-row">
                    <select class="creator-select layer-prop-colorslot" data-layer-idx="${idx}" style="flex:1;">
                      <option value="">-- Custom Color --</option>
                      ${(creatorState.colors || []).map(c => `
                        <option value="${c.id}" ${lay.colorSlot === c.id ? 'selected' : ''}>${escapeHtml(c.name)} (${c.hex})</option>
                      `).join('')}
                    </select>
                    <input type="color" class="color-picker-input layer-prop-color" data-layer-idx="${idx}" value="${normalizeHex(textCol)}" />
                  </div>
                </div>

                <div class="creator-prop-row">
                  <label>Text Opacity</label>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <input type="range" class="creator-range-slider layer-prop-opacity" data-layer-idx="${idx}" min="0" max="100" value="${Math.round(layerOp * 100)}" />
                    <span class="range-val" style="min-width:36px;font-size:11px;">${Math.round(layerOp * 100)}%</span>
                  </div>
                </div>

                <div class="creator-prop-row">
                  <label>Text Effect</label>
                  <select class="creator-select layer-prop-effect" data-layer-idx="${idx}">
                    <option value="none" ${(lay.textEffect || 'none') === 'none' ? 'selected' : ''}>None</option>
                    <option value="emboss" ${lay.textEffect === 'emboss' ? 'selected' : ''}>Embossing</option>
                    <option value="glow" ${lay.textEffect === 'glow' ? 'selected' : ''}>Glow Aura</option>
                  </select>
                </div>

                ${(lay.textEffect && lay.textEffect !== 'none') ? `
                  <div class="creator-prop-row">
                    <label>Effect Color</label>
                    <div class="creator-color-prop-row">
                      <select class="creator-select layer-prop-effectcolorslot" data-layer-idx="${idx}" style="flex:1;">
                        <option value="">-- Custom Color --</option>
                        ${(creatorState.colors || []).map(c => `
                          <option value="${c.id}" ${lay.effectColorSlot === c.id ? 'selected' : ''}>${escapeHtml(c.name)} (${c.hex})</option>
                        `).join('')}
                      </select>
                      <input type="color" class="color-picker-input layer-prop-effectcolor" data-layer-idx="${idx}" value="${normalizeHex(resolveSlotColor(lay.effectColorSlot, lay.effectColor || '#ffffff'))}" />
                    </div>
                  </div>
                ` : ''}

                <div class="creator-prop-row">
                  <label>Text Align</label>
                  <select class="creator-select layer-prop-align" data-layer-idx="${idx}">
                    <option value="left" ${(lay.align || 'left') === 'left' ? 'selected' : ''}>Left</option>
                    <option value="center" ${lay.align === 'center' ? 'selected' : ''}>Center</option>
                    <option value="right" ${lay.align === 'right' ? 'selected' : ''}>Right</option>
                  </select>
                </div>
              ` : ''}

              ${isShape ? `
                <div class="creator-prop-row">
                  <label>Shape Archetype</label>
                  <select class="creator-select layer-prop-shapetype" data-layer-idx="${idx}">
                    <option value="rectangle" ${(lay.shapeType || 'rectangle') === 'rectangle' ? 'selected' : ''}>Rectangle</option>
                    <option value="circle" ${lay.shapeType === 'circle' ? 'selected' : ''}>Circle / Ellipse</option>
                    <option value="pill" ${lay.shapeType === 'pill' ? 'selected' : ''}>Pill / Capsule</option>
                    <option value="divider" ${lay.shapeType === 'divider' ? 'selected' : ''}>Line / Divider</option>
                  </select>
                </div>

                <div class="creator-prop-row">
                  <label>Fill Color</label>
                  <div class="creator-color-prop-row">
                    <select class="creator-select layer-prop-colorslot" data-layer-idx="${idx}" style="flex:1;">
                      <option value="">-- Custom Color --</option>
                      ${(creatorState.colors || []).map(c => `
                        <option value="${c.id}" ${lay.colorSlot === c.id ? 'selected' : ''}>${escapeHtml(c.name)} (${c.hex})</option>
                      `).join('')}
                    </select>
                    <input type="color" class="color-picker-input layer-prop-bg" data-layer-idx="${idx}" value="${normalizeHex(layerBg)}" />
                  </div>
                </div>

                <div class="creator-prop-row">
                  <label>Fill Opacity</label>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <input type="range" class="creator-range-slider layer-prop-opacity" data-layer-idx="${idx}" min="0" max="100" value="${Math.round(layerOp * 100)}" />
                    <span class="range-val" style="min-width:36px;font-size:11px;">${Math.round(layerOp * 100)}%</span>
                  </div>
                </div>

                <div class="creator-prop-row">
                  <label>Border Width</label>
                  <input type="number" class="creator-input layer-prop-borderwidth" data-layer-idx="${idx}" min="0" max="20" value="${borderW}" />
                </div>

                <div class="creator-prop-row">
                  <label>Border Color</label>
                  <div class="creator-color-prop-row">
                    <select class="creator-select layer-prop-bordercolorslot" data-layer-idx="${idx}" style="flex:1;">
                      <option value="">-- Custom Color --</option>
                      ${(creatorState.colors || []).map(c => `
                        <option value="${c.id}" ${lay.borderColorSlot === c.id ? 'selected' : ''}>${escapeHtml(c.name)} (${c.hex})</option>
                      `).join('')}
                    </select>
                    <input type="color" class="color-picker-input layer-prop-bordercolor" data-layer-idx="${idx}" value="${normalizeHex(borderCol)}" />
                  </div>
                </div>

                <div class="creator-prop-row">
                  <label>Corner Radius</label>
                  <input type="number" class="creator-input layer-prop-radius" data-layer-idx="${idx}" min="0" max="50" value="${lay.radius || 0}" />
                </div>
              ` : ''}

              ${isImage ? `
                <div class="creator-prop-row">
                  <label>Opacity</label>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <input type="range" class="creator-range-slider layer-prop-opacity" data-layer-idx="${idx}" min="0" max="100" value="${Math.round(layerOp * 100)}" />
                    <span class="range-val" style="min-width:36px;font-size:11px;">${Math.round(layerOp * 100)}%</span>
                  </div>
                </div>
              ` : ''}

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">
                <div>
                  <label style="font-size:10px;color:var(--text-secondary);">Width (px)</label>
                  <input type="number" class="creator-input layer-prop-w" data-layer-idx="${idx}" min="4" value="${lay.w || 40}" />
                </div>
                <div>
                  <label style="font-size:10px;color:var(--text-secondary);">Height (px)</label>
                  <input type="number" class="creator-input layer-prop-h" data-layer-idx="${idx}" min="4" value="${lay.h || 40}" />
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Bind Accordion Header Toggle, Reorder, and Delete
    dom.masterModalExtraLayersList.querySelectorAll('.master-layer-accordion-header').forEach(header => {
      header.onclick = (e) => {
        if (e.target.closest('button')) return;
        const idx = Number(header.getAttribute('data-layer-idx'));
        activeAccordionLayerIdx = (activeAccordionLayerIdx === idx) ? null : idx;
        if (activeAccordionLayerIdx !== null && el.layers[activeAccordionLayerIdx]) {
          modalSelectedLayerIds.clear();
          modalSelectedLayerIds.add(el.layers[activeAccordionLayerIdx].id);
        }
        renderMasterExtraLayersList();
        renderMasterModalPreview();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.btn-move-layer-up').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute('data-layer-idx'));
        if (idx > 0) {
          const temp = el.layers[idx];
          el.layers[idx] = el.layers[idx - 1];
          el.layers[idx - 1] = temp;
          activeAccordionLayerIdx = idx - 1;
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterExtraLayersList();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.btn-move-layer-down').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute('data-layer-idx'));
        if (idx < el.layers.length - 1) {
          const temp = el.layers[idx];
          el.layers[idx] = el.layers[idx + 1];
          el.layers[idx + 1] = temp;
          activeAccordionLayerIdx = idx + 1;
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterExtraLayersList();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.btn-del-extra-layer').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute('data-layer-idx'));
        const removed = el.layers.splice(idx, 1)[0];
        if (removed) modalSelectedLayerIds.delete(removed.id);
        if (activeAccordionLayerIdx === idx) activeAccordionLayerIdx = null;
        pushModalHistorySnapshot();
        syncMasterElementToInstances(el);
        renderMasterExtraLayersList();
        renderMasterModalPreview();
      };
    });

    // Layer Inputs
    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-name').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].name = e.target.value;
          const isText = el.layers[idx].type === 'text';
          const isShape = el.layers[idx].type === 'shape';
          const icon = isText ? '📝' : (isShape ? '🔷' : '🖼');
          const titleEl = inp.closest('.master-layer-accordion-item')?.querySelector('.master-layer-accordion-title');
          if (titleEl) titleEl.textContent = `${icon} ${e.target.value}`;
        }
      };
      inp.onchange = () => {
        syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-text').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].text = e.target.value;
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => pushModalHistorySnapshot();
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-fontfamily').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].fontFamily = e.target.value;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-fontsize').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].fontSize = Math.max(8, Number(e.target.value) || 32);
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => pushModalHistorySnapshot();
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-bold').forEach(chk => {
      chk.onchange = (e) => {
        const idx = Number(chk.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].isBold = e.target.checked;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-uppercase').forEach(chk => {
      chk.onchange = (e) => {
        const idx = Number(chk.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].uppercase = e.target.checked;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-autocount').forEach(chk => {
      chk.onchange = (e) => {
        const idx = Number(chk.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].autoCount = e.target.checked;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-shapetype').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].shapeType = e.target.value;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-colorslot').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].colorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.layers[idx].color = chosen.hex;
            el.layers[idx].bg = chosen.hex;
            const pick = sel.parentElement.querySelector('.layer-prop-color') || sel.parentElement.querySelector('.layer-prop-bg');
            if (pick) pick.value = normalizeHex(chosen.hex);
          }
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    // Non-destructive live preview color pickers
    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-color').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].color = e.target.value;
          el.layers[idx].colorSlot = '';
          const slotSel = inp.parentElement.querySelector('.layer-prop-colorslot');
          if (slotSel) slotSel.value = '';
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => {
        syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-bg').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].bg = e.target.value;
          el.layers[idx].color = e.target.value;
          el.layers[idx].colorSlot = '';
          const slotSel = inp.parentElement.querySelector('.layer-prop-colorslot');
          if (slotSel) slotSel.value = '';
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => {
        syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-opacity').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].opacity = Number(e.target.value) / 100;
          const readout = inp.parentElement.querySelector('.range-val');
          if (readout) readout.textContent = `${e.target.value}%`;
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => {
        syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-effect').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].textEffect = e.target.value;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterExtraLayersList();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-effectcolorslot').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].effectColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.layers[idx].effectColor = chosen.hex;
            const pick = sel.parentElement.querySelector('.layer-prop-effectcolor');
            if (pick) pick.value = normalizeHex(chosen.hex);
          }
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-effectcolor').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].effectColor = e.target.value;
          el.layers[idx].effectColorSlot = '';
          const slotSel = inp.parentElement.querySelector('.layer-prop-effectcolorslot');
          if (slotSel) slotSel.value = '';
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => {
        syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-align').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].align = e.target.value;
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-borderwidth').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].borderWidth = Number(e.target.value) || 0;
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => pushModalHistorySnapshot();
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-bordercolorslot').forEach(sel => {
      sel.onchange = (e) => {
        const idx = Number(sel.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].borderColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.layers[idx].borderColor = chosen.hex;
            const pick = sel.parentElement.querySelector('.layer-prop-bordercolor');
            if (pick) pick.value = normalizeHex(chosen.hex);
          }
          syncMasterElementToInstances(el);
          pushModalHistorySnapshot();
          renderMasterModalPreview();
        }
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-bordercolor').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].borderColor = e.target.value;
          el.layers[idx].borderColorSlot = '';
          const slotSel = inp.parentElement.querySelector('.layer-prop-bordercolorslot');
          if (slotSel) slotSel.value = '';
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => {
        syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-radius').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          el.layers[idx].radius = Number(e.target.value) || 0;
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => pushModalHistorySnapshot();
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-w').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          const maxW = Math.max(4, el.w - (el.layers[idx].x || 0));
          el.layers[idx].w = Math.max(4, Math.min(maxW, Number(e.target.value) || 40));
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => pushModalHistorySnapshot();
    });

    dom.masterModalExtraLayersList.querySelectorAll('.layer-prop-h').forEach(inp => {
      inp.oninput = (e) => {
        const idx = Number(inp.getAttribute('data-layer-idx'));
        if (el.layers?.[idx]) {
          const maxH = Math.max(4, el.h - (el.layers[idx].y || 0));
          el.layers[idx].h = Math.max(4, Math.min(maxH, Number(e.target.value) || 40));
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
      inp.onchange = () => pushModalHistorySnapshot();
    });
  }

  function fitCreatorZoom() {
    if (!dom.creatorScrollContainer) return;
    const contW = dom.creatorScrollContainer.clientWidth - 120;
    const stageW = 3 * SLIDE_W + 100;
    const z = Math.max(0.18, Math.min(0.5, contW / stageW));
    setCreatorZoom(z);
  }

  function setCreatorZoom(z, focalPoint) {
    const oldZoom = creatorState.zoom;
    const clamped = Math.max(0.12, Math.min(1.5, Number(z.toFixed(3))));
    if (Math.abs(clamped - oldZoom) < 0.001) return;

    let offsetX = 0, offsetY = 0;
    if (focalPoint && dom.creatorStageWrapper) {
      const stageRect = dom.creatorStageWrapper.getBoundingClientRect();
      offsetX = focalPoint.clientX - stageRect.left;
      offsetY = focalPoint.clientY - stageRect.top;
    }

    creatorState.zoom = clamped;

    if (dom.creatorStageWrapper) {
      dom.creatorStageWrapper.style.transform = `scale(${creatorState.zoom})`;
      dom.creatorStageWrapper.style.transformOrigin = '0 0';
    }
    if (dom.creatorZoomReadout) {
      dom.creatorZoomReadout.textContent = `${Math.round(creatorState.zoom * 100)}%`;
    }

    if (focalPoint && dom.creatorScrollContainer) {
      const scaleRatio = clamped / oldZoom;
      const newOffsetX = offsetX * scaleRatio;
      const newOffsetY = offsetY * scaleRatio;
      dom.creatorScrollContainer.scrollLeft += Math.round(newOffsetX - offsetX);
      dom.creatorScrollContainer.scrollTop += Math.round(newOffsetY - offsetY);
    }
  }

  function initCreatorListeners() {
    // Canvas Panning for Preset Creator (Space + Left Click OR Alt + Middle Click OR Middle Click)
    const handleCreatorPanStart = (e) => {
      if ((isSpacePressed && e.button === 0) || (e.altKey && e.button === 1) || e.button === 1) {
        e.preventDefault();
        panSession = {
          container: dom.creatorScrollContainer,
          startX: e.clientX,
          startY: e.clientY,
          scrollLeft: dom.creatorScrollContainer.scrollLeft,
          scrollTop: dom.creatorScrollContainer.scrollTop
        };
        dom.creatorScrollContainer.classList.add('is-panning');
      }
    };

    if (dom.creatorScrollContainer) {
      dom.creatorScrollContainer.addEventListener('mousedown', handleCreatorPanStart);

      // Mouse Wheel Zoom for Preset Creator
      dom.creatorScrollContainer.addEventListener('wheel', (e) => {
        // Prevent default scrolling and zoom smoothly centered on cursor
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        setCreatorZoom(creatorState.zoom * factor, { clientX: e.clientX, clientY: e.clientY });
      }, { passive: false });

      // Blank space click deselects active element or guideline and resets to Preset Board Inspector
      dom.creatorScrollContainer.addEventListener('click', (e) => {
        if (
          e.target.closest('.creator-scene-element') ||
          e.target.closest('.scene-element') ||
          e.target.closest('.selection-box') ||
          e.target.closest('.creator-master-card') ||
          e.target.closest('.creator-interactive-guide-h') ||
          e.target.closest('.creator-interactive-guide-v') ||
          e.target.closest('button') ||
          e.target.closest('input') ||
          e.target.closest('select') ||
          e.target.closest('textarea')
        ) {
          return;
        }
        if (creatorState.selectedId !== null || creatorState.selectedGuideId !== null) {
          creatorState.selectedId = null;
          creatorState.selectedGuideId = null;
          renderPresetCreatorAll();
        }
      });
    }

    if (dom.creatorStageWrapper) {
      dom.creatorStageWrapper.addEventListener('mousedown', handleCreatorPanStart);

      // Dedicated double-click handler on the stage wrapper (works for both unselected and selected elements)
      dom.creatorStageWrapper.addEventListener('dblclick', (e) => {
        if (e.target.closest('.creator-master-plus-btn')) return;

        const selBox = e.target.closest('#creatorActiveSelectionBox');
        const sceneEl = e.target.closest('.creator-scene-element');
        let targetEl = null;

        if (selBox && creatorState.selectedId) {
          targetEl = creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
                     creatorState.elements.find(x => x.id === creatorState.selectedId);
        } else if (sceneEl) {
          const id = sceneEl.getAttribute('data-creator-el-id');
          targetEl = creatorState.masterElements.find(x => x.id === id) ||
                     creatorState.elements.find(x => x.id === id);
        }

        if (targetEl) {
          e.preventDefault();
          e.stopPropagation();
          if (targetEl.isMaster) {
            openMasterElementEditor(targetEl.id);
          } else if (dom.creatorInspElText) {
            dom.creatorInspElText.focus();
            dom.creatorInspElText.select();
          }
        }
      });
    }

    // Mode Switch Buttons
    if (dom.btnSwitchStudio) dom.btnSwitchStudio.onclick = () => setAppWorkspaceMode('studio');
    if (dom.btnSwitchPresetCreator) dom.btnSwitchPresetCreator.onclick = () => setAppWorkspaceMode('creator');
    if (dom.btnNewPreset) dom.btnNewPreset.onclick = () => createNewPreset();
    if (dom.btnModifyPreset) dom.btnModifyPreset.onclick = () => openPresetInCreator(state.themeId);

    // Save, Export, Import Preset (Sidebar & Topbar)
    if (dom.btnCreatorSavePreset) dom.btnCreatorSavePreset.onclick = saveCurrentCreatorPreset;
    if (dom.btnCreatorExportJson) dom.btnCreatorExportJson.onclick = exportCreatorPresetJson;
    if (dom.btnTopSaveToStudio) dom.btnTopSaveToStudio.onclick = saveCurrentCreatorPreset;
    if (dom.btnTopDownloadPreset) dom.btnTopDownloadPreset.onclick = exportCreatorPresetJson;

    if (dom.creatorImportJsonInput) {
      dom.creatorImportJsonInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) importCreatorPresetJson(file);
        e.target.value = '';
      };
    }
    if (dom.topUploadPresetInput) {
      dom.topUploadPresetInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) importCreatorPresetJson(file);
        e.target.value = '';
      };
    }

    // Zoom Buttons
    if (dom.btnCreatorZoomIn) dom.btnCreatorZoomIn.onclick = () => {
      const r = dom.creatorScrollContainer ? dom.creatorScrollContainer.getBoundingClientRect() : null;
      const focal = r ? { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 } : null;
      setCreatorZoom(creatorState.zoom + 0.05, focal);
    };
    if (dom.btnCreatorZoomOut) dom.btnCreatorZoomOut.onclick = () => {
      const r = dom.creatorScrollContainer ? dom.creatorScrollContainer.getBoundingClientRect() : null;
      const focal = r ? { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 } : null;
      setCreatorZoom(creatorState.zoom - 0.05, focal);
    };
    if (dom.btnCreatorZoomFit) dom.btnCreatorZoomFit.onclick = fitCreatorZoom;
    if (dom.creatorToggleGuides) dom.creatorToggleGuides.onchange = renderCreatorGuidelines;

    // Show Cut Gaps Toggle
    if (dom.creatorToggleGaps) {
      dom.creatorToggleGaps.onchange = (e) => {
        pushCreatorHistorySnapshot();
        creatorState.showSeamGaps = e.target.checked;
        renderPresetCreatorAll();
      };
    }

    // Clean Up Canvas Button (Resets master elements into staging zone)
    if (dom.btnCreatorCleanUpCanvas) {
      dom.btnCreatorCleanUpCanvas.onclick = () => {
        pushCreatorHistorySnapshot();
        let curX = 100;
        creatorState.masterElements.forEach(el => {
          el.y = Math.round((CREATOR_STAGING_H - (el.h || 60)) / 2);
          el.x = curX;
          curX += (el.w || 320) + 40;
        });
        renderPresetCreatorAll();
      };
    }

    // Add New Text Modifier / Accent Symbol
    if (dom.btnCreatorAddModifier) {
      dom.btnCreatorAddModifier.onclick = () => {
        const sym = prompt('Trigger symbol for new modifier (e.g. ~, ^, #, _):', '~');
        if (!sym) return;
        const name = prompt('Name for this modifier:', 'Custom Accent');
        if (!name) return;
        pushCreatorHistorySnapshot();
        creatorState.modifiers.push({
          id: 'mod-' + Date.now(),
          symbol: sym.trim(),
          name: name.trim(),
          hex: '#C19358'
        });
        renderPresetCreatorAll();
      };
    }

    // Palette & Details Listeners
    if (dom.creatorPresetNameInput) {
      dom.creatorPresetNameInput.oninput = (e) => {
        creatorState.name = e.target.value;
      };
    }
    if (dom.creatorPresetArchetype) {
      dom.creatorPresetArchetype.onchange = (e) => {
        creatorState.archetype = e.target.value;
        if (dom.creatorPresetDomainBadge) {
          dom.creatorPresetDomainBadge.textContent = e.target.value === 'magic' ? 'Magic' : 'GameDev';
        }
      };
    }
    if (dom.creatorPatternSelect) {
      dom.creatorPatternSelect.onchange = (e) => {
        creatorState.patternType = e.target.value;
      };
    }

    // Add New Custom Color to Palette
    if (dom.btnCreatorAddColor) {
      dom.btnCreatorAddColor.onclick = () => {
        const name = prompt('Name for new Palette Color (e.g. Subtitle Color):', 'Subtitle Color');
        if (!name) return;
        const newColor = {
          id: 'col-' + Date.now(),
          name: name,
          hex: '#C19358',
          trigger: ''
        };
        creatorState.colors.push(newColor);
        renderPresetCreatorAll();
      };
    }

    // Custom Font Upload (.ttf, .otf, .woff, .woff2)
    if (dom.creatorFontUploadInput) {
      dom.creatorFontUploadInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\s-]/g, '').trim() || 'CustomFont';
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const fontFace = new FontFace(fontName, reader.result);
            fontFace.load().then(loadedFace => {
              document.fonts.add(loadedFace);
              creatorState.customFonts.push({ name: fontName });

              // Add to all font dropdowns
              document.querySelectorAll('.font-family-select').forEach(sel => {
                const opt = document.createElement('option');
                opt.value = fontName;
                opt.textContent = `${fontName} (Uploaded)`;
                sel.appendChild(opt);
              });

              alert(`Font "${fontName}" uploaded and registered successfully!`);
              renderPresetCreatorAll();
            }).catch(err => {
              alert('Could not parse font file. Ensure it is a valid TTF/OTF/WOFF font.');
            });
          } catch (err) {
            alert('Failed to load font file.');
          }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = '';
      };
    }

    // Guidelines Add
    if (dom.btnCreatorAddGuideH) {
      dom.btnCreatorAddGuideH.onclick = () => {
        const newGuide = { id: 'g-' + Date.now(), type: 'h', coord: 300, label: 'Custom Y=300' };
        creatorState.guidelines.push(newGuide);
        creatorState.selectedGuideId = newGuide.id;
        renderPresetCreatorAll();
      };
    }
    if (dom.btnCreatorAddGuideV) {
      dom.btnCreatorAddGuideV.onclick = () => {
        const newGuide = { id: 'g-' + Date.now(), type: 'v', coord: 540, label: 'Custom X=540' };
        creatorState.guidelines.push(newGuide);
        creatorState.selectedGuideId = newGuide.id;
        renderPresetCreatorAll();
      };
    }
    if (dom.btnCreatorResetGuides) {
      dom.btnCreatorResetGuides.onclick = () => {
        creatorState.guidelines = [
          { id: 'g1', type: 'h', coord: 66, label: 'Top Margin (66px)' },
          { id: 'g2', type: 'h', coord: 675, label: 'Vertical Center (675px)', isFixedCenter: true },
          { id: 'g3', type: 'h', coord: 1286, label: 'Bottom Margin (1286px)' },
          { id: 'g4', type: 'v', coord: 96, label: 'Left Margin (96px)' },
          { id: 'g5', type: 'v', coord: 540, label: 'Horizontal Center (540px)', isFixedCenter: true },
          { id: 'g6', type: 'v', coord: 984, label: 'Right Margin (984px)' }
        ];
        creatorState.selectedGuideId = null;
        renderPresetCreatorAll();
      };
    }

    // Add New Default Element
    if (dom.btnCreatorAddNewDefaultEl) {
      dom.btnCreatorAddNewDefaultEl.onclick = () => {
        const name = prompt('Name for the new Master Element:', 'Badge Pill');
        if (!name) return;
        pushCreatorHistorySnapshot();
        const count = creatorState.masterElements.length + 1;
        const newEl = {
          id: 'master-' + Date.now(),
          isMaster: true,
          type: 'compound',
          layerGroup: 'foreground',
          role: 'custom-master',
          name: name,
          icon: '★',
          text: `[ ${name.toUpperCase()} ]`,
          fontFamily: creatorState.bodyFont || 'Rubik',
          fontSize: 32,
          isBold: true,
          colorSlot: 'col-primary',
          color: creatorState.colors.find(c => c.id === 'col-primary')?.hex || '#162D43',
          accentColor: creatorState.colors.find(c => c.id === 'col-secondary')?.hex || '#219652',
          anchor: 'nw',
          x: Math.min(2700, 100 + (count - 1) * 340),
          y: Math.round((CREATOR_STAGING_H - 60) / 2),
          w: 320,
          h: 60,
          rotation: 0,
          layers: [
            {
              id: 'layer-text-' + Date.now(),
              type: 'text',
              name: 'Text',
              x: 0,
              y: 0,
              w: 320,
              h: 60,
              text: `[ ${name.toUpperCase()} ]`,
              fontFamily: creatorState.bodyFont || 'Rubik',
              fontSize: 32,
              isBold: true,
              colorSlot: 'col-primary',
              color: creatorState.colors.find(c => c.id === 'col-primary')?.hex || '#162D43',
              accentColor: creatorState.colors.find(c => c.id === 'col-secondary')?.hex || '#219652',
              align: 'center',
              autoCount: false
            }
          ]
        };
        creatorState.masterElements.push(newEl);
        creatorState.selectedId = newEl.id;
        renderPresetCreatorAll();
      };
    }

    // Inspector element edit bindings
    const getActiveCreatorSel = () => {
      return creatorState.masterElements.find(x => x.id === creatorState.selectedId) ||
             creatorState.elements.find(x => x.id === creatorState.selectedId);
    };

    if (dom.creatorInspElName) {
      dom.creatorInspElName.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) { el.name = e.target.value; renderPresetCreatorAll(); }
      };
    }
    if (dom.creatorInspElText) {
      dom.creatorInspElText.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.text = e.target.value;
          if (Array.isArray(el.layers)) {
            const prim = el.layers.find(l => l.type === 'text');
            if (prim) prim.text = e.target.value;
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElFont) {
      dom.creatorInspElFont.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.fontFamily = e.target.value;
          if (Array.isArray(el.layers)) {
            const prim = el.layers.find(l => l.type === 'text');
            if (prim) prim.fontFamily = e.target.value;
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElFontSize) {
      dom.creatorInspElFontSize.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.fontSize = Number(e.target.value);
          if (Array.isArray(el.layers)) {
            const prim = el.layers.find(l => l.type === 'text');
            if (prim) prim.fontSize = Number(e.target.value);
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElColorSlot) {
      dom.creatorInspElColorSlot.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.colorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.color = chosen.hex;
            if (dom.creatorInspElColor) dom.creatorInspElColor.value = normalizeHex(chosen.hex);
            if (dom.creatorInspElColorHex) dom.creatorInspElColorHex.value = chosen.hex;
          }
          if (Array.isArray(el.layers)) {
            const prim = el.layers.find(l => l.type === 'text');
            if (prim) {
              prim.colorSlot = e.target.value;
              if (chosen) prim.color = chosen.hex;
            }
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElColor) {
      dom.creatorInspElColor.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.color = e.target.value;
          el.colorSlot = ''; // Switched to custom color
          if (dom.creatorInspElColorSlot) dom.creatorInspElColorSlot.value = '';
          if (dom.creatorInspElColorHex) dom.creatorInspElColorHex.value = e.target.value;
          if (Array.isArray(el.layers)) {
            const prim = el.layers.find(l => l.type === 'text');
            if (prim) {
              prim.color = e.target.value;
              prim.colorSlot = '';
            }
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElOpacity) {
      dom.creatorInspElOpacity.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.opacity = Number(e.target.value) / 100;
          if (dom.creatorInspElOpacityVal) dom.creatorInspElOpacityVal.textContent = `${e.target.value}%`;
          if (Array.isArray(el.layers)) {
            const prim = el.layers.find(l => l.type === 'text');
            if (prim) prim.opacity = el.opacity;
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }

    // Inspector Base Shape / Background Fill
    if (dom.creatorInspElHasBg) {
      dom.creatorInspElHasBg.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.hasBg = e.target.checked;
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElBgColorSlot) {
      dom.creatorInspElBgColorSlot.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.bgColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.bgColor = chosen.hex;
            if (dom.creatorInspElBgColor) dom.creatorInspElBgColor.value = normalizeHex(chosen.hex);
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElBgColor) {
      dom.creatorInspElBgColor.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.bgColor = e.target.value;
          el.bgColorSlot = '';
          if (dom.creatorInspElBgColorSlot) dom.creatorInspElBgColorSlot.value = '';
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElBgOpacity) {
      dom.creatorInspElBgOpacity.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.bgOpacity = Number(e.target.value) / 100;
          if (dom.creatorInspElBgOpacityVal) dom.creatorInspElBgOpacityVal.textContent = `${e.target.value}%`;
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }

    // Inspector Border / Outline
    if (dom.creatorInspElBorderWidth) {
      dom.creatorInspElBorderWidth.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.borderWidth = Number(e.target.value) || 0;
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElBorderColorSlot) {
      dom.creatorInspElBorderColorSlot.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.borderColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.borderColor = chosen.hex;
            if (dom.creatorInspElBorderColor) dom.creatorInspElBorderColor.value = normalizeHex(chosen.hex);
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElBorderColor) {
      dom.creatorInspElBorderColor.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.borderColor = e.target.value;
          el.borderColorSlot = '';
          if (dom.creatorInspElBorderColorSlot) dom.creatorInspElBorderColorSlot.value = '';
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElBorderOpacity) {
      dom.creatorInspElBorderOpacity.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.borderOpacity = Number(e.target.value) / 100;
          if (dom.creatorInspElBorderOpacityVal) dom.creatorInspElBorderOpacityVal.textContent = `${e.target.value}%`;
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }

    // Inspector Text Effect (Glow / Emboss)
    if (dom.creatorInspElEffect) {
      dom.creatorInspElEffect.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.textEffect = e.target.value;
          if (el.isMaster) syncMasterElementToInstances(el);
          renderCreatorInspector();
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElEffectColorSlot) {
      dom.creatorInspElEffectColorSlot.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.effectColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.effectColor = chosen.hex;
            if (dom.creatorInspElEffectColor) dom.creatorInspElEffectColor.value = normalizeHex(chosen.hex);
          }
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElEffectColor) {
      dom.creatorInspElEffectColor.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.effectColor = e.target.value;
          el.effectColorSlot = '';
          if (dom.creatorInspElEffectColorSlot) dom.creatorInspElEffectColorSlot.value = '';
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElEffectOpacity) {
      dom.creatorInspElEffectOpacity.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.effectOpacity = Number(e.target.value) / 100;
          if (dom.creatorInspElEffectOpacityVal) dom.creatorInspElEffectOpacityVal.textContent = `${e.target.value}%`;
          if (el.isMaster) syncMasterElementToInstances(el);
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElAccent) {
      dom.creatorInspElAccent.oninput = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.accentColor = e.target.value;
          if (dom.creatorInspElAccentHex) dom.creatorInspElAccentHex.value = e.target.value;
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElAutoCount) {
      dom.creatorInspElAutoCount.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (el) {
          el.autoCount = e.target.checked;
          renderPresetCreatorAll();
        }
      };
    }
    if (dom.creatorInspElAddToAllSlides) {
      dom.creatorInspElAddToAllSlides.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (!el || el.isMaster) return;
        pushCreatorHistorySnapshot();
        if (e.target.checked) {
          el.addedToAllSlides = true;
          if (!el.linkGroupId) el.linkGroupId = el.id;
          const currentSlide = Math.floor(el.x / SLIDE_W);
          const localX = el.x - currentSlide * SLIDE_W;
          for (let s = 0; s < 3; s++) {
            if (s === currentSlide) continue;
            const targetX = s * SLIDE_W + localX;
            const exists = creatorState.elements.some(x => Math.floor(x.x / SLIDE_W) === s && (x.linkGroupId === el.linkGroupId || x.role === el.role));
            if (!exists) {
              const copy = JSON.parse(JSON.stringify(el));
              copy.id = genId('c-el');
              copy.x = targetX;
              copy.addedToAllSlides = true;
              copy.linkAcrossSlides = el.linkAcrossSlides;
              copy.linkGroupId = el.linkGroupId;
              creatorState.elements.push(copy);
            }
          }
        } else {
          el.addedToAllSlides = false;
          el.linkAcrossSlides = false;
        }
        renderPresetCreatorAll();
      };
    }

    if (dom.creatorInspElLinkAcrossSlides) {
      dom.creatorInspElLinkAcrossSlides.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (!el || el.isMaster) return;
        pushCreatorHistorySnapshot();
        el.linkAcrossSlides = e.target.checked;
        if (el.linkAcrossSlides) {
          if (!el.linkGroupId) el.linkGroupId = el.id;
          syncLinkedSlideElements(el);
        }
        renderPresetCreatorAll();
      };
    }

    if (dom.creatorInspAnchorGrid) {
      dom.creatorInspAnchorGrid.onclick = (e) => {
        const cell = e.target.closest('[data-anchor]');
        if (!cell) return;
        const el = getActiveCreatorSel();
        if (!el) return;
        pushCreatorHistorySnapshot();
        el.anchor = cell.getAttribute('data-anchor');
        if (el.isMaster) syncMasterElementToInstances(el);
        renderPresetCreatorAll();
      };
    }
    if (dom.creatorInspElIsMaster) {
      dom.creatorInspElIsMaster.onchange = (e) => {
        const el = getActiveCreatorSel();
        if (!el) return;
        if (e.target.checked && !el.isMaster) {
          // Move from elements to masterElements
          creatorState.elements = creatorState.elements.filter(x => x.id !== el.id);
          el.isMaster = true;
          creatorState.masterElements.push(el);
        } else if (!e.target.checked && el.isMaster) {
          creatorState.masterElements = creatorState.masterElements.filter(x => x.id !== el.id);
          el.isMaster = false;
          el.x = 1080 + 120;
          el.y = 540;
          creatorState.elements.push(el);
        }
        renderPresetCreatorAll();
      };
    }
    if (dom.btnCreatorDuplicateEl) {
      dom.btnCreatorDuplicateEl.onclick = () => {
        const el = getActiveCreatorSel();
        if (!el) return;
        const copy = JSON.parse(JSON.stringify(el));
        copy.id = genId('c-el');
        if (el.isMaster) {
          copy.name = `${el.name} (Copy)`;
          creatorState.masterElements.push(copy);
        } else {
          copy.x += 40;
          copy.y += 40;
          creatorState.elements.push(copy);
        }
        creatorState.selectedId = copy.id;
        renderPresetCreatorAll();
      };
    }
    if (dom.btnCreatorDeleteEl) {
      dom.btnCreatorDeleteEl.onclick = () => {
        const el = getActiveCreatorSel();
        if (!el) return;
        if (el.isMaster) {
          creatorState.masterElements = creatorState.masterElements.filter(x => x.id !== el.id);
        } else {
          creatorState.elements = creatorState.elements.filter(x => x.id !== el.id);
        }
        creatorState.selectedId = null;
        renderPresetCreatorAll();
      };
    }

    // Modal Editor Listeners
    if (dom.btnMasterModalClose) dom.btnMasterModalClose.onclick = closeMasterElementEditor;
    if (dom.btnMasterModalDone) dom.btnMasterModalDone.onclick = closeMasterElementEditor;
    if (dom.btnMasterModalZoomReset) {
      dom.btnMasterModalZoomReset.onclick = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          fitModalViewport(el);
          renderMasterModalPreview();
        }
      };
    }

    if (dom.masterModalNameInput) {
      dom.masterModalNameInput.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.name = e.target.value;
          if (dom.masterModalTitle) dom.masterModalTitle.textContent = el.name;
          syncMasterElementToInstances(el);
        }
      };
      dom.masterModalNameInput.onchange = () => pushModalHistorySnapshot();
    }

    if (dom.masterModalBoxW) {
      dom.masterModalBoxW.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.w = Math.max(20, Number(e.target.value) || 320);
          (el.layers || []).forEach(lay => {
            if (lay.w > el.w) lay.w = el.w;
            if (((lay.x || 0) + (lay.w || 0)) > el.w) {
              lay.x = Math.max(0, el.w - (lay.w || 0));
            }
          });
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
          renderMasterExtraLayersList();
        }
      };
      dom.masterModalBoxW.onchange = () => pushModalHistorySnapshot();
    }

    if (dom.masterModalBoxH) {
      dom.masterModalBoxH.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.h = Math.max(10, Number(e.target.value) || 60);
          (el.layers || []).forEach(lay => {
            if (lay.h > el.h) lay.h = el.h;
            if (((lay.y || 0) + (lay.h || 0)) > el.h) {
              lay.y = Math.max(0, el.h - (lay.h || 0));
            }
          });
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
          renderMasterExtraLayersList();
        }
      };
      dom.masterModalBoxH.onchange = () => pushModalHistorySnapshot();
    }

    if (dom.masterModalAnchorGrid) {
      dom.masterModalAnchorGrid.onclick = (e) => {
        const cell = e.target.closest('[data-anchor]');
        if (!cell) return;
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (!el) return;
        el.anchor = cell.getAttribute('data-anchor');
        dom.masterModalAnchorGrid.querySelectorAll('.anchor-cell').forEach(c => {
          c.classList.toggle('active', c === cell);
        });
        pushModalHistorySnapshot();
        syncMasterElementToInstances(el);
        renderMasterModalPreview();
      };
    }

    // Modal Background Fill
    if (dom.masterModalHasBg) {
      dom.masterModalHasBg.onchange = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.hasBg = e.target.checked;
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
    }
    if (dom.masterModalBgColorSlot) {
      dom.masterModalBgColorSlot.onchange = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.bgColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.bgColor = chosen.hex;
            if (dom.masterModalBgColor) dom.masterModalBgColor.value = normalizeHex(chosen.hex);
          }
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
    }
    if (dom.masterModalBgColor) {
      dom.masterModalBgColor.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.bgColor = e.target.value;
          el.bgColorSlot = '';
          if (dom.masterModalBgColorSlot) dom.masterModalBgColorSlot.value = '';
          renderMasterModalPreview();
        }
      };
      dom.masterModalBgColor.onchange = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    }
    if (dom.masterModalBgOpacity) {
      dom.masterModalBgOpacity.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.bgOpacity = Number(e.target.value) / 100;
          if (dom.masterModalBgOpacityVal) dom.masterModalBgOpacityVal.textContent = `${e.target.value}%`;
          renderMasterModalPreview();
        }
      };
      dom.masterModalBgOpacity.onchange = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    }

    // Modal Border / Outline
    if (dom.masterModalBorderWidth) {
      dom.masterModalBorderWidth.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.borderWidth = Number(e.target.value) || 0;
          renderMasterModalPreview();
        }
      };
      dom.masterModalBorderWidth.onchange = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    }
    if (dom.masterModalBorderColorSlot) {
      dom.masterModalBorderColorSlot.onchange = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.borderColorSlot = e.target.value;
          const chosen = creatorState.colors.find(c => c.id === e.target.value);
          if (chosen) {
            el.borderColor = chosen.hex;
            if (dom.masterModalBorderColor) dom.masterModalBorderColor.value = normalizeHex(chosen.hex);
          }
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterModalPreview();
        }
      };
    }
    if (dom.masterModalBorderColor) {
      dom.masterModalBorderColor.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.borderColor = e.target.value;
          el.borderColorSlot = '';
          if (dom.masterModalBorderColorSlot) dom.masterModalBorderColorSlot.value = '';
          renderMasterModalPreview();
        }
      };
      dom.masterModalBorderColor.onchange = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    }
    if (dom.masterModalBorderOpacity) {
      dom.masterModalBorderOpacity.oninput = (e) => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          el.borderOpacity = Number(e.target.value) / 100;
          if (dom.masterModalBorderOpacityVal) dom.masterModalBorderOpacityVal.textContent = `${e.target.value}%`;
          renderMasterModalPreview();
        }
      };
      dom.masterModalBorderOpacity.onchange = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) syncMasterElementToInstances(el);
        pushModalHistorySnapshot();
      };
    }

    // Modal Unified Layer Adding
    if (dom.btnMasterAddText) {
      dom.btnMasterAddText.onclick = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          if (!el.layers) el.layers = [];
          const newW = Math.min(200, Math.max(20, el.w - 20));
          const newH = Math.min(40, Math.max(10, el.h - 10));
          const newX = Math.max(0, Math.min(el.w - newW, 10));
          const newY = Math.max(0, Math.min(el.h - newH, 10));
          const newLay = {
            id: 'layer-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            type: 'text',
            name: `Text #${el.layers.length + 1}`,
            text: 'New Text',
            fontFamily: el.fontFamily || 'Rubik',
            fontSize: Math.min(32, Math.max(12, Math.round(newH * 0.75))),
            isBold: false,
            uppercase: false,
            colorSlot: el.colorSlot || 'col-primary',
            color: el.color || '#162D43',
            opacity: 1,
            textEffect: 'none',
            effectColorSlot: '',
            effectColor: '#ffffff',
            effectOpacity: 0.8,
            align: 'left',
            autoCount: false,
            x: newX,
            y: newY,
            w: newW,
            h: newH
          };
          el.layers.push(newLay);
          el.extraLayers = el.layers;
          modalSelectedLayerIds.clear();
          modalSelectedLayerIds.add(newLay.id);
          activeAccordionLayerIdx = el.layers.length - 1;
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterExtraLayersList();
          renderMasterModalPreview();
        }
      };
    }

    if (dom.btnMasterAddShape) {
      dom.btnMasterAddShape.onclick = () => {
        const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
        if (el) {
          if (!el.layers) el.layers = [];
          const newW = Math.min(160, Math.max(20, el.w - 20));
          const newH = Math.min(40, Math.max(10, el.h - 10));
          const newX = Math.max(0, Math.min(el.w - newW, 10));
          const newY = Math.max(0, Math.min(el.h - newH, 10));
          const newLay = {
            id: 'layer-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            type: 'shape',
            shapeType: 'rectangle',
            name: `Shape #${el.layers.length + 1}`,
            bg: '#219652',
            colorSlot: 'col-secondary',
            color: '#219652',
            radius: 6,
            w: newW,
            h: newH,
            x: newX,
            y: newY,
            opacity: 0.9,
            borderWidth: 0,
            borderColorSlot: '',
            borderColor: '#000000',
            borderOpacity: 1
          };
          el.layers.push(newLay);
          el.extraLayers = el.layers;
          modalSelectedLayerIds.clear();
          modalSelectedLayerIds.add(newLay.id);
          activeAccordionLayerIdx = el.layers.length - 1;
          pushModalHistorySnapshot();
          syncMasterElementToInstances(el);
          renderMasterExtraLayersList();
          renderMasterModalPreview();
        }
      };
    }

    if (dom.masterModalImageUpload) {
      dom.masterModalImageUpload.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
          if (el) {
            if (!el.layers) el.layers = [];
            const newW = Math.min(120, Math.max(20, el.w - 20));
            const newH = Math.min(120, Math.max(10, el.h - 10));
            const newX = Math.max(0, Math.min(el.w - newW, 10));
            const newY = Math.max(0, Math.min(el.h - newH, 10));
            const newLay = {
              id: 'layer-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
              type: 'image',
              name: file.name,
              src: reader.result,
              w: newW,
              h: newH,
              x: newX,
              y: newY,
              opacity: 1
            };
            el.layers.push(newLay);
            el.extraLayers = el.layers;
            modalSelectedLayerIds.clear();
            modalSelectedLayerIds.add(newLay.id);
            activeAccordionLayerIdx = el.layers.length - 1;
            pushModalHistorySnapshot();
            syncMasterElementToInstances(el);
            renderMasterExtraLayersList();
            renderMasterModalPreview();
          }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      };
    }

    // Modal Global Keyboard Listener for Delete, Undo/Redo, and Arrow Nudging
    window.addEventListener('keydown', (e) => {
      if (!dom.masterElementEditorModal || dom.masterElementEditorModal.classList.contains('hidden')) return;

      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = (tag === 'input' || tag === 'textarea' || tag === 'select');

      // Delete / Backspace / Entf
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (modalSelectedLayerIds.size > 0) {
          e.preventDefault();
          const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
          if (el && Array.isArray(el.layers)) {
            el.layers = el.layers.filter(l => !modalSelectedLayerIds.has(l.id));
            el.extraLayers = el.layers;
            modalSelectedLayerIds.clear();
            activeAccordionLayerIdx = null;
            pushModalHistorySnapshot();
            syncMasterElementToInstances(el);
            renderMasterExtraLayersList();
            renderMasterModalPreview();
          }
        }
        return;
      }

      // Undo (Ctrl+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z)
      if ((e.ctrlKey || e.metaKey) && !isInput) {
        if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
          e.preventDefault();
          undoModal();
          return;
        } else if (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
          e.preventDefault();
          redoModal();
          return;
        }
      }

      // Arrow keys nudging
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && !isInput) {
        if (modalSelectedLayerIds.size > 0) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const el = creatorState.masterElements.find(x => x.id === activeMasterEditId);
          if (el && Array.isArray(el.layers)) {
            modalSelectedLayerIds.forEach(id => {
              const lay = el.layers.find(l => l.id === id);
              if (lay) {
                if (e.key === 'ArrowLeft') lay.x -= step;
                if (e.key === 'ArrowRight') lay.x += step;
                if (e.key === 'ArrowUp') lay.y -= step;
                if (e.key === 'ArrowDown') lay.y += step;
              }
            });
            pushModalHistorySnapshot();
            syncMasterElementToInstances(el);
            renderMasterModalPreview();
          }
        }
      }
    });
  }


  // ==================== INITIALIZE STUDIO ====================
  function init() {
    loadCustomPresetsFromStorage();
    initCreatorElements();
    initCreatorListeners();
    state.elements = createDefaultElementsForTheme(state.themeId, state.numSlides);
    initEventListeners();
    setupStripInteractions();
    setupSimulatorInteractions();
    setupDragAndDrop();
    renderAll();
    setTimeout(fitZoomToViewport, 60);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'creator') {
      setTimeout(() => setAppWorkspaceMode('creator'), 100);
    }

    // Expose for debugging and test automation
    window.__creatorState = creatorState;
    window.__state = state;
    window.__renderPresetCreatorAll = renderPresetCreatorAll;
    window.__formatCreatorRichTextHtml = formatCreatorRichTextHtml;
  }

  init();
})();
