import { prisma } from "@/app";
import { TryCatch } from "@/middlewares/error";
import AESService from "@/service/aes.service";
import { error } from "console";
import { generateToken, verifyToken } from "../middlewares/jwt";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";



export const loginUser = TryCatch(async (req, res) => {
    // const id = req.params.id
    const { email, password } = req.body;
    console.log(req.body);
  
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
    console.log(user);
  
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }
  
    const isPasswordvalid = await bcrypt.compare(password, user?.password);
    if (!isPasswordvalid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  
    const token = generateToken(user);
  
    await prisma.token.create({
      data: {
        value: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  
    // console.log(jwt.decode(token));
  
    res.json({
      sucess: true,
      message: "user Login successfully",
      token: token,
    });
  });
  
  export const logoutUser = TryCatch(async (req, res) => {
    // const id = req.params.id
    const userToken = req.headers.token;
    console.log(userToken);
  
    const checkToken = verifyToken(userToken);
    if (checkToken.error) {
      return res.status(401).json({ sucess: false, message: checkToken.error });
    }
    await prisma.token.delete({
      where: {
        value: userToken,
      },
    });
    // console.log(user);
  
    // console.log(jwt.decode(token));
  
    res.json({
      sucess: true,
      message: "user Logout successfully",
      // token:token
    });
  });



export const createUser = TryCatch(async (req, res) => {
  console.log(req.body);
    console.log("*****");
    
  let { name, email, password, roleId } = req.body;
  // email = await AESService.encrypt(email);
  // name = await AESService.encrypt(name);
  // age = await AESService.encrypt(age);

  const hassePasword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      roleId,
      password: hassePasword,
    },
    include: {
      role: true, // Ensure the role is included
    },
  });
  res.json({
    user,
  });
});

export const updateUser = TryCatch(async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  
  const { name, email, password,roleId } = req.body;
  const hassePasword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: {
      id:Number(id),
    },
    data: {
      name,
      email,
      roleId,
      password: hassePasword,
    },include:{
        role:true
    }
  });
  res.send({
    message: "user updated",
    user: user,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const { name, email, age } = req.body;
  const user = await prisma.user.findMany({
    include:{
        role:true
    }
  });
  res.send({
    message: "users retrieve",
    user: user,
  });
});

export const getUser = TryCatch(async (req, res) => {
  const token = req.headers.token
  const { name, email, age, password } = req.query;
  // console.log(email,password);
    const result = verifyToken(token)

  const user = await prisma.user.findUnique({
    where: {
      email,
      password,
    },
  });
  if (user) {
    res.send({
      message: "user retrieve",
      // user:{name:await AESService.decrypt(user?.name),email:await AESService.decrypt(user?.email)}
      user: user,
    });
  } else {
    res.send({
      error: "User Not Found",
    });
  }
});

export const deleteUser = TryCatch(async (req, res) => {    
  const id = req.query.id;
//   console.log(id);
  const { name, email, age } = req.body;
  const user = await prisma.user.delete({
    where: {
      id:Number(id),
    },
  });
  res.send({
    message: "user deleted",
    user: user,
  });
});

export const deleteAllUser = TryCatch(async (req, res) => {
  console.log("*****");

  const id = req.params.id;
  const { name, email, age } = req.body;
  const user = await prisma.user.deleteMany();
  res.send({
    message: "all user deleted",
    user: user,
  });
});
