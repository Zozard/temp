This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## To Do List des Features

Fonctionnel

- Formulaire pour poster une annonce (j'ai une carte à donner ou je recherche une carte)

- Renseigner des cartes recherchées / à donner
- Rechercher des annonces de cartes
- Données de profil (code ami...)
- Internationaliser l'appli
  Les propales
  - Créer / Envoyer des propositions d'échange
    -Accepter / Refuser des propales
  - Confirmer que l'échange a eu lieu dans TCGP

### 2025-02-18

- Faire un layout un peu sympa pour le modal (+ tout style souhaité [optionnel])
- Faire un second input
- Sauvegarder l'état en backend
- Lire/regarder théorie sur React
  https://grafikart.fr/formations/react

### 2025-02-26

- Faire un layout un peu sympa pour le modal (+ tout style souhaité [optionnel])
- Afficher en overlay les quantités sur les cartes (suggestion : si 0 alors pas d'overlay) --> pas forcément sur le hover
- Pouvoir filtrer sur les cartes que j'ai déjà renseignées sans faire appel au backend (revoir le bouton My Cards peut-être)
- Virer l'adresse email en dur dans le backend
- Lire/regarder théorie sur React
  https://grafikart.fr/formations/react

### 2025-03-05

- Faire en sorte que Market lise PostGres
- Faire le tableau dégueu dans Discord avec Samy en utilisant le css postion: sticky; sur la carte --> Liste de cartes recherchées
- Charger dans la base les nouvelles cartes échangeables
- Lire/regarder théorie sur React
  https://grafikart.fr/formations/react  

## Commande SQL pour insérer une nouvelle carte

```sql
INSERT INTO cards (card_id, card_name, rarity) values ('A1-223', 'Giovanni', '⬧⬧');
INSERT INTO users (email) values ('<email>');
```
