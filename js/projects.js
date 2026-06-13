/**
 * designs.web.js — Project database for Harpreet Singh Uppal's portfolio
 * Media type detection: items with URLs starting with "http" and containing
 * "/player/" or "adobe" are treated as iframe embeds.
 */

const PROJECTS = [
  {
    id: "proj-001",
    title: "Novoglow Sky Perfume AI",
    category: "3d-modeling",
    tags: ["Product Visualization", "3D Modeling", "Arnold", "Maya"],
    coverImage: "thumbnails/novoglow_sky_perfume_ai.png",
    description: "3D Product modeling, lighting, and rendering visualization for Novoglow Sky Perfume. Created procedural materials and realistic lighting setup to highlight the glass bottle refraction and packaging design.",
    client: "Novoglow Perfumes",
    year: "2024",
    media: [
      "thumbnails/novoglow_sky_perfume_ai.png",
      "https://www-ccv.adobe.io/v1/player/ccv/EWPDb2iP8o7/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
    ],
  },
  {
    id: "proj-002",
    title: "Making of Shea Butter",
    category: "3d-modeling",
    tags: ["Hard Surface", "Texturing", "Substance Painter", "Arnold"],
    coverImage: "thumbnails/making_of_shea_butter.png",
    description: "CGI rendering and detailed breakdown modeling of shea butter cosmetic packaging. Renders emphasize soft body simulations, product texturing, and studio lighting.",
    client: "Shea Butter CGI",
    year: "2024",
    media: [
      "thumbnails/making_of_shea_butter.png",
      "https://www-ccv.adobe.io/v1/player/ccv/CE8jiTD369n/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
    ],
  },
  {
    id: "proj-003",
    title: "Character Rig — Serpentis",
    category: "rigging",
    tags: ["Rigging", "Skinning", "IK/FK", "Maya"],
    coverImage: "thumbnails/character_rig.png",
    description: "Advanced character rigging setup in Maya. Includes custom bone hierarchies, squash-and-stretch controls, and clean weight skinning maps for animators.",
    client: "Studio Commission",
    year: "2024",
    media: [
      "thumbnails/character_rig.png",
      "https://www-ccv.adobe.io/v1/player/ccv/2VbKL4ssWTV/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
    ],
  },
  {
    id: "proj-004",
    title: "Cartoon Tiger — 3D Animation",
    category: "3d-animation",
    tags: ["Character Animation", "Keyframe", "Maya", "Stylized"],
    coverImage: "thumbnails/cartoon_tiger.png",
    description: "Character animation cycle and expression studies for a stylized cartoon tiger. Focused on keyframe animation, body mechanics, and secondary motion features.",
    client: "Personal Work",
    year: "2023",
    media: [
      "thumbnails/cartoon_tiger.png",
      "https://www-ccv.adobe.io/v1/player/ccv/7tgFVSzNm6a/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
    ],
  },
  {
    id: "proj-005",
    title: "Dangal Sultan — CGI Cinematic",
    category: "3d-animation",
    tags: ["CGI", "3D Animation", "Camera Animation", "VFX"],
    coverImage: "thumbnails/dangal_sultan.png",
    description: "Cinematic CGI edit and animation sequence featuring custom assets and dynamic camera movements. Project showcases high-end motion design and compositing pipelines.",
    client: "Dangal Sultan",
    year: "2024",
    media: [
      "thumbnails/dangal_sultan.png",
      "https://www-ccv.adobe.io/v1/player/ccv/MQywL-jRbv9/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
    ],
  }
];

// Helper: detect if a media item is a video iframe embed
function isIframeMedia(url) {
  if (typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return (
    (lower.startsWith("http") && lower.includes("/player/")) ||
    lower.includes("adobe.io") ||
    lower.includes("vimeo.com/video") ||
    lower.includes("youtube.com/embed") ||
    lower.includes("youtu.be") ||
    lower.includes("/embed")
  );
}
