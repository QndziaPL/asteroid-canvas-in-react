import Player from "../../models/Player";
import Enemy from "../../models/Enemy";
import { Dispatch } from "react";

export const playerHitByEnemy = (
  player: Player,
  enemies: Enemy[],
  setEnemies: Dispatch<Enemy[]>,
  enemyIndex: number,
  endGame: () => void,
  showToast: (msg) => void
) => {
  if (player.bonuses.shield > 0) {
    const copyOfEnemies = [...enemies];
    copyOfEnemies.splice(enemyIndex, 1);
    setEnemies(copyOfEnemies);
    player.useShield();
    showToast("Shield saved your life");
    return;
  }
  endGame();
};
