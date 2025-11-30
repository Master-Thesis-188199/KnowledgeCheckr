ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `allow_anonymous` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `allow_free_navigation` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` ADD `questionOrder` enum('create-order','random') NOT NULL;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` ADD `answerOrder` enum('create-order','random') NOT NULL;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` DROP COLUMN `randomize_questions`;