-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Machine: 127.0.0.1
-- Genereertijd: 04 jul 2013 om 09:46
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='	' AUTO_INCREMENT=3 ;

--
-- Gegevens worden uitgevoerd voor tabel `comments`
--

INSERT INTO `comments` (`comment_id`, `text`, `createddate`, `modifieddate`, `user_id`) VALUES
(1, 'Proposal is witty but shitty.', '2013-07-04 09:44:37', NULL, 1),
(2, 'Project is cool, only lacks girls.', '2013-07-04 09:44:37', NULL, 1);

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
  `upvotes` int(10) unsigned zerofill DEFAULT '0000000000',
  `downvotes` int(10) unsigned zerofill DEFAULT '0000000000',
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
(1, '{51.053515,3.731266}', 'AC Portus', 0000000000, 0000000000, 1, NULL);

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
-- Tabelstructuur voor tabel `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `upvotes` int(11) DEFAULT '0',
  `downvotes` int(11) DEFAULT '0',
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`),
  KEY `fk_projects_locations1_idx` (`location_id`),
  KEY `fk_projects_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `projects`
--

INSERT INTO `projects` (`project_id`, `name`, `description`, `upvotes`, `downvotes`, `createddate`, `modifieddate`, `location_id`, `user_id`) VALUES
(1, 'AC Portus is going down baby.', 'In the beginning of time, AC Portus was a giant building reknown for it''s telecommunitive potential. That is one of the reasons that Belgacome took over the buidling in 27 AD.', 0, 0, '2013-07-04 09:44:37', '2013-07-04 09:44:59', 1, 1);

--
-- Triggers `projects`
--
DROP TRIGGER IF EXISTS `projInsert`;
DELIMITER //
CREATE TRIGGER `projInsert` BEFORE INSERT ON `projects`
 FOR EACH ROW Set New.createddate = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `projUpdate`;
DELIMITER //
CREATE TRIGGER `projUpdate` BEFORE UPDATE ON `projects`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `projects_has_comments`
--

CREATE TABLE IF NOT EXISTS `projects_has_comments` (
  `project_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`comment_id`),
  KEY `fk_proposal_has_comments_comments1_idx` (`comment_id`),
  KEY `fk_proposal_has_comments_copy1_projects1_idx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `projects_has_comments`
--

INSERT INTO `projects_has_comments` (`project_id`, `comment_id`) VALUES
(1, 2);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `proposals`
--

CREATE TABLE IF NOT EXISTS `proposals` (
  `proposal_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text,
  `proposed` text,
  `createddate` datetime DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `deleteddate` datetime DEFAULT NULL,
  `upvotes` int(10) unsigned zerofill DEFAULT '0000000000',
  `downvotes` int(10) unsigned zerofill DEFAULT '0000000000',
  `user_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`proposal_id`),
  KEY `fk_proposals_users1_idx` (`user_id`),
  KEY `fk_proposals_locations1_idx` (`location_id`),
  KEY `fk_proposals_photos1_idx` (`photo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `proposals`
--

INSERT INTO `proposals` (`proposal_id`, `description`, `proposed`, `createddate`, `modifieddate`, `deleteddate`, `upvotes`, `downvotes`, `user_id`, `location_id`, `photo_id`) VALUES
(1, 'Voorstel beschrijving', 'Een frigo.', '2013-07-04 09:44:37', '2013-07-04 09:45:07', NULL, 0000000000, 0000000000, 1, 1, NULL);

--
-- Triggers `proposals`
--
DROP TRIGGER IF EXISTS `propInsert`;
DELIMITER //
CREATE TRIGGER `propInsert` BEFORE INSERT ON `proposals`
 FOR EACH ROW Set New.createddate = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `propUpdate`;
DELIMITER //
CREATE TRIGGER `propUpdate` BEFORE UPDATE ON `proposals`
 FOR EACH ROW Set New.modifieddate = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `proposals_has_comments`
--

CREATE TABLE IF NOT EXISTS `proposals_has_comments` (
  `proposal_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`proposal_id`,`comment_id`),
  KEY `fk_proposal_has_comments_comments1_idx` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `proposals_has_comments`
--

INSERT INTO `proposals_has_comments` (`proposal_id`, `comment_id`) VALUES
(1, 1);

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
-- Beperkingen voor tabel `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `fk_locations_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_locations_photos1` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_locations1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_projects_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `projects_has_comments`
--
ALTER TABLE `projects_has_comments`
  ADD CONSTRAINT `fk_proposal_has_comments_comments10` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_proposal_has_comments_copy1_projects1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `proposals`
--
ALTER TABLE `proposals`
  ADD CONSTRAINT `fk_proposals_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_proposals_locations1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_proposals_photos1` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `proposals_has_comments`
--
ALTER TABLE `proposals_has_comments`
  ADD CONSTRAINT `fk_proposal_has_comments_proposals1` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`proposal_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_proposal_has_comments_comments1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
