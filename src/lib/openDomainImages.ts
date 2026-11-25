/**
 * Curated Open-Domain / Royalty-Free Photography (Unsplash)
 * Used across the GTA-VI / Leonida Vice City portfolio redesign.
 */
export const OPEN_DOMAIN_IMAGES = {
  // Vice City / Miami Neon Skyline & Palms
  viceSkyline:
    "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=1920&q=80",
  vicePalmsSunset:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  neonNightStreet:
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1600&q=80",
  cyberpunkCity:
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",

  // Tech / Developer / Ammu-Nation Arsenal
  arsenalSetup:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
  serverInfra:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
  codeMatrix:
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
  aiNeuralNet:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",

  // Projects / Bounties / Arcade / Trophies
  neonCarNight:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
  arcadeNeon:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
  cloudTech:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  luxuryMiami:
    "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1400&q=80",
} as const;

export const PROJECT_COVERS = [
  OPEN_DOMAIN_IMAGES.serverInfra,
  OPEN_DOMAIN_IMAGES.aiNeuralNet,
  OPEN_DOMAIN_IMAGES.codeMatrix,
  OPEN_DOMAIN_IMAGES.neonNightStreet,
  OPEN_DOMAIN_IMAGES.cloudTech,
  OPEN_DOMAIN_IMAGES.cyberpunkCity,
];

export const HEIST_COVERS = [
  OPEN_DOMAIN_IMAGES.arsenalSetup,
  OPEN_DOMAIN_IMAGES.cloudTech,
  OPEN_DOMAIN_IMAGES.aiNeuralNet,
  OPEN_DOMAIN_IMAGES.neonCarNight,
];
