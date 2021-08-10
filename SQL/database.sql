CREATE DATABASE IF NOT EXISTS `security`;
USE `security`;

CREATE TABLE IF NOT EXISTS `tokens` (
  `ip` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `token` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `resource` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `customer` varchar(50) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;