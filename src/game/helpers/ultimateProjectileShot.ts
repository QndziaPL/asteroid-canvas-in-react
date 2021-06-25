import Player from "../../models/Player";
import Projectile from "../../models/Projectile";
import { Dispatch } from "react";

export const ultimateProjectileShot = (
  player: Player,
  score: number,
  projectileSpeed: number,
  projectiles: Projectile[],
  projectileSize: number,
  setProjectiles: Dispatch<Projectile[]>,
  context: any,
  centerX: number,
  centerY: number
) => {
  if (player.ultimateCharges > 0) {
    let numberOfProjectiles = Math.floor(score / 6);
    if (numberOfProjectiles < 5) {
      numberOfProjectiles = 5;
    }
    if (numberOfProjectiles > 50) {
      numberOfProjectiles = 50;
    }
    let newProjectiles: Projectile[] = [];
    for (let i = 0; i < numberOfProjectiles; i++) {
      const oneTick = 6.28 / numberOfProjectiles;
      const angle = oneTick * (i + 1);
      const velocity = {
        x: (Math.cos(angle) * projectileSpeed) / 2,
        y: (Math.sin(angle) * projectileSpeed) / 2,
      };
      newProjectiles.push(
        new Projectile(
          context,
          centerX,
          centerY,
          projectileSize,
          "gold",
          velocity,
          true
        )
      );
    }
    setProjectiles([...projectiles, ...newProjectiles]);
    player.useUltimateCharge();
  }
};
