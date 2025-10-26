ALTER TABLE `KnowledgeCheck` MODIFY COLUMN `public_token` varchar(50);
ALTER TABLE `KnowledgeCheck` ADD CONSTRAINT `KnowledgeCheck_public_token_unique` UNIQUE(`public_token`);