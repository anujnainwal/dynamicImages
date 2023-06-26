import React, { useState, useEffect, useRef } from "react";
import "./asset/css/tree.css";
import {
  TreeViewComponent,
  ContextMenuComponent,
} from "@syncfusion/ej2-react-navigations";
import axiosInstance from "../../api/axios";
import { enableRipple } from "@syncfusion/ej2-base";
import NotificationToast from "../NotificationToast/NotificationToast";
enableRipple(true);
function FileManager({ folderId, setFolderId, upload, types, singleFolder,fetchImages }) {
  let menuObj;
  let treeObj;
  let type = useRef();
  let currentSelectFolderId = useRef();
  const [hierarchicalData, setHierarchicalData] = useState([]);

  const [parenId, setParentId] = useState("");

  useEffect(() => {
    fetchHierarchicalData();
  }, []);

  const fetchHierarchicalData = async () => {
    try {
      const response = await axiosInstance.get("/folder/fetchAllFolder");
      const data = response.data.hierarchy;
      setHierarchicalData(data);
    } catch (error) {
      // setError("Failed to fetch hierarchical data.");
      console.error(error);
    }
  };

  const fields = {
    dataSource: hierarchicalData,
    id: "id",
    text: "name",
    child: "subChild",
    iconCss: "icon",
    expanded: "expanded",
    selected: "isSelected",
    htmlAttributes: "hasAttribute",
  };

  const nodeClicked = (args) => {
    if (args.event.which === 3) {
      treeObj.selectedNodes = [args.node.getAttribute("data-uid")];
    }
  };

  const menuItems = [
    { text: "Add New Item" },
    { text: "Rename Item" },
    { text: "Remove Item" },
  ];

  //delete
  let deleteFolder = async (deleteNodeId) => {
    try {
      let response = await axiosInstance.delete(
        `/folder/deleteFolder/${deleteNodeId}`
      );
      let { data, status } = response;

      // console.log(response);
      if (status === 200) {
        // console.log(data);
        NotificationToast({ message: data.message, type: "success" });
      }
    } catch (error) {
      NotificationToast({ message: error.message, type: "error" });
      console.error(error);
    }
  };

  let index = 1;

  const menuClick = (args) => {
    const targetNodeId = treeObj.selectedNodes[0];

    if (args.item.text === "Add New Item") {
      const nodeId = "tree_" + index;
      // setCurrentSelectFolder(targetNodeId);

      const item = { id: nodeId, name: "New Folder" };
      treeObj.addNodes([item], targetNodeId, null);
      index++;
      // setHierarchicalData((prevData) => [...prevData, item]);/
      treeObj.beginEdit(nodeId);
      currentSelectFolderId = targetNodeId;
      type.current = "add";
    } else if (args.item.text === "Remove Item") {
      type.current = "remove";
      treeObj.removeNodes([targetNodeId]);
      deleteFolder(targetNodeId);
      setHierarchicalData((prevData) =>
        prevData.filter((item) => item.id !== targetNodeId)
      );
    } else if (args.item.text === "Rename Item") {
      currentSelectFolderId = targetNodeId;
      type.current = "rename";
      treeObj.beginEdit(targetNodeId);
    }
  };

  //createFolder
  let createFolder = async (folderData) => {
    try {
      // setLoading(true);
      let response = await axiosInstance.post("/folder/createFolder", {
        name: folderData.newText,
        parentFolder: currentSelectFolderId,
      });
      let { data, status } = response;
      if (status === 201) {
        // setLoading(false);
        NotificationToast({ message: data.message, type: "success" });
        setHierarchicalData((preVData) => [...preVData, data.folder]);
      }
      fetchHierarchicalData();
    } catch (e) {
      let {
        data: { error },
        status,
      } = e.response;
      if (status === 400) {
        NotificationToast({ message: error, type: "error" });
      } else if (status === 500) {
        NotificationToast({ message: error, type: "error" });
      }
      await fetchHierarchicalData();
    }
  };

  //rename folder
  let renameFolder = async (folderData) => {
    try {
      let response = await axiosInstance.put("/folder/renameFolder", {
        name: folderData.newText,
        parentId: currentSelectFolderId,
      });
      let { data, status } = response;
      if (status === 200) {
        NotificationToast({ message: data.message, type: "success" });
        setHierarchicalData((preVData) => [...preVData, data.folder]);
      }
      fetchHierarchicalData();
    } catch (error) {
      NotificationToast({ message: error.response.data.error, type: "error" });
      console.error(error);
    }
  };

  const beforeOpen = (args) => {
    // const targetNodeId = treeObj.selectedNodes[0];

    // const targetNode = document.querySelector(
    //   '[data-uid="' + targetNodeId + '"]'
    // );

    if (parenId === null) {
      menuObj.enableItems(["Rename Item"], false);
      menuObj.enableItems(["Remove Item"], false);
    } else {
      menuObj.enableItems(["Remove Item"], true);
      menuObj.enableItems(["Rename Item"], true);
    }

    // if (targetNode.classList.contains("remove")) {
    //   menuObj.enableItems(["Remove Item"], false);
    // } else {
    //   menuObj.enableItems(["Remove Item"], true);
    // }

    // if (targetNode.classList.contains("rename")) {
    //   menuObj.enableItems(["Rename Item"], false);
    // } else {
    //   menuObj.enableItems(["Rename Item"], true);
    // }
  };

  function onNodeSelecting(args) {
    let parentId = args.nodeData.parentID;

    let childId = args.nodeData.id;

    setParentId(parentId);
    if (types === "/") {
      setFolderId(childId);

      
    }

    if (types === "upload") {
      setFolderId(childId);
      console.log(childId);
    }

    // setFolderId(childId ? childId : "");
  }

  return (
    <>
      <div className="control-pane">
        <div className="control-section">
          <div className="control_wrapper">
            <div id="tree">
              <TreeViewComponent
                fields={fields}
                id="treeview"
                ref={(treeview) => {
                  treeObj = treeview;
                }}
                nodeEdited={(fsd) => {
                  if (type.current === "add") {
                    createFolder(fsd);
                  } else if (type.current === "rename") {
                    renameFolder(fsd);
                  }
                }}
                nodeSelected={(e)=>fetchImages(e)}
                nodeSelecting={onNodeSelecting.bind(this)}
                expand={true}
                IsExpandedPropertyName="IsExpanded"
                nodeClicked={nodeClicked.bind(this)}
              />
              <ContextMenuComponent
                id="contentmenutree"
                target="#tree"
                items={menuItems}
                beforeOpen={beforeOpen.bind(this)}
                select={menuClick.bind(this)}
                ref={(contextmenu) => {
                  menuObj = contextmenu;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileManager;
