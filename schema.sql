-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema movietheaterdb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `movietheaterdb` ;

-- -----------------------------------------------------
-- Schema movietheaterdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `movietheaterdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `movietheaterdb` ;

-- -----------------------------------------------------
-- Table `movietheaterdb`.`actor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movietheaterdb`.`actor` ;

CREATE TABLE IF NOT EXISTS `movietheaterdb`.`actor` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `movietheaterdb`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movietheaterdb`.`user` ;

CREATE TABLE IF NOT EXISTS `movietheaterdb`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(150) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `age` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `movietheaterdb`.`movie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movietheaterdb`.`movie` ;

CREATE TABLE IF NOT EXISTS `movietheaterdb`.`movie` (
  `movie_id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `photo` BLOB NULL DEFAULT NULL,
  `year` INT(11) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `user_id` INT(11) NULL,
  PRIMARY KEY (`movie_id`),
  INDEX `fk_movie_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_movie_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `movietheaterdb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `movietheaterdb`.`movie_has_actor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movietheaterdb`.`movie_has_actor` ;

CREATE TABLE IF NOT EXISTS `movietheaterdb`.`movie_has_actor` (
  `movie_id` INT(11) NOT NULL,
  `actor_id` INT(11) NOT NULL,
  PRIMARY KEY (`movie_id`, `actor_id`),
  INDEX `fk_movie_has_actor_actor1_idx` (`actor_id` ASC) VISIBLE,
  INDEX `fk_movie_has_actor_movie1_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_movie_has_actor_movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `movietheaterdb`.`movie` (`movie_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_movie_has_actor_actor1`
    FOREIGN KEY (`actor_id`)
    REFERENCES `movietheaterdb`.`actor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `movietheaterdb`.`genre`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movietheaterdb`.`genre` ;

CREATE TABLE IF NOT EXISTS `movietheaterdb`.`genre` (
  `genre_id` INT NOT NULL AUTO_INCREMENT,
  `genre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`genre_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movietheaterdb`.`movie_has_genre`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movietheaterdb`.`movie_has_genre` ;

CREATE TABLE IF NOT EXISTS `movietheaterdb`.`movie_has_genre` (
  `movie_id` INT(11) NOT NULL,
  `genre_id` INT NOT NULL,
  PRIMARY KEY (`movie_id`, `genre_id`),
  INDEX `fk_movie_has_genre_genre1_idx` (`genre_id` ASC) VISIBLE,
  INDEX `fk_movie_has_genre_movie1_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_movie_has_genre_movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `movietheaterdb`.`movie` (`movie_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_movie_has_genre_genre1`
    FOREIGN KEY (`genre_id`)
    REFERENCES `movietheaterdb`.`genre` (`genre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
