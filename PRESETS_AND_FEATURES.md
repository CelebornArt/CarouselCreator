# CarouselCreator — Master Architecture, Presets & Features Guide

This document is the **single source of truth** for all presets, visual guidelines, interactive features, and code locations in the CarouselCreator studio (`1080×1350 Continuous Panoramic Instagram Carousel Studio`).

---

## 1. Project Architecture & File Map

| File | Purpose | Key Responsibilities |
| :--- | :--- | :--- |
| [`index.html`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/index.html) | Workspace DOM Structure | Topbar controls, sidebar drawers, viewport tabs, `#stripViewport`, `#simulatorViewport`, global SVG defs, inspector panels. |
| [`app.js`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js) | Main Application Engine | State management, theme configurations, SVG scene generator, canvas exporter, Canva-style snapping, undo/redo, drag & drop. |
| [`styles.css`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/styles.css) | Studio Theme & Viewport Styling | Dark UI theme, layout grids, canvas viewport panning, selection box, handles, Instagram mockup frame. |
| [`assets.js`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/assets.js) | Embedded Project Assets | Base64 PNG Data URIs for offline zero-CORS canvas rendering (emblems, swipes, textures, icons). |

---

## 2. Global Canvas Coordinates & Layout Rules

- **Slide Dimensions**: Exactly `1080px` width × `1350px` height (Instagram 4:5 portrait aspect ratio).
- **Panoramic Strip**: Slides are rendered continuously side-by-side (`x = slideIndex * 1080 + localX`).
- **Seam Gaps**: When "Seam Gaps" toggle is active, a `28px` gap is inserted between slides to check cross-slide transitions.
- **Layers**:
  - `Layer 1 (Bottom)`: Base Slide Background (textures, blueprint grid, SVG border frames).
  - `Layer 2 (Middle)`: Unified Panoramic Scene (Background images first, foreground images and text on top).
  - `Layer 3 (Overlay)`: Visual Guidelines, Smart Snap Lines, Selection Overlay Box.

---

## 3. Presets Specification Directory

### 🪄 CHANNEL 1: MAGIC CHANNEL (`@CELEBORNMAGIC`)
*Brand identity: Dark, elegant, mysterious, Art-Deco ornamentation, consultancy aesthetic.*

#### Preset 1: Magic Type A (Theory) — Key: `magic-theory` (Theme Name: "Magic Type A (Application)")
- **Positioning**: Theoretical concept breakdowns applied to magic (e.g., Color Psychology).
- **Background**: Dark blurred background (`magic_bg_dark_01.png` / `#121110`).
- **Emblem**: Ornate Art-Deco corner frame with **Open Book** (`emblem_theory`, 188×188 at `x: 66, y: 66`).
- **Color System**:
  - `textColor`: `#CCC5AB` (Warm light beige / champagne khaki).
  - `pipeColor`: `#C19358` (Golden orange pipe / accent).
  - `accentColor`: `#C19358`.
- **Slide 1 Cover Design**:
  - **Vertical Handle**: `| @CELEBORNMAGIC` at `x: 986, y: 66, w: 28, h: 360`. Leading pipe `|` in `#C19358`, text in `#CCC5AB`.
  - **Cover Headline**: `COLOR\nPSYCHOLOGY` at `y: 485`. Font: `Caudex`, 94px, Bold. **NO HIGHLIGHT / NO EMBOSS** (`embossed: false`, clean flat text).
  - **Center Divider Line**: `fill: #C19358`, 380px wide at `y: 718`.
  - **Cover Subtitle**: `HOW CERTAIN COLORS AFFECT\nOUR PERCEPTION` at `y: 752`. Font: `Proxima Nova`, 38px, **NOT BOLD** (`isBold: false`).
- **Content Slides (2 .. N-1)**:
  - **Slide Header**: `PRINCIPLE II`, etc. Font: `Caudex`, 76px, bold.
  - **Divider Line**: `fill: #C19358`.
  - **Body / Subtitle**: Font: `Proxima Nova`, 38px, **NOT BOLD** (`isBold: false`), `#CCC5AB`.
  - **Footer Series**: `| ART SERIES` at bottom-left (`y: 1264`). Leading `|` in `#C19358`, text in `#CCC5AB`.
  - **Swipe Icon**: Hand swipe icon centered at `x: 514, y: 1252`. **Color: `#CCC5AB`** (matches the text color).
  - **Page Number**: Roman numerals (`I`, `II`...) at bottom-right in `Playfair Display SC` 44px (only when toggled on).
