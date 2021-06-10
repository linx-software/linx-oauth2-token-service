CREATE DATABASE IF NOT EXISTS `linx_integration_db`;

USE `linx_integration_db`;
DROP TABLE IF EXISTS `connections`;
CREATE TABLE IF NOT EXISTS `connections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(150) DEFAULT NULL,
  `platform_name` varchar(150) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `token_str` varchar(5000) DEFAULT NULL,
  `token_typ` varchar(1000) DEFAULT NULL,
  `access_token_str` varchar(5000) DEFAULT NULL,
  `refresh_token_str` varchar(5000) DEFAULT NULL,
  `connected_entity` varchar(1000) DEFAULT NULL,
  `expiry_datetime` DATETIME DEFAULT NULL,
  `expiry_timestamp` int DEFAULT 0,
  `last_updated_datetime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

INSERT INTO connections (`platform_name`) values ('microsoft');
INSERT INTO connections (`platform_name`) values ('google');
INSERT INTO connections (`platform_name`) values ('salesforce');
INSERT INTO connections (`platform_name`) values ('github');
INSERT INTO connections (`platform_name`) values ('xero');