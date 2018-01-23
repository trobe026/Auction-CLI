var inquirer = require("inquirer");
var mysql = require("mysql");
var consoleTable = require('console-table');

// When ready to post an item, just run post(item name, item price)
// var post = require("./post.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "server"
});

// these variables are to store user choices throughout inquirer prompts
var itemName;
var bidAmnt;
// this variables store booleans which control which functions run, preventing errors if functions are run twice.
var runProg = true;
var connected = false;

// main app function - recursive
var startAuction = function() {
  if (!runProg) {
    console.log("Thanks for bidding! hit ctrl + c to exit");
  } else {
    inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "\nAuction Main Menu:\n",
      choices: [
        'List all items',
        new inquirer.Separator(),
        'Post an item.',
        new inquirer.Separator(),
        'Bid on an item.',
        new inquirer.Separator(),
        'Remove an item.',
        new inquirer.Separator(),
        'Exit Program\n'
      ]
    }
    ])
    .then(function(response) {
      if (response.choice === 'List all items') {
        listItems();
        doNext();
      }
      else if (response.choice === 'Post an item.') {
        inquirer.prompt([
          {
            type: "input",
            message: "What is the name of your item?",
            name: "item"
          },
          {
            type: "input",
            message: "Enter a starting bid:",
            name: "bid"
          }
        ])
        .then(function(resp) {
          itemName = resp.item;
          bidAmnt = resp.bid;
          // console.log(itemName + bidAmnt);
          addItem();
          doNext();
        });

      } else if (response.choice === 'Bid on an item.') {
        inquirer.prompt([
          {
            type: "input",
            message: "Which item would you like to bid on?",
            name: "item"
          },
          {
            type: "input",
            message: "Enter your bid:",
            name: "bid"
          }
        ])
        .then(function(resp) {
          itemName = resp.item;
          bidAmnt = resp.bid;
          placeBid();
          doNext();
        });

      } else if (response.choice === 'Remove an item.') {
        listItems();
        // listitems();
        inquirer.prompt([
          {
            type: "input",
            message: "Which item would you like to remove?",
            name: "item"
          }
        ])
        .then(function(resp) {
          itemName = resp.item;
          deleteItem();
          doNext();
        });

      } else if (response.choice === 'Exit Program\n') {
        runProg = false;
        startAuction();
      }
    });
  }
};
startAuction();


function listItems() {
  var query = connection.query("SELECT * FROM auctionItems",function(err, res) {
    for (var i = 0; i < res.length; i++) {
      if (i < 1) {
        console.log("\n" + res[i].id + " | " + res[i].item + " | " + res[i].bid);
      } else {
        console.log(res[i].id + " | " + res[i].item + " | " + res[i].bid);
      }
      // consoleTable([
      //   ['','Item Name', 'Current Bid'],
      //   [res[i].id, res[i].item, res[i].bid],
      //   [res[i].id, res[i].item, res[i].bid]
      // ]);
    }
    console.log("\n" + res.length + " items listed.");
    });
}

 function addItem() {
   connectServer();
    var query = connection.query("INSERT INTO auctionItems SET ?",
  {
    item: itemName,
    bid: bidAmnt
  },
  function (err, res) {
    console.log(res.affectedRows + " your item was successfully added!\n");
    listItems();
  });
}

function placeBid() {
  connectServer();
   var query = connection.query("UPDATE auctionItems SET bid = ? WHERE item = ?", [bidAmnt, itemName],
 function (err, res) {
   if (res.affectedRows > 1) {
     console.log(res.affectedRows + " bids placed!\n");
     listItems();
   } else {
     console.log(res.affectedRows + " bid placed!\n");
     listItems();
   }
 });
}

function deleteItem() {
  connectServer();
   var query = connection.query("DELETE FROM auctionItems WHERE item = ?", [itemName],
   function (err, res) {
   if (res.affectedRows > 1) {
     console.log("\ndeleted " + res.affectedRows + " items!");
     listItems();
   } else {
     console.log("\ndeleted " + res.affectedRows + " item!");
     listItems();
   }
 });
}

function doNext() {
  inquirer.prompt([
    {
      type: "list",
      name: "nextAction",
      message: "\n\nWhat would you like to do now?\n",
      choices: [
        'Back to Main Menu',
        'Exit Program'
      ]
    }
  ])
  .then(function(resp) {
    if (resp.nextAction === 'Back to Main Menu') {
      startAuction();
    } else if (resp.nextAction === 'Exit Program') {
      runProg = false;
      startAuction();
    }
  });
}

function connectServer() {
  if (connected = false) {
    connection.connect(function(err) {
      if (err) throw err;
      console.log("\nconnected as id: " + connection.threadId);
      connected = true;
    })
  }
}
