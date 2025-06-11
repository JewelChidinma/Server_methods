const fs = require("fs")
const path = require("path")

const userDbPath = path.join(__dirname, "db", "users.json")

function authenticate(req, res) {
    return new Promise((resolve, reject) => {
        const body = []

        req.on("data", (chunk) => {
            body.push(chunk)
        })
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log(parsedBody)

            if (!parsedBody) {
                reject("No username or password entered")
            }
        })

    })

}

module.exports = {
    authenticate
}