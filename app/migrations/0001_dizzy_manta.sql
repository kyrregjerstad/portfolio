CREATE TABLE `comments` (
	`id` integer PRIMARY KEY NOT NULL,
	`post_slug` text NOT NULL,
	`author` text NOT NULL,
	`content` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
