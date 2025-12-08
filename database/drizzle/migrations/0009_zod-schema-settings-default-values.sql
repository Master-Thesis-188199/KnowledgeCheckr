ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `allow_anonymous` tinyint NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `allow_free_navigation` tinyint NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `questionOrder` enum('create-order','random') NOT NULL DEFAULT 'random';--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `answerOrder` enum('create-order','random') NOT NULL DEFAULT 'random';--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` MODIFY COLUMN `examTimeFrameSeconds` int NOT NULL DEFAULT 3600;