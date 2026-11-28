-- Backup of QuestionBankItem rows before batch s12b8. Does not change those rows.
-- Run after the staging script and before apply.
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b8_20261121_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'b1x06101e0ce1570acf868bcd5e',
    'b1x07c62fcf95f394f71c13039b',
    'b1x14b713baf2f9ef06f32888fe',
    'b1x246f966a1dceeb2018143071',
    'b1x35aab21c4bc54d56f71e721e',
    'b1x396959c176153b243af9d811',
    'b1x64c7cf3f4aa196a1a92a3a34',
    'b1x72d38f6cb7219d1471b0b09d',
    'b1x8c2cf39f7696f99669f2e655',
    'b1xc427577baf9659c8c06338b4',
    'b1xc4b7b28e8bbdeb067b7d2337',
    'b1xe07614259ccd673347ee8a2d',
    'b2x9ee8601a8b40de567c151f58',
    'b2xfac7f633eb0a4a9b69340dba',
    'b3x4bf15da543292da42c3139fb',
    'cmqd1ltbs000u1ychpu36r9j5',
    'cmr4n514b00ct1y1eyhogfjf8',
    'cmr86y7ev007k1yw241c3htoc',
    'cmr8bg1z001051yw2fukca24d',
    'cmr8clr9i019n1yw2wepywpxy',
    'cmr8ei4iz00aj1yaz91gimrei',
    'cmrpvuxqg000p1yh5p4nn10ut',
    'cmrpw186a002p1yh5k5zg6k06',
    'cmrpw58z2002y1yrttytl0ide',
    'cmrrtm7p200501y8w8qho33f5',
    'cmrrutd6w00jl1y8wwkt1y4nu',
    'cmrrutgtt00ju1y8wxa8wrai6',
    'cmrrutkbu00k31y8wpth4k8l0',
    'cmrruxv4100mb1y8wo5mccta3',
    'cmrruxvn900mi1y8wzhu90c9r',
    'cmrsew9yc000d1y55tdgjsrab',
    'cmrsewanj000m1y553d9f08ne',
    'cmrsf3gpd00281y55r4mp2enj',
    'cmrsf3hzs002l1y55lx4on2dp',
    'cmrtqq4zd00111yx3ybsuo7m5',
    'cmrvm5uke0006jw04eu76rofb',
    'plt701d6253cf336270527c2a59',
    'b3x14a8107c3ff7075ee0aeeebe',
    'b3x5963e3840ab948ff30013bf1',
    'cmqiy342w000r1yugw5a64deq',
    'cmr4gwiyu00111ydexb0m8u2p',
    'cmr4gwklt001h1ydepakom5ou',
    'cmr4gwkws001k1ydeusx8ej4h',
    'cmr4hzxg500b31yde12z72gay',
    'cmr4iy8am00h31ydes6awio9r',
    'cmr4kiljq00sq1ydemv2qxvzy',
    'cmr86y949009n1yr9mop9q0pw',
    'cmr87iz9600gc1yr9wg40mwln',
    'cmr87j0uo00gr1yr9rcbvov3n',
    'cmr88ieuh00qr1yr9cjt8a0ms',
    'cmr89lusm01021yr9dgmlypgf',
    'cmr89lw80010j1yr917tv1w5l',
    'cmrpw0ogk004n1yluqg71zlke',
    'cmrpw5xsg006x1ylu0k495vi9',
    'cmrpwg5tv00bn1ylufciix8h5',
    'cmrrvrqp100961yl8s9wmmglj',
    'cmrsfgnam00531ynylrn693fp',
    'cmrtq0syd000x1yqcxuaxeuwp',
    'cmtpx024h00871y6huwj3dg1x'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_backup) <> 59 THEN
    RAISE EXCEPTION 'backup row count %, expected 59', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_backup);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_refs_s12b8_20261121_backup
    WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')
  ) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
COMMIT;
