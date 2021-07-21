CREATE DATABASE IF NOT EXISTS `UserAuthentication`;

USE `UserAuthentication`;

ALTER DATABASE `UserAuthentication` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `UserLogin`;

CREATE TABLE IF NOT EXISTS `UserLogin`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(150)  NOT NULL UNIQUE,
  `ValidationKey` varchar(150) NOT NULL ,
  PRIMARY KEY (`Id`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;


USE `UserAuthentication`;
DROP TABLE IF EXISTS `UserApiKeys`;
CREATE TABLE IF NOT EXISTS `UserApiKeys` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `ApiKey` varchar(500) DEFAULT NULL,
  `EncryptionKey` varchar(5000) NOT NULL ,
  `KeyName` varchar(500) NOT NULL DEFAULT ('API KEY - ' + UserId) ,
  `Expires` int NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (UserId) REFERENCES UserLogin(Id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

USE `UserAuthentication`;
DROP TABLE IF EXISTS `TmpState`;
CREATE TABLE IF NOT EXISTS `TmpState` (
  `KeyId` int NOT NULL,
  `System` VARCHAR(500) NOT NULL,
  `State` VARCHAR(500) NOT NULL,
  `Key` VARCHAR(5000) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

USE `UserAuthentication`;
-- TABLE TO CREATE
DROP TABLE IF EXISTS `UserTokens`;
CREATE TABLE IF NOT EXISTS `UserTokens` (
  `Id` int NOT NULL AUTO_INCREMENT ,
  `KeyId` int NOT NULL,
  `System` VARCHAR(30) NOT NULL,
  `Expires` int NULL,
  `AccessTokenObj` text NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

USE `UserAuthentication`;
ALTER TABLE  `UserTokens` ADD UNIQUE KeyToken (`KeyId`,`System`);

USE `UserAuthentication`;
-- CREATE DEFAULT admin USER
INSERT INTO UserLogin (Username,ValidationKey)
VALUES ('admin','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2') -- username: admin, password: root
