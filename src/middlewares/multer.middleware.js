import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {  // this decides, Where to store the uploaded file
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {//this decides , What the file should be named when saved.
    cb(null, file.originalname)
  }
})



//This means:  
// 👉 “Create a multer middleware that uses this storage configuration.”
export const upload = multer({  
    storage
})

