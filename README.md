Fungi — Personal Mycology Gallery & Taxonomy Explorer

Fungi je osobní projekt, který vznikl z kombinace dvou věcí, které mě definují:vášeň pro houbaření a vědecká duše, která miluje strukturu, data a pořádek.

Mám rozsáhlou osobní galerii hub a chtěla jsem vytvořit aplikaci, která nebude jen obyčejnou fotogalerii, ale datově řízený systém, který umí pracovat s taxonomickou stromovou strukturou, lazy loadingem, filtrováním a dynamickým zpracováním obrázků.

Výsledkem je full‑stack aplikace postavená na moderních technologiích, která:

zobrazuje strukturovanou galerii hub

pracuje s taxonomickým stromem

umožňuje navigaci mezi druhy

lazy načítá data i obrázky

dynamicky generuje náhledy přes Sharp

ukládá média do Minio

poskytuje REST API pro taxony, média a houby

A zároveň slouží jako portfolio projekt, který ukazuje práci s frontendem, backendem, daty, architekturou i dev toolingem.

✨ Features

Frontend

React + Vite + TypeScript

Infinite scroll galerie

Blur efekt na náhledech

Hover overlay s názvem houby

Taxonomický strom jako filtr

Taxonomická navigace v detailu houby

Lazy loading dat i obrázků

Sdílené typy mezi clientem a serverem

Backend

Express + TypeScript

REST API pro:

taxon (stromová struktura)

mushroom (denormalizovaná data pro rychlé výpisy)

media (upload, transformace, metadata)

Minio jako objektové úložiště

Sharp pro dynamické generování náhledů

Modulární architektura (taxon/media/mushroom)

Stránkování, lazy loading, denormalizace

🧬 Architecture

Aplikace je rozdělena do dvou hlavních částí:

root/
 ├── client/     → React frontend
 └── server/     → Express backend

Datový tok

[Client]  →  REST API  →  [Server]  →  Minio (media)

Backend struktura

server/src/
 ├── api/              → REST endpoints
 ├── modules/          → taxon / mushroom / media
 ├── common/           → middleware, utils, typy
 ├── infrastructure/   → DB, config, Minio, HTTP healthchecks
 └── server.ts

Frontend struktura

client/src/
 ├── components/
 ├── hooks/
 ├── pages/
 ├── api/
 ├── layouts/
 ├── loaders/
 ├── theme/
 ├── types/
 └── main.tsx

🖼️ Screenshots (placeholders)

(Později doplním reálné obrázky.)

🚀 Development

Spuštění projektu

V rootu:

pnpm install
pnpm dev

To spustí:

client (Vite)

server (Express)

Minio (přes docker-compose, pokud je potřeba)

Environment variables

V rootu:

.env
.env.example

Client i server mají vlastní .env.

🏗️ Build

Client

cd client
pnpm build

Server

cd server
pnpm build

📦 Tech Stack

Frontend

React

Vite

TypeScript

Framer Motion

PhotoSwipe

Tailwind CSS

Backend

Node.js

Express

Sharp

Minio SDK

Mongoose

Infrastructure

Docker Compose

Minio

pnpm workspaces

ESLint (flat config)

Prettier

TypeScript strict mode

📁 Monorepo Structure

root/
 ├── client/          → React frontend
 ├── server/          → Express backend
 ├── docker/          → Dockerfiles a compose
 ├── .github/         → CI workflow
 ├── pnpm-workspace.yaml
 ├── eslint.config.js
 ├── .prettierrc
 ├── .editorconfig
 └── README.md

🧭 Roadmap

Autentizace (login, role)

Admin rozhraní pro správu hub

Fulltext vyhledávání

Pokročilé filtrování podle taxonomie

Caching a optimalizace obrázků

Testy (unit + integration)

CI/CD pipeline

Deployment (Docker / Fly.io / Railway)

📄 License

Projekt je licencován pod MIT License.Viz soubor LICENSE.

💬 About

Projekt vznikl jako kombinace:

osobní vášně pro houby

potřeby vytvořit vizuálně atraktivní frontend

touhy pracovat s daty, strukturou a backendem

a jako ukázka full‑stack dovedností v moderním monorepu