# Kinecta MVP

**Kinecta** is a Next.js + Tailwind CSS web app that lets you **connect with a simulated ancestor** from your chosen heritage background via chat. This MVP demonstrates:

* **Heritage & persona selection** (Hakka, Hokkien, Cantonese) with context (region, time period, occupation, traits)
* **Chat interface** with simulated AI responses, typing indicator, and auto-scroll
* **Zustand** for lightweight global state management
* **Tailwind CSS** for utility-based styling and theme extensions
* **Heroicons** for SVG icons
* **TypeScript** for type safety

---

## Tech Stack

| Technology        | Purpose                              |
| ----------------- | ------------------------------------ |
| Next.js (v14+)    | React framework, routing, API routes |
| React (v18)       | UI components                        |
| TypeScript        | Static typing                        |
| Tailwind CSS (v3) | Utility-first CSS                    |
| Zustand           | Global state management              |
| Heroicons         | SVG icon library                     |
| Node.js & npm     | Runtime & package management         |

---

## Getting Started

### Prerequisites

* **Node.js** v16.8+ and **npm** v7+

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/ancestor-ai-mvp.git
cd ancestor-ai-mvp
npm install
```

### Environment Variables

Create a `.env.local` in the project root with:

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here  # optional for voice
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
kinecta/
├── .env.local           # Environment variables
├── next.config.js       # Next.js config
├── postcss.config.js    # PostCSS + Tailwind CSS
├── tailwind.config.js   # Tailwind theme & content paths
├── package.json         # Scripts & dependencies
└── src/
    ├── app/
    │   ├── layout.tsx   # Root layout, global CSS import
    │   ├── globals.css  # Tailwind directives & base styles
    │   └── page.tsx     # Home component (selector & chat)
    ├── components/
    │   ├── HeritageSelector.tsx  # Heritage form
    │   └── ChatInterface.tsx     # Chat UI
    ├── store/
    │   └── ancestorStore.ts     # Zustand store
    ├── utils/                    # Cultural data, helpers
    └── pages/api/                # Voice & chat API routes
```

---

## Custom Themes & Styles

Tailwind’s `tailwind.config.js` includes custom colors:

```js
colors: {
  'heritage-gold':   '#D4A574',
  'heritage-red':    '#C5282F',
  'heritage-dark':   '#2C1810',
  'heritage-light':  '#F5F1E8',
},
```

Use utility classes like `bg-heritage-gold`, `text-heritage-dark`, and gradients (`heritage-gradient`).

