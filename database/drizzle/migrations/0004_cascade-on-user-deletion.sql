ALTER TABLE `KnowledgeCheck` DROP FOREIGN KEY `fk_KnowledgeCheck_user1`;
--> statement-breakpoint
ALTER TABLE `User_contributesTo_KnowledgeCheck` DROP FOREIGN KEY `fk_user_has_KnowledgeCheck_user1`;
--> statement-breakpoint
ALTER TABLE `KnowledgeCheck` ADD CONSTRAINT `fk_KnowledgeCheck_user1` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User_contributesTo_KnowledgeCheck` ADD CONSTRAINT `fk_user_has_KnowledgeCheck_user1` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;