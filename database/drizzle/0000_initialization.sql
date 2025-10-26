CREATE TABLE `Account` (
	`id` varchar(36) NOT NULL,
	`accountId` tinytext NOT NULL,
	`providerId` tinytext NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`accessToken` mediumtext,
	`refreshToken` mediumtext,
	`idToken` mediumtext,
	`accessTokenExpiresAt` datetime,
	`refreshTokenExpiresAt` datetime,
	`scope` tinytext,
	`password` tinytext,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Account_id` PRIMARY KEY(`id`)
);

CREATE TABLE `Answer` (
	`id` varchar(36) NOT NULL,
	`answer` mediumtext NOT NULL,
	`correct` tinyint,
	`position` int,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`Question_id` varchar(36) NOT NULL,
	CONSTRAINT `Answer_id` PRIMARY KEY(`id`)
);

CREATE TABLE `Category` (
	`id` varchar(36) NOT NULL,
	`name` tinytext NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`prequisite_category_id` varchar(36),
	CONSTRAINT `Category_id` PRIMARY KEY(`id`)
);

CREATE TABLE `KnowledgeCheck` (
	`id` varchar(36) NOT NULL,
	`name` tinytext NOT NULL,
	`description` mediumtext,
	`owner_id` varchar(36) NOT NULL,
	`public_token` tinytext,
	`openDate` datetime NOT NULL,
	`closeDate` datetime,
	`difficulty` int NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expiresAt` datetime DEFAULT NULL,
	CONSTRAINT `KnowledgeCheck_id` PRIMARY KEY(`id`)
);

CREATE TABLE `KnowledgeCheck_Settings` (
	`id` varchar(36) NOT NULL,
	`knowledgecheck_id` varchar(36) NOT NULL,
	`allow_anonymous` tinyint DEFAULT 1,
	`randomize_questions` tinyint DEFAULT 1,
	`allow_free_navigation` tinyint DEFAULT 1,
	CONSTRAINT `KnowledgeCheck_Settings_id` PRIMARY KEY(`id`)
);

CREATE TABLE `Question` (
	`id` varchar(36) NOT NULL,
	`type` enum('single-choice','multiple-choice','open-question','drag-drop') NOT NULL,
	`question` mediumtext NOT NULL,
	`points` int NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`category_id` varchar(36) NOT NULL,
	`knowledgecheck_id` varchar(36) NOT NULL,
	CONSTRAINT `Question_id` PRIMARY KEY(`id`)
);

CREATE TABLE `Session` (
	`id` varchar(36) NOT NULL,
	`token` tinytext NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`expiresAt` datetime NOT NULL,
	`ipAddress` tinytext,
	`userAgent` tinytext,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`)
);

CREATE TABLE `User` (
	`id` varchar(36) NOT NULL,
	`name` tinytext NOT NULL,
	`email` tinytext NOT NULL,
	`emailVerified` tinyint NOT NULL,
	`image` varchar(512),
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `User_id` PRIMARY KEY(`id`)
);

CREATE TABLE `User_contributesTo_KnowledgeCheck` (
	`user_id` varchar(36) NOT NULL,
	`knowledgecheck_id` varchar(36) NOT NULL,
	CONSTRAINT `User_has_done_KnowledgeCheck_pk` PRIMARY KEY(`user_id`,`knowledgecheck_id`)
);

CREATE TABLE `User_has_done_KnowledgeCheck` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`knowledgeCheck_id` varchar(36) NOT NULL,
	`startedAt` datetime NOT NULL,
	`finishedAt` datetime NOT NULL,
	`score` int NOT NULL,
	`results` json NOT NULL,
	CONSTRAINT `User_has_done_KnowledgeCheck_id_user_id_knowledgeCheck_id_pk` PRIMARY KEY(`id`,`user_id`,`knowledgeCheck_id`)
);

CREATE TABLE `Verification` (
	`id` varchar(36) NOT NULL,
	`identifier` tinytext NOT NULL,
	`value` varchar(1024) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Verification_id` PRIMARY KEY(`id`)
);

ALTER TABLE `Account` ADD CONSTRAINT `fk_account_user1` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Answer` ADD CONSTRAINT `fk_Answer_Question1` FOREIGN KEY (`Question_id`) REFERENCES `Question`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Category` ADD CONSTRAINT `fk_Category_Category1` FOREIGN KEY (`prequisite_category_id`) REFERENCES `Category`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `KnowledgeCheck` ADD CONSTRAINT `fk_KnowledgeCheck_user1` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `KnowledgeCheck_Settings` ADD CONSTRAINT `fk_KnowledgeCheck_Settings_KnowledgeCheck1` FOREIGN KEY (`knowledgecheck_id`) REFERENCES `KnowledgeCheck`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Question` ADD CONSTRAINT `fk_Question_Category1` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Question` ADD CONSTRAINT `fk_Question_KnowledgeCheck1` FOREIGN KEY (`knowledgecheck_id`) REFERENCES `KnowledgeCheck`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Session` ADD CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `User_contributesTo_KnowledgeCheck` ADD CONSTRAINT `fk_user_has_KnowledgeCheck_user1` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE cascade;
ALTER TABLE `User_contributesTo_KnowledgeCheck` ADD CONSTRAINT `fk_user_has_KnowledgeCheck_KnowledgeCheck1` FOREIGN KEY (`knowledgecheck_id`) REFERENCES `KnowledgeCheck`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `User_has_done_KnowledgeCheck` ADD CONSTRAINT `fk_user_has_KnowledgeCheck_user2` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `User_has_done_KnowledgeCheck` ADD CONSTRAINT `fk_user_has_KnowledgeCheck_KnowledgeCheck2` FOREIGN KEY (`knowledgeCheck_id`) REFERENCES `KnowledgeCheck`(`id`) ON DELETE cascade ON UPDATE no action;
CREATE INDEX `fk_account_user1_idx` ON `Account` (`user_id`);
CREATE INDEX `fk_Answer_Question1_idx` ON `Answer` (`Question_id`);
CREATE INDEX `fk_Category_Category1_idx` ON `Category` (`prequisite_category_id`);
CREATE INDEX `fk_KnowledgeCheck_user1_idx` ON `KnowledgeCheck` (`owner_id`);
CREATE INDEX `fk_KnowledgeCheck_Settings_KnowledgeCheck1_idx` ON `KnowledgeCheck_Settings` (`knowledgecheck_id`);
CREATE INDEX `fk_Question_Category1_idx` ON `Question` (`category_id`);
CREATE INDEX `fk_Question_KnowledgeCheck1_idx` ON `Question` (`knowledgecheck_id`);
CREATE INDEX `fk_session_user_idx` ON `Session` (`user_id`);
CREATE INDEX `fk_user_has_KnowledgeCheck_KnowledgeCheck1_idx` ON `User_contributesTo_KnowledgeCheck` (`knowledgecheck_id`);
CREATE INDEX `fk_user_has_KnowledgeCheck_user1_idx` ON `User_contributesTo_KnowledgeCheck` (`user_id`);
CREATE INDEX `fk_user_has_KnowledgeCheck_KnowledgeCheck2_idx` ON `User_has_done_KnowledgeCheck` (`knowledgeCheck_id`);
CREATE INDEX `fk_user_has_KnowledgeCheck_user2_idx` ON `User_has_done_KnowledgeCheck` (`user_id`);