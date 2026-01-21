ALTER TABLE `KnowledgeCheck_Settings` ADD `enableExaminations` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` ADD `startDate` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `KnowledgeCheck_Settings` ADD `endDate` datetime;