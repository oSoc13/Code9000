-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Machine: 127.0.0.1
-- Genereertijd: 05 jul 2013 om 08:10
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
(1, 'AC Portus is going down baby.', 'In the beginning of time, AC Portus was a giant building reknown for it''s telecommunitive potential. That is one of the reasons that Belgacome took over the buidling in 27 AD.', 0, 0, '2013-07-04 09:44:37', '2013-07-04 21:34:07', NULL, 1, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='	' AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `comments`
--

INSERT INTO `comments` (`comment_id`, `text`, `createddate`, `modifieddate`, `user_id`) VALUES
(1, 'Proposal is witty but shitty.', '2013-07-04 09:44:37', NULL, 1),
(2, 'Project is cool, only lacks girls.', '2013-07-04 09:44:37', NULL, 1),
(3, 'spot is awesome', '2013-07-05 08:07:37', NULL, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='			' AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `locations`
--

INSERT INTO `locations` (`location_id`, `coords`, `description`, `upvotes`, `downvotes`, `user_id`, `photo_id`) VALUES
(1, '{51.053515,3.731266}', 'AC Portus', 0, 0, 1, NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
  `upvotes` int(10) unsigned DEFAULT NULL,
  `downvotes` int(10) unsigned DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`spot_id`),
  KEY `fk_proposals_users1_idx` (`user_id`),
  KEY `fk_proposals_locations1_idx` (`location_id`),
  KEY `fk_proposals_photos1_idx` (`photo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `spots`
--

INSERT INTO `spots` (`spot_id`, `description`, `proposed`, `createddate`, `modifieddate`, `deleteddate`, `upvotes`, `downvotes`, `user_id`, `location_id`, `photo_id`) VALUES
(1, 'Voorstel beschrijving', 'Een frigo.', '2013-07-04 09:44:37', '2013-07-04 20:51:45', NULL, 0, 0, 1, 1, NULL);

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
(1, 3);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `passwordsalt`, `role`, `dateofbirth`, `firstname`, `surname`, `avatar`, `activationcode`, `activationdate`, `createddate`, `modifieddate`, `deleteddate`, `lastloggedindate`) VALUES
(1, 'stefaan.ch@gmail.com', 'admin', '9kbuildersalt', 'admin', '2013-07-04 00:00:00', 'Stefaan', 'Christiaens', NULL, '12345678910', '2013-07-04 00:00:00', '2013-07-04 09:44:37', '2013-07-04 09:46:08', NULL, NULL);

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
