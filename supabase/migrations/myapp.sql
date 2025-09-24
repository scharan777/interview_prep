CREATE DATABASE myapp_db;
CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON myapp_db.* TO 'myuser'@'localhost';
