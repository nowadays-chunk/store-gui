import fs from "fs";
import path from "path";

export function getProducts() {
  const dir = path.join(process.cwd(), "/public/assets/products");

  const images = fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith(".jpeg"))
    .sort((a, b) => a.localeCompare(b));

  return images.map((file, i) => {
    const index = i + 1;
    const title = `Parfum Prestige ${index}`;

    return {
      id: index,
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      price: 50 + (i * 7) % 150, // deterministic
      image: `/assets/products/${file}`,
      description:
        "Un parfum luxueux aux notes orientales et boisées, conçu pour sublimer votre présence.",
      notes: [
        "Notes de tête : Bergamote, Citron",
        "Notes de cœur : Rose, Jasmin",
        "Notes de fond : Oud, Ambre, Musc",
      ],
    };
  });
}
