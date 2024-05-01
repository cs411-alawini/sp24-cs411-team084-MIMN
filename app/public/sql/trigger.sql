DELIMITER //
CREATE TRIGGER check_users_values_before_insert
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF NEW.gpa < 0.0 OR NEW.gpa > 4.0 THEN
        SET NEW.gpa = NULL;
    END IF;
    IF NEW.gre_q < 130 OR NEW.gre_q > 170 THEN
        SET NEW.gre_q = NULL;
    END IF;
    IF NEW.gre_v < 130 OR NEW.gre_v > 170 THEN
        SET NEW.gre_v = NULL;
    END IF;
    IF NEW.gre_awa < 0.0 OR NEW.gre_awa > 6.0 THEN
        SET NEW.gre_awa = NULL; 
    END IF;
END; //
DELIMITER ;


DELIMITER //
CREATE TRIGGER check_users_values_before_update
BEFORE UPDATE ON user
FOR EACH ROW
BEGIN
   IF NEW.gpa IS NOT NULL THEN
       IF NEW.gpa < 0.0 OR NEW.gpa > 4.0 THEN
           SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'Error: gpa must be between 0 and 4';
	END IF;
   END IF;
  
   IF NEW.gre_q IS NOT NULL THEN
       IF NEW.gre_q < 130 OR NEW.gre_q > 170 THEN
           SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'Error: gre_q must be between 130 and 170';
       END IF;
   END IF;
  
   IF NEW.gre_v IS NOT NULL THEN
       IF NEW.gre_v < 130 OR NEW.gre_v > 170 THEN
           SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'Error: gre_v must be between 130 and 170';
	END IF;
   END IF;
  
   IF NEW.gre_awa IS NOT NULL THEN
       IF NEW.gre_awa < 0.0 OR NEW.gre_awa > 6.0 THEN
           SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'Error: gre_v must be between 0 and 6';
	END IF;
   END IF;
END; //
DELIMITER ;