import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async() => {
    const user = await currentUser();
    if (!user || !user.id) {
        throw new Error("User not authenticated");
        
    }
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
            include: {
                transactions: true,
            },
            
        });
        if (loggedInUser) {
           return loggedInUser;
            
        }


        // create a new user if not found
        const name = `${user.firstName} ${user.lastName}`.trim();

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: name ,
                email: user.emailAddresses[0]?.emailAddress,
                imageUrl: user.imageUrl,
                transactions:{
                    create: {
                        amount: 2,
                        packageId: "free_user",
                        type: "CREDIT_PURCHASE",
                    },
                }
            },
        });
        return newUser;

        

    } catch (error) {
        console.error("Error checking user:", error);
        throw new Error("User check failed");
        
    }
    
};