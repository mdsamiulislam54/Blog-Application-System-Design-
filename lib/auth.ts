import { betterAuth } from "better-auth";
import nodemailer from "nodemailer";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma"; console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "samiulm5332@gmail.com",
        pass: "fpvd fdhr yhtc iebt"
    },
});
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    // trustedOrigins:[process.env.BETTER_AUTH_URL as string],


    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER"
            },

            phone: {
                type: "string",
                required: false

            },

            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${process.env.APP_URL}/email-verify?token=${token}`
            try {
                const info = await transporter.sendMail({
                    from: 'Prisma blogs " <maddison53@ethereal.email>',
                    to: user.email,
                    subject: "Verify your email address",

                    text: `Hello ${user.name}`,
                    html: `
                    <p>Hello ${user.name || "there"},</p>
                    <p>Please verify your email address by clicking the link below:</p>
                    <p><a href="${verificationUrl}">Verify Email</a></p>
                    <p>If you didn’t create this account, you can ignore this email.</p>
                    <p>— Prisma Blogs Team</p>
                `,
                });
            } catch (error) {
                console.error(error)

            }


        },
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },


});