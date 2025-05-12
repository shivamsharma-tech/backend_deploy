import { prisma } from "@/app";
import { createUser, deleteAllUser, deleteUser, getAllUser, getUser, loginUser, logoutUser, updateUser } from "@/controllers/user";
import { Router } from "express";

 const app = Router()

app.post("/add-user",createUser)
app.post("/login",loginUser)
app.post("/logout",logoutUser)
app.get("/get-users",getAllUser)
app.get("/get-user",getUser)
app.delete("/delete-user",deleteUser)
app.put("/update-user/:id",updateUser)
app.delete("/delete-all",deleteAllUser)


 export default app;