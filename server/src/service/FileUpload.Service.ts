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

const app = initializeApp(firebaseConfig);

const PARENT_DIR = "images";

const FileUploadService = {
  upload: async function (file: UploadedFile, name: string) {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `${PARENT_DIR}/${name}`);
      const uploadTask = await uploadBytes(storageRef, file.data, {
        contentType: file.mimetype,
      });
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      return downloadUrl;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  delete: async function (url: string) {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `${url}`);
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
export default FileUploadService;
