CREATE TABLE `likes` (
	`id` integer PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`user_id` text NOT NULL,
	`country` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
