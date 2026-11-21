-- Creates only the backup table for batch 2 (Step 2 and Step 3).
-- The apply script also creates this table inside its transaction.
-- Use this file when you want the backup snapshot without updating questions.
BEGIN;
DO $guard$
BEGIN
  IF to_regclass('public.qbi_usmle_optlen_20261121_b2_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_optlen_20261121_b2_backup already exists';
  END IF;
END
$guard$;
CREATE TABLE qbi_usmle_optlen_20261121_b2_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
  $bko23945d493$3945d493-479d-48ed-9a92-6db3f6fc4b32$bko23945d493$,
  $bko23e3863f6$3e3863f6-928f-4d04-89f1-edbfa672ead0$bko23e3863f6$,
  $bko2459ef180$459ef180-c381-4af1-b7fc-650d04529291$bko2459ef180$,
  $bko258d4cbcb$58d4cbcb-2599-43b8-97d7-6b67e5fe252b$bko258d4cbcb$,
  $bko268705928$68705928-18b1-45db-8f75-88b2c91eaccf$bko268705928$,
  $bko28b7da117$8b7da117-9732-4f1d-b0fa-211840d2f871$bko28b7da117$,
  $bko2a0ebcb7f$a0ebcb7f-75e4-4d8a-a957-abccc112a932$bko2a0ebcb7f$,
  $bko2b10x812e$b10x812eba9787236b08fd74e213$bko2b10x812e$,
  $bko2b10xdcc3$b10xdcc323b352ece439bf9f8d1f$bko2b10xdcc3$,
  $bko2b7x55535$b7x5553587c70d9532f5826da44$bko2b7x55535$,
  $bko2b7x5a54e$b7x5a54e4754e66de4049cae722$bko2b7x5a54e$,
  $bko2b7xcfbe1$b7xcfbe1dbc680407dc91444698$bko2b7xcfbe1$,
  $bko2b8x205af$b8x205afe3b147f348c03cde9b0$bko2b8x205af$,
  $bko2b8x7b03a$b8x7b03a47fe101c0953d74ccdb$bko2b8x7b03a$,
  $bko2b8xb1695$b8xb1695d0f4c858e03afaf507d$bko2b8xb1695$,
  $bko2b8xb1987$b8xb1987408b9c5c744ff91889e$bko2b8xb1987$,
  $bko2b8xb5de5$b8xb5de566d86f4268d064c22e7$bko2b8xb5de5$,
  $bko2b8xe612c$b8xe612c1fd50e8bbec64753ff2$bko2b8xe612c$,
  $bko2cmpnjgx1$cmpnjgx1b001t1ymxdcrs99j7$bko2cmpnjgx1$,
  $bko2cmpnjhav$cmpnjhav700211ymxhu3gprmr$bko2cmpnjhav$,
  $bko2cmpnjhb2$cmpnjhb2900221ymxlz4v3t94$bko2cmpnjhb2$,
  $bko2cmpnjjlx$cmpnjjlxf0awe1ymxp2alr335$bko2cmpnjjlx$,
  $bko2cmpnjjlx$cmpnjjlxf0awj1ymxqx4p6knk$bko2cmpnjjlx$,
  $bko2cmqiy35g$cmqiy35gn000u1yugv3j579ri$bko2cmqiy35g$,
  $bko2cmqvw643$cmqvw643d00d2ju04yoxj3men$bko2cmqvw643$,
  $bko2cmr87slw$cmr87slw000k61yr9gfb0d3p5$bko2cmr87slw$,
  $bko2cmr891c0$cmr891c0900xg1yr9rftwycdk$bko2cmr891c0$,
  $bko2cmrrvrs4$cmrrvrs4c009o1yl88swzb7zp$bko2cmrrvrs4$,
  $bko2db380a15$db380a15-5831-431f-90fb-ba207a4dbf64$bko2db380a15$,
  $bko205d41302$05d41302-d7a1-4401-9f54-566fd02884c8$bko205d41302$,
  $bko2119f9e59$119f9e59-5807-4953-9ff0-e4082b48a80a$bko2119f9e59$,
  $bko21ccdf247$1ccdf247-4621-4a03-8bff-5f3e6212f55c$bko21ccdf247$,
  $bko22631a2e1$2631a2e1-a0da-422e-befb-b746d4bb75b3$bko22631a2e1$,
  $bko24dd34b8f$4dd34b8f-2b82-4796-be63-bee4bf49d988$bko24dd34b8f$,
  $bko24f7e30b9$4f7e30b9-1a8a-45c8-bf94-7141a5c15960$bko24f7e30b9$,
  $bko2594198c6$594198c6-e5de-4918-811c-1872bde294bb$bko2594198c6$,
  $bko25e4308ad$5e4308ad-368b-4622-8505-86eb94e68afa$bko25e4308ad$,
  $bko270c4dd4c$70c4dd4c-81bd-4600-872f-136129131122$bko270c4dd4c$,
  $bko2a79db614$a79db614-f061-4de6-9068-10c83bb6fcb0$bko2a79db614$,
  $bko2aed73106$aed73106-13aa-49d4-a00a-121cff8e8057$bko2aed73106$,
  $bko2cbe57fa6$cbe57fa6-9d83-499e-898c-cef23ac8e2eb$bko2cbe57fa6$,
  $bko2cc41e7c7$cc41e7c7-b5b4-4d5e-996a-720e1f9828a6$bko2cc41e7c7$,
  $bko2cmq33a0f$cmq33a0fk006p1yiudpaxp96g$bko2cmq33a0f$,
  $bko2cmqasnpt$cmqasnptt001t1ycy3gi05t2s$bko2cmqasnpt$,
  $bko2cmr31djy$cmr31djye00aljs04bxy0r40b$bko2cmr31djy$,
  $bko2cmr4bny3$cmr4bny3k00b61ykyudwqivun$bko2cmr4bny3$,
  $bko2cmr4ftej$cmr4ftejd01yt1ykyt4klux7p$bko2cmr4ftej$,
  $bko2cmr4g0up$cmr4g0up9022a1ykyb19agdh7$bko2cmr4g0up$,
  $bko2cmr8br7p$cmr8br7pc00b41ylof91njnqa$bko2cmr8br7p$,
  $bko2cmr8e5vk$cmr8e5vko016m1ylofmq6eiaf$bko2cmr8e5vk$,
  $bko2cmr8e5wa$cmr8e5wat016v1ylosf5q1qfo$bko2cmr8e5wa$,
  $bko2cmr8e5wd$cmr8e5wdr016w1yloi18qya32$bko2cmr8e5wd$,
  $bko2cmr8g794$cmr8g794001q51ylokr7o2c50$bko2cmr8g794$,
  $bko2cmr8hrv2$cmr8hrv2l024n1yloznxxd1wn$bko2cmr8hrv2$,
  $bko2cmr8ie5j$cmr8ie5jt029v1yloaiph46j7$bko2cmr8ie5j$,
  $bko2cmr8ie84$cmr8ie84s02al1ylolxh8hfon$bko2cmr8ie84$,
  $bko2cmr8mlt4$cmr8mlt4p00mr1ygie3vkinga$bko2cmr8mlt4$,
  $bko2cmr8mltl$cmr8mltld00mx1ygigxhk7mmt$bko2cmr8mltl$,
  $bko2cmr8quyg$cmr8quyg501pv1ygil5gqi87p$bko2cmr8quyg$,
  $bko2cmr8qv0q$cmr8qv0qv01qo1ygi5ig67gks$bko2cmr8qv0q$,
  $bko2cmr98602$cmr98602p00de1ywyyk62gz1l$bko2cmr98602$,
  $bko2cmr996io$cmr996io400qu1ywyub9s2kn0$bko2cmr996io$,
  $bko2cmr99ij4$cmr99ij4a00ui1ywyo96w27zq$bko2cmr99ij4$,
  $bko2cmr9b2cx$cmr9b2cxo01a91ywy6hrnwllf$bko2cmr9b2cx$,
  $bko2cmr9b2fs$cmr9b2fsa01b81ywy1pdhfm45$bko2cmr9b2fs$,
  $bko2cmru32ne$cmru32ne4004k1y7w5aklg504$bko2cmru32ne$,
  $bko2cmru3n5e$cmru3n5em00dx1y7w7x8reyny$bko2cmru3n5e$,
  $bko2cmru6qyt$cmru6qytb002ll104s58x9sjt$bko2cmru6qyt$,
  $bko2cmru96kg$cmru96kg300361y0sxybovjci$bko2cmru96kg$,
  $bko2cmru96ko$cmru96koy00381y0szeypjpp5$bko2cmru96ko$,
  $bko2cmrvm5z3$cmrvm5z3h001kjw04iwhbev9b$bko2cmrvm5z3$,
  $bko2cmrvm5zj$cmrvm5zj2001zjw04a0b6t5zo$bko2cmrvm5zj$,
  $bko2cmrx1ltu$cmrx1ltuq0014l705e32qeuxo$bko2cmrx1ltu$,
  $bko2cmrx1luh$cmrx1luhf001ol7057gkr09tb$bko2cmrx1luh$,
  $bko2cmryh2h4$cmryh2h4v000el40443gu17n5$bko2cmryh2h4$,
  $bko2cmtpx6e8$cmtpx6e87000w1ymuyqwdwquv$bko2cmtpx6e8$,
  $bko2cmwfxt05$cmwfxt05o0000lj08rhtqqg47$bko2cmwfxt05$,
  $bko2cmwfxt08$cmwfxt0880001lj08rtvdwbsj$bko2cmwfxt08$,
  $bko2fbc40daf$fbc40daf-8e04-4aa1-8919-4bb6ffa1ac30$bko2fbc40daf$
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b2_backup) <> 79 THEN
    RAISE EXCEPTION 'backup row count %, expected 79', (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b2_backup);
  END IF;
END
$check$;
COMMIT;
