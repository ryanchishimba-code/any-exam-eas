-- 00-dry-run.sql
-- NCLEX Management of Care batches 2 and 3, built 2026-10-30. Prepared only. Not RN-reviewed.
-- This file is a dry run. It ends in ROLLBACK and leaves the database unchanged.
-- Target table: "QuestionBankItem". Field: nursing. Subject: management-of-care.
-- 140 new rows (batch 2 v7: 70, batch 3 v4: 70). Inserted inactive. No rewrites. No hides.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: qbi_nclex_moc_b2b3_insert_20261030, qbi_nclex_moc_b2b3_activate_20261030.

BEGIN;
SET LOCAL lock_timeout = '15s';
SET LOCAL statement_timeout = '180s';

CREATE TEMP TABLE moc_b2b3_dry_baseline AS
SELECT
  (SELECT count(*)::int FROM "QuestionBankItem") AS all_rows,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active) AS active_n,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed") AS served,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed") AS moc_served;

CREATE TEMP TABLE moc_b2b3_dry_log (
  step text,
  all_rows int,
  active_n int,
  served int,
  moc_served int
);
INSERT INTO moc_b2b3_dry_log SELECT 'baseline', * FROM moc_b2b3_dry_baseline;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_b2b3_insert_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_moc_b2b3_insert_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Reject the insert when any new stem or content hash is already in the bank.
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE "contentHash" IN ($nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$,
$nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$,
$nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$,
$nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$,
$nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$,
$nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$,
$nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$,
$nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$,
$nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$,
$nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$,
$nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$,
$nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$,
$nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$,
$nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$,
$nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$,
$nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$,
$nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$,
$nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$,
$nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$,
$nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$,
$nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$,
$nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$,
$nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$,
$nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$,
$nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$,
$nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$,
$nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$,
$nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$,
$nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$,
$nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$,
$nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$,
$nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$,
$nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$,
$nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$,
$nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$,
$nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$,
$nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$,
$nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$,
$nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$,
$nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$,
$nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$,
$nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$,
$nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$,
$nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$,
$nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$,
$nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$,
$nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$,
$nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$,
$nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$,
$nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$,
$nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$,
$nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$,
$nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$,
$nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$,
$nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$,
$nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$,
$nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$,
$nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$,
$nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$,
$nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$,
$nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$,
$nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$,
$nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$,
$nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$,
$nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$,
$nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$,
$nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$,
$nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$,
$nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$,
$nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$,
$nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$,
$nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$,
$nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$,
$nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$,
$nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$,
$nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$,
$nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$,
$nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$,
$nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$,
$nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$,
$nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$,
$nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$,
$nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$,
$nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$,
$nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$,
$nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$,
$nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$,
$nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$,
$nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$,
$nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$,
$nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$,
$nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$,
$nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$,
$nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$,
$nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$,
$nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$,
$nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$,
$nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$,
$nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$,
$nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$,
$nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$,
$nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$,
$nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$,
$nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$,
$nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$,
$nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$,
$nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$,
$nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$,
$nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$,
$nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$,
$nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$,
$nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$,
$nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$,
$nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$,
$nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$,
$nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$,
$nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$,
$nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$,
$nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$,
$nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$,
$nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$,
$nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$,
$nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$,
$nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$,
$nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$,
$nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$,
$nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$,
$nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$,
$nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$,
$nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$,
$nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$,
$nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$,
$nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$,
$nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$,
$nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$,
$nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$,
$nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$,
$nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$,
$nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$,
$nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$)
   OR id IN ($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$)
   OR md5(coalesce(scenario, '') || '|' || question) IN ($nclexmocb2b3$0e0f6475e8e6a72a3b6c5593323b3979$nclexmocb2b3$,
$nclexmocb2b3$1de614018a289d20844b5e6a30a1ebf6$nclexmocb2b3$,
$nclexmocb2b3$9f28ee991f7b64909b136cbfcfd31e41$nclexmocb2b3$,
$nclexmocb2b3$94dc4a9e8537b0add56427a46b1eea2e$nclexmocb2b3$,
$nclexmocb2b3$29976b092228f99931dbdcda2364ec49$nclexmocb2b3$,
$nclexmocb2b3$9898086a5e1c8c69793dc2354f5d74d1$nclexmocb2b3$,
$nclexmocb2b3$ba9fc0102f4d709db2239c76d9fa08db$nclexmocb2b3$,
$nclexmocb2b3$ee6dabe35a69d594a8b647ae90db2fe2$nclexmocb2b3$,
$nclexmocb2b3$34966869eaad9f8a174520d353d5e188$nclexmocb2b3$,
$nclexmocb2b3$26b918437c5c751edba25bc0713e39b5$nclexmocb2b3$,
$nclexmocb2b3$5bbbfc711d1cc0cdc0651f502c449c67$nclexmocb2b3$,
$nclexmocb2b3$31c55297f2c13876cba82494c8a7e890$nclexmocb2b3$,
$nclexmocb2b3$380260952099ef548a7a78202533e636$nclexmocb2b3$,
$nclexmocb2b3$1e8e9874106bc150e28a603e9dfb8d70$nclexmocb2b3$,
$nclexmocb2b3$7d4ff3050d1fac78e5a249395bc0cec7$nclexmocb2b3$,
$nclexmocb2b3$111f89c80fece7ebd158417802a1d942$nclexmocb2b3$,
$nclexmocb2b3$5b4d449c80e634886f04d45cf2109824$nclexmocb2b3$,
$nclexmocb2b3$8ce027a90dbd1be43db60a90e2c803b4$nclexmocb2b3$,
$nclexmocb2b3$f5d9194edbad0f2f66f3db21f4eb780b$nclexmocb2b3$,
$nclexmocb2b3$accd24f47152d63825b8806cae229666$nclexmocb2b3$,
$nclexmocb2b3$266b236c908e32776214e5734d2f525c$nclexmocb2b3$,
$nclexmocb2b3$9bb4c79216da1ed266ead58b01ab59fd$nclexmocb2b3$,
$nclexmocb2b3$4d6db0f52f4d49f9c8c70f20af27b47a$nclexmocb2b3$,
$nclexmocb2b3$8a40980d73529dd22ce3bc21df4a3dda$nclexmocb2b3$,
$nclexmocb2b3$9f0afc47acb8e682f483738abf9e0d5d$nclexmocb2b3$,
$nclexmocb2b3$59134b488835f4b02f726e48a50d2166$nclexmocb2b3$,
$nclexmocb2b3$0662270e7aae015ec54f5bf82265233c$nclexmocb2b3$,
$nclexmocb2b3$f24e98c06799639f92c889a250e1654d$nclexmocb2b3$,
$nclexmocb2b3$f33fcf5941348301076d50cbf7f63a45$nclexmocb2b3$,
$nclexmocb2b3$91692d25da031919e9cd6df6373b5ae4$nclexmocb2b3$,
$nclexmocb2b3$c2546c8556ebff45db70537b5801ade6$nclexmocb2b3$,
$nclexmocb2b3$2534af582ab90bd8739962daef3b0788$nclexmocb2b3$,
$nclexmocb2b3$1389b8b0480ef0eb838d92a82724f36c$nclexmocb2b3$,
$nclexmocb2b3$8925b71dfed9d32bbfc6e009b45d7680$nclexmocb2b3$,
$nclexmocb2b3$4f23508583b01f5f9e417bdd26d8b503$nclexmocb2b3$,
$nclexmocb2b3$7a7a75a08f0d1719c372b92bcda5012a$nclexmocb2b3$,
$nclexmocb2b3$e38b7c4a13a12f0bf3b1d2d2b4e88911$nclexmocb2b3$,
$nclexmocb2b3$c6018b79cb01d4d070af01521d75bb7d$nclexmocb2b3$,
$nclexmocb2b3$dfb67ab914121ef42bc21e38174fe35a$nclexmocb2b3$,
$nclexmocb2b3$bfebd9ba4b2b4bdd4ffaf030b97b799a$nclexmocb2b3$,
$nclexmocb2b3$42a82e807ea07df3e0fc35e6d1a52746$nclexmocb2b3$,
$nclexmocb2b3$c347e9470b81abccaff852f676f35006$nclexmocb2b3$,
$nclexmocb2b3$471de184b86ce458f0bbb70b988e9bbd$nclexmocb2b3$,
$nclexmocb2b3$4768a64ff20f3d02d93dea8d8d6e3305$nclexmocb2b3$,
$nclexmocb2b3$4d17de6a69d2ebc5268105d904e98997$nclexmocb2b3$,
$nclexmocb2b3$a7fe11e092169a73ef0d9a3391a06d56$nclexmocb2b3$,
$nclexmocb2b3$2102c91428c384c75b41d32873e423a8$nclexmocb2b3$,
$nclexmocb2b3$7c7288933a752db84fbd4f06e86a899b$nclexmocb2b3$,
$nclexmocb2b3$ddd1e8254a823ef55719983b49c0a33f$nclexmocb2b3$,
$nclexmocb2b3$28d066412980ed87dfb626d386741750$nclexmocb2b3$,
$nclexmocb2b3$72da05d7f897d7279d79fbee04807792$nclexmocb2b3$,
$nclexmocb2b3$d27185d919bc0647a03476e083c001a0$nclexmocb2b3$,
$nclexmocb2b3$d27ba2e3c96c1c2ac1ae6b1d9b5d4320$nclexmocb2b3$,
$nclexmocb2b3$e57c559f37c1092e5b18356014c10c4e$nclexmocb2b3$,
$nclexmocb2b3$40aaf178a7733ed44bc5bc40dbd429d0$nclexmocb2b3$,
$nclexmocb2b3$813f3b4e26b8e91aa6863b4f3c3c78db$nclexmocb2b3$,
$nclexmocb2b3$68f8285a575f40cdfcd2ec37399c8186$nclexmocb2b3$,
$nclexmocb2b3$578bc0c8314e72ff013b0ef06ab2a9f4$nclexmocb2b3$,
$nclexmocb2b3$73b0a66d4037d755570f9f4dc2c6cd8c$nclexmocb2b3$,
$nclexmocb2b3$2d8e6ed6bfd9523474a18a00497074ba$nclexmocb2b3$,
$nclexmocb2b3$5e7522556d32a89906d24ce7eea6befa$nclexmocb2b3$,
$nclexmocb2b3$2d3b4b776ef1de51fdffc455466abbc7$nclexmocb2b3$,
$nclexmocb2b3$e4b9b0f9bb61fcda42e6b7f3679f62a2$nclexmocb2b3$,
$nclexmocb2b3$e4d940c161dd3719effe36a905a4b3a5$nclexmocb2b3$,
$nclexmocb2b3$d60c891af7ce6238528cd0b6fd919e62$nclexmocb2b3$,
$nclexmocb2b3$e17a11e4089731dcca85c00f441dda01$nclexmocb2b3$,
$nclexmocb2b3$3c080e5db67e35760cf8178650357e19$nclexmocb2b3$,
$nclexmocb2b3$33417cd6163122851ec622c6491e5f9a$nclexmocb2b3$,
$nclexmocb2b3$f4ec7d89ded4a4ec024d7dccc08cec4d$nclexmocb2b3$,
$nclexmocb2b3$aac17a65ef1348f036b5e475dcbb8e03$nclexmocb2b3$,
$nclexmocb2b3$1b7f066efc9ba1e8cb135090f4c84c4d$nclexmocb2b3$,
$nclexmocb2b3$c6ed2b99d25285765f9f5f49418fd63d$nclexmocb2b3$,
$nclexmocb2b3$799c7b94e4ead654ad7f81122003a6aa$nclexmocb2b3$,
$nclexmocb2b3$e1f3c223957a49dbfd52ce334c77745d$nclexmocb2b3$,
$nclexmocb2b3$dd7b04da26b9fb4808efe81764d1ffac$nclexmocb2b3$,
$nclexmocb2b3$02cf01feeda31e78f675c6382718c22b$nclexmocb2b3$,
$nclexmocb2b3$41bd9ace3b84f7c6072a1724f1e60b18$nclexmocb2b3$,
$nclexmocb2b3$51b7153555a9e8c2794afd4f5fb349a8$nclexmocb2b3$,
$nclexmocb2b3$67d51a24f6af2c0a20d607455401407e$nclexmocb2b3$,
$nclexmocb2b3$5b0c72af4102d98363166a8ca29d82b3$nclexmocb2b3$,
$nclexmocb2b3$1e78ce4645cfb9c6734d4f80fd3463ba$nclexmocb2b3$,
$nclexmocb2b3$46e2e3f75aba48e1ed23fe038e50a9b2$nclexmocb2b3$,
$nclexmocb2b3$87daf23dc0b9686c03d5de7e104fd7bf$nclexmocb2b3$,
$nclexmocb2b3$9a1bd7d4b9a07d68ea34d35f48f80f9e$nclexmocb2b3$,
$nclexmocb2b3$bdcbbb5acb823a0551706385745b8fce$nclexmocb2b3$,
$nclexmocb2b3$363493642ea799f0e5b6a6c72a36c82c$nclexmocb2b3$,
$nclexmocb2b3$aecca807e9c80d56e719a068ed0e264d$nclexmocb2b3$,
$nclexmocb2b3$6a7e491e31ea38cf8c95d0fbed68f135$nclexmocb2b3$,
$nclexmocb2b3$6fd73705eb1368960f58c524a5e6435c$nclexmocb2b3$,
$nclexmocb2b3$35df4da58c3972d41540f79f377a4815$nclexmocb2b3$,
$nclexmocb2b3$2c30c08dc4b4fb5caea3cd59aa857e9e$nclexmocb2b3$,
$nclexmocb2b3$64870aeeda4fb4d4b92bbb6919a04bae$nclexmocb2b3$,
$nclexmocb2b3$e0329538a7dee28abb26c7d48505656a$nclexmocb2b3$,
$nclexmocb2b3$6dd373b6f7563e3fa44f8542065306a1$nclexmocb2b3$,
$nclexmocb2b3$c99f95416d48c93d124c08c6ed2b3ef7$nclexmocb2b3$,
$nclexmocb2b3$58bcf1fa71afd6f8b9606951f57f5cca$nclexmocb2b3$,
$nclexmocb2b3$9f869104c8a7d8b4c48ab2afc0608027$nclexmocb2b3$,
$nclexmocb2b3$9b8b3029ed092207570563ec2eaf6abc$nclexmocb2b3$,
$nclexmocb2b3$8e566f13e3252cd0070639a0b34fb5cd$nclexmocb2b3$,
$nclexmocb2b3$781d708ee47388712468123da9d73764$nclexmocb2b3$,
$nclexmocb2b3$09b774b2ed0cc6427944952ee38248bb$nclexmocb2b3$,
$nclexmocb2b3$9fd4466d7c5494f725393c79c1d93396$nclexmocb2b3$,
$nclexmocb2b3$ab462e9bfaf4ed78c5176f547ee5f947$nclexmocb2b3$,
$nclexmocb2b3$accd1a5fad2e5aa1cd6173b621bf7a2b$nclexmocb2b3$,
$nclexmocb2b3$6afb04061c5204b4a1f844f3659e9dce$nclexmocb2b3$,
$nclexmocb2b3$fcf670812ce1f07ca7f7312273973c35$nclexmocb2b3$,
$nclexmocb2b3$89b70b031c7cc82ed7c2c3ff510642a2$nclexmocb2b3$,
$nclexmocb2b3$9b251a2b209a5375da13ea0e0862a8d1$nclexmocb2b3$,
$nclexmocb2b3$1f41a5d1531f4be43438f5511031e0c4$nclexmocb2b3$,
$nclexmocb2b3$597466f73dcd1fcfb00a55179a616f5a$nclexmocb2b3$,
$nclexmocb2b3$87a9faceef0c3cb6cf369c535268dbbb$nclexmocb2b3$,
$nclexmocb2b3$182aa77101bf69b0f63935f3851f3faa$nclexmocb2b3$,
$nclexmocb2b3$21f0a383e08823b7b7e6abd95a98208f$nclexmocb2b3$,
$nclexmocb2b3$00b4b6cd38b897b2da06a8f91b0da105$nclexmocb2b3$,
$nclexmocb2b3$e47cc53536e4cf7ff5cc908ede6ccd64$nclexmocb2b3$,
$nclexmocb2b3$ac65536b5829b8299f13d9f98bad0844$nclexmocb2b3$,
$nclexmocb2b3$b6df6d96123d1fff5a8ac09e70667740$nclexmocb2b3$,
$nclexmocb2b3$49a35a79e1834399be984e9b2f613ac6$nclexmocb2b3$,
$nclexmocb2b3$3831db9e2ba8a67cf424737fd55b0b21$nclexmocb2b3$,
$nclexmocb2b3$c196b84e92fe539e77d94afcddd7eacf$nclexmocb2b3$,
$nclexmocb2b3$e6b7cd6642b140747d2e2e7ee243a209$nclexmocb2b3$,
$nclexmocb2b3$7da6c5b1c3a7dd79904b89e7efc7ff37$nclexmocb2b3$,
$nclexmocb2b3$435bbbea0cfd598f4cb0d906628fcbbf$nclexmocb2b3$,
$nclexmocb2b3$3603b9c0115cd9cdd839379ce13b1855$nclexmocb2b3$,
$nclexmocb2b3$87d9d2cbd3cf5602bb4e0f39a3d3daa9$nclexmocb2b3$,
$nclexmocb2b3$d502d65e0fd52e2c2ce97578b4489a7f$nclexmocb2b3$,
$nclexmocb2b3$b164bba97aa761715e379a2cc683da1d$nclexmocb2b3$,
$nclexmocb2b3$65083d0de582b8b7913797ce61ed3822$nclexmocb2b3$,
$nclexmocb2b3$bf12abf8d00575e114767a0ba508e085$nclexmocb2b3$,
$nclexmocb2b3$aeba15e9566ce78e28ea2453a0c14e67$nclexmocb2b3$,
$nclexmocb2b3$59f6695eff95d2e6812fd2c7ab9a2d82$nclexmocb2b3$,
$nclexmocb2b3$cd4a95e6f1a9c716de0de7797ffa62eb$nclexmocb2b3$,
$nclexmocb2b3$a93211ecfe7667e953961714575799e4$nclexmocb2b3$,
$nclexmocb2b3$cb22cb056278783f5d729fab5da3fe61$nclexmocb2b3$,
$nclexmocb2b3$dfba7c5d7c3338de9e1c797e1bd38245$nclexmocb2b3$,
$nclexmocb2b3$2d710e9fcf4c7febaefc445b8aae6521$nclexmocb2b3$,
$nclexmocb2b3$a5b74a07216e0519beb2118ced7fbba7$nclexmocb2b3$,
$nclexmocb2b3$15477b0ea5c72048e560c5380bf02e6b$nclexmocb2b3$,
$nclexmocb2b3$2a3474aa770173a9fd9a7bed98a4363e$nclexmocb2b3$,
$nclexmocb2b3$a1454e929c92cd04e6fbff519f160bb5$nclexmocb2b3$))::integer INTO n;
  IF n IS DISTINCT FROM 0 THEN
    RAISE EXCEPTION 'duplicate content hash, id, or stem: expected 0, found %', n;
  END IF;
END
$check$;

