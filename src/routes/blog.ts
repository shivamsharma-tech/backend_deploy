import { prisma } from "@/app";
import { NewBlog } from "@/controllers/blog";
import { Router } from "express";

 const app = Router()

app.post("/new-blog",NewBlog)
// app.get("/new-blog",async(req,res) => {
//     const user = await prisma.blog.findMany()
//     res.status(200).json({
//       success:true,
//       message:"New User Create",
//       user:user
//     })
// })

 export default app;