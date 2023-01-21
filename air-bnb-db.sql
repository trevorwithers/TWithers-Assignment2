-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema comp206_airbnb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `comp206_airbnb` ;

-- -----------------------------------------------------
-- Schema comp206_airbnb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `comp206_airbnb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `comp206_airbnb` ;

-- -----------------------------------------------------
-- Table `comp206_airbnb`.`amenities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`amenities` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`amenities` (
  `id` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `comp206_airbnb`.`states`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`states` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`states` (
  `id` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `comp206_airbnb`.`cities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`cities` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`cities` (
  `id` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(128) NOT NULL,
  `state_id` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cities_ibfk_1`
    FOREIGN KEY (`state_id`)
    REFERENCES `comp206_airbnb`.`states` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `state_id` ON `comp206_airbnb`.`cities` (`state_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `comp206_airbnb`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`users` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`users` (
  `id` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  `first_name` VARCHAR(128) NULL DEFAULT NULL,
  `last_name` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `comp206_airbnb`.`places`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`places` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`places` (
  `id` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `city_id` VARCHAR(60) NOT NULL,
  `user_id` VARCHAR(60) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `description` VARCHAR(1024) NULL DEFAULT NULL,
  `number_rooms` INT NOT NULL,
  `number_bathrooms` INT NOT NULL,
  `max_guest` INT NOT NULL,
  `price_by_night` INT NOT NULL,
  `latitude` FLOAT NULL DEFAULT NULL,
  `longitude` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `places_ibfk_1`
    FOREIGN KEY (`city_id`)
    REFERENCES `comp206_airbnb`.`cities` (`id`),
  CONSTRAINT `places_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `comp206_airbnb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `city_id` ON `comp206_airbnb`.`places` (`city_id` ASC) VISIBLE;

CREATE INDEX `user_id` ON `comp206_airbnb`.`places` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `comp206_airbnb`.`place_amenity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`place_amenity` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`place_amenity` (
  `place_id` VARCHAR(60) NOT NULL,
  `amenity_id` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`place_id`, `amenity_id`),
  CONSTRAINT `place_amenity_ibfk_1`
    FOREIGN KEY (`place_id`)
    REFERENCES `comp206_airbnb`.`places` (`id`),
  CONSTRAINT `place_amenity_ibfk_2`
    FOREIGN KEY (`amenity_id`)
    REFERENCES `comp206_airbnb`.`amenities` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `amenity_id` ON `comp206_airbnb`.`place_amenity` (`amenity_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `comp206_airbnb`.`reviews`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comp206_airbnb`.`reviews` ;

CREATE TABLE IF NOT EXISTS `comp206_airbnb`.`reviews` (
  `id` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `place_id` VARCHAR(60) NOT NULL,
  `user_id` VARCHAR(60) NOT NULL,
  `text` VARCHAR(1024) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `reviews_ibfk_1`
    FOREIGN KEY (`place_id`)
    REFERENCES `comp206_airbnb`.`places` (`id`),
  CONSTRAINT `reviews_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `comp206_airbnb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `place_id` ON `comp206_airbnb`.`reviews` (`place_id` ASC) VISIBLE;

CREATE INDEX `user_id` ON `comp206_airbnb`.`reviews` (`user_id` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