-- Insert the 140 Management of Care items, held inactive until activation.
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q1 id already exists: c15a3f1fa8923fdaa50cd2273';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q1 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$0e0f6475e8e6a72a3b6c5593323b3979$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q1 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A physical therapy student who is not assigned to the client's care asks an RN to print the entire chart of a client with a spinal fusion for a class case study. The client has said that he does not mind being used as an example.$nclexmocb2b3$, $nclexmocb2b3$Which response by the RN is appropriate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Print the full chart after the nurse manager approves the request for the student's coursework","Tell the student that teaching use needs de-identified material under facility policy, and print nothing","Print the operative and therapy notes alone, because the client agreed verbally to serve as an example","Let the student read the chart on the unit's screen and take handwritten notes, with no printout being made"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the student that teaching use needs de-identified material under facility policy, and print nothing$nclexmocb2b3$, $nclexmocb2b3$A casual remark is not an authorization, and a manager's approval does not replace one. A student who is not assigned to the client has no need to know, so neither a printout nor on-screen reading is appropriate. Educational use goes through facility policy and de-identified material.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.502(b) and 164.514(d): minimum necessary","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1: protect privacy and confidentiality","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":1,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":1,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q1 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$0e0f6475e8e6a72a3b6c5593323b3979$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q1 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q1 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q2 id already exists: cb8d1fdf422bc95d8034d33c0';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q2 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$1de614018a289d20844b5e6a30a1ebf6$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q2 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client on the oncology unit asked at admission to be kept out of the facility directory. A woman telephones the unit, says she is the client's employer, and asks whether he is a patient and when he can return to work.$nclexmocb2b3$, $nclexmocb2b3$What should the RN say to the caller?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["That he is a patient but that the details of his condition cannot be released over the telephone","That the unit has no information it can release to her, and offer to take her name and telephone number","That he is expected to be back at work in about two weeks, after checking his plan of care in the record","That the call can be put through to his room if he is awake, since she says she is his employer"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$That the unit has no information it can release to her, and offer to take her name and telephone number$nclexmocb2b3$, $nclexmocb2b3$A client who opts out of the directory is entitled to have even his presence unacknowledged. The RN says that no information can be released and offers to take the caller's name and number, which leaves the choice of any response to the client.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(d)(1): confidentiality of clinical records","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":2,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":2,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q2 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$1de614018a289d20844b5e6a30a1ebf6$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q2 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q2 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q3 id already exists: c1bf7020fa6cc50df55ed1011';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q3 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9f28ee991f7b64909b136cbfcfd31e41$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q3 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$Several workstations on wheels are shared across shifts on a surgical unit, and one hallway monitor faces the visitor lounge.$nclexmocb2b3$, $nclexmocb2b3$Which actions protect the security of electronic health information? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Reporting a lost badge or suspected unauthorized access to the privacy or security officer","Giving a float nurse the RN's password so that she can start her shift promptly","Logging off the chart before leaving a computer that other staff use","Using only the unique login issued to the nurse for every chart entry","Emailing a client's results to a personal account to finish documenting at home","Angling the corridor screen away from where visitors sit, or adding a privacy filter"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Reporting a lost badge or suspected unauthorized access to the privacy or security officer|||Logging off the chart before leaving a computer that other staff use|||Using only the unique login issued to the nurse for every chart entry|||Angling the corridor screen away from where visitors sit, or adding a privacy filter$nclexmocb2b3$, $nclexmocb2b3$Individual credentials, session log-off, screen positioning and prompt reporting of suspected unauthorized access limit access to people with a need for the information. Sharing passwords and moving data to personal accounts defeat those controls.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.514(d): limit access to workforce members who need it","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1: including security practices","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":3,"subtopic":"Confidentiality and information security","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":3,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q3 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9f28ee991f7b64909b136cbfcfd31e41$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q3 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q3 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q4 id already exists: c08673072cee1cc9f67daf321';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q4 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$94dc4a9e8537b0add56427a46b1eea2e$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q4 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN wants the wound care specialist, who works in another building, to review a stage 3 sacral pressure injury. The RN has a personal smartphone, and the unit has a tablet that the facility approves for clinical photographs.$nclexmocb2b3$, $nclexmocb2b3$How should the RN obtain the photograph?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Photograph it on the personal phone, send it by text, and delete the image after the specialist replies","Photograph it on the personal phone with the wound alone in the frame, and send it with no identifiers","Photograph the wound with the approved tablet once the client agrees, and save the image in the record","Ask the client's daughter to take the photograph with her own phone and text it to the specialist"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Photograph the wound with the approved tablet once the client agrees, and save the image in the record$nclexmocb2b3$, $nclexmocb2b3$Clinical images are health information. They should be taken on approved devices with the client's agreement and kept in the record, not on personal phones where copies and backups cannot be controlled.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1: protect privacy and confidentiality","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.502(b): minimum necessary","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":4,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":4,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q4 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$94dc4a9e8537b0add56427a46b1eea2e$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q4 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q4 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q5 id already exists: cb2c90fd3761b7baaf76a95bc';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q5 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$29976b092228f99931dbdcda2364ec49$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q5 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At shift change the outgoing RN plans a bedside report for a client in a semi-private room. Visitors of the roommate are present, the nurses' station opens onto a corridor where families often wait, and a private conference room on the unit is free. The report includes a new diagnosis of syphilis.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do before beginning the report?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give the report at the bedside in a low voice, because the curtain is closed around the client's bed","Ask the roommate's visitors to sign a confidentiality statement and then proceed with the report at the bedside","Give the handoff at the station, speaking quietly to the oncoming nurse so that the corridor cannot hear it","Ask the client who may stay, then give the handoff in the conference room, away from the roommate's guests"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the client who may stay, then give the handoff in the conference room, away from the roommate's guests$nclexmocb2b3$, $nclexmocb2b3$The client decides how sensitive details are shared. A curtain does not block sound, a station that opens onto a public corridor is not private, and a visitor's signature does not make a roommate's visitors entitled to hear the diagnosis. A private room is free, so the RN offers it.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(c)(1): personal privacy; (d)(1): confidentiality","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"AHRQ-IPASS","label":"AHRQ TeamSTEPPS I-PASS handoff tool","locator":"I-PASS handoff elements","url":"https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":5,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":5,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q5 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$29976b092228f99931dbdcda2364ec49$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q5 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q5 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q6 id already exists: c5adaf0f2093da453a4b455bf';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q6 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9898086a5e1c8c69793dc2354f5d74d1$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q6 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$In the emergency department, a police officer asks the RN for the blood alcohol result of a conscious client who was in a car crash. The officer shows a badge but has no warrant, subpoena or court order.$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Provide the numeric result alone, because the officer is investigating a crash that may involve public safety","Refer the officer to the charge nurse or privacy officer, releasing nothing until policy and law allow","Release the result after checking the officer's badge number and writing it in the record","Ask the client in the officer's presence to say aloud that the result may be shared"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Refer the officer to the charge nurse or privacy officer, releasing nothing until policy and law allow$nclexmocb2b3$, $nclexmocb2b3$Disclosures to law enforcement are allowed only under specific legal conditions, such as a court order or required reporting. The RN should not decide this alone and should route the request to the person who can apply the rules.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.512(f)(1): disclosures for law enforcement purposes","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(d)(1)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$,
    false, false, true,
    4, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":6,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":6,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q6 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9898086a5e1c8c69793dc2354f5d74d1$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q6 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q6 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q7 id already exists: c9491c8be96473128a030cf28';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q7 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$ba9fc0102f4d709db2239c76d9fa08db$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q7 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$After faxing a client's discharge summary to a rehabilitation center, the RN sees that the confirmation shows a number differing from the center's by one digit. The summary lists the diagnoses and medications.$nclexmocb2b3$, $nclexmocb2b3$Which action is required?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Resend the summary to the correct number and treat the matter as closed, since there has been no complaint","Tell the supervisor or privacy officer about the misdirected fax at once, then resend it correctly","Phone the wrong number to ask that the pages be shredded, then chart nothing because there was no harm","Wait to see whether the unintended recipient contacts the hospital before taking further steps"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the supervisor or privacy officer about the misdirected fax at once, then resend it correctly$nclexmocb2b3$, $nclexmocb2b3$A misdirected disclosure is a possible privacy breach that the organization must evaluate. Prompt internal reporting allows the privacy officer to retrieve the pages and decide on notification.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.502(b) minimum necessary; internal report of impermissible disclosure","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":7,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":7,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q7 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$ba9fc0102f4d709db2239c76d9fa08db$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q7 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q7 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q8 id already exists: ca65e860f00271ae2e01d4fd9';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q8 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$ee6dabe35a69d594a8b647ae90db2fe2$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q8 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$While riding a crowded hospital elevator, an RN hears two staff members discuss a client's name and cancer diagnosis in detail.$nclexmocb2b3$, $nclexmocb2b3$Which action is most appropriate for the RN?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Interrupt the discussion in the elevator and quote the privacy policy aloud to both staff members present","Send an ordinary email to the unit manager that afternoon naming the client, the diagnosis and the two staff members","Take no action, because the client's name was not on a chart or screen where other riders could see it","Speak with them privately after leaving the elevator and remind them to keep such discussions in secure areas"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Speak with them privately after leaving the elevator and remind them to keep such discussions in secure areas$nclexmocb2b3$, $nclexmocb2b3$Client information is protected wherever it is discussed. A private, direct reminder corrects the behavior without exposing the colleagues or adding to the breach. Sending the client's name and diagnosis through ordinary email creates a second disclosure; a concern is reported through the facility's secure privacy channel.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(d)(1): confidentiality","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":8,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":8,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q8 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$ee6dabe35a69d594a8b647ae90db2fe2$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q8 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q8 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q9 id already exists: cbfef96c3eaf35fdf14a9166d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q9 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$34966869eaad9f8a174520d353d5e188$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q9 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$During a home visit, an RN finds bruises on both upper arms of a 79-year-old woman who lives with her adult grandson. There is almost no food in the house. The client says, 'Please don't tell anyone.' State law requires health care professionals to report suspected abuse of older adults.$nclexmocb2b3$, $nclexmocb2b3$Which action is required of the RN?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Honor the client's request and encourage her to report when she feels ready, then check back next week","Confront the grandson about the bruises and report provided that his explanation seems unconvincing to her","Notify adult protective services of the findings, and inform the client that this is being done","Ask the client's physician to decide whether the findings are serious enough to need a report"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Notify adult protective services of the findings, and inform the client that this is being done$nclexmocb2b3$, $nclexmocb2b3$Where the law mandates reporting, the duty rests on the RN and is triggered by reasonable suspicion. A client's request for secrecy does not remove it, though the RN should be open with the client about the report.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.512(c): disclosures about victims of abuse, neglect or domestic violence","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3: protect health and safety","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$,
    false, false, true,
    4, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":9,"subtopic":"Reporting required by law","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":9,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q9 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$34966869eaad9f8a174520d353d5e188$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q9 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q9 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q10 id already exists: c49e63ffe2e084d98b5aaf6cc';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q10 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$26b918437c5c751edba25bc0713e39b5$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q10 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$On a weekend shift, the laboratory reports that a hospitalized client's sputum culture is positive for Mycobacterium tuberculosis. State law requires clinicians to report active tuberculosis to the health department. The infection control nurse is off until Monday.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Use the facility's after-hours reporting process through the supervisor so the report is filed on time","Hold the report until the infection control nurse returns on Monday and then complete the paperwork forms","Obtain the client's signed authorization before contacting the health department about the result","Notify the client's household contacts directly and leave the health department report to the laboratory"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Use the facility's after-hours reporting process through the supervisor so the report is filed on time$nclexmocb2b3$, $nclexmocb2b3$Reporting of listed communicable diseases is required by law and does not depend on the client's consent. The RN follows the facility process so that the report is not delayed past the legal deadline.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.512(b)(1)(i): disclosures for public health activities","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"CDC-REPORT","label":"CDC COMEC Infectious Diseases page, Disease reporting","locator":"State law defines reportable conditions and time frames","url":"https://www.cdc.gov/comec/resources/infectious-diseases.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":10,"subtopic":"Reporting required by law","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":10,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q10 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$26b918437c5c751edba25bc0713e39b5$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q10 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q10 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q11 id already exists: cf97717240136b1088faba45a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q11 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$5bbbfc711d1cc0cdc0651f502c449c67$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q11 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$In the state where an RN practices, the law requires reports of suspected child abuse, suspected abuse, neglect or self-neglect of adults who cannot protect themselves, and communicable diseases that the state health department designates as reportable.$nclexmocb2b3$, $nclexmocb2b3$Which situations require the RN to make a report to an outside agency? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["A competent adult who declines a recommended blood transfusion for deeply held personal reasons","A 4-year-old with a spiral femur fracture whose caregiver offers no explanation for the injury","A client with depression who asks the RN not to discuss his medicines with his sister or brother","A client who has missed two insurance payments and asks the RN about a payment plan for the bill","A 71-year-old with advanced dementia found at home with pressure injuries and no caregiver","A client whose measles was confirmed by laboratory testing today, with isolation at home planned"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$A 4-year-old with a spiral femur fracture whose caregiver offers no explanation for the injury|||A 71-year-old with advanced dementia found at home with pressure injuries and no caregiver|||A client whose measles was confirmed by laboratory testing today, with isolation at home planned$nclexmocb2b3$, $nclexmocb2b3$The three situations meet the statutory triggers stated in the stem: suspected child abuse, suspected neglect or self-neglect of an adult who cannot protect himself and a listed communicable disease. The other situations involve a client's choices, confidentiality preferences or finances, not reportable events.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CWIG","label":"Child Welfare Information Gateway, Mandatory Reporting of Child Abuse and Neglect","locator":"Mandatory reporting; follow the state law","url":"https://www.childwelfare.gov/resources/mandatory-reporting-child-abuse-and-neglect/"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.512(b) and (c)","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":11,"subtopic":"Reporting required by law","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":11,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q11 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$5bbbfc711d1cc0cdc0651f502c449c67$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q11 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q11 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q12 id already exists: ca5cffeaafdbc664a384f7c81';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q12 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$31c55297f2c13876cba82494c8a7e890$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q12 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 34-year-old woman with a fractured wrist tells the RN that her partner shoved her. She is alert and decision-capable, and she declines to let the RN call the police. Her state does not require reporting of intimate partner violence involving competent adults.$nclexmocb2b3$, $nclexmocb2b3$Which action is most appropriate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Call the police despite her objection, because the injury was caused by another person at home","Tell the partner at the next visit that the injury has been brought to the attention of the staff","Urge her to go to a shelter tonight and arrange the transfer before she is discharged from the unit","Offer local violence resources and help her plan for safety, then record her account in her words"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Offer local violence resources and help her plan for safety, then record her account in her words$nclexmocb2b3$, $nclexmocb2b3$With no mandate and a capable adult, the RN respects her decisions while giving resources and safety planning. Disclosing to the partner or forcing a plan can raise her risk.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.512(c): disclosures about victims of abuse","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: self-determination","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":12,"subtopic":"Reporting required by law","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":12,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q12 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$31c55297f2c13876cba82494c8a7e890$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q12 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q12 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q13 id already exists: cba1d923625555fe5edfc9be2';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q13 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$380260952099ef548a7a78202533e636$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q13 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 9-year-old tells the school-based clinic RN that her stepfather hits her with a belt, and then asks, 'You won't tell, right? Promise.'$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond to the child's request?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Promise to keep it private for now so that the child continues to talk, and decide about reporting later","Say she will tell the child's mother, not the authorities, and ask the mother to deal with the stepfather","Explain that she cannot keep this secret because she must tell people who can help keep the child safe","Ask the child to repeat the account in front of her mother so that the family can respond together"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that she cannot keep this secret because she must tell people who can help keep the child safe$nclexmocb2b3$, $nclexmocb2b3$The RN cannot promise secrecy because suspected abuse must be reported to the agency named in state law. The child is told honestly in age-appropriate words, and the RN does not involve a possible abuser or unprotected family.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CWIG","label":"Child Welfare Information Gateway, Mandatory Reporting of Child Abuse and Neglect","locator":"Mandatory reporting of child abuse and neglect: state-specific","url":"https://www.childwelfare.gov/resources/mandatory-reporting-child-abuse-and-neglect/"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3: protect safety","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":13,"subtopic":"Reporting required by law","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":13,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q13 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$380260952099ef548a7a78202533e636$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q13 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q13 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q14 id already exists: c421c8f7c0b37f9fa87dee26f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q14 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$1e8e9874106bc150e28a603e9dfb8d70$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q14 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN has reported suspected child abuse to the state agency. A 3-year-old client has a 5-cm linear bruise on the left thigh. The child's older sister told the RN, 'My uncle hit him with a belt.'$nclexmocb2b3$, $nclexmocb2b3$Which documentation entry is most appropriate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Child abused by uncle, who hit him with a belt, causing a 5-cm bruise on the left thigh","Sister states, 'My uncle hit him with a belt'; a 5-cm linear bruise is on the left thigh","Sister states, 'My uncle hit him with a belt,' and seems truthful; a 5-cm linear bruise is on the left thigh","Sister reports that her uncle used a belt; a 5-cm bruise on the left thigh looks like a belt injury"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Sister states, 'My uncle hit him with a belt'; a 5-cm linear bruise is on the left thigh$nclexmocb2b3$, $nclexmocb2b3$Records should hold direct quotes and objective findings. Conclusions about guilt, truthfulness or the cause of an injury are not the RN's to chart and can compromise later investigation.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law; Use approved terminology when documenting care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Principles: accurate, auditable, objective entries","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(1): entries legible, complete, dated, timed and authenticated","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":14,"subtopic":"Reporting required by law","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":14,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q14 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$1e8e9874106bc150e28a603e9dfb8d70$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q14 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q14 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q15 id already exists: c6eb2b7b31984fd5cd5b43193';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q15 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$7d4ff3050d1fac78e5a249395bc0cec7$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q15 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 76-year-old client is being discharged on 11 medications from three prescribers. While reconciling the list, the RN notes two NSAIDs and two medications for the same type of heart rhythm problem.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask the case manager to arrange a home nurse to sort out his medicines after discharge","Tell the client to stop the NSAID that he likes the least and to leave the rest of the list as written","Request a pharmacist review of the list and notify the provider of the duplicates before discharge","Add a note to the teaching sheet that asks him to bring the bottles to his next visit"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Request a pharmacist review of the list and notify the provider of the duplicates before discharge$nclexmocb2b3$, $nclexmocb2b3$Duplicate therapy found during reconciliation must be resolved before the client leaves. The pharmacist adds medication expertise, and only the provider can change the regimen.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Identify and collaborate with multidisciplinary team members","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(b): necessary information to follow-up providers at discharge","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":15,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":15,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q15 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$7d4ff3050d1fac78e5a249395bc0cec7$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q15 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q15 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q16 id already exists: ca90429fb455f33927e0b3252';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q16 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$111f89c80fece7ebd158417802a1d942$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q16 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 68-year-old widower recovering from a hip replacement will go home alone. He tells the RN, 'I have no car, and I can't afford the pills the doctor prescribed.'$nclexmocb2b3$, $nclexmocb2b3$Which team member should the RN contact first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Physical therapist, who can check his walker use and his safety on the stairs and in the bath at home","Chaplain, who can offer him support with the loss of his wife and the change in his home life","Case manager or social worker, who can look at ways to get to visits and to pay for his medicines","Dietitian, who can review his usual meals and plan menus that suit his recovery in his own kitchen"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Case manager or social worker, who can look at ways to get to visits and to pay for his medicines$nclexmocb2b3$, $nclexmocb2b3$The needs described are financial and logistic, which fall to case management or social work. The other disciplines address real but different needs.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assess the need for referrals and obtain necessary orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(a): identify patients needing discharge planning","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":16,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":16,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q16 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$111f89c80fece7ebd158417802a1d942$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q16 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q16 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q17 id already exists: cf709a58347ddb55f5e03695f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q17 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$5b4d449c80e634886f04d45cf2109824$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q17 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with stage 4 chronic kidney disease has a potassium of 5.4 mEq/L and asks what to eat at home. The RN has reviewed the unit's general diet handout, which does not mention kidney disease.$nclexmocb2b3$, $nclexmocb2b3$Which action best supports quality care?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Teach from the general diet handout and ask the client to read it again before the next clinic visit","Ask the provider to order a renal dietitian consult to build a meal plan that suits him at home","Ask a staff nurse who has worked on a renal unit to tell him what she usually teaches clients","Give him a high-potassium food list from a reputable website and ask him to avoid those foods"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the provider to order a renal dietitian consult to build a meal plan that suits him at home$nclexmocb2b3$, $nclexmocb2b3$Individualized dietary therapy for kidney disease calls for a renal dietitian, requested through the order process. The other options use generic or informal teaching, or skip the specialist.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Identify and collaborate with multidisciplinary team members; Assess the need for referrals","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"KDIGO-CKD-2024","label":"KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD (KDIGO)","locator":"Nutrition management","url":"https://kdigo.org/guidelines/ckd-evaluation-and-management/kdigo-2024-ckd-guideline/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":17,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":17,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q17 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$5b4d449c80e634886f04d45cf2109824$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q17 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q17 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q18 id already exists: c83ab27568dbf55731a03e7df';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q18 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$8ce027a90dbd1be43db60a90e2c803b4$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q18 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At rounds, the physical therapist says a client 2 days after hip fracture repair can walk with a walker and bear full weight. The RN knows that the provider's order reads 'toe-touch weight bearing, left leg.'$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Follow the therapist's plan, because therapists are the experts in mobility after a fracture repair","Ask the client which level of activity feels most comfortable to him and proceed on that basis","Wait until the provider's next progress note appears and then follow the most recent entry","Call the provider about the conflict with the therapist's plan before he walks, and inform her"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Call the provider about the conflict with the therapist's plan before he walks, and inform her$nclexmocb2b3$, $nclexmocb2b3$A conflict between an order and a team member's recommendation must be settled by the prescriber before action. The RN keeps the therapist informed so that the plan is shared.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders; collaborate with multidisciplinary team members","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(2): orders must be authenticated by the ordering practitioner","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":18,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":18,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q18 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$8ce027a90dbd1be43db60a90e2c803b4$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q18 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q18 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q19 id already exists: cde6646ca35da5fcb97410c42';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q19 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$f5d9194edbad0f2f66f3db21f4eb780b$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q19 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN attends an interdisciplinary care conference for a client with heart failure, diabetes and a recent fall.$nclexmocb2b3$, $nclexmocb2b3$Which actions support effective collaboration at the conference? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Leaving discharge needs to be raised by the case manager at a later meeting","Keeping the agreed plan in a personal notebook until the next shift","Confirming who will do each follow-up task and by when before the meeting ends","Inviting the client and family to state their goals for going home","Limiting remarks to nursing matters and not asking other disciplines for their views","Waiting to share nursing findings until another discipline asks the RN for them"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Confirming who will do each follow-up task and by when before the meeting ends|||Inviting the client and family to state their goals for going home$nclexmocb2b3$, $nclexmocb2b3$Collaboration includes the client's voice and clear accountability afterward. Leaving topics to one role, staying in a silo, waiting to be asked or keeping the plan outside the record weakens it.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Identify and collaborate with multidisciplinary team members","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-MODEL","label":"NCSBN Model Act (Revised August 2026)","locator":"Art. III Sec. 2.C.5 and 2.C.14: collaborates with the healthcare team and communicates within and across settings","url":"https://www.ncsbn.org/public-files/2026_ncsbn_model_act.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":19,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":19,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q19 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$f5d9194edbad0f2f66f3db21f4eb780b$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q19 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q19 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q20 id already exists: c655b086d0fd4df1b95890ba7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q20 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$accd24f47152d63825b8806cae229666$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q20 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 59-year-old with rheumatoid arthritis has painful, swollen hands and needs help with dressing, eating and taking medicines. The provider plans discharge home tomorrow, and he lives with his spouse.$nclexmocb2b3$, $nclexmocb2b3$Which service should the RN suggest that the provider order?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Physical therapy evaluation, to build leg and trunk strength and review his gait before discharge","Occupational therapy evaluation, to assess hand function and suggest adaptive devices for use at home","Home health nursing visits, to check his blood pressure and weight after discharge to his home","Social work referral, to arrange a short stay in a skilled nursing facility while his hands are recovering"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Occupational therapy evaluation, to assess hand function and suggest adaptive devices for use at home$nclexmocb2b3$, $nclexmocb2b3$Hand dysfunction that limits dressing, eating and medication access is the focus of occupational therapy. The other services address different needs or assume more dependence than the findings show.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assess the need for referrals and obtain necessary orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(a)-(b): discharge planning and transition","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":20,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":20,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q20 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$accd24f47152d63825b8806cae229666$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q20 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q20 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q21 id already exists: c6c56f09f80e8838aad11b0f3';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q21 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$266b236c908e32776214e5734d2f525c$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q21 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$Two clients share a room. One, recovering from a new colostomy, asks to be moved because the roommate watches television loudly at night and refuses to turn it down. The unit has one open bed.$nclexmocb2b3$, $nclexmocb2b3$Which action by the RN is most appropriate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Offer the colostomy client earplugs and explain to him that the unit does not move clients for noise problems here","Ask the nursing assistant to deal with the television and report back at the end of the shift","Meet with both clients to look for an agreement on television use, and offer a move if it fails","Move the colostomy client to the open bed, not telling the roommate or the charge nurse first"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Meet with both clients to look for an agreement on television use, and offer a move if it fails$nclexmocb2b3$, $nclexmocb2b3$Conflict between clients is managed by hearing both sides and looking for a workable solution, with a room change as a fallback. Dismissing the concern or moving a client unilaterally does not address it.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict among clients and staff","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"DESC: private, win-win resolution","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":21,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":21,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q21 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$266b236c908e32776214e5734d2f525c$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q21 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q21 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q22 id already exists: c5f5e4479c8e39150e7eb65fb';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q22 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9bb4c79216da1ed266ead58b01ab59fd$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q22 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN has noticed that a nursing assistant often leaves call lights on the RN's clients unanswered during the first hour of the shift. The RN feels irritated and plans to bring it up.$nclexmocb2b3$, $nclexmocb2b3$Which approach is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask the assistant what obstacles she faces early in the shift, and agree on call light coverage","Switch the assistant's assignment with a colleague's for the rest of the week, and give her no reason","Bring up call lights at the next staff meeting as a reminder for the whole group of assistants","Wait for the annual evaluation and include the pattern in the written comments on her performance"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the assistant what obstacles she faces early in the shift, and agree on call light coverage$nclexmocb2b3$, $nclexmocb2b3$Conflict is best handled by seeking the other person's view and agreeing on a solution directly. Reassigning without explanation, correcting the whole group in public or waiting for months leaves the problem in place.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict among clients and staff","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"DESC script: Describe, Express, Suggest, Consequences","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":22,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":22,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q22 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9bb4c79216da1ed266ead58b01ab59fd$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q22 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q22 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q23 id already exists: c5808133e0f2b66ed09b39fe0';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q23 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$4d6db0f52f4d49f9c8c70f20af27b47a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q23 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At the bedside of a sedated client who is on a ventilator, two adult children argue loudly about continuing life support. The client has no advance directive or designated surrogate, and his condition is stable.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell the family that the provider will pick whichever child's wishes seem the most reasonable","Ask the family members to move their discussion to a private room, away from the client's bedside","Support the child who wants life support continued, because that choice preserves the client's life","Ask both children to leave the unit until they have come to an agreement about their father's care"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the family members to move their discussion to a private room, away from the client's bedside$nclexmocb2b3$, $nclexmocb2b3$The first step is to protect the client and the family from the argument at the bedside by moving the discussion to a private setting. The RN then involves the charge nurse and care team, who can arrange a family meeting. The RN does not decide between family members, promise the provider's decision or exclude them.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict among clients and staff","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1: respect for persons; Provision 2: commitment to the client and family","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$,
    false, false, true,
    4, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":23,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":23,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q23 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$4d6db0f52f4d49f9c8c70f20af27b47a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q23 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q23 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q24 id already exists: c4b7d7f1df4c09f4f7e5c311e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q24 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$8a40980d73529dd22ce3bc21df4a3dda$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q24 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN has been interrupted by a coworker three times during handoff report and decides to use the DESC script to address it.$nclexmocb2b3$, $nclexmocb2b3$Place the statements in the order in which the RN should say them, from first to last.$nclexmocb2b3$, $nclexmocb2b3${"kind":"ordered_response","options":["'That way the clients' information is complete and we both finish on time'","'Could we agree that I finish report first and then you ask your questions'","'I noticed that I was interrupted three times during report this morning'","'I worry that details about the clients will be missed or repeated'"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$'I noticed that I was interrupted three times during report this morning'|||'I worry that details about the clients will be missed or repeated'|||'Could we agree that I finish report first and then you ask your questions'|||'That way the clients' information is complete and we both finish on time'$nclexmocb2b3$, $nclexmocb2b3$DESC sequence: describe the specific behavior, express the concern, suggest an alternative, and state the consequences or benefits while seeking agreement.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict among clients and staff","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"DESC: Describe, Express, Suggest, Consequences","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$ordered_response$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":24,"subtopic":"Conflict management","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":24,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q24 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$8a40980d73529dd22ce3bc21df4a3dda$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q24 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q24 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q25 id already exists: c610cf402d34ea7a59c7d5841';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q25 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9f0afc47acb8e682f483738abf9e0d5d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q25 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is concerned about a resident's order for a 10,000-unit heparin bolus for a client who has an active gastrointestinal bleed. The RN has not given the dose and will use the two-challenge approach.$nclexmocb2b3$, $nclexmocb2b3$Place the RN's actions in the order in which they should occur, from first to last.$nclexmocb2b3$, $nclexmocb2b3${"kind":"ordered_response","options":["Take the concern to the charge nurse or supervisor and use the chain of command","Complete a safety event report after the issue is resolved","When the resident replies, 'It's fine,' state again that this is a safety issue and that she will not give the dose","Tell the resident, 'I am concerned: the client has an active GI bleed, and this dose could harm him'"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the resident, 'I am concerned: the client has an active GI bleed, and this dose could harm him'|||When the resident replies, 'It's fine,' state again that this is a safety issue and that she will not give the dose|||Take the concern to the charge nurse or supervisor and use the chain of command|||Complete a safety event report after the issue is resolved$nclexmocb2b3$, $nclexmocb2b3$The two-challenge sequence starts with a clear statement of the concern, a second assertive statement if the response does not address it, and then escalation to the supervisor. The report follows once the client is safe.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict among clients and staff; Receive and verify orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"Two-Challenge Rule and CUS: restate, then chain of command","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$ordered_response$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":25,"subtopic":"Conflict management","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":25,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q25 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9f0afc47acb8e682f483738abf9e0d5d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q25 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q25 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q26 id already exists: c95cd5ed86257a345908ba45a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q26 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$59134b488835f4b02f726e48a50d2166$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q26 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A new graduate RN says that a senior nurse rolls her eyes and speaks sharply to her in front of clients on most shifts. The new graduate asks the charge RN what to do.$nclexmocb2b3$, $nclexmocb2b3$Which advice by the charge RN is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask to be paired with a different nurse from shift to shift so that the two seldom work together","Keep a private log of each incident and hand it to the manager at the end of orientation","Speak with that colleague privately about the behavior, and go to the manager if it keeps going","Wait until orientation ends and then see whether the behavior improves by itself over a few months"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Speak with that colleague privately about the behavior, and go to the manager if it keeps going$nclexmocb2b3$, $nclexmocb2b3$Disrespect among colleagues is addressed directly and privately first, then escalated. Avoiding the person, saving a log for later or waiting for months does not resolve it.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict among clients and staff","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"DESC: private, specific, solution-focused","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":26,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":26,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q26 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$59134b488835f4b02f726e48a50d2166$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q26 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q26 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q27 id already exists: c9e65d845ce4f3edbaea94680';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q27 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$0662270e7aae015ec54f5bf82265233c$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q27 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A provider telephones the unit and says, 'Change the heparin infusion to 12 units per kilogram per hour.' The RN writes the order down as it is spoken. Hospital policy allows RNs to accept verbal orders.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take next?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask a second nurse to listen in on the call and co-sign the order as a witness before starting it","Enter the order as it was heard and let the pharmacist's verification stand in for a read-back","Ask the provider to repeat the order slowly while the RN writes it again, then start the new rate","Read the order back to the provider with the drug, dose and units, and wait for the confirmation"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Read the order back to the provider with the drug, dose and units, and wait for the confirmation$nclexmocb2b3$, $nclexmocb2b3$A verbal order is verified by reading it back to the prescriber. Policy and regulations also require that it be entered or authenticated promptly by the prescriber, not delayed.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-23","label":"42 CFR 482.23 Condition of participation: Nursing services","locator":"(c)(1)(ii): verbal orders accepted only by authorized persons","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(2): all orders including verbal orders dated, timed and authenticated promptly","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":27,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":27,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q27 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$0662270e7aae015ec54f5bf82265233c$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q27 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q27 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q28 id already exists: c2e218702070b580b8b744f82';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q28 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$f24e98c06799639f92c889a250e1654d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q28 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A provider orders metoprolol 5 mg IV push now for a client with atrial fibrillation. The client's heart rate is 48/min and the blood pressure is 88/54 mm Hg.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give the dose slowly over five minutes while watching the heart rate and rhythm","Give half of the dose and ask the prescriber to review the response","Ask the pharmacist whether the dose is appropriate and give it if the pharmacist agrees","Hold the dose and contact the prescriber with the vital signs to clarify the order"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Hold the dose and contact the prescriber with the vital signs to clarify the order$nclexmocb2b3$, $nclexmocb2b3$The ordered drug would further lower a heart rate and blood pressure that are already low. The RN holds and reports before giving, and does not change a dose independently.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-23","label":"42 CFR 482.23 Condition of participation: Nursing services","locator":"(c)(1): administered per orders and accepted standards of practice","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":28,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":28,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q28 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$f24e98c06799639f92c889a250e1654d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q28 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q28 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q29 id already exists: c83e43cf9d292bbab31adbb3e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q29 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$f33fcf5941348301076d50cbf7f63a45$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q29 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A hospital has a nurse-driven pathway for removing indwelling urinary catheters when set conditions are met. An RN on a medical unit finds that her client meets all of the conditions and has no individual removal order.$nclexmocb2b3$, $nclexmocb2b3$On what basis may the RN remove the catheter?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The RN's license, which lets her remove devices when she judges them unnecessary on her own assessment","A conversation with the previous shift's RN, who had planned to remove the catheter that morning","Physicians and nursing leaders at the facility approved it in advance as a standing order for nurses","The client's request to have the catheter removed, because it has been causing him discomfort"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Physicians and nursing leaders at the facility approved it in advance as a standing order for nurses$nclexmocb2b3$, $nclexmocb2b3$Hospitals may use standing orders and protocols only after review and approval by the medical staff and nursing and pharmacy leadership. The RN acts on an approved protocol when its criteria are met; a license or personal judgment alone is not the authority.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(3): standing orders, order sets and protocols","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":29,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":29,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q29 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$f33fcf5941348301076d50cbf7f63a45$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q29 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q29 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q30 id already exists: cfd5dc7ab1931ca355bb4ab15';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q30 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$91692d25da031919e9cd6df6373b5ae4$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q30 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$The unit has two clients named Garcia, one with heart failure and one with a urinary tract infection. The RN sees a new order for furosemide 40 mg IV for 'Garcia, M' and is not sure which client it is meant for.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give the dose to the client with heart failure, since that client is the likelier one to need a diuretic","Give the dose to whichever client has the order showing in the electronic record at the time of the pass","Contact the prescriber to confirm which client it is for, and then use two identifiers at the bedside","Ask the unit clerk to confirm the order by checking the client's room number and admission date"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Contact the prescriber to confirm which client it is for, and then use two identifiers at the bedside$nclexmocb2b3$, $nclexmocb2b3$An order that could belong to either of two clients with similar names must be verified with the prescriber, then confirmed with two identifiers at the bedside. Guessing or relying on a clerk is unsafe.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"TJC-NPG","label":"Joint Commission National Performance Goals (hospital), e.g. NPG #8 Reducing the Risk for Suicide (Joint Commission)","locator":"NPG #4 High Quality, Safe Care for All (hospital goals eff. Jan 1 2026)","url":"https://www.jointcommission.org/en-us/standards/national-performance-goals"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":30,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":30,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q30 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$91692d25da031919e9cd6df6373b5ae4$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q30 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q30 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q31 id already exists: cc4d5e8175a29c4fb8f8d094d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q31 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$c2546c8556ebff45db70537b5801ade6$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q31 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reviews new orders written for different clients at the start of the shift.$nclexmocb2b3$, $nclexmocb2b3$For which orders should the RN contact the prescriber for clarification before carrying them out? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Morphine sulfate 20 mg IV every 4 hours as needed for pain for an opioid-naive client after surgery","Ampicillin 1 g IV every 6 hours for a client who has documented anaphylaxis to penicillin","Notify the provider if the systolic pressure is below 90 mm Hg or the pulse is below 50/min","Warfarin 5 mg PO daily at 1700 for a client who has atrial fibrillation and an INR of 5.6 today","Digoxin 2.5 mg PO daily for an adult client whose kidney function is normal","Acetaminophen 650 mg PO four times daily as needed for a temperature above 100.4 F"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Morphine sulfate 20 mg IV every 4 hours as needed for pain for an opioid-naive client after surgery|||Ampicillin 1 g IV every 6 hours for a client who has documented anaphylaxis to penicillin|||Warfarin 5 mg PO daily at 1700 for a client who has atrial fibrillation and an INR of 5.6 today|||Digoxin 2.5 mg PO daily for an adult client whose kidney function is normal$nclexmocb2b3$, $nclexmocb2b3$Orders that are complete in form still need clarification when the dose is far above the usual range or the client's data make the order unsafe. Here morphine 20 mg IV for an opioid-naive client, ampicillin for a client with documented anaphylaxis to penicillin, warfarin for a client whose INR is already 5.6, and digoxin 2.5 mg (about ten times a usual dose) each need a call to the prescriber before the dose is given. The notification parameter and the acetaminophen order are complete and within normal practice.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-23","label":"42 CFR 482.23 Condition of participation: Nursing services","locator":"(c)(1): drugs administered per orders and accepted standards of practice","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23"},{"src":"ISMP-HIGHALERT","label":"ISMP List of High-Alert Medications in Acute Care Settings (ISMP)","locator":"High-alert medication list","url":"https://www.ismp.org/recommendations/high-alert-medications-acute-list"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":31,"subtopic":"Receiving, verifying and implementing orders","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":31,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q31 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$c2546c8556ebff45db70537b5801ade6$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q31 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q31 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q32 id already exists: c5abfbb47c865a5e41a0f9cb4';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q32 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2534af582ab90bd8739962daef3b0788$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q32 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$During rounds, a provider tells the RN, 'I'm going to stop the vancomycin.' No order appears in the record, and the next dose is due in 30 minutes.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do before the dose is due?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Hold the dose and chart that the provider said on rounds that the drug would be stopped","Ask the provider to enter the stop order, or take it as a verbal order per policy, before holding it","Give the dose, since no order has been entered and the active order for it remains in effect","Ask the pharmacist to take the drug off the medication record so that the dose does not show up as due"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the provider to enter the stop order, or take it as a verbal order per policy, before holding it$nclexmocb2b3$, $nclexmocb2b3$A spoken comment on rounds is not an order. The RN gets a documented, authenticated order, which is the only authority for holding or giving the drug.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement health care provider orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(2): orders dated, timed and authenticated","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":32,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":32,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q32 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2534af582ab90bd8739962daef3b0788$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q32 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q32 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q33 id already exists: c5b8472cfc0debc6788a5b6e0';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q33 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$1389b8b0480ef0eb838d92a82724f36c$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q33 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At the start of the shift, an RN from the medical unit is floated to pediatrics, where she has never worked. The charge nurse assigns her a 6-year-old with diabetic ketoacidosis who is on an insulin infusion.$nclexmocb2b3$, $nclexmocb2b3$Which response is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell the charge nurse which competencies she lacks and ask for another assignment or a resource","Accept the assignment and ask the nursing assistant to double-check the insulin infusion rate hourly","Accept the assignment and read the pediatric insulin protocol before starting the shift today","Decline to work on the unit and return to the medical unit, not speaking to anyone first"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the charge nurse which competencies she lacks and ask for another assignment or a resource$nclexmocb2b3$, $nclexmocb2b3$Nurses accept assignments only when competent to perform them. Telling the charge nurse about the gap lets the unit adjust assignments or provide a resource without leaving clients without a nurse.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Recognize limitations of self and others and utilize resources","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 4: accountability and competence","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"NCSBN-MODEL","label":"NCSBN Model Act (Revised August 2026)","locator":"Art. III item 3 (acts commensurate with education, demonstrated competencies and experience) and Art. II item 4 (competence)","url":"https://www.ncsbn.org/public-files/2026_ncsbn_model_act.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":33,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":33,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q33 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$1389b8b0480ef0eb838d92a82724f36c$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q33 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q33 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q34 id already exists: cbb6b6f3d8fd4538fadcba56b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q34 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$8925b71dfed9d32bbfc6e009b45d7680$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q34 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At a community health fair, a man with a sore throat and a temperature of 100.9 F asks an RN, 'What antibiotic should I buy? I can get a prescription through my friend's telehealth account.'$nclexmocb2b3$, $nclexmocb2b3$Which response is appropriate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Name the antibiotic that has worked for the RN's own family and advise him to ask for it by name","Offer to call his pharmacy to authorize a refill of the antibiotic he took last time","Explain that diagnosing and prescribing are outside RN scope, and advise him to see a provider soon","Write a note on the fair's form recommending an antibiotic and give it to him for his telehealth visit"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that diagnosing and prescribing are outside RN scope, and advise him to see a provider soon$nclexmocb2b3$, $nclexmocb2b3$RNs do not diagnose or prescribe unless licensed and authorized as an advanced practice nurse. The RN can assess, teach and refer, and should not use a friend's account.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care within the legal scope of practice","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-MODEL","label":"NCSBN Model Act (Revised August 2026)","locator":"Art. III Sec. 2.C (RN scope) versus Sec. 3.C-D (APRN diagnosing, prescribing and ordering)","url":"https://www.ncsbn.org/public-files/2026_ncsbn_model_act.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":34,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":34,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q34 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$8925b71dfed9d32bbfc6e009b45d7680$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q34 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q34 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q35 id already exists: cd449c6580cd86e2f9630c476';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q35 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$4f23508583b01f5f9e417bdd26d8b503$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q35 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A new graduate RN is orienting to the intensive care unit. A provider orders norepinephrine to be titrated to a mean arterial pressure above 65 mm Hg. Hospital policy lets only RNs with validated competency titrate vasopressors, and she has not yet been validated.$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell the charge nurse of the policy limit and ask a validated RN to take over the titration","Titrate while a second RN checks each change that she makes to the infusion rate at the bedside","Ask the provider to change the order to a fixed rate and then run the infusion on her own","Titrate cautiously after reviewing the drug reference and the policy once more at the bedside"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the charge nurse of the policy limit and ask a validated RN to take over the titration$nclexmocb2b3$, $nclexmocb2b3$Practice within employer competency limits protects the client. The new graduate hands the task to a validated RN and learns it through the orientation process, not by supervised work outside validation.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Recognize limitations of self and others and utilize resources","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 4: accountability and competence","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":35,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":35,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q35 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$4f23508583b01f5f9e417bdd26d8b503$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q35 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q35 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q36 id already exists: c71c4db192ad529da316bd55e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q36 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$7a7a75a08f0d1719c372b92bcda5012a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q36 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client who had a CT of the abdomen this morning asks the RN, 'Does the scan show cancer? The report is already in my chart.' The provider has not yet discussed the result with him.$nclexmocb2b3$, $nclexmocb2b3$What should the RN say?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Say that the report is part of his record, so she can read the radiologist's findings to him now","Say that the provider will discuss the results with him, then tell the provider that he is asking","Say that the scan most likely shows nothing serious, since the provider has not called to discuss it","Say that she can explain what the radiologist's terms usually mean for most clients with such scans"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Say that the provider will discuss the results with him, then tell the provider that he is asking$nclexmocb2b3$, $nclexmocb2b3$Interpreting and disclosing a new diagnosis is the provider's role. The RN honors the client's wish to know by making sure the provider hears of it promptly.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care within the legal scope of practice","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: informed choice","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): right to be informed of health status","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":36,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":36,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q36 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$7a7a75a08f0d1719c372b92bcda5012a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q36 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q36 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q37 id already exists: cc45e6a941c31fe310dc4891f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q37 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e38b7c4a13a12f0bf3b1d2d2b4e88911$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q37 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reports for her fourth consecutive 12-hour shift. She has slept little, and the supervisor asks her to stay for an additional 4 hours because of low staffing. The RN believes that she is too tired to practice safely.$nclexmocb2b3$, $nclexmocb2b3$Which response is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell the supervisor that fatigue limits her safe care of clients, and decline extra time","Accept the hours but ask for a lighter group made up of the most stable clients in the unit","Accept the hours and use caffeine and short breaks to stay alert through the shift","Stay for the hours, and write a note stating that she was asked to do so against her wishes"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the supervisor that fatigue limits her safe care of clients, and decline extra time$nclexmocb2b3$, $nclexmocb2b3$A nurse owes the same duty of care to self as to others and may decline when impaired by fatigue. Working while unsafe risks the clients, regardless of how the assignment is adjusted.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Recognize limitations of self and others","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 5: duty to self","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":37,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":37,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q37 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e38b7c4a13a12f0bf3b1d2d2b4e88911$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q37 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q37 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q38 id already exists: c85a18b5cba7eeb100dd63898';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q38 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$c6018b79cb01d4d070af01521d75bb7d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q38 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A nurse manager tells an RN to perform a procedure that the hospital's policy allows RNs to perform. The RN knows that the state nurse practice act and board rules do not include the procedure in RN practice.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Decline, explain the conflict with the practice act, and ask the manager to seek board guidance","Perform it, because hospital policy binds the staff and the employer carries the liability for it","Perform it if experienced RNs on the unit have done it for years with no problems arising","Perform it while a provider is in the room to observe the procedure from start to finish"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Decline, explain the conflict with the practice act, and ask the manager to seek board guidance$nclexmocb2b3$, $nclexmocb2b3$Scope of practice comes from the state's nurse practice act and board rules. Employer policy cannot widen it, and a provider's presence does not change the RN's licensure obligation.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care within the legal scope of practice","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-MODEL","label":"NCSBN Model Act (Revised August 2026)","locator":"Art. III Sec. 2.B: practices within the legal boundaries of the Act and administrative rules","url":"https://www.ncsbn.org/public-files/2026_ncsbn_model_act.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$,
    false, false, true,
    4, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":38,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":38,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q38 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$c6018b79cb01d4d070af01521d75bb7d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q38 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q38 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q39 id already exists: c0c0a4a160d5e424ac64206b9';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q39 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$dfb67ab914121ef42bc21e38174fe35a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q39 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An agency nurse working her first shift on the unit has not used the facility's electronic medication system. She is assigned six clients, and the 0900 medication pass begins in 30 minutes.$nclexmocb2b3$, $nclexmocb2b3$Which action by the charge RN best supports safe care?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Let her give the medications under a colleague's login, since the colleague knows the electronic system","Tell her to follow another nurse through the morning medication pass and take notes as she goes","Let her start on her own, and offer to help if she asks for it at some point during the pass","Arrange for a super-user to show her the electronic tools before she gives her first dose of the shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Arrange for a super-user to show her the electronic tools before she gives her first dose of the shift$nclexmocb2b3$, $nclexmocb2b3$The gap is in using the system, and a trained resource can close it quickly before medications are given. Giving unfair assignments, observation only or waiting for a request leaves risk or wastes resources.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Recognize limitations of self and others and utilize resources","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 4","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":39,"subtopic":"Scope of practice and limitations of self and others","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":39,"subtopic":"Scope of practice and limitations of self and others"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q39 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$dfb67ab914121ef42bc21e38174fe35a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q39 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q39 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q40 id already exists: c6010da82090380d7998e391d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q40 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$bfebd9ba4b2b4bdd4ffaf030b97b799a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q40 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A unit wants to reduce falls by adding scheduled hourly checks of clients' pain, position, toileting and the call light. The manager asks how to start.$nclexmocb2b3$, $nclexmocb2b3$Which approach follows the Model for Improvement?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Try the checks with one nurse on one shift, review the results, and adjust them before widening use","Begin hospital-wide on the same day so that results can be measured across the hospital within a month","Hold a vote among the nurses and begin if most of them say that they prefer the new routine","Run the checks for a full year on the unit and then review the annual fall counts for a change"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Try the checks with one nurse on one shift, review the results, and adjust them before widening use$nclexmocb2b3$, $nclexmocb2b3$Changes are tested on a small scale, studied against data and revised through repeated cycles before they are spread. Large starts, votes and delayed review slow learning and raise risk.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Participate in performance improvement projects and quality improvement processes","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"IHI-MFI","label":"IHI Model for Improvement","locator":"Model for Improvement: small-scale PDSA cycles","url":"https://www.ihi.org/library/model-for-improvement"},{"src":"CFR-482-21","label":"42 CFR 482.21 Condition of participation: Quality assessment and performance improvement program","locator":"(b)(2): use data to identify opportunities for improvement","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.21"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":40,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":40,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q40 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$bfebd9ba4b2b4bdd4ffaf030b97b799a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q40 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q40 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q41 id already exists: cf2814a43ce53b6f77dce9118';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q41 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$42a82e807ea07df3e0fc35e6d1a52746$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q41 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A unit audit shows that pain was reassessed within 1 hour for 52% of IV opioid doses. The unit's target is 90%. The manager asks the staff for help with the improvement project.$nclexmocb2b3$, $nclexmocb2b3$Which contribution by an RN is most useful?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Reviewing why reassessments are missed, like workflow or prompts, and reporting findings","Charting reassessments for the doses at the end of the shift so that the target is reached","Asking the manager to discipline the nurses with the lowest documentation rates","Reminding each nurse by email to document pain reassessment on time after each opioid dose"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Reviewing why reassessments are missed, like workflow or prompts, and reporting findings$nclexmocb2b3$, $nclexmocb2b3$Improvement projects look for process causes in the data before changing practice. Backfilling charts is falsification, and blame or reminders do not address the underlying causes.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Participate in performance improvement projects and quality improvement processes","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-21","label":"42 CFR 482.21 Condition of participation: Quality assessment and performance improvement program","locator":"(a)(2) and (b)(2): measure, analyze and use quality indicator data","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.21"},{"src":"IHI-MFI","label":"IHI Model for Improvement","locator":"Model for Improvement","url":"https://www.ihi.org/library/model-for-improvement"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":41,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":41,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q41 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$42a82e807ea07df3e0fc35e6d1a52746$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q41 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q41 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q42 id already exists: c976ec051f6ae536b49fd76cf';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q42 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$c347e9470b81abccaff852f676f35006$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q42 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A nurse asks why the unit still follows a 2009 protocol for pressure injury prevention when newer guidelines have been released.$nclexmocb2b3$, $nclexmocb2b3$Which action best supports evidence-based practice?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Follow what the most experienced nurses on the unit have done for years with good results","Switch to the practice she used at her previous hospital, starting with her own assignments","Look up the current recommendations and bring a summary to the practice council for review","Wait for the manager to hand out an updated protocol rather than raise the question herself"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Look up the current recommendations and bring a summary to the practice council for review$nclexmocb2b3$, $nclexmocb2b3$Evidence-based practice means finding current evidence and taking it through the unit's governance. Tradition, personal habit or inaction does not do this.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Utilize resources to promote quality client care (evidence-based research)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NPIAP-2019","label":"Prevention and Treatment of Pressure Ulcers/Injuries: Clinical Practice Guideline, 3rd ed. (EPUAP/NPIAP/PPPIA)","locator":"Pressure injury prevention guideline","url":"https://www.internationalguideline.com/2019"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":42,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":42,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q42 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$c347e9470b81abccaff852f676f35006$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q42 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q42 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q43 id already exists: c1a6de55cd93031b09f66b54a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q43 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$471de184b86ce458f0bbb70b988e9bbd$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q43 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with pneumonia has been improving. A CBC, a basic metabolic panel and a magnesium level have been drawn daily for 5 days, with results in the normal range, and the orders still read 'daily.'$nclexmocb2b3$, $nclexmocb2b3$Which action reflects cost-effective, quality care?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask the provider whether each test is still needed in his case or could be ordered less often","Stop drawing the tests that the RN thinks are not needed and tell the next shift about it","Draw the basic metabolic panel and skip the other tests on that day in order to save on costs","Ask the lab to combine the tests into one tube drawn on alternate days, with no call to the provider"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the provider whether each test is still needed in his case or could be ordered less often$nclexmocb2b3$, $nclexmocb2b3$The RN advocates for value by questioning an order that may no longer help, but only the prescriber can change it. Skipping or altering tests without an order is outside RN scope.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Practice and advocate for quality and cost-effective care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3: promote health and safety within resources","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":43,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":43,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q43 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$471de184b86ce458f0bbb70b988e9bbd$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q43 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q43 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q44 id already exists: c129de1a9a3488cab8001dfe4';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q44 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$4768a64ff20f3d02d93dea8d8d6e3305$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q44 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A unit's falls per 1,000 patient-days were 5.1, 4.8 and 5.0 in the 3 months before a new rounding routine, and then 3.9, 3.0 and 2.6 in the 3 months after it began.$nclexmocb2b3$, $nclexmocb2b3$What should the team do next?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Continue the routine and track the rate for several more months, sharing the data with the staff","Cut tracking back to a yearly review, because the rate has fallen on the unit this quarter","Make the routine part of unit policy and report the project as complete after one more month of data","Move to hourly rounding on nights as well, to see whether the rate falls further on that shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Continue the routine and track the rate for several more months, sharing the data with the staff$nclexmocb2b3$, $nclexmocb2b3$The trend supports the change, but ongoing measurement checks that the gain holds and that other factors are not responsible. Closing the project without data, or chasing zero, does not follow from the results.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Participate in performance improvement projects and quality improvement processes","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-21","label":"42 CFR 482.21 Condition of participation: Quality assessment and performance improvement program","locator":"(b)(2): monitor effectiveness and sustain improvements","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.21"},{"src":"IHI-MFI","label":"IHI Model for Improvement","locator":"Model for Improvement: measure, test, implement","url":"https://www.ihi.org/library/model-for-improvement"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":44,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":44,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q44 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$4768a64ff20f3d02d93dea8d8d6e3305$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q44 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q44 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q45 id already exists: ce2a8d6730fa7a19d297c17a8';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q45 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$4d17de6a69d2ebc5268105d904e98997$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q45 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN on a medical-surgical unit joins a quality improvement effort to improve the timeliness of discharge teaching.$nclexmocb2b3$, $nclexmocb2b3$Which RN actions support the quality improvement effort? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Helping audit a sample of charts for the time at which discharge teaching was documented","Trying a new teaching routine on her own shift for a month, based on what she personally prefers to do","Entering a delayed or missed teaching event in the event reporting system when it is noticed","Keeping a private list of the discharge delays that the RN notices on her own shifts","Suggesting a change after noticing teaching delays on discharge days, and offering to help test it","Dropping the measure after one month in which the discharge teaching times did not change"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Helping audit a sample of charts for the time at which discharge teaching was documented|||Entering a delayed or missed teaching event in the event reporting system when it is noticed|||Suggesting a change after noticing teaching delays on discharge days, and offering to help test it$nclexmocb2b3$, $nclexmocb2b3$Quality improvement depends on transparent reporting, baseline and ongoing data and constructive proposals that the team tests. A change tried alone on personal preference, delays tracked privately, and a measure dropped after one month prevent the team from learning.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Participate in performance improvement projects and quality improvement processes","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-PSNET","label":"AHRQ PSNet primer: Reporting Patient Safety Events","locator":"Reporting patient safety events; system-focused response","url":"https://psnet.ahrq.gov/primer/reporting-patient-safety-events"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":45,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":45,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q45 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$4d17de6a69d2ebc5268105d904e98997$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q45 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q45 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q46 id already exists: c65b0e5419ff8ca40a1ab2e8d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q46 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$a7fe11e092169a73ef0d9a3391a06d56$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q46 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN receives an electronic alert that two newly ordered drugs, both known to prolong the QT interval, interact. Over the past month she has dismissed many routine alerts that proved unimportant.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Override the alert, because the prescriber chose both of the drugs on purpose for this client today","Give both drugs and plan to compare an ECG with the previous tracing the next morning","Wait for the pharmacy to call her if the interaction is judged by the pharmacist to be important","Read the alert, check the recent ECG and QTc, and call the pharmacist or prescriber about the pair"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Read the alert, check the recent ECG and QTc, and call the pharmacist or prescriber about the pair$nclexmocb2b3$, $nclexmocb2b3$Alert fatigue does not remove the duty to act on a clinically significant warning. The RN uses the client's data and calls the right resource before giving drugs.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Utilize resources to promote quality client care (information technology)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ISMP-HIGHALERT","label":"ISMP List of High-Alert Medications in Acute Care Settings (ISMP)","locator":"Medication safety","url":"https://www.ismp.org/recommendations/high-alert-medications-acute-list"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":46,"subtopic":"Quality improvement, evidence and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":46,"subtopic":"Quality improvement, evidence and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q46 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$a7fe11e092169a73ef0d9a3391a06d56$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q46 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q46 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q47 id already exists: c51fae6c9e9ecb88db5da9244';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q47 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2102c91428c384c75b41d32873e423a8$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q47 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reads a handwritten order: 'Regular insulin 10 U subcut before meals.' The prescriber is on the unit.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Interpret 'U' as units, which is its usual meaning, and give the dose as it is written","Rewrite the order in the record with 'units' spelled out and then give the dose","Ask the pharmacist to interpret the order and give the insulin if the pharmacist agrees","Ask the prescriber to rewrite the order in full words before the dose is given today"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the prescriber to rewrite the order in full words before the dose is given today$nclexmocb2b3$, $nclexmocb2b3$'U' is on the official do-not-use list because it has been mistaken for 0 or 4. The prescriber must rewrite the order, since the RN or pharmacist should not alter or reinterpret a prescriber's order.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use approved terminology when documenting care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"TJC-DNU","label":"Joint Commission Do Not Use list of abbreviations","locator":"Do-Not-Use list: U, u (write unit)","url":"https://www.jointcommission.org/en-us/knowledge-library/support-center/standards-interpretation/do-not-use-list-of-abbreviations"},{"src":"ISMP-ABBR","label":"ISMP List of Error-Prone Abbreviations, Symbols, and Dose Designations (2024)","locator":"Error-prone abbreviations: U or u","url":"https://www.ismp.org/system/files/resources/2024-04/ISMP_ErrorProneAbbreviation_List.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":47,"subtopic":"Documentation and approved terminology","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":47,"subtopic":"Documentation and approved terminology"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q47 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2102c91428c384c75b41d32873e423a8$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q47 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q47 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q48 id already exists: c4465ed3a5d2f1b54a17e09d9';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q48 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$7c7288933a752db84fbd4f06e86a899b$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q48 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A nurse reviews handwritten medication orders for a client on a surgical unit.$nclexmocb2b3$, $nclexmocb2b3$For which entries should the nurse ask the prescriber for a correction because they violate the Joint Commission 'Do Not Use' list? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Morphine 2 mg IV four times daily","Warfarin 5.0 mg PO daily at 1700","Levothyroxine .1 mg PO daily","Insulin glargine 20 units subcut daily","MS 4 mg IV every 4 hours as needed","Heparin 5,000 U subcut every 12 hours"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Warfarin 5.0 mg PO daily at 1700|||Levothyroxine .1 mg PO daily|||MS 4 mg IV every 4 hours as needed|||Heparin 5,000 U subcut every 12 hours$nclexmocb2b3$, $nclexmocb2b3$The list prohibits 'U', a trailing zero after the decimal point, a missing leading zero and the abbreviation 'MS'. Warfarin 5.0 mg (trailing zero), levothyroxine .1 mg (no leading zero), 'MS' and 'U' need correction; the morphine and insulin entries spell out drug names and units and are written correctly.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use approved terminology when documenting care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"TJC-DNU","label":"Joint Commission Do Not Use list of abbreviations","locator":"Do-Not-Use list: U, trailing zero, lack of leading zero, MS and MSO4","url":"https://www.jointcommission.org/en-us/knowledge-library/support-center/standards-interpretation/do-not-use-list-of-abbreviations"},{"src":"ISMP-ABBR","label":"ISMP List of Error-Prone Abbreviations, Symbols, and Dose Designations (2024)","locator":"Error-prone abbreviations","url":"https://www.ismp.org/system/files/resources/2024-04/ISMP_ErrorProneAbbreviation_List.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":48,"subtopic":"Documentation and approved terminology","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":48,"subtopic":"Documentation and approved terminology"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q48 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$7c7288933a752db84fbd4f06e86a899b$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q48 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q48 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q49 id already exists: cfd977b96c6f6509f49726552';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q49 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$ddd1e8254a823ef55719983b49c0a33f$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q49 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 1400, an RN realizes that she did not chart a PRN pain medication that she gave at 0930. The client's pain score documented at 1000 reads 2/10, and the MAR still shows the dose as available.$nclexmocb2b3$, $nclexmocb2b3$Which action is appropriate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Make a late entry with today's date and time for the 0930 dose and mark the MAR as given","Enter it with a time of 0930, so that the record stays in sequence with the other notes","Mark the dose on the MAR as given at 1400 and add no entry in the notes about the 0930 dose","Insert it in a blank space between the 0930 and 1000 entries and add her initials beside it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Make a late entry with today's date and time for the 0930 dose and mark the MAR as given$nclexmocb2b3$, $nclexmocb2b3$Entries must be accurate, dated and timed when made. A late entry is labeled as such and gives the true time of the care, and the MAR is updated so the dose shows as given and cannot be repeated. Back-timing, inserting between entries, or charting the wrong time on the MAR changes the record's integrity.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use approved terminology when documenting care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(1): entries complete, dated, timed and authenticated","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Principles: accurate, timely, auditable","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":49,"subtopic":"Documentation and approved terminology","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":49,"subtopic":"Documentation and approved terminology"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q49 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$ddd1e8254a823ef55719983b49c0a33f$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q49 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q49 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q50 id already exists: c5a8f8328a82973cd6528ba5d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q50 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$28d066412980ed87dfb626d386741750$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q50 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN enters an assessment into the wrong client's paper flowsheet and notices it a few minutes later. The facility uses paper flowsheets for vital signs.$nclexmocb2b3$, $nclexmocb2b3$How should the RN correct the entry?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Cover the entry with correction fluid and then rewrite the correct data over the covered area","Draw one line through the entry, write 'error' with initials and date, then chart it right","Black out the entry so that the data entered by mistake cannot be read by anyone","Tear out the page and replace it with a new flowsheet that shows the correct data on it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Draw one line through the entry, write 'error' with initials and date, then chart it right$nclexmocb2b3$, $nclexmocb2b3$Corrections to a paper record keep the original legible, show who changed it and when, and never conceal data. Erasing or removing pages destroys the record.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use approved terminology when documenting care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(1): entries legible, authenticated","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Principles: auditable, authenticated entries","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":50,"subtopic":"Documentation and approved terminology","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":50,"subtopic":"Documentation and approved terminology"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q50 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$28d066412980ed87dfb626d386741750$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q50 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q50 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q51 id already exists: ccbae9c905e3a66090d647723';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q51 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$72da05d7f897d7279d79fbee04807792$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q51 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN opens the electronic record to chart on a client she has cared for over three shifts. She sees that the system can copy forward the previous shift's assessment note.$nclexmocb2b3$, $nclexmocb2b3$Which action keeps the documentation accurate?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Copy the note forward and add an addendum if something changed since the last shift","Copy the note forward as it is, because the earlier entries were already authenticated by others","Wait until the end of the week and enter one summary note covering each of the days that she worked","Compare each copied statement with today's assessment and edit or delete what is not verified"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Compare each copied statement with today's assessment and edit or delete what is not verified$nclexmocb2b3$, $nclexmocb2b3$Each entry must reflect the nurse's own assessment at that time. Copied text that is not checked can record findings that were not observed and weakens the record's reliability.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use approved terminology when documenting care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(1): entries complete and authenticated by the person providing the service","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Principles: accurate entries and system policy","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":51,"subtopic":"Documentation and approved terminology","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":51,"subtopic":"Documentation and approved terminology"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q51 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$72da05d7f897d7279d79fbee04807792$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q51 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q51 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q52 id already exists: c3338f4ce703c94a733ed2e4c';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q52 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$d27185d919bc0647a03476e083c001a0$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q52 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 0700, an RN who cares for four clients receives the following tasks.$nclexmocb2b3$, $nclexmocb2b3$Place the tasks in the order in which the RN should do them, from first to last.$nclexmocb2b3$, $nclexmocb2b3${"kind":"ordered_response","options":["Check the telemetry alarm that shows a sustained rapid rhythm for the client in room 12","Give lispro insulin to the client in room 14 whose breakfast tray has just arrived","Restock the supply cart in the medication room","Complete the admission health history for a stable client who arrived at 0500"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Check the telemetry alarm that shows a sustained rapid rhythm for the client in room 12|||Give lispro insulin to the client in room 14 whose breakfast tray has just arrived|||Complete the admission health history for a stable client who arrived at 0500|||Restock the supply cart in the medication room$nclexmocb2b3$, $nclexmocb2b3$Immediate threats to the client come first, then time-critical medicines, then required but flexible tasks, and last the routine unit work.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Organize workload to manage time effectively","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Prioritization frameworks","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$ordered_response$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":52,"subtopic":"Organizing workload and time","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":52,"subtopic":"Organizing workload and time"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q52 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$d27185d919bc0647a03476e083c001a0$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q52 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q52 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q53 id already exists: c30eb7189948bdaa01702df38';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q53 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$d27ba2e3c96c1c2ac1ae6b1d9b5d4320$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q53 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 1000, an RN has three discharge teaching sessions, a dressing change, two medication passes due and a new admission. She is falling behind, and the aide is free.$nclexmocb2b3$, $nclexmocb2b3$Which action best manages the workload?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Stay late to finish the teaching and skip her own breaks so that she can catch up with the work","Ask the charge nurse for help with the RN-only tasks and delegate suitable tasks to the aide","Cluster the nonurgent tasks at the end of the shift and decide how to handle them then","Postpone the new admission assessment until the first medication pass has been finished"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the charge nurse for help with the RN-only tasks and delegate suitable tasks to the aide$nclexmocb2b3$, $nclexmocb2b3$The RN uses team resources and delegates within scope. Skipping breaks or pushing tasks to the end of the shift raises the risk of missed care.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Organize workload to manage time effectively","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Five rights of delegation","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":53,"subtopic":"Organizing workload and time","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":53,"subtopic":"Organizing workload and time"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q53 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$d27ba2e3c96c1c2ac1ae6b1d9b5d4320$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q53 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q53 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q54 id already exists: c05dbb42dd92aaac10f4c7e91';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q54 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e57c559f37c1092e5b18356014c10c4e$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q54 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN who prepares medications is interrupted several times during each medication pass by questions and calls. She has made one near-miss error this month because of an interruption.$nclexmocb2b3$, $nclexmocb2b3$Which strategy is most likely to reduce errors?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Prepare medications in a quiet area, and wear a vest that signals she must not be disturbed","Prepare the shift's medications together at the start so that fewer passes are needed overall","Ask the unit clerk to hold the calls for the nurses until the end of the medication pass","Work faster during preparation so that interruptions have less time to occur"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Prepare medications in a quiet area, and wear a vest that signals she must not be disturbed$nclexmocb2b3$, $nclexmocb2b3$Reducing interruptions at the point of medication preparation is the best-supported way to prevent related errors. Preparing early, delaying calls that may be urgent or rushing adds risk.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Organize workload to manage time effectively","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ISMP-HIGHALERT","label":"ISMP List of High-Alert Medications in Acute Care Settings (ISMP)","locator":"Medication safety practices","url":"https://www.ismp.org/recommendations/high-alert-medications-acute-list"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":54,"subtopic":"Organizing workload and time","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":54,"subtopic":"Organizing workload and time"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q54 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e57c559f37c1092e5b18356014c10c4e$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q54 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q54 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q55 id already exists: c236052925da8dd2e6490d4cb';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q55 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$40aaf178a7733ed44bc5bc40dbd429d0$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q55 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 0900, an RN has three tasks. One client leaves for a CT scan at 1000 and is due for a pain medication timed to the scan at 0930. A second client has a dressing change due at 1100, and a third needs the weekly weight recorded by noon.$nclexmocb2b3$, $nclexmocb2b3$Which task should the RN complete before 0945?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give the pain medication timed to the scan first, then finish the other two by their own due times","Change the 1100 dressing early while the client is comfortable, to leave more time for the later tasks","Record the weekly weight first, because it takes the least time and clears one task from the list","Ask the CT department to move the scan to the afternoon so that the three tasks fit before noon today"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Give the pain medication timed to the scan first, then finish the other two by their own due times$nclexmocb2b3$, $nclexmocb2b3$Tasks tied to a fixed time and a client leaving the unit have to be done first. Weights and dressings with later due times can follow.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Organize workload to manage time effectively","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":55,"subtopic":"Organizing workload and time","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":55,"subtopic":"Organizing workload and time"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q55 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$40aaf178a7733ed44bc5bc40dbd429d0$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q55 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q55 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q56 id already exists: cb498ee7d9e852851778b2d19';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q56 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$813f3b4e26b8e91aa6863b4f3c3c78db$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q56 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with COPD admitted for an exacerbation has a goal of an SpO2 of 90% or more on 2 L/min within 24 hours. At 36 hours the SpO2 is 87% on 2 L/min, with a respiratory rate of 24/min, down from 30/min on admission.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Keep the plan unchanged, because the time frame for the goal was merely an estimate at the start","Lower the goal to an SpO2 of 85% so that the goal can be considered to have been met by now","Mark the goal as met, since the respiratory rate has improved since admission","Reassess the client, report the findings to the provider and update the plan's interventions"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Reassess the client, report the findings to the provider and update the plan's interventions$nclexmocb2b3$, $nclexmocb2b3$A goal that is not met on schedule calls for reassessment and revision of the plan with the team. Changing the goal to fit the data or ignoring the gap leaves the client's problem unaddressed.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Initiate, evaluate and update client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"GOLD-2026","label":"GOLD 2026 Report: Global Strategy for the Diagnosis, Management, and Prevention of COPD (GOLD)","locator":"Hospital management of COPD exacerbation","url":"https://goldcopd.org/2026-gold-report-and-pocket-guide/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":56,"subtopic":"Plan of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":56,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q56 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$813f3b4e26b8e91aa6863b4f3c3c78db$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q56 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q56 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q57 id already exists: c5d9211f74faef69b80936e75';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q57 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$68f8285a575f40cdfcd2ec37399c8186$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q57 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is evaluating the plan of care for a client who has been on the unit for 3 days.$nclexmocb2b3$, $nclexmocb2b3$Which actions are part of evaluating the plan of care? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Comparing the client's current findings with the expected outcomes in the plan","Reviewing the plan when the provider requests a progress update on the client","Asking the nursing assistant to decide whether each goal has been met","Changing the goals or interventions when the outcomes are not being met","Carrying the first day's goals forward on each new shift with the date updated","Asking the client about his progress and his satisfaction with the care"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Comparing the client's current findings with the expected outcomes in the plan|||Changing the goals or interventions when the outcomes are not being met|||Asking the client about his progress and his satisfaction with the care$nclexmocb2b3$, $nclexmocb2b3$Evaluation compares data with outcomes, includes the client's view and leads to revision. Reviewing only on request, copying goals forward or assigning the judgment to unlicensed staff does not meet the RN's responsibility.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Initiate, evaluate and update client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Evaluation is not delegable","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":57,"subtopic":"Plan of care","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":57,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q57 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$68f8285a575f40cdfcd2ec37399c8186$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q57 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q57 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q58 id already exists: c5eb712c4966f7b7de27da8d7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q58 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$578bc0c8314e72ff013b0ef06ab2a9f4$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q58 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 52-year-old woman newly diagnosed with type 2 diabetes tells the RN that she already exercises with friends three times a week and does not want a plan that is only about food rules.$nclexmocb2b3$, $nclexmocb2b3$How should the RN update the plan of care?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Keep the dietary goals as the main focus and mention exercise as an optional extra later","Revise the goals with her, so that her current routine counts toward the activity target in her plan","Document that she declined the plan and review it with her at the next clinic visit","Replace her current routine with a supervised exercise class that the clinic runs on two evenings a week"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Revise the goals with her, so that her current routine counts toward the activity target in her plan$nclexmocb2b3$, $nclexmocb2b3$A plan works best when it is built on the client's own routines and priorities. The RN adapts the goals instead of overriding them or waiting for a change of heart.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Initiate, evaluate and update client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":58,"subtopic":"Plan of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":58,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q58 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$578bc0c8314e72ff013b0ef06ab2a9f4$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q58 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q58 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q59 id already exists: c737cd1d93b1a8a14bb302c72';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q59 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$73b0a66d4037d755570f9f4dc2c6cd8c$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q59 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$On admission, an 82-year-old client who is on bed rest after a hip fracture has a Braden score of 12. Her sacral skin is intact but red, and the redness does not blanch when pressed. The initial plan of care has no skin interventions.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Repeat the Braden assessment in three days and add protective measures to the plan if her score has dropped","Document the redness in the admission note and continue to follow the care plan as it is written down","Add skin protection and a turning schedule to the plan, and request an order for a low-air-loss mattress","Tell the nursing assistant to turn her when she asks to be repositioned or says she feels sore"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Add skin protection and a turning schedule to the plan, and request an order for a low-air-loss mattress$nclexmocb2b3$, $nclexmocb2b3$A Braden score of 12 indicates high risk, and non-blanchable redness over intact skin is an early pressure injury. The RN must include prevention and treatment in the plan from the start, using orders for equipment as needed. Waiting or relying on the client's requests allows injury.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Initiate, evaluate and update client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NPIAP-2019","label":"Prevention and Treatment of Pressure Ulcers/Injuries: Clinical Practice Guideline, 3rd ed. (EPUAP/NPIAP/PPPIA)","locator":"Risk assessment and prevention","url":"https://www.internationalguideline.com/2019"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":59,"subtopic":"Plan of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":59,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q59 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$73b0a66d4037d755570f9f4dc2c6cd8c$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q59 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q59 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q60 id already exists: cae466aef8cb01e628f6cae7d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q60 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2d8e6ed6bfd9523474a18a00497074ba$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q60 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An ICU RN is transferring a stable client to a medical unit.$nclexmocb2b3$, $nclexmocb2b3$Which actions are part of a safe transfer? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Having the unit clerk give the receiving unit an update on the client's condition","Reconciling the client's medications and requesting updated orders for the new unit","Giving the receiving RN a report that is limited to the problems of the past 24 hours","Moving the client once the bed is assigned and giving the report after he arrives on the unit","Giving a verbal report to the receiving RN that includes lines, drains and pending tests","Waiting to confirm the transfer order until the client has arrived on the new unit"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Reconciling the client's medications and requesting updated orders for the new unit|||Giving a verbal report to the receiving RN that includes lines, drains and pending tests$nclexmocb2b3$, $nclexmocb2b3$A safe transfer combines reconciled medications and orders for the new unit with a complete verbal report from RN to RN. Delegating the report, giving a partial report, moving the client before the unit is ready or confirming the order late weakens continuity.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Perform procedures necessary to safely admit, transfer and/or discharge a client","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(b): transmit necessary information at transfer","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":60,"subtopic":"Admission, transfer and discharge","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":60,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q60 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2d8e6ed6bfd9523474a18a00497074ba$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q60 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q60 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q61 id already exists: c2262d66225314f46e600b353';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q61 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$5e7522556d32a89906d24ce7eea6befa$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q61 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client is ready for discharge home at 1500, and a family member is waiting in the lobby. The RN finds that the new prescriptions for an anticoagulant and an antibiotic have not been sent to the pharmacy.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Discharge the client and ask him to get the prescriptions at his follow-up appointment this week","Contact the provider to request the prescriptions and delay the discharge until they reach the pharmacy","Ask the unit clerk to e-prescribe the drugs from the medication list that is shown in the record","Ask the charge nurse to approve the discharge because the progress note lists both of the drugs in use now"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Contact the provider to request the prescriptions and delay the discharge until they reach the pharmacy$nclexmocb2b3$, $nclexmocb2b3$The discharge cannot be completed safely without the prescriptions the plan calls for. Only the prescriber can issue them; a clerk or charge nurse cannot substitute.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Perform procedures necessary to safely admit, transfer and/or discharge a client","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(a)-(b): discharge planning and transmission of information","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":61,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":61,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q61 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$5e7522556d32a89906d24ce7eea6befa$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q61 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q61 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q62 id already exists: ca1fb0c93f1b84eef2e03dec7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q62 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2d3b4b776ef1de51fdffc455466abbc7$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q62 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with pneumonia who is receiving IV antibiotics says, 'I'm leaving now. I have to get home to my dog.' He is oriented and has decision-making capacity.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask security to keep him on the unit until the provider has come to evaluate his condition and decide on his care","Have him sign the against-medical-advice form and then let him leave, and tell the provider at the end of the shift","Withhold the discharge instructions and prescriptions, because he is choosing to leave against advice","Explain the risks of leaving, tell the provider, offer the against-medical-advice form and give written advice"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain the risks of leaving, tell the provider, offer the against-medical-advice form and give written advice$nclexmocb2b3$, $nclexmocb2b3$A capable client has the right to leave. The RN ensures he understands the risks, notifies the provider, offers the facility's against-medical-advice process (signing is voluntary and does not replace the other steps) and gives safety information. Restraining him or withholding information is unlawful or unsafe.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Perform procedures necessary to safely admit, transfer and/or discharge a client","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): right to make informed decisions and refuse treatment","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":62,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":62,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q62 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2d3b4b776ef1de51fdffc455466abbc7$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q62 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q62 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q63 id already exists: cd5b6cc37c07a6defed7bfa5f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q63 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e4b9b0f9bb61fcda42e6b7f3679f62a2$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q63 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with sickle cell disease comes to the emergency department with severe pain and rates it 9 out of 10. He grimaces and curls up on the stretcher. A coworker says to the RN, 'He is probably just drug-seeking.'$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Assess his pain with the standard scale and treat it as ordered, like other clients in the department","Delay the medication until his vital signs show the objective changes that are expected with severe pain","Give a smaller dose than ordered until his history of prior opioid use has been fully checked out","Ask a coworker to assess him again to see whether his account of the pain stays consistent over time"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Assess his pain with the standard scale and treat it as ordered, like other clients in the department$nclexmocb2b3$, $nclexmocb2b3$Pain is what the client reports, and assumptions about a group must not change assessment or treatment. The RN uses the standard assessment and gives care as ordered.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Perform care for clients to support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1: respect for every person","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":63,"subtopic":"Unbiased treatment and equal access","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":63,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q63 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e4b9b0f9bb61fcda42e6b7f3679f62a2$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q63 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q63 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q64 id already exists: c5b4f5ddf22a3bdc98266dc6e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q64 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e4d940c161dd3719effe36a905a4b3a5$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q64 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client who practices Islam is fasting from sunrise to sunset during Ramadan. He takes an oral antibiotic three times daily and asks the RN whether he can still follow the fast.$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell him that antibiotics are best given with food, so he should consider postponing the fast until he recovers","Discuss his wish with the provider and pharmacist to see whether the dose times can be adjusted safely","Give the doses at the usual hours and chart that he refused the meals that were offered with them","Explain that the fast is his own decision and that the unit gives antibiotics at the standard times"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Discuss his wish with the provider and pharmacist to see whether the dose times can be adjusted safely$nclexmocb2b3$, $nclexmocb2b3$Culturally congruent care looks for safe ways to fit treatment into the client's practice. Dismissing his belief or declining to look for options ignores his right to equal access to care.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Perform care for clients to support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CLAS","label":"HHS OMH National CLAS Standards","locator":"Standard 1: respectful care responsive to cultural health beliefs and practices","url":"https://thinkculturalhealth.hhs.gov/clas/standards"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":64,"subtopic":"Unbiased treatment and equal access","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":64,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q64 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e4d940c161dd3719effe36a905a4b3a5$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q64 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q64 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q65 id already exists: ca384bfc75b3d83e47b74e42c';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q65 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$d60c891af7ce6238528cd0b6fd919e62$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q65 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A Deaf client who uses American Sign Language is admitted for surgery and needs teaching about his postoperative care.$nclexmocb2b3$, $nclexmocb2b3$Which actions provide equal access to care? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Asking an adult friend who knows some signing to interpret the consent discussion and teaching","Using a sign language phrase app on the nurse's phone to explain the postoperative care","Arranging a qualified sign language interpreter for teaching and consent discussions","Asking him to explain the teaching back in his own words through the interpreter","Asking the interpreter whether the client understands, rather than asking the client","Speaking directly to the client while the interpreter signs the words that are being said"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Arranging a qualified sign language interpreter for teaching and consent discussions|||Asking him to explain the teaching back in his own words through the interpreter|||Speaking directly to the client while the interpreter signs the words that are being said$nclexmocb2b3$, $nclexmocb2b3$Qualified interpreters, direct address to the client (not the interpreter), and teach-back through the interpreter support understanding and are keyed (C, D and F). An untrained friend, a phone app, and asking the interpreter instead of the client do not meet language-access expectations for consent and teaching.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Perform care for clients to support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CLAS","label":"HHS OMH National CLAS Standards","locator":"Standards 5-7: language assistance; avoid untrained or minor interpreters","url":"https://thinkculturalhealth.hhs.gov/clas/standards"},{"src":"HHS-LEP","label":"HHS OCR language access for persons with limited English proficiency","locator":"Language access","url":"https://www.hhs.gov/civil-rights/for-individuals/special-topics/limited-english-proficiency/index.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":65,"subtopic":"Unbiased treatment and equal access","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":65,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q65 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$d60c891af7ce6238528cd0b6fd919e62$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q65 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q65 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q66 id already exists: c038c351aea0ec94f732a7800';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q66 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e17a11e4089731dcca85c00f441dda01$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q66 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reviews patient responsibilities with a newly admitted client. Afterward, she asks the client to say what he has learned.$nclexmocb2b3$, $nclexmocb2b3$Which statement by the client shows an understanding of a patient responsibility?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["'I will tell my nurse about changes in my symptoms and ask questions when I am not sure about care'","'My main responsibility is to follow the plan as written, so I should not ask the staff to change it'","'After I sign a consent form, my responsibility is to go through with the procedure I agreed to'","'I may keep my medicine list to myself, since the staff can find what they need in my record'"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$'I will tell my nurse about changes in my symptoms and ask questions when I am not sure about care'$nclexmocb2b3$, $nclexmocb2b3$Responsibilities include giving accurate information, reporting changes and asking questions. A client may still ask for changes and may withdraw consent, and incomplete medication information is a safety risk.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide education to clients and staff about client rights and responsibilities","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(a)(1): notice of rights; (b)(2): informed decisions","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":66,"subtopic":"Client rights education and ethical dilemmas","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":66,"subtopic":"Client rights education and ethical dilemmas"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q66 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e17a11e4089731dcca85c00f441dda01$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q66 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q66 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q67 id already exists: c097ad30cf5f1f8fda379e887';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q67 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$3c080e5db67e35760cf8178650357e19$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q67 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A nursing assistant tells the RN, 'The client in room 8 won't take his bath, so I'll tell him it is not optional.'$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond to the assistant?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Support her plan, since hygiene is a basic care task that the unit requires for each client daily","Tell her to wait until the client falls asleep and then complete the bath while he sleeps","Explain that clients may refuse care, ask her to report it and look for a better time later","Tell her to ask the client's family to convince him to take the bath later that morning"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that clients may refuse care, ask her to report it and look for a better time later$nclexmocb2b3$, $nclexmocb2b3$Clients have the right to refuse care, and staff education includes reporting refusals to the RN. The RN works with the client to find a time or approach he accepts.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide education to clients and staff about client rights and responsibilities","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): right to refuse treatment","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":67,"subtopic":"Client rights education and ethical dilemmas","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":67,"subtopic":"Client rights education and ethical dilemmas"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q67 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$3c080e5db67e35760cf8178650357e19$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q67 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q67 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q68 id already exists: c77a0b462e42e4c1fdb64e8d3';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q68 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$33417cd6163122851ec622c6491e5f9a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q68 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is asked to assist with a scheduled surgery that conflicts with her deeply held moral beliefs. She has not told anyone yet, and the case is the next morning.$nclexmocb2b3$, $nclexmocb2b3$What is the RN's most appropriate action?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Report to work and refuse to assist when the client is already in the operating room for the case","Assist as assigned and then describe her disagreement in a note to the manager after the case","Call in sick for the shift, not telling anyone that the real reason is the case she was assigned","Tell the manager about her objection now so that another qualified nurse can be assigned in time"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the manager about her objection now so that another qualified nurse can be assigned in time$nclexmocb2b3$, $nclexmocb2b3$Nurses may act on moral convictions but must give timely notice so the client is never left without care. Last-minute refusal, silence or concealment harms the client and the team.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Recognize and report ethical dilemmas; practice in a manner consistent with the code of ethics","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 5: integrity and duty to self","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":68,"subtopic":"Client rights education and ethical dilemmas","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":68,"subtopic":"Client rights education and ethical dilemmas"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q68 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$33417cd6163122851ec622c6491e5f9a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q68 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q68 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q69 id already exists: c2c83623de5e4055b5ed17ede';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q69 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$f4ec7d89ded4a4ec024d7dccc08cec4d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q69 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$The adult children of a 78-year-old man with newly diagnosed pancreatic cancer ask the RN not to tell their father the diagnosis because 'it will take away his hope.' He is alert and has asked the RN, 'What did the tests show?'$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Honor the family's request and tell him that the provider has not yet reviewed the tests with the staff","Tell him the full diagnosis now, since he asked and he has the right to know it","Suggest that his children tell him the diagnosis themselves in the days after he is discharged home","Ask him what he wants to know, then tell the provider about the family's request and his own question"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask him what he wants to know, then tell the provider about the family's request and his own question$nclexmocb2b3$, $nclexmocb2b3$The client has the right to information about his own condition, and the provider is responsible for disclosure. The RN explores what he wants to know and brings his question and the family's concern to the provider.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Recognize and report ethical dilemmas; practice in a manner consistent with the code of ethics","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): right to be informed of health status","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: self-determination","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":69,"subtopic":"Client rights education and ethical dilemmas","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":69,"subtopic":"Client rights education and ethical dilemmas"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q69 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$f4ec7d89ded4a4ec024d7dccc08cec4d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q69 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q69 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q70 id already exists: c3cb36101ac46a5bc48696809';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q70 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$aac17a65ef1348f036b5e475dcbb8e03$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b2 Q70 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A hospitalized client says to the RN, 'I want to read my own chart. Can I see it?' He is alert and has no restrictions on information sharing.$nclexmocb2b3$, $nclexmocb2b3$What should the RN say?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The record belongs to the hospital, and release depends on the provider's approval of each request","He may see the record after the provider has gone over each of the notes with him in person at rounds","He has a right to see his own record, and she can help him request it through the records office","He can get a copy after discharge, through a written request that his attorney submits for him"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$He has a right to see his own record, and she can help him request it through the records office$nclexmocb2b3$, $nclexmocb2b3$Clients have a right to access their medical records on request, in a reasonable time and in the form requested if feasible. The RN supports the process through the usual channel.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b2","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide education to clients and staff about client rights and responsibilities","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(d)(2): right to access medical records","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch2","sourceVersion":"v7","sourceItem":70,"subtopic":"Client rights education and ethical dilemmas","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch2","sourceVersion":"v7","sourceItem":70,"subtopic":"Client rights education and ethical dilemmas"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b2 Q70 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$aac17a65ef1348f036b5e475dcbb8e03$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b2 Q70 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b2 Q70 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q1 id already exists: ca12bd1e0fc03d7f1f7096fdd';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q1 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$1b7f066efc9ba1e8cb135090f4c84c4d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q1 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$The charge RN is making assignments on a radiation oncology unit. One client has a radioactive implant in place for cervical cancer. Available are an RN who is 10 weeks pregnant, an RN who is not pregnant and has finished the radiation safety orientation, and a float RN from the postpartum unit who has not finished that orientation.$nclexmocb2b3$, $nclexmocb2b3$Which assignment is most appropriate for the client with the implant?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Assign the pregnant RN, who has finished the orientation and will limit her time in the room","Assign the float RN, who will finish the radiation safety orientation during the first hour","Assign the RN who is not pregnant and has done the radiation safety orientation, with shielding","Rotate the three nurses through the assignment so that each receives a small share of the exposure"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Assign the RN who is not pregnant and has done the radiation safety orientation, with shielding$nclexmocb2b3$, $nclexmocb2b3$A nurse who is pregnant should not be assigned to a client with an internal radiation source, and a nurse who has not completed radiation safety training should not care for the client. The charge RN matches the assignment to staff safety and competence.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care; limitations of self and others","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right person; assignment to a competent, safe care provider","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":1,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":1,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q1 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$1b7f066efc9ba1e8cb135090f4c84c4d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q1 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q1 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q2 id already exists: c233b067da173876b1d78f305';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q2 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$c6ed2b99d25285765f9f5f49418fd63d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q2 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is supervising an LPN who is caring for a client on the first day after bowel resection. The LPN reports, "His pain went from 3 to 8 in the last hour, and his belly feels hard."$nclexmocb2b3$, $nclexmocb2b3$What should the RN do first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask the LPN to give the PRN analgesic and recheck his pain score in one hour","Go to the bedside, examine his abdomen and check his vital signs, then make a plan","Tell the LPN to document the findings and report to the provider if the pain persists","Ask the LPN to reposition the client and apply a warm pack to the abdomen"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Go to the bedside, examine his abdomen and check his vital signs, then make a plan$nclexmocb2b3$, $nclexmocb2b3$A sudden rise in pain with a rigid abdomen after abdominal surgery may signal peritonitis or leak. Assessment and a new problem belong to the RN, who cannot hand the evaluation to the LPN and should not mask the findings.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care; prioritize","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Supervision; RN retains assessment of a changing or unstable client","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":2,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":2,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q2 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$c6ed2b99d25285765f9f5f49418fd63d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q2 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q2 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q3 id already exists: ccc8f283aa4a966071584b988';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q3 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$799c7b94e4ead654ad7f81122003a6aa$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q3 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A nursing student has been hired as a UAP on a medical unit. She tells the RN, "I learned to insert urinary catheters last semester, so I can do the one for room 6."$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Allow the insertion if the RN watches her first attempt and signs her skills checklist","Allow it because her school's skills record shows she passed the catheter insertion check-off","Explain that catheter insertion is outside a UAP's duties here, even if she has learned it","Ask an LPN to supervise the student's insertion so the RN can finish her own work"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that catheter insertion is outside a UAP's duties here, even if she has learned it$nclexmocb2b3$, $nclexmocb2b3$A student employed as a UAP functions within the UAP role and the facility's job description, regardless of school learning. Competence in a skill does not change what may be delegated.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care; legal scope of practice","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Student or unlicensed employee works within the role employed to perform","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":3,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":3,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q3 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$799c7b94e4ead654ad7f81122003a6aa$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q3 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q3 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q4 id already exists: c74b746ee3f1dcf048af754e4';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q4 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e1f3c223957a49dbfd52ce334c77745d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q4 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN has finished initial teaching for a client who has a new diagnosis of diabetes and will inject insulin. The RN is busy with an admission and wants help with some of the remaining teaching tasks from an LPN.$nclexmocb2b3$, $nclexmocb2b3$Which teaching task may the RN assign to the LPN?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Develop the teaching plan for the client's new diagnosis and decide what the goals will be","Teach the signs of low blood sugar and what to do, which the RN has not covered","Go over the injection steps the RN taught and report how the client does with them","Evaluate whether the client has met the teaching goals and revise the teaching plan if needed"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Go over the injection steps the RN taught and report how the client does with them$nclexmocb2b3$, $nclexmocb2b3$Initial teaching, plan development and evaluation of outcomes belong to the RN. An LPN can reinforce teaching that the RN established and report the client's response.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care; education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"RN: assessment, planning, evaluation; LPN may reinforce teaching","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":4,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":4,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q4 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e1f3c223957a49dbfd52ce334c77745d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q4 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q4 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q5 id already exists: c8fdf66c8ffb253e28092dea9';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q5 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$dd7b04da26b9fb4808efe81764d1ffac$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q5 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is caring for a client with C. difficile infection. The charge RN needs to add one more client to the same RN's assignment.$nclexmocb2b3$, $nclexmocb2b3$Which client is the safest to add?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["A client on telemetry who has stable atrial fibrillation and is waiting to go home today","A client with an absolute neutrophil count of 400 who is receiving chemotherapy this week","A client on day one after abdominal surgery who has an open, draining wound","A client with a new tracheostomy who needs frequent suctioning and stoma care at the bedside"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$A client on telemetry who has stable atrial fibrillation and is waiting to go home today$nclexmocb2b3$, $nclexmocb2b3$A nurse caring for a client with an enteric infection should not also be assigned clients at high risk for infection, such as those who are immunosuppressed or who have open wounds or airway access.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Organize workload; delegate and supervise care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CDC-ISO-APPA","label":"Isolation Precautions Guideline, Appendix A: Type and Duration of Precautions (CDC/HICPAC)","locator":"C. difficile: contact precautions, assign to limit transmission","url":"https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":5,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":5,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q5 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$dd7b04da26b9fb4808efe81764d1ffac$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q5 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q5 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q6 id already exists: cd6c0cc1f8a09f493a9ca8e95';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q6 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$02cf01feeda31e78f675c6382718c22b$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q6 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with delirium keeps pulling at an IV line. Facility policy allows a UAP to serve as a continuous observer for clients at risk for self-harm or device removal. The RN assigns a UAP to stay with the client.$nclexmocb2b3$, $nclexmocb2b3$Which instruction should the RN give the UAP observer?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Remain close, redirect him gently, and call me right away if he gets up or pulls the line","Apply soft wrist restraints if he reaches for the line, and tell the RN about it afterward","Step out of the room for short breaks while he is asleep, and come back when he wakes up","Tape the IV line out of his sight, and chart his behavior when the shift is over"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Remain close, redirect him gently, and call me right away if he gets up or pulls the line$nclexmocb2b3$, $nclexmocb2b3$A UAP observer may watch and redirect and must report changes promptly. Restraints require an order and RN judgment, and leaving the client unobserved defeats the purpose of the assignment.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care; client safety","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(e) Restraint or seclusion: order, least restrictive method","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right communication: clear directions and when to report","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":6,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":6,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q6 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$02cf01feeda31e78f675c6382718c22b$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q6 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q6 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q7 id already exists: c61094082bd652ea574bb2367';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q7 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$41bd9ace3b84f7c6072a1724f1e60b18$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q7 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 1500 the charge RN learns that a client who needs a one-to-one sitter will arrive on the unit in one hour. A nursing assistant will be the sitter. Four RNs are working, each with five clients, and the conditions of those clients differ widely from one RN to the next.$nclexmocb2b3$, $nclexmocb2b3$Which action best keeps the RN assignments safe?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give the admission to the RN with the most years of experience and leave the rest unchanged","Compare how ill the RNs' current clients are and then shift the workload before the new arrival","Give the admission to the nurse who finished her tasks first and has the most free time","Ask the supervisor for an agency nurse next shift and hold the admission in the emergency room for now"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Compare how ill the RNs' current clients are and then shift the workload before the new arrival$nclexmocb2b3$, $nclexmocb2b3$Assignments should reflect client acuity and needs, not only head counts or seniority. Every RN already has five clients, so equal counts cannot decide this; the charge RN reviews and redistributes before the arrival. The sitter is a nursing assistant, so the RN's own load is not the issue.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Organize workload; prioritize care based on acuity; delegate","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right circumstances: acuity, staffing and workload","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":7,"subtopic":"Delegation and assignment","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":7,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q7 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$41bd9ace3b84f7c6072a1724f1e60b18$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q7 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q7 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q8 id already exists: ced6c7a5357b922039c55dd74';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q8 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$51b7153555a9e8c2794afd4f5fb349a8$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q8 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN has delegated several routine tasks to a UAP for the shift and is reflecting on how to supervise.$nclexmocb2b3$, $nclexmocb2b3$Which actions are part of the RN's supervision of delegated tasks? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Hand the outcome of a routine task over to the UAP as the UAP's responsibility","Clarify what result is expected from each task and by when it should be done","Tell the UAP which findings to report and how soon they should be reported","Let the UAP decide which findings are important enough to report to the RN","Stay available to answer the UAP's questions and to help if the clients' needs change","Evaluate how each task was done and give the UAP specific feedback afterward"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocb2b3$,
    $nclexmocb2b3$Clarify what result is expected from each task and by when it should be done|||Tell the UAP which findings to report and how soon they should be reported|||Stay available to answer the UAP's questions and to help if the clients' needs change|||Evaluate how each task was done and give the UAP specific feedback afterward$nclexmocb2b3$, $nclexmocb2b3$Supervision includes clear expectations (what is expected, by when, and what to report), availability, monitoring and evaluation with feedback. The RN remains accountable for the delegation decision and outcome.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Five rights of delegation; supervision and accountability","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$delegation-assignment$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":8,"subtopic":"Delegation and assignment","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":8,"subtopic":"Delegation and assignment"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q8 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$51b7153555a9e8c2794afd4f5fb349a8$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q8 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q8 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q9 id already exists: cbe2b3b4ccb5089748118689a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q9 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$67d51a24f6af2c0a20d607455401407e$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q9 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 0700 an RN receives report on four clients.$nclexmocb2b3$, $nclexmocb2b3$Which client should the RN assess first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["A client with pneumonia who has a temperature of 100.4 F (38 C) and a productive cough","A client with chronic back pain who reports a pain score of 6/10 and is due for an oral analgesic","A client on day one after hip replacement with new confusion and an oxygen saturation of 89%","A client on warfarin whose INR draw is scheduled for 0800 and who has no complaints"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$A client on day one after hip replacement with new confusion and an oxygen saturation of 89%$nclexmocb2b3$, $nclexmocb2b3$New confusion with hypoxemia after surgery is an unexpected change that threatens oxygenation and may signal embolism or another acute problem. Expected findings and routine tasks are lower priority.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Section 2.3 Tools for Prioritizing: ABCs, acuity, data cues, CURE","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":9,"subtopic":"Prioritization and acuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":9,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q9 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$67d51a24f6af2c0a20d607455401407e$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q9 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q9 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q10 id already exists: c0872e3925b49bce76dad8b60';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q10 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$5b0c72af4102d98363166a8ca29d82b3$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q10 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$While drawing up a scheduled IV antibiotic for one client, the RN receives a call from the laboratory with a potassium result of 6.6 mEq/L for another client, who has renal failure and is on telemetry. The telemetry technician says that the client's rhythm has just changed, and the client tells a nurse that he feels weak.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Finish preparing the antibiotic and give it on time before calling the provider","Go to the client's bedside and assess his heart rhythm, symptoms and vital signs","Repeat the potassium on a new specimen and wait for the result before taking action","Call the provider with the result, then stay at the desk and wait for orders before taking other action"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Go to the client's bedside and assess his heart rhythm, symptoms and vital signs$nclexmocb2b3$, $nclexmocb2b3$A critically high potassium can cause lethal dysrhythmias, so the client's status takes priority over a routine medication. The RN assesses and then reports with the findings in hand.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity; receive and verify orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Section 2.3 Tools for Prioritizing: ABCs, acuity, data cues, CURE","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":10,"subtopic":"Prioritization and acuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":10,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q10 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$5b0c72af4102d98363166a8ca29d82b3$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q10 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q10 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q11 id already exists: c27ece1b0f38214d258422268';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q11 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$1e78ce4645cfb9c6734d4f80fd3463ba$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q11 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$Two call lights come on at the same time. In room 12 is a client whose hernia incision dressing is damp with a small amount of pink drainage. In room 14 is a client whose family says he suddenly cannot move his left arm and his speech is slurred.$nclexmocb2b3$, $nclexmocb2b3$Which client should the RN go to first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The client in room 14, because the sudden weakness and speech change may mean a stroke","The client in room 12, because new drainage may mean bleeding at the surgical site","Send the nursing assistant to check on the client in room 14 while she goes to room 12 first","The client in room 12 first, since a dressing change is quick, and then the client in room 14"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$The client in room 14, because the sudden weakness and speech change may mean a stroke$nclexmocb2b3$, $nclexmocb2b3$Sudden focal weakness and slurred speech suggest stroke, where time to treatment affects outcome. A small amount of expected drainage can wait a few minutes.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHA-AIS-2026","label":"2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke (AHA/ASA)","locator":"Early recognition and time-sensitive treatment of stroke","url":"https://doi.org/10.1161/STR.0000000000000513"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":11,"subtopic":"Prioritization and acuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":11,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q11 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$1e78ce4645cfb9c6734d4f80fd3463ba$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q11 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q11 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q12 id already exists: c8bf20e3e165e606281c343cc';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q12 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$46e2e3f75aba48e1ed23fe038e50a9b2$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q12 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reviews morning vital signs for four clients on a medical unit.$nclexmocb2b3$, $nclexmocb2b3$Which finding should the RN follow up on first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["A heart rate of 102 in a client who was admitted with a heart rate of 104 for sepsis","A heart rate of 112 in a client whose resting heart rate has been 60 to 68 since admission","A blood pressure of 148/90 in a client with long-standing hypertension who usually runs 150/90","A temperature of 99.1 F (37.3 C) in a client who is on the first day after knee replacement"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$A heart rate of 112 in a client whose resting heart rate has been 60 to 68 since admission$nclexmocb2b3$, $nclexmocb2b3$A change from the client's own baseline is more concerning than a value that is abnormal but stable. The new tachycardia needs assessment for bleeding, pain, infection or dysrhythmia.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Section 2.3 Tools for Prioritizing: ABCs, acuity, data cues, CURE","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":12,"subtopic":"Prioritization and acuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":12,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q12 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$46e2e3f75aba48e1ed23fe038e50a9b2$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q12 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q12 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q13 id already exists: cdb79388e5ff733ad48973e95';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q13 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$87daf23dc0b9686c03d5de7e104fd7bf$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q13 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client admitted with pneumonia has five problems listed on the plan of care.$nclexmocb2b3$, $nclexmocb2b3$Which diagnosis should the RN address first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Acute pain related to coughing and chest wall strain","Anxiety about the stay and time away from work","Impaired gas exchange related to fluid in the lungs","Deficient knowledge about home use of an incentive spirometer"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Impaired gas exchange related to fluid in the lungs$nclexmocb2b3$, $nclexmocb2b3$Airway, breathing and circulation take priority over other needs. Gas exchange is a physiologic problem that threatens life if not corrected.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Section 2.3 Tools for Prioritizing: ABCs, acuity, data cues, CURE","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":13,"subtopic":"Prioritization and acuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":13,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q13 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$87daf23dc0b9686c03d5de7e104fd7bf$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q13 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q13 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q14 id already exists: ca4dbb95f53d56eb7c8268ac7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q14 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9a1bd7d4b9a07d68ea34d35f48f80f9e$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q14 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At 0730 an RN has four needs to address at once.$nclexmocb2b3$, $nclexmocb2b3$Place the actions in the order the RN should address them, from first to last.$nclexmocb2b3$, $nclexmocb2b3${"kind":"ordered_response","options":["Give a scheduled oral vitamin that is due at 0800 to a client who is awake, sitting up in bed and eating breakfast","Style the hair of a client who asked to look nice for a family visitor this afternoon","Reconnect a chest tube that has come apart from its drainage unit for a client with trouble breathing and an SpO2 of 84%","Help a confused client who is trying to stand up alone to reach the bathroom, with the bed alarm sounding"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$Reconnect a chest tube that has come apart from its drainage unit for a client with trouble breathing and an SpO2 of 84%|||Help a confused client who is trying to stand up alone to reach the bathroom, with the bed alarm sounding|||Give a scheduled oral vitamin that is due at 0800 to a client who is awake, sitting up in bed and eating breakfast|||Style the hair of a client who asked to look nice for a family visitor this afternoon$nclexmocb2b3$, $nclexmocb2b3$A chest tube system that has come apart, with new breathing difficulty and a falling oxygen saturation, is the most life-threatening need. A confused client trying to stand alone is a fall risk and comes next. A routine scheduled vitamin within its time window follows, and a requested comfort task comes last.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity; organize workload","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Section 2.3 Tools for Prioritizing: ABCs, acuity, data cues, CURE","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$ordered_response$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":14,"subtopic":"Prioritization and acuity","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":14,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q14 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9a1bd7d4b9a07d68ea34d35f48f80f9e$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q14 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q14 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q15 id already exists: cd266f554c465151c7e830c8b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q15 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$bdcbbb5acb823a0551706385745b8fce$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q15 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN receives four clients on a surgical-cardiac unit at the start of the shift.$nclexmocb2b3$, $nclexmocb2b3$Place the clients in the order the RN should see them, from first to last.$nclexmocb2b3$, $nclexmocb2b3${"kind":"ordered_response","options":["A client who has not had a bowel movement for two days and requests a laxative","A client after thyroidectomy who has neck swelling and noisy, labored breathing","A client on the first day after surgery who reports incision pain of 7/10","A client with atrial fibrillation whose heart rate is 140 and who reports dizziness"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocb2b3$,
    $nclexmocb2b3$A client after thyroidectomy who has neck swelling and noisy, labored breathing|||A client with atrial fibrillation whose heart rate is 140 and who reports dizziness|||A client on the first day after surgery who reports incision pain of 7/10|||A client who has not had a bowel movement for two days and requests a laxative$nclexmocb2b3$, $nclexmocb2b3$Airway comes first: swelling and stridor after thyroidectomy can obstruct the airway quickly. Unstable circulation comes next, then pain, then a nonurgent comfort need.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","prioritization","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Section 2.3 Tools for Prioritizing: ABCs, acuity, data cues, CURE","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$prioritization$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$ordered_response$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":15,"subtopic":"Prioritization and acuity","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":15,"subtopic":"Prioritization and acuity"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q15 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$bdcbbb5acb823a0551706385745b8fce$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q15 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q15 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q16 id already exists: c205f13bdfeb5108cfb0bedde';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q16 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$363493642ea799f0e5b6a6c72a36c82c$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q16 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is giving shift report in the I-PASS format for a client whose urine output is being watched closely.$nclexmocb2b3$, $nclexmocb2b3$Which statement is an example of situation awareness and contingency planning?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["He was admitted yesterday for a urinary tract infection and has been on IV antibiotics since","He is stable now, and his urine output has been about 40 mL/hour since this morning","If he passes less than 30 mL/hour tonight, call the provider and ask about giving fluids","Please repeat back the key points so that we are sure nothing was left out of report"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$If he passes less than 30 mL/hour tonight, call the provider and ask about giving fluids$nclexmocb2b3$, $nclexmocb2b3$Situation awareness and contingency planning tells the receiver what may happen and what to do if it does. The other statements are a patient summary, illness severity and synthesis by the receiver.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Handoff of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-IPASS","label":"AHRQ TeamSTEPPS I-PASS handoff tool","locator":"I-PASS elements: illness severity, patient summary, action list, situation awareness and contingency planning, synthesis by receiver","url":"https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":16,"subtopic":"Handoff and continuity of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":16,"subtopic":"Handoff and continuity of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q16 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$363493642ea799f0e5b6a6c72a36c82c$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q16 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q16 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q17 id already exists: c2974f269f26e13bd0293db74';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q17 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$aecca807e9c80d56e719a068ed0e264d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q17 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is preparing a handoff for home health after a client goes home with negative-pressure therapy on a stage 3 sacral pressure injury.$nclexmocb2b3$, $nclexmocb2b3$Which information is the most important to include in the handoff?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The dates of his hospital stay, the hospital course and the names of the consultants","The current wound measurements, the dressing schedule, the pump settings and where to get supplies","A list of the medications he took before admission and how the wound looked on the first day","His pain scores, bowel pattern and diet throughout the hospital stay, and the unit's phone number for questions"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$The current wound measurements, the dressing schedule, the pump settings and where to get supplies$nclexmocb2b3$, $nclexmocb2b3$A handoff to the next provider should contain information that lets care continue safely without interruption: current status, the treatment plan and the means to carry it out.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Handoff of care; referrals","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge plan; necessary medical information to post-discharge providers","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":17,"subtopic":"Handoff and continuity of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":17,"subtopic":"Handoff and continuity of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q17 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$aecca807e9c80d56e719a068ed0e264d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q17 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q17 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q18 id already exists: c5e020fe684b18a40dc7a4f66';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q18 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$6a7e491e31ea38cf8c95d0fbed68f135$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q18 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client who has chronic kidney disease and new heart failure is on a fluid restriction and will be away from the unit for four hours of dialysis. The RN is preparing to send the client to the dialysis unit.$nclexmocb2b3$, $nclexmocb2b3$Which action best supports continuity of care?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give a verbal report to the dialysis RN on his status, medications due and fluid restriction","Send the medication administration record with the client instead of giving a verbal report","Leave a note on the transport slip and phone the dialysis unit if the client's condition changes","Ask the transport staff to tell the dialysis nurse about the client's condition and allergies"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Give a verbal report to the dialysis RN on his status, medications due and fluid restriction$nclexmocb2b3$, $nclexmocb2b3$A transfer between units should include a verbal exchange that allows questions, along with written information. Transport staff are not responsible for passing on clinical details.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Handoff of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-IPASS","label":"AHRQ TeamSTEPPS I-PASS handoff tool","locator":"I-PASS elements: illness severity, patient summary, action list, situation awareness and contingency planning, synthesis by receiver","url":"https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":18,"subtopic":"Handoff and continuity of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":18,"subtopic":"Handoff and continuity of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q18 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$6a7e491e31ea38cf8c95d0fbed68f135$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q18 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q18 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q19 id already exists: c5719e9d6accdaff11f77b407';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q19 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$6fd73705eb1368960f58c524a5e6435c$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q19 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An oncoming RN receives this report on a client: "He's fine and nothing new happened overnight." The client has a chest tube and a morphine PCA.$nclexmocb2b3$, $nclexmocb2b3$What should the oncoming RN do next?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Accept the report as given and review the chart for the details later in the shift","Tell the outgoing RN the report is incomplete and ask the charge nurse to give report instead","Skip questions, go to the room and assess the client to find out what the report left out","Ask the outgoing RN for specifics such as his vital signs, output, comfort and test results"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the outgoing RN for specifics such as his vital signs, output, comfort and test results$nclexmocb2b3$, $nclexmocb2b3$A good handoff is complete and gives the receiver a chance to ask questions. Asking for specifics during report closes the gaps before the outgoing RN leaves.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Handoff of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-IPASS","label":"AHRQ TeamSTEPPS I-PASS handoff tool","locator":"I-PASS elements: illness severity, patient summary, action list, situation awareness and contingency planning, synthesis by receiver","url":"https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":19,"subtopic":"Handoff and continuity of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":19,"subtopic":"Handoff and continuity of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q19 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$6fd73705eb1368960f58c524a5e6435c$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q19 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q19 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q20 id already exists: c23e5bb29b283e0f98857c726';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q20 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$35df4da58c3972d41540f79f377a4815$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q20 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is giving handoff on a client with pneumonia using the I-PASS format.$nclexmocb2b3$, $nclexmocb2b3$Place the statements in the order they should be given, from first to last.$nclexmocb2b3$, $nclexmocb2b3${"kind":"ordered_response","options":["Please repeat the sputum culture and give the 0600 antibiotic","If his saturation falls below 90%, increase the oxygen and call the provider","He is a 72-year-old admitted two days ago with pneumonia and is on IV antibiotics","To make sure I was clear, please tell me back the plan for tonight","He is stable but a watcher because his oxygen needs have risen since this morning"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$He is stable but a watcher because his oxygen needs have risen since this morning|||He is a 72-year-old admitted two days ago with pneumonia and is on IV antibiotics|||Please repeat the sputum culture and give the 0600 antibiotic|||If his saturation falls below 90%, increase the oxygen and call the provider|||To make sure I was clear, please tell me back the plan for tonight$nclexmocb2b3$, $nclexmocb2b3$I-PASS order: illness severity, patient summary, action list, situation awareness and contingency planning, and synthesis by the receiver.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Handoff of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-IPASS","label":"AHRQ TeamSTEPPS I-PASS handoff tool","locator":"I-PASS elements: illness severity, patient summary, action list, situation awareness and contingency planning, synthesis by receiver","url":"https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$ordered_response$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":20,"subtopic":"Handoff and continuity of care","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":20,"subtopic":"Handoff and continuity of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q20 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$35df4da58c3972d41540f79f377a4815$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q20 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q20 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q21 id already exists: c0a16be96194ddced8d743299';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q21 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2c30c08dc4b4fb5caea3cd59aa857e9e$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q21 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A 16-year-old who is legally emancipated is scheduled for an appendectomy. His parents are on the phone and offer to approve the surgery. Assume state law allows emancipated minors to consent to their own care.$nclexmocb2b3$, $nclexmocb2b3$Who should sign the consent form?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["A parent, because the surgery is not an emergency and the client is under 18 years old","The client, because the law treats a minor in his situation as an adult for health care","Either parent, who may give consent over the telephone with a nurse acting as the witness","The hospital's risk manager, because a person under 18 needs administrative approval"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$The client, because the law treats a minor in his situation as an adult for health care$nclexmocb2b3$, $nclexmocb2b3$An emancipated minor is treated as an adult for health decisions under the state rule given in the stem. Informed consent is the client's right, and the nurse verifies that the right person consents.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Consent education; legal scope","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2) Patient has the right to make informed decisions regarding care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"CFR-482-51","label":"42 CFR 482.51 Condition of participation: Surgical services","locator":"(b)(2) Informed consent for surgery","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-D/section-482.51"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":21,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":21,"subtopic":"Informed consent"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q21 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2c30c08dc4b4fb5caea3cd59aa857e9e$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q21 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q21 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q22 id already exists: c15afad069b2aa18cb7a5ad4d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q22 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$64870aeeda4fb4d4b92bbb6919a04bae$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q22 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A wound care RN wants to photograph a pressure injury so that healing can be tracked in the record.$nclexmocb2b3$, $nclexmocb2b3$Which action is correct?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Get the client's written permission under policy and use a device approved for the unit","Take the photograph with her own phone and delete it after upload to the record","Photograph the wound with the face and the name label left out of the frame of the picture","Ask the unit clerk to take the picture so that a nurse does not need the client's approval"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Get the client's written permission under policy and use a device approved for the unit$nclexmocb2b3$, $nclexmocb2b3$Photographs are part of the health record and need the client's permission under policy. Personal devices create privacy risk, and cropping a face does not remove the need for consent.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Confidentiality and privacy; consent education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2) Patient has the right to make informed decisions regarding care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.502(b) and 164.514(d) minimum necessary","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":22,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":22,"subtopic":"Informed consent"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q22 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$64870aeeda4fb4d4b92bbb6919a04bae$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q22 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q22 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q23 id already exists: c9ddd428a14003b49d00f195e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q23 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e0329538a7dee28abb26c7d48505656a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q23 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client lacks capacity after a stroke, and his wife is the legal surrogate. She cannot come to the hospital today and gives telephone consent for a bedside procedure that is needed this evening. Facility policy allows telephone consent with a witness.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Record the wife's verbal agreement in the chart and ask the provider to start the procedure now","Wait until the wife arrives to sign, even if the delay worsens the client's condition","Have a second staff member listen to the call and document that the call was witnessed","Ask the client to nod his agreement and use that as the consent for the procedure"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Have a second staff member listen to the call and document that the call was witnessed$nclexmocb2b3$, $nclexmocb2b3$When a surrogate consents by phone, the nurse follows facility policy for a witnessed and documented consent. The consent process serves the client's right to decide through an appropriate decision maker.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Consent education; advance directives","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2) Patient has the right to make informed decisions regarding care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":23,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":23,"subtopic":"Informed consent"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q23 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e0329538a7dee28abb26c7d48505656a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q23 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q23 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q24 id already exists: c5784cbdeda3850afe49173af';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q24 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$6dd373b6f7563e3fa44f8542065306a1$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q24 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A nursing student is to insert a urinary catheter under supervision. The client says, "I would rather have an experienced nurse do it."$nclexmocb2b3$, $nclexmocb2b3$What is the best response?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Explain that students need to practice and ask him to allow it this one time","Let the student proceed with her instructor watching, since he agreed to care at admission","Ask a nurse who has more experience to stand beside the student and talk him through the insertion","Honor his request and have a staff member who has more experience do the insertion"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Honor his request and have a staff member who has more experience do the insertion$nclexmocb2b3$, $nclexmocb2b3$Clients may decline care from students without losing any care. Consent to treatment at admission does not cover each person who performs a procedure.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Consent education; client rights","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2) Patient has the right to make informed decisions regarding care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":24,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":24,"subtopic":"Informed consent"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q24 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$6dd373b6f7563e3fa44f8542065306a1$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q24 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q24 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q25 id already exists: cbc66c53092c666076f0bff6f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q25 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$c99f95416d48c93d124c08c6ed2b3ef7$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q25 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reviews upcoming care for several clients on a medical unit.$nclexmocb2b3$, $nclexmocb2b3$For which situations should the RN verify that informed consent has been obtained? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["A client who will be enrolled in a clinical research study","A client who needs a daily dressing change on a healed incision","A client who needs help getting to the bathroom","A client who will receive a blood transfusion","A client who is due for routine vital signs at the usual times","A client who will have a central venous catheter inserted"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$A client who will be enrolled in a clinical research study|||A client who will receive a blood transfusion|||A client who will have a central venous catheter inserted$nclexmocb2b3$, $nclexmocb2b3$Invasive procedures, blood products and research participation require informed consent. Routine care and basic nursing measures do not need a separate signed consent.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Consent education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2) Patient has the right to make informed decisions regarding care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"CFR-482-51","label":"42 CFR 482.51 Condition of participation: Surgical services","locator":"(b)(2) Informed consent for surgery","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-D/section-482.51"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":25,"subtopic":"Informed consent","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":25,"subtopic":"Informed consent"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q25 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$c99f95416d48c93d124c08c6ed2b3ef7$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q25 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q25 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q26 id already exists: ccfe75a92a6674b721ea8c627';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q26 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$58bcf1fa71afd6f8b9606951f57f5cca$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q26 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client being admitted says he does not want to complete an advance directive. The admission form on the unit has a section for the document.$nclexmocb2b3$, $nclexmocb2b3$How should the RN respond?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell him the admission cannot be finished until he completes the facility's form today","Ask his daughter to complete the form for him since he has declined to do so himself","Document that he is noncompliant with the paperwork and notify the nurse manager about it","Explain that completing one is his choice, and that his care does not depend on doing so"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that completing one is his choice, and that his care does not depend on doing so$nclexmocb2b3$, $nclexmocb2b3$Facilities must offer information about advance directives and record whether one exists, but they may not condition care on having one. The decision is the client's.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advance directives","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"Provide written information about advance directive rights; document whether one exists; care is not conditioned on one","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":26,"subtopic":"Advance directives and surrogate decisions","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":26,"subtopic":"Advance directives and surrogate decisions"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q26 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$58bcf1fa71afd6f8b9606951f57f5cca$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q26 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q26 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q27 id already exists: cf936b32a980c5ab21269811a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q27 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9f869104c8a7d8b4c48ab2afc0608027$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q27 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with capacity who has a living will asking for no resuscitation tells the RN, "I changed my mind. I want everything done."$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Explain that the written directive stays in effect until a new form is signed and witnessed","Ask the family to confirm the change before the provider is told about it","Tell the provider about his new wishes so that his orders and record can be updated","Keep following the directive until his condition worsens and he cannot decide for himself"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Tell the provider about his new wishes so that his orders and record can be updated$nclexmocb2b3$, $nclexmocb2b3$A client with capacity may revoke or change an advance directive at any time. The RN makes sure the team knows so that the orders match the client's current wishes.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advance directives; advocate for client rights","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"Provide written information about advance directive rights; document whether one exists; care is not conditioned on one","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":27,"subtopic":"Advance directives and surrogate decisions","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":27,"subtopic":"Advance directives and surrogate decisions"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q27 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9f869104c8a7d8b4c48ab2afc0608027$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q27 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q27 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q28 id already exists: cf53e5751215cfe303236e308';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q28 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9b8b3029ed092207570563ec2eaf6abc$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q28 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with decision-making capacity refuses a feeding tube. His daughter, who is named as his health care agent, tells the RN to have the tube placed.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Follow the daughter's decision, because the directive names her to decide about treatment","Ask the provider to decide between the client's wishes and the daughter's before the tube is discussed","Place the tube and review the decision with the client once he is stable and has eaten","Follow the client's own decision, since the agent's authority begins when he cannot decide"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Follow the client's own decision, since the agent's authority begins when he cannot decide$nclexmocb2b3$, $nclexmocb2b3$A health care agent acts only when the client lacks capacity. A client with capacity decides for himself, and the RN supports that decision.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advance directives; advocate for client rights","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"Provide written information about advance directive rights; document whether one exists; care is not conditioned on one","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":28,"subtopic":"Advance directives and surrogate decisions","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":28,"subtopic":"Advance directives and surrogate decisions"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q28 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9b8b3029ed092207570563ec2eaf6abc$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q28 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q28 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q29 id already exists: ca9a4fa7a53ff7bc2f83483da';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q29 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$8e566f13e3252cd0070639a0b34fb5cd$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q29 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is documenting admission information for a client who says he has an advance directive.$nclexmocb2b3$, $nclexmocb2b3$Which information should the RN document? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["The client's opinion of the ethics committee and how it has been used","Whether the client has an advance directive and, if so, when it was signed","The RN's interpretation of which diagnoses the directive would apply to","The family's disagreement with the directive, before the client gave his reasons","Where a copy is kept, who the named agent is, and how to reach that person","A statement that the directive takes effect now, while the client can still decide for himself"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocb2b3$,
    $nclexmocb2b3$Whether the client has an advance directive and, if so, when it was signed|||Where a copy is kept, who the named agent is, and how to reach that person$nclexmocb2b3$, $nclexmocb2b3$The record should show whether a directive exists and how to obtain it. Interpretation, family disagreement and opinions are not documented as facts about the directive, and a directive does not replace the decisions of a client who can still make them.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advance directives; documentation","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"Provide written information about advance directive rights; document whether one exists; care is not conditioned on one","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$informed-consent-advance-directives$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":29,"subtopic":"Advance directives and surrogate decisions","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":29,"subtopic":"Advance directives and surrogate decisions"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q29 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$8e566f13e3252cd0070639a0b34fb5cd$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q29 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q29 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q30 id already exists: c1ddff2cc7f037d13a95abb05';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q30 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$781d708ee47388712468123da9d73764$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q30 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client tells the RN that a nursing assistant was rough while moving him in bed, and he wants to make a complaint.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Explain the grievance process to him, and give him the patient advocate's name and telephone number","Tell him that complaints go to his provider, who will decide whether the assistant is disciplined","Offer to speak with the assistant and settle the matter informally so a formal complaint is not needed","Document his complaint in the chart and ask him to wait until discharge to decide whether to pursue it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain the grievance process to him, and give him the patient advocate's name and telephone number$nclexmocb2b3$, $nclexmocb2b3$Clients have the right to voice grievances, and the facility must have a process for review and response. The RN supports the client in using it rather than resolving or delaying it.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advocate for client rights; rights education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(a)(2) Grievance process","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":30,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":30,"subtopic":"Client rights and advocacy"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q30 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$781d708ee47388712468123da9d73764$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q30 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q30 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q31 id already exists: c4584ba4f8364f5db88d55726';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q31 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$09b774b2ed0cc6427944952ee38248bb$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q31 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A provider orders soft wrist restraints for a confused client who keeps pulling at a nasogastric tube. The client has no history of violence.$nclexmocb2b3$, $nclexmocb2b3$Which action is consistent with the client's rights?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Apply the restraints as ordered and review the need at the start of the next shift","Apply the restraints and ask the family to agree so that the order is considered valid","Apply the restraints for the night to avoid the need for repeated orders","Try a less restrictive measure first, such as a mitt or closer observation"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Try a less restrictive measure first, such as a mitt or closer observation$nclexmocb2b3$, $nclexmocb2b3$Restraints must be used only when needed to protect the client and only after less restrictive measures have failed, and they are reassessed and discontinued as soon as possible.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advocate for client rights; client safety","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(e) Restraint or seclusion: least restrictive method","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":31,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":31,"subtopic":"Client rights and advocacy"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q31 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$09b774b2ed0cc6427944952ee38248bb$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q31 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q31 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q32 id already exists: cd30fe60b9c06821d8bc688e1';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q32 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9fd4466d7c5494f725393c79c1d93396$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q32 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client scheduled for knee surgery tells the RN, "I would like a second opinion, but my surgeon says it is not needed."$nclexmocb2b3$, $nclexmocb2b3$What is the best response by the RN?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Advise him to follow the surgeon's advice because a second opinion would delay his surgery date","Tell him that his insurance probably will not cover a second opinion, so he should not ask one","Explain that he may request a second opinion and offer to help arrange it and send his records","Ask the surgeon to decide whether he needs a second opinion before he is told how to get one"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that he may request a second opinion and offer to help arrange it and send his records$nclexmocb2b3$, $nclexmocb2b3$The client decides about his care and may seek another opinion. The RN advocates by providing information and support, not by discouraging the request or giving it to the surgeon to decide.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advocate for client rights; consent education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1 (respect for client self-determination) and Provision 2 (primary commitment to the client)","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":32,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":32,"subtopic":"Client rights and advocacy"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q32 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9fd4466d7c5494f725393c79c1d93396$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q32 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q32 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q33 id already exists: c78ae4a8aa28ddf76f22174e5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q33 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$ab462e9bfaf4ed78c5176f547ee5f947$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q33 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is reflecting on how to advocate for clients on the unit.$nclexmocb2b3$, $nclexmocb2b3$Which actions demonstrate the RN acting as a client advocate? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Asking the provider to explain a treatment again when the client says he does not understand it","Asking for an ethics review when staff disagree about what the client wants","Deciding which of the client's choices are reasonable and charting the ones that seem sensible","Making sure the client's stated care preferences are in the record and shared with the team","Persuading the client to accept the recommended treatment so that care goes smoothly","Referring a client to the patient advocate when he wants to file a complaint"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocb2b3$,
    $nclexmocb2b3$Asking the provider to explain a treatment again when the client says he does not understand it|||Asking for an ethics review when staff disagree about what the client wants|||Making sure the client's stated care preferences are in the record and shared with the team|||Referring a client to the patient advocate when he wants to file a complaint$nclexmocb2b3$, $nclexmocb2b3$Advocacy protects the client's ability to make informed decisions and to be heard, including making sure the client's preferences are known to the team. Persuading or filtering choices replaces the client's decisions with someone else's.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advocate for client rights","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 2 and Provision 3 (advocacy)","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(a)(2) Grievance; (b) exercise of rights","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$client-advocacy-education$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":33,"subtopic":"Client rights and advocacy","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":33,"subtopic":"Client rights and advocacy"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q33 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$ab462e9bfaf4ed78c5176f547ee5f947$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q33 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q33 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q34 id already exists: c09ace69bd22dbc98678fa398';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q34 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$accd1a5fad2e5aa1cd6173b621bf7a2b$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q34 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN gave a client's PRN laxative twice within four hours when the order allowed one dose every eight hours. The client has no symptoms. The provider tells the RN, "Don't mention it to him; it won't matter."$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Withhold the information since no harm occurred and record it as a routine medication entry","Explain that the client has a right to know, arrange disclosure, and file an incident report","Tell the client privately that something small happened and leave out the name of the drug given","Report the provider's instruction to the nurse manager, and hold the information until she decides"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that the client has a right to know, arrange disclosure, and file an incident report$nclexmocb2b3$, $nclexmocb2b3$Clients have a right to honest information about their care, including errors. The nurse supports disclosure through the facility's process, files an incident report, and does not conceal the event on a provider's instruction. Telling the nurse manager is appropriate, but holding the information from the client until someone else decides does not meet the client's right to know.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Ethical dilemmas; code of ethics; report as required","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1 and Provision 3 (honesty and patient rights)","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b) Exercise of rights; informed decisions","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":34,"subtopic":"Ethical dilemmas, code of ethics and legal scope","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":34,"subtopic":"Ethical dilemmas, code of ethics and legal scope"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q34 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$accd1a5fad2e5aa1cd6173b621bf7a2b$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q34 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q34 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q35 id already exists: c808893c62399cf5cb3d6e0b7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q35 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$6afb04061c5204b4a1f844f3659e9dce$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q35 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with advanced cancer has asked for comfort care only. The provider wants to start another round of aggressive treatment, and the family cannot agree. The RN feels torn between obligations.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Stop the burdensome treatments until the provider can meet with the family about goals","Advise the family to move the client to another facility where comfort care is provided","Follow the provider's plan, since the physician holds responsibility for medical decisions","Request an ethics consult to review the conflict between the client's wishes and the plan"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Request an ethics consult to review the conflict between the client's wishes and the plan$nclexmocb2b3$, $nclexmocb2b3$An ethics consultation is a recognized way to resolve conflicts about values and care goals. The RN does not decide alone, stop orders without authority, or steer the family away.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Ethical dilemmas; advocate for client rights","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1, Provision 3 and interpretive statements on ethical conflict","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":35,"subtopic":"Ethical dilemmas, code of ethics and legal scope","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":35,"subtopic":"Ethical dilemmas, code of ethics and legal scope"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q35 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$6afb04061c5204b4a1f844f3659e9dce$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q35 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q35 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q36 id already exists: cc3d939fb6128c6a7e4be57b0';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q36 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$fcf670812ce1f07ca7f7312273973c35$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q36 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client who is grateful for his care offers the RN a $200 gift card on the day of discharge. The facility has a policy that prohibits staff from accepting gifts from clients.$nclexmocb2b3$, $nclexmocb2b3$What is the best response?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Accept the card and tell the manager at the end of the shift so that it is on record","Accept the card on behalf of the unit and keep it in the staff lounge for shared use","Thank him warmly for his kindness and decline the card, saying that rules do not allow it","Accept the card because refusing might offend a client who is grateful for the care he got"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Thank him warmly for his kindness and decline the card, saying that rules do not allow it$nclexmocb2b3$, $nclexmocb2b3$Accepting gifts can blur professional boundaries and conflicts with the stated policy. The RN declines politely and acknowledges the client's gratitude.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Code of ethics; legal scope; limitations of self","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 2 (professional boundaries)","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":36,"subtopic":"Ethical dilemmas, code of ethics and legal scope","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":36,"subtopic":"Ethical dilemmas, code of ethics and legal scope"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q36 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$fcf670812ce1f07ca7f7312273973c35$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q36 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q36 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q37 id already exists: c44f7c5a20cddbe3518c5a351';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q37 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$89b70b031c7cc82ed7c2c3ff510642a2$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q37 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A manager is teaching new graduates about the ethical principles in the code of ethics.$nclexmocb2b3$, $nclexmocb2b3$Which action by the RN is an example of the principle of justice?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Spending extra time with the client who has the most visitors so that the family feels cared for","Giving the clients with the same insurance plan as most of the unit more of the nurse's time","Giving each client the same number of minutes at each visit, however sick he or she is","Dividing time among clients by their needs, rather than by how much each client thanks the RN"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Dividing time among clients by their needs, rather than by how much each client thanks the RN$nclexmocb2b3$, $nclexmocb2b3$Justice means fair and equitable distribution of care based on need. Visitors, insurance or admission order are not the basis for allocating a nurse's attention.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Code of ethics; unbiased treatment","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1 (care without regard to personal attributes or status)","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":37,"subtopic":"Ethical dilemmas, code of ethics and legal scope","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":37,"subtopic":"Ethical dilemmas, code of ethics and legal scope"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q37 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$89b70b031c7cc82ed7c2c3ff510642a2$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q37 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q37 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q38 id already exists: c6c3b3afc1e4296e5aa8e863e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q38 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$9b251a2b209a5375da13ea0e0862a8d1$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q38 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$The RN is asked which situations on the unit are ethical dilemmas that should be brought to the ethics committee or the chain of command.$nclexmocb2b3$, $nclexmocb2b3$Which situations should be brought forward? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["A client's lunch tray is late because of a delay in the hospital kitchen during a busy meal time","A family asks that a diagnosis be kept from a client who is asking directly about it","A client's wish to refuse life support conflicts with the provider's plan","A client prefers an evening time for a medication, and the pharmacy has approved the change","A new nurse is unsure of how to use the infusion pump and asks a colleague for a quick refresher","Two clients meet the criteria for the last open intensive care bed, and no policy decides between them"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$A family asks that a diagnosis be kept from a client who is asking directly about it|||A client's wish to refuse life support conflicts with the provider's plan|||Two clients meet the criteria for the last open intensive care bed, and no policy decides between them$nclexmocb2b3$, $nclexmocb2b3$An ethical dilemma involves competing obligations or values with no simple answer: truth-telling versus a family's wish, a client's refusal versus a provider's plan, and fair allocation of a scarce resource when no policy settles it. A competence gap, a late meal tray and a scheduling preference have practical solutions.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Ethical dilemmas; code of ethics","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1, Provision 3 and Provision 4","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":38,"subtopic":"Ethical dilemmas, code of ethics and legal scope","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":38,"subtopic":"Ethical dilemmas, code of ethics and legal scope"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q38 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$9b251a2b209a5375da13ea0e0862a8d1$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q38 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q38 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q39 id already exists: ce0eeea39fd4a117857090a81';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q39 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$1f41a5d1531f4be43438f5511031e0c4$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q39 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client has been admitted after a stroke. The RN is asked when discharge planning should begin.$nclexmocb2b3$, $nclexmocb2b3$What is the correct answer?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["At admission, with a screen for needs that could delay or complicate the discharge","When the provider writes the discharge order so that the plan matches the final orders","When the client is medically stable and the family asks about going home","After the physical therapy evaluation is completed on the second hospital day"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$At admission, with a screen for needs that could delay or complicate the discharge$nclexmocb2b3$, $nclexmocb2b3$Discharge planning begins early, with identification of clients likely to have problems after discharge. Waiting delays the services the client needs.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Admit, transfer and discharge clients","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning: early identification, evaluation, transfer or referral","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":39,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":39,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q39 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$1f41a5d1531f4be43438f5511031e0c4$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q39 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q39 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q40 id already exists: ce4fd7bcbb55d85875a600249';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q40 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$597466f73dcd1fcfb00a55179a616f5a$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q40 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client in the emergency department has an unstable condition and needs transfer to a trauma center. The RN is helping prepare the transfer.$nclexmocb2b3$, $nclexmocb2b3$What is required for an appropriate transfer?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The client's insurance has been verified and approved by the receiving facility","The receiving facility has agreed to accept him and has space and qualified staff","The client's family has arranged private transportation to the receiving hospital","The records will be sent to the receiving facility after the client is stabilized there"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$The receiving facility has agreed to accept him and has space and qualified staff$nclexmocb2b3$, $nclexmocb2b3$An appropriate transfer requires treatment within the sending facility's capacity, acceptance and capacity at the receiving facility, records sent with the client, and qualified transport.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Admit, transfer and discharge clients","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-489-24","label":"42 CFR 489.24 Special responsibilities of Medicare hospitals in emergency cases (EMTALA)","locator":"(e)(2) Appropriate transfer: capacity, acceptance, records, qualified personnel and equipment","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-B/section-489.24"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":40,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":40,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q40 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$597466f73dcd1fcfb00a55179a616f5a$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q40 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q40 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q41 id already exists: c70541b201603158af3327191';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q41 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$87a9faceef0c3cb6cf369c535268dbbb$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q41 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client is medically ready for discharge. He lives alone, has no caregiver and cannot climb the stairs to his apartment. He says he is not sure how he will manage at home.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell him that he may go home as planned since he is stable and decides where to live","Ask the case manager to evaluate his home and discuss options such as rehabilitation","Delay the discharge until a family member agrees to move in and stay with him","Arrange outpatient therapy visits starting next week and send him home as scheduled today"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the case manager to evaluate his home and discuss options such as rehabilitation$nclexmocb2b3$, $nclexmocb2b3$Discharge planning includes evaluating the home setting and likely needs. The case manager can arrange services or another level of care while respecting the client's choice.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Admit, transfer and discharge clients; referrals","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning: early identification, evaluation, transfer or referral","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":41,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":41,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q41 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$87a9faceef0c3cb6cf369c535268dbbb$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q41 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q41 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q42 id already exists: ca579ebe46e7b03f903079e68';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q42 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$182aa77101bf69b0f63935f3851f3faa$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q42 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client is being discharged home on oxygen therapy. The provider ordered a home oxygen concentrator and the case manager has contacted a supplier.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take before the client leaves?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Confirm that the supplier delivered the equipment and that he can show how to use it","Give the client the supplier's number and tell him the equipment will arrive in a few days","Send him home with the hospital's portable tank to use until the supplier delivers the concentrator","Teach him to adjust the flow rate to ease his shortness of breath as needed at home"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Confirm that the supplier delivered the equipment and that he can show how to use it$nclexmocb2b3$, $nclexmocb2b3$Discharge planning ensures that equipment and teaching are in place before the client leaves. Flow rates are set by order, and hospital supplies are not for personal use at home.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Admit, transfer and discharge clients; plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning: early identification, evaluation, transfer or referral","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":42,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":42,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q42 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$182aa77101bf69b0f63935f3851f3faa$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q42 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q42 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q43 id already exists: c1c9b172ae7ee2361061b96de';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q43 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$21f0a383e08823b7b7e6abd95a98208f$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q43 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with dementia is being transferred from the hospital to a long-term care facility. A DNR order and a signed advance directive are in the chart.$nclexmocb2b3$, $nclexmocb2b3$Which action should the RN take?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Send the discharge summary and the medication list, since the facility will obtain its own history","Place the code status and a copy of the signed advance directive in the packet for transfer","Mention the code status in the verbal report and keep the directive in the hospital record","Ask the family to carry the signed advance directive to the facility on the day of transfer"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Place the code status and a copy of the signed advance directive in the packet for transfer$nclexmocb2b3$, $nclexmocb2b3$A transfer needs the information that lets the receiving facility honor the client's wishes. Code status and the directive must travel with the client.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Admit, transfer and discharge clients; advance directives","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning: early identification, evaluation, transfer or referral","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"Advance directive policies; communicate across settings","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":43,"subtopic":"Admission, transfer and discharge","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":43,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q43 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$21f0a383e08823b7b7e6abd95a98208f$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q43 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q43 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q44 id already exists: c52d5e8d5bbc0fb7ca0fe48bf';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q44 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$00b4b6cd38b897b2da06a8f91b0da105$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q44 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A new RN asks what the RN's role is in discharge planning for a client who will need services at home.$nclexmocb2b3$, $nclexmocb2b3$Which actions are part of the RN's role? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Choose the home health agency for the client based on the hospital's contracts","Wait for the client to ask about home needs before beginning to plan","Screen the client's needs early in the stay and share the findings with the team","Give the client a list of home health agencies and respect the client's choice","Ask the client to call each agency himself to arrange his own visits at home","Leave the discharge teaching until the day of discharge so that it is fresh in his mind"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Screen the client's needs early in the stay and share the findings with the team|||Give the client a list of home health agencies and respect the client's choice$nclexmocb2b3$, $nclexmocb2b3$The RN identifies needs early and supports the client's choice of providers. Choosing for the client, leaving the work to the client, waiting to be asked, or leaving teaching to the last day undermines safe transitions.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Admit, transfer and discharge clients; referrals; consent education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning: early identification, evaluation, transfer or referral","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":44,"subtopic":"Admission, transfer and discharge","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":44,"subtopic":"Admission, transfer and discharge"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q44 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$00b4b6cd38b897b2da06a8f91b0da105$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q44 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q44 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q45 id already exists: cbfe07eacbc97213037ddace0';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q45 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e47cc53536e4cf7ff5cc908ede6ccd64$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q45 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client who follows a vegetarian practice for religious reasons is served a lunch tray with chicken broth. The client pushes the tray away.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell him that broth is a small part of the meal and that the rest of the tray is nutritious","Ask his family to bring in meals from home for the length of the hospital stay","Document that he refused the meal and offer him a nutritional supplement instead","Ask about his dietary practices and arrange vegetarian meals with the dietary department"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask about his dietary practices and arrange vegetarian meals with the dietary department$nclexmocb2b3$, $nclexmocb2b3$Providing care that respects the client's beliefs includes accommodating dietary practices through the proper department. The RN does not dismiss the concern or shift the responsibility to the family.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care that is unbiased and equal access","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CLAS","label":"HHS OMH National CLAS Standards","locator":"Standard 1: effective, equitable, understandable and respectful care responsive to cultural beliefs, language and health literacy","url":"https://thinkculturalhealth.hhs.gov/clas/standards"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":45,"subtopic":"Unbiased treatment and equal access","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":45,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q45 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e47cc53536e4cf7ff5cc908ede6ccd64$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q45 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q45 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q46 id already exists: cb35639edaf115a28a411264d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q46 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$ac65536b5829b8299f13d9f98bad0844$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q46 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with an intellectual disability makes his own decisions and has a new diagnosis of diabetes. The RN is planning teaching about glucose monitoring.$nclexmocb2b3$, $nclexmocb2b3$Which approach is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Plan short sessions with simple words and demonstration, and have him show the steps","Teach his caregiver the steps instead and give him a brief written summary of the plan","Give him the standard teaching handout and ask him to read it before discharge","Postpone the teaching until a family guardian can attend the session with him"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Plan short sessions with simple words and demonstration, and have him show the steps$nclexmocb2b3$, $nclexmocb2b3$Care should be adapted to the client's level of understanding without removing his role in his own care. Return demonstration confirms learning.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care that is unbiased and equal access; consent education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CLAS","label":"HHS OMH National CLAS Standards","locator":"Standard 1: effective, equitable, understandable and respectful care responsive to cultural beliefs, language and health literacy","url":"https://thinkculturalhealth.hhs.gov/clas/standards"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":46,"subtopic":"Unbiased treatment and equal access","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":46,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q46 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$ac65536b5829b8299f13d9f98bad0844$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q46 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q46 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q47 id already exists: cbd7a224a79c3be4515460f3a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q47 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$b6df6d96123d1fff5a8ac09e70667740$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q47 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$At admission a client holds the registration form upside down and says, "I left my glasses at home." The RN suspects he cannot read.$nclexmocb2b3$, $nclexmocb2b3$What is the best action?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask his daughter to read and sign the form for him, and not tell him the reason","Offer privately to read the form aloud and go over it with him in plain words","Tell him to take the form home and bring it back signed by tomorrow morning","Give him a large-print copy and wait for him to ask for help if he needs it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Offer privately to read the form aloud and go over it with him in plain words$nclexmocb2b3$, $nclexmocb2b3$Low literacy is common and should not be exposed or ignored. The RN offers help privately and uses plain language so the client can take part in decisions.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care that is unbiased and equal access; rights education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CLAS","label":"HHS OMH National CLAS Standards","locator":"Standard 1: effective, equitable, understandable and respectful care responsive to cultural beliefs, language and health literacy","url":"https://thinkculturalhealth.hhs.gov/clas/standards"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":47,"subtopic":"Unbiased treatment and equal access","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":47,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q47 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$b6df6d96123d1fff5a8ac09e70667740$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q47 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q47 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q48 id already exists: ce0f11ab9db8b4b04912440ec';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q48 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$49a35a79e1834399be984e9b2f613ac6$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q48 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A transgender woman is admitted to a semiprivate room. Her roommate tells the RN, "I do not want to share a room with a man." Another semiprivate room has an open bed, the transgender client has not asked to move, and facility policy assigns rooms by the client's gender identity.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Move the transgender client to a private room, since the roommate has raised a safety concern","Tell the roommate the client's sex assigned at birth so that she understands the situation","Explain that both clients have a right to care, and offer the roommate a move to the open bed","Ask both clients to work it out between themselves and call the RN back if they cannot agree on it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Explain that both clients have a right to care, and offer the roommate a move to the open bed$nclexmocb2b3$, $nclexmocb2b3$The transgender client must not be moved or exposed because of another client's bias. Offering the complaining client another room addresses her comfort while respecting both.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care that is unbiased and equal access; confidentiality","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1 and Provision 3: respect and privacy","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":48,"subtopic":"Unbiased treatment and equal access","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":48,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q48 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$49a35a79e1834399be984e9b2f613ac6$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q48 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q48 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q49 id already exists: c7a8eb147760de0363fc2fdb6';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q49 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$3831db9e2ba8a67cf424737fd55b0b21$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q49 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is planning teaching for a client who has low health literacy and a new prescription for a blood thinner.$nclexmocb2b3$, $nclexmocb2b3$Which actions help provide equal access to understandable care? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["Use plain, everyday words in place of medical terms and explain any new term","Use the same medical terms that appear in the chart so that he learns them","Limit each session to a few key points and repeat them at the next visit","Ask him to tell the RN in front of his family whether he can read","Ask the client to explain the instructions back in his own words","Give a long written pamphlet and ask him to read it before the next visit"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocb2b3$,
    $nclexmocb2b3$Use plain, everyday words in place of medical terms and explain any new term|||Limit each session to a few key points and repeat them at the next visit|||Ask the client to explain the instructions back in his own words$nclexmocb2b3$, $nclexmocb2b3$Understandable care uses plain language, confirmation of understanding and small steps. Long text, jargon and public questions about reading ability block understanding.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care that is unbiased and equal access; consent education","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CLAS","label":"HHS OMH National CLAS Standards","locator":"Standard 1: effective, equitable, understandable and respectful care responsive to cultural beliefs, language and health literacy","url":"https://thinkculturalhealth.hhs.gov/clas/standards"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$ethical-principles$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":49,"subtopic":"Unbiased treatment and equal access","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":49,"subtopic":"Unbiased treatment and equal access"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q49 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$3831db9e2ba8a67cf424737fd55b0b21$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q49 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q49 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q50 id already exists: c38e6b88ecddc9153df4cbdf7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q50 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$c196b84e92fe539e77d94afcddd7eacf$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q50 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client has had a stage 3 pressure injury for 7 days. The plan of care calls for turning every 2 hours, and the wound has not improved.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Continue the same interventions for 7 more days before deciding whether to make changes","Discontinue the goal since the client is not responding to treatment on this schedule","Document that the client is noncompliant and keep the plan as written for now","Reassess the factors that affect healing and revise the plan of care as needed"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Reassess the factors that affect healing and revise the plan of care as needed$nclexmocb2b3$, $nclexmocb2b3$Evaluation compares outcomes with goals. When goals are not met, the RN reassesses and revises the plan rather than continuing an ineffective approach.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Develop and update plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"NPIAP-2019","label":"Prevention and Treatment of Pressure Ulcers/Injuries: Clinical Practice Guideline, 3rd ed. (EPUAP/NPIAP/PPPIA)","locator":"Assess, reassess and modify the plan when healing is not progressing","url":"https://www.internationalguideline.com/2019"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":50,"subtopic":"Plan of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":50,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q50 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$c196b84e92fe539e77d94afcddd7eacf$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q50 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q50 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q51 id already exists: c89e8a2292efb0f568eaffe35';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q51 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$e6b7cd6642b140747d2e2e7ee243a209$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q51 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is developing the plan of care for a client who had a stroke and will return home to live with his wife.$nclexmocb2b3$, $nclexmocb2b3$Which action best ensures the plan will fit the client's situation?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Write the plan from the therapy team's recommendations and review it with the wife at discharge","Use the unit's standard stroke plan and add details after the client has gone home","Ask the case manager to write the plan since the client will go home soon","Include him and his wife in setting goals and ask what they can manage at home"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Include him and his wife in setting goals and ask what they can manage at home$nclexmocb2b3$, $nclexmocb2b3$A plan of care is more effective when it is developed with the client and family and is realistic for the setting where it will be carried out.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Develop plan of care; collaboration","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning with the client and caregiver","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":51,"subtopic":"Plan of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":51,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q51 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$e6b7cd6642b140747d2e2e7ee243a209$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q51 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q51 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q52 id already exists: c366acd357b0c1cfb3434263c';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q52 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$7da6c5b1c3a7dd79904b89e7efc7ff37$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q52 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reviews a care plan written by another RN for a client with a new colostomy. One entry reads, "Teach ostomy care," with no goal or details.$nclexmocb2b3$, $nclexmocb2b3$Which revision would make the plan most useful?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Write a measurable goal, such as emptying and changing the pouch with return demonstration by day 3","Change the entry to 'Teach ostomy care before discharge,' sign it, and add the date it was written","Replace the teaching goal with a nursing diagnosis of disturbed body image related to the new stoma","Add the teaching materials to be used, such as a video, a booklet and a list of ostomy supply vendors"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Write a measurable goal, such as emptying and changing the pouch with return demonstration by day 3$nclexmocb2b3$, $nclexmocb2b3$Goals and outcomes should be specific, measurable and time-bound so that progress can be evaluated and communicated across the team.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Develop plan of care; documentation","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Documentation reflects the plan and progress toward outcomes","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":52,"subtopic":"Plan of care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":52,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q52 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$7da6c5b1c3a7dd79904b89e7efc7ff37$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q52 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q52 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q53 id already exists: c50ee12b972a27ca911a3e6ae';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q53 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$435bbbea0cfd598f4cb0d906628fcbbf$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q53 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN reviews the plan of care for a client on a medical unit.$nclexmocb2b3$, $nclexmocb2b3$Which findings should prompt the RN to update the plan of care? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["A new provider order for contact precautions","Vital signs that are in the client's usual range","A new nursing assistant starting on the unit","New onset of confusion during the afternoon","A change in the planned discharge setting","Planned tests that are proceeding on schedule"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$A new provider order for contact precautions|||New onset of confusion during the afternoon|||A change in the planned discharge setting$nclexmocb2b3$, $nclexmocb2b3$The plan is updated when the client's condition, orders or discharge plan change: a new precautions order, new confusion and a change in the discharge setting. Stable vital signs, a staffing change on the unit and tests proceeding on schedule do not require revision.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Develop and update plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Care plan updated as client status changes","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":53,"subtopic":"Plan of care","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":53,"subtopic":"Plan of care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q53 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$435bbbea0cfd598f4cb0d906628fcbbf$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q53 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q53 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q54 id already exists: c500eaf32cd70486d947cabd5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q54 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$3603b9c0115cd9cdd839379ce13b1855$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q54 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN scans a client's wristband before giving a medication, and the barcode scanner cannot read it. The band is smudged.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Get a new wristband as policy directs, scan it, and give the medication once the scan matches","Type the client's name and birth date into the system to override the scan and give the medication","Ask a colleague to read the wristband aloud to confirm the identity, then give the medication","Give the medication and report the scanner problem to the manager at the end of the shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Get a new wristband as policy directs, scan it, and give the medication once the scan matches$nclexmocb2b3$, $nclexmocb2b3$Technology safeguards for identification must not be bypassed. Fixing the identifier first keeps the check meaningful and follows policy.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use resources: information technology, policies and procedures","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-23","label":"42 CFR 482.23 Condition of participation: Nursing services","locator":"(c)(1) Drugs and biologicals prepared and administered per orders and policies","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":54,"subtopic":"Resources: evidence, information technology and policies","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":54,"subtopic":"Resources: evidence, information technology and policies"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q54 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$3603b9c0115cd9cdd839379ce13b1855$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q54 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q54 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q55 id already exists: cd6c61b7862a67973b859b71b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q55 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$87d9d2cbd3cf5602bb4e0f39a3d3daa9$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q55 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A unit practice council wants to know whether early mobilization lowers the rate of delirium in older clients and is looking for the strongest type of evidence.$nclexmocb2b3$, $nclexmocb2b3$Which source would provide the strongest evidence?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["A consensus statement from a panel of experts at a national nursing conference","A case series describing several clients who improved after early mobilization on one unit","A cohort study that followed several hundred older clients at one hospital","A systematic review of randomized trials on early mobilization in older clients"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$A systematic review of randomized trials on early mobilization in older clients$nclexmocb2b3$, $nclexmocb2b3$Systematic reviews of randomized trials sit at the top of the evidence hierarchy for questions about interventions. Expert consensus, case series and single-site cohort studies rank lower.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use evidence-based practice and resources","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":55,"subtopic":"Resources: evidence, information technology and policies","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":55,"subtopic":"Resources: evidence, information technology and policies"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q55 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$87d9d2cbd3cf5602bb4e0f39a3d3daa9$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q55 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q55 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q56 id already exists: c97ed3ef9df6081978f68beff';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q56 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$d502d65e0fd52e2c2ce97578b4489a7f$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q56 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$On the intranet an RN finds two policies for changing central line dressings. One says every 7 days and another, written earlier, says every 3 days.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Follow the older policy, because it has been used in practice on the unit longer","Ask the manager which policy is current and report the conflict for revision","Follow whichever of the two policies fits the unit's workload on that day","Use the dressing manufacturer's package directions instead of either policy"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the manager which policy is current and report the conflict for revision$nclexmocb2b3$, $nclexmocb2b3$Conflicting policies should be clarified with the owner of the policy and corrected. Choosing for convenience or tradition risks unsafe practice.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Use resources: policies and procedures; performance improvement","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-21","label":"42 CFR 482.21 Condition of participation: Quality assessment and performance improvement program","locator":"QAPI: policy review and improvement","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.21"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":56,"subtopic":"Resources: evidence, information technology and policies","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":56,"subtopic":"Resources: evidence, information technology and policies"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q56 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$d502d65e0fd52e2c2ce97578b4489a7f$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q56 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q56 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q57 id already exists: cd6069011a0e77f84752676be';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q57 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$b164bba97aa761715e379a2cc683da1d$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q57 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A surgeon shouts at the RN in the hallway because transport to the operating room was delayed.$nclexmocb2b3$, $nclexmocb2b3$Which response is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell him in the hallway, in a firm voice, that the delay was the fault of the surgeon","Write an incident report about the shouting and say nothing to him about the delay","Avoid him for the rest of the shift and ask a colleague to handle communication","Wait for him to calm down, then ask to talk privately about the delay and its fix"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Wait for him to calm down, then ask to talk privately about the delay and its fix$nclexmocb2b3$, $nclexmocb2b3$A calm, private conversation that focuses on the problem and a solution resolves conflict without escalation. Matching hostility or avoiding the issue does not.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"DESC script: describe, express, suggest, consequences","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":57,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":57,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q57 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$b164bba97aa761715e379a2cc683da1d$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q57 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q57 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q58 id already exists: ca927b1a8cc530408d2061143';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q58 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$65083d0de582b8b7913797ce61ed3822$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q58 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with severe postoperative pain shouts at the RN because the pain medication is 20 minutes late.$nclexmocb2b3$, $nclexmocb2b3$Which response is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Tell him that other clients also need medication and that he has to wait his turn for it","Leave the room to avoid an argument and send the charge nurse to speak with him","Ask him to lower his voice and say that staff will not respond to shouting","Acknowledge his distress, give the late dose now as ordered, and check on him later"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Acknowledge his distress, give the late dose now as ordered, and check on him later$nclexmocb2b3$, $nclexmocb2b3$Acknowledging the client's distress and giving the overdue dose promptly de-escalates the conflict and addresses its cause.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"Communication that supports the client and the team","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$,
    false, false, true,
    2, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":58,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":58,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q58 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$65083d0de582b8b7913797ce61ed3822$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q58 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q58 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q59 id already exists: c53943e73cffb22e53e005e03';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q59 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$bf12abf8d00575e114767a0ba508e085$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q59 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN has had the heaviest workload on four of the last five shifts, while two other nurses have had the lightest. She believes the unit's assignments are unfair.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do first?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Ask the charge nurse to meet privately and review how the assignments have been made","Trade assignments quietly with those two nurses and tell the charge nurse afterward","Post her concerns on the staff board so that the other nurses on the unit can comment","Accept the assignments for now and plan to apply to transfer to another unit later"],"clientNeedsCategory":"Management of Care","blueprintTopic":"leadership-conflict-resolution"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask the charge nurse to meet privately and review how the assignments have been made$nclexmocb2b3$, $nclexmocb2b3$Direct, respectful discussion with the person responsible, using objective data, resolves workload conflicts and avoids gossip or avoidance.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","leadership-conflict-resolution","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Manage conflict; organize workload","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-TS-MS","label":"AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)","locator":"DESC: state concerns with facts and propose a solution","url":"https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$leadership-conflict-resolution$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":59,"subtopic":"Conflict management","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":59,"subtopic":"Conflict management"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q59 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$bf12abf8d00575e114767a0ba508e085$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q59 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q59 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q60 id already exists: cb0867d2004f7720b397b7eee';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q60 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$aeba15e9566ce78e28ea2453a0c14e67$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q60 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client with stage IV pancreatic cancer is receiving chemotherapy and says he wants to continue it. The provider estimates his prognosis at more than six months, and he has not elected hospice. His pain is not controlled, his family is in distress, and his goals are comfort and time at home.$nclexmocb2b3$, $nclexmocb2b3$For which referral should the RN ask for an order?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Hospice enrollment today, because the client has a terminal diagnosis","A palliative care consultation for symptom control and support for the family","An outpatient pain clinic referral for a nerve block after discharge from the hospital","A pastoral care visit for the family in place of further pain assessment today"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$A palliative care consultation for symptom control and support for the family$nclexmocb2b3$, $nclexmocb2b3$Palliative care addresses symptoms and family needs alongside disease treatment. Hospice needs the client's election and a prognosis of six months or less, neither of which is present here. An outpatient referral after discharge does not address pain now, and pastoral care complements but does not replace pain assessment.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Multidisciplinary collaboration; referrals","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":60,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":60,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q60 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$aeba15e9566ce78e28ea2453a0c14e67$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q60 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q60 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q61 id already exists: cd550c9c02b2757f44ef35434';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q61 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$59f6695eff95d2e6812fd2c7ab9a2d82$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q61 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client who had a total knee replacement was told by the physical therapist to use a walker and by the occupational therapist to use a cane. Both notes are in the chart.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Use the device in the note that was written first and let the other therapist know","Let the client choose whichever device he prefers each time he gets up to walk","Ask the nursing assistant to decide and tell the client which device to use","Ask both therapists to agree on one instruction for him and tell the care team"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask both therapists to agree on one instruction for him and tell the care team$nclexmocb2b3$, $nclexmocb2b3$Conflicting instructions create a fall risk. The RN coordinates the team so that the client receives one consistent plan.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Multidisciplinary collaboration; plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":61,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":61,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q61 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$59f6695eff95d2e6812fd2c7ab9a2d82$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q61 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q61 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q62 id already exists: c346de6c09f752ef74caa8bdf';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q62 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$cd4a95e6f1a9c716de0de7797ffa62eb$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q62 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN is deciding when to ask for a social work referral for clients on the unit.$nclexmocb2b3$, $nclexmocb2b3$Which situations are appropriate reasons for a social work referral? Select all that apply.$nclexmocb2b3$, $nclexmocb2b3${"kind":"select_all","options":["The client's pain is not controlled by the current pain medication order","The client's serum potassium level is high on the morning blood draw","The client says he cannot afford the medications prescribed for home","The client needs a new wound dressing for a surgical incision","The client reports nausea after taking a newly prescribed medication","The client cannot arrange transportation to dialysis visits"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocb2b3$,
    $nclexmocb2b3$The client says he cannot afford the medications prescribed for home|||The client cannot arrange transportation to dialysis visits$nclexmocb2b3$, $nclexmocb2b3$Social work addresses financial and transport needs and other community resources. Pain, lab abnormalities, wound care and medication side effects are managed by the provider, pharmacist or nursing staff.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Referrals; multidisciplinary collaboration; report as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Discharge planning evaluation and resources","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$continuity-case-management$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$select_all$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":62,"subtopic":"Interdisciplinary collaboration and referrals","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":62,"subtopic":"Interdisciplinary collaboration and referrals"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q62 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$cd4a95e6f1a9c716de0de7797ffa62eb$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q62 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q62 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q63 id already exists: c0f8b74fbb3b56cba59a8106b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q63 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$a93211ecfe7667e953961714575799e4$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q63 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN notices that a large dressing kit is opened for each change even when only a small dressing is needed, and much of the kit is thrown away.$nclexmocb2b3$, $nclexmocb2b3$What is the best action?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Suggest a supply review with the manager to stock smaller packs of dressing supplies","Reuse the opened items from the kit at the next dressing change to reduce waste on the unit","Take supplies from the stock room when needed and bill them to the client's account","Substitute a less expensive dressing type and tell the wound care nurse afterward"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$Suggest a supply review with the manager to stock smaller packs of dressing supplies$nclexmocb2b3$, $nclexmocb2b3$Cost-effective care reduces waste without lowering safety or quality. Changes go through the proper review.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Cost-effective care; performance improvement","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-21","label":"42 CFR 482.21 Condition of participation: Quality assessment and performance improvement program","locator":"QAPI: identify and reduce problems","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.21"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":63,"subtopic":"Quality improvement and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":63,"subtopic":"Quality improvement and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q63 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$a93211ecfe7667e953961714575799e4$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q63 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q63 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q64 id already exists: cb926fa5130f60ea7fca02a80';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q64 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$cb22cb056278783f5d729fab5da3fe61$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q64 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A unit is working to reduce catheter-associated urinary tract infections. The team reviews different types of data.$nclexmocb2b3$, $nclexmocb2b3$Which is an example of a process measure?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The number of infections per 1,000 catheter days on the unit this quarter","The number of catheters that the unit orders from supply each month","The percentage of catheters that had a documented daily review of need","The average hospital stay of clients who develop an infection after catheter use"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocb2b3$,
    $nclexmocb2b3$The percentage of catheters that had a documented daily review of need$nclexmocb2b3$, $nclexmocb2b3$A process measure tracks whether a recommended practice is being done. Infection rate and length of stay are outcomes, and supply counts do not show practice.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Performance improvement; quality improvement","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"IHI-MFI","label":"IHI Model for Improvement","locator":"Measures to know whether a change is an improvement","url":"https://www.ihi.org/library/model-for-improvement"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$quality-improvement$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":64,"subtopic":"Quality improvement and cost-effective care","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":64,"subtopic":"Quality improvement and cost-effective care"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q64 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$cb22cb056278783f5d729fab5da3fe61$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q64 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q64 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q65 id already exists: c05f1968b2c20e4c99375966c';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q65 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$dfba7c5d7c3338de9e1c797e1bd38245$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q65 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$Two RNs need to discuss a client's change in condition while one of them is off the unit.$nclexmocb2b3$, $nclexmocb2b3$Which method should they use?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["A text message from a personal phone using the client's initials and room number","A photograph of the wound sent from a personal phone and deleted afterward","The messaging app that the facility has approved as secure for clinical use","A group chat with the whole team that is kept until the end of the shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$The messaging app that the facility has approved as secure for clinical use$nclexmocb2b3$, $nclexmocb2b3$Protected health information should be shared through approved secure systems. Personal devices and unsecured messaging create risk of disclosure.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.502(b) minimum necessary; 164.506(c) uses for treatment","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":65,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":65,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q65 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$dfba7c5d7c3338de9e1c797e1bd38245$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q65 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q65 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q66 id already exists: c2c9f89bd0160bb83a0c336ec';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q66 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2d710e9fcf4c7febaefc445b8aae6521$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q66 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A clinic RN needs to remind a client about a colonoscopy tomorrow. The client's answering machine plays a greeting and records a message.$nclexmocb2b3$, $nclexmocb2b3$What should the RN say in the message?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["The clinic's name and a call-back number, and no details about the procedure or visit","The procedure name and the arrival time, since the preparation steps are in the packet","A statement that the instructions will be texted to the number on file this evening","A request that he call back, and a statement that the message is about his test results"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$The clinic's name and a call-back number, and no details about the procedure or visit$nclexmocb2b3$, $nclexmocb2b3$Messages should limit the information left to what is necessary unless the client has agreed to more. Details of a procedure could be heard by others.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.502(b) minimum necessary; 164.514(d)","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":66,"subtopic":"Confidentiality and information security","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":66,"subtopic":"Confidentiality and information security"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q66 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2d710e9fcf4c7febaefc445b8aae6521$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q66 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q66 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q67 id already exists: c35c917afa20a6f7141a242e7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q67 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$a5b74a07216e0519beb2118ced7fbba7$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q67 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client has an order for morphine 2 to 4 mg IV every 3 hours as needed for pain. He reports pain of 8/10, is difficult to arouse and has a respiratory rate of 10/min.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Give 2 mg, the lowest dose in the order, and watch his respiratory rate and arousal closely","Hold the dose, reassess his arousal and breathing, and notify the provider or the rapid response team","Give 4 mg to relieve his pain of 8/10, since the order allows that dose for severe pain","Hold the dose and give naloxone now, before reassessing him further or calling the provider or the team"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Hold the dose, reassess his arousal and breathing, and notify the provider or the rapid response team$nclexmocb2b3$, $nclexmocb2b3$An order is carried out only when it is safe for the client at that time. Sedation with slowed breathing is a sign of opioid-induced sedation, so the RN holds the dose, reassesses arousal and breathing, and escalates to the provider or rapid response team. Naloxone is given per protocol or order after assessment and escalation, not in place of them.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ASPMN-2020","label":"Jungquist CR et al. ASPMN Guidelines on Monitoring for Opioid-Induced Advancing Sedation and Respiratory Depression: Revisions (ASPMN)","locator":"Monitoring for opioid-induced sedation and respiratory depression","url":"https://doi.org/10.1016/j.pmn.2019.06.007"},{"src":"ISMP-HIGHALERT","label":"ISMP List of High-Alert Medications in Acute Care Settings (ISMP)","locator":"Opioids are high-alert medications","url":"https://www.ismp.org/recommendations/high-alert-medications-acute-list"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":67,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":67,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q67 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$a5b74a07216e0519beb2118ced7fbba7$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q67 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q67 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q68 id already exists: cfc86105ed1af707b7e2ff22b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q68 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$15477b0ea5c72048e560c5380bf02e6b$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q68 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A provider sends the RN a text message from a personal phone: "Increase potassium chloride to 40 mEq today." Facility policy accepts orders through computerized entry or by telephone with read-back.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Carry out the text order and save a screenshot as proof that it was received","Reply to the text asking the provider to confirm the dose in writing, then give it","Ask for the order to be entered in the record or phoned in with read-back first","Ask a colleague to view the text and co-sign the screenshot before giving the dose"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Ask for the order to be entered in the record or phoned in with read-back first$nclexmocb2b3$, $nclexmocb2b3$Orders must be received through approved channels so that they are accurate, verified and part of the record.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive, verify and implement orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-24","label":"42 CFR 482.24 Condition of participation: Medical record services","locator":"(c)(2) Orders; authentication","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24"},{"src":"CFR-482-23","label":"42 CFR 482.23 Condition of participation: Nursing services","locator":"(c) Orders and verbal orders","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":68,"subtopic":"Receiving, verifying and implementing orders","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":68,"subtopic":"Receiving, verifying and implementing orders"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q68 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$15477b0ea5c72048e560c5380bf02e6b$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q68 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q68 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q69 id already exists: c2bcf94c8917052ec6dd6380f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q69 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$2a3474aa770173a9fd9a7bed98a4363e$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q69 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$An RN in an emergency department treats a client who has a gunshot wound. State law requires health care workers to report gunshot injuries to law enforcement.$nclexmocb2b3$, $nclexmocb2b3$What should the RN do?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Wait for the client to give permission before making a report to law enforcement","Make the report as the facility's procedure directs, and do not wait for permission","Make the report if the client says that another person fired the gun at him in a fight","Delay the report until the client is awake and able to give a statement"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Make the report as the facility's procedure directs, and do not wait for permission$nclexmocb2b3$, $nclexmocb2b3$Mandatory reporting laws apply regardless of client consent. The RN follows the required procedure and shares only the information the law allows.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HIPAA-164","label":"45 CFR Part 164 Subpart E (HIPAA Privacy Rule)","locator":"164.512(a) required by law; 164.512(f) law enforcement","url":"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":69,"subtopic":"Reporting required by law","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":69,"subtopic":"Reporting required by law"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q69 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$2a3474aa770173a9fd9a7bed98a4363e$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q69 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q69 was not inserted held';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q70 id already exists: c99ffbd88dddca442ab2d5e1f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q70 contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = $nclexmocb2b3$a1454e929c92cd04e6fbff519f160bb5$nclexmocb2b3$
  ) THEN
    RAISE EXCEPTION 'b3 Q70 stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$, $nclexmocb2b3$nursing$nclexmocb2b3$, $nclexmocb2b3$management-of-care$nclexmocb2b3$,
    $nclexmocb2b3$A client refuses a scheduled 40 mg dose of enoxaparin at 0900 after the RN explained the risk of blood clots. The RN notifies the provider at 0915.$nclexmocb2b3$, $nclexmocb2b3$Which entry is best?$nclexmocb2b3$, $nclexmocb2b3${"kind":"mcq","options":["Declined 40 mg dose at 0900 after teaching about the risk; provider notified at 0915","Refused 40 mg enoxaparin at 0900 and was told of the clot risk once; no other action planned","Client refused enoxaparin 40 mg at 0900 because he dislikes injections; will retry later","Enoxaparin 40 mg held per client request at 0900; provider to be asked at rounds"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocb2b3$,
    $nclexmocb2b3$Declined 40 mg dose at 0900 after teaching about the risk; provider notified at 0915$nclexmocb2b3$, $nclexmocb2b3$Documentation should be factual and complete, with no judgment or assumption: the dose, what was taught, the client's response and who was notified.$nclexmocb2b3$,
    $nclexmocb2b3$["nclex-moc-b2b3","nclex-moc-b3","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocb2b3$, $nclexmocb2b3$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Document using approved terminology","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-DOC","label":"ANA Principles for Nursing Documentation (2010)","locator":"Documentation is accurate, complete, factual and timely","url":"https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf"}]$nclexmocb2b3$::jsonb,
    $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$,
    false, false, true,
    3, $nclexmocb2b3$Management of Care$nclexmocb2b3$, $nclexmocb2b3$nclex-safe-care$nclexmocb2b3$,
    $nclexmocb2b3$legal-aspects$nclexmocb2b3$, $nclexmocb2b3$Management of Care$nclexmocb2b3$,
    $nclexmocb2b3$vignette$nclexmocb2b3$, $nclexmocb2b3$nclex-moc-b2b3$nclexmocb2b3$, $nclexmocb2b3$pending$nclexmocb2b3$,
    $nclexmocb2b3${"batchId":"nclex-moc-b2b3-20261030","pipelineVersion":"nclex-moc-b2b3","sourceBatch":"batch3","sourceVersion":"v4","sourceItem":70,"subtopic":"Documentation and approved terminology","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocb2b3$::jsonb, $nclexmocb2b3${"metadataBy":"nclex-moc-b2b3","heldForRnReview":true,"sourceBatch":"batch3","sourceVersion":"v4","sourceItem":70,"subtopic":"Documentation and approved terminology"}$nclexmocb2b3$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'b3 Q70 insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$)
       IS DISTINCT FROM $nclexmocb2b3$a1454e929c92cd04e6fbff519f160bb5$nclexmocb2b3$ THEN
    RAISE EXCEPTION 'b3 Q70 stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$) THEN
    RAISE EXCEPTION 'b3 Q70 was not inserted held';
  END IF;
END
$do$;
CREATE TABLE qbi_nclex_moc_b2b3_insert_20261030 AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$);
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_insert_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'insert backup: expected 140, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_insert_20261030
WHERE active = false AND "qaPassed" = false AND "fieldId" = 'nursing'
  AND "subjectId" = 'management-of-care' AND manual_correction = true
  AND "reviewStatus" = 'pending')::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'insert backup held flags: expected 140, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE "contentHash" IN ($nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$,
$nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$,
$nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$,
$nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$,
$nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$,
$nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$,
$nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$,
$nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$,
$nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$,
$nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$,
$nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$,
$nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$,
$nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$,
$nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$,
$nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$,
$nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$,
$nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$,
$nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$,
$nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$,
$nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$,
$nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$,
$nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$,
$nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$,
$nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$,
$nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$,
$nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$,
$nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$,
$nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$,
$nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$,
$nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$,
$nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$,
$nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$,
$nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$,
$nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$,
$nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$,
$nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$,
$nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$,
$nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$,
$nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$,
$nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$,
$nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$,
$nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$,
$nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$,
$nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$,
$nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$,
$nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$,
$nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$,
$nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$,
$nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$,
$nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$,
$nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$,
$nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$,
$nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$,
$nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$,
$nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$,
$nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$,
$nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$,
$nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$,
$nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$,
$nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$,
$nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$,
$nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$,
$nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$,
$nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$,
$nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$,
$nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$,
$nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$,
$nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$,
$nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$,
$nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$,
$nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$,
$nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$,
$nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$,
$nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$,
$nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$,
$nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$,
$nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$,
$nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$,
$nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$,
$nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$,
$nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$,
$nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$,
$nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$,
$nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$,
$nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$,
$nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$,
$nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$,
$nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$,
$nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$,
$nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$,
$nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$,
$nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$,
$nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$,
$nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$,
$nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$,
$nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$,
$nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$,
$nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$,
$nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$,
$nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$,
$nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$,
$nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$,
$nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$,
$nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$,
$nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$,
$nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$,
$nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$,
$nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$,
$nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$,
$nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$,
$nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$,
$nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$,
$nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$,
$nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$,
$nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$,
$nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$,
$nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$,
$nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$,
$nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$,
$nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$,
$nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$,
$nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$,
$nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$,
$nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$,
$nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$,
$nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$,
$nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$,
$nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$,
$nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$,
$nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$,
$nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$,
$nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$,
$nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$,
$nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$,
$nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$,
$nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$,
$nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$,
$nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$,
$nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$,
$nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$))::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'new hashes present once: expected 140, found %', n;
  END IF;
END
$check$;


DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_b2b3_activate_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_moc_b2b3_activate_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Snapshot the held flags before publishing them.
CREATE TABLE qbi_nclex_moc_b2b3_activate_20261030 AS
SELECT id, active, "qaPassed", "reviewStatus", "lastReviewedAt", "qaAuditedAt", "updatedAt", "contentHash"
FROM "QuestionBankItem"
WHERE id IN ($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$);
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_activate_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'activate backup: expected 140, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_activate_20261030 b
JOIN (VALUES
($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$),
($nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$),
($nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$),
($nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$),
($nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$),
($nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$),
($nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$),
($nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$),
($nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$),
($nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$),
($nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$),
($nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$),
($nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$),
($nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$),
($nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$),
($nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$),
($nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$),
($nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$),
($nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$),
($nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$),
($nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$),
($nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$),
($nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$),
($nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$),
($nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$),
($nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$),
($nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$),
($nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$),
($nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$),
($nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$),
($nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$),
($nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$),
($nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$),
($nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$),
($nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$),
($nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$),
($nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$),
($nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$),
($nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$),
($nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$),
($nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$),
($nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$),
($nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$),
($nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$),
($nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$),
($nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$),
($nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$),
($nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$),
($nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$),
($nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$),
($nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$),
($nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$),
($nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$),
($nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$),
($nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$),
($nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$),
($nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$),
($nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$),
($nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$),
($nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$),
($nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$),
($nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$),
($nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$),
($nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$),
($nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$),
($nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$),
($nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$),
($nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$),
($nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$),
($nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$),
($nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$),
($nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$),
($nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$),
($nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$),
($nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$),
($nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$),
($nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$),
($nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$),
($nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$),
($nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$),
($nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$),
($nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$),
($nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$),
($nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$),
($nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$),
($nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$),
($nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$),
($nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$),
($nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$),
($nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$),
($nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$),
($nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$),
($nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$),
($nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$),
($nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$),
($nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$),
($nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$),
($nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$),
($nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$),
($nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$),
($nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$),
($nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$),
($nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$),
($nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$),
($nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$),
($nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$),
($nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$),
($nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$),
($nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$),
($nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$),
($nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$),
($nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$),
($nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$),
($nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$),
($nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$),
($nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$),
($nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$),
($nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$),
($nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$),
($nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$),
($nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$),
($nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$),
($nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$),
($nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$),
($nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$),
($nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$),
($nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$),
($nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$),
($nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$),
($nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$),
($nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$),
($nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$),
($nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$),
($nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$),
($nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$),
($nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$),
($nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$),
($nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$),
($nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$),
($nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$, $nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$)
) AS v(id, hash) ON v.id = b.id AND v.hash = b."contentHash"
WHERE b.active = false AND b."qaPassed" = false)::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'activate pre-image: expected 140, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = true,
    "qaPassed" = true,
    "reviewStatus" = 'approved',
    "lastReviewedAt" = CURRENT_TIMESTAMP,
    "qaAuditedAt" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
  FROM (VALUES
($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$),
($nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$),
($nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$),
($nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$),
($nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$),
($nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$),
($nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$),
($nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$),
($nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$),
($nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$),
($nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$),
($nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$),
($nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$),
($nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$),
($nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$),
($nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$),
($nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$),
($nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$),
($nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$),
($nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$),
($nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$),
($nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$),
($nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$),
($nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$),
($nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$),
($nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$),
($nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$),
($nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$),
($nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$),
($nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$),
($nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$),
($nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$),
($nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$),
($nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$),
($nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$),
($nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$),
($nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$),
($nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$),
($nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$),
($nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$),
($nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$),
($nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$),
($nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$),
($nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$),
($nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$),
($nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$),
($nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$),
($nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$),
($nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$),
($nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$),
($nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$),
($nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$),
($nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$),
($nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$),
($nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$),
($nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$),
($nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$),
($nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$),
($nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$),
($nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$),
($nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$),
($nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$),
($nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$),
($nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$),
($nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$),
($nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$),
($nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$),
($nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$),
($nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$),
($nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$),
($nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$),
($nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$),
($nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$),
($nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$),
($nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$),
($nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$),
($nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$),
($nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$),
($nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$),
($nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$),
($nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$),
($nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$),
($nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$),
($nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$),
($nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$),
($nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$),
($nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$),
($nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$),
($nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$),
($nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$),
($nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$),
($nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$),
($nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$),
($nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$),
($nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$),
($nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$),
($nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$),
($nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$),
($nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$),
($nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$),
($nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$),
($nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$),
($nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$),
($nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$),
($nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$),
($nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$),
($nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$),
($nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$),
($nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$),
($nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$),
($nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$),
($nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$),
($nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$),
($nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$),
($nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$),
($nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$),
($nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$),
($nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$),
($nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$),
($nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$),
($nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$),
($nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$),
($nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$),
($nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$),
($nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$),
($nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$),
($nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$),
($nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$),
($nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$),
($nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$),
($nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$),
($nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$),
($nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$),
($nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$),
($nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$),
($nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$),
($nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$),
($nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$),
($nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$),
($nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$, $nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$)
  ) AS v(id, hash)
  WHERE q.id = v.id
    AND q."contentHash" = v.hash
    AND q.active = false
    AND q."qaPassed" = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 140 THEN
    RAISE EXCEPTION 'activation expected 140 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN (VALUES
($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$2e751053e9f3765230d99b9db8201bce98d4343c2305b45231ecd547c6534c8d$nclexmocb2b3$),
($nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$2f4ceb36e1cecab747cd8a3367fb5120899283561a03d53aa8f849e92a39bd34$nclexmocb2b3$),
($nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$32ed9a88c3749421eb1246e50ed886d241ed945e919faa38ef4735f7eb671f1d$nclexmocb2b3$),
($nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$19ce75ded3969c33ae61b2a006efb47aca276b2ae4be4e1411e04c16fb6dde58$nclexmocb2b3$),
($nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$ff3c27dbb4e18fba170ff2a4505b1c84903cb78876e1b005be3ae31b84505a66$nclexmocb2b3$),
($nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$0079d01f90f0e6dd05a8b98edc70c8be2a364a0f54fecf7fa5ef2a7f8ba99fd5$nclexmocb2b3$),
($nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$647728695f6686d202dc594c794320187650f77d6918560e2ebca06cdca1ae8e$nclexmocb2b3$),
($nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$51b8bfe7d6d42b878f1216059962cc9341a07539be99fb919336da4ba2f52c76$nclexmocb2b3$),
($nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$a59e9566c0b2b2cfa6aaf5ec35d20b64da5d1a9f2cc0aa99e0d7c73aa9eb249d$nclexmocb2b3$),
($nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$918be56be389ac18e4bb4b6a1a6a139468a6daf519fc278e54d56ed31aa68009$nclexmocb2b3$),
($nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$7b5639534bc571193df5bfff0b8686697a2fc2363260127cf238512d9c921b6f$nclexmocb2b3$),
($nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$107b7842589ef9ed4c05c35a99da1128c6d7ae5791034853d8e1c21af9b05e8d$nclexmocb2b3$),
($nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$f881e7c94da287b1cbc0f976c37383772dac133671c381a4bcf6b3bf729b8cf1$nclexmocb2b3$),
($nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$b9eefa19216f7e175cb3f6f0cefaee80c531e24d8918ed25af5c8c6973eedc53$nclexmocb2b3$),
($nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$53dd7178611e1dcb6627c42a89a9c1bfa97cb7f21f58f09d20b523e4fb265604$nclexmocb2b3$),
($nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$3ae0f523c27c75549d84c2f93f31203f9e5cc13b87ca9eb95ff83c115ffe65c8$nclexmocb2b3$),
($nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$a46ae889e07b175bfe9e08747efe910ea9dc196b99d80c0b7a6a4373cde1456c$nclexmocb2b3$),
($nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$2093ac6ba16b822f4661646f6d803094cca273215026365765dff4cf39b3c996$nclexmocb2b3$),
($nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$49074d21d981844001cf13939395c65bf5cc36913e8b4a839d19793ca21881f3$nclexmocb2b3$),
($nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$eb83976b40afc6112ec99df654fd6dba020c81e6a2f88b9dd2ddd30f1b82968d$nclexmocb2b3$),
($nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$250862973a346c7ffa8fde8f8b090d16ca8be09996e63fcf2f25ae9ed8e0e510$nclexmocb2b3$),
($nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$414b3d1adccddbf76f93db6ee898d4a612ff22398e3efd251a2608d984ea67a9$nclexmocb2b3$),
($nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$2c22e47d8c6b97d5288995ec8e89885dd6ee854c3ba2789a6e233eaa8069ee4e$nclexmocb2b3$),
($nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$d84792a5d1162c479b99d027fc5c2b276448f051d93b93b96cd1f37d59763cc5$nclexmocb2b3$),
($nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$7b1693b3656d1f0de6f1a0e7436bdaef88d7e32d22f3d93600d9fa3abbec3849$nclexmocb2b3$),
($nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$9a960be06fe0fecb41eeff32c5518104328ce1023228ece01c762fb9b3acf89b$nclexmocb2b3$),
($nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$359ab141be586c924d5b7e460e37d503208c11a9bf20fc7da0a1027edf342919$nclexmocb2b3$),
($nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$0f02ebacd4a3142acd221c4408c0a068e4ca7521130d4ae8e124d869cdb6ee7f$nclexmocb2b3$),
($nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$0e7ee0fbffd3bcf4c9c03c49fea3fc82336abc763f9a451cb4bc48b368805581$nclexmocb2b3$),
($nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$2b984bb5493ce3bf506e88188c07f7878f50ba05a24932b03dd8b906dfefae9c$nclexmocb2b3$),
($nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c0096f1950c9adb0279e72cbd020b47120c9be69ed8e51643801b71d55a1235d$nclexmocb2b3$),
($nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$accc59d994b27fdefbfcad1b263c57ba486efeaa8e96c0905359edacd94015fe$nclexmocb2b3$),
($nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$5f58b8e1bc8c24047b635bc64e61fc1832aba7d7f1faf007c72a198e0ed9c312$nclexmocb2b3$),
($nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$72c959fa618751efd4154cb0d9b0cf2453fc5bb28b3fdacc74d7298bab58de20$nclexmocb2b3$),
($nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$47eb8fc2b497d8c0d2bf7279630ce63218586f31f79425473e9355a68a70fb66$nclexmocb2b3$),
($nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$037deeb726e17f6ccbc884385aa143029685f08ff5beddf1e8f0629a9eef5291$nclexmocb2b3$),
($nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$ee09f2e3d0e4982bd821b1192faebf97c08e6805bf6340b61b2b2908261b0c3c$nclexmocb2b3$),
($nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$9a574d24ed061bb5623e5a48af4870847e3e165d3e045dedfb147669071ce9f5$nclexmocb2b3$),
($nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$96576d2373deb11b298c4e4d01455e70a0ea4839c454def6aca13471d0e2fb50$nclexmocb2b3$),
($nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$33ba3379274b5e94d836aa0636de57c438cb0e0469ee346ec171094153ce7373$nclexmocb2b3$),
($nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$d2111deecb87aa9ab46b193c9ad117b779aeab385dd6bccf0f8d58b077b332f8$nclexmocb2b3$),
($nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$a5bfbb11662d6dafc174495132437cb364609f55d5cab9fa33abbad27d20bfc0$nclexmocb2b3$),
($nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$f8053e1705fdfed2af12fbb235830c8a4c9e3cfe9af13448c49254ba4f11e371$nclexmocb2b3$),
($nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$0fe171982482b7580890650c5edd2b3cb4139254d4addaae5975e1ebe2dc9063$nclexmocb2b3$),
($nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$bd73806720956a83d7ecf135383d6431696de4895a9ebe8ee74c6fcd727693db$nclexmocb2b3$),
($nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$721da0f8e54b8a353a132e787852772289460c9a15e1e34cd793ab913f0bc9e9$nclexmocb2b3$),
($nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$2d639c7b637e836f746761e7c64c4ec116eb95356783024babd0dd0970f5a1b4$nclexmocb2b3$),
($nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$4d72597591625791d1eb90ec9b59661bf9786c04e77dd943cbc590df55d3d0ab$nclexmocb2b3$),
($nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$cef7b7d8905e97630c411bfd8a1efee3ea61c3bb7b95e71f8994a98c16d12373$nclexmocb2b3$),
($nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$9657b6dca8d88be6ea8eb4ccf908dfb1d328efdcd512a937feefeba1eb02eb33$nclexmocb2b3$),
($nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$b7efe5a974ffc18a4a92f757aa73c729d239dd73e90712b084c8b2b6ffe7589b$nclexmocb2b3$),
($nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$97938b9e69888fa69c9e9beadc9c75b632c2150e0e2b77ef94b6c2d2b2124fc3$nclexmocb2b3$),
($nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$039206ab8ec6b12100530945cbc9a09197d6dcca7def206f103fca4638bffa23$nclexmocb2b3$),
($nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$d777f89fffea74a22a5eb198f964bca4f486c0a82c2a28bd1d6855073b07c147$nclexmocb2b3$),
($nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$c687b752ba6edab07b6e7ff4301df78a8e41b3b50237132fafccacff9cabee0d$nclexmocb2b3$),
($nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$722b10b175f9a57c40978fa2c5e236c044548c6c095b9f042a933d4c125a7776$nclexmocb2b3$),
($nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$86a45419dda4af2be597bf64d42e692d8847778d0c8ad58875ece5cc444e9ecf$nclexmocb2b3$),
($nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$f51d6b9bfd1ff3c70340b5760a3cf618345cf7b9cb07a4d675a14d6cdbf5a62d$nclexmocb2b3$),
($nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$660a7832329427b6e601c9cd7112a13a819853c940b355c909d85611cba61f3e$nclexmocb2b3$),
($nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$96c2e7ae65be1e9bca9340752f59c1a734215daecc76e85d2922b14fa3620bb4$nclexmocb2b3$),
($nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$a6ba95a44f4cf33c3ca1d658f8009bf25be82c30424113f2b1b99983d761061b$nclexmocb2b3$),
($nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$05252c271b96486b81b7b880fde5cc9025c53e324aba0e84da762e482108416a$nclexmocb2b3$),
($nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$1a609d3b0b72c98d372cf7b0ff2a9a450a6454df90d1cb11ca250ee85ce63aac$nclexmocb2b3$),
($nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$4c9c3b4fc370aa50916975b54f127aed4716fcdf401c9b512704d843f893f6fe$nclexmocb2b3$),
($nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$2cb4787b4dcc12dcb3168af8e0f3e7af6c90f950ac70cfd4d65ef9f9b73b658e$nclexmocb2b3$),
($nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$eece5806c12597c2d3ad1bb31a9f942ff67d1043a61cf905e09c5613cf5562fe$nclexmocb2b3$),
($nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$5ee5f15f23a710641153bb8c48d705c29243a14df05ef9a1390e52d990611510$nclexmocb2b3$),
($nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$9a639fc1e3a0cc00fe3032b17bc5ee0a2ae0c9999451b0e090828b758022befd$nclexmocb2b3$),
($nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$75ba9cf3824f7e3a037aff0640b76aee41c861b5bc05f13baf82d08ca2373ea7$nclexmocb2b3$),
($nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$e1185ceecad3f3060a38df000c3a29c17af60af9675b88686a62a4b33ed763b7$nclexmocb2b3$),
($nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$f648399c4df6b6cff878da80767c173e4276c45a01fd2be2d1a55b4f1c2607f3$nclexmocb2b3$),
($nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$717eb56602994c8e5172b9f39203d3bdadbadeab5c129bdf2eaadefe6842bdb7$nclexmocb2b3$),
($nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$16f283bb04fc4033046c62551ecf15476c2caca84b0fe9109dbe1e7c0468eda4$nclexmocb2b3$),
($nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$26b47b2525a9542cc873c8291a9b38cf915a47a3d90a7160676fba2438a88ec7$nclexmocb2b3$),
($nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$04a449c2e168e3478b557e2a5a082b79c8556f8eb4cae5b461f41b0920705116$nclexmocb2b3$),
($nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$e407ae44e5daf23c16c285989014e7de72c8166a8a298615f04bdea49159e452$nclexmocb2b3$),
($nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$d6674d6e9dc1d4bd2d63861ed857d1b8c2c38b4e34d724b1c335e66bdeb1f662$nclexmocb2b3$),
($nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cfd375308949107f55bf020d2c3864f573a9b08f2d4448bb167afdd7d920a01a$nclexmocb2b3$),
($nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$d375065db5b6f0e2a24e7dd87001f9ce2e1951a47cb096c1121c86b38847c847$nclexmocb2b3$),
($nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$25e6d0e336178dfb2f7da41d5f43c0e65fb546231675f55c6179b5975d3eab3e$nclexmocb2b3$),
($nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$b3ebdea8d8e965a76170b3b2753b3cb9bb7d7817705938e114b84904e0ad9923$nclexmocb2b3$),
($nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$736e2237bf6b60e1f47e33d0c6ed9b57abb02389660f40093aa47f3636b0ea53$nclexmocb2b3$),
($nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ee4c4bfe9c267edc0da5bf44ed36e6a20d2248a3cd2cb5881a27c02ed7fbaec6$nclexmocb2b3$),
($nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$7d3716bc45b3c8e9db3efa4796af79077bdc256b4112cf6355b1e6ee7bf79470$nclexmocb2b3$),
($nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$2e7bb86fb33ca05d6868a13ea912e6dc8d0639c8dee214a3ad7bfd1daa877707$nclexmocb2b3$),
($nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$68997e901e7cf488dc741e9c96001ced080708a86dd7c9fb4540c09d239eeca5$nclexmocb2b3$),
($nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$8d061c7d8e68a669d2bd1d5893a039b4e72494afe5265cc46d3f1b1972c10afc$nclexmocb2b3$),
($nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$17389f09ae28e77abdb2126869f6fe8af3493db14eaec47d6b5af83bfd74bb3d$nclexmocb2b3$),
($nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$877f65dbefe7c3e5323f743c2c1956f8b0540b5c166215c7e659c3cb06035698$nclexmocb2b3$),
($nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$83d0737a908d8428a749e230918393394e4ca549b683fb383d314740366b1df9$nclexmocb2b3$),
($nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$71041c679d971d9ea8455a6fbc8fc8c325013c0948acd27b261b342ffb37c1d0$nclexmocb2b3$),
($nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$e9d4f16d6d590f133bc6fa92e7c080a3e6bd02c0e63e9fe760d74d4da6803fa4$nclexmocb2b3$),
($nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$7f7c58251f4af2663a6f0bea60b1456e40266c11382afb612a6004ca1ec5d4a2$nclexmocb2b3$),
($nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$d22c61df4177beb52f1b3245a1a1e3ba951e7188fb1461d1a31d794dfaec3ba0$nclexmocb2b3$),
($nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$0cfa393d597cd1d02dc057c5f4ee1b8e8f500475dfcbc6b60ca5b32004f941a2$nclexmocb2b3$),
($nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$4afde5852abccb8bb277bc4ecbcbbee864663311d4016811fbf62ef74dbd640d$nclexmocb2b3$),
($nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$53e9c5d4f21a74cc790e08eb45f8ef870d13fd703068175c4138e77ae2a40ec0$nclexmocb2b3$),
($nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$93b55ddbda8da05b14e54abf8a96429ffe12d4b31819c2002e58a18c24a6e0e9$nclexmocb2b3$),
($nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$22347b7efffc1db82e10e82cc5a574718d0dc899a6761de8c7fb041d4dd005e1$nclexmocb2b3$),
($nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$911b4d6fcc53e58d6fc4e088fc70b8d62f8ada6f541f98345898a6a2bd73dd6c$nclexmocb2b3$),
($nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$04584a17492e0dcbee73609c74fffa9dcb35d4a64af6ca6db8270da1047bad3e$nclexmocb2b3$),
($nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$a05fa1226b6f1610a105c3fd81220d51ec0bbf24dd9302c87d6019c5905ae65b$nclexmocb2b3$),
($nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$7c068f910c59db6e64334c95fb2ff28977f0cdc400deef01fdae502f7b6d785f$nclexmocb2b3$),
($nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$f8c0c81059c444fbc357d1c6a719112ed6da71e6b0e205a6687a35a332826e93$nclexmocb2b3$),
($nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$f3d6b6f76094a7460348d88f8e25a680157a831f2590b595ae1da7927bf23fef$nclexmocb2b3$),
($nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$ab376ebfa2fb8e4cd1320af02e2c30b65dbb80aa8b15e6a491afb223fe177012$nclexmocb2b3$),
($nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$b2d04b4ba818d931a5966e5977298b6f9fdcc6e9900d7f1371d3991e2a21838d$nclexmocb2b3$),
($nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$b02844b7d518764d48ddbf09ffab9c73cd55a96c14517d3b18b60802b6e0f50e$nclexmocb2b3$),
($nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$22adb0909c906bd300c967461cdd85c2fbb66c7ca5388d89b58bde73ae3bd6d4$nclexmocb2b3$),
($nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$2ebb3da443915f22d4b78bf8fe26698f7724ca55f951e066495ccf4b29e8bc98$nclexmocb2b3$),
($nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$b8042a254d1ca6b9381c312a98f3c7d20948a9f34aa604010084122dc7f9aa7b$nclexmocb2b3$),
($nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$8d3533021f16c550ceb40e4ecca62f3e408386209bfba4a792dc1d02e065e1d4$nclexmocb2b3$),
($nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$14ad3804923ed2f173e68358a023141d84fc66388aeb52e351a3ab52ea5ba662$nclexmocb2b3$),
($nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$e8cd1156549987dcb3a0f67b1657ffa229b674792b30695e69db7ba472f94049$nclexmocb2b3$),
($nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$c28d1c68b49c4fc8a7df257f088d7435a875f5fa2c1e51f9391d848d486b0411$nclexmocb2b3$),
($nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$b5f627586e652541af93cccb3c4ab4cb855a52a072f3e789fb31a2c881a2cf19$nclexmocb2b3$),
($nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$8ef2bbd5c042f79f1ffc6eb9d2f380e1dbb63056444d5abc07ce70e89e715924$nclexmocb2b3$),
($nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$694524b95d909c581ad5db460630b2ace842d7af69a8c65dc898f5350e10eb98$nclexmocb2b3$),
($nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$db8247de8fd0f12c3d31faedc1db0c663478110030d6b2fd524ca2f364d17ee2$nclexmocb2b3$),
($nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$adc8e5c36e0f93842e14b5d3b3d9490300ae16037a3e934629d49cc03fccde6f$nclexmocb2b3$),
($nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$a54c31c4b4b6962e070e0920119f07100d64b79d3328c52ba1827a387c020ef5$nclexmocb2b3$),
($nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$b493dd6b94e6bdc468d5f171873d1c569a9f793bda48d09da083f88ba12148e5$nclexmocb2b3$),
($nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$3c247c88314976c15b166eaa0202377b4d0827d0814ae8ad61b040f31f18aa0a$nclexmocb2b3$),
($nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$28fa1de8fa3974df4e7fe76d2329b5068259e431ecc12085e724ec3dbe9ee3f2$nclexmocb2b3$),
($nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$918534788542d80050b21cd002471f786cb31a31cff082bab29950a66cf90705$nclexmocb2b3$),
($nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$61d7cc4f098210f9ecd8d3e8539ad304a6c135743c6f9e03fefa4c609b076e39$nclexmocb2b3$),
($nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$1db2d87ce07334a1a2d6304720f2a530bac1ac2f9bf6d17ee10924f9e0108bfc$nclexmocb2b3$),
($nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$d61fca149c5d20a990846b31711742dea1dac5894b948c8b8814bae053a1969d$nclexmocb2b3$),
($nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$862741f7036fae82d9c7ff78dabb095e812ef3756bac97f854f9b56e29928221$nclexmocb2b3$),
($nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$5aabcfad7ae90b3100c98fb8a506e93ad2a8f7a2d3a8df2feb04994adf6025b5$nclexmocb2b3$),
($nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$d4bffade41cead1070804c5e7b77f41554bbd56481ea0b50b2c30e7b358716e5$nclexmocb2b3$),
($nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$a89d76803073bd5ca52c71b7abc7bf2ceab7a5c582fb507d6423cfe21fbe9da6$nclexmocb2b3$),
($nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$d4379429e9a61549ed9c2f1339c87f219f1c50390711ebd748d8b3159f2c90f8$nclexmocb2b3$),
($nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$b682031f6edf6ded2efd916c52d790b91bc01ed5c76977e2b9dfffbb33927329$nclexmocb2b3$),
($nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$e5bf8e6782c5b2fbbf6b0898419bbf0dbb7bf3b596685b92dd5fa7e29504ef0a$nclexmocb2b3$),
($nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$44f8cd64f440dc756558c6aac05cc03487c3715e3ba75ae1a2b700e7afce80e7$nclexmocb2b3$),
($nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$f3a5ae7b4ba098f0308849215c5c145aa376776b16765e75746b20466db08fb5$nclexmocb2b3$),
($nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$2e11f44a714447ba5945455460ab2cf76ca1beb51c3f5ac5996a7ebd7f20958a$nclexmocb2b3$),
($nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$a63015e0fb8b419ecd04a162ec4168a872557e6ea61400fbde16a15defdc6b2b$nclexmocb2b3$),
($nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$, $nclexmocb2b3$02715b44fb5a09282ce23e9c6364f3e43a7dbf7b69bfe0745b9ea1ee4914bc57$nclexmocb2b3$)
) AS v(id, hash) ON v.id = q.id AND v.hash = q."contentHash"
WHERE q.active = true AND q."qaPassed" = true AND q."reviewStatus" = 'approved' )::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'activated rows: expected 140, found %', n;
  END IF;
END
$check$;



DO $check$
DECLARE b moc_b2b3_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_b2b3_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows + 140 THEN
    RAISE EXCEPTION 'forward all_rows % expected %', all_rows, b.all_rows + 140;
  END IF;
  IF active_n <> b.active_n + 140 THEN
    RAISE EXCEPTION 'forward active % expected %', active_n, b.active_n + 140;
  END IF;
  IF served <> b.served + 140 THEN
    RAISE EXCEPTION 'forward served % expected %', served, b.served + 140;
  END IF;
  IF moc_served <> b.moc_served + 140 THEN
    RAISE EXCEPTION 'forward moc_served % expected %', moc_served, b.moc_served + 140;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id IN ($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$) AND active AND "qaPassed" AND "subjectId" = 'management-of-care') <> 140 THEN
    RAISE EXCEPTION 'new rows were not all published into Management of Care';
  END IF;
  INSERT INTO moc_b2b3_dry_log VALUES ('after_insert_activate', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'forward all_rows % -> % (+140)', b.all_rows, all_rows;
  RAISE NOTICE 'forward nursing active % -> % (+140)', b.active_n, active_n;
  RAISE NOTICE 'forward nursing served % -> % (+140)', b.served, served;
  RAISE NOTICE 'forward management-of-care served % -> % (+140)', b.moc_served, moc_served;
END
$check$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_b2b3_activate_20261030') IS NULL THEN
    RAISE EXCEPTION 'activation undo requires qbi_nclex_moc_b2b3_activate_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_activate_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'undo activate backup: expected 140, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = b.active,
    "qaPassed" = b."qaPassed",
    "reviewStatus" = b."reviewStatus",
    "lastReviewedAt" = b."lastReviewedAt",
    "qaAuditedAt" = b."qaAuditedAt",
    "updatedAt" = b."updatedAt"
  FROM qbi_nclex_moc_b2b3_activate_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = true
    AND q."qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 140 THEN
    RAISE EXCEPTION 'undo activation expected 140 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_moc_b2b3_activate_20261030 b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."reviewStatus" IS NOT DISTINCT FROM b."reviewStatus")::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'activation flags restored: expected 140, found %', n;
  END IF;
END
$check$;


DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_b2b3_insert_20261030') IS NULL THEN
    RAISE EXCEPTION 'insert undo requires qbi_nclex_moc_b2b3_insert_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_insert_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'undo insert backup: expected 140, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  DELETE FROM "QuestionBankItem" q
  USING qbi_nclex_moc_b2b3_insert_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false
    AND q."qaPassed" = false
    AND q.active IS NOT DISTINCT FROM b.active
    AND q."qaPassed" IS NOT DISTINCT FROM b."qaPassed";
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 140 THEN
    RAISE EXCEPTION 'undo insert expected to delete 140 held rows, found %. Undo activation first if the rows were published.', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE id IN (SELECT id FROM qbi_nclex_moc_b2b3_insert_20261030))::integer INTO n;
  IF n IS DISTINCT FROM 0 THEN
    RAISE EXCEPTION 'inserted rows removed: expected 0, found %', n;
  END IF;
END
$check$;



DO $check$
DECLARE b moc_b2b3_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_b2b3_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows OR active_n <> b.active_n OR served <> b.served OR moc_served <> b.moc_served THEN
    RAISE EXCEPTION 'undo did not restore baseline all=% active=% served=% moc=%', all_rows, active_n, served, moc_served;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id IN ($nclexmocb2b3$c15a3f1fa8923fdaa50cd2273$nclexmocb2b3$, $nclexmocb2b3$cb8d1fdf422bc95d8034d33c0$nclexmocb2b3$, $nclexmocb2b3$c1bf7020fa6cc50df55ed1011$nclexmocb2b3$, $nclexmocb2b3$c08673072cee1cc9f67daf321$nclexmocb2b3$, $nclexmocb2b3$cb2c90fd3761b7baaf76a95bc$nclexmocb2b3$, $nclexmocb2b3$c5adaf0f2093da453a4b455bf$nclexmocb2b3$, $nclexmocb2b3$c9491c8be96473128a030cf28$nclexmocb2b3$, $nclexmocb2b3$ca65e860f00271ae2e01d4fd9$nclexmocb2b3$, $nclexmocb2b3$cbfef96c3eaf35fdf14a9166d$nclexmocb2b3$, $nclexmocb2b3$c49e63ffe2e084d98b5aaf6cc$nclexmocb2b3$, $nclexmocb2b3$cf97717240136b1088faba45a$nclexmocb2b3$, $nclexmocb2b3$ca5cffeaafdbc664a384f7c81$nclexmocb2b3$, $nclexmocb2b3$cba1d923625555fe5edfc9be2$nclexmocb2b3$, $nclexmocb2b3$c421c8f7c0b37f9fa87dee26f$nclexmocb2b3$, $nclexmocb2b3$c6eb2b7b31984fd5cd5b43193$nclexmocb2b3$, $nclexmocb2b3$ca90429fb455f33927e0b3252$nclexmocb2b3$, $nclexmocb2b3$cf709a58347ddb55f5e03695f$nclexmocb2b3$, $nclexmocb2b3$c83ab27568dbf55731a03e7df$nclexmocb2b3$, $nclexmocb2b3$cde6646ca35da5fcb97410c42$nclexmocb2b3$, $nclexmocb2b3$c655b086d0fd4df1b95890ba7$nclexmocb2b3$, $nclexmocb2b3$c6c56f09f80e8838aad11b0f3$nclexmocb2b3$, $nclexmocb2b3$c5f5e4479c8e39150e7eb65fb$nclexmocb2b3$, $nclexmocb2b3$c5808133e0f2b66ed09b39fe0$nclexmocb2b3$, $nclexmocb2b3$c4b7d7f1df4c09f4f7e5c311e$nclexmocb2b3$, $nclexmocb2b3$c610cf402d34ea7a59c7d5841$nclexmocb2b3$, $nclexmocb2b3$c95cd5ed86257a345908ba45a$nclexmocb2b3$, $nclexmocb2b3$c9e65d845ce4f3edbaea94680$nclexmocb2b3$, $nclexmocb2b3$c2e218702070b580b8b744f82$nclexmocb2b3$, $nclexmocb2b3$c83e43cf9d292bbab31adbb3e$nclexmocb2b3$, $nclexmocb2b3$cfd5dc7ab1931ca355bb4ab15$nclexmocb2b3$, $nclexmocb2b3$cc4d5e8175a29c4fb8f8d094d$nclexmocb2b3$, $nclexmocb2b3$c5abfbb47c865a5e41a0f9cb4$nclexmocb2b3$, $nclexmocb2b3$c5b8472cfc0debc6788a5b6e0$nclexmocb2b3$, $nclexmocb2b3$cbb6b6f3d8fd4538fadcba56b$nclexmocb2b3$, $nclexmocb2b3$cd449c6580cd86e2f9630c476$nclexmocb2b3$, $nclexmocb2b3$c71c4db192ad529da316bd55e$nclexmocb2b3$, $nclexmocb2b3$cc45e6a941c31fe310dc4891f$nclexmocb2b3$, $nclexmocb2b3$c85a18b5cba7eeb100dd63898$nclexmocb2b3$, $nclexmocb2b3$c0c0a4a160d5e424ac64206b9$nclexmocb2b3$, $nclexmocb2b3$c6010da82090380d7998e391d$nclexmocb2b3$, $nclexmocb2b3$cf2814a43ce53b6f77dce9118$nclexmocb2b3$, $nclexmocb2b3$c976ec051f6ae536b49fd76cf$nclexmocb2b3$, $nclexmocb2b3$c1a6de55cd93031b09f66b54a$nclexmocb2b3$, $nclexmocb2b3$c129de1a9a3488cab8001dfe4$nclexmocb2b3$, $nclexmocb2b3$ce2a8d6730fa7a19d297c17a8$nclexmocb2b3$, $nclexmocb2b3$c65b0e5419ff8ca40a1ab2e8d$nclexmocb2b3$, $nclexmocb2b3$c51fae6c9e9ecb88db5da9244$nclexmocb2b3$, $nclexmocb2b3$c4465ed3a5d2f1b54a17e09d9$nclexmocb2b3$, $nclexmocb2b3$cfd977b96c6f6509f49726552$nclexmocb2b3$, $nclexmocb2b3$c5a8f8328a82973cd6528ba5d$nclexmocb2b3$, $nclexmocb2b3$ccbae9c905e3a66090d647723$nclexmocb2b3$, $nclexmocb2b3$c3338f4ce703c94a733ed2e4c$nclexmocb2b3$, $nclexmocb2b3$c30eb7189948bdaa01702df38$nclexmocb2b3$, $nclexmocb2b3$c05dbb42dd92aaac10f4c7e91$nclexmocb2b3$, $nclexmocb2b3$c236052925da8dd2e6490d4cb$nclexmocb2b3$, $nclexmocb2b3$cb498ee7d9e852851778b2d19$nclexmocb2b3$, $nclexmocb2b3$c5d9211f74faef69b80936e75$nclexmocb2b3$, $nclexmocb2b3$c5eb712c4966f7b7de27da8d7$nclexmocb2b3$, $nclexmocb2b3$c737cd1d93b1a8a14bb302c72$nclexmocb2b3$, $nclexmocb2b3$cae466aef8cb01e628f6cae7d$nclexmocb2b3$, $nclexmocb2b3$c2262d66225314f46e600b353$nclexmocb2b3$, $nclexmocb2b3$ca1fb0c93f1b84eef2e03dec7$nclexmocb2b3$, $nclexmocb2b3$cd5b6cc37c07a6defed7bfa5f$nclexmocb2b3$, $nclexmocb2b3$c5b4f5ddf22a3bdc98266dc6e$nclexmocb2b3$, $nclexmocb2b3$ca384bfc75b3d83e47b74e42c$nclexmocb2b3$, $nclexmocb2b3$c038c351aea0ec94f732a7800$nclexmocb2b3$, $nclexmocb2b3$c097ad30cf5f1f8fda379e887$nclexmocb2b3$, $nclexmocb2b3$c77a0b462e42e4c1fdb64e8d3$nclexmocb2b3$, $nclexmocb2b3$c2c83623de5e4055b5ed17ede$nclexmocb2b3$, $nclexmocb2b3$c3cb36101ac46a5bc48696809$nclexmocb2b3$, $nclexmocb2b3$ca12bd1e0fc03d7f1f7096fdd$nclexmocb2b3$, $nclexmocb2b3$c233b067da173876b1d78f305$nclexmocb2b3$, $nclexmocb2b3$ccc8f283aa4a966071584b988$nclexmocb2b3$, $nclexmocb2b3$c74b746ee3f1dcf048af754e4$nclexmocb2b3$, $nclexmocb2b3$c8fdf66c8ffb253e28092dea9$nclexmocb2b3$, $nclexmocb2b3$cd6c0cc1f8a09f493a9ca8e95$nclexmocb2b3$, $nclexmocb2b3$c61094082bd652ea574bb2367$nclexmocb2b3$, $nclexmocb2b3$ced6c7a5357b922039c55dd74$nclexmocb2b3$, $nclexmocb2b3$cbe2b3b4ccb5089748118689a$nclexmocb2b3$, $nclexmocb2b3$c0872e3925b49bce76dad8b60$nclexmocb2b3$, $nclexmocb2b3$c27ece1b0f38214d258422268$nclexmocb2b3$, $nclexmocb2b3$c8bf20e3e165e606281c343cc$nclexmocb2b3$, $nclexmocb2b3$cdb79388e5ff733ad48973e95$nclexmocb2b3$, $nclexmocb2b3$ca4dbb95f53d56eb7c8268ac7$nclexmocb2b3$, $nclexmocb2b3$cd266f554c465151c7e830c8b$nclexmocb2b3$, $nclexmocb2b3$c205f13bdfeb5108cfb0bedde$nclexmocb2b3$, $nclexmocb2b3$c2974f269f26e13bd0293db74$nclexmocb2b3$, $nclexmocb2b3$c5e020fe684b18a40dc7a4f66$nclexmocb2b3$, $nclexmocb2b3$c5719e9d6accdaff11f77b407$nclexmocb2b3$, $nclexmocb2b3$c23e5bb29b283e0f98857c726$nclexmocb2b3$, $nclexmocb2b3$c0a16be96194ddced8d743299$nclexmocb2b3$, $nclexmocb2b3$c15afad069b2aa18cb7a5ad4d$nclexmocb2b3$, $nclexmocb2b3$c9ddd428a14003b49d00f195e$nclexmocb2b3$, $nclexmocb2b3$c5784cbdeda3850afe49173af$nclexmocb2b3$, $nclexmocb2b3$cbc66c53092c666076f0bff6f$nclexmocb2b3$, $nclexmocb2b3$ccfe75a92a6674b721ea8c627$nclexmocb2b3$, $nclexmocb2b3$cf936b32a980c5ab21269811a$nclexmocb2b3$, $nclexmocb2b3$cf53e5751215cfe303236e308$nclexmocb2b3$, $nclexmocb2b3$ca9a4fa7a53ff7bc2f83483da$nclexmocb2b3$, $nclexmocb2b3$c1ddff2cc7f037d13a95abb05$nclexmocb2b3$, $nclexmocb2b3$c4584ba4f8364f5db88d55726$nclexmocb2b3$, $nclexmocb2b3$cd30fe60b9c06821d8bc688e1$nclexmocb2b3$, $nclexmocb2b3$c78ae4a8aa28ddf76f22174e5$nclexmocb2b3$, $nclexmocb2b3$c09ace69bd22dbc98678fa398$nclexmocb2b3$, $nclexmocb2b3$c808893c62399cf5cb3d6e0b7$nclexmocb2b3$, $nclexmocb2b3$cc3d939fb6128c6a7e4be57b0$nclexmocb2b3$, $nclexmocb2b3$c44f7c5a20cddbe3518c5a351$nclexmocb2b3$, $nclexmocb2b3$c6c3b3afc1e4296e5aa8e863e$nclexmocb2b3$, $nclexmocb2b3$ce0eeea39fd4a117857090a81$nclexmocb2b3$, $nclexmocb2b3$ce4fd7bcbb55d85875a600249$nclexmocb2b3$, $nclexmocb2b3$c70541b201603158af3327191$nclexmocb2b3$, $nclexmocb2b3$ca579ebe46e7b03f903079e68$nclexmocb2b3$, $nclexmocb2b3$c1c9b172ae7ee2361061b96de$nclexmocb2b3$, $nclexmocb2b3$c52d5e8d5bbc0fb7ca0fe48bf$nclexmocb2b3$, $nclexmocb2b3$cbfe07eacbc97213037ddace0$nclexmocb2b3$, $nclexmocb2b3$cb35639edaf115a28a411264d$nclexmocb2b3$, $nclexmocb2b3$cbd7a224a79c3be4515460f3a$nclexmocb2b3$, $nclexmocb2b3$ce0f11ab9db8b4b04912440ec$nclexmocb2b3$, $nclexmocb2b3$c7a8eb147760de0363fc2fdb6$nclexmocb2b3$, $nclexmocb2b3$c38e6b88ecddc9153df4cbdf7$nclexmocb2b3$, $nclexmocb2b3$c89e8a2292efb0f568eaffe35$nclexmocb2b3$, $nclexmocb2b3$c366acd357b0c1cfb3434263c$nclexmocb2b3$, $nclexmocb2b3$c50ee12b972a27ca911a3e6ae$nclexmocb2b3$, $nclexmocb2b3$c500eaf32cd70486d947cabd5$nclexmocb2b3$, $nclexmocb2b3$cd6c61b7862a67973b859b71b$nclexmocb2b3$, $nclexmocb2b3$c97ed3ef9df6081978f68beff$nclexmocb2b3$, $nclexmocb2b3$cd6069011a0e77f84752676be$nclexmocb2b3$, $nclexmocb2b3$ca927b1a8cc530408d2061143$nclexmocb2b3$, $nclexmocb2b3$c53943e73cffb22e53e005e03$nclexmocb2b3$, $nclexmocb2b3$cb0867d2004f7720b397b7eee$nclexmocb2b3$, $nclexmocb2b3$cd550c9c02b2757f44ef35434$nclexmocb2b3$, $nclexmocb2b3$c346de6c09f752ef74caa8bdf$nclexmocb2b3$, $nclexmocb2b3$c0f8b74fbb3b56cba59a8106b$nclexmocb2b3$, $nclexmocb2b3$cb926fa5130f60ea7fca02a80$nclexmocb2b3$, $nclexmocb2b3$c05f1968b2c20e4c99375966c$nclexmocb2b3$, $nclexmocb2b3$c2c9f89bd0160bb83a0c336ec$nclexmocb2b3$, $nclexmocb2b3$c35c917afa20a6f7141a242e7$nclexmocb2b3$, $nclexmocb2b3$cfc86105ed1af707b7e2ff22b$nclexmocb2b3$, $nclexmocb2b3$c2bcf94c8917052ec6dd6380f$nclexmocb2b3$, $nclexmocb2b3$c99ffbd88dddca442ab2d5e1f$nclexmocb2b3$)) <> 0 THEN
    RAISE EXCEPTION 'undo left inserted rows behind';
  END IF;
  INSERT INTO moc_b2b3_dry_log VALUES ('after_undo', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'undo restored all_rows % active % served % moc_served %', all_rows, active_n, served, moc_served;
END
$check$;

SELECT step, all_rows, active_n, served, moc_served FROM moc_b2b3_dry_log ORDER BY step;

ROLLBACK;
