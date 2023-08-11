import { CustomError } from "./Error.Service";
import { UploadedFile } from "express-fileupload";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "@firebase/storage";
import { initializeApp } from "@firebase/app";
import firebaseConfig from "../utils/firebase_config";

// initialize firebase app
const app = initializeApp(firebaseConfig);

// set parent directory for storage
const PARENT_DIR = "images";

const FileUploadService = {
  // upload file to firebase storage
  upload: async function (file: UploadedFile, name: string) {
    try {
      // console.log(file, file.data);
      // get storage instance
      const storage = getStorage();
      // get reference to storage bucket with parent directory and file name
      const storageRef = ref(storage, `${PARENT_DIR}/${name}`);
      // upload file to storage bucket

      console.log("UPLOAD", file.data, {
        contentType: file.mimetype,
      });
      const uploadTask = await uploadBytes(storageRef, file.data, {
        contentType: file.mimetype,
      });
      console.log("UPLOAD DONE");

      // get download url of uploaded file
      console.log("GET URL");
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      console.log("URL GOT");

      return downloadUrl;
      // throw new CustomError("FILE UPLOAD ERROR", 409);
    } catch (error) {
      console.log(error);
      // error handling is done in controller
      throw error;
    }
  },
  // delete file from firebase storage bucket
  delete: async function (url: string) {
    try {
      // get storage instance
      const storage = getStorage();
      // get file name from url
      const storageRef = ref(storage, `${url}`);
      // delete file from storage bucket
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
      // error handling is done in controller
    }
  },
};
export default FileUploadService;
