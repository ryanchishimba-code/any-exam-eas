-- Add checked citations to served USMLE items that had no real source, 2026-11-13.
-- Backup qbi_usmle_refs_20261113_backup (1316 rows) is created first.
-- Only the references column is updated.
-- Undo: scripts/undo-usmle-refs-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr97c4wd000p1ywyxm4tbtqv',
    'cmrvwndvb000n1ye8mgl8ex4f',
    'cmrvwtucd003o1ye87roun8ma',
    'cmr996ixd00qx1ywytfd0i8ry',
    'cmrpwg4r900b91yluo59ln70n',
    'cmr4bvexm00ee1ykyvhuz4wm0',
    'cmr4cbxwf00lc1ykyftg4o517',
    'cmr4d3tnw00ui1ykyxstnqgd1',
    'cmr4dbau300xk1ykyf1gzu1mj',
    'cmr4e6hiv01ay1ykygu2ka6c6',
    'cmr8fz9yc01o11ylowkuj5rqo',
    'cmr4exrjz01ky1ykymj9wyh08',
    'cmr4fl1d401vb1yky7cr0g604',
    'cmr891ear00y31yr94zleo1ar',
    'cmr8atubp000d1ylo2ma3igmc',
    'cmr8cn87h00n51ylo4x948lcc',
    'cmr8dyovq014q1ylod2qhmcsk',
    'cmr8h1ej801x11ylocopcky02',
    'cmr8f2l4l01gw1ylowbd539lw',
    'cmr8i0co1027n1yloiw329jvw',
    'cmr8j9seo02ko1ylocdw6yw9k',
    'cmr8juli8001g1ygiuo5p07q5',
    'cmr8q42we01jo1ygi9kyluome',
    'cmqkgntkw0gj9l304obyavrr7',
    'cmqkgntsz0gshl304k6smnd6g',
    'cmr9bbuv401eh1ywyza3o9hdr',
    'cmr9bbtxr01e81ywyqtakugmu',
    'cmr98vr1s00ou1ywyc23xywjl',
    'cmr98dlhl00hg1ywy2ioud8g8',
    'cmr98mp7000li1ywyk2229213',
    'cmr8o9kex01471ygihbxt1f25',
    'cmr9c39aj01oo1ywy287d5l47',
    'cmr9c35f701nc1ywyhco23a5s',
    'cmr4outie00nb1y1e4k1olaxv',
    'cmr88v5qp00h11yw2i9gf53jp',
    'cmr88v5zi00h41yw2hxeyxf8h',
    'cmr89p2aa00nd1yw2putzmq22',
    'cmrpvuwkz000b1yh5bg9zfm2j',
    'cmrpvywau000k1yrtk6ew6eg1',
    'cmr88v41500gg1yw2jrove8p8',
    'cmrpwcl1s00591yrtrzohqlb9',
    'cmrruxvf400mf1y8w8d8potpm',
    'cmrruxvvq00ml1y8wudn5c374',
    'cmqkgnt6k0g36l304f3ojegq0',
    'cmr8br7v100b61ylofo8mjxde',
    'cmrpvuvhf00001yh5rfwkxq5t',
    'cmr8h1eu301x41ylo6x216ssq',
    'cmr8i09fv026j1ylo0b8evtbr',
    'cmr8i0atf02701ylor1fnk1jm',
    'cmr8lqj1r00dn1ygi8zqymhan',
    'cmrr4t33o00101y6p49ku3v47',
    'cmr8m9c4i00kb1ygi8r9a7gmy',
    'cmr8pgvpp01da1ygigjhixcsm',
    'cmrtffilm00041yx2x78vkop8',
    'cmr9861eq00dv1ywyhzybwcxd',
    'cmr9861kb00dx1ywyicisxoa6',
    'cmr9a11fx010s1ywyu9iva4kb',
    'cmr9buxpu01jw1ywyr3k2w0np',
    'cmr9c9rmu01rz1ywyuprzm28d',
    'cmr9c9rua01s11ywy8cpzzy4j',
    'cmr9c9ry001s21ywyagjul648',
    'cmru7tlkp000x1yd6rrfzqpxn',
    'cmr4bge59006q1ykykq020blr',
    'cmrth104n002h1yaxo07scavk',
    'cmrth8blj005j1yaxh0yln5ui',
    'cmrvwu6wm003z1ye8d8ygthwa',
    'cmr8dylpr013v1yloe5tmc1fm',
    'cmru3gaif009z1y7wwjas0oe0',
    'cmrvm5ur3000djw04lrmdhb5i',
    'cmr8lyy7v00gd1ygina58flro',
    'cmr8lyz9s00gm1ygiv9xtdv47',
    'cmr4b2zg600051ykya3d9zy0z',
    'cmr4bnxh500ay1ykyj9f13da0',
    'cmr4b30js000e1ykyrxb7cyyc',
    'cmr4cns2700nq1ykyhefb0z7h',
    'cmr8al9dh019r1yr9e6v1qsbe',
    'cmrrtw4q3009a1y8wadr1arj2',
    'cmr8o9jrq013z1ygiw9o7ktnb',
    'cmrvwq4a2001q1ye8ytwfwgp4',
    'cmr4dbf5n00yn1ykyf2p870jc',
    'cmr8e5wp001701ylo4shg0vz6',
    'cmr8dqa38010c1yloo7og3dqu',
    'cmru8hx8600ad1yd6fw1ug5sd',
    'cmru8hy3r00am1yd6obqnp188',
    'cmr4cbxk600l81ykyrakxkth4',
    'cmr8esq1301el1yloemhrbyiv',
    'cmr4e6n8t01c31yky50zo0l0x',
    'cmr4g0ss1021m1ykyxt71666t',
    'cmr8hrqv702371ylov1bftfpk',
    'cmr8hrsc5023p1ylov99u7mka',
    'cmr4bnxmo00b01ykyjdjh874h',
    'cmr4cnvci00om1yky85zv4w4k',
    'cmr8hrunm024i1yloxjbyaeon',
    'cmr8hruqk024j1ylorka52fqv',
    'cmr4enjp801ig1yky9pz3sgcx',
    'cmr4fdhuv01rw1ykylsqfr4q2',
    'b8xcca14c19dc872b3f3e6727a6',
    'cmrrvrs70009p1yl85w8x4g1z',
    'cmr4f6anj01ou1yky8hytcq75',
    'cmr4f6d5z01pq1ykyw1yslked',
    'cmr8atw27000u1yloxt4nulc6',
    'cmr8ayp5y00w01yw2yyc5dhr2',
    'cmr4fdgs101ro1ykyvt9rmmv0',
    'cmr4fdmp701ss1ykyeyralau3',
    'cmr8dyk64006f1yazpoo3jj5a',
    'cmruymlxk00511y2yhngg37dc',
    'cmr8atxi500181ylo9ys00m12',
    'cmr8bxxy900dp1yloo2h0pm3c',
    'cmrpvdrvy002v1ync9xfkj9ly',
    'cmrpvuwez00091yh5usm0zapn',
    'cmr8bxyy500dz1ylowuof2dyu',
    'cmr8c3m4c00h01ylo125anrk7',
    'cmr8c3nhw00he1ylorpfyf5nc',
    'cmrpw7axv004o1yh5wz3vogyp',
    'cmr31dkqm00bjjs04zo5enxhn',
    'cmr8bhh6700701ylokvfnuffd',
    'cmrpwfeky006q1yh514oz0bai',
    'cmrvwp55d001i1ye8pseyjqam',
    'cmr8bhjex007n1ylox49ckkij',
    'cmr8br41m009v1ylomfv5a2tg',
    'cmrrt9uja000w1y8wxi07vth9',
    'cmrrtf487002l1y8w8l7b4u0z',
    'cmrrtf7g000331y8wo9jyrp0l',
    'cmr4dbfk300yr1ykyrbbkpi7b',
    'cmr8cn8fz00n71ylozobtnxsg',
    'cmrrutcod00jg1y8w1q2aanz4',
    'cmr8cn9j200nk1ylooo4egchu',
    'cmr8dyley013s1yloa0quljvm',
    'cmr4bny6b00b71ykyuktag3db',
    'cmr8dihcg00xi1ylo98i87ufz',
    'cmr8ehyog01a21ylof4c4dqo4',
    'cmr8e5xh4017a1yloxmfhfjc1',
    'cmtps7ts300021y1q58rll5ja',
    'cmtps7umi000d1y1qp7r1cpbk',
    'cmtps7v5q000k1y1qbk65wsql',
    'cmtpsb1hc00351y1qgtoh6kbi',
    'cmtpsb1pw00381y1qxxpvgm0f',
    'cmr8dq8pg00zz1ylotk1jzmlr',
    'cmtpwlglx001f1y6hdia05c16',
    'cmtpwsq3z004v1y6hvs1apdl1',
    'cmr8gr3ly01ti1ylomxvle06f',
    'cmtpx3e8u00as1y6ha53ax9wh',
    'cmtpx6cp3000c1ymut030nem5',
    'cmq9fiiw600281yrw4h68g2wi',
    'cmtpx8ro1002z1ymuoc4ls2jr',
    'cmtpxc56q004s1ymu3mwj3o2m',
    'cmtpxc64u00541ymuslece2ib',
    'cmtpxc6ai00561ymu9q7sdawl',
    'cmtpxc6d700571ymu2bgx3aj5',
    'cmtpxgqjq006p1ymu0dyvfune',
    'cmtpxgt0h007k1ymuun96ak2w',
    'cmtpx6c1800041ymun76ruy28',
    'cmtpx6cgi00091ymusgxo4mar',
    'cmtpx6db0000k1ymuabgcuvwm',
    'cmtpx6dje000n1ymugzh7sbmr',
    'cmtpx8pr4002a1ymu7rmh7tmm',
    'cmtpx8pu0002b1ymumoy5ecvy',
    'cmtpx8si000371ymuv9h345m8',
    'cmr8fz86001nf1yloi3ba7v0x',
    'cmtpxc5zc00521ymuo7edj7jg',
    'cmr869j2n003o1yr9zlrr5ey9',
    'cmr869lly004e1yr90inc8fnz',
    'cmr86yb9m00ad1yr9lu4kc6pk',
    'cmr877ith00d61yr97jxju299',
    'cmr87j3mb00hi1yr9q1j0txoi',
    'cmr87sm7t00ka1yr9o5hflhfj',
    'cmr88rzo700t51yr9j7w9tf9z',
    'cmrpvqa5l000r1ylusk1uiew1',
    'cmr98mlcs00kf1ywyfbc8inwq',
    'cmr4hb0bx003u1ydee95uw2nh',
    'cmrpw5z1l00791ylum6doi011',
    'cmrpwg4x000bb1yluk0nzqgl4',
    'cmrqhnxx8004u1ypxafpotgc2',
    'cmrqhwjkn006n1ypxkfg04cjk',
    'cmr86y8pw009j1yr9awm48k2v',
    'cmr877j8500db1yr9j3fk3m85',
    'cmr877lil00e31yr9g4a1w59g',
    'cmrrbw668000al1045c6t4bfj',
    'cmrrvb5iv00021yl8s7q9jz7y',
    'cmrrvb7u4000m1yl8vf4om34g',
    'cmrrvfk8c00331yl8falfxkmv',
    'cmr8baixa00491ylo5e7n5leu',
    'cmr88s1bh00tk1yr9h61conmp',
    'cmr88s2v000tz1yr9644hpxxn',
    'cmr8cnatd00nz1ylo3wtx8tj7',
    'cmr8cnbhf00o71yloefnaenyb',
    'cmrrvfi3w002c1yl834t2p6y4',
    'cmrrvjj2a004x1yl8rqvycdb5',
    'cmrrvjjqs00561yl82q2u5hs4',
    'cmrrvjjtj00571yl89bztaz8j',
    'cmr8d1xu400r61ylosz4kazeu',
    'cmrrvrstc009x1yl8wsesf2li',
    'cmrrvvlhe00bv1yl8m9u1ik3w',
    'cmrrvvmh200c51yl8hy7tlusn',
    'cmrrvvmyt00ca1yl8q7y3erhf',
    'cmrrvzt6f00dj1yl8apx0yt7w',
    'cmrrvzua600du1yl8yupyrosl',
    'cmrrvzwqm00ee1yl82dsbq8rz',
    'cmrrw4wv300ft1yl89pfkigit',
    'cmqatq0vh00011y8fmanl6b1v',
    'cmrsf7cl400041ynyeh6lo21j',
    'cmrsf7e75000o1ynynnzm6g3p',
    'cmrsf7ezn000y1yny9b0hwlgp',
    'cmrsfgn5700511yny1hwg9imh',
    'cmrtexh9e00031y30zwrmkk2l',
    'cmrtggbui00511ydw4nm7y0jv',
    'cmrtq0tko00151yqcbytfl73e',
    'cmrru3pgj00b11y8w6ws90bzd',
    'cmrtq0tsy00181yqc82nu3o2u',
    'cmr8nmkq400xj1ygifwrv2uvu',
    'cmr8nmjiu00x31ygifx0dj697',
    'cmrtq0utu001l1yqclrgeogt3',
    'cmr891bt700xe1yr9sqnimwxj',
    'cmrpv8h3y000n1yncv9i0ahxw',
    'cmrtq0vq8001w1yqcukr2aqqt',
    'cmrtq47mr00231yqcvuot8q66',
    'cmru6qtbb000zl104yo7vvuu3',
    'cmru6qyus002ml1046skcnxf2',
    'cmra6lumu001cic04228wdvu1',
    'cmrrvrre7009f1yl8hh449m8z',
    'cmrsfd2f9002t1ynyuy2htdzf',
    'cmrrvzwkg00ed1yl8cikzum4x',
    'cmrrvjjle00541yl87zgjh9zr',
    'cmrrvzuh700dw1yl87cbt308d',
    'cmrrw4ygl00gd1yl837mqw41d',
    'cmrsf7d6b000b1ynyf3txgw70',
    'cmrsfd35x00321ynyq5erb2w2',
    'cmrrutjmy00k11y8w8rsbikq1',
    'cmrtexhc500041y30hhoy053m',
    'cmrtexhso000a1y308dxu5y08',
    'cmrpw5x6n006r1ylub7az0f99',
    'cmrrvrt1q00a01yl8v0pza8d9',
    'cmrrvvjjc00bb1yl828ujkpry',
    'cmrvm5uug000hjw04evu9rxch',
    'cmrvm5v0k000ojw04ergbaapy',
    'cmrtf2nsm000i1y30soxk5pqq',
    'cmrvm5z58001ljw04yfpwleqr',
    'cmr8h1dj201wr1ylofb0xmotd',
    'cmrtffk0n000m1yx2cxfr4qbk',
    'cmruigm7z002a1yceb6k9yblp',
    'cmr8bajfl004e1ylotf1ok4sl',
    'cmr8attlx00061ylodqjcfjt1',
    'cmr88ig3n00r31yr9w5bdh1jf',
    'cmr97yyc000a81ywy54azqxea',
    'cmrsf7cf200021ynyv1inzjvs',
    'cmtps7vlx000q1y1qbgf1736n',
    'cmr8ccixu015u1yw27x7n8vmm',
    'cmr8hgdio01zr1ylowsn7eutp',
    'cmqkgnpux0d44l304j75w0xkt',
    'cmrtg5x3c000f1ydwev9hwge6',
    'cmrtg5xrn000m1ydwfjyb9dvt',
    'cmrpw16vr002c1yh5w7go8jci',
    'cmr8h1hvt01xy1ylotwg09xo6',
    'cmr8fhgct01kd1yloapv5i1ai',
    'cmrtg5yl1000u1ydwjin4p8ir',
    'cmr8fhgge01ke1ylo1bun8o4y',
    'cmr8hgdtk01zu1ylo9iync6zm',
    'cmr8gr4um01ts1ylohatysv7x',
    'cmr8lc7c700ah1ygikzpf6hrj',
    'cmr8i09ri026n1ylo3az1g35m',
    'cmrtggacx004i1ydwmyt7stto',
    'cmrtggcmf005b1ydwl40cjzda',
    'cmr8i0d89027u1ylod5x254zb',
    'cmrtgretg00011yaxn04szz17',
    'cmrpwiwhl006s1yrtbq99x5to',
    'cmrth12gx00351yax3c3zxwer',
    'cmr8ny4bj00zt1ygiqodyrdmo',
    'cmpnjj36j07w51ymx4b4rtr6u',
    'cmr8nclvk00sx1ygib22r7ztk',
    'cmr8ise6m02dz1yloeekf118g',
    'cmr8mlut000nc1ygixl2top8k',
    'cmr8nmjda00x11ygiqiqsoarl',
    'cmr8isewr02e81yloiha5ec50',
    'cmr8m9e3q00kl1ygi951z3s0r',
    'cmr8isf8802ec1ylojol6110m',
    'cmr8ncpxx00u31ygi52vnpn18',
    'cmr8isfb702ed1ylo7pl7fdsl',
    'cmr8ncqmg00ua1ygisvplxmr3',
    'cmr8ncqps00ub1ygifjmb5mlr',
    'cmr8ny2jl00zf1ygisz8br5k7',
    'cmr8ny3g700zi1ygilkhdcvul',
    'cmr8ny3m000zk1ygil72v7tc4',
    'cmr8ny3x400zo1ygifc8a2ryr',
    'cmr8j0pyi02hm1ylogd0eu4uu',
    'cmr8pgw1301de1ygivkxdjl7r',
    'cmr8i0d2j027s1ylofq4f2n1d',
    'cmr8j9qvh02k91yloc8af3km5',
    'cmr8j9tfj02ky1ylobb4mia77',
    'cmrrvb5fa00011yl8hjnl3bum',
    'cmr8ji5xv02mt1yloj7ldq2hr',
    'cmqgt4x0s001s1y0qw045inxd',
    'cmr8kib4m004h1ygimrrbrwjt',
    'cmr8qfp3o01mv1ygicgatckko',
    'cmr8qfolu01mp1ygi3xv99s42',
    'cmr8pvevi01g71ygilqis6p0r',
    'cmr8pvegy01g31ygilmtxnlgn',
    'cmr8q42z701jp1ygigchkuf4n',
    'cmr8om8tl016p1ygiy3pjezpk',
    'cmr8om8o5016n1ygi6sd6mkxi',
    'cmr8pvfyb01gi1ygi0w66fd4c',
    'cmr8lc8d600at1ygieyd41gjd',
    'cmru8v47w000s1y0sinwtm2ch',
    'cmrpvvhbe002v1yluev871nbz',
    'cmru8hzzt00b51yd6jysdbuyj',
    'cmrrtw5c2009b1y8wop1p6s06',
    'cmr8juj9x000p1ygisem270rj',
    'cmqxc0rrq00001ymanik9okns',
    'cmra6lz8a003iic04ij3n3o86',
    'cmrqhwl1000711ypx1hwby2p5',
    'cmr4cbu7400k41ykyjq3c6052',
    'cmr4e6ict01b61ykyq8xv5dst',
    'cmr8j9o4i02jj1ylobnyvaetx',
    'cmr8q43ah01jt1ygifgdinpkr',
    'cmr8q434v01jr1ygi93iwgd7s',
    'cmqkgnt1x0fwyl3040lqy4lls',
    'cmr8lc8lo00aw1ygil6fip7uy',
    'cmqkgnt4n0g08l3048nk6vvei',
    'cmr8fzav301oc1ylotoch5jkz',
    'cmr8f2kkf01gp1yloitu3463j',
    'cmr87iymk00g71yr94e13168x',
    'cmr88v2sw00g11yw2nmd0cwb2',
    'cmr8m9b0t00jx1ygi8nv85vff',
    'cmr4o9foz00jh1y1e3t61eg0g',
    'cmr88v3v600ge1yw2h50v2k0k',
    'cmr8ncmnt00t51ygieh5qfygv',
    'cmr88v6gs00ha1yw2hih2ueao',
    'cmqxcjw5y004f1ymaveo6m6p2',
    'cmr89p2gc00nf1yw2nqs5woh7',
    'cmqxc0snh000a1ymapbq4iqaw',
    'cmr8br6tm00at1yloq9emqqvx',
    'cmr4n53d300dl1y1eluzsx0zg',
    'cmr89b0dj00jc1yw2po8n1ns4',
    'cmr4cbybm00lh1yky41k36nlz',
    'cmr86y31r006e1yw2kp5bgnqp',
    'cmr86y35f006f1yw2l111b3qx',
    'cmr97c5oz000x1ywy3oi6vvwp',
    'cmr86y5zh00761yw2fv9unpfe',
    'cmr8dqazl010k1ylo9wfgggi8',
    'cmr86y7iq007l1yw2o93oz2b0',
    'cmr88v3jb00ga1yw2x35g4bl2',
    'cmr88v3y800gf1yw2u5avtqeu',
    'cmrpvdq8x002a1yncbosbsl9o',
    'cmr89ozjf00mg1yw2pq4hg9yk',
    'cmr89ozpn00mi1yw26rz620jk',
    'cmr89p21c00na1yw2e7d0qoc0',
    'cmr8ei29901ba1yloueuupk3q',
    'cmr8dynv0014g1yloiounm7jw',
    'cmr89p42t00nr1yw2im7ty8fr',
    'cmr8o9jxe01411ygiqdrbuvd5',
    'cmr86y40t006n1yw2tugb6bcx',
    'cmr8by3ha012u1yw2pub0g2d9',
    'cmr8by4yy013c1yw20y3qov49',
    'cmr88g3ci00cv1yw2kgohlebw',
    'cmr88v31u00g41yw26orcr29q',
    'cmr8om7hu01681ygiikhal5g3',
    'cmr8bg0gn00zn1yw24zhf97qt',
    'cmr8bg2gm010b1yw2lofqd344',
    'cmr4e6hml01az1ykyekoa3nge',
    'cmr8cchpv015l1yw2zhdy4tst',
    'cmr8j0n9k02gp1ylo9pe1ge59',
    'cmr8hruff024f1yloqzu9dwdi',
    'cmr8adzg300to1yw2m9ni51xp',
    'cmr8d6fbh000i1yaztwvty1wy',
    'cmr8p26zf019u1ygioitrmyzm',
    'cmr9bbw3s01et1ywyjooazm6b',
    'cmr8q40ra01ix1ygiwfq4dosd',
    'cmrpv8g2q000a1ynchv8n63v1',
    'cmrpv8gb3000d1ync1mtkzksg',
    'cmrpv8h0x000m1yncd5k61ych',
    'cmrrvnj8c006u1yl89n5wal0s',
    'cmrpvdse200311yncisa4v5u7',
    'cmruymcbq004x1y2yoo902s62',
    'cmr9862tq00ed1ywyw9a9c2ln',
    'cmr8pvczx01fo1ygiehtmutsc',
    'cmr4f6ahn01os1yky33wml47s',
    'cmr8bahzm00401yloyj3qezlg',
    'cmrpvyums00001yrtqwmbr8ah',
    'cmrpvyvkh000b1yrttw4rwkyo',
    'cmr8clr6j019m1yw2pu9j8hic',
    'cmr8pvfgt01gd1ygi091v4b2x',
    'cmr8dn6fi004j1yazxqtiyt9x',
    'cmr8dyj9300661yazlsdfzzlp',
    'cmr8qfnsm01mf1ygia5a3smbw',
    'cmr8dyn44007f1yazlcsvybiy',
    'cmr8ei24j009v1yaz69j39mkj',
    'cmr4eemzp01fo1ykyelja5rjs',
    'cmr8qfqgt01nc1ygicatjc4za',
    'cmrpv8fu700071ync12mjr4eo',
    'cmr97z1pk00b61ywycnq0jxdg',
    'cmrpv8h9k000p1yncy3i8tiva',
    'cmrpvdqn1002f1ync9yr1j7qg',
    'cmrpvdqpw002g1yncz4ja1vyc',
    'cmr8pgtwi01co1ygijmo3txyu',
    'cmrpwahxw009r1yluvigkzluz',
    'cmr97qeyc00771ywyjyxybutz',
    'cmra6lu1r000jic0497uhqtw7',
    'cmr8ccjrb01641yw25jnbr4tt',
    'cmr8ei2q100a11yazpe0patrh',
    'cmr8ei0hr009f1yazeodl9lot',
    'cmr9c9o2101r01ywyt8ygfo2y',
    'cmr97i29v004h1ywyfuu5viqx',
    'cmr99ij0w00uh1ywyw0sg94gt',
    'cmrpvuy66000u1yh5qh669vk2',
    'cmr8bxxjx00dl1ylo0985dqzt',
    'cmr8bxynh00dw1yloctio3x5p',
    'cmr9buyk101k51ywy3b4glugu',
    'cmr9buxxn01jy1ywyrmgwm4ol',
    'cmr99rewp00xa1ywyy5f72pex',
    'cmr4dbdtl00yb1ykyzmhwioem',
    'cmr8br6zc00av1ylo46qj6mj3',
    'cmr8ccgwg00kn1ylo90ngavte',
    'cmr8bhj7p007l1ylovxfagwaz',
    'cmrr4t1zu000m1y6p9tikdwtv',
    'cmr97c4le000m1ywyagdzlpe4',
    'cmrvwt03d00351ye8e96qjq7j',
    'cmr99iixe00ug1ywyksv9dd52',
    'cmr99iijh00uc1ywyxwg3bvtj',
    'cmrvwtupr003s1ye8gtp2qudf',
    'cmr99ihyh00u61ywy7nxfwa3g',
    'cmrrutiye00jz1y8w77gb9ae8',
    'cmr4cbyhj00lj1ykyokjtateo',
    'cmra6lzuq0044ic04hifsvr0v',
    'cmr98ml2500kc1ywyl2cxz4qw',
    'cmr8dba4000uf1ylob4thyo7t',
    'cmr97qhl1007y1ywy5lmpefi0',
    'cmr97i0i5003z1ywysql8885r',
    'cmr99rifp00yi1ywyz13ak6mm',
    'cmr99rfe900xg1ywyicl08vkj',
    'cmr99rfbd00xf1ywy148gu3g6',
    'cmr97qfg5007c1ywyc0fjj1o6',
    'cmrrvb6jt000c1yl8or5cqd7h',
    'cmrrvb6rd000e1yl864trdem2',
    'cmtps7txq00041y1qvii0x4v2',
    'cmr97qfxv007h1ywybzncm7m8',
    'cmr97z0xs00ay1ywycogiqbfv',
    'cmr97qgir007n1ywyonjxk771',
    'cmrpw7add004h1yh5a2zumi89',
    'cmr97yzhy00ak1ywyrv84hqf5',
    'cmtpwsph3004n1y6hqnzj6zgz',
    'cmtpx3clv00a71y6hdszeexyh',
    'cmtpx3eh500av1y6hnngcswxv',
    'cmrpw7c7q00541yh50nh48kxp',
    'cmtpx6doz000p1ymusfhqz0x5',
    'cmtpxc77z005i1ymure6vy3zg',
    'cmtpxgs1u00781ymulbphsjs4',
    'cmrrvfjm5002v1yl8xw14bng1',
    'cmtpxgs7e007a1ymuufljmnxb',
    'cmr98dnn500i21ywy9jrfczap',
    'cmtpxc5tm00501ymuhqxxrriz',
    'cmrrvfke400351yl8k8vgl5mq',
    'cmr88icgz00q41yr91s363hhq',
    'cmr88idlh00qf1yr9beeqhnry',
    'cmrpvux64000i1yh5al51283d',
    'cmrqhnyxf00561ypxczqf70wj',
    'cmr87j05t00gk1yr9ja47zxcm',
    'cmr88s3w100u91yr9wsznhcwa',
    'cmr8ccf9f00kb1ylox9ks5fwr',
    'cmrrvzvco00e41yl8gllfgfht',
    'cmrpw192d002y1yh57azr4osq',
    'cmrsf7d3k000a1ynyl5vu2r0x',
    'cmr8fhe5g01jr1ylo7j1pure6',
    'cmrtggcjo005a1ydw6gtb8vfi',
    'cmrrvnkp6007d1yl8eytj0bm5',
    'cmrsfd1tw002m1ynymh17wlsk',
    'cmr8h1gbx01xj1ylo1w0q3owx',
    'cmr8l1jme006c1ygii1wc825q',
    'cmrpwivwq006m1yrthqg189cv',
    'cmr8lqiz200dm1ygibyqlcyb2',
    'cmr87snxw00kv1yr9hsheb8hb',
    'cmqkgnt100fvul3042520szyy',
    'cmqkgnt6j0g31l304sn5x33b1',
    'cmqxcjvjc00481yma1v2kyn4u',
    'cmr4qbt2t00vn1y1eeko0l075',
    'cmr8bfzj900zc1yw2lvt93sio',
    'cmr8bg2pi010e1yw2jg7s3kw8',
    'cmr8dyk8y006g1yazarhp5uco',
    'cmr98vq1i00oi1ywyfosknalt',
    'cmr8dykex006i1yaz4ep2gyma',
    'cmr98vqpu00oq1ywy5lwz1i3h',
    'cmr8qfq2e01n71ygizcvf95pc',
    'cmr8bxyjy00dv1ylo40t9t0wr',
    'cmrpwagnf009e1ylurwsiyqxc',
    'cmr8c3kyj00gp1ylotit1k28z',
    'cmrpvywm8000o1yrt5eobudqt',
    'cmr8c3mey00h31yloe16yjve7',
    'cmr9bbrel01dk1ywyn8ex2d0e',
    'cmr99ilm900v81ywyb9bl4w3k',
    'cmr9bbrx101dp1ywylkb00iyi',
    'cmr9bv19001l21ywy2jgdq8il',
    'cmr9bburj01eg1ywytfzatpd2',
    'cmr99rgwp00xz1ywyp2y8liix',
    'cmr9c9mye01qp1ywy66j9eq9a',
    'cmrrvb814000o1yl810moggrm',
    'cmrrvb8su000w1yl8qtdti32a',
    'cmr97qh3s007t1ywynm7eqzoy',
    'cmr9c9qxr01rs1ywyjgtswpfy',
    'cmr97i35t004q1ywyylarnuxx',
    'cmr9c9pyn01rj1ywyu3srjaqt',
    'cmrr4t1r2000j1y6prnljdto5',
    'cmrrtw7wp009n1y8wv1sune9p',
    'cmr98vpox00oe1ywyqhbsfn09',
    'cmr8c3lpp00gw1yloekfco88d',
    'cmrtprxki000g1yqc4gvp8uiw',
    'cmr8c3oiq00ho1yloaev1qf6v',
    'cmr9bbq9601da1ywyw9bfe7rn',
    'cmr9bbrpp01dn1ywyq6ttmnbr',
    'cmr8digkl00x91ylozjdvula7',
    'cmrrtw1mb008y1y8waqdjrp64',
    'cmrrtqyzn00761y8w5rph6n6e',
    'cmrr4ybyx002k1y6psek79mo1',
    'cmr9bbqgw01db1ywyfq421fva',
    'cmr8g7bhb01qy1ylobyevzn2k',
    'cmr97yzt600an1ywywzxwbrqo',
    'cmr8ehycn019y1ylo5rrckh5w',
    'cmr9bv01901kn1ywy8u8mebq1',
    'cmrth10bo002j1yaxjczk9o1v',
    'cmrrug0na00g41y8wrf4cg7le',
    'cmr8dih6200xg1ylocotmw7y4',
    'cmr9c9mr601qn1ywyffyljpeq',
    'cmrrutfqn00jr1y8wn7o1sxe5',
    'cmrr4y95i00291y6pdhfbc15c',
    'cmru2q8na000l1y7wxrmydg1o',
    'cmr8diey200wp1ylo175vxexy',
    'cmr97z2kn00bf1ywy2nj4oi12',
    'cmrrtqxmh006s1y8wo5h1b43y',
    'cmrrtw37a00951y8wpvck4zm9',
    'cmr9b2clk01a51ywyoyenkp2b',
    'cmr9862fc00e81ywybgq1oz9c',
    'cmrrtqzgq007b1y8wxdeid1p9',
    'cmrrt93ep00051y8w6se8yqyq',
    'cmrrtqxrf006t1y8w47z1koz5',
    'cmr8g7cpg01rd1ylorrn31jf1',
    'cmrrtr04k007i1y8ww5khyw5h',
    'cmrrtw2hd00901y8wg5tv5gif',
    'cmrtq0vjw001u1yqcjpz63j0g',
    'cmrpw19he00331yh56ohhh6qg',
    'cmrthhr9l007h1yaxdigcnq3l',
    'cmr8g7byr01r41yloz0apqinq',
    'cmrtqfz1s00061yx3ik837p1k',
    'cmrpw7as7004m1yh5u0ykq4th',
    'cmrpw7b96004s1yh5qbxyuf3q',
    'cmr8lyzgj00go1ygisiog3gqm',
    'cmr8lyyj900gg1ygiz2z83nd3',
    'cmr8g796u01q61ylo5kjxqo8y',
    'cmr8g79fm01q91yloohoq5d3t',
    'cmrpwcj7e004n1yrtdcejxy2o',
    'cmr8dymjc01431ylo78puysrn',
    'cmr9c35i201nd1ywycq6ifso4',
    'cmr97i0eo003y1ywyn6fos5e2',
    'cmr9c37ii01o21ywyxyxfc3xh',
    'cmr8lz0jg00gy1ygi37698epf',
    'cmr9c39ge01oq1ywy0t1uxmpv',
    'cmr8lz2ho00hi1ygiwykuio83',
    'cmr97i1dr00481ywypr0t8dt4',
    'cmr97i1h900491ywyxy5uled8',
    'cmru2qb91001g1y7wdhr6lksj',
    'cmru3n3ic00dc1y7wg3tblirr',
    'cmr4b2zt600071ykyu0bnbmm5',
    'cmr4cvezr00s61ykyuioz2fta',
    'cmr4d3ufz00ur1ykydltrrjdd',
    'cmr9c9oyl01r91ywyeybl8vog',
    'cmru7tkep000i1yd6738o41cj',
    'cmr9c9pgp01re1ywyghkw86ub',
    'cmr8nclf500st1ygirhfa03x0',
    'cmr4cvdeg00rn1ykysklowiax',
    'cmrpwfdo7006h1yh5rbvub9dg',
    'cmr8bhhgr00731ylonozbd9qn',
    'cmr8br4jf00a11ylo5fgkl3p6',
    'cmr8ccdr600jt1ylohfvfk6kz',
    'cmr8cceht00k21yloyxr4enda',
    'cmr8db71d00tl1yloqgehw2bs',
    'cmr8e5wgk016x1yloyc0gfuna',
    'cmr8e5zi7017z1ylovo3j5lvr',
    'cmr8nmkss00xk1ygi9yj001km',
    'cmr8o9kkl01491ygik9fsv3u5',
    'cmr8hggjo020m1ylovv8kjd0w',
    'cmru7tj6200031yd6fkxxqu07',
    'cmru7tkaj000h1yd6ec62zohv',
    'cmru856id00441yd6hg77c1my',
    'cmr891b3y00x71yr92yvqv4x8',
    'cmru8bfsg007l1yd6euupuq5y',
    'cmru8bgjp007u1yd67ylym2wu',
    'cmr891cb200xj1yr9pww5fqpt',
    'cmru8v30d000d1y0sfg8nuak2',
    'cmru8v68k001h1y0sg887y39c',
    'cmr8ji87702nl1ylo01if3g08',
    'cmr8lqk1c00dz1ygixcmgpczx',
    'cmr9c9nuq01qy1ywyskf2wnrf',
    'cmr8lc7ku00ak1ygikqxum6al',
    'cmr8lqjm900du1ygi0bdlu642',
    'cmr8ny4ym01001ygibpgl7xih',
    'cmrtqfzaa00091yx33tz88wb0',
    'cmr8lc573009q1ygi03rlze86',
    'cmq339ykg00611yiuyinluv4d',
    'cmr8dyo3s007r1yaz5b1ycrk6',
    'cmra6ludj000zic04z2jfw3j1',
    'cmrrvnlop007q1yl8vvrneuik',
    'cmrtq0vdb001s1yqc558pnwzp',
    'cmr4dbg5600yw1ykyk63yrysy',
    'cmqvw68ee01wuju04qh97az4p',
    'cmr9c356i01n91ywytldccp98',
    'cmr8o9jjh013w1ygi3y00jn86',
    'cmr8o9ghg012u1ygiha6ry60y',
    'cmr8ji9dg02nz1yloiztjmquk',
    'cmr8lc3yu009d1ygiqjbh4joj',
    'cmr8nmjwb00x81ygi6vm9xp91',
    'cmr9c36m601nr1ywytrg8m1yn',
    'cmrtqg1a4000y1yx3nczd7iro',
    'cmr9c36xh01nv1ywy4a0j00ml',
    'cmrrtf3mr002f1y8wceear3pp',
    'cmrrtm6mc004p1y8whyge2592',
    'cmrtqq65y001d1yx30h9plthq',
    'cmr87iz5h00gb1yr98ylk00rp',
    'cmrrtw0tw008q1y8wz2n3n4yn',
    'cmrr4y9ut002c1y6pq9169ceg',
    'cmrr4ydke002r1y6p7hfd8zok',
    'cmrtprwmj00041yqccqf794b7',
    'cmrpvdryp002w1ync4ete3mt7',
    'cmtpwlgj5001e1y6h88xolo55',
    'cmtpwlgrl001h1y6h9v0pi1mc',
    'cmtpwsng4003x1y6htzqsvbo4',
    'cmr4o9ho500k11y1e1ub7clne',
    'cmr85uhht000k1yw2ypaimn0r',
    'cmr4b31y6000q1ykym73uze8l',
    'cmr985zud00db1ywy2sh8qhqf',
    'cmr4dbf2400ym1ykyf8jhq7ow',
    'cmr4d3vjw00v41yky4phtssrb',
    'cmr4d3vyw00v91ykyv3biggp1',
    'cmr8bhi4x007a1ylo71y1nt4h',
    'cmr8br3vi009t1ylovai73dwe',
    'cmr98626w00e51ywyuz2gykig',
    'cmr8c3jyt00gf1yloo83gylkl',
    'cmr8cn97200ng1ylol4h7qgs8',
    'cmr8dq9l701071ylocc5e1kgm',
    'cmr8nmio500ws1ygiy5xjb3zg',
    'cmr8dq98801041ylohhektlez',
    'cmr8db7cw00to1yloo3c8qfr4',
    'cmr8c3o0v00hj1yloy8z0teaw',
    'cmr8esqfg01eq1ylo57zj1tmt',
    'cmr8h1fty01xe1ylov1lz3gub',
    'cmr8f2mez01hc1ylosrdisaze',
    'cmr8fhhyq01kt1ylojsxajavf',
    'cmr8fz9vc01o01ylopnf2bkax',
    'cmr8ei1hc01b11ylo1vsxp4ll',
    'cmr8hgdq001zt1ylouk4cd842',
    'cmrsf7etz000w1yny3geys6vw',
    'cmr8isf2e02ea1ylo3xppywyk',
    'cmr98mluh00kk1ywyv9lcap7h',
    'cmr8j0psp02hk1ylo2rzn4xp5',
    'cmr8i09is026k1ylouq1znd2m',
    'cmrtg5vu400021ydw6upxfw56',
    'cmr8j0obp02h21yloaqg3kawj',
    'cmr8j0o5x02h01yloioo5cwge',
    'cmr8hrskr023s1yloljibectj',
    'cmr8l1jir006b1ygi7zlyq64j',
    'cmr8m9btj00k71ygiz0uryfw7',
    'cmr8lc8rk00ay1ygi6x9s7gwb',
    'cmr8lc6pl00a91ygiy4bvj584',
    'cmr8juid5000e1ygij3t6vg1p',
    'cmrrbwae9000kl104dusv83aa',
    'cmr8ny45j00zr1ygijk65dyiw',
    'cmr8ny7jq010w1ygiw87y05nq',
    'cmr8nmknf00xi1ygihmqd7xcd',
    'cmr8o9gep012t1ygi4kg210zj',
    'cmr8qfqax01na1ygi3zy9q381',
    'cmr8pgu2401cq1ygizqp5mg3e',
    'cmr8qfr1701nj1ygi89ac165n',
    'cmr8q429l01jg1ygip2y51cfl',
    'cmr98632m00eg1ywy5ruxscim',
    'cmr97i2kf004k1ywykxhklcie',
    'cmr8q40ls01iv1ygi7gy5u1d9',
    'cmr98mmff00kq1ywy10umjsxj',
    'cmr98vo1200nu1ywyb0bbeuf6',
    'cmr97yymk00ab1ywyj1w6za5r',
    'cmr97qdyy006x1ywy95rsyg6w',
    'cmr99ihrj00u41ywya55zr5pr',
    'cmr97qg8b007k1ywy9vo3qwcu',
    'cmr98vojc00o01ywyzv8owfvx',
    'cmr9860p400dm1ywyv65go0et',
    'cmr9863ox00eo1ywynz2ghe5q',
    'cmr98dip000go1ywygeixzdav',
    'cmr97yypz00ac1ywybiq649wj',
    'cmr9bnymu01he1ywy6t02d1cc',
    'cmr9bbvzz01es1ywyf3ygm07t',
    'cmr9c9onf01r61ywya66uca0f',
    'cmr9bv1qv01l81ywy7g5ccjfu',
    'cmr9c9qnd01rp1ywy1vm3kngx',
    'cmr9c367u01nm1ywytyuu68vs',
    'cmru7tkk7000k1yd6cmhrw2hx',
    'cmr8ny7mm010x1ygid18pjfpa',
    'cmr8ny6th010n1ygiewctefvx',
    'cmrruahqk00dh1y8wiodx5er3',
    'cmrruajve00dm1y8wh8p5s11v',
    'cmru9iws200bb1y0srf06ys1w',
    'cmrrufx2j00f41y8wrr6ll8e7',
    'cmrrufyss00fn1y8wp0md63hs',
    'cmr8ny6kn010k1ygiw86tss43',
    'cmr99rg3v00xp1ywyyfk5xitp',
    'cmr99rh7y00y31ywy50oa6w01',
    'cmrruxvkk00mh1y8wft4ekk28',
    'cmrrufyfm00fj1y8wapygfjd9',
    'cmrruxsy400ll1y8w4yrq0wap',
    'cmr99rir400ym1ywyufo58dxs',
    'cmrtffifv00021yx20565klb4',
    'cmrtffje2000e1yx2rd6wxdsr',
    'cmrtg0vvu001a1yx2lo81lav1',
    'cmrtgrgny000k1yax5ocyuwhf',
    'cmrsrb1ta000ll404o5e1vx0g',
    'cmr8ny60l010d1ygi74ekrcyx',
    'cmrtgrhug000w1yaxwh0u7sas',
    'cmr9buzgl01kg1ywyusp59xrb',
    'cmrth0z7500291yax0xo3s45w',
    'cmrth10iw002l1yax8wz5x85i',
    'cmr8ny5s6010a1ygidi375xyf',
    'cmrrufzdp00ft1y8w0jnx7162',
    'cmr9bv23a01lc1ywy837fi9sj',
    'cmrrutcvr00ji1y8whp9vk4n7',
    'cmrrutfak00jq1y8waaczm0u3',
    'cmrruxupb00m61y8wxfpj3vq6',
    'cmru2q9z600111y7wxcee2u6t',
    'cmtpx6cjb000a1ymuiyhb1p1x',
    'cmqkgnt5k0g1ul304ux7r6kfv',
    'cmrrum23500hl1y8wl9z0rqre',
    'cmr9c36di01no1ywybmgy06ud',
    'cmrruxvq000mj1y8whj3qzskq',
    'cmrrv63y700nw1y8w1sc80958',
    'cmr9c38jr01of1ywyklbjx7x0',
    'cmrrv677000or1y8wj4p0jijn',
    'cmrpwfd88006d1yh5rk5bxtwc',
    'cmru32jzm003e1y7wlwya3mu0',
    'cmrsewa9o000h1y55a4z1pvsu',
    'cmr8bxxr700dn1ylongbw434o',
    'cmru32lmp003y1y7wvl81klyu',
    'cmru32mod004b1y7wt47mpbpt',
    'cmrrum5hu00ho1y8wydyl419s',
    'cmrtfficy00011yx211sbfvmw',
    'cmrtfrqut000s1yx2rc4n8vhf',
    'cmrtgrgv9000m1yaxg6ma2bc2',
    'cmrtgrgyo000n1yaxyvoq92w7',
    'cmrth11ej002u1yaxmsofo0kl',
    'cmrth11i1002v1yax4juzw01h',
    'cmrth87sm004h1yax1bsj6903',
    'cmrth10q1002n1yaxa6up8mtl',
    'cmrth89q900501yax5dnsg3m1',
    'cmrth89tw00511yaxkpi6io02',
    'cmrth892y004u1yaxeu132548',
    'cmrtqfyt400031yx3dl80jamo',
    'cmrtqfyw000041yx31o7sy0tl',
    'cmr8n3q3200q21ygix0rdvxgk',
    'cmru6qswn000il104glzdsvo4',
    'cmru3n60200e41y7w3h93sasz',
    'cmrth88p1004q1yax41wu4qbo',
    'cmrthhrl2007l1yax9ne1sizm',
    'cmrtqg0bp000m1yx35sqeh34w',
    'cmrtqq5rw00191yx3dh765axm',
    'cmru3ue5w00hi1y7wuui77ozd',
    'cmr4b343z001g1ykyt8otrcwl',
    'cmr4bvdyp00e21ykypjqwrpaw',
    'cmr8dymqv01451ylo3dtzeref',
    'cmr8dynk7014d1yloryv4hxc8',
    'cmr4cvcpo00rf1ykyfvdscn3g',
    'cmr8cn9yj00np1yloxh8dh6bo',
    'cmr4fl31l01vw1ykymsdsyhml',
    'cmr4fthb901zs1ykyhfdlrbjd',
    'cmr8dylm6013u1ylon5cfd43x',
    'cmr8fhg2401ka1ylo6qg4wwy9',
    'cmr8fhg5n01kb1ylorbu3qjr2',
    'cmr8gr3fg01tg1yloduhi3zv8',
    'cmr8ccdww00jv1ylogaudfnrm',
    'cmrrvb7ql000l1yl875oby7ol',
    'cmrtgb3cb002t1ydwc4l4dym7',
    'cmrtggal6004l1ydwj9yh6135',
    'cmr87j40t00hm1yr96l882e22',
    'cmr89veed01441yr9yhmvmmsy',
    'cmr87sleh00k01yr9p6sypcpz',
    'cmru2q73500031y7w24tlwx8g',
    'cmru2q7xw000d1y7w749tnaxn',
    'cmru2q842000f1y7wirmtmv3l',
    'cmru2q8w7000o1y7wuzrz5ifr',
    'cmru2q9k6000w1y7wqajaj3j8',
    'cmru2q9t5000z1y7w8vkj1l78',
    'cmru2qahp00171y7whj9q6dmn',
    'cmru2qbky001k1y7wcuslegem',
    'cmru32jwl003d1y7wvg7uosh5',
    'cmru32k8y003h1y7w6l5vdlih',
    'cmru32kwp003p1y7wylvb2gq0',
    'cmru32l86003t1y7wrc8a025p',
    'cmru32lyc00421y7wy55q0cl8',
    'cmru32min00491y7wofkmisyx',
    'cmru32n8e004i1y7wyhdyelpc',
    'cmru32nh4004l1y7wxih0bvrg',
    'cmru32nse004p1y7wlnwzudq5',
    'cmru32o6v004u1y7wkasjb8fl',
    'cmru38x8c006r1y7wm8t7ytyb',
    'cmru38zz9006z1y7w6ruoebuz',
    'cmru3902f00701y7wimydyt7o',
    'cmru392fo00771y7wg63dcgrc',
    'cmru3939y00791y7wwank05zp',
    'cmru396xh007h1y7waafiuf8r',
    'cmru398rv007l1y7w7apwx0wn',
    'cmru39aum007q1y7wi3we9g0c',
    'cmru39b86007r1y7wqbiaowfi',
    'cmr8dqdrq011b1yloycjofwyv',
    'cmru3n37l00da1y7w1hlmm4ko',
    'cmru3n3pd00de1y7w20ke12f4',
    'cmru3n3s400df1y7wh2793s5c',
    'cmr8g7c7x01r71yloz18qnnde',
    'cmru3n4ii00dn1y7wklg3mkfi',
    'cmru3n4tv00dr1y7wb3th3icv',
    'cmru3n51200dt1y7wlyz2dqd4',
    'cmru3n6aj00e71y7wdu7iwa8t',
    'cmru3n86x00es1y7wi2jzcnb3',
    'cmru3n89o00et1y7wypwr543h',
    'cmru3ubbj00go1y7wd43th886',
    'cmru3ubf000gp1y7wdwadefnn',
    'cmru3ubpc00gs1y7w6f2thgt2',
    'cmru3ud7y00h81y7w2ocub9wi',
    'cmru3udeq00ha1y7wni5t6azr',
    'cmru3ueg200hl1y7w8zxzwxji',
    'cmru3uf7k00ht1y7wsam8lrd6',
    'cmru3ufec00hv1y7wvwz7soiu',
    'cmru3ug9m00i41y7wo6v83u74',
    'cmru3ugd000i51y7wtlt628x1',
    'cmru3ugn800i81y7wyryw23hp',
    'cmr4badm1003r1ykyn3i5bvu1',
    'cmr4c4v6800i01ykysma7bcru',
    'cmr4cvf8f00s91yky66ep01uz',
    'cmru7tmd600171yd6dklfi59i',
    'cmr4eekrb01f21ykyu64w187x',
    'cmr4c4u8600hr1ykyrkponkki',
    'cmr4cvbsu00r41ykyi1x2g2ci',
    'cmr4fl3u901w61ykyz21k6nxo',
    'cmr4gbo67025e1yky67y1uvnc',
    'cmr8bhg3l006p1ylorz7ud0st',
    'cmr8bhim8007f1yloud1sms8m',
    'cmru8bdr8006w1yd6y5ax5f6h',
    'cmr8br44n009w1ylo3nm4nova',
    'cmr8br4dg009z1ylog4g3mke6',
    'cmr8ccdkx00jr1ylo7j2uttxy',
    'cmr8ccjqk00l91ylooddtv06i',
    'cmru9iqf7009u1y0sx5hdgw71',
    'cmr8ccebg00k01yloa4ebrot4',
    'cmr8br78300ay1ylovkom7f83',
    'cmr8bhif7007d1yloshg9bqtx',
    'cmr8esmwy01dk1yloro4p8p5g',
    'cmr8e5vnk016n1ylo4nwz7g6l',
    'cmr8e5x8o01771ylo42uodd1l',
    'cmr8e5x2w01751ylo1yq7rbga',
    'cmr8dqbwq010t1yloyxdvt8fv',
    'cmr8e5xvg017f1ylom8mbgpmq',
    'cmr8lc6va00ab1ygid6tuv3qd',
    'cmr8lc5we009z1ygivfcggaqs',
    'cmr8dbaig00uj1yloibrm4gwx',
    'cmr8ny5me01081ygiuj6k34st',
    'cmr8hrtxk02491yloydmdodv8',
    'cmru7tk4s000f1yd6y7yrfe5a',
    'cmru7tks8000n1yd6czut6uub',
    'cmru7tkv1000o1yd6478zkcx1',
    'cmru7tmfy00181yd67u072l4p',
    'cmru854bx003d1yd62f61uuu3',
    'cmru854j2003f1yd620hl403j',
    'cmru854or003h1yd6egjdi3v4',
    'cmru854uh003j1yd6divwmn3d',
    'cmru855bn003p1yd69u0goecz',
    'cmru855k5003s1yd6sglt1xrr',
    'cmru8566y00401yd66fvcjvlw',
    'cmru858ci004r1yd62fiq14c5',
    'cmru8be8d00721yd6c5if03mq',
    'cmru8begy00751yd6fbcxgery',
    'cmru8bepi00781yd6dwp8uzuj',
    'cmru8beyd007b1yd6s9tz3xry',
    'cmru8bf6t007e1yd6gbt5liy5',
    'cmru8bf9q007f1yd6suit2rt4',
    'cmru8bfv8007m1yd6mgqgywll',
    'cmru8bgdw007s1yd6f3auc68r',
    'cmru8v339000e1y0sfpqnx3aw',
    'cmru8v3wg000o1y0svjb9ne5y',
    'cmru8v62s001f1y0sj3mebkfu',
    'cmru96r4m004p1y0sai3s8c92',
    'cmru9iqar009t1y0sx57ibyn7',
    'cmru9irmf00a41y0s0xb6hhdh',
    'cmru9iv8000ay1y0s3i24bonw',
    'cmru9ivl500b11y0sxku4rzuy',
    'cmr8fz9mi01nx1ylojet5pfy0',
    'cmr8fzamc01o91ylowkd5sv1c',
    'cmr8fz8kf01nk1ylo4uwqza87',
    'cmr8fz7cq01n51ylood16uh7l',
    'cmr8j0ms102gj1ylo0agmiy92',
    'cmr8ji6i702n01ylotycfsugz',
    'cmr8ji9ai02ny1ylobhhkzrso',
    'cmr8ji8uj02nt1ylo5i5q9lhp',
    'cmr8ji8ix02np1ylolcejuag0',
    'cmr8ji8cz02nn1ylolzyh0x87',
    'cmr8lqgs300d31ygiyke5uokf',
    'cmr8lc86q00ar1ygi79nend3c',
    'cmr8lc6y200ac1ygi505sck6x',
    'cmr8lc6jr00a71ygirx17ktem',
    'cmr8lc5cm009s1ygiq9xwleac',
    'cmr8n3rud00qk1ygi326kcf7g',
    'cmrtq0ua3001e1yqcwkz0ih54',
    'cmrtqg0nb000q1yx3zp7dro7q',
    'cmru6qy0e001rl104lmcr5s02',
    'cmr877i2e00cx1yr9dzsw2vsr',
    'cmr891bm100xc1yr9v4x5llcw',
    'cmq33aol7032x1yiuwha8blym',
    'cmq33a129006x1yiuwxdqy95j',
    'cmr97c4oy000n1ywy1vtq9tw7',
    'cmr4fdgef01rm1yky777ike28',
    'b1xd79159a50d0a92cd0c5a6043',
    'b3x22ac8a2536982a8912f49a22',
    'b3x2160c034da8cfbc5a964c930',
    'b4xbc501408f6e5a158eac86f8f',
    'cmr8adxhn00t51yw2f4ez0wlk',
    'cmpnjjjv10ahs1ymxqyye7pe5',
    'cmpnjhacg001v1ymxgq5z4o45',
    'cmpnjha50001u1ymxf1e2p285',
    'cmr8d6ipq001f1yazs67o5i6c',
    'cmr4cbum900k91yky0a2p14p3',
    'cmr8difi900ww1ylor0avl0f2',
    'cmr8dig8q00x51ylo7khyyoqa',
    'cmr8diiu500y01yloa97y0obi',
    'cmr8g79yg01qf1yloy8qso8wq',
    'cmr8g7a4401qh1ylo62fn1eh7',
    'cmr8g7cmi01rc1ylo2zgioxxq',
    'cmr8lz0fw00gx1ygif7kb40rz',
    'cmr8lz2ok00hk1ygipyyr13k2',
    'cmr8o9kho01481ygixo83u306',
    'cmqkgnzc80ktnl304iqdgginq',
    'cmq0g7l2u004i1y4fihnzwa97',
    'cmr4hb45x004s1ydexx4g9yjd',
    'cmr4hb4d6004u1ydesul0egsh',
    'cmr4iy74h00gq1ydepsdklqyh',
    'cmr31dlht00c8js04d8x5uw4a',
    'cmr89ve5q01411yr9lwfa4d5u',
    'cmr8al7wq019b1yr97s2g74h7',
    'cmr877kgf00dq1yr9ud41xn1b',
    'cmr88ic9k00q21yr9mqq1kwak',
    'cmr877izf00d81yr9rjoydnd9',
    'cmr89lxux01131yr93rm5v620',
    'cmr8alb1c01ab1yr98hwrqxxd',
    'cmra6lv0p001uic047nu6s50r',
    'cmrpvq8mc000b1ylu4onpxg74',
    'cmrpwagxz009h1yluxjisv9al',
    'cmrqh93zx00111ypxahyrpv4q',
    'cmr8alc5q01ao1yr971zqmi2n',
    'cmrpvq7xw00041ylui13j96ru',
    'cmrpvq9ru000n1ylufqyzdwgu',
    'cmrpvvgda002j1yluslnn0t7g',
    'cmrpw6025007j1ylu99w36xa4',
    'cmrpwai4u009t1yluj4ni9ndt',
    'cmra6lzkv003yic04yckey7kr',
    'cmrpvq90f000f1yluxpn5c60s',
    'cmrpwg4kh00b71yluh18d1z6o',
    'cmra6lurx001jic0411nonwt0',
    'cmrpvvfht00291ylu8xndubrd',
    'cmrrvnlm0007p1yl8zxslg3qj',
    'cmrrvvjx500bf1yl8f5k41tzv',
    'cmrrvvksu00bo1yl8y53lftbb',
    'cmrrvztbr00dk1yl81szgft31',
    'cmrsf7des000e1yny0zpmgdzg',
    'cmrrbwant000tl10483z9gubp',
    'cmrrvfivv002m1yl86t4pxz1j',
    'cmrrvji2e004k1yl893fd6ug8',
    'cmrrvjiu0004u1yl8oto8t4er',
    'cmrrvnjxe00731yl8al8ylhwd',
    'cmrrvnkxc007g1yl8drz32kqe',
    'cmrrvrrbd009e1yl8a5g41jsy',
    'cmrrvvjto00be1yl8vrjtp0v1',
    'cmrrw4ws600fs1yl82tc3bepk',
    'cmrrw4xto00g51yl8x86i4iz3',
    'cmrrw4xzd00g71yl8ch08h7r5',
    'cmrsf7dby000d1ynykc4gpnhy',
    'cmrsf7er7000v1ynymzw64pvk',
    'cmrtg5w4n00051ydwxwb3kuln',
    'cmrrvztim00dm1yl8r2yyltbm',
    'cmrrvvklh00bm1yl82yswsumi',
    'cmrrvnl00007h1yl8ci2puplw',
    'cmrtg5wsx000c1ydwjn1ei3in',
    'cmrrvb5pz00041yl878659qnh',
    'cmrrvnkru007e1yl8wu1jmfma',
    'cmrrvnlrj007r1yl8d989w5lr',
    'cmrrvrqjd00941yl8uq9cqf6f',
    'cmrrvrr5r009c1yl8hght96di',
    'cmrrw4xl700g21yl8m8g0kn6k',
    'cmrsf7dyo000l1yny67252vzo',
    'cmrsfd30b00301ynyi9ap0krt',
    'cmrtexhhl00061y30l47xo6km',
    'cmr8j9nv702jh1ylo0xqmjdjt',
    'cmr8j9tbq02kx1ylo51avchq9',
    'cmrtgb1p500281ydwt2y4oxl7',
    'cmrtgb1rx00291ydwjs2fqxar',
    'cmrtgb20a002c1ydwlc0jle9d',
    'cmrtgb2vd002n1ydwq7m4z87f',
    'cmrtprwxr00081yqcpdrf5pia',
    'cmrtpryrk000s1yqcxf2t0wec',
    'cmrtq0tcg00121yqc5wife6us',
    'cmrtq0vg9001t1yqcplinagle',
    'cmrtq47h800211yqcinx0cg39',
    'cmru6qtfg0014l104jv97kyq2',
    'cmru6qye80025l10473j387m1',
    'cmrvm5uqf000cjw043tdbzvyx',
    'cmrtgb44h00331ydwp8o80hna',
    'cmru6qyfx0027l104xbqu6fco',
    'cmrtg5y21000p1ydw3wsng77n',
    'cmrtprwgv00021yqc9v8uul6x',
    'cmrtprx3j000a1yqcolvqglnb',
    'cmrtprxc0000d1yqcpfel2oco',
    'cmrtq0t1a000y1yqcnjnknbnf',
    'cmrtq0u1o001b1yqc4qlxfxaz',
    'cmrtq0uzg001n1yqc74q5vva1',
    'cmru6qtah000yl104t75zdka7',
    'cmtps7tko00001y1q25tch5i7',
    'cmtps7w2k000w1y1qhjepv2hn',
    'cmtpsayx200291y1qva7fem19',
    'cmtpsaz6u002c1y1qc3r50vrr',
    'cmtpsazey002f1y1qctp4nz3n',
    'cmtpsazq4002j1y1qxweqqbfb',
    'cmtpsb0pr002v1y1q1hwqwsyp',
    'cmtpvxy3t00031ylcqxd1wxc3',
    'cmtpvxyqq000b1ylcs6tala4d',
    'cmtpw0mvx00291ylc9koa204e',
    'cmtpw0oen002t1ylcpssp25ba',
    'cmtpwld7z000a1y6hypxkmxrj',
    'cmtpwldlx000f1y6hisi344ai',
    'cmtpwleok000r1y6hn9imzog5',
    'cmtpwlf5k000x1y6h82q80p7d',
    'cmtpwlfnq00131y6h8wbt3ysv',
    'cmtpwlfz000171y6h7rq4lwb3',
    'cmtpwsmct003j1y6hflgybljg',
    'cmtpwsnlr003z1y6hx6eclzrl',
    'cmtpwsnu400421y6h36zbpv6i',
    'cmtpx3cg600a51y6h0gddt85s',
    'cmtpx3cu100aa1y6hu95u5oqy',
    'cmtpx3dgs00ai1y6h3t453isw',
    'cmtpx3e6100ar1y6hcak795ey',
    'cmtpx3ebo00at1y6hkdw2h2si',
    'cmr86gtd0003b1yw28uf58zih',
    'cmr8dn3if003q1yaz3lmu8bxn',
    'cmr8bg0js00zo1yw27pk0qmeb',
    'cmr4bggu400731yky5vtobb4p',
    'cmr31dkuy00bojs04jy30m6oj',
    'cmr4bnwnw00ao1ykydubonq8b',
    'cmr4c4qdi00gr1ykyuyroo1rt',
    'cmr4bnv3600a41yky67ifzsou',
    'cmr4bnv8v00a61yky9n3i39gz',
    'cmr4cbv9n00kh1ykyzu0fd6uq',
    'cmr4f69s901ok1ykyfl2qa3pi',
    'cmr4djau7011g1yky82is0doz',
    'cmr4eeizl01ek1yky2en30p3o',
    'cmr4djb29011i1ykydm52cd3k',
    'cmr4fdl3r01si1ykylbedzpky',
    'cmr4d3vh200v31ykyghcg0zw3',
    'cmr4e6ldw01bs1ykytpr4uaoa',
    'cmr4e6pfa01cd1yky4z26ozr3',
    'cmr4f6a6c01oo1ykylwrc4qf6',
    'cmr4d3utt00uv1ykyw2lydh6e',
    'cmr4g0vfd022j1ykypdxdfee2',
    'cmr4gkcw9029i1ykyywuefpq5',
    'cmr4dj7xu010w1yky9df28sfz',
    'cmr4eek2k01ev1ykynb7jh8tp',
    'cmr4e6n1n01c11ykyfdc0gqhw',
    'cmr4f68wh01oa1ykys1kyhviv',
    'cmr4cvbvw00r51ykyre3hc5dd',
    'cmr4d3tf900uf1yky2ej9k19k',
    'cmr4d3sxm00u91ykyux9jwi33',
    'cmr8atxpo001a1ylob4lzzgcu',
    'cmr8atufa000e1yloazrchfw5',
    'cmr8baipn00471ylo4pbl2ccd',
    'cmr8bhix1007i1ylodojmmbbf',
    'cmr8br4s200a41ylo82md57q8',
    'cmr8bahhg003v1yloe7ebzs25',
    'cmr8atu83000c1ylo3l86gwib',
    'cmr8atwdk000x1ylovbt7f6on',
    'cmr8atwh6000y1ylo6fs7vqtt',
    'cmr8bajra004h1ylo0j0mpa8g',
    'cmr8br3mc009r1yloyb65uefw',
    'cmr8br80u00b81ylof49air11',
    'cmr8bhi8e007b1yloh5w1hay7',
    'cmr8bxvqq00d31ylo6664mf91',
    'cmr8bxzua00e81ylo6v3v0vlw',
    'cmr8c3k5y00gh1ylo3xkghepi',
    'cmr8cnc2w00oe1ylokxax68zi',
    'cmr8dymn201441ylo416urfiw',
    'cmr8dyl46013p1ylochwzhcja',
    'cmr8dq8t201001yloqckagbmr',
    'cmr8dihfg00xj1ylo2z1ju5ed',
    'cmr8dbbay00ur1yloayo0gmd7',
    'cmr8dbblx00uu1yloezitq7nv',
    'cmr8cncnb00ol1yloq2qmyvnm',
    'cmr8d1wx800qx1yloo6nak6ft',
    'cmr8diesg00wn1yloldv9z3es',
    'cmr8cna7j00ns1ylodkwh2cyc',
    'cmr8cnaqf00ny1ylo1p3pxxt4',
    'cmr8dyjsr013c1ylowb5h53eq',
    'cmr8c3phz00hy1ylokxjr30tw',
    'cmr8ccjeu00l51ylopg4hw57z',
    'cmr8dbbeg00us1ylog58934vj',
    'cmr8dq9sd01091yloyybtghfs',
    'cmr8c3n7700hb1ylo34lc3nme',
    'cmr8c3nxc00hi1ylon7xrdpth',
    'cmr8digxb00xd1ylogw9w9jop',
    'cmr8cn9lz00nl1yloh6iobs61',
    'cmr8cncq700om1ylocdfom9ao',
    'cmr8h1crs01wk1ylogosdizno',
    'cmr8esq6u01en1ylonz1z3q5h',
    'cmr8eso0s01dx1ylo4rjsgtlk',
    'cmr8esmu001dj1ylocfxaklex',
    'cmr8gr3p401tj1yloufdan99m',
    'cmr8f2luv01h51ylo0u8uys1g',
    'cmr8ehz6201a81ylo1qa41l05',
    'cmr8g7d5a01ri1ylojazdfufw',
    'cmr8ei0af01am1ylozr519qba',
    'cmr8esno301dt1ylop1cpr0xp',
    'cmr8e5zl301801ylomu35goin',
    'cmr8fza1b01o21ylo7vje1hko',
    'cmr8fzas601ob1ylo87jjkuy6',
    'cmr8fz7rd01na1yloigwk6jtj',
    'cmr8g7bk701qz1ylop71256fz',
    'cmr8h1dun01wu1ylo3ynf6ecq',
    'cmr8h1fbw01x91yloacplygwz',
    'cmr8j9qk802k61ylojibpizna',
    'cmr8j9r2o02kb1ylopimknjvp',
    'cmr8i0bsa027c1ylooa72dkq0',
    'cmr8j0oej02h31ylo8sqwyzam',
    'cmr8hrqdj02311ylo62is395l',
    'cmr8hrttq02481ylo9e0fdc7a',
    'cmr8hggcq020k1ylo575ogmft',
    'cmr8i0a9j026t1ylotflewxu8',
    'cmr8ji5uu02ms1ylonz8740sd',
    'cmr8jul6k001c1ygi900jbsr2',
    'cmr8l1kf8006k1ygixw6v4k6r',
    'cmr8kia8i00481ygis86fdev8',
    'cmr8lyx3l00g51ygiy95hucha',
    'cmr8juk9y00111ygimunatw3k',
    'cmr8lc6aw00a41ygiut8702qb',
    'cmr8m9ewy00ko1ygibm8lisa6',
    'cmr8m9bwe00k81ygiymygb6e1',
    'cmr8m9b6f00jz1ygird34708h',
    'cmr8lc4st009l1ygiq5vr5fb0',
    'cmr8lc4bd009f1ygind0nqcre',
    'cmr8jiabm02ob1ylo0k333p46',
    'cmr8ji9x802o61ylohlbofyiv',
    'cmr8ji94y02nw1ylono4bs7p0',
    'cmr8ji8rj02ns1ylo3yr3dnol',
    'cmr8lqjya00dy1ygi5ex17gqi',
    'cmr8lqgxp00d51ygi1dv6xk99',
    'cmr8lqgp100d21ygixsmb9teg',
    'cmr8lqglt00d11ygiug0vj9mc',
    'cmr8lywwq00g31ygi10rut7r8',
    'cmr8lc5qs009x1ygidfh2dut0',
    'cmr8lqjs600dw1ygiuih4wek1',
    'cmr8o9i09013d1yginfks7jzt',
    'cmr8ncoe800tn1ygi00fyo1ph',
    'cmr8ncol300tp1ygiubzy4rxc',
    'cmr8ny5aw01041ygip2fidadr',
    'cmr8ncmup00t71ygiuj40zj8i',
    'cmr8n3rgg00qg1ygidn0x29qx',
    'cmr8p26tw019s1ygif3nvwtn9',
    'cmr8n3pss00pz1ygic0qc31wm',
    'cmr8mlv4q00ng1ygi4cn92e43',
    'cmr8mlvan00ni1ygibrqb1nl7',
    'cmr8nclog00sv1ygignjp736f',
    'cmr8ncmya00t81ygik7akp416',
    'cmr8p26cs019m1ygi38ps0ra1',
    'cmr8nmitk00wu1ygifarq1dup',
    'cmr8ny6wc010o1ygizq48swmx',
    'cmr8ny5xt010c1ygimwrxqfjx',
    'cmr8nmgws00w61ygiwigbs7jw',
    'cmr8o9k5v01441ygi7nuooqxr',
    'cmr8o9iel013i1ygihzq50yr7',
    'cmr8o9ist013n1ygikmnhkqkv',
    'cmr8q440101k21ygiwhb5uqh4',
    'cmr8qfo1401mi1ygi6ohqd4fe',
    'cmr8quym101px1ygi4jobhbyg',
    'cmr8pvcp201fl1ygief5jf3cx',
    'cmr8pvd6w01fq1ygia9saavv4',
    'cmr8pvhnu01gz1ygi9zax3lya',
    'cmr8pvhd101gw1ygisk3o0y1d',
    'cmr8pvi2801h31ygidd2doq01',
    'cmr97i31w004p1ywyzk34iqlc',
    'cmr8qfqdz01nb1ygin9j57cbm',
    'cmr8q423t01je1ygijbb7nnxj',
    'cmr8pgvmy01d91ygi54morii8',
    'cmr97i1a800471ywypgm507hb',
    'cmr97hzhg003p1ywyox7hq9hk',
    'cmr97hzae003n1ywybc8ngxma',
    'cmr97hyb8003d1ywy73q0sxg0',
    'cmr97qcyg006n1ywyi36rjoj5',
    'cmr97i3gf004t1ywyeqsjn77m',
    'cmr8pgwr401dn1ygijlanrsan',
    'cmr8qfn8s01m81ygiwdfyc215',
    'cmr98mm8g00ko1ywyysn6if81',
    'cmr98mm1c00km1ywypxi8pdbo',
    'cmr996ll200rt1ywyfzf5mta9',
    'cmr996j4500qz1ywyyqy26v0o',
    'cmr98mnwp00l51ywyub8kv0iw',
    'cmr98dmkn00hr1ywyzy655r6n',
    'cmr98dj0d00gr1ywyl61q42zh',
    'cmr98640b00es1ywy17z60tcq',
    'cmr97yxuf00a31ywypbv284fo',
    'cmr97qgtb007q1ywybc1nd5j0',
    'cmr97z1t100b71ywyvgk1raca',
    'cmr97z2ad00bc1ywyh45tv06o',
    'cmr99iiqh00ue1ywyxdz1vkcw',
    'cmr97z0qt00aw1ywyrolw9syv',
    'cmr97qe5v006z1ywy4k6o1xpz',
    'cmr97qect00711ywyahzfc6kt',
    'cmr99ih3100tx1ywy2f3y1pwy',
    'cmr99igsk00tu1ywypvcw23ms',
    'cmr99igh700ts1ywytyd2me33',
    'cmr97qfnc007e1ywyvqanguja',
    'cmr97z18400b11ywyjuqlw0ao',
    'cmr9863uj00eq1ywytv7ar6i1',
    'cmr996m5200s01ywyafionwq5',
    'cmr99ijzq00ur1ywyy0mqi4iq',
    'cmr9862z900ef1ywy074xp8de',
    'cmr97qdoj006u1ywyxdygy1ty',
    'cmr97qegj00721ywyzy3pdyjx',
    'cmr97qi2l00831ywy0f1oimge',
    'cmr97qi9k00851ywyyj5276t4',
    'cmr97yxk000a01ywyr7kv34p0',
    'cmr97yzlk00al1ywyjzp2qzq3',
    'cmr97yzwq00ao1ywyx10lttyn',
    'cmr97z1m500b51ywyxt8n4nnd',
    'cmr98mnt200l41ywyk1mwknjy',
    'cmr97qfjl007d1ywypoft9f80',
    'cmr99ijwa00uq1ywyi2tu0wol',
    'cmr9bbvox01ep1ywy7cagj7sf',
    'cmr9bbrtb01do1ywy7zg6usm3',
    'cmr9bbugo01ed1ywyhywlkdi5',
    'cmr9bbtjc01e41ywypdk6ggtu',
    'cmr99ilta00va1ywyvc74u1ea',
    'cmr99rhat00y41ywyy9r804m8',
    'cmr99rg9j00xr1ywyk8l8ncvq',
    'cmr99riii00yj1ywyq3ah7jyu',
    'cmr99rfmr00xj1ywyzamvh7x3',
    'cmr99renk00x71ywyjnpbx7f7',
    'cmr99regd00x51ywy8oox119e',
    'cmru3gb9q00a91y7w8hg6nty1',
    'cmru3ge8600bb1y7w51i8jv7g',
    'cmru3gegd00be1y7wb4nteudr',
    'cmr9c9nk701qv1ywy8tdsqhdi',
    'cmr9c9oco01r31ywy3heknxhi',
    'cmr9bv1wt01la1ywysmlu56ff',
    'cmr9buzmj01ki1ywy2mf7evyw',
    'cmr9buyyf01ka1ywydz98hqk1',
    'cmr9c9qqu01rq1ywyhf9dvvin',
    'cmr9c9pnr01rg1ywyptowgu1t',
    'cmr9c9puw01ri1ywy15ap95pb',
    'cmr9c9qax01rm1ywy5awpas74',
    'cmr9c9qg501rn1ywy34s68cfq',
    'cmr9c37rd01o51ywy40x1xdbf',
    'cmr9c38pf01oh1ywyjmjmoidh',
    'cmr9buygy01k41ywy7clo6ewv',
    'cmr9c9mno01qm1ywy8etw8475',
    'cmru2q8t9000n1y7wwqn5ayjl',
    'cmr9c359d01na1ywydp4jx2kv',
    'cmru2qb60001f1y7w4qqlizqs',
    'cmr9c38e401od1ywybeo5r0pd',
    'cmru3n73l00eg1y7w8293ul7l',
    'cmru8hxf500af1yd6shnnzeds',
    'cmru6qzaq002vl1041myk3kbz',
    'cmru3uc6f00gx1y7wimse5r89',
    'cmru3udoy00hd1y7wjeqi4qgs',
    'cmru3ug6100i31y7wciw7ofbp',
    'cmru3uggf00i61y7wkz2okj2v',
    'cmru7tj9300041yd65y64bj61',
    'cmru7tjw6000c1yd6gzl5nv7v',
    'cmru7tk1w000e1yd65s10ddfj',
    'cmru7tnb9001j1yd6tv23pl14',
    'cmru855ef003q1yd6pcycus6a',
    'cmru8bcpf006j1yd6e88enk27',
    'cmru8v3ex000i1y0s8y2rz416',
    'cmru96m1e003j1y0spum2w423',
    'cmru9cuek006h1y0sxeqdo9ow',
    'cmru9curi006k1y0srh08v4wc',
    'cmru9cwww00721y0sc44gd691',
    'cmru9cxqu00791y0srcneh2y9',
    'cmruifz2u001s1yce3tw4vlxn',
    'cmruif6t0001h1yceiy6qe428',
    'cmruidtkw000t1yceh9yho1cl',
    'cmru9cz66007l1y0stvs944a7',
    'cmru9d0nq007t1y0s8c5vnfwk',
    'cmru9d0wa007v1y0sizl7pgub',
    'cmru9d10o007w1y0s7dgs83e6',
    'cmru9d14w007x1y0s85psdhse',
    'cmru9iqns009w1y0st4o7s4ts',
    'cmru9irzj00a71y0sx6pzbzo8',
    'cmru9itf800aj1y0sp1e010qz',
    'cmru9its400am1y0svtc81t8p',
    'cmru9iu0s00ao1y0sz6x9wfo1',
    'cmru9iu9f00aq1y0sxjg852sq',
    'cmru9ivgq00b01y0s6eu34f2p',
    'cmruyh12h001y1y2yutyrehyj',
    'cmrvwndpb000l1ye8atg4y4mq',
    'cmrvwsawd002t1ye8n3fxjffu',
    'cmrvwsb4q002w1ye81296conp',
    'cmtpx8qdj002i1ymujk0o3udo',
    'cmtpxgsfv007d1ymutyvo6121',
    'cmtpx6bvq00021ymupa6beyv8',
    'cmtpx8r7v002t1ymu4gyib006',
    'cmtpx8rd9002v1ymuwr24v2je',
    'cmtpx8sby00351ymug6369ao8',
    'cmtpx8sku00381ymu0vln5fs1',
    'cmtpxc5cd004u1ymufkgukdih',
    'cmqgt4sdu000i1y0qztxdmcqk',
    'cmqkgntpm0gorl304y7gfp61x',
    'cmqkgntqh0gpvl304vixfbfdp',
    'cmqkgnt020fvcl304hrqp308d',
    'cmqkgnt3s0fzql304cpylojsd',
    'cmqkgntvt0gupl3040wbwg4u0',
    'cmq0g7k1800441y4f51z1rb68',
    'cmqxd0p9t006d1ymaqzez0709',
    'cmq33ahlw01x91yiu5vyqdgsm',
    'cmqkgnq660dfzl304jfst69o5',
    'cmqkgnt4n0g0dl304tarli8le'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_20261113_backup) <> 1316 THEN
    RAISE EXCEPTION 'backup row count %, expected 1316', (SELECT COUNT(*) FROM qbi_usmle_refs_20261113_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $j0$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j0$::jsonb
WHERE id = 'cmr97c4wd000p1ywyxm4tbtqv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1$[{"label": "MedlinePlus. Osteoporosis.", "url": "https://medlineplus.gov/osteoporosis.html"}]$j1$::jsonb
WHERE id = 'cmrvwndvb000n1ye8mgl8ex4f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j2$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j2$::jsonb
WHERE id = 'cmrvwtucd003o1ye87roun8ma' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j3$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j3$::jsonb
WHERE id = 'cmr996ixd00qx1ywytfd0i8ry' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j4$[{"label": "MedlinePlus Medical Encyclopedia. High potassium (hyperkalemia).", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j4$::jsonb
WHERE id = 'cmrpwg4r900b91yluo59ln70n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j5$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j5$::jsonb
WHERE id = 'cmr4bvexm00ee1ykyvhuz4wm0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j6$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j6$::jsonb
WHERE id = 'cmr4cbxwf00lc1ykyftg4o517' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j7$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j7$::jsonb
WHERE id = 'cmr4d3tnw00ui1ykyxstnqgd1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j8$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j8$::jsonb
WHERE id = 'cmr4dbau300xk1ykyf1gzu1mj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j9$[{"label": "MedlinePlus. Hyperthyroidism.", "url": "https://medlineplus.gov/hyperthyroidism.html"}]$j9$::jsonb
WHERE id = 'cmr4e6hiv01ay1ykygu2ka6c6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j10$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j10$::jsonb
WHERE id = 'cmr8fz9yc01o11ylowkuj5rqo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j11$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j11$::jsonb
WHERE id = 'cmr4exrjz01ky1ykymj9wyh08' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j12$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j12$::jsonb
WHERE id = 'cmr4fl1d401vb1yky7cr0g604' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j13$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j13$::jsonb
WHERE id = 'cmr891ear00y31yr94zleo1ar' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j14$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j14$::jsonb
WHERE id = 'cmr8atubp000d1ylo2ma3igmc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j15$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j15$::jsonb
WHERE id = 'cmr8cn87h00n51ylo4x948lcc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j16$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j16$::jsonb
WHERE id = 'cmr8dyovq014q1ylod2qhmcsk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j17$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j17$::jsonb
WHERE id = 'cmr8h1ej801x11ylocopcky02' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j18$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j18$::jsonb
WHERE id = 'cmr8f2l4l01gw1ylowbd539lw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j19$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j19$::jsonb
WHERE id = 'cmr8i0co1027n1yloiw329jvw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j20$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j20$::jsonb
WHERE id = 'cmr8j9seo02ko1ylocdw6yw9k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j21$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j21$::jsonb
WHERE id = 'cmr8juli8001g1ygiuo5p07q5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j22$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j22$::jsonb
WHERE id = 'cmr8q42we01jo1ygi9kyluome' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j23$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j23$::jsonb
WHERE id = 'cmqkgntkw0gj9l304obyavrr7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j24$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j24$::jsonb
WHERE id = 'cmqkgntsz0gshl304k6smnd6g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j25$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j25$::jsonb
WHERE id = 'cmr9bbuv401eh1ywyza3o9hdr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j26$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j26$::jsonb
WHERE id = 'cmr9bbtxr01e81ywyqtakugmu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j27$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j27$::jsonb
WHERE id = 'cmr98vr1s00ou1ywyc23xywjl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j28$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j28$::jsonb
WHERE id = 'cmr98dlhl00hg1ywy2ioud8g8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j29$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j29$::jsonb
WHERE id = 'cmr98mp7000li1ywyk2229213' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j30$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j30$::jsonb
WHERE id = 'cmr8o9kex01471ygihbxt1f25' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j31$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j31$::jsonb
WHERE id = 'cmr9c39aj01oo1ywy287d5l47' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j32$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j32$::jsonb
WHERE id = 'cmr9c35f701nc1ywyhco23a5s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j33$[{"label": "MedlinePlus. Osteoporosis.", "url": "https://medlineplus.gov/osteoporosis.html"}]$j33$::jsonb
WHERE id = 'cmr4outie00nb1y1e4k1olaxv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j34$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j34$::jsonb
WHERE id = 'cmr88v5qp00h11yw2i9gf53jp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j35$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j35$::jsonb
WHERE id = 'cmr88v5zi00h41yw2hxeyxf8h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j36$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j36$::jsonb
WHERE id = 'cmr89p2aa00nd1yw2putzmq22' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j37$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j37$::jsonb
WHERE id = 'cmrpvuwkz000b1yh5bg9zfm2j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j38$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis is treated immediately with epinephrine.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j38$::jsonb
WHERE id = 'cmrpvywau000k1yrtk6ew6eg1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j39$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j39$::jsonb
WHERE id = 'cmr88v41500gg1yw2jrove8p8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j40$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j40$::jsonb
WHERE id = 'cmrpwcl1s00591yrtrzohqlb9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j41$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j41$::jsonb
WHERE id = 'cmrruxvf400mf1y8w8d8potpm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j42$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j42$::jsonb
WHERE id = 'cmrruxvvq00ml1y8wudn5c374' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j43$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j43$::jsonb
WHERE id = 'cmqkgnt6k0g36l304f3ojegq0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j44$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j44$::jsonb
WHERE id = 'cmr8br7v100b61ylofo8mjxde' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j45$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j45$::jsonb
WHERE id = 'cmrpvuvhf00001yh5rfwkxq5t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j46$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j46$::jsonb
WHERE id = 'cmr8h1eu301x41ylo6x216ssq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j47$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j47$::jsonb
WHERE id = 'cmr8i09fv026j1ylo0b8evtbr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j48$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j48$::jsonb
WHERE id = 'cmr8i0atf02701ylor1fnk1jm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j49$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j49$::jsonb
WHERE id = 'cmr8lqj1r00dn1ygi8zqymhan' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j50$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j50$::jsonb
WHERE id = 'cmrr4t33o00101y6p49ku3v47' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j51$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j51$::jsonb
WHERE id = 'cmr8m9c4i00kb1ygi8r9a7gmy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j52$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j52$::jsonb
WHERE id = 'cmr8pgvpp01da1ygigjhixcsm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j53$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j53$::jsonb
WHERE id = 'cmrtffilm00041yx2x78vkop8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j54$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j54$::jsonb
WHERE id = 'cmr9861eq00dv1ywyhzybwcxd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j55$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j55$::jsonb
WHERE id = 'cmr9861kb00dx1ywyicisxoa6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j56$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j56$::jsonb
WHERE id = 'cmr9a11fx010s1ywyu9iva4kb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j57$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j57$::jsonb
WHERE id = 'cmr9buxpu01jw1ywyr3k2w0np' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j58$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j58$::jsonb
WHERE id = 'cmr9c9rmu01rz1ywyuprzm28d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j59$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j59$::jsonb
WHERE id = 'cmr9c9rua01s11ywy8cpzzy4j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j60$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j60$::jsonb
WHERE id = 'cmr9c9ry001s21ywyagjul648' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j61$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j61$::jsonb
WHERE id = 'cmru7tlkp000x1yd6rrfzqpxn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j62$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j62$::jsonb
WHERE id = 'cmr4bge59006q1ykykq020blr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j63$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j63$::jsonb
WHERE id = 'cmrth104n002h1yaxo07scavk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j64$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j64$::jsonb
WHERE id = 'cmrth8blj005j1yaxh0yln5ui' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j65$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j65$::jsonb
WHERE id = 'cmrvwu6wm003z1ye8d8ygthwa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j66$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j66$::jsonb
WHERE id = 'cmr8dylpr013v1yloe5tmc1fm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j67$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j67$::jsonb
WHERE id = 'cmru3gaif009z1y7wwjas0oe0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j68$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j68$::jsonb
WHERE id = 'cmrvm5ur3000djw04lrmdhb5i' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j69$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j69$::jsonb
WHERE id = 'cmr8lyy7v00gd1ygina58flro' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j70$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j70$::jsonb
WHERE id = 'cmr8lyz9s00gm1ygiv9xtdv47' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j71$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j71$::jsonb
WHERE id = 'cmr4b2zg600051ykya3d9zy0z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j72$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j72$::jsonb
WHERE id = 'cmr4bnxh500ay1ykyj9f13da0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j73$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j73$::jsonb
WHERE id = 'cmr4b30js000e1ykyrxb7cyyc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j74$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j74$::jsonb
WHERE id = 'cmr4cns2700nq1ykyhefb0z7h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j75$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j75$::jsonb
WHERE id = 'cmr8al9dh019r1yr9e6v1qsbe' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j76$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j76$::jsonb
WHERE id = 'cmrrtw4q3009a1y8wadr1arj2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j77$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j77$::jsonb
WHERE id = 'cmr8o9jrq013z1ygiw9o7ktnb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j78$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j78$::jsonb
WHERE id = 'cmrvwq4a2001q1ye8ytwfwgp4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j79$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j79$::jsonb
WHERE id = 'cmr4dbf5n00yn1ykyf2p870jc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j80$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j80$::jsonb
WHERE id = 'cmr8e5wp001701ylo4shg0vz6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j81$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j81$::jsonb
WHERE id = 'cmr8dqa38010c1yloo7og3dqu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j82$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j82$::jsonb
WHERE id = 'cmru8hx8600ad1yd6fw1ug5sd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j83$[{"label": "MedlinePlus. Sepsis.", "url": "https://medlineplus.gov/sepsis.html"}]$j83$::jsonb
WHERE id = 'cmru8hy3r00am1yd6obqnp188' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j84$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j84$::jsonb
WHERE id = 'cmr4cbxk600l81ykyrakxkth4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j85$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j85$::jsonb
WHERE id = 'cmr8esq1301el1yloemhrbyiv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j86$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j86$::jsonb
WHERE id = 'cmr4e6n8t01c31yky50zo0l0x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j87$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j87$::jsonb
WHERE id = 'cmr4g0ss1021m1ykyxt71666t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j88$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j88$::jsonb
WHERE id = 'cmr8hrqv702371ylov1bftfpk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j89$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j89$::jsonb
WHERE id = 'cmr8hrsc5023p1ylov99u7mka' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j90$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j90$::jsonb
WHERE id = 'cmr4bnxmo00b01ykyjdjh874h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j91$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j91$::jsonb
WHERE id = 'cmr4cnvci00om1yky85zv4w4k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j92$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j92$::jsonb
WHERE id = 'cmr8hrunm024i1yloxjbyaeon' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j93$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j93$::jsonb
WHERE id = 'cmr8hruqk024j1ylorka52fqv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j94$[{"label": "MedlinePlus. Urinary tract infection.", "url": "https://medlineplus.gov/urinarytractinfections.html"}]$j94$::jsonb
WHERE id = 'cmr4enjp801ig1yky9pz3sgcx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j95$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j95$::jsonb
WHERE id = 'cmr4fdhuv01rw1ykylsqfr4q2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j96$[{"label": "MedlinePlus. Gout.", "url": "https://medlineplus.gov/gout.html"}]$j96$::jsonb
WHERE id = 'b8xcca14c19dc872b3f3e6727a6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j97$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j97$::jsonb
WHERE id = 'cmrrvrs70009p1yl85w8x4g1z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j98$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j98$::jsonb
WHERE id = 'cmr4f6anj01ou1yky8hytcq75' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j99$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j99$::jsonb
WHERE id = 'cmr4f6d5z01pq1ykyw1yslked' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j100$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j100$::jsonb
WHERE id = 'cmr8atw27000u1yloxt4nulc6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j101$[{"label": "MedlinePlus Medical Encyclopedia. Low blood sodium (hyponatremia).", "url": "https://medlineplus.gov/ency/article/000394.htm"}]$j101$::jsonb
WHERE id = 'cmr8ayp5y00w01yw2yyc5dhr2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j102$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j102$::jsonb
WHERE id = 'cmr4fdgs101ro1ykyvt9rmmv0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j103$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j103$::jsonb
WHERE id = 'cmr4fdmp701ss1ykyeyralau3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j104$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j104$::jsonb
WHERE id = 'cmr8dyk64006f1yazpoo3jj5a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j105$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j105$::jsonb
WHERE id = 'cmruymlxk00511y2yhngg37dc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j106$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j106$::jsonb
WHERE id = 'cmr8atxi500181ylo9ys00m12' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j107$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j107$::jsonb
WHERE id = 'cmr8bxxy900dp1yloo2h0pm3c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j108$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j108$::jsonb
WHERE id = 'cmrpvdrvy002v1ync9xfkj9ly' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j109$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j109$::jsonb
WHERE id = 'cmrpvuwez00091yh5usm0zapn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j110$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j110$::jsonb
WHERE id = 'cmr8bxyy500dz1ylowuof2dyu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j111$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j111$::jsonb
WHERE id = 'cmr8c3m4c00h01ylo125anrk7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j112$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j112$::jsonb
WHERE id = 'cmr8c3nhw00he1ylorpfyf5nc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j113$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j113$::jsonb
WHERE id = 'cmrpw7axv004o1yh5wz3vogyp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j114$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j114$::jsonb
WHERE id = 'cmr31dkqm00bjjs04zo5enxhn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j115$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j115$::jsonb
WHERE id = 'cmr8bhh6700701ylokvfnuffd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j116$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j116$::jsonb
WHERE id = 'cmrpwfeky006q1yh514oz0bai' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j117$[{"label": "MedlinePlus Medical Encyclopedia. Low blood sodium (hyponatremia).", "url": "https://medlineplus.gov/ency/article/000394.htm"}]$j117$::jsonb
WHERE id = 'cmrvwp55d001i1ye8pseyjqam' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j118$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j118$::jsonb
WHERE id = 'cmr8bhjex007n1ylox49ckkij' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j119$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j119$::jsonb
WHERE id = 'cmr8br41m009v1ylomfv5a2tg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j120$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j120$::jsonb
WHERE id = 'cmrrt9uja000w1y8wxi07vth9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j121$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j121$::jsonb
WHERE id = 'cmrrtf487002l1y8w8l7b4u0z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j122$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j122$::jsonb
WHERE id = 'cmrrtf7g000331y8wo9jyrp0l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j123$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j123$::jsonb
WHERE id = 'cmr4dbfk300yr1ykyrbbkpi7b' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j124$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j124$::jsonb
WHERE id = 'cmr8cn8fz00n71ylozobtnxsg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j125$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j125$::jsonb
WHERE id = 'cmrrutcod00jg1y8w1q2aanz4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j126$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j126$::jsonb
WHERE id = 'cmr8cn9j200nk1ylooo4egchu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j127$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j127$::jsonb
WHERE id = 'cmr8dyley013s1yloa0quljvm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j128$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j128$::jsonb
WHERE id = 'cmr4bny6b00b71ykyuktag3db' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j129$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j129$::jsonb
WHERE id = 'cmr8dihcg00xi1ylo98i87ufz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j130$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j130$::jsonb
WHERE id = 'cmr8ehyog01a21ylof4c4dqo4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j131$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j131$::jsonb
WHERE id = 'cmr8e5xh4017a1yloxmfhfjc1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j132$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j132$::jsonb
WHERE id = 'cmtps7ts300021y1q58rll5ja' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j133$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j133$::jsonb
WHERE id = 'cmtps7umi000d1y1qp7r1cpbk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j134$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j134$::jsonb
WHERE id = 'cmtps7v5q000k1y1qbk65wsql' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j135$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j135$::jsonb
WHERE id = 'cmtpsb1hc00351y1qgtoh6kbi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j136$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j136$::jsonb
WHERE id = 'cmtpsb1pw00381y1qxxpvgm0f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j137$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j137$::jsonb
WHERE id = 'cmr8dq8pg00zz1ylotk1jzmlr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j138$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j138$::jsonb
WHERE id = 'cmtpwlglx001f1y6hdia05c16' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j139$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j139$::jsonb
WHERE id = 'cmtpwsq3z004v1y6hvs1apdl1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j140$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j140$::jsonb
WHERE id = 'cmr8gr3ly01ti1ylomxvle06f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j141$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j141$::jsonb
WHERE id = 'cmtpx3e8u00as1y6ha53ax9wh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j142$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j142$::jsonb
WHERE id = 'cmtpx6cp3000c1ymut030nem5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j143$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j143$::jsonb
WHERE id = 'cmq9fiiw600281yrw4h68g2wi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j144$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j144$::jsonb
WHERE id = 'cmtpx8ro1002z1ymuoc4ls2jr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j145$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j145$::jsonb
WHERE id = 'cmtpxc56q004s1ymu3mwj3o2m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j146$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j146$::jsonb
WHERE id = 'cmtpxc64u00541ymuslece2ib' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j147$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j147$::jsonb
WHERE id = 'cmtpxc6ai00561ymu9q7sdawl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j148$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j148$::jsonb
WHERE id = 'cmtpxc6d700571ymu2bgx3aj5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j149$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j149$::jsonb
WHERE id = 'cmtpxgqjq006p1ymu0dyvfune' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j150$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j150$::jsonb
WHERE id = 'cmtpxgt0h007k1ymuun96ak2w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j151$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j151$::jsonb
WHERE id = 'cmtpx6c1800041ymun76ruy28' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j152$[{"label": "MedlinePlus. Gout.", "url": "https://medlineplus.gov/gout.html"}]$j152$::jsonb
WHERE id = 'cmtpx6cgi00091ymusgxo4mar' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j153$[{"label": "MedlinePlus. Gout.", "url": "https://medlineplus.gov/gout.html"}]$j153$::jsonb
WHERE id = 'cmtpx6db0000k1ymuabgcuvwm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j154$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j154$::jsonb
WHERE id = 'cmtpx6dje000n1ymugzh7sbmr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j155$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j155$::jsonb
WHERE id = 'cmtpx8pr4002a1ymu7rmh7tmm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j156$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j156$::jsonb
WHERE id = 'cmtpx8pu0002b1ymumoy5ecvy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j157$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j157$::jsonb
WHERE id = 'cmtpx8si000371ymuv9h345m8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j158$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j158$::jsonb
WHERE id = 'cmr8fz86001nf1yloi3ba7v0x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j159$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j159$::jsonb
WHERE id = 'cmtpxc5zc00521ymuo7edj7jg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j160$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j160$::jsonb
WHERE id = 'cmr869j2n003o1yr9zlrr5ey9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j161$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j161$::jsonb
WHERE id = 'cmr869lly004e1yr90inc8fnz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j162$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j162$::jsonb
WHERE id = 'cmr86yb9m00ad1yr9lu4kc6pk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j163$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j163$::jsonb
WHERE id = 'cmr877ith00d61yr97jxju299' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j164$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j164$::jsonb
WHERE id = 'cmr87j3mb00hi1yr9q1j0txoi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j165$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j165$::jsonb
WHERE id = 'cmr87sm7t00ka1yr9o5hflhfj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j166$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j166$::jsonb
WHERE id = 'cmr88rzo700t51yr9j7w9tf9z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j167$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j167$::jsonb
WHERE id = 'cmrpvqa5l000r1ylusk1uiew1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j168$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j168$::jsonb
WHERE id = 'cmr98mlcs00kf1ywyfbc8inwq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j169$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j169$::jsonb
WHERE id = 'cmr4hb0bx003u1ydee95uw2nh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j170$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j170$::jsonb
WHERE id = 'cmrpw5z1l00791ylum6doi011' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j171$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j171$::jsonb
WHERE id = 'cmrpwg4x000bb1yluk0nzqgl4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j172$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j172$::jsonb
WHERE id = 'cmrqhnxx8004u1ypxafpotgc2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j173$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j173$::jsonb
WHERE id = 'cmrqhwjkn006n1ypxkfg04cjk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j174$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j174$::jsonb
WHERE id = 'cmr86y8pw009j1yr9awm48k2v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j175$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j175$::jsonb
WHERE id = 'cmr877j8500db1yr9j3fk3m85' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j176$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j176$::jsonb
WHERE id = 'cmr877lil00e31yr9g4a1w59g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j177$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j177$::jsonb
WHERE id = 'cmrrbw668000al1045c6t4bfj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j178$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j178$::jsonb
WHERE id = 'cmrrvb5iv00021yl8s7q9jz7y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j179$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j179$::jsonb
WHERE id = 'cmrrvb7u4000m1yl8vf4om34g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j180$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j180$::jsonb
WHERE id = 'cmrrvfk8c00331yl8falfxkmv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j181$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j181$::jsonb
WHERE id = 'cmr8baixa00491ylo5e7n5leu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j182$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j182$::jsonb
WHERE id = 'cmr88s1bh00tk1yr9h61conmp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j183$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j183$::jsonb
WHERE id = 'cmr88s2v000tz1yr9644hpxxn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j184$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j184$::jsonb
WHERE id = 'cmr8cnatd00nz1ylo3wtx8tj7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j185$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j185$::jsonb
WHERE id = 'cmr8cnbhf00o71yloefnaenyb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j186$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j186$::jsonb
WHERE id = 'cmrrvfi3w002c1yl834t2p6y4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j187$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j187$::jsonb
WHERE id = 'cmrrvjj2a004x1yl8rqvycdb5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j188$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j188$::jsonb
WHERE id = 'cmrrvjjqs00561yl82q2u5hs4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j189$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j189$::jsonb
WHERE id = 'cmrrvjjtj00571yl89bztaz8j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j190$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j190$::jsonb
WHERE id = 'cmr8d1xu400r61ylosz4kazeu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j191$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j191$::jsonb
WHERE id = 'cmrrvrstc009x1yl8wsesf2li' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j192$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j192$::jsonb
WHERE id = 'cmrrvvlhe00bv1yl8m9u1ik3w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j193$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j193$::jsonb
WHERE id = 'cmrrvvmh200c51yl8hy7tlusn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j194$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j194$::jsonb
WHERE id = 'cmrrvvmyt00ca1yl8q7y3erhf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j195$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j195$::jsonb
WHERE id = 'cmrrvzt6f00dj1yl8apx0yt7w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j196$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j196$::jsonb
WHERE id = 'cmrrvzua600du1yl8yupyrosl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j197$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j197$::jsonb
WHERE id = 'cmrrvzwqm00ee1yl82dsbq8rz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j198$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j198$::jsonb
WHERE id = 'cmrrw4wv300ft1yl89pfkigit' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j199$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j199$::jsonb
WHERE id = 'cmqatq0vh00011y8fmanl6b1v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j200$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j200$::jsonb
WHERE id = 'cmrsf7cl400041ynyeh6lo21j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j201$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j201$::jsonb
WHERE id = 'cmrsf7e75000o1ynynnzm6g3p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j202$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j202$::jsonb
WHERE id = 'cmrsf7ezn000y1yny9b0hwlgp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j203$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j203$::jsonb
WHERE id = 'cmrsfgn5700511yny1hwg9imh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j204$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j204$::jsonb
WHERE id = 'cmrtexh9e00031y30zwrmkk2l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j205$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j205$::jsonb
WHERE id = 'cmrtggbui00511ydw4nm7y0jv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j206$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j206$::jsonb
WHERE id = 'cmrtq0tko00151yqcbytfl73e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j207$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j207$::jsonb
WHERE id = 'cmrru3pgj00b11y8w6ws90bzd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j208$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j208$::jsonb
WHERE id = 'cmrtq0tsy00181yqc82nu3o2u' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j209$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j209$::jsonb
WHERE id = 'cmr8nmkq400xj1ygifwrv2uvu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j210$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j210$::jsonb
WHERE id = 'cmr8nmjiu00x31ygifx0dj697' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j211$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j211$::jsonb
WHERE id = 'cmrtq0utu001l1yqclrgeogt3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j212$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j212$::jsonb
WHERE id = 'cmr891bt700xe1yr9sqnimwxj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j213$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j213$::jsonb
WHERE id = 'cmrpv8h3y000n1yncv9i0ahxw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j214$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j214$::jsonb
WHERE id = 'cmrtq0vq8001w1yqcukr2aqqt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j215$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j215$::jsonb
WHERE id = 'cmrtq47mr00231yqcvuot8q66' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j216$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j216$::jsonb
WHERE id = 'cmru6qtbb000zl104yo7vvuu3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j217$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j217$::jsonb
WHERE id = 'cmru6qyus002ml1046skcnxf2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j218$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j218$::jsonb
WHERE id = 'cmra6lumu001cic04228wdvu1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j219$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j219$::jsonb
WHERE id = 'cmrrvrre7009f1yl8hh449m8z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j220$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j220$::jsonb
WHERE id = 'cmrsfd2f9002t1ynyuy2htdzf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j221$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j221$::jsonb
WHERE id = 'cmrrvzwkg00ed1yl8cikzum4x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j222$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j222$::jsonb
WHERE id = 'cmrrvjjle00541yl87zgjh9zr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j223$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j223$::jsonb
WHERE id = 'cmrrvzuh700dw1yl87cbt308d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j224$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j224$::jsonb
WHERE id = 'cmrrw4ygl00gd1yl837mqw41d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j225$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j225$::jsonb
WHERE id = 'cmrsf7d6b000b1ynyf3txgw70' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j226$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j226$::jsonb
WHERE id = 'cmrsfd35x00321ynyq5erb2w2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j227$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j227$::jsonb
WHERE id = 'cmrrutjmy00k11y8w8rsbikq1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j228$[{"label": "MedlinePlus. Atrial fibrillation.", "url": "https://medlineplus.gov/atrialfibrillation.html"}]$j228$::jsonb
WHERE id = 'cmrtexhc500041y30hhoy053m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j229$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j229$::jsonb
WHERE id = 'cmrtexhso000a1y308dxu5y08' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j230$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j230$::jsonb
WHERE id = 'cmrpw5x6n006r1ylub7az0f99' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j231$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j231$::jsonb
WHERE id = 'cmrrvrt1q00a01yl8v0pza8d9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j232$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j232$::jsonb
WHERE id = 'cmrrvvjjc00bb1yl828ujkpry' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j233$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j233$::jsonb
WHERE id = 'cmrvm5uug000hjw04evu9rxch' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j234$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j234$::jsonb
WHERE id = 'cmrvm5v0k000ojw04ergbaapy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j235$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j235$::jsonb
WHERE id = 'cmrtf2nsm000i1y30soxk5pqq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j236$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j236$::jsonb
WHERE id = 'cmrvm5z58001ljw04yfpwleqr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j237$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j237$::jsonb
WHERE id = 'cmr8h1dj201wr1ylofb0xmotd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j238$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j238$::jsonb
WHERE id = 'cmrtffk0n000m1yx2cxfr4qbk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j239$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j239$::jsonb
WHERE id = 'cmruigm7z002a1yceb6k9yblp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j240$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j240$::jsonb
WHERE id = 'cmr8bajfl004e1ylotf1ok4sl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j241$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j241$::jsonb
WHERE id = 'cmr8attlx00061ylodqjcfjt1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j242$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j242$::jsonb
WHERE id = 'cmr88ig3n00r31yr9w5bdh1jf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j243$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j243$::jsonb
WHERE id = 'cmr97yyc000a81ywy54azqxea' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j244$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j244$::jsonb
WHERE id = 'cmrsf7cf200021ynyv1inzjvs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j245$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j245$::jsonb
WHERE id = 'cmtps7vlx000q1y1qbgf1736n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j246$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j246$::jsonb
WHERE id = 'cmr8ccixu015u1yw27x7n8vmm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j247$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j247$::jsonb
WHERE id = 'cmr8hgdio01zr1ylowsn7eutp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j248$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j248$::jsonb
WHERE id = 'cmqkgnpux0d44l304j75w0xkt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j249$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j249$::jsonb
WHERE id = 'cmrtg5x3c000f1ydwev9hwge6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j250$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j250$::jsonb
WHERE id = 'cmrtg5xrn000m1ydwfjyb9dvt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j251$[{"label": "MedlinePlus Medical Encyclopedia. Low blood sodium (hyponatremia).", "url": "https://medlineplus.gov/ency/article/000394.htm"}]$j251$::jsonb
WHERE id = 'cmrpw16vr002c1yh5w7go8jci' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j252$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j252$::jsonb
WHERE id = 'cmr8h1hvt01xy1ylotwg09xo6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j253$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j253$::jsonb
WHERE id = 'cmr8fhgct01kd1yloapv5i1ai' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j254$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j254$::jsonb
WHERE id = 'cmrtg5yl1000u1ydwjin4p8ir' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j255$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j255$::jsonb
WHERE id = 'cmr8fhgge01ke1ylo1bun8o4y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j256$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j256$::jsonb
WHERE id = 'cmr8hgdtk01zu1ylo9iync6zm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j257$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j257$::jsonb
WHERE id = 'cmr8gr4um01ts1ylohatysv7x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j258$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j258$::jsonb
WHERE id = 'cmr8lc7c700ah1ygikzpf6hrj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j259$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j259$::jsonb
WHERE id = 'cmr8i09ri026n1ylo3az1g35m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j260$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j260$::jsonb
WHERE id = 'cmrtggacx004i1ydwmyt7stto' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j261$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j261$::jsonb
WHERE id = 'cmrtggcmf005b1ydwl40cjzda' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j262$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j262$::jsonb
WHERE id = 'cmr8i0d89027u1ylod5x254zb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j263$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j263$::jsonb
WHERE id = 'cmrtgretg00011yaxn04szz17' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j264$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j264$::jsonb
WHERE id = 'cmrpwiwhl006s1yrtbq99x5to' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j265$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j265$::jsonb
WHERE id = 'cmrth12gx00351yax3c3zxwer' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j266$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j266$::jsonb
WHERE id = 'cmr8ny4bj00zt1ygiqodyrdmo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j267$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j267$::jsonb
WHERE id = 'cmpnjj36j07w51ymx4b4rtr6u' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j268$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j268$::jsonb
WHERE id = 'cmr8nclvk00sx1ygib22r7ztk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j269$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j269$::jsonb
WHERE id = 'cmr8ise6m02dz1yloeekf118g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j270$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j270$::jsonb
WHERE id = 'cmr8mlut000nc1ygixl2top8k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j271$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j271$::jsonb
WHERE id = 'cmr8nmjda00x11ygiqiqsoarl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j272$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j272$::jsonb
WHERE id = 'cmr8isewr02e81yloiha5ec50' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j273$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j273$::jsonb
WHERE id = 'cmr8m9e3q00kl1ygi951z3s0r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j274$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j274$::jsonb
WHERE id = 'cmr8isf8802ec1ylojol6110m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j275$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j275$::jsonb
WHERE id = 'cmr8ncpxx00u31ygi52vnpn18' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j276$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j276$::jsonb
WHERE id = 'cmr8isfb702ed1ylo7pl7fdsl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j277$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j277$::jsonb
WHERE id = 'cmr8ncqmg00ua1ygisvplxmr3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j278$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j278$::jsonb
WHERE id = 'cmr8ncqps00ub1ygifjmb5mlr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j279$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j279$::jsonb
WHERE id = 'cmr8ny2jl00zf1ygisz8br5k7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j280$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j280$::jsonb
WHERE id = 'cmr8ny3g700zi1ygilkhdcvul' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j281$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j281$::jsonb
WHERE id = 'cmr8ny3m000zk1ygil72v7tc4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j282$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j282$::jsonb
WHERE id = 'cmr8ny3x400zo1ygifc8a2ryr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j283$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j283$::jsonb
WHERE id = 'cmr8j0pyi02hm1ylogd0eu4uu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j284$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j284$::jsonb
WHERE id = 'cmr8pgw1301de1ygivkxdjl7r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j285$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j285$::jsonb
WHERE id = 'cmr8i0d2j027s1ylofq4f2n1d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j286$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j286$::jsonb
WHERE id = 'cmr8j9qvh02k91yloc8af3km5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j287$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j287$::jsonb
WHERE id = 'cmr8j9tfj02ky1ylobb4mia77' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j288$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j288$::jsonb
WHERE id = 'cmrrvb5fa00011yl8hjnl3bum' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j289$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j289$::jsonb
WHERE id = 'cmr8ji5xv02mt1yloj7ldq2hr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j290$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j290$::jsonb
WHERE id = 'cmqgt4x0s001s1y0qw045inxd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j291$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j291$::jsonb
WHERE id = 'cmr8kib4m004h1ygimrrbrwjt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j292$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j292$::jsonb
WHERE id = 'cmr8qfp3o01mv1ygicgatckko' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j293$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j293$::jsonb
WHERE id = 'cmr8qfolu01mp1ygi3xv99s42' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j294$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j294$::jsonb
WHERE id = 'cmr8pvevi01g71ygilqis6p0r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j295$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j295$::jsonb
WHERE id = 'cmr8pvegy01g31ygilmtxnlgn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j296$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j296$::jsonb
WHERE id = 'cmr8q42z701jp1ygigchkuf4n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j297$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j297$::jsonb
WHERE id = 'cmr8om8tl016p1ygiy3pjezpk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j298$[{"label": "MedlinePlus. Ectopic pregnancy.", "url": "https://medlineplus.gov/ectopicpregnancy.html"}]$j298$::jsonb
WHERE id = 'cmr8om8o5016n1ygi6sd6mkxi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j299$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j299$::jsonb
WHERE id = 'cmr8pvfyb01gi1ygi0w66fd4c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j300$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j300$::jsonb
WHERE id = 'cmr8lc8d600at1ygieyd41gjd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j301$[{"label": "MedlinePlus. Migraine.", "url": "https://medlineplus.gov/migraine.html"}]$j301$::jsonb
WHERE id = 'cmru8v47w000s1y0sinwtm2ch' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j302$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j302$::jsonb
WHERE id = 'cmrpvvhbe002v1yluev871nbz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j303$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j303$::jsonb
WHERE id = 'cmru8hzzt00b51yd6jysdbuyj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j304$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j304$::jsonb
WHERE id = 'cmrrtw5c2009b1y8wop1p6s06' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j305$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j305$::jsonb
WHERE id = 'cmr8juj9x000p1ygisem270rj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j306$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j306$::jsonb
WHERE id = 'cmqxc0rrq00001ymanik9okns' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j307$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j307$::jsonb
WHERE id = 'cmra6lz8a003iic04ij3n3o86' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j308$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j308$::jsonb
WHERE id = 'cmrqhwl1000711ypx1hwby2p5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j309$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j309$::jsonb
WHERE id = 'cmr4cbu7400k41ykyjq3c6052' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j310$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j310$::jsonb
WHERE id = 'cmr4e6ict01b61ykyq8xv5dst' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j311$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j311$::jsonb
WHERE id = 'cmr8j9o4i02jj1ylobnyvaetx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j312$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j312$::jsonb
WHERE id = 'cmr8q43ah01jt1ygifgdinpkr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j313$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j313$::jsonb
WHERE id = 'cmr8q434v01jr1ygi93iwgd7s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j314$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j314$::jsonb
WHERE id = 'cmqkgnt1x0fwyl3040lqy4lls' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j315$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j315$::jsonb
WHERE id = 'cmr8lc8lo00aw1ygil6fip7uy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j316$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j316$::jsonb
WHERE id = 'cmqkgnt4n0g08l3048nk6vvei' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j317$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j317$::jsonb
WHERE id = 'cmr8fzav301oc1ylotoch5jkz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j318$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j318$::jsonb
WHERE id = 'cmr8f2kkf01gp1yloitu3463j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j319$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j319$::jsonb
WHERE id = 'cmr87iymk00g71yr94e13168x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j320$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j320$::jsonb
WHERE id = 'cmr88v2sw00g11yw2nmd0cwb2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j321$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j321$::jsonb
WHERE id = 'cmr8m9b0t00jx1ygi8nv85vff' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j322$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j322$::jsonb
WHERE id = 'cmr4o9foz00jh1y1e3t61eg0g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j323$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j323$::jsonb
WHERE id = 'cmr88v3v600ge1yw2h50v2k0k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j324$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j324$::jsonb
WHERE id = 'cmr8ncmnt00t51ygieh5qfygv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j325$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j325$::jsonb
WHERE id = 'cmr88v6gs00ha1yw2hih2ueao' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j326$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j326$::jsonb
WHERE id = 'cmqxcjw5y004f1ymaveo6m6p2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j327$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j327$::jsonb
WHERE id = 'cmr89p2gc00nf1yw2nqs5woh7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j328$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j328$::jsonb
WHERE id = 'cmqxc0snh000a1ymapbq4iqaw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j329$[{"label": "MedlinePlus Medical Encyclopedia. Low blood sodium (hyponatremia).", "url": "https://medlineplus.gov/ency/article/000394.htm"}]$j329$::jsonb
WHERE id = 'cmr8br6tm00at1yloq9emqqvx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j330$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j330$::jsonb
WHERE id = 'cmr4n53d300dl1y1eluzsx0zg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j331$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j331$::jsonb
WHERE id = 'cmr89b0dj00jc1yw2po8n1ns4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j332$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j332$::jsonb
WHERE id = 'cmr4cbybm00lh1yky41k36nlz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j333$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j333$::jsonb
WHERE id = 'cmr86y31r006e1yw2kp5bgnqp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j334$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j334$::jsonb
WHERE id = 'cmr86y35f006f1yw2l111b3qx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j335$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j335$::jsonb
WHERE id = 'cmr97c5oz000x1ywy3oi6vvwp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j336$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j336$::jsonb
WHERE id = 'cmr86y5zh00761yw2fv9unpfe' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j337$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j337$::jsonb
WHERE id = 'cmr8dqazl010k1ylo9wfgggi8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j338$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j338$::jsonb
WHERE id = 'cmr86y7iq007l1yw2o93oz2b0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j339$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j339$::jsonb
WHERE id = 'cmr88v3jb00ga1yw2x35g4bl2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j340$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j340$::jsonb
WHERE id = 'cmr88v3y800gf1yw2u5avtqeu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j341$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j341$::jsonb
WHERE id = 'cmrpvdq8x002a1yncbosbsl9o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j342$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j342$::jsonb
WHERE id = 'cmr89ozjf00mg1yw2pq4hg9yk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j343$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j343$::jsonb
WHERE id = 'cmr89ozpn00mi1yw26rz620jk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j344$[{"label": "MedlinePlus. Ectopic pregnancy.", "url": "https://medlineplus.gov/ectopicpregnancy.html"}]$j344$::jsonb
WHERE id = 'cmr89p21c00na1yw2e7d0qoc0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j345$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j345$::jsonb
WHERE id = 'cmr8ei29901ba1yloueuupk3q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j346$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j346$::jsonb
WHERE id = 'cmr8dynv0014g1yloiounm7jw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j347$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j347$::jsonb
WHERE id = 'cmr89p42t00nr1yw2im7ty8fr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j348$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j348$::jsonb
WHERE id = 'cmr8o9jxe01411ygiqdrbuvd5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j349$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j349$::jsonb
WHERE id = 'cmr86y40t006n1yw2tugb6bcx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j350$[{"label": "MedlinePlus. Osteoporosis.", "url": "https://medlineplus.gov/osteoporosis.html"}]$j350$::jsonb
WHERE id = 'cmr8by3ha012u1yw2pub0g2d9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j351$[{"label": "MedlinePlus. Gout.", "url": "https://medlineplus.gov/gout.html"}]$j351$::jsonb
WHERE id = 'cmr8by4yy013c1yw20y3qov49' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j352$[{"label": "MedlinePlus. Osteoporosis.", "url": "https://medlineplus.gov/osteoporosis.html"}]$j352$::jsonb
WHERE id = 'cmr88g3ci00cv1yw2kgohlebw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j353$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j353$::jsonb
WHERE id = 'cmr88v31u00g41yw26orcr29q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j354$[{"label": "MedlinePlus. Depression, including the postpartum period.", "url": "https://medlineplus.gov/depression.html"}]$j354$::jsonb
WHERE id = 'cmr8om7hu01681ygiikhal5g3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j355$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j355$::jsonb
WHERE id = 'cmr8bg0gn00zn1yw24zhf97qt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j356$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j356$::jsonb
WHERE id = 'cmr8bg2gm010b1yw2lofqd344' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j357$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j357$::jsonb
WHERE id = 'cmr4e6hml01az1ykyekoa3nge' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j358$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j358$::jsonb
WHERE id = 'cmr8cchpv015l1yw2zhdy4tst' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j359$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j359$::jsonb
WHERE id = 'cmr8j0n9k02gp1ylo9pe1ge59' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j360$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j360$::jsonb
WHERE id = 'cmr8hruff024f1yloqzu9dwdi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j361$[{"label": "MedlinePlus. Cirrhosis.", "url": "https://medlineplus.gov/cirrhosis.html"}]$j361$::jsonb
WHERE id = 'cmr8adzg300to1yw2m9ni51xp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j362$[{"label": "MedlinePlus. Osteoporosis.", "url": "https://medlineplus.gov/osteoporosis.html"}]$j362$::jsonb
WHERE id = 'cmr8d6fbh000i1yaztwvty1wy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j363$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j363$::jsonb
WHERE id = 'cmr8p26zf019u1ygioitrmyzm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j364$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j364$::jsonb
WHERE id = 'cmr9bbw3s01et1ywyjooazm6b' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j365$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j365$::jsonb
WHERE id = 'cmr8q40ra01ix1ygiwfq4dosd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j366$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j366$::jsonb
WHERE id = 'cmrpv8g2q000a1ynchv8n63v1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j367$[{"label": "MedlinePlus. Gout.", "url": "https://medlineplus.gov/gout.html"}]$j367$::jsonb
WHERE id = 'cmrpv8gb3000d1ync1mtkzksg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j368$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j368$::jsonb
WHERE id = 'cmrpv8h0x000m1yncd5k61ych' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j369$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j369$::jsonb
WHERE id = 'cmrrvnj8c006u1yl89n5wal0s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j370$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j370$::jsonb
WHERE id = 'cmrpvdse200311yncisa4v5u7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j371$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j371$::jsonb
WHERE id = 'cmruymcbq004x1y2yoo902s62' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j372$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j372$::jsonb
WHERE id = 'cmr9862tq00ed1ywyw9a9c2ln' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j373$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j373$::jsonb
WHERE id = 'cmr8pvczx01fo1ygiehtmutsc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j374$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j374$::jsonb
WHERE id = 'cmr4f6ahn01os1yky33wml47s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j375$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j375$::jsonb
WHERE id = 'cmr8bahzm00401yloyj3qezlg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j376$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j376$::jsonb
WHERE id = 'cmrpvyums00001yrtqwmbr8ah' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j377$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j377$::jsonb
WHERE id = 'cmrpvyvkh000b1yrttw4rwkyo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j378$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j378$::jsonb
WHERE id = 'cmr8clr6j019m1yw2pu9j8hic' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j379$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j379$::jsonb
WHERE id = 'cmr8pvfgt01gd1ygi091v4b2x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j380$[{"label": "MedlinePlus Medical Encyclopedia. Low blood sodium (hyponatremia).", "url": "https://medlineplus.gov/ency/article/000394.htm"}]$j380$::jsonb
WHERE id = 'cmr8dn6fi004j1yazxqtiyt9x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j381$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j381$::jsonb
WHERE id = 'cmr8dyj9300661yazlsdfzzlp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j382$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j382$::jsonb
WHERE id = 'cmr8qfnsm01mf1ygia5a3smbw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j383$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j383$::jsonb
WHERE id = 'cmr8dyn44007f1yazlcsvybiy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j384$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j384$::jsonb
WHERE id = 'cmr8ei24j009v1yaz69j39mkj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j385$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j385$::jsonb
WHERE id = 'cmr4eemzp01fo1ykyelja5rjs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j386$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j386$::jsonb
WHERE id = 'cmr8qfqgt01nc1ygicatjc4za' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j387$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j387$::jsonb
WHERE id = 'cmrpv8fu700071ync12mjr4eo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j388$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j388$::jsonb
WHERE id = 'cmr97z1pk00b61ywycnq0jxdg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j389$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j389$::jsonb
WHERE id = 'cmrpv8h9k000p1yncy3i8tiva' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j390$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j390$::jsonb
WHERE id = 'cmrpvdqn1002f1ync9yr1j7qg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j391$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j391$::jsonb
WHERE id = 'cmrpvdqpw002g1yncz4ja1vyc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j392$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j392$::jsonb
WHERE id = 'cmr8pgtwi01co1ygijmo3txyu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j393$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j393$::jsonb
WHERE id = 'cmrpwahxw009r1yluvigkzluz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j394$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j394$::jsonb
WHERE id = 'cmr97qeyc00771ywyjyxybutz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j395$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j395$::jsonb
WHERE id = 'cmra6lu1r000jic0497uhqtw7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j396$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j396$::jsonb
WHERE id = 'cmr8ccjrb01641yw25jnbr4tt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j397$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j397$::jsonb
WHERE id = 'cmr8ei2q100a11yazpe0patrh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j398$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j398$::jsonb
WHERE id = 'cmr8ei0hr009f1yazeodl9lot' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j399$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j399$::jsonb
WHERE id = 'cmr9c9o2101r01ywyt8ygfo2y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j400$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j400$::jsonb
WHERE id = 'cmr97i29v004h1ywyfuu5viqx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j401$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j401$::jsonb
WHERE id = 'cmr99ij0w00uh1ywyw0sg94gt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j402$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j402$::jsonb
WHERE id = 'cmrpvuy66000u1yh5qh669vk2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j403$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j403$::jsonb
WHERE id = 'cmr8bxxjx00dl1ylo0985dqzt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j404$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j404$::jsonb
WHERE id = 'cmr8bxynh00dw1yloctio3x5p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j405$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j405$::jsonb
WHERE id = 'cmr9buyk101k51ywy3b4glugu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j406$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j406$::jsonb
WHERE id = 'cmr9buxxn01jy1ywyrmgwm4ol' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j407$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j407$::jsonb
WHERE id = 'cmr99rewp00xa1ywyy5f72pex' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j408$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j408$::jsonb
WHERE id = 'cmr4dbdtl00yb1ykyzmhwioem' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j409$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j409$::jsonb
WHERE id = 'cmr8br6zc00av1ylo46qj6mj3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j410$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j410$::jsonb
WHERE id = 'cmr8ccgwg00kn1ylo90ngavte' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j411$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j411$::jsonb
WHERE id = 'cmr8bhj7p007l1ylovxfagwaz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j412$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j412$::jsonb
WHERE id = 'cmrr4t1zu000m1y6p9tikdwtv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j413$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j413$::jsonb
WHERE id = 'cmr97c4le000m1ywyagdzlpe4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j414$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j414$::jsonb
WHERE id = 'cmrvwt03d00351ye8e96qjq7j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j415$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j415$::jsonb
WHERE id = 'cmr99iixe00ug1ywyksv9dd52' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j416$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j416$::jsonb
WHERE id = 'cmr99iijh00uc1ywyxwg3bvtj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j417$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j417$::jsonb
WHERE id = 'cmrvwtupr003s1ye8gtp2qudf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j418$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j418$::jsonb
WHERE id = 'cmr99ihyh00u61ywy7nxfwa3g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j419$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j419$::jsonb
WHERE id = 'cmrrutiye00jz1y8w77gb9ae8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j420$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j420$::jsonb
WHERE id = 'cmr4cbyhj00lj1ykyokjtateo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j421$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j421$::jsonb
WHERE id = 'cmra6lzuq0044ic04hifsvr0v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j422$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j422$::jsonb
WHERE id = 'cmr98ml2500kc1ywyl2cxz4qw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j423$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j423$::jsonb
WHERE id = 'cmr8dba4000uf1ylob4thyo7t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j424$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j424$::jsonb
WHERE id = 'cmr97qhl1007y1ywy5lmpefi0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j425$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j425$::jsonb
WHERE id = 'cmr97i0i5003z1ywysql8885r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j426$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j426$::jsonb
WHERE id = 'cmr99rifp00yi1ywyz13ak6mm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j427$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j427$::jsonb
WHERE id = 'cmr99rfe900xg1ywyicl08vkj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j428$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j428$::jsonb
WHERE id = 'cmr99rfbd00xf1ywy148gu3g6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j429$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j429$::jsonb
WHERE id = 'cmr97qfg5007c1ywyc0fjj1o6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j430$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j430$::jsonb
WHERE id = 'cmrrvb6jt000c1yl8or5cqd7h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j431$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j431$::jsonb
WHERE id = 'cmrrvb6rd000e1yl864trdem2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j432$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j432$::jsonb
WHERE id = 'cmtps7txq00041y1qvii0x4v2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j433$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j433$::jsonb
WHERE id = 'cmr97qfxv007h1ywybzncm7m8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j434$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j434$::jsonb
WHERE id = 'cmr97z0xs00ay1ywycogiqbfv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j435$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j435$::jsonb
WHERE id = 'cmr97qgir007n1ywyonjxk771' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j436$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis is treated immediately with epinephrine.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j436$::jsonb
WHERE id = 'cmrpw7add004h1yh5a2zumi89' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j437$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j437$::jsonb
WHERE id = 'cmr97yzhy00ak1ywyrv84hqf5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j438$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j438$::jsonb
WHERE id = 'cmtpwsph3004n1y6hqnzj6zgz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j439$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j439$::jsonb
WHERE id = 'cmtpx3clv00a71y6hdszeexyh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j440$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j440$::jsonb
WHERE id = 'cmtpx3eh500av1y6hnngcswxv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j441$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis is treated immediately with epinephrine.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j441$::jsonb
WHERE id = 'cmrpw7c7q00541yh50nh48kxp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j442$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j442$::jsonb
WHERE id = 'cmtpx6doz000p1ymusfhqz0x5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j443$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j443$::jsonb
WHERE id = 'cmtpxc77z005i1ymure6vy3zg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j444$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j444$::jsonb
WHERE id = 'cmtpxgs1u00781ymulbphsjs4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j445$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j445$::jsonb
WHERE id = 'cmrrvfjm5002v1yl8xw14bng1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j446$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j446$::jsonb
WHERE id = 'cmtpxgs7e007a1ymuufljmnxb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j447$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j447$::jsonb
WHERE id = 'cmr98dnn500i21ywy9jrfczap' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j448$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j448$::jsonb
WHERE id = 'cmtpxc5tm00501ymuhqxxrriz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j449$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j449$::jsonb
WHERE id = 'cmrrvfke400351yl8k8vgl5mq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j450$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j450$::jsonb
WHERE id = 'cmr88icgz00q41yr91s363hhq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j451$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j451$::jsonb
WHERE id = 'cmr88idlh00qf1yr9beeqhnry' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j452$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j452$::jsonb
WHERE id = 'cmrpvux64000i1yh5al51283d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j453$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j453$::jsonb
WHERE id = 'cmrqhnyxf00561ypxczqf70wj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j454$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j454$::jsonb
WHERE id = 'cmr87j05t00gk1yr9ja47zxcm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j455$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j455$::jsonb
WHERE id = 'cmr88s3w100u91yr9wsznhcwa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j456$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j456$::jsonb
WHERE id = 'cmr8ccf9f00kb1ylox9ks5fwr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j457$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j457$::jsonb
WHERE id = 'cmrrvzvco00e41yl8gllfgfht' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j458$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j458$::jsonb
WHERE id = 'cmrpw192d002y1yh57azr4osq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j459$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j459$::jsonb
WHERE id = 'cmrsf7d3k000a1ynyl5vu2r0x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j460$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j460$::jsonb
WHERE id = 'cmr8fhe5g01jr1ylo7j1pure6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j461$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j461$::jsonb
WHERE id = 'cmrtggcjo005a1ydw6gtb8vfi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j462$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j462$::jsonb
WHERE id = 'cmrrvnkp6007d1yl8eytj0bm5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j463$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j463$::jsonb
WHERE id = 'cmrsfd1tw002m1ynymh17wlsk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j464$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j464$::jsonb
WHERE id = 'cmr8h1gbx01xj1ylo1w0q3owx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j465$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j465$::jsonb
WHERE id = 'cmr8l1jme006c1ygii1wc825q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j466$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j466$::jsonb
WHERE id = 'cmrpwivwq006m1yrthqg189cv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j467$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j467$::jsonb
WHERE id = 'cmr8lqiz200dm1ygibyqlcyb2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j468$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j468$::jsonb
WHERE id = 'cmr87snxw00kv1yr9hsheb8hb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j469$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j469$::jsonb
WHERE id = 'cmqkgnt100fvul3042520szyy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j470$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j470$::jsonb
WHERE id = 'cmqkgnt6j0g31l304sn5x33b1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j471$[{"label": "MedlinePlus. Ulcerative colitis.", "url": "https://medlineplus.gov/ulcerativecolitis.html"}]$j471$::jsonb
WHERE id = 'cmqxcjvjc00481yma1v2kyn4u' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j472$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j472$::jsonb
WHERE id = 'cmr4qbt2t00vn1y1eeko0l075' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j473$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j473$::jsonb
WHERE id = 'cmr8bfzj900zc1yw2lvt93sio' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j474$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j474$::jsonb
WHERE id = 'cmr8bg2pi010e1yw2jg7s3kw8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j475$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j475$::jsonb
WHERE id = 'cmr8dyk8y006g1yazarhp5uco' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j476$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j476$::jsonb
WHERE id = 'cmr98vq1i00oi1ywyfosknalt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j477$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j477$::jsonb
WHERE id = 'cmr8dykex006i1yaz4ep2gyma' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j478$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j478$::jsonb
WHERE id = 'cmr98vqpu00oq1ywy5lwz1i3h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j479$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j479$::jsonb
WHERE id = 'cmr8qfq2e01n71ygizcvf95pc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j480$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j480$::jsonb
WHERE id = 'cmr8bxyjy00dv1ylo40t9t0wr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j481$[{"label": "MedlinePlus Medical Encyclopedia. High potassium (hyperkalemia).", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j481$::jsonb
WHERE id = 'cmrpwagnf009e1ylurwsiyqxc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j482$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j482$::jsonb
WHERE id = 'cmr8c3kyj00gp1ylotit1k28z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j483$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j483$::jsonb
WHERE id = 'cmrpvywm8000o1yrt5eobudqt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j484$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j484$::jsonb
WHERE id = 'cmr8c3mey00h31yloe16yjve7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j485$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j485$::jsonb
WHERE id = 'cmr9bbrel01dk1ywyn8ex2d0e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j486$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j486$::jsonb
WHERE id = 'cmr99ilm900v81ywyb9bl4w3k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j487$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j487$::jsonb
WHERE id = 'cmr9bbrx101dp1ywylkb00iyi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j488$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j488$::jsonb
WHERE id = 'cmr9bv19001l21ywy2jgdq8il' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j489$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j489$::jsonb
WHERE id = 'cmr9bburj01eg1ywytfzatpd2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j490$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j490$::jsonb
WHERE id = 'cmr99rgwp00xz1ywyp2y8liix' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j491$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j491$::jsonb
WHERE id = 'cmr9c9mye01qp1ywy66j9eq9a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j492$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j492$::jsonb
WHERE id = 'cmrrvb814000o1yl810moggrm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j493$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j493$::jsonb
WHERE id = 'cmrrvb8su000w1yl8qtdti32a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j494$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j494$::jsonb
WHERE id = 'cmr97qh3s007t1ywynm7eqzoy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j495$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder that destroys beta cells.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j495$::jsonb
WHERE id = 'cmr9c9qxr01rs1ywyjgtswpfy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j496$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j496$::jsonb
WHERE id = 'cmr97i35t004q1ywyylarnuxx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j497$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j497$::jsonb
WHERE id = 'cmr9c9pyn01rj1ywyu3srjaqt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j498$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j498$::jsonb
WHERE id = 'cmrr4t1r2000j1y6prnljdto5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j499$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j499$::jsonb
WHERE id = 'cmrrtw7wp009n1y8wv1sune9p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j500$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j500$::jsonb
WHERE id = 'cmr98vpox00oe1ywyqhbsfn09' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j501$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j501$::jsonb
WHERE id = 'cmr8c3lpp00gw1yloekfco88d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j502$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j502$::jsonb
WHERE id = 'cmrtprxki000g1yqc4gvp8uiw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j503$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j503$::jsonb
WHERE id = 'cmr8c3oiq00ho1yloaev1qf6v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j504$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j504$::jsonb
WHERE id = 'cmr9bbq9601da1ywyw9bfe7rn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j505$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j505$::jsonb
WHERE id = 'cmr9bbrpp01dn1ywyq6ttmnbr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j506$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j506$::jsonb
WHERE id = 'cmr8digkl00x91ylozjdvula7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j507$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j507$::jsonb
WHERE id = 'cmrrtw1mb008y1y8waqdjrp64' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j508$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j508$::jsonb
WHERE id = 'cmrrtqyzn00761y8w5rph6n6e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j509$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j509$::jsonb
WHERE id = 'cmrr4ybyx002k1y6psek79mo1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j510$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j510$::jsonb
WHERE id = 'cmr9bbqgw01db1ywyfq421fva' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j511$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j511$::jsonb
WHERE id = 'cmr8g7bhb01qy1ylobyevzn2k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j512$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j512$::jsonb
WHERE id = 'cmr97yzt600an1ywywzxwbrqo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j513$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j513$::jsonb
WHERE id = 'cmr8ehycn019y1ylo5rrckh5w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j514$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j514$::jsonb
WHERE id = 'cmr9bv01901kn1ywy8u8mebq1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j515$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j515$::jsonb
WHERE id = 'cmrth10bo002j1yaxjczk9o1v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j516$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j516$::jsonb
WHERE id = 'cmrrug0na00g41y8wrf4cg7le' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j517$[{"label": "MedlinePlus. Sepsis.", "url": "https://medlineplus.gov/sepsis.html"}]$j517$::jsonb
WHERE id = 'cmr8dih6200xg1ylocotmw7y4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j518$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j518$::jsonb
WHERE id = 'cmr9c9mr601qn1ywyffyljpeq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j519$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j519$::jsonb
WHERE id = 'cmrrutfqn00jr1y8wn7o1sxe5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j520$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j520$::jsonb
WHERE id = 'cmrr4y95i00291y6pdhfbc15c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j521$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j521$::jsonb
WHERE id = 'cmru2q8na000l1y7wxrmydg1o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j522$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j522$::jsonb
WHERE id = 'cmr8diey200wp1ylo175vxexy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j523$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j523$::jsonb
WHERE id = 'cmr97z2kn00bf1ywy2nj4oi12' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j524$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j524$::jsonb
WHERE id = 'cmrrtqxmh006s1y8wo5h1b43y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j525$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j525$::jsonb
WHERE id = 'cmrrtw37a00951y8wpvck4zm9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j526$[{"label": "MedlinePlus. Depression, including the postpartum period.", "url": "https://medlineplus.gov/depression.html"}]$j526$::jsonb
WHERE id = 'cmr9b2clk01a51ywyoyenkp2b' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j527$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j527$::jsonb
WHERE id = 'cmr9862fc00e81ywybgq1oz9c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j528$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j528$::jsonb
WHERE id = 'cmrrtqzgq007b1y8wxdeid1p9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j529$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j529$::jsonb
WHERE id = 'cmrrt93ep00051y8w6se8yqyq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j530$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j530$::jsonb
WHERE id = 'cmrrtqxrf006t1y8w47z1koz5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j531$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j531$::jsonb
WHERE id = 'cmr8g7cpg01rd1ylorrn31jf1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j532$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j532$::jsonb
WHERE id = 'cmrrtr04k007i1y8ww5khyw5h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j533$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j533$::jsonb
WHERE id = 'cmrrtw2hd00901y8wg5tv5gif' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j534$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j534$::jsonb
WHERE id = 'cmrtq0vjw001u1yqcjpz63j0g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j535$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j535$::jsonb
WHERE id = 'cmrpw19he00331yh56ohhh6qg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j536$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j536$::jsonb
WHERE id = 'cmrthhr9l007h1yaxdigcnq3l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j537$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j537$::jsonb
WHERE id = 'cmr8g7byr01r41yloz0apqinq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j538$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j538$::jsonb
WHERE id = 'cmrtqfz1s00061yx3ik837p1k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j539$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j539$::jsonb
WHERE id = 'cmrpw7as7004m1yh5u0ykq4th' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j540$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j540$::jsonb
WHERE id = 'cmrpw7b96004s1yh5qbxyuf3q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j541$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j541$::jsonb
WHERE id = 'cmr8lyzgj00go1ygisiog3gqm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j542$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j542$::jsonb
WHERE id = 'cmr8lyyj900gg1ygiz2z83nd3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j543$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j543$::jsonb
WHERE id = 'cmr8g796u01q61ylo5kjxqo8y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j544$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j544$::jsonb
WHERE id = 'cmr8g79fm01q91yloohoq5d3t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j545$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j545$::jsonb
WHERE id = 'cmrpwcj7e004n1yrtdcejxy2o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j546$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j546$::jsonb
WHERE id = 'cmr8dymjc01431ylo78puysrn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j547$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j547$::jsonb
WHERE id = 'cmr9c35i201nd1ywycq6ifso4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j548$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j548$::jsonb
WHERE id = 'cmr97i0eo003y1ywyn6fos5e2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j549$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j549$::jsonb
WHERE id = 'cmr9c37ii01o21ywyxyxfc3xh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j550$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j550$::jsonb
WHERE id = 'cmr8lz0jg00gy1ygi37698epf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j551$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j551$::jsonb
WHERE id = 'cmr9c39ge01oq1ywy0t1uxmpv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j552$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j552$::jsonb
WHERE id = 'cmr8lz2ho00hi1ygiwykuio83' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j553$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j553$::jsonb
WHERE id = 'cmr97i1dr00481ywypr0t8dt4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j554$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j554$::jsonb
WHERE id = 'cmr97i1h900491ywyxy5uled8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j555$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j555$::jsonb
WHERE id = 'cmru2qb91001g1y7wdhr6lksj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j556$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j556$::jsonb
WHERE id = 'cmru3n3ic00dc1y7wg3tblirr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j557$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j557$::jsonb
WHERE id = 'cmr4b2zt600071ykyu0bnbmm5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j558$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j558$::jsonb
WHERE id = 'cmr4cvezr00s61ykyuioz2fta' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j559$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j559$::jsonb
WHERE id = 'cmr4d3ufz00ur1ykydltrrjdd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j560$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j560$::jsonb
WHERE id = 'cmr9c9oyl01r91ywyeybl8vog' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j561$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j561$::jsonb
WHERE id = 'cmru7tkep000i1yd6738o41cj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j562$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j562$::jsonb
WHERE id = 'cmr9c9pgp01re1ywyghkw86ub' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j563$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j563$::jsonb
WHERE id = 'cmr8nclf500st1ygirhfa03x0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j564$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j564$::jsonb
WHERE id = 'cmr4cvdeg00rn1ykysklowiax' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j565$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j565$::jsonb
WHERE id = 'cmrpwfdo7006h1yh5rbvub9dg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j566$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j566$::jsonb
WHERE id = 'cmr8bhhgr00731ylonozbd9qn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j567$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j567$::jsonb
WHERE id = 'cmr8br4jf00a11ylo5fgkl3p6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j568$[{"label": "MedlinePlus. Hyperthyroidism.", "url": "https://medlineplus.gov/hyperthyroidism.html"}]$j568$::jsonb
WHERE id = 'cmr8ccdr600jt1ylohfvfk6kz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j569$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j569$::jsonb
WHERE id = 'cmr8cceht00k21yloyxr4enda' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j570$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j570$::jsonb
WHERE id = 'cmr8db71d00tl1yloqgehw2bs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j571$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j571$::jsonb
WHERE id = 'cmr8e5wgk016x1yloyc0gfuna' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j572$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j572$::jsonb
WHERE id = 'cmr8e5zi7017z1ylovo3j5lvr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j573$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j573$::jsonb
WHERE id = 'cmr8nmkss00xk1ygi9yj001km' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j574$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j574$::jsonb
WHERE id = 'cmr8o9kkl01491ygik9fsv3u5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j575$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j575$::jsonb
WHERE id = 'cmr8hggjo020m1ylovv8kjd0w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j576$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j576$::jsonb
WHERE id = 'cmru7tj6200031yd6fkxxqu07' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j577$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j577$::jsonb
WHERE id = 'cmru7tkaj000h1yd6ec62zohv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j578$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j578$::jsonb
WHERE id = 'cmru856id00441yd6hg77c1my' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j579$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j579$::jsonb
WHERE id = 'cmr891b3y00x71yr92yvqv4x8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j580$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j580$::jsonb
WHERE id = 'cmru8bfsg007l1yd6euupuq5y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j581$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j581$::jsonb
WHERE id = 'cmru8bgjp007u1yd67ylym2wu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j582$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j582$::jsonb
WHERE id = 'cmr891cb200xj1yr9pww5fqpt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j583$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j583$::jsonb
WHERE id = 'cmru8v30d000d1y0sfg8nuak2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j584$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j584$::jsonb
WHERE id = 'cmru8v68k001h1y0sg887y39c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j585$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j585$::jsonb
WHERE id = 'cmr8ji87702nl1ylo01if3g08' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j586$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j586$::jsonb
WHERE id = 'cmr8lqk1c00dz1ygixcmgpczx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j587$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j587$::jsonb
WHERE id = 'cmr9c9nuq01qy1ywyskf2wnrf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j588$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j588$::jsonb
WHERE id = 'cmr8lc7ku00ak1ygikqxum6al' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j589$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j589$::jsonb
WHERE id = 'cmr8lqjm900du1ygi0bdlu642' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j590$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j590$::jsonb
WHERE id = 'cmr8ny4ym01001ygibpgl7xih' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j591$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j591$::jsonb
WHERE id = 'cmrtqfzaa00091yx33tz88wb0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j592$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j592$::jsonb
WHERE id = 'cmr8lc573009q1ygi03rlze86' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j593$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j593$::jsonb
WHERE id = 'cmq339ykg00611yiuyinluv4d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j594$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j594$::jsonb
WHERE id = 'cmr8dyo3s007r1yaz5b1ycrk6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j595$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j595$::jsonb
WHERE id = 'cmra6ludj000zic04z2jfw3j1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j596$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j596$::jsonb
WHERE id = 'cmrrvnlop007q1yl8vvrneuik' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j597$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j597$::jsonb
WHERE id = 'cmrtq0vdb001s1yqc558pnwzp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j598$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j598$::jsonb
WHERE id = 'cmr4dbg5600yw1ykyk63yrysy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j599$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j599$::jsonb
WHERE id = 'cmqvw68ee01wuju04qh97az4p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j600$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j600$::jsonb
WHERE id = 'cmr9c356i01n91ywytldccp98' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j601$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j601$::jsonb
WHERE id = 'cmr8o9jjh013w1ygi3y00jn86' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j602$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j602$::jsonb
WHERE id = 'cmr8o9ghg012u1ygiha6ry60y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j603$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j603$::jsonb
WHERE id = 'cmr8ji9dg02nz1yloiztjmquk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j604$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j604$::jsonb
WHERE id = 'cmr8lc3yu009d1ygiqjbh4joj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j605$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j605$::jsonb
WHERE id = 'cmr8nmjwb00x81ygi6vm9xp91' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j606$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j606$::jsonb
WHERE id = 'cmr9c36m601nr1ywytrg8m1yn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j607$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j607$::jsonb
WHERE id = 'cmrtqg1a4000y1yx3nczd7iro' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j608$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j608$::jsonb
WHERE id = 'cmr9c36xh01nv1ywy4a0j00ml' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j609$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j609$::jsonb
WHERE id = 'cmrrtf3mr002f1y8wceear3pp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j610$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j610$::jsonb
WHERE id = 'cmrrtm6mc004p1y8whyge2592' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j611$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j611$::jsonb
WHERE id = 'cmrtqq65y001d1yx30h9plthq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j612$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j612$::jsonb
WHERE id = 'cmr87iz5h00gb1yr98ylk00rp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j613$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j613$::jsonb
WHERE id = 'cmrrtw0tw008q1y8wz2n3n4yn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j614$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j614$::jsonb
WHERE id = 'cmrr4y9ut002c1y6pq9169ceg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j615$[{"label": "MedlinePlus. Cirrhosis.", "url": "https://medlineplus.gov/cirrhosis.html"}]$j615$::jsonb
WHERE id = 'cmrr4ydke002r1y6p7hfd8zok' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j616$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j616$::jsonb
WHERE id = 'cmrtprwmj00041yqccqf794b7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j617$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j617$::jsonb
WHERE id = 'cmrpvdryp002w1ync4ete3mt7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j618$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j618$::jsonb
WHERE id = 'cmtpwlgj5001e1y6h88xolo55' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j619$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j619$::jsonb
WHERE id = 'cmtpwlgrl001h1y6h9v0pi1mc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j620$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j620$::jsonb
WHERE id = 'cmtpwsng4003x1y6htzqsvbo4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j621$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j621$::jsonb
WHERE id = 'cmr4o9ho500k11y1e1ub7clne' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j622$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j622$::jsonb
WHERE id = 'cmr85uhht000k1yw2ypaimn0r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j623$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j623$::jsonb
WHERE id = 'cmr4b31y6000q1ykym73uze8l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j624$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j624$::jsonb
WHERE id = 'cmr985zud00db1ywy2sh8qhqf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j625$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j625$::jsonb
WHERE id = 'cmr4dbf2400ym1ykyf8jhq7ow' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j626$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j626$::jsonb
WHERE id = 'cmr4d3vjw00v41yky4phtssrb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j627$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j627$::jsonb
WHERE id = 'cmr4d3vyw00v91ykyv3biggp1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j628$[{"label": "MedlinePlus. Atrial fibrillation.", "url": "https://medlineplus.gov/atrialfibrillation.html"}]$j628$::jsonb
WHERE id = 'cmr8bhi4x007a1ylo71y1nt4h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j629$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j629$::jsonb
WHERE id = 'cmr8br3vi009t1ylovai73dwe' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j630$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j630$::jsonb
WHERE id = 'cmr98626w00e51ywyuz2gykig' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j631$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j631$::jsonb
WHERE id = 'cmr8c3jyt00gf1yloo83gylkl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j632$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j632$::jsonb
WHERE id = 'cmr8cn97200ng1ylol4h7qgs8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j633$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j633$::jsonb
WHERE id = 'cmr8dq9l701071ylocc5e1kgm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j634$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j634$::jsonb
WHERE id = 'cmr8nmio500ws1ygiy5xjb3zg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j635$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j635$::jsonb
WHERE id = 'cmr8dq98801041ylohhektlez' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j636$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j636$::jsonb
WHERE id = 'cmr8db7cw00to1yloo3c8qfr4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j637$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j637$::jsonb
WHERE id = 'cmr8c3o0v00hj1yloy8z0teaw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j638$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j638$::jsonb
WHERE id = 'cmr8esqfg01eq1ylo57zj1tmt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j639$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j639$::jsonb
WHERE id = 'cmr8h1fty01xe1ylov1lz3gub' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j640$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j640$::jsonb
WHERE id = 'cmr8f2mez01hc1ylosrdisaze' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j641$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j641$::jsonb
WHERE id = 'cmr8fhhyq01kt1ylojsxajavf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j642$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j642$::jsonb
WHERE id = 'cmr8fz9vc01o01ylopnf2bkax' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j643$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j643$::jsonb
WHERE id = 'cmr8ei1hc01b11ylo1vsxp4ll' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j644$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j644$::jsonb
WHERE id = 'cmr8hgdq001zt1ylouk4cd842' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j645$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j645$::jsonb
WHERE id = 'cmrsf7etz000w1yny3geys6vw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j646$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j646$::jsonb
WHERE id = 'cmr8isf2e02ea1ylo3xppywyk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j647$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j647$::jsonb
WHERE id = 'cmr98mluh00kk1ywyv9lcap7h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j648$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j648$::jsonb
WHERE id = 'cmr8j0psp02hk1ylo2rzn4xp5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j649$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j649$::jsonb
WHERE id = 'cmr8i09is026k1ylouq1znd2m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j650$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j650$::jsonb
WHERE id = 'cmrtg5vu400021ydw6upxfw56' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j651$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j651$::jsonb
WHERE id = 'cmr8j0obp02h21yloaqg3kawj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j652$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j652$::jsonb
WHERE id = 'cmr8j0o5x02h01yloioo5cwge' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j653$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j653$::jsonb
WHERE id = 'cmr8hrskr023s1yloljibectj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j654$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j654$::jsonb
WHERE id = 'cmr8l1jir006b1ygi7zlyq64j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j655$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j655$::jsonb
WHERE id = 'cmr8m9btj00k71ygiz0uryfw7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j656$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j656$::jsonb
WHERE id = 'cmr8lc8rk00ay1ygi6x9s7gwb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j657$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j657$::jsonb
WHERE id = 'cmr8lc6pl00a91ygiy4bvj584' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j658$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j658$::jsonb
WHERE id = 'cmr8juid5000e1ygij3t6vg1p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j659$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j659$::jsonb
WHERE id = 'cmrrbwae9000kl104dusv83aa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j660$[{"label": "MedlinePlus. Urinary tract infection.", "url": "https://medlineplus.gov/urinarytractinfections.html"}]$j660$::jsonb
WHERE id = 'cmr8ny45j00zr1ygijk65dyiw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j661$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j661$::jsonb
WHERE id = 'cmr8ny7jq010w1ygiw87y05nq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j662$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j662$::jsonb
WHERE id = 'cmr8nmknf00xi1ygihmqd7xcd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j663$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j663$::jsonb
WHERE id = 'cmr8o9gep012t1ygi4kg210zj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j664$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j664$::jsonb
WHERE id = 'cmr8qfqax01na1ygi3zy9q381' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j665$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j665$::jsonb
WHERE id = 'cmr8pgu2401cq1ygizqp5mg3e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j666$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j666$::jsonb
WHERE id = 'cmr8qfr1701nj1ygi89ac165n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j667$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j667$::jsonb
WHERE id = 'cmr8q429l01jg1ygip2y51cfl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j668$[{"label": "MedlinePlus. Deep vein thrombosis.", "url": "https://medlineplus.gov/deepveinthrombosis.html"}]$j668$::jsonb
WHERE id = 'cmr98632m00eg1ywy5ruxscim' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j669$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j669$::jsonb
WHERE id = 'cmr97i2kf004k1ywykxhklcie' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j670$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j670$::jsonb
WHERE id = 'cmr8q40ls01iv1ygi7gy5u1d9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j671$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j671$::jsonb
WHERE id = 'cmr98mmff00kq1ywy10umjsxj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j672$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j672$::jsonb
WHERE id = 'cmr98vo1200nu1ywyb0bbeuf6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j673$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j673$::jsonb
WHERE id = 'cmr97yymk00ab1ywyj1w6za5r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j674$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j674$::jsonb
WHERE id = 'cmr97qdyy006x1ywy95rsyg6w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j675$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j675$::jsonb
WHERE id = 'cmr99ihrj00u41ywya55zr5pr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j676$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j676$::jsonb
WHERE id = 'cmr97qg8b007k1ywy9vo3qwcu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j677$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j677$::jsonb
WHERE id = 'cmr98vojc00o01ywyzv8owfvx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j678$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j678$::jsonb
WHERE id = 'cmr9860p400dm1ywyv65go0et' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j679$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j679$::jsonb
WHERE id = 'cmr9863ox00eo1ywynz2ghe5q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j680$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j680$::jsonb
WHERE id = 'cmr98dip000go1ywygeixzdav' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j681$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j681$::jsonb
WHERE id = 'cmr97yypz00ac1ywybiq649wj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j682$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j682$::jsonb
WHERE id = 'cmr9bnymu01he1ywy6t02d1cc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j683$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j683$::jsonb
WHERE id = 'cmr9bbvzz01es1ywyf3ygm07t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j684$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j684$::jsonb
WHERE id = 'cmr9c9onf01r61ywya66uca0f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j685$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j685$::jsonb
WHERE id = 'cmr9bv1qv01l81ywy7g5ccjfu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j686$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j686$::jsonb
WHERE id = 'cmr9c9qnd01rp1ywy1vm3kngx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j687$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j687$::jsonb
WHERE id = 'cmr9c367u01nm1ywytyuu68vs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j688$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j688$::jsonb
WHERE id = 'cmru7tkk7000k1yd6cmhrw2hx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j689$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j689$::jsonb
WHERE id = 'cmr8ny7mm010x1ygid18pjfpa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j690$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j690$::jsonb
WHERE id = 'cmr8ny6th010n1ygiewctefvx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j691$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j691$::jsonb
WHERE id = 'cmrruahqk00dh1y8wiodx5er3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j692$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j692$::jsonb
WHERE id = 'cmrruajve00dm1y8wh8p5s11v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j693$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j693$::jsonb
WHERE id = 'cmru9iws200bb1y0srf06ys1w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j694$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j694$::jsonb
WHERE id = 'cmrrufx2j00f41y8wrr6ll8e7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j695$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j695$::jsonb
WHERE id = 'cmrrufyss00fn1y8wp0md63hs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j696$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j696$::jsonb
WHERE id = 'cmr8ny6kn010k1ygiw86tss43' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j697$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j697$::jsonb
WHERE id = 'cmr99rg3v00xp1ywyyfk5xitp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j698$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j698$::jsonb
WHERE id = 'cmr99rh7y00y31ywy50oa6w01' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j699$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j699$::jsonb
WHERE id = 'cmrruxvkk00mh1y8wft4ekk28' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j700$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j700$::jsonb
WHERE id = 'cmrrufyfm00fj1y8wapygfjd9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j701$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j701$::jsonb
WHERE id = 'cmrruxsy400ll1y8w4yrq0wap' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j702$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j702$::jsonb
WHERE id = 'cmr99rir400ym1ywyufo58dxs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j703$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j703$::jsonb
WHERE id = 'cmrtffifv00021yx20565klb4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j704$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j704$::jsonb
WHERE id = 'cmrtffje2000e1yx2rd6wxdsr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j705$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j705$::jsonb
WHERE id = 'cmrtg0vvu001a1yx2lo81lav1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j706$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j706$::jsonb
WHERE id = 'cmrtgrgny000k1yax5ocyuwhf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j707$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j707$::jsonb
WHERE id = 'cmrsrb1ta000ll404o5e1vx0g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j708$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j708$::jsonb
WHERE id = 'cmr8ny60l010d1ygi74ekrcyx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j709$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j709$::jsonb
WHERE id = 'cmrtgrhug000w1yaxwh0u7sas' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j710$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j710$::jsonb
WHERE id = 'cmr9buzgl01kg1ywyusp59xrb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j711$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j711$::jsonb
WHERE id = 'cmrth0z7500291yax0xo3s45w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j712$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j712$::jsonb
WHERE id = 'cmrth10iw002l1yax8wz5x85i' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j713$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j713$::jsonb
WHERE id = 'cmr8ny5s6010a1ygidi375xyf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j714$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j714$::jsonb
WHERE id = 'cmrrufzdp00ft1y8w0jnx7162' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j715$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j715$::jsonb
WHERE id = 'cmr9bv23a01lc1ywy837fi9sj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j716$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j716$::jsonb
WHERE id = 'cmrrutcvr00ji1y8whp9vk4n7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j717$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j717$::jsonb
WHERE id = 'cmrrutfak00jq1y8waaczm0u3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j718$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j718$::jsonb
WHERE id = 'cmrruxupb00m61y8wxfpj3vq6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j719$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j719$::jsonb
WHERE id = 'cmru2q9z600111y7wxcee2u6t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j720$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j720$::jsonb
WHERE id = 'cmtpx6cjb000a1ymuiyhb1p1x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j721$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j721$::jsonb
WHERE id = 'cmqkgnt5k0g1ul304ux7r6kfv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j722$[{"label": "MedlinePlus Medical Encyclopedia. High potassium (hyperkalemia).", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j722$::jsonb
WHERE id = 'cmrrum23500hl1y8wl9z0rqre' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j723$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j723$::jsonb
WHERE id = 'cmr9c36di01no1ywybmgy06ud' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j724$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j724$::jsonb
WHERE id = 'cmrruxvq000mj1y8whj3qzskq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j725$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder that destroys beta cells.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j725$::jsonb
WHERE id = 'cmrrv63y700nw1y8w1sc80958' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j726$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j726$::jsonb
WHERE id = 'cmr9c38jr01of1ywyklbjx7x0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j727$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j727$::jsonb
WHERE id = 'cmrrv677000or1y8wj4p0jijn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j728$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j728$::jsonb
WHERE id = 'cmrpwfd88006d1yh5rk5bxtwc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j729$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j729$::jsonb
WHERE id = 'cmru32jzm003e1y7wlwya3mu0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j730$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j730$::jsonb
WHERE id = 'cmrsewa9o000h1y55a4z1pvsu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j731$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j731$::jsonb
WHERE id = 'cmr8bxxr700dn1ylongbw434o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j732$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j732$::jsonb
WHERE id = 'cmru32lmp003y1y7wvl81klyu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j733$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j733$::jsonb
WHERE id = 'cmru32mod004b1y7wt47mpbpt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j734$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j734$::jsonb
WHERE id = 'cmrrum5hu00ho1y8wydyl419s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j735$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j735$::jsonb
WHERE id = 'cmrtfficy00011yx211sbfvmw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j736$[{"label": "MedlinePlus. Hyperthyroidism.", "url": "https://medlineplus.gov/hyperthyroidism.html"}]$j736$::jsonb
WHERE id = 'cmrtfrqut000s1yx2rc4n8vhf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j737$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j737$::jsonb
WHERE id = 'cmrtgrgv9000m1yaxg6ma2bc2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j738$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j738$::jsonb
WHERE id = 'cmrtgrgyo000n1yaxyvoq92w7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j739$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j739$::jsonb
WHERE id = 'cmrth11ej002u1yaxmsofo0kl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j740$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j740$::jsonb
WHERE id = 'cmrth11i1002v1yax4juzw01h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j741$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j741$::jsonb
WHERE id = 'cmrth87sm004h1yax1bsj6903' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j742$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j742$::jsonb
WHERE id = 'cmrth10q1002n1yaxa6up8mtl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j743$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j743$::jsonb
WHERE id = 'cmrth89q900501yax5dnsg3m1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j744$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j744$::jsonb
WHERE id = 'cmrth89tw00511yaxkpi6io02' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j745$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j745$::jsonb
WHERE id = 'cmrth892y004u1yaxeu132548' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j746$[{"label": "MedlinePlus. Deep vein thrombosis.", "url": "https://medlineplus.gov/deepveinthrombosis.html"}]$j746$::jsonb
WHERE id = 'cmrtqfyt400031yx3dl80jamo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j747$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j747$::jsonb
WHERE id = 'cmrtqfyw000041yx31o7sy0tl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j748$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j748$::jsonb
WHERE id = 'cmr8n3q3200q21ygix0rdvxgk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j749$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j749$::jsonb
WHERE id = 'cmru6qswn000il104glzdsvo4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j750$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j750$::jsonb
WHERE id = 'cmru3n60200e41y7w3h93sasz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j751$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j751$::jsonb
WHERE id = 'cmrth88p1004q1yax41wu4qbo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j752$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j752$::jsonb
WHERE id = 'cmrthhrl2007l1yax9ne1sizm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j753$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j753$::jsonb
WHERE id = 'cmrtqg0bp000m1yx35sqeh34w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j754$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j754$::jsonb
WHERE id = 'cmrtqq5rw00191yx3dh765axm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j755$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j755$::jsonb
WHERE id = 'cmru3ue5w00hi1y7wuui77ozd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j756$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j756$::jsonb
WHERE id = 'cmr4b343z001g1ykyt8otrcwl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j757$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder that destroys beta cells.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j757$::jsonb
WHERE id = 'cmr4bvdyp00e21ykypjqwrpaw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j758$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j758$::jsonb
WHERE id = 'cmr8dymqv01451ylo3dtzeref' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j759$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j759$::jsonb
WHERE id = 'cmr8dynk7014d1yloryv4hxc8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j760$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j760$::jsonb
WHERE id = 'cmr4cvcpo00rf1ykyfvdscn3g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j761$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j761$::jsonb
WHERE id = 'cmr8cn9yj00np1yloxh8dh6bo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j762$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j762$::jsonb
WHERE id = 'cmr4fl31l01vw1ykymsdsyhml' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j763$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j763$::jsonb
WHERE id = 'cmr4fthb901zs1ykyhfdlrbjd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j764$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j764$::jsonb
WHERE id = 'cmr8dylm6013u1ylon5cfd43x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j765$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j765$::jsonb
WHERE id = 'cmr8fhg2401ka1ylo6qg4wwy9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j766$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j766$::jsonb
WHERE id = 'cmr8fhg5n01kb1ylorbu3qjr2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j767$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j767$::jsonb
WHERE id = 'cmr8gr3fg01tg1yloduhi3zv8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j768$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j768$::jsonb
WHERE id = 'cmr8ccdww00jv1ylogaudfnrm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j769$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j769$::jsonb
WHERE id = 'cmrrvb7ql000l1yl875oby7ol' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j770$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j770$::jsonb
WHERE id = 'cmrtgb3cb002t1ydwc4l4dym7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j771$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j771$::jsonb
WHERE id = 'cmrtggal6004l1ydwj9yh6135' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j772$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j772$::jsonb
WHERE id = 'cmr87j40t00hm1yr96l882e22' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j773$[{"label": "MedlinePlus. Atrial fibrillation.", "url": "https://medlineplus.gov/atrialfibrillation.html"}]$j773$::jsonb
WHERE id = 'cmr89veed01441yr9yhmvmmsy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j774$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j774$::jsonb
WHERE id = 'cmr87sleh00k01yr9p6sypcpz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j775$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j775$::jsonb
WHERE id = 'cmru2q73500031y7w24tlwx8g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j776$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j776$::jsonb
WHERE id = 'cmru2q7xw000d1y7w749tnaxn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j777$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j777$::jsonb
WHERE id = 'cmru2q842000f1y7wirmtmv3l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j778$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j778$::jsonb
WHERE id = 'cmru2q8w7000o1y7wuzrz5ifr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j779$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j779$::jsonb
WHERE id = 'cmru2q9k6000w1y7wqajaj3j8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j780$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j780$::jsonb
WHERE id = 'cmru2q9t5000z1y7w8vkj1l78' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j781$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j781$::jsonb
WHERE id = 'cmru2qahp00171y7whj9q6dmn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j782$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j782$::jsonb
WHERE id = 'cmru2qbky001k1y7wcuslegem' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j783$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j783$::jsonb
WHERE id = 'cmru32jwl003d1y7wvg7uosh5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j784$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j784$::jsonb
WHERE id = 'cmru32k8y003h1y7w6l5vdlih' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j785$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j785$::jsonb
WHERE id = 'cmru32kwp003p1y7wylvb2gq0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j786$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j786$::jsonb
WHERE id = 'cmru32l86003t1y7wrc8a025p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j787$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j787$::jsonb
WHERE id = 'cmru32lyc00421y7wy55q0cl8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j788$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j788$::jsonb
WHERE id = 'cmru32min00491y7wofkmisyx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j789$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j789$::jsonb
WHERE id = 'cmru32n8e004i1y7wyhdyelpc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j790$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j790$::jsonb
WHERE id = 'cmru32nh4004l1y7wxih0bvrg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j791$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j791$::jsonb
WHERE id = 'cmru32nse004p1y7wlnwzudq5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j792$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j792$::jsonb
WHERE id = 'cmru32o6v004u1y7wkasjb8fl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j793$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j793$::jsonb
WHERE id = 'cmru38x8c006r1y7wm8t7ytyb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j794$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j794$::jsonb
WHERE id = 'cmru38zz9006z1y7w6ruoebuz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j795$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j795$::jsonb
WHERE id = 'cmru3902f00701y7wimydyt7o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j796$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j796$::jsonb
WHERE id = 'cmru392fo00771y7wg63dcgrc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j797$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j797$::jsonb
WHERE id = 'cmru3939y00791y7wwank05zp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j798$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j798$::jsonb
WHERE id = 'cmru396xh007h1y7waafiuf8r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j799$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j799$::jsonb
WHERE id = 'cmru398rv007l1y7w7apwx0wn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j800$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j800$::jsonb
WHERE id = 'cmru39aum007q1y7wi3we9g0c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j801$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j801$::jsonb
WHERE id = 'cmru39b86007r1y7wqbiaowfi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j802$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j802$::jsonb
WHERE id = 'cmr8dqdrq011b1yloycjofwyv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j803$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j803$::jsonb
WHERE id = 'cmru3n37l00da1y7w1hlmm4ko' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j804$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j804$::jsonb
WHERE id = 'cmru3n3pd00de1y7w20ke12f4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j805$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j805$::jsonb
WHERE id = 'cmru3n3s400df1y7wh2793s5c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j806$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j806$::jsonb
WHERE id = 'cmr8g7c7x01r71yloz18qnnde' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j807$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j807$::jsonb
WHERE id = 'cmru3n4ii00dn1y7wklg3mkfi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j808$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j808$::jsonb
WHERE id = 'cmru3n4tv00dr1y7wb3th3icv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j809$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j809$::jsonb
WHERE id = 'cmru3n51200dt1y7wlyz2dqd4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j810$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j810$::jsonb
WHERE id = 'cmru3n6aj00e71y7wdu7iwa8t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j811$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j811$::jsonb
WHERE id = 'cmru3n86x00es1y7wi2jzcnb3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j812$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j812$::jsonb
WHERE id = 'cmru3n89o00et1y7wypwr543h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j813$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j813$::jsonb
WHERE id = 'cmru3ubbj00go1y7wd43th886' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j814$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j814$::jsonb
WHERE id = 'cmru3ubf000gp1y7wdwadefnn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j815$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j815$::jsonb
WHERE id = 'cmru3ubpc00gs1y7w6f2thgt2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j816$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j816$::jsonb
WHERE id = 'cmru3ud7y00h81y7w2ocub9wi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j817$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j817$::jsonb
WHERE id = 'cmru3udeq00ha1y7wni5t6azr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j818$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j818$::jsonb
WHERE id = 'cmru3ueg200hl1y7w8zxzwxji' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j819$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j819$::jsonb
WHERE id = 'cmru3uf7k00ht1y7wsam8lrd6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j820$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j820$::jsonb
WHERE id = 'cmru3ufec00hv1y7wvwz7soiu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j821$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j821$::jsonb
WHERE id = 'cmru3ug9m00i41y7wo6v83u74' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j822$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j822$::jsonb
WHERE id = 'cmru3ugd000i51y7wtlt628x1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j823$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j823$::jsonb
WHERE id = 'cmru3ugn800i81y7wyryw23hp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j824$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j824$::jsonb
WHERE id = 'cmr4badm1003r1ykyn3i5bvu1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j825$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j825$::jsonb
WHERE id = 'cmr4c4v6800i01ykysma7bcru' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j826$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j826$::jsonb
WHERE id = 'cmr4cvf8f00s91yky66ep01uz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j827$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j827$::jsonb
WHERE id = 'cmru7tmd600171yd6dklfi59i' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j828$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j828$::jsonb
WHERE id = 'cmr4eekrb01f21ykyu64w187x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j829$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j829$::jsonb
WHERE id = 'cmr4c4u8600hr1ykyrkponkki' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j830$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j830$::jsonb
WHERE id = 'cmr4cvbsu00r41ykyi1x2g2ci' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j831$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j831$::jsonb
WHERE id = 'cmr4fl3u901w61ykyz21k6nxo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j832$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j832$::jsonb
WHERE id = 'cmr4gbo67025e1yky67y1uvnc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j833$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j833$::jsonb
WHERE id = 'cmr8bhg3l006p1ylorz7ud0st' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j834$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j834$::jsonb
WHERE id = 'cmr8bhim8007f1yloud1sms8m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j835$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j835$::jsonb
WHERE id = 'cmru8bdr8006w1yd6y5ax5f6h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j836$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j836$::jsonb
WHERE id = 'cmr8br44n009w1ylo3nm4nova' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j837$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j837$::jsonb
WHERE id = 'cmr8br4dg009z1ylog4g3mke6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j838$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j838$::jsonb
WHERE id = 'cmr8ccdkx00jr1ylo7j2uttxy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j839$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j839$::jsonb
WHERE id = 'cmr8ccjqk00l91ylooddtv06i' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j840$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j840$::jsonb
WHERE id = 'cmru9iqf7009u1y0sx5hdgw71' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j841$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j841$::jsonb
WHERE id = 'cmr8ccebg00k01yloa4ebrot4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j842$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j842$::jsonb
WHERE id = 'cmr8br78300ay1ylovkom7f83' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j843$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j843$::jsonb
WHERE id = 'cmr8bhif7007d1yloshg9bqtx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j844$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j844$::jsonb
WHERE id = 'cmr8esmwy01dk1yloro4p8p5g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j845$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j845$::jsonb
WHERE id = 'cmr8e5vnk016n1ylo4nwz7g6l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j846$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j846$::jsonb
WHERE id = 'cmr8e5x8o01771ylo42uodd1l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j847$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j847$::jsonb
WHERE id = 'cmr8e5x2w01751ylo1yq7rbga' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j848$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j848$::jsonb
WHERE id = 'cmr8dqbwq010t1yloyxdvt8fv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j849$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j849$::jsonb
WHERE id = 'cmr8e5xvg017f1ylom8mbgpmq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j850$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j850$::jsonb
WHERE id = 'cmr8lc6va00ab1ygid6tuv3qd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j851$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j851$::jsonb
WHERE id = 'cmr8lc5we009z1ygivfcggaqs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j852$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j852$::jsonb
WHERE id = 'cmr8dbaig00uj1yloibrm4gwx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j853$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j853$::jsonb
WHERE id = 'cmr8ny5me01081ygiuj6k34st' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j854$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j854$::jsonb
WHERE id = 'cmr8hrtxk02491yloydmdodv8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j855$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j855$::jsonb
WHERE id = 'cmru7tk4s000f1yd6y7yrfe5a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j856$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j856$::jsonb
WHERE id = 'cmru7tks8000n1yd6czut6uub' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j857$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j857$::jsonb
WHERE id = 'cmru7tkv1000o1yd6478zkcx1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j858$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder that destroys beta cells.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j858$::jsonb
WHERE id = 'cmru7tmfy00181yd67u072l4p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j859$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j859$::jsonb
WHERE id = 'cmru854bx003d1yd62f61uuu3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j860$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j860$::jsonb
WHERE id = 'cmru854j2003f1yd620hl403j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j861$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j861$::jsonb
WHERE id = 'cmru854or003h1yd6egjdi3v4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j862$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j862$::jsonb
WHERE id = 'cmru854uh003j1yd6divwmn3d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j863$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j863$::jsonb
WHERE id = 'cmru855bn003p1yd69u0goecz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j864$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j864$::jsonb
WHERE id = 'cmru855k5003s1yd6sglt1xrr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j865$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j865$::jsonb
WHERE id = 'cmru8566y00401yd66fvcjvlw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j866$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j866$::jsonb
WHERE id = 'cmru858ci004r1yd62fiq14c5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j867$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j867$::jsonb
WHERE id = 'cmru8be8d00721yd6c5if03mq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j868$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j868$::jsonb
WHERE id = 'cmru8begy00751yd6fbcxgery' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j869$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j869$::jsonb
WHERE id = 'cmru8bepi00781yd6dwp8uzuj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j870$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j870$::jsonb
WHERE id = 'cmru8beyd007b1yd6s9tz3xry' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j871$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j871$::jsonb
WHERE id = 'cmru8bf6t007e1yd6gbt5liy5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j872$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j872$::jsonb
WHERE id = 'cmru8bf9q007f1yd6suit2rt4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j873$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j873$::jsonb
WHERE id = 'cmru8bfv8007m1yd6mgqgywll' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j874$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j874$::jsonb
WHERE id = 'cmru8bgdw007s1yd6f3auc68r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j875$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j875$::jsonb
WHERE id = 'cmru8v339000e1y0sfpqnx3aw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j876$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j876$::jsonb
WHERE id = 'cmru8v3wg000o1y0svjb9ne5y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j877$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j877$::jsonb
WHERE id = 'cmru8v62s001f1y0sj3mebkfu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j878$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j878$::jsonb
WHERE id = 'cmru96r4m004p1y0sai3s8c92' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j879$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis is treated in hospital with insulin and fluids.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j879$::jsonb
WHERE id = 'cmru9iqar009t1y0sx57ibyn7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j880$[{"label": "MedlinePlus. Urinary tract infection.", "url": "https://medlineplus.gov/urinarytractinfections.html"}]$j880$::jsonb
WHERE id = 'cmru9irmf00a41y0s0xb6hhdh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j881$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j881$::jsonb
WHERE id = 'cmru9iv8000ay1y0s3i24bonw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j882$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j882$::jsonb
WHERE id = 'cmru9ivl500b11y0sxku4rzuy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j883$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j883$::jsonb
WHERE id = 'cmr8fz9mi01nx1ylojet5pfy0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j884$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j884$::jsonb
WHERE id = 'cmr8fzamc01o91ylowkd5sv1c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j885$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j885$::jsonb
WHERE id = 'cmr8fz8kf01nk1ylo4uwqza87' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j886$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j886$::jsonb
WHERE id = 'cmr8fz7cq01n51ylood16uh7l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j887$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j887$::jsonb
WHERE id = 'cmr8j0ms102gj1ylo0agmiy92' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j888$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j888$::jsonb
WHERE id = 'cmr8ji6i702n01ylotycfsugz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j889$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j889$::jsonb
WHERE id = 'cmr8ji9ai02ny1ylobhhkzrso' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j890$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j890$::jsonb
WHERE id = 'cmr8ji8uj02nt1ylo5i5q9lhp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j891$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j891$::jsonb
WHERE id = 'cmr8ji8ix02np1ylolcejuag0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j892$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j892$::jsonb
WHERE id = 'cmr8ji8cz02nn1ylolzyh0x87' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j893$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j893$::jsonb
WHERE id = 'cmr8lqgs300d31ygiyke5uokf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j894$[{"label": "MedlinePlus. Sepsis.", "url": "https://medlineplus.gov/sepsis.html"}]$j894$::jsonb
WHERE id = 'cmr8lc86q00ar1ygi79nend3c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j895$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j895$::jsonb
WHERE id = 'cmr8lc6y200ac1ygi505sck6x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j896$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j896$::jsonb
WHERE id = 'cmr8lc6jr00a71ygirx17ktem' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j897$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j897$::jsonb
WHERE id = 'cmr8lc5cm009s1ygiq9xwleac' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j898$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j898$::jsonb
WHERE id = 'cmr8n3rud00qk1ygi326kcf7g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j899$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j899$::jsonb
WHERE id = 'cmrtq0ua3001e1yqcwkz0ih54' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j900$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j900$::jsonb
WHERE id = 'cmrtqg0nb000q1yx3zp7dro7q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j901$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j901$::jsonb
WHERE id = 'cmru6qy0e001rl104lmcr5s02' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j902$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j902$::jsonb
WHERE id = 'cmr877i2e00cx1yr9dzsw2vsr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j903$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j903$::jsonb
WHERE id = 'cmr891bm100xc1yr9v4x5llcw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j904$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j904$::jsonb
WHERE id = 'cmq33aol7032x1yiuwha8blym' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j905$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j905$::jsonb
WHERE id = 'cmq33a129006x1yiuwxdqy95j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j906$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j906$::jsonb
WHERE id = 'cmr97c4oy000n1ywy1vtq9tw7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j907$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j907$::jsonb
WHERE id = 'cmr4fdgef01rm1yky777ike28' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j908$[{"label": "MedlinePlus Medical Encyclopedia. Vitamin B12 deficiency anemia.", "url": "https://medlineplus.gov/ency/article/000574.htm"}]$j908$::jsonb
WHERE id = 'b1xd79159a50d0a92cd0c5a6043' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j909$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j909$::jsonb
WHERE id = 'b3x22ac8a2536982a8912f49a22' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j910$[{"label": "MedlinePlus. Sepsis.", "url": "https://medlineplus.gov/sepsis.html"}]$j910$::jsonb
WHERE id = 'b3x2160c034da8cfbc5a964c930' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j911$[{"label": "MedlinePlus. Gout.", "url": "https://medlineplus.gov/gout.html"}]$j911$::jsonb
WHERE id = 'b4xbc501408f6e5a158eac86f8f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j912$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j912$::jsonb
WHERE id = 'cmr8adxhn00t51yw2f4ez0wlk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j913$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j913$::jsonb
WHERE id = 'cmpnjjjv10ahs1ymxqyye7pe5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j914$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j914$::jsonb
WHERE id = 'cmpnjhacg001v1ymxgq5z4o45' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j915$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j915$::jsonb
WHERE id = 'cmpnjha50001u1ymxf1e2p285' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j916$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j916$::jsonb
WHERE id = 'cmr8d6ipq001f1yazs67o5i6c' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j917$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j917$::jsonb
WHERE id = 'cmr4cbum900k91yky0a2p14p3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j918$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j918$::jsonb
WHERE id = 'cmr8difi900ww1ylor0avl0f2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j919$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j919$::jsonb
WHERE id = 'cmr8dig8q00x51ylo7khyyoqa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j920$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j920$::jsonb
WHERE id = 'cmr8diiu500y01yloa97y0obi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j921$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j921$::jsonb
WHERE id = 'cmr8g79yg01qf1yloy8qso8wq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j922$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j922$::jsonb
WHERE id = 'cmr8g7a4401qh1ylo62fn1eh7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j923$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j923$::jsonb
WHERE id = 'cmr8g7cmi01rc1ylo2zgioxxq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j924$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j924$::jsonb
WHERE id = 'cmr8lz0fw00gx1ygif7kb40rz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j925$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j925$::jsonb
WHERE id = 'cmr8lz2ok00hk1ygipyyr13k2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j926$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j926$::jsonb
WHERE id = 'cmr8o9kho01481ygixo83u306' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j927$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j927$::jsonb
WHERE id = 'cmqkgnzc80ktnl304iqdgginq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j928$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j928$::jsonb
WHERE id = 'cmq0g7l2u004i1y4fihnzwa97' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j929$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j929$::jsonb
WHERE id = 'cmr4hb45x004s1ydexx4g9yjd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j930$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j930$::jsonb
WHERE id = 'cmr4hb4d6004u1ydesul0egsh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j931$[{"label": "MedlinePlus. Migraine.", "url": "https://medlineplus.gov/migraine.html"}]$j931$::jsonb
WHERE id = 'cmr4iy74h00gq1ydepsdklqyh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j932$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j932$::jsonb
WHERE id = 'cmr31dlht00c8js04d8x5uw4a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j933$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j933$::jsonb
WHERE id = 'cmr89ve5q01411yr9lwfa4d5u' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j934$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j934$::jsonb
WHERE id = 'cmr8al7wq019b1yr97s2g74h7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j935$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j935$::jsonb
WHERE id = 'cmr877kgf00dq1yr9ud41xn1b' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j936$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j936$::jsonb
WHERE id = 'cmr88ic9k00q21yr9mqq1kwak' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j937$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j937$::jsonb
WHERE id = 'cmr877izf00d81yr9rjoydnd9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j938$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j938$::jsonb
WHERE id = 'cmr89lxux01131yr93rm5v620' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j939$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j939$::jsonb
WHERE id = 'cmr8alb1c01ab1yr98hwrqxxd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j940$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j940$::jsonb
WHERE id = 'cmra6lv0p001uic047nu6s50r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j941$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j941$::jsonb
WHERE id = 'cmrpvq8mc000b1ylu4onpxg74' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j942$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j942$::jsonb
WHERE id = 'cmrpwagxz009h1yluxjisv9al' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j943$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j943$::jsonb
WHERE id = 'cmrqh93zx00111ypxahyrpv4q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j944$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j944$::jsonb
WHERE id = 'cmr8alc5q01ao1yr971zqmi2n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j945$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j945$::jsonb
WHERE id = 'cmrpvq7xw00041ylui13j96ru' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j946$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j946$::jsonb
WHERE id = 'cmrpvq9ru000n1ylufqyzdwgu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j947$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j947$::jsonb
WHERE id = 'cmrpvvgda002j1yluslnn0t7g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j948$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j948$::jsonb
WHERE id = 'cmrpw6025007j1ylu99w36xa4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j949$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j949$::jsonb
WHERE id = 'cmrpwai4u009t1yluj4ni9ndt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j950$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j950$::jsonb
WHERE id = 'cmra6lzkv003yic04yckey7kr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j951$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j951$::jsonb
WHERE id = 'cmrpvq90f000f1yluxpn5c60s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j952$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j952$::jsonb
WHERE id = 'cmrpwg4kh00b71yluh18d1z6o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j953$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j953$::jsonb
WHERE id = 'cmra6lurx001jic0411nonwt0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j954$[{"label": "MedlinePlus. Appendicitis.", "url": "https://medlineplus.gov/appendicitis.html"}]$j954$::jsonb
WHERE id = 'cmrpvvfht00291ylu8xndubrd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j955$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j955$::jsonb
WHERE id = 'cmrrvnlm0007p1yl8zxslg3qj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j956$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j956$::jsonb
WHERE id = 'cmrrvvjx500bf1yl8f5k41tzv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j957$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j957$::jsonb
WHERE id = 'cmrrvvksu00bo1yl8y53lftbb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j958$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j958$::jsonb
WHERE id = 'cmrrvztbr00dk1yl81szgft31' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j959$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j959$::jsonb
WHERE id = 'cmrsf7des000e1yny0zpmgdzg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j960$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j960$::jsonb
WHERE id = 'cmrrbwant000tl10483z9gubp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j961$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j961$::jsonb
WHERE id = 'cmrrvfivv002m1yl86t4pxz1j' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j962$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j962$::jsonb
WHERE id = 'cmrrvji2e004k1yl893fd6ug8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j963$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j963$::jsonb
WHERE id = 'cmrrvjiu0004u1yl8oto8t4er' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j964$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j964$::jsonb
WHERE id = 'cmrrvnjxe00731yl8al8ylhwd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j965$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j965$::jsonb
WHERE id = 'cmrrvnkxc007g1yl8drz32kqe' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j966$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j966$::jsonb
WHERE id = 'cmrrvrrbd009e1yl8a5g41jsy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j967$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j967$::jsonb
WHERE id = 'cmrrvvjto00be1yl8vrjtp0v1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j968$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j968$::jsonb
WHERE id = 'cmrrw4ws600fs1yl82tc3bepk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j969$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j969$::jsonb
WHERE id = 'cmrrw4xto00g51yl8x86i4iz3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j970$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j970$::jsonb
WHERE id = 'cmrrw4xzd00g71yl8ch08h7r5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j971$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j971$::jsonb
WHERE id = 'cmrsf7dby000d1ynykc4gpnhy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j972$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j972$::jsonb
WHERE id = 'cmrsf7er7000v1ynymzw64pvk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j973$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j973$::jsonb
WHERE id = 'cmrtg5w4n00051ydwxwb3kuln' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j974$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j974$::jsonb
WHERE id = 'cmrrvztim00dm1yl8r2yyltbm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j975$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j975$::jsonb
WHERE id = 'cmrrvvklh00bm1yl82yswsumi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j976$[{"label": "MedlinePlus. Lupus, including kidney damage (lupus nephritis).", "url": "https://medlineplus.gov/lupus.html"}]$j976$::jsonb
WHERE id = 'cmrrvnl00007h1yl8ci2puplw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j977$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j977$::jsonb
WHERE id = 'cmrtg5wsx000c1ydwjn1ei3in' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j978$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j978$::jsonb
WHERE id = 'cmrrvb5pz00041yl878659qnh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j979$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j979$::jsonb
WHERE id = 'cmrrvnkru007e1yl8wu1jmfma' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j980$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j980$::jsonb
WHERE id = 'cmrrvnlrj007r1yl8d989w5lr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j981$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j981$::jsonb
WHERE id = 'cmrrvrqjd00941yl8uq9cqf6f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j982$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j982$::jsonb
WHERE id = 'cmrrvrr5r009c1yl8hght96di' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j983$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j983$::jsonb
WHERE id = 'cmrrw4xl700g21yl8m8g0kn6k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j984$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j984$::jsonb
WHERE id = 'cmrsf7dyo000l1yny67252vzo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j985$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j985$::jsonb
WHERE id = 'cmrsfd30b00301ynyi9ap0krt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j986$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j986$::jsonb
WHERE id = 'cmrtexhhl00061y30l47xo6km' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j987$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j987$::jsonb
WHERE id = 'cmr8j9nv702jh1ylo0xqmjdjt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j988$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j988$::jsonb
WHERE id = 'cmr8j9tbq02kx1ylo51avchq9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j989$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j989$::jsonb
WHERE id = 'cmrtgb1p500281ydwt2y4oxl7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j990$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j990$::jsonb
WHERE id = 'cmrtgb1rx00291ydwjs2fqxar' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j991$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j991$::jsonb
WHERE id = 'cmrtgb20a002c1ydwlc0jle9d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j992$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j992$::jsonb
WHERE id = 'cmrtgb2vd002n1ydwq7m4z87f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j993$[{"label": "MedlinePlus Medical Encyclopedia. Acute kidney failure.", "url": "https://medlineplus.gov/ency/article/000501.htm"}]$j993$::jsonb
WHERE id = 'cmrtprwxr00081yqcpdrf5pia' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j994$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j994$::jsonb
WHERE id = 'cmrtpryrk000s1yqcxf2t0wec' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j995$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j995$::jsonb
WHERE id = 'cmrtq0tcg00121yqc5wife6us' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j996$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j996$::jsonb
WHERE id = 'cmrtq0vg9001t1yqcplinagle' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j997$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j997$::jsonb
WHERE id = 'cmrtq47h800211yqcinx0cg39' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j998$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j998$::jsonb
WHERE id = 'cmru6qtfg0014l104jv97kyq2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j999$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j999$::jsonb
WHERE id = 'cmru6qye80025l10473j387m1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1000$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1000$::jsonb
WHERE id = 'cmrvm5uqf000cjw043tdbzvyx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1001$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1001$::jsonb
WHERE id = 'cmrtgb44h00331ydwp8o80hna' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1002$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1002$::jsonb
WHERE id = 'cmru6qyfx0027l104xbqu6fco' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1003$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1003$::jsonb
WHERE id = 'cmrtg5y21000p1ydw3wsng77n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1004$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1004$::jsonb
WHERE id = 'cmrtprwgv00021yqc9v8uul6x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1005$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1005$::jsonb
WHERE id = 'cmrtprx3j000a1yqcolvqglnb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1006$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1006$::jsonb
WHERE id = 'cmrtprxc0000d1yqcpfel2oco' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1007$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1007$::jsonb
WHERE id = 'cmrtq0t1a000y1yqcnjnknbnf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1008$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1008$::jsonb
WHERE id = 'cmrtq0u1o001b1yqc4qlxfxaz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1009$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1009$::jsonb
WHERE id = 'cmrtq0uzg001n1yqc74q5vva1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1010$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1010$::jsonb
WHERE id = 'cmru6qtah000yl104t75zdka7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1011$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1011$::jsonb
WHERE id = 'cmtps7tko00001y1q25tch5i7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1012$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j1012$::jsonb
WHERE id = 'cmtps7w2k000w1y1qhjepv2hn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1013$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1013$::jsonb
WHERE id = 'cmtpsayx200291y1qva7fem19' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1014$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1014$::jsonb
WHERE id = 'cmtpsaz6u002c1y1qc3r50vrr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1015$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1015$::jsonb
WHERE id = 'cmtpsazey002f1y1qctp4nz3n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1016$[{"label": "MedlinePlus. Rheumatoid arthritis.", "url": "https://medlineplus.gov/rheumatoidarthritis.html"}]$j1016$::jsonb
WHERE id = 'cmtpsazq4002j1y1qxweqqbfb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1017$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1017$::jsonb
WHERE id = 'cmtpsb0pr002v1y1q1hwqwsyp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1018$[{"label": "MedlinePlus. Pneumonia, including pneumocystis pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1018$::jsonb
WHERE id = 'cmtpvxy3t00031ylcqxd1wxc3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1019$[{"label": "MedlinePlus. Tuberculosis.", "url": "https://medlineplus.gov/tuberculosis.html"}]$j1019$::jsonb
WHERE id = 'cmtpvxyqq000b1ylcs6tala4d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1020$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1020$::jsonb
WHERE id = 'cmtpw0mvx00291ylc9koa204e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1021$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1021$::jsonb
WHERE id = 'cmtpw0oen002t1ylcpssp25ba' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1022$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1022$::jsonb
WHERE id = 'cmtpwld7z000a1y6hypxkmxrj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1023$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1023$::jsonb
WHERE id = 'cmtpwldlx000f1y6hisi344ai' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1024$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j1024$::jsonb
WHERE id = 'cmtpwleok000r1y6hn9imzog5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1025$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1025$::jsonb
WHERE id = 'cmtpwlf5k000x1y6h82q80p7d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1026$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1026$::jsonb
WHERE id = 'cmtpwlfnq00131y6h8wbt3ysv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1027$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1027$::jsonb
WHERE id = 'cmtpwlfz000171y6h7rq4lwb3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1028$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1028$::jsonb
WHERE id = 'cmtpwsmct003j1y6hflgybljg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1029$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1029$::jsonb
WHERE id = 'cmtpwsnlr003z1y6hx6eclzrl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1030$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1030$::jsonb
WHERE id = 'cmtpwsnu400421y6h36zbpv6i' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1031$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1031$::jsonb
WHERE id = 'cmtpx3cg600a51y6h0gddt85s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1032$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1032$::jsonb
WHERE id = 'cmtpx3cu100aa1y6hu95u5oqy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1033$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1033$::jsonb
WHERE id = 'cmtpx3dgs00ai1y6h3t453isw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1034$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j1034$::jsonb
WHERE id = 'cmtpx3e6100ar1y6hcak795ey' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1035$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1035$::jsonb
WHERE id = 'cmtpx3ebo00at1y6hkdw2h2si' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1036$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1036$::jsonb
WHERE id = 'cmr86gtd0003b1yw28uf58zih' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1037$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j1037$::jsonb
WHERE id = 'cmr8dn3if003q1yaz3lmu8bxn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1038$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1038$::jsonb
WHERE id = 'cmr8bg0js00zo1yw27pk0qmeb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1039$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1039$::jsonb
WHERE id = 'cmr4bggu400731yky5vtobb4p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1040$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1040$::jsonb
WHERE id = 'cmr31dkuy00bojs04jy30m6oj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1041$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1041$::jsonb
WHERE id = 'cmr4bnwnw00ao1ykydubonq8b' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1042$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1042$::jsonb
WHERE id = 'cmr4c4qdi00gr1ykyuyroo1rt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1043$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1043$::jsonb
WHERE id = 'cmr4bnv3600a41yky67ifzsou' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1044$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j1044$::jsonb
WHERE id = 'cmr4bnv8v00a61yky9n3i39gz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1045$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1045$::jsonb
WHERE id = 'cmr4cbv9n00kh1ykyzu0fd6uq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1046$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j1046$::jsonb
WHERE id = 'cmr4f69s901ok1ykyfl2qa3pi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1047$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1047$::jsonb
WHERE id = 'cmr4djau7011g1yky82is0doz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1048$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1048$::jsonb
WHERE id = 'cmr4eeizl01ek1yky2en30p3o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1049$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j1049$::jsonb
WHERE id = 'cmr4djb29011i1ykydm52cd3k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1050$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1050$::jsonb
WHERE id = 'cmr4fdl3r01si1ykylbedzpky' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1051$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j1051$::jsonb
WHERE id = 'cmr4d3vh200v31ykyghcg0zw3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1052$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1052$::jsonb
WHERE id = 'cmr4e6ldw01bs1ykytpr4uaoa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1053$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1053$::jsonb
WHERE id = 'cmr4e6pfa01cd1yky4z26ozr3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1054$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1054$::jsonb
WHERE id = 'cmr4f6a6c01oo1ykylwrc4qf6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1055$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1055$::jsonb
WHERE id = 'cmr4d3utt00uv1ykyw2lydh6e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1056$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1056$::jsonb
WHERE id = 'cmr4g0vfd022j1ykypdxdfee2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1057$[{"label": "MedlinePlus. Polycystic ovary syndrome (PCOS).", "url": "https://medlineplus.gov/polycysticovarysyndrome.html"}]$j1057$::jsonb
WHERE id = 'cmr4gkcw9029i1ykyywuefpq5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1058$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1058$::jsonb
WHERE id = 'cmr4dj7xu010w1yky9df28sfz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1059$[{"label": "MedlinePlus Medical Encyclopedia. Subarachnoid hemorrhage.", "url": "https://medlineplus.gov/ency/article/000701.htm"}]$j1059$::jsonb
WHERE id = 'cmr4eek2k01ev1ykynb7jh8tp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1060$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1060$::jsonb
WHERE id = 'cmr4e6n1n01c11ykyfdc0gqhw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1061$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis is treated in hospital with insulin and fluids.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1061$::jsonb
WHERE id = 'cmr4f68wh01oa1ykys1kyhviv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1062$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1062$::jsonb
WHERE id = 'cmr4cvbvw00r51ykyre3hc5dd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1063$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1063$::jsonb
WHERE id = 'cmr4d3tf900uf1yky2ej9k19k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1064$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1064$::jsonb
WHERE id = 'cmr4d3sxm00u91ykyux9jwi33' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1065$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1065$::jsonb
WHERE id = 'cmr8atxpo001a1ylob4lzzgcu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1066$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1066$::jsonb
WHERE id = 'cmr8atufa000e1yloazrchfw5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1067$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j1067$::jsonb
WHERE id = 'cmr8baipn00471ylo4pbl2ccd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1068$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1068$::jsonb
WHERE id = 'cmr8bhix1007i1ylodojmmbbf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1069$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j1069$::jsonb
WHERE id = 'cmr8br4s200a41ylo82md57q8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1070$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1070$::jsonb
WHERE id = 'cmr8bahhg003v1yloe7ebzs25' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1071$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1071$::jsonb
WHERE id = 'cmr8atu83000c1ylo3l86gwib' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1072$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1072$::jsonb
WHERE id = 'cmr8atwdk000x1ylovbt7f6on' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1073$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1073$::jsonb
WHERE id = 'cmr8atwh6000y1ylo6fs7vqtt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1074$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j1074$::jsonb
WHERE id = 'cmr8bajra004h1ylo0j0mpa8g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1075$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1075$::jsonb
WHERE id = 'cmr8br3mc009r1yloyb65uefw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1076$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1076$::jsonb
WHERE id = 'cmr8br80u00b81ylof49air11' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1077$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1077$::jsonb
WHERE id = 'cmr8bhi8e007b1yloh5w1hay7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1078$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1078$::jsonb
WHERE id = 'cmr8bxvqq00d31ylo6664mf91' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1079$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1079$::jsonb
WHERE id = 'cmr8bxzua00e81ylo6v3v0vlw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1080$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1080$::jsonb
WHERE id = 'cmr8c3k5y00gh1ylo3xkghepi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1081$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1081$::jsonb
WHERE id = 'cmr8cnc2w00oe1ylokxax68zi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1082$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1082$::jsonb
WHERE id = 'cmr8dymn201441ylo416urfiw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1083$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j1083$::jsonb
WHERE id = 'cmr8dyl46013p1ylochwzhcja' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1084$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1084$::jsonb
WHERE id = 'cmr8dq8t201001yloqckagbmr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1085$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1085$::jsonb
WHERE id = 'cmr8dihfg00xj1ylo2z1ju5ed' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1086$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1086$::jsonb
WHERE id = 'cmr8dbbay00ur1yloayo0gmd7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1087$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1087$::jsonb
WHERE id = 'cmr8dbblx00uu1yloezitq7nv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1088$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1088$::jsonb
WHERE id = 'cmr8cncnb00ol1yloq2qmyvnm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1089$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j1089$::jsonb
WHERE id = 'cmr8d1wx800qx1yloo6nak6ft' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1090$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1090$::jsonb
WHERE id = 'cmr8diesg00wn1yloldv9z3es' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1091$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1091$::jsonb
WHERE id = 'cmr8cna7j00ns1ylodkwh2cyc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1092$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1092$::jsonb
WHERE id = 'cmr8cnaqf00ny1ylo1p3pxxt4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1093$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1093$::jsonb
WHERE id = 'cmr8dyjsr013c1ylowb5h53eq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1094$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1094$::jsonb
WHERE id = 'cmr8c3phz00hy1ylokxjr30tw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1095$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1095$::jsonb
WHERE id = 'cmr8ccjeu00l51ylopg4hw57z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1096$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1096$::jsonb
WHERE id = 'cmr8dbbeg00us1ylog58934vj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1097$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j1097$::jsonb
WHERE id = 'cmr8dq9sd01091yloyybtghfs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1098$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1098$::jsonb
WHERE id = 'cmr8c3n7700hb1ylo34lc3nme' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1099$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1099$::jsonb
WHERE id = 'cmr8c3nxc00hi1ylon7xrdpth' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1100$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1100$::jsonb
WHERE id = 'cmr8digxb00xd1ylogw9w9jop' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1101$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1101$::jsonb
WHERE id = 'cmr8cn9lz00nl1yloh6iobs61' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1102$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1102$::jsonb
WHERE id = 'cmr8cncq700om1ylocdfom9ao' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1103$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1103$::jsonb
WHERE id = 'cmr8h1crs01wk1ylogosdizno' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1104$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1104$::jsonb
WHERE id = 'cmr8esq6u01en1ylonz1z3q5h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1105$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1105$::jsonb
WHERE id = 'cmr8eso0s01dx1ylo4rjsgtlk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1106$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1106$::jsonb
WHERE id = 'cmr8esmu001dj1ylocfxaklex' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1107$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1107$::jsonb
WHERE id = 'cmr8gr3p401tj1yloufdan99m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1108$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1108$::jsonb
WHERE id = 'cmr8f2luv01h51ylo0u8uys1g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1109$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1109$::jsonb
WHERE id = 'cmr8ehz6201a81ylo1qa41l05' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1110$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1110$::jsonb
WHERE id = 'cmr8g7d5a01ri1ylojazdfufw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1111$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1111$::jsonb
WHERE id = 'cmr8ei0af01am1ylozr519qba' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1112$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1112$::jsonb
WHERE id = 'cmr8esno301dt1ylop1cpr0xp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1113$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis is treated in hospital with insulin and fluids.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1113$::jsonb
WHERE id = 'cmr8e5zl301801ylomu35goin' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1114$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1114$::jsonb
WHERE id = 'cmr8fza1b01o21ylo7vje1hko' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1115$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1115$::jsonb
WHERE id = 'cmr8fzas601ob1ylo87jjkuy6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1116$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j1116$::jsonb
WHERE id = 'cmr8fz7rd01na1yloigwk6jtj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1117$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1117$::jsonb
WHERE id = 'cmr8g7bk701qz1ylop71256fz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1118$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1118$::jsonb
WHERE id = 'cmr8h1dun01wu1ylo3ynf6ecq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1119$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1119$::jsonb
WHERE id = 'cmr8h1fbw01x91yloacplygwz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1120$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1120$::jsonb
WHERE id = 'cmr8j9qk802k61ylojibpizna' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1121$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1121$::jsonb
WHERE id = 'cmr8j9r2o02kb1ylopimknjvp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1122$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1122$::jsonb
WHERE id = 'cmr8i0bsa027c1ylooa72dkq0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1123$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1123$::jsonb
WHERE id = 'cmr8j0oej02h31ylo8sqwyzam' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1124$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1124$::jsonb
WHERE id = 'cmr8hrqdj02311ylo62is395l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1125$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1125$::jsonb
WHERE id = 'cmr8hrttq02481ylo9e0fdc7a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1126$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1126$::jsonb
WHERE id = 'cmr8hggcq020k1ylo575ogmft' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1127$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1127$::jsonb
WHERE id = 'cmr8i0a9j026t1ylotflewxu8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1128$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j1128$::jsonb
WHERE id = 'cmr8ji5uu02ms1ylonz8740sd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1129$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1129$::jsonb
WHERE id = 'cmr8jul6k001c1ygi900jbsr2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1130$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1130$::jsonb
WHERE id = 'cmr8l1kf8006k1ygixw6v4k6r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1131$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j1131$::jsonb
WHERE id = 'cmr8kia8i00481ygis86fdev8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1132$[{"label": "MedlinePlus. Acute treatment of ischemic stroke includes tPA (tissue plasminogen activator), given within 4 hours of symptom onset.", "url": "https://medlineplus.gov/stroke.html"}]$j1132$::jsonb
WHERE id = 'cmr8lyx3l00g51ygiy95hucha' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1133$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1133$::jsonb
WHERE id = 'cmr8juk9y00111ygimunatw3k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1134$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1134$::jsonb
WHERE id = 'cmr8lc6aw00a41ygiut8702qb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1135$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j1135$::jsonb
WHERE id = 'cmr8m9ewy00ko1ygibm8lisa6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1136$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1136$::jsonb
WHERE id = 'cmr8m9bwe00k81ygiymygb6e1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1137$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1137$::jsonb
WHERE id = 'cmr8m9b6f00jz1ygird34708h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1138$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1138$::jsonb
WHERE id = 'cmr8lc4st009l1ygiq5vr5fb0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1139$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1139$::jsonb
WHERE id = 'cmr8lc4bd009f1ygind0nqcre' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1140$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1140$::jsonb
WHERE id = 'cmr8jiabm02ob1ylo0k333p46' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1141$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1141$::jsonb
WHERE id = 'cmr8ji9x802o61ylohlbofyiv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1142$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1142$::jsonb
WHERE id = 'cmr8ji94y02nw1ylono4bs7p0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1143$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1143$::jsonb
WHERE id = 'cmr8ji8rj02ns1ylo3yr3dnol' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1144$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1144$::jsonb
WHERE id = 'cmr8lqjya00dy1ygi5ex17gqi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1145$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1145$::jsonb
WHERE id = 'cmr8lqgxp00d51ygi1dv6xk99' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1146$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1146$::jsonb
WHERE id = 'cmr8lqgp100d21ygixsmb9teg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1147$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j1147$::jsonb
WHERE id = 'cmr8lqglt00d11ygiug0vj9mc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1148$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1148$::jsonb
WHERE id = 'cmr8lywwq00g31ygi10rut7r8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1149$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1149$::jsonb
WHERE id = 'cmr8lc5qs009x1ygidfh2dut0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1150$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1150$::jsonb
WHERE id = 'cmr8lqjs600dw1ygiuih4wek1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1151$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1151$::jsonb
WHERE id = 'cmr8o9i09013d1yginfks7jzt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1152$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1152$::jsonb
WHERE id = 'cmr8ncoe800tn1ygi00fyo1ph' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1153$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1153$::jsonb
WHERE id = 'cmr8ncol300tp1ygiubzy4rxc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1154$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1154$::jsonb
WHERE id = 'cmr8ny5aw01041ygip2fidadr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1155$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1155$::jsonb
WHERE id = 'cmr8ncmup00t71ygiuj40zj8i' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1156$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1156$::jsonb
WHERE id = 'cmr8n3rgg00qg1ygidn0x29qx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1157$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1157$::jsonb
WHERE id = 'cmr8p26tw019s1ygif3nvwtn9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1158$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1158$::jsonb
WHERE id = 'cmr8n3pss00pz1ygic0qc31wm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1159$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1159$::jsonb
WHERE id = 'cmr8mlv4q00ng1ygi4cn92e43' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1160$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1160$::jsonb
WHERE id = 'cmr8mlvan00ni1ygibrqb1nl7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1161$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1161$::jsonb
WHERE id = 'cmr8nclog00sv1ygignjp736f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1162$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1162$::jsonb
WHERE id = 'cmr8ncmya00t81ygik7akp416' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1163$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1163$::jsonb
WHERE id = 'cmr8p26cs019m1ygi38ps0ra1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1164$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1164$::jsonb
WHERE id = 'cmr8nmitk00wu1ygifarq1dup' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1165$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1165$::jsonb
WHERE id = 'cmr8ny6wc010o1ygizq48swmx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1166$[{"label": "NIDDK. Type 1 diabetes is an autoimmune disease in which the immune system destroys the beta cells that make insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes"}, {"label": "MedlinePlus Medical Encyclopedia. Type 1 diabetes is an autoimmune disorder.", "url": "https://medlineplus.gov/ency/article/000305.htm"}]$j1166$::jsonb
WHERE id = 'cmr8ny5xt010c1ygimwrxqfjx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1167$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1167$::jsonb
WHERE id = 'cmr8nmgws00w61ygiwigbs7jw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1168$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1168$::jsonb
WHERE id = 'cmr8o9k5v01441ygi7nuooqxr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1169$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j1169$::jsonb
WHERE id = 'cmr8o9iel013i1ygihzq50yr7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1170$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1170$::jsonb
WHERE id = 'cmr8o9ist013n1ygikmnhkqkv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1171$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1171$::jsonb
WHERE id = 'cmr8q440101k21ygiwhb5uqh4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1172$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1172$::jsonb
WHERE id = 'cmr8qfo1401mi1ygi6ohqd4fe' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1173$[{"label": "MedlinePlus. Ectopic pregnancy.", "url": "https://medlineplus.gov/ectopicpregnancy.html"}]$j1173$::jsonb
WHERE id = 'cmr8quym101px1ygi4jobhbyg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1174$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1174$::jsonb
WHERE id = 'cmr8pvcp201fl1ygief5jf3cx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1175$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1175$::jsonb
WHERE id = 'cmr8pvd6w01fq1ygia9saavv4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1176$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j1176$::jsonb
WHERE id = 'cmr8pvhnu01gz1ygi9zax3lya' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1177$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1177$::jsonb
WHERE id = 'cmr8pvhd101gw1ygisk3o0y1d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1178$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1178$::jsonb
WHERE id = 'cmr8pvi2801h31ygidd2doq01' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1179$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1179$::jsonb
WHERE id = 'cmr97i31w004p1ywyzk34iqlc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1180$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1180$::jsonb
WHERE id = 'cmr8qfqdz01nb1ygin9j57cbm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1181$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j1181$::jsonb
WHERE id = 'cmr8q423t01je1ygijbb7nnxj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1182$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j1182$::jsonb
WHERE id = 'cmr8pgvmy01d91ygi54morii8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1183$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1183$::jsonb
WHERE id = 'cmr97i1a800471ywypgm507hb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1184$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1184$::jsonb
WHERE id = 'cmr97hzhg003p1ywyox7hq9hk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1185$[{"label": "NIDDK. Gallstones that block the bile ducts cause sudden pain.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j1185$::jsonb
WHERE id = 'cmr97hzae003n1ywybc8ngxma' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1186$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1186$::jsonb
WHERE id = 'cmr97hyb8003d1ywy73q0sxg0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1187$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1187$::jsonb
WHERE id = 'cmr97qcyg006n1ywyi36rjoj5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1188$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1188$::jsonb
WHERE id = 'cmr97i3gf004t1ywyeqsjn77m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1189$[{"label": "MedlinePlus. Asthma, including asthma attacks and quick-relief medicines.", "url": "https://medlineplus.gov/asthma.html"}]$j1189$::jsonb
WHERE id = 'cmr8pgwr401dn1ygijlanrsan' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1190$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j1190$::jsonb
WHERE id = 'cmr8qfn8s01m81ygiwdfyc215' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1191$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1191$::jsonb
WHERE id = 'cmr98mm8g00ko1ywyysn6if81' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1192$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1192$::jsonb
WHERE id = 'cmr98mm1c00km1ywypxi8pdbo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1193$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j1193$::jsonb
WHERE id = 'cmr996ll200rt1ywyfzf5mta9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1194$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1194$::jsonb
WHERE id = 'cmr996j4500qz1ywyyqy26v0o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1195$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1195$::jsonb
WHERE id = 'cmr98mnwp00l51ywyub8kv0iw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1196$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1196$::jsonb
WHERE id = 'cmr98dmkn00hr1ywyzy655r6n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1197$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j1197$::jsonb
WHERE id = 'cmr98dj0d00gr1ywyl61q42zh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1198$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1198$::jsonb
WHERE id = 'cmr98640b00es1ywy17z60tcq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1199$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1199$::jsonb
WHERE id = 'cmr97yxuf00a31ywypbv284fo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1200$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1200$::jsonb
WHERE id = 'cmr97qgtb007q1ywybc1nd5j0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1201$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1201$::jsonb
WHERE id = 'cmr97z1t100b71ywyvgk1raca' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1202$[{"label": "NIDDK. In type 2 diabetes the body does not make enough insulin or does not use insulin well.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes"}]$j1202$::jsonb
WHERE id = 'cmr97z2ad00bc1ywyh45tv06o' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1203$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1203$::jsonb
WHERE id = 'cmr99iiqh00ue1ywyxdz1vkcw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1204$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1204$::jsonb
WHERE id = 'cmr97z0qt00aw1ywyrolw9syv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1205$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1205$::jsonb
WHERE id = 'cmr97qe5v006z1ywy4k6o1xpz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1206$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1206$::jsonb
WHERE id = 'cmr97qect00711ywyahzfc6kt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1207$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1207$::jsonb
WHERE id = 'cmr99ih3100tx1ywy2f3y1pwy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1208$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1208$::jsonb
WHERE id = 'cmr99igsk00tu1ywypvcw23ms' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1209$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1209$::jsonb
WHERE id = 'cmr99igh700ts1ywytyd2me33' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1210$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1210$::jsonb
WHERE id = 'cmr97qfnc007e1ywyvqanguja' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1211$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1211$::jsonb
WHERE id = 'cmr97z18400b11ywyjuqlw0ao' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1212$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1212$::jsonb
WHERE id = 'cmr9863uj00eq1ywytv7ar6i1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1213$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j1213$::jsonb
WHERE id = 'cmr996m5200s01ywyafionwq5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1214$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j1214$::jsonb
WHERE id = 'cmr99ijzq00ur1ywyy0mqi4iq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1215$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1215$::jsonb
WHERE id = 'cmr9862z900ef1ywy074xp8de' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1216$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1216$::jsonb
WHERE id = 'cmr97qdoj006u1ywyxdygy1ty' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1217$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1217$::jsonb
WHERE id = 'cmr97qegj00721ywyzy3pdyjx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1218$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1218$::jsonb
WHERE id = 'cmr97qi2l00831ywy0f1oimge' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1219$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1219$::jsonb
WHERE id = 'cmr97qi9k00851ywyyj5276t4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1220$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1220$::jsonb
WHERE id = 'cmr97yxk000a01ywyr7kv34p0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1221$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1221$::jsonb
WHERE id = 'cmr97yzlk00al1ywyjzp2qzq3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1222$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1222$::jsonb
WHERE id = 'cmr97yzwq00ao1ywyx10lttyn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1223$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1223$::jsonb
WHERE id = 'cmr97z1m500b51ywyxt8n4nnd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1224$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1224$::jsonb
WHERE id = 'cmr98mnt200l41ywyk1mwknjy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1225$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1225$::jsonb
WHERE id = 'cmr97qfjl007d1ywypoft9f80' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1226$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1226$::jsonb
WHERE id = 'cmr99ijwa00uq1ywyi2tu0wol' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1227$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1227$::jsonb
WHERE id = 'cmr9bbvox01ep1ywy7cagj7sf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1228$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1228$::jsonb
WHERE id = 'cmr9bbrtb01do1ywy7zg6usm3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1229$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1229$::jsonb
WHERE id = 'cmr9bbugo01ed1ywyhywlkdi5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1230$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation for acute respiratory failure without a contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV when pH remains under 7.35 and PaCO2 is at least 6.5 kPa, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$j1230$::jsonb
WHERE id = 'cmr9bbtjc01e41ywypdk6ggtu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1231$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1231$::jsonb
WHERE id = 'cmr99ilta00va1ywyvc74u1ea' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1232$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1232$::jsonb
WHERE id = 'cmr99rhat00y41ywyy9r804m8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1233$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1233$::jsonb
WHERE id = 'cmr99rg9j00xr1ywyk8l8ncvq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1234$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1234$::jsonb
WHERE id = 'cmr99riii00yj1ywyq3ah7jyu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1235$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1235$::jsonb
WHERE id = 'cmr99rfmr00xj1ywyzamvh7x3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1236$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1236$::jsonb
WHERE id = 'cmr99renk00x71ywyjnpbx7f7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1237$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1237$::jsonb
WHERE id = 'cmr99regd00x51ywy8oox119e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1238$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1238$::jsonb
WHERE id = 'cmru3gb9q00a91y7w8hg6nty1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1239$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1239$::jsonb
WHERE id = 'cmru3ge8600bb1y7w51i8jv7g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1240$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j1240$::jsonb
WHERE id = 'cmru3gegd00be1y7wb4nteudr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1241$[{"label": "GOLD 2025 pocket guide. COPD and exacerbations.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "MedlinePlus. COPD (chronic obstructive pulmonary disease).", "url": "https://medlineplus.gov/copd.html"}]$j1241$::jsonb
WHERE id = 'cmr9c9nk701qv1ywy8tdsqhdi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1242$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1242$::jsonb
WHERE id = 'cmr9c9oco01r31ywy3heknxhi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1243$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1243$::jsonb
WHERE id = 'cmr9bv1wt01la1ywysmlu56ff' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1244$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1244$::jsonb
WHERE id = 'cmr9buzmj01ki1ywy2mf7evyw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1245$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1245$::jsonb
WHERE id = 'cmr9buyyf01ka1ywydz98hqk1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1246$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1246$::jsonb
WHERE id = 'cmr9c9qqu01rq1ywyhf9dvvin' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1247$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1247$::jsonb
WHERE id = 'cmr9c9pnr01rg1ywyptowgu1t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1248$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1248$::jsonb
WHERE id = 'cmr9c9puw01ri1ywy15ap95pb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1249$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1249$::jsonb
WHERE id = 'cmr9c9qax01rm1ywy5awpas74' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1250$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1250$::jsonb
WHERE id = 'cmr9c9qg501rn1ywy34s68cfq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1251$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1251$::jsonb
WHERE id = 'cmr9c37rd01o51ywy40x1xdbf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1252$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1252$::jsonb
WHERE id = 'cmr9c38pf01oh1ywyjmjmoidh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1253$[{"label": "MedlinePlus. Gallstones.", "url": "https://medlineplus.gov/gallstones.html"}, {"label": "NIDDK. Gallstones can block the bile ducts.", "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones"}]$j1253$::jsonb
WHERE id = 'cmr9buygy01k41ywy7clo6ewv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1254$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1254$::jsonb
WHERE id = 'cmr9c9mno01qm1ywy8etw8475' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1255$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic hyperglycemic hyperosmolar syndrome: extremely high blood sugar, usually without ketoacidosis.", "url": "https://medlineplus.gov/ency/article/000304.htm"}]$j1255$::jsonb
WHERE id = 'cmru2q8t9000n1y7wwqn5ayjl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1256$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1256$::jsonb
WHERE id = 'cmr9c359d01na1ywydp4jx2kv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1257$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1257$::jsonb
WHERE id = 'cmru2qb60001f1y7w4qqlizqs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1258$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1258$::jsonb
WHERE id = 'cmr9c38e401od1ywybeo5r0pd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1259$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1259$::jsonb
WHERE id = 'cmru3n73l00eg1y7w8293ul7l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1260$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1260$::jsonb
WHERE id = 'cmru8hxf500af1yd6shnnzeds' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1261$[{"label": "MedlinePlus. Pulmonary embolism.", "url": "https://medlineplus.gov/pulmonaryembolism.html"}]$j1261$::jsonb
WHERE id = 'cmru6qzaq002vl1041myk3kbz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1262$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1262$::jsonb
WHERE id = 'cmru3uc6f00gx1y7wimse5r89' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1263$[{"label": "MedlinePlus. Tuberculosis.", "url": "https://medlineplus.gov/tuberculosis.html"}]$j1263$::jsonb
WHERE id = 'cmru3udoy00hd1y7wjeqi4qgs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1264$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1264$::jsonb
WHERE id = 'cmru3ug6100i31y7wciw7ofbp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1265$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1265$::jsonb
WHERE id = 'cmru3uggf00i61y7wkz2okj2v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1266$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1266$::jsonb
WHERE id = 'cmru7tj9300041yd65y64bj61' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1267$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1267$::jsonb
WHERE id = 'cmru7tjw6000c1yd6gzl5nv7v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1268$[{"label": "MedlinePlus Medical Encyclopedia. Anaphylaxis: give epinephrine immediately.", "url": "https://medlineplus.gov/ency/article/000844.htm"}]$j1268$::jsonb
WHERE id = 'cmru7tk1w000e1yd65s10ddfj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1269$[{"label": "NIDDK. In insulin resistance, muscle, fat, and liver do not respond well to insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"}]$j1269$::jsonb
WHERE id = 'cmru7tnb9001j1yd6tv23pl14' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1270$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1270$::jsonb
WHERE id = 'cmru855ef003q1yd6pcycus6a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1271$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1271$::jsonb
WHERE id = 'cmru8bcpf006j1yd6e88enk27' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1272$[{"label": "MedlinePlus. Iron.", "url": "https://medlineplus.gov/iron.html"}]$j1272$::jsonb
WHERE id = 'cmru8v3ex000i1y0s8y2rz416' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1273$[{"label": "MedlinePlus. Ectopic pregnancy.", "url": "https://medlineplus.gov/ectopicpregnancy.html"}]$j1273$::jsonb
WHERE id = 'cmru96m1e003j1y0spum2w423' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1274$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1274$::jsonb
WHERE id = 'cmru9cuek006h1y0sxeqdo9ow' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1275$[{"label": "MedlinePlus. High blood pressure in pregnancy, including preeclampsia.", "url": "https://medlineplus.gov/preeclampsia.html"}]$j1275$::jsonb
WHERE id = 'cmru9curi006k1y0srh08v4wc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1276$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1276$::jsonb
WHERE id = 'cmru9cwww00721y0sc44gd691' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1277$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1277$::jsonb
WHERE id = 'cmru9cxqu00791y0srcneh2y9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1278$[{"label": "MedlinePlus Medical Encyclopedia. Vitamin B12 deficiency anemia.", "url": "https://medlineplus.gov/ency/article/000574.htm"}]$j1278$::jsonb
WHERE id = 'cmruifz2u001s1yce3tw4vlxn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1279$[{"label": "MedlinePlus Medical Encyclopedia. High potassium (hyperkalemia).", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j1279$::jsonb
WHERE id = 'cmruif6t0001h1yceiy6qe428' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1280$[{"label": "MedlinePlus Medical Encyclopedia. High potassium (hyperkalemia).", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j1280$::jsonb
WHERE id = 'cmruidtkw000t1yceh9yho1cl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1281$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1281$::jsonb
WHERE id = 'cmru9cz66007l1y0stvs944a7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1282$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1282$::jsonb
WHERE id = 'cmru9d0nq007t1y0s8c5vnfwk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1283$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1283$::jsonb
WHERE id = 'cmru9d0wa007v1y0sizl7pgub' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1284$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1284$::jsonb
WHERE id = 'cmru9d10o007w1y0s7dgs83e6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1285$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j1285$::jsonb
WHERE id = 'cmru9d14w007x1y0s85psdhse' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1286$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1286$::jsonb
WHERE id = 'cmru9iqns009w1y0st4o7s4ts' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1287$[{"label": "MedlinePlus. Meningitis, including viral and bacterial meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j1287$::jsonb
WHERE id = 'cmru9irzj00a71y0sx6pzbzo8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1288$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1288$::jsonb
WHERE id = 'cmru9itf800aj1y0sp1e010qz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1289$[{"label": "MedlinePlus. Pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j1289$::jsonb
WHERE id = 'cmru9its400am1y0svtc81t8p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1290$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1290$::jsonb
WHERE id = 'cmru9iu0s00ao1y0sz6x9wfo1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1291$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1291$::jsonb
WHERE id = 'cmru9iu9f00aq1y0sxjg852sq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1292$[{"label": "MedlinePlus Medical Encyclopedia. Acute cholecystitis.", "url": "https://medlineplus.gov/ency/article/000264.htm"}]$j1292$::jsonb
WHERE id = 'cmru9ivgq00b01y0s6eu34f2p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1293$[{"label": "MedlinePlus Medical Encyclopedia. High potassium (hyperkalemia).", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j1293$::jsonb
WHERE id = 'cmruyh12h001y1y2yutyrehyj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1294$[{"label": "MedlinePlus. Osteoporosis.", "url": "https://medlineplus.gov/osteoporosis.html"}]$j1294$::jsonb
WHERE id = 'cmrvwndpb000l1ye8atg4y4mq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1295$[{"label": "MedlinePlus Medical Encyclopedia. Vitamin B12 deficiency anemia.", "url": "https://medlineplus.gov/ency/article/000574.htm"}]$j1295$::jsonb
WHERE id = 'cmrvwsawd002t1ye8n3fxjffu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1296$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1296$::jsonb
WHERE id = 'cmrvwsb4q002w1ye81296conp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1297$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1297$::jsonb
WHERE id = 'cmtpx8qdj002i1ymujk0o3udo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1298$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1298$::jsonb
WHERE id = 'cmtpxgsfv007d1ymutyvo6121' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1299$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1299$::jsonb
WHERE id = 'cmtpx6bvq00021ymupa6beyv8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1300$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1300$::jsonb
WHERE id = 'cmtpx8r7v002t1ymu4gyib006' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1301$[{"label": "MedlinePlus. Heart attack (myocardial infarction).", "url": "https://medlineplus.gov/heartattack.html"}]$j1301$::jsonb
WHERE id = 'cmtpx8rd9002v1ymuwr24v2je' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1302$[{"label": "MedlinePlus. Pancreatitis.", "url": "https://medlineplus.gov/pancreatitis.html"}]$j1302$::jsonb
WHERE id = 'cmtpx8sby00351ymug6369ao8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1303$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1303$::jsonb
WHERE id = 'cmtpx8sku00381ymu0vln5fs1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1304$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1304$::jsonb
WHERE id = 'cmtpxc5cd004u1ymufkgukdih' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1305$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1305$::jsonb
WHERE id = 'cmqgt4sdu000i1y0qztxdmcqk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1306$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1306$::jsonb
WHERE id = 'cmqkgntpm0gorl304y7gfp61x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1307$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1307$::jsonb
WHERE id = 'cmqkgntqh0gpvl304vixfbfdp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1308$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1308$::jsonb
WHERE id = 'cmqkgnt020fvcl304hrqp308d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1309$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1309$::jsonb
WHERE id = 'cmqkgnt3s0fzql304cpylojsd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1310$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1310$::jsonb
WHERE id = 'cmqkgntvt0gupl3040wbwg4u0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1311$[{"label": "MedlinePlus. Hypothyroidism, including Hashimoto's disease.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1311$::jsonb
WHERE id = 'cmq0g7k1800441y4f51z1rb68' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1312$[{"label": "GOLD 2025 pocket guide. Systemic corticosteroids are used for severe COPD exacerbations and are not continued beyond 5 days.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$j1312$::jsonb
WHERE id = 'cmqxd0p9t006d1ymaqzez0709' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1313$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1313$::jsonb
WHERE id = 'cmq33ahlw01x91yiu5vyqdgsm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1314$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j1314$::jsonb
WHERE id = 'cmqkgnq660dfzl304jfst69o5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1315$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j1315$::jsonb
WHERE id = 'cmqkgnt4n0g0dl304tarli8le' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
COMMIT;
