import React, { useState, useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";

function Canvas() {
  const [canvas, setCanvas] = useState(null);
  const { editor } = useFabricJSEditor();

  useEffect(() => {
    if (canvas) {
      editor.canvas = canvas;
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 50,
        height: 50
      });
      editor.canvas.add(rect);
    }
  }, [canvas, editor]);

  return (
    <div>
      <FabricJSCanvas className="canvas-container" onReady={setCanvas} />
    </div>
  );
}

export default Canvas;
