var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table")
var createStream = table.createStream
let customerOrder = []

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err
    console.log('Welcome to my Bamazon Retreat Store!')
    console.log('Here are the items we have to offer to make your life more relaxing and rejuvenating:')
    storeTable()
})

function storeTable() {
    let config = {
            columnDefault: {width: 50},
            columnCount: 3,
            columns: {
                0: {
                    width: 5,
                    alignment: 'center'
                },
                1: {
                    width: 40
                },
                2: {
                    width: 15
                }
        }
    }
    let createTable = new Promise(function (resolve, reject) {

        let stream = createStream(config)
        let query = 'SELECT * FROM products'
        stream.write(["id", "Item", "Price"])
        resolve(connection.query(query, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                stream.write([res[i].id, res[i].name, '$'+res[i].price])
            }
        }))
        
    })
    createTable.then(function() {
        setTimeout(function() {
            askToShop()}, 1000)
    })
}

function askToShop() {
    console.log('')
    inquirer.prompt({
        name: "shop",
        type: 'list',
        message: "Would you like to place an order?",
        choices: [
            "yes",
            "no"
        ]
    })
    .then(function(answer){
        if (answer.shop === "no") {
            console.log('Thanks for visiting my store')
            process.exit()
        } else (
            placeOrder()
        )
    })
}

function placeOrder() {
    inquirer.prompt([
        {
            name: "item",
            message: "Please enter item number."
        }
    ]).then(function(answer) {
        let query = "SELECT * FROM products WHERE id = " + answer.item
        connection.query(query, function(err, res) {
            if (res.length === 0) {
                console.log("Invalid item number")
                placeOrder()
            } else {
                inquirer.prompt([
                    {
                        name: "quantity",
                        message: "How many would you like?"
                    }
                ]).then(function(answer) {
                    if (answer.quantity > res[0].quantity) {
                        console.log(`Please choose a different quantity.  We have ${res[0].quantity} in stock.`)
                        placeOrder()
                    } else {
                        customerOrder.push({
                            id: res[0].id,
                            name: res[0].name,
                            price: res[0].price,
                            quantity: answer.quantity
                        })
                        let updated = res[0].quantity - answer.quantity
                        updateQuantity(updated, res[0].id)
                    }
                })
            }
        })
    })
}

function updateQuantity(updated, id) {
    let query = `UPDATE products SET quantity = ${updated} WHERE (id = ${id})`
    connection.query(query, function(err, res) {
        if (err) throw console.error()
        inquirer.prompt([
            {
                name: "add",
                type: "list",
                message: "Would you like to order another item?",
                choices: [
                    "yes",
                    "no"
                ]
            }
        ]).then(function(answer) {
            if (answer.add === 'yes') {
                placeOrder()
            } else {
                giveReceipt()
            }
        })
    })
}

function giveReceipt() {
    console.log('Thanks for you order!  Here is your receipt.')
    let config = {
            columnDefault: {width: 50},
            columnCount: 5,
            columns: {
                0: {
                    width: 5,
                    alignment: 'center'
                },
                1: {
                    width: 35
                },
                2: {
                    width: 15
                },
                3: {
                    width: 15
                },
                4: {
                    width: 15
                }
        }
    }
    let stream = createStream(config)
    stream.write(["id", "Item", "Quantity", "Price", "Total"])
        let grandTotal = 0
    for (let i=0; i < customerOrder.length; i++) {
        let total = parseFloat(customerOrder[i].quantity*customerOrder[i].price).toFixed(2)
        grandTotal += parseFloat(total)
        stream.write([customerOrder[i].id, customerOrder[i].name, customerOrder[i].quantity, '$'+customerOrder[i].price, '$'+total])
    }
    stream.write(["", "", "", "", '$'+grandTotal])
    process.exit()
}