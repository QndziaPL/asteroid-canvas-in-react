import Particle from "../../models/Particle";

export const createParticlesOnHit = (
  x,
  y,
  enemyRadius,
  context,
  particles,
  setParticles
) => {
  const colors = [
    "#ffffff",
    "#cbcbcb",
    "#6d6d6d",
    "#474747",
    "#72aaaa",
    "#900000",
    "#307265",
    "#86744a",
    "#007422",
  ];
  let newParticles: Particle[] = [];
  for (let i = 0; i < enemyRadius; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    newParticles.push(
      new Particle(context, x, y, randomColor, Math.random() * 3, {
        x: (Math.random() - 0.5) * Math.random() * 10,
        y: (Math.random() - 0.5) * Math.random() * 10,
      })
    );
  }
  setParticles([...particles, ...newParticles]);
};
