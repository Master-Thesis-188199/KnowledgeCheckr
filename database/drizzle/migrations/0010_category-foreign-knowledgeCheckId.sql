ALTER TABLE `Category` ADD `knowledgecheck_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `Category` ADD CONSTRAINT `fk_Category_KnowledgeCheck1` FOREIGN KEY (`knowledgecheck_id`) REFERENCES `KnowledgeCheck`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `fk_Category_KnowledgeCheck1_idx` ON `Category` (`knowledgecheck_id`);