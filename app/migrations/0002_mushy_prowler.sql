CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
ALTER TABLE `comments` ADD `post_id` text NOT NULL REFERENCES posts(id);--> statement-breakpoint
ALTER TABLE `comments` DROP COLUMN `post_slug`;