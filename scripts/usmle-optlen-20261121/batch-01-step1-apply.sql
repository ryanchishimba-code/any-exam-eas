-- Served USMLE option-length fix, 2026-11-21, batch 1 (Step 1).
-- Wording only. The same choice stays correct. correctAnswer is updated only when its option text changes, and it stays an exact option string.
-- Staging table: qbi_usmle_optlen_20261121_stage
-- Backup: qbi_usmle_optlen_20261121_b1_backup (186 rows), created in this transaction.
-- Undo: scripts/usmle-optlen-20261121/batch-01-step1-undo.sql
-- Do not run against production until this draft is reviewed. This file does not apply itself.
BEGIN;

CREATE TABLE IF NOT EXISTS qbi_usmle_optlen_20261121_stage (
  id text PRIMARY KEY,
  step text NOT NULL,
  batch integer NOT NULL,
  old_options text NOT NULL,
  new_options text NOT NULL,
  old_correct text NOT NULL,
  new_correct text NOT NULL,
  old_explanation text NOT NULL,
  new_explanation text NOT NULL,
  old_key_len integer NOT NULL,
  old_second_len integer NOT NULL,
  new_key_len integer NOT NULL,
  new_second_len integer NOT NULL,
  old_length_ratio numeric NOT NULL,
  new_length_ratio numeric NOT NULL
);

DO $guard$
BEGIN
  IF to_regclass('public.qbi_usmle_optlen_20261121_b1_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_optlen_20261121_b1_backup already exists; undo or drop it before re-applying';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_stage WHERE batch = 1) <> 0 THEN
    RAISE EXCEPTION 'staging table already has batch 1 rows';
  END IF;
END
$guard$;

CREATE TABLE qbi_usmle_optlen_20261121_b1_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
  $bk1042c3da6$042c3da6-6d2e-4e4f-9e55-2e580e2f3c85$bk1042c3da6$,
  $bk1067a38a4$067a38a4-c3f6-4ed0-a206-7eafd92d3e49$bk1067a38a4$,
  $bk1070584d7$070584d7-f672-4dfc-8cb9-cd5578c35a44$bk1070584d7$,
  $bk108625916$08625916-6c07-498d-a199-a4115492fb72$bk108625916$,
  $bk109c036db$09c036db-f34d-4fa5-a49f-a28e135818d2$bk109c036db$,
  $bk10a68a14b$0a68a14b-fe8c-4a6c-92b6-80bfc8203e67$bk10a68a14b$,
  $bk10bcfe054$0bcfe054-db74-41b5-9b36-7f064db70746$bk10bcfe054$,
  $bk10c6ff7d1$0c6ff7d1-2eed-4949-88c6-ca84293932e4$bk10c6ff7d1$,
  $bk10cef6fda$0cef6fda-ab8b-459a-b865-1cb115605918$bk10cef6fda$,
  $bk10e0ee07d$0e0ee07d-4dd5-4d60-849b-bad42062938d$bk10e0ee07d$,
  $bk10ef74b4a$0ef74b4a-3e30-43ff-8b57-73a3af91015b$bk10ef74b4a$,
  $bk10fa4bc05$0fa4bc05-0226-4d17-a3ea-37c58331716e$bk10fa4bc05$,
  $bk112036061$12036061-94d7-40d5-b7c3-1a9870b41d6f$bk112036061$,
  $bk1141e1809$141e1809-4886-47f6-b7ac-a5aa9d8d3d65$bk1141e1809$,
  $bk11426b6f7$1426b6f7-c20d-4d85-9c09-8a7e34c8e0f3$bk11426b6f7$,
  $bk115c5c4d4$15c5c4d4-6413-4abc-a04b-875eeff22e91$bk115c5c4d4$,
  $bk11645aeb0$1645aeb0-a3d6-4b9f-82b8-4dee991ba0d4$bk11645aeb0$,
  $bk116c84162$16c84162-4899-4bbe-8cf2-f6ba6cafe9de$bk116c84162$,
  $bk1170467c3$170467c3-ae76-4186-ab1c-258c4cc021a0$bk1170467c3$,
  $bk117a52c84$17a52c84-8a83-4b96-854d-4297b9102661$bk117a52c84$,
  $bk11a1a8ce1$1a1a8ce1-b46a-4d5a-9860-b1defaf45a0d$bk11a1a8ce1$,
  $bk11b8f8671$1b8f8671-2496-44bd-ba70-337b001b0480$bk11b8f8671$,
  $bk11cedaa2f$1cedaa2f-cda3-4658-83d9-75435a52f7bb$bk11cedaa2f$,
  $bk11d31cc8d$1d31cc8d-7d00-4140-9732-021645b7687a$bk11d31cc8d$,
  $bk120fd3836$20fd3836-9fa5-4ac0-bc6d-0acdfd2ae267$bk120fd3836$,
  $bk121c64627$21c64627-7783-49e8-bd12-94addf33ba16$bk121c64627$,
  $bk129dfaab5$29dfaab5-b81a-4d6b-8162-3bb69643ce71$bk129dfaab5$,
  $bk12b36418a$2b36418a-d92f-430c-8a3b-4dae6f5f4de8$bk12b36418a$,
  $bk12b6ef944$2b6ef944-f7ea-4288-94d1-ee1b0ac46e56$bk12b6ef944$,
  $bk12c726600$2c726600-7fe3-4d63-bdd0-49faeb83fae6$bk12c726600$,
  $bk12fd53e3b$2fd53e3b-3081-48ab-ba65-ad3c6bf8efd5$bk12fd53e3b$,
  $bk130f03aaa$30f03aaa-4889-4036-8372-053f0c96a3dd$bk130f03aaa$,
  $bk133bde9ac$33bde9ac-a456-45bb-b247-44ba624922b2$bk133bde9ac$,
  $bk13601c916$3601c916-2775-4f26-a9a3-29561207e8bb$bk13601c916$,
  $bk137b6b957$37b6b957-9f5b-4838-9055-fc458aeeb102$bk137b6b957$,
  $bk13810fa1d$3810fa1d-2efd-45ff-9335-6529ec03d6eb$bk13810fa1d$,
  $bk1395eddcd$395eddcd-095a-45b9-9207-1ad9e61935fb$bk1395eddcd$,
  $bk13986dbe7$3986dbe7-1c4d-41ee-aa10-a7cf094bb73e$bk13986dbe7$,
  $bk13c089e6b$3c089e6b-72d1-4aa7-be76-0fad94f69552$bk13c089e6b$,
  $bk147bf8f4b$47bf8f4b-2d88-4849-9a63-ebe4503e0d80$bk147bf8f4b$,
  $bk149d92460$49d92460-1bec-4c36-818b-1ac0f5e4ad02$bk149d92460$,
  $bk14c5b604c$4c5b604c-c6c1-47f4-ae14-fe806c7ba16b$bk14c5b604c$,
  $bk14d3786dc$4d3786dc-8831-40b8-9ca0-4ae7f57f97b2$bk14d3786dc$,
  $bk15085a60e$5085a60e-5dfe-4841-a597-ef3d96bbfe51$bk15085a60e$,
  $bk150eb4e38$50eb4e38-9304-43a4-ad39-f5e7359f114b$bk150eb4e38$,
  $bk15154e6d8$5154e6d8-bf0e-44f0-b76c-90e0ff7fd4be$bk15154e6d8$,
  $bk157876fff$57876fff-a386-4625-9f15-fd435047a064$bk157876fff$,
  $bk157eb0be0$57eb0be0-bb67-4eca-a021-8c87e739e237$bk157eb0be0$,
  $bk159b762c4$59b762c4-e85b-4453-88bb-8cd17f47d42f$bk159b762c4$,
  $bk15b9381e5$5b9381e5-4c62-445e-b33e-e6d02c1a14b6$bk15b9381e5$,
  $bk15c902210$5c902210-02e9-4c47-a4e1-18d486917f26$bk15c902210$,
  $bk15e58ea9a$5e58ea9a-9fb5-44e9-9199-2883ff3ccca9$bk15e58ea9a$,
  $bk15ee987bf$5ee987bf-3c91-456e-9830-92d5133540a7$bk15ee987bf$,
  $bk16096dcfb$6096dcfb-250b-4bde-aeb6-0b26894cea5f$bk16096dcfb$,
  $bk16285434c$6285434c-ffa7-41bf-8af4-ae7785749e05$bk16285434c$,
  $bk16301a847$6301a847-1a9c-4135-96ba-fe35c4888f10$bk16301a847$,
  $bk163abd899$63abd899-7d89-49e9-b331-814de6dcffa4$bk163abd899$,
  $bk164b837a6$64b837a6-12c5-4422-95fb-fd089bc14a3f$bk164b837a6$,
  $bk166674dfe$66674dfe-6cd5-486d-9192-8dc37700cd77$bk166674dfe$,
  $bk168451525$68451525-fe8c-4029-bcbd-85d9bb799585$bk168451525$,
  $bk168b1f684$68b1f684-adbf-4e1c-88f0-c3c9534ecaa5$bk168b1f684$,
  $bk169c07528$69c07528-49b3-4788-a901-85dc4a679edb$bk169c07528$,
  $bk16a6a10dc$6a6a10dc-f653-450f-a390-46712fa4fb79$bk16a6a10dc$,
  $bk16ca3f160$6ca3f160-f94a-41c2-9f2a-72825a24532c$bk16ca3f160$,
  $bk16f610371$6f610371-3e4f-4044-a9be-b3ef98a9f325$bk16f610371$,
  $bk1705b8b1d$705b8b1d-4141-49a0-a0c2-8bbafd472f10$bk1705b8b1d$,
  $bk1712f04dc$712f04dc-c6d9-4e3d-a7be-eaa58a2c5390$bk1712f04dc$,
  $bk172aaff46$72aaff46-d7ee-4895-b9cb-dd25097bedce$bk172aaff46$,
  $bk1749a9438$749a9438-ac3f-4a7a-a06e-6741e3301a7e$bk1749a9438$,
  $bk175e54346$75e54346-8748-4ffe-ac1c-3522e842062a$bk175e54346$,
  $bk176e3a5b8$76e3a5b8-1b6f-43af-bee2-64d017c08c37$bk176e3a5b8$,
  $bk17772989f$7772989f-54b1-4c60-b8ad-f98b48aa7017$bk17772989f$,
  $bk1786c4238$786c4238-dc01-4c26-a866-75187f335a5f$bk1786c4238$,
  $bk1787a4876$787a4876-1fc8-4c82-8855-9c475cf432ca$bk1787a4876$,
  $bk17a57b568$7a57b568-d011-42d7-8d6c-571b3f46f704$bk17a57b568$,
  $bk17af52ef6$7af52ef6-2e17-46a1-a817-8ed41d35e8c9$bk17af52ef6$,
  $bk17d37a793$7d37a793-8e62-4611-8d50-fb46d1f0d1e8$bk17d37a793$,
  $bk17f613402$7f613402-77ce-4c7a-904f-9a99e78222b4$bk17f613402$,
  $bk17f7cffe5$7f7cffe5-d912-4350-b570-a5f8c3b5baed$bk17f7cffe5$,
  $bk17fc81fea$7fc81fea-2b63-4025-8491-970ae60a7e56$bk17fc81fea$,
  $bk182632691$82632691-e8b0-4f8a-b4aa-d6bd4b2aca7e$bk182632691$,
  $bk18557837a$8557837a-dfd7-4d0f-8384-096946caceac$bk18557837a$,
  $bk186f499ee$86f499ee-49f9-4841-ad15-a2b4b20ab805$bk186f499ee$,
  $bk187495809$87495809-7264-46c6-834a-f20219ee8ed3$bk187495809$,
  $bk1883be9e8$883be9e8-c661-42e8-9f0a-3936911e7137$bk1883be9e8$,
  $bk18881b4a1$8881b4a1-f482-4f60-b9f0-1d641c4a542d$bk18881b4a1$,
  $bk188f96721$88f96721-4420-498b-b251-ac9ca4817031$bk188f96721$,
  $bk189740024$89740024-069b-4113-9ecd-6c9bfc508561$bk189740024$,
  $bk18bd1b6e1$8bd1b6e1-edf0-4f98-8b7d-cd2d9ec1ee7c$bk18bd1b6e1$,
  $bk18fd34ae9$8fd34ae9-9011-420d-aa73-e726ae29f6fc$bk18fd34ae9$,
  $bk19205c7e4$9205c7e4-4ea5-46f7-8ec8-52d3468d3507$bk19205c7e4$,
  $bk1924ead04$924ead04-d8b0-40a4-b9a0-9471f7b0df91$bk1924ead04$,
  $bk19286a904$9286a904-b968-4448-8698-77e08d1f379c$bk19286a904$,
  $bk1948781fa$948781fa-3b35-493b-b52f-f379b7206aa5$bk1948781fa$,
  $bk1957e7d47$957e7d47-d764-4b5a-8fe0-f94505687879$bk1957e7d47$,
  $bk1974fa6ee$974fa6ee-07b2-4e9a-bf93-7a6a9ecb3583$bk1974fa6ee$,
  $bk19770c694$9770c694-7902-4a22-9f0a-404755abbf36$bk19770c694$,
  $bk19f4d6cad$9f4d6cad-5cd6-48e3-81ac-c420a81319b0$bk19f4d6cad$,
  $bk1a0b38e50$a0b38e50-3212-4351-a049-056d4a4ba2a5$bk1a0b38e50$,
  $bk1a0e057f0$a0e057f0-9854-4f2a-a0c7-a4056e4e1eac$bk1a0e057f0$,
  $bk1a26d5a1c$a26d5a1c-cc28-4e64-b762-914db4e8dbad$bk1a26d5a1c$,
  $bk1a36f76cd$a36f76cd-4aa3-490b-b060-38f748b39c66$bk1a36f76cd$,
  $bk1a5ee300b$a5ee300b-b44f-41f8-8f4c-cf39ff8e4386$bk1a5ee300b$,
  $bk1a6548cd4$a6548cd4-7602-4b14-887e-c48dd108b620$bk1a6548cd4$,
  $bk1ab099bf3$ab099bf3-3a1b-48c0-8c7d-7b99f9197688$bk1ab099bf3$,
  $bk1aeef5504$aeef5504-4df5-410e-b492-3d2f97637c67$bk1aeef5504$,
  $bk1afc24f4b$afc24f4b-0a4b-4c8b-b3b3-294db01bd9fe$bk1afc24f4b$,
  $bk1b0e8e222$b0e8e222-b9b2-4cbc-ace0-83cd800ed16d$bk1b0e8e222$,
  $bk1b1ffd86e$b1ffd86e-d55b-49b0-908b-8bc5076bbb6e$bk1b1ffd86e$,
  $bk1b2f9f819$b2f9f819-c302-444b-8372-df291e7211d3$bk1b2f9f819$,
  $bk1b389eb91$b389eb91-0b27-4dcd-9cd5-e4ee5a48ab3b$bk1b389eb91$,
  $bk1b3ceb95e$b3ceb95e-1e20-4223-8a04-2341f54cf7c3$bk1b3ceb95e$,
  $bk1b468dfc1$b468dfc1-fd50-43b3-9d1b-5a0106d50291$bk1b468dfc1$,
  $bk1b7x07668$b7x07668b6473806c81b9d13edb$bk1b7x07668$,
  $bk1b7x21973$b7x219732e43c9b0837bec967f1$bk1b7x21973$,
  $bk1b7x2e303$b7x2e3039cc74558f78170d844b$bk1b7x2e303$,
  $bk1b7xa5d1c$b7xa5d1c42be85f46f824e7c271$bk1b7xa5d1c$,
  $bk1b7xc0fe6$b7xc0fe649e4ff8ac79ff00a61b$bk1b7xc0fe6$,
  $bk1b7xc6a40$b7xc6a409aba1a50f254f5da7bc$bk1b7xc6a40$,
  $bk1b7xcd156$b7xcd1566e8c63494f1f80f87da$bk1b7xcd156$,
  $bk1b7xfb0fe$b7xfb0fe12e821cc943e04a3f99$bk1b7xfb0fe$,
  $bk1b8x13002$b8x1300288ac2599ed7b817dbee$bk1b8x13002$,
  $bk1b8x3b92f$b8x3b92f7a2b252f051d22c7ea2$bk1b8x3b92f$,
  $bk1b8x5dedd$b8x5dedd6a8900a473fa08d0dc6$bk1b8x5dedd$,
  $bk1b8x6c9dd$b8x6c9ddb8106eedc2b62807622$bk1b8x6c9dd$,
  $bk1b8x81438$b8x81438c4e1a27ac519364d664$bk1b8x81438$,
  $bk1b8xab8d8$b8xab8d8087148e1de0b8d27270$bk1b8xab8d8$,
  $bk1b8xe2661$b8xe2661280052233759a54e00e$bk1b8xe2661$,
  $bk1b9ecaf5a$b9ecaf5a-d29a-4923-aa8c-a45ac4d34d8d$bk1b9ecaf5a$,
  $bk1b9x6ce5c$b9x6ce5c05f56b5f6a485edb2da$bk1b9x6ce5c$,
  $bk1b9x9a163$b9x9a163c285bf9ff87da6daf52$bk1b9x9a163$,
  $bk1b9xc4c96$b9xc4c968d67bcf35d908ca784b$bk1b9xc4c96$,
  $bk1b9xf859e$b9xf859e2559998f28f8bb91271$bk1b9xf859e$,
  $bk1bcb10690$bcb10690-3a03-4691-9105-07d4f7d1277a$bk1bcb10690$,
  $bk1bd1518f4$bd1518f4-bc73-4aea-815e-e18d9ad899dd$bk1bd1518f4$,
  $bk1be63e936$be63e936-3229-4065-b1fd-99d041f13475$bk1be63e936$,
  $bk1be96201e$be96201e-5fdc-4fc1-a595-ce5c929fedd4$bk1be96201e$,
  $bk1beb7a8f8$beb7a8f8-6d2f-4410-9534-1c1f5bf3f0ed$bk1beb7a8f8$,
  $bk1c172a50a$c172a50a-d60d-4f9b-88bd-830a0d5cd30c$bk1c172a50a$,
  $bk1c18c3c1a$c18c3c1a-6dbe-43ff-921a-7d2241f1c437$bk1c18c3c1a$,
  $bk1c2adee7b$c2adee7b-0850-4cdc-8a7e-7b22d4739fb9$bk1c2adee7b$,
  $bk1c3210bd5$c3210bd5-679d-45e5-8be1-d8060b3261c7$bk1c3210bd5$,
  $bk1c53f4c08$c53f4c08-7cdd-44b7-817b-4a590cde1b5d$bk1c53f4c08$,
  $bk1c74c9699$c74c9699-2012-4846-b94a-083871bec441$bk1c74c9699$,
  $bk1c8108868$c8108868-f4cc-4fe2-8e3c-6d3db07cd839$bk1c8108868$,
  $bk1cab295b7$cab295b7-d78f-4efb-b014-e1ade44f44f2$bk1cab295b7$,
  $bk1cb1000e9$cb1000e9-5d3d-4935-8676-17d0799650c8$bk1cb1000e9$,
  $bk1cf8529d2$cf8529d2-d279-452e-88f9-5d06531031c4$bk1cf8529d2$,
  $bk1cmpnjgut$cmpnjguts001b1ymxe7pjj11x$bk1cmpnjgut$,
  $bk1cmpnjgvb$cmpnjgvbh001h1ymxexc9z235$bk1cmpnjgvb$,
  $bk1cmq0g7h4$cmq0g7h4y003d1y4fwwod5dxx$bk1cmq0g7h4$,
  $bk1cmq0g7j1$cmq0g7j1y003r1y4fdkx9d6li$bk1cmq0g7j1$,
  $bk1cmq0g7ji$cmq0g7jii003x1y4fyfbe2x4l$bk1cmq0g7ji$,
  $bk1cmr31dl6$cmr31dl6c00byjs040ruov63z$bk1cmr31dl6$,
  $bk1cmr8ei0q$cmr8ei0qn009h1yazkmaq70tl$bk1cmr8ei0q$,
  $bk1cmrtqfzd$cmrtqfzd2000a1yx3faa1fkgt$bk1cmrtqfzd$,
  $bk1d0b6cf68$d0b6cf68-ae01-45f0-9ab4-74a1ce40c9aa$bk1d0b6cf68$,
  $bk1d0e067cd$d0e067cd-ac06-421d-9bee-2ab838a9c49f$bk1d0e067cd$,
  $bk1d238f2c0$d238f2c0-bbb5-4ea5-ba35-593806c8b0c4$bk1d238f2c0$,
  $bk1d531a34b$d531a34b-d3fc-462c-8214-973704925fc7$bk1d531a34b$,
  $bk1d64ef91e$d64ef91e-9819-4848-9ba0-87e38277dd89$bk1d64ef91e$,
  $bk1d7a70b9b$d7a70b9b-fd8a-4ec1-9d43-c2334d3361b3$bk1d7a70b9b$,
  $bk1db5619cd$db5619cd-19d5-426c-92d9-85e3970c3df0$bk1db5619cd$,
  $bk1dbedcb46$dbedcb46-beb3-4cf1-a44f-b5b74243f9f6$bk1dbedcb46$,
  $bk1dd58d8cb$dd58d8cb-ea88-41b8-866f-96eb49427d2d$bk1dd58d8cb$,
  $bk1e0410828$e0410828-751f-403f-979e-e55ed7b00e45$bk1e0410828$,
  $bk1e0f2a732$e0f2a732-5907-4d2b-a7e8-63201ca31ad4$bk1e0f2a732$,
  $bk1e1919953$e1919953-1172-456a-9f0b-540af9effddf$bk1e1919953$,
  $bk1e49fb49d$e49fb49d-2d27-4b82-b5ad-60c32a7ed4f6$bk1e49fb49d$,
  $bk1e5cbd906$e5cbd906-f392-46b4-b433-bd5e5d1e2ad9$bk1e5cbd906$,
  $bk1e8efaeac$e8efaeac-909b-456d-885b-d2c5bf85bad4$bk1e8efaeac$,
  $bk1e9203c84$e9203c84-2459-49fe-80b3-949a64966c4e$bk1e9203c84$,
  $bk1eb3f3819$eb3f3819-4aa8-4909-96cc-36b4f8bf3ce3$bk1eb3f3819$,
  $bk1ee7731ec$ee7731ec-64fa-478b-8159-29efa4af4a2b$bk1ee7731ec$,
  $bk1f01cff07$f01cff07-240b-4bcb-8706-edea86d2ceba$bk1f01cff07$,
  $bk1f120c920$f120c920-f557-4fda-b88f-d1904f327941$bk1f120c920$,
  $bk1f129eaf0$f129eaf0-0ba6-42d0-ad20-6f22d0cc6d08$bk1f129eaf0$,
  $bk1f18f72f8$f18f72f8-e945-4d1e-86a6-5478758c92f5$bk1f18f72f8$,
  $bk1f1bde1bb$f1bde1bb-e40b-45c6-bf83-b49976bb3fee$bk1f1bde1bb$,
  $bk1f3786dbb$f3786dbb-bf1d-420b-b22f-3229cf3c7e97$bk1f3786dbb$,
  $bk1f3c1a999$f3c1a999-876b-45f7-b07e-dec8ae1ffa9c$bk1f3c1a999$,
  $bk1f46f115d$f46f115d-9dfa-421e-9f1e-7469b8ea99a9$bk1f46f115d$,
  $bk1f49fe138$f49fe138-c74c-4808-8759-622eff105ee2$bk1f49fe138$,
  $bk1f8440e4a$f8440e4a-64d1-46cc-a33c-63047dbdd805$bk1f8440e4a$,
  $bk1f89dcd8c$f89dcd8c-8248-46f6-b8dc-fbd399f3d685$bk1f89dcd8c$,
  $bk1fdaa5f15$fdaa5f15-30a9-4644-9f45-ffc0892f6df5$bk1fdaa5f15$
);

DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b1_backup) <> 186 THEN
    RAISE EXCEPTION 'backup row count %, expected 186', (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b1_backup);
  END IF;
END
$check$;

INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_0id$042c3da6-6d2e-4e4f-9e55-2e580e2f3c85$s1_0id$,
  $s1_0st$usmle-step-1$s1_0st$,
  1,
  $s1_0oo${"options": ["Medium muscular arteries, fibrinoid necrosis and aneurysms, associated with hepatitis B, ANCA-negative, lungs spared", "Small vessels with PR3-ANCA and granulomas", "The aorta, as in giant-cell arteritis of a young man", "Capillaries only, with linear IgG", "Hepatitis B is unrelated to this vasculitis"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Polyarteritis nodosa", "kind": "vignette"}$s1_0oo$,
  $s1_0no${"options": ["Medium muscular arteries; this vasculitis is ANCA-negative", "Small vessels with PR3-ANCA and necrotizing granulomas in the lung", "The aorta, as in giant-cell arteritis of a young man with headache", "Capillaries only, with linear IgG along the glomerular basement membrane", "Hepatitis B is unrelated to this vasculitis and does not set the vessel caliber"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Polyarteritis nodosa", "kind": "vignette"}$s1_0no$,
  $s1_0oc$Medium muscular arteries, fibrinoid necrosis and aneurysms, associated with hepatitis B, ANCA-negative, lungs spared$s1_0oc$,
  $s1_0nc$Medium muscular arteries; this vasculitis is ANCA-negative$s1_0nc$,
  $s1_0oe$Polyarteritis nodosa is a medium-vessel necrotizing arteritis. Hepatitis B is the classic association. It spares the pulmonary arteries, hits nerve, gut, and kidney as infarcts rather than glomerulonephritis, and ANCA is negative. GPA is small-vessel, ANCA-positive, and involves the lung and sinus. Giant-cell arteritis is older adults and the aorta and its branches. Linear IgG is anti-GBM disease. Hepatitis B is part of the classic story.$s1_0oe$,
  $s1_0ne$Polyarteritis nodosa is a medium-vessel necrotizing arteritis. Hepatitis B is the classic association. It spares the pulmonary arteries, hits nerve, gut, and kidney as infarcts rather than glomerulonephritis, and ANCA is negative. GPA is small-vessel, ANCA-positive, and involves the lung and sinus. Giant-cell arteritis is older adults and the aorta and its branches. Linear IgG is anti-GBM disease. Hepatitis B is part of the classic story.$s1_0ne$,
  116, 52, 58, 79,
  2.230769, 0.734177
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_1id$067a38a4-c3f6-4ed0-a206-7eafd92d3e49$s1_1id$,
  $s1_1st$usmle-step-1$s1_1st$,
  1,
  $s1_1oo${"options": ["46,XX; excess adrenal androgens from 21-hydroxylase deficiency virilized a genetic female, and salt wasting shows aldosterone also failed", "46,XY with androgen insensitivity, which virilizes the external genitalia", "46,XX with aromatase excess, which makes androgens", "46,XY with 5-alpha reductase deficiency, which causes salt wasting", "A high 17-hydroxyprogesterone means an ovarian tumor in a neonate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Congenital adrenal rest", "kind": "vignette"}$s1_1oo$,
  $s1_1no${"options": ["46,XX; 21-hydroxylase deficiency virilized a genetic female and also failed aldosterone", "46,XY with androgen insensitivity, which virilizes the external genitalia and wastes salt", "46,XX with aromatase excess, which makes androgens and causes a salt-wasting crisis", "46,XY with 5-alpha reductase deficiency, which causes salt wasting from birth", "A high 17-hydroxyprogesterone means an ovarian androgen tumor in a neonate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Congenital adrenal rest", "kind": "vignette"}$s1_1no$,
  $s1_1oc$46,XX; excess adrenal androgens from 21-hydroxylase deficiency virilized a genetic female, and salt wasting shows aldosterone also failed$s1_1oc$,
  $s1_1nc$46,XX; 21-hydroxylase deficiency virilized a genetic female and also failed aldosterone$s1_1nc$,
  $s1_1oe$A genetic female exposed to adrenal androgens in utero is virilized, and a sky-high 17-hydroxyprogesterone is 21-hydroxylase deficiency. Salt wasting and hyperkalemia mean the aldosterone path failed too. Androgen insensitivity is an XY baby who looks female, the opposite ambiguity. Aromatase excess would push toward estrogen. 5-alpha reductase deficiency is an under-virilized XY infant and does not waste salt. Neonates do not present with ovarian tumors that make this marker.$s1_1oe$,
  $s1_1ne$A genetic female exposed to adrenal androgens in utero is virilized, and a sky-high 17-hydroxyprogesterone is 21-hydroxylase deficiency. Salt wasting and hyperkalemia mean the aldosterone path failed too. Androgen insensitivity is an XY baby who looks female, the opposite ambiguity. Aromatase excess would push toward estrogen. 5-alpha reductase deficiency is an under-virilized XY infant and does not waste salt. Neonates do not present with ovarian tumors that make this marker.$s1_1ne$,
  137, 73, 87, 89,
  1.876712, 0.977528
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_2id$070584d7-f672-4dfc-8cb9-cd5578c35a44$s1_2id$,
  $s1_2st$usmle-step-1$s1_2st$,
  1,
  $s1_2oo${"options": ["A is fat embolism with the rash and neurologic change; C is amniotic-fluid embolism with a consumptive picture around delivery; B is the thrombus", "All three are thrombus because all cause dyspnea", "Fat embolism is a cholesterol crystal from an atherosclerotic plaque", "Amniotic embolism is a clot from the calf", "The chest film is always abnormal in pulmonary thromboembolism"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Embolus types", "kind": "vignette"}$s1_2oo$,
  $s1_2no${"options": ["A is fat embolism (rash, neurologic change); C is amniotic-fluid embolism (consumptive, peripartum)", "All three are thrombus because all cause dyspnea and hypoxemia", "Fat embolism is a cholesterol crystal shed from an atherosclerotic plaque, with livedo and urinary eosinophils", "Amniotic embolism is a clot from the calf that embolizes after delivery", "The chest film is always abnormal in pulmonary thromboembolism"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Embolus types", "kind": "vignette"}$s1_2no$,
  $s1_2oc$A is fat embolism with the rash and neurologic change; C is amniotic-fluid embolism with a consumptive picture around delivery; B is the thrombus$s1_2oc$,
  $s1_2nc$A is fat embolism (rash, neurologic change); C is amniotic-fluid embolism (consumptive, peripartum)$s1_2nc$,
  $s1_2oe$Fat embolism after a long-bone fracture sends marrow fat to the lung and brain and causes a petechial rash. Amniotic-fluid embolism is a peripartum catastrophe of sudden hypoxia, seizure or collapse, and often DIC. Venous thrombus from the leg is the classic pulmonary embolus, and the film is often normal. Dyspnea does not make them the same. Atherosclerotic cholesterol emboli follow a procedure on an artery and infarct toes and kidneys, with eosinophils. Amniotic fluid is not a calf clot. A normal film does not exclude thromboembolism.$s1_2oe$,
  $s1_2ne$Fat embolism after a long-bone fracture sends marrow fat to the lung and brain and causes a petechial rash. Amniotic-fluid embolism is a peripartum catastrophe of sudden hypoxia, seizure or collapse, and often DIC. Venous thrombus from the leg is the classic pulmonary embolus, and the film is often normal. Dyspnea does not make them the same. Atherosclerotic cholesterol emboli follow a procedure on an artery and infarct toes and kidneys, with eosinophils. Amniotic fluid is not a calf clot. A normal film does not exclude thromboembolism.$s1_2ne$,
  145, 68, 99, 110,
  2.132353, 0.900000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_3id$08625916-6c07-498d-a199-a4115492fb72$s1_3id$,
  $s1_3st$usmle-step-1$s1_3st$,
  1,
  $s1_3oo${"options": ["Left lateral corticospinal and left dorsal columns at T8, plus right spinothalamic fibers that crossed a level or two below entry", "Right motor cortex, because weakness is always contralateral to the lesion", "A complete cord transection, with spinal shock explaining the asymmetry", "Left spinothalamic tract only, because pain loss is the localizing sign", "Right dorsal columns, because proprioception loss is contralateral in the cord"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Spinal cord hemisection", "kind": "vignette"}$s1_3oo$,
  $s1_3no${"options": ["Left lateral corticospinal and left dorsal columns at T8, plus right spinothalamic fibers that already crossed", "Right motor cortex, because weakness is always contralateral to the lesion", "A complete cord transection at T8, with spinal shock explaining the mismatch of pain and proprioception", "Left spinothalamic tract only, because pain loss is the localizing sign", "Right dorsal columns, because proprioception loss is contralateral in the cord"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Spinal cord hemisection", "kind": "vignette"}$s1_3no$,
  $s1_3oc$Left lateral corticospinal and left dorsal columns at T8, plus right spinothalamic fibers that crossed a level or two below entry$s1_3oc$,
  $s1_3nc$Left lateral corticospinal and left dorsal columns at T8, plus right spinothalamic fibers that already crossed$s1_3nc$,
  $s1_3oe$Hemisection hits the already-crossed lateral corticospinal tract and the uncrossed dorsal columns on the same side, so motor and vibration loss are ipsilateral. Spinothalamic fibers cross in the anterior white commissure within one or two segments of entry, so pain and temperature loss is contralateral and begins slightly below the lesion. Right motor cortex is the trap if you apply the brainstem crossing rule inside the cord; the corticospinal tract has already crossed in the medulla. A complete transection would weaken both legs and wipe sensation on both sides. Left spinothalamic damage alone would not cause ipsilateral paralysis or dorsal-column loss. Dorsal-column fibers do not cross until the medulla, so proprioceptive loss is ipsilateral, not right-sided.$s1_3oe$,
  $s1_3ne$Hemisection hits the already-crossed lateral corticospinal tract and the uncrossed dorsal columns on the same side, so motor and vibration loss are ipsilateral. Spinothalamic fibers cross in the anterior white commissure within one or two segments of entry, so pain and temperature loss is contralateral and begins slightly below the lesion. Right motor cortex is the trap if you apply the brainstem crossing rule inside the cord; the corticospinal tract has already crossed in the medulla. A complete transection would weaken both legs and wipe sensation on both sides. Left spinothalamic damage alone would not cause ipsilateral paralysis or dorsal-column loss. Dorsal-column fibers do not cross until the medulla, so proprioceptive loss is ipsilateral, not right-sided.$s1_3ne$,
  129, 78, 110, 103,
  1.653846, 1.067961
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_4id$09c036db-f34d-4fa5-a49f-a28e135818d2$s1_4id$,
  $s1_4st$usmle-step-1$s1_4st$,
  1,
  $s1_4oo${"options": ["Protein C, a short-half-life anticoagulant, falls before the longer-lived procoagulant factors, so warfarin is briefly prothrombotic", "Warfarin inhibits platelet COX the way aspirin does", "Necrosis means the dose is too low and should be doubled", "Protein C excess causes the necrosis", "Heparin bridge increases the risk of this necrosis"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Warfarin necrosis", "kind": "vignette"}$s1_4oo$,
  $s1_4no${"options": ["Protein C falls before longer-lived clotting factors, so warfarin is briefly prothrombotic", "Warfarin inhibits platelet COX the way aspirin does, and dermal vessels then thrombose", "Necrosis means the dose is too low and should be doubled to restore anticoagulation", "Protein C excess causes the necrosis by over-anticoagulating the skin", "A heparin bridge increases the risk of this necrosis by depleting antithrombin"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Warfarin necrosis", "kind": "vignette"}$s1_4no$,
  $s1_4oc$Protein C, a short-half-life anticoagulant, falls before the longer-lived procoagulant factors, so warfarin is briefly prothrombotic$s1_4oc$,
  $s1_4nc$Protein C falls before longer-lived clotting factors, so warfarin is briefly prothrombotic$s1_4nc$,
  $s1_4oe$Warfarin blocks vitamin K-dependent gamma carboxylation of factors II, VII, IX, X and of proteins C and S. Protein C disappears first. For a few days the patient is hypercoagulable, especially if protein C was already low, and dermal vessels thrombose. A subtherapeutic INR does not mean the drug is inactive. Warfarin is not an antiplatelet COX inhibitor. Raising the dose worsens the imbalance. The problem is too little protein C, not too much. Bridging with heparin covers this window; it does not cause the necrosis.$s1_4oe$,
  $s1_4ne$Warfarin blocks vitamin K-dependent gamma carboxylation of factors II, VII, IX, X and of proteins C and S. Protein C disappears first. For a few days the patient is hypercoagulable, especially if protein C was already low, and dermal vessels thrombose. A subtherapeutic INR does not mean the drug is inactive. Warfarin is not an antiplatelet COX inhibitor. Raising the dose worsens the imbalance. The problem is too little protein C, not too much. Bridging with heparin covers this window; it does not cause the necrosis.$s1_4ne$,
  132, 56, 90, 86,
  2.357143, 1.046512
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_5id$0a68a14b-fe8c-4a6c-92b6-80bfc8203e67$s1_5id$,
  $s1_5st$usmle-step-1$s1_5st$,
  1,
  $s1_5oo${"options": ["Heberden nodes at the DIP and Bouchard nodes at the PIP are osteoarthritis; MCP disease would suggest an inflammatory arthritis", "Ulnar deviation is the osteoarthritis pattern", "Anti-CCP should be positive in DIP disease", "The first CMC joint is spared in osteoarthritis", "Minutes of stiffness mean rheumatoid arthritis"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteoarthritis Bouchard", "kind": "vignette"}$s1_5oo$,
  $s1_5no${"options": ["Heberden nodes at the DIPs are osteoarthritis; spared MCPs weigh against inflammatory arthritis", "Ulnar deviation at the MCPs is the osteoarthritis pattern", "Anti-CCP should be positive when the DIP joints are the ones involved", "The first carpometacarpal joint is spared in hand osteoarthritis", "Minutes of morning stiffness mean rheumatoid arthritis even when the MCPs and wrists are quiet"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteoarthritis Bouchard", "kind": "vignette"}$s1_5no$,
  $s1_5oc$Heberden nodes at the DIP and Bouchard nodes at the PIP are osteoarthritis; MCP disease would suggest an inflammatory arthritis$s1_5oc$,
  $s1_5nc$Heberden nodes at the DIPs are osteoarthritis; spared MCPs weigh against inflammatory arthritis$s1_5nc$,
  $s1_5oe$Osteoarthritis nodes are Heberden at the DIP and Bouchard at the PIP, and the base of the thumb is a classic site. MCPs are spared, which is the opposite of rheumatoid arthritis, where MCPs and PIPs dominate and DIPs are spared. Ulnar deviation is a rheumatoid deformity. Anti-CCP belongs to rheumatoid arthritis. The first CMC is involved, not spared. Brief stiffness is mechanical.$s1_5oe$,
  $s1_5ne$Osteoarthritis nodes are Heberden at the DIP and Bouchard at the PIP, and the base of the thumb is a classic site. MCPs are spared, which is the opposite of rheumatoid arthritis, where MCPs and PIPs dominate and DIPs are spared. Ulnar deviation is a rheumatoid deformity. Anti-CCP belongs to rheumatoid arthritis. The first CMC is involved, not spared. Brief stiffness is mechanical.$s1_5ne$,
  127, 47, 95, 94,
  2.702128, 1.010638
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_6id$0bcfe054-db74-41b5-9b36-7f064db70746$s1_6id$,
  $s1_6st$usmle-step-1$s1_6st$,
  1,
  $s1_6oo${"options": ["The pearly lesion is basal cell carcinoma; the keratin-pearl ulcer is squamous cell carcinoma, which can metastasize", "Both metastasize early to regional nodes as their usual course", "Keratin pearls define basal cell carcinoma", "A pearly rolled border is melanoma", "Sun exposure protects against both"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Skin squamous versus basal", "kind": "vignette"}$s1_6oo$,
  $s1_6no${"options": ["The pearly lesion is basal cell carcinoma: locally destructive, and it rarely metastasizes", "Both metastasize early to regional nodes as their usual course", "Keratin pearls define basal cell carcinoma and predict early spread into regional nodes", "A pearly rolled border is melanoma and marks a lesion that stays local", "Sun exposure protects against both of these epidermal cancers"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Skin squamous versus basal", "kind": "vignette"}$s1_6no$,
  $s1_6oc$The pearly lesion is basal cell carcinoma; the keratin-pearl ulcer is squamous cell carcinoma, which can metastasize$s1_6oc$,
  $s1_6nc$The pearly lesion is basal cell carcinoma: locally destructive, and it rarely metastasizes$s1_6nc$,
  $s1_6oe$Basal cell carcinoma is the most common skin cancer, pearly with telangiectasias, and it invades locally, rarely metastasizing. Squamous cell carcinoma makes keratin pearls, can arise in sun-damaged skin or scars, and does metastasize. Melanoma is a pigmented, ABCDE lesion of melanocytes, not these two. Keratin pearls are squamous. A rolled pearly border is basal cell. Ultraviolet light is the shared risk, not a protection.$s1_6oe$,
  $s1_6ne$Basal cell carcinoma is the most common skin cancer, pearly with telangiectasias, and it invades locally, rarely metastasizing. Squamous cell carcinoma makes keratin pearls, can arise in sun-damaged skin or scars, and does metastasize. Melanoma is a pigmented, ABCDE lesion of melanocytes, not these two. Keratin pearls are squamous. A rolled pearly border is basal cell. Ultraviolet light is the shared risk, not a protection.$s1_6ne$,
  116, 62, 90, 87,
  1.870968, 1.034483
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_7id$0c6ff7d1-2eed-4949-88c6-ca84293932e4$s1_7id$,
  $s1_7st$usmle-step-1$s1_7st$,
  1,
  $s1_7oo${"options": ["ATM kinase, which answers double-strand breaks, is missing; telangiectasias, immunodeficiency, and a high AFP come with the cerebellar ataxia", "Frataxin is missing, so AFP is high and telangiectasias are required", "The disease is pure motor and DNA repair is normal", "Immunoglobulins are high", "Radiation is the safest imaging because the cells repair breaks well"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Ataxia telangiectasia", "kind": "vignette"}$s1_7oo$,
  $s1_7no${"options": ["ATM is missing, so double-strand breaks go unrepaired; telangiectasias and high AFP come with the ataxia", "Frataxin is missing, so AFP is high, telangiectasias are required, and the cells are sensitive to radiation", "The disease is pure motor, and DNA repair is normal in the cerebellum", "Immunoglobulins are high, which explains the infections and the elevated AFP", "Radiation is the safest imaging because the cells repair double-strand breaks well"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Ataxia telangiectasia", "kind": "vignette"}$s1_7no$,
  $s1_7oc$ATM kinase, which answers double-strand breaks, is missing; telangiectasias, immunodeficiency, and a high AFP come with the cerebellar ataxia$s1_7oc$,
  $s1_7nc$ATM is missing, so double-strand breaks go unrepaired; telangiectasias and high AFP come with the ataxia$s1_7nc$,
  $s1_7oe$Ataxia-telangiectasia is ATM. Double-strand breaks are not signaled, so radiation and radiomimetic drugs are dangerous, IgA is often low, sinopulmonary infections occur, AFP is high, and the cerebellum fails. Friedreich ataxia is frataxin, dorsal columns, and cardiomyopathy, without telangiectasias or a high AFP. Repair is not intact. Immunoglobulins are low, not high. Radiation is exactly what these cells handle badly.$s1_7oe$,
  $s1_7ne$Ataxia-telangiectasia is ATM. Double-strand breaks are not signaled, so radiation and radiomimetic drugs are dangerous, IgA is often low, sinopulmonary infections occur, AFP is high, and the cerebellum fails. Friedreich ataxia is frataxin, dorsal columns, and cardiomyopathy, without telangiectasias or a high AFP. Repair is not intact. Immunoglobulins are low, not high. Radiation is exactly what these cells handle badly.$s1_7ne$,
  141, 68, 104, 107,
  2.073529, 0.971963
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_8id$0cef6fda-ab8b-459a-b865-1cb115605918$s1_8id$,
  $s1_8st$usmle-step-1$s1_8st$,
  1,
  $s1_8oo${"options": ["Nitrates donate nitric oxide, which raises cGMP, and sildenafil stops PDE-5 from breaking cGMP down, so vasodilation is extreme", "Sildenafil blocks nitric oxide synthase, so nitrates cannot work", "The combination raises blood pressure", "PDE-5 inhibition lowers cGMP", "Alpha blockade is the mechanism of sildenafil"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sildenafil nitrates", "kind": "vignette"}$s1_8oo$,
  $s1_8no${"options": ["Nitrates raise cGMP through nitric oxide, and sildenafil blocks PDE-5 from clearing it", "Sildenafil blocks nitric oxide synthase, so nitrates cannot generate cGMP", "The combination raises blood pressure by constricting arteriolar smooth muscle", "PDE-5 inhibition lowers cGMP and blunts the nitrate effect on vessels", "Alpha blockade is the mechanism of sildenafil when combined with a nitrate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sildenafil nitrates", "kind": "vignette"}$s1_8no$,
  $s1_8oc$Nitrates donate nitric oxide, which raises cGMP, and sildenafil stops PDE-5 from breaking cGMP down, so vasodilation is extreme$s1_8oc$,
  $s1_8nc$Nitrates raise cGMP through nitric oxide, and sildenafil blocks PDE-5 from clearing it$s1_8nc$,
  $s1_8oe$Erection and vascular smooth-muscle relaxation use nitric oxide, guanylate cyclase, and cGMP. Sildenafil inhibits PDE-5, so cGMP lasts. A nitrate floods the system with NO and more cGMP. Together the vessels dilate and pressure falls. Sildenafil does not block NO synthase. The combination causes hypotension, not hypertension. PDE-5 inhibition raises, not lowers, cGMP. Sildenafil is not an alpha blocker.$s1_8oe$,
  $s1_8ne$Erection and vascular smooth-muscle relaxation use nitric oxide, guanylate cyclase, and cGMP. Sildenafil inhibits PDE-5, so cGMP lasts. A nitrate floods the system with NO and more cGMP. Together the vessels dilate and pressure falls. Sildenafil does not block NO synthase. The combination causes hypotension, not hypertension. PDE-5 inhibition raises, not lowers, cGMP. Sildenafil is not an alpha blocker.$s1_8ne$,
  127, 64, 86, 78,
  1.984375, 1.102564
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_9id$0e0ee07d-4dd5-4d60-849b-bad42062938d$s1_9id$,
  $s1_9st$usmle-step-1$s1_9st$,
  1,
  $s1_9oo${"options": ["They bind hydroxyapatite and kill osteoclasts, so turnover falls; esophageal irritation is why she stays upright, and long use rarely causes osteonecrosis of the jaw and atypical fractures because bone becomes too quiet", "Bisphosphonates activate osteoclasts, which is why the jaw dies", "They can be swallowed lying down because they are not acidic to the esophagus", "Atypical femoral fractures mean the dose is too low", "Osteonecrosis of the jaw is the expected effect of a two-week course"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Bisphosphonate adverse effects", "kind": "vignette"}$s1_9oo$,
  $s1_9no${"options": ["They bind hydroxyapatite and suppress osteoclasts; upright dosing avoids esophageal irritation", "Bisphosphonates activate osteoclasts, which is why jaw osteonecrosis follows even a short course", "They can be swallowed lying down because they do not irritate the esophagus", "Atypical femoral fractures mean the dose is too low to suppress bone turnover", "Osteonecrosis of the jaw is the expected effect of a two-week course"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Bisphosphonate adverse effects", "kind": "vignette"}$s1_9no$,
  $s1_9oc$They bind hydroxyapatite and kill osteoclasts, so turnover falls; esophageal irritation is why she stays upright, and long use rarely causes osteonecrosis of the jaw and atypical fractures because bone becomes too quiet$s1_9oc$,
  $s1_9nc$They bind hydroxyapatite and suppress osteoclasts; upright dosing avoids esophageal irritation$s1_9nc$,
  $s1_9oe$Bisphosphonates stop osteoclasts. Bone density rises because resorption falls, not because a burst of healthy formation occurs. The pill can ulcerate the esophagus, so she stays up and takes it on an empty stomach. Years of potent drug, especially IV, plus a dental extraction, is the jaw osteonecrosis setting. Suppressed turnover is also why an atypical femur fracture, a stress fracture of too-quiet bone, occurs. They do not activate osteoclasts. Lying down is exactly the wrong instruction. An atypical fracture is over-suppression, not under-dosing. Jaw osteonecrosis is rare and late, not a two-week effect.$s1_9oe$,
  $s1_9ne$Bisphosphonates stop osteoclasts. Bone density rises because resorption falls, not because a burst of healthy formation occurs. The pill can ulcerate the esophagus, so she stays up and takes it on an empty stomach. Years of potent drug, especially IV, plus a dental extraction, is the jaw osteonecrosis setting. Suppressed turnover is also why an atypical femur fracture, a stress fracture of too-quiet bone, occurs. They do not activate osteoclasts. Lying down is exactly the wrong instruction. An atypical fracture is over-suppression, not under-dosing. Jaw osteonecrosis is rare and late, not a two-week effect.$s1_9ne$,
  219, 77, 94, 96,
  2.844156, 0.979167
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_10id$0ef74b4a-3e30-43ff-8b57-73a3af91015b$s1_10id$,
  $s1_10st$usmle-step-1$s1_10st$,
  1,
  $s1_10oo${"options": ["Sertoli cells make inhibin, which restrains FSH, and anti-Müllerian hormone, which regresses the uterus anlage; testosterone from Leydig cells keeps the wolffian duct", "Leydig cells make AMH and inhibin", "Testosterone regresses the Müllerian duct", "Inhibin raises FSH", "AMH is an ovarian hormone only, so a male fetus does not make it"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Inhibin and AMH", "kind": "vignette"}$s1_10oo$,
  $s1_10no${"options": ["Sertoli cells make inhibin to restrain FSH and anti-Müllerian hormone to regress the Müllerian duct", "Leydig cells are the source of both AMH and inhibin, and those two hormones regress the Müllerian duct", "Testosterone regresses the Müllerian duct and is the hormone that restrains FSH", "Inhibin raises FSH, and anti-Müllerian hormone preserves the Müllerian duct", "AMH is an ovarian hormone only, so a male fetus does not make it"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Inhibin and AMH", "kind": "vignette"}$s1_10no$,
  $s1_10oc$Sertoli cells make inhibin, which restrains FSH, and anti-Müllerian hormone, which regresses the uterus anlage; testosterone from Leydig cells keeps the wolffian duct$s1_10oc$,
  $s1_10nc$Sertoli cells make inhibin to restrain FSH and anti-Müllerian hormone to regress the Müllerian duct$s1_10nc$,
  $s1_10oe$Sertoli cells do the two jobs she gave to testosterone. Inhibin selectively feeds back on FSH. AMH, also from Sertoli cells, removes Müllerian structures. Testosterone and DHT build and keep wolffian ducts and external male genitalia; they do not remove the Müllerian duct. Inhibin lowers FSH, it does not raise it. Male fetuses make AMH; that is how they avoid a uterus. Absent Sertoli function would leave Müllerian structures and raise FSH.$s1_10oe$,
  $s1_10ne$Sertoli cells do the two jobs she gave to testosterone. Inhibin selectively feeds back on FSH. AMH, also from Sertoli cells, removes Müllerian structures. Testosterone and DHT build and keep wolffian ducts and external male genitalia; they do not remove the Müllerian duct. Inhibin lowers FSH, it does not raise it. Male fetuses make AMH; that is how they avoid a uterus. Absent Sertoli function would leave Müllerian structures and raise FSH.$s1_10ne$,
  166, 64, 99, 102,
  2.593750, 0.970588
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_11id$0fa4bc05-0226-4d17-a3ea-37c58331716e$s1_11id$,
  $s1_11st$usmle-step-1$s1_11st$,
  1,
  $s1_11oo${"options": ["Preformed ABO IgM fixes complement and lyses donor cells intravascularly; the unit is stopped because this is hemolysis, not a trivial cytokine fever", "The reaction is allergic urticaria, so slowing the rate is enough", "TRALI is the cause whenever urine turns dark", "IgA deficiency causes this back pain and hemoglobinuria", "A febrile nonhemolytic reaction drops haptoglobin and causes oozing"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Acute hemolytic transfusion", "kind": "vignette"}$s1_11oo$,
  $s1_11no${"options": ["Preformed ABO IgM fixes complement and lyses donor cells; stop the unit because this is hemolysis", "The reaction is allergic urticaria, so slowing the rate is enough to finish the unit", "TRALI is the cause whenever urine turns dark and the patient has back pain", "IgA deficiency causes this back pain and hemoglobinuria during transfusion", "A febrile nonhemolytic reaction drops haptoglobin and causes oozing at puncture sites"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Acute hemolytic transfusion", "kind": "vignette"}$s1_11no$,
  $s1_11oc$Preformed ABO IgM fixes complement and lyses donor cells intravascularly; the unit is stopped because this is hemolysis, not a trivial cytokine fever$s1_11oc$,
  $s1_11nc$Preformed ABO IgM fixes complement and lyses donor cells; stop the unit because this is hemolysis$s1_11nc$,
  $s1_11oe$ABO incompatibility is type II intravascular hemolysis from complement-fixing IgM. Fever, flank pain, hemoglobinuria, and coagulopathy mean the transfusion stops immediately and the identity is rechecked. A simple allergic reaction is hives without dark urine. TRALI is noncardiogenic pulmonary edema, not hemoglobinuria. IgA deficiency causes anaphylaxis when IgA in plasma is given, not this hemolytic picture. A febrile nonhemolytic reaction is cytokine-mediated, the Coombs test stays negative, and it does not lyse cells or start DIC.$s1_11oe$,
  $s1_11ne$ABO incompatibility is type II intravascular hemolysis from complement-fixing IgM. Fever, flank pain, hemoglobinuria, and coagulopathy mean the transfusion stops immediately and the identity is rechecked. A simple allergic reaction is hives without dark urine. TRALI is noncardiogenic pulmonary edema, not hemoglobinuria. IgA deficiency causes anaphylaxis when IgA in plasma is given, not this hemolytic picture. A febrile nonhemolytic reaction is cytokine-mediated, the Coombs test stays negative, and it does not lyse cells or start DIC.$s1_11ne$,
  149, 67, 97, 85,
  2.223881, 1.141176
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_12id$12036061-94d7-40d5-b7c3-1a9870b41d6f$s1_12id$,
  $s1_12st$usmle-step-1$s1_12st$,
  1,
  $s1_12oo${"options": ["Cortico-striato-thalamo-cortical loops; benzodiazepines do not treat the obsession-compulsion cycle the way serotonin reuptake inhibition and exposure do", "The mesolimbic dopamine tract only, so an antipsychotic is the sole first-line drug", "The cerebellum, because rituals are a coordination problem", "A seizure focus, so ethosuximide is first-line", "Handwashing proves psychosis, so insight is impossible and serotonin drugs are contraindicated"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "OCD circuit", "kind": "vignette"}$s1_12oo$,
  $s1_12no${"options": ["Cortico-striato-thalamo-cortical loops; benzodiazepines do not treat the obsession-compulsion cycle", "The mesolimbic dopamine tract only, so an antipsychotic is the sole first-line drug", "The cerebellum, because rituals are a learned coordination problem", "A seizure focus in the frontal lobe, so ethosuximide is first-line", "Handwashing proves psychosis, so insight is impossible and serotonin drugs are contraindicated"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "OCD circuit", "kind": "vignette"}$s1_12no$,
  $s1_12oc$Cortico-striato-thalamo-cortical loops; benzodiazepines do not treat the obsession-compulsion cycle the way serotonin reuptake inhibition and exposure do$s1_12oc$,
  $s1_12nc$Cortico-striato-thalamo-cortical loops; benzodiazepines do not treat the obsession-compulsion cycle$s1_12nc$,
  $s1_12oe$OCD is tied to overactive cortico-striato-thalamo-cortical circuits. Patients usually have insight, which separates the illness from a delusion. High-dose SSRIs and exposure with response prevention are the treatments with a real effect. A benzodiazepine may relax him and does not stop the ritual loop, which is why it failed. Dopamine blockade is not the first-line monotherapy implied by calling it purely mesolimbic. The cerebellum does not generate obsessions. Ethosuximide is for absence seizures. Insight is present here, so this is not psychosis and an SSRI is not contraindicated.$s1_12oe$,
  $s1_12ne$OCD is tied to overactive cortico-striato-thalamo-cortical circuits. Patients usually have insight, which separates the illness from a delusion. High-dose SSRIs and exposure with response prevention are the treatments with a real effect. A benzodiazepine may relax him and does not stop the ritual loop, which is why it failed. Dopamine blockade is not the first-line monotherapy implied by calling it purely mesolimbic. The cerebellum does not generate obsessions. Ethosuximide is for absence seizures. Insight is present here, so this is not psychosis and an SSRI is not contraindicated.$s1_12ne$,
  153, 94, 99, 94,
  1.627660, 1.053191
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_13id$141e1809-4886-47f6-b7ac-a5aa9d8d3d65$s1_13id$,
  $s1_13st$usmle-step-1$s1_13st$,
  1,
  $s1_13oo${"options": ["WASP, which links receptors to the actin cytoskeleton, is gone; platelets are small, and the triad is eczema, microthrombocytopenia, and infections", "Platelets are giant and the gene is autosomal", "IgM is high and IgE is low", "The disease is pure B-cell failure without a bleeding problem", "A healthy maternal uncle would be the expected family pattern"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Wiskott-Aldrich", "kind": "vignette"}$s1_13oo$,
  $s1_13no${"options": ["WASP, which links receptors to actin, is gone; the platelets are small", "Platelets are giant, the inheritance is autosomal, and cytoskeletal signaling is intact", "IgM is high and IgE is low, and the platelets are normal in size", "The disease is pure B-cell failure without a bleeding problem", "A healthy maternal uncle would be the expected family pattern"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Wiskott-Aldrich", "kind": "vignette"}$s1_13no$,
  $s1_13oc$WASP, which links receptors to the actin cytoskeleton, is gone; platelets are small, and the triad is eczema, microthrombocytopenia, and infections$s1_13oc$,
  $s1_13nc$WASP, which links receptors to actin, is gone; the platelets are small$s1_13nc$,
  $s1_13oe$Wiskott-Aldrich is X-linked WASP. Actin remodeling fails in immune synapses and platelets. The classic triad is eczema, thrombocytopenia with small platelets, and infections, with low IgM and high IgA and IgE, and a risk of lymphoma. Bernard-Soulier platelets are giant. IgM is low, not high. Bleeding is part of the disease, not absent. Diseased uncles on the mother's side fit X-linkage; a healthy one would not be the teaching family.$s1_13oe$,
  $s1_13ne$Wiskott-Aldrich is X-linked WASP. Actin remodeling fails in immune synapses and platelets. The classic triad is eczema, thrombocytopenia with small platelets, and infections, with low IgM and high IgA and IgE, and a risk of lymphoma. Bernard-Soulier platelets are giant. IgM is low, not high. Bleeding is part of the disease, not absent. Diseased uncles on the mother's side fit X-linkage; a healthy one would not be the teaching family.$s1_13ne$,
  147, 61, 70, 87,
  2.409836, 0.804598
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_14id$1426b6f7-c20d-4d85-9c09-8a7e34c8e0f3$s1_14id$,
  $s1_14st$usmle-step-1$s1_14st$,
  1,
  $s1_14oo${"options": ["Insulin from the carbohydrate load drives phosphate into cells to make ATP; phosphate should be replaced before and during refeeding, and calories advanced slowly", "Phosphate falls because the kidney wastes it in starvation, and feeding stops that waste immediately so the level rises", "The weakness is benzodiazepine withdrawal and phosphate is unrelated", "Refeeding alkalosis raises total calcium and the phosphate drop is a lab error", "A high-calorie start is safe if albumin is normal, because phosphate follows albumin"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Refeeding phosphate", "kind": "vignette"}$s1_14oo$,
  $s1_14no${"options": ["Insulin from the carbohydrate load drives phosphate into cells; replace phosphate and advance calories slowly", "Phosphate falls because the kidney wastes it in starvation, and feeding stops that waste immediately so the level rises", "The weakness is benzodiazepine withdrawal, and phosphate is unrelated to feeding", "Refeeding alkalosis raises total calcium, and the phosphate drop is a lab error", "A high-calorie start is safe if albumin is normal, because phosphate follows albumin"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Refeeding phosphate", "kind": "vignette"}$s1_14no$,
  $s1_14oc$Insulin from the carbohydrate load drives phosphate into cells to make ATP; phosphate should be replaced before and during refeeding, and calories advanced slowly$s1_14oc$,
  $s1_14nc$Insulin from the carbohydrate load drives phosphate into cells; replace phosphate and advance calories slowly$s1_14nc$,
  $s1_14oe$Starved cells are phosphate-poor. When insulin rises with feeding, phosphate, potassium, and magnesium rush intracellularly to rebuild ATP and glycogen. Serum phosphate can crash and cause weakness, hemolysis, and respiratory failure. The arrival phosphate can look normal and then fall, so you replete and advance calories slowly rather than celebrate a big first meal. Feeding does not instantly stop a renal waste in a way that raises phosphate; the level falls. This is not benzodiazepine withdrawal. It is not a calcium lab artifact. Phosphate is not albumin-bound the way a fraction of calcium is, and a normal albumin does not make aggressive refeeding safe.$s1_14oe$,
  $s1_14ne$Starved cells are phosphate-poor. When insulin rises with feeding, phosphate, potassium, and magnesium rush intracellularly to rebuild ATP and glycogen. Serum phosphate can crash and cause weakness, hemolysis, and respiratory failure. The arrival phosphate can look normal and then fall, so you replete and advance calories slowly rather than celebrate a big first meal. Feeding does not instantly stop a renal waste in a way that raises phosphate; the level falls. This is not benzodiazepine withdrawal. It is not a calcium lab artifact. Phosphate is not albumin-bound the way a fraction of calcium is, and a normal albumin does not make aggressive refeeding safe.$s1_14ne$,
  162, 119, 109, 119,
  1.361345, 0.915966
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_15id$15c5c4d4-6413-4abc-a04b-875eeff22e91$s1_15id$,
  $s1_15st$usmle-step-1$s1_15st$,
  1,
  $s1_15oo${"options": ["Epithelioid macrophages activated by Th1 CD4 cells through interferon-gamma; this is delayed hypersensitivity, not a neutrophil pneumonia", "Neutrophils are the epithelioid cell", "Granulomas are type I hypersensitivity", "Interferon-gamma turns macrophages off", "Caseation means an acute pyogenic abscess"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Granuloma", "kind": "vignette"}$s1_15oo$,
  $s1_15no${"options": ["Epithelioid macrophages activated by Th1 CD4 cells through interferon-gamma", "Neutrophils are the epithelioid cell and define this delayed reaction", "Granulomas are type I hypersensitivity driven by mast-cell degranulation", "Interferon-gamma turns macrophages off and recruits neutrophils instead", "Caseation means an acute pyogenic abscess filled with neutrophils"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Granuloma", "kind": "vignette"}$s1_15no$,
  $s1_15oc$Epithelioid macrophages activated by Th1 CD4 cells through interferon-gamma; this is delayed hypersensitivity, not a neutrophil pneumonia$s1_15oc$,
  $s1_15nc$Epithelioid macrophages activated by Th1 CD4 cells through interferon-gamma$s1_15nc$,
  $s1_15oe$A granuloma is organized macrophages that look epithelial, often fused into giant cells, walled by lymphocytes. Th1 cells secrete interferon-gamma to activate them. It is type IV immunity to persistent antigen, such as tuberculosis. Neutrophils make abscesses and pneumonia, not epithelioid clusters. Type I is IgE. Interferon-gamma activates, it does not suppress, the macrophage. Caseation is the necrotic center of a granuloma, not pus.$s1_15oe$,
  $s1_15ne$A granuloma is organized macrophages that look epithelial, often fused into giant cells, walled by lymphocytes. Th1 cells secrete interferon-gamma to activate them. It is type IV immunity to persistent antigen, such as tuberculosis. Neutrophils make abscesses and pneumonia, not epithelioid clusters. Type I is IgE. Interferon-gamma activates, it does not suppress, the macrophage. Caseation is the necrotic center of a granuloma, not pus.$s1_15ne$,
  137, 41, 75, 72,
  3.341463, 1.041667
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_16id$1645aeb0-a3d6-4b9f-82b8-4dee991ba0d4$s1_16id$,
  $s1_16st$usmle-step-1$s1_16st$,
  1,
  $s1_16oo${"options": ["It is an osteochondroma, a benign growth-plate cartilage rest; a thick or growing cap after skeletal maturity raises concern for chondrosarcoma", "Any cartilage cap is chondrosarcoma at diagnosis", "Continuity with the marrow means osteosarcoma", "Painful night nidus is the usual presentation", "The lesion points toward the joint if it is benign"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteochondroma", "kind": "vignette"}$s1_16oo$,
  $s1_16no${"options": ["An osteochondroma; a thick or growing cap after skeletal maturity raises concern for chondrosarcoma", "Any cartilage cap is chondrosarcoma at diagnosis, including a thin cap in a growing child", "Continuity with the marrow cavity means osteosarcoma", "A painful night nidus is the usual presentation of this cartilage cap", "The lesion points toward the joint if it is benign"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteochondroma", "kind": "vignette"}$s1_16no$,
  $s1_16oc$It is an osteochondroma, a benign growth-plate cartilage rest; a thick or growing cap after skeletal maturity raises concern for chondrosarcoma$s1_16oc$,
  $s1_16nc$An osteochondroma; a thick or growing cap after skeletal maturity raises concern for chondrosarcoma$s1_16nc$,
  $s1_16oe$Osteochondroma is a bony spur capped by cartilage, continuous with the medullary canal, aimed away from the joint, and it stops growing when the plate closes. Malignant change is uncommon and is suspected if the cap thickens or growth continues in an adult, not because cartilage is present at all. Marrow continuity is the benign osteochondroma feature, not osteosarcoma. Night pain relieved by NSAIDs is osteoid osteoma. Benign osteochondromas point away from the physis/joint.$s1_16oe$,
  $s1_16ne$Osteochondroma is a bony spur capped by cartilage, continuous with the medullary canal, aimed away from the joint, and it stops growing when the plate closes. Malignant change is uncommon and is suspected if the cap thickens or growth continues in an adult, not because cartilage is present at all. Marrow continuity is the benign osteochondroma feature, not osteosarcoma. Night pain relieved by NSAIDs is osteoid osteoma. Benign osteochondromas point away from the physis/joint.$s1_16ne$,
  143, 50, 99, 89,
  2.860000, 1.112360
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_17id$16c84162-4899-4bbe-8cf2-f6ba6cafe9de$s1_17id$,
  $s1_17st$usmle-step-1$s1_17st$,
  1,
  $s1_17oo${"options": ["Antibodies bind type IV collagen that is shared by lung and kidney basement membranes, so IgG lines the membrane; GPA is ANCA-positive and has little immunoglobulin on the biopsy", "Immune complexes in lumps mean Goodpasture", "c-ANCA is the Goodpasture test", "Type II collagen is the shared antigen", "Hemoptysis plus hematuria is always infection, so antibodies are irrelevant"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Goodpasture", "kind": "vignette"}$s1_17oo$,
  $s1_17no${"options": ["Type IV collagen in lung and kidney basement membranes; bound IgG therefore lines the membrane", "Immune complexes deposited in lumps are the Goodpasture pattern in lung and kidney", "c-ANCA is the Goodpasture test and predicts linear immunoglobulin", "Type II collagen is the shared antigen of alveolar and glomerular basement membranes", "Hemoptysis plus hematuria is always infection, so antibodies are irrelevant"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Goodpasture", "kind": "vignette"}$s1_17no$,
  $s1_17oc$Antibodies bind type IV collagen that is shared by lung and kidney basement membranes, so IgG lines the membrane; GPA is ANCA-positive and has little immunoglobulin on the biopsy$s1_17oc$,
  $s1_17nc$Type IV collagen in lung and kidney basement membranes; bound IgG therefore lines the membrane$s1_17nc$,
  $s1_17oe$Goodpasture disease is type II hypersensitivity to the noncollagenous domain of type IV collagen in GBM and alveolar basement membrane. Antibody sticks in a line. GPA is a small-vessel vasculitis with PR3-ANCA, granulomas, and a pauci-immune crescent, not linear IgG. Lumpy immunofluorescence is immune-complex disease. The ANCA is not the Goodpasture marker. Type II collagen is cartilage. The antibody is the disease.$s1_17oe$,
  $s1_17ne$Goodpasture disease is type II hypersensitivity to the noncollagenous domain of type IV collagen in GBM and alveolar basement membrane. Antibody sticks in a line. GPA is a small-vessel vasculitis with PR3-ANCA, granulomas, and a pauci-immune crescent, not linear IgG. Lumpy immunofluorescence is immune-complex disease. The ANCA is not the Goodpasture marker. Type II collagen is cartilage. The antibody is the disease.$s1_17ne$,
  178, 75, 94, 84,
  2.373333, 1.119048
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_18id$170467c3-ae76-4186-ab1c-258c4cc021a0$s1_18id$,
  $s1_18st$usmle-step-1$s1_18st$,
  1,
  $s1_18oo${"options": ["It activates PFK-1, pushing glycolysis; glucagon, via phosphorylation of the bifunctional enzyme, lowers fructose-2,6-bisphosphate so gluconeogenesis can proceed", "It inhibits PFK-1, so the fed state is gluconeogenesis", "Glucagon raises fructose-2,6-bisphosphate", "PFK-1 is the gluconeogenic enzyme that makes glucose from lactate", "The bifunctional enzyme is only in muscle, so the liver does not switch"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "PFK-1 and fructose-2,6-bisphosphate", "kind": "vignette"}$s1_18oo$,
  $s1_18no${"options": ["It activates PFK-1; glucagon lowers it by phosphorylating the bifunctional enzyme", "It inhibits PFK-1, so the fed state runs on gluconeogenesis", "Glucagon raises fructose-2,6-bisphosphate and speeds hepatic glycolysis", "PFK-1 is the gluconeogenic enzyme that makes glucose from lactate", "The bifunctional enzyme is only in muscle, so the liver does not switch pathways"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "PFK-1 and fructose-2,6-bisphosphate", "kind": "vignette"}$s1_18no$,
  $s1_18oc$It activates PFK-1, pushing glycolysis; glucagon, via phosphorylation of the bifunctional enzyme, lowers fructose-2,6-bisphosphate so gluconeogenesis can proceed$s1_18oc$,
  $s1_18nc$It activates PFK-1; glucagon lowers it by phosphorylating the bifunctional enzyme$s1_18nc$,
  $s1_18oe$Fructose-2,6-bisphosphate is the feed-forward activator of phosphofructokinase-1, the committed step of glycolysis, and it inhibits fructose-1,6-bisphosphatase. In the fed state insulin favors the kinase half of PFK-2 and the activator rises. Glucagon phosphorylates the bifunctional enzyme, the phosphatase half wins, the activator falls, and the liver makes glucose. The student reversed both arrows. PFK-1 is glycolytic, not the enzyme that releases free glucose. The liver is exactly where this switch matters for blood glucose; muscle PFK-2 is regulated differently and does not run gluconeogenesis.$s1_18oe$,
  $s1_18ne$Fructose-2,6-bisphosphate is the feed-forward activator of phosphofructokinase-1, the committed step of glycolysis, and it inhibits fructose-1,6-bisphosphatase. In the fed state insulin favors the kinase half of PFK-2 and the activator rises. Glucagon phosphorylates the bifunctional enzyme, the phosphatase half wins, the activator falls, and the liver makes glucose. The student reversed both arrows. PFK-1 is glycolytic, not the enzyme that releases free glucose. The liver is exactly where this switch matters for blood glucose; muscle PFK-2 is regulated differently and does not run gluconeogenesis.$s1_18ne$,
  161, 71, 81, 80,
  2.267606, 1.012500
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_19id$17a52c84-8a83-4b96-854d-4297b9102661$s1_19id$,
  $s1_19st$usmle-step-1$s1_19st$,
  1,
  $s1_19oo${"options": ["IgG is cationic and lowers the anion gap; osteoclast-activating cytokines from the plasma cells punch out bone and release calcium", "Myeloma protein raises the anion gap", "Bone lesions are osteoblastic like prostate cancer", "Light chains are the intact immunoglobulin on serum electrophoresis only", "Rouleaux means iron deficiency"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Multiple myeloma", "kind": "vignette"}$s1_19oo$,
  $s1_19no${"options": ["Cationic IgG lowers the anion gap; plasma-cell cytokines activate osteoclasts and lyse bone", "Myeloma protein raises the anion gap and blasts osteoblastic lesions in bone", "Bone lesions are osteoblastic, as in metastatic prostate cancer", "Light chains are the intact immunoglobulin spike seen on serum electrophoresis only", "Rouleaux formation means iron deficiency and explains the lytic bone"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Multiple myeloma", "kind": "vignette"}$s1_19no$,
  $s1_19oc$IgG is cationic and lowers the anion gap; osteoclast-activating cytokines from the plasma cells punch out bone and release calcium$s1_19oc$,
  $s1_19nc$Cationic IgG lowers the anion gap; plasma-cell cytokines activate osteoclasts and lyse bone$s1_19nc$,
  $s1_19oe$A large IgG paraprotein is positively charged and narrows the measured anion gap. Plasma cells activate osteoclasts, so lesions are purely lytic, calcium rises, and marrow replacement causes anemia. Rouleaux are stacked red cells from the protein. The gap goes down, not up. Prostate cancer is blastic. Urine light chains (Bence Jones) may not show as a big serum spike if only light chain is made. Rouleaux are not an iron-deficiency smear.$s1_19oe$,
  $s1_19ne$A large IgG paraprotein is positively charged and narrows the measured anion gap. Plasma cells activate osteoclasts, so lesions are purely lytic, calcium rises, and marrow replacement causes anemia. Rouleaux are stacked red cells from the protein. The gap goes down, not up. Prostate cancer is blastic. Urine light chains (Bence Jones) may not show as a big serum spike if only light chain is made. Rouleaux are not an iron-deficiency smear.$s1_19ne$,
  130, 72, 91, 83,
  1.805556, 1.096386
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_20id$1a1a8ce1-b46a-4d5a-9860-b1defaf45a0d$s1_20id$,
  $s1_20st$usmle-step-1$s1_20st$,
  1,
  $s1_20oo${"options": ["GLUT4 in muscle and fat is moved to the membrane by insulin signaling; liver GLUT2 is constitutive. Receptor failure causes hyperglycemia despite high insulin", "GLUT2 is the insulin-regulated transporter in muscle", "The liver cannot take up glucose unless insulin opens GLUT4", "High insulin with high glucose means the pancreas has failed", "Acanthosis nigricans means insulin levels are low"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Insulin signaling", "kind": "vignette"}$s1_20oo$,
  $s1_20no${"options": ["GLUT4 in muscle and fat; receptor failure causes hyperglycemia despite high insulin", "GLUT2 is the insulin-regulated transporter in muscle, and hepatic GLUT4 is constitutive", "The liver cannot take up glucose unless insulin inserts GLUT4 into the hepatocyte", "High insulin with high glucose means the pancreas has failed", "Acanthosis nigricans means circulating insulin is low"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Insulin signaling", "kind": "vignette"}$s1_20no$,
  $s1_20oc$GLUT4 in muscle and fat is moved to the membrane by insulin signaling; liver GLUT2 is constitutive. Receptor failure causes hyperglycemia despite high insulin$s1_20oc$,
  $s1_20nc$GLUT4 in muscle and fat; receptor failure causes hyperglycemia despite high insulin$s1_20nc$,
  $s1_20oe$Insulin binds its receptor, a tyrosine kinase, and in muscle and adipose tissue sends GLUT4 to the surface. Liver and beta cells use GLUT2, which is not parked waiting for insulin; the liver's insulin effect on glucose is mostly enzyme regulation. A receptor mutation is insulin resistance: glucose stays high while insulin is high, and acanthosis tracks that high insulin. GLUT2 is not the regulated muscle transporter. The liver does take up glucose without a GLUT4 step. High insulin means the pancreas is working, which is the opposite of type 1 failure. Acanthosis is a sign of high, not low, insulin.$s1_20oe$,
  $s1_20ne$Insulin binds its receptor, a tyrosine kinase, and in muscle and adipose tissue sends GLUT4 to the surface. Liver and beta cells use GLUT2, which is not parked waiting for insulin; the liver's insulin effect on glucose is mostly enzyme regulation. A receptor mutation is insulin resistance: glucose stays high while insulin is high, and acanthosis tracks that high insulin. GLUT2 is not the regulated muscle transporter. The liver does take up glucose without a GLUT4 step. High insulin means the pancreas is working, which is the opposite of type 1 failure. Acanthosis is a sign of high, not low, insulin.$s1_20ne$,
  158, 60, 83, 87,
  2.633333, 0.954023
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_21id$1b8f8671-2496-44bd-ba70-337b001b0480$s1_21id$,
  $s1_21st$usmle-step-1$s1_21st$,
  1,
  $s1_21oo${"options": ["Lumbar puncture looking for xanthochromia or blood that CT missed; autosomal dominant polycystic kidney disease is associated with saccular aneurysms", "Discharge, because CT is perfectly sensitive at one hour for every subarachnoid bleed", "Start heparin, because thunderclap headache is ischemic stroke until proven otherwise", "Order temporal artery biopsy before any spinal fluid test", "Berry aneurysms are associated with tuberous sclerosis, not kidney cysts"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Subarachnoid hemorrhage workup", "kind": "vignette"}$s1_21oo$,
  $s1_21no${"options": ["Lumbar puncture for blood CT missed; autosomal dominant polycystic kidney disease links to berry aneurysms", "Discharge, because CT is perfectly sensitive at one hour for every subarachnoid bleed", "Start heparin before any further test, because thunderclap headache is ischemic stroke until proven otherwise", "Order temporal artery biopsy before any spinal fluid examination", "Berry aneurysms are associated with tuberous sclerosis, not with kidney cysts"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Subarachnoid hemorrhage workup", "kind": "vignette"}$s1_21no$,
  $s1_21oc$Lumbar puncture looking for xanthochromia or blood that CT missed; autosomal dominant polycystic kidney disease is associated with saccular aneurysms$s1_21oc$,
  $s1_21nc$Lumbar puncture for blood CT missed; autosomal dominant polycystic kidney disease links to berry aneurysms$s1_21nc$,
  $s1_21oe$CT is very sensitive early but not perfect, and a negative scan with a true thunderclap headache and neck stiffness still needs a lumbar puncture to look for blood or xanthochromia. Missing that send-home is how a sentinel bleed is discharged. Heparin for an unexcluded hemorrhage is dangerous. Temporal artery biopsy is for older patients with jaw claudication and a high ESR, not a sudden headache at 45. Saccular aneurysms of the circle of Willis track with ADPKD, not with tuberous sclerosis.$s1_21oe$,
  $s1_21ne$CT is very sensitive early but not perfect, and a negative scan with a true thunderclap headache and neck stiffness still needs a lumbar puncture to look for blood or xanthochromia. Missing that send-home is how a sentinel bleed is discharged. Heparin for an unexcluded hemorrhage is dangerous. Temporal artery biopsy is for older patients with jaw claudication and a high ESR, not a sudden headache at 45. Saccular aneurysms of the circle of Willis track with ADPKD, not with tuberous sclerosis.$s1_21ne$,
  149, 85, 106, 109,
  1.752941, 0.972477
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_22id$1cedaa2f-cda3-4658-83d9-75435a52f7bb$s1_22id$,
  $s1_22st$usmle-step-1$s1_22st$,
  1,
  $s1_22oo${"options": ["The uterus is present and has been primed by estrogen; progesterone withdrawal shed the lining, so the amenorrhea is anovulation, not an absent uterus", "Bleeding after progesterone means estrogen was absent", "A bleed proves she is pregnant", "FSH must be high if she bleeds", "An absent uterus still bleeds when progesterone is given"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Progesterone challenge", "kind": "vignette"}$s1_22oo$,
  $s1_22no${"options": ["The uterus is present and estrogen-primed; progesterone withdrawal bled an anovulatory lining", "Bleeding after progesterone means estrogen was absent and the endometrium was unprimed", "A withdrawal bleed proves she is pregnant and that she ovulated this cycle", "FSH must be high if she bleeds after progesterone", "An absent uterus still bleeds when progesterone is given"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Progesterone challenge", "kind": "vignette"}$s1_22no$,
  $s1_22oc$The uterus is present and has been primed by estrogen; progesterone withdrawal shed the lining, so the amenorrhea is anovulation, not an absent uterus$s1_22oc$,
  $s1_22nc$The uterus is present and estrogen-primed; progesterone withdrawal bled an anovulatory lining$s1_22nc$,
  $s1_22oe$A progesterone challenge works only if endometrium exists and estrogen has proliferated it. Withdrawal bleeding means both. The missing piece is ovulation and a corpus luteum, the common PCOS pattern, not Müllerian agenesis. Bleeding means estrogen was present, not absent. It is not a pregnancy test. FSH is not driven up by a withdrawal bleed. No uterus, no bleed.$s1_22oe$,
  $s1_22ne$A progesterone challenge works only if endometrium exists and estrogen has proliferated it. Withdrawal bleeding means both. The missing piece is ovulation and a corpus luteum, the common PCOS pattern, not Müllerian agenesis. Bleeding means estrogen was present, not absent. It is not a pregnancy test. FSH is not driven up by a withdrawal bleed. No uterus, no bleed.$s1_22ne$,
  150, 56, 93, 86,
  2.678571, 1.081395
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_23id$1d31cc8d-7d00-4140-9732-021645b7687a$s1_23id$,
  $s1_23st$usmle-step-1$s1_23st$,
  1,
  $s1_23oo${"options": ["Amiodarone can cause either hypothyroidism or hyperthyroidism; blocked T4-to-T3 conversion can raise T4, but a suppressed TSH means real thyrotoxicosis that still has to be sorted into iodine-induced versus destructive", "Amiodarone never affects the thyroid because it contains no iodine", "A low TSH on amiodarone is always hypothyroidism", "Type 1 and type 2 amiodarone thyrotoxicosis are treated identically with high-dose hormone replacement", "Stopping the interpretation at the deiodinase block is enough when TSH is suppressed"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Amiodarone thyroid", "kind": "vignette"}$s1_23oo$,
  $s1_23no${"options": ["Amiodarone can cause hypo- or hyperthyroidism; suppressed TSH is real thyrotoxicosis, type 1 or type 2, not a mere conversion block", "Amiodarone never affects the thyroid because it contains no iodine and does not change deiodinase activity", "A low TSH on amiodarone is always hypothyroidism from blocked conversion of T4 to T3", "Type 1 and type 2 amiodarone thyrotoxicosis are a single disease and are treated identically with high-dose thyroid hormone replacement", "Stopping the interpretation at the deiodinase block is enough when TSH is suppressed"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Amiodarone thyroid", "kind": "vignette"}$s1_23no$,
  $s1_23oc$Amiodarone can cause either hypothyroidism or hyperthyroidism; blocked T4-to-T3 conversion can raise T4, but a suppressed TSH means real thyrotoxicosis that still has to be sorted into iodine-induced versus destructive$s1_23oc$,
  $s1_23nc$Amiodarone can cause hypo- or hyperthyroidism; suppressed TSH is real thyrotoxicosis, type 1 or type 2, not a mere conversion block$s1_23nc$,
  $s1_23oe$Amiodarone is iodine-rich and also inhibits peripheral deiodinase. Hypothyroidism is common, especially where iodine is sufficient. Hyperthyroidism also occurs: type 1 is extra synthesis in a nodular or Graves gland, type 2 is destructive thyroiditis. A low TSH is not hypothyroidism. The drug is loaded with iodine. High-dose levothyroxine is the wrong direction for thyrotoxicosis. The deiodinase effect can confuse total and free levels, but a suppressed TSH is not dismissed as a lab quirk.$s1_23oe$,
  $s1_23ne$Amiodarone is iodine-rich and also inhibits peripheral deiodinase. Hypothyroidism is common, especially where iodine is sufficient. Hyperthyroidism also occurs: type 1 is extra synthesis in a nodular or Graves gland, type 2 is destructive thyroiditis. A low TSH is not hypothyroidism. The drug is loaded with iodine. High-dose levothyroxine is the wrong direction for thyrotoxicosis. The deiodinase effect can confuse total and free levels, but a suppressed TSH is not dismissed as a lab quirk.$s1_23ne$,
  218, 102, 131, 135,
  2.137255, 0.970370
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_24id$20fd3836-9fa5-4ac0-bc6d-0acdfd2ae267$s1_24id$,
  $s1_24st$usmle-step-1$s1_24st$,
  1,
  $s1_24oo${"options": ["Microtubule polymerization and lysosomal trafficking fail, so granules are giant and melanosomes and neutrophil granules do not deliver; the oxidative burst itself can be present", "NADPH oxidase is absent, so albinism is required", "CD18 is absent, so there is no pus and the granules are normal size", "Giant granules mean the cells kill bacteria better", "Albinism here is oculocutaneous albinism type 1 with a normal immune system"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Chediak-Higashi", "kind": "vignette"}$s1_24oo$,
  $s1_24no${"options": ["Microtubule polymerization fails, so lysosomes are not trafficked and granules stay giant", "NADPH oxidase is absent, so albinism is required and the granules are normal in size", "CD18 is absent, so there is no pus and the granules are normal in size", "Giant granules mean the neutrophils kill bacteria more effectively", "The albinism is oculocutaneous albinism type 1 with a normal immune system"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Chediak-Higashi", "kind": "vignette"}$s1_24no$,
  $s1_24oc$Microtubule polymerization and lysosomal trafficking fail, so granules are giant and melanosomes and neutrophil granules do not deliver; the oxidative burst itself can be present$s1_24oc$,
  $s1_24nc$Microtubule polymerization fails, so lysosomes are not trafficked and granules stay giant$s1_24nc$,
  $s1_24oe$Chediak-Higashi is LYST dysfunction. Secretory lysosomes, melanosomes, and neutrophil granules do not traffic, so partial albinism, giant granules, infections, and a bleeding platelet defect travel together. A later accelerated phase looks like hemophagocytosis. CGD is the oxidase, without this pigment and granule picture. Leukocyte adhesion deficiency has no pus and normal-sized granules. The granules do not improve killing; they fail to deliver. Ordinary albinism does not fill neutrophils with giant granules.$s1_24oe$,
  $s1_24ne$Chediak-Higashi is LYST dysfunction. Secretory lysosomes, melanosomes, and neutrophil granules do not traffic, so partial albinism, giant granules, infections, and a bleeding platelet defect travel together. A later accelerated phase looks like hemophagocytosis. CGD is the oxidase, without this pigment and granule picture. Leukocyte adhesion deficiency has no pus and normal-sized granules. The granules do not improve killing; they fail to deliver. Ordinary albinism does not fill neutrophils with giant granules.$s1_24ne$,
  178, 75, 89, 84,
  2.373333, 1.059524
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_25id$21c64627-7783-49e8-bd12-94addf33ba16$s1_25id$,
  $s1_25st$usmle-step-1$s1_25st$,
  1,
  $s1_25oo${"options": ["IgA immune complexes in small vessels of skin, gut, and mesangium; post-streptococcal disease is weeks later with low C3 and humps, not palpable purpura as the lead", "Linear IgG is the Henoch-Schonlein finding", "C3 is always consumed in IgA vasculitis the way it is in post-strep disease", "The purpura is thrombocytopenia, so platelets are low", "Joint pain means rheumatoid factor disease in a child a week after a cold"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "IgA vasculitis", "kind": "vignette"}$s1_25oo$,
  $s1_25no${"options": ["IgA complexes in skin, gut, and mesangium; this is not the low-C3 pattern of post-strep disease", "Linear IgG along dermal and glomerular capillaries is the Henoch-Schonlein deposit in this purpura", "C3 is always consumed in IgA vasculitis the way it is in post-strep disease", "The purpura is thrombocytopenic, so the platelet count is low", "Joint pain means rheumatoid factor disease in a child a week after a cold"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "IgA vasculitis", "kind": "vignette"}$s1_25no$,
  $s1_25oc$IgA immune complexes in small vessels of skin, gut, and mesangium; post-streptococcal disease is weeks later with low C3 and humps, not palpable purpura as the lead$s1_25oc$,
  $s1_25nc$IgA complexes in skin, gut, and mesangium; this is not the low-C3 pattern of post-strep disease$s1_25nc$,
  $s1_25oe$IgA vasculitis (Henoch-Schönlein) follows a mucosal infection quickly. IgA deposits in vessels and mesangium. The tetrad is purpura, arthritis, abdominal pain, and renal disease, with a normal platelet count. Post-streptococcal glomerulonephritis is later, low C3, and subepithelial humps, without this skin. Linear IgG is anti-GBM. Complement is often normal in IgA disease. The purpura is vasculitis, not a low platelet count. This is not juvenile rheumatoid arthritis.$s1_25oe$,
  $s1_25ne$IgA vasculitis (Henoch-Schönlein) follows a mucosal infection quickly. IgA deposits in vessels and mesangium. The tetrad is purpura, arthritis, abdominal pain, and renal disease, with a normal platelet count. Post-streptococcal glomerulonephritis is later, low C3, and subepithelial humps, without this skin. Linear IgG is anti-GBM. Complement is often normal in IgA disease. The purpura is vasculitis, not a low platelet count. This is not juvenile rheumatoid arthritis.$s1_25ne$,
  164, 75, 95, 98,
  2.186667, 0.969388
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_26id$29dfaab5-b81a-4d6b-8162-3bb69643ce71$s1_26id$,
  $s1_26st$usmle-step-1$s1_26st$,
  1,
  $s1_26oo${"options": ["hCG weakly stimulates the TSH receptor in early pregnancy; this gestational thyrotoxicosis is transient and is not Graves disease", "She has Graves disease because any low TSH in pregnancy is antibody-driven", "Methimazole is required for the entire pregnancy when hCG is the stimulus", "hCG suppresses the thyroid directly, so T4 should be low", "Negative TSH-receptor antibodies confirm Graves disease"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "hCG and TSH", "kind": "vignette"}$s1_26oo$,
  $s1_26no${"options": ["hCG stimulates the TSH receptor early in pregnancy; the thyrotoxicosis is transient, not Graves disease", "She has Graves disease because any low TSH in pregnancy is antibody-driven", "Methimazole is required through the entire pregnancy when hCG is the stimulus", "hCG suppresses the thyroid gland directly, so free T4 should be low", "Negative TSH-receptor antibodies confirm Graves disease and call for treatment through the first trimester"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "hCG and TSH", "kind": "vignette"}$s1_26no$,
  $s1_26oc$hCG weakly stimulates the TSH receptor in early pregnancy; this gestational thyrotoxicosis is transient and is not Graves disease$s1_26oc$,
  $s1_26nc$hCG stimulates the TSH receptor early in pregnancy; the thyrotoxicosis is transient, not Graves disease$s1_26nc$,
  $s1_26oe$The alpha subunit of hCG resembles TSH. Very high hCG, as in hyperemesis or twins or a molar pregnancy, can raise thyroid hormone a little and suppress TSH. There are no eye findings and no stimulating antibody. It settles as hCG falls. Treating it as Graves disease with a year of methimazole exposes the fetus without a Graves diagnosis. hCG stimulates, it does not suppress, the gland, which is why T4 is up. Negative antibodies argue against Graves disease, they do not confirm it.$s1_26oe$,
  $s1_26ne$The alpha subunit of hCG resembles TSH. Very high hCG, as in hyperemesis or twins or a molar pregnancy, can raise thyroid hormone a little and suppress TSH. There are no eye findings and no stimulating antibody. It settles as hCG falls. Treating it as Graves disease with a year of methimazole exposes the fetus without a Graves diagnosis. hCG stimulates, it does not suppress, the gland, which is why T4 is up. Negative antibodies argue against Graves disease, they do not confirm it.$s1_26ne$,
  129, 74, 103, 106,
  1.743243, 0.971698
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_27id$2b36418a-d92f-430c-8a3b-4dae6f5f4de8$s1_27id$,
  $s1_27st$usmle-step-1$s1_27st$,
  1,
  $s1_27oo${"options": ["The Reed-Sternberg cell is the malignant B cell; Hodgkin lymphoma spreads node to contiguous node, whereas non-Hodgkin lymphomas are often already disseminated", "The small lymphocytes are the clone", "CD15 and CD30 are the myeloid Auer-rod markers", "Hodgkin disease starts in multiple extranodal sites", "Owl-eye cells are CMV, not a lymphoma"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Hodgkin Reed-Sternberg", "kind": "vignette"}$s1_27oo$,
  $s1_27no${"options": ["The Reed-Sternberg cell is malignant; Hodgkin spreads to contiguous nodes, whereas non-Hodgkin lymphoma is often disseminated", "The small lymphocytes around the large cell are the malignant clone, and the disease is disseminated from the start", "CD15 and CD30 are myeloid markers and correspond to Auer rods", "Hodgkin lymphoma begins in multiple extranodal sites at once", "Owl-eye inclusions here are cytomegalovirus, not a lymphoma cell"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Hodgkin Reed-Sternberg", "kind": "vignette"}$s1_27no$,
  $s1_27oc$The Reed-Sternberg cell is the malignant B cell; Hodgkin lymphoma spreads node to contiguous node, whereas non-Hodgkin lymphomas are often already disseminated$s1_27oc$,
  $s1_27nc$The Reed-Sternberg cell is malignant; Hodgkin spreads to contiguous nodes, whereas non-Hodgkin lymphoma is often disseminated$s1_27nc$,
  $s1_27oe$Reed-Sternberg cells are the neoplastic B cells, CD15 and CD30 positive, sitting in a reactive lymph-node background. Disease moves to the next node in line, which is why staging and contiguous radiation logic existed. The crowd of small lymphocytes is reactive. Those CD markers are not Auer rods. Non-Hodgkin lymphomas more often present widespread, including extranodal. The owl eye here is a binucleate tumor cell, not a viral inclusion, though the differential of big cells includes infection.$s1_27oe$,
  $s1_27ne$Reed-Sternberg cells are the neoplastic B cells, CD15 and CD30 positive, sitting in a reactive lymph-node background. Disease moves to the next node in line, which is why staging and contiguous radiation logic existed. The crowd of small lymphocytes is reactive. Those CD markers are not Auer rods. Non-Hodgkin lymphomas more often present widespread, including extranodal. The owl eye here is a binucleate tumor cell, not a viral inclusion, though the differential of big cells includes infection.$s1_27ne$,
  159, 51, 125, 115,
  3.117647, 1.086957
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_28id$2b6ef944-f7ea-4288-94d1-ee1b0ac46e56$s1_28id$,
  $s1_28st$usmle-step-1$s1_28st$,
  1,
  $s1_28oo${"options": ["Polymyalgia rheumatica with possible giant-cell arteritis; the muscle is not necrotic so CK is normal, and the headache needs steroids promptly to protect vision rather than a wait for biopsy of muscle", "Polymyositis, because shoulder pain means inflamed muscle and CK should be ignored", "Statin myopathy, because the ESR is high", "A normal CK excludes vasculitis", "Giant-cell arteritis is a disease of people under 50"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Polymyalgia versus myositis", "kind": "vignette"}$s1_28oo$,
  $s1_28no${"options": ["Polymyalgia rheumatica with possible giant-cell arteritis; CK is normal, and steroids precede biopsy to protect vision", "Polymyositis, because shoulder pain means inflamed muscle and the CK should be ignored", "Statin myopathy, because the sedimentation rate is high and the headache is a drug effect", "A normal CK excludes vasculitis, so biopsy of the temporal artery can wait", "Giant-cell arteritis is a disease of people under 50, so steroids can wait while a muscle biopsy is arranged"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Polymyalgia versus myositis", "kind": "vignette"}$s1_28no$,
  $s1_28oc$Polymyalgia rheumatica with possible giant-cell arteritis; the muscle is not necrotic so CK is normal, and the headache needs steroids promptly to protect vision rather than a wait for biopsy of muscle$s1_28oc$,
  $s1_28nc$Polymyalgia rheumatica with possible giant-cell arteritis; CK is normal, and steroids precede biopsy to protect vision$s1_28nc$,
  $s1_28oe$Polymyalgia is pain and stiffness of shoulders and hips in an older adult, with a high ESR and a normal CK, because the muscle itself is not the inflamed tissue. Giant-cell arteritis travels with it. A new headache is a vision-threatening arteritis until proven otherwise, and steroids are not delayed for a muscle biopsy. Polymyositis has true weakness and a high CK. Statin myopathy raises CK and does not raise the ESR into this range as its signature. A normal CK is expected in vasculitis of this type and does not clear the temporal artery. Giant-cell arteritis is a disease of older adults.$s1_28oe$,
  $s1_28ne$Polymyalgia is pain and stiffness of shoulders and hips in an older adult, with a high ESR and a normal CK, because the muscle itself is not the inflamed tissue. Giant-cell arteritis travels with it. A new headache is a vision-threatening arteritis until proven otherwise, and steroids are not delayed for a muscle biopsy. Polymyositis has true weakness and a high CK. Statin myopathy raises CK and does not raise the ESR into this range as its signature. A normal CK is expected in vasculitis of this type and does not clear the temporal artery. Giant-cell arteritis is a disease of older adults.$s1_28ne$,
  201, 82, 118, 108,
  2.451220, 1.092593
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_29id$2c726600-7fe3-4d63-bdd0-49faeb83fae6$s1_29id$,
  $s1_29st$usmle-step-1$s1_29st$,
  1,
  $s1_29oo${"options": ["A lenticulostriate branch to the posterior limb of the internal capsule; the cortex would have added cortical signs such as aphasia or a field cut if a large MCA trunk were out", "The left MCA stem, which causes pure motor loss and always spares the face", "The anterior cerebral artery, which weakens face, arm, and leg equally", "A PICA infarct, because pure motor stroke is a lateral medullary sign", "The ophthalmic artery, because equal face and leg weakness is ocular"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Lacunar pure motor", "kind": "vignette"}$s1_29oo$,
  $s1_29no${"options": ["A lenticulostriate branch to the posterior limb; absent cortical signs make the cortex unlikely", "The left MCA stem, which causes pure motor loss and always spares the face", "The anterior cerebral artery, which weakens the face, arm, and leg equally", "A PICA infarct, because pure motor stroke is a lateral medullary syndrome", "The ophthalmic artery, because equal weakness of the face and the leg is an ocular localization"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Lacunar pure motor", "kind": "vignette"}$s1_29no$,
  $s1_29oc$A lenticulostriate branch to the posterior limb of the internal capsule; the cortex would have added cortical signs such as aphasia or a field cut if a large MCA trunk were out$s1_29oc$,
  $s1_29nc$A lenticulostriate branch to the posterior limb; absent cortical signs make the cortex unlikely$s1_29nc$,
  $s1_29oe$Pure motor hemiparesis of face, arm, and leg together, without sensory or cortical signs, is the lacunar syndrome of the contralateral internal capsule or basis pontis. Lipohyalinosis of a small penetrator such as a lenticulostriate artery is the usual cause in chronic hypertension. An MCA stem stroke is a large cortical and deep infarct and brings aphasia, neglect, or a gaze preference. ACA spares the face relative to the leg. PICA is lateral medulla and is not a pure motor hemiparesis. The ophthalmic artery does not supply the capsule.$s1_29oe$,
  $s1_29ne$Pure motor hemiparesis of face, arm, and leg together, without sensory or cortical signs, is the lacunar syndrome of the contralateral internal capsule or basis pontis. Lipohyalinosis of a small penetrator such as a lenticulostriate artery is the usual cause in chronic hypertension. An MCA stem stroke is a large cortical and deep infarct and brings aphasia, neglect, or a gaze preference. ACA spares the face relative to the leg. PICA is lateral medulla and is not a pure motor hemiparesis. The ophthalmic artery does not supply the capsule.$s1_29ne$,
  176, 74, 95, 95,
  2.378378, 1.000000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_30id$2fd53e3b-3081-48ab-ba65-ad3c6bf8efd5$s1_30id$,
  $s1_30st$usmle-step-1$s1_30st$,
  1,
  $s1_30oo${"options": ["Tremor and tachycardia are beta-adrenergic and are blunted; sweating is cholinergic and can remain, and recovery from hypoglycemia is also slowed because beta-2 helps counter-regulation", "Sweating is the symptom beta blockers remove, while tremor remains", "Propranolol causes hypoglycemia by releasing insulin", "Selective and nonselective agents are identical for this warning", "Masking means the glucose number on the meter rises falsely"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Beta blocker and hypoglycemia", "kind": "vignette"}$s1_30oo$,
  $s1_30no${"options": ["Tremor and tachycardia are blunted; sweating can remain, and recovery from hypoglycemia is slowed", "Sweating is the warning beta blockers remove, while tremor persists as a cholinergic sign", "Propranolol causes hypoglycemia by releasing insulin from the beta cell", "Selective and nonselective agents are identical for these warnings and for glucose recovery", "Masking means the glucose value on the meter rises falsely during a low"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Beta blocker and hypoglycemia", "kind": "vignette"}$s1_30no$,
  $s1_30oc$Tremor and tachycardia are beta-adrenergic and are blunted; sweating is cholinergic and can remain, and recovery from hypoglycemia is also slowed because beta-2 helps counter-regulation$s1_30oc$,
  $s1_30nc$Tremor and tachycardia are blunted; sweating can remain, and recovery from hypoglycemia is slowed$s1_30nc$,
  $s1_30oe$The adrenergic warning of hypoglycemia is a beta effect: shake and a fast heart. Propranolol blocks it, so the patient skips the early alarm and presents confused. Sweating is muscarinic and often persists, which is the clue that remains. Nonselective blockade also impairs glycogenolysis and gluconeogenesis that depend on beta-2. Sweating is not the blocked symptom. Propranolol does not release insulin the way a sulfonylurea does. Beta-1 selective drugs are somewhat less guilty, so they are not identical. The meter still reads a true low; the mask is symptomatic, not analytic.$s1_30oe$,
  $s1_30ne$The adrenergic warning of hypoglycemia is a beta effect: shake and a fast heart. Propranolol blocks it, so the patient skips the early alarm and presents confused. Sweating is muscarinic and often persists, which is the clue that remains. Nonselective blockade also impairs glycogenolysis and gluconeogenesis that depend on beta-2. Sweating is not the blocked symptom. Propranolol does not release insulin the way a sulfonylurea does. Beta-1 selective drugs are somewhat less guilty, so they are not identical. The meter still reads a true low; the mask is symptomatic, not analytic.$s1_30ne$,
  185, 66, 97, 91,
  2.803030, 1.065934
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_31id$30f03aaa-4889-4036-8372-053f0c96a3dd$s1_31id$,
  $s1_31st$usmle-step-1$s1_31st$,
  1,
  $s1_31oo${"options": ["He has made IgG against the IgA present in donor blood; IVIG also contains some IgA and is not a simple replacement", "IgA deficiency removes IgG as well", "ABO mismatch is the usual cause of anaphylaxis with a normal IgA", "IgM is the antibody that reacts to donor IgA", "Selective IgA deficiency presents with no infections"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Selective IgA deficiency", "kind": "vignette"}$s1_31oo$,
  $s1_31no${"options": ["He has made IgG against donor IgA; IVIG also contains IgA and can trigger the same reaction", "IgA deficiency removes IgG as well, so humoral defense is broadly lost", "ABO mismatch is the usual cause of anaphylaxis when the IgA level is normal", "IgM is the antibody that reacts with donor IgA and fixes complement", "Selective IgA deficiency presents with no infections and tolerates IgA in donor blood and in IVIG"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Selective IgA deficiency", "kind": "vignette"}$s1_31no$,
  $s1_31oc$He has made IgG against the IgA present in donor blood; IVIG also contains some IgA and is not a simple replacement$s1_31oc$,
  $s1_31nc$He has made IgG against donor IgA; IVIG also contains IgA and can trigger the same reaction$s1_31nc$,
  $s1_31oe$The most common primary immunodeficiency is selective IgA deficiency. Mucosal infections and giardia are typical, and some patients form anti-IgA IgG. Donor blood contains IgA and can trigger anaphylaxis. Washed cells are used. Standard IVIG contains traces of IgA and can do the same, and it does not replace IgA at the mucosa anyway. Other isotypes are present, which is why it is selective. ABO hemolysis is fever, back pain, and hemoglobinuria, not isolated anaphylaxis with absent IgA. The pathogenic antibody is IgG against IgA, not IgM. Infections do occur.$s1_31oe$,
  $s1_31ne$The most common primary immunodeficiency is selective IgA deficiency. Mucosal infections and giardia are typical, and some patients form anti-IgA IgG. Donor blood contains IgA and can trigger anaphylaxis. Washed cells are used. Standard IVIG contains traces of IgA and can do the same, and it does not replace IgA at the mucosa anyway. Other isotypes are present, which is why it is selective. ABO hemolysis is fever, back pain, and hemoglobinuria, not isolated anaphylaxis with absent IgA. The pathogenic antibody is IgG against IgA, not IgM. Infections do occur.$s1_31ne$,
  115, 64, 91, 97,
  1.796875, 0.938144
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_32id$33bde9ac-a456-45bb-b247-44ba624922b2$s1_32id$,
  $s1_32st$usmle-step-1$s1_32st$,
  1,
  $s1_32oo${"options": ["Rasburicase oxidizes uric acid to allantoin; probenecid only blocks reabsorption and cannot handle a sudden production flood with a threatened kidney", "Probenecid is the tumor-lysis drug because it increases excretion", "Allopurinol dissolves crystals already formed within an hour", "Rasburicase is an oral daily gout preventive", "Tumor lysis lowers uric acid, so no drug is needed"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Gout crystal already counted extra", "kind": "vignette"}$s1_32oo$,
  $s1_32no${"options": ["Rasburicase oxidizes uric acid to allantoin; probenecid cannot clear a sudden production flood", "Probenecid is the tumor-lysis drug because it increases urinary excretion of the urate already formed", "Allopurinol dissolves crystals already formed within an hour of the first dose", "Rasburicase is an oral daily preventive used for ordinary gout", "Tumor lysis lowers uric acid, so no urate-lowering drug is needed"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Gout crystal already counted extra", "kind": "vignette"}$s1_32no$,
  $s1_32oc$Rasburicase oxidizes uric acid to allantoin; probenecid only blocks reabsorption and cannot handle a sudden production flood with a threatened kidney$s1_32oc$,
  $s1_32nc$Rasburicase oxidizes uric acid to allantoin; probenecid cannot clear a sudden production flood$s1_32nc$,
  $s1_32oe$Tumor lysis dumps purines and uric acid can precipitate in the kidney. Rasburicase is a recombinant uricase that converts uric acid to soluble allantoin and is used for that emergency. Probenecid increases urinary urate and is the wrong direction when the kidney is about to be clogged. Allopurinol blocks new formation and does not remove uric acid already present nearly as fast, and it does not melt a joint in an hour. Rasburicase is IV for lysis, not a daily tablet. Uric acid rises in tumor lysis; that is the problem.$s1_32oe$,
  $s1_32ne$Tumor lysis dumps purines and uric acid can precipitate in the kidney. Rasburicase is a recombinant uricase that converts uric acid to soluble allantoin and is used for that emergency. Probenecid increases urinary urate and is the wrong direction when the kidney is about to be clogged. Allopurinol blocks new formation and does not remove uric acid already present nearly as fast, and it does not melt a joint in an hour. Rasburicase is IV for lysis, not a daily tablet. Uric acid rises in tumor lysis; that is the problem.$s1_32ne$,
  149, 65, 94, 101,
  2.292308, 0.930693
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_33id$3601c916-2775-4f26-a9a3-29561207e8bb$s1_33id$,
  $s1_33st$usmle-step-1$s1_33st$,
  1,
  $s1_33oo${"options": ["A failed development of the third and fourth pharyngeal pouches; B has a combined lymphocyte precursor defect such as a cytokine-receptor or ADA problem", "Both lack only B cells, so immunoglobulins are the whole story", "A is Bruton agammaglobulinemia, which includes hypocalcemia", "B has a pure neutrophil adhesion defect and a normal lymphocyte count", "The heart defect in A is an incidental PDA and the thymus is normal"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "DiGeorge versus SCID", "kind": "vignette"}$s1_33oo$,
  $s1_33no${"options": ["A failed the third and fourth pharyngeal pouches; B failed a combined T- and B-cell precursor", "Both lack only B cells, so immunoglobulins explain the infections in each child", "A is Bruton agammaglobulinemia, which includes hypocalcemia and an absent thymic shadow", "B is a neutrophil adhesion defect with a normal lymphocyte count", "The heart defect in A is an incidental patent ductus, and the thymus is normal"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "DiGeorge versus SCID", "kind": "vignette"}$s1_33no$,
  $s1_33oc$A failed development of the third and fourth pharyngeal pouches; B has a combined lymphocyte precursor defect such as a cytokine-receptor or ADA problem$s1_33oc$,
  $s1_33nc$A failed the third and fourth pharyngeal pouches; B failed a combined T- and B-cell precursor$s1_33nc$,
  $s1_33oe$DiGeorge syndrome is a third-and-fourth pouch field defect: no thymus, no parathyroids, and conotruncal anomalies such as tetralogy or interrupted arch, so T cells fail and calcium is low. SCID is a combined T and B failure from defects such as the common gamma chain or adenosine deaminase, with low lymphocytes and infections of every class. B-cell-only disease would spare the viral and fungal pattern and the calcium. Bruton disease is boys with absent B cells after maternal IgG wanes, not hypocalcemia. Adhesion deficiency raises the neutrophil count and does not empty the lymphocyte count. The cardiac lesion is part of the field defect, not a coincidence.$s1_33oe$,
  $s1_33ne$DiGeorge syndrome is a third-and-fourth pouch field defect: no thymus, no parathyroids, and conotruncal anomalies such as tetralogy or interrupted arch, so T cells fail and calcium is low. SCID is a combined T and B failure from defects such as the common gamma chain or adenosine deaminase, with low lymphocytes and infections of every class. B-cell-only disease would spare the viral and fungal pattern and the calcium. Bruton disease is boys with absent B cells after maternal IgG wanes, not hypocalcemia. Adhesion deficiency raises the neutrophil count and does not empty the lymphocyte count. The cardiac lesion is part of the field defect, not a coincidence.$s1_33ne$,
  152, 69, 93, 87,
  2.202899, 1.068966
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_34id$37b6b957-9f5b-4838-9055-fc458aeeb102$s1_34id$,
  $s1_34st$usmle-step-1$s1_34st$,
  1,
  $s1_34oo${"options": ["Spectrin or ankyrin is weak, so cells lose membrane, become spheres, and are trapped in the spleen; splenectomy stops the hemolysis even though the sphere shape remains", "A hemoglobin point mutation sickles the cells", "G6PD deficiency makes spherocytes as the main smear", "Splenectomy increases destruction of spherocytes", "MCHC is low because the cells are overhydrated"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Hereditary spherocytosis", "kind": "vignette"}$s1_34oo$,
  $s1_34no${"options": ["Weak spectrin or ankyrin makes spheres the spleen traps; splenectomy stops the hemolysis", "A hemoglobin point mutation sickles the cells, and the spleen traps them", "G6PD deficiency produces spherocytes as the dominant smear finding", "Splenectomy increases destruction of spherocytes by moving that clearance to the liver", "MCHC is low because the red cells are overhydrated and lose membrane"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Hereditary spherocytosis", "kind": "vignette"}$s1_34no$,
  $s1_34oc$Spectrin or ankyrin is weak, so cells lose membrane, become spheres, and are trapped in the spleen; splenectomy stops the hemolysis even though the sphere shape remains$s1_34oc$,
  $s1_34nc$Weak spectrin or ankyrin makes spheres the spleen traps; splenectomy stops the hemolysis$s1_34nc$,
  $s1_34oe$Hereditary spherocytosis is a membrane cytoskeleton defect. Cells lose surface area, become spheres with a high MCHC, and cannot deform through the spleen, so they are destroyed there. Pigment gallstones follow. Splenectomy removes the filter; the cells stay spherical but they are not culled. Sickle cell is a hemoglobin mutation with a different smear. G6PD causes bite cells after oxidant stress, not a chronic spherocytic family disease. Splenectomy decreases, not increases, destruction. The cells are dehydrated of surface, so hemoglobin is concentrated and MCHC is high.$s1_34oe$,
  $s1_34ne$Hereditary spherocytosis is a membrane cytoskeleton defect. Cells lose surface area, become spheres with a high MCHC, and cannot deform through the spleen, so they are destroyed there. Pigment gallstones follow. Splenectomy removes the filter; the cells stay spherical but they are not culled. Sickle cell is a hemoglobin mutation with a different smear. G6PD causes bite cells after oxidant stress, not a chronic spherocytic family disease. Splenectomy decreases, not increases, destruction. The cells are dehydrated of surface, so hemoglobin is concentrated and MCHC is high.$s1_34ne$,
  168, 51, 88, 86,
  3.294118, 1.023256
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_35id$3810fa1d-2efd-45ff-9335-6529ec03d6eb$s1_35id$,
  $s1_35st$usmle-step-1$s1_35st$,
  1,
  $s1_35oo${"options": ["Zone 3 around the central vein is last in the liver's oxygen gradient; the renal cortex is also relatively under-supplied when pressure falls", "Zone 1 around the portal tract is the most ischemic", "The renal medulla is the first and only renal injury", "The bowel is spared in shock because it has a dual blood supply that never fails", "Watershed brain injury means the brainstem only"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Shock organs", "kind": "vignette"}$s1_35oo$,
  $s1_35no${"options": ["Zone 3 is last in the liver oxygen gradient; low pressure also under-supplies the renal cortex", "Zone 1 around the portal tract is the most ischemic part of the lobule", "The renal medulla is the first and only renal injury when pressure falls", "The bowel is spared in shock because it has a dual blood supply that never fails when pressure falls", "Watershed brain injury in shock is confined to the brainstem"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Shock organs", "kind": "vignette"}$s1_35no$,
  $s1_35oc$Zone 3 around the central vein is last in the liver's oxygen gradient; the renal cortex is also relatively under-supplied when pressure falls$s1_35oc$,
  $s1_35nc$Zone 3 is last in the liver oxygen gradient; low pressure also under-supplies the renal cortex$s1_35nc$,
  $s1_35oe$Hepatic blood runs from portal tract to central vein, so zone 3 is the least oxygenated and necroses in shock. The renal cortex, with its filtration demand, shows pale cortical necrosis or tubular injury when pressure falls; the medulla is congested. Zone 1 is best oxygenated. The medulla is vulnerable to some injuries but the classic shock kidney description is cortical pallor. The gut mucosa is a shock target, not a protected dual-supply organ in this setting. Watershed injury is the cortical border zones, not the brainstem alone.$s1_35oe$,
  $s1_35ne$Hepatic blood runs from portal tract to central vein, so zone 3 is the least oxygenated and necroses in shock. The renal cortex, with its filtration demand, shows pale cortical necrosis or tubular injury when pressure falls; the medulla is congested. Zone 1 is best oxygenated. The medulla is vulnerable to some injuries but the classic shock kidney description is cortical pallor. The gut mucosa is a shock target, not a protected dual-supply organ in this setting. Watershed injury is the cortical border zones, not the brainstem alone.$s1_35ne$,
  141, 80, 94, 100,
  1.762500, 0.940000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_36id$395eddcd-095a-45b9-9207-1ad9e61935fb$s1_36id$,
  $s1_36st$usmle-step-1$s1_36st$,
  1,
  $s1_36oo${"options": ["Older red cells with the least G6PD lyse when oxidant stress uses up glutathione; after they are gone the remaining young cells can assay near normal", "G6PD excess causes hemolysis", "The assay is most abnormal a month later when only young cells remain", "Heinz bodies are denatured hemoglobin from a membrane spectrin defect", "Primaquine is safe in G6PD deficiency"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "G6PD hemolysis", "kind": "vignette"}$s1_36oo$,
  $s1_36no${"options": ["The oldest, G6PD-poor red cells lyse; a week later the young cells can assay near normal", "G6PD excess causes the hemolysis when oxidant stress depletes glutathione", "The assay is most abnormal a month later, once the surviving cells are young", "Heinz bodies are denatured hemoglobin from a spectrin defect in the membrane", "Primaquine is safe in G6PD deficiency because the young red cells resist oxidant stress"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "G6PD hemolysis", "kind": "vignette"}$s1_36no$,
  $s1_36oc$Older red cells with the least G6PD lyse when oxidant stress uses up glutathione; after they are gone the remaining young cells can assay near normal$s1_36oc$,
  $s1_36nc$The oldest, G6PD-poor red cells lyse; a week later the young cells can assay near normal$s1_36nc$,
  $s1_36oe$G6PD is the first pentose-pathway enzyme that keeps glutathione reduced. The A- variant declines as red cells age. An oxidant drug lyses the old cells, then the crisis stops, and a test drawn after the old cells are gone can look normal. You do not see enzyme excess. The assay is falsely reassuring right after a hemolysis, not a month later when a mixed-age population has returned. Heinz bodies are oxidized hemoglobin, not hereditary spherocytosis. Primaquine is a classic trigger and is avoided.$s1_36oe$,
  $s1_36ne$G6PD is the first pentose-pathway enzyme that keeps glutathione reduced. The A- variant declines as red cells age. An oxidant drug lyses the old cells, then the crisis stops, and a test drawn after the old cells are gone can look normal. You do not see enzyme excess. The assay is falsely reassuring right after a hemolysis, not a month later when a mixed-age population has returned. Heinz bodies are oxidized hemoglobin, not hereditary spherocytosis. Primaquine is a classic trigger and is avoided.$s1_36ne$,
  149, 69, 88, 87,
  2.159420, 1.011494
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_37id$3986dbe7-1c4d-41ee-aa10-a7cf094bb73e$s1_37id$,
  $s1_37st$usmle-step-1$s1_37st$,
  1,
  $s1_37oo${"options": ["A is central retinal artery occlusion; the macula looks red because the underlying choroid shows through pale retina. B is central retinal vein occlusion", "A is vein occlusion because a cherry-red spot is venous blood; B is artery occlusion", "Both are retinal detachment, which whitens the retina and fills it with blood", "A is optic neuritis, which is painless and shows a cherry-red spot", "B is a vitreous hemorrhage, which leaves the retinal vessels easy to see and tortuous"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Central retinal artery versus vein", "kind": "vignette"}$s1_37oo$,
  $s1_37no${"options": ["A is central retinal artery occlusion; the red spot is choroid showing through pale retina. B is central retinal vein occlusion", "A is vein occlusion because a cherry-red spot is venous blood; B is artery occlusion", "Both are retinal detachment, which whitens the retina, fills the vessels with blood, and leaves a cherry-red spot at the macula", "A is optic neuritis, which is painless and shows a cherry-red spot", "B is a vitreous hemorrhage, which leaves the retinal vessels easy to see and tortuous"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Central retinal artery versus vein", "kind": "vignette"}$s1_37no$,
  $s1_37oc$A is central retinal artery occlusion; the macula looks red because the underlying choroid shows through pale retina. B is central retinal vein occlusion$s1_37oc$,
  $s1_37nc$A is central retinal artery occlusion; the red spot is choroid showing through pale retina. B is central retinal vein occlusion$s1_37nc$,
  $s1_37oe$Arterial occlusion kills the inner retina, which turns white, while the fovea stays relatively red because it is thin and the choroidal circulation shows through. Venous occlusion backs up blood: dilated veins, disk edema, and hemorrhages all around, the 'blood and thunder' fundus. Swapping artery and vein swaps the cherry-red spot onto the wrong disease. Detachment gives flashes, floaters, and a curtain, not these two fundi. Optic neuritis hurts with eye movement and affects the nerve head or the field, not a pale retina with a red fovea. Vitreous blood obscures the fundus; you would not see tortuous veins clearly.$s1_37oe$,
  $s1_37ne$Arterial occlusion kills the inner retina, which turns white, while the fovea stays relatively red because it is thin and the choroidal circulation shows through. Venous occlusion backs up blood: dilated veins, disk edema, and hemorrhages all around, the 'blood and thunder' fundus. Swapping artery and vein swaps the cherry-red spot onto the wrong disease. Detachment gives flashes, floaters, and a curtain, not these two fundi. Optic neuritis hurts with eye movement and affects the nerve head or the field, not a pale retina with a red fovea. Vitreous blood obscures the fundus; you would not see tortuous veins clearly.$s1_37ne$,
  153, 85, 127, 127,
  1.800000, 1.000000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_38id$3c089e6b-72d1-4aa7-be76-0fad94f69552$s1_38id$,
  $s1_38st$usmle-step-1$s1_38st$,
  1,
  $s1_38oo${"options": ["Acidosis and low insulin shift potassium out of cells, so the serum number hides a total-body deficit; B still makes enough insulin to limit ketogenesis but not enough to control glucose", "A high serum potassium means total-body potassium is high and replacement will cause arrhythmia", "B must be in DKA because the glucose is higher", "Insulin is started in A before fluids because glucose, not volume, is the first threat", "Ketones are required for hyperosmolar coma"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "DKA versus HHS", "kind": "vignette"}$s1_38oo$,
  $s1_38no${"options": ["Acidosis and low insulin shift potassium out, hiding a body deficit; B still makes enough insulin to limit ketones", "A high serum potassium means total-body potassium is high, and replacement will trigger a ventricular arrhythmia", "B must be in ketoacidosis because its glucose is the higher of the two", "Insulin is started in A before fluids because glucose, not volume, is the first threat", "Ketones are required for the hyperosmolar state, so B is the ketoacidotic emergency"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "DKA versus HHS", "kind": "vignette"}$s1_38no$,
  $s1_38oc$Acidosis and low insulin shift potassium out of cells, so the serum number hides a total-body deficit; B still makes enough insulin to limit ketogenesis but not enough to control glucose$s1_38oc$,
  $s1_38nc$Acidosis and low insulin shift potassium out, hiding a body deficit; B still makes enough insulin to limit ketones$s1_38nc$,
  $s1_38oe$In DKA, potassium leaves cells with the acidosis and the insulin lack, so the serum can look normal or high while the body is depleted. Insulin drives potassium back in and can stop the heart if you do not replace it. Fluids come first. Patient B has hyperosmolar hyperglycemic state: enough insulin remains to suppress most ketogenesis, so acidosis is mild, but glucose and osmolality are extreme. A high serum potassium is not a surplus. A higher glucose does not define DKA; ketones and acidosis do. Insulin before volume in a crashing dry patient is the wrong order. Ketones are exactly what HHS lacks.$s1_38oe$,
  $s1_38ne$In DKA, potassium leaves cells with the acidosis and the insulin lack, so the serum can look normal or high while the body is depleted. Insulin drives potassium back in and can stop the heart if you do not replace it. Fluids come first. Patient B has hyperosmolar hyperglycemic state: enough insulin remains to suppress most ketogenesis, so acidosis is mild, but glucose and osmolality are extreme. A high serum potassium is not a surplus. A higher glucose does not define DKA; ketones and acidosis do. Insulin before volume in a crashing dry patient is the wrong order. Ketones are exactly what HHS lacks.$s1_38ne$,
  186, 95, 114, 112,
  1.957895, 1.017857
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_39id$47bf8f4b-2d88-4849-9a63-ebe4503e0d80$s1_39id$,
  $s1_39st$usmle-step-1$s1_39st$,
  1,
  $s1_39oo${"options": ["Deoxygenated HbS polymerizes; repeated infarcts autosplenectomize, which is why Howell-Jolly bodies appear and encapsulated bacteria are a risk", "Oxygenated HbS is the polymer", "The spleen enlarges permanently and function improves", "Howell-Jolly bodies mean the spleen is hyperactive", "HbS is a quantitative globin-chain defect like thalassemia"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Sickle mechanism", "kind": "vignette"}$s1_39oo$,
  $s1_39no${"options": ["Deoxygenated HbS polymerizes; repeated infarcts destroy the spleen, and Howell-Jolly bodies appear", "Oxygenated HbS is the form that polymerizes and infarcts the spleen", "The spleen enlarges permanently, and its function improves after childhood", "Howell-Jolly bodies mean the spleen is hyperactive and clearing nuclear remnants", "HbS is a quantitative globin-chain defect, like thalassemia, and the spleen stays large"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Sickle mechanism", "kind": "vignette"}$s1_39no$,
  $s1_39oc$Deoxygenated HbS polymerizes; repeated infarcts autosplenectomize, which is why Howell-Jolly bodies appear and encapsulated bacteria are a risk$s1_39oc$,
  $s1_39nc$Deoxygenated HbS polymerizes; repeated infarcts destroy the spleen, and Howell-Jolly bodies appear$s1_39nc$,
  $s1_39oe$A point mutation makes valine replace glutamate. When oxygen comes off, HbS stacks and the cell sickles, especially in slow, acidic, deoxygenated capillary beds. The spleen is infarcted over childhood, function is lost, nuclear remnants stay in red cells, and Salmonella and pneumococcus become dangerous. Oxygenated hemoglobin does not polymerize. The spleen does not stay large and healthy. Howell-Jolly bodies mean the spleen is absent or not working. Sickle cell is a qualitative hemoglobin defect; thalassemia is quantitative.$s1_39oe$,
  $s1_39ne$A point mutation makes valine replace glutamate. When oxygen comes off, HbS stacks and the cell sickles, especially in slow, acidic, deoxygenated capillary beds. The spleen is infarcted over childhood, function is lost, nuclear remnants stay in red cells, and Salmonella and pneumococcus become dangerous. Oxygenated hemoglobin does not polymerize. The spleen does not stay large and healthy. Howell-Jolly bodies mean the spleen is absent or not working. Sickle cell is a qualitative hemoglobin defect; thalassemia is quantitative.$s1_39ne$,
  143, 58, 98, 87,
  2.465517, 1.126437
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_40id$49d92460-1bec-4c36-818b-1ac0f5e4ad02$s1_40id$,
  $s1_40st$usmle-step-1$s1_40st$,
  1,
  $s1_40oo${"options": ["Type I collagen is defective, so bone is brittle and sclerae are thin and blue; abuse must be considered but the systemic findings point to osteogenesis imperfecta", "Type III collagen, which causes hollow organs to rupture as the bone disease", "Type II collagen, the cartilage collagen of Stickler syndrome only", "Blue sclerae are diagnostic of copper deficiency", "Fractures with a genetic disease exclude any need to think about abuse"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteogenesis imperfecta", "kind": "vignette"}$s1_40oo$,
  $s1_40no${"options": ["Type I collagen is defective (brittle bone, blue sclerae); abuse must be considered, but the disease is systemic", "Type III collagen, which ruptures hollow organs and is the collagen missing in brittle bone with blue sclerae", "Type II collagen, the cartilage collagen of Stickler syndrome only", "Blue sclerae are diagnostic of copper deficiency and exclude a collagen disorder", "Fractures explained by a genetic disease remove any need to consider abuse"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteogenesis imperfecta", "kind": "vignette"}$s1_40no$,
  $s1_40oc$Type I collagen is defective, so bone is brittle and sclerae are thin and blue; abuse must be considered but the systemic findings point to osteogenesis imperfecta$s1_40oc$,
  $s1_40nc$Type I collagen is defective (brittle bone, blue sclerae); abuse must be considered, but the disease is systemic$s1_40nc$,
  $s1_40oe$Osteogenesis imperfecta is a type I collagen disease. Bone matrix is weak, sclerae show the choroid through thin collagen, teeth and hearing can fail. Multiple fractures raise abuse, and abuse is still considered, but blue sclerae, family pattern, and dental findings are the disease. Type III collagen is vascular Ehlers-Danlos, hollow-organ rupture. Type II is cartilage. Blue sclerae are not the copper-deficiency sign (that is Menkes kinky hair and vascular tortuosity). A genetic brittle-bone disease does not mean you never consider trauma; it means you do not stop there.$s1_40oe$,
  $s1_40ne$Osteogenesis imperfecta is a type I collagen disease. Bone matrix is weak, sclerae show the choroid through thin collagen, teeth and hearing can fail. Multiple fractures raise abuse, and abuse is still considered, but blue sclerae, family pattern, and dental findings are the disease. Type III collagen is vascular Ehlers-Danlos, hollow-organ rupture. Type II is cartilage. Blue sclerae are not the copper-deficiency sign (that is Menkes kinky hair and vascular tortuosity). A genetic brittle-bone disease does not mean you never consider trauma; it means you do not stop there.$s1_40ne$,
  163, 76, 112, 109,
  2.144737, 1.027523
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_41id$4c5b604c-c6c1-47f4-ae14-fe806c7ba16b$s1_41id$,
  $s1_41st$usmle-step-1$s1_41st$,
  1,
  $s1_41oo${"options": ["The kidney Gs protein does not answer PTH, so cAMP does not rise; the gene is imprinted and the maternal allele matters, so a parent can carry the phenotype with or without the biochemistry", "The parathyroids are absent, so PTH should be low", "Vitamin D poisoning explains the low calcium and high PTH", "This is hypoparathyroidism because the minerals match a low PTH patient", "Urinary cAMP should fall in normal people given PTH, so the test was misread"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Pseudohypoparathyroidism", "kind": "vignette"}$s1_41oo$,
  $s1_41no${"options": ["Renal Gs protein ignores PTH; imprinting lets the mother show the phenotype without the same labs", "The parathyroids are absent, so PTH should be low and a parent shares that low value", "Vitamin D poisoning explains the low calcium, the high PTH, and the short fourth metacarpals", "This is hypoparathyroidism, because the minerals match a patient with low PTH", "Urinary cAMP should fall in a normal person given PTH, so this test was misread"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Pseudohypoparathyroidism", "kind": "vignette"}$s1_41no$,
  $s1_41oc$The kidney Gs protein does not answer PTH, so cAMP does not rise; the gene is imprinted and the maternal allele matters, so a parent can carry the phenotype with or without the biochemistry$s1_41oc$,
  $s1_41nc$Renal Gs protein ignores PTH; imprinting lets the mother show the phenotype without the same labs$s1_41nc$,
  $s1_41oe$Pseudohypoparathyroidism type Ia is end-organ resistance. PTH is high and cannot lower phosphate or raise calcium, and exogenous PTH does not generate cAMP. Albright hereditary osteodystrophy can appear in relatives; GNAS imprinting means the maternal allele is the one that matters in the kidney, so family members can share the body habitus with different labs. Absent parathyroids would lower PTH, which is the post-surgical classmate. Vitamin D poisoning raises calcium. The minerals look like hypoparathyroidism but the high PTH is the separator. Normal kidneys increase cAMP when PTH is infused.$s1_41oe$,
  $s1_41ne$Pseudohypoparathyroidism type Ia is end-organ resistance. PTH is high and cannot lower phosphate or raise calcium, and exogenous PTH does not generate cAMP. Albright hereditary osteodystrophy can appear in relatives; GNAS imprinting means the maternal allele is the one that matters in the kidney, so family members can share the body habitus with different labs. Absent parathyroids would lower PTH, which is the post-surgical classmate. Vitamin D poisoning raises calcium. The minerals look like hypoparathyroidism but the high PTH is the separator. Normal kidneys increase cAMP when PTH is infused.$s1_41ne$,
  189, 76, 97, 92,
  2.486842, 1.054348
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_42id$4d3786dc-8831-40b8-9ca0-4ae7f57f97b2$s1_42id$,
  $s1_42st$usmle-step-1$s1_42st$,
  1,
  $s1_42oo${"options": ["Sulfonylureas keep potassium channels closed and insulin secretion going for many hours; glyburide is long-acting and renally cleared, so one glucose dose does not end the episode", "Glyburide wears off in minutes, so recurrent lows mean he took insulin secretly", "Dextrose stimulates further sulfonylurea release from the bottle, which is the mechanism", "Hypoglycemia from this class is impossible if he still has a pancreas", "Reduced kidney function shortens glyburide action"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sulfonylurea hypoglycemia", "kind": "vignette"}$s1_42oo$,
  $s1_42no${"options": ["Glyburide drives insulin release for many hours and is renally cleared, so one glucose dose does not end it", "Glyburide wears off in minutes, so recurrent lows mean he injected insulin secretly", "Dextrose pulls more sulfonylurea out of the tablet, which is why the glucose falls again", "Hypoglycemia from this class is impossible if he still has a pancreas", "Reduced kidney function shortens glyburide action, so one dose of glucose ends the hypoglycemic episode"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sulfonylurea hypoglycemia", "kind": "vignette"}$s1_42no$,
  $s1_42oc$Sulfonylureas keep potassium channels closed and insulin secretion going for many hours; glyburide is long-acting and renally cleared, so one glucose dose does not end the episode$s1_42oc$,
  $s1_42nc$Glyburide drives insulin release for many hours and is renally cleared, so one glucose dose does not end it$s1_42nc$,
  $s1_42oe$Sulfonylureas close the beta-cell K-ATP channel, calcium enters, and insulin is released regardless of the current glucose once the drug is on board. Glyburide lasts and accumulates when the kidneys fail, which is why it is a bad drug in older adults. He needs observation and repeated glucose, sometimes octreotide, not a doorway discharge. A short action would not explain the relapse. Dextrose does not release more tablets. The whole toxicity requires a pancreas that can still be forced to secrete. Low GFR prolongs, not shortens, the effect.$s1_42oe$,
  $s1_42ne$Sulfonylureas close the beta-cell K-ATP channel, calcium enters, and insulin is released regardless of the current glucose once the drug is on board. Glyburide lasts and accumulates when the kidneys fail, which is why it is a bad drug in older adults. He needs observation and repeated glucose, sometimes octreotide, not a doorway discharge. A short action would not explain the relapse. Dextrose does not release more tablets. The whole toxicity requires a pancreas that can still be forced to secrete. Low GFR prolongs, not shortens, the effect.$s1_42ne$,
  179, 88, 107, 103,
  2.034091, 1.038835
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_43id$5085a60e-5dfe-4841-a597-ef3d96bbfe51$s1_43id$,
  $s1_43st$usmle-step-1$s1_43st$,
  1,
  $s1_43oo${"options": ["GPI anchor, so decay-accelerating factor and MIRL are absent and complement lyses red cells, especially at night; hepatic-vein thrombosis is part of the disease", "Spectrin, so spherocytes thrombus", "CD55 excess causes the hemolysis", "Myoglobinuria is the morning pigment of PNH", "Complement inhibitors are increased"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "PNH", "kind": "vignette"}$s1_43oo$,
  $s1_43no${"options": ["Missing GPI anchor: decay-accelerating factor and MIRL are absent, so complement lyses red cells", "Spectrin is missing, so the red cells become spherocytes and thrombose in the hepatic vein", "Excess CD55 on the red cell causes the hemolysis, especially overnight", "Myoglobinuria is the dark morning urine of this complement-mediated hemolysis", "Complement-regulatory proteins are increased on the red-cell surface"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "PNH", "kind": "vignette"}$s1_43no$,
  $s1_43oc$GPI anchor, so decay-accelerating factor and MIRL are absent and complement lyses red cells, especially at night; hepatic-vein thrombosis is part of the disease$s1_43oc$,
  $s1_43nc$Missing GPI anchor: decay-accelerating factor and MIRL are absent, so complement lyses red cells$s1_43nc$,
  $s1_43oe$PNH is an acquired PIGA mutation. Without a GPI anchor, CD55 and CD59 are not on the cell, complement is not braked, and cells lyse. Acidosis of sleep activates complement, so urine is dark in the morning. The same clone thrombosies odd veins, including the hepatic vein, and the marrow often fails. Spectrin is hereditary spherocytosis. The proteins are missing, not in excess. The pigment is hemoglobin. Complement inhibition is lost, not increased.$s1_43oe$,
  $s1_43ne$PNH is an acquired PIGA mutation. Without a GPI anchor, CD55 and CD59 are not on the cell, complement is not braked, and cells lyse. Acidosis of sleep activates complement, so urine is dark in the morning. The same clone thrombosies odd veins, including the hepatic vein, and the marrow often fails. Spectrin is hereditary spherocytosis. The proteins are missing, not in excess. The pigment is hemoglobin. Complement inhibition is lost, not increased.$s1_43ne$,
  160, 43, 96, 90,
  3.720930, 1.066667
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_44id$50eb4e38-9304-43a4-ad39-f5e7359f114b$s1_44id$,
  $s1_44st$usmle-step-1$s1_44st$,
  1,
  $s1_44oo${"options": ["The boy has a frameshift that abolishes dystrophin; the cousin has a mutation that preserves the reading frame and leaves partial dystrophin", "Both have the same frameshift; severity is only how much they exercise", "The boy has a CTG repeat and the cousin has a GAA repeat", "Dystrophin is autosomal, so an uncle on the mother's side is unrelated", "The large calves mean the muscle protein is overproduced, so the gene is duplicated and working"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Duchenne versus Becker", "kind": "vignette"}$s1_44oo$,
  $s1_44no${"options": ["The boy has a frameshift that abolishes dystrophin; the cousin keeps the reading frame and some dystrophin", "Both have the same frameshift; severity is only how much they exercise", "The boy has a CTG repeat and the cousin has a GAA repeat in the same gene", "Dystrophin is autosomal, so a maternal uncle's illness is unrelated", "The large calves mean dystrophin is overproduced, so the gene is duplicated and working in both relatives"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Duchenne versus Becker", "kind": "vignette"}$s1_44no$,
  $s1_44oc$The boy has a frameshift that abolishes dystrophin; the cousin has a mutation that preserves the reading frame and leaves partial dystrophin$s1_44oc$,
  $s1_44nc$The boy has a frameshift that abolishes dystrophin; the cousin keeps the reading frame and some dystrophin$s1_44nc$,
  $s1_44oe$Dystrophin links actin to the extracellular matrix through the dystrophin-glycoprotein complex. A frameshifting deletion removes the protein and causes Duchenne muscular dystrophy, with early loss of walking. An in-frame deletion shortens the protein but leaves some function, which is Becker muscular dystrophy and a later wheelchair. Exercise does not choose the reading frame. CTG is myotonic dystrophy and GAA is Friedreich ataxia. The gene is on X, so a maternal uncle fits. Pseudohypertrophy is fat and fibrosis replacing muscle, not extra working dystrophin.$s1_44oe$,
  $s1_44ne$Dystrophin links actin to the extracellular matrix through the dystrophin-glycoprotein complex. A frameshifting deletion removes the protein and causes Duchenne muscular dystrophy, with early loss of walking. An in-frame deletion shortens the protein but leaves some function, which is Becker muscular dystrophy and a later wheelchair. Exercise does not choose the reading frame. CTG is myotonic dystrophy and GAA is Friedreich ataxia. The gene is on X, so a maternal uncle fits. Pseudohypertrophy is fat and fibrosis replacing muscle, not extra working dystrophin.$s1_44ne$,
  140, 95, 106, 105,
  1.473684, 1.009524
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_45id$5154e6d8-bf0e-44f0-b76c-90e0ff7fd4be$s1_45id$,
  $s1_45st$usmle-step-1$s1_45st$,
  1,
  $s1_45oo${"options": ["Lead inhibits ferrochelatase and ALA dehydratase; succimer is oral chelation for children and EDTA is used for more severe disease, while deferoxamine is the iron chelator", "Lead blocks globin synthesis only, so a chelator cannot help", "Deferoxamine is first-line for lead because both metals are divalent", "Basophilic stippling is specific for folate deficiency", "Wrist or foot drop means a central cord syrinx, not a neuropathy"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Lead poisoning", "kind": "vignette"}$s1_45oo$,
  $s1_45no${"options": ["Lead blocks ferrochelatase and ALA dehydratase; succimer or EDTA for lead, deferoxamine for iron", "Lead blocks globin synthesis only, so a chelator cannot help the anemia, the stippling, or the wrist drop", "Deferoxamine is first-line for lead because lead and iron are both divalent", "Basophilic stippling is specific for folate deficiency and is unrelated to lead", "Wrist or foot drop means a central cord syrinx, not a lead neuropathy"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Lead poisoning", "kind": "vignette"}$s1_45no$,
  $s1_45oc$Lead inhibits ferrochelatase and ALA dehydratase; succimer is oral chelation for children and EDTA is used for more severe disease, while deferoxamine is the iron chelator$s1_45oc$,
  $s1_45nc$Lead blocks ferrochelatase and ALA dehydratase; succimer or EDTA for lead, deferoxamine for iron$s1_45nc$,
  $s1_45oe$Lead blocks heme synthesis at ALA dehydratase and ferrochelatase, so protoporphyrin builds and stippled red cells appear. The neuropathy is motor, classically wrist or foot drop, with abdominal pain and constipation. Succimer is the oral chelator used in children; calcium EDTA is for higher burdens. Deferoxamine chelates iron, not lead. The anemia is a production problem, not iron overload. Stippling is classic for lead, not the smear of folate deficiency. A syrinx is a central-cord sensory cape, not this systemic picture.$s1_45oe$,
  $s1_45ne$Lead blocks heme synthesis at ALA dehydratase and ferrochelatase, so protoporphyrin builds and stippled red cells appear. The neuropathy is motor, classically wrist or foot drop, with abdominal pain and constipation. Succimer is the oral chelator used in children; calcium EDTA is for higher burdens. Deferoxamine chelates iron, not lead. The anemia is a production problem, not iron overload. Stippling is classic for lead, not the smear of folate deficiency. A syrinx is a central-cord sensory cape, not this systemic picture.$s1_45ne$,
  171, 68, 96, 105,
  2.514706, 0.914286
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_46id$57876fff-a386-4625-9f15-fd435047a064$s1_46id$,
  $s1_46st$usmle-step-1$s1_46st$,
  1,
  $s1_46oo${"options": ["The right oculomotor nerve against the tentorium; Cushing triad means rising intracranial pressure and brainstem compression", "The left oculomotor nerve, because herniation always dilates the opposite pupil", "The right abducens nerve, which carries the parasympathetic pupil fibers", "Isolated cortical blindness, which dilates one pupil and slows the pulse", "A Horner syndrome, which dilates the ipsilateral pupil"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Uncal herniation", "kind": "vignette"}$s1_46oo$,
  $s1_46no${"options": ["Right oculomotor nerve at the tentorium; Cushing triad means rising pressure and brainstem compression", "The left oculomotor nerve, because uncal herniation always dilates the pupil on the opposite side", "The right abducens nerve, which carries the parasympathetic fibers to the pupil", "Isolated cortical blindness, which dilates one pupil and slows the pulse", "A Horner syndrome, which dilates the ipsilateral pupil as pressure rises"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Uncal herniation", "kind": "vignette"}$s1_46no$,
  $s1_46oc$The right oculomotor nerve against the tentorium; Cushing triad means rising intracranial pressure and brainstem compression$s1_46oc$,
  $s1_46nc$Right oculomotor nerve at the tentorium; Cushing triad means rising pressure and brainstem compression$s1_46nc$,
  $s1_46oe$The uncus of the temporal lobe herniates through the tentorial notch and compresses the ipsilateral third nerve, so the pupil on the side of the mass dilates first. Hypertension and bradycardia are the Cushing response to brainstem ischemia from high intracranial pressure, a late and dangerous sign. The contralateral pupil is the trap; the first dilated pupil is ipsilateral. The abducens nerve does not carry pupillary parasympathetics. Cortical blindness does not fix one pupil or cause Cushing physiology. Horner syndrome constricts the pupil and adds ptosis and anhidrosis; it does not dilate it.$s1_46oe$,
  $s1_46ne$The uncus of the temporal lobe herniates through the tentorial notch and compresses the ipsilateral third nerve, so the pupil on the side of the mass dilates first. Hypertension and bradycardia are the Cushing response to brainstem ischemia from high intracranial pressure, a late and dangerous sign. The contralateral pupil is the trap; the first dilated pupil is ipsilateral. The abducens nerve does not carry pupillary parasympathetics. Cortical blindness does not fix one pupil or cause Cushing physiology. Horner syndrome constricts the pupil and adds ptosis and anhidrosis; it does not dilate it.$s1_46ne$,
  124, 79, 102, 97,
  1.569620, 1.051546
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_47id$57eb0be0-bb67-4eca-a021-8c87e739e237$s1_47id$,
  $s1_47st$usmle-step-1$s1_47st$,
  1,
  $s1_47oo${"options": ["Muscle and nerve inside a closed compartment are ischemic at pressures well below arterial pressure, so pulses can remain; pain on passive stretch is the sign to open the cast and the fascia", "Absent pulses are required before fasciotomy", "Pain relieved by a reasonable opioid dose excludes compartment syndrome", "The artery is blocked, which is why pulses stay normal", "Stretching the toes should relieve ischemic muscle pain"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Compartment syndrome", "kind": "vignette"}$s1_47oo$,
  $s1_47no${"options": ["Muscle and nerve are ischemic below arterial pressure, so pulses can remain; stretch pain means open the cast and the fascia", "Absent distal pulses are required before fasciotomy, and pain on passive stretch is a late unreliable sign", "Pain that responds to a reasonable opioid dose excludes compartment syndrome", "The artery itself is occluded, which is why the distal pulses stay palpable", "Passive stretch of the toes should relieve ischemic pain inside a tight cast"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Compartment syndrome", "kind": "vignette"}$s1_47no$,
  $s1_47oc$Muscle and nerve inside a closed compartment are ischemic at pressures well below arterial pressure, so pulses can remain; pain on passive stretch is the sign to open the cast and the fascia$s1_47oc$,
  $s1_47nc$Muscle and nerve are ischemic below arterial pressure, so pulses can remain; stretch pain means open the cast and the fascia$s1_47nc$,
  $s1_47oe$Compartment pressure can collapse capillaries and kill muscle while arterial pulses persist, because arterial pressure is higher than the compartment. Pain out of proportion and pain on passive stretch come first; pulselessness is late. Waiting for a lost pulse waits too long. Opioids that do not touch the pain are a clue, not a treatment. Pulses are present precisely because the artery is not yet occluded. Passive stretch hurts; it does not relieve the ischemia.$s1_47oe$,
  $s1_47ne$Compartment pressure can collapse capillaries and kill muscle while arterial pulses persist, because arterial pressure is higher than the compartment. Pain out of proportion and pain on passive stretch come first; pulselessness is late. Waiting for a lost pulse waits too long. Opioids that do not touch the pain are a clue, not a treatment. Pulses are present precisely because the artery is not yet occluded. Passive stretch hurts; it does not relieve the ischemia.$s1_47ne$,
  190, 71, 124, 106,
  2.676056, 1.169811
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_48id$59b762c4-e85b-4453-88bb-8cd17f47d42f$s1_48id$,
  $s1_48st$usmle-step-1$s1_48st$,
  1,
  $s1_48oo${"options": ["Cancer begins in the peripheral zone and sends osteoblastic metastases; BPH is transitional zone and is not a hard nodule", "Cancer is transitional and BPH is peripheral", "Prostate metastases are purely lytic", "A rubbery symmetric gland is cancer", "PSA rises only in BPH and falls in cancer"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Prostate cancer versus BPH zone", "kind": "vignette"}$s1_48oo$,
  $s1_48no${"options": ["Cancer begins in the peripheral zone and sends osteoblastic metastases; BPH is transitional zone", "Cancer is transitional-zone and BPH is peripheral, and the metastases are osteolytic", "Prostate metastases are purely lytic and arise from a rubbery symmetric gland", "A rubbery symmetric gland is cancer and produces blastic bone lesions", "PSA rises only in BPH and falls once a peripheral-zone cancer develops"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Prostate cancer versus BPH zone", "kind": "vignette"}$s1_48no$,
  $s1_48oc$Cancer begins in the peripheral zone and sends osteoblastic metastases; BPH is transitional zone and is not a hard nodule$s1_48oc$,
  $s1_48nc$Cancer begins in the peripheral zone and sends osteoblastic metastases; BPH is transitional zone$s1_48nc$,
  $s1_48oe$Adenocarcinoma arises in the peripheral zone, where a finger feels it, and it metastasizes as osteoblastic (sclerotic) bone lesions. BPH is nodular hyperplasia of the transitional zone around the urethra, causing obstructive symptoms with a rubbery gland. The zones are not the same. Prostate cancer in bone is classically blastic, unlike the lytic lesions of many other cancers. A hard nodule is cancer until proven otherwise; rubbery symmetry is hyperplasia. PSA can rise in both, and it rises in cancer.$s1_48oe$,
  $s1_48ne$Adenocarcinoma arises in the peripheral zone, where a finger feels it, and it metastasizes as osteoblastic (sclerotic) bone lesions. BPH is nodular hyperplasia of the transitional zone around the urethra, causing obstructive symptoms with a rubbery gland. The zones are not the same. Prostate cancer in bone is classically blastic, unlike the lytic lesions of many other cancers. A hard nodule is cancer until proven otherwise; rubbery symmetry is hyperplasia. PSA can rise in both, and it rises in cancer.$s1_48ne$,
  121, 44, 96, 84,
  2.750000, 1.142857
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_49id$5b9381e5-4c62-445e-b33e-e6d02c1a14b6$s1_49id$,
  $s1_49st$usmle-step-1$s1_49st$,
  1,
  $s1_49oo${"options": ["Projection: he attributes his own unacceptable impulse to others. It is not displacement, which would move the feeling onto a safer target, and not dissociation", "Displacement onto the dean, because the dean is a symbol of the exam", "Reaction formation, because he is doing the opposite of cheating by reporting others", "Sublimation, because accusing others is a socially useful act", "Altruism, because he is protecting the class"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Projection as a trap", "kind": "vignette"}$s1_49oo$,
  $s1_49no${"options": ["Projection: he assigns his own unacceptable impulse to others. It is not displacement or dissociation", "Displacement onto the dean, because the dean stands in for the exam", "Reaction formation, because reporting others is the opposite of his wish to cheat", "Sublimation, because accusing classmates of cheating turns the impulse into a socially useful act", "Altruism, because he is protecting the rest of the class from cheaters"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Projection as a trap", "kind": "vignette"}$s1_49no$,
  $s1_49oc$Projection: he attributes his own unacceptable impulse to others. It is not displacement, which would move the feeling onto a safer target, and not dissociation$s1_49oc$,
  $s1_49nc$Projection: he assigns his own unacceptable impulse to others. It is not displacement or dissociation$s1_49nc$,
  $s1_49oe$Projection puts one's own unacceptable wish or act onto other people. The student deals with his cheating by experiencing other people as the cheaters. Displacement would shift the anger at himself onto a safer person while still owning the feeling's source more honestly; that is not this accusation. Reaction formation would have him behaving with exaggerated honesty, not accusing the room. Sublimation turns an impulse into a valued activity such as art or work, not a false accusation. Altruism serves someone else's welfare; this serves his own guilt.$s1_49oe$,
  $s1_49ne$Projection puts one's own unacceptable wish or act onto other people. The student deals with his cheating by experiencing other people as the cheaters. Displacement would shift the anger at himself onto a safer person while still owning the feeling's source more honestly; that is not this accusation. Reaction formation would have him behaving with exaggerated honesty, not accusing the room. Sublimation turns an impulse into a valued activity such as art or work, not a false accusation. Altruism serves someone else's welfare; this serves his own guilt.$s1_49ne$,
  160, 84, 101, 97,
  1.904762, 1.041237
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_50id$5c902210-02e9-4c47-a4e1-18d486917f26$s1_50id$,
  $s1_50st$usmle-step-1$s1_50st$,
  1,
  $s1_50oo${"options": ["HLA-B27; the entheses and sacroiliac joints are inflamed, and activity helps, whereas a disc is worse with sitting and flexion and is not a systemic eye disease", "HLA-DR4, the rheumatoid association, as the cause of sacroiliitis", "Rest is the treatment of inflammatory back pain", "Anterior uveitis means infection, so the back pain is septic", "Reduced chest expansion is asthma, unrelated to the spine"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Ankylosing spondylitis", "kind": "vignette"}$s1_50oo$,
  $s1_50no${"options": ["HLA-B27 with enthesitis and sacroiliitis; activity helps, so rest is the wrong plan", "HLA-DR4, the rheumatoid association, is the driver of this sacroiliitis", "Rest is the treatment of inflammatory back pain and of sacroiliac enthesitis", "Anterior uveitis means infection, so the back pain is septic arthritis of the spine", "Reduced chest expansion is asthma and is unrelated to the spine"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Ankylosing spondylitis", "kind": "vignette"}$s1_50no$,
  $s1_50oc$HLA-B27; the entheses and sacroiliac joints are inflamed, and activity helps, whereas a disc is worse with sitting and flexion and is not a systemic eye disease$s1_50oc$,
  $s1_50nc$HLA-B27 with enthesitis and sacroiliitis; activity helps, so rest is the wrong plan$s1_50nc$,
  $s1_50oe$Ankylosing spondylitis is an HLA-B27 spondyloarthritis. Inflammation is at entheses and the sacroiliac joints, morning stiffness improves with use, and anterior uveitis is the eye clue. Costovertebral fusion limits chest expansion. A disc herniation is mechanical, worse with flexion and sitting, and has no uveitis. HLA-DR4 is rheumatoid arthritis, a peripheral synovial disease. Bed rest stiffens inflammatory back pain further. One red eye in this pattern is uveitis, not a reason to call the spine septic. The chest finding is thoracic spine and rib joint fusion.$s1_50oe$,
  $s1_50ne$Ankylosing spondylitis is an HLA-B27 spondyloarthritis. Inflammation is at entheses and the sacroiliac joints, morning stiffness improves with use, and anterior uveitis is the eye clue. Costovertebral fusion limits chest expansion. A disc herniation is mechanical, worse with flexion and sitting, and has no uveitis. HLA-DR4 is rheumatoid arthritis, a peripheral synovial disease. Bed rest stiffens inflammatory back pain further. One red eye in this pattern is uveitis, not a reason to call the spine septic. The chest finding is thoracic spine and rib joint fusion.$s1_50ne$,
  160, 65, 83, 83,
  2.461538, 1.000000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_51id$5e58ea9a-9fb5-44e9-9199-2883ff3ccca9$s1_51id$,
  $s1_51st$usmle-step-1$s1_51st$,
  1,
  $s1_51oo${"options": ["A is Broca in the dominant frontal lobe; B is Wernicke in the superior temporal gyrus; D is alexia without agraphia from a splenium lesion disconnecting the right visual cortex from the left language areas", "A is Wernicke and B is Broca, because effort means poor comprehension", "C is global aphasia because repetition failed", "D must have a blind eye, because writing can be preserved only if reading is preserved", "All four are conduction aphasia in the arcuate fasciculus"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Aphasia types", "kind": "vignette"}$s1_51oo$,
  $s1_51no${"options": ["A is Broca (dominant frontal); B is Wernicke (superior temporal); D is alexia without agraphia from the splenium", "A is Wernicke and B is Broca, because effortful speech means the comprehension cortex is the part that failed", "C is global aphasia because repetition failed while naming was effortful", "D must have a blind eye, because writing can be preserved only if reading is preserved", "All four are conduction aphasia from a single lesion of the arcuate fasciculus"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Aphasia types", "kind": "vignette"}$s1_51no$,
  $s1_51oc$A is Broca in the dominant frontal lobe; B is Wernicke in the superior temporal gyrus; D is alexia without agraphia from a splenium lesion disconnecting the right visual cortex from the left language areas$s1_51oc$,
  $s1_51nc$A is Broca (dominant frontal); B is Wernicke (superior temporal); D is alexia without agraphia from the splenium$s1_51nc$,
  $s1_51oe$Broca aphasia is nonfluent with spared comprehension, frontal. Wernicke aphasia is fluent and empty with poor comprehension, temporal. Conduction aphasia, patient C, is the arcuate fasciculus: fluent, understands, cannot repeat. Alexia without agraphia happens when a left PCA stroke takes the left visual cortex and the splenium, so words seen by the right hemisphere cannot reach the left language network, while writing, which does not need that incoming visual path, survives. Swapping Broca and Wernicke ignores fluency. Failed repetition alone is not global aphasia; global aphasia loses fluency and comprehension too. Writing can outlast reading in that disconnection. One fasciculus does not explain all four patterns.$s1_51oe$,
  $s1_51ne$Broca aphasia is nonfluent with spared comprehension, frontal. Wernicke aphasia is fluent and empty with poor comprehension, temporal. Conduction aphasia, patient C, is the arcuate fasciculus: fluent, understands, cannot repeat. Alexia without agraphia happens when a left PCA stroke takes the left visual cortex and the splenium, so words seen by the right hemisphere cannot reach the left language network, while writing, which does not need that incoming visual path, survives. Swapping Broca and Wernicke ignores fluency. Failed repetition alone is not global aphasia; global aphasia loses fluency and comprehension too. Writing can outlast reading in that disconnection. One fasciculus does not explain all four patterns.$s1_51ne$,
  205, 86, 112, 109,
  2.383721, 1.027523
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_52id$5ee987bf-3c91-456e-9830-92d5133540a7$s1_52id$,
  $s1_52st$usmle-step-1$s1_52st$,
  1,
  $s1_52oo${"options": ["An anamnestic IgG against a minor red-cell antigen, too low to detect on the crossmatch, rose over days and caused extravascular hemolysis", "ABO IgM, which always waits a week", "TRALI, because the hemoglobin fell", "The crossmatch would have been incompatible if any antibody memory existed", "A positive direct antiglobulin test a week later means the unit was never given"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Delayed hemolytic transfusion", "kind": "vignette"}$s1_52oo$,
  $s1_52no${"options": ["Anamnestic IgG against a minor antigen was missed on the crossmatch and then caused extravascular hemolysis", "ABO IgM, which always waits several days and then hemolyzes outside the vessels", "TRALI, because the hemoglobin fell after a compatible crossmatch", "The crossmatch would have been incompatible if any antibody memory had existed", "A positive direct antiglobulin test a week later means the unit was never transfused and hemolysis is unrelated"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Delayed hemolytic transfusion", "kind": "vignette"}$s1_52no$,
  $s1_52oc$An anamnestic IgG against a minor red-cell antigen, too low to detect on the crossmatch, rose over days and caused extravascular hemolysis$s1_52oc$,
  $s1_52nc$Anamnestic IgG against a minor antigen was missed on the crossmatch and then caused extravascular hemolysis$s1_52nc$,
  $s1_52oe$Delayed hemolytic reactions are memory IgG against antigens such as Kidd or Duffy. The titer was below detection at the crossmatch, exposure boosts it, and days later coated cells are removed outside the vessels. It is not the immediate intravascular ABO disaster. ABO IgM acts in minutes. TRALI is pulmonary edema, not a falling hemoglobin with a positive Coombs test. A negative crossmatch does not prove there was never any memory; the antibody can be below the threshold. The positive direct antiglobulin test is the coated donor cells still circulating.$s1_52oe$,
  $s1_52ne$Delayed hemolytic reactions are memory IgG against antigens such as Kidd or Duffy. The titer was below detection at the crossmatch, exposure boosts it, and days later coated cells are removed outside the vessels. It is not the immediate intravascular ABO disaster. ABO IgM acts in minutes. TRALI is pulmonary edema, not a falling hemoglobin with a positive Coombs test. A negative crossmatch does not prove there was never any memory; the antibody can be below the threshold. The positive direct antiglobulin test is the coated donor cells still circulating.$s1_52ne$,
  138, 79, 107, 111,
  1.746835, 0.963964
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_53id$6096dcfb-250b-4bde-aeb6-0b26894cea5f$s1_53id$,
  $s1_53st$usmle-step-1$s1_53st$,
  1,
  $s1_53oo${"options": ["Blocking beta-2 vasodilation while alpha constriction is unopposed raises pressure; phenoxybenzamine or another alpha block comes before any beta blocker", "Beta blockers are the first and only preoperative drug", "Alpha blockade would worsen the tachycardia and is saved for after removal", "Metanephrines are a thyroid marker, so this is a thyroid storm protocol", "The pressure rise means the tumor is not catecholamine-secreting"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Pheochromocytoma before beta blocker", "kind": "vignette"}$s1_53oo$,
  $s1_53no${"options": ["Unopposed alpha constriction raised the pressure; an alpha blocker comes before any beta blocker", "Beta blockers are the first and only preoperative drug for this tumor", "Alpha blockade would worsen the tachycardia and is withheld until after the tumor is out", "Metanephrines are a thyroid marker, so this follows a thyroid-storm sequence", "The pressure rise means the tumor is not secreting catecholamines"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Pheochromocytoma before beta blocker", "kind": "vignette"}$s1_53no$,
  $s1_53oc$Blocking beta-2 vasodilation while alpha constriction is unopposed raises pressure; phenoxybenzamine or another alpha block comes before any beta blocker$s1_53oc$,
  $s1_53nc$Unopposed alpha constriction raised the pressure; an alpha blocker comes before any beta blocker$s1_53nc$,
  $s1_53oe$Pheochromocytoma pours out epinephrine and norepinephrine. Alpha receptors constrict; beta-2 receptors dilate in some beds. If you block beta first, dilation is lost and alpha constriction is unopposed, so pressure climbs. Irreversible alpha blockade, volume replacement, then a beta blocker if the heart rate needs it, is the order. Beta blockade is not the opening drug. Alpha blockade is preoperative, not something you skip until the gland is out. Metanephrines are catecholamine metabolites, not a thyroid test. The rise is exactly what a catecholamine tumor does when beta-blocked first.$s1_53oe$,
  $s1_53ne$Pheochromocytoma pours out epinephrine and norepinephrine. Alpha receptors constrict; beta-2 receptors dilate in some beds. If you block beta first, dilation is lost and alpha constriction is unopposed, so pressure climbs. Irreversible alpha blockade, volume replacement, then a beta blocker if the heart rate needs it, is the order. Beta blockade is not the opening drug. Alpha blockade is preoperative, not something you skip until the gland is out. Metanephrines are catecholamine metabolites, not a thyroid test. The rise is exactly what a catecholamine tumor does when beta-blocked first.$s1_53ne$,
  153, 74, 96, 88,
  2.067568, 1.090909
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_54id$6285434c-ffa7-41bf-8af4-ae7785749e05$s1_54id$,
  $s1_54st$usmle-step-1$s1_54st$,
  1,
  $s1_54oo${"options": ["A GnRH agonist first stimulates LH and testosterone, then downregulates the receptor; an antiandrogen covers the flare, and testosterone gel is the disease", "Leuprolide blocks the androgen receptor from the first dose", "The flare means the tumor is hormone-insensitive and the drug should stop", "Testosterone gel is the antidote to a GnRH agonist", "Continuous GnRH raises LH forever"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Leuprolide flare", "kind": "vignette"}$s1_54oo$,
  $s1_54no${"options": ["A GnRH agonist first raises LH and testosterone, then downregulates; testosterone gel would feed the tumor", "Leuprolide blocks the androgen receptor from the first dose and prevents the early rise in testosterone", "The early flare means the tumor is hormone-insensitive, so the agonist should be stopped", "Testosterone gel is the antidote to a GnRH agonist and should be added during the flare", "Continuous GnRH stimulation raises LH for as long as the drug is given"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Leuprolide flare", "kind": "vignette"}$s1_54no$,
  $s1_54oc$A GnRH agonist first stimulates LH and testosterone, then downregulates the receptor; an antiandrogen covers the flare, and testosterone gel is the disease$s1_54oc$,
  $s1_54nc$A GnRH agonist first raises LH and testosterone, then downregulates; testosterone gel would feed the tumor$s1_54nc$,
  $s1_54oe$Pulsatile GnRH raises LH. Continuous GnRH agonist first flares LH and testosterone, then the receptor downregulates and testosterone falls to castrate levels. The first week can hurt bone metastases, so an androgen-receptor blocker is used as cover. Stopping the drug for the expected flare loses the later suppression. Leuprolide is not a receptor blocker. The flare does not prove hormone resistance. Testosterone gel feeds the cancer. Continuous exposure does not raise LH forever; that is the pulsatile pattern.$s1_54oe$,
  $s1_54ne$Pulsatile GnRH raises LH. Continuous GnRH agonist first flares LH and testosterone, then the receptor downregulates and testosterone falls to castrate levels. The first week can hurt bone metastases, so an androgen-receptor blocker is used as cover. Stopping the drug for the expected flare loses the later suppression. Leuprolide is not a receptor blocker. The flare does not prove hormone resistance. Testosterone gel feeds the cancer. Continuous exposure does not raise LH forever; that is the pulsatile pattern.$s1_54ne$,
  155, 73, 106, 103,
  2.123288, 1.029126
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_55id$6301a847-1a9c-4135-96ba-fe35c4888f10$s1_55id$,
  $s1_55st$usmle-step-1$s1_55st$,
  1,
  $s1_55oo${"options": ["AFP is yolk sac; seminoma is the radiosensitive homogeneous tumor and does not raise AFP; choriocarcinoma raises beta-hCG", "Seminoma raises AFP and is radioresistant", "Choriocarcinoma raises AFP and not hCG", "Yolk sac tumors raise beta-hCG only", "A painless mass is infection, so markers are irrelevant"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Testicular tumor markers", "kind": "vignette"}$s1_55oo$,
  $s1_55no${"options": ["AFP marks yolk sac; seminoma is the radiosensitive homogeneous tumor and does not raise AFP", "Seminoma raises AFP and is radioresistant, while yolk sac is the radiosensitive element", "Choriocarcinoma raises AFP and not hCG, and it is the radiosensitive germ-cell tumor", "Yolk sac tumors raise beta-hCG and are the radiosensitive germ-cell tumor", "A painless testicular mass is infection, so serum markers do not change the diagnosis"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Testicular tumor markers", "kind": "vignette"}$s1_55no$,
  $s1_55oc$AFP is yolk sac; seminoma is the radiosensitive homogeneous tumor and does not raise AFP; choriocarcinoma raises beta-hCG$s1_55oc$,
  $s1_55nc$AFP marks yolk sac; seminoma is the radiosensitive homogeneous tumor and does not raise AFP$s1_55nc$,
  $s1_55oe$Seminoma is a germ-cell tumor of uniform cells, often radiosensitive, and AFP stays normal; if AFP is up, a nonseminomatous element is present. Yolk sac tumor makes AFP. Choriocarcinoma makes beta-hCG and bleeds. They are not one marker and one treatment. Seminoma does not raise AFP. Choriocarcinoma is the hCG tumor. Yolk sac is AFP. A painless testicular mass in a young man is cancer until proven otherwise.$s1_55oe$,
  $s1_55ne$Seminoma is a germ-cell tumor of uniform cells, often radiosensitive, and AFP stays normal; if AFP is up, a nonseminomatous element is present. Yolk sac tumor makes AFP. Choriocarcinoma makes beta-hCG and bleeds. They are not one marker and one treatment. Seminoma does not raise AFP. Choriocarcinoma is the hCG tumor. Yolk sac is AFP. A painless testicular mass in a young man is cancer until proven otherwise.$s1_55ne$,
  121, 55, 91, 87,
  2.200000, 1.045977
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_56id$63abd899-7d89-49e9-b331-814de6dcffa4$s1_56id$,
  $s1_56st$usmle-step-1$s1_56st$,
  1,
  $s1_56oo${"options": ["Both are pauci-immune ANCA vasculitides; lupus nephritis has immune deposits. Granulomas and sinus disease separate GPA from microscopic polyangiitis", "Both have dense subepithelial deposits", "p-ANCA is specific for GPA", "Microscopic polyangiitis is a large-vessel disease", "C-ANCA targets myeloperoxidase"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "GPA versus microscopic polyangiitis", "kind": "vignette"}$s1_56oo$,
  $s1_56no${"options": ["Immune deposits are absent; both are pauci-immune ANCA vasculitides, unlike lupus nephritis", "Both show dense subepithelial deposits, the immunofluorescence pattern of lupus nephritis", "p-ANCA is specific for granulomatosis with polyangiitis and predicts heavy immune deposits", "Microscopic polyangiitis is a large-vessel disease and deposits immune complexes", "C-ANCA targets myeloperoxidase and lines the glomerulus with IgG"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "GPA versus microscopic polyangiitis", "kind": "vignette"}$s1_56no$,
  $s1_56oc$Both are pauci-immune ANCA vasculitides; lupus nephritis has immune deposits. Granulomas and sinus disease separate GPA from microscopic polyangiitis$s1_56oc$,
  $s1_56nc$Immune deposits are absent; both are pauci-immune ANCA vasculitides, unlike lupus nephritis$s1_56nc$,
  $s1_56oe$ANCA vasculitides injure small vessels without much immunoglobulin in the tissue, which is pauci-immune, unlike lupus. GPA adds necrotizing granulomas of the respiratory tract and is usually PR3/c-ANCA. Microscopic polyangiitis is the same-sized vessels without granulomas and is usually MPO/p-ANCA. Dense deposits are immune-complex disease. p-ANCA is the MPA/eosinophilic pattern more than GPA. These are small vessels, not the aorta. c-ANCA is PR3, not MPO.$s1_56oe$,
  $s1_56ne$ANCA vasculitides injure small vessels without much immunoglobulin in the tissue, which is pauci-immune, unlike lupus. GPA adds necrotizing granulomas of the respiratory tract and is usually PR3/c-ANCA. Microscopic polyangiitis is the same-sized vessels without granulomas and is usually MPO/p-ANCA. Dense deposits are immune-complex disease. p-ANCA is the MPA/eosinophilic pattern more than GPA. These are small vessels, not the aorta. c-ANCA is PR3, not MPO.$s1_56ne$,
  149, 50, 91, 90,
  2.980000, 1.011111
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_57id$64b837a6-12c5-4422-95fb-fd089bc14a3f$s1_57id$,
  $s1_57st$usmle-step-1$s1_57st$,
  1,
  $s1_57oo${"options": ["A has normally mineralized bone that is simply less of it; B has osteoid that never mineralized because vitamin D and mineral were short", "Both have unmineralized osteoid", "A has osteomalacia because the T-score is low", "B has osteoporosis because calcium is low", "PTH is low in vitamin D deficiency"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteoporosis versus osteomalacia", "kind": "vignette"}$s1_57oo$,
  $s1_57no${"options": ["A is normally mineralized bone that is simply reduced in amount; B is osteoid that never mineralized", "Both specimens are unmineralized osteoid, and a low T-score means mineralization failed in each", "A is osteomalacia because the T-score is low and the matrix did not take up mineral", "B is osteoporosis because the calcium is low and the osteoid is fully mineralized", "PTH is low in vitamin D deficiency, and both matrices fail to mineralize"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteoporosis versus osteomalacia", "kind": "vignette"}$s1_57no$,
  $s1_57oc$A has normally mineralized bone that is simply less of it; B has osteoid that never mineralized because vitamin D and mineral were short$s1_57oc$,
  $s1_57nc$A is normally mineralized bone that is simply reduced in amount; B is osteoid that never mineralized$s1_57nc$,
  $s1_57oe$Osteoporosis is less bone of normal composition, so calcium and phosphate labs are normal and the T-score is low; fractures are vertebral and hip. Osteomalacia is soft bone: vitamin D deficiency drops calcium and phosphate, PTH rises, and osteoid does not mineralize, with Looser zones. They are not the same lecture. A low T-score without mineral abnormalities is osteoporosis, not osteomalacia. Low calcium is the osteomalacia direction, not the definition of osteoporosis. Vitamin D deficiency raises PTH; it does not suppress it.$s1_57oe$,
  $s1_57ne$Osteoporosis is less bone of normal composition, so calcium and phosphate labs are normal and the T-score is low; fractures are vertebral and hip. Osteomalacia is soft bone: vitamin D deficiency drops calcium and phosphate, PTH rises, and osteoid does not mineralize, with Looser zones. They are not the same lecture. A low T-score without mineral abnormalities is osteoporosis, not osteomalacia. Low calcium is the osteomalacia direction, not the definition of osteoporosis. Vitamin D deficiency raises PTH; it does not suppress it.$s1_57ne$,
  136, 45, 100, 95,
  3.022222, 1.052632
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_58id$66674dfe-6cd5-486d-9192-8dc37700cd77$s1_58id$,
  $s1_58st$usmle-step-1$s1_58st$,
  1,
  $s1_58oo${"options": ["The first has rebound hyperglycemia after nocturnal hypoglycemia, so night insulin should fall; the second has a dawn rise in counter-regulatory hormones and may need more basal insulin", "Both need a higher bedtime dose", "The 3 a.m. low means the dawn phenomenon and more insulin", "The 3 a.m. high means rebound from an unmeasured low", "Morning highs are always from too little dinner carbohydrate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Somogyi versus dawn", "kind": "vignette"}$s1_58oo$,
  $s1_58no${"options": ["The first rebounded from a nocturnal low, so less night insulin; the second is a dawn rise and may need more basal insulin", "Both patterns need a higher bedtime dose, because each morning high is the rebound from an overnight low that was missed", "The 3 a.m. low is the dawn phenomenon and calls for more insulin that night", "The 3 a.m. high is rebound from an unmeasured low, so the bedtime dose should fall", "Morning highs are always from too little carbohydrate at dinner, so the insulin doses stay fixed"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Somogyi versus dawn", "kind": "vignette"}$s1_58no$,
  $s1_58oc$The first has rebound hyperglycemia after nocturnal hypoglycemia, so night insulin should fall; the second has a dawn rise in counter-regulatory hormones and may need more basal insulin$s1_58oc$,
  $s1_58nc$The first rebounded from a nocturnal low, so less night insulin; the second is a dawn rise and may need more basal insulin$s1_58nc$,
  $s1_58oe$The Somogyi effect is overnight hypoglycemia followed by counter-regulatory hormones that overshoot, so the morning glucose is high because the night dose was too strong. You lower it. The dawn phenomenon is an early-morning growth-hormone and cortisol rise with no preceding low, so basal insulin may need to go up. Raising both doses would worsen the first patient's nights. A 3 a.m. low is not the dawn phenomenon. A 3 a.m. high was never a hidden low. Dinner carbohydrate is not the separator these two clock times provide.$s1_58oe$,
  $s1_58ne$The Somogyi effect is overnight hypoglycemia followed by counter-regulatory hormones that overshoot, so the morning glucose is high because the night dose was too strong. You lower it. The dawn phenomenon is an early-morning growth-hormone and cortisol rise with no preceding low, so basal insulin may need to go up. Raising both doses would worsen the first patient's nights. A 3 a.m. low is not the dawn phenomenon. A 3 a.m. high was never a hidden low. Dinner carbohydrate is not the separator these two clock times provide.$s1_58ne$,
  185, 60, 122, 120,
  3.083333, 1.016667
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_59id$68451525-fe8c-4029-bcbd-85d9bb799585$s1_59id$,
  $s1_59st$usmle-step-1$s1_59st$,
  1,
  $s1_59oo${"options": ["The liver lacks thiophorase (succinyl-CoA:acetoacetate CoA transferase), so it cannot turn acetoacetate into acetoacetyl-CoA", "The liver lacks HMG-CoA synthase, so it cannot make ketones", "Muscle is the only tissue that makes ketone bodies", "The brain cannot use ketones at any time", "Ketogenesis is turned on by insulin"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Ketone use", "kind": "vignette"}$s1_59oo$,
  $s1_59no${"options": ["The liver lacks thiophorase, so it cannot convert acetoacetate to acetoacetyl-CoA", "The liver lacks HMG-CoA synthase, so it cannot make ketone bodies or oxidize them", "Muscle is the only tissue that makes ketone bodies, and the liver is their main consumer", "The brain cannot use ketones at any time, so the liver has to oxidize what it exports", "Ketogenesis is switched on by insulin and switched off by fasting"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Ketone use", "kind": "vignette"}$s1_59no$,
  $s1_59oc$The liver lacks thiophorase (succinyl-CoA:acetoacetate CoA transferase), so it cannot turn acetoacetate into acetoacetyl-CoA$s1_59oc$,
  $s1_59nc$The liver lacks thiophorase, so it cannot convert acetoacetate to acetoacetyl-CoA$s1_59nc$,
  $s1_59oe$Hepatocytes make acetoacetate and beta-hydroxybutyrate from HMG-CoA and export them. They lack the transferase that other tissues use to activate acetoacetate, so the liver does not burn its own ketones. HMG-CoA synthase is present in liver mitochondria and is required to make ketones; saying the liver lacks it reverses production and consumption. Muscle uses ketones and fatty acids; it is not the factory. After a couple of days the brain does use ketones, which spares glucose. Ketogenesis is a low-insulin, high-glucagon state.$s1_59oe$,
  $s1_59ne$Hepatocytes make acetoacetate and beta-hydroxybutyrate from HMG-CoA and export them. They lack the transferase that other tissues use to activate acetoacetate, so the liver does not burn its own ketones. HMG-CoA synthase is present in liver mitochondria and is required to make ketones; saying the liver lacks it reverses production and consumption. Muscle uses ketones and fatty acids; it is not the factory. After a couple of days the brain does use ketones, which spares glucose. Ketogenesis is a low-insulin, high-glucagon state.$s1_59ne$,
  124, 59, 81, 88,
  2.101695, 0.920455
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_60id$68b1f684-adbf-4e1c-88f0-c3c9534ecaa5$s1_60id$,
  $s1_60st$usmle-step-1$s1_60st$,
  1,
  $s1_60oo${"options": ["Osteoclasts cannot acidify the resorption pit without carbonic anhydrase II, so bone is not carved out and the marrow has no room", "Osteoblasts have failed, so bone is thin", "The disease is osteoporosis, which also fills the marrow with bone", "Cranial nerves are spared because the foramina widen", "Dense bone means resorption is increased"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteopetrosis", "kind": "vignette"}$s1_60oo$,
  $s1_60no${"options": ["Osteoclasts lack carbonic anhydrase II and cannot resorb bone, so uncarved bone crowds the marrow", "Osteoblasts have failed, so the bone is thin and the marrow cavity expands", "This is osteoporosis, which also packs the marrow space with excess bone", "Cranial nerves are spared because the foramina widen as the bone densifies", "Dense bone means osteoclast resorption is increased, so the marrow cavity widens and the cranial nerves are spared from compression"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Osteopetrosis", "kind": "vignette"}$s1_60no$,
  $s1_60oc$Osteoclasts cannot acidify the resorption pit without carbonic anhydrase II, so bone is not carved out and the marrow has no room$s1_60oc$,
  $s1_60nc$Osteoclasts lack carbonic anhydrase II and cannot resorb bone, so uncarved bone crowds the marrow$s1_60nc$,
  $s1_60oe$Osteoclasts need acid to dissolve hydroxyapatite. Carbonic anhydrase II supplies the protons. Without it, bone is made and not removed, foramina narrow, nerves are compressed, and the marrow cavity never opens, so pancytopenia follows. Osteoblasts are working; that is why bone accumulates. Osteoporosis is too little bone. Foramina get smaller, not larger. Density here is failed resorption, not extra resorption.$s1_60oe$,
  $s1_60ne$Osteoclasts need acid to dissolve hydroxyapatite. Carbonic anhydrase II supplies the protons. Without it, bone is made and not removed, foramina narrow, nerves are compressed, and the marrow cavity never opens, so pancytopenia follows. Osteoblasts are working; that is why bone accumulates. Osteoporosis is too little bone. Foramina get smaller, not larger. Density here is failed resorption, not extra resorption.$s1_60ne$,
  129, 66, 97, 131,
  1.954545, 0.740458
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_61id$69c07528-49b3-4788-a901-85dc4a679edb$s1_61id$,
  $s1_61st$usmle-step-1$s1_61st$,
  1,
  $s1_61oo${"options": ["Deferoxamine chelates iron; the latent phase can precede shock and liver failure, so improvement does not mean the ingestion is over", "Deferoxamine is for lead, and iron is watched unless he seizes", "N-acetylcysteine is the specific iron antidote", "The quiet hours mean the tablets were not absorbed", "Alkalinization of urine is the primary removal strategy for iron"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Iron poisoning", "kind": "vignette"}$s1_61oo$,
  $s1_61no${"options": ["Deferoxamine chelates iron; the quiet interval can still be followed by shock and liver failure", "Deferoxamine is the lead chelator, and iron is observed unless a seizure occurs", "N-acetylcysteine is the specific antidote for iron and ends the risk in the quiet phase", "The quiet hours mean the tablets were not absorbed, so treatment can stop", "Urinary alkalinization is the primary way to remove iron and prevent later shock"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Iron poisoning", "kind": "vignette"}$s1_61no$,
  $s1_61oc$Deferoxamine chelates iron; the latent phase can precede shock and liver failure, so improvement does not mean the ingestion is over$s1_61oc$,
  $s1_61nc$Deferoxamine chelates iron; the quiet interval can still be followed by shock and liver failure$s1_61nc$,
  $s1_61oe$Iron is directly corrosive and mitochondrial-toxic. After the first vomiting there is often a lull, then shock, acidosis, and liver injury. Deferoxamine binds iron (the urine turns vin rose). The lull is not clearance. Deferoxamine is not the lead chelator. N-acetylcysteine is for acetaminophen. Visible tablets and a lull still mean a dangerous ingestion. Urinary alkalinization is a salicylate and phenobarbital idea, not how iron is removed.$s1_61oe$,
  $s1_61ne$Iron is directly corrosive and mitochondrial-toxic. After the first vomiting there is often a lull, then shock, acidosis, and liver injury. Deferoxamine binds iron (the urine turns vin rose). The lull is not clearance. Deferoxamine is not the lead chelator. N-acetylcysteine is for acetaminophen. Visible tablets and a lull still mean a dangerous ingestion. Urinary alkalinization is a salicylate and phenobarbital idea, not how iron is removed.$s1_61ne$,
  132, 64, 95, 87,
  2.062500, 1.091954
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_62id$6a6a10dc-f653-450f-a390-46712fa4fb79$s1_62id$,
  $s1_62st$usmle-step-1$s1_62st$,
  1,
  $s1_62oo${"options": ["Gottron papules with a heliotrope rash are dermatomyositis; in adults it is associated with malignancy, and the inflammation is perimysial and perifascicular, unlike endomysial polymyositis", "These rashes are psoriasis, and CK is high from a statin she is not taking", "Polymyositis has the heliotrope rash and no cancer link", "Perimysial inflammation is the polymyositis pattern", "Adult dermatomyositis does not change cancer screening"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Dermatomyositis rash", "kind": "vignette"}$s1_62oo$,
  $s1_62no${"options": ["Gottron papules with a heliotrope rash are dermatomyositis; in adults the disease is associated with malignancy", "These knuckle lesions are psoriasis, and the high CK is from a statin she is not taking", "Polymyositis produces the heliotrope rash and has no link to cancer in adults", "Perimysial and perifascicular inflammation is the polymyositis pattern and carries no cancer association", "Adult dermatomyositis does not change cancer screening once the CK is up"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Dermatomyositis rash", "kind": "vignette"}$s1_62no$,
  $s1_62oc$Gottron papules with a heliotrope rash are dermatomyositis; in adults it is associated with malignancy, and the inflammation is perimysial and perifascicular, unlike endomysial polymyositis$s1_62oc$,
  $s1_62nc$Gottron papules with a heliotrope rash are dermatomyositis; in adults the disease is associated with malignancy$s1_62nc$,
  $s1_62oe$Gottron papules are the knuckle rash of dermatomyositis, and the violaceous eyelids are heliotrope. Proximal weakness and a high CK complete it. Adults with dermatomyositis have an increased rate of underlying cancer, so the age is a reason to look, not to call it eczema. Psoriasis does not raise CK or weaken the shoulders in this pattern. Polymyositis lacks the rash. The perimysial, perifascicular atrophy pattern is dermatomyositis; endomysial inflammation is polymyositis. Skipping screening misses the association.$s1_62oe$,
  $s1_62ne$Gottron papules are the knuckle rash of dermatomyositis, and the violaceous eyelids are heliotrope. Proximal weakness and a high CK complete it. Adults with dermatomyositis have an increased rate of underlying cancer, so the age is a reason to look, not to call it eczema. Psoriasis does not raise CK or weaken the shoulders in this pattern. Polymyositis lacks the rash. The perimysial, perifascicular atrophy pattern is dermatomyositis; endomysial inflammation is polymyositis. Skipping screening misses the association.$s1_62ne$,
  189, 74, 111, 104,
  2.554054, 1.067308
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_63id$6ca3f160-f94a-41c2-9f2a-72825a24532c$s1_63id$,
  $s1_63st$usmle-step-1$s1_63st$,
  1,
  $s1_63oo${"options": ["Reactive oxygen species from mitochondria and from neutrophils, plus calcium influx, add injury on top of the ischemia", "Reperfusion prevents all membrane damage", "Contraction bands mean the myocytes were never ischemic", "Oxygen return lowers intracellular calcium", "Free radicals are scavenged completely by a minute of ischemia"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Free radicals reperfusion", "kind": "vignette"}$s1_63oo$,
  $s1_63no${"options": ["Reactive oxygen species from mitochondria and neutrophils, plus calcium influx, add injury after ischemia", "Reperfusion prevents all membrane damage that ischemia started", "Contraction bands mean the myocytes were spared ischemia and kept calcium outside the cell", "Return of oxygen lowers intracellular calcium and limits membrane injury", "Free radicals generated when oxygen returns are scavenged completely within a minute of the ischemia"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Free radicals reperfusion", "kind": "vignette"}$s1_63no$,
  $s1_63oc$Reactive oxygen species from mitochondria and from neutrophils, plus calcium influx, add injury on top of the ischemia$s1_63oc$,
  $s1_63nc$Reactive oxygen species from mitochondria and neutrophils, plus calcium influx, add injury after ischemia$s1_63nc$,
  $s1_63oe$Reperfusion saves tissue and also injures it. Oxygen meets a damaged electron transport chain and makes superoxide. Neutrophils arrive and add more radicals. Calcium pours in through a leaky membrane and hypercontracts the sarcomeres into contraction bands. It is not purely benign. Contraction bands are a reperfusion finding in cells that were ischemic. Calcium rises, it does not fall. A period of ischemia depletes antioxidant capacity; radicals are not instantly cleared.$s1_63oe$,
  $s1_63ne$Reperfusion saves tissue and also injures it. Oxygen meets a damaged electron transport chain and makes superoxide. Neutrophils arrive and add more radicals. Calcium pours in through a leaky membrane and hypercontracts the sarcomeres into contraction bands. It is not purely benign. Contraction bands are a reperfusion finding in cells that were ischemic. Calcium rises, it does not fall. A period of ischemia depletes antioxidant capacity; radicals are not instantly cleared.$s1_63ne$,
  118, 62, 105, 100,
  1.903226, 1.050000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_64id$6f610371-3e4f-4044-a9be-b3ef98a9f325$s1_64id$,
  $s1_64st$usmle-step-1$s1_64st$,
  1,
  $s1_64oo${"options": ["Coagulative necrosis of the heart keeps the outline; caseous necrosis of tuberculosis wipes the outline inside a granuloma", "The heart undergoes liquefactive necrosis like the brain", "Caseous necrosis is the enzyme-rich pattern of pancreatitis", "Coagulative necrosis is full of neutrophils on day one as its definition", "Architecture is lost first in a myocardial infarct"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Caseous versus coagulative", "kind": "vignette"}$s1_64oo$,
  $s1_64no${"options": ["Coagulative necrosis of the heart keeps the outline; caseous necrosis of tuberculosis erases it inside a granuloma", "The heart undergoes liquefactive necrosis, the same pattern as a brain infarct and as caseous tuberculosis", "Caseous necrosis is the enzyme-rich pattern of pancreatitis, and myocardium shows it too", "Coagulative necrosis is defined by a field of neutrophils on the first day", "Architecture disappears first in a myocardial infarct and is kept in a tuberculous granuloma"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Caseous versus coagulative", "kind": "vignette"}$s1_64no$,
  $s1_64oc$Coagulative necrosis of the heart keeps the outline; caseous necrosis of tuberculosis wipes the outline inside a granuloma$s1_64oc$,
  $s1_64nc$Coagulative necrosis of the heart keeps the outline; caseous necrosis of tuberculosis erases it inside a granuloma$s1_64nc$,
  $s1_64oe$Ischemia denatures enzymes and structural proteins together, so the heart keeps a ghost outline (coagulative) until macrophages arrive. The brain, rich in enzymes and poor in scaffolding, liquefies. Tuberculosis makes caseous necrosis, amorphous debris inside granulomas. Pancreatitis is fat necrosis and enzymatic liquefaction. Day-one infarcts are coagulative with few neutrophils; neutrophils come later. The outline is preserved early in the heart, which is the point.$s1_64oe$,
  $s1_64ne$Ischemia denatures enzymes and structural proteins together, so the heart keeps a ghost outline (coagulative) until macrophages arrive. The brain, rich in enzymes and poor in scaffolding, liquefies. Tuberculosis makes caseous necrosis, amorphous debris inside granulomas. Pancreatitis is fat necrosis and enzymatic liquefaction. Day-one infarcts are coagulative with few neutrophils; neutrophils come later. The outline is preserved early in the heart, which is the point.$s1_64ne$,
  122, 72, 114, 106,
  1.694444, 1.075472
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_65id$705b8b1d-4141-49a0-a0c2-8bbafd472f10$s1_65id$,
  $s1_65st$usmle-step-1$s1_65st$,
  1,
  $s1_65oo${"options": ["It binds tubulin and blocks neutrophil migration; diarrhea is toxicity, and a strong CYP3A4 or P-gp inhibitor raises the level enough to cause marrow and muscle failure", "It inhibits xanthine oxidase, so diarrhea means uric acid is falling correctly", "Doubling the dose is the way to treat the diarrhea", "Colchicine is safe with any CYP inhibitor because it is renally inert", "Neutrophils use microtubules only for antibody production, which is irrelevant to the joint"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Colchicine mechanism", "kind": "vignette"}$s1_65oo$,
  $s1_65no${"options": ["Colchicine binds tubulin; a strong CYP3A4 or P-gp inhibitor can cause marrow and muscle failure", "It inhibits xanthine oxidase, so diarrhea means the uric acid is falling as intended", "Doubling the dose is how the diarrhea of colchicine toxicity is treated", "Colchicine is safe with any CYP inhibitor because it is renally inert and is not a CYP substrate", "Neutrophils use microtubules only for antibody production, which does not affect the joint"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Colchicine mechanism", "kind": "vignette"}$s1_65no$,
  $s1_65oc$It binds tubulin and blocks neutrophil migration; diarrhea is toxicity, and a strong CYP3A4 or P-gp inhibitor raises the level enough to cause marrow and muscle failure$s1_65oc$,
  $s1_65nc$Colchicine binds tubulin; a strong CYP3A4 or P-gp inhibitor can cause marrow and muscle failure$s1_65nc$,
  $s1_65oe$Colchicine caps microtubules. Neutrophils cannot crawl into the joint, which is the anti-inflammatory effect, and it does not change the uric acid pool. The gut lining also depends on microtubules, so diarrhea is a dose-limiting toxicity, not a sign of success to chase with more drug. Clearance depends on CYP3A4 and P-glycoprotein; inhibitors such as clarithromycin can cause fatal marrow suppression and rhabdomyolysis. It is not a xanthine oxidase inhibitor. The dose is reduced or stopped when diarrhea starts, not doubled.$s1_65oe$,
  $s1_65ne$Colchicine caps microtubules. Neutrophils cannot crawl into the joint, which is the anti-inflammatory effect, and it does not change the uric acid pool. The gut lining also depends on microtubules, so diarrhea is a dose-limiting toxicity, not a sign of success to chase with more drug. Clearance depends on CYP3A4 and P-glycoprotein; inhibitors such as clarithromycin can cause fatal marrow suppression and rhabdomyolysis. It is not a xanthine oxidase inhibitor. The dose is reduced or stopped when diarrhea starts, not doubled.$s1_65ne$,
  168, 91, 95, 96,
  1.846154, 0.989583
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_66id$712f04dc-c6d9-4e3d-a7be-eaa58a2c5390$s1_66id$,
  $s1_66st$usmle-step-1$s1_66st$,
  1,
  $s1_66oo${"options": ["Giant cell tumor sits in the epiphysis of a closed-growth-plate adult; osteosarcoma prefers the metaphysis of a teenager", "Giant cell tumor is diaphyseal in children with open plates", "A soap-bubble epiphyseal lesion is an osteoid osteoma nidus", "Unicameral cysts reach the articular surface in 30-year-olds", "Epiphyseal location means Ewing sarcoma"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Giant cell tumor", "kind": "vignette"}$s1_66oo$,
  $s1_66no${"options": ["Giant cell tumor sits in the epiphysis after the growth plate closes; osteosarcoma prefers a teenager's metaphysis", "Giant cell tumor is diaphyseal in children whose growth plates are still open", "A soap-bubble lesion that reaches the articular surface is the nidus of an osteoid osteoma in an adult", "Unicameral bone cysts reach the articular cartilage in adults around age 30", "An epiphyseal location after physeal closure means Ewing sarcoma"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Giant cell tumor", "kind": "vignette"}$s1_66no$,
  $s1_66oc$Giant cell tumor sits in the epiphysis of a closed-growth-plate adult; osteosarcoma prefers the metaphysis of a teenager$s1_66oc$,
  $s1_66nc$Giant cell tumor sits in the epiphysis after the growth plate closes; osteosarcoma prefers a teenager's metaphysis$s1_66nc$,
  $s1_66oe$Giant cell tumor of bone is the epiphyseal lucent lesion of young adults after the plate closes, often around the knee. The 'soap bubble' is the description. Osteosarcoma is metaphyseal and makes bone in adolescents. An osteoid osteoma is a tiny cortical nidus, not a bubbly epiphyseal mass. Simple cysts are metaphyseal in children and do not cross to the joint like this. Ewing is diaphyseal.$s1_66oe$,
  $s1_66ne$Giant cell tumor of bone is the epiphyseal lucent lesion of young adults after the plate closes, often around the knee. The 'soap bubble' is the description. Osteosarcoma is metaphyseal and makes bone in adolescents. An osteoid osteoma is a tiny cortical nidus, not a bubbly epiphyseal mass. Simple cysts are metaphyseal in children and do not cross to the joint like this. Ewing is diaphyseal.$s1_66ne$,
  120, 60, 114, 102,
  2.000000, 1.117647
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_67id$72aaff46-d7ee-4895-b9cb-dd25097bedce$s1_67id$,
  $s1_67st$usmle-step-1$s1_67st$,
  1,
  $s1_67oo${"options": ["Long-chain fatty acids cannot enter mitochondria without carnitine, so the liver cannot make ketones and the muscle cannot oxidize fat; medium chains bypass the shuttle", "High ketones are required to diagnose a fatty-acid oxidation defect", "Carnitine carries glucose, so low carnitine blocks glycolysis only", "A high long-chain fat load restocks carnitine", "Medium-chain fats need more carnitine than palmitate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Carnitine deficiency hypoglycemia", "kind": "vignette"}$s1_67oo$,
  $s1_67no${"options": ["Long-chain fats need carnitine to enter mitochondria, so no ketones form and muscle cannot oxidize them; medium chains bypass that shuttle", "High ketones on the presenting labs are required before a fatty-acid oxidation defect can be diagnosed", "Carnitine carries glucose into mitochondria, so a low level blocks glycolysis only", "A large long-chain fat meal restocks carnitine and turns hepatic ketone production back on", "Medium-chain fats require a larger carnitine shuttle than palmitate, so they cannot be oxidized and cannot restore ketone production"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Carnitine deficiency hypoglycemia", "kind": "vignette"}$s1_67no$,
  $s1_67oc$Long-chain fatty acids cannot enter mitochondria without carnitine, so the liver cannot make ketones and the muscle cannot oxidize fat; medium chains bypass the shuttle$s1_67oc$,
  $s1_67nc$Long-chain fats need carnitine to enter mitochondria, so no ketones form and muscle cannot oxidize them; medium chains bypass that shuttle$s1_67nc$,
  $s1_67oe$Carnitine is required for the shuttle of long-chain acyl groups. Without it, beta oxidation fails, ketones are not made, glucose is the only fuel and runs out, and muscle is weak. That is hypoketotic hypoglycemia, the opposite of a high-ketone diabetic state. Carnitine does not carry glucose. Eating more long-chain fat gives substrate he cannot oxidize. Medium-chain fatty acids enter mitochondria without the carnitine shuttle, which is why they are the fat that is tolerated.$s1_67oe$,
  $s1_67ne$Carnitine is required for the shuttle of long-chain acyl groups. Without it, beta oxidation fails, ketones are not made, glucose is the only fuel and runs out, and muscle is weak. That is hypoketotic hypoglycemia, the opposite of a high-ketone diabetic state. Carnitine does not carry glucose. Eating more long-chain fat gives substrate he cannot oxidize. Medium-chain fatty acids enter mitochondria without the carnitine shuttle, which is why they are the fat that is tolerated.$s1_67ne$,
  168, 67, 138, 132,
  2.507463, 1.045455
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_68id$749a9438-ac3f-4a7a-a06e-6741e3301a7e$s1_68id$,
  $s1_68st$usmle-step-1$s1_68st$,
  1,
  $s1_68oo${"options": ["High TBG binds more hormone, and pregnancy increases clearance and volume; she needs more levothyroxine so free hormone and TSH stay normal. A high total T4 can hide a low free level", "Pregnancy lowers TBG, so the dose is cut in half", "TSH is an unreliable pregnancy lab and should be ignored", "Levothyroxine is stopped in pregnancy because it does not cross any relevant pathway to the fetus", "Free T4 falling means she is hyperthyroid and the dose is too high"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Thyroid hormone in pregnancy", "kind": "vignette"}$s1_68oo$,
  $s1_68no${"options": ["TBG binding, clearance, and volume rise in pregnancy, so more levothyroxine is needed to keep free hormone and TSH normal", "Pregnancy lowers TBG and the distribution volume, so the replacement dose is cut in half", "TSH is an unreliable pregnancy lab and should be ignored when the levothyroxine dose is set", "Levothyroxine is stopped in pregnancy because it does not cross any relevant pathway to the fetus or support early brain development", "A falling free T4 means she has become hyperthyroid and the dose is already too high"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Thyroid hormone in pregnancy", "kind": "vignette"}$s1_68no$,
  $s1_68oc$High TBG binds more hormone, and pregnancy increases clearance and volume; she needs more levothyroxine so free hormone and TSH stay normal. A high total T4 can hide a low free level$s1_68oc$,
  $s1_68nc$TBG binding, clearance, and volume rise in pregnancy, so more levothyroxine is needed to keep free hormone and TSH normal$s1_68nc$,
  $s1_68oe$Estrogen raises thyroxine-binding globulin. More hormone is bound, free hormone tends to fall, TSH rises, and the replacement dose is increased, often early in pregnancy. Total T4 rises with the binding protein and is a trap if you treat the total and not the free level and the TSH. TBG goes up, not down. TSH remains the guide, with pregnancy-specific ranges. Maternal thyroid hormone matters for the fetus, especially early, and is not stopped. A falling free T4 is hypothyroidism, not excess.$s1_68oe$,
  $s1_68ne$Estrogen raises thyroxine-binding globulin. More hormone is bound, free hormone tends to fall, TSH rises, and the replacement dose is increased, often early in pregnancy. Total T4 rises with the binding protein and is a trap if you treat the total and not the free level and the TSH. TBG goes up, not down. TSH remains the guide, with pregnancy-specific ranges. Maternal thyroid hormone matters for the fetus, especially early, and is not stopped. A falling free T4 is hypothyroidism, not excess.$s1_68ne$,
  182, 97, 121, 132,
  1.876289, 0.916667
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_69id$75e54346-8748-4ffe-ac1c-3522e842062a$s1_69id$,
  $s1_69st$usmle-step-1$s1_69st$,
  1,
  $s1_69oo${"options": ["The movements are from upregulated nigrostriatal dopamine receptors; more blockade masks them briefly and then deepens the upregulation", "The movements are acute dystonia, so more dopamine blockade is the cure", "This is Parkinson disease, and the antipsychotic is replacing lost dopamine", "Chewing movements mean serotonin syndrome, treated by raising the antipsychotic", "The tongue movement is a seizure, and the drug level is subtherapeutic"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Tardive dyskinesia", "kind": "vignette"}$s1_69oo$,
  $s1_69no${"options": ["Upregulated nigrostriatal receptors drive the movements; more blockade hides them briefly, then deepens the upregulation", "The movements are acute dystonia, so more dopamine blockade is the lasting treatment", "This is Parkinson disease, and the antipsychotic is replacing the lost nigrostriatal dopamine that produced the movements", "Chewing movements are serotonin syndrome and are treated by raising the antipsychotic dose", "The tongue movement is a seizure caused by a subtherapeutic antipsychotic level"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Tardive dyskinesia", "kind": "vignette"}$s1_69no$,
  $s1_69oc$The movements are from upregulated nigrostriatal dopamine receptors; more blockade masks them briefly and then deepens the upregulation$s1_69oc$,
  $s1_69nc$Upregulated nigrostriatal receptors drive the movements; more blockade hides them briefly, then deepens the upregulation$s1_69nc$,
  $s1_69oe$Long dopamine blockade causes the postsynaptic receptors in the striatum to increase in number and sensitivity. That excess dopamine signaling produces tardive chewing and tongue movements. Pushing the blocker covers the receptors for a short time, which is why the movements dipped, but it drives still more upregulation, so the problem returns worse. Acute dystonia is early, not an eight-year chewing syndrome, and more drug is not its cure. Antipsychotics block dopamine; they do not replace it, and they worsen true Parkinson disease. Serotonin syndrome has clonus and hyperreflexia, not isolated orofacial dyskinesia. This is not a seizure aura that needs a higher antipsychotic level.$s1_69oe$,
  $s1_69ne$Long dopamine blockade causes the postsynaptic receptors in the striatum to increase in number and sensitivity. That excess dopamine signaling produces tardive chewing and tongue movements. Pushing the blocker covers the receptors for a short time, which is why the movements dipped, but it drives still more upregulation, so the problem returns worse. Acute dystonia is early, not an eight-year chewing syndrome, and more drug is not its cure. Antipsychotics block dopamine; they do not replace it, and they worsen true Parkinson disease. Serotonin syndrome has clonus and hyperreflexia, not isolated orofacial dyskinesia. This is not a seizure aura that needs a higher antipsychotic level.$s1_69ne$,
  135, 79, 120, 121,
  1.708861, 0.991736
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_70id$76e3a5b8-1b6f-43af-bee2-64d017c08c37$s1_70id$,
  $s1_70st$usmle-step-1$s1_70st$,
  1,
  $s1_70oo${"options": ["HMG-CoA reductase is blocked; the hepatocyte senses less cholesterol and puts more LDL receptors on the surface, clearing LDL from blood", "Statins inhibit PCSK9 as their only action", "Blocking the reductase raises intracellular cholesterol", "LDL receptors fall when synthesis is blocked, so blood LDL rises", "The enzyme blocked is lipoprotein lipase"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "HMG-CoA reductase regulation", "kind": "vignette"}$s1_70oo$,
  $s1_70no${"options": ["HMG-CoA reductase is blocked; less cholesterol in the hepatocyte brings more LDL receptors to the surface and clears LDL", "Statins inhibit PCSK9 as their only action and leave hepatic cholesterol synthesis and surface LDL receptors unchanged", "Blocking the reductase raises the cholesterol content of the hepatocyte", "LDL receptors leave the cell surface when synthesis stops, so the blood LDL rises", "The blocked enzyme is lipoprotein lipase, so the particle that falls is the chylomicron"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "HMG-CoA reductase regulation", "kind": "vignette"}$s1_70no$,
  $s1_70oc$HMG-CoA reductase is blocked; the hepatocyte senses less cholesterol and puts more LDL receptors on the surface, clearing LDL from blood$s1_70oc$,
  $s1_70nc$HMG-CoA reductase is blocked; less cholesterol in the hepatocyte brings more LDL receptors to the surface and clears LDL$s1_70nc$,
  $s1_70oe$The committed step of cholesterol synthesis is HMG-CoA reductase. Statins inhibit it. Lower cholesterol in the liver cell activates SREBP, which increases LDL-receptor expression, and blood LDL falls. That is not a block of intestinal absorption (ezetimibe) and not a direct PCSK9 inhibitor, although low cholesterol biology intersects that pathway. Synthesis falls, so intracellular cholesterol falls, it does not rise. Fewer receptors would raise blood LDL, the opposite of the drug's effect. Lipoprotein lipase clears chylomicrons and VLDL triglycerides.$s1_70oe$,
  $s1_70ne$The committed step of cholesterol synthesis is HMG-CoA reductase. Statins inhibit it. Lower cholesterol in the liver cell activates SREBP, which increases LDL-receptor expression, and blood LDL falls. That is not a block of intestinal absorption (ezetimibe) and not a direct PCSK9 inhibitor, although low cholesterol biology intersects that pathway. Synthesis falls, so intracellular cholesterol falls, it does not rise. Fewer receptors would raise blood LDL, the opposite of the drug's effect. Lipoprotein lipase clears chylomicrons and VLDL triglycerides.$s1_70ne$,
  136, 64, 120, 118,
  2.125000, 1.016949
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_71id$7772989f-54b1-4c60-b8ad-f98b48aa7017$s1_71id$,
  $s1_71st$usmle-step-1$s1_71st$,
  1,
  $s1_71oo${"options": ["The first is left MCA, which serves the lateral cortex including face and arm language areas; the leg homunculus is on the medial hemisphere in the ACA territory", "The first is left ACA because the face is lateral; the second is MCA because the leg is medial", "Both are vertebral arteries, which supply the homunculus directly", "The naming problem is a right parietal lobe sign", "A grasp reflex localizes to the occipital pole"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "MCA versus ACA", "kind": "vignette"}$s1_71oo$,
  $s1_71no${"options": ["The first infarct is left MCA cortex for face, arm, and language; the leg is spared because that homunculus is medial, in ACA territory", "The first is left ACA because the face lies on the lateral cortex; the second is MCA because the leg lies on the medial cortex", "Both strokes are in vertebral arteries, which supply the cortical homunculus directly", "The naming failure is a right parietal sign of a posterior cerebral infarct", "A grasp reflex places the responsible lesion at the occipital pole"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "MCA versus ACA", "kind": "vignette"}$s1_71no$,
  $s1_71oc$The first is left MCA, which serves the lateral cortex including face and arm language areas; the leg homunculus is on the medial hemisphere in the ACA territory$s1_71oc$,
  $s1_71nc$The first infarct is left MCA cortex for face, arm, and language; the leg is spared because that homunculus is medial, in ACA territory$s1_71nc$,
  $s1_71oe$The motor homunculus puts the leg in the medial interhemispheric fissure, ACA, and the face and arm on the lateral surface, MCA. The left MCA also covers language, so anomia with face and arm weakness is MCA. Leg-predominant weakness plus a grasp reflex is ACA and frontal medial cortex. Reversing the arteries is the trap the homunculus was drawn to prevent. The vertebral arteries do not supply the cortical homunculus. Naming is a dominant, usually left, hemisphere function. A grasp reflex is frontal, not occipital.$s1_71oe$,
  $s1_71ne$The motor homunculus puts the leg in the medial interhemispheric fissure, ACA, and the face and arm on the lateral surface, MCA. The left MCA also covers language, so anomia with face and arm weakness is MCA. Leg-predominant weakness plus a grasp reflex is ACA and frontal medial cortex. Reversing the arteries is the trap the homunculus was drawn to prevent. The vertebral arteries do not supply the cortical homunculus. Naming is a dominant, usually left, hemisphere function. A grasp reflex is frontal, not occipital.$s1_71ne$,
  161, 94, 135, 126,
  1.712766, 1.071429
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_72id$786c4238-dc01-4c26-a866-75187f335a5f$s1_72id$,
  $s1_72st$usmle-step-1$s1_72st$,
  1,
  $s1_72oo${"options": ["Salmonella; infarcted gut and bone in sickle cell disease make Salmonella osteomyelitis the classic gram-negative, and fever plus focal bone findings need more than fluids", "Staphylococcus is the only organism, so a gram-negative rod is a contaminant", "Pseudomonas from a nail through a sneaker, which is this patient's exposure", "Crisis fluid alone treats bacterial osteomyelitis", "Hydrogen sulfide production is the lab signature of Streptococcus"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Sickle Salmonella osteomyelitis", "kind": "vignette"}$s1_72oo$,
  $s1_72no${"options": ["Salmonella is the classic gram-negative osteomyelitis here: sickle cell infarcts gut and bone, and fever with focal bone findings needs more than fluids", "Staphylococcus is the only organism in sickle-cell bone infection, so a gram-negative rod recovered from that bone is a skin contaminant", "Pseudomonas from a nail through a sneaker, which is this patient's exposure, seeded the bone", "Fluid given for the vaso-occlusive crisis is enough treatment for bacterial osteomyelitis", "Hydrogen sulfide production is the laboratory signature of Streptococcus in bone"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Sickle Salmonella osteomyelitis", "kind": "vignette"}$s1_72no$,
  $s1_72oc$Salmonella; infarcted gut and bone in sickle cell disease make Salmonella osteomyelitis the classic gram-negative, and fever plus focal bone findings need more than fluids$s1_72oc$,
  $s1_72nc$Salmonella is the classic gram-negative osteomyelitis here: sickle cell infarcts gut and bone, and fever with focal bone findings needs more than fluids$s1_72nc$,
  $s1_72oe$Most osteomyelitis is still Staphylococcus, but sickle cell disease is the exception people are tested on: Salmonella. Functional asplenia and infarcted bone are the setup. A focal hot bone with fever is not written off as a pain crisis. A gram-negative rod that makes H2S is Salmonella, not a contaminant you ignore. Pseudomonas is the sneaker puncture, which is not the history. Fluids do not treat osteomyelitis. Streptococcus does not give the H2S Salmonella signature.$s1_72oe$,
  $s1_72ne$Most osteomyelitis is still Staphylococcus, but sickle cell disease is the exception people are tested on: Salmonella. Functional asplenia and infarcted bone are the setup. A focal hot bone with fever is not written off as a pain crisis. A gram-negative rod that makes H2S is Salmonella, not a contaminant you ignore. Pseudomonas is the sneaker puncture, which is not the history. Fluids do not treat osteomyelitis. Streptococcus does not give the H2S Salmonella signature.$s1_72ne$,
  171, 76, 152, 136,
  2.250000, 1.117647
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_73id$787a4876-1fc8-4c82-8855-9c475cf432ca$s1_73id$,
  $s1_73st$usmle-step-1$s1_73st$,
  1,
  $s1_73oo${"options": ["Chronic alcohol facilitated GABA and suppressed NMDA; stopping it leaves NMDA excess. A benzodiazepine replaces GABA tone; an antipsychotic alone does not and can lower the seizure threshold", "Withdrawal is a dopamine-deficiency state treated first with haloperidol", "The seizure means he needs phenytoin loading and no GABA drug", "Sweating and tremor are serotonin syndrome from alcohol itself", "Benzodiazepines worsen withdrawal seizures because they block GABA"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Alcohol withdrawal", "kind": "vignette"}$s1_73oo$,
  $s1_73no${"options": ["Withdrawal leaves NMDA upregulated; a benzodiazepine replaces GABA tone, while an antipsychotic alone does not and can lower the seizure threshold", "Alcohol withdrawal is a dopamine-deficiency state and should be treated first with haloperidol", "The seizure calls for phenytoin loading as the first drug, and a medicine that facilitates GABA would make the convulsions worse", "Sweating and tremor are serotonin syndrome caused by alcohol itself, so GABA drugs should be stopped", "Benzodiazepines worsen withdrawal seizures because they block the GABA receptor"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Alcohol withdrawal", "kind": "vignette"}$s1_73no$,
  $s1_73oc$Chronic alcohol facilitated GABA and suppressed NMDA; stopping it leaves NMDA excess. A benzodiazepine replaces GABA tone; an antipsychotic alone does not and can lower the seizure threshold$s1_73oc$,
  $s1_73nc$Withdrawal leaves NMDA upregulated; a benzodiazepine replaces GABA tone, while an antipsychotic alone does not and can lower the seizure threshold$s1_73nc$,
  $s1_73oe$Long alcohol use downregulates GABA-A signaling and upregulates NMDA glutamate receptors. When alcohol stops, the balance is excitation: tremor, autonomic surge, seizures, and later delirium. A benzodiazepine restores GABA-A activity and is the treatment that prevents the seizure from recurring. Haloperidol may quiet hallucinations but does not replace GABA and can make seizures more likely, so it is not the sole plan. This is not dopamine deficiency. Phenytoin does not fix alcohol-withdrawal seizures. The autonomic picture is withdrawal, not serotonin syndrome. Benzodiazepines facilitate GABA; they do not block it.$s1_73oe$,
  $s1_73ne$Long alcohol use downregulates GABA-A signaling and upregulates NMDA glutamate receptors. When alcohol stops, the balance is excitation: tremor, autonomic surge, seizures, and later delirium. A benzodiazepine restores GABA-A activity and is the treatment that prevents the seizure from recurring. Haloperidol may quiet hallucinations but does not replace GABA and can make seizures more likely, so it is not the sole plan. This is not dopamine deficiency. Phenytoin does not fix alcohol-withdrawal seizures. The autonomic picture is withdrawal, not serotonin syndrome. Benzodiazepines facilitate GABA; they do not block it.$s1_73ne$,
  190, 72, 146, 128,
  2.638889, 1.140625
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_74id$7a57b568-d011-42d7-8d6c-571b3f46f704$s1_74id$,
  $s1_74st$usmle-step-1$s1_74st$,
  1,
  $s1_74oo${"options": ["Bruton tyrosine kinase blocks B-cell maturation; pyogenic bacteria dominate after maternal IgG wanes, and T-cell infections are not the lead", "Adenosine deaminase, so T and B cells are both absent from birth", "Fungal disease is the classic Bruton infection", "Tonsils are enlarged", "The disease is autosomal and his sister should be equally affected"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Bruton agammaglobulinemia", "kind": "vignette"}$s1_74oo$,
  $s1_74no${"options": ["Bruton tyrosine kinase blocks B-cell maturation; after maternal IgG wanes, pyogenic bacteria dominate and T-cell infections do not", "Adenosine deaminase deficiency, so T cells and B cells are both absent from birth and viral disease is what presents", "Disseminated fungi are the classic infections once Bruton tyrosine kinase is missing", "The tonsils are enlarged and the lymphoid tissue is hyperplastic", "The disease is autosomal, so his sister should be affected to the same degree"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Bruton agammaglobulinemia", "kind": "vignette"}$s1_74no$,
  $s1_74oc$Bruton tyrosine kinase blocks B-cell maturation; pyogenic bacteria dominate after maternal IgG wanes, and T-cell infections are not the lead$s1_74oc$,
  $s1_74nc$Bruton tyrosine kinase blocks B-cell maturation; after maternal IgG wanes, pyogenic bacteria dominate and T-cell infections do not$s1_74nc$,
  $s1_74oe$X-linked agammaglobulinemia is a block from pro-B to pre-B cell because Bruton tyrosine kinase is gone. There are no B cells, no tonsils, and no immunoglobulin of his own. Maternal IgG protects early, then bacteria with capsules take over. T cells work, so viruses and fungi are not the signature the way they are in SCID. ADA deficiency empties T and B cells. Fungal disease points away from a pure B-cell defect. Tonsils are absent, not big. A healthy sister fits X-linked inheritance.$s1_74oe$,
  $s1_74ne$X-linked agammaglobulinemia is a block from pro-B to pre-B cell because Bruton tyrosine kinase is gone. There are no B cells, no tonsils, and no immunoglobulin of his own. Maternal IgG protects early, then bacteria with capsules take over. T cells work, so viruses and fungi are not the signature the way they are in SCID. ADA deficiency empties T and B cells. Fungal disease points away from a pure B-cell defect. Tonsils are absent, not big. A healthy sister fits X-linked inheritance.$s1_74ne$,
  140, 66, 130, 116,
  2.121212, 1.120690
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_75id$7af52ef6-2e17-46a1-a817-8ed41d35e8c9$s1_75id$,
  $s1_75st$usmle-step-1$s1_75st$,
  1,
  $s1_75oo${"options": ["A full CGG expansion methylates FMR1 and silences it; a premutation is smaller, so she may have a late phenotype without the full childhood syndrome", "The repeat is CAG in huntingtin, and methylation is irrelevant", "FMR1 is overexpressed, so the testes enlarge from excess fragile-X protein", "This is trisomy 21, and the repeat story is a distractor", "The gene is mitochondrial, so only mothers transmit a full syndrome to every child"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Fragile X", "kind": "vignette"}$s1_75oo$,
  $s1_75no${"options": ["A full CGG expansion methylates and silences FMR1; her smaller premutation can cause a late phenotype without the childhood syndrome", "The expanded repeat is CAG in huntingtin, and methylation at that locus does not change expression or the childhood picture", "FMR1 is overexpressed, and the enlarged testes come from excess fragile-X protein", "The diagnosis is trisomy 21, and the triplet repeat is incidental to the phenotype", "The gene is mitochondrial, so only mothers transmit a full syndrome to every child"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Fragile X", "kind": "vignette"}$s1_75no$,
  $s1_75oc$A full CGG expansion methylates FMR1 and silences it; a premutation is smaller, so she may have a late phenotype without the full childhood syndrome$s1_75oc$,
  $s1_75nc$A full CGG expansion methylates and silences FMR1; her smaller premutation can cause a late phenotype without the childhood syndrome$s1_75nc$,
  $s1_75oe$Fragile X is a CGG expansion in the FMR1 5' region. Past a threshold the repeat is methylated and the gene turns off, so the RNA-binding protein is missing. That causes intellectual disability, long face, large ears, and macroorchidism. A premutation does not fully silence the gene; women can have premature ovarian failure and older carriers can have a tremor-ataxia syndrome, which is why the mother is not a copy of the boy. CAG huntingtin is Huntington disease. The syndrome is loss of FMR1, not overexpression. Trisomy 21 has a different face and no CGG repeat. Inheritance is X-linked, not mitochondrial.$s1_75oe$,
  $s1_75ne$Fragile X is a CGG expansion in the FMR1 5' region. Past a threshold the repeat is methylated and the gene turns off, so the RNA-binding protein is missing. That causes intellectual disability, long face, large ears, and macroorchidism. A premutation does not fully silence the gene; women can have premature ovarian failure and older carriers can have a tremor-ataxia syndrome, which is why the mother is not a copy of the boy. CAG huntingtin is Huntington disease. The syndrome is loss of FMR1, not overexpression. Trisomy 21 has a different face and no CGG repeat. Inheritance is X-linked, not mitochondrial.$s1_75ne$,
  148, 82, 132, 123,
  1.804878, 1.073171
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_76id$7d37a793-8e62-4611-8d50-fb46d1f0d1e8$s1_76id$,
  $s1_76st$usmle-step-1$s1_76st$,
  1,
  $s1_76oo${"options": ["Teriparatide is intermittent PTH and is anabolic, and it is avoided after skeletal radiation or Paget disease because of osteosarcoma concern; denosumab blocks RANKL, and stopping it can rebound fractures", "Denosumab is a PTH analog", "Teriparatide blocks RANKL", "Both may be used freely after radiation to bone", "Continuous high PTH and once-daily teriparatide have the same anabolic effect"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Denosumab versus teriparatide", "kind": "vignette"}$s1_76oo$,
  $s1_76no${"options": ["Teriparatide, an intermittent PTH pulse, builds bone; denosumab blocks RANKL, and stopping it can cause rebound fractures", "Denosumab is an intermittent PTH analog and is the drug that builds new bone", "Teriparatide is the antibody against RANKL and is used as an antiresorptive", "Both agents may be started freely after radiation treatment directed at bone", "Continuous high PTH and once-daily teriparatide have the same anabolic effect on bone and may be exchanged for each other"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Denosumab versus teriparatide", "kind": "vignette"}$s1_76no$,
  $s1_76oc$Teriparatide is intermittent PTH and is anabolic, and it is avoided after skeletal radiation or Paget disease because of osteosarcoma concern; denosumab blocks RANKL, and stopping it can rebound fractures$s1_76oc$,
  $s1_76nc$Teriparatide, an intermittent PTH pulse, builds bone; denosumab blocks RANKL, and stopping it can cause rebound fractures$s1_76nc$,
  $s1_76oe$A daily pulse of PTH analog favors osteoblasts. Continuous PTH, as in hyperparathyroidism, favors resorption. That is why teriparatide is anabolic and why it is not the same as a high PTH disease. It carries a rodent osteosarcoma signal, so radiation and Paget disease are avoidance settings. Denosumab is a monoclonal antibody against RANKL, so osteoclasts are not activated. It is antiresorptive. When it is stopped, turnover rebounds and vertebral fractures can follow, so it is not a drug you halt without a plan. Calling both anabolic and both radiation-safe swaps them.$s1_76oe$,
  $s1_76ne$A daily pulse of PTH analog favors osteoblasts. Continuous PTH, as in hyperparathyroidism, favors resorption. That is why teriparatide is anabolic and why it is not the same as a high PTH disease. It carries a rodent osteosarcoma signal, so radiation and Paget disease are avoidance settings. Denosumab is a monoclonal antibody against RANKL, so osteoclasts are not activated. It is antiresorptive. When it is stopped, turnover rebounds and vertebral fractures can follow, so it is not a drug you halt without a plan. Calling both anabolic and both radiation-safe swaps them.$s1_76ne$,
  204, 77, 121, 121,
  2.649351, 1.000000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_77id$7f613402-77ce-4c7a-904f-9a99e78222b4$s1_77id$,
  $s1_77st$usmle-step-1$s1_77st$,
  1,
  $s1_77oo${"options": ["She has von Willebrand disease, autosomal, with a bad platelet-adhesion protein that also carries VIII; he has factor VIII deficiency, an X-linked deep-bleeding disease with normal primary hemostasis", "Both are factor VIII deficiency", "Hemophilia prolongs the bleeding time", "von Willebrand disease is X-linked and causes hemarthroses as the first sign", "A long PTT means the extrinsic pathway in both"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "vWD versus hemophilia", "kind": "vignette"}$s1_77oo$,
  $s1_77no${"options": ["Her von Willebrand factor works poorly and also carries VIII; his VIII deficiency leaves primary hemostasis intact, so the bleeding time is normal", "Both patients have factor VIII deficiency, the same failure of platelet adhesion, and the same prolongation of the bleeding time", "Hemophilia lengthens the bleeding time because primary hemostasis has failed", "von Willebrand disease is X-linked and announces itself with hemarthroses", "A long PTT means the extrinsic pathway is the pathway that has failed in both"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "vWD versus hemophilia", "kind": "vignette"}$s1_77no$,
  $s1_77oc$She has von Willebrand disease, autosomal, with a bad platelet-adhesion protein that also carries VIII; he has factor VIII deficiency, an X-linked deep-bleeding disease with normal primary hemostasis$s1_77oc$,
  $s1_77nc$Her von Willebrand factor works poorly and also carries VIII; his VIII deficiency leaves primary hemostasis intact, so the bleeding time is normal$s1_77nc$,
  $s1_77oe$vWF glues platelets to collagen and carries factor VIII. When it is low or defective, mucosal bleeding and a long bleeding time follow, VIII may be secondarily low, and the inheritance hits both sexes. Hemophilia A is factor VIII itself, X-linked, deep bleeds into joints, normal platelets and bleeding time, and a long PTT. They are not the same platelet defect. Hemophilia does not prolong the bleeding time. vWD is not the hemarthrosis disease and is not X-linked in the usual types. PTT is the intrinsic pathway, which includes VIII, not the extrinsic PT pathway.$s1_77oe$,
  $s1_77ne$vWF glues platelets to collagen and carries factor VIII. When it is low or defective, mucosal bleeding and a long bleeding time follow, VIII may be secondarily low, and the inheritance hits both sexes. Hemophilia A is factor VIII itself, X-linked, deep bleeds into joints, normal platelets and bleeding time, and a long PTT. They are not the same platelet defect. Hemophilia does not prolong the bleeding time. vWD is not the hemarthrosis disease and is not X-linked in the usual types. PTT is the intrinsic pathway, which includes VIII, not the extrinsic PT pathway.$s1_77ne$,
  199, 76, 146, 128,
  2.618421, 1.140625
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_78id$7f7cffe5-d912-4350-b570-a5f8c3b5baed$s1_78id$,
  $s1_78st$usmle-step-1$s1_78st$,
  1,
  $s1_78oo${"options": ["A sudden drop in urate destabilizes crystals; treat the flare with an anti-inflammatory first, and a normal uric acid during an attack does not exclude gout", "A normal uric acid rules out gout, so the crystals were artifact", "Allopurinol is an anti-inflammatory and should calm the joint within hours", "Negative birefringence means pseudogout, so allopurinol is the correct specific drug", "Gram-negative stain means antibiotics are unnecessary only if allopurinol is started"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Do not start allopurinol alone in a hot joint", "kind": "vignette"}$s1_78oo$,
  $s1_78no${"options": ["A sudden fall in urate destabilizes crystals; an anti-inflammatory should come first, and a normal uric acid during the flare does not exclude gout", "A normal uric acid drawn during the attack rules out gout, so the crystals are artifact", "Allopurinol is an anti-inflammatory and should quiet the joint within a few hours", "Negative birefringence means calcium pyrophosphate, and allopurinol is specific treatment for it", "A gram-negative stain means antibiotics are unnecessary only if allopurinol is started the same day and the joint is already settling"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Do not start allopurinol alone in a hot joint", "kind": "vignette"}$s1_78no$,
  $s1_78oc$A sudden drop in urate destabilizes crystals; treat the flare with an anti-inflammatory first, and a normal uric acid during an attack does not exclude gout$s1_78oc$,
  $s1_78nc$A sudden fall in urate destabilizes crystals; an anti-inflammatory should come first, and a normal uric acid during the flare does not exclude gout$s1_78nc$,
  $s1_78oe$Starting urate-lowering therapy during an unprotected flare can mobilize crystals and worsen pain. An NSAID, colchicine, or a steroid covers the flare; allopurinol is prevention, not the acute drug, and if it is started it needs cover. Uric acid often falls during an acute attack, so a normal level does not throw out crystals you already saw. Allopurinol is not an anti-inflammatory. Pseudogout is rhomboid and positively birefringent. A negative gram stain supports a crystal diagnosis only together with the crystals; it is not a reason that allopurinol treats infection.$s1_78oe$,
  $s1_78ne$Starting urate-lowering therapy during an unprotected flare can mobilize crystals and worsen pain. An NSAID, colchicine, or a steroid covers the flare; allopurinol is prevention, not the acute drug, and if it is started it needs cover. Uric acid often falls during an acute attack, so a normal level does not throw out crystals you already saw. Allopurinol is not an anti-inflammatory. Pseudogout is rhomboid and positively birefringent. A negative gram stain supports a crystal diagnosis only together with the crystals; it is not a reason that allopurinol treats infection.$s1_78ne$,
  156, 84, 147, 133,
  1.857143, 1.105263
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_79id$7fc81fea-2b63-4025-8491-970ae60a7e56$s1_79id$,
  $s1_79st$usmle-step-1$s1_79st$,
  1,
  $s1_79oo${"options": ["Growth hormone causes insulin resistance; in acromegaly a glucose load fails to suppress GH, and IGF-1 from the liver is the integrated marker", "Growth hormone lowers glucose, so diabetes rules the diagnosis out", "A normal suppression test confirms acromegaly", "IGF-1 is low when GH is high", "The jaw and hands enlarge from TSH, not GH"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Acromegaly", "kind": "vignette"}$s1_79oo$,
  $s1_79no${"options": ["Growth hormone causes insulin resistance and raises glucose; in acromegaly a glucose load fails to suppress GH", "Growth hormone lowers the serum glucose, so diabetes that coexists with the enlarged hands rules the diagnosis out", "Normal suppression of GH after a glucose load is what confirms acromegaly", "Hepatic IGF-1 is low when growth hormone secretion has been high for months", "The jaw and hands enlarge because of TSH excess, not growth hormone"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Acromegaly", "kind": "vignette"}$s1_79no$,
  $s1_79oc$Growth hormone causes insulin resistance; in acromegaly a glucose load fails to suppress GH, and IGF-1 from the liver is the integrated marker$s1_79oc$,
  $s1_79nc$Growth hormone causes insulin resistance and raises glucose; in acromegaly a glucose load fails to suppress GH$s1_79nc$,
  $s1_79oe$Excess GH from a pituitary adenoma makes the liver produce IGF-1, which grows bone and soft tissue after the plates have closed. GH opposes insulin, so diabetes appears. Normally glucose suppresses GH; failure of that suppression is the confirmatory test. Diabetes is part of the disease, not a coincidence. Successful suppression would argue against autonomy. IGF-1 is high, not low, when GH is chronically high. The soft-tissue growth is GH and IGF-1, not TSH.$s1_79oe$,
  $s1_79ne$Excess GH from a pituitary adenoma makes the liver produce IGF-1, which grows bone and soft tissue after the plates have closed. GH opposes insulin, so diabetes appears. Normally glucose suppresses GH; failure of that suppression is the confirmatory test. Diabetes is part of the disease, not a coincidence. Successful suppression would argue against autonomy. IGF-1 is high, not low, when GH is chronically high. The soft-tissue growth is GH and IGF-1, not TSH.$s1_79ne$,
  142, 66, 110, 114,
  2.151515, 0.964912
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_80id$82632691-e8b0-4f8a-b4aa-d6bd4b2aca7e$s1_80id$,
  $s1_80st$usmle-step-1$s1_80st$,
  1,
  $s1_80oo${"options": ["Ornithine transcarbamylase; carbamoyl phosphate spills into orotic acid. Infant A is earlier, carbamoyl phosphate synthetase I, so orotic acid is not made", "Both lack orotidine decarboxylase, the megaloblastic disease", "Arginase deficiency raises orotic acid and BUN", "OTC deficiency lowers orotic acid", "Uridine monotherapy clears the ammonia in OTC deficiency"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Urea cycle CPS1 versus OTC", "kind": "vignette"}$s1_80oo$,
  $s1_80no${"options": ["Ornithine transcarbamylase, so carbamoyl phosphate becomes orotic acid; the earlier infant lacks carbamoyl phosphate synthetase I and forms no orotic acid", "Both infants lack orotidine decarboxylase, the megaloblastic disorder of pyrimidine synthesis, and that is why orotic acid spills in urine", "Arginase deficiency is the block that raises orotic acid and the blood urea nitrogen", "OTC deficiency decreases orotic acid and raises urea production", "Uridine given alone clears the hyperammonemia of OTC deficiency"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Urea cycle CPS1 versus OTC", "kind": "vignette"}$s1_80no$,
  $s1_80oc$Ornithine transcarbamylase; carbamoyl phosphate spills into orotic acid. Infant A is earlier, carbamoyl phosphate synthetase I, so orotic acid is not made$s1_80oc$,
  $s1_80nc$Ornithine transcarbamylase, so carbamoyl phosphate becomes orotic acid; the earlier infant lacks carbamoyl phosphate synthetase I and forms no orotic acid$s1_80nc$,
  $s1_80oe$If carbamoyl phosphate is made but cannot enter the urea cycle at OTC, it leaks into pyrimidine synthesis and orotic acid rises, with hyperammonemia and no megaloblastic anemia. If CPS-I itself fails, carbamoyl phosphate is not made, so orotic acid stays low and ammonia still rises. Hereditary orotic aciduria is a later pyrimidine-synthesis defect with megaloblastic anemia and no ammonia storm. Arginase is the last urea-cycle step and does not present this way with a high BUN; BUN is low when the cycle is blocked. OTC deficiency raises, not lowers, orotic acid. Uridine does not fix the ammonia.$s1_80oe$,
  $s1_80ne$If carbamoyl phosphate is made but cannot enter the urea cycle at OTC, it leaks into pyrimidine synthesis and orotic acid rises, with hyperammonemia and no megaloblastic anemia. If CPS-I itself fails, carbamoyl phosphate is not made, so orotic acid stays low and ammonia still rises. Hereditary orotic aciduria is a later pyrimidine-synthesis defect with megaloblastic anemia and no ammonia storm. Arginase is the last urea-cycle step and does not present this way with a high BUN; BUN is low when the cycle is blocked. OTC deficiency raises, not lowers, orotic acid. Uridine does not fix the ammonia.$s1_80ne$,
  154, 60, 154, 138,
  2.566667, 1.115942
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_81id$8557837a-dfd7-4d0f-8384-096946caceac$s1_81id$,
  $s1_81st$usmle-step-1$s1_81st$,
  1,
  $s1_81oo${"options": ["Fluoroquinolones raise the risk of tendon rupture, especially with steroids and in older adults; the Achilles is the classic tendon", "Only children get quinolone toxicity, and it is limited to teeth", "Corticosteroids protect tendons from quinolones", "The rupture is an expected effect of penicillin, which he was not taking", "Tendon rupture from this class occurs only in the first hour of the first dose"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Colchicine already have one", "kind": "vignette"}$s1_81oo$,
  $s1_81no${"options": ["Fluoroquinolones raise the risk of tendon rupture, especially with corticosteroids and in older adults; the Achilles is the usual tendon", "Only children develop quinolone toxicity, and the damage is limited to forming teeth and to cartilage in growing joints", "Corticosteroids protect tendons against rupture from this antibiotic class", "The rupture is an expected effect of penicillin, which he was not taking", "Tendon rupture from this class occurs only during the first hour of the first dose"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Colchicine already have one", "kind": "vignette"}$s1_81no$,
  $s1_81oc$Fluoroquinolones raise the risk of tendon rupture, especially with steroids and in older adults; the Achilles is the classic tendon$s1_81oc$,
  $s1_81nc$Fluoroquinolones raise the risk of tendon rupture, especially with corticosteroids and in older adults; the Achilles is the usual tendon$s1_81nc$,
  $s1_81oe$Fluoroquinolones are associated with tendinopathy and rupture, Achilles most often, and the risk climbs with age and corticosteroids. The warning is not limited to growing cartilage in children, which is a separate concern. Steroids add risk; they do not protect. Penicillin is not the tendon drug. Rupture can occur during or months after the course, not only in the first hour.$s1_81oe$,
  $s1_81ne$Fluoroquinolones are associated with tendinopathy and rupture, Achilles most often, and the risk climbs with age and corticosteroids. The warning is not limited to growing cartilage in children, which is a separate concern. Steroids add risk; they do not protect. Penicillin is not the tendon drug. Rupture can occur during or months after the course, not only in the first hour.$s1_81ne$,
  131, 78, 136, 119,
  1.679487, 1.142857
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_82id$86f499ee-49f9-4841-ad15-a2b4b20ab805$s1_82id$,
  $s1_82st$usmle-step-1$s1_82st$,
  1,
  $s1_82oo${"options": ["Nothing in repetition: both fail it. Conduction aphasia is separated by fluent speech and intact comprehension, localizing to the arcuate fasciculus rather than Broca area", "Only Broca aphasia fails repetition; conduction aphasia repeats normally", "Conduction aphasia cannot comprehend, which is why repetition fails", "Broca aphasia is a right-hemisphere lesion in a right-handed person", "The second patient has Wernicke aphasia because repetition is the comprehension test"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Broca versus conduction repeat", "kind": "vignette"}$s1_82oo$,
  $s1_82no${"options": ["Repetition does not separate them, because both fail it; conduction aphasia is fluent with intact comprehension, from the arcuate fasciculus rather than Broca area", "Only Broca aphasia fails repetition; conduction aphasia repeats normally", "Conduction aphasia cannot comprehend speech, which is why repetition fails", "Broca aphasia is a right-hemisphere lesion in a right-handed person", "The second patient has Wernicke aphasia, because an inability to repeat is simply the bedside test of comprehension rather than preserved fluency"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Broca versus conduction repeat", "kind": "vignette"}$s1_82no$,
  $s1_82oc$Nothing in repetition: both fail it. Conduction aphasia is separated by fluent speech and intact comprehension, localizing to the arcuate fasciculus rather than Broca area$s1_82oc$,
  $s1_82nc$Repetition does not separate them, because both fail it; conduction aphasia is fluent with intact comprehension, from the arcuate fasciculus rather than Broca area$s1_82nc$,
  $s1_82oe$Repetition fails in Broca, Wernicke, conduction, and global aphasia, so it does not by itself name the syndrome. The second patient is fluent and understands, which is conduction aphasia, a disconnection in the arcuate fasciculus between comprehension and production. The first patient is nonfluent with good comprehension, which is Broca. Saying conduction aphasia repeats normally is false. Conduction aphasia keeps comprehension. Broca area is dominant frontal, usually left. The second patient understands commands, so this is not Wernicke aphasia; repetition is not a comprehension test.$s1_82oe$,
  $s1_82ne$Repetition fails in Broca, Wernicke, conduction, and global aphasia, so it does not by itself name the syndrome. The second patient is fluent and understands, which is conduction aphasia, a disconnection in the arcuate fasciculus between comprehension and production. The first patient is nonfluent with good comprehension, which is Broca. Saying conduction aphasia repeats normally is false. Conduction aphasia keeps comprehension. Broca area is dominant frontal, usually left. The second patient understands commands, so this is not Wernicke aphasia; repetition is not a comprehension test.$s1_82ne$,
  171, 84, 163, 145,
  2.035714, 1.124138
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_83id$87495809-7264-46c6-834a-f20219ee8ed3$s1_83id$,
  $s1_83st$usmle-step-1$s1_83st$,
  1,
  $s1_83oo${"options": ["Nucleotide excision repair removes ultraviolet dimers; mismatch repair fixes replication errors and is Lynch syndrome, not the sun disease", "Mismatch repair is the xeroderma pigmentosum pathway", "BRCA1 repairs thymine dimers", "Ultraviolet light causes double-strand breaks as its main lesion", "Lynch syndrome is extreme sun sensitivity"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Xeroderma and mismatch", "kind": "vignette"}$s1_83oo$,
  $s1_83no${"options": ["Nucleotide excision repair removes ultraviolet dimers; mismatch repair fixes replication errors and is Lynch syndrome, not sun damage", "Mismatch repair is the DNA pathway that is lost in xeroderma pigmentosum", "BRCA1 is the protein that cuts thymine dimers out of sun-damaged DNA", "The principal lesion made by ultraviolet light is a double-strand break", "Lynch syndrome is extreme sun sensitivity, produced by failure to remove the dimers that ultraviolet light leaves in DNA"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Xeroderma and mismatch", "kind": "vignette"}$s1_83no$,
  $s1_83oc$Nucleotide excision repair removes ultraviolet dimers; mismatch repair fixes replication errors and is Lynch syndrome, not the sun disease$s1_83oc$,
  $s1_83nc$Nucleotide excision repair removes ultraviolet dimers; mismatch repair fixes replication errors and is Lynch syndrome, not sun damage$s1_83nc$,
  $s1_83oe$Ultraviolet light fuses adjacent pyrimidines. Nucleotide excision repair cuts out the dimer; that pathway is xeroderma pigmentosum, with skin cancers. Mismatch repair fixes base-base errors after replication; germline loss is Lynch syndrome and microsatellite cancers, not photosensitivity. BRCA proteins help repair double-strand breaks. Dimers are bulky adducts, not the classic double-strand break. Lynch patients are not the children who burn in minutes.$s1_83oe$,
  $s1_83ne$Ultraviolet light fuses adjacent pyrimidines. Nucleotide excision repair cuts out the dimer; that pathway is xeroderma pigmentosum, with skin cancers. Mismatch repair fixes base-base errors after replication; germline loss is Lynch syndrome and microsatellite cancers, not photosensitivity. BRCA proteins help repair double-strand breaks. Dimers are bulky adducts, not the classic double-strand break. Lynch patients are not the children who burn in minutes.$s1_83ne$,
  138, 64, 133, 120,
  2.156250, 1.108333
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_84id$883be9e8-c661-42e8-9f0a-3936911e7137$s1_84id$,
  $s1_84st$usmle-step-1$s1_84st$,
  1,
  $s1_84oo${"options": ["Clozapine can cause agranulocytosis, so fever means hold the drug and do not restart casually; rigidity is what would suggest neuroleptic malignant syndrome", "Fever on clozapine is always neuroleptic malignant syndrome even with a soft tone", "The neutrophil count is unrelated to clozapine", "Restarting at the same dose the next week is safe after agranulocytosis", "Agranulocytosis is the haloperidol toxicity, and clozapine is the drug that treats it"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Neuroleptic malignant versus serotonin already", "kind": "vignette"}$s1_84oo$,
  $s1_84no${"options": ["Clozapine can cause agranulocytosis, so fever means hold it and do not restart casually; rigidity, not fever alone, suggests neuroleptic malignant syndrome", "Fever during clozapine treatment is always neuroleptic malignant syndrome, even when muscle tone is soft and the neutrophil count is normal", "The circulating neutrophil count is unrelated to safe use of clozapine", "After agranulocytosis, restarting the previous dose the following week is safe", "Agranulocytosis is the toxicity of haloperidol, and clozapine is the drug used to reverse it"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Neuroleptic malignant versus serotonin already", "kind": "vignette"}$s1_84no$,
  $s1_84oc$Clozapine can cause agranulocytosis, so fever means hold the drug and do not restart casually; rigidity is what would suggest neuroleptic malignant syndrome$s1_84oc$,
  $s1_84nc$Clozapine can cause agranulocytosis, so fever means hold it and do not restart casually; rigidity, not fever alone, suggests neuroleptic malignant syndrome$s1_84nc$,
  $s1_84oe$Clozapine requires neutrophil monitoring because it can empty the marrow. A fever and a count of 400 is agranulocytosis until proven otherwise, and the drug stays stopped under a registry, not a casual restart. Neuroleptic malignant syndrome is rigidity, high CK, and bradyreflexia, which this vignette does not have. The count is the point of the monitoring. Restarting immediately recreates the injury. Clozapine is the antipsychotic that causes this marrow toxicity; it is not the treatment for it.$s1_84oe$,
  $s1_84ne$Clozapine requires neutrophil monitoring because it can empty the marrow. A fever and a count of 400 is agranulocytosis until proven otherwise, and the drug stays stopped under a registry, not a casual restart. Neuroleptic malignant syndrome is rigidity, high CK, and bradyreflexia, which this vignette does not have. The count is the point of the monitoring. Restarting immediately recreates the injury. Clozapine is the antipsychotic that causes this marrow toxicity; it is not the treatment for it.$s1_84ne$,
  156, 85, 155, 139,
  1.835294, 1.115108
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_85id$8881b4a1-f482-4f60-b9f0-1d641c4a542d$s1_85id$,
  $s1_85st$usmle-step-1$s1_85st$,
  1,
  $s1_85oo${"options": ["APC starts the adenoma-carcinoma sequence of FAP; Lynch syndrome is mismatch-repair failure, few polyps, and right-sided mucinous cancers", "Both are APC", "Lynch syndrome produces thousands of polyps", "Mismatch repair is the first hit of every sporadic polyp", "FAP cancers are usually in the rectum only after age 80"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "APC and colon cancer", "kind": "vignette"}$s1_85oo$,
  $s1_85no${"options": ["APC starts the polyposis of FAP; Lynch syndrome is mismatch-repair failure, with few polyps and right-sided mucinous cancers", "FAP and Lynch syndrome are both caused by germline APC mutations", "Lynch syndrome fills the colon with thousands of adenomatous polyps", "Mismatch repair is the first mutation of every sporadic adenomatous polyp", "Cancers in FAP arise in the rectum only after the patient has passed age 80, and the proximal colon is spared"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "APC and colon cancer", "kind": "vignette"}$s1_85no$,
  $s1_85oc$APC starts the adenoma-carcinoma sequence of FAP; Lynch syndrome is mismatch-repair failure, few polyps, and right-sided mucinous cancers$s1_85oc$,
  $s1_85nc$APC starts the polyposis of FAP; Lynch syndrome is mismatch-repair failure, with few polyps and right-sided mucinous cancers$s1_85nc$,
  $s1_85oe$FAP is germline APC. Hundreds of adenomas form, and cancer is nearly certain without colectomy, often by middle age. Lynch syndrome is MLH1, MSH2, and related mismatch-repair genes. Polyps are few, cancers are often right-sided and mucinous, with microsatellite instability, and other organs such as endometrium are at risk. They are not the same gene. Lynch is not a carpet of polyps. Most sporadic polyps still begin with APC, not mismatch repair. FAP does not wait until age 80.$s1_85oe$,
  $s1_85ne$FAP is germline APC. Hundreds of adenomas form, and cancer is nearly certain without colectomy, often by middle age. Lynch syndrome is MLH1, MSH2, and related mismatch-repair genes. Polyps are few, cancers are often right-sided and mucinous, with microsatellite instability, and other organs such as endometrium are at risk. They are not the same gene. Lynch is not a carpet of polyps. Most sporadic polyps still begin with APC, not mismatch repair. FAP does not wait until age 80.$s1_85ne$,
  137, 56, 124, 109,
  2.446429, 1.137615
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_86id$88f96721-4420-498b-b251-ac9ca4817031$s1_86id$,
  $s1_86st$usmle-step-1$s1_86st$,
  1,
  $s1_86oo${"options": ["Both are made in hypothalamic nuclei and released from the posterior pituitary; ADH uses V2 receptors and aquaporins, oxytocin uses a different receptor on breast and uterus", "Both are made in the anterior pituitary", "Oxytocin inserts aquaporins in the collecting duct", "ADH causes milk letdown", "V1 receptors in the kidney are the antidiuretic ones"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Oxytocin versus ADH", "kind": "vignette"}$s1_86oo$,
  $s1_86no${"options": ["Both are made in hypothalamic nuclei and released from the posterior pituitary; ADH holds water through V2 receptors and aquaporins", "Both hormones are synthesized by cells of the anterior pituitary", "Oxytocin is the hormone that inserts aquaporins into the collecting duct", "ADH acting on the breast is what produces milk letdown", "V1 receptors on the kidney insert aquaporins into the collecting duct and are the receptors that conserve free water"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Oxytocin versus ADH", "kind": "vignette"}$s1_86no$,
  $s1_86oc$Both are made in hypothalamic nuclei and released from the posterior pituitary; ADH uses V2 receptors and aquaporins, oxytocin uses a different receptor on breast and uterus$s1_86oc$,
  $s1_86nc$Both are made in hypothalamic nuclei and released from the posterior pituitary; ADH holds water through V2 receptors and aquaporins$s1_86nc$,
  $s1_86oe$Supraoptic and paraventricular neurons make ADH and oxytocin. The posterior pituitary only releases them. ADH's V2 receptor puts aquaporin-2 in the collecting duct; V1 receptors constrict vessels. Oxytocin contracts myoepithelium and uterine muscle and does not retain water. They are not anterior-pituitary products. Oxytocin does not insert renal aquaporins. ADH is not the milk-ejection hormone. The antidiuretic receptor is V2, not V1.$s1_86oe$,
  $s1_86ne$Supraoptic and paraventricular neurons make ADH and oxytocin. The posterior pituitary only releases them. ADH's V2 receptor puts aquaporin-2 in the collecting duct; V1 receptors constrict vessels. Oxytocin contracts myoepithelium and uterine muscle and does not retain water. They are not anterior-pituitary products. Oxytocin does not insert renal aquaporins. ADH is not the milk-ejection hormone. The antidiuretic receptor is V2, not V1.$s1_86ne$,
  173, 52, 131, 116,
  3.326923, 1.129310
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_87id$89740024-069b-4113-9ecd-6c9bfc508561$s1_87id$,
  $s1_87st$usmle-step-1$s1_87st$,
  1,
  $s1_87oo${"options": ["Estrogen cannot be made from androgens; fetal androgens spill into the mother, the XX fetus is virilized, and puberty cannot grow breasts or close plates", "Androgen receptors are absent, so an XX infant virilizes", "5-alpha reductase is absent in an XX fetus", "The mother has a luteoma that makes estrogen, which virilizes", "Bone age advances rapidly because estrogen is the hormone that keeps plates open"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Aromatase deficiency", "kind": "vignette"}$s1_87oo$,
  $s1_87no${"options": ["Estrogen cannot be made from androgens; fetal androgens virilize the mother and the XX fetus, and puberty cannot grow breasts or close the plates", "Missing androgen receptors are what cause an XX fetus to virilize", "Absence of 5-alpha reductase in an XX fetus is what blocks estrogen synthesis", "A luteoma in the mother secretes estrogen, and that estrogen is what virilizes her", "Skeletal age advances rapidly because estrogen is the hormone that keeps the growth plates open and delays their eventual closure"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Aromatase deficiency", "kind": "vignette"}$s1_87no$,
  $s1_87oc$Estrogen cannot be made from androgens; fetal androgens spill into the mother, the XX fetus is virilized, and puberty cannot grow breasts or close plates$s1_87oc$,
  $s1_87nc$Estrogen cannot be made from androgens; fetal androgens virilize the mother and the XX fetus, and puberty cannot grow breasts or close the plates$s1_87nc$,
  $s1_87oe$Aromatase converts androgens to estrogens in the placenta and the ovary. Without it, androgens accumulate, the mother virilizes during pregnancy, and a genetic female is born virilized. At puberty there is no estrogen to develop breasts or to fuse epiphyses, so she is tall, and gonadotropins rise. Androgen insensitivity is an XY individual who looks female. 5-alpha reductase deficiency is an XY fetus. A luteoma can virilize a mother but does not delete the child's aromatase for life. Estrogen closes growth plates; its absence delays fusion.$s1_87oe$,
  $s1_87ne$Aromatase converts androgens to estrogens in the placenta and the ovary. Without it, androgens accumulate, the mother virilizes during pregnancy, and a genetic female is born virilized. At puberty there is no estrogen to develop breasts or to fuse epiphyses, so she is tall, and gonadotropins rise. Androgen insensitivity is an XY individual who looks female. 5-alpha reductase deficiency is an XY fetus. A luteoma can virilize a mother but does not delete the child's aromatase for life. Estrogen closes growth plates; its absence delays fusion.$s1_87ne$,
  153, 80, 145, 129,
  1.912500, 1.124031
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_88id$8bd1b6e1-edf0-4f98-8b7d-cd2d9ec1ee7c$s1_88id$,
  $s1_88st$usmle-step-1$s1_88st$,
  1,
  $s1_88oo${"options": ["Anticipation from expansion of a CTG repeat; chloride-channel related myotonia from DMPK dysfunction, with cataracts and an autosomal dominant parent", "A frameshift in dystrophin, which causes myotonia and cataracts", "Anticipation only occurs in GAA repeats, so this child was adopted", "The handshake delay is Lambert-Eaton facilitation and should improve with repetition of a different kind", "This is autosomal recessive, so a mother and child pair is impossible"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Myotonic dystrophy", "kind": "vignette"}$s1_88oo$,
  $s1_88no${"options": ["Anticipation from a CTG expansion; DMPK dysfunction causes chloride-channel myotonia, with cataracts and autosomal dominant inheritance", "A frameshift in dystrophin, producing myotonia, cataracts, and delayed relaxation of the grip", "Anticipation only occurs in GAA repeats, which is why this more affected child was adopted", "The slow release of a handshake is Lambert-Eaton facilitation and should become easier as that same grip is repeated", "Inheritance is autosomal recessive, so the same disease in a mother and her child is impossible"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Myotonic dystrophy", "kind": "vignette"}$s1_88no$,
  $s1_88oc$Anticipation from expansion of a CTG repeat; chloride-channel related myotonia from DMPK dysfunction, with cataracts and an autosomal dominant parent$s1_88oc$,
  $s1_88nc$Anticipation from a CTG expansion; DMPK dysfunction causes chloride-channel myotonia, with cataracts and autosomal dominant inheritance$s1_88nc$,
  $s1_88oe$Myotonic dystrophy type 1 is a CTG expansion in the DMPK gene. The repeat grows in successive generations, especially through the mother for congenital disease, which is anticipation. The muscle cannot relax, a myotonia, and cataracts, frontal balding, and a distal weakness pattern come with it. Dystrophin frameshifts cause Duchenne weakness, not delayed relaxation and cataracts. Anticipation is not exclusive to Friedreich GAA repeats. Lambert-Eaton gets stronger with use; myotonia is delayed relaxation after a grip. The inheritance is autosomal dominant, so parent and child is expected.$s1_88oe$,
  $s1_88ne$Myotonic dystrophy type 1 is a CTG expansion in the DMPK gene. The repeat grows in successive generations, especially through the mother for congenital disease, which is anticipation. The muscle cannot relax, a myotonia, and cataracts, frontal balding, and a distal weakness pattern come with it. Dystrophin frameshifts cause Duchenne weakness, not delayed relaxation and cataracts. Anticipation is not exclusive to Friedreich GAA repeats. Lambert-Eaton gets stronger with use; myotonia is delayed relaxation after a grip. The inheritance is autosomal dominant, so parent and child is expected.$s1_88ne$,
  149, 104, 135, 116,
  1.432692, 1.163793
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_89id$8fd34ae9-9011-420d-aa73-e726ae29f6fc$s1_89id$,
  $s1_89st$usmle-step-1$s1_89st$,
  1,
  $s1_89oo${"options": ["A lacks the vWF-cleaving protease, so platelet thrombi form; B consumes clotting factors and fibrinogen; C is toxin-mediated HUS and is not DIC", "All three have low fibrinogen as the definition", "ADAMTS13 deficiency prolongs the PT", "Heparin is the treatment of TTP", "E. coli HUS is treated with platelets as the first move and antibiotics always help"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "TTP versus DIC versus HUS", "kind": "vignette"}$s1_89oo$,
  $s1_89no${"options": ["A lacks the vWF-cleaving protease and forms platelet thrombi; B consumes clotting factors and fibrinogen; C is toxin-mediated HUS, not DIC", "All three are defined by consumption of fibrinogen", "Deficiency of ADAMTS13 prolongs the prothrombin time by using up clotting factors", "Heparin is the treatment that replaces the missing protease in TTP", "E. coli HUS is treated with a platelet transfusion as the first step, and antibiotics always help both the colitis and the kidneys"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "TTP versus DIC versus HUS", "kind": "vignette"}$s1_89no$,
  $s1_89oc$A lacks the vWF-cleaving protease, so platelet thrombi form; B consumes clotting factors and fibrinogen; C is toxin-mediated HUS and is not DIC$s1_89oc$,
  $s1_89nc$A lacks the vWF-cleaving protease and forms platelet thrombi; B consumes clotting factors and fibrinogen; C is toxin-mediated HUS, not DIC$s1_89nc$,
  $s1_89oe$TTP is ADAMTS13 deficiency. Ultra-large vWF multimers trap platelets, the smear shows schistocytes, and the clotting times stay normal because factors are not consumed. Plasma exchange replaces the enzyme. DIC consumes factors, fibrinogen falls, D-dimer rises, and PT/PTT lengthen; treat the cause. HUS after Shiga toxin is renal-predominant thrombotic microangiopathy with normal coags. Heparin does not replace ADAMTS13. A low ADAMTS13 does not prolong the PT. Platelet transfusion in TTP can feed the thrombi, and antibiotics in Shiga HUS are not the simple fix.$s1_89oe$,
  $s1_89ne$TTP is ADAMTS13 deficiency. Ultra-large vWF multimers trap platelets, the smear shows schistocytes, and the clotting times stay normal because factors are not consumed. Plasma exchange replaces the enzyme. DIC consumes factors, fibrinogen falls, D-dimer rises, and PT/PTT lengthen; treat the cause. HUS after Shiga toxin is renal-predominant thrombotic microangiopathy with normal coags. Heparin does not replace ADAMTS13. A low ADAMTS13 does not prolong the PT. Platelet transfusion in TTP can feed the thrombi, and antibiotics in Shiga HUS are not the simple fix.$s1_89ne$,
  143, 83, 138, 130,
  1.722892, 1.061538
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_90id$9205c7e4-4ea5-46f7-8ec8-52d3468d3507$s1_90id$,
  $s1_90st$usmle-step-1$s1_90st$,
  1,
  $s1_90oo${"options": ["Insulin and high LH drive theca-cell androgens; follicles do not mature well because FSH action is relatively low, and an adrenal tumor is not required", "FSH is higher than LH, which luteinizes many follicles", "Androgens come only from a cortisol-producing adenoma", "Insulin resistance lowers ovarian androgen production", "Regular monthly ovulation is the definition of this physiology"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "PCOS mechanism", "kind": "vignette"}$s1_90oo$,
  $s1_90no${"options": ["LH runs high relative to FSH; insulin and LH drive theca-cell androgens, follicles mature poorly, and an adrenal tumor is not required", "FSH is the higher gonadotropin, luteinizes a crop of follicles each month, and is the ovarian source of the androgens", "The androgens come only from a cortisol-secreting adrenal adenoma", "Insulin resistance lowers androgen production by the ovarian theca cells", "Regular monthly ovulation is the defining feature of this physiology"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "PCOS mechanism", "kind": "vignette"}$s1_90no$,
  $s1_90oc$Insulin and high LH drive theca-cell androgens; follicles do not mature well because FSH action is relatively low, and an adrenal tumor is not required$s1_90oc$,
  $s1_90nc$LH runs high relative to FSH; insulin and LH drive theca-cell androgens, follicles mature poorly, and an adrenal tumor is not required$s1_90nc$,
  $s1_90oe$In PCOS, LH is disproportionately high and pushes theca cells to make androgens. FSH is relatively low, so many follicles stall. Hyperinsulinemia amplifies ovarian androgen production and lowers sex-hormone binding globulin. Most hirsutism of this pattern is ovarian, and a very high DHEA-S would be the adrenal-tumor clue, which is not this story. FSH is not the dominant gonadotropin here. A cortisol adenoma is Cushing syndrome. Insulin resistance increases, not lowers, the androgen drive. Ovulation is infrequent, which is why menses are irregular.$s1_90oe$,
  $s1_90ne$In PCOS, LH is disproportionately high and pushes theca cells to make androgens. FSH is relatively low, so many follicles stall. Hyperinsulinemia amplifies ovarian androgen production and lowers sex-hormone binding globulin. Most hirsutism of this pattern is ovarian, and a very high DHEA-S would be the adrenal-tumor clue, which is not this story. FSH is not the dominant gonadotropin here. A cortisol adenoma is Cushing syndrome. Insulin resistance increases, not lowers, the androgen drive. Ovulation is infrequent, which is why menses are irregular.$s1_90ne$,
  151, 62, 134, 117,
  2.435484, 1.145299
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_91id$924ead04-d8b0-40a4-b9a0-9471f7b0df91$s1_91id$,
  $s1_91st$usmle-step-1$s1_91st$,
  1,
  $s1_91oo${"options": ["The liver releases glucose from glycogen and gluconeogenesis and exports ketone bodies; the brain uses glucose and, later, ketones, not free fatty acids", "Muscle glycogen keeps the blood glucose normal for days", "High insulin in fasting drives ketogenesis", "Fatty acids cross the blood-brain barrier as the main fuel on day one", "Glucagon stores glycogen"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Insulin versus glucagon fasting", "kind": "vignette"}$s1_91oo$,
  $s1_91no${"options": ["The liver exports glucose from glycogen and gluconeogenesis plus ketone bodies; the brain uses glucose and later ketones, not fatty acids", "Glycogen inside skeletal muscle keeps blood glucose normal for days of fasting, because muscle releases that glucose into the blood", "The high insulin level of fasting is what turns on hepatic ketogenesis", "Free fatty acids cross the blood-brain barrier and are the brain's main fuel on day one", "Glucagon's fasting job is to store glycogen and shut off ketone export"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Insulin versus glucagon fasting", "kind": "vignette"}$s1_91no$,
  $s1_91oc$The liver releases glucose from glycogen and gluconeogenesis and exports ketone bodies; the brain uses glucose and, later, ketones, not free fatty acids$s1_91oc$,
  $s1_91nc$The liver exports glucose from glycogen and gluconeogenesis plus ketone bodies; the brain uses glucose and later ketones, not fatty acids$s1_91nc$,
  $s1_91oe$Low insulin and high glucagon turn on hepatic glycogenolysis, gluconeogenesis, and ketogenesis. Muscle glycogen is for the muscle; it does not maintain blood glucose because muscle lacks glucose-6-phosphatase. Fatty acids are a fuel for muscle but do not meaningfully feed the brain. Ketones do. Insulin is low in fasting; high insulin would suppress ketogenesis and is the fed state. Glucagon promotes glycogen breakdown, not storage.$s1_91oe$,
  $s1_91ne$Low insulin and high glucagon turn on hepatic glycogenolysis, gluconeogenesis, and ketogenesis. Muscle glycogen is for the muscle; it does not maintain blood glucose because muscle lacks glucose-6-phosphatase. Fatty acids are a fuel for muscle but do not meaningfully feed the brain. Ketones do. Insulin is low in fasting; high insulin would suppress ketogenesis and is the fed state. Glucagon promotes glycogen breakdown, not storage.$s1_91ne$,
  152, 69, 137, 131,
  2.202899, 1.045802
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_92id$9286a904-b968-4448-8698-77e08d1f379c$s1_92id$,
  $s1_92st$usmle-step-1$s1_92st$,
  1,
  $s1_92oo${"options": ["C1 inhibitor is low or dysfunctional, so bradykinin accumulates; this is not histamine edema, so antihistamines and steroids miss the mechanism", "IgE is elevated and antihistamines are first-line specific therapy", "C3 is the deficient protein, and swelling is from infection only", "Terminal complement is gone, so she is at risk for Neisseria and the swelling is meningococcemia", "ACE inhibitors treat this disease by lowering bradykinin"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Hereditary angioedema", "kind": "vignette"}$s1_92oo$,
  $s1_92no${"options": ["C1 inhibitor is low or inactive, so bradykinin accumulates; this edema is not histamine, and antihistamines miss the mechanism", "IgE is elevated, and antihistamines are specific first-line treatment for the swelling", "C3 is the deficient protein, and the swelling comes from bacterial infection only", "Terminal complement is absent, so she is at risk for Neisseria, and the swelling is early meningococcemia in the face and airway", "An ACE inhibitor prevents the attacks by lowering the bradykinin level"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Hereditary angioedema", "kind": "vignette"}$s1_92no$,
  $s1_92oc$C1 inhibitor is low or dysfunctional, so bradykinin accumulates; this is not histamine edema, so antihistamines and steroids miss the mechanism$s1_92oc$,
  $s1_92nc$C1 inhibitor is low or inactive, so bradykinin accumulates; this edema is not histamine, and antihistamines miss the mechanism$s1_92nc$,
  $s1_92oe$C1 inhibitor normally brakes the complement and kallikrein-kinin cascades. Without it, bradykinin increases vascular permeability. There are no hives because histamine is not the mediator, which is why epinephrine and antihistamines disappoint. C4 is consumed and is a screening clue. This is not atopic IgE disease. C3 deficiency presents with pyogenic infection, not hereditary angioedema. Terminal-complement deficiency is Neisseria susceptibility. ACE inhibitors raise bradykinin and can provoke angioedema; they are not the treatment.$s1_92oe$,
  $s1_92ne$C1 inhibitor normally brakes the complement and kallikrein-kinin cascades. Without it, bradykinin increases vascular permeability. There are no hives because histamine is not the mediator, which is why epinephrine and antihistamines disappoint. C4 is consumed and is a screening clue. This is not atopic IgE disease. C3 deficiency presents with pyogenic infection, not hereditary angioedema. Terminal-complement deficiency is Neisseria susceptibility. ACE inhibitors raise bradykinin and can provoke angioedema; they are not the treatment.$s1_92ne$,
  143, 96, 126, 128,
  1.489583, 0.984375
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_93id$948781fa-3b35-493b-b52f-f379b7206aa5$s1_93id$,
  $s1_93st$usmle-step-1$s1_93st$,
  1,
  $s1_93oo${"options": ["Rapid rise in serum osmolality stripped myelin from the basis pontis; chronic hyponatremia should be corrected slowly, often near 8 mmol/L in 24 hours or less in high-risk patients", "The pontine lesion is an infarct from the seizure, and any sodium goal is safe", "Too-slow correction caused the demyelination", "The lesion is central pontine myelinolysis from low sodium itself, independent of the correction rate", "This is Wernicke encephalopathy, and the MRI lesion is the mammillary body"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Osmotic demyelination", "kind": "vignette"}$s1_93oo$,
  $s1_93no${"options": ["A rapid osmotic rise stripped myelin from the basis pontis; chronic hyponatremia should be corrected slowly, near 8 mmol/L in 24 hours or less if risk is high", "The pontine lesion is an infarct from the seizure, and any pace of sodium correction, rapid or gradual, is safe even in chronic hyponatremia", "Correcting the sodium too slowly is what demyelinated the pons", "The myelin injury came from the low sodium itself and does not depend on the speed of correction", "This is Wernicke encephalopathy, and the MRI lesion sits in the mammillary bodies"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Osmotic demyelination", "kind": "vignette"}$s1_93no$,
  $s1_93oc$Rapid rise in serum osmolality stripped myelin from the basis pontis; chronic hyponatremia should be corrected slowly, often near 8 mmol/L in 24 hours or less in high-risk patients$s1_93oc$,
  $s1_93nc$A rapid osmotic rise stripped myelin from the basis pontis; chronic hyponatremia should be corrected slowly, near 8 mmol/L in 24 hours or less if risk is high$s1_93nc$,
  $s1_93oe$Oligodendrocytes in a chronically hyponatremic brain have adjusted. A fast osmotic rise pulls water out and demyelinates the central pons, so the patient is locked in or quadriparetic while awareness remains. The correction here, 26 mmol/L in half a day, is far above a cautious limit. A seizure does not infarct the center of the pons in this pattern. Slow correction does not cause osmotic demyelination; the risk of slow correction is ongoing severe hyponatremia, which is a different problem. The low sodium alone did not make this delayed lesion; the jump did. Mammillary bodies are Wernicke disease, not a central pontine T2 lesion after a sodium spike.$s1_93oe$,
  $s1_93ne$Oligodendrocytes in a chronically hyponatremic brain have adjusted. A fast osmotic rise pulls water out and demyelinates the central pons, so the patient is locked in or quadriparetic while awareness remains. The correction here, 26 mmol/L in half a day, is far above a cautious limit. A seizure does not infarct the center of the pons in this pattern. Slow correction does not cause osmotic demyelination; the risk of slow correction is ongoing severe hyponatremia, which is a different problem. The low sodium alone did not make this delayed lesion; the jump did. Mammillary bodies are Wernicke disease, not a central pontine T2 lesion after a sodium spike.$s1_93ne$,
  180, 101, 158, 140,
  1.782178, 1.128571
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_94id$957e7d47-d764-4b5a-8fe0-f94505687879$s1_94id$,
  $s1_94st$usmle-step-1$s1_94st$,
  1,
  $s1_94oo${"options": ["Atropine blocks muscarinic receptors only; pralidoxime regenerates acetylcholinesterase at nicotinic sites if given before aging", "Atropine blocks nicotinic receptors, so weakness means the dose was too small", "Pralidoxime is a muscarinic agonist and would worsen secretions", "The weakness is a benzodiazepine-deficiency state and is treated with flumazenil", "Succinylcholine will outcompete the toxin at the neuromuscular junction"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Organophosphate poisoning", "kind": "vignette"}$s1_94oo$,
  $s1_94no${"options": ["Atropine blocks muscarinic receptors only; pralidoxime regenerates acetylcholinesterase at nicotinic sites if it is given before aging", "Atropine blocks nicotinic receptors on skeletal muscle, so weakness that persists means the atropine dose was too small", "Pralidoxime is a muscarinic agonist and would increase secretions and bronchospasm", "The weakness reflects too little benzodiazepine effect and is treated with flumazenil", "Succinylcholine will displace the organophosphate from the neuromuscular junction"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Organophosphate poisoning", "kind": "vignette"}$s1_94no$,
  $s1_94oc$Atropine blocks muscarinic receptors only; pralidoxime regenerates acetylcholinesterase at nicotinic sites if given before aging$s1_94oc$,
  $s1_94nc$Atropine blocks muscarinic receptors only; pralidoxime regenerates acetylcholinesterase at nicotinic sites if it is given before aging$s1_94nc$,
  $s1_94oe$Organophosphates phosphorylate acetylcholinesterase. Atropine competes at muscarinic receptors, so it dries secretions and raises heart rate, but skeletal muscle and ganglia use nicotinic receptors, which atropine does not block. Pralidoxime pulls the phosphate off the enzyme if aging has not locked it. Saying atropine is nicotinic reverses the pharmacology and would make you keep giving atropine for paralysis it cannot fix. Pralidoxime is not a muscarinic agonist. Flumazenil reverses benzodiazepines and is irrelevant and unsafe here. Succinylcholine is a depolarizing blocker and would add paralysis, not restore acetylcholine breakdown.$s1_94oe$,
  $s1_94ne$Organophosphates phosphorylate acetylcholinesterase. Atropine competes at muscarinic receptors, so it dries secretions and raises heart rate, but skeletal muscle and ganglia use nicotinic receptors, which atropine does not block. Pralidoxime pulls the phosphate off the enzyme if aging has not locked it. Saying atropine is nicotinic reverses the pharmacology and would make you keep giving atropine for paralysis it cannot fix. Pralidoxime is not a muscarinic agonist. Flumazenil reverses benzodiazepines and is irrelevant and unsafe here. Succinylcholine is a depolarizing blocker and would add paralysis, not restore acetylcholine breakdown.$s1_94ne$,
  128, 80, 134, 119,
  1.600000, 1.126050
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_95id$974fa6ee-07b2-4e9a-bf93-7a6a9ecb3583$s1_95id$,
  $s1_95st$usmle-step-1$s1_95st$,
  1,
  $s1_95oo${"options": ["Myc is a transcription-factor oncogene driving proliferation; the stars are tingible-body macrophages eating apoptotic debris in a fast tumor", "Myc repairs DNA and loss of one copy causes the tumor", "The starry sky is caseation from tuberculosis", "The translocation is t(9;22)", "Burkitt lymphoma is indolent"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Burkitt myc", "kind": "vignette"}$s1_95oo$,
  $s1_95no${"options": ["Myc is a transcription-factor oncogene driving proliferation; the stars are tingible-body macrophages clearing apoptotic debris", "Myc is a DNA-repair gene, and loss of one copy is what creates this lymphoma", "The starry-sky pattern is caseous necrosis caused by tuberculosis", "The translocation that defines the lymphoma is t(9;22), creating the Philadelphia chromosome and an indolent clone", "Burkitt lymphoma is an indolent B-cell lymphoma seen in older adults"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Burkitt myc", "kind": "vignette"}$s1_95no$,
  $s1_95oc$Myc is a transcription-factor oncogene driving proliferation; the stars are tingible-body macrophages eating apoptotic debris in a fast tumor$s1_95oc$,
  $s1_95nc$Myc is a transcription-factor oncogene driving proliferation; the stars are tingible-body macrophages clearing apoptotic debris$s1_95nc$,
  $s1_95oe$Myc next to an immunoglobulin promoter is a powerful proliferation signal. The tumor doubles fast, many cells apoptose, and macrophages full of debris make the starry sky. It is an oncogene, not a suppressor. Caseation is granulomatous necrosis, not this high-power look. t(9;22) is CML. Burkitt is aggressive, not indolent.$s1_95oe$,
  $s1_95ne$Myc next to an immunoglobulin promoter is a powerful proliferation signal. The tumor doubles fast, many cells apoptose, and macrophages full of debris make the starry sky. It is an oncogene, not a suppressor. Caseation is granulomatous necrosis, not this high-power look. t(9;22) is CML. Burkitt is aggressive, not indolent.$s1_95ne$,
  141, 53, 127, 114,
  2.660377, 1.114035
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_96id$9770c694-7902-4a22-9f0a-404755abbf36$s1_96id$,
  $s1_96st$usmle-step-1$s1_96st$,
  1,
  $s1_96oo${"options": ["Peripheral deiodinase shifts T4 toward reverse T3 instead of T3 during illness; the TSH is not elevated, so this is not primary hypothyroidism", "Primary hypothyroidism, because T3 is low and TSH should be ignored", "Reverse T3 is the active hormone, so a high level means hyperthyroidism", "Levothyroxine is required to correct reverse T3 in the ICU", "A high TSH is part of the sick-euthyroid pattern"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sick euthyroid", "kind": "vignette"}$s1_96oo$,
  $s1_96no${"options": ["In illness, deiodinase sends T4 to reverse T3 instead of T3; TSH is not elevated, so this is not primary hypothyroidism", "This is primary hypothyroidism, because T3 is low and the TSH should be ignored when the replacement dose is chosen", "Reverse T3 is the active hormone, so a high level means hyperthyroidism of illness", "Levothyroxine is required in the ICU to convert the reverse T3 back to T3", "A raised TSH is a standard part of the sick-euthyroid laboratory pattern"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sick euthyroid", "kind": "vignette"}$s1_96no$,
  $s1_96oc$Peripheral deiodinase shifts T4 toward reverse T3 instead of T3 during illness; the TSH is not elevated, so this is not primary hypothyroidism$s1_96oc$,
  $s1_96nc$In illness, deiodinase sends T4 to reverse T3 instead of T3; TSH is not elevated, so this is not primary hypothyroidism$s1_96nc$,
  $s1_96oe$In nonthyroidal illness, less T4 is converted to active T3 and more becomes inactive reverse T3. The pituitary is not driving a high TSH the way it does in primary hypothyroidism. Treating the number with levothyroxine is not the fix; the illness is. Reverse T3 is inactive. The pattern is an adaptive lab change, not a prescription. A high TSH would suggest real primary hypothyroidism and is not the usual sick-euthyroid picture.$s1_96oe$,
  $s1_96ne$In nonthyroidal illness, less T4 is converted to active T3 and more becomes inactive reverse T3. The pituitary is not driving a high TSH the way it does in primary hypothyroidism. Treating the number with levothyroxine is not the fix; the illness is. Reverse T3 is inactive. The pattern is an adaptive lab change, not a prescription. A high TSH would suggest real primary hypothyroidism and is not the usual sick-euthyroid picture.$s1_96ne$,
  142, 71, 119, 115,
  2.000000, 1.034783
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_97id$9f4d6cad-5cd6-48e3-81ac-c420a81319b0$s1_97id$,
  $s1_97st$usmle-step-1$s1_97st$,
  1,
  $s1_97oo${"options": ["The left gonadal vein drains to the left renal vein at a right angle, so left varicoceles are common; a new right varicocele raises concern for a vena cava or renal obstruction", "Both sides drain the same way, so side does not matter", "The right vein drains to the renal vein and is the common side", "A right varicocele is always benign", "Varicoceles are arterial aneurysms"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Left varicocele", "kind": "vignette"}$s1_97oo$,
  $s1_97no${"options": ["The left gonadal vein joins the left renal vein at a right angle, so left varicoceles are common; a new right one suggests caval or renal-vein obstruction", "Both gonadal veins drain by the same route, so the side of the varicocele does not matter", "The right gonadal vein drains to the renal vein, which is why the right side is the usual side for an uncomplicated varicocele of the cord", "A varicocele on the right is always benign and does not call for a search for obstruction", "Varicoceles are arterial aneurysms of the testicular artery"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Left varicocele", "kind": "vignette"}$s1_97no$,
  $s1_97oc$The left gonadal vein drains to the left renal vein at a right angle, so left varicoceles are common; a new right varicocele raises concern for a vena cava or renal obstruction$s1_97oc$,
  $s1_97nc$The left gonadal vein joins the left renal vein at a right angle, so left varicoceles are common; a new right one suggests caval or renal-vein obstruction$s1_97nc$,
  $s1_97oe$The left testicular vein enters the left renal vein perpendicularly and under higher pressure, so left varicoceles predominate and can impair fertility by warming the testis. The right vein enters the IVC more directly. A unilateral right varicocele, especially if it appears suddenly or does not decompress, can signal a retroperitoneal mass or thrombus. Side is not random. The right is not the usual renal-vein side. A new right varicocele is not dismissed. These are veins, not arteries.$s1_97oe$,
  $s1_97ne$The left testicular vein enters the left renal vein perpendicularly and under higher pressure, so left varicoceles predominate and can impair fertility by warming the testis. The right vein enters the IVC more directly. A unilateral right varicocele, especially if it appears suddenly or does not decompress, can signal a retroperitoneal mass or thrombus. Side is not random. The right is not the usual renal-vein side. A new right varicocele is not dismissed. These are veins, not arteries.$s1_97ne$,
  176, 62, 154, 138,
  2.838710, 1.115942
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_98id$a0b38e50-3212-4351-a049-056d4a4ba2a5$s1_98id$,
  $s1_98st$usmle-step-1$s1_98st$,
  1,
  $s1_98oo${"options": ["TNF and related cytokines raise metabolic rate and waste both fat and muscle; starvation preferentially uses fat and lowers the metabolic rate", "Starvation and cachexia are identical metabolically", "TNF increases appetite", "Muscle is spared in cachexia", "Feeding fully reverses cytokine cachexia the way it reverses pure starvation"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Cachexia TNF", "kind": "vignette"}$s1_98oo$,
  $s1_98no${"options": ["TNF and related cytokines raise the metabolic rate and waste fat and muscle; starvation uses fat first and lowers the metabolic rate", "Cachexia and starvation consume the same fuels at the same metabolic rate", "TNF stimulates appetite and shifts metabolism toward storage of fat", "Skeletal muscle is spared while cytokine-driven wasting consumes fat", "Extra calories fully reverse cytokine-driven cachexia in the same way they restore weight lost during uncomplicated starvation"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Cachexia TNF", "kind": "vignette"}$s1_98no$,
  $s1_98oc$TNF and related cytokines raise metabolic rate and waste both fat and muscle; starvation preferentially uses fat and lowers the metabolic rate$s1_98oc$,
  $s1_98nc$TNF and related cytokines raise the metabolic rate and waste fat and muscle; starvation uses fat first and lowers the metabolic rate$s1_98nc$,
  $s1_98oe$Cancer cachexia is inflammatory. TNF (cachectin), IL-1, and IL-6 raise resting energy expenditure and break down muscle as well as fat. Simple starvation lowers the metabolic rate and prefers fat while sparing protein longer. The patterns are not identical. TNF suppresses appetite and still wastes tissue beyond intake. Muscle is not spared. Calories help starvation more completely than they reverse a cytokine-driven cachexia.$s1_98oe$,
  $s1_98ne$Cancer cachexia is inflammatory. TNF (cachectin), IL-1, and IL-6 raise resting energy expenditure and break down muscle as well as fat. Simple starvation lowers the metabolic rate and prefers fat while sparing protein longer. The patterns are not identical. TNF suppresses appetite and still wastes tissue beyond intake. Muscle is not spared. Calories help starvation more completely than they reverse a cytokine-driven cachexia.$s1_98ne$,
  142, 76, 132, 126,
  1.868421, 1.047619
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_99id$a0e057f0-9854-4f2a-a0c7-a4056e4e1eac$s1_99id$,
  $s1_99st$usmle-step-1$s1_99st$,
  1,
  $s1_99oo${"options": ["An undescended testis has impaired fertility potential and a cancer risk that orchiopexy does not erase; it is brought down so it can be examined, and waiting past infancy is not the plan", "Cancer risk falls to zero after the testis is moved", "A unilateral undescended testis never affects fertility", "Most testes still in the canal at one year will descend at puberty", "Orchiopexy is done only for appearance and has no surveillance purpose"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Cryptorchidism", "kind": "vignette"}$s1_99oo$,
  $s1_99no${"options": ["Fertility stays impaired and cancer risk survives orchiopexy; the testis is brought down so it can be examined, and delay past infancy is not the plan", "Once the testis sits in the scrotum, the later risk of germ-cell cancer falls to zero", "A unilateral undescended testis never impairs fertility", "Most testes still in the inguinal canal at one year of age descend on their own after male puberty begins, so surgery can be deferred", "Orchiopexy is done only to improve appearance and has no role in later examination"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Cryptorchidism", "kind": "vignette"}$s1_99no$,
  $s1_99oc$An undescended testis has impaired fertility potential and a cancer risk that orchiopexy does not erase; it is brought down so it can be examined, and waiting past infancy is not the plan$s1_99oc$,
  $s1_99nc$Fertility stays impaired and cancer risk survives orchiopexy; the testis is brought down so it can be examined, and delay past infancy is not the plan$s1_99nc$,
  $s1_99oe$Cryptorchidism exposes the testis to the wrong temperature. Germ cells suffer, so fertility can be reduced even when one side is involved because the contralateral testis is often not entirely normal either, and the cancer risk is increased. Orchiopexy makes the testis examinable; it does not reset malignant potential to zero. Descent after a year is unlikely. The operation is for the testis, not cosmetics alone.$s1_99oe$,
  $s1_99ne$Cryptorchidism exposes the testis to the wrong temperature. Germ cells suffer, so fertility can be reduced even when one side is involved because the contralateral testis is often not entirely normal either, and the cancer risk is increased. Orchiopexy makes the testis examinable; it does not reset malignant potential to zero. Descent after a year is unlikely. The operation is for the testis, not cosmetics alone.$s1_99ne$,
  187, 70, 150, 133,
  2.671429, 1.127820
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_100id$a26d5a1c-cc28-4e64-b762-914db4e8dbad$s1_100id$,
  $s1_100st$usmle-step-1$s1_100st$,
  1,
  $s1_100oo${"options": ["ATP7B cannot excrete copper into bile or attach it to ceruloplasmin; zinc blocks gut absorption and is maintenance, not the drug that removes a large copper load", "ATP7A failed, the same protein as Menkes disease, so hair is kinky and the liver is spared", "Ferroportin failed, so the ring is iron and the treatment is deferoxamine", "Ceruloplasmin itself is the mutated enzyme, so chelation cannot help", "Alpha-1 antitrypsin failed, which deposits copper in the basal ganglia"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Wilson disease mechanism", "kind": "vignette"}$s1_100oo$,
  $s1_100no${"options": ["ATP7B cannot excrete copper into bile or onto ceruloplasmin; zinc blocks gut absorption as maintenance and does not remove a large copper load", "ATP7A has failed, the Menkes transporter, so the hair is kinky and the liver is spared", "Ferroportin has failed, the corneal ring is iron, and the chelator to use is deferoxamine", "Ceruloplasmin itself is the mutated protein, so a copper chelator cannot remove metal already stored in the liver and the brain", "Alpha-1 antitrypsin has failed and is depositing copper in the liver and basal ganglia"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Wilson disease mechanism", "kind": "vignette"}$s1_100no$,
  $s1_100oc$ATP7B cannot excrete copper into bile or attach it to ceruloplasmin; zinc blocks gut absorption and is maintenance, not the drug that removes a large copper load$s1_100oc$,
  $s1_100nc$ATP7B cannot excrete copper into bile or onto ceruloplasmin; zinc blocks gut absorption as maintenance and does not remove a large copper load$s1_100nc$,
  $s1_100oe$Wilson disease is hepatic ATP7B failure. Copper is not excreted in bile and is not loaded onto ceruloplasmin, so serum ceruloplasmin is low, a Kayser-Fleischer ring forms, and the basal ganglia and liver fill with copper. A chelator such as trientine or penicillamine removes stored copper. Zinc induces metallothionein in the gut and reduces absorption; it maintains a treated patient and does not empty a large existing load. ATP7A is Menkes disease, an uptake problem with kinky hair and deficiency, not hepatic overload. Ferroportin and deferoxamine are iron. The ceruloplasmin level is low because copper is not incorporated; the gene is ATP7B, not the ceruloplasmin gene. Alpha-1 antitrypsin lung and liver disease does not make a copper ring.$s1_100oe$,
  $s1_100ne$Wilson disease is hepatic ATP7B failure. Copper is not excreted in bile and is not loaded onto ceruloplasmin, so serum ceruloplasmin is low, a Kayser-Fleischer ring forms, and the basal ganglia and liver fill with copper. A chelator such as trientine or penicillamine removes stored copper. Zinc induces metallothionein in the gut and reduces absorption; it maintains a treated patient and does not empty a large existing load. ATP7A is Menkes disease, an uptake problem with kinky hair and deficiency, not hepatic overload. Ferroportin and deferoxamine are iron. The ceruloplasmin level is low because copper is not incorporated; the gene is ATP7B, not the ceruloplasmin gene. Alpha-1 antitrypsin lung and liver disease does not make a copper ring.$s1_100ne$,
  161, 90, 142, 127,
  1.788889, 1.118110
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_101id$a36f76cd-4aa3-490b-b060-38f748b39c66$s1_101id$,
  $s1_101st$usmle-step-1$s1_101st$,
  1,
  $s1_101oo${"options": ["The median nerve, which supplies the forearm finger flexors to digits 2 and 3; an ulnar claw is the opposite posture and is worse when the ulnar nerve fails more proximally for different muscles", "The ulnar nerve, because digits 4 and 5 are the ones that stay extended", "The radial nerve, because extended fingers mean wrist extensors", "A wrist-level median injury produces the same loss of finger flexion", "Benediction on attempting a fist is the resting claw of an ulnar palsy"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Median nerve hand of benediction", "kind": "vignette"}$s1_101oo$,
  $s1_101no${"options": ["Median nerve to forearm flexors of digits 2 and 3, lost at the elbow; an ulnar claw is the opposite posture, and a proximal ulnar lesion hits different muscles", "The ulnar nerve, because digits 4 and 5 stay extended at the finger joints during an attempted fist, which is the resting posture in this case", "The radial nerve, because fingers that will not close mean the wrist extensors have failed", "A median-nerve injury at the wrist produces this same loss of flexion in digits 2 and 3", "Benediction while trying to make a fist is the resting claw of an ulnar palsy"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Median nerve hand of benediction", "kind": "vignette"}$s1_101no$,
  $s1_101oc$The median nerve, which supplies the forearm finger flexors to digits 2 and 3; an ulnar claw is the opposite posture and is worse when the ulnar nerve fails more proximally for different muscles$s1_101oc$,
  $s1_101nc$Median nerve to forearm flexors of digits 2 and 3, lost at the elbow; an ulnar claw is the opposite posture, and a proximal ulnar lesion hits different muscles$s1_101nc$,
  $s1_101oe$When the median nerve is out at the elbow, flexor digitorum superficialis and the median half of profundus are weak, so the patient cannot flex digits 2 and 3 when asked to make a fist. That active posture is the 'hand of benediction.' An ulnar claw is a resting posture of digits 4 and 5 from lost intrinsics, and those fingers are the ones that still flexed here. The radial nerve extends the wrist and MCP joints; it is not this sensory pattern. At the wrist the median nerve has already given off the forearm flexors, so a carpal-tunnel lesion does not block finger flexion. The test was an attempted fist, not the resting ulnar claw.$s1_101oe$,
  $s1_101ne$When the median nerve is out at the elbow, flexor digitorum superficialis and the median half of profundus are weak, so the patient cannot flex digits 2 and 3 when asked to make a fist. That active posture is the 'hand of benediction.' An ulnar claw is a resting posture of digits 4 and 5 from lost intrinsics, and those fingers are the ones that still flexed here. The radial nerve extends the wrist and MCP joints; it is not this sensory pattern. At the wrist the median nerve has already given off the forearm flexors, so a carpal-tunnel lesion does not block finger flexion. The test was an attempted fist, not the resting ulnar claw.$s1_101ne$,
  194, 71, 159, 142,
  2.732394, 1.119718
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_102id$a5ee300b-b44f-41f8-8f4c-cf39ff8e4386$s1_102id$,
  $s1_102st$usmle-step-1$s1_102st$,
  1,
  $s1_102oo${"options": ["NF1 is chromosome 17, neurofibromin, with optic glioma and axillary freckles; NF2 is chromosome 22, merlin, with bilateral vestibular schwannomas", "NF1 is chromosome 22 and NF2 is chromosome 17; the tumors are otherwise identical", "Both are tuberous sclerosis on chromosome 9 and 16, and the optic glioma is a renal angiomyolipoma", "Bilateral vestibular schwannomas define NF1", "Axillary freckles are ash-leaf spots and mean tuberous sclerosis"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "NF1 versus NF2", "kind": "vignette"}$s1_102oo$,
  $s1_102no${"options": ["NF1 is chromosome 17, neurofibromin, optic glioma, and axillary freckles; NF2 is chromosome 22, merlin, and bilateral vestibular schwannomas", "NF1 is chromosome 22 and NF2 is chromosome 17, and the tumors of the two diseases match", "Both are tuberous sclerosis, chromosomes 9 and 16, and the optic glioma is in fact a renal angiomyolipoma seen on the scan", "Bilateral vestibular schwannomas are the tumor that defines NF1", "Axillary freckles are ash-leaf spots and place the patient in tuberous sclerosis"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "NF1 versus NF2", "kind": "vignette"}$s1_102no$,
  $s1_102oc$NF1 is chromosome 17, neurofibromin, with optic glioma and axillary freckles; NF2 is chromosome 22, merlin, with bilateral vestibular schwannomas$s1_102oc$,
  $s1_102nc$NF1 is chromosome 17, neurofibromin, optic glioma, and axillary freckles; NF2 is chromosome 22, merlin, and bilateral vestibular schwannomas$s1_102nc$,
  $s1_102oe$Neurofibromatosis type 1 is the common skin disease: many café-au-lait macules, axillary freckling, neurofibromas, and optic pathway glioma, from neurofibromin on chromosome 17. Type 2 is merlin on chromosome 22 and is defined by bilateral vestibular schwannomas, with a quieter skin exam. Swapping the chromosomes is a pure memory trap with a clinical cost if you counsel the wrong tumor risk. Angiomyolipomas and ash-leaf spots are tuberous sclerosis, chromosomes 9 and 16. Vestibular schwannomas are NF2, not NF1. Axillary freckles are NF1, not ash-leaf macules.$s1_102oe$,
  $s1_102ne$Neurofibromatosis type 1 is the common skin disease: many café-au-lait macules, axillary freckling, neurofibromas, and optic pathway glioma, from neurofibromin on chromosome 17. Type 2 is merlin on chromosome 22 and is defined by bilateral vestibular schwannomas, with a quieter skin exam. Swapping the chromosomes is a pure memory trap with a clinical cost if you counsel the wrong tumor risk. Angiomyolipomas and ash-leaf spots are tuberous sclerosis, chromosomes 9 and 16. Vestibular schwannomas are NF2, not NF1. Axillary freckles are NF1, not ash-leaf macules.$s1_102ne$,
  145, 98, 140, 122,
  1.479592, 1.147541
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_103id$a6548cd4-7602-4b14-887e-c48dd108b620$s1_103id$,
  $s1_103st$usmle-step-1$s1_103st$,
  1,
  $s1_103oo${"options": ["Cystathionine synthase deficiency causes downward dislocation and thrombosis; Marfan is fibrillin with upward dislocation and no homocysteine clot", "Both are fibrillin defects and the lens direction is random", "Homocystinuria dislocates the lens upward", "Marfan syndrome causes fair hair and a musty urine", "Thrombosis means the child has too little homocysteine"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Homocystinuria versus Marfan", "kind": "vignette"}$s1_103oo$,
  $s1_103no${"options": ["Cystathionine synthase deficiency dislocates the lens downward and causes thrombosis; Marfan is fibrillin, with an upward lens and no homocysteine clot", "Both conditions are fibrillin defects, and the direction in which the lens dislocates is random from patient to patient in either disease", "Homocystinuria dislocates the lens upward and does not promote thrombosis", "Marfan syndrome causes fair hair, musty-smelling urine, and intravascular thrombosis", "Thrombosis in this child means the blood homocysteine is too low"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Homocystinuria versus Marfan", "kind": "vignette"}$s1_103no$,
  $s1_103oc$Cystathionine synthase deficiency causes downward dislocation and thrombosis; Marfan is fibrillin with upward dislocation and no homocysteine clot$s1_103oc$,
  $s1_103nc$Cystathionine synthase deficiency dislocates the lens downward and causes thrombosis; Marfan is fibrillin, with an upward lens and no homocysteine clot$s1_103nc$,
  $s1_103oe$Classic homocystinuria cannot condense homocysteine with serine. Homocysteine injures vessels and the brain, and the lens zonules fail downward. Marfan syndrome is a connective-tissue microfibril disease: upward lens dislocation, aortic aneurysm, and normal intelligence, without a clotting amino acid. The lens direction is the clinical separator, not a coin flip. Upward dislocation is Marfan. A musty smell is PKU. The clot is from too much homocysteine, not too little.$s1_103oe$,
  $s1_103ne$Classic homocystinuria cannot condense homocysteine with serine. Homocysteine injures vessels and the brain, and the lens zonules fail downward. Marfan syndrome is a connective-tissue microfibril disease: upward lens dislocation, aortic aneurysm, and normal intelligence, without a clotting amino acid. The lens direction is the clinical separator, not a coin flip. Upward dislocation is Marfan. A musty smell is PKU. The clot is from too much homocysteine, not too little.$s1_103ne$,
  146, 59, 151, 137,
  2.474576, 1.102190
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_104id$ab099bf3-3a1b-48c0-8c7d-7b99f9197688$s1_104id$,
  $s1_104st$usmle-step-1$s1_104st$,
  1,
  $s1_104oo${"options": ["A is carbon monoxide, which binds hemoglobin and shifts the remaining curve left; B is cyanide, which stops aerobic respiration so oxygen is not used", "Both are cyanide, and the pulse oximeter reliably shows the oxygen deficit", "A is methemoglobin because the skin is red", "B should receive methylene blue as the specific antidote", "Carbon monoxide lowers dissolved arterial oxygen tension, which is why the ABG PaO2 falls"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Carbon monoxide versus cyanide", "kind": "vignette"}$s1_104oo$,
  $s1_104no${"options": ["A is carbon monoxide, which binds hemoglobin and shifts the remaining curve left; B is cyanide, which blocks cytochrome oxidase so oxygen is not used", "Both toxins are cyanide, and the pulse oximeter reliably displays the size of the arterial oxygen deficit in each of these patients", "A is methemoglobin, which is the pigment expected when the skin is cherry red", "B should be treated with methylene blue, the specific antidote for that toxin", "Carbon monoxide reduces dissolved arterial oxygen, which is why the measured PaO2 falls"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Carbon monoxide versus cyanide", "kind": "vignette"}$s1_104no$,
  $s1_104oc$A is carbon monoxide, which binds hemoglobin and shifts the remaining curve left; B is cyanide, which stops aerobic respiration so oxygen is not used$s1_104oc$,
  $s1_104nc$A is carbon monoxide, which binds hemoglobin and shifts the remaining curve left; B is cyanide, which blocks cytochrome oxidase so oxygen is not used$s1_104nc$,
  $s1_104oe$Carbon monoxide binds hemoglobin with high affinity and makes standard pulse oximetry look falsely normal; co-oximetry shows the gap, and the remaining hemoglobin holds oxygen too tightly. Cyanide poisons complex IV, cells cannot use oxygen, lactate rises, and venous blood stays oxygenated. A pulse oximeter does not detect carbon monoxide. Cherry skin is not methemoglobin; methemoglobin is chocolate-brown and cyanotic. Methylene blue treats methemoglobin, not cyanide; cyanide is treated with hydroxocobalamin. Dissolved PaO2 stays normal in carbon monoxide poisoning because that number is not hemoglobin-bound oxygen.$s1_104oe$,
  $s1_104ne$Carbon monoxide binds hemoglobin with high affinity and makes standard pulse oximetry look falsely normal; co-oximetry shows the gap, and the remaining hemoglobin holds oxygen too tightly. Cyanide poisons complex IV, cells cannot use oxygen, lactate rises, and venous blood stays oxygenated. A pulse oximeter does not detect carbon monoxide. Cherry skin is not methemoglobin; methemoglobin is chocolate-brown and cyanotic. Methylene blue treats methemoglobin, not cyanide; cyanide is treated with hydroxocobalamin. Dissolved PaO2 stays normal in carbon monoxide poisoning because that number is not hemoglobin-bound oxygen.$s1_104ne$,
  149, 89, 149, 131,
  1.674157, 1.137405
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_105id$aeef5504-4df5-410e-b492-3d2f97637c67$s1_105id$,
  $s1_105st$usmle-step-1$s1_105st$,
  1,
  $s1_105oo${"options": ["It blocks reuptake of dopamine and norepinephrine in prefrontal circuits that support attention; better executive control looks calmer and is not GABA sedation", "It facilitates GABA-A receptors, like lorazepam, which is why sleepiness is the therapeutic effect", "It blocks dopamine, like haloperidol, and the calm is parkinsonism", "Improvement proves the diagnosis was absence epilepsy", "Stimulants worsen prefrontal signal by depleting norepinephrine, which is the intended effect"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "ADHD stimulant mechanism", "kind": "vignette"}$s1_105oo$,
  $s1_105no${"options": ["It blocks reuptake of dopamine and norepinephrine in prefrontal attention circuits; better executive control looks calmer and is not GABA sedation", "It facilitates GABA-A receptors as lorazepam does, so sleepiness, rather than clearer attention, is the desired therapeutic effect", "It blocks dopamine receptors, as haloperidol does, and the calmer appearance is parkinsonism", "Improvement after the first doses proves the spells were absence seizures", "Stimulants work by depleting prefrontal norepinephrine, and that depletion is the intended effect"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "ADHD stimulant mechanism", "kind": "vignette"}$s1_105no$,
  $s1_105oc$It blocks reuptake of dopamine and norepinephrine in prefrontal circuits that support attention; better executive control looks calmer and is not GABA sedation$s1_105oc$,
  $s1_105nc$It blocks reuptake of dopamine and norepinephrine in prefrontal attention circuits; better executive control looks calmer and is not GABA sedation$s1_105nc$,
  $s1_105oe$Methylphenidate inhibits dopamine and norepinephrine transporters. In the prefrontal cortex that increases the signal used for sustained attention and impulse control, so the child stays with the task and looks calmer. It is not a GABA sedative, and therapeutic calm is not drowsiness. It is not a D2 blocker, and parkinsonism is not the goal or the usual effect. A normal sleep history and a long behavioral pattern are not absence seizures. The drug does not work by depleting norepinephrine.$s1_105oe$,
  $s1_105ne$Methylphenidate inhibits dopamine and norepinephrine transporters. In the prefrontal cortex that increases the signal used for sustained attention and impulse control, so the child stays with the task and looks calmer. It is not a GABA sedative, and therapeutic calm is not drowsiness. It is not a D2 blocker, and parkinsonism is not the goal or the usual effect. A normal sleep history and a long behavioral pattern are not absence seizures. The drug does not work by depleting norepinephrine.$s1_105ne$,
  159, 98, 146, 130,
  1.622449, 1.123077
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_106id$afc24f4b-0a4b-4c8b-b3b3-294db01bd9fe$s1_106id$,
  $s1_106st$usmle-step-1$s1_106st$,
  1,
  $s1_106oo${"options": ["STAT3 and Th17 signaling fail, so neutrophil recruitment is poor and staphylococcal abscesses lack the usual heat; IgE is markedly high", "NADPH oxidase has failed", "The cold abscess means good neutrophil recruitment", "IgE is low in this syndrome", "Retained teeth are unrelated to the immune defect"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Job syndrome", "kind": "vignette"}$s1_106oo$,
  $s1_106no${"options": ["STAT3 and Th17 signaling fail, so neutrophil recruitment is poor and staphylococcal abscesses stay cold; IgE is high", "NADPH oxidase has failed, so the oxidative burst is gone and the staphylococcal abscesses stay cold for that reason", "A cold abscess is evidence that neutrophils reached the skin in normal numbers", "IgE is low in this syndrome, which is why the abscesses are not warm", "Retained primary teeth have nothing to do with the signaling defect"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Job syndrome", "kind": "vignette"}$s1_106no$,
  $s1_106oc$STAT3 and Th17 signaling fail, so neutrophil recruitment is poor and staphylococcal abscesses lack the usual heat; IgE is markedly high$s1_106oc$,
  $s1_106nc$STAT3 and Th17 signaling fail, so neutrophil recruitment is poor and staphylococcal abscesses stay cold; IgE is high$s1_106nc$,
  $s1_106oe$Hyper-IgE syndrome is STAT3. Th17 cells do not form, IL-17 does not call neutrophils properly, and staphylococcal abscesses are 'cold.' IgE and eosinophils are high, eczema is present, and nonimmune connective-tissue findings include retained primary teeth, coarse face, and fractures. This is not the oxidase defect of CGD. Cold means poor inflammation, not better recruitment. IgE is high, which is the name of the syndrome. The dental finding is part of the STAT3 phenotype, not a coincidence.$s1_106oe$,
  $s1_106ne$Hyper-IgE syndrome is STAT3. Th17 cells do not form, IL-17 does not call neutrophils properly, and staphylococcal abscesses are 'cold.' IgE and eosinophils are high, eczema is present, and nonimmune connective-tissue findings include retained primary teeth, coarse face, and fractures. This is not the oxidase defect of CGD. Cold means poor inflammation, not better recruitment. IgE is high, which is the name of the syndrome. The dental finding is part of the STAT3 phenotype, not a coincidence.$s1_106ne$,
  135, 50, 116, 115,
  2.700000, 1.008696
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_107id$b0e8e222-b9b2-4cbc-ace0-83cd800ed16d$s1_107id$,
  $s1_107st$usmle-step-1$s1_107st$,
  1,
  $s1_107oo${"options": ["A septic joint, including around hardware, destroys cartilage in hours and can look like a crystal flare; fluid for gram stain and culture has to come before assuming crystals", "Colchicine covers Staphylococcus, so the tap can wait a week", "Prosthetic joints do not get infected after the first month", "Fever means the diagnosis is gout, because infection does not cause fever", "Gonorrhea is the only organism that infects a knee, and he has no rash so infection is impossible"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Septic arthritis must be tapped", "kind": "vignette"}$s1_107oo$,
  $s1_107no${"options": ["A septic joint, even around hardware, can mimic crystals and destroy cartilage in hours; fluid for stain and culture has to come before assuming gout", "Colchicine covers Staphylococcus, so aspiration of the joint can wait until next week", "A prosthetic joint is no longer at risk for infection once the first postoperative month has passed and the incision has fully healed", "Fever settles the diagnosis as gout, because infection inside a joint does not cause fever", "Gonorrhea is the only organism that infects a knee, and with no rash infection is impossible"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Septic arthritis must be tapped", "kind": "vignette"}$s1_107no$,
  $s1_107oc$A septic joint, including around hardware, destroys cartilage in hours and can look like a crystal flare; fluid for gram stain and culture has to come before assuming crystals$s1_107oc$,
  $s1_107nc$A septic joint, even around hardware, can mimic crystals and destroy cartilage in hours; fluid for stain and culture has to come before assuming gout$s1_107nc$,
  $s1_107oe$You cannot tell a septic knee from a crystal flare by history, especially in someone who has had both risks. Cartilage dies quickly and hardware infections need a tap, culture, and often surgery. Colchicine does not treat bacteria. Prostheses remain infected risk forever, not only in the first month. Fever fits infection at least as well as gout. Staphylococcus and streptococci infect native and prosthetic knees; gonorrhea is a cause in younger sexually active patients, not the only organism, and absence of a rash does not clear the joint.$s1_107oe$,
  $s1_107ne$You cannot tell a septic knee from a crystal flare by history, especially in someone who has had both risks. Cartilage dies quickly and hardware infections need a tap, culture, and often surgery. Colchicine does not treat bacteria. Prostheses remain infected risk forever, not only in the first month. Fever fits infection at least as well as gout. Staphylococcus and streptococci infect native and prosthetic knees; gonorrhea is a cause in younger sexually active patients, not the only organism, and absence of a rash does not clear the joint.$s1_107ne$,
  175, 97, 149, 133,
  1.804124, 1.120301
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_108id$b1ffd86e-d55b-49b0-908b-8bc5076bbb6e$s1_108id$,
  $s1_108st$usmle-step-1$s1_108st$,
  1,
  $s1_108oo${"options": ["Excess iodide transiently inhibits organification, the Wolff-Chaikoff effect, and a healthy gland then escapes; failure to escape can cause hypothyroidism where iodine is suddenly high", "Iodide only increases synthesis, with no inhibitory concentration", "Escape means permanent ablation", "The effect is due to TSH-receptor antibodies", "Organification is stimulated by a huge iodine load"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Wolff-Chaikoff", "kind": "vignette"}$s1_108oo$,
  $s1_108no${"options": ["Excess iodide briefly blocks organification (Wolff-Chaikoff); a healthy gland escapes, and failure to escape causes hypothyroidism when iodine rises suddenly", "Iodide only increases hormone synthesis, and there is no concentration at which organification is inhibited and no later escape is required", "Escape from the iodide block means the gland has been permanently destroyed", "Stimulating antibodies against the TSH receptor are what cause this block", "A very large iodine load stimulates organification in a previously healthy gland"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Wolff-Chaikoff", "kind": "vignette"}$s1_108no$,
  $s1_108oc$Excess iodide transiently inhibits organification, the Wolff-Chaikoff effect, and a healthy gland then escapes; failure to escape can cause hypothyroidism where iodine is suddenly high$s1_108oc$,
  $s1_108nc$Excess iodide briefly blocks organification (Wolff-Chaikoff); a healthy gland escapes, and failure to escape causes hypothyroidism when iodine rises suddenly$s1_108nc$,
  $s1_108oe$A large iodide load blocks organification of iodine for a time. The gland then downregulates the iodide trap and escapes, and synthesis resumes. People with underlying thyroid disease may not escape and become hypothyroid, which is why amiodarone and contrast matter. More iodine is not linearly more hormone. Escape is recovery of synthesis, not destruction. Antibodies are Graves disease, not this pharmacologic effect. The point of the effect is inhibition of organification, not stimulation.$s1_108oe$,
  $s1_108ne$A large iodide load blocks organification of iodine for a time. The gland then downregulates the iodide trap and escapes, and synthesis resumes. People with underlying thyroid disease may not escape and become hypothyroid, which is why amiodarone and contrast matter. More iodine is not linearly more hormone. Escape is recovery of synthesis, not destruction. Antibodies are Graves disease, not this pharmacologic effect. The point of the effect is inhibition of organification, not stimulation.$s1_108ne$,
  184, 65, 157, 139,
  2.830769, 1.129496
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_109id$b2f9f819-c302-444b-8372-df291e7211d3$s1_109id$,
  $s1_109st$usmle-step-1$s1_109st$,
  1,
  $s1_109oo${"options": ["Capacity is a clinical judgment about this decision: understanding, appreciation, reasoning, and a stable choice. It is not the same as agreeing with the physician, and legal competence is the court finding", "Any refusal of a beneficial drug proves incapacity", "Capacity can be declared only by a judge at the bedside", "Understanding the facts is enough, so appreciation and reasoning are optional and he fails them here", "He lacks capacity because pneumonia itself always removes decision-making ability"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Capacity", "kind": "vignette"}$s1_109oo$,
  $s1_109no${"options": ["Capacity is understanding, appreciation, reasoning, and a stable choice about this decision; it is not agreement with the physician, and competence is a court finding", "Refusal of a medicine that would benefit him is, by itself, proof that he lacks capacity", "Capacity can be declared only by a judge who comes to the bedside to examine him", "Understanding the facts is enough for capacity, so appreciation and reasoning are optional, and he fails those extra elements here about antibiotics", "He lacks capacity because pneumonia itself always takes away the ability to make this decision"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Capacity", "kind": "vignette"}$s1_109no$,
  $s1_109oc$Capacity is a clinical judgment about this decision: understanding, appreciation, reasoning, and a stable choice. It is not the same as agreeing with the physician, and legal competence is the court finding$s1_109oc$,
  $s1_109nc$Capacity is understanding, appreciation, reasoning, and a stable choice about this decision; it is not agreement with the physician, and competence is a court finding$s1_109nc$,
  $s1_109oe$Capacity is decision-specific and clinical. This man understands, appreciates the consequence, reasons from his own values, and chooses consistently, so he has capacity to refuse even a choice the team dislikes. Competence is the legal status a court determines. Disagreeing with the doctor is not incapacity. A judge is not required to decide ordinary bedside capacity. He has shown more than bare fact-recall; the vignette includes appreciation and a reason. Pneumonia does not automatically erase capacity when the conversation shows intact elements.$s1_109oe$,
  $s1_109ne$Capacity is decision-specific and clinical. This man understands, appreciates the consequence, reasons from his own values, and chooses consistently, so he has capacity to refuse even a choice the team dislikes. Competence is the legal status a court determines. Disagreeing with the doctor is not incapacity. A judge is not required to decide ordinary bedside capacity. He has shown more than bare fact-recall; the vignette includes appreciation and a reason. Pneumonia does not automatically erase capacity when the conversation shows intact elements.$s1_109ne$,
  206, 100, 166, 148,
  2.060000, 1.121622
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_110id$b389eb91-0b27-4dcd-9cd5-e4ee5a48ab3b$s1_110id$,
  $s1_110st$usmle-step-1$s1_110st$,
  1,
  $s1_110oo${"options": ["Mammillary bodies and the medial dorsal thalamus are damaged; the confabulatory amnesia of Korsakoff syndrome is largely irreversible even after thiamine repletes the acute Wernicke signs", "The hippocampus is filled with amyloid, so this is Alzheimer disease and thiamine was irrelevant", "Confabulation means he is malingering, so no structure is injured", "The frontal eye fields caused the abduction failure, and memory will return with glucose alone", "Both the eye and the memory findings are cerebellar, so they should have recovered together"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Wernicke versus Korsakoff", "kind": "vignette"}$s1_110oo$,
  $s1_110no${"options": ["Mammillary bodies and the medial dorsal thalamus are damaged; Korsakoff confabulation persists after thiamine reverses the acute Wernicke signs", "The hippocampus is packed with amyloid, so this is Alzheimer disease, and giving thiamine could not have altered the memory loss", "Confabulation means he is malingering, so no memory structure has been injured", "The frontal eye fields caused the failure of abduction, and memory will return with glucose alone", "The eye-movement loss and the memory loss are both cerebellar and should have recovered together"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Wernicke versus Korsakoff", "kind": "vignette"}$s1_110no$,
  $s1_110oc$Mammillary bodies and the medial dorsal thalamus are damaged; the confabulatory amnesia of Korsakoff syndrome is largely irreversible even after thiamine repletes the acute Wernicke signs$s1_110oc$,
  $s1_110nc$Mammillary bodies and the medial dorsal thalamus are damaged; Korsakoff confabulation persists after thiamine reverses the acute Wernicke signs$s1_110nc$,
  $s1_110oe$Wernicke encephalopathy is the acute triad of confusion, ophthalmoplegia, and ataxia from thiamine deficiency in the mammillary bodies and periaqueductal gray. Treating it can improve the eye findings. If the medial thalamic and mammillary injury is established, Korsakoff syndrome remains: anterograde amnesia with confabulation that thiamine does not reverse. Amyloid hippocampus disease is a different, slower dementia without this eye-movement story. Confabulation here is a memory failure, not a choice to lie. Abduction failure is a sixth-nerve or gaze-center problem in the brainstem, not the frontal eye field, and glucose without thiamine is the precipitant, not the cure. The cerebellum may add ataxia, but the memory circuit is diencephalic, which is why the two did not recover together.$s1_110oe$,
  $s1_110ne$Wernicke encephalopathy is the acute triad of confusion, ophthalmoplegia, and ataxia from thiamine deficiency in the mammillary bodies and periaqueductal gray. Treating it can improve the eye findings. If the medial thalamic and mammillary injury is established, Korsakoff syndrome remains: anterograde amnesia with confabulation that thiamine does not reverse. Amyloid hippocampus disease is a different, slower dementia without this eye-movement story. Confabulation here is a memory failure, not a choice to lie. Abduction failure is a sixth-nerve or gaze-center problem in the brainstem, not the frontal eye field, and glucose without thiamine is the precipitant, not the cure. The cerebellum may add ataxia, but the memory circuit is diencephalic, which is why the two did not recover together.$s1_110ne$,
  187, 96, 143, 128,
  1.947917, 1.117188
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_111id$b3ceb95e-1e20-4223-8a04-2341f54cf7c3$s1_111id$,
  $s1_111st$usmle-step-1$s1_111st$,
  1,
  $s1_111oo${"options": ["Neural-tube defects if used in early pregnancy, and idiosyncratic hepatic failure that is most feared in very young children", "Gingival hyperplasia and fetal hydantoin face, the phenytoin pair", "Agranulocytosis and HLA-related rash, the carbamazepine pair", "Cartilage damage and permanent teeth staining in the toddler", "Pulmonary fibrosis, which is the reason it is avoided in pregnancy"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Valproate risks", "kind": "vignette"}$s1_111oo$,
  $s1_111no${"options": ["Neural-tube defects if taken early in pregnancy, and idiosyncratic hepatic failure feared most in very young children", "Gingival overgrowth and the fetal hydantoin face, the paired toxicities of phenytoin, with liver failure a concern of late adulthood", "Agranulocytosis together with an HLA-linked rash, the carbamazepine pair, the liver risk being assigned to pregnancy", "Injury to growing cartilage and permanent staining of the teeth when a toddler receives the drug", "Pulmonary fibrosis, which is the toxicity that leads clinicians to avoid this drug throughout pregnancy"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Valproate risks", "kind": "vignette"}$s1_111no$,
  $s1_111oc$Neural-tube defects if used in early pregnancy, and idiosyncratic hepatic failure that is most feared in very young children$s1_111oc$,
  $s1_111nc$Neural-tube defects if taken early in pregnancy, and idiosyncratic hepatic failure feared most in very young children$s1_111nc$,
  $s1_111oe$Valproate is teratogenic and specifically raises neural-tube defect risk, so it is a poor default in a woman who may conceive. It also causes idiosyncratic hepatotoxicity, historically concentrated in young children on several antiseizure drugs. Gingival hyperplasia and the hydantoin face are phenytoin. Agranulocytosis and HLA rash point to carbamazepine or other drugs, not this pair. Tooth and cartilage toxicity is tetracycline. Pulmonary fibrosis is not the valproate pregnancy problem.$s1_111oe$,
  $s1_111ne$Valproate is teratogenic and specifically raises neural-tube defect risk, so it is a poor default in a woman who may conceive. It also causes idiosyncratic hepatotoxicity, historically concentrated in young children on several antiseizure drugs. Gingival hyperplasia and the hydantoin face are phenytoin. Agranulocytosis and HLA rash point to carbamazepine or other drugs, not this pair. Tooth and cartilage toxicity is tetracycline. Pulmonary fibrosis is not the valproate pregnancy problem.$s1_111ne$,
  124, 66, 117, 132,
  1.878788, 0.886364
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_112id$b468dfc1-fd50-43b3-9d1b-5a0106d50291$s1_112id$,
  $s1_112st$usmle-step-1$s1_112st$,
  1,
  $s1_112oo${"options": ["Microvascular ischemia hits the central motor fibers and spares the superficial pupil fibers; a compressing aneurysm hits the pupil early", "A spared pupil proves an aneurysm because the pupil fibers are deep", "Diabetes dilates the pupil first and leaves the eye muscles for later", "Coiling is required whenever glucose is high", "Pain around the eye means migraine and excludes a nerve palsy"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Central pontine myelinolysis already used", "kind": "vignette"}$s1_112oo$,
  $s1_112no${"options": ["Microvascular ischemia hits central motor fibers and spares the superficial pupil fibers; a compressing aneurysm reaches the pupil early", "A spared pupil proves a compressing aneurysm, because the pupillary fibers travel deep in the core of the third nerve", "Diabetes dilates the pupil at the start and weakens the extraocular muscles afterward", "Coil embolization is required whenever the blood glucose is elevated", "Pain around the eye means migraine and excludes a palsy of the oculomotor nerve"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Central pontine myelinolysis already used", "kind": "vignette"}$s1_112no$,
  $s1_112oc$Microvascular ischemia hits the central motor fibers and spares the superficial pupil fibers; a compressing aneurysm hits the pupil early$s1_112oc$,
  $s1_112nc$Microvascular ischemia hits central motor fibers and spares the superficial pupil fibers; a compressing aneurysm reaches the pupil early$s1_112nc$,
  $s1_112oe$Pupil fibers travel on the outside of the third nerve. Ischemia in a small vessel, as in diabetes, infarcts the core and spares the pupil, so a painless or moderately painful pupil-sparing palsy in a person with diabetes is microvascular until a reason says otherwise. An aneurysm compresses the outside and blows the pupil, especially with a thunderclap headache. This vignette spared the pupil and has marked hyperglycemia, so emergency coiling is the wrong default. Diabetes does not dilate the pupil first. High glucose is the risk for ischemia, not an indication to coil. Pain can occur with microvascular third-nerve palsy and does not by itself mean migraine or exclude the localization.$s1_112oe$,
  $s1_112ne$Pupil fibers travel on the outside of the third nerve. Ischemia in a small vessel, as in diabetes, infarcts the core and spares the pupil, so a painless or moderately painful pupil-sparing palsy in a person with diabetes is microvascular until a reason says otherwise. An aneurysm compresses the outside and blows the pupil, especially with a thunderclap headache. This vignette spared the pupil and has marked hyperglycemia, so emergency coiling is the wrong default. Diabetes does not dilate the pupil first. High glucose is the risk for ischemia, not an indication to coil. Pain can occur with microvascular third-nerve palsy and does not by itself mean migraine or exclude the localization.$s1_112ne$,
  137, 69, 136, 117,
  1.985507, 1.162393
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_113id$b7x07668b6473806c81b9d13edb$s1_113id$,
  $s1_113st$usmle-step-1$s1_113st$,
  1,
  $s1_113oo$["Nausea means the precursor never became dopamine anywhere","A drug that stays outside the brain cannot change a peripheral side effect","The gait benefit requires dopamine made in the gut","The second drug blocks conversion to dopamine only outside the brain, where the vomiting center's blood side is triggered","The second drug enters the substantia nigra and replaces dopamine"]$s1_113oo$,
  $s1_113no$["Nausea means the precursor never became dopamine, either in the gut or in the brain","A drug that remains outside the brain cannot change a peripheral effect such as nausea and cannot reach the chemoreceptor vomiting center","The benefit to gait requires dopamine that was manufactured in the gut","The second drug blocks conversion to dopamine only outside the brain, quieting the vomiting center's blood side while central conversion preserves gait","The second drug enters the substantia nigra and takes the place of dopamine there"]$s1_113no$,
  $s1_113oc$The second drug blocks conversion to dopamine only outside the brain, where the vomiting center's blood side is triggered$s1_113oc$,
  $s1_113nc$The second drug blocks conversion to dopamine only outside the brain, quieting the vomiting center's blood side while central conversion preserves gait$s1_113nc$,
  $s1_113oe$Nausea falls when the peripheral blocker is added because that blocker never enters the brain, so the central conversion continues. The second drug blocks conversion to dopamine only outside the brain, where the vomiting center's blood side is triggered. The second drug enters the substantia nigra and replaces dopamine is excluded by its failure to cross. Nausea means the precursor never became dopamine anywhere is peripheral conversion, which the second drug stops. A drug that stays outside the brain cannot change a peripheral side effect is how it changes this one. The gait benefit requires dopamine made in the gut requires conversion inside the remaining brain neurons.$s1_113oe$,
  $s1_113ne$Nausea falls when the peripheral blocker is added because that blocker never enters the brain, so the central conversion continues. The second drug blocks conversion to dopamine only outside the brain, quieting the vomiting center's blood side while central conversion preserves gait. The second drug enters the substantia nigra and takes the place of dopamine there is excluded by its failure to cross. Nausea means the precursor never became dopamine, either in the gut or in the brain is peripheral conversion, which the second drug stops. A drug that remains outside the brain cannot change a peripheral effect such as nausea and cannot reach the chemoreceptor vomiting center is how it changes this one. The benefit to gait requires dopamine that was manufactured in the gut requires conversion inside the remaining brain neurons.$s1_113ne$,
  121, 74, 151, 137,
  1.635135, 1.102190
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_114id$b7x219732e43c9b0837bec967f1$s1_114id$,
  $s1_114st$usmle-step-1$s1_114st$,
  1,
  $s1_114oo$["Low renin from the normal kidney means that kidney is ischemic","Creatinine of 1.1 mg/dL means neither kidney can make renin","The small kidney senses a pressure drop and releases renin, and the resulting hypertension suppresses the other kidney","Both kidneys release renin when systemic pressure is high","A bruit means the small kidney is overperfused"]$s1_114oo$,
  $s1_114no$["Low renin from the normal-sized kidney means that kidney, not the small one, is the kidney with the arterial stenosis","A creatinine of 1.1 mg/dL means neither kidney is still able to secrete renin","The small kidney senses a pressure drop and releases renin; the resulting hypertension suppresses renin from the other kidney","Both kidneys secrete more renin when systemic arterial pressure is high","A bruit over the small kidney means that kidney is receiving excess blood flow"]$s1_114no$,
  $s1_114oc$The small kidney senses a pressure drop and releases renin, and the resulting hypertension suppresses the other kidney$s1_114oc$,
  $s1_114nc$The small kidney senses a pressure drop and releases renin; the resulting hypertension suppresses renin from the other kidney$s1_114nc$,
  $s1_114oe$Renin is high on only one side because that kidney sees low perfusion while high pressure shuts off the other kidney. The small kidney senses a pressure drop and releases renin, and the resulting hypertension suppresses the other kidney. Both kidneys release renin when systemic pressure is high would raise both samples. A bruit means the small kidney is overperfused is turbulent flow through a stenosis. Low renin from the normal kidney means that kidney is ischemic is suppression by the high pressure. Creatinine of 1.1 mg/dL means neither kidney can make renin is a still-adequate overall filtration.$s1_114oe$,
  $s1_114ne$Renin is high on only one side because that kidney sees low perfusion while high pressure shuts off the other kidney. The small kidney senses a pressure drop and releases renin; the resulting hypertension suppresses renin from the other kidney. Both kidneys secrete more renin when systemic arterial pressure is high would raise both samples. A bruit over the small kidney means that kidney is receiving excess blood flow is turbulent flow through a stenosis. Low renin from the normal-sized kidney means that kidney, not the small one, is the kidney with the arterial stenosis is suppression by the high pressure. A creatinine of 1.1 mg/dL means neither kidney is still able to secrete renin is a still-adequate overall filtration.$s1_114ne$,
  118, 62, 125, 117,
  1.903226, 1.068376
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_115id$b7x2e3039cc74558f78170d844b$s1_115id$,
  $s1_115st$usmle-step-1$s1_115st$,
  1,
  $s1_115oo$["Darkening urine is uroporphyrin deposited in the dermis","A fast induces the enzyme that causes blisters","Sunlight is required for every porphyria attack","The relative's late block spares the skin and hits the nerves","Her excess is a colorless precursor made when the rate-limiting enzyme is induced, and that precursor does not enter skin"]$s1_115oo$,
  $s1_115no$["Darkening urine is uroporphyrin deposited in the dermis, and that skin pigment is what her early enzymatic block produces","Fasting induces the enzyme that deposits porphyrin in the skin and causes blisters","Sunlight is required for every porphyria attack, including one that is purely neurologic","The relative's later block spares the skin and instead damages peripheral nerves","Her excess is a colorless precursor made when the rate-limiting enzyme is induced, and that precursor does not enter the skin"]$s1_115no$,
  $s1_115oc$Her excess is a colorless precursor made when the rate-limiting enzyme is induced, and that precursor does not enter skin$s1_115oc$,
  $s1_115nc$Her excess is a colorless precursor made when the rate-limiting enzyme is induced, and that precursor does not enter the skin$s1_115nc$,
  $s1_115oe$Abdominal pain without blisters means the excess is an early colorless precursor, not a porphyrin that deposits in skin. Her excess is a colorless precursor made when the rate-limiting enzyme is induced, and that precursor does not enter skin. Darkening urine is uroporphyrin deposited in the dermis is the relative's pigment, a later intermediate. A fast induces the enzyme that causes blisters induces the first enzyme and piles up the early precursor. Sunlight is required for every porphyria attack is required for the skin disease, not for hers. The relative's late block spares the skin and hits the nerves reverses the two patterns.$s1_115oe$,
  $s1_115ne$Abdominal pain without blisters means the excess is an early colorless precursor, not a porphyrin that deposits in skin. Her excess is a colorless precursor made when the rate-limiting enzyme is induced, and that precursor does not enter the skin. Darkening urine is uroporphyrin deposited in the dermis, and that skin pigment is what her early enzymatic block produces is the relative's pigment, a later intermediate. Fasting induces the enzyme that deposits porphyrin in the skin and causes blisters induces the first enzyme and piles up the early precursor. Sunlight is required for every porphyria attack, including one that is purely neurologic is required for the skin disease, not for hers. The relative's later block spares the skin and instead damages peripheral nerves reverses the two patterns.$s1_115ne$,
  121, 61, 125, 121,
  1.983607, 1.033058
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_116id$b7xa5d1c42be85f46f824e7c271$s1_116id$,
  $s1_116st$usmle-step-1$s1_116st$,
  1,
  $s1_116oo$["Failure to pass meconium means too many ganglia in the rectum","The dilated colon is dilated because its ganglia are missing","Neural-crest cells never reached the narrow segment, so it cannot relax, and the normal bowel above it dilates","Ganglia in the dilated segment mean that segment cannot push","A narrow rectum is the healthy segment stretched by meconium"]$s1_116oo$,
  $s1_116no$["Failure to pass meconium means too many ganglia have formed in the rectal wall","The dilated colon is dilated because the ganglia of that segment failed to develop, so that bowel cannot push","Neural-crest cells never reached the narrow segment, so it cannot relax, and the normal bowel above it dilates","Ganglia present in the dilated segment are what prevent that segment from pushing","A narrow rectum is healthy bowel that retained meconium has stretched"]$s1_116no$,
  $s1_116oc$Neural-crest cells never reached the narrow segment, so it cannot relax, and the normal bowel above it dilates$s1_116oc$,
  $s1_116nc$Neural-crest cells never reached the narrow segment, so it cannot relax, and the normal bowel above it dilates$s1_116nc$,
  $s1_116oe$The narrowed segment is the one without ganglia, so the dilated bowel upstream is the normal bowel pushing against it. Neural-crest cells never reached the narrow segment, so it cannot relax, and the normal bowel above it dilates. Ganglia in the dilated segment mean that segment cannot push are why that segment is the healthy one. A narrow rectum is the healthy segment stretched by meconium is the segment that never relaxes. Failure to pass meconium means too many ganglia in the rectum is an absence. The dilated colon is dilated because its ganglia are missing has ganglia and is dilating against the block.$s1_116oe$,
  $s1_116ne$The narrowed segment is the one without ganglia, so the dilated bowel upstream is the normal bowel pushing against it. Neural-crest cells never reached the narrow segment, so it cannot relax, and the normal bowel above it dilates. Ganglia present in the dilated segment are what prevent that segment from pushing are why that segment is the healthy one. A narrow rectum is healthy bowel that retained meconium has stretched is the segment that never relaxes. Failure to pass meconium means too many ganglia have formed in the rectal wall is an absence. The dilated colon is dilated because the ganglia of that segment failed to develop, so that bowel cannot push has ganglia and is dilating against the block.$s1_116ne$,
  110, 61, 110, 109,
  1.803279, 1.009174
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_117id$b7xc0fe649e4ff8ac79ff00a61b$s1_117id$,
  $s1_117st$usmle-step-1$s1_117st$,
  1,
  $s1_117oo$["Flagging healthy people makes a negative result useless","An uncommon disease makes a negative result less informative","Detecting 99 of 100 means a positive result is right 99 percent of the time","Almost every sick person tests positive, so a negative result is strong evidence against the disease, and a positive one still includes the healthy people the test flags","A sensitive test confirms disease when it is positive"]$s1_117oo$,
  $s1_117no$["Flagging healthy people makes a negative result useless for deciding that disease is absent","An uncommon disease makes a negative result less informative than a positive one","Detecting 99 of 100 sick people means a positive result is correct 99 percent of the time, whatever the prevalence of the target disease","Almost every sick person tests positive, so a negative is strong evidence against disease, while a positive still includes healthy people the test flags","A sensitive test confirms the disease whenever the result comes back positive"]$s1_117no$,
  $s1_117oc$Almost every sick person tests positive, so a negative result is strong evidence against the disease, and a positive one still includes the healthy people the test flags$s1_117oc$,
  $s1_117nc$Almost every sick person tests positive, so a negative is strong evidence against disease, while a positive still includes healthy people the test flags$s1_117nc$,
  $s1_117oe$A negative result on a very sensitive test lowers the chance of disease, and a positive result on that same test does not confirm it. Almost every sick person tests positive, so a negative result is strong evidence against the disease, and a positive one still includes the healthy people the test flags. A sensitive test confirms disease when it is positive is what specificity would help do. Flagging healthy people makes a negative result useless is what weakens the positive result. An uncommon disease makes a negative result less informative makes the positive result less believable. Detecting 99 of 100 means a positive result is right 99 percent of the time is sensitivity, not the chance that a positive person is sick.$s1_117oe$,
  $s1_117ne$A negative result on a very sensitive test lowers the chance of disease, and a positive result on that same test does not confirm it. Almost every sick person tests positive, so a negative is strong evidence against disease, while a positive still includes healthy people the test flags. A sensitive test confirms the disease whenever the result comes back positive is what specificity would help do. Flagging healthy people makes a negative result useless for deciding that disease is absent is what weakens the positive result. An uncommon disease makes a negative result less informative than a positive one makes the positive result less believable. Detecting 99 of 100 sick people means a positive result is correct 99 percent of the time, whatever the prevalence of the target disease is sensitivity, not the chance that a positive person is sick.$s1_117ne$,
  169, 75, 152, 136,
  2.253333, 1.117647
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_118id$b7xc6a409aba1a50f254f5da7bc$s1_118id$,
  $s1_118st$usmle-step-1$s1_118st$,
  1,
  $s1_118oo$["On-time motor milestones replace the need for shared gaze","Calming for the parent means attachment has failed","Stranger anxiety is expected at this age, and pointing plus shared gaze show the social circuit is working","Crying at a stranger is abnormal once pointing has begun","Looking where a parent points is a late skill at 9 months"]$s1_118oo$,
  $s1_118no$["Motor milestones reached on schedule replace the need to look for shared gaze","Calming when the parent returns means that attachment has failed to form","Stranger anxiety is expected at this age, and pointing with shared gaze shows the social circuit is working","Crying when a stranger approaches is abnormal once a child has begun to point and to share a gaze","Looking where a parent points is a skill that appears well after 9 months of age"]$s1_118no$,
  $s1_118oc$Stranger anxiety is expected at this age, and pointing plus shared gaze show the social circuit is working$s1_118oc$,
  $s1_118nc$Stranger anxiety is expected at this age, and pointing with shared gaze shows the social circuit is working$s1_118nc$,
  $s1_118oe$Fear of strangers at 9 months, in a child who points and looks, is an expected social step and not a missing social circuit. Stranger anxiety is expected at this age, and pointing plus shared gaze show the social circuit is working. Crying at a stranger is abnormal once pointing has begun is the expected combination. Looking where a parent points is a late skill at 9 months is joint attention on time. On-time motor milestones replace the need for shared gaze do not, and here the gaze is present. Calming for the parent means attachment has failed is attachment working.$s1_118oe$,
  $s1_118ne$Fear of strangers at 9 months, in a child who points and looks, is an expected social step and not a missing social circuit. Stranger anxiety is expected at this age, and pointing with shared gaze shows the social circuit is working. Crying when a stranger approaches is abnormal once a child has begun to point and to share a gaze is the expected combination. Looking where a parent points is a skill that appears well after 9 months of age is joint attention on time. Motor milestones reached on schedule replace the need to look for shared gaze do not, and here the gaze is present. Calming when the parent returns means that attachment has failed to form is attachment working.$s1_118ne$,
  106, 57, 107, 97,
  1.859649, 1.103093
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_119id$b7xcd1566e8c63494f1f80f87da$s1_119id$,
  $s1_119st$usmle-step-1$s1_119st$,
  1,
  $s1_119oo$["The pulse oximeter is reading dissolved gas, which is why it is low","Nitrate exposure shifts the curve by adding 2,3-bisphosphoglycerate","Tension measures dissolved gas, and the oxidized pigment that cannot bind oxygen does not change that dissolved amount","Chocolate blood means carbon dioxide has replaced oxygen in plasma","A normal tension means hemoglobin is fully able to bind oxygen"]$s1_119oo$,
  $s1_119no$["The pulse oximeter is reading dissolved oxygen, which is why the saturation it reports falls in this disorder","Nitrate exposure shifts oxygen binding by raising red-cell 2,3-bisphosphoglycerate","Tension measures dissolved gas, and the oxidized pigment that cannot bind oxygen does not lower that dissolved amount","Chocolate-colored blood means carbon dioxide has replaced the oxygen dissolved in plasma","A normal oxygen tension means the hemoglobin is fully able to bind oxygen"]$s1_119no$,
  $s1_119oc$Tension measures dissolved gas, and the oxidized pigment that cannot bind oxygen does not change that dissolved amount$s1_119oc$,
  $s1_119nc$Tension measures dissolved gas, and the oxidized pigment that cannot bind oxygen does not lower that dissolved amount$s1_119nc$,
  $s1_119oe$A normal oxygen tension with chocolate blood means the tension measures dissolved gas, not the pigment that can no longer carry it. Tension measures dissolved gas, and the oxidized pigment that cannot bind oxygen does not change that dissolved amount. Chocolate blood means carbon dioxide has replaced oxygen in plasma is iron in the ferric form. A normal tension means hemoglobin is fully able to bind oxygen is the separation the case is teaching. The pulse oximeter is reading dissolved gas, which is why it is low is reading the abnormal pigment as not oxyhemoglobin. Nitrate exposure shifts the curve by adding 2,3-bisphosphoglycerate is oxidation of the iron, not a phosphate shift.$s1_119oe$,
  $s1_119ne$A normal oxygen tension with chocolate blood means the tension measures dissolved gas, not the pigment that can no longer carry it. Tension measures dissolved gas, and the oxidized pigment that cannot bind oxygen does not lower that dissolved amount. Chocolate-colored blood means carbon dioxide has replaced the oxygen dissolved in plasma is iron in the ferric form. A normal oxygen tension means the hemoglobin is fully able to bind oxygen is the separation the case is teaching. The pulse oximeter is reading dissolved oxygen, which is why the saturation it reports falls in this disorder is reading the abnormal pigment as not oxyhemoglobin. Nitrate exposure shifts oxygen binding by raising red-cell 2,3-bisphosphoglycerate is oxidation of the iron, not a phosphate shift.$s1_119ne$,
  118, 67, 117, 109,
  1.761194, 1.073394
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_120id$b7xfb0fe12e821cc943e04a3f99$s1_120id$,
  $s1_120st$usmle-step-1$s1_120st$,
  1,
  $s1_120oo$["Bilirubin falls only when the liver, not the spleen, is removed","Osmotic fragility normalizes as soon as the spleen is out","The spheres are destroyed by the cords of that organ, so the membrane defect remains but the filter is gone","Surgery repaired the membrane protein","A normal hemoglobin means the spherocytes are no longer fragile"]$s1_120oo$,
  $s1_120no$["The bilirubin falls only when the liver is removed and the spleen is left behind to continue filtering red cells","Osmotic fragility returns to normal as soon as the spleen has been removed","The spheres are destroyed in the cords of that organ, so the membrane defect remains after the filter is gone","The operation repaired the abnormal protein in the red-cell membrane","A normal hemoglobin means those spherocytes are no longer osmotically fragile"]$s1_120no$,
  $s1_120oc$The spheres are destroyed by the cords of that organ, so the membrane defect remains but the filter is gone$s1_120oc$,
  $s1_120nc$The spheres are destroyed in the cords of that organ, so the membrane defect remains after the filter is gone$s1_120nc$,
  $s1_120oe$Spherocytes remain after splenectomy, but hemolysis stops because the cords that trapped them are gone. The spheres are destroyed by the cords of that organ, so the membrane defect remains but the filter is gone. Surgery repaired the membrane protein is contradicted by the spheres and the fragility that remain. A normal hemoglobin means the spherocytes are no longer fragile ignores the fragility test. Bilirubin falls only when the liver, not the spleen, is removed misses where the cells were broken. Osmotic fragility normalizes as soon as the spleen is out stays abnormal because the membrane defect is still in the cell.$s1_120oe$,
  $s1_120ne$Spherocytes remain after splenectomy, but hemolysis stops because the cords that trapped them are gone. The spheres are destroyed in the cords of that organ, so the membrane defect remains after the filter is gone. The operation repaired the abnormal protein in the red-cell membrane is contradicted by the spheres and the fragility that remain. A normal hemoglobin means those spherocytes are no longer osmotically fragile ignores the fragility test. The bilirubin falls only when the liver is removed and the spleen is left behind to continue filtering red cells misses where the cells were broken. Osmotic fragility returns to normal as soon as the spleen has been removed stays abnormal because the membrane defect is still in the cell.$s1_120ne$,
  107, 63, 109, 112,
  1.698413, 0.973214
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_121id$b8x1300288ac2599ed7b817dbee$s1_121id$,
  $s1_121st$usmle-step-1$s1_121st$,
  1,
  $s1_121oo$["The ligament inside the joint bleeds directly into it, and the inner-side ligament bleeds outside the capsule","A pop means both ligaments are outside the joint","Forward slide of the tibia is an outer-capsule tear","Overnight swelling is blood inside the joint","Immediate swelling means the capsule is intact and empty"]$s1_121oo$,
  $s1_121no$["The ligament inside the joint bleeds directly into it, and the inner-side ligament bleeds outside the capsule","An audible pop means both of the torn ligaments lie outside the joint capsule","Forward slide of the tibia is the finding of a ligament torn outside the capsule","Swelling that arrives overnight is blood that has collected inside the joint","Swelling within the first hour means the capsule is intact and the joint is empty of blood"]$s1_121no$,
  $s1_121oc$The ligament inside the joint bleeds directly into it, and the inner-side ligament bleeds outside the capsule$s1_121oc$,
  $s1_121nc$The ligament inside the joint bleeds directly into it, and the inner-side ligament bleeds outside the capsule$s1_121nc$,
  $s1_121oe$The knee swelled within an hour because the torn ligament is inside the joint, so the bleed has nowhere else to go. The ligament inside the joint bleeds directly into it, and the inner-side ligament bleeds outside the capsule. A pop means both ligaments are outside the joint does not locate them. Forward slide of the tibia is an outer-capsule tear is the ligament inside the joint. Overnight swelling is blood inside the joint is blood outside it. Immediate swelling means the capsule is intact and empty is the capsule filling.$s1_121oe$,
  $s1_121ne$The knee swelled within an hour because the torn ligament is inside the joint, so the bleed has nowhere else to go. The ligament inside the joint bleeds directly into it, and the inner-side ligament bleeds outside the capsule. An audible pop means both of the torn ligaments lie outside the joint capsule does not locate them. Forward slide of the tibia is the finding of a ligament torn outside the capsule is the ligament inside the joint. Swelling that arrives overnight is blood that has collected inside the joint is blood outside it. Swelling within the first hour means the capsule is intact and the joint is empty of blood is the capsule filling.$s1_121ne$,
  109, 56, 109, 90,
  1.946429, 1.211111
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_122id$b8x3b92f7a2b252f051d22c7ea2$s1_122id$,
  $s1_122st$usmle-step-1$s1_122st$,
  1,
  $s1_122oo$["Iron arrives and cannot be inserted into heme, so it stacks in the mitochondria instead of being missing","Ringed sideroblasts mean the iron stores are empty","A volume of 72 with a high ferritin is iron deficiency","The brother’s ferritin of 8 ng/mL means iron is trapped in mitochondria","Small cells always mean too much iron in the store"]$s1_122oo$,
  $s1_122no$["Iron arrives but cannot be inserted into heme, so it stacks in mitochondria instead of being missing from stores","Ringed sideroblasts on the marrow smear mean storage iron is empty and the ferritin should come back low","A red-cell volume of 72 fL with a high ferritin is the picture of iron deficiency","The brother's ferritin of 8 ng/mL means his iron is trapped inside mitochondria","Small red cells always mean that storage iron is present in excess"]$s1_122no$,
  $s1_122oc$Iron arrives and cannot be inserted into heme, so it stacks in the mitochondria instead of being missing$s1_122oc$,
  $s1_122nc$Iron arrives but cannot be inserted into heme, so it stacks in mitochondria instead of being missing from stores$s1_122nc$,
  $s1_122oe$Iron piles up inside the red-cell mitochondria when the heme enzyme cannot insert it, which is the opposite of an empty store. Iron arrives and cannot be inserted into heme, so it stacks in the mitochondria instead of being missing. Ringed sideroblasts mean the iron stores are empty are iron-loaded mitochondria. A volume of 72 with a high ferritin is iron deficiency is the brother, whose ferritin is low. The brother’s ferritin of 8 ng/mL means iron is trapped in mitochondria is an empty store. Small cells always mean too much iron in the store are also the cells of iron deficiency.$s1_122oe$,
  $s1_122ne$Iron piles up inside the red-cell mitochondria when the heme enzyme cannot insert it, which is the opposite of an empty store. Iron arrives but cannot be inserted into heme, so it stacks in mitochondria instead of being missing from stores. Ringed sideroblasts on the marrow smear mean storage iron is empty and the ferritin should come back low are iron-loaded mitochondria. A red-cell volume of 72 fL with a high ferritin is the picture of iron deficiency is the brother, whose ferritin is low. The brother's ferritin of 8 ng/mL means his iron is trapped inside mitochondria is an empty store. Small red cells always mean that storage iron is present in excess are also the cells of iron deficiency.$s1_122ne$,
  104, 71, 112, 104,
  1.464789, 1.076923
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_123id$b8x5dedd6a8900a473fa08d0dc6$s1_123id$,
  $s1_123st$usmle-step-1$s1_123st$,
  1,
  $s1_123oo$["A normal platelet count means ristocetin must work","Replacing plasma repairs a receptor that sits on the platelet","His platelets lack the receptor ristocetin needs, while her plasma lacks the protein that receptor binds","Both lack the same plasma protein","ADP clumping fails when the plasma protein is missing"]$s1_123oo$,
  $s1_123no$["A normal platelet count means ristocetin-induced aggregation must succeed in both relatives","Replacing the plasma repairs a receptor that sits on the platelet surface","His platelets lack the receptor ristocetin needs, while her plasma lacks the protein that receptor binds","Both relatives are missing the same plasma protein that ristocetin requires","Clumping after ADP fails in the relative whose plasma protein is missing"]$s1_123no$,
  $s1_123oc$His platelets lack the receptor ristocetin needs, while her plasma lacks the protein that receptor binds$s1_123oc$,
  $s1_123nc$His platelets lack the receptor ristocetin needs, while her plasma lacks the protein that receptor binds$s1_123nc$,
  $s1_123oe$Ristocetin still fails after normal plasma is added because the missing piece is on the platelet, not in the plasma. His platelets lack the receptor ristocetin needs, while her plasma lacks the protein that receptor binds. Both lack the same plasma protein would have let normal plasma fix him too. ADP clumping fails when the plasma protein is missing confuses a fibrinogen-receptor defect with the missing plasma protein, and both of them clump with ADP. A normal platelet count means ristocetin must work does not test the count. Replacing plasma repairs a receptor that sits on the platelet cannot replace a receptor.$s1_123oe$,
  $s1_123ne$Ristocetin still fails after normal plasma is added because the missing piece is on the platelet, not in the plasma. His platelets lack the receptor ristocetin needs, while her plasma lacks the protein that receptor binds. Both relatives are missing the same plasma protein that ristocetin requires would have let normal plasma fix him too. Clumping after ADP fails in the relative whose plasma protein is missing confuses a fibrinogen-receptor defect with the missing plasma protein, and both of them clump with ADP. A normal platelet count means ristocetin-induced aggregation must succeed in both relatives does not test the count. Replacing the plasma repairs a receptor that sits on the platelet surface cannot replace a receptor.$s1_123ne$,
  104, 61, 104, 91,
  1.704918, 1.142857
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_124id$b8x6c9ddb8106eedc2b62807622$s1_124id$,
  $s1_124st$usmle-step-1$s1_124st$,
  1,
  $s1_124oo$["High carbon dioxide with a normal gradient is a shunt","A low carbon dioxide means the patient is not ventilating enough","Obesity raises the gradient by definition","The air that arrives still equilibrates, so the low oxygen is too little ventilation rather than a bad match","A wide gradient means hypoventilation with a normal lung"]$s1_124oo$,
  $s1_124no$["A high carbon dioxide with a normal alveolar-arterial gradient means blood is shunting past ventilated alveoli","A low carbon dioxide means the patient is not moving enough air to clear it","Obesity widens the alveolar-arterial oxygen gradient by definition","Air that arrives still equilibrates with capillary blood, so the low oxygen is too little ventilation rather than a bad match","A wide alveolar-arterial gradient means hypoventilation in a lung that is otherwise normal"]$s1_124no$,
  $s1_124oc$The air that arrives still equilibrates, so the low oxygen is too little ventilation rather than a bad match$s1_124oc$,
  $s1_124nc$Air that arrives still equilibrates with capillary blood, so the low oxygen is too little ventilation rather than a bad match$s1_124nc$,
  $s1_124oe$A normal alveolar-arterial oxygen gap means the air he does move still exchanges, and the low oxygen is from not moving enough of it. The air that arrives still equilibrates, so the low oxygen is too little ventilation rather than a bad match. A wide gradient means hypoventilation with a normal lung is mismatch or shunt, which is the other patient. High carbon dioxide with a normal gradient is a shunt is pure hypoventilation. A low carbon dioxide means the patient is not ventilating enough is hyperventilation, often with a wide gradient. Obesity raises the gradient by definition can lower ventilation and leave the gradient normal.$s1_124oe$,
  $s1_124ne$A normal alveolar-arterial oxygen gap means the air he does move still exchanges, and the low oxygen is from not moving enough of it. Air that arrives still equilibrates with capillary blood, so the low oxygen is too little ventilation rather than a bad match. A wide alveolar-arterial gradient means hypoventilation in a lung that is otherwise normal is mismatch or shunt, which is the other patient. A high carbon dioxide with a normal alveolar-arterial gradient means blood is shunting past ventilated alveoli is pure hypoventilation. A low carbon dioxide means the patient is not moving enough air to clear it is hyperventilation, often with a wide gradient. Obesity widens the alveolar-arterial oxygen gradient by definition can lower ventilation and leave the gradient normal.$s1_124ne$,
  108, 64, 125, 110,
  1.687500, 1.136364
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_125id$b8x81438c4e1a27ac519364d664$s1_125id$,
  $s1_125st$usmle-step-1$s1_125st$,
  1,
  $s1_125oo$["Collateral arteries running under the ribs enlarged to bypass the narrow segment and wore the bone away","Weak foot pulses mean the intercostal arteries are small","A higher arm pressure means flow never needs a bypass","Old fractures follow the lower border of many ribs in a row","A murmur over the back means the notches are in the legs"]$s1_125oo$,
  $s1_125no$["Collateral arteries under the ribs enlarged to bypass the narrow aortic segment and wore the bone away","Weak pulses at the feet mean the intercostal collateral arteries stayed small","A higher pressure in the arms means flow never needs a bypass around the narrow segment","The notches are old fractures running along the lower border of rib after rib","A murmur heard over the back means the notches are in the bones of the legs"]$s1_125no$,
  $s1_125oc$Collateral arteries running under the ribs enlarged to bypass the narrow segment and wore the bone away$s1_125oc$,
  $s1_125nc$Collateral arteries under the ribs enlarged to bypass the narrow aortic segment and wore the bone away$s1_125nc$,
  $s1_125oe$The ribs are notched because enlarged intercostal arteries bypassed the narrow aorta and eroded the bone. Collateral arteries running under the ribs enlarged to bypass the narrow segment and wore the bone away. Weak foot pulses mean the intercostal arteries are small are large because the distal aorta is underfilled. A higher arm pressure means flow never needs a bypass is why collaterals grew. Old fractures follow the lower border of many ribs in a row are arterial erosions. A murmur over the back means the notches are in the legs is the narrow segment and its collaterals.$s1_125oe$,
  $s1_125ne$The ribs are notched because enlarged intercostal arteries bypassed the narrow aorta and eroded the bone. Collateral arteries under the ribs enlarged to bypass the narrow aortic segment and wore the bone away. Weak pulses at the feet mean the intercostal collateral arteries stayed small are large because the distal aorta is underfilled. A higher pressure in the arms means flow never needs a bypass around the narrow segment is why collaterals grew. The notches are old fractures running along the lower border of rib after rib are arterial erosions. A murmur heard over the back means the notches are in the bones of the legs is the narrow segment and its collaterals.$s1_125ne$,
  103, 59, 102, 87,
  1.745763, 1.172414
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_126id$b8xab8d8087148e1de0b8d27270$s1_126id$,
  $s1_126st$usmle-step-1$s1_126st$,
  1,
  $s1_126oo$["Blood leaves more slowly, so pressure in the capillary rises and a larger share of the remaining flow is filtered","Afferent constriction raises glomerular capillary pressure","A fall in renal plasma flow always lowers the filtration fraction","Efferent constriction drops the pressure that drives filtration","Filtration fraction rises only when both arterioles constrict"]$s1_126oo$,
  $s1_126no$["Blood leaves the glomerular capillary more slowly, pressure inside it rises, and a larger share of the remaining flow is filtered","Constriction of the afferent arteriole raises pressure in the glomerular capillary","A fall in renal plasma flow always lowers the filtration fraction in the same direction","Efferent constriction lowers the capillary pressure that drives filtration","The filtration fraction rises only when the afferent and efferent arterioles constrict together and plasma flow is unchanged"]$s1_126no$,
  $s1_126oc$Blood leaves more slowly, so pressure in the capillary rises and a larger share of the remaining flow is filtered$s1_126oc$,
  $s1_126nc$Blood leaves the glomerular capillary more slowly, pressure inside it rises, and a larger share of the remaining flow is filtered$s1_126nc$,
  $s1_126oe$Blocking the outgoing arteriole raises the filtration fraction because capillary pressure rises while flow through the kidney falls. Blood leaves more slowly, so pressure in the capillary rises and a larger share of the remaining flow is filtered. Afferent constriction raises glomerular capillary pressure lowers it, which is the second maneuver. A fall in renal plasma flow always lowers the filtration fraction depends on whether filtration fell by as much. Efferent constriction drops the pressure that drives filtration raises it. Filtration fraction rises only when both arterioles constrict rose with outgoing constriction alone.$s1_126oe$,
  $s1_126ne$Blocking the outgoing arteriole raises the filtration fraction because capillary pressure rises while flow through the kidney falls. Blood leaves the glomerular capillary more slowly, pressure inside it rises, and a larger share of the remaining flow is filtered. Constriction of the afferent arteriole raises pressure in the glomerular capillary lowers it, which is the second maneuver. A fall in renal plasma flow always lowers the filtration fraction in the same direction depends on whether filtration fell by as much. Efferent constriction lowers the capillary pressure that drives filtration raises it. The filtration fraction rises only when the afferent and efferent arterioles constrict together and plasma flow is unchanged rose with outgoing constriction alone.$s1_126ne$,
  113, 65, 129, 124,
  1.738462, 1.040323
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_127id$b8xe2661280052233759a54e00e$s1_127id$,
  $s1_127st$usmle-step-1$s1_127st$,
  1,
  $s1_127oo$["A blood thinner produces a lens that respects sutures","Skull sutures are gaps the arterial blood prefers to cross","Arterial blood in that space is walled off by dural attachments, and venous blood under the dura is not","A crescent that crosses sutures is arterial","Loss of consciousness then a lucid interval is a venous ooze"]$s1_127oo$,
  $s1_127no$["Anticoagulation produces a lens-shaped blood collection that stops at skull sutures and cannot cross them","Skull sutures are openings that arterial blood preferentially crosses","Arterial blood in that space is walled off by dural attachments at the sutures, and venous blood under the dura is not","A crescentic collection that crosses sutures is blood from an artery","Loss of consciousness followed by a lucid interval is the course of a venous ooze"]$s1_127no$,
  $s1_127oc$Arterial blood in that space is walled off by dural attachments, and venous blood under the dura is not$s1_127oc$,
  $s1_127nc$Arterial blood in that space is walled off by dural attachments at the sutures, and venous blood under the dura is not$s1_127nc$,
  $s1_127oe$The lens of blood stops at the sutures because dural attachments limit an arterial collection, and a venous crescent does not. Arterial blood in that space is walled off by dural attachments, and venous blood under the dura is not. A crescent that crosses sutures is arterial is venous. Loss of consciousness then a lucid interval is a venous ooze is the arterial pattern. A blood thinner produces a lens that respects sutures produces the crescent. Skull sutures are gaps the arterial blood prefers to cross are where the dura is attached and the collection stops.$s1_127oe$,
  $s1_127ne$The lens of blood stops at the sutures because dural attachments limit an arterial collection, and a venous crescent does not. Arterial blood in that space is walled off by dural attachments at the sutures, and venous blood under the dura is not. A crescentic collection that crosses sutures is blood from an artery is venous. Loss of consciousness followed by a lucid interval is the course of a venous ooze is the arterial pattern. Anticoagulation produces a lens-shaped blood collection that stops at skull sutures and cannot cross them produces the crescent. Skull sutures are openings that arterial blood preferentially crosses are where the dura is attached and the collection stops.$s1_127ne$,
  103, 60, 118, 105,
  1.716667, 1.123810
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_128id$b9ecaf5a-d29a-4923-aa8c-a45ac4d34d8d$s1_128id$,
  $s1_128st$usmle-step-1$s1_128st$,
  1,
  $s1_128oo${"options": ["Apoptosis is ATP-dependent cell death with an intact membrane and no inflammation; necrosis ruptures the membrane and inflames", "Necrosis is programmed and noninflammatory", "Apoptosis always means a pathologic injury and never a developmental event", "Both spill the same cytosolic enzymes because both rupture", "Neutrophils define apoptosis"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Apoptosis versus necrosis", "kind": "vignette"}$s1_128oo$,
  $s1_128no${"options": ["Apoptosis is ATP-dependent death with an intact membrane and no inflammation; necrosis ruptures the membrane and inflames the tissue", "Necrosis is programmed cell death and does not recruit an inflammatory response", "Apoptosis always means a pathologic injury and never a scheduled developmental event", "Both processes release the same cytosolic enzymes into blood because both rupture the plasma membrane of the cell", "A neutrophilic infiltrate in the tissue is what defines apoptosis"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Apoptosis versus necrosis", "kind": "vignette"}$s1_128no$,
  $s1_128oc$Apoptosis is ATP-dependent cell death with an intact membrane and no inflammation; necrosis ruptures the membrane and inflames$s1_128oc$,
  $s1_128nc$Apoptosis is ATP-dependent death with an intact membrane and no inflammation; necrosis ruptures the membrane and inflames the tissue$s1_128nc$,
  $s1_128oe$Apoptosis packages the cell for phagocytosis. The membrane stays intact, so contents do not pour out and neutrophils are not called. It can be physiologic, as in development. Necrosis is messy ATP-failure death: swelling, rupture, enzyme leak, and inflammation. Necrosis is not the programmed noninflammatory path. Apoptosis is not always disease. Enzyme spill into blood is the necrotic pattern. Neutrophils mark necrosis.$s1_128oe$,
  $s1_128ne$Apoptosis packages the cell for phagocytosis. The membrane stays intact, so contents do not pour out and neutrophils are not called. It can be physiologic, as in development. Necrosis is messy ATP-failure death: swelling, rupture, enzyme leak, and inflammation. Necrosis is not the programmed noninflammatory path. Apoptosis is not always disease. Enzyme spill into blood is the necrotic pattern. Neutrophils mark necrosis.$s1_128ne$,
  126, 74, 132, 113,
  1.702703, 1.168142
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_129id$b9x6ce5c05f56b5f6a485edb2da$s1_129id$,
  $s1_129st$usmle-step-1$s1_129st$,
  1,
  $s1_129oo$["Umbilical bleeding with two long times is a single intrinsic-factor deficiency","Normal liver enzymes mean vitamin-dependent factors cannot be low","The vitamin supports factor VII as well as the shared factors, and the boy is missing only a factor the prothrombin time ignores","A normal bleeding time means both clotting times must be normal","Joint bleeds with one long time are a vitamin problem"]$s1_129oo$,
  $s1_129no$["Umbilical-stump bleeding with two prolonged clotting times is loss of one factor in the intrinsic pathway of an otherwise well newborn","Normal liver enzymes mean the vitamin K-dependent clotting factors cannot be low","The vitamin supports factor VII as well as the shared factors, so both times lengthen; the boy lacks only a factor the prothrombin time ignores","A normal bleeding time means both the prothrombin time and the partial thromboplastin time must be normal","Joint bleeds paired with a single prolonged clotting time are the pattern of vitamin K deficiency"]$s1_129no$,
  $s1_129oc$The vitamin supports factor VII as well as the shared factors, and the boy is missing only a factor the prothrombin time ignores$s1_129oc$,
  $s1_129nc$The vitamin supports factor VII as well as the shared factors, so both times lengthen; the boy lacks only a factor the prothrombin time ignores$s1_129nc$,
  $s1_129oe$Both clotting times are long because factor VII, which only the prothrombin time sees, also depends on the missing vitamin. The vitamin supports factor VII as well as the shared factors, and the boy is missing only a factor the prothrombin time ignores. A normal bleeding time means both clotting times must be normal shows the platelet plug is intact in both. Joint bleeds with one long time are a vitamin problem are a single intrinsic factor. Umbilical bleeding with two long times is a single intrinsic-factor deficiency would spare the prothrombin time. Normal liver enzymes mean vitamin-dependent factors cannot be low mean the liver can make the proteins but lacks the vitamin.$s1_129oe$,
  $s1_129ne$Both clotting times are long because factor VII, which only the prothrombin time sees, also depends on the missing vitamin. The vitamin supports factor VII as well as the shared factors, so both times lengthen; the boy lacks only a factor the prothrombin time ignores. A normal bleeding time means both the prothrombin time and the partial thromboplastin time must be normal shows the platelet plug is intact in both. Joint bleeds paired with a single prolonged clotting time are the pattern of vitamin K deficiency are a single intrinsic factor. Umbilical-stump bleeding with two prolonged clotting times is loss of one factor in the intrinsic pathway of an otherwise well newborn would spare the prothrombin time. Normal liver enzymes mean the vitamin K-dependent clotting factors cannot be low mean the liver can make the proteins but lacks the vitamin.$s1_129ne$,
  128, 78, 143, 134,
  1.641026, 1.067164
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_130id$b9x9a163c285bf9ff87da6daf52$s1_130id$,
  $s1_130st$usmle-step-1$s1_130st$,
  1,
  $s1_130oo$["A leak of serum antibody produces bands only in the fluid","Symptoms separated in time mean the bands are an acute blood protein","The antibody is synthesized inside the nervous system, which a simple leak of serum antibody would also show in the serum","Absent serum bands mean the fluid bands were contamination from blood","Periventricular lesions mean the bands came from the serum"]$s1_130oo$,
  $s1_130no$["A leak of antibody from the serum produces oligoclonal bands only in the spinal fluid","Symptoms separated in time mean the bands are an acute-phase protein that crossed into the fluid from blood","The antibody is synthesized inside the nervous system; a simple leak of serum antibody would show the same bands in the serum","Bands absent from the serum mean the bands in the fluid were contamination from blood","Periventricular white-matter lesions mean the bands originated in the serum and leaked inward"]$s1_130no$,
  $s1_130oc$The antibody is synthesized inside the nervous system, which a simple leak of serum antibody would also show in the serum$s1_130oc$,
  $s1_130nc$The antibody is synthesized inside the nervous system; a simple leak of serum antibody would show the same bands in the serum$s1_130nc$,
  $s1_130oe$The bands are in the spinal fluid and not the serum because the antibodies are being made inside the nervous system. The antibody is synthesized inside the nervous system, which a simple leak of serum antibody would also show in the serum. Absent serum bands mean the fluid bands were contamination from blood would have matched the serum. Periventricular lesions mean the bands came from the serum are the central process making them. A leak of serum antibody produces bands only in the fluid would show them in both. Symptoms separated in time mean the bands are an acute blood protein are the clinical setting of intrathecal synthesis.$s1_130oe$,
  $s1_130ne$The bands are in the spinal fluid and not the serum because the antibodies are being made inside the nervous system. The antibody is synthesized inside the nervous system; a simple leak of serum antibody would show the same bands in the serum. Bands absent from the serum mean the bands in the fluid were contamination from blood would have matched the serum. Periventricular white-matter lesions mean the bands originated in the serum and leaked inward are the central process making them. A leak of antibody from the serum produces oligoclonal bands only in the spinal fluid would show them in both. Symptoms separated in time mean the bands are an acute-phase protein that crossed into the fluid from blood are the clinical setting of intrathecal synthesis.$s1_130ne$,
  121, 69, 125, 107,
  1.753623, 1.168224
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_131id$b9xc4c968d67bcf35d908ca784b$s1_131id$,
  $s1_131st$usmle-step-1$s1_131st$,
  1,
  $s1_131oo$["Preserved blinking means the ventral pons is spared","Intact pin sensation reported by a blink means coma","Vertical eye movements remaining mean the whole pons is destroyed","Inability to speak with limb paralysis is unconsciousness","The fibers to the limbs and the mouth are in the ventral pons, and the activating system above them is intact"]$s1_131oo$,
  $s1_131no$["Preserved blinking, with vertical gaze, means the ventral pons has been spared","Reporting a pinprick by blinking means the patient is unconscious","Vertical eye movements that remain mean the entire pons has been destroyed","Inability to speak, together with paralyzed limbs, is the definition of unconsciousness","Fibers to the limbs and the mouth lie in the ventral pons, and the activating system above them is intact"]$s1_131no$,
  $s1_131oc$The fibers to the limbs and the mouth are in the ventral pons, and the activating system above them is intact$s1_131oc$,
  $s1_131nc$Fibers to the limbs and the mouth lie in the ventral pons, and the activating system above them is intact$s1_131nc$,
  $s1_131oe$He can blink and not move the limbs because the basis of the pons is destroyed and the midbrain lid of eye movement is spared. The fibers to the limbs and the mouth are in the ventral pons, and the activating system above them is intact. Preserved blinking means the ventral pons is spared is communication through a spared midbrain. Intact pin sensation reported by a blink means coma is wakefulness. Vertical eye movements remaining mean the whole pons is destroyed spare the midbrain. Inability to speak with limb paralysis is unconsciousness is locked-in wakefulness.$s1_131oe$,
  $s1_131ne$He can blink and not move the limbs because the basis of the pons is destroyed and the midbrain lid of eye movement is spared. Fibers to the limbs and the mouth lie in the ventral pons, and the activating system above them is intact. Preserved blinking, with vertical gaze, means the ventral pons has been spared is communication through a spared midbrain. Reporting a pinprick by blinking means the patient is unconscious is wakefulness. Vertical eye movements that remain mean the entire pons has been destroyed spare the midbrain. Inability to speak, together with paralyzed limbs, is the definition of unconsciousness is locked-in wakefulness.$s1_131ne$,
  109, 65, 105, 87,
  1.676923, 1.206897
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_132id$b9xf859e2559998f28f8bb91271$s1_132id$,
  $s1_132st$usmle-step-1$s1_132st$,
  1,
  $s1_132oo$["Fasciculations with an upgoing toe are a single muscle disease","An upgoing toe without a sensory level is a dead horn cell only","The flicker is a dying horn cell and the upgoing toe is a dying upper-motor axon, which one site cannot supply","Normal sensation means the motor neuron disease has a sensory level","Strained speech means a sensory neuropathy"]$s1_132oo$,
  $s1_132no$["Fasciculations plus an upgoing toe are produced by a single disease of the muscle","An upgoing toe without a sensory level is a dead anterior horn cell only","The flicker is a dying anterior horn cell and the upgoing toe is a dying upper-motor axon; one site cannot supply both","Normal sensation over the trunk means this motor neuron disease also has a sensory level that explains both signs","Strained, nasal speech means the process is a sensory neuropathy"]$s1_132no$,
  $s1_132oc$The flicker is a dying horn cell and the upgoing toe is a dying upper-motor axon, which one site cannot supply$s1_132oc$,
  $s1_132nc$The flicker is a dying anterior horn cell and the upgoing toe is a dying upper-motor axon; one site cannot supply both$s1_132nc$,
  $s1_132oe$Fasciculations and an upgoing toe together mean both the horn cell and the corticospinal tract are dying, and sensation is spared. The flicker is a dying horn cell and the upgoing toe is a dying upper-motor axon, which one site cannot supply. Normal sensation means the motor neuron disease has a sensory level is the sparing that argues against a cord sensory lesion. Strained speech means a sensory neuropathy is bulbar motor. Fasciculations with an upgoing toe are a single muscle disease split into lower and upper motor. An upgoing toe without a sensory level is a dead horn cell only is the upper-motor half.$s1_132oe$,
  $s1_132ne$Fasciculations and an upgoing toe together mean both the horn cell and the corticospinal tract are dying, and sensation is spared. The flicker is a dying anterior horn cell and the upgoing toe is a dying upper-motor axon; one site cannot supply both. Normal sensation over the trunk means this motor neuron disease also has a sensory level that explains both signs is the sparing that argues against a cord sensory lesion. Strained, nasal speech means the process is a sensory neuropathy is bulbar motor. Fasciculations plus an upgoing toe are produced by a single disease of the muscle split into lower and upper motor. An upgoing toe without a sensory level is a dead anterior horn cell only is the upper-motor half.$s1_132ne$,
  110, 67, 118, 113,
  1.641791, 1.044248
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_133id$bcb10690-3a03-4691-9105-07d4f7d1277a$s1_133id$,
  $s1_133st$usmle-step-1$s1_133st$,
  1,
  $s1_133oo${"options": ["A first-order or second-order lesion is proximal to the superior cervical ganglion, so the face loses sweating; a postganglionic carotid lesion spares most facial sweating because those fibers traveled along the external carotid", "All three are third-order lesions, so sweating loss is identical", "Pancoast tumor hits the third-order neuron at the iris, so the whole body sweats too much", "A small pupil means parasympathetic loss, so pilocarpine will dilate it", "Ptosis in Horner syndrome is loss of levator palpebrae, the oculomotor muscle"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Horner syndrome orders", "kind": "vignette"}$s1_133oo$,
  $s1_133no${"options": ["Pancoast is a second-order lesion before the superior cervical ganglion, so facial sweating stops; a postganglionic carotid lesion spares it because sweat fibers follow the external carotid", "All three lesions are third-order, so the distribution of lost sweating is the same in each", "A Pancoast tumor hits the third-order neuron at the iris, so sweating increases over the whole body and the light reflex is lost", "The small pupil is from parasympathetic loss, and pilocarpine drops will dilate it", "Horner ptosis is paralysis of levator palpebrae superioris, the oculomotor muscle, and sweating is lost over that entire half of the body because the lesion is first-order"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Horner syndrome orders", "kind": "vignette"}$s1_133no$,
  $s1_133oc$A first-order or second-order lesion is proximal to the superior cervical ganglion, so the face loses sweating; a postganglionic carotid lesion spares most facial sweating because those fibers traveled along the external carotid$s1_133oc$,
  $s1_133nc$Pancoast is a second-order lesion before the superior cervical ganglion, so facial sweating stops; a postganglionic carotid lesion spares it because sweat fibers follow the external carotid$s1_133nc$,
  $s1_133oe$Sympathetic supply to the pupil and lid synapses in the superior cervical ganglion. Sudomotor fibers to most of the face peel off along the external carotid, while the internal carotid carries the ocular sympathetics. A Pancoast tumor hits the second-order preganglionic chain, so the whole half of the face is dry. A carotid dissection is third-order and often spares facial sweating except a small medial forehead area. Lateral medullary lesions are first-order and can include body anhidrosis. Calling all three third-order erases the sweating map. The miotic pupil is lost sympathetic dilation, not lost parasympathetic constriction. Horner ptosis is Müller muscle, a small smooth muscle; the skeletal levator is the third nerve and causes a much larger droop.$s1_133oe$,
  $s1_133ne$Sympathetic supply to the pupil and lid synapses in the superior cervical ganglion. Sudomotor fibers to most of the face peel off along the external carotid, while the internal carotid carries the ocular sympathetics. A Pancoast tumor hits the second-order preganglionic chain, so the whole half of the face is dry. A carotid dissection is third-order and often spares facial sweating except a small medial forehead area. Lateral medullary lesions are first-order and can include body anhidrosis. Calling all three third-order erases the sweating map. The miotic pupil is lost sympathetic dilation, not lost parasympathetic constriction. Horner ptosis is Müller muscle, a small smooth muscle; the skeletal levator is the third nerve and causes a much larger droop.$s1_133ne$,
  228, 89, 189, 171,
  2.561798, 1.105263
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_134id$bd1518f4-bc73-4aea-815e-e18d9ad899dd$s1_134id$,
  $s1_134st$usmle-step-1$s1_134st$,
  1,
  $s1_134oo${"options": ["Milk has no fructose; aldolase B failure traps fructose-1-phosphate and consumes phosphate, which blocks glycogenolysis and gluconeogenesis", "Breast milk is rich in fructose, so the story is impossible", "Galactosemia presents only after juice and spares milk", "Hexokinase is the missing enzyme, so fructose never gets phosphorylated", "Hypoglycemia means he needs more sucrose"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Hereditary fructose intolerance", "kind": "vignette"}$s1_134oo$,
  $s1_134no${"options": ["Milk has no fructose; aldolase B traps fructose-1-phosphate and sequesters phosphate", "Breast milk is rich in fructose, so the phosphate trap should have started on milk feeds", "Galactosemia presents only after juice and spares milk, since lactose bypasses that block", "Hexokinase is the missing enzyme, so fructose never gets phosphorylated or trapped", "Hypoglycemia means he needs more sucrose to restore hepatic phosphate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Hereditary fructose intolerance", "kind": "vignette"}$s1_134no$,
  $s1_134oc$Milk has no fructose; aldolase B failure traps fructose-1-phosphate and consumes phosphate, which blocks glycogenolysis and gluconeogenesis$s1_134oc$,
  $s1_134nc$Milk has no fructose; aldolase B traps fructose-1-phosphate and sequesters phosphate$s1_134nc$,
  $s1_134oe$Sucrose and fruit contain fructose. Aldolase B splits fructose-1-phosphate. Without it the phosphate ester accumulates, inorganic phosphate falls, and the liver cannot run glycogen breakdown or gluconeogenesis, so glucose falls. Breast milk does not contain fructose, which is why he was well at first. Galactosemia is triggered by milk, the opposite timing. The phosphorylating enzyme works; the cleavage enzyme does not. More sucrose is the poison.$s1_134oe$,
  $s1_134ne$Sucrose and fruit contain fructose. Aldolase B splits fructose-1-phosphate. Without it the phosphate ester accumulates, inorganic phosphate falls, and the liver cannot run glycogen breakdown or gluconeogenesis, so glucose falls. Breast milk does not contain fructose, which is why he was well at first. Galactosemia is triggered by milk, the opposite timing. The phosphorylating enzyme works; the cleavage enzyme does not. More sucrose is the poison.$s1_134ne$,
  139, 71, 84, 89,
  1.957746, 0.943820
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_135id$be63e936-3229-4065-b1fd-99d041f13475$s1_135id$,
  $s1_135st$usmle-step-1$s1_135st$,
  1,
  $s1_135oo${"options": ["Reactive arthritis after an infection, sterile synovitis with enthesitis and uveitis or circinate balanitis; the knee is not where the bacteria are living", "Septic arthritis from ongoing bacteremia, so the diarrhea organism is in the synovial fluid", "Rheumatoid arthritis, which follows dysentery and prefers the DIP joints", "Gout, because HLA-B27 is the gout gene", "Antibiotics for the old diarrhea will reverse the sterile synovitis the same day"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Reactive arthritis", "kind": "vignette"}$s1_135oo$,
  $s1_135no${"options": ["Reactive arthritis is sterile synovitis after infection; the knee itself is not infected", "Septic arthritis from ongoing bacteremia, so the diarrhea organism is living in the synovial fluid", "Rheumatoid arthritis, which follows dysentery and prefers the DIP joints of both hands", "Gout, because HLA-B27 is the gout gene and urate crystals fill the knee", "Antibiotics for the old diarrhea will reverse the sterile synovitis the same day"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Reactive arthritis", "kind": "vignette"}$s1_135no$,
  $s1_135oc$Reactive arthritis after an infection, sterile synovitis with enthesitis and uveitis or circinate balanitis; the knee is not where the bacteria are living$s1_135oc$,
  $s1_135nc$Reactive arthritis is sterile synovitis after infection; the knee itself is not infected$s1_135nc$,
  $s1_135oe$Reactive arthritis follows Chlamydia or a gut infection by days to weeks. The joint is sterile inflammation, often with Achilles enthesitis, uveitis, and keratoderma or circinate balanitis, and HLA-B27 is enriched. Antibiotics for a septic knee are the wrong model once the fluid is sterile and the cluster is present. Rheumatoid arthritis is not a post-dysentery DIP disease. HLA-B27 is the spondyloarthritis gene, not gout. Treating the resolved diarrhea does not instantly clear the immune synovitis.$s1_135oe$,
  $s1_135ne$Reactive arthritis follows Chlamydia or a gut infection by days to weeks. The joint is sterile inflammation, often with Achilles enthesitis, uveitis, and keratoderma or circinate balanitis, and HLA-B27 is enriched. Antibiotics for a septic knee are the wrong model once the fluid is sterile and the cluster is present. Rheumatoid arthritis is not a post-dysentery DIP disease. HLA-B27 is the spondyloarthritis gene, not gout. Treating the resolved diarrhea does not instantly clear the immune synovitis.$s1_135ne$,
  154, 91, 88, 98,
  1.692308, 0.897959
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_136id$be96201e-5fdc-4fc1-a595-ce5c929fedd4$s1_136id$,
  $s1_136st$usmle-step-1$s1_136st$,
  1,
  $s1_136oo${"options": ["Ornithine transcarbamylase is missing, so carbamoyl phosphate spills into pyrimidine synthesis and makes orotic acid; the emergency is hyperammonemia, and orotic aciduria the disease also has megaloblastic anemia and no ammonia crisis", "Arginase deficiency, which has a high BUN", "CPS-I deficiency, which also raises orotic acid", "The urea cycle is intact and the ammonia is from liver failure with a high BUN", "Uridine alone treats the X-linked ammonia crisis"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "OTC deficiency", "kind": "vignette"}$s1_136oo$,
  $s1_136no${"options": ["Urea-cycle ornithine transcarbamylase deficiency raises orotic acid with hyperammonemia, not megaloblastic anemia", "Arginase deficiency, which has a high BUN and orotic acid without an ammonia rise", "CPS-I deficiency, which also raises orotic acid and causes megaloblastic anemia", "The urea cycle is intact and the ammonia is from liver failure with a high BUN and no orotic acid", "Uridine treats the X-linked ammonia crisis by restoring urea-cycle flux"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "OTC deficiency", "kind": "vignette"}$s1_136no$,
  $s1_136oc$Ornithine transcarbamylase is missing, so carbamoyl phosphate spills into pyrimidine synthesis and makes orotic acid; the emergency is hyperammonemia, and orotic aciduria the disease also has megaloblastic anemia and no ammonia crisis$s1_136oc$,
  $s1_136nc$Urea-cycle ornithine transcarbamylase deficiency raises orotic acid with hyperammonemia, not megaloblastic anemia$s1_136nc$,
  $s1_136oe$OTC is X-linked. Carbamoyl phosphate cannot enter the urea cycle, ammonia rises, and the excess carbamoyl phosphate makes orotic acid. Hereditary orotic aciduria is a pyrimidine-synthesis defect with megaloblastic anemia and growth failure, and it does not present as a neonatal ammonia crisis; uridine helps that disease, not this one. Arginase deficiency is a later, different urea-cycle picture and does not raise BUN; BUN is low when the cycle is blocked. CPS-I deficiency raises ammonia but not orotic acid, because carbamoyl phosphate itself is not made. This is not intact-cycle liver failure. The treatment of the crisis is ammonia removal, not uridine monotherapy.$s1_136oe$,
  $s1_136ne$OTC is X-linked. Carbamoyl phosphate cannot enter the urea cycle, ammonia rises, and the excess carbamoyl phosphate makes orotic acid. Hereditary orotic aciduria is a pyrimidine-synthesis defect with megaloblastic anemia and growth failure, and it does not present as a neonatal ammonia crisis; uridine helps that disease, not this one. Arginase deficiency is a later, different urea-cycle picture and does not raise BUN; BUN is low when the cycle is blocked. CPS-I deficiency raises ammonia but not orotic acid, because carbamoyl phosphate itself is not made. This is not intact-cycle liver failure. The treatment of the crisis is ammonia removal, not uridine monotherapy.$s1_136ne$,
  234, 78, 113, 97,
  3.000000, 1.164948
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_137id$beb7a8f8-6d2f-4410-9534-1c1f5bf3f0ed$s1_137id$,
  $s1_137st$usmle-step-1$s1_137st$,
  1,
  $s1_137oo${"options": ["The parathyroids were removed or ischemic, so PTH is gone, bone and kidney release less calcium, and the kidney holds phosphate", "Hungry bone keeps PTH high and phosphate low", "Hypocalcemia after neck surgery is from high calcitonin that lasts for months", "A high phosphate means vitamin D toxicity", "Chvostek sign is specific for hypokalemia"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Post-thyroidectomy calcium", "kind": "vignette"}$s1_137oo$,
  $s1_137no${"options": ["The parathyroids were removed or stunned, so absent PTH lets the kidney retain phosphate", "Hungry bone keeps PTH high and drives phosphate into bone, leaving serum phosphate low", "Hypocalcemia after neck surgery is from high calcitonin that lasts for months", "A high phosphate means vitamin D toxicity with suppressed PTH and rising calcium", "Chvostek sign is specific for hypokalemia after a shift of potassium into cells"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Post-thyroidectomy calcium", "kind": "vignette"}$s1_137no$,
  $s1_137oc$The parathyroids were removed or ischemic, so PTH is gone, bone and kidney release less calcium, and the kidney holds phosphate$s1_137oc$,
  $s1_137nc$The parathyroids were removed or stunned, so absent PTH lets the kidney retain phosphate$s1_137nc$,
  $s1_137oe$PTH normally raises calcium and dumps phosphate. Without it, calcium falls, phosphate rises, and neuromuscular irritability appears soon after surgery. Hungry bone after parathyroidectomy for longstanding hyperparathyroidism also drops calcium, but PTH is not low in the same way at the moment of cure if residual glands work, and the classic immediate low PTH is gland injury. Calcitonin is not the lasting cause. Vitamin D toxicity raises calcium. Chvostek sign is facial twitching from low calcium, not potassium.$s1_137oe$,
  $s1_137ne$PTH normally raises calcium and dumps phosphate. Without it, calcium falls, phosphate rises, and neuromuscular irritability appears soon after surgery. Hungry bone after parathyroidectomy for longstanding hyperparathyroidism also drops calcium, but PTH is not low in the same way at the moment of cure if residual glands work, and the classic immediate low PTH is gland injury. Calcitonin is not the lasting cause. Vitamin D toxicity raises calcium. Chvostek sign is facial twitching from low calcium, not potassium.$s1_137ne$,
  127, 77, 88, 86,
  1.649351, 1.023256
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_138id$c172a50a-d60d-4f9b-88bd-830a0d5cd30c$s1_138id$,
  $s1_138st$usmle-step-1$s1_138st$,
  1,
  $s1_138oo${"options": ["C5 through C9 form the membrane attack complex; without it Neisseria recur. CGD is a phagocyte oxidative-burst defect and presents with catalase-positive abscesses and fungal disease, not isolated Neisseria", "C1 inhibitor deficiency causes recurrent meningococcus", "Selective IgA deficiency is the usual cause of recurrent Neisseria sepsis", "A low CH50 with normal vaccine antibodies means he cannot make immunoglobulin", "Terminal complement deficiency blocks pus formation"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Terminal complement and Neisseria", "kind": "vignette"}$s1_138oo$,
  $s1_138no${"options": ["C5-C9 form the membrane attack complex and are missing; CGD is an oxidative-burst defect, not recurrent Neisseria", "C1-inhibitor deficiency causes recurrent meningococcus despite a normal membrane attack complex", "Selective IgA deficiency is the usual cause of recurrent Neisseria sepsis and a low CH50", "A low CH50 with normal vaccine antibodies means he cannot make immunoglobulin", "Terminal complement deficiency blocks pus formation the way an oxidative-burst defect does"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Terminal complement and Neisseria", "kind": "vignette"}$s1_138no$,
  $s1_138oc$C5 through C9 form the membrane attack complex; without it Neisseria recur. CGD is a phagocyte oxidative-burst defect and presents with catalase-positive abscesses and fungal disease, not isolated Neisseria$s1_138oc$,
  $s1_138nc$C5-C9 form the membrane attack complex and are missing; CGD is an oxidative-burst defect, not recurrent Neisseria$s1_138nc$,
  $s1_138oe$The membrane attack complex lyses Neisseria. Recurrent meningococcus with a dead CH50 and intact antibodies points there. Chronic granulomatous disease fails the oxidative burst, so catalase-positive organisms and fungi cause abscesses and granulomas; a nitroblue tetrazolium or dihydrorhodamine test would be abnormal, and isolated Neisseria is the wrong signature. C1 inhibitor deficiency is angioedema. IgA deficiency is mucosal and transfusion reactions, not this bacteremia. He makes antibody, so the low CH50 is complement consumption or a component deficiency, not agammaglobulinemia. Pus formation is a leukocyte problem, as in leukocyte adhesion deficiency, not MAC loss.$s1_138oe$,
  $s1_138ne$The membrane attack complex lyses Neisseria. Recurrent meningococcus with a dead CH50 and intact antibodies points there. Chronic granulomatous disease fails the oxidative burst, so catalase-positive organisms and fungi cause abscesses and granulomas; a nitroblue tetrazolium or dihydrorhodamine test would be abnormal, and isolated Neisseria is the wrong signature. C1 inhibitor deficiency is angioedema. IgA deficiency is mucosal and transfusion reactions, not this bacteremia. He makes antibody, so the low CH50 is complement consumption or a component deficiency, not agammaglobulinemia. Pus formation is a leukocyte problem, as in leukocyte adhesion deficiency, not MAC loss.$s1_138ne$,
  206, 77, 113, 95,
  2.675325, 1.189474
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_139id$c18c3c1a-6dbe-43ff-921a-7d2241f1c437$s1_139id$,
  $s1_139st$usmle-step-1$s1_139st$,
  1,
  $s1_139oo${"options": ["Ethylene glycol makes oxalate crystals and hypocalcemia; methanol makes formic acid and blindness; fomepizole inhibits alcohol dehydrogenase for both", "Methanol causes oxalate crystals; ethylene glycol causes blindness", "Ethanol is the treatment because it speeds formation of the toxic acids", "Fomepizole induces alcohol dehydrogenase so the acids are cleared faster", "An osmolar gap without acidosis means the ingestion is over and no antidote is needed"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Toxic alcohols", "kind": "vignette"}$s1_139oo$,
  $s1_139no${"options": ["Ethylene glycol yields oxalate crystals; methanol yields formic acid and blindness; fomepizole blocks alcohol dehydrogenase for both", "Methanol causes urinary oxalate crystals and hypocalcemia; ethylene glycol causes formic acid and optic blindness", "Ethanol is the treatment because it speeds alcohol dehydrogenase and formation of the toxic acids", "Fomepizole induces alcohol dehydrogenase so both toxic acids are formed and cleared faster", "An osmolar gap without acidosis means the parent alcohols are gone and no antidote is needed"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Toxic alcohols", "kind": "vignette"}$s1_139no$,
  $s1_139oc$Ethylene glycol makes oxalate crystals and hypocalcemia; methanol makes formic acid and blindness; fomepizole inhibits alcohol dehydrogenase for both$s1_139oc$,
  $s1_139nc$Ethylene glycol yields oxalate crystals; methanol yields formic acid and blindness; fomepizole blocks alcohol dehydrogenase for both$s1_139nc$,
  $s1_139oe$Both parent alcohols are osmotically active and not very acidic. Alcohol dehydrogenase makes the toxic acids: oxalic acid from ethylene glycol, which precipitates calcium oxalate and drops calcium, and formic acid from methanol, which injures the optic nerve. Fomepizole blocks that enzyme. Swapping the end-organs is the classic miss. Ethanol can compete for the enzyme but it does not speed safe clearance of the acids; it occupies the enzyme. Fomepizole inhibits, not induces. An early osmolar gap before the gap acidosis is exactly when you block the enzyme, not a reason to watch.$s1_139oe$,
  $s1_139ne$Both parent alcohols are osmotically active and not very acidic. Alcohol dehydrogenase makes the toxic acids: oxalic acid from ethylene glycol, which precipitates calcium oxalate and drops calcium, and formic acid from methanol, which injures the optic nerve. Fomepizole blocks that enzyme. Swapping the end-organs is the classic miss. Ethanol can compete for the enzyme but it does not speed safe clearance of the acids; it occupies the enzyme. Fomepizole inhibits, not induces. An early osmolar gap before the gap acidosis is exactly when you block the enzyme, not a reason to watch.$s1_139ne$,
  149, 85, 132, 113,
  1.752941, 1.168142
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_140id$c2adee7b-0850-4cdc-8a7e-7b22d4739fb9$s1_140id$,
  $s1_140st$usmle-step-1$s1_140st$,
  1,
  $s1_140oo${"options": ["Probenecid blocks proximal reabsorption of urate and can help an under-excretor with a normal kidney and no stones; it is a poor choice when GFR is low or when stones are already forming, where allopurinol lowers production", "Probenecid is safe in uric acid stone formers because it dissolves stones by raising urine urate", "Allopurinol increases uric acid excretion", "A GFR of 20 is the best setting for probenecid", "Under-excretors should receive rasburicase as daily oral therapy"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Gout negative birefringence trap already used", "kind": "vignette"}$s1_140oo$,
  $s1_140no${"options": ["Probenecid helps an under-excretor with normal GFR and no stones; low GFR or existing stones favor allopurinol", "Probenecid is safe in uric acid stone formers because raising urine urate dissolves stones already present", "Allopurinol increases uric acid excretion through the proximal tubule in under-excretors", "A GFR of 20 is the best setting for probenecid because filtered urate is easier to block", "Under-excretors should receive daily oral rasburicase to block proximal urate reabsorption"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Gout negative birefringence trap already used", "kind": "vignette"}$s1_140no$,
  $s1_140oc$Probenecid blocks proximal reabsorption of urate and can help an under-excretor with a normal kidney and no stones; it is a poor choice when GFR is low or when stones are already forming, where allopurinol lowers production$s1_140oc$,
  $s1_140nc$Probenecid helps an under-excretor with normal GFR and no stones; low GFR or existing stones favor allopurinol$s1_140nc$,
  $s1_140oe$Probenecid inhibits URAT1, so less urate is reabsorbed and more appears in the urine. That helps someone who under-excretes, if the kidney works and the urine will not be flooded into new stones. Stones and a low GFR are reasons to use a xanthine oxidase inhibitor instead. Raising urine urate does not treat existing stones; it can make them. Allopurinol decreases production, it does not increase excretion. Probenecid needs a working tubule, so GFR 20 is the wrong patient. Rasburicase is an IV recombinant uricase for tumor lysis, not a daily gout pill.$s1_140oe$,
  $s1_140ne$Probenecid inhibits URAT1, so less urate is reabsorbed and more appears in the urine. That helps someone who under-excretes, if the kidney works and the urine will not be flooded into new stones. Stones and a low GFR are reasons to use a xanthine oxidase inhibitor instead. Raising urine urate does not treat existing stones; it can make them. Allopurinol decreases production, it does not increase excretion. Probenecid needs a working tubule, so GFR 20 is the wrong patient. Rasburicase is an IV recombinant uricase for tumor lysis, not a daily gout pill.$s1_140ne$,
  223, 96, 110, 106,
  2.322917, 1.037736
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_141id$c3210bd5-679d-45e5-8be1-d8060b3261c7$s1_141id$,
  $s1_141st$usmle-step-1$s1_141st$,
  1,
  $s1_141oo${"options": ["IgG against platelet factor 4-heparin activates platelets and causes thrombosis; every heparin must stop, including low-molecular-weight heparin, and platelets are not the treatment", "HIT is a nonimmune platelet clump on day 1 that causes bleeding", "Low-molecular-weight heparin is safe in HIT", "The antibody prolongs bleeding and forbids anticoagulation of any kind", "Platelet transfusion is required before any further anticoagulant"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "HIT", "kind": "vignette"}$s1_141oo$,
  $s1_141no${"options": ["IgG against platelet factor 4-heparin causes thrombosis; low-molecular-weight heparin is also unsafe", "HIT is a nonimmune platelet clump on day 1 that causes bleeding without thrombosis", "Low-molecular-weight heparin is safe in HIT because it does not bind platelet factor 4", "The antibody prolongs bleeding and forbids anticoagulation of any kind, including thrombin inhibitors", "Platelet transfusion is required before any further anticoagulant and will clear the thrombi"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "HIT", "kind": "vignette"}$s1_141no$,
  $s1_141oc$IgG against platelet factor 4-heparin activates platelets and causes thrombosis; every heparin must stop, including low-molecular-weight heparin, and platelets are not the treatment$s1_141oc$,
  $s1_141nc$IgG against platelet factor 4-heparin causes thrombosis; low-molecular-weight heparin is also unsafe$s1_141nc$,
  $s1_141oe$HIT is immune. Antibodies to PF4-heparin complexes activate platelets, the count falls around day 5 to 10, and the clinical problem is thrombosis, not bleeding. All heparin stops. A direct thrombin inhibitor or another non-heparin anticoagulant is used. Low-molecular-weight heparin cross-reacts. This is not the benign early nonimmune drop. You do not withhold all anticoagulation in a clotting patient, and you do not pour platelets into an activating antibody.$s1_141oe$,
  $s1_141ne$HIT is immune. Antibodies to PF4-heparin complexes activate platelets, the count falls around day 5 to 10, and the clinical problem is thrombosis, not bleeding. All heparin stops. A direct thrombin inhibitor or another non-heparin anticoagulant is used. Low-molecular-weight heparin cross-reacts. This is not the benign early nonimmune drop. You do not withhold all anticoagulation in a clotting patient, and you do not pour platelets into an activating antibody.$s1_141ne$,
  181, 70, 100, 101,
  2.585714, 0.990099
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_142id$c53f4c08-7cdd-44b7-817b-4a590cde1b5d$s1_142id$,
  $s1_142st$usmle-step-1$s1_142st$,
  1,
  $s1_142oo${"options": ["Spironolactone blocks the androgen receptor as well as the mineralocorticoid receptor; finasteride inhibits 5-alpha reductase and lowers DHT without blocking the androgen receptor", "Finasteride is an androgen-receptor blocker and spironolactone only blocks 5-alpha reductase", "Both inhibit aromatase, so estrogen falls and breasts shrink", "Gynecomastia from spironolactone means the dose is subtherapeutic", "Finasteride raises DHT, which shrinks the prostate"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Spironolactone versus finasteride", "kind": "vignette"}$s1_142oo$,
  $s1_142no${"options": ["Spironolactone blocks androgen and mineralocorticoid receptors; finasteride inhibits 5-alpha reductase", "Finasteride is an androgen-receptor blocker and spironolactone only blocks 5-alpha reductase in the prostate", "Both inhibit aromatase, so estrogen falls and breast tissue shrinks on either drug", "Gynecomastia from spironolactone means the dose is subtherapeutic and androgen blockade has failed", "Finasteride raises DHT, which shrinks the prostate and spares the androgen receptor"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Spironolactone versus finasteride", "kind": "vignette"}$s1_142no$,
  $s1_142oc$Spironolactone blocks the androgen receptor as well as the mineralocorticoid receptor; finasteride inhibits 5-alpha reductase and lowers DHT without blocking the androgen receptor$s1_142oc$,
  $s1_142nc$Spironolactone blocks androgen and mineralocorticoid receptors; finasteride inhibits 5-alpha reductase$s1_142nc$,
  $s1_142oe$Spironolactone's off-target androgen-receptor block is why men get gynecomastia. Finasteride and dutasteride block conversion of testosterone to the more potent DHT in prostate and hair follicle. Testosterone itself can still bind the androgen receptor, which is a different drug class (flutamide, spironolactone). Swapping the mechanisms swaps the side effects you warn about. They are not aromatase inhibitors; aromatase inhibition would lower estrogen. Breast tenderness is a real effect, not a sign of a tiny dose. Finasteride lowers DHT, which is how the prostate shrinks.$s1_142oe$,
  $s1_142ne$Spironolactone's off-target androgen-receptor block is why men get gynecomastia. Finasteride and dutasteride block conversion of testosterone to the more potent DHT in prostate and hair follicle. Testosterone itself can still bind the androgen receptor, which is a different drug class (flutamide, spironolactone). Swapping the mechanisms swaps the side effects you warn about. They are not aromatase inhibitors; aromatase inhibition would lower estrogen. Breast tenderness is a real effect, not a sign of a tiny dose. Finasteride lowers DHT, which is how the prostate shrinks.$s1_142ne$,
  179, 92, 102, 108,
  1.945652, 0.944444
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_143id$c74c9699-2012-4846-b94a-083871bec441$s1_143id$,
  $s1_143st$usmle-step-1$s1_143st$,
  1,
  $s1_143oo${"options": ["Benzodiazepines increase how often the GABA-A channel opens when GABA is present; barbiturates lengthen each opening and can open the channel at high doses without GABA", "Benzodiazepines lengthen channel opening and work without GABA; barbiturates only increase frequency", "Both drugs block GABA-A, which is why they stop seizures", "Lorazepam acts on GABA-B receptors in the spinal cord, like baclofen", "Status epilepticus is treated first with a neuromuscular blocker because the brain activity has already stopped"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Benzodiazepine versus barbiturate", "kind": "vignette"}$s1_143oo$,
  $s1_143no${"options": ["Benzodiazepines raise GABA-A opening frequency if GABA is present; barbiturates prolong opening and can act without GABA", "Benzodiazepines lengthen channel opening and work without GABA; barbiturates only increase opening frequency", "Both drugs block GABA-A, which is why they stop seizures and sedate at high doses", "Lorazepam acts on GABA-B receptors in the spinal cord, like baclofen, and opens that channel directly", "Status epilepticus is treated first with a neuromuscular blocker because the brain activity has already stopped"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Benzodiazepine versus barbiturate", "kind": "vignette"}$s1_143no$,
  $s1_143oc$Benzodiazepines increase how often the GABA-A channel opens when GABA is present; barbiturates lengthen each opening and can open the channel at high doses without GABA$s1_143oc$,
  $s1_143nc$Benzodiazepines raise GABA-A opening frequency if GABA is present; barbiturates prolong opening and can act without GABA$s1_143nc$,
  $s1_143oe$Both drug classes facilitate GABA-A chloride channels, but the kinetics differ. Benzodiazepines need GABA and increase opening frequency. Barbiturates increase open duration and, at higher concentration, have direct agonist activity, which is one reason overdose is more depressant. Reversing frequency and duration is a standard miss. They do not block GABA; blocking GABA would cause seizures. Lorazepam is not a GABA-B drug; baclofen is. A paralytic stops the visible jerk but not the cortical seizure, so it is not the first treatment of status.$s1_143oe$,
  $s1_143ne$Both drug classes facilitate GABA-A chloride channels, but the kinetics differ. Benzodiazepines need GABA and increase opening frequency. Barbiturates increase open duration and, at higher concentration, have direct agonist activity, which is one reason overdose is more depressant. Reversing frequency and duration is a standard miss. They do not block GABA; blocking GABA would cause seizures. Lorazepam is not a GABA-B drug; baclofen is. A paralytic stops the visible jerk but not the cortical seizure, so it is not the first treatment of status.$s1_143ne$,
  168, 111, 120, 111,
  1.513514, 1.081081
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_144id$c8108868-f4cc-4fe2-8e3c-6d3db07cd839$s1_144id$,
  $s1_144st$usmle-step-1$s1_144st$,
  1,
  $s1_144oo${"options": ["Clomiphene is an estrogen antagonist at the hypothalamus, so GnRH and FSH rise; a failed ovary cannot answer a high FSH", "It is an estrogen agonist, so FSH falls", "It works best when FSH is already menopausal", "It blocks FSH receptors on the follicle", "Ovulation occurs because progesterone rises first and then FSH falls"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Clomiphene", "kind": "vignette"}$s1_144oo$,
  $s1_144no${"options": ["Clomiphene antagonizes hypothalamic estrogen feedback, so FSH rises; a failed ovary cannot respond", "It is an estrogen agonist at the hypothalamus, so GnRH pulse frequency and FSH fall", "It works best when FSH is already menopausal and ovarian reserve is exhausted", "It blocks FSH receptors on the follicle, so a rising FSH cannot recruit a dominant follicle", "Ovulation occurs because progesterone rises first and then FSH falls toward baseline"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Clomiphene", "kind": "vignette"}$s1_144no$,
  $s1_144oc$Clomiphene is an estrogen antagonist at the hypothalamus, so GnRH and FSH rise; a failed ovary cannot answer a high FSH$s1_144oc$,
  $s1_144nc$Clomiphene antagonizes hypothalamic estrogen feedback, so FSH rises; a failed ovary cannot respond$s1_144nc$,
  $s1_144oe$Clomiphene blocks estrogen's negative feedback. The hypothalamus sees a low-estrogen signal, GnRH and then FSH and LH rise, and a responsive ovary ovulates. If the ovary has failed, FSH is already high and more signal cannot recruit follicles. It is not a pituitary estrogen agonist. Menopausal FSH means there is nothing to stimulate. It does not block the ovarian FSH receptor. The sequence is gonadotropin then ovulation then progesterone, not progesterone first.$s1_144oe$,
  $s1_144ne$Clomiphene blocks estrogen's negative feedback. The hypothalamus sees a low-estrogen signal, GnRH and then FSH and LH rise, and a responsive ovary ovulates. If the ovary has failed, FSH is already high and more signal cannot recruit follicles. It is not a pituitary estrogen agonist. Menopausal FSH means there is nothing to stimulate. It does not block the ovarian FSH receptor. The sequence is gonadotropin then ovulation then progesterone, not progesterone first.$s1_144ne$,
  119, 68, 98, 91,
  1.750000, 1.076923
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_145id$cab295b7-d78f-4efb-b014-e1ade44f44f2$s1_145id$,
  $s1_145st$usmle-step-1$s1_145st$,
  1,
  $s1_145oo${"options": ["Antibodies to peripheral myelin after Campylobacter molecular mimicry; respiratory muscle failure can come before the protein finding and is the emergency", "Anterior horn cells are invaded by polio virus, so protein is high and cells are absent", "A central demyelinating plaque in the cervical cord, so reflexes should be brisk", "The high protein with no cells means bacterial meningitis, and weakness is incidental", "Botulinum toxin is causing an ascending sensory neuropathy"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Guillain-Barre", "kind": "vignette"}$s1_145oo$,
  $s1_145no${"options": ["Antibodies to peripheral myelin after Campylobacter mimicry; respiratory failure is the bedside emergency", "Anterior horn cells are invaded by poliovirus, so protein is high and white cells are absent", "A central demyelinating plaque in the cervical cord, so reflexes should be brisk and the toes upgoing", "The high protein with no cells means bacterial meningitis, and the weakness is incidental", "Botulinum toxin is causing an ascending sensory neuropathy with areflexia and high CSF protein"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Guillain-Barre", "kind": "vignette"}$s1_145no$,
  $s1_145oc$Antibodies to peripheral myelin after Campylobacter molecular mimicry; respiratory muscle failure can come before the protein finding and is the emergency$s1_145oc$,
  $s1_145nc$Antibodies to peripheral myelin after Campylobacter mimicry; respiratory failure is the bedside emergency$s1_145nc$,
  $s1_145oe$Campylobacter jejuni lipooligosaccharide resembles peripheral-nerve gangliosides. Antibodies strip myelin, conduction fails, and weakness ascends with lost reflexes. The spinal fluid shows high protein from root inflammation and almost no cells. The dangerous part is diaphragmatic failure, which you follow with vital capacity, not the lab. Polio kills anterior horn cells and the fluid is inflammatory, not albumino-cytologic. A cord plaque would raise reflexes below the lesion. Bacterial meningitis is a high cell count with low glucose. Botulism is descending, pupillary, and has no sensory loss and a normal spinal fluid.$s1_145oe$,
  $s1_145ne$Campylobacter jejuni lipooligosaccharide resembles peripheral-nerve gangliosides. Antibodies strip myelin, conduction fails, and weakness ascends with lost reflexes. The spinal fluid shows high protein from root inflammation and almost no cells. The dangerous part is diaphragmatic failure, which you follow with vital capacity, not the lab. Polio kills anterior horn cells and the fluid is inflammatory, not albumino-cytologic. A cord plaque would raise reflexes below the lesion. Bacterial meningitis is a high cell count with low glucose. Botulism is descending, pupillary, and has no sensory loss and a normal spinal fluid.$s1_145ne$,
  154, 87, 105, 101,
  1.770115, 1.039604
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_146id$cb1000e9-5d3d-4935-8676-17d0799650c8$s1_146id$,
  $s1_146st$usmle-step-1$s1_146st$,
  1,
  $s1_146oo${"options": ["Iron is oxidized to Fe3+ and cannot bind oxygen; methylene blue reduces it back via NADPH-methemoglobin reductase", "This is carbon monoxide, treated with methylene blue", "Cyanide turns blood chocolate and is treated with oxygen alone", "Methylene blue is contraindicated and the treatment is pralidoxime", "A normal PaO2 rules out any hemoglobin problem"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Methemoglobinemia", "kind": "vignette"}$s1_146oo$,
  $s1_146no${"options": ["Iron is oxidized to Fe3+ and cannot bind oxygen; methylene blue reduces methemoglobin", "This is carbon monoxide bound to heme, and the antidote is methylene blue", "Cyanide turns the blood chocolate and is treated with oxygen until the color clears", "Methylene blue is contraindicated and the treatment is pralidoxime", "A normal PaO2 rules out a hemoglobin pigment that cannot carry oxygen"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Methemoglobinemia", "kind": "vignette"}$s1_146no$,
  $s1_146oc$Iron is oxidized to Fe3+ and cannot bind oxygen; methylene blue reduces it back via NADPH-methemoglobin reductase$s1_146oc$,
  $s1_146nc$Iron is oxidized to Fe3+ and cannot bind oxygen; methylene blue reduces methemoglobin$s1_146nc$,
  $s1_146oe$Methemoglobin is ferric heme. It does not carry oxygen and shifts the curve, so the patient is cyanotic with chocolate blood while dissolved PaO2 is normal. Methylene blue is the electron donor that lets the cell reduce the iron. Carbon monoxide is cherry-red, not chocolate, and is treated with oxygen, not methylene blue. Cyanide does not make chocolate blood and is not fixed by oxygen alone. Pralidoxime is for organophosphates. A normal PaO2 only says dissolved oxygen is fine; it says nothing about hemoglobin that cannot carry it.$s1_146oe$,
  $s1_146ne$Methemoglobin is ferric heme. It does not carry oxygen and shifts the curve, so the patient is cyanotic with chocolate blood while dissolved PaO2 is normal. Methylene blue is the electron donor that lets the cell reduce the iron. Carbon monoxide is cherry-red, not chocolate, and is treated with oxygen, not methylene blue. Cyanide does not make chocolate blood and is not fixed by oxygen alone. Pralidoxime is for organophosphates. A normal PaO2 only says dissolved oxygen is fine; it says nothing about hemoglobin that cannot carry it.$s1_146ne$,
  113, 66, 85, 83,
  1.712121, 1.024096
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_147id$cf8529d2-d279-452e-88f9-5d06531031c4$s1_147id$,
  $s1_147st$usmle-step-1$s1_147st$,
  1,
  $s1_147oo${"options": ["Intramuscular epinephrine for IgE-mediated anaphylaxis; the friend has a vasovagal reflex with bradycardia and no allergic findings, so epinephrine is not his treatment", "Diphenhydramine first, because histamine block reverses shock", "A glucocorticoid first, because it acts in minutes on the airway", "Epinephrine for both, because any loss of consciousness is anaphylaxis", "Atropine for the teenager because anaphylaxis causes bradycardia as the first sign"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Anaphylaxis versus vaso-vagal", "kind": "vignette"}$s1_147oo$,
  $s1_147no${"options": ["Intramuscular epinephrine for anaphylaxis; the friend is vasovagal, with bradycardia and no allergic findings", "Diphenhydramine first, because histamine blockade reverses distributive shock within minutes", "A glucocorticoid first, because it acts in minutes on airway edema and restores pressure", "Epinephrine for both, because any loss of consciousness is anaphylaxis until a rash is found", "Atropine for the teenager, because anaphylaxis causes bradycardia as its first sign"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Anaphylaxis versus vaso-vagal", "kind": "vignette"}$s1_147no$,
  $s1_147oc$Intramuscular epinephrine for IgE-mediated anaphylaxis; the friend has a vasovagal reflex with bradycardia and no allergic findings, so epinephrine is not his treatment$s1_147oc$,
  $s1_147nc$Intramuscular epinephrine for anaphylaxis; the friend is vasovagal, with bradycardia and no allergic findings$s1_147nc$,
  $s1_147oe$Anaphylaxis is IgE-triggered mast-cell release with airway and shock. Intramuscular epinephrine is first because it supports pressure and opens the airway; antihistamines and steroids are adjuncts and do not treat the shock. A vasovagal faint is bradycardia and pallor without urticaria or wheeze and resolves when supine. Diphenhydramine does not restore circulation. Steroids act over hours, not minutes. Epinephrine for a simple faint is the wrong drug and the wrong diagnosis. Anaphylactic shock is typically tachycardic, not a primary atropine problem.$s1_147oe$,
  $s1_147ne$Anaphylaxis is IgE-triggered mast-cell release with airway and shock. Intramuscular epinephrine is first because it supports pressure and opens the airway; antihistamines and steroids are adjuncts and do not treat the shock. A vasovagal faint is bradycardia and pallor without urticaria or wheeze and resolves when supine. Diphenhydramine does not restore circulation. Steroids act over hours, not minutes. Epinephrine for a simple faint is the wrong drug and the wrong diagnosis. Anaphylactic shock is typically tachycardic, not a primary atropine problem.$s1_147ne$,
  168, 82, 109, 92,
  2.048780, 1.184783
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_148id$cmpnjguts001b1ymxe7pjj11x$s1_148id$,
  $s1_148st$usmle-step-1$s1_148st$,
  1,
  $s1_148oo${"options":["Glomerular immune complex deposition as the cause of muddy brown casts","ADH excess causing dilutional hyponatremia without azotemia","Chronic glomerulosclerosis pattern on acute presentation only","Ischemic or nephrotoxic injury to renal tubules → impaired reabsorption and concentration → rising creatinine with muddy brown casts"],"distractorRationale":{"Glomerular immune complex deposition as the cause of muddy brown casts":"This fails here because immune complex deposition typically presents with hematuria and proteinuria, not muddy brown casts, which are specific to ATN. (Remember that ATN is characterized by muddy brown casts, while immune complex-mediated injury leads to different urinary findings.)","ADH excess causing dilutional hyponatremia without azotemia":"This option fails because the primary issue is acute kidney injury, evidenced by rising creatinine and muddy brown casts, rather than dilutional hyponatremia. (Dilutional hyponatremia would not explain the significant azotemia (elevated BUN and creatinine) seen in this patient.)","Chronic glomerulosclerosis pattern on acute presentation only":"This fails because chronic glomerulosclerosis would not cause such a rapid rise in creatinine or the presence of muddy brown casts, which are indicative of acute tubular injury. (Acute tubular necrosis presents acutely with specific findings like muddy brown casts, unlike chronic conditions.)"},"clinicalReasoning":"Ischemic or nephrotoxic injury to renal tubules → impaired reabsorption and concentration → rising creatinine with muddy brown casts Acute tubular necrosis (ATN) is often due to ischemia or nephrotoxicity, leading to renal tubular cell death. Muddy brown casts are a hallmark of ATN, indicating sloughed renal tubular epithelial cells.","keyTakeaways":["Acute tubular necrosis is a critical diagnosis in acute kidney injury, especially in the context of nephrotoxic agents and ischemic events."],"blueprintTopic":"gram-positive-organisms","blueprintSystem":"blood-lymph-immune","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T08:01:58.368Z","rationaleQualityScore":100}}$s1_148oo$,
  $s1_148no${"options":["Glomerular immune-complex deposition as the cause of muddy brown casts and a high fractional excretion of sodium","ADH excess causing dilutional hyponatremia without azotemia or granular casts","Chronic glomerulosclerosis pattern on acute presentation only, with bland urine","Ischemic or toxic tubular injury with failed reabsorption, rising creatinine, and muddy brown casts"],"distractorRationale":{"Glomerular immune-complex deposition as the cause of muddy brown casts and a high fractional excretion of sodium":"This fails here because immune complex deposition typically presents with hematuria and proteinuria, not muddy brown casts, which are specific to ATN. (Remember that ATN is characterized by muddy brown casts, while immune complex-mediated injury leads to different urinary findings.)","ADH excess causing dilutional hyponatremia without azotemia or granular casts":"This option fails because the primary issue is acute kidney injury, evidenced by rising creatinine and muddy brown casts, rather than dilutional hyponatremia. (Dilutional hyponatremia would not explain the significant azotemia (elevated BUN and creatinine) seen in this patient.)","Chronic glomerulosclerosis pattern on acute presentation only, with bland urine":"This fails because chronic glomerulosclerosis would not cause such a rapid rise in creatinine or the presence of muddy brown casts, which are indicative of acute tubular injury. (Acute tubular necrosis presents acutely with specific findings like muddy brown casts, unlike chronic conditions.)"},"clinicalReasoning":"Ischemic or toxic tubular injury with failed reabsorption, rising creatinine, and muddy brown casts Acute tubular necrosis (ATN) is often due to ischemia or nephrotoxicity, leading to renal tubular cell death. Muddy brown casts are a hallmark of ATN, indicating sloughed renal tubular epithelial cells.","keyTakeaways":["Acute tubular necrosis is a critical diagnosis in acute kidney injury, especially in the context of nephrotoxic agents and ischemic events."],"blueprintTopic":"gram-positive-organisms","blueprintSystem":"blood-lymph-immune","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T08:01:58.368Z","rationaleQualityScore":100}}$s1_148no$,
  $s1_148oc$Ischemic or nephrotoxic injury to renal tubules → impaired reabsorption and concentration → rising creatinine with muddy brown casts$s1_148oc$,
  $s1_148nc$Ischemic or toxic tubular injury with failed reabsorption, rising creatinine, and muddy brown casts$s1_148nc$,
  $s1_148oe$## Why this answer is correct
Ischemic or nephrotoxic injury to renal tubules → impaired reabsorption and concentration → rising creatinine with muddy brown casts
• Acute tubular necrosis (ATN) is often due to ischemia or nephrotoxicity, leading to renal tubular cell death.
• Muddy brown casts are a hallmark of ATN, indicating sloughed renal tubular epithelial cells.
• Elevated creatinine and BUN levels reflect impaired glomerular filtration rate (GFR) due to tubular injury.
**In practice:** In this 71-year-old man, the acute rise in creatinine from a baseline of 1.0 mg/dL to 3.8 mg/dL, along with muddy brown casts in the urinalysis, strongly indicates ATN, likely precipitated by his NSAID use and resultant renal ischemia.
## Clinical pearl
In this 71-year-old man, the acute rise in creatinine from a baseline of 1.0 mg/dL to 3.8 mg/dL, along with muddy brown casts in the urinalysis, strongly indicates ATN, likely precipitated by his NSAID use and resultant renal ischemia.
## Why the other options are wrong

**Glomerular immune complex deposition as the cause of muddy brown casts**
• Trap: Confusing immune complex deposition with acute tubular necrosis.
• Why it fails here: This fails here because immune complex deposition typically presents with hematuria and proteinuria, not muddy brown casts, which are specific to ATN.
• Remember: Remember that ATN is characterized by muddy brown casts, while immune complex-mediated injury leads to different urinary findings.

**ADH excess causing dilutional hyponatremia without azotemia**
• Trap: Misinterpreting confusion and fluid status as solely related to ADH excess.
• Why it fails here: This option fails because the primary issue is acute kidney injury, evidenced by rising creatinine and muddy brown casts, rather than dilutional hyponatremia.
• Remember: Dilutional hyponatremia would not explain the significant azotemia (elevated BUN and creatinine) seen in this patient.

**Chronic glomerulosclerosis pattern on acute presentation only**
• Trap: Confusing chronic kidney disease with acute kidney injury.
• Why it fails here: This fails because chronic glomerulosclerosis would not cause such a rapid rise in creatinine or the presence of muddy brown casts, which are indicative of acute tubular injury.
• Remember: Acute tubular necrosis presents acutely with specific findings like muddy brown casts, unlike chronic conditions.
## Key takeaway
**Acute tubular necrosis is a critical diagnosis in acute kidney injury, especially in the context of nephrotoxic agents and ischemic events.**

**Memory hook:** Remember: Muddy brown casts = ATN; think of them as the 'mud' of renal injury.

## Educational objective

Ischemic or nephrotoxic injury to renal tubules → impaired reabsorption and concentration → rising creatinine with muddy brown casts

## Clinical reasoning pathway

1. The patient presents with decreased urine output and confusion, suggesting acute kidney injury.
2. His vital signs indicate hypotension (BP 88/54 mmHg) and tachycardia (HR 104), which can lead to renal ischemia.
3. Laboratory findings show a significant rise in creatinine from baseline, consistent with acute kidney injury.
4. The urinalysis reveals muddy brown casts, which are characteristic of acute tubular necrosis.
5. The fractional excretion of sodium (FENa) of 2.1% supports the diagnosis of ATN, indicating impaired tubular reabsorption.

## Clinical pearl

In patients with acute kidney injury, especially those with risk factors like NSAID use, always consider acute tubular necrosis as a potential diagnosis when muddy brown casts are present.

## High-yield facts

• Acute tubular necrosis (ATN) is the most common cause of acute kidney injury in hospitalized patients.
• Muddy brown casts are pathognomonic for ATN and indicate renal tubular damage.
• Risk factors for ATN include nephrotoxic agents (like NSAIDs) and ischemic events (like hypotension).

## Common pitfalls

• Students often confuse ATN with glomerulonephritis due to overlapping symptoms.
• Misinterpretation of urine findings, such as muddy brown casts, can lead to incorrect diagnoses.
• Overlooking the significance of elevated BUN and creatinine in the context of urine output changes.

## Next step in care

Monitor renal function closely and consider fluid resuscitation and adjustment of nephrotoxic medications.

## Test-taking tip

Look for key clinical indicators such as urine output changes and specific lab findings (like muddy brown casts) that point towards acute tubular necrosis.

## Real-world clinical application

On the wards, be vigilant for signs of acute kidney injury in patients on nephrotoxic medications, especially in the elderly or those with volume depletion.

## Layered depth

**Basic:** Acute tubular necrosis is a common cause of acute kidney injury characterized by specific urine findings.

**Intermediate:** ATN can result from ischemia or nephrotoxicity, leading to renal tubular cell death and impaired function.

**Advanced:** In cases of ATN, management may include avoiding nephrotoxic agents, optimizing fluid status, and monitoring for complications like electrolyte imbalances.

## Visual cues

• **Muddy Brown Casts:** Visual representation of muddy brown casts under a microscope, indicating renal tubular damage.

## Related topics

• **Step1 — Acute Kidney Injury:** Understanding the pathophysiology of ATN is crucial for both Step 1 and clinical practice.$s1_148oe$,
  $s1_148ne$## Why this answer is correct
Ischemic or toxic tubular injury with failed reabsorption, rising creatinine, and muddy brown casts
• Acute tubular necrosis (ATN) is often due to ischemia or nephrotoxicity, leading to renal tubular cell death.
• Muddy brown casts are a hallmark of ATN, indicating sloughed renal tubular epithelial cells.
• Elevated creatinine and BUN levels reflect impaired glomerular filtration rate (GFR) due to tubular injury.
**In practice:** In this 71-year-old man, the acute rise in creatinine from a baseline of 1.0 mg/dL to 3.8 mg/dL, along with muddy brown casts in the urinalysis, strongly indicates ATN, likely precipitated by his NSAID use and resultant renal ischemia.
## Clinical pearl
In this 71-year-old man, the acute rise in creatinine from a baseline of 1.0 mg/dL to 3.8 mg/dL, along with muddy brown casts in the urinalysis, strongly indicates ATN, likely precipitated by his NSAID use and resultant renal ischemia.
## Why the other options are wrong

**Glomerular immune-complex deposition as the cause of muddy brown casts and a high fractional excretion of sodium**
• Trap: Confusing immune complex deposition with acute tubular necrosis.
• Why it fails here: This fails here because immune complex deposition typically presents with hematuria and proteinuria, not muddy brown casts, which are specific to ATN.
• Remember: Remember that ATN is characterized by muddy brown casts, while immune complex-mediated injury leads to different urinary findings.

**ADH excess causing dilutional hyponatremia without azotemia or granular casts**
• Trap: Misinterpreting confusion and fluid status as solely related to ADH excess.
• Why it fails here: This option fails because the primary issue is acute kidney injury, evidenced by rising creatinine and muddy brown casts, rather than dilutional hyponatremia.
• Remember: Dilutional hyponatremia would not explain the significant azotemia (elevated BUN and creatinine) seen in this patient.

**Chronic glomerulosclerosis pattern on acute presentation only, with bland urine**
• Trap: Confusing chronic kidney disease with acute kidney injury.
• Why it fails here: This fails because chronic glomerulosclerosis would not cause such a rapid rise in creatinine or the presence of muddy brown casts, which are indicative of acute tubular injury.
• Remember: Acute tubular necrosis presents acutely with specific findings like muddy brown casts, unlike chronic conditions.
## Key takeaway
**Acute tubular necrosis is a critical diagnosis in acute kidney injury, especially in the context of nephrotoxic agents and ischemic events.**

**Memory hook:** Remember: Muddy brown casts = ATN; think of them as the 'mud' of renal injury.

## Educational objective

Ischemic or toxic tubular injury with failed reabsorption, rising creatinine, and muddy brown casts

## Clinical reasoning pathway

1. The patient presents with decreased urine output and confusion, suggesting acute kidney injury.
2. His vital signs indicate hypotension (BP 88/54 mmHg) and tachycardia (HR 104), which can lead to renal ischemia.
3. Laboratory findings show a significant rise in creatinine from baseline, consistent with acute kidney injury.
4. The urinalysis reveals muddy brown casts, which are characteristic of acute tubular necrosis.
5. The fractional excretion of sodium (FENa) of 2.1% supports the diagnosis of ATN, indicating impaired tubular reabsorption.

## Clinical pearl

In patients with acute kidney injury, especially those with risk factors like NSAID use, always consider acute tubular necrosis as a potential diagnosis when muddy brown casts are present.

## High-yield facts

• Acute tubular necrosis (ATN) is the most common cause of acute kidney injury in hospitalized patients.
• Muddy brown casts are pathognomonic for ATN and indicate renal tubular damage.
• Risk factors for ATN include nephrotoxic agents (like NSAIDs) and ischemic events (like hypotension).

## Common pitfalls

• Students often confuse ATN with glomerulonephritis due to overlapping symptoms.
• Misinterpretation of urine findings, such as muddy brown casts, can lead to incorrect diagnoses.
• Overlooking the significance of elevated BUN and creatinine in the context of urine output changes.

## Next step in care

Monitor renal function closely and consider fluid resuscitation and adjustment of nephrotoxic medications.

## Test-taking tip

Look for key clinical indicators such as urine output changes and specific lab findings (like muddy brown casts) that point towards acute tubular necrosis.

## Real-world clinical application

On the wards, be vigilant for signs of acute kidney injury in patients on nephrotoxic medications, especially in the elderly or those with volume depletion.

## Layered depth

**Basic:** Acute tubular necrosis is a common cause of acute kidney injury characterized by specific urine findings.

**Intermediate:** ATN can result from ischemia or nephrotoxicity, leading to renal tubular cell death and impaired function.

**Advanced:** In cases of ATN, management may include avoiding nephrotoxic agents, optimizing fluid status, and monitoring for complications like electrolyte imbalances.

## Visual cues

• **Muddy Brown Casts:** Visual representation of muddy brown casts under a microscope, indicating renal tubular damage.

## Related topics

• **Step1 — Acute Kidney Injury:** Understanding the pathophysiology of ATN is crucial for both Step 1 and clinical practice.$s1_148ne$,
  132, 70, 99, 112,
  1.885714, 0.883929
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_149id$cmpnjgvbh001h1ymxexc9z235$s1_149id$,
  $s1_149st$usmle-step-1$s1_149st$,
  1,
  $s1_149oo${"options":["Absolute insulin deficiency → unrestrained lipolysis and hepatic ketogenesis → anion-gap metabolic acidosis and osmotic diuresis","Hyperchloremic non-anion-gap acidosis from RTA as the primary process","Respiratory alkalosis from primary lung disease","Excess ADH causing euvolemic hyponatremia without hyperglycemia"],"distractorRationale":{"Hyperchloremic non-anion-gap acidosis from RTA as the primary process":"RTA does not present with the significant hyperglycemia (486 mg/dL) and ketonuria (4+) seen in this patient, which are characteristic of DKA. (RTA typically results in a normal anion gap metabolic acidosis, unlike the elevated anion gap seen in DKA.)","Respiratory alkalosis from primary lung disease":"Kussmaul respirations are a compensatory response to metabolic acidosis, not a primary lung disease process. (Recognizing Kussmaul respirations as a sign of metabolic acidosis is crucial for accurate diagnosis.)","Excess ADH causing euvolemic hyponatremia without hyperglycemia":"The presence of significant hyperglycemia and ketonuria is inconsistent with euvolemic hyponatremia, which would not explain the patient's metabolic derangements. (Understanding the role of hyperglycemia and ketones in DKA is essential for distinguishing it from other causes of dehydration.)"},"clinicalReasoning":"Diabetic ketoacidosis due to absolute insulin deficiency Absolute insulin deficiency leads to increased lipolysis and hepatic ketogenesis. This results in elevated ketone bodies causing anion-gap metabolic acidosis.","keyTakeaways":["Timely recognition and management of DKA can significantly improve patient outcomes and prevent severe complications."],"blueprintTopic":"metabolic-pathways","blueprintSystem":"biostats-epi","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T08:02:34.285Z","rationaleQualityScore":100}}$s1_149oo$,
  $s1_149no${"options":["Absolute insulin deficiency with lipolysis, hepatic ketogenesis, anion-gap acidosis, and osmotic diuresis","Hyperchloremic non-anion-gap acidosis from renal tubular acidosis as the primary process","Respiratory alkalosis from primary lung disease with a compensatory fall in bicarbonate","Excess ADH causing euvolemic hyponatremia without hyperglycemia or ketones"],"distractorRationale":{"Hyperchloremic non-anion-gap acidosis from renal tubular acidosis as the primary process":"RTA does not present with the significant hyperglycemia (486 mg/dL) and ketonuria (4+) seen in this patient, which are characteristic of DKA. (RTA typically results in a normal anion gap metabolic acidosis, unlike the elevated anion gap seen in DKA.)","Respiratory alkalosis from primary lung disease with a compensatory fall in bicarbonate":"Kussmaul respirations are a compensatory response to metabolic acidosis, not a primary lung disease process. (Recognizing Kussmaul respirations as a sign of metabolic acidosis is crucial for accurate diagnosis.)","Excess ADH causing euvolemic hyponatremia without hyperglycemia or ketones":"The presence of significant hyperglycemia and ketonuria is inconsistent with euvolemic hyponatremia, which would not explain the patient's metabolic derangements. (Understanding the role of hyperglycemia and ketones in DKA is essential for distinguishing it from other causes of dehydration.)"},"clinicalReasoning":"Diabetic ketoacidosis due to absolute insulin deficiency Absolute insulin deficiency leads to increased lipolysis and hepatic ketogenesis. This results in elevated ketone bodies causing anion-gap metabolic acidosis.","keyTakeaways":["Timely recognition and management of DKA can significantly improve patient outcomes and prevent severe complications."],"blueprintTopic":"metabolic-pathways","blueprintSystem":"biostats-epi","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T08:02:34.285Z","rationaleQualityScore":100}}$s1_149no$,
  $s1_149oc$Absolute insulin deficiency → unrestrained lipolysis and hepatic ketogenesis → anion-gap metabolic acidosis and osmotic diuresis$s1_149oc$,
  $s1_149nc$Absolute insulin deficiency with lipolysis, hepatic ketogenesis, anion-gap acidosis, and osmotic diuresis$s1_149nc$,
  $s1_149oe$## Why this answer is correct
Diabetic ketoacidosis due to absolute insulin deficiency
• Absolute insulin deficiency leads to increased lipolysis and hepatic ketogenesis.
• This results in elevated ketone bodies causing anion-gap metabolic acidosis.
• High blood glucose levels cause osmotic diuresis, leading to polyuria and dehydration.
**In practice:** The patient's history of Type 1 diabetes and recent missed insulin doses, combined with his symptoms of polyuria, polydipsia, and laboratory findings of hyperglycemia and metabolic acidosis, clearly indicate diabetic ketoacidosis (DKA).
## Clinical pearl
The patient's history of Type 1 diabetes and recent missed insulin doses, combined with his symptoms of polyuria, polydipsia, and laboratory findings of hyperglycemia and metabolic acidosis, clearly indicate diabetic ketoacidosis (DKA).
## Why the other options are wrong

**Hyperchloremic non-anion-gap acidosis from RTA as the primary process**
• Trap: Confusing renal tubular acidosis (RTA) with DKA due to overlapping symptoms.
• Why it fails here: RTA does not present with the significant hyperglycemia (486 mg/dL) and ketonuria (4+) seen in this patient, which are characteristic of DKA.
• Remember: RTA typically results in a normal anion gap metabolic acidosis, unlike the elevated anion gap seen in DKA.

**Respiratory alkalosis from primary lung disease**
• Trap: Misinterpreting Kussmaul respirations as indicative of respiratory alkalosis.
• Why it fails here: Kussmaul respirations are a compensatory response to metabolic acidosis, not a primary lung disease process.
• Remember: Recognizing Kussmaul respirations as a sign of metabolic acidosis is crucial for accurate diagnosis.

**Excess ADH causing euvolemic hyponatremia without hyperglycemia**
• Trap: Assuming that excess ADH is responsible for the patient's symptoms due to dehydration.
• Why it fails here: The presence of significant hyperglycemia and ketonuria is inconsistent with euvolemic hyponatremia, which would not explain the patient's metabolic derangements.
• Remember: Understanding the role of hyperglycemia and ketones in DKA is essential for distinguishing it from other causes of dehydration.
## Key takeaway
**Timely recognition and management of DKA can significantly improve patient outcomes and prevent severe complications.**

**Memory hook:** Remember the classic triad of DKA: hyperglycemia, metabolic acidosis, and ketonuria.

## Educational objective

Diabetic ketoacidosis due to absolute insulin deficiency

## Clinical reasoning pathway

1. The patient is a 26-year-old man with Type 1 diabetes who ran out of insulin, leading to absolute insulin deficiency.
2. This deficiency causes unrestrained lipolysis, resulting in the production of free fatty acids and subsequent ketogenesis in the liver.
3. The accumulation of ketone bodies leads to metabolic acidosis, evidenced by the low pH (7.18) and low bicarbonate (10 mEq/L) levels.
4. The high blood glucose level (486 mg/dL) causes osmotic diuresis, resulting in polyuria and dehydration, which is reflected in the dry mucous membranes.
5. Kussmaul respirations are present as a compensatory mechanism to counteract the metabolic acidosis.
6. The elevated anion gap (22) confirms the presence of metabolic acidosis due to the accumulation of ketoacids.

## Clinical pearl

In cases of DKA, early recognition and treatment with insulin and fluid resuscitation are critical to prevent complications such as cerebral edema and cardiovascular collapse.

## High-yield facts

• Diabetic ketoacidosis (DKA) is characterized by hyperglycemia, metabolic acidosis, and ketonuria.
• Kussmaul respirations are a compensatory mechanism for metabolic acidosis, indicating severe acidosis.
• Anion gap metabolic acidosis is defined as an anion gap greater than 12 mEq/L, often seen in DKA.

## Common pitfalls

• Students may confuse DKA with other forms of metabolic acidosis due to overlapping symptoms.
• Misinterpretation of Kussmaul respirations as a sign of respiratory disease rather than metabolic compensation.
• Overlooking the significance of hyperglycemia and ketonuria in diagnosing DKA.

## Next step in care

Initiate intravenous fluids and insulin therapy to correct hyperglycemia and metabolic acidosis while monitoring electrolytes closely.

## Test-taking tip

Look for key clinical features such as Kussmaul respirations and fruity breath odor, which are classic signs of DKA in exam questions.

## Real-world clinical application

On the wards, be vigilant for signs of DKA in patients with Type 1 diabetes who report missed insulin doses, as timely intervention is crucial.

## Layered depth

**Basic:** DKA is a life-threatening complication of diabetes characterized by hyperglycemia and metabolic acidosis.

**Intermediate:** The pathophysiology involves insulin deficiency leading to increased lipolysis and ketogenesis, resulting in metabolic derangements.

**Advanced:** In severe cases, DKA can lead to complications such as cerebral edema, myocardial infarction, and acute kidney injury if not promptly treated.

## Visual cues

• **Ketoacidosis Pathway:** A flowchart illustrating the metabolic pathway from insulin deficiency to increased lipolysis, ketogenesis, and resultant metabolic acidosis.

## Related topics

• **Step1 — Diabetes Mellitus:** Understanding DKA is crucial for managing diabetic patients.
• **Step2CK — Metabolic Acidosis:** Recognizing the signs and symptoms of DKA is essential for effective treatment.

ADA 2024 Standards of Care: treat marked hyperglycemia with ketoacidosis or a hyperosmolar state with intravenous insulin after fluids are started.$s1_149oe$,
  $s1_149ne$## Why this answer is correct
Diabetic ketoacidosis due to absolute insulin deficiency
• Absolute insulin deficiency leads to increased lipolysis and hepatic ketogenesis.
• This results in elevated ketone bodies causing anion-gap metabolic acidosis.
• High blood glucose levels cause osmotic diuresis, leading to polyuria and dehydration.
**In practice:** The patient's history of Type 1 diabetes and recent missed insulin doses, combined with his symptoms of polyuria, polydipsia, and laboratory findings of hyperglycemia and metabolic acidosis, clearly indicate diabetic ketoacidosis (DKA).
## Clinical pearl
The patient's history of Type 1 diabetes and recent missed insulin doses, combined with his symptoms of polyuria, polydipsia, and laboratory findings of hyperglycemia and metabolic acidosis, clearly indicate diabetic ketoacidosis (DKA).
## Why the other options are wrong

**Hyperchloremic non-anion-gap acidosis from renal tubular acidosis as the primary process**
• Trap: Confusing renal tubular acidosis (RTA) with DKA due to overlapping symptoms.
• Why it fails here: RTA does not present with the significant hyperglycemia (486 mg/dL) and ketonuria (4+) seen in this patient, which are characteristic of DKA.
• Remember: RTA typically results in a normal anion gap metabolic acidosis, unlike the elevated anion gap seen in DKA.

**Respiratory alkalosis from primary lung disease with a compensatory fall in bicarbonate**
• Trap: Misinterpreting Kussmaul respirations as indicative of respiratory alkalosis.
• Why it fails here: Kussmaul respirations are a compensatory response to metabolic acidosis, not a primary lung disease process.
• Remember: Recognizing Kussmaul respirations as a sign of metabolic acidosis is crucial for accurate diagnosis.

**Excess ADH causing euvolemic hyponatremia without hyperglycemia or ketones**
• Trap: Assuming that excess ADH is responsible for the patient's symptoms due to dehydration.
• Why it fails here: The presence of significant hyperglycemia and ketonuria is inconsistent with euvolemic hyponatremia, which would not explain the patient's metabolic derangements.
• Remember: Understanding the role of hyperglycemia and ketones in DKA is essential for distinguishing it from other causes of dehydration.
## Key takeaway
**Timely recognition and management of DKA can significantly improve patient outcomes and prevent severe complications.**

**Memory hook:** Remember the classic triad of DKA: hyperglycemia, metabolic acidosis, and ketonuria.

## Educational objective

Diabetic ketoacidosis due to absolute insulin deficiency

## Clinical reasoning pathway

1. The patient is a 26-year-old man with Type 1 diabetes who ran out of insulin, leading to absolute insulin deficiency.
2. This deficiency causes unrestrained lipolysis, resulting in the production of free fatty acids and subsequent ketogenesis in the liver.
3. The accumulation of ketone bodies leads to metabolic acidosis, evidenced by the low pH (7.18) and low bicarbonate (10 mEq/L) levels.
4. The high blood glucose level (486 mg/dL) causes osmotic diuresis, resulting in polyuria and dehydration, which is reflected in the dry mucous membranes.
5. Kussmaul respirations are present as a compensatory mechanism to counteract the metabolic acidosis.
6. The elevated anion gap (22) confirms the presence of metabolic acidosis due to the accumulation of ketoacids.

## Clinical pearl

In cases of DKA, early recognition and treatment with insulin and fluid resuscitation are critical to prevent complications such as cerebral edema and cardiovascular collapse.

## High-yield facts

• Diabetic ketoacidosis (DKA) is characterized by hyperglycemia, metabolic acidosis, and ketonuria.
• Kussmaul respirations are a compensatory mechanism for metabolic acidosis, indicating severe acidosis.
• Anion gap metabolic acidosis is defined as an anion gap greater than 12 mEq/L, often seen in DKA.

## Common pitfalls

• Students may confuse DKA with other forms of metabolic acidosis due to overlapping symptoms.
• Misinterpretation of Kussmaul respirations as a sign of respiratory disease rather than metabolic compensation.
• Overlooking the significance of hyperglycemia and ketonuria in diagnosing DKA.

## Next step in care

Initiate intravenous fluids and insulin therapy to correct hyperglycemia and metabolic acidosis while monitoring electrolytes closely.

## Test-taking tip

Look for key clinical features such as Kussmaul respirations and fruity breath odor, which are classic signs of DKA in exam questions.

## Real-world clinical application

On the wards, be vigilant for signs of DKA in patients with Type 1 diabetes who report missed insulin doses, as timely intervention is crucial.

## Layered depth

**Basic:** DKA is a life-threatening complication of diabetes characterized by hyperglycemia and metabolic acidosis.

**Intermediate:** The pathophysiology involves insulin deficiency leading to increased lipolysis and ketogenesis, resulting in metabolic derangements.

**Advanced:** In severe cases, DKA can lead to complications such as cerebral edema, myocardial infarction, and acute kidney injury if not promptly treated.

## Visual cues

• **Ketoacidosis Pathway:** A flowchart illustrating the metabolic pathway from insulin deficiency to increased lipolysis, ketogenesis, and resultant metabolic acidosis.

## Related topics

• **Step1 — Diabetes Mellitus:** Understanding DKA is crucial for managing diabetic patients.
• **Step2CK — Metabolic Acidosis:** Recognizing the signs and symptoms of DKA is essential for effective treatment.

ADA 2024 Standards of Care: treat marked hyperglycemia with ketoacidosis or a hyperosmolar state with intravenous insulin after fluids are started.$s1_149ne$,
  128, 69, 105, 88,
  1.855072, 1.193182
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_150id$cmq0g7h4y003d1y4fwwod5dxx$s1_150id$,
  $s1_150st$usmle-step-1$s1_150st$,
  1,
  $s1_150oo${"options":["Primary CNS vasospasm without placental or endothelial pathology","Gestational diabetes causing visual changes without hypertension","Cortical venous thrombosis as most likely without focal deficits","Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia"],"distractorRationale":{"Primary CNS vasospasm without placental or endothelial pathology":"However, primary CNS vasospasm does not account for the systemic signs of hypertension and proteinuria, which are key features of preeclampsia. (This highlights the importance of understanding that preeclampsia involves systemic endothelial dysfunction rather than isolated CNS pathology.)","Gestational diabetes causing visual changes without hypertension":"Gestational diabetes primarily affects glucose metabolism and does not explain the significant hypertension and proteinuria observed in this patient. (This emphasizes the need to connect clinical findings to the correct pathophysiological mechanisms.)","Cortical venous thrombosis as most likely without focal deficits":"However, cortical venous thrombosis would typically present with focal neurological deficits, which are absent here, and it does not explain the systemic hypertension and proteinuria. (This reinforces the importance of integrating all clinical findings to arrive at the correct diagnosis.)"},"clinicalReasoning":"The underlying mechanism is placental malperfusion leading to systemic endothelial dysfunction. **Placental malperfusion** occurs when the placenta does not receive adequate blood flow. **Endothelial dysfunction** results from the lack of perfusion, causing systemic effects like hypertension and proteinuria.","keyTakeaways":["When assessing a pregnant patient with hypertension and proteinuria, think of placental malperfusion as a key underlying mechanism."],"blueprintTopic":"ards-pathology","blueprintSystem":"respiratory-renal"}$s1_150oo$,
  $s1_150no${"options":["Primary CNS vasospasm without placental ischemia or systemic endothelial injury","Gestational diabetes causing visual changes without hypertension or proteinuria","Cortical venous thrombosis as the most likely cause despite no focal neurologic deficit","Placental malperfusion with endothelial dysfunction, hypertension, proteinuria, and end-organ ischemia"],"distractorRationale":{"Primary CNS vasospasm without placental ischemia or systemic endothelial injury":"However, primary CNS vasospasm does not account for the systemic signs of hypertension and proteinuria, which are key features of preeclampsia. (This highlights the importance of understanding that preeclampsia involves systemic endothelial dysfunction rather than isolated CNS pathology.)","Gestational diabetes causing visual changes without hypertension or proteinuria":"Gestational diabetes primarily affects glucose metabolism and does not explain the significant hypertension and proteinuria observed in this patient. (This emphasizes the need to connect clinical findings to the correct pathophysiological mechanisms.)","Cortical venous thrombosis as the most likely cause despite no focal neurologic deficit":"However, cortical venous thrombosis would typically present with focal neurological deficits, which are absent here, and it does not explain the systemic hypertension and proteinuria. (This reinforces the importance of integrating all clinical findings to arrive at the correct diagnosis.)"},"clinicalReasoning":"The underlying mechanism is placental malperfusion leading to systemic endothelial dysfunction. **Placental malperfusion** occurs when the placenta does not receive adequate blood flow. **Endothelial dysfunction** results from the lack of perfusion, causing systemic effects like hypertension and proteinuria.","keyTakeaways":["When assessing a pregnant patient with hypertension and proteinuria, think of placental malperfusion as a key underlying mechanism."],"blueprintTopic":"ards-pathology","blueprintSystem":"respiratory-renal"}$s1_150no$,
  $s1_150oc$Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia$s1_150oc$,
  $s1_150nc$Placental malperfusion with endothelial dysfunction, hypertension, proteinuria, and end-organ ischemia$s1_150nc$,
  $s1_150oe$## Why this answer is correct
The underlying mechanism is placental malperfusion leading to systemic endothelial dysfunction.
• **Placental malperfusion** occurs when the placenta does not receive adequate blood flow.
• **Endothelial dysfunction** results from the lack of perfusion, causing systemic effects like hypertension and proteinuria.
• This condition is characteristic of **preeclampsia**, which can lead to serious complications if untreated.
• The combination of hypertension, proteinuria, and end-organ ischemia reflects the systemic impact of this dysfunction.
**In practice:** Recognizing this mechanism is crucial for managing preeclampsia effectively. On the unit, it guides treatment decisions to prevent maternal and fetal complications.
## Why the other options are wrong

**Primary CNS vasospasm without placental or endothelial pathology**
• Trap: Students may think this option is correct because CNS symptoms like headache and visual changes can occur in preeclampsia.
• Why it fails here: However, primary CNS vasospasm does not account for the systemic signs of hypertension and proteinuria, which are key features of preeclampsia.
• Remember: This highlights the importance of understanding that preeclampsia involves systemic endothelial dysfunction rather than isolated CNS pathology.

**Gestational diabetes causing visual changes without hypertension**
• Trap: This option may seem plausible since gestational diabetes can lead to complications, but it does not typically cause hypertension or the other findings present.
• Why it fails here: Gestational diabetes primarily affects glucose metabolism and does not explain the significant hypertension and proteinuria observed in this patient.
• Remember: This emphasizes the need to connect clinical findings to the correct pathophysiological mechanisms.

**Cortical venous thrombosis as most likely without focal deficits**
• Trap: Students might consider this option due to the presence of headache and visual changes, which can occur with venous thrombosis.
• Why it fails here: However, cortical venous thrombosis would typically present with focal neurological deficits, which are absent here, and it does not explain the systemic hypertension and proteinuria.
• Remember: This reinforces the importance of integrating all clinical findings to arrive at the correct diagnosis.
## Key takeaway
**When assessing a pregnant patient with hypertension and proteinuria, think of placental malperfusion as a key underlying mechanism.**

**Memory hook:** Remember: In preeclampsia, think 'placenta first' — malperfusion leads to systemic issues.

The board takeaway is that Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia is the single best answer, and the rationale above is what the student should leave with.$s1_150oe$,
  $s1_150ne$## Why this answer is correct
The underlying mechanism is placental malperfusion leading to systemic endothelial dysfunction.
• **Placental malperfusion** occurs when the placenta does not receive adequate blood flow.
• **Endothelial dysfunction** results from the lack of perfusion, causing systemic effects like hypertension and proteinuria.
• This condition is characteristic of **preeclampsia**, which can lead to serious complications if untreated.
• The combination of hypertension, proteinuria, and end-organ ischemia reflects the systemic impact of this dysfunction.
**In practice:** Recognizing this mechanism is crucial for managing preeclampsia effectively. On the unit, it guides treatment decisions to prevent maternal and fetal complications.
## Why the other options are wrong

**Primary CNS vasospasm without placental ischemia or systemic endothelial injury**
• Trap: Students may think this option is correct because CNS symptoms like headache and visual changes can occur in preeclampsia.
• Why it fails here: However, primary CNS vasospasm does not account for the systemic signs of hypertension and proteinuria, which are key features of preeclampsia.
• Remember: This highlights the importance of understanding that preeclampsia involves systemic endothelial dysfunction rather than isolated CNS pathology.

**Gestational diabetes causing visual changes without hypertension or proteinuria**
• Trap: This option may seem plausible since gestational diabetes can lead to complications, but it does not typically cause hypertension or the other findings present.
• Why it fails here: Gestational diabetes primarily affects glucose metabolism and does not explain the significant hypertension and proteinuria observed in this patient.
• Remember: This emphasizes the need to connect clinical findings to the correct pathophysiological mechanisms.

**Cortical venous thrombosis as the most likely cause despite no focal neurologic deficit**
• Trap: Students might consider this option due to the presence of headache and visual changes, which can occur with venous thrombosis.
• Why it fails here: However, cortical venous thrombosis would typically present with focal neurological deficits, which are absent here, and it does not explain the systemic hypertension and proteinuria.
• Remember: This reinforces the importance of integrating all clinical findings to arrive at the correct diagnosis.
## Key takeaway
**When assessing a pregnant patient with hypertension and proteinuria, think of placental malperfusion as a key underlying mechanism.**

**Memory hook:** Remember: In preeclampsia, think 'placenta first' — malperfusion leads to systemic issues.

The board takeaway is that Placental malperfusion with endothelial dysfunction, hypertension, proteinuria, and end-organ ischemia is the single best answer, and the rationale above is what the student should leave with.$s1_150ne$,
  109, 64, 102, 87,
  1.703125, 1.172414
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_151id$cmq0g7j1y003r1y4fdkx9d6li$s1_151id$,
  $s1_151st$usmle-step-1$s1_151st$,
  1,
  $s1_151oo$["Gallstone impaction at the ampulla", "Mesenteric ischemia causing isolated lipase elevation", "Hepatic congestion raising serum lipase", "Premature activation of pancreatic enzymes within acinar cells, causing autodigestion, inflammation and third-spacing"]$s1_151oo$,
  $s1_151no$["Gallstone impaction at the ampulla with lipase digesting hepatic tissue directly", "Mesenteric ischemia causing isolated lipase elevation without pancreatic inflammation", "Hepatic congestion raising serum lipase by blocking clearance of the enzyme", "Premature acinar enzyme activation, with autodigestion, inflammation, and third-spacing"]$s1_151no$,
  $s1_151oc$Premature activation of pancreatic enzymes within acinar cells, causing autodigestion, inflammation and third-spacing$s1_151oc$,
  $s1_151nc$Premature acinar enzyme activation, with autodigestion, inflammation, and third-spacing$s1_151nc$,
  $s1_151oe$Correct answer: D. Premature activation of pancreatic enzymes within acinar cells, causing autodigestion, inflammation and third-spacing. Epigastric pain radiating to the back with a lipase of 1,420 U/L after heavy drinking is alcohol-associated acute pancreatitis; trypsinogen is activated inside acinar cells, digesting the gland and triggering inflammation and capillary leak. Why the other options are wrong: A. A previous ultrasound showed no gallstones and the trigger is alcohol. B. Mesenteric ischemia does not explain pain radiating to the back with a lipase this high. C. Hepatic congestion does not raise lipase to 1,420 U/L.$s1_151oe$,
  $s1_151ne$Correct answer: D. Premature acinar enzyme activation, with autodigestion, inflammation, and third-spacing. Epigastric pain radiating to the back with a lipase of 1,420 U/L after heavy drinking is alcohol-associated acute pancreatitis; trypsinogen is activated inside acinar cells, digesting the gland and triggering inflammation and capillary leak. Why the other options are wrong: A. A previous ultrasound showed no gallstones and the trigger is alcohol. B. Mesenteric ischemia does not explain pain radiating to the back with a lipase this high. C. Hepatic congestion does not raise lipase to 1,420 U/L.$s1_151ne$,
  117, 53, 87, 85,
  2.207547, 1.023529
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_152id$cmq0g7jii003x1y4fyfbe2x4l$s1_152id$,
  $s1_152st$usmle-step-1$s1_152st$,
  1,
  $s1_152oo${"options":["Viral lymphocytic pleocytosis with normal CSF glucose","Ruptured berry aneurysm causing xanthochromia without infection","Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein","Autoimmune demyelination as acute febrile meningismus"],"distractorRationale":{"Viral lymphocytic pleocytosis with normal CSF glucose":"In viral meningitis, the CSF typically shows a **lymphocytic** predominance with **normal glucose levels**, which does not match this patient's findings of neutrophilic pleocytosis and low glucose. (This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.)","Ruptured berry aneurysm causing xanthochromia without infection":"A ruptured berry aneurysm would present with **xanthochromia** (yellow discoloration of CSF) and typically does not cause the neutrophilic pleocytosis or low glucose seen here. (Understanding the CSF profile is key to distinguishing between hemorrhagic and infectious causes of meningitis.)","Autoimmune demyelination as acute febrile meningismus":"Autoimmune conditions would not typically present with such a high neutrophil count or low glucose in the CSF, which are hallmark signs of bacterial meningitis. (This reinforces the need to recognize the distinct laboratory findings associated with infectious versus autoimmune etiologies.)"},"clinicalReasoning":"Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein. **Bacterial meningitis** is characterized by a significant increase in **neutrophils** in the cerebrospinal fluid (CSF). In bacterial infections, the **blood-brain barrier** is compromised, allowing bacteria to enter the CNS.","keyTakeaways":["When assessing meningitis, prioritize CSF findings: neutrophilic pleocytosis, low glucose, and elevated protein indicate bacterial infection."],"blueprintTopic":"gram-positive-organisms","blueprintSystem":"pharmacology-microbiology"}$s1_152oo$,
  $s1_152no${"options":["Viral lymphocytic pleocytosis with normal CSF glucose and near-normal protein","Ruptured berry aneurysm causing xanthochromia without infection or low CSF glucose","Bacteria crossing the blood-brain barrier, with neutrophils, low CSF glucose, and high protein","Autoimmune demyelination presenting as febrile meningismus with a neutrophilic CSF"],"distractorRationale":{"Viral lymphocytic pleocytosis with normal CSF glucose and near-normal protein":"In viral meningitis, the CSF typically shows a **lymphocytic** predominance with **normal glucose levels**, which does not match this patient's findings of neutrophilic pleocytosis and low glucose. (This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.)","Ruptured berry aneurysm causing xanthochromia without infection or low CSF glucose":"A ruptured berry aneurysm would present with **xanthochromia** (yellow discoloration of CSF) and typically does not cause the neutrophilic pleocytosis or low glucose seen here. (Understanding the CSF profile is key to distinguishing between hemorrhagic and infectious causes of meningitis.)","Autoimmune demyelination presenting as febrile meningismus with a neutrophilic CSF":"Autoimmune conditions would not typically present with such a high neutrophil count or low glucose in the CSF, which are hallmark signs of bacterial meningitis. (This reinforces the need to recognize the distinct laboratory findings associated with infectious versus autoimmune etiologies.)"},"clinicalReasoning":"Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein. **Bacterial meningitis** is characterized by a significant increase in **neutrophils** in the cerebrospinal fluid (CSF). In bacterial infections, the **blood-brain barrier** is compromised, allowing bacteria to enter the CNS.","keyTakeaways":["When assessing meningitis, prioritize CSF findings: neutrophilic pleocytosis, low glucose, and elevated protein indicate bacterial infection."],"blueprintTopic":"gram-positive-organisms","blueprintSystem":"pharmacology-microbiology"}$s1_152no$,
  $s1_152oc$Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein$s1_152oc$,
  $s1_152nc$Bacteria crossing the blood-brain barrier, with neutrophils, low CSF glucose, and high protein$s1_152nc$,
  $s1_152oe$## Why this answer is correct
Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein.
• **Bacterial meningitis** is characterized by a significant increase in **neutrophils** in the cerebrospinal fluid (CSF).
• In bacterial infections, the **blood-brain barrier** is compromised, allowing bacteria to enter the CNS.
• This results in **low glucose** levels in the CSF due to bacterial consumption and **elevated protein** due to inflammation.
**In practice:** Recognizing these findings is crucial for timely diagnosis and treatment of bacterial meningitis, which can be life-threatening if not addressed promptly.
## Why the other options are wrong

**Viral lymphocytic pleocytosis with normal CSF glucose**
• Trap: Students may confuse viral meningitis with bacterial meningitis due to overlapping symptoms.
• Why it fails here: In viral meningitis, the CSF typically shows a **lymphocytic** predominance with **normal glucose levels**, which does not match this patient's findings of neutrophilic pleocytosis and low glucose.
• Remember: This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.

**Ruptured berry aneurysm causing xanthochromia without infection**
• Trap: Some may misinterpret the symptoms as indicative of a subarachnoid hemorrhage rather than an infection.
• Why it fails here: A ruptured berry aneurysm would present with **xanthochromia** (yellow discoloration of CSF) and typically does not cause the neutrophilic pleocytosis or low glucose seen here.
• Remember: Understanding the CSF profile is key to distinguishing between hemorrhagic and infectious causes of meningitis.

**Autoimmune demyelination as acute febrile meningismus**
• Trap: Students might think autoimmune processes can present similarly to infections.
• Why it fails here: Autoimmune conditions would not typically present with such a high neutrophil count or low glucose in the CSF, which are hallmark signs of bacterial meningitis.
• Remember: This reinforces the need to recognize the distinct laboratory findings associated with infectious versus autoimmune etiologies.
## Key takeaway
**When assessing meningitis, prioritize CSF findings: neutrophilic pleocytosis, low glucose, and elevated protein indicate bacterial infection.**

**Memory hook:** Remember: **Bacterial meningitis = Neutrophils + Low Glucose + High Protein**.$s1_152oe$,
  $s1_152ne$## Why this answer is correct
Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein.
• **Bacterial meningitis** is characterized by a significant increase in **neutrophils** in the cerebrospinal fluid (CSF).
• In bacterial infections, the **blood-brain barrier** is compromised, allowing bacteria to enter the CNS.
• This results in **low glucose** levels in the CSF due to bacterial consumption and **elevated protein** due to inflammation.
**In practice:** Recognizing these findings is crucial for timely diagnosis and treatment of bacterial meningitis, which can be life-threatening if not addressed promptly.
## Why the other options are wrong

**Viral lymphocytic pleocytosis with normal CSF glucose and near-normal protein**
• Trap: Students may confuse viral meningitis with bacterial meningitis due to overlapping symptoms.
• Why it fails here: In viral meningitis, the CSF typically shows a **lymphocytic** predominance with **normal glucose levels**, which does not match this patient's findings of neutrophilic pleocytosis and low glucose.
• Remember: This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.

**Ruptured berry aneurysm causing xanthochromia without infection or low CSF glucose**
• Trap: Some may misinterpret the symptoms as indicative of a subarachnoid hemorrhage rather than an infection.
• Why it fails here: A ruptured berry aneurysm would present with **xanthochromia** (yellow discoloration of CSF) and typically does not cause the neutrophilic pleocytosis or low glucose seen here.
• Remember: Understanding the CSF profile is key to distinguishing between hemorrhagic and infectious causes of meningitis.

**Autoimmune demyelination presenting as febrile meningismus with a neutrophilic CSF**
• Trap: Students might think autoimmune processes can present similarly to infections.
• Why it fails here: Autoimmune conditions would not typically present with such a high neutrophil count or low glucose in the CSF, which are hallmark signs of bacterial meningitis.
• Remember: This reinforces the need to recognize the distinct laboratory findings associated with infectious versus autoimmune etiologies.
## Key takeaway
**When assessing meningitis, prioritize CSF findings: neutrophilic pleocytosis, low glucose, and elevated protein indicate bacterial infection.**

**Memory hook:** Remember: **Bacterial meningitis = Neutrophils + Low Glucose + High Protein**.$s1_152ne$,
  111, 63, 94, 82,
  1.761905, 1.146341
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_153id$cmr31dl6c00byjs040ruov63z$s1_153id$,
  $s1_153st$usmle-step-1$s1_153st$,
  1,
  $s1_153oo${"options":["Group A strep colonization does not occur in children under 5","Antibiotics prevent post-strep glomerulonephritis but not rheumatic fever","Asymptomatic contacts do not require treatment because treatment does not prevent secondary spread in household contacts who remain asymptomatic","Penicillin is contraindicated in household contacts","The brother will develop lifelong immunity after exposure"],"stepLevel":"step1","kind":"vignette","structureIds":["c1-vertebra","spinal-cord","c2-vertebra"]}$s1_153oo$,
  $s1_153no${"options":["Group A strep colonization does not occur in children under 5, so exposure can be ignored","Antibiotics prevent post-streptococcal glomerulonephritis but not rheumatic fever","Asymptomatic contacts are not treated; antibiotics do not stop spread while they stay well","Penicillin is contraindicated in household contacts of a child with streptococcal pharyngitis","The brother will develop lifelong immunity after this exposure and needs no antibiotics"],"stepLevel":"step1","kind":"vignette","structureIds":["c1-vertebra","spinal-cord","c2-vertebra"]}$s1_153no$,
  $s1_153oc$Asymptomatic contacts do not require treatment because treatment does not prevent secondary spread in household contacts who remain asymptomatic$s1_153oc$,
  $s1_153nc$Asymptomatic contacts are not treated; antibiotics do not stop spread while they stay well$s1_153nc$,
  $s1_153oe$Treat symptomatic GAS pharyngitis to shorten symptoms and prevent rheumatic fever; routine treatment of asymptomatic household contacts is not recommended because colonization is common and treatment of asymptomatic carriers does not meaningfully prevent illness in contacts. Rheumatic fever prevention applies to the index case. Post-strep GN is not prevented by antibiotics.$s1_153oe$,
  $s1_153ne$Treat symptomatic GAS pharyngitis to shorten symptoms and prevent rheumatic fever; routine treatment of asymptomatic household contacts is not recommended because colonization is common and treatment of asymptomatic carriers does not meaningfully prevent illness in contacts. Rheumatic fever prevention applies to the index case. Post-strep GN is not prevented by antibiotics.$s1_153ne$,
  144, 73, 90, 93,
  1.972603, 0.967742
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_154id$cmr8ei0qn009h1yazkmaq70tl$s1_154id$,
  $s1_154st$usmle-step-1$s1_154st$,
  1,
  $s1_154oo$["Embolism from a cardiac source", "Rupture of a cerebral aneurysm", "Thrombosis superimposed on atherosclerotic plaque in the left internal carotid artery", "Hypoperfusion from systemic hypotension"]$s1_154oo$,
  $s1_154no$["Embolism from a cardiac source despite sinus rhythm and a normal echocardiogram", "Rupture of a cerebral aneurysm producing infarction in this arterial territory", "Thrombosis on atherosclerotic plaque in the left internal carotid artery", "Hypoperfusion from systemic hypotension across a watershed territory"]$s1_154no$,
  $s1_154oc$Thrombosis superimposed on atherosclerotic plaque in the left internal carotid artery$s1_154oc$,
  $s1_154nc$Thrombosis on atherosclerotic plaque in the left internal carotid artery$s1_154nc$,
  $s1_154oe$Correct answer: C. Thrombosis superimposed on atherosclerotic plaque in the left internal carotid artery. A stepwise course with an 80% ulcerated left ICA stenosis carrying intraluminal thrombus, and sinus rhythm with a normal echo, is the TOAST large-artery atherosclerosis subtype. Why the other options are wrong: A. Telemetry and echo show no cardiac source. B. MRI shows no hemorrhage. D. His BP is 176/98 mm Hg, so he is not hypotensive.$s1_154oe$,
  $s1_154ne$Correct answer: C. Thrombosis on atherosclerotic plaque in the left internal carotid artery. A stepwise course with an 80% ulcerated left ICA stenosis carrying intraluminal thrombus, and sinus rhythm with a normal echo, is the TOAST large-artery atherosclerosis subtype. Why the other options are wrong: A. Telemetry and echo show no cardiac source. B. MRI shows no hemorrhage. D. His BP is 176/98 mm Hg, so he is not hypotensive.$s1_154ne$,
  85, 39, 72, 79,
  2.179487, 0.911392
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_155id$cmrtqfzd2000a1yx3faa1fkgt$s1_155id$,
  $s1_155st$usmle-step-1$s1_155st$,
  1,
  $s1_155oo$["Embolism from a cardiac source", "Rupture of a cerebral aneurysm", "Atherosclerotic disease of the ipsilateral internal carotid artery (artery-to-artery thromboembolism)", "Hypoperfusion from systemic hypotension"]$s1_155oo$,
  $s1_155no$["Embolism from a cardiac source despite sinus rhythm and no intracardiac thrombus", "Rupture of a cerebral aneurysm as the cause of this cerebral infarct", "Ipsilateral internal carotid atherosclerosis with artery-to-artery thromboembolism", "Hypoperfusion from systemic hypotension across a carotid watershed territory"]$s1_155no$,
  $s1_155oc$Atherosclerotic disease of the ipsilateral internal carotid artery (artery-to-artery thromboembolism)$s1_155oc$,
  $s1_155nc$Ipsilateral internal carotid atherosclerosis with artery-to-artery thromboembolism$s1_155nc$,
  $s1_155oe$Correct answer: C. Atherosclerotic disease of the ipsilateral internal carotid artery (artery-to-artery thromboembolism). An 80% ulcerated left ICA stenosis supplying the infarct, preceded by left amaurosis fugax, with sinus rhythm on telemetry and a normal echo, is the TOAST large-artery atherosclerosis subtype. Why the other options are wrong: A. Telemetry showed sinus rhythm and the echo showed no thrombus or PFO, so there is no cardiac source. B. MRI shows no hemorrhage. D. Her BP is 172/94 mm Hg, so she is not hypotensive.$s1_155oe$,
  $s1_155ne$Correct answer: C. Ipsilateral internal carotid atherosclerosis with artery-to-artery thromboembolism. An 80% ulcerated left ICA stenosis supplying the infarct, preceded by left amaurosis fugax, with sinus rhythm on telemetry and a normal echo, is the TOAST large-artery atherosclerosis subtype. Why the other options are wrong: A. Telemetry showed sinus rhythm and the echo showed no thrombus or PFO, so there is no cardiac source. B. MRI shows no hemorrhage. D. Her BP is 172/94 mm Hg, so she is not hypotensive.$s1_155ne$,
  101, 39, 82, 80,
  2.589744, 1.025000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_156id$d0b6cf68-ae01-45f0-9ab4-74a1ce40c9aa$s1_156id$,
  $s1_156st$usmle-step-1$s1_156st$,
  1,
  $s1_156oo${"options": ["Beta chains are reduced, alpha chains precipitate, and A2 (delta) rises; iron stores are normal, so iron will overload him", "Iron deficiency raises hemoglobin A2", "Ferritin is low in thalassemia trait", "Target cells mean B12 deficiency", "Beta thalassemia trait has a high MCV"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Thalassemia versus iron deficiency", "kind": "vignette"}$s1_156oo$,
  $s1_156no${"options": ["Beta chains are reduced and hemoglobin A2 rises; iron stores are normal, so iron will overload him", "Iron deficiency raises hemoglobin A2 and produces this same microcytic pattern", "Ferritin is low in thalassemia trait, so iron replacement is the right treatment", "Target cells mean vitamin B12 deficiency, which also elevates hemoglobin A2", "Beta thalassemia trait has a high MCV and depleted marrow iron"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Thalassemia versus iron deficiency", "kind": "vignette"}$s1_156no$,
  $s1_156oc$Beta chains are reduced, alpha chains precipitate, and A2 (delta) rises; iron stores are normal, so iron will overload him$s1_156oc$,
  $s1_156nc$Beta chains are reduced and hemoglobin A2 rises; iron stores are normal, so iron will overload him$s1_156nc$,
  $s1_156oe$Beta thalassemia trait is a quantitative drop in beta globin. Excess alpha chains damage precursors, the MCV is very low, targets appear, and HbA2 is up because delta chains are relatively increased. Iron studies are normal. Giving iron does not fix the gene and can load him. Iron deficiency lowers A2 and ferritin. Ferritin is not low here. Targets are a hemoglobinopathy clue, not B12, which is macrocytic. The MCV is low, not high.$s1_156oe$,
  $s1_156ne$Beta thalassemia trait is a quantitative drop in beta globin. Excess alpha chains damage precursors, the MCV is very low, targets appear, and HbA2 is up because delta chains are relatively increased. Iron studies are normal. Giving iron does not fix the gene and can load him. Iron deficiency lowers A2 and ferritin. Ferritin is not low here. Targets are a hemoglobinopathy clue, not B12, which is macrocytic. The MCV is low, not high.$s1_156ne$,
  122, 37, 98, 80,
  3.297297, 1.225000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_157id$d0e067cd-ac06-421d-9bee-2ab838a9c49f$s1_157id$,
  $s1_157st$usmle-step-1$s1_157st$,
  1,
  $s1_157oo${"options": ["High output and low resistance is vasodilation from sepsis; cold low-output high-resistance shock is cardiogenic pump failure", "Both profiles are hypovolemia, and skin temperature does not matter", "Low resistance means tamponade because the heart cannot fill", "High cardiac output excludes shock even if the pressure is 78 mm Hg", "Cardiogenic shock has low resistance because the heart releases nitric oxide"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Distributive versus cardiogenic shock", "kind": "vignette"}$s1_157oo$,
  $s1_157no${"options": ["High-output low resistance with warm skin is septic vasodilation; cold low-output shock is cardiogenic", "Both profiles are hypovolemia, and skin temperature does not separate the shock states", "Low resistance means tamponade, because the heart cannot fill or generate pressure", "High cardiac output excludes shock even when arterial pressure is 78 mm Hg", "Cardiogenic shock has low resistance because the failing heart releases nitric oxide"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Distributive versus cardiogenic shock", "kind": "vignette"}$s1_157no$,
  $s1_157oc$High output and low resistance is vasodilation from sepsis; cold low-output high-resistance shock is cardiogenic pump failure$s1_157oc$,
  $s1_157nc$High-output low resistance with warm skin is septic vasodilation; cold low-output shock is cardiogenic$s1_157nc$,
  $s1_157oe$Septic shock is distributive: inflammatory mediators drop systemic vascular resistance, cardiac output is often high, and the skin is warm. Cardiogenic shock is a failed pump, so output is low, the body clamps down, resistance is high, and the skin is cold. Calling both hypovolemia misses the output and resistance split. Tamponade is obstructive, with low output and equalization of diastolic pressures, not low resistance with warm skin. A pressure of 78 mm Hg with lactate is shock even if output is high; the tissues are under-perfused because pressure, not just output, is inadequate. Cardiogenic vasoconstriction raises resistance; it does not lower it.$s1_157oe$,
  $s1_157ne$Septic shock is distributive: inflammatory mediators drop systemic vascular resistance, cardiac output is often high, and the skin is warm. Cardiogenic shock is a failed pump, so output is low, the body clamps down, resistance is high, and the skin is cold. Calling both hypovolemia misses the output and resistance split. Tamponade is obstructive, with low output and equalization of diastolic pressures, not low resistance with warm skin. A pressure of 78 mm Hg with lactate is shock even if output is high; the tissues are under-perfused because pressure, not just output, is inadequate. Cardiogenic vasoconstriction raises resistance; it does not lower it.$s1_157ne$,
  125, 76, 102, 86,
  1.644737, 1.186047
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_158id$d238f2c0-bbb5-4ea5-ba35-593806c8b0c4$s1_158id$,
  $s1_158st$usmle-step-1$s1_158st$,
  1,
  $s1_158oo${"options": ["A is synovial pannus of rheumatoid arthritis, MCP and PIP, anti-CCP specific; B is cartilage loss of osteoarthritis at DIPs and the knee, antibody negative", "Osteoarthritis hits the MCP joints and lasts all morning", "Anti-CCP is the osteoarthritis screening test", "Rheumatoid arthritis prefers the DIP joints", "Heberden nodes are rheumatoid nodules"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Rheumatoid versus osteoarthritis", "kind": "vignette"}$s1_158oo$,
  $s1_158no${"options": ["A is rheumatoid arthritis at MCP and PIP joints with anti-CCP; B is osteoarthritis at the DIPs and knee, seronegative", "Osteoarthritis hits the MCP joints, lasts all morning, and is anti-CCP positive", "Anti-CCP is the screening test for osteoarthritis and is negative in rheumatoid arthritis of the hand joints", "Rheumatoid arthritis prefers the DIP joints and the knee and lacks a specific antibody", "Heberden nodes are rheumatoid nodules sitting on the distal interphalangeal joints"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Rheumatoid versus osteoarthritis", "kind": "vignette"}$s1_158no$,
  $s1_158oc$A is synovial pannus of rheumatoid arthritis, MCP and PIP, anti-CCP specific; B is cartilage loss of osteoarthritis at DIPs and the knee, antibody negative$s1_158oc$,
  $s1_158nc$A is rheumatoid arthritis at MCP and PIP joints with anti-CCP; B is osteoarthritis at the DIPs and knee, seronegative$s1_158nc$,
  $s1_158oe$Rheumatoid arthritis is an autoimmune synovitis. Pannus invades cartilage, morning stiffness is prolonged, MCPs and PIPs are involved, DIPs are spared, and anti-CCP is specific. Osteoarthritis is mechanical cartilage failure: DIPs, PIPs, first CMC, knees, and hips, with brief stiffness and bony nodes, and no anti-CCP. Wear-and-tear does not explain an hour of stiffness and boggy MCPs. Anti-CCP is not an OA test. DIPs are the OA joint, not the rheumatoid one. Heberden nodes are osteophytes, not rheumatoid nodules.$s1_158oe$,
  $s1_158ne$Rheumatoid arthritis is an autoimmune synovitis. Pannus invades cartilage, morning stiffness is prolonged, MCPs and PIPs are involved, DIPs are spared, and anti-CCP is specific. Osteoarthritis is mechanical cartilage failure: DIPs, PIPs, first CMC, knees, and hips, with brief stiffness and bony nodes, and no anti-CCP. Wear-and-tear does not explain an hour of stiffness and boggy MCPs. Anti-CCP is not an OA test. DIPs are the OA joint, not the rheumatoid one. Heberden nodes are osteophytes, not rheumatoid nodules.$s1_158ne$,
  155, 56, 117, 108,
  2.767857, 1.083333
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_159id$d531a34b-d3fc-462c-8214-973704925fc7$s1_159id$,
  $s1_159st$usmle-step-1$s1_159st$,
  1,
  $s1_159oo${"options": ["Cervical fibers of the spinothalamic tract cross near the central canal, and the cervical corticospinal fibers lie more medially; dorsal columns, which carry vibration and much discriminative touch, sit outside the cavity", "The syrinx destroys the dorsal columns first, so pain is spared and touch is lost", "Hyperextension injures the lumbar cord preferentially because those fibers are medial", "A cape distribution is a brainstem lesion at the trigeminal nucleus", "Light touch and pain share one tract, so they cannot separate"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Central cord and syrinx", "kind": "vignette"}$s1_159oo$,
  $s1_159no${"options": ["Crossing cervical spinothalamic fibers and medial corticospinal fibers are central; dorsal columns lie outside and spare touch", "The syrinx destroys the dorsal columns first, so pain is spared and discriminative touch is lost", "Hyperextension injures the lumbar cord preferentially because those fibers lie medial to the cervical fibers", "A cape distribution is a brainstem lesion at the spinal trigeminal nucleus, not the cervical cord", "Light touch and pain share one anterolateral tract, so a central cavity cannot separate them"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Central cord and syrinx", "kind": "vignette"}$s1_159no$,
  $s1_159oc$Cervical fibers of the spinothalamic tract cross near the central canal, and the cervical corticospinal fibers lie more medially; dorsal columns, which carry vibration and much discriminative touch, sit outside the cavity$s1_159oc$,
  $s1_159nc$Crossing cervical spinothalamic fibers and medial corticospinal fibers are central; dorsal columns lie outside and spare touch$s1_159nc$,
  $s1_159oe$Crossing spinothalamic fibers decussate in front of the central canal. A syrinx interrupts them at the level of the cavity and spares the already-crossed lateral tracts and the dorsal columns, so pain and temperature drop in a cape while vibration and discriminative touch remain. In the corticospinal tract the arm fibers are more medial than the leg fibers, so a central or hyperextension injury weakens the hands more than the legs. A syrinx does not start in the dorsal columns. Lumbar fibers are lateral, so they are relatively spared, not hit first. The trigeminal nucleus would numb the face, not a shoulder cape. Pain and discriminative touch do not share one tract, which is the whole point of the dissociated sensory loss.$s1_159oe$,
  $s1_159ne$Crossing spinothalamic fibers decussate in front of the central canal. A syrinx interrupts them at the level of the cavity and spares the already-crossed lateral tracts and the dorsal columns, so pain and temperature drop in a cape while vibration and discriminative touch remain. In the corticospinal tract the arm fibers are more medial than the leg fibers, so a central or hyperextension injury weakens the hands more than the legs. A syrinx does not start in the dorsal columns. Lumbar fibers are lateral, so they are relatively spared, not hit first. The trigeminal nucleus would numb the face, not a shoulder cape. Pain and discriminative touch do not share one tract, which is the whole point of the dissociated sensory loss.$s1_159ne$,
  221, 85, 126, 108,
  2.600000, 1.166667
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_160id$d64ef91e-9819-4848-9ba0-87e38277dd89$s1_160id$,
  $s1_160st$usmle-step-1$s1_160st$,
  1,
  $s1_160oo${"options": ["Antagonist in breast, agonist in bone and endometrium; the uterus can thicken or form cancer, and bone is relatively protected", "Antagonist in bone and agonist in breast", "It lowers endometrial cancer risk the way it lowers breast cancer risk", "Aromatase inhibitors are agonists in the breast", "Hot flashes mean estrogen activity is increased in the brain"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Tamoxifen tissues", "kind": "vignette"}$s1_160oo$,
  $s1_160no${"options": ["Antagonist in breast; agonist in bone and endometrium, which can thicken or form cancer", "Antagonist in bone and agonist in breast, so fracture risk rises while breast tissue is stimulated", "It lowers endometrial cancer risk the way it lowers breast cancer risk, by blocking both tissues", "Aromatase inhibitors are agonists in the breast and antagonists in bone", "Hot flashes mean estrogen activity is increased in the brain"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Tamoxifen tissues", "kind": "vignette"}$s1_160no$,
  $s1_160oc$Antagonist in breast, agonist in bone and endometrium; the uterus can thicken or form cancer, and bone is relatively protected$s1_160oc$,
  $s1_160nc$Antagonist in breast; agonist in bone and endometrium, which can thicken or form cancer$s1_160nc$,
  $s1_160oe$Tamoxifen is a selective estrogen receptor modulator. It blocks the breast receptor, which is the point in ER-positive cancer, but it stimulates endometrium and bone. Endometrial thickening and cancer risk are the trade, and hot flashes reflect blockade in the hypothalamus. It is not an antagonist everywhere. It does not protect the uterus the way it protects the breast. Aromatase inhibitors lower estrogen production in postmenopausal women and do not agonize the breast; they tend to thin bone. Hot flashes are a low-estrogen-signal symptom, not increased brain estrogen.$s1_160oe$,
  $s1_160ne$Tamoxifen is a selective estrogen receptor modulator. It blocks the breast receptor, which is the point in ER-positive cancer, but it stimulates endometrium and bone. Endometrial thickening and cancer risk are the trade, and hot flashes reflect blockade in the hypothalamus. It is not an antagonist everywhere. It does not protect the uterus the way it protects the breast. Aromatase inhibitors lower estrogen production in postmenopausal women and do not agonize the breast; they tend to thin bone. Hot flashes are a low-estrogen-signal symptom, not increased brain estrogen.$s1_160ne$,
  126, 70, 87, 98,
  1.800000, 0.887755
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_161id$d7a70b9b-fd8a-4ec1-9d43-c2334d3361b3$s1_161id$,
  $s1_161st$usmle-step-1$s1_161st$,
  1,
  $s1_161oo${"options": ["Immune complexes consume C3 and C4; anti-Smith is the most specific ANA subset, and anti-dsDNA tracks renal disease", "Complement rises in active lupus nephritis", "Anti-dsDNA is nonspecific and anti-histone is specific for native lupus", "Red-cell casts mean bladder cancer, not glomerular inflammation", "A malar rash is dermatomyositis"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "SLE complement", "kind": "vignette"}$s1_161oo$,
  $s1_161no${"options": ["Immune complexes consume C3 and C4; anti-Smith is the most specific antibody", "Complement rises in active lupus nephritis as immune complexes deposit in the kidney", "Anti-dsDNA is nonspecific, and anti-histone is the specific marker of native lupus", "Red-cell casts mean a urothelial cancer, and the sediment is not glomerular", "A malar rash is dermatomyositis, so these ANA subsets do not apply"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "SLE complement", "kind": "vignette"}$s1_161no$,
  $s1_161oc$Immune complexes consume C3 and C4; anti-Smith is the most specific ANA subset, and anti-dsDNA tracks renal disease$s1_161oc$,
  $s1_161nc$Immune complexes consume C3 and C4; anti-Smith is the most specific antibody$s1_161nc$,
  $s1_161oe$Lupus nephritis is type III hypersensitivity. Complexes fix complement, so C3 and C4 fall when disease is active, and anti-dsDNA titers often rise with the kidney. Anti-Smith is very specific though less sensitive. Complement does not rise as the activity marker; it falls. Anti-histone is the drug-induced lupus clue, not the specific native marker. Red-cell casts are glomerular. A malar rash sparing the nasolabial folds is lupus, not the eyelid heliotrope of dermatomyositis.$s1_161oe$,
  $s1_161ne$Lupus nephritis is type III hypersensitivity. Complexes fix complement, so C3 and C4 fall when disease is active, and anti-dsDNA titers often rise with the kidney. Anti-Smith is very specific though less sensitive. Complement does not rise as the activity marker; it falls. Anti-histone is the drug-induced lupus clue, not the specific native marker. Red-cell casts are glomerular. A malar rash sparing the nasolabial folds is lupus, not the eyelid heliotrope of dermatomyositis.$s1_161ne$,
  115, 71, 76, 84,
  1.619718, 0.904762
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_162id$db5619cd-19d5-426c-92d9-85e3970c3df0$s1_162id$,
  $s1_162st$usmle-step-1$s1_162st$,
  1,
  $s1_162oo${"options": ["Autoreceptor and downstream receptor changes take weeks even though reuptake blockade is immediate; a benzodiazepine may sedate anxiety but does not treat the depressive episode", "Sertraline blocks dopamine reuptake, so nausea on day 3 means the dose is already therapeutic for mood", "Mood must improve within 72 hours or the diagnosis is wrong", "Alprazolam increases serotonin reuptake and is first-line for melancholic depression", "Jitteriness is serotonin syndrome and the SSRI should be doubled"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "SSRI delay", "kind": "vignette"}$s1_162oo$,
  $s1_162no${"options": ["Receptor adaptations take weeks after immediate reuptake blockade; a benzodiazepine does not treat the depressive episode", "Sertraline blocks dopamine reuptake, so nausea on day 3 means the dose is already therapeutic for mood", "Mood must improve within 72 hours or the diagnosis of a depressive episode is wrong", "Alprazolam increases serotonin reuptake and is first-line for melancholic depression", "Jitteriness on day 2 is serotonin syndrome, and the SSRI dose should be doubled"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "SSRI delay", "kind": "vignette"}$s1_162no$,
  $s1_162oc$Autoreceptor and downstream receptor changes take weeks even though reuptake blockade is immediate; a benzodiazepine may sedate anxiety but does not treat the depressive episode$s1_162oc$,
  $s1_162nc$Receptor adaptations take weeks after immediate reuptake blockade; a benzodiazepine does not treat the depressive episode$s1_162nc$,
  $s1_162oe$SSRIs block the serotonin transporter within hours, but mood response tracks slower changes in autoreceptors and postsynaptic signaling, classically several weeks. Early nausea and activation are common and are not proof of failure or of serotonin syndrome. A benzodiazepine can take the edge off anxiety and insomnia and can be habit-forming; it is not an antidepressant and is a poor substitute. Sertraline is not a dopamine-reuptake blocker as its main action. A three-day trial does not falsify the diagnosis. Alprazolam does not treat melancholia by increasing serotonin reuptake. Doubling the dose for mild early jitteriness risks real toxicity and is not the move.$s1_162oe$,
  $s1_162ne$SSRIs block the serotonin transporter within hours, but mood response tracks slower changes in autoreceptors and postsynaptic signaling, classically several weeks. Early nausea and activation are common and are not proof of failure or of serotonin syndrome. A benzodiazepine can take the edge off anxiety and insomnia and can be habit-forming; it is not an antidepressant and is a poor substitute. Sertraline is not a dopamine-reuptake blocker as its main action. A three-day trial does not falsify the diagnosis. Alprazolam does not treat melancholia by increasing serotonin reuptake. Doubling the dose for mild early jitteriness risks real toxicity and is not the move.$s1_162ne$,
  177, 102, 121, 102,
  1.735294, 1.186275
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_163id$dbedcb46-beb3-4cf1-a44f-b5b74243f9f6$s1_163id$,
  $s1_163st$usmle-step-1$s1_163st$,
  1,
  $s1_163oo${"options": ["They decrease intestinal calcium absorption, increase urinary calcium loss, and suppress osteoblasts, so fracture risk rises within months", "They increase osteoblast activity and bone density", "Fractures require ten years of exposure", "A normal serum calcium means the bone is unaffected", "Steroids raise vitamin D action on the gut"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Steroid osteoporosis", "kind": "vignette"}$s1_163oo$,
  $s1_163no${"options": ["They decrease gut calcium absorption, increase urinary calcium loss, and suppress osteoblasts", "They increase osteoblast activity and bone density over the first months of treatment", "Fractures require ten years of exposure and a documented fall in serum calcium", "A normal serum calcium means the skeleton is unaffected by the glucocorticoid", "Steroids increase vitamin D action on the gut and raise net calcium absorption"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Steroid osteoporosis", "kind": "vignette"}$s1_163no$,
  $s1_163oc$They decrease intestinal calcium absorption, increase urinary calcium loss, and suppress osteoblasts, so fracture risk rises within months$s1_163oc$,
  $s1_163nc$They decrease gut calcium absorption, increase urinary calcium loss, and suppress osteoblasts$s1_163nc$,
  $s1_163oe$Glucocorticoids are a leading cause of secondary osteoporosis. They cut gut calcium absorption, waste calcium in urine, and turn off osteoblast bone formation, with more resorption early. Vertebral fractures happen early, not only after a decade. Serum calcium can stay normal while the skeleton is losing mineral, just as in primary osteoporosis. They impair, not enhance, vitamin D-mediated absorption.$s1_163oe$,
  $s1_163ne$Glucocorticoids are a leading cause of secondary osteoporosis. They cut gut calcium absorption, waste calcium in urine, and turn off osteoblast bone formation, with more resorption early. Vertebral fractures happen early, not only after a decade. Serum calcium can stay normal while the skeleton is losing mineral, just as in primary osteoporosis. They impair, not enhance, vitamin D-mediated absorption.$s1_163ne$,
  138, 51, 93, 85,
  2.705882, 1.094118
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_164id$dd58d8cb-ea88-41b8-866f-96eb49427d2d$s1_164id$,
  $s1_164st$usmle-step-1$s1_164st$,
  1,
  $s1_164oo${"options": ["Porphobilinogen deaminase is low in acute intermittent porphyria; CYP inducers increase ALA synthase and flood the pathway proximal to the block", "Ferrochelatase is the enzyme of acute intermittent porphyria, and the urine is red from lead", "Barbiturates inhibit ALA synthase, so they treat the attack", "Sulfonamides are safe because they do not induce hepatic ALA synthase", "Photosensitivity is required for acute intermittent porphyria"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Porphyria acute", "kind": "vignette"}$s1_164oo$,
  $s1_164no${"options": ["Porphobilinogen deaminase is low; barbiturates induce ALA synthase and flood the pathway above the block", "Ferrochelatase is the enzyme of acute intermittent porphyria, and the urine turns red from lead", "Barbiturates inhibit ALA synthase, so they treat the attack and clear the porphobilinogen", "Sulfonamides are safe because they do not induce hepatic ALA synthase", "Photosensitivity during the attack is required to call this acute intermittent porphyria"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Porphyria acute", "kind": "vignette"}$s1_164no$,
  $s1_164oc$Porphobilinogen deaminase is low in acute intermittent porphyria; CYP inducers increase ALA synthase and flood the pathway proximal to the block$s1_164oc$,
  $s1_164nc$Porphobilinogen deaminase is low; barbiturates induce ALA synthase and flood the pathway above the block$s1_164nc$,
  $s1_164oe$Acute intermittent porphyria is a partial block of porphobilinogen deaminase. Inducers of hepatic ALA synthase, such as barbiturates, push more substrate into the pathway, ALA and PBG rise, and the attack is abdominal pain, neuropsychiatric change, and a motor neuropathy, often with SIADH. Lead inhibits ferrochelatase and ALA dehydratase and causes a different, chronic picture with anemia and stippling. Barbiturates worsen, not treat, the attack. Sulfonamides are also inducers and are avoided. Acute intermittent porphyria does not make the skin-photosensitizing porphyrins; that is a later-pathway porphyria.$s1_164oe$,
  $s1_164ne$Acute intermittent porphyria is a partial block of porphobilinogen deaminase. Inducers of hepatic ALA synthase, such as barbiturates, push more substrate into the pathway, ALA and PBG rise, and the attack is abdominal pain, neuropsychiatric change, and a motor neuropathy, often with SIADH. Lead inhibits ferrochelatase and ALA dehydratase and causes a different, chronic picture with anemia and stippling. Barbiturates worsen, not treat, the attack. Sulfonamides are also inducers and are avoided. Acute intermittent porphyria does not make the skin-photosensitizing porphyrins; that is a later-pathway porphyria.$s1_164ne$,
  144, 92, 104, 95,
  1.565217, 1.094737
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_165id$e0410828-751f-403f-979e-e55ed7b00e45$s1_165id$,
  $s1_165st$usmle-step-1$s1_165st$,
  1,
  $s1_165oo${"options": ["Warm is IgG, extravascular, associated with lupus; cold is IgM, fixes complement in the periphery, and follows mycoplasma or lymphoma", "Both are IgM", "Cold agglutinin disease is IgG against Rh", "Warm antibodies agglutinate only in the fingers", "Spherocytes mean the antibody is IgM"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Warm versus cold antibody", "kind": "vignette"}$s1_165oo$,
  $s1_165no${"options": ["Warm is IgG, extravascular, and linked to lupus; cold is IgM, fixes complement, and follows mycoplasma or lymphoma", "Both are IgM and lyse red cells in warm central blood and in the spleen", "Cold agglutinin disease is IgG against Rh antigen and causes splenic extravascular hemolysis in warm blood", "Warm antibodies agglutinate only in the fingers and ears when the patient is outdoors", "Spherocytes mean the antibody is IgM and hemolysis is inside the vessel"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Warm versus cold antibody", "kind": "vignette"}$s1_165no$,
  $s1_165oc$Warm is IgG, extravascular, associated with lupus; cold is IgM, fixes complement in the periphery, and follows mycoplasma or lymphoma$s1_165oc$,
  $s1_165nc$Warm is IgG, extravascular, and linked to lupus; cold is IgM, fixes complement, and follows mycoplasma or lymphoma$s1_165nc$,
  $s1_165oe$Warm autoimmune hemolysis is IgG, often against Rh, and the spleen removes the coated cells, making spherocytes. It associates with lupus, CLL, and drugs. Cold agglutinin disease is IgM, which binds in cool fingers, fixes complement, and can follow Mycoplasma or EBV or a lymphoma. Staying warm matters for cold disease; warm disease is a steroid and spleen problem. They are not both IgG. Cold disease is not an Rh IgG. Warm antibodies bind at 37 degrees, not only in the fingers. Spherocytes are the warm, IgG, splenic pattern.$s1_165oe$,
  $s1_165ne$Warm autoimmune hemolysis is IgG, often against Rh, and the spleen removes the coated cells, making spherocytes. It associates with lupus, CLL, and drugs. Cold agglutinin disease is IgM, which binds in cool fingers, fixes complement, and can follow Mycoplasma or EBV or a lymphoma. Staying warm matters for cold disease; warm disease is a steroid and spleen problem. They are not both IgG. Cold disease is not an Rh IgG. Warm antibodies bind at 37 degrees, not only in the fingers. Spherocytes are the warm, IgG, splenic pattern.$s1_165ne$,
  133, 47, 114, 106,
  2.829787, 1.075472
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_166id$e0f2a732-5907-4d2b-a7e8-63201ca31ad4$s1_166id$,
  $s1_166st$usmle-step-1$s1_166st$,
  1,
  $s1_166oo${"options": ["The medial collateral ligament resists valgus; a negative Lachman means the ACL is holding", "The lateral collateral ligament resists valgus", "The ACL is the only restraint to valgus opening", "A negative Lachman confirms an ACL tear", "Opening on valgus is the medial meniscus alone"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "MCL versus LCL", "kind": "vignette"}$s1_166oo$,
  $s1_166no${"options": ["The medial collateral ligament resists valgus; a negative Lachman means the ACL is intact", "The lateral collateral ligament resists valgus stress across the knee joint", "The ACL is the only restraint to valgus opening once the capsule gives way", "A negative Lachman confirms an ACL tear together with valgus instability", "Opening on valgus is the medial meniscus alone, with both collaterals intact"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "MCL versus LCL", "kind": "vignette"}$s1_166no$,
  $s1_166oc$The medial collateral ligament resists valgus; a negative Lachman means the ACL is holding$s1_166oc$,
  $s1_166nc$The medial collateral ligament resists valgus; a negative Lachman means the ACL is intact$s1_166nc$,
  $s1_166oe$Valgus opens the medial side and tests the MCL. Varus tests the LCL. Lachman tests the ACL and is negative here, so the cruciate is not the structure that opened. The LCL does not resist valgus. The ACL is an anterior restraint, not the collateral that stops side-to-side opening. A negative Lachman is a reassuring ACL exam, not a tear. Isolated opening without locking is the ligament, not a bucket-handle meniscus.$s1_166oe$,
  $s1_166ne$Valgus opens the medial side and tests the MCL. Varus tests the LCL. Lachman tests the ACL and is negative here, so the cruciate is not the structure that opened. The LCL does not resist valgus. The ACL is an anterior restraint, not the collateral that stops side-to-side opening. A negative Lachman is a reassuring ACL exam, not a tear. Isolated opening without locking is the ligament, not a bucket-handle meniscus.$s1_166ne$,
  90, 47, 89, 76,
  1.914894, 1.171053
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_167id$e1919953-1172-456a-9f0b-540af9effddf$s1_167id$,
  $s1_167st$usmle-step-1$s1_167st$,
  1,
  $s1_167oo${"options": ["Sustained high estradiol becomes positive feedback at the pituitary and hypothalamus and triggers the LH surge; progesterone from the corpus luteum then raises temperature", "Estrogen is only inhibitory, so the surge is FSH from the ovary", "Progesterone triggers the LH surge and temperature falls after ovulation", "The LH surge follows menstruation by one day", "Ovulation is caused by a drop in estradiol to zero"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Menstrual cycle LH surge", "kind": "vignette"}$s1_167oo$,
  $s1_167no${"options": ["High estradiol switches to positive feedback and triggers the LH surge; luteal progesterone then raises temperature", "Estrogen is only inhibitory at the pituitary and hypothalamus, so the surge is FSH released from the ovary", "Progesterone triggers the LH surge, and basal temperature falls once ovulation occurs", "The LH surge follows the onset of menses by a single day in a normal cycle", "Ovulation is caused by estradiol falling to zero just before the corpus luteum forms"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Menstrual cycle LH surge", "kind": "vignette"}$s1_167no$,
  $s1_167oc$Sustained high estradiol becomes positive feedback at the pituitary and hypothalamus and triggers the LH surge; progesterone from the corpus luteum then raises temperature$s1_167oc$,
  $s1_167nc$High estradiol switches to positive feedback and triggers the LH surge; luteal progesterone then raises temperature$s1_167nc$,
  $s1_167oe$Low or moderate estrogen inhibits gonadotropins. When estradiol stays high through the late follicular phase, feedback flips and LH surges, which ovulates the follicle. After ovulation the corpus luteum makes progesterone, which is thermogenic, so the temperature rise is a post-ovulation sign, not the trigger. Calling estrogen only inhibitory misses the switch. FSH does not surge as the ovulatory signal in that way. Progesterone is not the pre-ovulatory trigger, and temperature rises rather than falls. The surge is mid-cycle, not the day after menses. Estradiol is high, not zero, when the surge starts.$s1_167oe$,
  $s1_167ne$Low or moderate estrogen inhibits gonadotropins. When estradiol stays high through the late follicular phase, feedback flips and LH surges, which ovulates the follicle. After ovulation the corpus luteum makes progesterone, which is thermogenic, so the temperature rise is a post-ovulation sign, not the trigger. Calling estrogen only inhibitory misses the switch. FSH does not surge as the ovulatory signal in that way. Progesterone is not the pre-ovulatory trigger, and temperature rises rather than falls. The surge is mid-cycle, not the day after menses. Estradiol is high, not zero, when the surge starts.$s1_167ne$,
  171, 72, 115, 106,
  2.375000, 1.084906
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_168id$e49fb49d-2d27-4b82-b5ad-60c32a7ed4f6$s1_168id$,
  $s1_168st$usmle-step-1$s1_168st$,
  1,
  $s1_168oo${"options": ["Endometrial glands are outside the uterus, often on the ovary or peritoneum; adenomyosis is endometrial tissue within the myometrium", "Both are endometrial tissue confined to the cavity", "Powder-burn lesions are cervical cancer", "Painful menses mean she is not ovulating", "Infertility with cyclic pain is explained by an absent uterus"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Endometriosis", "kind": "vignette"}$s1_168oo$,
  $s1_168no${"options": ["Endometriosis is glands outside the uterus; adenomyosis is endometrial tissue inside the myometrium", "Both are endometrial tissue confined to the uterine cavity, and the myometrium is spared", "Powder-burn peritoneal lesions are implants of cervical carcinoma", "Painful menses mean she is anovulatory and the endometrium is inactive", "Infertility with cyclic pain is explained by congenital absence of the uterus"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Endometriosis", "kind": "vignette"}$s1_168no$,
  $s1_168oc$Endometrial glands are outside the uterus, often on the ovary or peritoneum; adenomyosis is endometrial tissue within the myometrium$s1_168oc$,
  $s1_168nc$Endometriosis is glands outside the uterus; adenomyosis is endometrial tissue inside the myometrium$s1_168nc$,
  $s1_168oe$Endometriosis is ectopic endometrium that bleeds with the cycle, causing dysmenorrhea, dyspareunia, a fixed uterus, and infertility. Implants look like powder burns, and an ovary can become a chocolate cyst. Adenomyosis is the same tissue grown into the muscle of the uterus, a bulky tender uterus, not peritoneal implants. The cavity is not the only site. Powder burns are not carcinoma. Cyclic pain implies she is having hormonal cycles, not anovulation as the explanation. The uterus is present and often fixed.$s1_168oe$,
  $s1_168ne$Endometriosis is ectopic endometrium that bleeds with the cycle, causing dysmenorrhea, dyspareunia, a fixed uterus, and infertility. Implants look like powder burns, and an ovary can become a chocolate cyst. Adenomyosis is the same tissue grown into the muscle of the uterus, a bulky tender uterus, not peritoneal implants. The cavity is not the only site. Powder burns are not carcinoma. Cyclic pain implies she is having hormonal cycles, not anovulation as the explanation. The uterus is present and often fixed.$s1_168ne$,
  132, 61, 99, 88,
  2.163934, 1.125000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_169id$e5cbd906-f392-46b4-b433-bd5e5d1e2ad9$s1_169id$,
  $s1_169st$usmle-step-1$s1_169st$,
  1,
  $s1_169oo${"options": ["Myositis ossificans matures from the outside in after trauma; osteosarcoma is the reverse, with bone more central and a soft periphery", "Any bone in muscle is osteosarcoma", "Peripheral maturation means a high-grade sarcoma", "The mass should be biopsied in the center first because the edge is the most malignant", "Trauma cannot trigger bone formation in muscle"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Myositis ossificans", "kind": "vignette"}$s1_169oo$,
  $s1_169no${"options": ["Myositis ossificans matures outside-in after trauma; osteosarcoma ossifies from the center outward", "Bone forming inside muscle is osteosarcoma until the resection margin is clear", "Peripheral maturation means a high-grade sarcoma, with the malignant cells at the rim", "The mass should be biopsied in the center first because the edge is the most malignant portion", "Trauma cannot start bone formation in muscle after a contusion or hematoma"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Myositis ossificans", "kind": "vignette"}$s1_169no$,
  $s1_169oc$Myositis ossificans matures from the outside in after trauma; osteosarcoma is the reverse, with bone more central and a soft periphery$s1_169oc$,
  $s1_169nc$Myositis ossificans matures outside-in after trauma; osteosarcoma ossifies from the center outward$s1_169nc$,
  $s1_169oe$After a contusion, heterotopic bone can form in muscle. It ossifies at the periphery first, a zonal pattern that says benign repair. Osteosarcoma is most mature at the center and invasive at the edge. Calling all extra bone a sarcoma leads to a mutilating operation for a process that often settles. Peripheral bone is the reassuring pattern, not the high-grade one. A biopsy of the center of myositis ossificans looks cellular and can be overcalled; the zoning on the film is what saves the diagnosis. Trauma is exactly the trigger.$s1_169oe$,
  $s1_169ne$After a contusion, heterotopic bone can form in muscle. It ossifies at the periphery first, a zonal pattern that says benign repair. Osteosarcoma is most mature at the center and invasive at the edge. Calling all extra bone a sarcoma leads to a mutilating operation for a process that often settles. Peripheral bone is the reassuring pattern, not the high-grade one. A biopsy of the center of myositis ossificans looks cellular and can be overcalled; the zoning on the film is what saves the diagnosis. Trauma is exactly the trigger.$s1_169ne$,
  134, 86, 98, 94,
  1.558140, 1.042553
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_170id$e8efaeac-909b-456d-885b-d2c5bf85bad4$s1_170id$,
  $s1_170st$usmle-step-1$s1_170st$,
  1,
  $s1_170oo${"options": ["Dilation bunched the iris into a narrow angle and blocked aqueous outflow; a miotic such as pilocarpine and a pressure-lowering agent are used, not another dilator", "Dilation opened the angle, so more mydriatic will vent the aqueous", "Atropine constricts the pupil and is the specific antidote", "This is open-angle glaucoma, which presents as an acute hard eye after one drop", "Timolol is unsafe only in asthma and is the cause of the hard eye here"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Acute angle closure", "kind": "vignette"}$s1_170oo$,
  $s1_170no${"options": ["Dilation crowded the iris into the angle and blocked outflow; use a miotic such as pilocarpine, not another dilator", "Dilation opened the angle, so another mydriatic will vent aqueous into the meshwork", "Atropine constricts the pupil and is the specific antidote for this pressure rise", "This is open-angle glaucoma, which presents as an acute hard eye after one dilating drop in the office", "Timolol is unsafe only in asthma and is what made the eye hard in this patient"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Acute angle closure", "kind": "vignette"}$s1_170no$,
  $s1_170oc$Dilation bunched the iris into a narrow angle and blocked aqueous outflow; a miotic such as pilocarpine and a pressure-lowering agent are used, not another dilator$s1_170oc$,
  $s1_170nc$Dilation crowded the iris into the angle and blocked outflow; use a miotic such as pilocarpine, not another dilator$s1_170nc$,
  $s1_170oe$In a susceptible narrow angle, mydriasis thickens the iris at the periphery and blocks the trabecular meshwork. Pressure rises within the hour, the cornea swells, and the patient vomits. The pupil needs to be constricted with pilocarpine once the ischemia allows it, and pressure is lowered with an aqueous suppressant such as acetazolamide or a beta blocker; a second dilator or atropine makes the block worse. Atropine is a mydriatic and anticholinergic; it does not constrict. Open-angle glaucoma is chronic and silent, not a one-hour crisis after a drop. Timolol can treat the pressure; it did not cause this attack, though it is avoided in asthma for a different reason.$s1_170oe$,
  $s1_170ne$In a susceptible narrow angle, mydriasis thickens the iris at the periphery and blocks the trabecular meshwork. Pressure rises within the hour, the cornea swells, and the patient vomits. The pupil needs to be constricted with pilocarpine once the ischemia allows it, and pressure is lowered with an aqueous suppressant such as acetazolamide or a beta blocker; a second dilator or atropine makes the block worse. Atropine is a mydriatic and anticholinergic; it does not constrict. Open-angle glaucoma is chronic and silent, not a one-hour crisis after a drop. Timolol can treat the pressure; it did not cause this attack, though it is avoided in asthma for a different reason.$s1_170ne$,
  163, 79, 115, 102,
  2.063291, 1.127451
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_171id$e9203c84-2459-49fe-80b3-949a64966c4e$s1_171id$,
  $s1_171st$usmle-step-1$s1_171st$,
  1,
  $s1_171oo${"options": ["Rathke pouch remnants form a craniopharyngioma that compresses the chiasm and the pituitary stalk, interrupting ADH and GH", "A prolactinoma calcifies and presents in children as the usual tumor", "ADH is made in the anterior pituitary, so stalk compression spares water balance", "Bitemporal hemianopia means a tumor in the occipital lobe", "GH deficiency from stalk compression makes the child tall"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Craniopharyngioma", "kind": "vignette"}$s1_171oo$,
  $s1_171no${"options": ["Rathke pouch remnants form a craniopharyngioma that compresses the stalk and interrupts ADH", "A prolactinoma calcifies and is the usual suprasellar tumor of childhood", "ADH is made in the anterior pituitary, so stalk compression spares water balance", "Bitemporal hemianopia localizes the mass to the occipital lobe", "Growth hormone loss from stalk compression makes the child tall"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Craniopharyngioma", "kind": "vignette"}$s1_171no$,
  $s1_171oc$Rathke pouch remnants form a craniopharyngioma that compresses the chiasm and the pituitary stalk, interrupting ADH and GH$s1_171oc$,
  $s1_171nc$Rathke pouch remnants form a craniopharyngioma that compresses the stalk and interrupts ADH$s1_171nc$,
  $s1_171oe$Craniopharyngioma comes from Rathke pouch, often calcifies, and sits near the chiasm and stalk in children. Stalk compression blocks inhibitory dopamine (prolactin may rise a little) and, more importantly here, blocks ADH delivery and anterior pituitary releasing signals, so diabetes insipidus and growth failure follow. A prolactinoma is an adult lactotroph tumor and is not the calcified childhood mass. ADH is made in the hypothalamus and released from the posterior pituitary; the stalk carries it. Bitemporal field loss is the chiasm, not the occipital lobe. Lost GH stops growth; it does not make him tall.$s1_171oe$,
  $s1_171ne$Craniopharyngioma comes from Rathke pouch, often calcifies, and sits near the chiasm and stalk in children. Stalk compression blocks inhibitory dopamine (prolactin may rise a little) and, more importantly here, blocks ADH delivery and anterior pituitary releasing signals, so diabetes insipidus and growth failure follow. A prolactinoma is an adult lactotroph tumor and is not the calcified childhood mass. ADH is made in the hypothalamus and released from the posterior pituitary; the stalk carries it. Bitemporal field loss is the chiasm, not the occipital lobe. Lost GH stops growth; it does not make him tall.$s1_171ne$,
  122, 80, 91, 80,
  1.525000, 1.137500
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_172id$eb3f3819-4aa8-4909-96cc-36b4f8bf3ce3$s1_172id$,
  $s1_172st$usmle-step-1$s1_172st$,
  1,
  $s1_172oo${"options": ["Dorsal roots and columns from neurosyphilis, with an Argyll Robertson pupil; B12 can hit the same columns but does not make that pupil", "Spinothalamic tracts only, which carry vibration", "A midbrain Parinaud lesion, which is the Argyll Robertson pupil", "Negative RPR excludes syphilis if the columns are involved", "The foot slap is cerebellar, so proprioception is intact"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Tabes dorsalis", "kind": "vignette"}$s1_172oo$,
  $s1_172no${"options": ["Dorsal columns from neurosyphilis, with an Argyll Robertson pupil; B12 disease lacks that pupil", "Spinothalamic tracts only, which carry vibration and joint-position sense", "A midbrain Parinaud lesion, which produces the Argyll Robertson pupil and column loss", "A negative serum RPR excludes neurosyphilis even when the dorsal columns are involved", "The foot slap is cerebellar, so proprioception is intact and the pupils are unrelated"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Tabes dorsalis", "kind": "vignette"}$s1_172no$,
  $s1_172oc$Dorsal roots and columns from neurosyphilis, with an Argyll Robertson pupil; B12 can hit the same columns but does not make that pupil$s1_172oc$,
  $s1_172nc$Dorsal columns from neurosyphilis, with an Argyll Robertson pupil; B12 disease lacks that pupil$s1_172nc$,
  $s1_172oe$Tabes dorsalis is tertiary syphilis destroying dorsal roots. Proprioception is lost, gait slaps, and pain is lightning-like. The Argyll Robertson pupil accommodates to near but does not react to light. B12 deficiency also hits dorsal columns and corticospinal tracts but does not create that pupil, so stopping at B12 misses the RPR. Vibration is dorsal column, not spinothalamic. Parinaud syndrome is upgaze failure from a pineal mass, not this pupil. A positive RPR is the clue, not a negative one. The slap is sensory ataxia from lost position sense, not a cerebellar hemisphere.$s1_172oe$,
  $s1_172ne$Tabes dorsalis is tertiary syphilis destroying dorsal roots. Proprioception is lost, gait slaps, and pain is lightning-like. The Argyll Robertson pupil accommodates to near but does not react to light. B12 deficiency also hits dorsal columns and corticospinal tracts but does not create that pupil, so stopping at B12 misses the RPR. Vibration is dorsal column, not spinothalamic. Parinaud syndrome is upgaze failure from a pineal mass, not this pupil. A positive RPR is the clue, not a negative one. The slap is sensory ataxia from lost position sense, not a cerebellar hemisphere.$s1_172ne$,
  134, 63, 95, 85,
  2.126984, 1.117647
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_173id$ee7731ec-64fa-478b-8159-29efa4af4a2b$s1_173id$,
  $s1_173st$usmle-step-1$s1_173st$,
  1,
  $s1_173oo${"options": ["The long thoracic nerve to serratus anterior; trapezius winging would weaken the shrug via the accessory nerve", "The accessory nerve, because shrug is lost in serratus injury", "The thoracodorsal nerve, which wings the scapula", "The axillary nerve, which protracts the scapula", "Serratus anterior retracts the scapula"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Long thoracic winging", "kind": "vignette"}$s1_173oo$,
  $s1_173no${"options": ["Long thoracic nerve to serratus anterior; trapezius winging is the accessory nerve and weakens shrug", "The accessory nerve, because shrug is lost when serratus anterior is the weak muscle", "The thoracodorsal nerve, which wings the scapula on forward flexion", "The axillary nerve, which protracts the scapula and holds it to the chest wall", "Serratus anterior retracts the scapula and is supplied by the dorsal scapular nerve"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Long thoracic winging", "kind": "vignette"}$s1_173no$,
  $s1_173oc$The long thoracic nerve to serratus anterior; trapezius winging would weaken the shrug via the accessory nerve$s1_173oc$,
  $s1_173nc$Long thoracic nerve to serratus anterior; trapezius winging is the accessory nerve and weakens shrug$s1_173nc$,
  $s1_173oe$Serratus anterior holds the scapula to the chest during forward push. The long thoracic nerve runs on the chest wall and is vulnerable in axillary surgery. Shrug is trapezius, accessory nerve, and it is intact, so this is not that palsy. The thoracodorsal nerve supplies latissimus dorsi. The axillary nerve supplies deltoid. Serratus protracts and stabilizes; it does not retract.$s1_173oe$,
  $s1_173ne$Serratus anterior holds the scapula to the chest during forward push. The long thoracic nerve runs on the chest wall and is vulnerable in axillary surgery. Shrug is trapezius, accessory nerve, and it is intact, so this is not that palsy. The thoracodorsal nerve supplies latissimus dorsi. The axillary nerve supplies deltoid. Serratus protracts and stabilizes; it does not retract.$s1_173ne$,
  110, 61, 100, 84,
  1.803279, 1.190476
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_174id$f01cff07-240b-4bcb-8706-edea86d2ceba$s1_174id$,
  $s1_174st$usmle-step-1$s1_174st$,
  1,
  $s1_174oo${"options": ["Hamartin and tuberin, tumor suppressors; the heart mass is a rhabdomyoma and the kidney mass is an angiomyolipoma", "Neurofibromin only; the heart mass is an atrial myxoma", "Merlin; the facial lesions are bilateral acoustic neuromas", "A single collagen gene; the leaf-shaped spots are café-au-lait macules", "Huntingtin; the seizure is anticipation of a CAG repeat"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Tuberous sclerosis", "kind": "vignette"}$s1_174oo$,
  $s1_174no${"options": ["Hamartin and tuberin, tumor suppressors; a cardiac rhabdomyoma and a renal angiomyolipoma", "Neurofibromin only; the heart mass is an atrial myxoma and the spots are neurofibromas", "Merlin; the facial lesions are bilateral acoustic neuromas and the kidney is spared", "A single collagen gene; the leaf-shaped spots are cafe-au-lait macules", "Huntingtin; the seizure reflects anticipation of an expanded CAG repeat"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Tuberous sclerosis", "kind": "vignette"}$s1_174no$,
  $s1_174oc$Hamartin and tuberin, tumor suppressors; the heart mass is a rhabdomyoma and the kidney mass is an angiomyolipoma$s1_174oc$,
  $s1_174nc$Hamartin and tuberin, tumor suppressors; a cardiac rhabdomyoma and a renal angiomyolipoma$s1_174nc$,
  $s1_174oe$Tuberous sclerosis is TSC1 or TSC2, hamartin or tuberin, which inhibit mTOR. Ash-leaf spots, facial angiofibromas, seizures from cortical tubers, cardiac rhabdomyoma that often regresses, and renal angiomyolipoma are the cluster. Neurofibromin is NF1 and does not make a rhabdomyoma. Merlin is NF2 and the facial story there is vestibular tumors, not angiofibromas. Café-au-lait macules are NF1, not ash-leaf hypopigmentation. Huntingtin does not cause congenital heart tumors or hypopigmented macules.$s1_174oe$,
  $s1_174ne$Tuberous sclerosis is TSC1 or TSC2, hamartin or tuberin, which inhibit mTOR. Ash-leaf spots, facial angiofibromas, seizures from cortical tubers, cardiac rhabdomyoma that often regresses, and renal angiomyolipoma are the cluster. Neurofibromin is NF1 and does not make a rhabdomyoma. Merlin is NF2 and the facial story there is vestibular tumors, not angiofibromas. Café-au-lait macules are NF1, not ash-leaf hypopigmentation. Huntingtin does not cause congenital heart tumors or hypopigmented macules.$s1_174ne$,
  113, 70, 89, 86,
  1.614286, 1.034884
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_175id$f120c920-f557-4fda-b88f-d1904f327941$s1_175id$,
  $s1_175st$usmle-step-1$s1_175st$,
  1,
  $s1_175oo${"options": ["Auer rods are fused granules in myeloid blasts, so this is AML; TdT-positive blasts in a child are lymphoblasts", "Auer rods define ALL", "Myeloperoxidase is a lymphoid enzyme", "ALL peaks in the seventh decade", "TdT is the myeloid marker"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "AML versus ALL", "kind": "vignette"}$s1_175oo$,
  $s1_175no${"options": ["Auer rods are fused granules in myeloid blasts, marking AML; TdT-positive blasts are lymphoblasts", "Auer rods define ALL and are crystalline inclusions inside lymphoblasts", "Myeloperoxidase is a lymphoid enzyme and stains TdT-positive blasts", "ALL peaks in the seventh decade and commonly contains Auer rods", "TdT is the myeloid marker and is absent from childhood lymphoblastic leukemia blasts"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "AML versus ALL", "kind": "vignette"}$s1_175no$,
  $s1_175oc$Auer rods are fused granules in myeloid blasts, so this is AML; TdT-positive blasts in a child are lymphoblasts$s1_175oc$,
  $s1_175nc$Auer rods are fused granules in myeloid blasts, marking AML; TdT-positive blasts are lymphoblasts$s1_175nc$,
  $s1_175oe$Auer rods and myeloperoxidase mark myeloid differentiation, acute myeloid leukemia, which is the adult blast crisis in this vignette and can cause DIC especially in the promyelocytic subtype. ALL is the childhood disease of lymphoblasts, TdT positive, PAS-positive blocks. Auer rods are not lymphoid. Myeloperoxidase is myeloid. ALL is not an older-adult peak. TdT is the lymphoblast marker.$s1_175oe$,
  $s1_175ne$Auer rods and myeloperoxidase mark myeloid differentiation, acute myeloid leukemia, which is the adult blast crisis in this vignette and can cause DIC especially in the promyelocytic subtype. ALL is the childhood disease of lymphoblasts, TdT positive, PAS-positive blocks. Auer rods are not lymphoid. Myeloperoxidase is myeloid. ALL is not an older-adult peak. TdT is the lymphoblast marker.$s1_175ne$,
  111, 36, 97, 84,
  3.083333, 1.154762
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_176id$f129eaf0-0ba6-42d0-ad20-6f22d0cc6d08$s1_176id$,
  $s1_176st$usmle-step-1$s1_176st$,
  1,
  $s1_176oo${"options": ["Glucokinase in liver and beta cells has a high Km and is not inhibited by glucose-6-phosphate, so it works when glucose is high; hexokinase has a low Km and is product-inhibited", "Hexokinase is the high-Km liver enzyme", "Glucokinase is switched off by insulin", "A glucokinase mutation lowers fasting glucose", "Brain hexokinase stops working at normal glucose so the brain depends on glucokinase"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Glucokinase versus hexokinase", "kind": "vignette"}$s1_176oo$,
  $s1_176no${"options": ["Glucokinase in liver and beta cells has a high Km and is not inhibited by glucose-6-phosphate", "Hexokinase is the high-Km hepatic enzyme and ignores glucose-6-phosphate", "Glucokinase is switched off by insulin and switched on by glucagon during fasting", "A glucokinase mutation lowers fasting glucose by speeding hepatic glucose uptake", "Brain hexokinase stops at ordinary glucose levels, so the brain depends on glucokinase"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Glucokinase versus hexokinase", "kind": "vignette"}$s1_176no$,
  $s1_176oc$Glucokinase in liver and beta cells has a high Km and is not inhibited by glucose-6-phosphate, so it works when glucose is high; hexokinase has a low Km and is product-inhibited$s1_176oc$,
  $s1_176nc$Glucokinase in liver and beta cells has a high Km and is not inhibited by glucose-6-phosphate$s1_176nc$,
  $s1_176oe$Glucokinase (hexokinase IV) is the liver and beta-cell enzyme. Its high Km means it is active when glucose is abundant after a meal, and product inhibition does not shut it off, so the liver can keep taking glucose up to store glycogen. Hexokinase in muscle and brain has a low Km, works at fasting glucose, and is inhibited by glucose-6-phosphate. Calling them the same enzyme misses the sensor role. Glucokinase is induced in the fed state; it is not turned off by insulin. Heterozygous glucokinase mutations cause stable mild hyperglycemia (MODY2), not hypoglycemia. The brain relies on low-Km hexokinase so it is fed at ordinary glucose levels.$s1_176oe$,
  $s1_176ne$Glucokinase (hexokinase IV) is the liver and beta-cell enzyme. Its high Km means it is active when glucose is abundant after a meal, and product inhibition does not shut it off, so the liver can keep taking glucose up to store glycogen. Hexokinase in muscle and brain has a low Km, works at fasting glucose, and is inhibited by glucose-6-phosphate. Calling them the same enzyme misses the sensor role. Glucokinase is induced in the fed state; it is not turned off by insulin. Heterozygous glucokinase mutations cause stable mild hyperglycemia (MODY2), not hypoglycemia. The brain relies on low-Km hexokinase so it is fed at ordinary glucose levels.$s1_176ne$,
  177, 84, 93, 86,
  2.107143, 1.081395
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_177id$f18f72f8-e945-4d1e-86a6-5478758c92f5$s1_177id$,
  $s1_177st$usmle-step-1$s1_177st$,
  1,
  $s1_177oo${"options": ["BCR-ABL from t(9;22) is a tyrosine kinase that drives CML; LAP is low, whereas a reactive leukemoid count has a high LAP and no basophilia", "Leukemoid reactions have low LAP and basophilia", "The Philadelphia chromosome is t(15;17)", "Imatinib blocks a retinoic-acid receptor", "The spleen is small in CML"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "CML versus leukemoid", "kind": "vignette"}$s1_177oo$,
  $s1_177no${"options": ["BCR-ABL from t(9;22) drives CML and LAP is low; a leukemoid reaction has high LAP and no basophilia", "Leukemoid reactions have low LAP and basophilia, like a myeloproliferative count", "The Philadelphia chromosome is t(15;17) and fuses a retinoic-acid receptor", "Imatinib blocks a retinoic-acid receptor and matures the promyelocytes", "The spleen stays small in CML because the extra leukocytes remain in the blood"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "CML versus leukemoid", "kind": "vignette"}$s1_177no$,
  $s1_177oc$BCR-ABL from t(9;22) is a tyrosine kinase that drives CML; LAP is low, whereas a reactive leukemoid count has a high LAP and no basophilia$s1_177oc$,
  $s1_177nc$BCR-ABL from t(9;22) drives CML and LAP is low; a leukemoid reaction has high LAP and no basophilia$s1_177nc$,
  $s1_177oe$CML is the BCR-ABL tyrosine kinase, t(9;22). Neutrophils are poorly differentiated in function, so LAP is low, basophils are up, and the spleen is large. A leukemoid reaction to infection has a high LAP, toxic granules, and no basophilia. The LAP and the basophils are the separator before the karyotype. t(15;17) is acute promyelocytic leukemia. Imatinib blocks the ABL kinase, not a retinoic-acid receptor; ATRA is the promyelocytic drug. The spleen is big.$s1_177oe$,
  $s1_177ne$CML is the BCR-ABL tyrosine kinase, t(9;22). Neutrophils are poorly differentiated in function, so LAP is low, basophils are up, and the spleen is large. A leukemoid reaction to infection has a high LAP, toxic granules, and no basophilia. The LAP and the basophils are the separator before the karyotype. t(15;17) is acute promyelocytic leukemia. Imatinib blocks the ABL kinase, not a retinoic-acid receptor; ATRA is the promyelocytic drug. The spleen is big.$s1_177ne$,
  138, 47, 99, 80,
  2.936170, 1.237500
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_178id$f1bde1bb-e40b-45c6-bf83-b49976bb3fee$s1_178id$,
  $s1_178st$usmle-step-1$s1_178st$,
  1,
  $s1_178oo${"options": ["HGPRT is absent, so PRPP accumulates and purines are overproduced; allopurinol lowers uric acid but does not restore the salvage pathway in the brain", "Adenosine deaminase is absent, so this is SCID with gout", "Xanthine oxidase is absent, so uric acid is high", "HGPRT is overactive, and allopurinol replaces it", "The orange sand is homogentisic acid, so this is alkaptonuria"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Lesch-Nyhan", "kind": "vignette"}$s1_178oo$,
  $s1_178no${"options": ["HGPRT is absent and purines are overproduced; allopurinol lowers urate but does not restore brain salvage", "Adenosine deaminase is absent, so this is SCID presenting with gout and self-injury", "Xanthine oxidase is absent, so uric acid is high and allopurinol has no enzyme left to block", "HGPRT is overactive, and allopurinol replaces that salvage enzyme in the basal ganglia", "The orange sand is homogentisic acid, so this is alkaptonuria with self-injury"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Lesch-Nyhan", "kind": "vignette"}$s1_178no$,
  $s1_178oc$HGPRT is absent, so PRPP accumulates and purines are overproduced; allopurinol lowers uric acid but does not restore the salvage pathway in the brain$s1_178oc$,
  $s1_178nc$HGPRT is absent and purines are overproduced; allopurinol lowers urate but does not restore brain salvage$s1_178nc$,
  $s1_178oe$Lesch-Nyhan syndrome is X-linked loss of hypoxanthine-guanine phosphoribosyltransferase. Salvage fails, PRPP drives new purine synthesis, and uric acid rises, which stones the diaper and causes gout. The neurologic self-injury is part of the enzyme loss in brain and is not fixed by lowering uric acid with allopurinol or febuxostat. Adenosine deaminase deficiency is a form of SCID, not self-mutilation and sand. If xanthine oxidase were absent, uric acid would be low. The enzyme is missing, not overactive. Homogentisic acid darkens urine in alkaptonuria and does not cause this behavior.$s1_178oe$,
  $s1_178ne$Lesch-Nyhan syndrome is X-linked loss of hypoxanthine-guanine phosphoribosyltransferase. Salvage fails, PRPP drives new purine synthesis, and uric acid rises, which stones the diaper and causes gout. The neurologic self-injury is part of the enzyme loss in brain and is not fixed by lowering uric acid with allopurinol or febuxostat. Adenosine deaminase deficiency is a form of SCID, not self-mutilation and sand. If xanthine oxidase were absent, uric acid would be low. The enzyme is missing, not overactive. Homogentisic acid darkens urine in alkaptonuria and does not cause this behavior.$s1_178ne$,
  149, 61, 105, 92,
  2.442623, 1.141304
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_179id$f3786dbb-bf1d-420b-b22f-3229cf3c7e97$s1_179id$,
  $s1_179st$usmle-step-1$s1_179st$,
  1,
  $s1_179oo${"options": ["Otoconia in a semicircular canal bend the cupula with position change; a canalith repositioning maneuver clears them, and a suppressant only sedates", "Endolymphatic hydrops, so low-salt diet and diuretics are the repositioning equivalent", "The vestibular nerve is inflamed, so steroids and a long suppressant are specific", "A cerebellar stroke, because fatigable nystagmus with latency is central", "Perilymph fistula, which is fixed by the Epley maneuver"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Benign positional vertigo", "kind": "vignette"}$s1_179oo$,
  $s1_179no${"options": ["Otoconia in a canal bend the cupula when position changes; repositioning clears them, and meclizine only sedates", "Endolymphatic hydrops, so salt restriction and a diuretic replace a canalith maneuver for this nystagmus", "The vestibular nerve is inflamed, so a steroid plus a prolonged suppressant is specific therapy", "A cerebellar stroke, because nystagmus that fatigues and has a latency is a central sign", "A perilymph fistula, which the Epley maneuver seals without activity limits"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Benign positional vertigo", "kind": "vignette"}$s1_179no$,
  $s1_179oc$Otoconia in a semicircular canal bend the cupula with position change; a canalith repositioning maneuver clears them, and a suppressant only sedates$s1_179oc$,
  $s1_179nc$Otoconia in a canal bend the cupula when position changes; repositioning clears them, and meclizine only sedates$s1_179nc$,
  $s1_179oe$Short, positional, latent, fatigable vertigo with torsional nystagmus is canalithiasis, usually the posterior canal. The particles are displaced otoliths. The Epley or similar maneuver moves them back to the utricle. Meclizine can dull the sensation and cause falls in older adults; it does not remove the stone. Endolymphatic hydrops is Ménière disease, with hearing loss and longer attacks. Vestibular neuritis is continuous, not a few-second roll-in-bed spell. Central nystagmus is often immediate and nonfatigable, the opposite of this latency and fatigue. A fistula is pressure- or strain-triggered and is not cured by repositioning.$s1_179oe$,
  $s1_179ne$Short, positional, latent, fatigable vertigo with torsional nystagmus is canalithiasis, usually the posterior canal. The particles are displaced otoliths. The Epley or similar maneuver moves them back to the utricle. Meclizine can dull the sensation and cause falls in older adults; it does not remove the stone. Endolymphatic hydrops is Ménière disease, with hearing loss and longer attacks. Vestibular neuritis is continuous, not a few-second roll-in-bed spell. Central nystagmus is often immediate and nonfatigable, the opposite of this latency and fatigue. A fistula is pressure- or strain-triggered and is not cured by repositioning.$s1_179ne$,
  148, 86, 112, 104,
  1.720930, 1.076923
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_180id$f3c1a999-876b-45f7-b07e-dec8ae1ffa9c$s1_180id$,
  $s1_180st$usmle-step-1$s1_180st$,
  1,
  $s1_180oo${"options": ["The femoral nerve, from L2-L4, innervates quadriceps and the saphenous skin; obturator adducts the thigh", "The obturator nerve extends the knee", "The sciatic nerve is the only knee extensor", "The tibial nerve supplies the quadriceps", "Medial leg numbness is the sural nerve, which is femoral"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Femoral nerve versus obturator", "kind": "vignette"}$s1_180oo$,
  $s1_180no${"options": ["The femoral nerve, from L2-L4, innervates quadriceps to extend the knee; the obturator adducts", "The obturator nerve extends the knee and supplies sensation on the medial leg", "The sciatic nerve is the only knee extensor, acting through the quadriceps", "The tibial nerve supplies the quadriceps and the patellar tendon reflex", "Medial leg numbness is the sural nerve, a distal branch of the femoral nerve"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "Femoral nerve versus obturator", "kind": "vignette"}$s1_180no$,
  $s1_180oc$The femoral nerve, from L2-L4, innervates quadriceps and the saphenous skin; obturator adducts the thigh$s1_180oc$,
  $s1_180nc$The femoral nerve, from L2-L4, innervates quadriceps to extend the knee; the obturator adducts$s1_180nc$,
  $s1_180oe$Femoral nerve injury loses knee extension and sensation on the anterior thigh and the medial leg via the saphenous nerve. Adduction is obturator and is intact here, so the pelvis injury did not pick the obturator. The sciatic nerve flexes the knee (hamstrings) and moves the foot; it does not extend the knee. The tibial nerve is a sciatic division below the knee. The sural nerve is sensory on the lateral foot, not the medial leg.$s1_180oe$,
  $s1_180ne$Femoral nerve injury loses knee extension and sensation on the anterior thigh and the medial leg via the saphenous nerve. Adduction is obturator and is intact here, so the pelvis injury did not pick the obturator. The sciatic nerve flexes the knee (hamstrings) and moves the foot; it does not extend the knee. The tibial nerve is a sciatic division below the knee. The sural nerve is sensory on the lateral foot, not the medial leg.$s1_180ne$,
  104, 56, 94, 77,
  1.857143, 1.220779
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_181id$f46f115d-9dfa-421e-9f1e-7469b8ea99a9$s1_181id$,
  $s1_181st$usmle-step-1$s1_181st$,
  1,
  $s1_181oo${"options": ["NAPQI is normally glutathione-conjugated; N-acetylcysteine restores glutathione and can still help after absorption, so you do not wait for failure", "The parent drug is directly toxic to the liver and charcoal at 10 hours is the only antidote", "N-acetylcysteine is useless once the drug is absorbed", "Fomepizole blocks CYP2E1 as the first-line specific antidote", "Rising enzymes mean the injury is finished and glutathione no longer matters"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Acetaminophen toxicity", "kind": "vignette"}$s1_181oo$,
  $s1_181no${"options": ["NAPQI exhausts glutathione; N-acetylcysteine restores it and still helps after the drug is absorbed", "The parent drug is directly hepatotoxic, and charcoal at 10 hours is the only antidote", "N-acetylcysteine is useless once the tablets have left the stomach", "Fomepizole blocks CYP2E1 and is the specific antidote for this ingestion", "Rising transaminases mean the injury is finished and more glutathione will not matter"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Acetaminophen toxicity", "kind": "vignette"}$s1_181no$,
  $s1_181oc$NAPQI is normally glutathione-conjugated; N-acetylcysteine restores glutathione and can still help after absorption, so you do not wait for failure$s1_181oc$,
  $s1_181nc$NAPQI exhausts glutathione; N-acetylcysteine restores it and still helps after the drug is absorbed$s1_181nc$,
  $s1_181oe$CYP2E1 makes NAPQI. Glutathione detoxifies it; overdose exhausts glutathione and NAPQI binds hepatocyte proteins. N-acetylcysteine replenishes glutathione and is given based on the nomogram or a dangerous history, not after transplant-level failure. Charcoal only helps very early and does not replace the antidote at 10 hours. The antidote still works after absorption because it restores the cofactor, not because it binds drug in the gut. Fomepizole is for toxic alcohols. Early enzyme rise is the start of injury, which is why the antidote is given now.$s1_181oe$,
  $s1_181ne$CYP2E1 makes NAPQI. Glutathione detoxifies it; overdose exhausts glutathione and NAPQI binds hepatocyte proteins. N-acetylcysteine replenishes glutathione and is given based on the nomogram or a dangerous history, not after transplant-level failure. Charcoal only helps very early and does not replace the antidote at 10 hours. The antidote still works after absorption because it restores the cofactor, not because it binds drug in the gut. Fomepizole is for toxic alcohols. Early enzyme rise is the start of injury, which is why the antidote is given now.$s1_181ne$,
  147, 92, 99, 86,
  1.597826, 1.151163
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_182id$f49fe138-c74c-4808-8759-622eff105ee2$s1_182id$,
  $s1_182st$usmle-step-1$s1_182st$,
  1,
  $s1_182oo${"options": ["Leydig cells make testosterone and can form crystals of Reinke; Sertoli cells support spermatogenesis and make inhibin and AMH", "Sertoli cells make testosterone", "A Leydig tumor delays puberty", "Reinke crystals are the seminoma marker", "Inhibin is the Leydig product that virilizes"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sertoli versus Leydig", "kind": "vignette"}$s1_182oo$,
  $s1_182no${"options": ["Leydig cells make testosterone and Reinke crystals; Sertoli cells make inhibin and AMH", "Sertoli cells make testosterone and can form Reinke crystals in a virilizing tumor", "A Leydig-cell tumor delays puberty by diverting androgen to inactive metabolites", "Reinke crystals are the histologic marker of seminoma", "Inhibin is the Leydig-cell product that virilizes the child"], "blueprintSystem": "reproductive-endocrine", "taskCategory": "interpretation", "blueprintTopic": "Sertoli versus Leydig", "kind": "vignette"}$s1_182no$,
  $s1_182oc$Leydig cells make testosterone and can form crystals of Reinke; Sertoli cells support spermatogenesis and make inhibin and AMH$s1_182oc$,
  $s1_182nc$Leydig cells make testosterone and Reinke crystals; Sertoli cells make inhibin and AMH$s1_182nc$,
  $s1_182oe$Leydig cells are the interstitial androgen source. A Leydig-cell tumor can virilize a child, and Reinke crystals are the histologic clue. Sertoli cells nurse germ cells, make inhibin (feedback on FSH) and anti-Müllerian hormone, and do not make the testosterone surge. A testosterone-secreting tumor advances puberty, it does not delay it. Seminoma is a germ-cell tumor without Reinke crystals. Inhibin does not virilize.$s1_182oe$,
  $s1_182ne$Leydig cells are the interstitial androgen source. A Leydig-cell tumor can virilize a child, and Reinke crystals are the histologic clue. Sertoli cells nurse germ cells, make inhibin (feedback on FSH) and anti-Müllerian hormone, and do not make the testosterone surge. A testosterone-secreting tumor advances puberty, it does not delay it. Seminoma is a germ-cell tumor without Reinke crystals. Inhibin does not virilize.$s1_182ne$,
  126, 44, 86, 82,
  2.863636, 1.048780
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_183id$f8440e4a-64d1-46cc-a33c-63047dbdd805$s1_183id$,
  $s1_183st$usmle-step-1$s1_183st$,
  1,
  $s1_183oo${"options": ["A is slipped capital femoral epiphysis and needs urgent stabilization; B is Legg-Calve-Perthes, idiopathic osteonecrosis in a younger child", "Both are septic hips and need drainage tonight", "B is the SCFE because he is younger", "A can bear weight so the slip is stable and follow-up in six months is fine", "Perthes disease is a slipped epiphysis on the x-ray"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "SCFE versus Perthes", "kind": "vignette"}$s1_183oo$,
  $s1_183no${"options": ["A is slipped capital femoral epiphysis and needs urgent fixation; B is Perthes disease, osteonecrosis in a younger child", "Both are septic arthritis of the hip and need drainage tonight, before the epiphysis loses its blood supply", "B is the slipped epiphysis because he is younger and the femoral head is already dead", "A can bear weight, so the slip is stable and a visit in six months is enough", "Perthes disease is a slipped capital femoral epiphysis that the radiograph already shows"], "blueprintSystem": "msk-skin", "taskCategory": "interpretation", "blueprintTopic": "SCFE versus Perthes", "kind": "vignette"}$s1_183no$,
  $s1_183oc$A is slipped capital femoral epiphysis and needs urgent stabilization; B is Legg-Calve-Perthes, idiopathic osteonecrosis in a younger child$s1_183oc$,
  $s1_183nc$A is slipped capital femoral epiphysis and needs urgent fixation; B is Perthes disease, osteonecrosis in a younger child$s1_183nc$,
  $s1_183oe$SCFE is an adolescent, often heavy, whose proximal femoral epiphysis slides. Even a stable-seeming slip is pinned so it does not go on and so osteonecrosis is limited. Perthes is younger children, the head itself necroses and flattens, and the treatment is containment, not the same emergency pin. Infection is a different acute picture. Age runs the other way: SCFE is the teenager. Delayed follow-up of a slip risks further displacement. The Perthes film is a collapsed head, not a slip off the neck.$s1_183oe$,
  $s1_183ne$SCFE is an adolescent, often heavy, whose proximal femoral epiphysis slides. Even a stable-seeming slip is pinned so it does not go on and so osteonecrosis is limited. Perthes is younger children, the head itself necroses and flattens, and the treatment is containment, not the same emergency pin. Infection is a different acute picture. Age runs the other way: SCFE is the teenager. Delayed follow-up of a slip risks further displacement. The Perthes film is a collapsed head, not a slip off the neck.$s1_183ne$,
  139, 75, 120, 107,
  1.853333, 1.121495
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_184id$f89dcd8c-8248-46f6-b8dc-fbd399f3d685$s1_184id$,
  $s1_184st$usmle-step-1$s1_184st$,
  1,
  $s1_184oo${"options": ["NADPH oxidase cannot make superoxide; catalase-positive organisms destroy the hydrogen peroxide the host might have borrowed, so they survive inside the phagocyte", "Myeloperoxidase deficiency is the usual cause of this severe phenotype", "He cannot diapedese, so there is no pus and the burst test is normal", "Adenosine deaminase is missing, so only viral infections occur", "The burst is intact and the test result was described backward"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Chronic granulomatous disease", "kind": "vignette"}$s1_184oo$,
  $s1_184no${"options": ["NADPH oxidase cannot make superoxide; catalase-positive organisms destroy peroxide the host might borrow", "Myeloperoxidase deficiency is the usual cause of this severe catalase-positive phenotype", "He cannot leave the vessels, so no pus forms and the burst assay is normal", "Adenosine deaminase is missing, so the infections are viral and fungal rather than bacterial", "The oxidative burst is intact, and the nitroblue tetrazolium result was read backward"], "blueprintSystem": "multisystem", "taskCategory": "interpretation", "blueprintTopic": "Chronic granulomatous disease", "kind": "vignette"}$s1_184no$,
  $s1_184oc$NADPH oxidase cannot make superoxide; catalase-positive organisms destroy the hydrogen peroxide the host might have borrowed, so they survive inside the phagocyte$s1_184oc$,
  $s1_184nc$NADPH oxidase cannot make superoxide; catalase-positive organisms destroy peroxide the host might borrow$s1_184nc$,
  $s1_184oe$Chronic granulomatous disease is NADPH oxidase failure, often X-linked. No superoxide is made. Organisms that bring their own catalase degrade whatever peroxide leaks in, so Staph and Aspergillus thrive. Myeloperoxidase deficiency is usually mild. Leukocyte adhesion deficiency has sky-high neutrophils, no pus, and a normal burst. Adenosine deaminase deficiency is a form of SCID with viral and opportunistic disease. The test showed no burst; that is the diagnosis, not a reversed result.$s1_184oe$,
  $s1_184ne$Chronic granulomatous disease is NADPH oxidase failure, often X-linked. No superoxide is made. Organisms that bring their own catalase degrade whatever peroxide leaks in, so Staph and Aspergillus thrive. Myeloperoxidase deficiency is usually mild. Leukocyte adhesion deficiency has sky-high neutrophils, no pus, and a normal burst. Adenosine deaminase deficiency is a form of SCID with viral and opportunistic disease. The test showed no burst; that is the diagnosis, not a reversed result.$s1_184ne$,
  162, 70, 104, 92,
  2.314286, 1.130435
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s1_185id$fdaa5f15-30a9-4644-9f45-ffc0892f6df5$s1_185id$,
  $s1_185st$usmle-step-1$s1_185st$,
  1,
  $s1_185oo${"options": ["Xanthochromia is bilirubin from blood broken down in the CSF, and a stable red-cell count across tubes fits subarachnoid blood; a traumatic tap clears and is not xanthochromic that early", "A falling red-cell count from tube 1 to tube 4 proves subarachnoid hemorrhage", "Xanthochromia appears within five minutes of a traumatic tap", "A negative CT at 12 hours never needs a lumbar puncture", "Yellow CSF is only from a high protein of Guillain-Barre"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Subarachnoid xanthochromia", "kind": "vignette"}$s1_185oo$,
  $s1_185no${"options": ["Xanthochromia is bilirubin from blood already in CSF, with a stable red-cell count; a traumatic tap clears and is not xanthochromic early", "A falling red-cell count from tube 1 to tube 4 proves subarachnoid blood has been present for hours", "Xanthochromia appears within minutes of a traumatic tap, the count stays flat, and this is taken to prove subarachnoid hemorrhage", "A negative CT at 12 hours never needs a lumbar puncture to look for aneurysmal blood", "Yellow CSF is only the high protein of Guillain-Barre and fades from tube 1 to tube 4"], "blueprintSystem": "behavioral-nervous", "taskCategory": "interpretation", "blueprintTopic": "Subarachnoid xanthochromia", "kind": "vignette"}$s1_185no$,
  $s1_185oc$Xanthochromia is bilirubin from blood broken down in the CSF, and a stable red-cell count across tubes fits subarachnoid blood; a traumatic tap clears and is not xanthochromic that early$s1_185oc$,
  $s1_185nc$Xanthochromia is bilirubin from blood already in CSF, with a stable red-cell count; a traumatic tap clears and is not xanthochromic early$s1_185nc$,
  $s1_185oe$Blood that has sat in the CSF for hours is metabolized to bilirubin, which yellows the supernatant. A traumatic tap introduces fresh blood that clears across successive tubes and has not had time to become xanthochromic. A count that stays high is not the clearing pattern. Xanthochromia is not an instant tap artifact. CT misses some bleeds, which is why the puncture still matters. High protein can yellow the fluid in other diseases, but not with this headache and a persistent red-cell count.$s1_185oe$,
  $s1_185ne$Blood that has sat in the CSF for hours is metabolized to bilirubin, which yellows the supernatant. A traumatic tap introduces fresh blood that clears across successive tubes and has not had time to become xanthochromic. A count that stays high is not the clearing pattern. Xanthochromia is not an instant tap artifact. CT misses some bleeds, which is why the puncture still matters. High protein can yellow the fluid in other diseases, but not with this headache and a persistent red-cell count.$s1_185ne$,
  186, 77, 137, 129,
  2.415584, 1.062016
);

DO $apply$
DECLARE
  n integer;
BEGIN
  WITH upd AS (
    UPDATE "QuestionBankItem" AS q
    SET
      options = s.new_options,
      "correctAnswer" = s.new_correct,
      explanation = s.new_explanation,
      manual_correction = true,
      "generationMeta" = CASE
        WHEN q."generationMeta" IS NULL THEN '{"manualCorrection": true, "optlenBatch": "20261121-1"}'::jsonb
        WHEN jsonb_typeof(q."generationMeta") = 'object' THEN jsonb_set(
          jsonb_set(q."generationMeta", '{manualCorrection}', 'true'::jsonb, true),
          '{optlenBatch}',
          '"20261121-1"'::jsonb,
          true
        )
        ELSE q."generationMeta"
      END,
      "updatedAt" = NOW()
    FROM qbi_usmle_optlen_20261121_stage AS s
    WHERE q.id = s.id
      AND s.batch = 1
      AND q.options = s.old_options
      AND q."correctAnswer" = s.old_correct
      AND q.explanation = s.old_explanation
    RETURNING q.id
  )
  SELECT COUNT(*) INTO n FROM upd;
  IF n <> 186 THEN
    RAISE EXCEPTION 'updated % rows, expected 186', n;
  END IF;
END
$apply$;

COMMIT;