- **Slide N (End CTA Slide)**:
  - Headline: `Need More\nInput?` (Caudex 86px).
  - Subtitle: `Comment below :)` (Proxima Nova 38px, not bold).
  - CTA Icons: Vector Heart + Paper Airplane Share icons (`stroke: #C19358`).
  - Diamond: `◇` (`#C19358`).
  - Bookmark: Vector ribbon bookmark icon.
- **Code Reference**:
  - Theme Definition: [`app.js:199-245`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L199-L245)
  - Cover Slide Setup: [`app.js:420-535`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L420-L535)
  - Content Slide Setup: [`app.js:845-930`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L845-L930)
  - Footer Elements: [`app.js:709-792`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L709-L792)

#### Preset 2: Magic Type B (Applications) — Key: `magic-application` (Theme Name: "Magic Type B (Theory)")
- **Positioning**: Practical application of theory to stage illusions and magic methods.
- **Background**: Sandy orange texture (`magic_bg_light_01.png` / `#D69352`).
- **Emblem**: Ornate Art-Deco corner frame with **Lightbulb** (`emblem_application`).
- **Color System**:
  - `textColor`: `#2B1F17` (Deep bronze / espresso).
  - `pipeColor`: `#EBB168` (Warm golden orange / emblem tone).
  - `accentColor`: `#EBB168` (Warm golden orange tone).
  - `usernameColor`: `#2B1F17` (Dark espresso).
  - *Light beige (`#CCC5AB`) has strictly zero appearance in Preset Type B.*
- **Slide 1 Cover Design**:
  - **Vertical Handle**: `| @CELEBORNMAGIC` at `x: 986, y: 66, w: 28, h: 360`. Leading pipe `|` in `#EBB168`, handle text in dark `#2B1F17`.
  - **Cover Headline**: `THEORY IN\nPRACTICE` at `y: 485`. Font: `Caudex`, 94px, Bold. **EMBOSSED WITH WARM HIGHLIGHT** (`embossed: true` with 3D highlight & shadow).
  - **Center Divider Line**: `fill: #EBB168` (Exact same golden orange tone as emblem and pipes).
  - **Cover Subtitle**: `APPLYING SILENT SCRIPTING\nTO STAGE ILLUSIONS`. Font: `Proxima Nova`, 38px, **NOT BOLD** (`isBold: false`), dark `#2B1F17`.
- **Content Slides & Footers**:
  - **Vertical Handle**: Leading `|` in `#EBB168`, handle text in dark `#2B1F17`.
  - **Body / Subtitle**: `Proxima Nova`, 38px, **NOT BOLD** (`isBold: false`), dark `#2B1F17`.
  - **Footer Series**: `| APPLICATION SERIES`. Leading `|` in `#EBB168`, text in dark `#2B1F17`.
  - **Swipe Icon**: **Color & Fill: `#EBB168`** (matches the emblem, pipes, and divider elements).
  - **Dividers**: `fill: #EBB168`.
- **Code Reference**:
  - Theme Definition: [`app.js:247-293`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L247-L293)
  - Cover Slide Setup: [`app.js:532-628`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L532-L628)
  - Content Slide Layout: [`app.js:935-1025`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L935-L1025)
  - Footer Elements: [`app.js:802-932`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L802-L932)
  - Theme Application: [`app.js:4050-4152`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L4050-L4152)

#### Preset 3: Magic Type C (Trick Ideas) — Key: `magic-idea` (Theme Name: "Magic Type C (Trick Ideas)")
- **Positioning**: Original trick concepts, alchemical premises, sketchbook brainstorming.
- **Background**: Blank warm sketchbook page (`#FAF6EE`).
- **Emblem**: Ornate Art-Deco corner frame with **Trick / Hourglass** (`emblem_idea_charcoal`).
- **Color System**: `textColor: '#2B2B2B'`, `pipeColor: '#C19358'`.
- **Code Reference**:
  - Theme Definition: [`app.js:295-340`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L295-L340)

---

### 🎮 CHANNEL 2: GAMEDEV CHANNEL (`gamedev.consulting`)
*Brand identity: Blueprint sketch aesthetic, continuous border framing, technical typography, game design analysis.*

