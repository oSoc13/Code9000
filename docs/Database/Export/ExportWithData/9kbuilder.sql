-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Machine: 127.0.0.1
-- Genereertijd: 17 jul 2013 om 11:13
-- Serverversie: 5.5.27
-- PHP-versie: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `9kbuilder`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cityprojects`
--

CREATE TABLE IF NOT EXISTS `cityprojects` (
  `cityproject_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `deleteddate` datetime DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `upvotes` int(11) DEFAULT NULL,
  `downvotes` int(11) DEFAULT NULL,
  `data` longtext,
  `parent_cityproject` int(11) DEFAULT NULL,
  PRIMARY KEY (`cityproject_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Table for playgrounds of proposals. By city, props by civili' AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `cityprojects`
--

INSERT INTO `cityprojects` (`cityproject_id`, `name`, `description`, `createddate`, `modifieddate`, `deleteddate`, `user_id`, `location_id`, `upvotes`, `downvotes`, `data`, `parent_cityproject`) VALUES
(1, 'AC Portus playground', 'AC portus needs a garden, so this is my best shot!', '2013-07-05 08:06:28', '2013-07-05 08:07:00', NULL, 1, 1, 0, 0, NULL, NULL);

--
-- Triggers `cityprojects`
--
DROP TRIGGER IF EXISTS `cityprojInsert`;
DELIMITER //
CREATE TRIGGER `cityprojInsert` BEFORE INSERT ON `cityprojects`
 FOR EACH ROW Set New .createddate = NOW(), New.upvotes = 0, New.downvotes = 0
//
DELIMITER ;
DROP TRIGGER IF EXISTS `cityprojUpdate`;
DELIMITER //
CREATE TRIGGER `cityprojUpdate` BEFORE UPDATE ON `cityprojects`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cityprojects_has_comments`
--

CREATE TABLE IF NOT EXISTS `cityprojects_has_comments` (
  `cityproject_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`cityproject_id`,`comment_id`),
  KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cityproposals`
--

CREATE TABLE IF NOT EXISTS `cityproposals` (
  `cityproposal_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `upvotes` int(11) DEFAULT '0',
  `downvotes` int(11) DEFAULT '0',
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `deleteddate` datetime DEFAULT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`cityproposal_id`),
  KEY `fk_projects_locations1_idx` (`location_id`),
  KEY `fk_projects_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Projects by city, can comment and vote. No more.' AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `cityproposals`
--

INSERT INTO `cityproposals` (`cityproposal_id`, `name`, `description`, `upvotes`, `downvotes`, `createddate`, `modifieddate`, `deleteddate`, `location_id`, `user_id`) VALUES
(1, 'AC Portus is going down baby.', 'In the beginning of time, AC Portus was a giant building reknown for it''s telecommunitive potential. That is one of the reasons that Belgacome took over the buidling in 27 AD.', 1, 1, '2013-07-04 09:44:37', '2013-07-15 16:05:26', NULL, 1, 1);

--
-- Triggers `cityproposals`
--
DROP TRIGGER IF EXISTS `projInsert`;
DELIMITER //
CREATE TRIGGER `projInsert` BEFORE INSERT ON `cityproposals`
 FOR EACH ROW Set New.createddate = NOW(), New.upvotes=0, New.downvotes =0
//
DELIMITER ;
DROP TRIGGER IF EXISTS `projUpdate`;
DELIMITER //
CREATE TRIGGER `projUpdate` BEFORE UPDATE ON `cityproposals`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cityproposals_has_comments`
--

CREATE TABLE IF NOT EXISTS `cityproposals_has_comments` (
  `cityproposal_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`cityproposal_id`,`comment_id`),
  KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `cityproposals_has_comments`
--

INSERT INTO `cityproposals_has_comments` (`cityproposal_id`, `comment_id`) VALUES
(1, 4),
(1, 5),
(1, 6),
(1, 7);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text,
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `fk_comments_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='	' AUTO_INCREMENT=8 ;

--
-- Gegevens worden uitgevoerd voor tabel `comments`
--

INSERT INTO `comments` (`comment_id`, `text`, `createddate`, `modifieddate`, `user_id`) VALUES
(1, 'Proposal is witty but shitty.', '2013-07-04 09:44:37', '2013-07-11 14:23:23', 6),
(2, 'Project is cool, only lacks girls.', '2013-07-04 09:44:37', NULL, 1),
(3, 'spot is awesome', '2013-07-05 08:07:37', '2013-07-11 14:23:23', 6),
(4, 'test lol', '2013-07-15 15:19:31', '2013-07-15 15:20:27', 6),
(5, 'zeteg', '2013-07-15 15:20:35', NULL, 6),
(6, 'test', '2013-07-15 15:59:49', NULL, 7),
(7, 'mamam- mia 2', '2013-07-15 16:05:15', '2013-07-15 16:05:20', 7);

--
-- Triggers `comments`
--
DROP TRIGGER IF EXISTS `commInsert`;
DELIMITER //
CREATE TRIGGER `commInsert` BEFORE INSERT ON `comments`
 FOR EACH ROW Set New.createddate = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `commUpdate`;
DELIMITER //
CREATE TRIGGER `commUpdate` BEFORE UPDATE ON `comments`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `locations`
--

CREATE TABLE IF NOT EXISTS `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `coords` text,
  `description` text,
  `upvotes` int(10) unsigned DEFAULT NULL,
  `downvotes` int(10) unsigned DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  KEY `fk_locations_users_idx` (`user_id`),
  KEY `fk_locations_photos1_idx` (`photo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='			' AUTO_INCREMENT=8 ;

--
-- Gegevens worden uitgevoerd voor tabel `locations`
--

INSERT INTO `locations` (`location_id`, `coords`, `description`, `upvotes`, `downvotes`, `user_id`, `photo_id`) VALUES
(1, '[51.053515 3.731266]', 'AC Portus', 0, 0, 1, NULL),
(2, '[51.0536473 3.7317304]', NULL, 0, 0, 1, 2),
(3, '[51.0368334 3.732133]', NULL, 0, 0, 1, NULL),
(4, '[51.0536346 3.7316986]', NULL, 0, 0, 1, NULL),
(5, '[51.0536346 3.7316986]', NULL, 0, 0, 1, NULL),
(6, '[51.037411 3.735429]', NULL, 0, 0, 6, NULL),
(7, '[51.0348452 3.7357807999999]', NULL, 0, 0, 6, NULL);

--
-- Triggers `locations`
--
DROP TRIGGER IF EXISTS `locInsert`;
DELIMITER //
CREATE TRIGGER `locInsert` BEFORE INSERT ON `locations`
 FOR EACH ROW Set New.upvotes=0,New.downvotes=0
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `photos`
--

CREATE TABLE IF NOT EXISTS `photos` (
  `photo_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text,
  `url` varchar(255) DEFAULT NULL,
  `createddate` datetime DEFAULT NULL,
  PRIMARY KEY (`photo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `photos`
--

INSERT INTO `photos` (`photo_id`, `description`, `url`, `createddate`) VALUES
(1, NULL, 'MDcuanBnMTM3MzQ2MjMzNTI0Mw==.jpg', '2013-07-10 15:19:01'),
(2, NULL, 'MDQuanBnMTM3MzQ2MjMzOTA2Mw==.jpg', '2013-07-10 15:19:01'),
(3, NULL, 'MDQuanBnMTM3MzU0NjkxNjU0MA==.jpg', '2013-07-11 14:48:38');

--
-- Triggers `photos`
--
DROP TRIGGER IF EXISTS `photoInsert`;
DELIMITER //
CREATE TRIGGER `photoInsert` BEFORE INSERT ON `photos`
 FOR EACH ROW SET New.createddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `spots`
--

CREATE TABLE IF NOT EXISTS `spots` (
  `spot_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text,
  `proposed` text,
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `deleteddate` datetime DEFAULT NULL,
  `upvotes` int(10) DEFAULT NULL,
  `downvotes` int(10) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`spot_id`),
  KEY `fk_proposals_users1_idx` (`user_id`),
  KEY `fk_proposals_locations1_idx` (`location_id`),
  KEY `fk_proposals_photos1_idx` (`photo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Gegevens worden uitgevoerd voor tabel `spots`
--

INSERT INTO `spots` (`spot_id`, `description`, `proposed`, `createddate`, `modifieddate`, `deleteddate`, `upvotes`, `downvotes`, `user_id`, `location_id`, `photo_id`) VALUES
(1, 'Voorstel beschrijving', 'Een frigo.', '2013-07-04 09:44:37', '2013-07-11 17:12:58', NULL, 1, 0, 1, 1, NULL),
(2, 'Bears in my ass', 'Tom', '2013-07-10 15:19:01', '2013-07-11 17:05:04', NULL, 1, 0, 1, 2, 1),
(3, 'your mother', 'no eyes', '2013-07-10 15:20:07', NULL, NULL, 0, 0, 1, 3, NULL),
(4, 'test;Delete from users', 'lol', '2013-07-10 15:20:54', '2013-07-11 17:04:57', NULL, 0, 1, 1, 4, NULL),
(5, 'test;Delete%20from%20users', 'lol', '2013-07-10 15:21:48', NULL, NULL, 0, 0, 1, 5, NULL),
(6, 'fsdfsdfsdf', 'dfsd', '2013-07-11 11:16:55', '2013-07-11 16:33:30', NULL, 7, 4, 6, 7, NULL),
(7, 'sdfsdf', 'qsdfqsdfqsdf', '2013-07-11 11:49:11', '2013-07-11 14:44:36', NULL, 16, 0, 6, 7, NULL),
(8, 'Robbe', 'Computer', '2013-07-11 14:48:38', '2013-07-11 17:04:49', NULL, 360, 379, 6, 6, 3);

--
-- Triggers `spots`
--
DROP TRIGGER IF EXISTS `propInsert`;
DELIMITER //
CREATE TRIGGER `propInsert` BEFORE INSERT ON `spots`
 FOR EACH ROW Set New.createddate = NOW(), New.upvotes=0, New.downvotes=0
//
DELIMITER ;
DROP TRIGGER IF EXISTS `propUpdate`;
DELIMITER //
CREATE TRIGGER `propUpdate` BEFORE UPDATE ON `spots`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `spots_has_comments`
--

CREATE TABLE IF NOT EXISTS `spots_has_comments` (
  `spot_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`spot_id`,`comment_id`),
  KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `spots_has_comments`
--

INSERT INTO `spots_has_comments` (`spot_id`, `comment_id`) VALUES
(7, 1),
(1, 3),
(7, 3);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` char(64) NOT NULL,
  `passwordsalt` varchar(255) NOT NULL,
  `role` varchar(128) DEFAULT NULL,
  `dateofbirth` datetime DEFAULT NULL,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `activationcode` char(64) DEFAULT NULL,
  `activationdate` datetime DEFAULT NULL,
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `deleteddate` datetime DEFAULT NULL,
  `lastloggedindate` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Gegevens worden uitgevoerd voor tabel `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `passwordsalt`, `role`, `dateofbirth`, `firstname`, `surname`, `avatar`, `activationcode`, `activationdate`, `createddate`, `modifieddate`, `deleteddate`, `lastloggedindate`) VALUES
(1, 'test', 'admin', '9kbuildersalt', 'admin', '2013-07-04 00:00:00', 'Stefaan', 'Christiaens', NULL, '12345678910', '2013-07-04 00:00:00', '2013-07-04 09:44:37', '2013-07-08 12:02:12', NULL, NULL),
(5, 'tobmav@gmail.com', 'af2db466b684d1b57be7023bace33ae4af4b769a29b0199c04ad9972abe0956a', 'VnFFQjI0dVlDajBGVVk4Z0NwbFNZc0Q0R3RyWVhoS2F4ZjFKRGJlZ1h0UlNKVlE5RlVGYjBnanlyamVuZFZvZQ==', 'admin', '1991-01-10 00:00:00', 'Tom', 'Van humbeek', 'MDUuanBnMTM3MzM2NzMyMTM5OQ==.jpg', '1qhe6GRW90Atpgq', NULL, '2013-07-09 12:55:24', NULL, NULL, NULL),
(6, 'stefaan.ch@gmail.com', 'bb101c7fd3da9e88f17fce8d1d4c4e180354e039ea3decbc3beea6098c2e0fe2', 'akxsSXY4NkR4NjNsdlU0TjFmdXNhbDhqeFduT2VlMldQV3Rhcmh3ckRaeGZ4aGx6SlFpUWlXZjNQZ3hGcjJaRQ==', 'admin', '1991-01-10 00:00:00', 'Stef', 'chri', 'MDYuanBnMTM3MzQ1NTM1MTk5MQ==.jpg', '33FSmlUBfZ6QPd6', '2013-07-09 13:00:56', '2013-07-09 13:00:31', '2013-07-15 15:36:04', NULL, '2013-07-15 15:36:04'),
(7, 'stef_christiaens@hotmail.com', '70d687a799c6a78bb90187ad95e50af4ed0f289fccd77b2809e24a32e93ba005', 'bkVXcHdMNmNqdmpBc2M0R2JIajNjbHdOSVpGeHRYZWtINjlONExVMFFOdXpJeWx6VlFzQ2IyaE5HWU1IYlpzcQ==', 'user', '1991-01-10 00:00:00', 'Stefaan', 'Christiaens', 'Slim->run()\r\n#11 {main}</pre></body></html>', 'SVeyu9CbftyVRgw', '2013-07-15 15:40:32', '2013-07-15 15:39:04', '2013-07-17 11:10:39', NULL, '2013-07-17 11:10:39');

--
-- Triggers `users`
--
DROP TRIGGER IF EXISTS `userInsert`;
DELIMITER //
CREATE TRIGGER `userInsert` BEFORE INSERT ON `users`
 FOR EACH ROW Set New.createddate = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `userUpdate`;
DELIMITER //
CREATE TRIGGER `userUpdate` BEFORE UPDATE ON `users`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users_dislike_cityprojects`
--

CREATE TABLE IF NOT EXISTS `users_dislike_cityprojects` (
  `user_id` int(11) NOT NULL,
  `cityproject_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`cityproject_id`),
  KEY `cityproject_id` (`cityproject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users_dislike_cityproposals`
--

CREATE TABLE IF NOT EXISTS `users_dislike_cityproposals` (
  `user_id` int(11) NOT NULL,
  `cityproposal_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`cityproposal_id`),
  KEY `cityproposal_id` (`cityproposal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `users_dislike_cityproposals`
--

INSERT INTO `users_dislike_cityproposals` (`user_id`, `cityproposal_id`) VALUES
(7, 1);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users_dislike_spots`
--

CREATE TABLE IF NOT EXISTS `users_dislike_spots` (
  `user_id` int(11) NOT NULL,
  `spot_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`spot_id`),
  KEY `spot_id` (`spot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `users_dislike_spots`
--

INSERT INTO `users_dislike_spots` (`user_id`, `spot_id`) VALUES
(6, 4),
(6, 8);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users_like_cityprojects`
--

CREATE TABLE IF NOT EXISTS `users_like_cityprojects` (
  `user_id` int(11) NOT NULL,
  `cityproject_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`cityproject_id`),
  KEY `cityproject_id` (`cityproject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users_like_cityproposals`
--

CREATE TABLE IF NOT EXISTS `users_like_cityproposals` (
  `user_id` int(11) NOT NULL,
  `cityproposal_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`cityproposal_id`),
  KEY `cityproposal_id` (`cityproposal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `users_like_cityproposals`
--

INSERT INTO `users_like_cityproposals` (`user_id`, `cityproposal_id`) VALUES
(6, 1);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users_like_spots`
--

CREATE TABLE IF NOT EXISTS `users_like_spots` (
  `user_id` int(11) NOT NULL,
  `spot_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`spot_id`),
  KEY `spot_id` (`spot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `users_like_spots`
--

INSERT INTO `users_like_spots` (`user_id`, `spot_id`) VALUES
(6, 1),
(6, 2),
(6, 6);

--
-- Beperkingen voor gedumpte tabellen
--

--
-- Beperkingen voor tabel `cityprojects_has_comments`
--
ALTER TABLE `cityprojects_has_comments`
  ADD CONSTRAINT `cityprojects_has_comments_ibfk_1` FOREIGN KEY (`cityproject_id`) REFERENCES `cityprojects` (`cityproject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `cityprojects_has_comments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `cityproposals`
--
ALTER TABLE `cityproposals`
  ADD CONSTRAINT `fk_projects_locations1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_projects_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `cityproposals_has_comments`
--
ALTER TABLE `cityproposals_has_comments`
  ADD CONSTRAINT `cityproposals_has_comments_ibfk_1` FOREIGN KEY (`cityproposal_id`) REFERENCES `cityprojects` (`cityproject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `cityproposals_has_comments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `fk_locations_photos1` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_locations_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `spots`
--
ALTER TABLE `spots`
  ADD CONSTRAINT `fk_proposals_locations1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_proposals_photos1` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_proposals_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `spots_has_comments`
--
ALTER TABLE `spots_has_comments`
  ADD CONSTRAINT `spots_has_comments_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `spots` (`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `spots_has_comments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `users_dislike_cityprojects`
--
ALTER TABLE `users_dislike_cityprojects`
  ADD CONSTRAINT `users_dislike_cityprojects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_dislike_cityprojects_ibfk_2` FOREIGN KEY (`cityproject_id`) REFERENCES `cityprojects` (`cityproject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `users_dislike_cityproposals`
--
ALTER TABLE `users_dislike_cityproposals`
  ADD CONSTRAINT `users_dislike_cityproposals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_dislike_cityproposals_ibfk_2` FOREIGN KEY (`cityproposal_id`) REFERENCES `cityproposals` (`cityproposal_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `users_dislike_spots`
--
ALTER TABLE `users_dislike_spots`
  ADD CONSTRAINT `users_dislike_spots_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_dislike_spots_ibfk_2` FOREIGN KEY (`spot_id`) REFERENCES `spots` (`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `users_like_cityprojects`
--
ALTER TABLE `users_like_cityprojects`
  ADD CONSTRAINT `users_like_cityprojects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_like_cityprojects_ibfk_2` FOREIGN KEY (`cityproject_id`) REFERENCES `cityprojects` (`cityproject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `users_like_cityproposals`
--
ALTER TABLE `users_like_cityproposals`
  ADD CONSTRAINT `users_like_cityproposals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_like_cityproposals_ibfk_2` FOREIGN KEY (`cityproposal_id`) REFERENCES `cityproposals` (`cityproposal_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `users_like_spots`
--
ALTER TABLE `users_like_spots`
  ADD CONSTRAINT `users_like_spots_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_like_spots_ibfk_2` FOREIGN KEY (`spot_id`) REFERENCES `spots` (`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
