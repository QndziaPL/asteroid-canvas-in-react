import { createContext, FC, useEffect, useMemo, useState } from "react";

interface CanvasContextInterface {
  ctx: any;
  canvas: any;
  setCanvas: any;
}

const CanvasContext = createContext<CanvasContextInterface>({
  ctx: null,
  canvas: null,
  setCanvas: null,
});

const CanvasContextProvider: FC = ({ children }) => {
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);

  const api = useMemo(() => ({ ctx, canvas, setCanvas }), [ctx, canvas]);

  useEffect(() => {
    if (canvas) {
      //@ts-ignore
      setCtx(canvas.getContext("2d"));
    }
  }, [canvas]);
  console.log(ctx, canvas);

  return (
    <CanvasContext.Provider value={api}>{children}</CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasContextProvider };
