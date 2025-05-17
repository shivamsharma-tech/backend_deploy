import { prisma } from "@/app";
import jwt from "jsonwebtoken"
import { CronJob } from 'cron';
import fs from "fs";

const SECRET_KEY = "SHIVAM_SHARMA"

interface User{
    id:number,
    email:string,
    role:any,
    name:string
}

export  function generateToken(user:User){
    return jwt.sign(
        {
        id:user.id,email:user.email,role:user.role.name,name:user.name
    },
    SECRET_KEY,
    {expiresIn:"10h"}

)
}


const job = new CronJob(
	'0 0 12 * * *', // cronTime
	async function () {
        await prisma.token.deleteMany()
		console.log('You will see this message every day');
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles', // timeZone
    
);



export async function verifyToken(token:string){
    // const tokenData = jwt.decode(token);
    // console.log(tokenData);
    
    try{
        const user = await jwt.verify(token,SECRET_KEY);
        if (user) {
         const findToken = await prisma.token.findUnique({
                where:{
                    value:token
                }
            })
            if(!findToken){
                console.log("yee chala");
                
                return {error:"token not exist"}
            }
            return findToken
        }
        
    }catch(err:any){
        if (err.name === 'TokenExpiredError') {
            return { error: 'Token has expired' };
          }
          return { error: 'Invalid token' };
    }
}
