import Enemy from "../../models/Enemy";
import { Dispatch } from "react";

export const spawnEnemies = (
  setSpawnEnemiesIntervalId: (id) => void,
  canvas: any,
  centerX: number,
  centerY: number,
  scoreSpeedModifier: number,
  maxEnemiesHp: number,
  enemies: Enemy[],
  setEnemies: Dispatch<Enemy[]>,
  context
) => {
  const id = setInterval(() => {
    const radius = Math.random() * 26 + 7;
    const speedModifier = Math.random() * 3;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const angle = Math.atan2(centerY - y, centerX - x);
    const velocity = {
      x: Math.cos(angle) * speedModifier * scoreSpeedModifier,
      y: Math.sin(angle) * speedModifier * scoreSpeedModifier,
    };
    const hp = Math.floor(Math.random() * maxEnemiesHp) + 1;
    enemies.push(new Enemy(context, x, y, radius, velocity, hp));
  }, 1500);
  setSpawnEnemiesIntervalId(id);
};
