import Projectile from "../../models/Projectile";
import { Dispatch } from "react";

export const shootProjectile = (
  clientMouseX: number,
  clientMouseY: number,
  centerX: number,
  centerY: number,
  projectileSpeed: number,
  projectiles: Projectile[],
  setProjectiles: Dispatch<Projectile[]>,
  projectileSize: number,
  context: any
) => {
  console.log("jazda");
  const angle = Math.atan2(clientMouseY - centerY, clientMouseX - centerX);
  const velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };
  const newProjectiles = [...projectiles];
  newProjectiles.push(
    new Projectile(
      context,
      centerX,
      centerY,
      projectileSize,
      "gold",
      velocity,
      false
    )
  );
  setProjectiles(newProjectiles);
};
