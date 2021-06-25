import React from "react";
import useGame from "../game/useGame";
import { LayoutContainer } from "../styled/Layout.styled";
import { GameState } from "../entities/entities";

const Layout = () => {
  const { play, pause, stop, gameState } = useGame();

  return (
    <LayoutContainer>
      <button onClick={gameState === GameState.RUNNING ? stop : play}>
        {gameState === GameState.RUNNING ? "pause" : "play"}
      </button>
    </LayoutContainer>
  );
};

export default Layout;
