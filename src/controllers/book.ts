import { error } from "console";
import { error } from "console";
import { prisma } from "@/app";
import { TryCatch } from "@/middlewares/error";
import AESService from "@/service/aes.service";
import path from "path";
import multer from "multer";
import { verifyToken } from "@/middlewares/jwt";
import jwt from "jsonwebtoken";
import fs from "fs"

export const createBook = TryCatch(async (req, res) => {
  const { title, description, price } = req.body;
  const image = req.file; // ✅ File comes from multer middleware
  //   console.log(req.file);
  const token = req.headers.token;
  // console.log(page);
  const result = verifyToken(token);

  const tokenData = jwt.decode(token);
  if (tokenData.role !== "Admin") {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized for crate" });
  }
  // console.log(result);

  if (result.error) {
    return res.status(401).json({ sucess: false, message: result.error });
  }

  if (!image) {
    return res
      .status(400)
      .json({ success: false, message: "Image is required." });
  }

  // ✅ Save the book to the database
  const book = await prisma.book.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      image: image.filename, // ✅ Save the image filename
    },
  });

  res.status(201).json({
    success: true,
    message: "New book created!",
    book: book,
  });
});

export const updateBook = TryCatch(async (req, res) => {
  const id = req.params.id;
  const image = req?.file; // ✅ File comes from multer middleware
  // console.log(Number(id));
  const token = req.headers.token;
  // console.log(page);
  const result = verifyToken(token);
  const tokenData = jwt.decode(token);
  if (tokenData.role !== "Admin") {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized for crate" });
  }
  // console.log(result);

  if (result.error) {
    return res.status(401).json({ sucess: false, message: result.error });
  }

  let { title, description, price } = req.body;

//   delete image when image update

//   if (!req.body.image) {
//     const imageForDelete =await prisma.book.findUnique({
//         where:{
//             id:Number(id)
//         },select:{
//             image:true
//         }
//     })
//     console.log(imageForDelete);
    
//     fs.unlink(`./src/uploads/${imageForDelete.image}`, (err) => {
//         if (err) {
//           console.error('Error deleting image:', err);
//         } else {
//           console.log('Image deleted successfully!');
//         }
//       });
//   }
  const book = await prisma.book.update({
    where: {
      id: Number(id),
    },
    data: {
      title: title,
      description: description,
      price: parseFloat(price),
      image: req.body.image ? req.body?.image : image?.filename,
    },
  });
  res.send({
    message: "book updated",
    book: book,
  });
});

export const getBooks = TryCatch(async (req, res) => {
  const { page } = req.query;
  const token = req.headers.token;
  // console.log(token);
  const result = await verifyToken(token);

  console.log(result);

  if (result.error) {
    return res.status(401).json({ sucess: false, message: result.error });
  }

  const books = await prisma.book.findMany({
    skip: page * 15,
    take: 15,
  });

  res.send({
    message: "books retrieve",
    books: books,
  });
});

export const deleteBook = TryCatch(async (req, res) => {
  const { id } = req.query;
  const token = req.headers.token;
  // console.log(page);
  const result = verifyToken(token);
  const tokenData = jwt.decode(token);
  if (tokenData.role !== "Admin") {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized for crate" });
  }
  // console.log(result);

  if (result.error) {
    return res.status(401).json({ sucess: false, message: result.error });
  }

  const book = await prisma.book.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send({
    message: "book delete",
    book: book,
  });
});