#### Common GameDev Frame Architecture
- **Outer Shell**: Continuous `26px` side borders, `64px` top/bottom border pattern strips.
- **Slide 1 Trapezoid Notch**: Cutout `x: 360 .. 720` (exact harmonic integer multiple: `360 = 4 × 90px = 8 × 45px`), height `155px` holding topic badge (e.g. `EPISODE`, `SURVIVAL`, `IDEAS`). Can be toggled on/off in the inspector.
- **Continuous Outline**: `3.5px` solid black stroke with `stroke-linejoin="round"` forming a gap-free continuous polygon.
- **Bottom Navigation**:
  - **Swipe Icon & Text**: White hand swipe icon + bold "SWIPE" text sitting **DIRECTLY** on the green/red/orange bottom frame (`x: 450 .. 630`, exact harmonic integer multiple: `450 = 5 × 90px = 10 × 45px`, `630 = 7 × 90px = 14 × 45px`). **NO SEPARATE BOX / NO RECTANGLE**.
  - **Username Box**: Centered at bottom (`x: 390, y: 1226, w: 300, h: 38`), holding `@CreativeProblemSolver`.

#### Preset 4: Games (Love) — Key: `games-love`
- **Outer Frame**: Green `#219652`. Inner Paper: Warm cream `#F7F3EA`. Text: Slate `#162D43`.
- **Pattern**: **Full-height & full-width triple-stripe chevrons (`>>>`) with zero cutoffs anywhere**.
  - Chevrons cover the full 64px height of the border (spans `y = -2` through apex `y = 32` to `y = 66`), matching the full-height behavior of the stripes.
  - **Harmonic Tiling**: Modular `90px` tile width (`1080 / 90 = 12.0` exact integer groups per slide).
  - **Intra-group Spacing**: `18px` between arrows within group (`sx = 10, 28, 46` with apexes at `38, 56, 74`), group ends cleanly at `x = 74`.
  - **Inter-group Spacing**: `54px` gap between groups (group ends at `74`, next starts at `90 + 10 = 100`).
  - **Slide 1 Top Notch Margins**: Left segment runs `[0, 360]` (4 complete chevron groups, ends at `348`, 12px clean margin before 360). Right segment runs `[720, 1080]` (4 complete chevron groups, starts at `730`, 10px clean margin after 720).
  - **Bottom Swipe Margins**: Left segment runs `[0, 450]` (5 complete chevron groups, ends at `434`, 16px clean margin before 450). Right segment runs `[630, 1080]` (5 complete chevron groups, starts at `640`, 10px clean margin after 630).
  - **Seamless Slide Transitions**: At `x = 1080, 2160...`, the 12th group ends at `1064`, a uniform 54px gap spans the boundary, and the 13th group starts at `1090`. Perfectly identical to intra-slide spacing with zero sliced arrows!
- **Slide 1 Texts**:
  - Topic Tag: `EPISODE`
  - Top Subtitle: `Things I *LOVE* in games #0001`
  - Bottom Subtitle: `and what to *LEARN* from that`
