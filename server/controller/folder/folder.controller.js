const Folders = require("../../model/folder/Folder.model");
const mongoose = require("mongoose");

/*
    @route get api/folders
    @desc Get all folders data
    @access public
*/

exports.getFolders = async (req, res, next) => {
  try {
    let rootId;
    function buildHierarchy(arrays, parentId) {
      let hierarchy = [];

      for (let i = 0; i < arrays.length; i++) {
        let item = arrays[i];

        if (item.parentFolder === parentId) {
          let node = {
            id: item._id.toString(),
            parentId: parentId,
            name: item.name,
            imageData: item.imageData,
            isFolder: true,
            icon: "folder",
            expanded: true,
            isSelected: true,
            subChild: buildHierarchy(arrays, item._id.toString()),
          };

          hierarchy.push(node);
        }
        if ("null" === item.parentFolder) rootId = item._id.toString();
      }

      return hierarchy;
    }

    let folder = await Folders.find().populate("imageData");

    let hierarchy = buildHierarchy(folder, "null");
    return res
      .status(200)
      .json({ message: "All folder fetched.", hierarchy, rootId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
/*
    @route Private api/createFolder
    @desc Create a Folder
    @access private
*/
exports.createFolder = async (req, res, next) => {
  let { name, parentFolder } = req.body;
  console.log(req.body);
  try {
    let folder;
    if (
      name !== "" &&
      typeof name === "string" &&
      name !== undefined &&
      name !== null
    ) {
      if (parentFolder !== null) {
        let isExist = await Folders.findOne({
          name: name,
          parentFolder: parentFolder,
        });
        if (isExist) {
          return res
            .status(400)
            .json({ error: `This folder ${name} already exists` });
        }
        // Create a new Folder document
        folder = new Folders({
          name: name,
          parentFolder: parentFolder,
        });
      } else {
        let rootId = await Folders.findOne({ parentFolder: null });
        if (!rootId) {
          return res.status(400).json({ error: "Root folder does not exist" });
        }
        let isExist = await Folders.findOne({
          name: name,
          parentFolder: parentFolder,
        });
        if (isExist) {
          return res
            .status(400)
            .json({ error: `This folder ${name} already exists` });
        }
        folder = new Folders({
          name: name,
          parentFolder: rootId._id,
        });
      }
      await folder.save();
      return res
        .status(201)
        .json({ message: "Folder created successfully", folder });
    } else {
      return res.status(400).json({ error: "Name is required." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/*
    @route Put api/updateFolder
    @desc update a Folder
    @access put
*/
exports.renameFolder = async (req, res, next) => {
  let { parentId, name } = req.body;
  try {
    const isRootExist = await Folders.findOne({ _id: parentId });
    if (!isRootExist) {
      return res.status(400).json({ error: "Parent Id not found." });
    }
    isRootExist.name = name;
    await isRootExist.save();
    return res
      .status(200)
      .json({ message: "Update Folder fetched.", isRootExist });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/*
    @route Delete api/deleteFolder
    @desc Delete a folder data 
    @access private
*/
exports.deleteFolder = async (req, res, next) => {
  try {
    const { deleteNodeId } = req.params;

    // Find the folder by ID
    const folder = await Folders.findById(deleteNodeId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found." });
    }

    // Recursive function to delete folder and its children
    async function deleteFolderRecursive(deleteNodeId) {
      // Find all child folders
      const childFolders = await Folders.find({ parentFolder: deleteNodeId });

      // Delete child folders recursively
      for (const childFolder of childFolders) {
        await deleteFolderRecursive(childFolder._id);
      }

      // Delete associated content data (imageData and JSON files) if applicable
      // Replace 'contentData' with the appropriate field name in your schema
      if (folder.contentData) {
        // Delete image data if available
        if (folder.imageData) {
          // Perform image data deletion logic here
          // ...
        }

        // Delete JSON data if available
        if (folder.jsonPath) {
          // Perform JSON data deletion logic here
          // ...
        }
      }

      // Finally, delete the folder itself
      await Folders.findByIdAndDelete(deleteNodeId);
    }

    // Call the recursive delete function
    await deleteFolderRecursive(deleteNodeId);

    return res.status(200).json({ message: "Folder deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.checkFolderExist = async (req, res, next) => {
  try {
    let { name, parentId: parentFolder } = req.query;

    const isExist = await Folders.findOne({ parentFolder, name });
    if (isExist) {
      return res
        .status(400)
        .json({ status: 0, error: `This folder ${name} already exists.` });
    }

    return res.status(200).json({ message: "check folder route" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
/*
    @route get api/single folder
    @desc Get all folders data
    @access public
*/
exports.getFolderById = async (req, res, next) => {
  try {
    let {id} = req.params;
    

    const isExist = await Folders.findOne({ _id:id }).populate('imageData');
    if (!isExist) {
      return res
        .status(400)
        .json({ status: 0, error: `This folder not found.` });
    }

    return res.status(200).json({ message: "Single Folder fetch",isExist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};