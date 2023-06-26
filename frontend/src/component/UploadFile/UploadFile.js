import { useState, useRef } from "react";
import "./uploadFile.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import Layout from "../../layouts/Layout";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ErrorModal from "../error/ErrorModal";

import FileManager from "../filemanager/FileManager";
import Loader from "../loader/Loader";

const WelcomeScreen = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [show, setShow] = useState(false);
  const [imageError, setImageError] = useState(null);
const [isLoading,setIsLoading] = useState(false)
  const [folderId, setFolderId] = useState("null");

  const customUploadRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let navigate = useNavigate();
  let handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };
  let handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  let handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      let file = e.dataTransfer.files[0];
      if (file.size > 1048576) {
        alert("File size should be less than 1MB.");
        return;
      }

      let bodyForm = new FormData();
      bodyForm.append("image", file);
      try {
        let res = await axiosInstance.post("/upload", bodyForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 201) {
          let { id } = res.data;

          navigate(`/image/${id}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  function getBase64(file, onLoadCallback) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  let handleUploader = async (e) => {
    let file = e.target.files[0];

    if (!folderId) {
      alert("Please select folder.");
    }
    if (file.size > 1000000) {
      setImageError("Image size must be less than 1MB");
      handleShow();
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png","image/JPG", "image/JEPG", "image/PNG"];
    if (!allowedTypes.includes(file.type)) {
      setImageError(
        ` Only .jpg, .jpeg, and .png file types are allowed. Please upload a file with one of these extensions.`
      );
      handleShow();
      return;
    }
    let promise = getBase64(file);
    let encoded_file4 = await promise;

    try {
      setIsLoading(true)
      console.log("Select Folder id is: " + folderId);
      let res = await axiosInstance.post("/upload", {
        imageName: file.name,
        data: encoded_file4,
        mimeType: file.type,
        filename: file.name,
        folderId: folderId,
      });
    
      if (res.status === 201) {
        setIsLoading(false)
        let { id } = res.data;
        setFolderId("");
        if (id === undefined) {
          alert("Invalid");
        }
        navigate(`/image/${id}`);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false)
      setImageError("Please Select Folder ");
      handleShow();
    }
  };
  if(isLoading === true){
    return <Loader />
  }

  return (
    <Layout title="Personalized An Image">
      <ErrorModal
        title="Error"
        handleClose={handleClose}
        handleShow={handleShow}
        show={show}
        setShow={setShow}
      >
        <span>{imageError}</span>
      </ErrorModal>
      <div className="upload__border">
        <div className="folder__treeData uploadFolder">
          <FileManager
            folderId={folderId}
            setFolderId={setFolderId}
            types="upload"
          />
        </div>
        <div
          className="uploading__file"
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          {isDragging && (
            <div className="dragging">
              <span>Drop File Here... </span>{" "}
            </div>
          )}
          <div className={isDragging ? "uploadFile2" : "uploadFile"}>
            <div className="upload_content">
              <span className="upload__icons">
                <AiOutlineCloudUpload fontSize={50} />
              </span>
              <span className="upload__content">Drag and Drop file here</span>
            </div>
            <input
              type="file"
              ref={customUploadRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploader}
            />
            <br />

            <button
              style={{ zIndex: 9999 }}
              onClick={(e) => customUploadRef.current.click()}
              className={isDragging ? `active` : `imageButton`}
            >
              <AiOutlineCloudUpload
                fontSize={30}
                style={{ margin: "0 10px" }}
              />
              Select Image
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomeScreen;
