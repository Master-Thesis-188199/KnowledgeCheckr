-- -----------------------------------------------------
-- Data for table `KnowledgeCheckr-DB`.`User`
-- -----------------------------------------------------
INSERT INTO `KnowledgeCheckr-DB`.`User` (`id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`) VALUES ('1WUOGaKXsF9GNsGFGpY6kjCplTcGm97H', 'testuser', 'test@email.com', 0, NULL, '2025-05-11 08:12:02', '2025-05-11 08:12:02') ON DUPLICATE KEY UPDATE id=id ;--> statement-breakpoint


-- -----------------------------------------------------
-- Data for table `KnowledgeCheckr-DB`.`Account`
-- -----------------------------------------------------

INSERT INTO `KnowledgeCheckr-DB`.`Account` (`id`, `accountId`, `providerId`, `user_id`, `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`, `createdAt`, `updatedAt`) VALUES ('gQ3yS2oCC4LOVw43bbeN2AVuwIArh0GR', '1WUOGaKXsF9GNsGFGpY6kjCplTcGm97H', 'credential', '1WUOGaKXsF9GNsGFGpY6kjCplTcGm97H', NULL, NULL, NULL, NULL, NULL, NULL, '079e6c442380c05ee6ed14acb250e192:ee6044fc470e118c23157b267b8341e2ec3f1cdf0f9b05aaaf7d8ae9fcbcad2e44204b224677811f7c7d00a4f3e6065df3bca719419a726a36e5441319878d8c', '2025-05-11 08:12:03', '2025-05-11 08:12:03') ON DUPLICATE KEY UPDATE id=id;--> statement-breakpoint


-- -----------------------------------------------------
-- Data for table `KnowledgeCheckr-DB`.`Category`
-- -----------------------------------------------------
INSERT INTO `KnowledgeCheckr-DB`.`Category` (`id`, `name`, `createdAt`, `updatedAt`, `prequisite_category_id`) VALUES ('628b11df-c906-421c-af25-f48e743adf2b', 'general', DEFAULT, DEFAULT, NULL) ON DUPLICATE KEY UPDATE id=id;
