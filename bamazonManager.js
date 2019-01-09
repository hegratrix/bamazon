var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table")
var createStream = table.createStream

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazon_db"
})

let config = {
    columnDefault: {width: 50},
    columnCount: 4,
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
        }
    }
}

let stream = createStream(config)

connection.connect(function(err) {
    if (err) throw err
    console.log('Manager View')
    managerOptions()
})

function managerOptions() {
    inquirer.prompt({
        name: "options",
        type: 'list',
        message: "Would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    })
    .then(function(answer){
        switch (answer.options) {
            case 'View Products for Sale':
                productsSale()
                break
            case 'View Low Inventory':
                lowInventory()
                break
            case 'Add to Inventory':
                addInventory()
                break
            case 'Add New Product':
                addProduct()
                break
        }
    })
}

function productsSale() {
    let createTable = new Promise(function (resolve, reject) {
        let query = 'SELECT * FROM products'
        stream.write(["id", "Item", "Price", "Quantity"]),
        resolve(connection.query(query, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                stream.write([res[i].id, res[i].name, '$'+res[i].price, res[i].quantity])
            }
        }))
    })
    createTable.then(function() {
        setTimeout(function() {
            newAction()}, 1000)
    })
}

function lowInventory() {
    let createTable = new Promise(function (resolve, reject) {
        let query = 'SELECT * FROM products WHERE (quantity < 10)'
        console.log('Items with Quantity less than 10:')
        stream.write(["id", "Item", "Price", "Quantity"]),
        resolve(connection.query(query, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                stream.write([res[i].id, res[i].name, '$'+res[i].price, res[i].quantity])
            }
        }))
    })
    createTable.then(function() {
        setTimeout(function() {
            newAction()}, 1000)
    })
}

function addInventory() {
    inquirer.prompt([
        {
            name: "update",
            message: "Please enter item number."
        }
    ]).then(function(answer) {
        let query = `SELECT * FROM products WHERE (id = ${answer.update})`
        connection.query(query, function(err, res) {
            if (res.length === 0) {
                console.log("Invalid item number")
                addInventory()
            } else {
                let id = res[0].id
                stream.write([res[0].id, res[0].name, res[0].price, res[0].quantity])
                console.log('')
                inquirer.prompt([
                    {
                        name: "inventory",
                        message: "Update inventory quantity to:"
                    }
                ]).then(function(answer) {
                    let query = `UPDATE products SET quantity = ${answer.inventory} WHERE (id = ${id})`
                    connection.query(query, function(err, res) {
                        if (err) throw console.error()
                        console.log(`Item #${id} has been updated to a quantity of ${answer.inventory}.`) 
                        newAction()
                    })
                })
            }
        })
    })
}

function addProduct() {
    inquirer.prompt([
        {
            name: "id",
            message: "Please enter item id:"
        },
        {
            name: "name",
            message: "Please enter item name:"
        },
        {
            name: "department",
            message: "Please enter item department:"
        },
        {
            name: "price",
            message: "Please enter item price:"
        },
        {
            name: "quantity",
            message: "Please enter item quantity:"
        }
    ]).then(function(answer) {
        let name = answer.name
        let query = `INSERT INTO products (id, name, department, price, quantity) VALUES ('${answer.id}', '${answer.name}', '${answer.department}', '${answer.price}', '${answer.quantity}')` 
        connection.query(query, function(err, res) {
            if (err) throw console.error()
            console.log(`${answer.name} has been added to your inventory.`)
            newAction()
        })
    })
}

function newAction() {
    console.log('')
    inquirer.prompt({
        name: "option",
        type: 'list',
        message: "Would you like to do something else?",
        choices: [
            "yes",
            "no"
        ]
    })
    .then(function(answer){
        if (answer.option === 'yes') {
            managerOptions()
        } else {
            console.log('Good-Bye')
            process.exit()
        }
    })
}