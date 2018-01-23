var inquirer = require("inquirer");
var mysql = require("mysql");

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

var itemName;
var bidAmnt;
var runProg = true;
var connected = false;

var startAuction = function() {
  if (!runProg) {
    console.log("Thanks for bidding! hit ctrl + c to exit");
  } else {
    inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Pick your poison: ",
      choices: [
        new inquirer.Separator(),
        'Post an item.',
        new inquirer.Separator(),
        'Bid on an item.',
        new inquirer.Separator(),
        'Remove an item.',
        new inquirer.Separator(),
        'Exit Program'
      ]
    }
    ])
    .then(function(response) {
      if (response.choice === 'Post an item.') {
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
        
      } else if(response.choice === 'Exit Program') {
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
      console.log(res[i].id + " | " + res[i].item + " | " + res[i].bid);
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
      message: "What would you like to do now?",
      choices: [
        'Back to Main Menu',
        'Exit Program'
      ]
    }
  ])
  .then(function(resp) {
    if (resp.nextAction === 'Back to Main Menu') {
      startAuction();
    } else if(resp.nextAction === 'Exit Program') {
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