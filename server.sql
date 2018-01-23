DROP DATABASE IF EXISTS server;

CREATE DATABASE server;

USE server;

CREATE TABLE auctionItems (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(45) NULL,
  bid DECIMAL(10,2) NULL,
  PRIMARY KEY (id)
);

INSERT INTO auctionItems (item, bid)
VALUES ("fender squire guitar", 5);

INSERT INTO auctionItems (item, bid)
VALUES ("A Pencil", 1000);

INSERT INTO auctionItems (item, bid)
VALUES ("Car", 27000);
