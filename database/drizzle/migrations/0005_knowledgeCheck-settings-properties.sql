ALTER TABLE `KnowledgeCheck_Settings` ADD `questionOrder` enum('create-order','random');--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` ADD `answerOrder` enum('create-order','random');--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` DROP COLUMN `randomize_questions`;