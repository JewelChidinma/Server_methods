const http = require("http");
const fs = require("fs");
const path = require("path");

const booksDbPath = path.join(__dirname, "db", "books.json");
let booksDb = [];

const PORT = 4000
const HOST_NAME = "localhost";

function requestHandler(req, res) {

    if (req.url === "/books" && req.method === "GET") {
        getAllBooks(req, res)

    } else if (req.url === "/books" && req.method === "POST") {
        addBook(req, res)

    } else if (req.url === "/books" && req.method === "PUT") {
        updateBook(req, res)

    } else if (req.url === "/books" && req.method === "DELETE") {
        deleteBook(req, res)
    }
}


function getAllBooks(req, res) {
    fs.readFile(booksDbPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(404)
            res.end("An Error Occured")
        }

        res.end(data)
    })
}


function addBook(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const newBook = JSON.parse(parsedBook)
        console.log(newBook)

        fs.readFile(booksDbPath, "utf8", (err, data) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An Error Occured")
                return;
            }

            const oldBooks = JSON.parse(data)

            let maxId = 0;
            oldBooks.forEach(book => {
                if (book.id && book.id > maxId) {
                    maxId = book.id;
                }
            });

            newBook.id = maxId + 1;
            const allBooks = [...oldBooks, newBook]


            fs.writeFile(booksDbPath, JSON.stringify(allBooks), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: "Internal Server Error. Could not save book to database."
                    }));
                }


                res.end(JSON.stringify(newBook));

            })
        })

    })
}


function updateBook(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBook)
        const bookId = detailsToUpdate.id

        fs.readFile(booksDbPath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An Error Occured")
                return;
            }

            const booksObj = JSON.parse(books)

            const bookIndex = booksObj.findIndex(book => book.id === bookId)
            console.log(bookIndex)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found")
                return
            }

            const updatedBook = { ...booksObj[bookIndex], ...detailsToUpdate }
            booksObj[bookIndex] = updatedBook


            fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: "Internal Server Error. Could not save book to database."
                    }));
                }

                res.writeHead(200)
                res.end("Update Successful!");

            })

        })

    })
}


function deleteBook(req, res) {

    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBook)
        const bookId = detailsToUpdate.id

        fs.readFile(booksDbPath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An Error Occured")
                return;
            }

            const booksObj = JSON.parse(books)

            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found")
                return
            }
            booksObj.splice(bookIndex, 1)


            fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: "Internal Server Error. Could not save book to database."
                    }));
                }

                res.writeHead(200)
                res.end("Deletion Successful!");

            })

        })

    })
}


const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
    booksDB = JSON.parse(fs.readFileSync(booksDbPath, "utf8"));
    console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})
