import React, { useEffect, useRef, useContext } from "react";
import { CanvasContext } from "../context/CanvasContext";

const Canvas = () => {
  const calendarRef = useRef(null);
  const { canvas, setCanvas } = useContext(CanvasContext);

  useEffect(() => {
    if (calendarRef.current) {
      setCanvas(calendarRef.current);
    }
  }, [calendarRef.current]);

  return (
    <canvas
      ref={calendarRef}
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
};

export default Canvas;
