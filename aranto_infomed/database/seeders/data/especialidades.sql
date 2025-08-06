-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 06, 2025 at 04:00 PM
-- Server version: 5.5.54
-- PHP Version: 5.3.10-1ubuntu3.26

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dbventasweb`
--

-- --------------------------------------------------------

--
-- Table structure for table `especialidades`
--

CREATE TABLE IF NOT EXISTS `especialidades` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(200) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=36 ;

--
-- Dumping data for table `especialidades`
--

INSERT INTO `especialidades` (`Id`, `Nombre`) VALUES
(1, 'Oftalmologia'),
(2, 'Cardiólogo'),
(3, 'Anestesista'),
(4, 'Cirujano'),
(5, 'Cirujano Plástico'),
(6, 'Medicina Estética'),
(7, 'Bioquimico'),
(8, 'Otorrinonaringolo'),
(9, 'Pediatra'),
(10, 'Dermatologo/a'),
(11, 'Traumatologia'),
(12, 'Urologo'),
(13, 'Nutricionista'),
(14, 'Cirujano Plástico '),
(15, 'Cirugia General'),
(16, 'Clínico General'),
(17, 'Ginecología y Obstetricia'),
(18, 'Ecografista'),
(19, 'Odontologia'),
(20, 'Gastroenterologo'),
(21, 'Neurologo'),
(22, 'Neumologia'),
(23, 'Psicologo'),
(24, 'Medicina Familiar'),
(25, 'Puericultura y Crianza'),
(26, 'Fonoaudiologia'),
(27, 'Psicomotricista'),
(28, 'Fisioterapia'),
(29, 'Psiquiatria'),
(30, 'Radiografia'),
(31, 'Reumatologia'),
(32, 'Mastologia'),
(33, 'Obstetricia'),
(34, 'Cirujano Maxilofacial'),
(35, 'Endocrinologa Infantil');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
