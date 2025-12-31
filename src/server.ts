import { prisma } from "../lib/prisma"
import app from "./app";
const port = process.env.PORT || 5000

async function main() {
    try {
        await prisma.$connect();
        console.log("Connect to the database");

        app.listen(port, () => {
            console.log(`Server is Running on https://localhost:${port}`)
        })
    } catch (error) {
        console.error("An Error ", error)
        await prisma.$disconnect()
        process.exit(1)
    }
}


main()
