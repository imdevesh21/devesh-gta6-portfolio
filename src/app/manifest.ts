import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VI // Devesh Sharma — Full-Stack Developer",
    short_name: "Devesh VI",
    description:
      "Interactive GTA-VI themed Full-Stack Developer portfolio of Devesh Sharma.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0119",
    theme_color: "#ff2a85",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
