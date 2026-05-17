# Fungi — Personal Mycology Gallery & Taxonomy Explorer

Fungi je osobní projekt, který vznikl z kombinace dvou věcí, které mě definují:  
**vášeň pro houbaření** a **vědecká duše**, která miluje strukturu, data a pořádek.

Mám rozsáhlou osobní galerii hub a chtěla jsem vytvořit aplikaci, která nebude jen obyčejnou fotogalerii, ale **datově řízený systém**, který umí pracovat s **taxonomickou stromovou strukturou**, lazy loadingem, filtrováním a dynamickým zpracováním obrázků.

Výsledkem je full‑stack aplikace postavená na moderních technologiích, která:

- zobrazuje strukturovanou galerii hub  
- pracuje s taxonomickým stromem  
- umožňuje navigaci mezi druhy  
- lazy načítá data i obrázky  
- dynamicky generuje náhledy přes Sharp  
- ukládá média do Minio  
- poskytuje REST API pro taxony, média a houby  

A zároveň slouží jako **portfolio projekt**, který ukazuje práci s frontendem, backendem, daty, architekturou i dev toolingem.

---

## ✨ Features

### Frontend
- React + Vite + TypeScript
- Infinite scroll galerie
- Blur efekt na náhledech
- Hover overlay s názvem houby
- Taxonomický strom jako filtr
- Taxonomická navigace v detailu houby
- Lazy loading dat i obrázků
- Sdílené typy mezi clientem a serverem

### Backend
- Express + TypeScript
- REST API pro:
  - `taxon` (stromová struktura)
  - `mushroom` (denormalizovaná data pro rychlé výpisy)
  - `media` (upload, transformace, metadata)
- Minio jako objektové úložiště
- Sharp pro dynamické generování náhledů
- Modulární architektura (taxon/media/mushroom)
- Lazy loading a stránkování
- Denormalizace pro rychlé filtrování podle taxonu

---

## 🧬 Architecture

Aplikace je rozdělena do tří částí:

```
root/
 ├── client/     → React frontend
 ├── server/     → Express backend
 └── shared/     → sdílené typy, DTO, utilitky
```

### Datový tok

```
[Client]  →  REST API  →  [Server]  →  Minio (media)
   ↑                          ↓
   └────── shared types ──────┘
```

### Moduly backendu

```
server/src/
 ├── modules/
 │    ├── taxon/      → práce se stromem taxonomie
 │    ├── mushroom/   → denormalizovaná data pro výpisy
 │    └── media/      → upload, sharp, metadata
 ├── common/
 ├── infrastructure/
 └── server.ts
```

### Frontend struktura

```
client/src/
 ├── components/
 ├── hooks/
 ├── pages/
 ├── api/
 ├── assets/
 └── main.tsx
```

---

## 🖼️ Screenshots (placeholders)

```
![Gallery Screenshot](docs/screens/gallery.png)
![Taxonomy Screenshot](docs/screens/taxonomy.png)
![Detail Screenshot](docs/screens/detail.png)
```

*(Později můžeš doplnit reálné obrázky.)*

---

## 🚀 Development

### Spuštění projektu

V rootu:

```bash
npm install
npm run dev
```

To spustí:

- client (Vite)
- server (Express)
- Minio (přes docker-compose)

### Environment variables

V rootu:

```
.env
.env.example
```

Client i server mají vlastní `.env`.

---

## 🏗️ Build

Zatím se buildí zvlášť:

### Client

```bash
cd client
npm run build
```

### Server

```bash
cd server
npm run build
```

*(Později lze sjednotit do jednoho root scriptu.)*

---

## 📦 Tech Stack

### Frontend
- React
- Vite
- TypeScript

### Backend
- Node.js
- Express
- Sharp
- Minio SDK

### Infrastructure
- Docker Compose
- Minio
- npm workspaces (monorepo)
- ESLint (flat config)
- Prettier
- TypeScript strict mode

---

## 📁 Monorepo Structure

```
root/
 ├── client/          → React frontend
 ├── server/          → Express backend
 ├── shared/          → sdílené typy a utilitky
 ├── minio-data/      → runtime data (ignored)
 ├── .vscode/         → workspace settings
 ├── docker-compose.yml
 ├── eslint.config.js
 ├── tsconfig.base.json
 ├── .prettierrc
 ├── .editorconfig
 └── README.md
```

---

## 🧭 Roadmap

- [ ] Přidat autentizaci
- [ ] Admin rozhraní pro správu hub
- [ ] Lepší vyhledávání (fulltext)
- [ ] Lepší filtrování podle taxonomie
- [ ] Optimalizace obrázků (caching, thumbnails)
- [ ] Testy (unit + integration)
- [ ] CI/CD pipeline
- [ ] Deployment (Docker / Fly.io / Railway)

---

## 📄 License

Tento projekt je licencován pod **MIT License**.  
Viz soubor `LICENSE`.

---

## 💬 About

Projekt vznikl jako kombinace:

- osobní vášně pro houby  
- potřeby vytvořit vizuálně atraktivní frontend  
- touhy pracovat s daty, strukturou a backendem  
- a jako ukázka full‑stack dovedností v moderním monorepu

---