import React, { useRef, useState, useCallback, useEffect } from "react";
import { fabric } from "fabric";
import "./imageUploader.css";
import ErrorModal from "../error/ErrorModal";

const ImageUploader = ({ editor }) => {
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const [imageError, setImageError] = useState(null);
  const testRef = useRef();
  const imgObjRef = useRef(null);
  const getBase64 = useCallback((file) => {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //upload image
  const handleUploader = async (e) => {
    try {
      const file = e.target.files[0];
      if (file.size > 1000000) {
        setImageError("Image size must be less than 1MB");
        handleShow();
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageError(
          ` Only .jpg, .jpeg, and .png file types are allowed. Please upload a file with one of these extensions.`
        );
        handleShow();
        return;
      }

      const encoded_file4 = await getBase64(file);
      setImage(encoded_file4);
      console.log(image);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (editor && image) {
      fabric.Image.fromURL(
        image,
        (img) => {
          // Check if the current image is the same as the previously added image

          if (
            imgObjRef.current &&
            imgObjRef.current.getSrc() === img.getSrc()
          ) {
            return;
          }
          const maxWidth = 100;
          const maxHeight = 200;
          const scaleRatio = Math.min(
            maxWidth / img.width,
            maxHeight / img.height
          );
          const width = img.width * scaleRatio;
          const height = img.height * scaleRatio;

          if (imgObjRef.current) {
            var oImg = img.set({
              left: 50,
              top: 100,
              width: width,
              height: height,
            });

            editor.canvas.add(oImg);
          }
          editor.canvas.add(img);
          imgObjRef.current = img;
          editor.canvas.renderAll();
        },
        (error) => {
          console.error("Error loading image: ", error);
        }
      );
    }
  }, [editor, image]);

  return (
    <section className="imageUpload">
      <ErrorModal
        title="Error"
        handleClose={handleClose}
        handleShow={handleShow}
        show={show}
        setShow={setShow}
      >
        <span>{imageError}</span>
      </ErrorModal>
      <input
        type="file"
        ref={testRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleUploader}
      />

      <button style={{ zIndex: 9999 }} onClick={() => testRef.current.click()}>
        Images
      </button>
    </section>
  );
};

export default ImageUploader;
