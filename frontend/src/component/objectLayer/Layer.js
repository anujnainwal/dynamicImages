import React, { useEffect, useState } from "react";
import "./object.css";
import {
  BsFillLockFill,
  BsFillUnlockFill,
  BsFillGrid3X3GapFill,
} from "react-icons/bs";
import { Button } from "react-bootstrap";
import { AiFillDelete, AiOutlineUndo, AiOutlineRedo } from "react-icons/ai";
import CanvasResize from "../offCanvas/CanvasResize";
import "fabric-history";

const Layer = ({ editor, handleDelete, lock, unlock, locked }) => {
  let [ObjectLayerN, setObjectLayerN] = useState([]);
  let [Open, setOpen] = useState(false);
  let [grid, showGrid] = useState(false);

  const setLayer = (id) => {
    var obj = editor.canvas.item(id);
  
    editor.canvas.setActiveObject(obj);
    editor.canvas.renderAll();
  };

  const showTransparencyGrid = () => {
    if (!grid) {
      showGrid(true);
    } else {
      showGrid(false);
    }
  };

  useEffect(() => {
    if (editor) {
      const id = editor.canvas.getObjects().length;
      const layerList = [];
      for (let i = 0; i < id; i++) {
        const text = editor.canvas.getObjects();
        if (text[i].type === "textbox") {
          layerList.push(text[i].text);
        }
        if (text[i].type === "rect") {
          layerList.push("Rectangle");
        }
        if (text[i].type === "circle") {
          layerList.push("circle");
        }
      }

      setObjectLayerN(layerList);
    }
  }, [editor]);

  const transparentHandler = (num) => {
    editor.canvas.getActiveObject().set("opacity", num);
    editor.canvas.renderAll();
  };
// Handle undo
const undo = () => {
  const canvas = editor.canvas;
  console.log(canvas);
  if(canvas?._objects.length > 1){

    canvas.undo()
    canvas.renderAll()
  }


};

// Handle redo
const redo = () => {
  const canvas = editor.canvas;
  if(canvas?._objects.length > 0){

    canvas.redo();
    canvas.renderAll()
  }

};


  return (
    <React.Fragment>
      <section className="object__layer1">
        <div className="layer-Object">
          {ObjectLayerN.length > 0
            ? ObjectLayerN.map((data, id) => (
                <div
                  className="layerDiv"
                  onClick={() => {
                    setLayer(id);
                  }}
                  key={id}
                >
                  <h2 className="text">{data}</h2>

                  <div className="overlay">
                    {locked ? (
                     <BsFillLockFill
                     onClick={unlock}
                      cursor="pointer"
                      title="Lock"
                      className=" me-2"
                    />
                    ) : (
                      <BsFillUnlockFill
                      onClick={lock}
                      cursor="pointer"
                      title="unLock"
                      className=" me-2"
                    />
                    )}
                    <AiFillDelete
                      onClick={() => handleDelete()}
                      cursor="pointer"
                      title="delete"
                      className=" me-2 hover-transparent"
                    />

                    <div className="hover__effect_transparent">
                      <BsFillGrid3X3GapFill
                        cursor="pointer"
                        title=""
                        className="me-2 transparent-hover"
                        onClick={showTransparencyGrid}
                      />
                      {grid === true ? (
                        <div>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.2}
                            defaultValue={1}
                            className="inputRange"
                            onChange={(e) => transparentHandler(e.target.value)}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
        {/* Apply undo and redo functionality */}
        <div className="bottom__operation">
          <CanvasResize Open={Open} setOpen={setOpen} editor={editor} />
          <div className="text-center">
            <Button className="ms-2 me-2 btn-dark shadow " onClick={undo}>
              <AiOutlineUndo /> Undo
            </Button>
            <Button className="btn-dark" onClick={redo}>
              <AiOutlineRedo /> Redo
            </Button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};
export default Layer;
