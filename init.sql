CREATE DATABASE IF NOT EXISTS `tododb` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;

USE `tododb`;

CREATE TABLE IF NOT EXISTS `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `todos` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    due_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

#Teszt adatok beszúrása

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'testuser1', 'scrypt:32768:8:1$awW9XXy8skjbMiMg$5a1767fec5191539dc53b7bbd9c579fb245118d7ee91785c15c992f60b69c5dfa1673aee41b2e7ec0996094af6419bf4efef41f3038ab4b0445ff7aa716bd502', '2024-09-11 13:38:15'),
(2, 'testuser2', 'scrypt:32768:8:1$ww5eaf2T4u8bSd2j$eb63a6186c00ca35cdb7445b089269dcd4bea31a1573d73aed90ed49e68b0481716c6ceb9ff9c0b6d1721155e5ff73409942f4b86b47de3e5061321158bc89d5', '2024-09-11 13:38:50');

INSERT INTO `todos` (`id`, `user_id`, `title`, `completed`, `due_date`, `created_at`) VALUES
(1, 1, 'Learn JavaScript', 0, '2024-10-04 22:00:00', '2024-08-15 08:00:00'),
(2, 1, 'Build a web application', 1, '2024-10-14 22:00:00', '2024-08-17 09:30:00'),
(3, 1, 'Study algorithms', 0, '2024-10-17 22:00:00', '2024-08-19 06:45:00'),
(4, 1, 'Debug a Python script', 1, '2024-10-19 22:00:00', '2024-08-21 07:15:00'),
(5, 1, 'Learn React.js', 0, '2024-10-24 22:00:00', '2024-08-23 12:45:00'),
(6, 1, 'Write a SQL query', 1, '2024-10-06 22:00:00', '2024-08-25 10:30:00'),
(7, 1, 'Set up a Linux server', 0, '2024-10-10 22:00:00', '2024-08-27 11:00:00'),
(8, 1, 'Configure Docker', 1, '2024-10-13 22:00:00', '2024-08-29 06:00:00'),
(9, 1, 'Deploy a Node.js app', 0, '2024-10-20 22:00:00', '2024-08-30 08:00:00'),
(10, 1, 'Implement a REST API', 0, '2024-10-22 22:00:00', '2024-08-31 09:00:00'),
(11, 2, 'Design a database schema', 1, '2024-10-01 22:00:00', '2024-08-10 07:00:00'),
(12, 2, 'Optimize SQL queries', 0, '2024-10-05 22:00:00', '2024-08-12 12:30:00'),
(13, 2, 'Learn TypeScript', 1, '2024-10-07 22:00:00', '2024-08-13 06:00:00'),
(14, 2, 'Test a REST API', 0, '2024-10-12 22:00:00', '2024-08-15 13:00:00'),
(15, 2, 'Configure CI/CD pipeline', 1, '2024-10-18 22:00:00', '2024-08-18 09:45:00'),
(16, 2, 'Create unit tests', 0, '2024-10-21 22:00:00', '2024-08-20 08:15:00'),
(17, 2, 'Refactor legacy code', 1, '2024-10-23 22:00:00', '2024-08-22 11:30:00'),
(18, 2, 'Learn cybersecurity basics', 0, '2024-10-26 22:00:00', '2024-08-24 06:30:00'),
(19, 2, 'Implement OAuth authentication', 1, '2024-10-27 23:00:00', '2024-08-26 15:15:00'),
(20, 2, 'Analyze system performance', 0, '2024-10-29 23:00:00', '2024-08-28 17:45:00');
