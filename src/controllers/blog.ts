import { prisma } from "@/app";
import { TryCatch } from "@/middlewares/error";


export const NewBlog = TryCatch(async  (req,res) => {
    const {title,content} = req.body;
    const blog = await prisma.blog.create({
        data:{
            title,
            content,
        }
    })
    res.send({
        message:"new blog created",
        user:blog
    })
})