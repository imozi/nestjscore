-- AddTriggerForAccount
CREATE OR REPLACE FUNCTION create_user_for_account() RETURNS TRIGGER
 AS $$
   BEGIN
     INSERT INTO users(id, account_id) VALUES (gen_random_uuid(), NEW.id);
     RETURN NEW;
 END;
 $$ LANGUAGE plpgsql;

 -- AddTriggerForAccount
CREATE OR REPLACE FUNCTION create_settings_for_account() RETURNS TRIGGER
 AS $$
   BEGIN
     INSERT INTO settings(id, account_id) VALUES (gen_random_uuid(), NEW.id);
     RETURN NEW;
 END;
 $$ LANGUAGE plpgsql;

-- AddTriggerForUser
CREATE OR REPLACE FUNCTION update_user_fullname() RETURNS TRIGGER
 AS $$
  BEGIN
  
  NEW.full_name = CONCAT(NEW.surname, ' ' ,NEW.name, ' ' ,NEW.patronymic);
 
  RETURN NEW;
 END;
 $$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION update_user_age() RETURNS TRIGGER
 AS $$
  BEGIN
  
  NEW.age := EXTRACT(YEAR FROM age(NEW.birthday));
 
  RETURN NEW;
 END;
 $$ LANGUAGE plpgsql;

-- Delete Triggers
DROP TRIGGER IF EXISTS create_user_after_account ON accounts;
DROP TRIGGER IF EXISTS create_settings_for_account ON accounts;
DROP TRIGGER IF EXISTS update_user_fullname ON users;
DROP TRIGGER IF EXISTS update_user_age ON users;

-- Use Triggers

CREATE TRIGGER create_user_after_account AFTER INSERT ON accounts
FOR EACH ROW EXECUTE PROCEDURE create_user_for_account();

CREATE TRIGGER create_settings_for_account AFTER INSERT ON accounts
FOR EACH ROW EXECUTE PROCEDURE create_settings_for_account();

CREATE TRIGGER update_user_fullname BEFORE UPDATE OF name, surname, patronymic ON users
FOR EACH ROW WHEN ((new.name != old.name) or (new.surname != old.surname) or (new.patronymic != old.patronymic))
EXECUTE PROCEDURE update_user_fullname();

CREATE TRIGGER update_user_age BEFORE UPDATE OF birthday ON users
FOR EACH ROW WHEN (new.birthday != old.birthday)
EXECUTE PROCEDURE update_user_age();