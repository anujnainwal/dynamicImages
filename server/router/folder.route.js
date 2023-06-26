const express = require("express");
const router = express.Router();
const folderController = require("../controller/folder/folder.controller");

router.get("/fetchAllFolder", folderController.getFolders);
router.get("/isFolderExist", folderController.checkFolderExist);
router.get('/getFolderById/:id',folderController.getFolderById)
router.post("/createFolder", folderController.createFolder);
router.put("/renameFolder", folderController.renameFolder);
router.delete("/deleteFolder/:deleteNodeId", folderController.deleteFolder);
module.exports = router;