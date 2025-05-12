import { prisma } from "@/app";
import { createBook, deleteBook, getBooks, updateBook } from "@/controllers/book";
import bodyParser from "body-parser";
import { Router } from "express";
import multer from'multer'
import path from "path";

const app = Router()


const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
      cb(null, "src/uploads/"); // ✅ Fixed typo: was 'cd' instead of 'cb'
    },
    filename: function (req:any, file:any, cb:any) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
  });
const upload = multer({ storage })


 app.post('/add-book',upload.single('image'),createBook);
app.get("/get-books",getBooks)
app.delete("/delete-book",deleteBook)
app.put("/update-book/:id",upload.single('image'),updateBook)


 export default app;