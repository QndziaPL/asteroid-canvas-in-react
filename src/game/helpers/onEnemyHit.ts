import Enemy from "../../models/Enemy";
import Projectile from "../../models/Projectile";
import Player from "../../models/Player";

export const onEnemyHit = (
  player: Player,
  enemy: Enemy,
  enemyIndex: number,
  projectiles: Projectile[],
  projectileIndex: number,
  onDestroyEnemy: (index) => void
) => {
  projectiles.splice(projectileIndex, 1);
  if (enemy.hp === 1) {
    onDestroyEnemy(enemyIndex);
    return;
  }
  const critRoll = Math.random();
  const isCrit = player.critChance > critRoll;
  if (isCrit && enemy.hp < 4) {
    onDestroyEnemy(enemyIndex);
    return;
  }
  if (isCrit) {
    enemy.loseHp();
    enemy.loseHp();
    enemy.loseHp();
  } else {
    enemy.loseHp();
  }
};
