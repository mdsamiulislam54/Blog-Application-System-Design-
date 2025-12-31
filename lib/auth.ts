import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
 console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL)
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    // trustedOrigins:[process.env.BETTER_AUTH_URL as string],
   

    user:{
        additionalFields:{
            role:{
                type: "string",
                required: false,
                defaultValue: "USER"
            },

            phone : {
                type:"string",
                required: false

            },

            status : {
                type: "string",
                defaultValue:"ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    }
});