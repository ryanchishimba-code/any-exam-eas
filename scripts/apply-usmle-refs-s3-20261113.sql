-- Add checked citations to served USMLE Step 3 items that had no real source, 2026-11-13.
-- Pool: fieldId usmle-step-3, active, qaPassed, and no http URL in references
-- (null, outline-only, named without a URL, or a weak label).
-- Structural student-eligibility defects do not remove these item types, and none of
-- these ids are on the reviewed key-wrong list.
-- Backup qbi_usmle_refs_s3_20261113_backup (521 rows) is created first.
-- Only the references column is updated. Keys are not changed.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3_20261113_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmqxdzxuj00cu1ymac7dbjyo0',
    'cmqxdzzao00dc1ymaeooxkj10',
    'cmqxe000100dl1ymatqbtuqgg',
    'cmqxeg7op00ge1ymazsd2g2nb',
    'cmqxeg8fy00gm1yma2ltpu4nn',
    'cmqxeg9br00gv1ymafl03yq85',
    'cmqxf0mad000p1yf179qu0eny',
    'cmqxf0mg1000r1yf1d9g1v6p9',
    'cmqxf0n03000y1yf1w4x4rgdl',
    'cmr31djye00aljs04bxy0r40b',
    'cmr4b33g700181ykyq4lu9s8h',
    'cmr4badt0003t1yky1yn3dufu',
    'cmr4bag1j004g1yky9vfhrlsk',
    'cmr4bghie00751yky9c08ytxt',
    'cmr4bgiuz007f1yky30vra2gx',
    'cmr4bgmaz00891ykygxo3ayh1',
    'cmr4bgmg9008a1ykyw7khq6t9',
    'cmr4bnwi500am1yky1tkk1cvy',
    'cmr4bnx2o00at1yky5vtifyje',
    'cmr4bny3k00b61ykyudwqivun',
    'cmr4bvdua00e11ykyzl8v9ljb',
    'cmr4bvff300ek1ykyi32m3lif',
    'cmr4c4qk100gs1yky0eubl13s',
    'cmr4c4qno00gt1yky06zj3bfo',
    'cmr4c4uqx00hw1yky6ttc21ps',
    'cmr4cbw6800ks1yky3bq8y4vp',
    'cmr4cbwlr00kx1ykyl04a2m54',
    'cmr4cbyq900lm1ykydg5r5xxp',
    'cmr4cnruz00no1yky1bywfhdr',
    'cmr4cnsrp00nx1ykynuw49d4k',
    'cmr4cnsve00ny1ykyqsse91no',
    'cmr4cntw400o81ykyvueugvzj',
    'cmr4cnw2j00ot1ykye7qxr35z',
    'cmr4cvb8500qx1ykyhfh99yy4',
    'cmr4cvcat00ra1yky1chw5k16',
    'cmr4d3x8b00vo1yky5g79sruo',
    'cmr4dbbfb00xp1ykyws4k9isf',
    'cmr4dbfsg00yt1yky3spj4ld3',
    'cmr4dj8cv01101ykyf349ryxf',
    'cmr4dj8su01141ykya3bw13qa',
    'cmr4dj90j01161ykyfj3umff7',
    'cmr4dja0m011c1ykyntqmcah7',
    'cmr4djd18011y1yky50ucelfj',
    'cmr4dqqo701481ykyq86cgyc8',
    'cmr4dqu6w015d1ykyu8r2gi93',
    'cmr4dz7yt01851yky7jtgp7cs',
    'cmr4dza98018y1ykybocd7x5i',
    'cmr4e6i4x01b41ykygru431zd',
    'cmr4e6n5c01c21ykyi1jqywf7',
    'cmr4e6pq701cg1yky7cjb6fr6',
    'cmr4eeil301eg1ykyfjjai9zp',
    'cmr4eejh501ep1ykylvorm0dd',
    'cmr4enlme01j41ykyfw45lya7',
    'cmr4extj101ln1ykytu5m7wsm',
    'cmr4f6ciy01pi1ykyiu9smevk',
    'cmr4f6dh701pu1yky397pr5qx',
    'cmr4f6djy01pv1ykybi0bgbqr',
    'cmr4fdhyo01rx1ykyzteo36kn',
    'cmr4fdkd501sb1ykygyc5ef20',
    'cmr4fdmwl01su1ykyoe0fgbip',
    'cmr4fdo1p01t61ykyuijifua3',
    'cmr4fdo8x01t81ykysvbd8n6s',
    'cmr4ftdo401yi1yky60mhhtwe',
    'cmr4gbuge025r1yky88t5idnh',
    'cmr4gbydu025z1ykygiz4hp7s',
    'cmr4gbz3q02611ykywdwmghn1',
    'cmr4gc2fw02671ykyimogasw6',
    'cmr4gc38402691yky62bukqiz',
    'cmr4gc43j026b1ykyv5fk17fo',
    'cmr4gkdt1029s1ykykwpicuko',
    'cmr8atvjr000p1ylo5uaesui7',
    'cmr8atxtf001b1ylovzbfsjzs',
    'cmr8bagz5003q1ylojv1mmtd7',
    'cmr8bailn00461ylox557svrf',
    'cmr8bhfm6006k1ylokymolxny',
    'cmr8bhfwn006n1ylo38bjmvcb',
    'cmr8bhg7c006q1yloybgbzjch',
    'cmr8bhgl8006u1ylomwgustk4',
    'cmr8bhgvr006x1ylo4uz9udgc',
    'cmr8bhitg007h1ylozowyfkc9',
    'cmr8bhjlu007p1ylokg2kb3ty',
    'cmr8bhkas007w1ylonko35q6w',
    'cmr8bhkox00801ylopw4qbcqs',
    'cmr8bhksf00811ylongaufq2l',
    'cmr8br4p700a31yloriym4qxc',
    'cmr8br7jh00b21ylo21rrr0qs',
    'cmr8bxw8v00d81yloyibr06d3',
    'cmr8bxz5900e11ylofsgzvegt',
    'cmr8by04u00eb1ylop82go23q',
    'cmr8by08m00ec1yloca35yzdm',
    'cmr8by0c500ed1yloj6pia4mi',
    'cmr8by10z00ek1ylo4yt8dgj6',
    'cmr8by14j00el1ylowz8x136u',
    'cmr8c3kgu00gk1ylocue28l2c',
    'cmr8c3ltb00gx1ylotk7ngjzb',
    'cmr8c3nea00hd1ylozle231ks',
    'cmr8c3nqa00hg1ylopgbt07of',
    'cmr8c3o4f00hk1yloc3ciobun',
    'cmr8cce8i00jz1ylo3mnii13u',
    'cmr8ccetk00k61yloizxpf4jl',
    'cmr8ccewq00k71yloikqlm20c',
    'cmr8ccfcj00kc1ylo5bcs86wm',
    'cmr8ccfr300kh1ylom44l27hv',
    'cmr8ccftw00ki1ylo31xwvzga',
    'cmr8ccgmp00km1ylobxi8dlk1',
    'cmr8cchg000kp1ylo8x15va6c',
    'cmr8cchzk00kr1ylofz2qs0vq',
    'cmr8cci9a00ks1yloyp4e3imn',
    'cmr8ccioj00kw1ylo6ojzk4q1',
    'cmr8ccixe00kz1yloxnqww4cx',
    'cmr8ccjhw00l61ylo521p1uaf',
    'cmr8ccjnr00l81ylokomwrvt0',
    'cmr8ccjwn00lb1ylobuaexxk9',
    'cmr8cnbpz00oa1ylo2sp14emz',
    'cmr8d1uqh00qc1ylom1b019zq',
    'cmr8d1wq100qv1ylo89kmc501',
    'cmr8d1x4i00qz1ylovs3hqxxn',
    'cmr8d1xj900r31ylor4s9neez',
    'cmr8d1y5l00r91ylobfvnd1yu',
    'cmr8d1yrp00rf1ylom4abnae1',
    'cmr8d1z5g00ri1ylo3sh575uo',
    'cmr8d1zkb00rm1yloueqksxdo',
    'cmr8d1zz500rq1ylo9i3px56o',
    'cmr8db79500tn1ylor2xe50mx',
    'cmr8db7ob00tr1ylo1r9i9g96',
    'cmr8db8z400u41ylojnfal26c',
    'cmr8db92r00u51ylo4uqewl8g',
    'cmr8dig3100x31ylo1weeow40',
    'cmr8dignn00xa1yloocpo4kb7',
    'cmr8dihxk00xp1ylo9pelkzf3',
    'cmr8diifb00xv1yloqpy6ux6h',
    'cmr8diira00xz1ylo132h88u6',
    'cmr8dq94h01031yloj0hslvas',
    'cmr8dqbf3010o1yloly66gtrk',
    'cmr8dqbin010p1ylo125rj389',
    'cmr8dqcb9010x1ylo3twki8c5',
    'cmr8dqceu010y1ylo8rt7w4aa',
    'cmr8dqcx001131ylo0h8j3f1o',
    'cmr8dqd9j01161ylop3we43g8',
    'cmr8dqdgv01181ylo4o5fp472',
    'cmr8dqdkh01191ylonsextjvo',
    'cmr8dqeku011i1ylom13hqlhc',
    'cmr8dqeog011j1ylorapbl1th',
    'cmr8e5vz6016r1ylo1yzdvwr2',
    'cmr8e5wm9016z1ylomlk2yqs8',
    'cmr8e5wx801731ylo1buo22j6',
    'cmr8e5x5r01761yloafzlsu6j',
    'cmr8e5y9o017k1ylog5cpqpf1',
    'cmr8e5yld017o1ylooyucj291',
    'cmr8e5z9d017w1ylojykfr99e',
    'cmr8e5zwl01841ylocz3xdb4a',
    'cmr8ei15p01ax1yloctvoup4x',
    'cmr8ei2tz01bh1yloi3l1j3x1',
    'cmr8eslrp01d71ylou1j3alnz',
    'cmr8esmel01de1ylop838wgow',
    'cmr8esmkn01dg1ylom7meymef',
    'cmr8esn8w01do1yloikv83hhh',
    'cmr8esoca01e11yloz7ehvs1m',
    'cmr8esq4001em1yloveed3mxd',
    'cmr8f2knb01gq1ylo8i0vz1hi',
    'cmr8f2mc001hb1ylom40kl3z4',
    'cmr8f2o4l01hx1ylo9ioykmdq',
    'cmr8f2oiv01i21ylo2qbl9azw',
    'cmr8fhfnt01k61ylo88e9cvew',
    'cmr8fhi6901kv1ylozcqel65e',
    'cmr8fhikm01kz1ylo0gp55vei',
    'cmr8fhivf01l21ylojwff0190',
    'cmr8fz6y001n01yloxbq64g7w',
    'cmr8fz7in01n71ylodq8glaol',
    'cmr8fz8bn01nh1yloqqntessa',
    'cmr8fz8hj01nj1ylomnu1nqic',
    'cmr8fz8tc01nn1yloaaiviksx',
    'cmr8fz9pb01ny1ylozq6irsk6',
    'cmr8g799t01q71ylo229gsgc6',
    'cmr8g79is01qa1ylor6kl7gu8',
    'cmr8g7a9u01qj1ylogojtt94g',
    'cmr8g7aco01qk1ylonz02s6wq',
    'cmr8g7aoa01qo1ylo908sjdeb',
    'cmr8g7ard01qp1ylom2o6a8r4',
    'cmr8gr75v01u91ylog5u91ab2',
    'cmr8h1hl201xv1ylohuqal6jb',
    'cmr8hgei802011yloubidk1ir',
    'cmr8hgep202031ylovpap2bv8',
    'cmr8hgeso02041ylomwa2ksuw',
    'cmr8hgfh8020b1ylosw8iidze',
    'cmr8hgfrq020e1yloxf5flztv',
    'cmr8hggu8020p1ylo2qypb4h3',
    'cmr8hgjg302181ylor4piufzp',
    'cmr8hrr9o023c1ylori4fu3st',
    'cmr8hrrl1023g1ylodd9v80i5',
    'cmr8hrrra023i1ylo9084qhn5',
    'cmr8hrsvt023w1ylo0jhechrn',
    'cmr8hrt9t02411ylohbqfuwjo',
    'cmr8hrto302461ylog7znjp5e',
    'cmr8hru9c024d1ylofzx7zohd',
    'cmr8hruck024e1ylogpnumazm',
    'cmr8i08x0026d1yloqip8yhj7',
    'cmr8i09a4026h1ylocjwwub5l',
    'cmr8i0bm8027a1ylopyjgluzm',
    'cmr8isbom02d51ylojvr36ucf',
    'cmr8j0ma802gd1ylo56m5636r',
    'cmr8j0mj802gg1ylon7sk4dkz',
    'cmr8j0n1302gm1yloqa4mb1bp',
    'cmr8j0o8s02h11ylo3fe7ilv8',
    'cmr8j0okh02h51yloxw23kei4',
    'cmr8j0p8902hd1ylolo3ps3th',
    'cmr8j0pb302he1ylofzo37pb5',
    'cmr8j0pgv02hg1ylo6m3h88i7',
    'cmr8j9ony02jo1ylolfyqavd4',
    'cmr8j9q4g02k21ylormr7p65r',
    'cmr8j9s7702km1ylopktp76xr',
    'cmr8ji6tt02n41yloiowt1ufz',
    'cmr8ji90f02nv1ylolrr3pfep',
    'cmr8juhjl00041ygiuhu13y7o',
    'cmr8jui48000b1ygi97bo71ev',
    'cmr8jujfx000r1ygihprpz42i',
    'cmr8ki7fi003g1ygirkvt4fo1',
    'cmr8ki811003m1ygi1vi2z2jg',
    'cmr8ki9j500411ygim1ef47zg',
    'cmr8kia4x00471ygisemv0rle',
    'cmr8l1oev007o1ygi067kcr9p',
    'cmr8lc4pz009k1ygi5qhw6qu2',
    'cmr8lc547009p1ygikvl3lysp',
    'cmr8lc5ff009t1ygilwkj8hgl',
    'cmr8lc5l0009v1ygixqgtomxi',
    'cmr8lc80l00ap1ygitvkq66o3',
    'cmr8lc83q00aq1ygierr2rcbx',
    'cmr8lc8uj00az1ygi9n8yhl4m',
    'cmr8lqg4d00cv1ygi5gwka31w',
    'cmr8lqhla00dd1ygiu37w2pqu',
    'cmr8lqjp400dv1ygimz7lvh61',
    'cmr8lqkln00e61ygic1v1momb',
    'cmr8lyxrf00g91ygic54uhj7d',
    'cmr8lyzyn00gs1ygicllz0l3u',
    'cmr8lz0ci00gw1ygiswktsw2s',
    'cmr8lz0qb00h01ygiaa5x4ejt',
    'cmr8lz10m00h31ygi28skh8cb',
    'cmr8lz1br00h61ygij1q0mvgd',
    'cmr8m9bc400k11ygi4tsdre4a',
    'cmr8m9ch300kf1ygincjf8wle',
    'cmr8m9fjm00kw1ygi3hbdh7de',
    'cmr8n3p0h00pr1ygiit51posy',
    'cmr8n3qkp00q71ygid7xhui0v',
    'cmr8n3s1c00qm1ygipq4ox7la',
    'cmr8ncn8m00tb1ygi09kii0wi',
    'cmr8ncnc800tc1ygitah0nf9e',
    'cmr8ncnfr00td1ygi1ggi3uhk',
    'cmr8ncpk300tz1ygiw0lqzrtc',
    'cmr8nmhps00wg1ygi8xlutogd',
    'cmr8nmjak00x01ygix3irjnf7',
    'cmr8nmjli00x41ygisw99pw0b',
    'cmr8nmjo500x51ygi966sg92z',
    'cmr8nmkfm00xf1ygizbuut6qi',
    'cmr8ny3rh00zm1ygir1z5tdmr',
    'cmr8ny7az010t1ygi3vocpywp',
    'cmr8ny7s9010z1ygiv4ytb3mh',
    'cmr8o9gbu012s1ygi3blxzs88',
    'cmr8o9gq7012x1ygi47wq9tv4',
    'cmr8o9hdp01351ygiw9ko2udv',
    'cmr8o9i8k013g1ygiyoyq2uai',
    'cmr8o9jgr013v1ygi2ng4zz99',
    'cmr8o9joy013y1ygidd5p3hh4',
    'cmr8o9kvr014d1ygi89oh516s',
    'cmr8pgu7r01cs1ygi5wmj428i',
    'cmr8pgvic01d81ygijx3bka1a',
    'cmr8pgx9201dt1ygi1amj7myi',
    'cmr8pvdyz01fy1ygiutsrbjfm',
    'cmr8pveyz01g81ygitnk9fy0o',
    'cmr8pvguq01gr1ygihnh3om1x',
    'cmr8pvh9j01gv1ygi6s7ygox9',
    'cmr8pvhgk01gx1ygihqncjgms',
    'cmr8pvhk101gy1ygih4rimal5',
    'cmr8q41bb01j41ygisytihqaf',
    'cmr8q420x01jd1ygipltsw3mf',
    'cmr8q42i101jj1ygix9do7dk2',
    'cmr8q42nr01jl1ygi37ykmvzq',
    'cmr8q43lt01jx1ygibvpvfamr',
    'cmr8q445r01k41ygipxsvkf3y',
    'cmr8q448k01k51ygido8cgt6v',
    'cmr8q44bd01k61ygikg9upx5d',
    'cmr8q44q201kb1ygi3yue6u58',
    'cmr8qfqp901nf1ygiscbjt54r',
    'cmr97c5hq000v1ywye2ha0pye',
    'cmr97c6vw00191ywyjzq93yp5',
    'cmr97c7h4001f1ywypido8a9v',
    'cmr97c7rj001i1ywys1qmbjl4',
    'cmr97hzyv003u1ywypc0y8i56',
    'cmr97i0b7003x1ywypcc2upxt',
    'cmr97i1oh004b1ywytwmzhx8t',
    'cmr97i1vh004d1ywyrfsixix1',
    'cmr97i3r1004w1ywyxuwcigyv',
    'cmr97i3ul004x1ywys4doi1yd',
    'cmr97qd77006p1ywyyk4rvo3v',
    'cmr97qeux00761ywyk0wwvurk',
    'cmr97qf1y00781ywy7q9odn6y',
    'cmr97qh0d007s1ywyy7xpybtf',
    'cmr97yyfi00a91ywyne7kyjne',
    'cmr97z1bs00b21ywypgek0d2y',
    'cmr9860mb00dl1ywyymmjv4f2',
    'cmr98610d00dq1ywytblirvyj',
    'cmr9861pv00dz1ywypmzwo7g7',
    'cmr98624000e41ywy3pi6n6le',
    'cmr9863aw00ej1ywycti02q91',
    'cmr9863dn00ek1ywyu4b38j65',
    'cmr9863gk00el1ywy38cu5tqv',
    'cmr9863jc00em1ywyaolsow6s',
    'cmr9863rq00ep1ywy6uwji8qs',
    'cmr98643500et1ywyy71vl87z',
    'cmr98648t00ev1ywyp63cf4a0',
    'cmr98dl6k00hd1ywyuxfmb31h',
    'cmr98dlad00he1ywyylev154g',
    'cmr98dldw00hf1ywyt6r6kme8',
    'cmr98dma000ho1ywyul7j6t3e',
    'cmr98dn5h00hx1ywyljcko4f2',
    'cmr98dn8x00hy1ywy4s9krhsc',
    'cmr98mjv600k01ywy701jdrdm',
    'cmr98mkrd00k91ywyqd9m0yw2',
    'cmr98ml5m00kd1ywyiuc5wr5g',
    'cmr98mm4t00kn1ywybeuu73bd',
    'cmr98mmx300kv1ywy65mhs1fr',
    'cmr98mpdv00lk1ywyi9snmhle',
    'cmr98vmyk00nh1ywyviaxf623',
    'cmr98voyi00o51ywy2dfutidm',
    'cmr98vraw00ox1ywy5fcelyoy',
    'cmr99igzj00tw1ywy2us9y29b',
    'cmr99ih6l00ty1ywyw3b3t8e6',
    'cmr99ihh100u11ywyuugxj21z',
    'cmr99ii5h00u81ywylxwt8tdx',
    'cmr99ii9200u91ywym98e1ven',
    'cmr99iicg00ua1ywy1g3ydy16',
    'cmr99iig100ub1ywyl34wyfrt',
    'cmr99ijer00ul1ywyzrso68cm',
    'cmr99iji500um1ywy129j2oio',
    'cmr99ik3500us1ywycg6qjdx8',
    'cmr99ik9y00uu1ywyjr7ndm86',
    'cmr99iko100uy1ywyu3s6g1gb',
    'cmr99il1p00v21ywyv5rlxy3w',
    'cmr99il5600v31ywytgtfs8t3',
    'cmr99il8i00v41ywy2sa4xpwk',
    'cmr99im0800vc1ywy95flf1mn',
    'cmr99im3p00vd1ywycgcwvjn1',
    'cmr99im7600ve1ywywogjyosm',
    'cmr99rg6o00xq1ywyrze6jdq1',
    'cmr99rizp00yp1ywy0bnhwnio',
    'cmr9auc6y017a1ywysfikfftk',
    'cmr9bbuk901ee1ywynrl0bogm',
    'cmr9bnwk301gu1ywyn3b9n5y1',
    'cmr9bo0e901hu1ywy8jrxx828',
    'cmr9bo1hx01i51ywy65yhca2r',
    'cmr9buxul01jx1ywye8pazau2',
    'cmr9buy7i01k11ywyd6q659ga',
    'cmr9buyb201k21ywya6w6ssk6',
    'cmr9buzsb01kk1ywyn7n8lodi',
    'cmr9bv09y01kq1ywyoyhjnf56',
    'cmr9bv1hx01l51ywy0z5w9i49',
    'cmr9bv1ny01l71ywyy5xr7dyx',
    'cmr9bv2ie01lh1ywy9qg8vomf',
    'cmr9c37u701o61ywybgp112h2',
    'cmr9c38gw01oe1ywyidh8kdua',
    'cmr9c38z801ok1ywyadzspqkt',
    'cmr9c39m601os1ywyo9qv0bwp',
    'cmr9c9n5r01qr1ywykq2aq7xk',
    'cmr9c9ncx01qt1ywybuehs0ea',
    'cmr9c9pd001rd1ywy693ddprk',
    'cmr9c9s5501s41ywyns62wjib',
    'cmr9c9s8p01s51ywyeevpga0f',
    'cmru2q6py00001y7w1sav1u1z',
    'cmru2q86x000g1y7wde0fh1ed',
    'cmru2qbhw001j1y7waljhq7go',
    'cmru32k2m003f1y7wv7g5v7lg',
    'cmru38xp4006t1y7wq2js6srx',
    'cmru38y3x006u1y7w1vhetqmu',
    'cmru392tw00781y7wvnrbw4sz',
    'cmru39543007d1y7wsvvbmctw',
    'cmru39d1q007v1y7ws1mwaffl',
    'cmru39her00871y7wk0yjvrf8',
    'cmru3gbcg00aa1y7whlnf7syv',
    'cmru3gbvs00ah1y7w01bno20x',
    'cmru3gbzw00ai1y7wkrx39zrv',
    'cmru3gc5i00ak1y7w2n3hrbfl',
    'cmru3gcp900ar1y7wb8s77on9',
    'cmru3gddz00b01y7woawj5nwf',
    'cmru3n3xs00dh1y7wg6hi5ra7',
    'cmru3n40o00di1y7wmr4daewr',
    'cmru3n4b300dl1y7wqtl2779s',
    'cmru3n5hh00dy1y7wl22p38ot',
    'cmru3n67m00e61y7wm6tauamh',
    'cmru3n6kp00ea1y7w0oq1qnz2',
    'cmru3n6qa00ec1y7w0kfe64o0',
    'cmru3n6t300ed1y7wqk1i2b4d',
    'cmru3n7m100em1y7wqcrq9tuu',
    'cmru3ucda00gz1y7wp2qm6tu0',
    'cmru6qys4002kl104w8g56khi',
    'cmru6qytb002ll104s58x9sjt',
    'cmru7tjkn00081yd6c36f4skb',
    'cmru7tk7n000g1yd6heylm73o',
    'cmru7tl0s000q1yd6tx1ik9fv',
    'cmru7tl3k000r1yd6wahfmrcd',
    'cmru7tm1q00131yd6mg6ycwpf',
    'cmru7tmlm001a1yd6ct025p6w',
    'cmru7tmoh001b1yd6vgao2emp',
    'cmru7tmrb001c1yd63um9hi7c',
    'cmru854xa003k1yd6ccrgh312',
    'cmru8569s00411yd6ecrk6q5z',
    'cmru856zq004a1yd6yq3t6s4v',
    'cmru8575e004c1yd6bxb5swlx',
    'cmru8bfgy007h1yd6nq83nixv',
    'cmru8bfju007i1yd66oc9xwk3',
    'cmru8bgaz007r1yd63ao3vizd',
    'cmru8hwlj00a71yd6ibei12x2',
    'cmru8hww100aa1yd6cgdqk0bb',
    'cmru8hy7800an1yd6b0j84twz',
    'cmru8hzhk00b01yd6a3yltdaj',
    'cmru8hzot00b21yd65o877mfc',
    'cmru8i03d00b61yd65a7p66su',
    'cmru8i0hd00ba1yd65d6ultd6',
    'cmru8i0ku00bb1yd6qtsqhs04',
    'cmru8i0oa00bc1yd6pb9cfq07',
    'cmru8v27h00031y0sktphy9f4',
    'cmru8v2d800051y0s2qfcjr0j',
    'cmru8v2g200061y0swlguuklp',
    'cmru8v3kq000k1y0s3yol19lz',
    'cmru8v3ti000n1y0sngq0kuss',
    'cmru8v4ax000t1y0sh8a9c8kp',
    'cmru8v5zz001e1y0svcqdi8qu',
    'cmru8v65p001g1y0sstwa9b5r',
    'cmru8v6bf001i1y0s0m4ci4s3',
    'cmru9cuvv006l1y0sja2mlptc',
    'cmru9cv4b006n1y0sqtl4wiwq',
    'cmru9cvli006r1y0s8rgp1pny',
    'cmru9cwfn006y1y0s2v1zz355',
    'cmru9cwsn00711y0s9ypdqyb4',
    'cmru9cxdw00761y0sbz2hz8lp',
    'cmru9cxi500771y0siq428k3l',
    'cmru9cykp007g1y0sz587ou9i',
    'cmru9d0je007s1y0soahjrsly',
    'cmru9isci00aa1y0swvf4ulzv',
    'cmru9isgv00ab1y0spklnb6ee',
    'cmru9itnv00al1y0sprdz4reb',
    'cmru9iui400as1y0s6gjuawbj',
    'cmru9iume00at1y0snfkwu82w',
    'cmru9iuqr00au1y0sb1ioayyj',
    'cmru9ivpg00b21y0srrts1f07',
    'cmru9ivy300b41y0s407quyxs',
    'cmru9iw2g00b51y0syr21h0cl',
    'cmruieabl000y1ycesoxp6bpl',
    'cmruiealb00111yce5jc9mar2',
    'cmruiepds00151yce0mdlaa4q',
    'cmruieph500161ycew5tufmoh',
    'cmruiepkg00171ycewl86y5bk',
    'cmruifz9k001u1ycepxwl07yp',
    'cmruihebo002p1yce7yr1k1pt',
    'cmruii0mt00351yce0kmjdjxt',
    'cmruygp34001n1y2y9p2kswfw',
    'cmruygp8i001p1y2yxpvz9jp4',
    'cmruygpbb001q1y2yske6eipu',
    'cmruyh0lu001s1y2yw1a6gvmr',
    'cmruyh0u5001v1y2yq8xlcsh6',
    'cmruyh0ww001w1y2yebi0z0z7',
    'cmruyh0zp001x1y2yy2hp0tir',
    'cmruyhcx300201y2ya2zl1fs9',
    'cmruyhczs00211y2yfmgfqro1',
    'cmruyhd2j00221y2y9djkb9zc',
    'cmruyhdak00251y2y4jfcqmzh',
    'cmruyhdg000271y2yrqrzhksd',
    'cmruyhql5002c1y2ydk48htwp',
    'cmruyhqns002d1y2yxb5vgbf9',
    'cmruyi0jr002i1y2y80rie5s6',
    'cmruyi0mm002j1y2y4fismx2d',
    'cmruyih2c002n1y2yksno0rja',
    'cmruyiuyr002s1y2y0bk2sa4h',
    'cmruyj6gr00301y2ydrl1f1d2',
    'cmruyly0t004m1y2yygubc9bm',
    'cmruymbnm004q1y2y4r1ppph2',
    'cmruyn1yp00561y2ylgm058z8',
    'cmrvm5z3h001kjw04iwhbev9b',
    'cmrvwnde6000h1ye8i393wg3h',
    'cmrvwndjv000j1ye83wghw9xi',
    'cmrvwndy4000o1ye8unhf5gq1',
    'cmrvwnv91000p1ye8vcthvl1w',
    'cmrvwnveh000r1ye8ipfzgy96',
    'cmrvwnvhc000s1ye8x75hgju7',
    'cmrvwo88j000y1ye8f17pg8hj',
    'cmrvwo8ji00121ye8ly32jisv',
    'cmrvwolef00141ye8fu92p55e',
    'cmrvwolpg00181ye8h4exrhtl',
    'cmrvwp52m001h1ye8yhxe1au1',
    'cmrvwq47b001p1ye81cg7l4q6',
    'cmrvwq4ft001s1ye84l2y0ikv',
    'cmrvwqxri00251ye8dqymisa8',
    'cmrvwrcnz002c1ye8aayfs9z4',
    'cmrvwvp9q004p1ye8hapcpuzo',
    'cmrvww3lv00531ye8042otij0',
    'cmrvwwj6y00591ye83y9d81vz',
    'cmrvwx03e005k1ye8gmzvwzlv',
    'cmrw9zvrf000d1ynhzxlqiop8',
    'cmrwa0a22000g1ynhiqt30fj1',
    'cmrwa0xz1000w1ynh8boviep2',
    'cmrwa1kkm001c1ynhu8yhdh6i',
    'cmrwa1kv5001f1ynhxy5zsc8h',
    'cmrwa1kyj001g1ynht1kzxvcu',
    'cmrwa1ywv001n1ynhwrkj3lkh',
    'cmrwa29yv001s1ynhhjstzxh8',
    'cmrwa2lo600231ynhxpyvb44z',
    'cmrwa3gmw002r1ynh9vrqpjx3',
    'cmtpx6dgk000m1ymu0xqsvvjv',
    'cmtpx6dzv000t1ymu6ohaoc5z',
    'cmtpx8r53002s1ymu7symgg49',
    'cmtpx8rx700321ymu9rb53t4h',
    'cmtpx8svv003c1ymut2pbk1f2',
    'cmtpxc4cr004i1ymu26zu03oa',
    'cmtpxc4ml004l1ymuhzn7uu1c',
    'cmtpxc4v7004o1ymue4k9g279',
    'cmtpxc5wf00511ymux0w84hfl',
    'cmtpxc6iq00591ymub6okoxkc',
    'cmtpxc6lk005a1ymuoynwlet9',
    'cmtpxc6oc005b1ymu5o1q42d6',
    'cmtpxc6zk005f1ymuzkga8euu',
    'cmtpxgsd4007c1ymuuhvq43bq',
    'pltaa4572f3bf1ae2e3bd9b1462',
    'pltbab0c590fd0f04d9a014cada'
)
AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3_20261113_backup;
  IF n <> 521 THEN
    RAISE EXCEPTION 'backup row count %, expected 521', n;
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $s3_0$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_0$::jsonb
WHERE id = 'cmqxdzxuj00cu1ymac7dbjyo0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_1$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_1$::jsonb
WHERE id = 'cmqxdzzao00dc1ymaeooxkj10' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_2$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_2$::jsonb
WHERE id = 'cmqxe000100dl1ymatqbtuqgg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_3$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_3$::jsonb
WHERE id = 'cmqxeg7op00ge1ymazsd2g2nb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_4$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_4$::jsonb
WHERE id = 'cmqxeg8fy00gm1yma2ltpu4nn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_5$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_5$::jsonb
WHERE id = 'cmqxeg9br00gv1ymafl03yq85' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_6$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_6$::jsonb
WHERE id = 'cmqxf0mad000p1yf179qu0eny' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_7$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_7$::jsonb
WHERE id = 'cmqxf0mg1000r1yf1d9g1v6p9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_8$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_8$::jsonb
WHERE id = 'cmqxf0n03000y1yf1w4x4rgdl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_9$[{"label": "Evans L et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. For adults with possible septic shock or a high likelihood of sepsis, administer antimicrobials immediately, ideally within 1 hour of recognition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8486643/"}]$s3_9$::jsonb
WHERE id = 'cmr31djye00aljs04bxy0r40b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_10$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_10$::jsonb
WHERE id = 'cmr4b33g700181ykyq4lu9s8h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_11$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_11$::jsonb
WHERE id = 'cmr4badt0003t1yky1yn3dufu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_12$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_12$::jsonb
WHERE id = 'cmr4bag1j004g1yky9vfhrlsk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_13$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_13$::jsonb
WHERE id = 'cmr4bghie00751yky9c08ytxt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_14$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_14$::jsonb
WHERE id = 'cmr4bgiuz007f1yky30vra2gx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_15$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_15$::jsonb
WHERE id = 'cmr4bgmaz00891ykygxo3ayh1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_16$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_16$::jsonb
WHERE id = 'cmr4bgmg9008a1ykyw7khq6t9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_17$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_17$::jsonb
WHERE id = 'cmr4bnwi500am1yky1tkk1cvy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_18$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_18$::jsonb
WHERE id = 'cmr4bnx2o00at1yky5vtifyje' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_19$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_19$::jsonb
WHERE id = 'cmr4bny3k00b61ykyudwqivun' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_20$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_20$::jsonb
WHERE id = 'cmr4bvdua00e11ykyzl8v9ljb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_21$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_21$::jsonb
WHERE id = 'cmr4bvff300ek1ykyi32m3lif' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_22$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_22$::jsonb
WHERE id = 'cmr4c4qk100gs1yky0eubl13s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_23$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_23$::jsonb
WHERE id = 'cmr4c4qno00gt1yky06zj3bfo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_24$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_24$::jsonb
WHERE id = 'cmr4c4uqx00hw1yky6ttc21ps' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_25$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_25$::jsonb
WHERE id = 'cmr4cbw6800ks1yky3bq8y4vp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_26$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_26$::jsonb
WHERE id = 'cmr4cbwlr00kx1ykyl04a2m54' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_27$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_27$::jsonb
WHERE id = 'cmr4cbyq900lm1ykydg5r5xxp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_28$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_28$::jsonb
WHERE id = 'cmr4cnruz00no1yky1bywfhdr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_29$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_29$::jsonb
WHERE id = 'cmr4cnsrp00nx1ykynuw49d4k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_30$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_30$::jsonb
WHERE id = 'cmr4cnsve00ny1ykyqsse91no' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_31$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_31$::jsonb
WHERE id = 'cmr4cntw400o81ykyvueugvzj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_32$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_32$::jsonb
WHERE id = 'cmr4cnw2j00ot1ykye7qxr35z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_33$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_33$::jsonb
WHERE id = 'cmr4cvb8500qx1ykyhfh99yy4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_34$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_34$::jsonb
WHERE id = 'cmr4cvcat00ra1yky1chw5k16' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_35$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_35$::jsonb
WHERE id = 'cmr4d3x8b00vo1yky5g79sruo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_36$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_36$::jsonb
WHERE id = 'cmr4dbbfb00xp1ykyws4k9isf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_37$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_37$::jsonb
WHERE id = 'cmr4dbfsg00yt1yky3spj4ld3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_38$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_38$::jsonb
WHERE id = 'cmr4dj8cv01101ykyf349ryxf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_39$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_39$::jsonb
WHERE id = 'cmr4dj8su01141ykya3bw13qa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_40$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_40$::jsonb
WHERE id = 'cmr4dj90j01161ykyfj3umff7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_41$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_41$::jsonb
WHERE id = 'cmr4dja0m011c1ykyntqmcah7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_42$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_42$::jsonb
WHERE id = 'cmr4djd18011y1yky50ucelfj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_43$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_43$::jsonb
WHERE id = 'cmr4dqqo701481ykyq86cgyc8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_44$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_44$::jsonb
WHERE id = 'cmr4dqu6w015d1ykyu8r2gi93' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_45$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_45$::jsonb
WHERE id = 'cmr4dz7yt01851yky7jtgp7cs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_46$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_46$::jsonb
WHERE id = 'cmr4dza98018y1ykybocd7x5i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_47$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_47$::jsonb
WHERE id = 'cmr4e6i4x01b41ykygru431zd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_48$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_48$::jsonb
WHERE id = 'cmr4e6n5c01c21ykyi1jqywf7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_49$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_49$::jsonb
WHERE id = 'cmr4e6pq701cg1yky7cjb6fr6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_50$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_50$::jsonb
WHERE id = 'cmr4eeil301eg1ykyfjjai9zp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_51$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_51$::jsonb
WHERE id = 'cmr4eejh501ep1ykylvorm0dd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_52$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_52$::jsonb
WHERE id = 'cmr4enlme01j41ykyfw45lya7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_53$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_53$::jsonb
WHERE id = 'cmr4extj101ln1ykytu5m7wsm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_54$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_54$::jsonb
WHERE id = 'cmr4f6ciy01pi1ykyiu9smevk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_55$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_55$::jsonb
WHERE id = 'cmr4f6dh701pu1yky397pr5qx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_56$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_56$::jsonb
WHERE id = 'cmr4f6djy01pv1ykybi0bgbqr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_57$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_57$::jsonb
WHERE id = 'cmr4fdhyo01rx1ykyzteo36kn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_58$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_58$::jsonb
WHERE id = 'cmr4fdkd501sb1ykygyc5ef20' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_59$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_59$::jsonb
WHERE id = 'cmr4fdmwl01su1ykyoe0fgbip' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_60$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_60$::jsonb
WHERE id = 'cmr4fdo1p01t61ykyuijifua3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_61$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_61$::jsonb
WHERE id = 'cmr4fdo8x01t81ykysvbd8n6s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_62$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_62$::jsonb
WHERE id = 'cmr4ftdo401yi1yky60mhhtwe' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_63$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_63$::jsonb
WHERE id = 'cmr4gbuge025r1yky88t5idnh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_64$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_64$::jsonb
WHERE id = 'cmr4gbydu025z1ykygiz4hp7s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_65$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_65$::jsonb
WHERE id = 'cmr4gbz3q02611ykywdwmghn1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_66$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_66$::jsonb
WHERE id = 'cmr4gc2fw02671ykyimogasw6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_67$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_67$::jsonb
WHERE id = 'cmr4gc38402691yky62bukqiz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_68$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_68$::jsonb
WHERE id = 'cmr4gc43j026b1ykyv5fk17fo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_69$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). During an asthma exacerbation, administer supplemental oxygen to maintain an SaO2 greater than 90 percent.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_69$::jsonb
WHERE id = 'cmr4gkdt1029s1ykykwpicuko' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_70$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_70$::jsonb
WHERE id = 'cmr8atvjr000p1ylo5uaesui7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_71$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_71$::jsonb
WHERE id = 'cmr8atxtf001b1ylovzbfsjzs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_72$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_72$::jsonb
WHERE id = 'cmr8bagz5003q1ylojv1mmtd7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_73$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_73$::jsonb
WHERE id = 'cmr8bailn00461ylox557svrf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_74$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_74$::jsonb
WHERE id = 'cmr8bhfm6006k1ylokymolxny' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_75$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_75$::jsonb
WHERE id = 'cmr8bhfwn006n1ylo38bjmvcb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_76$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_76$::jsonb
WHERE id = 'cmr8bhg7c006q1yloybgbzjch' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_77$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_77$::jsonb
WHERE id = 'cmr8bhgl8006u1ylomwgustk4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_78$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_78$::jsonb
WHERE id = 'cmr8bhgvr006x1ylo4uz9udgc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_79$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_79$::jsonb
WHERE id = 'cmr8bhitg007h1ylozowyfkc9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_80$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_80$::jsonb
WHERE id = 'cmr8bhjlu007p1ylokg2kb3ty' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_81$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_81$::jsonb
WHERE id = 'cmr8bhkas007w1ylonko35q6w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_82$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_82$::jsonb
WHERE id = 'cmr8bhkox00801ylopw4qbcqs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_83$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_83$::jsonb
WHERE id = 'cmr8bhksf00811ylongaufq2l' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_84$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_84$::jsonb
WHERE id = 'cmr8br4p700a31yloriym4qxc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_85$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_85$::jsonb
WHERE id = 'cmr8br7jh00b21ylo21rrr0qs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_86$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_86$::jsonb
WHERE id = 'cmr8bxw8v00d81yloyibr06d3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_87$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_87$::jsonb
WHERE id = 'cmr8bxz5900e11ylofsgzvegt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_88$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_88$::jsonb
WHERE id = 'cmr8by04u00eb1ylop82go23q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_89$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_89$::jsonb
WHERE id = 'cmr8by08m00ec1yloca35yzdm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_90$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_90$::jsonb
WHERE id = 'cmr8by0c500ed1yloj6pia4mi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_91$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_91$::jsonb
WHERE id = 'cmr8by10z00ek1ylo4yt8dgj6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_92$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_92$::jsonb
WHERE id = 'cmr8by14j00el1ylowz8x136u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_93$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_93$::jsonb
WHERE id = 'cmr8c3kgu00gk1ylocue28l2c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_94$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_94$::jsonb
WHERE id = 'cmr8c3ltb00gx1ylotk7ngjzb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_95$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_95$::jsonb
WHERE id = 'cmr8c3nea00hd1ylozle231ks' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_96$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_96$::jsonb
WHERE id = 'cmr8c3nqa00hg1ylopgbt07of' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_97$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_97$::jsonb
WHERE id = 'cmr8c3o4f00hk1yloc3ciobun' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_98$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_98$::jsonb
WHERE id = 'cmr8cce8i00jz1ylo3mnii13u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_99$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_99$::jsonb
WHERE id = 'cmr8ccetk00k61yloizxpf4jl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_100$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_100$::jsonb
WHERE id = 'cmr8ccewq00k71yloikqlm20c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_101$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_101$::jsonb
WHERE id = 'cmr8ccfcj00kc1ylo5bcs86wm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_102$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_102$::jsonb
WHERE id = 'cmr8ccfr300kh1ylom44l27hv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_103$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_103$::jsonb
WHERE id = 'cmr8ccftw00ki1ylo31xwvzga' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_104$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_104$::jsonb
WHERE id = 'cmr8ccgmp00km1ylobxi8dlk1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_105$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_105$::jsonb
WHERE id = 'cmr8cchg000kp1ylo8x15va6c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_106$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_106$::jsonb
WHERE id = 'cmr8cchzk00kr1ylofz2qs0vq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_107$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_107$::jsonb
WHERE id = 'cmr8cci9a00ks1yloyp4e3imn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_108$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_108$::jsonb
WHERE id = 'cmr8ccioj00kw1ylo6ojzk4q1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_109$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_109$::jsonb
WHERE id = 'cmr8ccixe00kz1yloxnqww4cx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_110$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_110$::jsonb
WHERE id = 'cmr8ccjhw00l61ylo521p1uaf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_111$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_111$::jsonb
WHERE id = 'cmr8ccjnr00l81ylokomwrvt0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_112$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_112$::jsonb
WHERE id = 'cmr8ccjwn00lb1ylobuaexxk9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_113$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_113$::jsonb
WHERE id = 'cmr8cnbpz00oa1ylo2sp14emz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_114$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_114$::jsonb
WHERE id = 'cmr8d1uqh00qc1ylom1b019zq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_115$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_115$::jsonb
WHERE id = 'cmr8d1wq100qv1ylo89kmc501' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_116$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). During an asthma exacerbation, administer supplemental oxygen to maintain an SaO2 greater than 90 percent.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_116$::jsonb
WHERE id = 'cmr8d1x4i00qz1ylovs3hqxxn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_117$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_117$::jsonb
WHERE id = 'cmr8d1xj900r31ylor4s9neez' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_118$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_118$::jsonb
WHERE id = 'cmr8d1y5l00r91ylobfvnd1yu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_119$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_119$::jsonb
WHERE id = 'cmr8d1yrp00rf1ylom4abnae1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_120$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_120$::jsonb
WHERE id = 'cmr8d1z5g00ri1ylo3sh575uo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_121$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_121$::jsonb
WHERE id = 'cmr8d1zkb00rm1yloueqksxdo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_122$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_122$::jsonb
WHERE id = 'cmr8d1zz500rq1ylo9i3px56o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_123$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_123$::jsonb
WHERE id = 'cmr8db79500tn1ylor2xe50mx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_124$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_124$::jsonb
WHERE id = 'cmr8db7ob00tr1ylo1r9i9g96' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_125$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. DKA is diagnosed when hyperglycemia or known diabetes is accompanied by elevated ketones and metabolic acidosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_125$::jsonb
WHERE id = 'cmr8db8z400u41ylojnfal26c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_126$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_126$::jsonb
WHERE id = 'cmr8db92r00u51ylo4uqewl8g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_127$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_127$::jsonb
WHERE id = 'cmr8dig3100x31ylo1weeow40' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_128$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_128$::jsonb
WHERE id = 'cmr8dignn00xa1yloocpo4kb7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_129$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_129$::jsonb
WHERE id = 'cmr8dihxk00xp1ylo9pelkzf3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_130$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_130$::jsonb
WHERE id = 'cmr8diifb00xv1yloqpy6ux6h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_131$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_131$::jsonb
WHERE id = 'cmr8diira00xz1ylo132h88u6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_132$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_132$::jsonb
WHERE id = 'cmr8dq94h01031yloj0hslvas' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_133$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_133$::jsonb
WHERE id = 'cmr8dqbf3010o1yloly66gtrk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_134$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_134$::jsonb
WHERE id = 'cmr8dqbin010p1ylo125rj389' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_135$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_135$::jsonb
WHERE id = 'cmr8dqcb9010x1ylo3twki8c5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_136$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_136$::jsonb
WHERE id = 'cmr8dqceu010y1ylo8rt7w4aa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_137$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_137$::jsonb
WHERE id = 'cmr8dqcx001131ylo0h8j3f1o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_138$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_138$::jsonb
WHERE id = 'cmr8dqd9j01161ylop3we43g8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_139$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_139$::jsonb
WHERE id = 'cmr8dqdgv01181ylo4o5fp472' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_140$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_140$::jsonb
WHERE id = 'cmr8dqdkh01191ylonsextjvo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_141$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_141$::jsonb
WHERE id = 'cmr8dqeku011i1ylom13hqlhc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_142$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_142$::jsonb
WHERE id = 'cmr8dqeog011j1ylorapbl1th' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_143$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_143$::jsonb
WHERE id = 'cmr8e5vz6016r1ylo1yzdvwr2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_144$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_144$::jsonb
WHERE id = 'cmr8e5wm9016z1ylomlk2yqs8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_145$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_145$::jsonb
WHERE id = 'cmr8e5wx801731ylo1buo22j6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_146$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_146$::jsonb
WHERE id = 'cmr8e5x5r01761yloafzlsu6j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_147$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_147$::jsonb
WHERE id = 'cmr8e5y9o017k1ylog5cpqpf1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_148$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_148$::jsonb
WHERE id = 'cmr8e5yld017o1ylooyucj291' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_149$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_149$::jsonb
WHERE id = 'cmr8e5z9d017w1ylojykfr99e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_150$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_150$::jsonb
WHERE id = 'cmr8e5zwl01841ylocz3xdb4a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_151$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_151$::jsonb
WHERE id = 'cmr8ei15p01ax1yloctvoup4x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_152$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_152$::jsonb
WHERE id = 'cmr8ei2tz01bh1yloi3l1j3x1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_153$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. DKA is diagnosed when hyperglycemia or known diabetes is accompanied by elevated ketones and metabolic acidosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_153$::jsonb
WHERE id = 'cmr8eslrp01d71ylou1j3alnz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_154$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_154$::jsonb
WHERE id = 'cmr8esmel01de1ylop838wgow' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_155$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_155$::jsonb
WHERE id = 'cmr8esmkn01dg1ylom7meymef' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_156$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_156$::jsonb
WHERE id = 'cmr8esn8w01do1yloikv83hhh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_157$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_157$::jsonb
WHERE id = 'cmr8esoca01e11yloz7ehvs1m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_158$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_158$::jsonb
WHERE id = 'cmr8esq4001em1yloveed3mxd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_159$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_159$::jsonb
WHERE id = 'cmr8f2knb01gq1ylo8i0vz1hi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_160$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_160$::jsonb
WHERE id = 'cmr8f2mc001hb1ylom40kl3z4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_161$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_161$::jsonb
WHERE id = 'cmr8f2o4l01hx1ylo9ioykmdq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_162$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_162$::jsonb
WHERE id = 'cmr8f2oiv01i21ylo2qbl9azw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_163$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_163$::jsonb
WHERE id = 'cmr8fhfnt01k61ylo88e9cvew' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_164$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_164$::jsonb
WHERE id = 'cmr8fhi6901kv1ylozcqel65e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_165$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_165$::jsonb
WHERE id = 'cmr8fhikm01kz1ylo0gp55vei' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_166$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_166$::jsonb
WHERE id = 'cmr8fhivf01l21ylojwff0190' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_167$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_167$::jsonb
WHERE id = 'cmr8fz6y001n01yloxbq64g7w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_168$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_168$::jsonb
WHERE id = 'cmr8fz7in01n71ylodq8glaol' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_169$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_169$::jsonb
WHERE id = 'cmr8fz8bn01nh1yloqqntessa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_170$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_170$::jsonb
WHERE id = 'cmr8fz8hj01nj1ylomnu1nqic' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_171$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. DKA is diagnosed when hyperglycemia or known diabetes is accompanied by elevated ketones and metabolic acidosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_171$::jsonb
WHERE id = 'cmr8fz8tc01nn1yloaaiviksx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_172$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_172$::jsonb
WHERE id = 'cmr8fz9pb01ny1ylozq6irsk6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_173$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_173$::jsonb
WHERE id = 'cmr8g799t01q71ylo229gsgc6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_174$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_174$::jsonb
WHERE id = 'cmr8g79is01qa1ylor6kl7gu8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_175$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_175$::jsonb
WHERE id = 'cmr8g7a9u01qj1ylogojtt94g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_176$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_176$::jsonb
WHERE id = 'cmr8g7aco01qk1ylonz02s6wq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_177$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_177$::jsonb
WHERE id = 'cmr8g7aoa01qo1ylo908sjdeb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_178$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_178$::jsonb
WHERE id = 'cmr8g7ard01qp1ylom2o6a8r4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_179$[{"label": "FDA prescribing information. Lithium's label warns of lithium toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=01c4facd-ed79-4078-ba33-2044de372d0f"}]$s3_179$::jsonb
WHERE id = 'cmr8gr75v01u91ylog5u91ab2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_180$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_180$::jsonb
WHERE id = 'cmr8h1hl201xv1ylohuqal6jb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_181$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_181$::jsonb
WHERE id = 'cmr8hgei802011yloubidk1ir' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_182$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_182$::jsonb
WHERE id = 'cmr8hgep202031ylovpap2bv8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_183$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_183$::jsonb
WHERE id = 'cmr8hgeso02041ylomwa2ksuw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_184$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_184$::jsonb
WHERE id = 'cmr8hgfh8020b1ylosw8iidze' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_185$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_185$::jsonb
WHERE id = 'cmr8hgfrq020e1yloxf5flztv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_186$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_186$::jsonb
WHERE id = 'cmr8hggu8020p1ylo2qypb4h3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_187$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_187$::jsonb
WHERE id = 'cmr8hgjg302181ylor4piufzp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_188$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_188$::jsonb
WHERE id = 'cmr8hrr9o023c1ylori4fu3st' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_189$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_189$::jsonb
WHERE id = 'cmr8hrrl1023g1ylodd9v80i5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_190$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_190$::jsonb
WHERE id = 'cmr8hrrra023i1ylo9084qhn5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_191$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_191$::jsonb
WHERE id = 'cmr8hrsvt023w1ylo0jhechrn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_192$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_192$::jsonb
WHERE id = 'cmr8hrt9t02411ylohbqfuwjo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_193$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_193$::jsonb
WHERE id = 'cmr8hrto302461ylog7znjp5e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_194$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_194$::jsonb
WHERE id = 'cmr8hru9c024d1ylofzx7zohd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_195$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_195$::jsonb
WHERE id = 'cmr8hruck024e1ylogpnumazm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_196$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_196$::jsonb
WHERE id = 'cmr8i08x0026d1yloqip8yhj7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_197$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_197$::jsonb
WHERE id = 'cmr8i09a4026h1ylocjwwub5l' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_198$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_198$::jsonb
WHERE id = 'cmr8i0bm8027a1ylopyjgluzm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_199$[{"label": "FDA prescribing information. Lithium's label warns of lithium toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=01c4facd-ed79-4078-ba33-2044de372d0f"}]$s3_199$::jsonb
WHERE id = 'cmr8isbom02d51ylojvr36ucf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_200$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_200$::jsonb
WHERE id = 'cmr8j0ma802gd1ylo56m5636r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_201$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_201$::jsonb
WHERE id = 'cmr8j0mj802gg1ylon7sk4dkz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_202$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_202$::jsonb
WHERE id = 'cmr8j0n1302gm1yloqa4mb1bp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_203$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_203$::jsonb
WHERE id = 'cmr8j0o8s02h11ylo3fe7ilv8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_204$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_204$::jsonb
WHERE id = 'cmr8j0okh02h51yloxw23kei4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_205$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_205$::jsonb
WHERE id = 'cmr8j0p8902hd1ylolo3ps3th' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_206$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_206$::jsonb
WHERE id = 'cmr8j0pb302he1ylofzo37pb5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_207$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_207$::jsonb
WHERE id = 'cmr8j0pgv02hg1ylo6m3h88i7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_208$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_208$::jsonb
WHERE id = 'cmr8j9ony02jo1ylolfyqavd4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_209$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_209$::jsonb
WHERE id = 'cmr8j9q4g02k21ylormr7p65r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_210$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_210$::jsonb
WHERE id = 'cmr8j9s7702km1ylopktp76xr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_211$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_211$::jsonb
WHERE id = 'cmr8ji6tt02n41yloiowt1ufz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_212$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_212$::jsonb
WHERE id = 'cmr8ji90f02nv1ylolrr3pfep' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_213$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_213$::jsonb
WHERE id = 'cmr8juhjl00041ygiuhu13y7o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_214$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_214$::jsonb
WHERE id = 'cmr8jui48000b1ygi97bo71ev' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_215$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_215$::jsonb
WHERE id = 'cmr8jujfx000r1ygihprpz42i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_216$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_216$::jsonb
WHERE id = 'cmr8ki7fi003g1ygirkvt4fo1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_217$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_217$::jsonb
WHERE id = 'cmr8ki811003m1ygi1vi2z2jg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_218$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_218$::jsonb
WHERE id = 'cmr8ki9j500411ygim1ef47zg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_219$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_219$::jsonb
WHERE id = 'cmr8kia4x00471ygisemv0rle' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_220$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_220$::jsonb
WHERE id = 'cmr8l1oev007o1ygi067kcr9p' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_221$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_221$::jsonb
WHERE id = 'cmr8lc4pz009k1ygi5qhw6qu2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_222$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_222$::jsonb
WHERE id = 'cmr8lc547009p1ygikvl3lysp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_223$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_223$::jsonb
WHERE id = 'cmr8lc5ff009t1ygilwkj8hgl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_224$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_224$::jsonb
WHERE id = 'cmr8lc5l0009v1ygixqgtomxi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_225$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_225$::jsonb
WHERE id = 'cmr8lc80l00ap1ygitvkq66o3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_226$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_226$::jsonb
WHERE id = 'cmr8lc83q00aq1ygierr2rcbx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_227$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_227$::jsonb
WHERE id = 'cmr8lc8uj00az1ygi9n8yhl4m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_228$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. DKA is diagnosed when hyperglycemia or known diabetes is accompanied by elevated ketones and metabolic acidosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_228$::jsonb
WHERE id = 'cmr8lqg4d00cv1ygi5gwka31w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_229$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_229$::jsonb
WHERE id = 'cmr8lqhla00dd1ygiu37w2pqu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_230$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_230$::jsonb
WHERE id = 'cmr8lqjp400dv1ygimz7lvh61' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_231$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_231$::jsonb
WHERE id = 'cmr8lqkln00e61ygic1v1momb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_232$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_232$::jsonb
WHERE id = 'cmr8lyxrf00g91ygic54uhj7d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_233$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_233$::jsonb
WHERE id = 'cmr8lyzyn00gs1ygicllz0l3u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_234$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_234$::jsonb
WHERE id = 'cmr8lz0ci00gw1ygiswktsw2s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_235$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_235$::jsonb
WHERE id = 'cmr8lz0qb00h01ygiaa5x4ejt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_236$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_236$::jsonb
WHERE id = 'cmr8lz10m00h31ygi28skh8cb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_237$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_237$::jsonb
WHERE id = 'cmr8lz1br00h61ygij1q0mvgd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_238$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_238$::jsonb
WHERE id = 'cmr8m9bc400k11ygi4tsdre4a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_239$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_239$::jsonb
WHERE id = 'cmr8m9ch300kf1ygincjf8wle' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_240$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_240$::jsonb
WHERE id = 'cmr8m9fjm00kw1ygi3hbdh7de' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_241$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_241$::jsonb
WHERE id = 'cmr8n3p0h00pr1ygiit51posy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_242$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_242$::jsonb
WHERE id = 'cmr8n3qkp00q71ygid7xhui0v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_243$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_243$::jsonb
WHERE id = 'cmr8n3s1c00qm1ygipq4ox7la' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_244$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_244$::jsonb
WHERE id = 'cmr8ncn8m00tb1ygi09kii0wi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_245$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_245$::jsonb
WHERE id = 'cmr8ncnc800tc1ygitah0nf9e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_246$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_246$::jsonb
WHERE id = 'cmr8ncnfr00td1ygi1ggi3uhk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_247$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_247$::jsonb
WHERE id = 'cmr8ncpk300tz1ygiw0lqzrtc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_248$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_248$::jsonb
WHERE id = 'cmr8nmhps00wg1ygi8xlutogd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_249$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_249$::jsonb
WHERE id = 'cmr8nmjak00x01ygix3irjnf7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_250$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. DKA is diagnosed when hyperglycemia or known diabetes is accompanied by elevated ketones and metabolic acidosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_250$::jsonb
WHERE id = 'cmr8nmjli00x41ygisw99pw0b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_251$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_251$::jsonb
WHERE id = 'cmr8nmjo500x51ygi966sg92z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_252$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_252$::jsonb
WHERE id = 'cmr8nmkfm00xf1ygizbuut6qi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_253$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_253$::jsonb
WHERE id = 'cmr8ny3rh00zm1ygir1z5tdmr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_254$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_254$::jsonb
WHERE id = 'cmr8ny7az010t1ygi3vocpywp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_255$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_255$::jsonb
WHERE id = 'cmr8ny7s9010z1ygiv4ytb3mh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_256$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_256$::jsonb
WHERE id = 'cmr8o9gbu012s1ygi3blxzs88' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_257$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_257$::jsonb
WHERE id = 'cmr8o9gq7012x1ygi47wq9tv4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_258$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_258$::jsonb
WHERE id = 'cmr8o9hdp01351ygiw9ko2udv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_259$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_259$::jsonb
WHERE id = 'cmr8o9i8k013g1ygiyoyq2uai' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_260$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_260$::jsonb
WHERE id = 'cmr8o9jgr013v1ygi2ng4zz99' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_261$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_261$::jsonb
WHERE id = 'cmr8o9joy013y1ygidd5p3hh4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_262$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_262$::jsonb
WHERE id = 'cmr8o9kvr014d1ygi89oh516s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_263$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_263$::jsonb
WHERE id = 'cmr8pgu7r01cs1ygi5wmj428i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_264$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_264$::jsonb
WHERE id = 'cmr8pgvic01d81ygijx3bka1a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_265$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_265$::jsonb
WHERE id = 'cmr8pgx9201dt1ygi1amj7myi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_266$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_266$::jsonb
WHERE id = 'cmr8pvdyz01fy1ygiutsrbjfm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_267$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_267$::jsonb
WHERE id = 'cmr8pveyz01g81ygitnk9fy0o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_268$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_268$::jsonb
WHERE id = 'cmr8pvguq01gr1ygihnh3om1x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_269$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_269$::jsonb
WHERE id = 'cmr8pvh9j01gv1ygi6s7ygox9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_270$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_270$::jsonb
WHERE id = 'cmr8pvhgk01gx1ygihqncjgms' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_271$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_271$::jsonb
WHERE id = 'cmr8pvhk101gy1ygih4rimal5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_272$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_272$::jsonb
WHERE id = 'cmr8q41bb01j41ygisytihqaf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_273$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_273$::jsonb
WHERE id = 'cmr8q420x01jd1ygipltsw3mf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_274$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_274$::jsonb
WHERE id = 'cmr8q42i101jj1ygix9do7dk2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_275$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_275$::jsonb
WHERE id = 'cmr8q42nr01jl1ygi37ykmvzq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_276$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_276$::jsonb
WHERE id = 'cmr8q43lt01jx1ygibvpvfamr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_277$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_277$::jsonb
WHERE id = 'cmr8q445r01k41ygipxsvkf3y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_278$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_278$::jsonb
WHERE id = 'cmr8q448k01k51ygido8cgt6v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_279$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_279$::jsonb
WHERE id = 'cmr8q44bd01k61ygikg9upx5d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_280$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_280$::jsonb
WHERE id = 'cmr8q44q201kb1ygi3yue6u58' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_281$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_281$::jsonb
WHERE id = 'cmr8qfqp901nf1ygiscbjt54r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_282$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_282$::jsonb
WHERE id = 'cmr97c5hq000v1ywye2ha0pye' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_283$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_283$::jsonb
WHERE id = 'cmr97c6vw00191ywyjzq93yp5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_284$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_284$::jsonb
WHERE id = 'cmr97c7h4001f1ywypido8a9v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_285$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_285$::jsonb
WHERE id = 'cmr97c7rj001i1ywys1qmbjl4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_286$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_286$::jsonb
WHERE id = 'cmr97hzyv003u1ywypc0y8i56' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_287$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_287$::jsonb
WHERE id = 'cmr97i0b7003x1ywypcc2upxt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_288$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_288$::jsonb
WHERE id = 'cmr97i1oh004b1ywytwmzhx8t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_289$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_289$::jsonb
WHERE id = 'cmr97i1vh004d1ywyrfsixix1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_290$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_290$::jsonb
WHERE id = 'cmr97i3r1004w1ywyxuwcigyv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_291$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_291$::jsonb
WHERE id = 'cmr97i3ul004x1ywys4doi1yd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_292$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_292$::jsonb
WHERE id = 'cmr97qd77006p1ywyyk4rvo3v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_293$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_293$::jsonb
WHERE id = 'cmr97qeux00761ywyk0wwvurk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_294$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_294$::jsonb
WHERE id = 'cmr97qf1y00781ywy7q9odn6y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_295$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_295$::jsonb
WHERE id = 'cmr97qh0d007s1ywyy7xpybtf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_296$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_296$::jsonb
WHERE id = 'cmr97yyfi00a91ywyne7kyjne' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_297$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_297$::jsonb
WHERE id = 'cmr97z1bs00b21ywypgek0d2y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_298$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_298$::jsonb
WHERE id = 'cmr9860mb00dl1ywyymmjv4f2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_299$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_299$::jsonb
WHERE id = 'cmr98610d00dq1ywytblirvyj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_300$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_300$::jsonb
WHERE id = 'cmr9861pv00dz1ywypmzwo7g7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_301$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_301$::jsonb
WHERE id = 'cmr98624000e41ywy3pi6n6le' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_302$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_302$::jsonb
WHERE id = 'cmr9863aw00ej1ywycti02q91' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_303$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_303$::jsonb
WHERE id = 'cmr9863dn00ek1ywyu4b38j65' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_304$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_304$::jsonb
WHERE id = 'cmr9863gk00el1ywy38cu5tqv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_305$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_305$::jsonb
WHERE id = 'cmr9863jc00em1ywyaolsow6s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_306$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_306$::jsonb
WHERE id = 'cmr9863rq00ep1ywy6uwji8qs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_307$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_307$::jsonb
WHERE id = 'cmr98643500et1ywyy71vl87z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_308$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_308$::jsonb
WHERE id = 'cmr98648t00ev1ywyp63cf4a0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_309$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_309$::jsonb
WHERE id = 'cmr98dl6k00hd1ywyuxfmb31h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_310$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_310$::jsonb
WHERE id = 'cmr98dlad00he1ywyylev154g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_311$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_311$::jsonb
WHERE id = 'cmr98dldw00hf1ywyt6r6kme8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_312$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_312$::jsonb
WHERE id = 'cmr98dma000ho1ywyul7j6t3e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_313$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_313$::jsonb
WHERE id = 'cmr98dn5h00hx1ywyljcko4f2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_314$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_314$::jsonb
WHERE id = 'cmr98dn8x00hy1ywy4s9krhsc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_315$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_315$::jsonb
WHERE id = 'cmr98mjv600k01ywy701jdrdm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_316$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_316$::jsonb
WHERE id = 'cmr98mkrd00k91ywyqd9m0yw2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_317$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_317$::jsonb
WHERE id = 'cmr98ml5m00kd1ywyiuc5wr5g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_318$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_318$::jsonb
WHERE id = 'cmr98mm4t00kn1ywybeuu73bd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_319$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_319$::jsonb
WHERE id = 'cmr98mmx300kv1ywy65mhs1fr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_320$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_320$::jsonb
WHERE id = 'cmr98mpdv00lk1ywyi9snmhle' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_321$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_321$::jsonb
WHERE id = 'cmr98vmyk00nh1ywyviaxf623' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_322$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_322$::jsonb
WHERE id = 'cmr98voyi00o51ywy2dfutidm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_323$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_323$::jsonb
WHERE id = 'cmr98vraw00ox1ywy5fcelyoy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_324$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_324$::jsonb
WHERE id = 'cmr99igzj00tw1ywy2us9y29b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_325$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_325$::jsonb
WHERE id = 'cmr99ih6l00ty1ywyw3b3t8e6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_326$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_326$::jsonb
WHERE id = 'cmr99ihh100u11ywyuugxj21z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_327$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_327$::jsonb
WHERE id = 'cmr99ii5h00u81ywylxwt8tdx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_328$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_328$::jsonb
WHERE id = 'cmr99ii9200u91ywym98e1ven' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_329$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_329$::jsonb
WHERE id = 'cmr99iicg00ua1ywy1g3ydy16' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_330$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_330$::jsonb
WHERE id = 'cmr99iig100ub1ywyl34wyfrt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_331$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_331$::jsonb
WHERE id = 'cmr99ijer00ul1ywyzrso68cm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_332$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_332$::jsonb
WHERE id = 'cmr99iji500um1ywy129j2oio' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_333$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_333$::jsonb
WHERE id = 'cmr99ik3500us1ywycg6qjdx8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_334$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_334$::jsonb
WHERE id = 'cmr99ik9y00uu1ywyjr7ndm86' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_335$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_335$::jsonb
WHERE id = 'cmr99iko100uy1ywyu3s6g1gb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_336$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_336$::jsonb
WHERE id = 'cmr99il1p00v21ywyv5rlxy3w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_337$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_337$::jsonb
WHERE id = 'cmr99il5600v31ywytgtfs8t3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_338$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_338$::jsonb
WHERE id = 'cmr99il8i00v41ywy2sa4xpwk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_339$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_339$::jsonb
WHERE id = 'cmr99im0800vc1ywy95flf1mn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_340$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_340$::jsonb
WHERE id = 'cmr99im3p00vd1ywycgcwvjn1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_341$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_341$::jsonb
WHERE id = 'cmr99im7600ve1ywywogjyosm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_342$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_342$::jsonb
WHERE id = 'cmr99rg6o00xq1ywyrze6jdq1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_343$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_343$::jsonb
WHERE id = 'cmr99rizp00yp1ywy0bnhwnio' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_344$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). During an asthma exacerbation, administer supplemental oxygen to maintain an SaO2 greater than 90 percent.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_344$::jsonb
WHERE id = 'cmr9auc6y017a1ywysfikfftk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_345$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_345$::jsonb
WHERE id = 'cmr9bbuk901ee1ywynrl0bogm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_346$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_346$::jsonb
WHERE id = 'cmr9bnwk301gu1ywyn3b9n5y1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_347$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_347$::jsonb
WHERE id = 'cmr9bo0e901hu1ywy8jrxx828' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_348$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_348$::jsonb
WHERE id = 'cmr9bo1hx01i51ywy65yhca2r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_349$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_349$::jsonb
WHERE id = 'cmr9buxul01jx1ywye8pazau2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_350$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_350$::jsonb
WHERE id = 'cmr9buy7i01k11ywyd6q659ga' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_351$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_351$::jsonb
WHERE id = 'cmr9buyb201k21ywya6w6ssk6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_352$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_352$::jsonb
WHERE id = 'cmr9buzsb01kk1ywyn7n8lodi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_353$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_353$::jsonb
WHERE id = 'cmr9bv09y01kq1ywyoyhjnf56' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_354$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_354$::jsonb
WHERE id = 'cmr9bv1hx01l51ywy0z5w9i49' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_355$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_355$::jsonb
WHERE id = 'cmr9bv1ny01l71ywyy5xr7dyx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_356$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_356$::jsonb
WHERE id = 'cmr9bv2ie01lh1ywy9qg8vomf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_357$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_357$::jsonb
WHERE id = 'cmr9c37u701o61ywybgp112h2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_358$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_358$::jsonb
WHERE id = 'cmr9c38gw01oe1ywyidh8kdua' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_359$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_359$::jsonb
WHERE id = 'cmr9c38z801ok1ywyadzspqkt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_360$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_360$::jsonb
WHERE id = 'cmr9c39m601os1ywyo9qv0bwp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_361$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_361$::jsonb
WHERE id = 'cmr9c9n5r01qr1ywykq2aq7xk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_362$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_362$::jsonb
WHERE id = 'cmr9c9ncx01qt1ywybuehs0ea' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_363$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_363$::jsonb
WHERE id = 'cmr9c9pd001rd1ywy693ddprk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_364$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_364$::jsonb
WHERE id = 'cmr9c9s5501s41ywyns62wjib' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_365$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_365$::jsonb
WHERE id = 'cmr9c9s8p01s51ywyeevpga0f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_366$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_366$::jsonb
WHERE id = 'cmru2q6py00001y7w1sav1u1z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_367$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_367$::jsonb
WHERE id = 'cmru2q86x000g1y7wde0fh1ed' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_368$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_368$::jsonb
WHERE id = 'cmru2qbhw001j1y7waljhq7go' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_369$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_369$::jsonb
WHERE id = 'cmru32k2m003f1y7wv7g5v7lg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_370$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_370$::jsonb
WHERE id = 'cmru38xp4006t1y7wq2js6srx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_371$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_371$::jsonb
WHERE id = 'cmru38y3x006u1y7w1vhetqmu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_372$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_372$::jsonb
WHERE id = 'cmru392tw00781y7wvnrbw4sz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_373$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_373$::jsonb
WHERE id = 'cmru39543007d1y7wsvvbmctw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_374$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_374$::jsonb
WHERE id = 'cmru39d1q007v1y7ws1mwaffl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_375$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_375$::jsonb
WHERE id = 'cmru39her00871y7wk0yjvrf8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_376$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_376$::jsonb
WHERE id = 'cmru3gbcg00aa1y7whlnf7syv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_377$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_377$::jsonb
WHERE id = 'cmru3gbvs00ah1y7w01bno20x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_378$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_378$::jsonb
WHERE id = 'cmru3gbzw00ai1y7wkrx39zrv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_379$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_379$::jsonb
WHERE id = 'cmru3gc5i00ak1y7w2n3hrbfl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_380$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_380$::jsonb
WHERE id = 'cmru3gcp900ar1y7wb8s77on9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_381$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_381$::jsonb
WHERE id = 'cmru3gddz00b01y7woawj5nwf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_382$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_382$::jsonb
WHERE id = 'cmru3n3xs00dh1y7wg6hi5ra7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_383$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_383$::jsonb
WHERE id = 'cmru3n40o00di1y7wmr4daewr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_384$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_384$::jsonb
WHERE id = 'cmru3n4b300dl1y7wqtl2779s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_385$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_385$::jsonb
WHERE id = 'cmru3n5hh00dy1y7wl22p38ot' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_386$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_386$::jsonb
WHERE id = 'cmru3n67m00e61y7wm6tauamh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_387$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_387$::jsonb
WHERE id = 'cmru3n6kp00ea1y7w0oq1qnz2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_388$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_388$::jsonb
WHERE id = 'cmru3n6qa00ec1y7w0kfe64o0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_389$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_389$::jsonb
WHERE id = 'cmru3n6t300ed1y7wqk1i2b4d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_390$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_390$::jsonb
WHERE id = 'cmru3n7m100em1y7wqcrq9tuu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_391$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_391$::jsonb
WHERE id = 'cmru3ucda00gz1y7wp2qm6tu0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_392$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_392$::jsonb
WHERE id = 'cmru6qys4002kl104w8g56khi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_393$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_393$::jsonb
WHERE id = 'cmru6qytb002ll104s58x9sjt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_394$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_394$::jsonb
WHERE id = 'cmru7tjkn00081yd6c36f4skb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_395$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_395$::jsonb
WHERE id = 'cmru7tk7n000g1yd6heylm73o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_396$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_396$::jsonb
WHERE id = 'cmru7tl0s000q1yd6tx1ik9fv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_397$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_397$::jsonb
WHERE id = 'cmru7tl3k000r1yd6wahfmrcd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_398$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_398$::jsonb
WHERE id = 'cmru7tm1q00131yd6mg6ycwpf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_399$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_399$::jsonb
WHERE id = 'cmru7tmlm001a1yd6ct025p6w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_400$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_400$::jsonb
WHERE id = 'cmru7tmoh001b1yd6vgao2emp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_401$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_401$::jsonb
WHERE id = 'cmru7tmrb001c1yd63um9hi7c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_402$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_402$::jsonb
WHERE id = 'cmru854xa003k1yd6ccrgh312' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_403$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_403$::jsonb
WHERE id = 'cmru8569s00411yd6ecrk6q5z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_404$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_404$::jsonb
WHERE id = 'cmru856zq004a1yd6yq3t6s4v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_405$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_405$::jsonb
WHERE id = 'cmru8575e004c1yd6bxb5swlx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_406$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_406$::jsonb
WHERE id = 'cmru8bfgy007h1yd6nq83nixv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_407$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_407$::jsonb
WHERE id = 'cmru8bfju007i1yd66oc9xwk3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_408$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_408$::jsonb
WHERE id = 'cmru8bgaz007r1yd63ao3vizd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_409$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_409$::jsonb
WHERE id = 'cmru8hwlj00a71yd6ibei12x2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_410$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_410$::jsonb
WHERE id = 'cmru8hww100aa1yd6cgdqk0bb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_411$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_411$::jsonb
WHERE id = 'cmru8hy7800an1yd6b0j84twz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_412$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_412$::jsonb
WHERE id = 'cmru8hzhk00b01yd6a3yltdaj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_413$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_413$::jsonb
WHERE id = 'cmru8hzot00b21yd65o877mfc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_414$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3_414$::jsonb
WHERE id = 'cmru8i03d00b61yd65a7p66su' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_415$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_415$::jsonb
WHERE id = 'cmru8i0hd00ba1yd65d6ultd6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_416$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_416$::jsonb
WHERE id = 'cmru8i0ku00bb1yd6qtsqhs04' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_417$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_417$::jsonb
WHERE id = 'cmru8i0oa00bc1yd6pb9cfq07' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_418$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_418$::jsonb
WHERE id = 'cmru8v27h00031y0sktphy9f4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_419$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_419$::jsonb
WHERE id = 'cmru8v2d800051y0s2qfcjr0j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_420$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). In the emergency department, give systemic corticosteroids for moderate or severe asthma exacerbations and for patients who do not respond completely to initial SABA therapy.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_420$::jsonb
WHERE id = 'cmru8v2g200061y0swlguuklp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_421$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_421$::jsonb
WHERE id = 'cmru8v3kq000k1y0s3yol19lz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_422$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_422$::jsonb
WHERE id = 'cmru8v3ti000n1y0sngq0kuss' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_423$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_423$::jsonb
WHERE id = 'cmru8v4ax000t1y0sh8a9c8kp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_424$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_424$::jsonb
WHERE id = 'cmru8v5zz001e1y0svcqdi8qu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_425$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_425$::jsonb
WHERE id = 'cmru8v65p001g1y0sstwa9b5r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_426$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_426$::jsonb
WHERE id = 'cmru8v6bf001i1y0s0m4ci4s3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_427$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_427$::jsonb
WHERE id = 'cmru9cuvv006l1y0sja2mlptc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_428$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_428$::jsonb
WHERE id = 'cmru9cv4b006n1y0sqtl4wiwq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_429$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_429$::jsonb
WHERE id = 'cmru9cvli006r1y0s8rgp1pny' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_430$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_430$::jsonb
WHERE id = 'cmru9cwfn006y1y0s2v1zz355' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_431$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_431$::jsonb
WHERE id = 'cmru9cwsn00711y0s9ypdqyb4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_432$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_432$::jsonb
WHERE id = 'cmru9cxdw00761y0sbz2hz8lp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_433$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_433$::jsonb
WHERE id = 'cmru9cxi500771y0siq428k3l' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_434$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_434$::jsonb
WHERE id = 'cmru9cykp007g1y0sz587ou9i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_435$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3 (2007). Exacerbations of asthma are acute or subacute episodes of progressively worsening shortness of breath, cough, wheezing, and chest tightness, or some combination of these symptoms.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_435$::jsonb
WHERE id = 'cmru9d0je007s1y0soahjrsly' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_436$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_436$::jsonb
WHERE id = 'cmru9isci00aa1y0swvf4ulzv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_437$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_437$::jsonb
WHERE id = 'cmru9isgv00ab1y0spklnb6ee' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_438$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_438$::jsonb
WHERE id = 'cmru9itnv00al1y0sprdz4reb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_439$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_439$::jsonb
WHERE id = 'cmru9iui400as1y0s6gjuawbj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_440$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_440$::jsonb
WHERE id = 'cmru9iume00at1y0snfkwu82w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_441$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_441$::jsonb
WHERE id = 'cmru9iuqr00au1y0sb1ioayyj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_442$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_442$::jsonb
WHERE id = 'cmru9ivpg00b21y0srrts1f07' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_443$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_443$::jsonb
WHERE id = 'cmru9ivy300b41y0s407quyxs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_444$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_444$::jsonb
WHERE id = 'cmru9iw2g00b51y0syr21h0cl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_445$[{"label": "FDA prescribing information. Simvastatin's label warns of myopathy.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00896fff-081d-4553-be8c-1999a8a73dda"}]$s3_445$::jsonb
WHERE id = 'cmruieabl000y1ycesoxp6bpl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_446$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_446$::jsonb
WHERE id = 'cmruiealb00111yce5jc9mar2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_447$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_447$::jsonb
WHERE id = 'cmruiepds00151yce0mdlaa4q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_448$[{"label": "FDA prescribing information. Simvastatin's label warns of myopathy.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00896fff-081d-4553-be8c-1999a8a73dda"}]$s3_448$::jsonb
WHERE id = 'cmruieph500161ycew5tufmoh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_449$[{"label": "FDA prescribing information. Lisinopril's label warns of angioedema.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00b266d9-ac4a-e931-e063-6294a90a6a0b"}]$s3_449$::jsonb
WHERE id = 'cmruiepkg00171ycewl86y5bk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_450$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_450$::jsonb
WHERE id = 'cmruifz9k001u1ycepxwl07yp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_451$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_451$::jsonb
WHERE id = 'cmruihebo002p1yce7yr1k1pt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_452$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_452$::jsonb
WHERE id = 'cmruii0mt00351yce0kmjdjxt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_453$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_453$::jsonb
WHERE id = 'cmruygp34001n1y2y9p2kswfw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_454$[{"label": "FDA prescribing information. Lisinopril's label warns of angioedema.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00b266d9-ac4a-e931-e063-6294a90a6a0b"}]$s3_454$::jsonb
WHERE id = 'cmruygp8i001p1y2yxpvz9jp4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_455$[{"label": "FDA prescribing information. Atorvastatin's label warns of myopathy.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00afce9b-48c9-487a-a738-e359c005c707"}]$s3_455$::jsonb
WHERE id = 'cmruygpbb001q1y2yske6eipu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_456$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_456$::jsonb
WHERE id = 'cmruyh0lu001s1y2yw1a6gvmr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_457$[{"label": "FDA prescribing information. Isotretinoin has a boxed warning for severe birth defects in pregnancy.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0114567b-3bac-490d-b9eb-03a6c5d90935"}]$s3_457$::jsonb
WHERE id = 'cmruyh0u5001v1y2yq8xlcsh6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_458$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_458$::jsonb
WHERE id = 'cmruyh0ww001w1y2yebi0z0z7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_459$[{"label": "FDA prescribing information. Gentamicin's label warns of ototoxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=09cf88af-59da-f147-e063-6294a90aac99"}]$s3_459$::jsonb
WHERE id = 'cmruyh0zp001x1y2yy2hp0tir' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_460$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_460$::jsonb
WHERE id = 'cmruyhcx300201y2ya2zl1fs9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_461$[{"label": "FDA prescribing information. Lisinopril's label warns of angioedema.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00b266d9-ac4a-e931-e063-6294a90a6a0b"}]$s3_461$::jsonb
WHERE id = 'cmruyhczs00211y2yfmgfqro1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_462$[{"label": "FDA prescribing information. Warfarin's label warns of bleeding.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0cbce382-9c88-4f58-ae0f-532a841e8f95"}]$s3_462$::jsonb
WHERE id = 'cmruyhd2j00221y2y9djkb9zc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_463$[{"label": "FDA prescribing information. Atorvastatin's label warns of myopathy.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00afce9b-48c9-487a-a738-e359c005c707"}]$s3_463$::jsonb
WHERE id = 'cmruyhdak00251y2y4jfcqmzh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_464$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_464$::jsonb
WHERE id = 'cmruyhdg000271y2yrqrzhksd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_465$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_465$::jsonb
WHERE id = 'cmruyhql5002c1y2ydk48htwp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_466$[{"label": "FDA prescribing information. Lisinopril's label warns of angioedema.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00b266d9-ac4a-e931-e063-6294a90a6a0b"}]$s3_466$::jsonb
WHERE id = 'cmruyhqns002d1y2yxb5vgbf9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_467$[{"label": "FDA prescribing information. Warfarin's label warns of bleeding.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0cbce382-9c88-4f58-ae0f-532a841e8f95"}]$s3_467$::jsonb
WHERE id = 'cmruyi0jr002i1y2y80rie5s6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_468$[{"label": "FDA prescribing information. Lithium's label warns of lithium toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=01c4facd-ed79-4078-ba33-2044de372d0f"}]$s3_468$::jsonb
WHERE id = 'cmruyi0mm002j1y2y4fismx2d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_469$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_469$::jsonb
WHERE id = 'cmruyih2c002n1y2yksno0rja' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_470$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_470$::jsonb
WHERE id = 'cmruyiuyr002s1y2y0bk2sa4h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_471$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_471$::jsonb
WHERE id = 'cmruyj6gr00301y2ydrl1f1d2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_472$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_472$::jsonb
WHERE id = 'cmruyly0t004m1y2yygubc9bm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_473$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_473$::jsonb
WHERE id = 'cmruymbnm004q1y2y4r1ppph2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_474$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_474$::jsonb
WHERE id = 'cmruyn1yp00561y2ylgm058z8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_475$[{"label": "Evans L et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. For adults with possible septic shock or a high likelihood of sepsis, administer antimicrobials immediately, ideally within 1 hour of recognition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8486643/"}]$s3_475$::jsonb
WHERE id = 'cmrvm5z3h001kjw04iwhbev9b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_476$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_476$::jsonb
WHERE id = 'cmrvwnde6000h1ye8i393wg3h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_477$[{"label": "FDA prescribing information. Lisinopril's label warns of angioedema.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00b266d9-ac4a-e931-e063-6294a90a6a0b"}]$s3_477$::jsonb
WHERE id = 'cmrvwndjv000j1ye83wghw9xi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_478$[{"label": "FDA prescribing information. Digoxin's label warns of digoxin toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=03612934-62f4-4002-85af-6c66cd172acb"}]$s3_478$::jsonb
WHERE id = 'cmrvwndy4000o1ye8unhf5gq1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_479$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_479$::jsonb
WHERE id = 'cmrvwnv91000p1ye8vcthvl1w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_480$[{"label": "FDA prescribing information. Lisinopril's label warns of angioedema.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00b266d9-ac4a-e931-e063-6294a90a6a0b"}]$s3_480$::jsonb
WHERE id = 'cmrvwnveh000r1ye8ipfzgy96' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_481$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_481$::jsonb
WHERE id = 'cmrvwnvhc000s1ye8x75hgju7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_482$[{"label": "FDA prescribing information. Amiodarone's label warns of pulmonary toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=02f4a736-63ed-4ad4-a1f1-b21a71e928bd"}]$s3_482$::jsonb
WHERE id = 'cmrvwo88j000y1ye8f17pg8hj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_483$[{"label": "FDA prescribing information. Rivaroxaban's label warns of bleeding.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=10db92f9-2300-4a80-836b-673e1ae91610"}]$s3_483$::jsonb
WHERE id = 'cmrvwo8ji00121ye8ly32jisv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_484$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_484$::jsonb
WHERE id = 'cmrvwolef00141ye8fu92p55e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_485$[{"label": "FDA prescribing information. Lithium's label warns of lithium toxicity.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=01c4facd-ed79-4078-ba33-2044de372d0f"}]$s3_485$::jsonb
WHERE id = 'cmrvwolpg00181ye8h4exrhtl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_486$[{"label": "FDA prescribing information. Metformin has a boxed warning for lactic acidosis.", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0098dec4-f0e5-45d5-8aa4-5d0faf9ab142"}]$s3_486$::jsonb
WHERE id = 'cmrvwp52m001h1ye8yhxe1au1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_487$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_487$::jsonb
WHERE id = 'cmrvwq47b001p1ye81cg7l4q6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_488$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_488$::jsonb
WHERE id = 'cmrvwq4ft001s1ye84l2y0ikv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_489$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_489$::jsonb
WHERE id = 'cmrvwqxri00251ye8dqymisa8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_490$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_490$::jsonb
WHERE id = 'cmrvwrcnz002c1ye8aayfs9z4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_491$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_491$::jsonb
WHERE id = 'cmrvwvp9q004p1ye8hapcpuzo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_492$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_492$::jsonb
WHERE id = 'cmrvww3lv00531ye8042otij0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_493$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_493$::jsonb
WHERE id = 'cmrvwwj6y00591ye83y9d81vz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_494$[{"label": "GOLD 2025 pocket guide, management of exacerbations: short-acting inhaled beta2-agonists, with or without short-acting anticholinergics, are the initial bronchodilators to treat an exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_494$::jsonb
WHERE id = 'cmrvwx03e005k1ye8gmzvwzlv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_495$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_495$::jsonb
WHERE id = 'cmrw9zvrf000d1ynhzxlqiop8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_496$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_496$::jsonb
WHERE id = 'cmrwa0a22000g1ynhiqt30fj1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_497$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_497$::jsonb
WHERE id = 'cmrwa0xz1000w1ynh8boviep2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_498$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_498$::jsonb
WHERE id = 'cmrwa1kkm001c1ynhu8yhdh6i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_499$[{"label": "GOLD 2025 pocket guide, management of exacerbations: in severe exacerbations, systemic corticosteroids can improve lung function and oxygenation and shorten recovery. Duration should not normally be more than 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_499$::jsonb
WHERE id = 'cmrwa1kv5001f1ynhxy5zsc8h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_500$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_500$::jsonb
WHERE id = 'cmrwa1kyj001g1ynht1kzxvcu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_501$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_501$::jsonb
WHERE id = 'cmrwa1ywv001n1ynhwrkj3lkh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_502$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_502$::jsonb
WHERE id = 'cmrwa29yv001s1ynhhjstzxh8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_503$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3_503$::jsonb
WHERE id = 'cmrwa2lo600231ynhxpyvb44z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_504$[{"label": "ACR Appropriateness Criteria. Right Upper Quadrant Pain. Revised 2022. Ultrasound of the abdomen is usually appropriate for initial imaging of right upper quadrant pain of unknown etiology and of suspected biliary disease.", "url": "https://acsearch.acr.org/docs/69474/Narrative/"}]$s3_504$::jsonb
WHERE id = 'cmrwa3gmw002r1ynh9vrqpjx3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_505$[{"label": "National Heart, Lung, and Blood Institute. Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma (2007). SABAs are the drug of choice for treating acute asthma symptoms and exacerbations. Albuterol is a SABA.", "url": "https://www.nhlbi.nih.gov/sites/default/files/media/docs/asthgdln_1.pdf"}]$s3_505$::jsonb
WHERE id = 'cmtpx6dgk000m1ymu0xqsvvjv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_506$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_506$::jsonb
WHERE id = 'cmtpx6dzv000t1ymu6ohaoc5z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_507$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_507$::jsonb
WHERE id = 'cmtpx8r53002s1ymu7symgg49' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_508$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_508$::jsonb
WHERE id = 'cmtpx8rx700321ymu9rb53t4h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_509$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_509$::jsonb
WHERE id = 'cmtpx8svv003c1ymut2pbk1f2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_510$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_510$::jsonb
WHERE id = 'cmtpxc4cr004i1ymu26zu03oa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_511$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_511$::jsonb
WHERE id = 'cmtpxc4ml004l1ymuhzn7uu1c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_512$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_512$::jsonb
WHERE id = 'cmtpxc4v7004o1ymue4k9g279' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_513$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_513$::jsonb
WHERE id = 'cmtpxc5wf00511ymux0w84hfl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_514$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_514$::jsonb
WHERE id = 'cmtpxc6iq00591ymub6okoxkc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_515$[{"label": "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An official ATS/IDSA clinical practice guideline. Am J Respir Crit Care Med. 2019. Empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of the initial serum procalcitonin level.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3_515$::jsonb
WHERE id = 'cmtpxc6lk005a1ymuoynwlet9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_516$[{"label": "GOLD 2025 pocket guide: an exacerbation of COPD is an event of dyspnea and/or cough and sputum that worsen over less than 14 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_516$::jsonb
WHERE id = 'cmtpxc6oc005b1ymu5o1q42d6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_517$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_517$::jsonb
WHERE id = 'cmtpxc6zk005f1ymuzkga8euu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_518$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_518$::jsonb
WHERE id = 'cmtpxgsd4007c1ymuuhvq43bq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_519$[{"label": "GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3_519$::jsonb
WHERE id = 'pltaa4572f3bf1ae2e3bd9b1462' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3_520$[{"label": "Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/"}]$s3_520$::jsonb
WHERE id = 'pltbab0c590fd0f04d9a014cada' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3_20261113_backup b ON b.id = q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 521 THEN
    RAISE EXCEPTION 'rows with a citation URL %, expected 521', n;
  END IF;
END
$cited$;
COMMIT;
