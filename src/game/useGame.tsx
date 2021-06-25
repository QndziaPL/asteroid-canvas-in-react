import { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../context/CanvasContext";
import { GameState } from "../entities/entities";
import Player from "../models/Player";
import { shootProjectile } from "./helpers/shootProjectile";
import Projectile from "../models/Projectile";
import Particle from "../models/Particle";
import Enemy from "../models/Enemy";
import { playerHitByEnemy } from "./helpers/playerHitByEnemy";
import { createParticlesOnHit } from "./helpers/createParticlesOnHit";
import { onEnemyHit } from "./helpers/onEnemyHit";
import { ultimateProjectileShot } from "./helpers/ultimateProjectileShot";
import { manageHighScore } from "./helpers/manageHighScore";
import { spawnEnemies } from "./helpers/spawnEnemies";

const BASE_SHOOT_TIMEOUT = 300;
const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.FINISHED);
  const { ctx, canvas } = useContext(CanvasContext);

  const [shootIntervalId, setShootIntervalId] = useState(0);
  const [animationId, setAnimationId] = useState(0);
  const [notMissedTimerId, setNotMissedTimerId] = useState(0);
  const [difficultyTimerId, setDifficultyTimerId] = useState(0);

  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  const [player, setPlayer] = useState<Player>(
    new Player(centerX, centerY, 15, "#006868")
  );

  const [clientMouseX, setClientMouseX] = useState(0);
  const [clientMouseY, setClientMouseY] = useState(0);

  const [attackSpeed, setAttackSpeed] = useState(1.4);
  const [difficulty, setDifficulty] = useState(1);

  const [particles, setParticles] = useState<Particle[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);

  const [maxEnemiesHp, setMaxEnemiesHp] = useState(2);
  const [projectileSize, setProjectileSize] = useState(3);
  const [projectileSpeed, setProjectileSpeed] = useState(2);
  const [score, setScore] = useState(0);
  const [scoreSpeedModifier, setScoreSpeedModifier] = useState(1);

  const [seconds, setSeconds] = useState(20);
  const [spawnEnemiesIntervalId, setSpawnEnemiesIntervalId] = useState(0);
  const [ultimateChargeBar, setUltimateChargeBar] = useState(0);
  const [secondsSinceMiss, setSecondsSinceMiss] = useState(0);
  const [lastUpdatedSecondsSinceMissFor, setLastUpdatedSecondsSinceMissFor] =
    useState(0);

  const initialSetup = () => {
    setPlayer(new Player(centerX, centerY, 15, "#006868"));

    setCenterX(canvas.width / 2);
    setCenterY(canvas.height / 2);

    setClientMouseX(0);
    setClientMouseY(0);
    setAttackSpeed(1.4);
    setDifficulty(1);

    setParticles([]);
    setEnemies([]);
    setProjectiles([]);

    setMaxEnemiesHp(2);
    setProjectileSize(3);
    setProjectileSpeed(2);
    setScore(0);
    setScoreSpeedModifier(1);
    setSeconds(20);
    setSpawnEnemiesIntervalId(0);
    setUltimateChargeBar(0);
    setSecondsSinceMiss(0);
    setLastUpdatedSecondsSinceMissFor(0);
  };

  useEffect(() => {
    if (canvas) {
      initialSetup();
    }
  }, [canvas]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseEvents);
    window.addEventListener("mouseup", handleMouseEvents);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);
  }, []);

  const handleKeyPress = (e) => {
    if (e.keyCode === 32) {
      ultimateProjectileShot(
        player,
        score,
        projectileSpeed,
        projectiles,
        projectileSize,
        setProjectiles,
        ctx,
        centerX,
        centerY
      );
    }
  };

  const handleMouseMove = (e) => {
    setClientMouseX(e.clientX);
    setClientMouseY(e.clientY);
  };

  const handleMouseEvents = (event) => {
    if (event.type === "mousedown") {
      shootProjectile(
        clientMouseX,
        clientMouseY,
        centerX,
        centerY,
        projectileSpeed,
        projectiles,
        setProjectiles,
        projectileSize,
        ctx
      );
      let id = window.setInterval(() => {
        shootProjectile(
          clientMouseX,
          clientMouseY,
          centerX,
          centerY,
          projectileSpeed,
          projectiles,
          setProjectiles,
          projectileSize,
          ctx
        );
      }, BASE_SHOOT_TIMEOUT / attackSpeed);
      setShootIntervalId(id);
    } else {
      console.log("czyszczę");
      clearInterval(shootIntervalId);
    }
  };

  const play = () => {
    if (!ctx) return;
    initialSetup();
    setGameState(GameState.RUNNING);
    showToast("Jazda!");
    animateGame();
    spawnEnemies(
      setSpawnEnemiesIntervalId,
      canvas,
      centerX,
      centerY,
      scoreSpeedModifier,
      maxEnemiesHp,
      enemies,
      setEnemies,
      ctx
    );
    startMissedTimer();
    timer();
  };

  const pause = () => {
    // setGameState(GameState.PAUSED);
  };

  const stop = () => {
    setGameState(GameState.FINISHED);
    cancelAnimationFrame(animationId);
  };

  const checkBonuses = () => {
    if (lastUpdatedSecondsSinceMissFor === secondsSinceMiss) return;
    if (secondsSinceMiss > 0 && secondsSinceMiss % 10 === 0) {
      player.getShield();
      showToast("You obtained shield!");
      setLastUpdatedSecondsSinceMissFor(secondsSinceMiss);
    }
  };

  const showPointsAndInfo = () => {
    //TODO: make some layout for it
  };

  const animateGame = () => {
    const id = requestAnimationFrame(animateGame);
    setAnimationId(id);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    checkBonuses();
    showPointsAndInfo();

    console.log(player);
    player.draw(ctx);

    particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      } else {
        particle.update();
      }
    });

    projectiles.forEach((projectile, index) => {
      projectile.update();

      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        setTimeout(() => {
          if (!projectile.partOfUltimate) {
            player.halveCriticalChance();
            missedRecently();
          }
          projectiles.splice(index, 1);
        }, 0);
      }
    });

    enemies.forEach((enemy, index) => {
      enemy.update();
      const playerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if (playerDist - enemy.radius - player.radius < 1) {
        playerHitByEnemy(
          player,
          enemies,
          setEnemies,
          index,
          endGame,
          showToast
        );
      }
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        if (dist - enemy.radius - projectile.radius < 1) {
          setTimeout(() => {
            onEnemyHit(
              player,
              enemy,
              index,
              projectiles,
              projectileIndex,
              onDestroyEnemy
            );
            createParticlesOnHit(
              projectile.x,
              projectile.y,
              enemy.radius,
              ctx,
              particles,
              setParticles
            );
          }, 0);
        }
      });
    });
  };

  const onDestroyEnemy = (enemyIndex) => {
    enemies.splice(enemyIndex, 1);
    setProjectileSpeed(projectileSpeed + 0.1);
    setScore(score + 10);
    setScoreSpeedModifier(Math.floor(score / 100) * 0.1 + 1);
    setProjectileSize(Math.floor(score / 100) + 3);
    updateUltimateChargeBar();
    player.increaseCriticalChance();
  };

  const updateUltimateChargeBar = () => {
    if (ultimateChargeBar < 9) {
      setUltimateChargeBar(ultimateChargeBar + 1);
    } else {
      player.getUltimateCharge();
      setUltimateChargeBar(0);
      showToast("Ultimate pierdolnięcie + 1");
    }
  };

  //TODO
  const showToast = (msg) => {
    console.log(msg);
  };

  const endGame = () => {
    manageHighScore(score);

    clearMultipleIntervals();
    cancelAnimationFrame(animationId);

    // gameOverScoreEl.innerHTML = `${score} points`;
    // gameOverModalEl.style.display = "flex";
  };

  const clearMultipleIntervals = () => {
    clearInterval(spawnEnemiesIntervalId);
    clearInterval(difficultyTimerId);
    clearInterval(notMissedTimerId);
  };

  const startMissedTimer = () => {
    const id = window.setInterval(() => {
      setSecondsSinceMiss(secondsSinceMiss + 1);
    }, 1000);
    setNotMissedTimerId(id);
  };

  const timer = () => {
    const id = window.setInterval(() => {
      updateTimerLogic();
    }, 1000);
    setDifficultyTimerId(id);
  };

  const updateTimerLogic = () => {
    setSeconds(seconds - 1);
    if (seconds === 0) {
      increaseDifficulty();
      setSeconds(20);
    }
  };

  const missedRecently = () => {
    setSecondsSinceMiss(0);
  };

  const increaseDifficulty = () => {
    setDifficulty(difficulty + 1);
    setMaxEnemiesHp(maxEnemiesHp + 1);
    showToast("Difficulty increased");
  };

  return {
    play,
    pause,
    gameState,
    stop,
  };
};

export default useGame;
