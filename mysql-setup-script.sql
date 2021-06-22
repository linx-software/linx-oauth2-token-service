CREATE DATABASE IF NOT EXISTS `linx_integration_db`;

USE `linx_integration_db`;
DROP TABLE IF EXISTS `connections`;
CREATE TABLE IF NOT EXISTS `connections` (
  `user_id` varchar(250) NOT NULL DEFAULT 'admin',
  `system` varchar(150) DEFAULT NULL,
  `system_name` varchar(150) NOT NULL ,
  `state` varchar(20) DEFAULT NULL,
  `token_str` varchar(5000) DEFAULT NULL,
  `token_typ` varchar(1000) DEFAULT NULL,
  `access_token_str` varchar(5000) DEFAULT NULL,
  `refresh_token_str` varchar(5000) DEFAULT NULL,
  `connected_entity` varchar(1000) DEFAULT NULL,
  `expiry_datetime` DATETIME DEFAULT NULL,
  `expiry_timestamp` int DEFAULT 0,
  `last_updated_datetime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`user_id`,`system_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO connections (`system_name`) values ('microsoft'), ('google'), ('salesforce'), ('github'), ('xero'), ('facebook')




-- USER LOGIN
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE IF NOT EXISTS `user_login` (
  `username` varchar(500) NOT NULL AUTO_INCREMENT,
  `password` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;