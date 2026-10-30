-- 03-activate-after-rn-review.sql
-- NCLEX Management of Care pilot v6, built 2026-10-30. Prepared only. Not RN-reviewed.
-- This file COMMITs when nclex.moc_v6_apply is set to 1.
-- Do not set that until a licensed RN has reviewed the package.
-- Target table: "QuestionBankItem". Field: nursing.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: qbi_nclex_moc_v6_insert_20261030, qbi_nclex_item5_v6_rewrite_20261030, qbi_nclex_item5_ibu_hide_20261030, qbi_nclex_moc_v6_activate_20261030.

BEGIN;
DO $guard$
BEGIN
  IF current_setting('nclex.moc_v6_apply', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION '03-activate-after-rn-review.sql: refusing to apply. Held until RN review. After that review, SET nclex.moc_v6_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_activate_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_moc_v6_activate_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Snapshot the held pilot flags before publishing them.
CREATE TABLE qbi_nclex_moc_v6_activate_20261030 AS
SELECT id, active, "qaPassed", "reviewStatus", "lastReviewedAt", "qaAuditedAt", "updatedAt", "contentHash"
FROM "QuestionBankItem"
WHERE id IN ($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$);
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_activate_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activate backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_activate_20261030 b
JOIN (VALUES
($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$),
($nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$),
($nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$),
($nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$),
($nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$),
($nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$),
($nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$),
($nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$),
($nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$),
($nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$),
($nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$),
($nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$),
($nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$),
($nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$),
($nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$),
($nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$),
($nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$),
($nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$),
($nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$),
($nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$),
($nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$),
($nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$),
($nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$),
($nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$),
($nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$),
($nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$),
($nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$),
($nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$),
($nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$),
($nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$),
($nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$),
($nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$),
($nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$),
($nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$),
($nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$),
($nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$),
($nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$),
($nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$),
($nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$),
($nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$),
($nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$),
($nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$),
($nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$),
($nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$),
($nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$),
($nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$),
($nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$),
($nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$),
($nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$),
($nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$),
($nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$),
($nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$),
($nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$),
($nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$),
($nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$),
($nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$),
($nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$),
($nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$),
($nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$),
($nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$)
) AS v(id, hash) ON v.id = b.id AND v.hash = b."contentHash"
WHERE b.active = false AND b."qaPassed" = false)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activate pre-image: expected 60, found %', n;
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
($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$),
($nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$),
($nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$),
($nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$),
($nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$),
($nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$),
($nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$),
($nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$),
($nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$),
($nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$),
($nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$),
($nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$),
($nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$),
($nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$),
($nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$),
($nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$),
($nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$),
($nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$),
($nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$),
($nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$),
($nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$),
($nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$),
($nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$),
($nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$),
($nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$),
($nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$),
($nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$),
($nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$),
($nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$),
($nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$),
($nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$),
($nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$),
($nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$),
($nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$),
($nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$),
($nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$),
($nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$),
($nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$),
($nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$),
($nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$),
($nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$),
($nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$),
($nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$),
($nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$),
($nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$),
($nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$),
($nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$),
($nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$),
($nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$),
($nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$),
($nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$),
($nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$),
($nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$),
($nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$),
($nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$),
($nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$),
($nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$),
($nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$),
($nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$),
($nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$)
  ) AS v(id, hash)
  WHERE q.id = v.id
    AND q."contentHash" = v.hash
    AND q.active = false
    AND q."qaPassed" = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'activation expected 60 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN (VALUES
($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$),
($nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$),
($nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$),
($nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$),
($nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$),
($nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$),
($nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$),
($nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$),
($nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$),
($nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$),
($nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$),
($nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$),
($nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$),
($nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$),
($nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$),
($nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$),
($nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$),
($nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$),
($nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$),
($nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$),
($nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$),
($nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$),
($nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$),
($nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$),
($nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$),
($nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$),
($nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$),
($nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$),
($nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$),
($nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$),
($nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$),
($nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$),
($nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$),
($nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$),
($nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$),
($nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$),
($nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$),
($nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$),
($nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$),
($nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$),
($nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$),
($nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$),
($nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$),
($nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$),
($nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$),
($nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$),
($nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$),
($nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$),
($nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$),
($nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$),
($nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$),
($nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$),
($nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$),
($nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$),
($nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$),
($nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$),
($nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$),
($nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$),
($nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$),
($nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$)
) AS v(id, hash) ON v.id = q.id AND v.hash = q."contentHash"
WHERE q.active = true AND q."qaPassed" = true AND q."reviewStatus" = 'approved' )::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activated pilot rows: expected 60, found %', n;
  END IF;
END
$check$;


COMMIT;
