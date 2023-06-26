import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./style/HomeComponent.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import axiosInstance from "../../api/axios";
import { Form, Pagination, Spinner } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import AlertMessage from "../alert/AlertMessage";
import Paginations from "../pagination/Paginations";

import FileManager from "../filemanager/FileManager";

const HomeComponent = () => {
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [selectedNodeId, setSelectedNodeId] = useState("null");
  let [folderId, setFolderId] = useState(null);

  let [errorData, setDataError] = useState("");

  const [paginationData, setPaginationData] = useState({});
  const [parentId, setParentId] = useState(null);

  const [page, setPage] = useState(1);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const handlePrevPage = (props) => {
    console.log(props);
    setPage((prevPage) => prevPage - 1);
  };

  const fetchImages = async (type) => {
    try {
      setSelectedNodeId(type === "null" ? "null" : type);
      setLoading(true);
      let response = await axiosInstance.get(
        `/images?type=${type}&page=${page}`
      );
      let {
        data: {
          Imgdata,
          count,
          hasNextPage,
          hasPrevPage,
          lastPage,
          nextPage,
          privousPage,
          currentPage,
        },
        status,
      } = response;
      if (status === 200) {
        setLoading(false);
        setData(Imgdata);
        setPaginationData({
          count,
          hasNextPage,
          hasPrevPage,
          lastPage,
          nextPage,
          currentPage,
          privousPage,
        });
       
      }
    } catch (err) {
  
      let {data,status} = err?.response;
      if(status === 404){
        setLoading(false)
    
        setDataError(data?.error)
        setPage(1)
        setData([])
      }
    }
  };

  //single FaFolder
  let singleFolderData = async (id) => {
    try {
      let response = await axiosInstance.get("/folder/getFolderById/" + id);
      console.log("single", response);
    } catch (error) {
      console.error(error?.response);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchImages(selectedNodeId);

    return () => {
      // Abort the ongoing fetch requests
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderName, selectedNodeId, page]);

  return (
    <Container fluid="md">
      <Row>
        <Col md={4} className="mb-5">
          <div className="folder_structure">
            <div className="folder_structure_heading">
              <span>Folders</span>
            </div>

            <div className="folder__treeData">
              <FileManager
                parentId={parentId}
                setFolderId={setFolderId}
                setParentId={setParentId}
                singleFolder={singleFolderData}
                fetchImages={(e) => setSelectedNodeId(e.nodeData.id)}
              />
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="image-box">
            <div className="heading">
              <h4>All Images ({data.length || 0})</h4>
            </div>

            {
              !loading ? <>{data.length > 0 ? (
                data.map((data, index) => {
                  return (
                    <Link to={`/image/${data._id}`} key={index}>
                      <img src={data.data} alt="img" />
                    </Link>
                  );
                })
              ) : (
               
                <div className="no-data">{errorData ? errorData : ""}</div>
              )}</>:<div className="loading_spinner"><Spinner /></div>
            }
          </div>
          <div className="pagination">
            {data.length > 0 && (
              <Paginations
                data={paginationData}
                page={page}
                setPage={setPage}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
              />
            )}
          </div>
        </Col>
      </Row>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default HomeComponent;
