
import { email } from "better-auth/*";
import { prisma } from "../../lib/prisma";
import { userRole } from "../middleware/middleware";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Md Admin1 Mia",
            email: "shamiul1.dev@gmail.com",
            emailVerified: false,
            role: userRole.ADMIN,
            password: "admin123"
        };

        const user = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if(user){
           throw new Error("User already exists")
        };

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if(signUpAdmin.ok){
            await prisma.user.update({
                where:{
                    email: adminData.email
                },
                data:{
                    emailVerified: true
                }
            })
        }

        console.log(signUpAdmin)

    } catch (error) {
        console.error(error)
    }
}

seedAdmin()