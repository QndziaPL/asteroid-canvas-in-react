import React, { useContext, useEffect, useMemo } from "react";
import { AppContainer } from "./styled/App.styled";
import Canvas from "./canvas/Canvas";
import Layout from "./components/Layout";
import { CanvasContext } from "./context/CanvasContext";

function App() {
  const { ctx } = useContext(CanvasContext);
  return (
    <AppContainer>
      <Canvas />
      {ctx && <Layout />}
    </AppContainer>
  );
}

export default App;