- **Code Reference**:
  - Theme Definition: [`app.js:46-104`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L46-L104)
  - SVG Defs: [`index.html:236-240`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/index.html#L236-L240)
  - SVG Element Rendering: [`app.js:1838-1875`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L1838-L1875)
  - Canvas Exporter: [`app.js:3838-3851`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3838-L3851) & [`app.js:3884-3906`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3884-L3906)

#### Preset 5: Games (Hate) — Key: `games-hate`
- **Outer Frame**: Red `#B8231C`. Inner Paper: Warm cream `#F7F3EA`. Text: Slate `#162D43`.
- **Pattern**: **Full-width 45° hazard diagonal stripes** (`x = 0 .. 1080`).
  - Top: Slide 1 runs continuous stripes from `x = 0` to `x = 360`, masks out trapezoid notch cutout (`x = 360 .. 720`), and resumes stripes from `x = 720` to `x = 1080`.
  - Top (other slides): runs stripes full width from `x = 0` to `x = 1080`.
  - Bottom: runs stripes full width `x = 0 .. 450` and `x = 630 .. 1080` around swipe button; last slide runs full width `x = 0 .. 1080`.
- **Slide 1 Texts**:
  - Topic Tag: `SURVIVAL`
  - Top Subtitle: `Things I *HATE* in games #0001`
  - Bottom Subtitle: `and how to *FIX* them`
- **Code Reference**:
  - Theme Definition: [`app.js:105-155`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L105-L155)
  - SVG Defs: [`index.html:242-246`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/index.html#L242-L246)
  - SVG Element Rendering: [`app.js:1838-1875`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L1838-L1875)
  - Canvas Exporter: [`app.js:3852-3859`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3852-L3859) & [`app.js:3884-3906`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3884-L3906)

#### Preset 6: Games (Idea) — Key: `games-idea`
- **Outer Frame**: Orange `#E67F22`. Inner Paper: Blueprint Navy `#1C3752`. Text: Off-white `#FAFBF7`.
- **Background Grid**: **Large Blueprint Grid** (`grid_blueprint`), scaled and offset to completely and continuously fill the blue paper background with zero edge gaps.
- **Username Box**: Crisp light gray `#CBD5E1` for high contrast against dark blue.
- **Pattern**: **Full-width even staggered polka dots with seamless slide transitions** (matching `reference_idea.png` exactly).
  - Even dot diameter across all dots (`r = 7.5px`), arranged in a staggered hexagonal lattice across modular `45×64px` tiles (`1080 / 45 = 24.0` exact integer tiles per slide).
  - Interior staggered rows (`cy = 21.33px` and `cy = 42.67px`) and clipped edge rows (`cy = 0` and `cy = 64px`).
  - Top: Slide 1 runs `[0, 360]` (8 full tiles) and `[720, 1080]` (8 full tiles). Other slides run `[0, 1080]` (24 full tiles).
  - Bottom: Runs `[0, 450]` (10 full tiles) and `[630, 1080]` (10 full tiles). Last slide runs `[0, 1080]` (24 full tiles).
  - **Seamless Slide Transitions**: At `x = 1080, 2160...`, the 24th tile finishes exactly at the border and the 25th begins without any phase shift or clipped partial dots.
- **Slide 1 Texts**:
  - Topic Tag: `IDEAS`
  - Top Subtitle: `Things I *MISS* in games #000.1`
  - Bottom Subtitle: `and how to *IMPLEMENT* them`
- **Code Reference**:
  - Theme Definition: [`app.js:156-197`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L156-L197)
  - SVG Defs: [`index.html:248-264`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/index.html#L248-L264)
  - SVG Element Rendering: [`app.js:1838-1875`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L1838-L1875)
  - Canvas Exporter: [`app.js:3860-3880`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3860-L3880) & [`app.js:3884-3906`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3884-L3906)

---

## 4. Interactive Studio Engine & Features Directory

| Feature | Description | Key Code Location |
| :--- | :--- | :--- |
| **Undo / Redo (`Ctrl+Z` / `Ctrl+Y`)** | Full state snapshot history stack supporting undo/redo for all canvas operations, property changes, element creation/deletion, drag commits. | [`app.js:375-465`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L375-L465) & [`app.js:4730-4750`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L4730-L4750) |
| **Drag & Drop Image Upload** | Drag image files from OS desktop directly onto canvas viewport; automatically calculates coordinates and drops image element. | [`app.js:3485-3580`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3485-L3580) |
| **High-Performance Transform** | 60fps buttery-smooth dragging, resizing, and rotation without DOM lag; updates element styles directly during mousemove and commits to full pipeline on mouseup. | [`app.js:3040-3250`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3040-L3250) |
| **Aspect Ratio Resizing** | Dragging corner handles on image elements preserves intrinsic natural aspect ratio; bounding box stays locked to the actual image boundaries. | [`app.js:3170-3220`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3170-L3220) |
| **Double-Click Inline Editing** | Double-clicking text (whether unselected or already selected with active selection box) enters inline `contenteditable` mode. | [`app.js:3110-3135`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3110-L3135) & [`app.js:3360-3405`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3360-L3405) |
| **Mouse Wheel Zoom** | Scroll wheel zooms in/out centered at cursor position. | [`app.js:3250-3260`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3250-L3260) |
| **Canvas Panning** | `Space + Left Drag` or `Alt + Middle Mouse Drag` pans the viewport freely. | [`app.js:3045-3065`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3045-L3065) |
| **Smart Snapping & Smart Guides** | Canva-style smart snap lines to slide centers, guidelines, margins, and equal spacing between elements. | [`app.js:1610-1730`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L1610-L1730) |
| **Instagram Simulator** | Real-time live 4:5 Instagram carousel mockup with interactive swipe dragging, pagination dots, pill counter. | [`app.js:2100-2150`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L2100-L2150) & [`app.js:3410-3480`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3410-L3480) |
| **1080×1350 PNG Exporter** | Export single slide or full carousel as ZIP with 100% canvas rendering accuracy, custom background textures, and zero CORS errors. | [`app.js:3640-4100`](file:///q:/.WORKSPACE/.CREATIVECONSULTING/instagram/automation/CarouselCreator/app.js#L3640-L4100) |

---
*Created and maintained as the definitive project reference for CarouselCreator.*
