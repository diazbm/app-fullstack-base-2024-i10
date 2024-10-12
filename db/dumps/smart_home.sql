-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 26, 2019 at 02:50 PM
-- Server version: 5.7.26-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.4

CREATE DATABASE IF NOT EXISTS smart_home;

USE smart_home;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_home`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Devices`
--

CREATE TABLE `Devices` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(128) NOT NULL,
  `state` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `room_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Devices`
--

INSERT INTO `Devices` (`id`, `name`, `description`, `state`, `type`, `room_id`) VALUES
(1, 'Lampara 1', 'Luz living', 1, 0, 1),
(2, 'Lampara 2', 'Luz cocina', 0, 0, 2),
(3, 'Velador', 'Velador living', 1, 0, 1),
(4, 'Persiana 1', 'Persiana living', 1, 1, 1),
(5, 'Persiana 2', 'Persiana de la cocina', 1, 1, 2),
(6, 'Persiana 3', 'Persiana balcon', 0, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Rooms`
--

CREATE TABLE `Rooms` (
  `id` int(11) NOT NULL,
  `Name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Rooms`
--

INSERT INTO `Rooms` (`id`, `Name`) VALUES
(1, 'Living'),
(2, 'Cocina'),
(3, 'Balcón');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Devices`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Devices_Rooms` (`room_id`);

--
-- Indices de la tabla `Rooms`
--
ALTER TABLE `Rooms`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Devices`
--
ALTER TABLE `Devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `Rooms`
--
ALTER TABLE `Rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Devices`
--
ALTER TABLE `Devices`
  ADD CONSTRAINT `FK_Devices_Rooms` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
