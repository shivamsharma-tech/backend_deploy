import { prisma } from "@/app";

async function CheckToken(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { 
                // email:"Shivamsharma@gmail.com"
                token:token
             }
        });

        console.log(user.token, "*******");

        if (!user) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // If the token is valid, attach the user to the request object
        req.user = user;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default CheckToken;
