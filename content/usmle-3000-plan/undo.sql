-- Deletes only the 60 hidden USMLE pilot rows inserted 2026-11-09.
-- Snapshot before insert: snap-fancy-waterfall-apy74xch (usmle-pilot-60-20261109-before).
-- Backup table: qbi_usmle_pilot_60_20261109.
-- Does not touch any other row. Aborts unless exactly these 60 inactive pilot rows are deleted.
DO $$
DECLARE
  n int;
BEGIN
  DELETE FROM "QuestionBankItem" AS q
  WHERE q.id IN (
  'plt8bfee250cc279a2ff03d4c36',
  'plt4936320225df90adfb17d854',
  'pltcada43759e7182b393ad3e71',
  'plt0dd804bb9b598275073184c3',
  'plt6a725f4971cc49fef69632f4',
  'pltef928c8d9e37890ae7de520c',
  'plt84c1ae8e0d45620c87c9e485',
  'plte7356407098d52081422029e',
  'pltb7e7af7d5d3555840b05c001',
  'plt04130c937530ee328669d0d5',
  'pltd873d02ee423f09dff39b73c',
  'plt2f1726a89827460d3369b8df',
  'pltcefaf6d20609b816876f0047',
  'plt1e804f067408d36d53fa972e',
  'pltbd463fab024e9b45d4027c5b',
  'plt42c6a70e547817cb6ebab5c1',
  'pltb363997117852cf14d978632',
  'plt9af6279bc0cf6a75dbc13b57',
  'plt701d6253cf336270527c2a59',
  'plt7c2eda157601e6af81e21001',
  'plt0d4d2578cee26e4ce32cba0c',
  'pltc4af47e2e14750a24c0d1231',
  'plt37c40186cb6a53c7ed7850ab',
  'plte1300ea15e1e374ce8535206',
  'plt47983e4160bce439ee11195e',
  'pltb13b57d7d46e0bdb8219859d',
  'plt5b6078b5be3be365089fcb7c',
  'plt3a34901c3fa7958af7ab8a3a',
  'plt2025341f1068690b86ec61e0',
  'plt78394427e933d397b47db939',
  'plt0d6bdf884338233b29471ac5',
  'plt55513a1f1d563003dc30a7a3',
  'pltedec2825a40f7e8351655fa8',
  'pltf832b9904c6bb1653c587db9',
  'plt159320ca829ea4bfeaad1544',
  'plt63764db55d1b74bdcba74067',
  'pltc05d1e65c28f3afc7b1d108c',
  'plt407fb3c9618d0ae71d017ab3',
  'plt56461082fe8262c3bc44a246',
  'plt7bc873d3ca3e4231331f33b5',
  'plt273c2a5bc2453fb6b465abba',
  'plt6599dcd5d83e0354b3d084f6',
  'pltb63b7cd7a7940b98bc6d0554',
  'plt2180ae60d4965122edc693ae',
  'plt4b12d7514453bcd71bdc4878',
  'pltaa4572f3bf1ae2e3bd9b1462',
  'pltbab0c590fd0f04d9a014cada',
  'plte81bf20a2a014e479d8f317e',
  'pltbe8ad7f20cd7deb88b5a335d',
  'plt46188a7cf2568bf962d95435',
  'plt1d5950bc7c4a2fb5567ee321',
  'plt58222364066ec5d928117ceb',
  'plte4579f779ffaead7d85e7178',
  'plt9098dfafa84653340a9e9621',
  'plteb18fdde074f2b73985839df',
  'plt95b161ec04799c07f06b2914',
  'plt494022a65ebc2bedb7ad104d',
  'plt25e88fcdc3afcba6d64ce725',
  'pltc1236551969cbe316b5748b7',
  'plt0c588d326a24738679fa91cc'
  )
    AND q.id IN (SELECT id FROM qbi_usmle_pilot_60_20261109)
    AND q.source = 'pilot-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'expected to delete 60 pilot rows, deleted %', n;
  END IF;
END $$;
