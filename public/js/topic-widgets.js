(function(){
var TOPIC_WIDGET_DATA={};
TOPIC_WIDGET_DATA.cyber={
terms:[{cn:'网络安全',py:'wǎngluò ānquán',en:'cybersecurity',cat:'core'},{cn:'漏洞',py:'lòudòng',en:'vulnerability',cat:'vuln'},{cn:'零日',py:'líng rì',en:'zero-day',cat:'vuln'},{cn:'供应链攻击',py:'gōngyìng liàn gōngjī',en:'supply chain attack',cat:'threat'},{cn:'APT',py:'APT',en:'Advanced Persistent Threat',cat:'threat'},{cn:'木马',py:'mùmǎ',en:'trojan',cat:'malware'},{cn:'勒索软件',py:'lèsuǒ ruǎnjiàn',en:'ransomware',cat:'malware'},{cn:'钓鱼',py:'diàoyú',en:'phishing',cat:'social'},{cn:'数据泄露',py:'shùjù xièlòu',en:'data breach',cat:'incident'},{cn:'暗网',py:'àn wǎng',en:'dark web',cat:'core'},{cn:'威胁情报',py:'wēixié qíngbào',en:'threat intelligence',cat:'core'},{cn:'黑产',py:'hēi chǎn',en:'cybercrime ecosystem',cat:'fraud'},{cn:'水军',py:'shuǐ jūn',en:'paid commenters/bots',cat:'disinfo'},{cn:'舆情监测',py:'yúqíng jiāncè',en:'public opinion monitoring',cat:'disinfo'},{cn:'带节奏',py:'dài jiézòu',en:'push a narrative',cat:'disinfo'},{cn:'社工库',py:'shègōng kù',en:'social engineering DB',cat:'fraud'},{cn:'红队',py:'hóng duì',en:'red team',cat:'core'},{cn:'网信办',py:'wǎng xìn bàn',en:'Cyberspace Admin (CAC)',cat:'policy'},{cn:'等保2.0',py:'děng bǎo',en:'classified protection scheme',cat:'policy'},{cn:'电诈',py:'diàn zhà',en:'telecom fraud',cat:'fraud'}],
queryPlatforms:['Baidu','Bilibili','Zhihu','GitHub','XHS'],
queryKeywords:['漏洞 披露','APT 溯源','电诈 新套路','威胁情报 盘点','数据泄露 事件','黑灰产 调查','舆情 监测 报告'],
querySites:['baidu.com','bilibili.com','zhihu.com','github.com','xiaohongshu.com'],
checklist:['Check Baidu 热搜 for cyber terms','Scan Bilibili 安全圈周报','Review anquanke.com headlines','Search GitHub for new POCs','Monitor 网信办 notices','Check FreeBuf weekly digest','Review 舆情 报告 PDFs']
};
TOPIC_WIDGET_DATA.political={
terms:[
// institution
{cn:'两会',py:'liǎng huì',en:'Two Sessions (NPC + CPPCC)',cat:'institution'},
{cn:'人大',py:'Rén Dà',en:'National People\'s Congress (NPC)',cat:'institution'},
{cn:'政协',py:'Zhèng Xié',en:'CPPCC consultative body',cat:'institution'},
{cn:'中央政治局',py:'zhōngyāng zhèngzhìjú',en:'Politburo',cat:'institution'},
{cn:'常委会',py:'chángwěi huì',en:'(Politburo) Standing Committee',cat:'institution'},
{cn:'国务院',py:'Guówùyuàn',en:'State Council (cabinet)',cat:'institution'},
{cn:'中央军委',py:'zhōngyāng jūnwěi',en:'Central Military Commission',cat:'institution'},
{cn:'总书记',py:'zǒng shūjì',en:'General Secretary (party)',cat:'institution'},
{cn:'国家主席',py:'guójiā zhǔxí',en:'President / State Chairman',cat:'institution'},
{cn:'总理',py:'zǒnglǐ',en:'Premier',cat:'institution'},
{cn:'中纪委',py:'Zhōng Jìwěi',en:'Central Discipline Commission',cat:'institution'},
{cn:'外交部',py:'Wàijiāobù',en:'Ministry of Foreign Affairs',cat:'institution'},
// ideology
{cn:'马克思主义',py:'Mǎkèsī zhǔyì',en:'Marxism',cat:'ideology'},
{cn:'习近平思想',py:'Xí Jìnpíng sīxiǎng',en:'Xi Jinping Thought',cat:'ideology'},
{cn:'中国特色',py:'Zhōngguó tèsè',en:'with Chinese characteristics',cat:'ideology'},
{cn:'核心价值观',py:'héxīn jiàzhíguān',en:'core socialist values',cat:'ideology'},
{cn:'意识形态',py:'yìshí xíngtài',en:'ideology',cat:'ideology'},
{cn:'新时代',py:'xīn shídài',en:'New Era (Xi-era framing)',cat:'ideology'},
{cn:'中国梦',py:'Zhōngguó mèng',en:'China Dream',cat:'ideology'},
// domestic
{cn:'共同富裕',py:'gòngtóng fùyù',en:'common prosperity',cat:'domestic'},
{cn:'内循环',py:'nèi xúnhuán',en:'internal circulation',cat:'domestic'},
{cn:'双循环',py:'shuāng xúnhuán',en:'dual circulation (internal + external)',cat:'domestic'},
{cn:'新质生产力',py:'xīn zhì shēngchǎn lì',en:'new quality productive forces',cat:'domestic'},
{cn:'全过程民主',py:'quán guòchéng mínzhǔ',en:'whole-process democracy',cat:'domestic'},
{cn:'三农问题',py:'sān nóng wèntí',en:'three rural issues (agriculture/village/farmer)',cat:'domestic'},
{cn:'房住不炒',py:'fáng zhù bù chǎo',en:'houses for living, not speculation',cat:'domestic'},
{cn:'双减',py:'shuāng jiǎn',en:'double reduction (homework + tutoring)',cat:'domestic'},
{cn:'依法治国',py:'yī fǎ zhì guó',en:'rule by law',cat:'domestic'},
// foreign
{cn:'一带一路',py:'yī dài yī lù',en:'Belt and Road Initiative',cat:'foreign'},
{cn:'战狼外交',py:'zhàn láng wàijiāo',en:'wolf-warrior diplomacy',cat:'foreign'},
{cn:'人类命运共同体',py:'rénlèi mìngyùn gòngtóngtǐ',en:'community of shared future for humanity',cat:'foreign'},
{cn:'多边主义',py:'duōbiān zhǔyì',en:'multilateralism',cat:'foreign'},
{cn:'台海',py:'Tái hǎi',en:'Taiwan Strait',cat:'foreign'},
{cn:'两岸',py:'liǎng\'àn',en:'cross-strait (PRC–Taiwan)',cat:'foreign'},
{cn:'南海',py:'Nán Hǎi',en:'South China Sea',cat:'foreign'},
{cn:'反制',py:'fǎn zhì',en:'countermeasures',cat:'foreign'},
{cn:'经济制裁',py:'jīngjì zhìcái',en:'economic sanctions',cat:'foreign'},
{cn:'脱钩',py:'tuōgōu',en:'decoupling (from US)',cat:'foreign'},
// policy
{cn:'维稳',py:'wéi wěn',en:'maintain stability',cat:'policy'},
{cn:'反腐',py:'fǎn fǔ',en:'anti-corruption',cat:'policy'},
{cn:'脱贫攻坚',py:'tuōpín gōngjiān',en:'poverty-alleviation battle',cat:'policy'},
{cn:'精准扶贫',py:'jīngzhǔn fúpín',en:'targeted poverty relief',cat:'policy'},
{cn:'碳达峰',py:'tàn dá fēng',en:'carbon peaking',cat:'policy'},
{cn:'碳中和',py:'tàn zhōnghé',en:'carbon neutrality',cat:'policy'},
{cn:'一国两制',py:'yī guó liǎng zhì',en:'one country, two systems',cat:'policy'},
{cn:'三胎政策',py:'sān tāi zhèngcè',en:'three-child policy',cat:'policy'},
{cn:'供给侧改革',py:'gōngjǐ cè gǎigé',en:'supply-side reform',cat:'policy'},
// economy
{cn:'供给侧',py:'gōngjǐ cè',en:'supply side',cat:'economy'},
{cn:'去杠杆',py:'qù gànggǎn',en:'deleveraging',cat:'economy'},
{cn:'灰犀牛',py:'huī xīniú',en:'grey rhino — obvious looming risk',cat:'economy'},
{cn:'黑天鹅',py:'hēi tiān\'é',en:'black swan — rare disruptive event',cat:'economy'},
{cn:'去美元化',py:'qù měiyuán huà',en:'de-dollarization',cat:'economy'},
{cn:'产能过剩',py:'chǎnnéng guòshèng',en:'overcapacity',cat:'economy'},
// media
{cn:'舆论场',py:'yúlùn chǎng',en:'public opinion sphere',cat:'media'},
{cn:'引导舆论',py:'yǐndǎo yúlùn',en:'guide the narrative',cat:'media'},
{cn:'统一口径',py:'tǒngyī kǒujìng',en:'unified talking points',cat:'media'},
{cn:'敏感词',py:'mǐngǎn cí',en:'sensitive/censored words',cat:'media'},
{cn:'清朗行动',py:'qīnglǎng xíngdòng',en:'Clean Cyberspace campaign',cat:'media'},
{cn:'防火长城',py:'fánghuǒ chángchéng',en:'Great Firewall',cat:'media'},
{cn:'翻墙',py:'fān qiáng',en:'scale the wall — use VPN',cat:'media'},
{cn:'官媒',py:'guān méi',en:'state media',cat:'media'},
{cn:'自媒体',py:'zì méitǐ',en:'we-media / independent creators',cat:'media'},
{cn:'发言人',py:'fāyán rén',en:'spokesperson',cat:'media'},
{cn:'新闻发布会',py:'xīnwén fābù huì',en:'press conference',cat:'media'},
{cn:'辟谣',py:'pì yáo',en:'debunk rumors (often official)',cat:'media'},
{cn:'热搜',py:'rè sōu',en:'trending search topics',cat:'media'},
{cn:'审查',py:'shěnchá',en:'censorship / review',cat:'media'},
// slogan
{cn:'不忘初心',py:'bú wàng chū xīn',en:'never forget the original mission',cat:'slogan'},
{cn:'撸起袖子加油干',py:'lū qǐ xiùzi jiāyóu gàn',en:'roll up sleeves and work hard',cat:'slogan'},
{cn:'绿水青山',py:'lǜ shuǐ qīng shān',en:'green waters, green mountains (ecology slogan)',cat:'slogan'},
{cn:'人民至上',py:'rénmín zhì shàng',en:'people-first',cat:'slogan'},
{cn:'中华民族伟大复兴',py:'Zhōnghuá mínzú wěidà fùxīng',en:'great rejuvenation of the Chinese nation',cat:'slogan'},
// meme
{cn:'川建国',py:'Chuān Jiànguó',en:'Trump satirical nickname (lit. Chuan Jianguo)',cat:'meme'},
{cn:'社会主义铁拳',py:'shèhuì zhǔyì tiě quán',en:'socialist iron fist (crackdown meme)',cat:'meme'},
{cn:'小粉红',py:'xiǎo fěnhóng',en:'little pinks — young online nationalists',cat:'meme'},
{cn:'润学',py:'rùn xué',en:'runology — the art of emigrating',cat:'meme'},
{cn:'厉害了我的国',py:'lìhài le wǒ de guó',en:'"Amazing China" — sarcastic patriot meme',cat:'meme'},
{cn:'爱国生意',py:'àiguó shēngyì',en:'patriotism as a business model',cat:'meme'}
],
trumpNames:[{name:'川普',note:'Formal transliteration'},{name:'特朗普',note:'Standard media name'},{name:'川建国',note:'Satirical nickname'},{name:'老川',note:'Colloquial Old Trump'},{name:'川总',note:'Boss Trump'},{name:'川宝',note:'Mock-affectionate nickname'},{name:'橙总',note:'Orange Boss'}],
memes:[{cn:'端起碗吃肉，放下筷子骂娘',en:'eat the meat then complain'},{cn:'学习强国',en:'party study app, often memed'},{cn:'精神资本家',en:'ironic corporation stanning'},{cn:'互联网嘴替',en:'someone who says what others feel'},{cn:'何不食肉糜',en:'tone-deaf advice from above'}],
briClusters:[{label:'Projects 项目',kws:['一带一路 项目','清单/地图/进展','港口/铁路/电站/园区']},{label:'Finance 融资',kws:['政策性银行','亚投行','丝路基金','债务重组']},{label:'Risk 风险',kws:['债务可持续性','违约','政治风险','环保评估']},{label:'Regions 地区',kws:['中亚','东南亚','非洲','中东','拉美']}]
};
TOPIC_WIDGET_DATA.genz={
terms:[{cn:'躺平',py:'tǎng píng',en:'lying flat — reject the rat race',cat:'burnout'},{cn:'摆烂',py:'bǎi làn',en:'letting it rot — give up trying',cat:'burnout'},{cn:'内卷',py:'nèi juǎn',en:'involution — compete harder for less',cat:'pressure'},{cn:'内耗',py:'nèi hào',en:'inner drain / rumination',cat:'mental'},{cn:'打工人',py:'dǎ gōng rén',en:'overworked wage slave',cat:'work'},{cn:'社恐',py:'shè kǒng',en:'social anxiety',cat:'mental'},{cn:'润',py:'rùn',en:'emigrate / escape',cat:'escape'},{cn:'松弛感',py:'sōngchí gǎn',en:'relaxed vibe aesthetic',cat:'coping'},{cn:'情绪价值',py:'qíngxù jiàzhí',en:'emotional value',cat:'coping'},{cn:'精致穷',py:'jīngzhì qióng',en:'refined poor',cat:'lifestyle'},{cn:'消费降级',py:'xiāofèi jiàngjí',en:'consumption downgrade',cat:'money'},{cn:'35岁危机',py:'35 suì wēijī',en:'age-35 career ceiling',cat:'work'},{cn:'电子榨菜',py:'diànzǐ zhàcài',en:'mindless comfort content',cat:'coping'},{cn:'破防',py:'pò fáng',en:'emotionally pierced/cracked',cat:'reaction'},{cn:'断亲',py:'duàn qīn',en:'cutting off extended family',cat:'lifestyle'}],
reactions:[{cn:'笑死/xswl',en:'Dying of laughter',emoji:'🤣'},{cn:'破防了',en:'Emotionally pierced',emoji:'💔'},{cn:'裂开了',en:'Cracking up / shocked',emoji:'😱'},{cn:'无语子',en:'Speechless',emoji:'😶'},{cn:'好家伙',en:'Dang / unbelievable',emoji:'😮'},{cn:'绝了',en:'Iconic / peak',emoji:'🏆'},{cn:'离谱',en:'Wild / absurd',emoji:'🤯'},{cn:'有被冒犯到',en:'I felt personally attacked',emoji:'😤'}],
hotTopics:['就业难 Job crisis for grads','AI 焦虑 Fear of AI replacement','自媒体 变现 Creator monetization','低欲望 社会 Low-desire living','校园 PUA Campus power dynamics','城市 PK City comparisons']
};
TOPIC_WIDGET_DATA.academia={
terms:[{cn:'交换生',py:'jiāohuàn shēng',en:'exchange student',cat:'exchange'},{cn:'学分互认',py:'xuéfēn hùrèn',en:'credit transfer',cat:'exchange'},{cn:'保研',py:'bǎo yán',en:'recommended for grad school',cat:'admissions'},{cn:'考研',py:'kǎo yán',en:'grad entrance exam',cat:'admissions'},{cn:'套磁',py:'tào cí',en:'cold-email professor',cat:'apply'},{cn:'推荐信',py:'tuījiàn xìn',en:'recommendation letter',cat:'apply'},{cn:'双一流',py:'shuāng yī liú',en:'double first-class university',cat:'ranking'},{cn:'导师',py:'dǎoshī',en:'advisor/supervisor',cat:'campus'},{cn:'学术不端',py:'xuéshù bú duān',en:'academic misconduct',cat:'integrity'},{cn:'论文',py:'lùnwén',en:'thesis/paper',cat:'campus'},{cn:'国家留学基金委',py:'guójiā liúxué jījīn wěi',en:'CSC',cat:'scholarship'},{cn:'文书',py:'wénshū',en:'application essay/PS',cat:'apply'}],
deadlines:[{name:'CSC Scholarship',date:'Mar 10',status:'passed'},{name:'Fall Exchange Apps',date:'Apr 30',status:'soon'},{name:'IELTS/TOEFL',date:'May 15',status:'upcoming'},{name:'Erasmus+ Round 2',date:'Jun 1',status:'upcoming'},{name:'秋招 Campus Recruit',date:'Sep 1',status:'future'}],
emailTemplates:['尊敬的[教授姓名]老师，\n\n您好！我是[学校名]的[年级][专业]学生[姓名]。\n\n我对您在[研究领域]方面的研究非常感兴趣，特别是关于[具体课题]的工作。\n\n我的GPA为[X]，曾参与[相关经历]。\n\n不知您课题组是否招收交换生/实习生？\n\n期待您的回复！\n\n此致\n[姓名]','尊敬的[教授姓名]老师，\n\n您好！我于[日期]给您发过邮件，想跟进一下。\n\n我对加入您的课题组仍然非常感兴趣。\n\n如有任何问题，我随时可以提供更多材料。\n\n谢谢！\n[姓名]','尊敬的[教授姓名]老师，\n\n非常感谢您抽出时间回复我的邮件/面试我。\n\n我对您课题组的研究更加期待了。\n\n如需任何补充材料，请随时告知。\n\n再次感谢！\n[姓名]']
};
TOPIC_WIDGET_DATA.tourist={
phrases:[{cn:'多少钱？',py:'duōshao qián?',en:'How much?',note:'Point at item and say this'},{cn:'在哪儿？',py:'zài nǎr?',en:'Where is…?',note:'Add location before'},{cn:'不要辣',py:'bú yào là',en:'No spice please',note:'Critical in Sichuan/Hunan!'},{cn:'厕所',py:'cèsuǒ',en:'Toilet/restroom',note:'Also: 洗手间'},{cn:'帮我一下',py:'bāng wǒ yíxià',en:'Please help me',note:'Polite request'},{cn:'扫码支付',py:'sǎomǎ zhīfù',en:'Scan to pay',note:'Show your QR code'},{cn:'到这儿停',py:'dào zhèr tíng',en:'Stop here',note:'Say to taxi driver'},{cn:'打表',py:'dǎ biǎo',en:'Use the meter',note:'Insist on this'},{cn:'Wi-Fi密码',py:'wái-fā mìmǎ',en:'Wi-Fi password',note:'Point at phone'},{cn:'我对花生过敏',py:'wǒ duì huāshēng guòmǐn',en:'I\'m allergic to peanuts',note:'Replace 花生 with your allergen'}],
directions:[{cn:'怎么走？',py:'zěnme zǒu?',en:'How do I get there?'},{cn:'一直走',py:'yìzhí zǒu',en:'Go straight'},{cn:'左转',py:'zuǒ zhuǎn',en:'Turn left'},{cn:'右转',py:'yòu zhuǎn',en:'Turn right'},{cn:'多远？',py:'duō yuǎn?',en:'How far?'},{cn:'地铁站',py:'dìtiě zhàn',en:'Subway station'},{cn:'迷路了',py:'mílù le',en:'I\'m lost'}],
emergencyNums:[{name:'Police 警察',num:'110'},{name:'Ambulance 急救',num:'120'},{name:'Fire 火警',num:'119'},{name:'Traffic 交警',num:'122'}],
appCategories:[{cat:'💳 Payment',apps:[{cn:'微信支付',en:'WeChat Pay',note:'Link with WeChat account'},{cn:'支付宝',en:'Alipay',note:'Tour Pass for visitors'}]},{cat:'🚕 Transport & Maps',apps:[{cn:'滴滴出行',en:'DiDi',note:'Rides; English UI'},{cn:'高德地图',en:'Amap',note:'Best maps in China'},{cn:'12306',en:'12306',note:'Train tickets'},{cn:'携程',en:'Ctrip/Trip.com',note:'Hotels + flights'}]},{cat:'🍜 Food & Local',apps:[{cn:'美团',en:'Meituan',note:'Delivery + reviews'},{cn:'大众点评',en:'Dianping',note:'Restaurant reviews'}]}],
signs:[{cn:'出口',en:'Exit',icon:'🚪'},{cn:'入口',en:'Entrance',icon:'🚶'},{cn:'禁止吸烟',en:'No Smoking',icon:'🚭'},{cn:'危险',en:'Danger',icon:'⚠️'},{cn:'洗手间',en:'Restroom',icon:'🚻'},{cn:'停车场',en:'Parking',icon:'🅿️'},{cn:'小心台阶',en:'Mind the step',icon:'⬇️'},{cn:'请勿拍照',en:'No photos',icon:'📵'}]
};
TOPIC_WIDGET_DATA.gossip={
terms:[{cn:'吃瓜',py:'chī guā',en:'eat melons — watch gossip unfold',cat:'core'},{cn:'大瓜',py:'dà guā',en:'big scoop / major drama',cat:'core'},{cn:'塌房',py:'tā fáng',en:'house collapse — idol scandal',cat:'scandal'},{cn:'实锤',py:'shí chuí',en:'solid hammer — hard evidence',cat:'evidence'},{cn:'爆料',py:'bào liào',en:'expose / leak information',cat:'action'},{cn:'反转',py:'fǎn zhuǎn',en:'plot twist / narrative reversal',cat:'reaction'},{cn:'人设崩了',py:'rénshè bēng le',en:'persona collapsed',cat:'scandal'},{cn:'翻车',py:'fān chē',en:'crash / faceplant publicly',cat:'scandal'},{cn:'拉踩',py:'lā cǎi',en:'drag A while praising B',cat:'action'},{cn:'挖坟',py:'wā fén',en:'dig up old posts',cat:'action'},{cn:'洗白',py:'xǐ bái',en:'whitewash / cover',cat:'media'},{cn:'带节奏',py:'dài jiézòu',en:'steer the narrative',cat:'media'},{cn:'笑死',py:'xiào sǐ',en:'dying laughing',cat:'reaction'},{cn:'破防了',py:'pò fáng le',en:'emotionally pierced',cat:'reaction'},{cn:'无语子',py:'wúyǔ zi',en:'speechless',cat:'reaction'},{cn:'营销号',py:'yíngxiāo hào',en:'clickbait marketing account',cat:'media'}],
quickReactions:[{cn:'瓜来了！',en:'The tea is here!'},{cn:'坐等反转',en:'Waiting for the twist'},{cn:'继续上菜',en:'Keep the receipts coming'},{cn:'求锤',en:'Where\'s the proof?'},{cn:'这波是营销号带的',en:'Marketing accounts steered this'},{cn:'先不表态，等实锤',en:'No stance, wait for receipts'},{cn:'楼主保命',en:'OP stay safe'},{cn:'冷静点',en:'Calm down'}],
formats:['吃瓜时间线 / 事件复盘 — Timeline / Recap','十问 X 事件 — Ten questions about X','一图读懂 — One-picture summary','全网最全 / 合集 / 盘点 — Most complete compilation','年度大瓜 / 每周瓜汇总 — Annual / Weekly roundup']
};
TOPIC_WIDGET_DATA.makeup={
terms:[
// archetype
{cn:'成分党',py:'chéngfèn dǎng',en:'ingredient nerd',cat:'archetype'},
{cn:'博主',py:'bó zhǔ',en:'blogger/influencer',cat:'archetype'},
{cn:'种草达人',py:'zhòngcǎo dárén',en:'recommendation guru',cat:'archetype'},
{cn:'素颜',py:'sù yán',en:'barefaced / no makeup',cat:'archetype'},
// shopping & commerce
{cn:'平替',py:'píng tì',en:'affordable dupe/alternative',cat:'shopping'},
{cn:'爆款',py:'bào kuǎn',en:'bestseller / viral hit',cat:'shopping'},
{cn:'代购',py:'dài gòu',en:'proxy buyer',cat:'shopping'},
{cn:'海淘',py:'hǎi táo',en:'overseas online shopping',cat:'shopping'},
{cn:'回购',py:'huí gòu',en:'repurchase',cat:'shopping'},
{cn:'新品',py:'xīn pǐn',en:'new launch',cat:'shopping'},
{cn:'大牌',py:'dà pái',en:'luxury/big brand',cat:'shopping'},
{cn:'国货',py:'guó huò',en:'domestic (Chinese) brand',cat:'shopping'},
// review
{cn:'种草',py:'zhòng cǎo',en:'plant grass — recommend',cat:'review'},
{cn:'拔草',py:'bá cǎo',en:'pull grass — un-recommend',cat:'review'},
{cn:'踩雷',py:'cǎi léi',en:'stepped on a mine — bad buy',cat:'review'},
{cn:'试色',py:'shì sè',en:'swatch / color test',cat:'review'},
{cn:'测评',py:'cè píng',en:'product review',cat:'review'},
{cn:'亲测',py:'qīn cè',en:'personally tested',cat:'review'},
// format
{cn:'空瓶记',py:'kōng píng jì',en:'empties review',cat:'format'},
{cn:'横评',py:'héng píng',en:'multi-brand comparison',cat:'format'},
{cn:'开箱',py:'kāi xiāng',en:'unboxing',cat:'format'},
{cn:'教程',py:'jiào chéng',en:'tutorial',cat:'format'},
{cn:'仿妆',py:'fǎng zhuāng',en:'copy-look / makeup imitation',cat:'format'},
// skin type
{cn:'敏感肌',py:'mǐngǎn jī',en:'sensitive skin',cat:'skin'},
{cn:'油皮',py:'yóu pí',en:'oily skin',cat:'skin'},
{cn:'干皮',py:'gān pí',en:'dry skin',cat:'skin'},
{cn:'混油皮',py:'hùn yóu pí',en:'combination-oily skin',cat:'skin'},
{cn:'痘痘肌',py:'dòudou jī',en:'acne-prone skin',cat:'skin'},
{cn:'黄皮',py:'huáng pí',en:'warm/yellow undertone',cat:'skin'},
{cn:'白皮',py:'bái pí',en:'fair skin',cat:'skin'},
{cn:'冷白皮',py:'lěng bái pí',en:'cool-fair undertone',cat:'skin'},
// product — face / skincare
{cn:'防晒',py:'fáng shài',en:'sunscreen / UV protection',cat:'product'},
{cn:'精华',py:'jīnghuá',en:'serum / essence',cat:'product'},
{cn:'面霜',py:'miàn shuāng',en:'face cream',cat:'product'},
{cn:'乳液',py:'rǔ yè',en:'lotion / emulsion',cat:'product'},
{cn:'洁面',py:'jié miàn',en:'cleanser',cat:'product'},
{cn:'卸妆',py:'xiè zhuāng',en:'makeup remover',cat:'product'},
{cn:'化妆水',py:'huàzhuāng shuǐ',en:'toner',cat:'product'},
{cn:'面膜',py:'miàn mó',en:'face mask',cat:'product'},
{cn:'眼霜',py:'yǎn shuāng',en:'eye cream',cat:'product'},
// product — makeup
{cn:'底妆',py:'dǐ zhuāng',en:'base makeup / foundation',cat:'product'},
{cn:'粉底液',py:'fěndǐ yè',en:'liquid foundation',cat:'product'},
{cn:'遮瑕',py:'zhē xiá',en:'concealer / concealing',cat:'product'},
{cn:'散粉',py:'sǎn fěn',en:'setting powder',cat:'product'},
{cn:'定妆喷雾',py:'dìngzhuāng pēnwù',en:'setting spray',cat:'product'},
{cn:'口红',py:'kǒu hóng',en:'lipstick',cat:'product'},
{cn:'唇釉',py:'chún yòu',en:'liquid lipstick / lip glaze',cat:'product'},
{cn:'腮红',py:'sāi hóng',en:'blush',cat:'product'},
{cn:'眼影',py:'yǎn yǐng',en:'eyeshadow',cat:'product'},
{cn:'眼线',py:'yǎn xiàn',en:'eyeliner',cat:'product'},
{cn:'睫毛膏',py:'jiémáo gāo',en:'mascara',cat:'product'},
{cn:'眉笔',py:'méi bǐ',en:'brow pencil',cat:'product'},
{cn:'修容',py:'xiū róng',en:'contour',cat:'product'},
{cn:'高光',py:'gāo guāng',en:'highlighter',cat:'product'},
// ingredient
{cn:'A醇',py:'A chún',en:'retinol',cat:'ingredient'},
{cn:'烟酰胺',py:'yān xiān àn',en:'niacinamide',cat:'ingredient'},
{cn:'玻尿酸',py:'bō niào suān',en:'hyaluronic acid',cat:'ingredient'},
{cn:'水杨酸',py:'shuǐyáng suān',en:'salicylic acid (BHA)',cat:'ingredient'},
{cn:'果酸',py:'guǒ suān',en:'AHA / fruit acid',cat:'ingredient'},
{cn:'神经酰胺',py:'shénjīng xiān àn',en:'ceramide',cat:'ingredient'},
{cn:'维C',py:'wéi C',en:'vitamin C',cat:'ingredient'},
{cn:'熊果苷',py:'xióngguǒ gān',en:'arbutin (brightener)',cat:'ingredient'},
{cn:'胜肽',py:'shèng tài',en:'peptide',cat:'ingredient'},
// effect
{cn:'保湿',py:'bǎo shī',en:'moisturizing',cat:'effect'},
{cn:'补水',py:'bǔ shuǐ',en:'hydrating',cat:'effect'},
{cn:'美白',py:'měi bái',en:'whitening / brightening',cat:'effect'},
{cn:'抗老',py:'kàng lǎo',en:'anti-aging',cat:'effect'},
{cn:'控油',py:'kòng yóu',en:'oil control',cat:'effect'},
{cn:'提亮',py:'tí liàng',en:'brighten tone',cat:'effect'},
{cn:'修护',py:'xiū hù',en:'repair / recover',cat:'effect'},
{cn:'持妆',py:'chí zhuāng',en:'long-lasting wear',cat:'effect'}
],
routineSteps:['洁面 Cleanser','化妆水 Toner','精华 Serum','乳液 Lotion','面霜 Cream','防晒 Sunscreen'],
searches:['防晒 横评 2025 最新','敏感肌 修护 空瓶 盘点','平替 粉底 黄皮 试色','踩雷 清单 美妆','A醇 梯度 使用 指南','油皮 底妆 持妆 测试'],
skinQuiz:[{q:'After washing, how does skin feel in 30 min?',opts:[{t:'Tight and dry',s:'dry'},{t:'Oily T-zone only',s:'combo'},{t:'Shiny everywhere',s:'oily'},{t:'Comfortable',s:'normal'}]},{q:'How does skin react to new products?',opts:[{t:'Often red/irritated',s:'sensitive'},{t:'Usually fine',s:'normal'},{t:'Rarely notice',s:'oily'}]}],
youtubeChannels:[
// videoId = the currently-featured video to embed for this creator. IDs rot when videos go private;
// replace by grabbing the share link from any video on the creator's channel.
{id:'luffy0823',label:'Luffy',name:'Luffy 0823',handle:'@luffy0823',url:'https://www.youtube.com/@luffy0823',videosUrl:'https://www.youtube.com/@luffy0823/videos',videoId:'',focus:'Soft glam, GRWM, and wearable beauty looks.'},
{id:'cindyhhh32',label:'Cindy H',name:'Cindy H',handle:'@cindyhhh32',url:'https://www.youtube.com/@cindyhhh32',videosUrl:'https://www.youtube.com/@cindyhhh32/videos',videoId:'',focus:'Beginner-friendly tutorials and practical makeup teaching.'},
{id:'qiuqiouqiu',label:'QiuQiuQiu',name:'QiuQiuQiu',handle:'@QiuQiuQiu',url:'https://www.youtube.com/@QiuQiuQiu',videosUrl:'https://www.youtube.com/@QiuQiuQiu/videos',videoId:'',focus:'Chinese beauty trends, looks, and product-driven content.'},
{id:'itspeachi',label:'Peachi',name:'itsPeachi',handle:'@itsPeachi',url:'https://www.youtube.com/@itsPeachi',videosUrl:'https://www.youtube.com/@itsPeachi/videos',videoId:'',focus:'Cute aesthetic looks, lifestyle-beauty crossover, and easy inspo.'},
{id:'rrei_ier',label:'rrei_ier',name:'rrei_ier',handle:'@rrei_ier',url:'https://www.youtube.com/@rrei_ier',videosUrl:'https://www.youtube.com/@rrei_ier/videos',videoId:'',focus:'Look breakdowns and trend-first makeup content.'},
{id:'itsjcnana',label:'Jcnana',name:'ItsJcnana',handle:'@ItsJcnana',url:'https://www.youtube.com/@ItsJcnana',videosUrl:'https://www.youtube.com/@ItsJcnana/videos',videoId:'',focus:'Beauty videos with creator personality, routines, and product testing.'}
]
};
TOPIC_WIDGET_DATA.food={
hotpot:{broths:[{n:'红锅 Spicy',p:38},{n:'清汤 Clear',p:28},{n:'鸳鸯 Half/Half',p:48},{n:'菌汤 Mushroom',p:38},{n:'番茄 Tomato',p:35}],meats:[{n:'肥牛 Fatty Beef',p:38},{n:'肥羊 Lamb',p:36},{n:'毛肚 Tripe',p:32},{n:'黄喉 Aorta',p:28},{n:'鸭肠 Duck Int.',p:26},{n:'午餐肉 Spam',p:18}],vegs:[{n:'藕片 Lotus Root',p:12},{n:'土豆 Potato',p:10},{n:'金针菇 Enoki',p:12},{n:'豆皮 Tofu Skin',p:10},{n:'冻豆腐 Frozen Tofu',p:10},{n:'蔬菜拼盘 Veg Platter',p:22}],staples:[{n:'宽粉 Wide Noodles',p:12},{n:'方便面 Instant',p:8},{n:'米饭 Rice',p:3}],extras:[{n:'油碟 Oil Dip',p:5},{n:'芝麻酱 Sesame',p:6},{n:'冰粉 Jelly',p:8},{n:'酸梅汤 Plum Drink',p:8}]},
cuisines:[{name:'川菜 Sichuan',icon:'🌶️',flavor:'麻辣 Numbing-spicy',dishes:'水煮牛肉, 宫保鸡丁, 回锅肉, 鱼香肉丝'},{name:'粤菜 Cantonese',icon:'🦐',flavor:'清鲜 Light-fresh',dishes:'虾饺, 白切鸡, 清蒸鱼, 叉烧'},{name:'湘菜 Hunan',icon:'🔥',flavor:'香辣 Fragrant-spicy',dishes:'剁椒鱼头, 小炒肉, 辣子鸡'},{name:'东北 Northeast',icon:'🥟',flavor:'咸鲜 Salty-savory',dishes:'锅包肉, 地三鲜, 酸菜白肉'},{name:'西北 Northwest',icon:'🐑',flavor:'清真 Halal',dishes:'兰州拉面, 羊肉泡馍, 烤串'},{name:'淮扬 Jiangsu',icon:'🍖',flavor:'甜鲜 Sweet-fresh',dishes:'红烧肉, 松鼠桂鱼, 东坡肉'}],
spiceLevels:[{cn:'不要辣',py:'bú yào là',en:'No spice',emoji:'😊',bg:'#1a2a1a'},{cn:'微辣',py:'wēi là',en:'Mild',emoji:'😅',bg:'#2a2a1a'},{cn:'中辣',py:'zhōng là',en:'Medium',emoji:'🥵',bg:'#2a1a1a'},{cn:'特辣',py:'tè là',en:'DEATH',emoji:'💀',bg:'#3a0a0a'}],
orderPhrases:[{cn:'有什么推荐？',py:'yǒu shénme tuījiàn?',en:'What do you recommend?'},{cn:'少辣，可以吗？',py:'shǎo là, kěyǐ ma?',en:'Less spicy, OK?'},{cn:'可以打包吗？',py:'kěyǐ dǎbāo ma?',en:'Can we box leftovers?'},{cn:'买单',py:'mǎi dān',en:'Bill please'},{cn:'扫码点餐',py:'sǎomǎ diǎncān',en:'Scan QR to order'},{cn:'米饭要三碗',py:'mǐfàn yào sān wǎn',en:'Three bowls of rice'},{cn:'服务员',py:'fúwùyuán',en:'Waiter! (call over)'},{cn:'加点水',py:'jiā diǎn shuǐ',en:'More water please'},{cn:'这个是什么？',py:'zhège shì shénme?',en:'What is this?'}],
cookingVerbs:[{cn:'炒',py:'chǎo',en:'stir-fry'},{cn:'煎',py:'jiān',en:'pan-fry'},{cn:'炸',py:'zhá',en:'deep-fry'},{cn:'蒸',py:'zhēng',en:'steam'},{cn:'煮',py:'zhǔ',en:'boil'},{cn:'焖',py:'mèn',en:'braise'},{cn:'烤',py:'kǎo',en:'roast/bake'},{cn:'凉拌',py:'liángbàn',en:'cold-mixed'},{cn:'红烧',py:'hóngshāo',en:'red-braised'},{cn:'水煮',py:'shuǐzhǔ',en:'water-boiled (Sichuan)'}],
flavorWords:[{cn:'麻',py:'má',en:'numbing'},{cn:'辣',py:'là',en:'spicy'},{cn:'酸',py:'suān',en:'sour'},{cn:'甜',py:'tián',en:'sweet'},{cn:'咸',py:'xián',en:'salty'},{cn:'鲜',py:'xiān',en:'umami/fresh'},{cn:'香',py:'xiāng',en:'fragrant'},{cn:'苦',py:'kǔ',en:'bitter'}],
youtubeChannels:[
{id:'xiaoyingfood',label:'XiaoYing',name:'XiaoYing Food',handle:'@XiaoYingFood',url:'https://www.youtube.com/@XiaoYingFood',videosUrl:'https://www.youtube.com/@XiaoYingFood/videos',videoId:'',focus:'Chinese home-style dishes, practical recipes, and ingredient vocabulary.'},
{id:'chefwang',label:'Chef Wang',name:'Chef Wang',handle:'@chefwang',url:'https://www.youtube.com/@chefwang',videosUrl:'https://www.youtube.com/@chefwang/videos',videoId:'',focus:'Professional Chinese cooking technique, wok skills, and restaurant-style dishes.'}
]
};
TOPIC_WIDGET_DATA.dropship={
terms:[{cn:'一件代发',py:'yí jiàn dàifā',en:'dropshipping (per-order)',cat:'model'},{cn:'跨境电商',py:'kuàjìng diànshāng',en:'cross-border e-commerce',cat:'model'},{cn:'独立站',py:'dúlì zhàn',en:'standalone store (Shopify etc.)',cat:'model'},{cn:'选品',py:'xuǎn pǐn',en:'product selection',cat:'ops'},{cn:'爆品',py:'bào pǐn',en:'winning/viral product',cat:'ops'},{cn:'起订量',py:'qǐ dìng liàng',en:'MOQ',cat:'sourcing'},{cn:'打样',py:'dǎ yàng',en:'make a sample',cat:'sourcing'},{cn:'源头工厂',py:'yuántóu gōngchǎng',en:'source factory',cat:'sourcing'},{cn:'中性包装',py:'zhōngxìng bāozhuāng',en:'neutral/no-logo packaging',cat:'logistics'},{cn:'海外仓',py:'hǎiwài cāng',en:'overseas warehouse',cat:'logistics'},{cn:'清关',py:'qīng guān',en:'customs clearance',cat:'logistics'},{cn:'侵权',py:'qīn quán',en:'IP infringement',cat:'risk'},{cn:'平替',py:'píng tì',en:'dupe (legal alternative)',cat:'product'},{cn:'高仿',py:'gāo fǎng',en:'high-grade counterfeit ⚠️',cat:'risk'},{cn:'质检',py:'zhì jiǎn',en:'quality control/inspection',cat:'ops'}],
supplierPhrases:['支持一件代发吗？','能发无logo中性包装吗？','起订量多少？','打样要多久？时效大概多久？','有海外仓吗？','能提供质检视频吗？','这个是正品吗？有授权吗？','我们只做平替，不做高仿。'],
riskItems:[{q:'Uses a brand name/logo?',risk:'HIGH',note:'Trademark infringement'},{q:'Copies exact design/shape?',risk:'MED',note:'Design patent risk'},{q:'Called \"1:1\" or \"高仿\"?',risk:'HIGH',note:'Counterfeit — illegal'},{q:'Generic/unbranded style?',risk:'LOW',note:'Usually safe as 平替'},{q:'Has certification (CE/ROHS)?',risk:'CHECK',note:'Required for many categories'},{q:'Supplier provides 授权?',risk:'SAFE',note:'Authorized distribution'}]
};
var topicFcStates={},topicQuizStates={},topicHpOrder={};
var TOPIC_MAKEUP_YOUTUBE_STORAGE_KEY='hanzi-dash:topic-makeup-youtube-channel';
var activeTopicMakeupYoutubeChannelId=topicLoadMakeupYoutubeChannel();
var TOPIC_FOOD_YOUTUBE_STORAGE_KEY='hanzi-dash:topic-food-youtube-channel';
var activeTopicFoodYoutubeChannelId=topicLoadFoodYoutubeChannel();
var topicFoundWords=topicLoadFoundWords();
function topicHashColor(s){var h=0;for(var i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h);var colors=['#00ff88','#e63946','#a78bfa','#38bdf8','#fbbf24','#f472b6','#f0a040','#22d3ee','#34d399','#f87171'];return colors[Math.abs(h)%colors.length];}
function topicWidgetOpen(icon,title,tag,tagColor,extraClass){var tc=tagColor||'var(--tab-accent)';return '<div class=\"widget '+(extraClass||'')+'\"><div class=\"widget-header\"><div class=\"widget-title\"><div class=\"icon\" style=\"background:'+tc+'18;color:'+tc+'\">'+icon+'</div>'+title+'</div>'+(tag?'<span class=\"tag\" style=\"background:'+tc+'18;color:'+tc+'\">'+tag+'</span>':'')+'</div>';}
function topicWidgetClose(){return '</div>';}
// Legacy localStorage bucket — kept only for one-time migration into savedWords.
function topicLoadFoundWords(){try{return JSON.parse(localStorage.getItem('topic-found-words')||'{}');}catch(_e){return {};}}
function topicSaveFoundWords(){try{localStorage.setItem('topic-found-words',JSON.stringify(topicFoundWords));}catch(_e){}}
// Read the canonical store — savedWords managed by dashboard.ts, persisted via /api/words.
function topicGetSavedBrowsingWords(tabId){
  if(!Array.isArray(window.savedWords))return [];
  return window.savedWords.filter(function(w){return w&&w.source==='browsing'&&w.sourceArticle===tabId;});
}
function topicMigrateFoundWordsToSavedWords(){
  try{
    var raw=localStorage.getItem('topic-found-words');
    if(!raw)return;
    var bucket=JSON.parse(raw||'{}');
    if(!bucket||typeof bucket!=='object')return;
    if(typeof window.addWord!=='function'||!Array.isArray(window.savedWords))return;
    var migrated=0;
    Object.keys(bucket).forEach(function(tabId){
      var items=Array.isArray(bucket[tabId])?bucket[tabId]:[];
      items.forEach(function(item){
        if(!item||!item.word)return;
        if(typeof window.isWordSaved==='function'&&window.isWordSaved(item.word))return;
        window.addWord({cn:item.word,py:'',en:'',note:item.note||'',source:'browsing',sourceArticle:tabId});
        migrated++;
      });
    });
    if(migrated>0&&typeof window.renderWordlistContent==='function')window.renderWordlistContent();
    // One-shot migration — rename key so we don't re-import on reload.
    localStorage.setItem('topic-found-words.migrated',raw);
    localStorage.removeItem('topic-found-words');
  }catch(_e){}
}
function topicLoadMakeupYoutubeChannel(){var channels=TOPIC_WIDGET_DATA.makeup.youtubeChannels||[];try{var savedId=localStorage.getItem(TOPIC_MAKEUP_YOUTUBE_STORAGE_KEY),match=channels.find(function(channel){return channel.id===savedId;});return match?match.id:(channels[0]?channels[0].id:'');}catch(_e){return channels[0]?channels[0].id:'';}}
function topicSaveMakeupYoutubeChannel(channelId){try{localStorage.setItem(TOPIC_MAKEUP_YOUTUBE_STORAGE_KEY,channelId);}catch(_e){}}
function topicGetActiveMakeupYoutubeChannel(){var channels=TOPIC_WIDGET_DATA.makeup.youtubeChannels||[];return channels.find(function(channel){return channel.id===activeTopicMakeupYoutubeChannelId;})||channels[0]||null;}
function topicSetMakeupYoutubeChannel(channelId){activeTopicMakeupYoutubeChannelId=channelId;topicSaveMakeupYoutubeChannel(channelId);topicRenderMakeupYoutubeWidget();}
function topicLoadFoodYoutubeChannel(){var channels=TOPIC_WIDGET_DATA.food.youtubeChannels||[];try{var savedId=localStorage.getItem(TOPIC_FOOD_YOUTUBE_STORAGE_KEY),match=channels.find(function(channel){return channel.id===savedId;});return match?match.id:(channels[0]?channels[0].id:'');}catch(_e){return channels[0]?channels[0].id:'';}}
function topicSaveFoodYoutubeChannel(channelId){try{localStorage.setItem(TOPIC_FOOD_YOUTUBE_STORAGE_KEY,channelId);}catch(_e){}}
function topicGetActiveFoodYoutubeChannel(){var channels=TOPIC_WIDGET_DATA.food.youtubeChannels||[];return channels.find(function(channel){return channel.id===activeTopicFoodYoutubeChannelId;})||channels[0]||null;}
function topicSetFoodYoutubeChannel(channelId){activeTopicFoodYoutubeChannelId=channelId;topicSaveFoodYoutubeChannel(channelId);topicRenderFoodYoutubeWidget();}
// ===== Creator video feed (Flavor A — one iframe, swap src on chip click) =====
var TOPIC_FEED_VIDEO_STORAGE_KEY='zhongwen-dash:topic-feed-videos';
function topicLoadFeedVideoMap(){try{return JSON.parse(localStorage.getItem(TOPIC_FEED_VIDEO_STORAGE_KEY)||'{}');}catch(_e){return {};}}
function topicSaveFeedVideoMap(map){try{localStorage.setItem(TOPIC_FEED_VIDEO_STORAGE_KEY,JSON.stringify(map||{}));}catch(_e){}}
function topicGetChannelVideoId(feedKey,channelId,fallback){var map=topicLoadFeedVideoMap();return (map[feedKey]&&map[feedKey][channelId])||fallback||'';}
function topicSetChannelVideoId(feedKey,channelId,videoId){var map=topicLoadFeedVideoMap();if(!map[feedKey])map[feedKey]={};map[feedKey][channelId]=videoId||'';topicSaveFeedVideoMap(map);}
function topicExtractYouTubeId(input){
  if(!input)return '';
  input=String(input).trim();
  if(/^[A-Za-z0-9_-]{11}$/.test(input))return input;
  var m=input.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?m[1]:'';
}
function topicFeedEmbedUrl(videoId){
  return 'https://www.youtube.com/embed/'+videoId+'?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1';
}
function topicFeedEscape(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

function topicRenderCreatorFeed(feedKey,mountId,channels,getActiveId,setActiveId,badge){
  var mount=document.getElementById(mountId);
  if(!mount||!channels||!channels.length)return;
  var activeId=getActiveId();
  var active=channels.find(function(c){return c.id===activeId;})||channels[0];
  if(!active)return;

  if(!mount.dataset.feedInited){
    mount.dataset.feedInited='1';
    mount.innerHTML=
      '<div class="creator-feed">'+
        '<header class="creator-feed-top">'+
          '<div class="creator-feed-meta">'+
            '<span class="creator-feed-kicker"></span>'+
            '<strong class="creator-feed-name"></strong>'+
            '<span class="creator-feed-handle"></span>'+
          '</div>'+
          '<div class="creator-feed-actions">'+
            '<a class="creator-feed-open btn-secondary btn-small" target="_blank" rel="noopener noreferrer">Open Channel</a>'+
            '<button class="creator-feed-setvid btn-secondary btn-small" type="button" title="Paste a video URL or 11-char ID">🎬 Set Video</button>'+
          '</div>'+
        '</header>'+
        '<div class="creator-feed-player">'+
          '<iframe class="creator-feed-frame" allow="autoplay; encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'+
          '<div class="creator-feed-empty" hidden>'+
            '<div style="font-size:2rem;margin-bottom:6px;">🎬</div>'+
            '<div style="font-size:0.9rem;font-weight:700;margin-bottom:4px;">No video set for this creator yet</div>'+
            '<div class="creator-feed-empty-sub">Click <strong>🎬 Set Video</strong> above and paste any video URL from their channel — it saves to your browser.</div>'+
          '</div>'+
        '</div>'+
        '<div class="creator-feed-focus"></div>'+
        '<nav class="creator-feed-chips"></nav>'+
      '</div>';
    var chipsEl=mount.querySelector('.creator-feed-chips');
    chipsEl.addEventListener('click',function(e){
      var btn=e.target.closest('[data-feed-id]');
      if(!btn)return;
      setActiveId(btn.getAttribute('data-feed-id'));
    });
    var setBtn=mount.querySelector('.creator-feed-setvid');
    setBtn.addEventListener('click',function(){
      var currentActive=channels.find(function(c){return c.id===getActiveId();})||channels[0];
      var current=topicGetChannelVideoId(feedKey,currentActive.id,currentActive.videoId);
      var input=window.prompt('Paste a YouTube video URL or 11-character ID for '+(currentActive.name||currentActive.label||'this creator')+' (leave blank to clear):',current||'');
      if(input===null)return;
      var trimmed=input.trim();
      if(trimmed===''){
        topicSetChannelVideoId(feedKey,currentActive.id,'');
      }else{
        var id=topicExtractYouTubeId(trimmed);
        if(!id){alert('Could not find a YouTube video ID in that input.');return;}
        topicSetChannelVideoId(feedKey,currentActive.id,id);
      }
      topicRenderCreatorFeed(feedKey,mountId,channels,getActiveId,setActiveId,badge);
    });
  }

  var kickerEl=mount.querySelector('.creator-feed-kicker');
  var nameEl=mount.querySelector('.creator-feed-name');
  var handleEl=mount.querySelector('.creator-feed-handle');
  var openEl=mount.querySelector('.creator-feed-open');
  var focusEl=mount.querySelector('.creator-feed-focus');
  var chipsEl=mount.querySelector('.creator-feed-chips');
  var iframe=mount.querySelector('.creator-feed-frame');
  var emptyEl=mount.querySelector('.creator-feed-empty');

  if(kickerEl)kickerEl.textContent=badge||'CREATOR FEED';
  if(nameEl)nameEl.textContent=active.name||'';
  if(handleEl)handleEl.textContent=active.handle||'';
  if(openEl)openEl.href=active.videosUrl||active.url||'#';
  if(focusEl)focusEl.textContent=active.focus||'';

  if(chipsEl){
    chipsEl.innerHTML=channels.map(function(c){
      var hasVideo=!!topicGetChannelVideoId(feedKey,c.id,c.videoId);
      var cls='creator-feed-chip'+(c.id===active.id?' active':'')+(hasVideo?' has-video':'');
      var title=c.name||c.label||'';
      if(!hasVideo)title+=' · no video set';
      return '<button type="button" class="'+cls+'" data-feed-id="'+topicFeedEscape(c.id)+'" title="'+topicFeedEscape(title)+'">'+topicFeedEscape(c.label||c.name||'')+'</button>';
    }).join('');
  }

  var videoId=topicGetChannelVideoId(feedKey,active.id,active.videoId);
  if(videoId&&iframe){
    if(emptyEl)emptyEl.setAttribute('hidden','');
    iframe.style.display='';
    var targetSrc=topicFeedEmbedUrl(videoId);
    if(iframe.src!==targetSrc)iframe.src=targetSrc;
    iframe.title=(active.name||'YouTube')+' video';
  }else{
    if(emptyEl)emptyEl.removeAttribute('hidden');
    if(iframe){iframe.style.display='none';if(iframe.src&&iframe.src!=='about:blank')iframe.src='about:blank';}
  }
}

function topicRenderMakeupYoutubeWidget(){
  topicRenderCreatorFeed(
    'makeup','topic-makeupYoutubeWidget',
    TOPIC_WIDGET_DATA.makeup.youtubeChannels||[],
    function(){return activeTopicMakeupYoutubeChannelId;},
    function(id){topicSetMakeupYoutubeChannel(id);},
    'BEAUTY CREATOR FEED'
  );
}
function topicRenderFoodYoutubeWidget(){
  topicRenderCreatorFeed(
    'food','topic-foodYoutubeWidget',
    TOPIC_WIDGET_DATA.food.youtubeChannels||[],
    function(){return activeTopicFoodYoutubeChannelId;},
    function(id){topicSetFoodYoutubeChannel(id);},
    'FOOD CREATOR FEED'
  );
}

// ===== Latest Videos grid (server-scraped via YouTube RSS) =====
var TOPIC_LATEST_FEED_CHANNEL_KEY='zhongwen-dash:yt-feed-channels';
function topicLoadLatestFeedMap(){try{return JSON.parse(localStorage.getItem(TOPIC_LATEST_FEED_CHANNEL_KEY)||'{}');}catch(_e){return {};}}
function topicSaveLatestFeedMap(m){try{localStorage.setItem(TOPIC_LATEST_FEED_CHANNEL_KEY,JSON.stringify(m||{}));}catch(_e){}}
function topicGetCreatorChannelId(feedKey,creatorId){var m=topicLoadLatestFeedMap();return (m[feedKey]&&m[feedKey][creatorId])||'';}
function topicSetCreatorChannelId(feedKey,creatorId,channelId){var m=topicLoadLatestFeedMap();if(!m[feedKey])m[feedKey]={};m[feedKey][creatorId]=channelId||'';topicSaveLatestFeedMap(m);}

function topicResolveCreatorChannelIds(feedKey,creators,done){
  var toResolve=creators.filter(function(c){return c.handle&&!topicGetCreatorChannelId(feedKey,c.id);});
  if(!toResolve.length){done&&done(false);return;}
  var remaining=toResolve.length;var changed=false;
  toResolve.forEach(function(c){
    var handle=String(c.handle||'').replace(/^@/,'');
    fetch('/api/yt-feed/resolve?handle='+encodeURIComponent(handle))
      .then(function(r){return r.json();})
      .then(function(data){
        if(data&&data.ok&&data.channelId){
          topicSetCreatorChannelId(feedKey,c.id,data.channelId);
          changed=true;
        }
      })
      .catch(function(){})
      .then(function(){
        remaining--;
        if(remaining<=0)done&&done(changed);
      });
  });
}

function topicLatestFeedFormatDate(iso){
  if(!iso)return '';
  var d=new Date(iso);
  if(isNaN(d.getTime()))return '';
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}

function topicRenderLatestFeedContent(mount,data,creators,feedKey){
  var activeFilter=mount.dataset.latestFilter||'all';
  var metaEl=mount.querySelector('.yt-latest-meta');
  var noteEl=mount.querySelector('.yt-latest-note');
  var chipsEl=mount.querySelector('.yt-latest-chips');
  var gridEl=mount.querySelector('.yt-latest-grid');

  if(metaEl){
    var when=data.updatedAt?new Date(data.updatedAt).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    metaEl.textContent=(data.total||0)+' video'+((data.total===1)?'':'s')+(when?' · '+when:'')+(data.cached?' · cached':'');
  }
  if(noteEl){
    if(data.stale&&data.message){noteEl.textContent='⚠ '+data.message;noteEl.style.display='';}
    else if(data.message&&!data.cached){noteEl.textContent=data.message;noteEl.style.display='';}
    else{noteEl.textContent='';noteEl.style.display='none';}
  }

  var creatorByChannelId={};
  creators.forEach(function(c){var cid=topicGetCreatorChannelId(feedKey,c.id);if(cid)creatorByChannelId[cid]=c;});

  var chips=[{id:'all',label:'All',count:data.total}];
  (data.channels||[]).forEach(function(ch){
    var creator=creatorByChannelId[ch.id];
    chips.push({id:ch.id,label:creator?(creator.label||creator.name||ch.name||ch.id):(ch.name||ch.id),count:ch.count});
  });
  if(chipsEl){
    chipsEl.innerHTML=chips.map(function(c){
      return '<button type="button" class="yt-latest-chip'+(c.id===activeFilter?' active':'')+'" data-latest-filter="'+topicFeedEscape(c.id)+'">'+topicFeedEscape(c.label)+' <span class="count">'+(c.count||0)+'</span></button>';
    }).join('');
  }

  var items=activeFilter==='all'?data.items:(data.items||[]).filter(function(it){return it.channelId===activeFilter;});
  if(!gridEl)return;
  if(!items.length){
    gridEl.innerHTML='<div class="yt-latest-msg">No videos to show. Try Refresh.</div>';
    return;
  }
  gridEl.innerHTML=items.map(function(it){
    var creator=creatorByChannelId[it.channelId];
    var chName=creator?(creator.label||creator.name||it.channelName||''):(it.channelName||'');
    var when=topicLatestFeedFormatDate(it.publishedAt);
    return '<article class="yt-latest-card">'+
      '<a class="yt-latest-thumb-link" href="'+topicFeedEscape(it.url||'#')+'" target="_blank" rel="noopener noreferrer">'+
        '<img class="yt-latest-thumb" src="'+topicFeedEscape(it.thumbnailUrl||'')+'" loading="lazy" alt="'+topicFeedEscape(it.title||'')+'">'+
      '</a>'+
      '<div class="yt-latest-card-body">'+
        '<div class="yt-latest-card-meta"><span class="yt-latest-card-channel">'+topicFeedEscape(chName)+'</span>'+(when?'<span class="yt-latest-card-date">'+topicFeedEscape(when)+'</span>':'')+'</div>'+
        '<a class="yt-latest-card-title" href="'+topicFeedEscape(it.url||'#')+'" target="_blank" rel="noopener noreferrer">'+topicFeedEscape(it.title||'')+'</a>'+
      '</div>'+
      '</article>';
  }).join('');
}

function topicLoadLatestFeed(feedKey,mountId,creators,opts){
  opts=opts||{};
  var mount=document.getElementById(mountId);
  if(!mount)return;
  var gridEl=mount.querySelector('.yt-latest-grid');
  var metaEl=mount.querySelector('.yt-latest-meta');
  if(gridEl&&!mount._latestData)gridEl.innerHTML='<div class="yt-latest-msg"><span class="spinner"></span> Loading…</div>';

  topicResolveCreatorChannelIds(feedKey,creators,function(){
    var ids=creators.map(function(c){return topicGetCreatorChannelId(feedKey,c.id);}).filter(Boolean);
    if(!ids.length){
      if(metaEl)metaEl.textContent='';
      if(gridEl)gridEl.innerHTML='<div class="yt-latest-msg">Could not resolve any creator handles to channel IDs. Check the handles or your network, then Refresh.</div>';
      return;
    }
    var url='/api/yt-feed?ids='+encodeURIComponent(ids.join(','))+(opts.refresh?'&refresh=1':'');
    fetch(url).then(function(r){return r.json();}).then(function(data){
      if(!data||!data.ok){
        if(gridEl)gridEl.innerHTML='<div class="yt-latest-msg">Could not load feed ('+((data&&data.message)||'unknown error')+').</div>';
        return;
      }
      mount._latestData=data;
      mount._latestCreators=creators;
      mount._latestFeedKey=feedKey;
      topicRenderLatestFeedContent(mount,data,creators,feedKey);
    }).catch(function(err){
      if(gridEl)gridEl.innerHTML='<div class="yt-latest-msg">Network error: '+topicFeedEscape(String(err&&err.message||err))+'.</div>';
    });
  });
}

function topicRenderLatestFeed(feedKey,mountId,creators,badge){
  var mount=document.getElementById(mountId);
  if(!mount)return;
  if(!mount.dataset.latestInited){
    mount.dataset.latestInited='1';
    mount.dataset.latestFilter='all';
    mount.innerHTML=
      '<div class="yt-latest">'+
        '<header class="yt-latest-top">'+
          '<div>'+
            '<div class="yt-latest-kicker">'+(badge||'LATEST VIDEOS')+'</div>'+
            '<div class="yt-latest-meta">—</div>'+
            '<div class="yt-latest-note" style="display:none;"></div>'+
          '</div>'+
          '<div class="yt-latest-actions">'+
            '<button type="button" class="btn-secondary btn-small" data-latest-action="clear" title="Wipe scrape cache">🗑</button>'+
            '<button type="button" class="btn-secondary btn-small" data-latest-action="refresh" title="Re-fetch from YouTube RSS">↻ Refresh</button>'+
          '</div>'+
        '</header>'+
        '<nav class="yt-latest-chips"></nav>'+
        '<div class="yt-latest-grid"></div>'+
      '</div>';
    mount.addEventListener('click',function(e){
      var chip=e.target.closest('[data-latest-filter]');
      if(chip){
        mount.dataset.latestFilter=chip.getAttribute('data-latest-filter');
        if(mount._latestData)topicRenderLatestFeedContent(mount,mount._latestData,mount._latestCreators||creators,mount._latestFeedKey||feedKey);
        return;
      }
      var action=e.target.closest('[data-latest-action]');
      if(!action)return;
      var kind=action.getAttribute('data-latest-action');
      if(kind==='refresh'){topicLoadLatestFeed(feedKey,mountId,creators,{refresh:true});return;}
      if(kind==='clear'){
        fetch('/api/yt-feed/cache',{method:'DELETE'}).then(function(r){return r.json();}).then(function(){
          mount._latestData=null;
          topicLoadLatestFeed(feedKey,mountId,creators,{refresh:true});
        }).catch(function(){});
      }
    });
  }
  topicLoadLatestFeed(feedKey,mountId,creators);
}

function topicRenderMakeupLatestFeed(){
  topicRenderLatestFeed('makeup','topic-makeupLatestFeed',TOPIC_WIDGET_DATA.makeup.youtubeChannels||[],'BEAUTY · LATEST VIDEOS');
}
function topicRenderFoodLatestFeed(){
  topicRenderLatestFeed('food','topic-foodLatestFeed',TOPIC_WIDGET_DATA.food.youtubeChannels||[],'FOOD · LATEST VIDEOS');
}
function topicBuildFlashcards(id,cards){topicFcStates[id]={idx:0,flipped:false,cards:cards};var c=cards[0];return '<div class=\"fc-area\" onclick=\"topicFlipFC(\''+id+'\')\"><div class=\"fc-inner\" id=\"topic-fci-'+id+'\"><div class=\"fc-face fc-front cn\" id=\"topic-fcf-'+id+'\">'+c.cn+'<div class=\"fc-sub\">'+(c.py||'')+'</div></div><div class=\"fc-face fc-back\" id=\"topic-fcb-'+id+'\">'+c.en+'</div></div></div><div class=\"fc-nav\"><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"event.stopPropagation();topicNavFC(\''+id+'\',-1)\">← Prev</button><span class=\"fc-counter\" id=\"topic-fcc-'+id+'\">1/'+cards.length+'</span><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"event.stopPropagation();topicNavFC(\''+id+'\',1)\">Next →</button></div>';}
function topicFlipFC(id){var s=topicFcStates[id],el=document.getElementById('topic-fci-'+id);if(!s||!el)return;s.flipped=!s.flipped;el.classList.toggle('flipped',s.flipped);}
function topicNavFC(id,dir){var s=topicFcStates[id];if(!s)return;s.idx=(s.idx+dir+s.cards.length)%s.cards.length;s.flipped=false;var c=s.cards[s.idx],inner=document.getElementById('topic-fci-'+id),front=document.getElementById('topic-fcf-'+id),back=document.getElementById('topic-fcb-'+id),count=document.getElementById('topic-fcc-'+id);if(inner)inner.classList.remove('flipped');if(front)front.innerHTML=c.cn+'<div class=\"fc-sub\">'+(c.py||'')+'</div>';if(back)back.textContent=c.en;if(count)count.textContent=(s.idx+1)+'/'+s.cards.length;}
// ===== Term list (shared by every topic-tab glossary) =====
// Per-list state so each glossary's filter + sort are independent.
var topicTermListState={};

function topicTermItemHtml(t){
  var cat=t.cat||'misc';
  var catCol=topicHashColor(cat);
  return '<div class=\"term-item\">'+
    '<div><div class=\"term-cn cn\">'+t.cn+'</div><div class=\"term-py\">'+(t.py||'')+'</div></div>'+
    '<div style=\"flex:1;min-width:0\"><div class=\"term-en\">'+t.en+'</div>'+
    '<span class=\"term-tag\" style=\"background:'+catCol+'18;color:'+catCol+'\">'+cat+'</span></div>'+
    '</div>';
}

function topicTermListRenderInner(listId){
  var s=topicTermListState[listId];
  if(!s)return '';
  var terms=s.terms.slice();
  if(s.cat&&s.cat!=='__all__'){
    terms=terms.filter(function(t){return (t.cat||'misc')===s.cat;});
  }
  if(s.sort==='cat'){
    terms.sort(function(a,b){
      var aa=(a.cat||'misc'),bb=(b.cat||'misc');
      if(aa!==bb)return aa.localeCompare(bb);
      return (a.cn||'').localeCompare(b.cn||'','zh-Hans-CN');
    });
  }else if(s.sort==='cn'){
    terms.sort(function(a,b){return (a.cn||'').localeCompare(b.cn||'','zh-Hans-CN');});
  }else if(s.sort==='en'){
    terms.sort(function(a,b){return (a.en||'').toLowerCase().localeCompare((b.en||'').toLowerCase());});
  }
  if(!terms.length){
    return '<div class=\"term-empty\">No terms match this filter.</div>';
  }
  return terms.map(topicTermItemHtml).join('');
}

function topicTermListSetCat(listId,cat){
  var s=topicTermListState[listId];if(!s)return;
  s.cat=cat;
  var list=document.getElementById(listId);
  if(list)list.innerHTML=topicTermListRenderInner(listId);
  var wrap=document.querySelector('[data-term-wrap=\"'+listId+'\"]');
  if(wrap){
    wrap.querySelectorAll('[data-term-cat]').forEach(function(btn){
      btn.classList.toggle('active',btn.getAttribute('data-term-cat')===cat);
    });
  }
}

function topicTermListSetSort(listId,sort){
  var s=topicTermListState[listId];if(!s)return;
  s.sort=sort;
  var list=document.getElementById(listId);
  if(list)list.innerHTML=topicTermListRenderInner(listId);
  var wrap=document.querySelector('[data-term-wrap=\"'+listId+'\"]');
  if(wrap){
    wrap.querySelectorAll('[data-term-sort]').forEach(function(btn){
      btn.classList.toggle('active',btn.getAttribute('data-term-sort')===sort);
    });
  }
}

function topicBuildTermList(terms,listId){
  topicTermListState[listId]={terms:terms||[],cat:'__all__',sort:'default'};
  var counts={};
  (terms||[]).forEach(function(t){var c=t.cat||'misc';counts[c]=(counts[c]||0)+1;});
  var cats=Object.keys(counts).sort();
  var total=(terms||[]).length;

  var chipAll='<button type=\"button\" class=\"term-chip active\" data-term-cat=\"__all__\" onclick=\"topicTermListSetCat(\''+listId+'\',\'__all__\')\">All<span class=\"term-chip-count\">'+total+'</span></button>';
  var catChips=cats.map(function(c){
    var col=topicHashColor(c);
    var safe=c.replace(/'/g,"\\'");
    return '<button type=\"button\" class=\"term-chip\" data-term-cat=\"'+c+'\" style=\"--term-chip-accent:'+col+'\" onclick=\"topicTermListSetCat(\''+listId+'\',\''+safe+'\')\">'+c+'<span class=\"term-chip-count\">'+counts[c]+'</span></button>';
  }).join('');
  var sortBtns=[
    {id:'default',label:'Default'},
    {id:'cat',label:'By category'},
    {id:'cn',label:'A→Z 中'},
    {id:'en',label:'A→Z EN'}
  ].map(function(opt){
    return '<button type=\"button\" class=\"term-sort-btn'+(opt.id==='default'?' active':'')+'\" data-term-sort=\"'+opt.id+'\" onclick=\"topicTermListSetSort(\''+listId+'\',\''+opt.id+'\')\">'+opt.label+'</button>';
  }).join('');

  return '<div class=\"term-toolbar\" data-term-wrap=\"'+listId+'\">'+
    '<div class=\"term-toolbar-row\"><span class=\"term-toolbar-label\">Filter</span><div class=\"term-chips\">'+chipAll+catChips+'</div></div>'+
    '<div class=\"term-toolbar-row\"><span class=\"term-toolbar-label\">Sort</span><div class=\"term-sorts\">'+sortBtns+'</div></div>'+
    '</div>'+
    '<div class=\"term-list\" id=\"'+listId+'\">'+topicTermListRenderInner(listId)+'</div>';
}
function topicBuildChecklist(items,listId){return '<div id=\"'+listId+'\">'+items.map(function(item){return '<div class=\"check-item\" onclick=\"this.classList.toggle(\'done\')\"><div class=\"ck-box\">✓</div><span class=\"ck-label\">'+item+'</span></div>';}).join('')+'</div>';}
function topicBuildQuiz(tabId){return '<div><div class=\"quiz-q cn\" id=\"topic-qq-'+tabId+'\"></div><div class=\"quiz-opts\" id=\"topic-qo-'+tabId+'\"></div><div style=\"display:flex;justify-content:space-between;align-items:center;margin-top:10px\"><span style=\"font-size:.7rem;color:var(--muted)\" id=\"topic-qs-'+tabId+'\">Score: 0/0</span><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"topicNextQuiz(\''+tabId+'\')\">Next →</button></div></div>';}
function topicGetBaiduQuickSearches(tabId){var map={cyber:['网络安全','漏洞','APT','数据泄露','钓鱼'],political:['两会','共同富裕','清朗行动','一带一路','舆论场'],genz:['躺平','内卷','摆烂','情绪价值','电子榨菜'],academia:['交换生','考研','保研','推荐信','套磁'],tourist:['地铁站','咖啡店','不要辣','厕所','高铁票'],gossip:['吃瓜','塌房','实锤','爆料','反转'],makeup:['防晒','敏感肌','底妆','平替','烟酰胺'],food:['咖啡店','火锅','奶茶','川菜','菜单'],dropship:['一件代发','起订量','源头工厂','清关','质检']};return map[tabId]||['你好','学习','汉字','中国文化','成语故事'];}
function topicOpenBaiduSearch(query){var text=(query||'').trim();if(!text)return;window.open('https://www.baidu.com/s?wd='+encodeURIComponent(text),'_blank','noopener');}
function topicBaiduKeydown(event,tabId){if(event.key==='Enter')topicBaiduSearchFromInput(tabId);}
function topicBaiduSearchFromInput(tabId){var input=document.getElementById('topic-baidu-query-'+tabId);if(!input)return;topicOpenBaiduSearch(input.value||'');}
function topicBaiduQuickSearch(tabId,term){var input=document.getElementById('topic-baidu-query-'+tabId);if(input)input.value=term;topicOpenBaiduSearch(term);}
function topicBuildBaiduWidget(tabId,title){var quickSearches=topicGetBaiduQuickSearches(tabId),defaultQuery=quickSearches[0]||'你好';return topicWidgetOpen('百','百度搜索工具',title||'Search native Chinese examples')+'<div class=\"baidu-widget\"><div class=\"baidu-head\"><div class=\"baidu-logo cn\">百</div><div class=\"baidu-copy\"><strong class=\"cn\">百度搜索</strong><span>Search Baidu for characters, phrases, examples, and native context.</span></div></div><div class=\"baidu-form\"><input class=\"search-input cn\" id=\"topic-baidu-query-'+tabId+'\" value=\"'+defaultQuery+'\" placeholder=\"输入搜索内容...\" onkeydown=\"topicBaiduKeydown(event,\''+tabId+'\')\"><button class=\"btn-secondary\" type=\"button\" onclick=\"topicBaiduSearchFromInput(\''+tabId+'\')\">百度一下</button></div><div><div class=\"topic-mini-label\">Quick searches</div><div class=\"baidu-chips\">'+quickSearches.map(function(term){return '<button class=\"qb-chip cn\" type=\"button\" onclick=\"topicBaiduQuickSearch(\''+tabId+'\',\''+term.replace(/'/g,"\\'")+'\')\">'+term+'</button>';}).join('')+'</div></div><div class=\"baidu-tip\">💡 <strong>Tip:</strong> Search the word you just found to get native results, example sentences, forum usage, and cultural context before saving it in <span class=\"cn\">Found While Browsing</span>.</div><div class=\"baidu-foot\">Opens in a new tab · Works with any Chinese text</div></div>'+topicWidgetClose();}
function topicBuildFoundWordsWidget(tabId,label){var items=topicGetSavedBrowsingWords(tabId),h='';h+=topicWidgetOpen('✍️','Found While Browsing',label||'Save your finds');h+='<div style=\"font-size:.7rem;color:var(--muted);margin-bottom:8px\">Words saved here persist to your word list and flashcards.</div>';h+='<div class=\"found-form\"><input class=\"search-input cn\" id=\"topic-found-word-'+tabId+'\" placeholder=\"Word or phrase, e.g. 咖啡店\"><input class=\"search-input\" id=\"topic-found-note-'+tabId+'\" placeholder=\"Optional note or meaning\"><button class=\"btn-secondary\" type=\"button\" onclick=\"topicAddFoundWord(\''+tabId+'\')\">Add</button></div>';h+='<div class=\"found-list\" id=\"topic-found-list-'+tabId+'\">';if(!items.length){h+='<div class=\"found-empty\">No saved words in this section yet.</div>';}else{items.forEach(function(item){h+=topicRenderFoundWordItem(tabId,item);});}h+='</div>';h+=topicWidgetClose();return h;}
function topicRenderFoundWordItem(tabId,item){var cnEsc=(item.cn||'').replace(/'/g,"\\'");var meaning=item.en||item.note||'';return '<div class=\"found-item\"><div class=\"found-main\"><div class=\"found-cn\">'+item.cn+'</div>'+(meaning?'<div class=\"found-note\">'+meaning+'</div>':'')+'<div class=\"found-meta\">Saved in '+tabId+(item.py?' · '+item.py:'')+'</div></div><button class=\"btn-secondary btn-small found-del\" type=\"button\" onclick=\"topicDeleteFoundWord(\''+tabId+'\',\''+cnEsc+'\')\">Delete</button></div>';}
function topicInitQuiz(tabId,terms){topicQuizStates[tabId]={score:0,total:0,terms:terms};topicNextQuiz(tabId);}
function topicNextQuiz(tabId){var s=topicQuizStates[tabId];if(!s)return;var q=s.terms[Math.floor(Math.random()*s.terms.length)],wrong=s.terms.filter(function(t){return t.cn!==q.cn;}).sort(function(){return Math.random()-.5;}).slice(0,3),opts=[{text:q.en,correct:true}].concat(wrong.map(function(w){return{text:w.en,correct:false};})).sort(function(){return Math.random()-.5;}),qEl=document.getElementById('topic-qq-'+tabId),c=document.getElementById('topic-qo-'+tabId),sEl=document.getElementById('topic-qs-'+tabId);if(!qEl||!c||!sEl)return;qEl.textContent='What does \"'+q.cn+'\" mean?';c.innerHTML='';var answered=false;opts.forEach(function(o){var d=document.createElement('div');d.className='quiz-opt';d.textContent=o.text;d.onclick=function(){if(answered)return;answered=true;s.total++;if(o.correct){d.classList.add('correct');s.score++;}else{d.classList.add('wrong');Array.prototype.forEach.call(c.querySelectorAll('.quiz-opt'),function(el){if(el.textContent===q.en)el.classList.add('correct');});}sEl.textContent='Score: '+s.score+'/'+s.total;};c.appendChild(d);});}
function topicCopyText(text,el){if(navigator.clipboard)navigator.clipboard.writeText(text);if(el){el.classList.add('copied');setTimeout(function(){el.classList.remove('copied');},800);}}
function topicCopyElText(id){var el=document.getElementById(id);if(el&&navigator.clipboard)navigator.clipboard.writeText(el.textContent.replace('📋 Copy','').trim());}
function topicAddFoundWord(tabId){var wordEl=document.getElementById('topic-found-word-'+tabId),noteEl=document.getElementById('topic-found-note-'+tabId);if(!wordEl)return;var word=(wordEl.value||'').trim(),note=noteEl?(noteEl.value||'').trim():'';if(!word)return;if(typeof window.addWord!=='function'){alert('Word list not ready yet — try again in a moment.');return;}if(typeof window.isWordSaved==='function'&&window.isWordSaved(word)){wordEl.value='';if(noteEl)noteEl.value='';topicRefreshFoundWords(tabId);return;}var added=window.addWord({cn:word,py:'',en:'',note:note,source:'browsing',sourceArticle:tabId});if(added&&typeof window.addSavedWordToFlashcards==='function')window.addSavedWordToFlashcards({cn:word,py:'',en:note||word});if(added&&typeof window.showToast==='function')window.showToast(word,'',note||'saved to word list',false);wordEl.value='';if(noteEl)noteEl.value='';topicRefreshFoundWords(tabId);if(typeof window.renderWordlistContent==='function')window.renderWordlistContent();}
function topicDeleteFoundWord(tabId,cn){if(!cn||typeof window.removeWord!=='function')return;window.removeWord(cn);topicRefreshFoundWords(tabId);if(typeof window.renderWordlistContent==='function')window.renderWordlistContent();}
function topicRefreshFoundWords(tabId){var list=document.getElementById('topic-found-list-'+tabId);if(!list)return;var items=topicGetSavedBrowsingWords(tabId);list.innerHTML=items.length?items.map(function(item){return topicRenderFoundWordItem(tabId,item);}).join(''):'<div class=\"found-empty\">No saved words in this section yet.</div>';}
function topicRefreshAllFoundWords(){['cyber','political','genz','academia','tourist','gossip','makeup','food','dropship'].forEach(function(tabId){topicRefreshFoundWords(tabId);});}
function renderCyberWidgets(){var d=TOPIC_WIDGET_DATA.cyber,h='';h+=topicBuildBaiduWidget('cyber','Search cyber vocabulary');h+=topicWidgetOpen('🃏','Threat Intel Flashcards','Drill','var(--green)');h+=topicBuildFlashcards('cyber',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('🔍','OSINT Query Builder','Copy & Paste','var(--green)');h+='<div style=\"margin-bottom:8px;font-size:.7rem;color:var(--muted)\">Click keywords to build a search query:</div><div style=\"margin-bottom:6px\"><div class=\"topic-mini-label\">PLATFORM:</div><div class=\"qb-row\" id=\"topic-cyberPlat\">';d.queryPlatforms.forEach(function(p,i){h+='<span class=\"qb-chip\" data-site=\"'+d.querySites[i]+'\" onclick=\"this.classList.toggle(\'on\');topicBuildCyberQuery()\">'+p+'</span>';});h+='</div></div><div style=\"margin-bottom:6px\"><div class=\"topic-mini-label\">KEYWORDS:</div><div class=\"qb-row\" id=\"topic-cyberKw\">';d.queryKeywords.forEach(function(k){h+='<span class=\"qb-chip cn\" onclick=\"this.classList.toggle(\'on\');topicBuildCyberQuery()\">'+k+'</span>';});h+='</div></div><div class=\"qb-output\" id=\"topic-cyberQuery\"><span class=\"qb-copy\" onclick=\"topicCopyElText(\'topic-cyberQuery\')\">📋 Copy</span><span style=\"color:var(--muted)\">← Click chips above</span></div>';h+=topicWidgetClose();h+=topicWidgetOpen('📖','Vocabulary Glossary',d.terms.length+' terms','var(--green)');h+=topicBuildTermList(d.terms,'topic-cyberTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Quick Quiz','Test yourself','var(--green)');h+=topicBuildQuiz('cyber');h+=topicWidgetClose();h+=topicWidgetOpen('✅','Weekly Monitoring Checklist','Workflow','var(--green)');h+=topicBuildChecklist(d.checklist,'topic-cyberChecklist');h+=topicWidgetClose();h+=topicWidgetOpen('💻','Recon Terminal','Interactive','var(--green)');h+='<div class=\"terminal\"><div class=\"term-bar\"><div class=\"term-dot\" style=\"background:#f87171\"></div><div class=\"term-dot\" style=\"background:#f0a040\"></div><div class=\"term-dot\" style=\"background:#34d399\"></div><span style=\"margin-left:8px\">threat-intel@osint ~</span></div><div class=\"term-body\" id=\"topic-cyberTermBody\"><div class=\"term-line\" style=\"color:var(--green)\">🔒 Threat Intel Console v1.0</div><div class=\"term-line\" style=\"color:var(--muted)\">Commands: lookup [term], random, platforms, help</div></div><div class=\"term-input-row\"><span>$</span><input class=\"term-input\" id=\"topic-cyberTermInput\" placeholder=\"Type command...\"></div></div>';h+=topicWidgetClose();return h;}
function renderPoliticalWidgets(){var d=TOPIC_WIDGET_DATA.political,h='';h+=topicBuildBaiduWidget('political','Search policy and discourse');h+=topicWidgetOpen('🃏','Political Term Cards','Drill');h+=topicBuildFlashcards('political',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('🇺🇸','Trump Nickname Decoder','川建国');d.trumpNames.forEach(function(t){h+='<div class=\"phrase-card\" style=\"border-left-color:var(--accent)\"><div class=\"phrase-cn cn\">'+t.name+'</div><div class=\"phrase-en\">'+t.note+'</div></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('📖','Political Vocabulary',d.terms.length+' terms');h+=topicBuildTermList(d.terms,'topic-polTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Quick Quiz','Test yourself');h+=topicBuildQuiz('political');h+=topicWidgetClose();h+=topicWidgetOpen('🌐','Belt & Road Search Clusters','一带一路');d.briClusters.forEach(function(c){h+='<div style=\"margin-bottom:8px\"><div style=\"font-size:.68rem;font-weight:700;color:var(--tab-accent);margin-bottom:4px\">'+c.label+'</div><div class=\"qb-row\">'+c.kws.map(function(k){return '<span class=\"qb-chip cn\">'+k+'</span>';}).join('')+'</div></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('😂','Political Meme Slang','Internet culture');d.memes.forEach(function(m){h+='<div class=\"phrase-card\"><div class=\"phrase-cn cn\" style=\"font-size:.9rem\">'+m.cn+'</div><div class=\"phrase-en\">'+m.en+'</div></div>';});h+=topicWidgetClose();return h;}
function renderGenZWidgets(){var d=TOPIC_WIDGET_DATA.genz,h='';h+=topicBuildBaiduWidget('genz','Search slang in the wild');h+=topicWidgetOpen('🎚️','Vibe Spectrum','Where are you today?');h+='<div style=\"font-size:.72rem;color:var(--muted);margin-bottom:4px\">Click the bar to set your current vibe:</div><div class=\"spectrum\" onclick=\"topicSetVibe(event)\"><div class=\"spectrum-fill\" id=\"topic-gzFill\" style=\"width:50%;background:linear-gradient(90deg,#6366f1,#a78bfa,#f472b6)\">50%</div></div><div class=\"spectrum-labels\"><span>🛌 躺平 Lying Flat</span><span>🏃 内卷 Involution</span></div><div style=\"text-align:center;margin-top:8px;font-size:.75rem;color:var(--muted)\" id=\"topic-gzVibeText\">Balanced… for now</div>';h+=topicWidgetClose();h+=topicWidgetOpen('🃏','Gen Z Slang Cards','Drill');h+=topicBuildFlashcards('genz',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('📖','Youth Culture Glossary',d.terms.length+' terms');h+=topicBuildTermList(d.terms,'topic-gzTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Decode the Slang','Quiz');h+=topicBuildQuiz('genz');h+=topicWidgetClose();h+=topicWidgetOpen('😂','Reaction Vocabulary','Essential memes');h+='<div class=\"card-grid\">';d.reactions.forEach(function(r){h+='<div class=\"mini-card\"><div class=\"mc-icon\">'+r.emoji+'</div><div class=\"mc-title cn\">'+r.cn+'</div><div class=\"mc-sub\">'+r.en+'</div></div>';});h+='</div>';h+=topicWidgetClose();h+=topicWidgetOpen('🔥','2025 Hot Subtopics','Watch these');h+=topicBuildChecklist(d.hotTopics,'topic-gzHot');h+=topicWidgetClose();return h;}
function renderAcademiaWidgets(){var d=TOPIC_WIDGET_DATA.academia,h='';h+=topicBuildBaiduWidget('academia','Search campus and application terms');h+=topicWidgetOpen('⏰','Application Deadlines','Countdown');d.deadlines.forEach(function(dl){var col=dl.status==='passed'?'var(--red)':dl.status==='soon'?'var(--gold)':'var(--green)',label=dl.status==='passed'?'PASSED':dl.status==='soon'?'SOON':'UPCOMING';h+='<div style=\"display:flex;align-items:center;gap:10px;padding:8px;background:var(--surface);border-radius:8px;margin-bottom:4px;border-left:3px solid '+col+'\"><div style=\"flex:1\"><div style=\"font-size:.8rem;font-weight:600;color:#ddd\">'+dl.name+'</div><div style=\"font-size:.65rem;color:var(--muted)\">'+dl.date+'</div></div><span class=\"tag\" style=\"background:'+col+'18;color:'+col+'\">'+label+'</span></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('🃏','Academic Vocabulary','Drill');h+=topicBuildFlashcards('academia',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('✉️','套磁 Email Template','Cold-email a professor');h+='<div style=\"margin-bottom:8px;display:flex;gap:6px;flex-wrap:wrap\"><button class=\"btn-secondary btn-small active\" type=\"button\" onclick=\"topicSetEmailTpl(0,this)\">Initial Contact</button><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"topicSetEmailTpl(1,this)\">Follow-up</button><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"topicSetEmailTpl(2,this)\">Thank You</button></div><div class=\"msg-template\" id=\"topic-emailTemplate\">'+d.emailTemplates[0]+'</div><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"topicCopyElText(\'topic-emailTemplate\')\" style=\"margin-top:8px\">📋 Copy Template</button>';h+=topicWidgetClose();h+=topicWidgetOpen('🔢','GPA Converter','Quick tool');h+='<div class=\"calc-row\"><span class=\"calc-label\">Your GPA:</span><input class=\"search-input\" type=\"number\" id=\"topic-gpaIn\" value=\"3.5\" min=\"0\" max=\"5\" step=\"0.01\" style=\"width:80px\" oninput=\"topicConvertGPA()\"></div><div class=\"calc-row\"><span class=\"calc-label\">Scale:</span><select class=\"search-input\" id=\"topic-gpaScale\" style=\"width:120px\" onchange=\"topicConvertGPA()\"><option value=\"4\">4.0 US</option><option value=\"5\">5.0 CN</option></select></div><div class=\"calc-result\"><div class=\"calc-big\" id=\"topic-gpaResult\" style=\"color:var(--tab-accent)\">87%</div><div class=\"calc-sub\" id=\"topic-gpaSub\">百分制 Percentage Score</div></div>';h+=topicWidgetClose();h+=topicWidgetOpen('📖','Full Glossary',d.terms.length+' terms');h+=topicBuildTermList(d.terms,'topic-acadTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Quick Quiz','Test yourself');h+=topicBuildQuiz('academia');h+=topicWidgetClose();return h;}
function renderTouristPhraseCard(p){var cnEsc=(p.cn||'').replace(/'/g,"\\'");return '<div class=\"phrase-card\" onclick=\"topicCopyText(\''+cnEsc+'\',this)\" title=\"Click to copy\"><div class=\"phrase-cn cn\">'+p.cn+'</div><div class=\"phrase-py\">'+(p.py||'')+'</div><div class=\"phrase-en\">'+(p.en||'')+'</div>'+(p.note?'<div class=\"phrase-note\">💡 '+p.note+'</div>':'')+'</div>';}
function renderTouristWidgets(){
  var d=TOPIC_WIDGET_DATA.tourist,h='';
  h+=topicBuildBaiduWidget('tourist','Search places and survival phrases');
  h+=topicWidgetOpen('🆘','Emergency Card','Save this!','var(--red)','span-2');
  h+='<div class=\"tourist-emergency\">';
  d.emergencyNums.forEach(function(e){
    h+='<div class=\"tourist-emergency-row\"><span style=\"font-size:.82rem;color:#ddd;font-weight:600;\">'+e.name+'</span><span class=\"tourist-emergency-num\">'+e.num+'</span></div>';
  });
  h+='</div>';
  h+='<div class=\"tourist-emergency-tip\">💡 <strong style=\"color:var(--red);\">护照丢了</strong> hùzhào diū le — passport lost · <strong style=\"color:var(--red);\">我需要翻译</strong> wǒ xūyào fānyì — I need an interpreter · <strong style=\"color:var(--red);\">报警</strong> bào jǐng — call the police</div>';
  h+=topicWidgetClose();
  h+=topicWidgetOpen('🗣️','Survival Flashcards','Flip to learn');
  h+=topicBuildFlashcards('tourist',d.phrases);
  h+=topicWidgetClose();
  h+=topicWidgetOpen('🧭','Directions & Movement',d.directions.length+' phrases');
  d.directions.forEach(function(p){
    var cnEsc=(p.cn||'').replace(/'/g,"\\'");
    h+='<div class=\"copy-row\" onclick=\"topicCopyText(\''+cnEsc+'\',this)\"><span class=\"cn\" style=\"font-weight:600;color:#ddd;min-width:80px;\">'+p.cn+'</span><span style=\"color:var(--gold);font-style:italic;font-size:.66rem;min-width:90px;\">'+p.py+'</span><span style=\"color:var(--muted);flex:1;\">'+p.en+'</span><span style=\"font-size:.6rem;color:var(--muted);\">📋</span></div>';
  });
  h+=topicWidgetClose();
  h+=topicWidgetOpen('📖','Phrasebook',d.phrases.length+' phrases · click to copy','','span-2');
  h+='<div class=\"tourist-phrase-grid\">';
  d.phrases.forEach(function(p){h+=renderTouristPhraseCard(p);});
  h+='</div>';
  h+=topicWidgetClose();
  h+=topicWidgetOpen('🪧','Common Signs','Visual guide');
  h+='<div class=\"card-grid\">';
  d.signs.forEach(function(s){
    h+='<div class=\"mini-card\"><div class=\"mc-icon\">'+s.icon+'</div><div class=\"mc-title cn\">'+s.cn+'</div><div class=\"mc-sub\">'+s.en+'</div></div>';
  });
  h+='</div>';
  h+=topicWidgetClose();
  h+=topicWidgetOpen('📱','Essential Apps','Setup guide');
  d.appCategories.forEach(function(group){
    h+='<div class=\"tourist-apps-group\"><div class=\"tourist-apps-title\">'+group.cat+'</div>';
    group.apps.forEach(function(a){
      var cnEsc=(a.cn||'').replace(/'/g,"\\'");
      h+='<div class=\"copy-row\" onclick=\"topicCopyText(\''+cnEsc+'\',this)\"><span class=\"cn\" style=\"font-weight:600;color:#ddd;min-width:90px;\">'+a.cn+'</span><span style=\"color:var(--gold);font-size:.68rem;min-width:110px;\">'+a.en+'</span><span style=\"color:var(--muted);flex:1;font-size:.66rem;\">'+a.note+'</span></div>';
    });
    h+='</div>';
  });
  h+=topicWidgetClose();
  h+=topicWidgetOpen('💱','Currency Converter','USD · EUR · GBP → CNY');
  h+='<div class=\"calc-row\"><span class=\"calc-label\">Amount</span><input class=\"search-input\" type=\"number\" id=\"topic-usdIn\" value=\"100\" style=\"width:100px;\" oninput=\"topicConvertCurrency()\"></div>';
  h+='<div class=\"tourist-currency-row\"><div class=\"tourist-currency-cell\"><div class=\"tcc-label\">USD → ¥</div><div class=\"tcc-val\" id=\"topic-cnyResult\">¥ 725</div></div><div class=\"tourist-currency-cell\"><div class=\"tcc-label\">EUR → ¥</div><div class=\"tcc-val\" id=\"topic-cnyEurResult\">¥ 785</div></div><div class=\"tourist-currency-cell\"><div class=\"tcc-label\">GBP → ¥</div><div class=\"tcc-val\" id=\"topic-cnyGbpResult\">¥ 915</div></div></div>';
  h+='<div style=\"font-size:.62rem;color:var(--muted);margin-top:8px;text-align:center;\">Approx rates — check your bank for live numbers.</div>';
  h+=topicWidgetClose();
  return h;
}
function renderGossipWidgets(){var d=TOPIC_WIDGET_DATA.gossip,h='';h+=topicBuildBaiduWidget('gossip','Search drama and gossip terms');h+=topicWidgetOpen('🍵','Tea Strength Meter','How reliable?','var(--pink)');h+='<div style=\"text-align:center;padding:10px\"><div style=\"font-size:3rem;margin-bottom:8px\" id=\"topic-teaEmoji\">🫖</div><div style=\"font-size:.82rem;color:#ddd;margin-bottom:4px\" id=\"topic-teaLabel\">Rate this gossip:</div><div style=\"display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px\">'+['🌱 Rumor','🔨 Some proof','🔨🔨 Strong','💣 Nuclear'].map(function(l,i){return '<button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"topicSetTea('+i+')\">'+l+'</button>';}).join('')+'</div><div style=\"font-size:.7rem;color:var(--muted)\" id=\"topic-teaAdvice\">Click to rate the gossip strength</div></div>';h+=topicWidgetClose();h+=topicWidgetOpen('🃏','Gossip Vocabulary Cards','Drill','var(--pink)');h+=topicBuildFlashcards('gossip',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('📖','Full Gossip Glossary',d.terms.length+' terms','var(--pink)');h+=topicBuildTermList(d.terms,'topic-gossipTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Decode the Drama','Quiz','var(--pink)');h+=topicBuildQuiz('gossip');h+=topicWidgetClose();h+=topicWidgetOpen('🎭','Quick Reaction Phrases','Copy & Paste in comments','var(--pink)');d.quickReactions.forEach(function(r){h+='<div class=\"copy-row\" onclick=\"topicCopyText(\''+r.cn.replace(/'/g,"\\'")+'\',this)\"><span class=\"cn\" style=\"font-weight:600;color:#ddd\">'+r.cn+'</span><span style=\"color:var(--muted);flex:1;margin-left:6px\">'+r.en+'</span><span style=\"font-size:.6rem;color:var(--muted)\">📋</span></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('📝','Drama Post Formats','How they write it','var(--pink)');d.formats.forEach(function(f){var parts=f.split('—');h+='<div style=\"padding:6px 10px;background:var(--surface);border-radius:8px;margin-bottom:3px;font-size:.72rem\"><span class=\"cn\" style=\"color:#ddd\">'+parts[0]+'</span><span style=\"color:var(--muted)\">—'+(parts[1]||'')+'</span></div>';});h+=topicWidgetClose();return h;}
function renderMakeupWidgets(){var d=TOPIC_WIDGET_DATA.makeup,h='';h+=topicBuildBaiduWidget('makeup','Search products and looks');h+=topicWidgetOpen('🎞️','Latest Videos','Thumbnail grid · click to open','var(--pink)','span-2');h+='<div id=\"topic-makeupLatestFeed\"></div>';h+=topicWidgetClose();h+=topicWidgetOpen('▶️','YouTube Beauty Feed','Creator player','var(--pink)','span-2 youtube-news-widget');h+='<div class=\"youtube-news-shell\" id=\"topic-makeupYoutubeWidget\"></div>';h+=topicWidgetClose();h+=topicWidgetOpen('🔬','Skin Type Finder','Quick quiz','var(--pink)');h+='<div id=\"topic-skinQuiz\"></div>';h+=topicWidgetClose();h+=topicWidgetOpen('🃏','Beauty Vocabulary Cards','Drill','var(--pink)');h+=topicBuildFlashcards('makeup',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('🧴','Routine Builder','Morning routine order','var(--pink)');d.routineSteps.forEach(function(s,i){h+='<div style=\"display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--surface);border-radius:8px;margin-bottom:4px\"><div style=\"width:24px;height:24px;border-radius:50%;background:var(--tab-accent);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;color:#000;flex-shrink:0\">'+(i+1)+'</div><span style=\"font-size:.78rem;font-weight:600;color:#ddd\" class=\"cn\">'+s+'</span></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('📖','Beauty Glossary',d.terms.length+' terms','var(--pink)');h+=topicBuildTermList(d.terms,'topic-makeupTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Ingredient Quiz','Test yourself','var(--pink)');h+=topicBuildQuiz('makeup');h+=topicWidgetClose();h+=topicWidgetOpen('🔍','XHS/Bilibili Search Templates','Copy & Paste','var(--pink)');d.searches.forEach(function(s){h+='<div class=\"copy-row\" onclick=\"topicCopyText(\''+s+'\',this)\"><span class=\"cn\" style=\"color:#ddd\">'+s+'</span><span style=\"color:var(--muted);margin-left:auto\">📋</span></div>';});h+=topicWidgetClose();return h;}
function renderFoodOrderPhraseCard(p){
  var cnEsc=(p.cn||'').replace(/'/g,"\\'");
  return '<div class=\"phrase-card\" onclick=\"topicCopyText(\''+cnEsc+'\',this)\" title=\"Click to copy\"><div class=\"phrase-cn cn\">'+p.cn+'</div><div class=\"phrase-py\">'+(p.py||'')+'</div><div class=\"phrase-en\">'+(p.en||'')+'</div></div>';
}
function renderFoodWidgets(){
  var d=TOPIC_WIDGET_DATA.food,h='',hp=d.hotpot;
  var sections=[{label:'🍲 Broth 锅底',items:hp.broths},{label:'🥩 Meats 荤菜',items:hp.meats},{label:'🥬 Vegs 素菜',items:hp.vegs},{label:'🍜 Staples 主食',items:hp.staples},{label:'🧊 Extras 附加',items:hp.extras}];
  h+=topicBuildBaiduWidget('food','Search dishes and ingredients');

  h+=topicWidgetOpen('🎞️','Latest Videos','Thumbnail grid · click to open',null,'span-2');
  h+='<div id=\"topic-foodLatestFeed\"></div>';
  h+=topicWidgetClose();

  h+=topicWidgetOpen('▶️','YouTube Food Feed','Creator player',null,'span-2 youtube-news-widget');
  h+='<div class=\"youtube-news-shell\" id=\"topic-foodYoutubeWidget\"></div>';
  h+=topicWidgetClose();

  h+=topicWidgetOpen('🫕','Hot Pot Order Builder','Interactive',null,'span-2');
  h+='<div style=\"font-size:.72rem;color:var(--muted);margin-bottom:10px;\">Click items to add to your order. Total updates automatically.</div>';
  sections.forEach(function(sec){
    h+='<div class=\"hp-section\"><div class=\"hp-section-title\">'+sec.label+'</div><div class=\"hp-items\">';
    sec.items.forEach(function(item){h+='<div class=\"hp-item cn\" onclick=\"topicToggleHP(this,\''+item.n.replace(/'/g,"\\'")+'\','+item.p+')\">'+item.n+' <span style=\"color:var(--muted);font-family:JetBrains Mono,monospace;\">¥'+item.p+'</span></div>';});
    h+='</div></div>';
  });
  h+='<div class=\"hp-order\" id=\"topic-hpOrder\"><div style=\"font-size:.7rem;color:var(--muted);\">Your order will appear here…</div></div>';
  h+='<div class=\"hp-total\" id=\"topic-hpTotal\">Total: ¥0</div>';
  h+=topicWidgetClose();

  h+=topicWidgetOpen('🗺️','Regional Cuisine Explorer',d.cuisines.length+' flavors');
  d.cuisines.forEach(function(c){
    h+='<div class=\"food-cuisine-card phrase-card\" onclick=\"this.classList.toggle(\'expanded\')\">'+
      '<div class=\"food-cuisine-head\"><span class=\"food-cuisine-icon\">'+c.icon+'</span>'+
        '<div style=\"flex:1;min-width:0;\"><div class=\"phrase-cn cn\" style=\"font-size:.9rem;\">'+c.name+'</div>'+
        '<div style=\"font-size:.66rem;color:var(--tab-accent);\">'+c.flavor+'</div></div>'+
        '<span class=\"food-cuisine-chevron\">▸</span></div>'+
      '<div class=\"food-cuisine-dishes phrase-en\">'+c.dishes+'</div>'+
      '</div>';
  });
  h+=topicWidgetClose();

  h+=topicWidgetOpen('🌶️','Spice Level Guide','Choose wisely');
  h+='<div class=\"food-spice-grid\">';
  d.spiceLevels.forEach(function(s){
    h+='<div class=\"food-spice-cell\" style=\"background:'+s.bg+';\">'+
      '<div style=\"font-size:1.6rem;\">'+s.emoji+'</div>'+
      '<div class=\"cn\" style=\"font-size:.82rem;font-weight:700;color:#eee;margin-top:4px;\">'+s.cn+'</div>'+
      '<div style=\"font-size:.6rem;color:var(--tab-accent);font-style:italic;\">'+(s.py||'')+'</div>'+
      '<div style=\"font-size:.62rem;color:var(--muted);\">'+s.en+'</div>'+
      '</div>';
  });
  h+='</div>';
  h+=topicWidgetClose();

  // Menu decoder — how dish names are built. Useful for reading any menu.
  h+=topicWidgetOpen('📜','Menu Decoder','How dish names are built',null,'span-2');
  h+='<div style=\"font-size:.7rem;color:var(--muted);margin-bottom:10px;\">Most dishes follow <strong style=\"color:var(--tab-accent);\">method + ingredient</strong> (e.g. <span class=\"cn\">红烧肉</span> = red-braised pork). Learn these and you can read almost any menu.</div>';
  h+='<div class=\"food-decoder-grid\">';
  h+='<div><div class=\"food-decoder-title\">🍳 Cooking methods</div><div class=\"food-decoder-chips\">';
  d.cookingVerbs.forEach(function(v){
    var cnEsc=(v.cn||'').replace(/'/g,"\\'");
    h+='<div class=\"food-decoder-chip\" onclick=\"topicCopyText(\''+cnEsc+'\',this)\" title=\"Click to copy\"><span class=\"fdc-cn cn\">'+v.cn+'</span><span class=\"fdc-py\">'+v.py+'</span><span class=\"fdc-en\">'+v.en+'</span></div>';
  });
  h+='</div></div>';
  h+='<div><div class=\"food-decoder-title\">👅 Flavors</div><div class=\"food-decoder-chips\">';
  d.flavorWords.forEach(function(v){
    var cnEsc=(v.cn||'').replace(/'/g,"\\'");
    h+='<div class=\"food-decoder-chip\" onclick=\"topicCopyText(\''+cnEsc+'\',this)\" title=\"Click to copy\"><span class=\"fdc-cn cn\">'+v.cn+'</span><span class=\"fdc-py\">'+v.py+'</span><span class=\"fdc-en\">'+v.en+'</span></div>';
  });
  h+='</div></div>';
  h+='</div>';
  h+=topicWidgetClose();

  h+=topicWidgetOpen('🗣️','Ordering Phrases',d.orderPhrases.length+' phrases · click to copy',null,'span-2');
  h+='<div class=\"food-order-grid\">';
  d.orderPhrases.forEach(function(p){h+=renderFoodOrderPhraseCard(p);});
  h+='</div>';
  h+=topicWidgetClose();

  return h;
}
function renderDropshipWidgets(){var d=TOPIC_WIDGET_DATA.dropship,h='';h+=topicBuildBaiduWidget('dropship','Search supplier and sourcing terms');h+=topicWidgetOpen('🧮','Profit Calculator','Quick math','var(--green)');h+='<div class=\"calc-row\"><span class=\"calc-label\">Cost (¥)</span><input class=\"search-input\" type=\"number\" id=\"topic-dsCost\" value=\"25\" style=\"width:100px\" oninput=\"topicCalcProfit()\"></div><div class=\"calc-row\"><span class=\"calc-label\">Shipping (¥)</span><input class=\"search-input\" type=\"number\" id=\"topic-dsShip\" value=\"15\" style=\"width:100px\" oninput=\"topicCalcProfit()\"></div><div class=\"calc-row\"><span class=\"calc-label\">Sell ($)</span><input class=\"search-input\" type=\"number\" id=\"topic-dsSell\" value=\"19.99\" step=\"0.01\" style=\"width:100px\" oninput=\"topicCalcProfit()\"></div><div class=\"calc-row\"><span class=\"calc-label\">Rate (¥/$)</span><input class=\"search-input\" type=\"number\" id=\"topic-dsRate\" value=\"7.25\" step=\"0.01\" style=\"width:100px\" oninput=\"topicCalcProfit()\"></div><div class=\"calc-result\"><div class=\"calc-big\" id=\"topic-dsProfit\" style=\"color:var(--tab-accent)\">$0.00</div><div class=\"calc-sub\" id=\"topic-dsMargin\">Profit per unit · 0% margin</div></div>';h+=topicWidgetClose();h+=topicWidgetOpen('🃏','Sourcing Vocabulary','Drill','var(--green)');h+=topicBuildFlashcards('dropship',d.terms);h+=topicWidgetClose();h+=topicWidgetOpen('💬','Supplier Message Templates','Copy & Send','var(--green)');d.supplierPhrases.forEach(function(p){h+='<div class=\"copy-row\" onclick=\"topicCopyText(\''+p.replace(/'/g,"\\'")+'\',this)\"><span class=\"cn\" style=\"font-size:.78rem;color:#ddd;flex:1\">'+p+'</span><span style=\"font-size:.6rem;color:var(--muted)\">📋</span></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('⚠️','IP Risk Checker','Stay legal','var(--red)');h+='<div style=\"font-size:.72rem;color:var(--muted);margin-bottom:8px\">Is your product safe to sell?</div>';d.riskItems.forEach(function(r){var col=r.risk==='HIGH'?'var(--red)':r.risk==='MED'?'var(--gold)':r.risk==='LOW'?'var(--green)':r.risk==='SAFE'?'var(--green)':'var(--blue)';h+='<div style=\"display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface);border-radius:8px;margin-bottom:3px;border-left:3px solid '+col+'\"><div style=\"flex:1\"><div style=\"font-size:.75rem;color:#ddd\">'+r.q+'</div><div style=\"font-size:.62rem;color:var(--muted)\">'+r.note+'</div></div><span class=\"tag\" style=\"background:'+col+'18;color:'+col+'\">'+r.risk+'</span></div>';});h+=topicWidgetClose();h+=topicWidgetOpen('📖','Full E-Commerce Glossary',d.terms.length+' terms','var(--green)');h+=topicBuildTermList(d.terms,'topic-dsTerms');h+=topicWidgetClose();h+=topicWidgetOpen('🧠','Quick Quiz','Test yourself','var(--green)');h+=topicBuildQuiz('dropship');h+=topicWidgetClose();return h;}
function topicBuildCyberQuery(){var plats=[],kws=[],el=document.getElementById('topic-cyberQuery');Array.prototype.forEach.call(document.querySelectorAll('#topic-cyberPlat .qb-chip.on'),function(node){plats.push('site:'+node.getAttribute('data-site'));});Array.prototype.forEach.call(document.querySelectorAll('#topic-cyberKw .qb-chip.on'),function(node){kws.push(node.textContent);});var q=kws.join(' ');if(plats.length)q+=(q?' ':'')+plats.join(' OR ');if(el)el.innerHTML='<span class=\"qb-copy\" onclick=\"topicCopyElText(\'topic-cyberQuery\')\">📋 Copy</span>'+(q||'<span style=\"color:var(--muted)\">← Click chips above</span>');}
function topicInitCyberTerminal(){var input=document.getElementById('topic-cyberTermInput');if(!input||input.dataset.bound)return;input.dataset.bound='1';input.addEventListener('keydown',function(e){if(e.key==='Enter'){var cmd=this.value.trim();if(!cmd)return;topicCyberCmd(cmd);this.value='';}});}
function topicCyberPrint(text,color){var body=document.getElementById('topic-cyberTermBody');if(!body)return;var d=document.createElement('div');d.className='term-line';d.style.color=color||'var(--green)';d.innerHTML=text;body.appendChild(d);body.scrollTop=body.scrollHeight;}
function topicCyberCmd(cmd){topicCyberPrint('<span style=\"color:var(--tab-accent)\">$ </span>'+cmd,'#888');var parts=cmd.split(/\\s+/),c=parts[0].toLowerCase();if(c==='help')topicCyberPrint('Commands: lookup [keyword], random, platforms, clear','var(--blue)');else if(c==='clear'){document.getElementById('topic-cyberTermBody').innerHTML='';}else if(c==='random'){var t=TOPIC_WIDGET_DATA.cyber.terms[Math.floor(Math.random()*TOPIC_WIDGET_DATA.cyber.terms.length)];topicCyberPrint(t.cn+' ('+t.py+') — '+t.en+' ['+t.cat+']','var(--green)');}else if(c==='platforms')topicCyberPrint('📡 anquanke.com · freebuf.com · github.com · zhihu.com · bilibili.com','var(--blue)');else if(c==='lookup'){var q=parts.slice(1).join(' '),found=TOPIC_WIDGET_DATA.cyber.terms.filter(function(t){return t.cn.indexOf(q)>-1||t.en.toLowerCase().indexOf(q.toLowerCase())>-1;});if(found.length)found.forEach(function(t){topicCyberPrint(t.cn+' ('+t.py+') — '+t.en,'var(--green)');});else topicCyberPrint('Not found: '+q,'var(--red)');}else topicCyberPrint('Unknown: '+c+'. Type \"help\"','var(--red)');}
function topicSetVibe(e){var rect=e.currentTarget.getBoundingClientRect(),pct=Math.max(0,Math.min(100,Math.round((e.clientX-rect.left)/rect.width*100))),fill=document.getElementById('topic-gzFill'),text=document.getElementById('topic-gzVibeText'),labels=['Full 躺平 mode 🛌','Leaning 摆烂...','Quietly resisting','Balanced… for now','Slight 内卷 energy','Grinding mode 📚','Maximum 内卷 🏃‍♂️'];if(fill){fill.style.width=pct+'%';fill.textContent=pct+'%';}if(text)text.textContent=labels[Math.min(6,Math.floor(pct/15))];}
function topicSetTea(level){var emojis=['🌱','🔨','🔨🔨','💣'],labels=['Unverified rumor — 造谣可能','Some evidence — 小锤子','Strong proof — 实锤','Nuclear evidence — 爆了'],advice=['⚠️ 先不表态，等实锤。Don\'t take a stance yet.','🤔 有点意思。Interesting but wait for more.','✅ 可以相信了。Looks legit.','🔥 不用等了。Case closed.'];document.getElementById('topic-teaEmoji').textContent=emojis[level];document.getElementById('topic-teaLabel').textContent=labels[level];document.getElementById('topic-teaAdvice').textContent=advice[level];}
function topicSetEmailTpl(idx,btn){Array.prototype.forEach.call(btn.parentElement.querySelectorAll('button'),function(b){b.classList.remove('active');});btn.classList.add('active');document.getElementById('topic-emailTemplate').textContent=TOPIC_WIDGET_DATA.academia.emailTemplates[idx];}
function topicConvertGPA(){var gpa=parseFloat((document.getElementById('topic-gpaIn')||{}).value)||0,scale=parseInt((document.getElementById('topic-gpaScale')||{}).value||'4',10),pct=Math.min(100,Math.max(0,Math.round(gpa/scale*100))),label=pct>=90?'Excellent 优秀':pct>=80?'Good 良好':pct>=70?'Average 中等':pct>=60?'Pass 及格':'Below 不及格';document.getElementById('topic-gpaResult').textContent=pct+'%';document.getElementById('topic-gpaSub').textContent='百分制 · '+label;}
function topicConvertCurrency(){var amt=parseFloat((document.getElementById('topic-usdIn')||{}).value)||0;var usd=document.getElementById('topic-cnyResult');var eur=document.getElementById('topic-cnyEurResult');var gbp=document.getElementById('topic-cnyGbpResult');if(usd)usd.textContent='¥ '+Math.round(amt*7.25);if(eur)eur.textContent='¥ '+Math.round(amt*7.85);if(gbp)gbp.textContent='¥ '+Math.round(amt*9.15);}
function topicToggleHP(el,name,price){el.classList.toggle('on');if(topicHpOrder[name])delete topicHpOrder[name];else topicHpOrder[name]=price;topicRenderHPOrder();}
function topicRenderHPOrder(){var el=document.getElementById('topic-hpOrder'),totalEl=document.getElementById('topic-hpTotal'),keys=Object.keys(topicHpOrder);if(!el||!totalEl)return;if(!keys.length){el.innerHTML='<div style=\"font-size:.7rem;color:var(--muted)\">Your order will appear here...</div>';totalEl.textContent='Total: ¥0';return;}var total=0;el.innerHTML=keys.map(function(k){total+=topicHpOrder[k];return '<div class=\"hp-order-item\"><span class=\"cn\">'+k+'</span><span>¥'+topicHpOrder[k]+'</span></div>';}).join('');totalEl.textContent='Total: ¥'+total+' (~$'+(total/7.25).toFixed(2)+')';}
function topicCalcProfit(){var cost=parseFloat((document.getElementById('topic-dsCost')||{}).value)||0,ship=parseFloat((document.getElementById('topic-dsShip')||{}).value)||0,sell=parseFloat((document.getElementById('topic-dsSell')||{}).value)||0,rate=parseFloat((document.getElementById('topic-dsRate')||{}).value)||7.25,totalCostUSD=(cost+ship)/rate,profit=sell-totalCostUSD,margin=sell>0?Math.round(profit/sell*100):0;document.getElementById('topic-dsProfit').textContent='$'+profit.toFixed(2);document.getElementById('topic-dsProfit').style.color=profit>=0?'var(--tab-accent)':'var(--red)';document.getElementById('topic-dsMargin').textContent='Profit per unit · '+margin+'% margin';}
function topicInitSkinQuiz(){var el=document.getElementById('topic-skinQuiz');if(!el)return;var qs=TOPIC_WIDGET_DATA.makeup.skinQuiz,step=0,answers=[];function render(){if(step>=qs.length){var result=answers.indexOf('sensitive')>-1?'敏感肌 Sensitive':answers.indexOf('dry')>-1?'干皮 Dry':answers.indexOf('oily')>-1?'油皮 Oily':answers.indexOf('combo')>-1?'混合 Combo':'中性 Normal';el.innerHTML='<div style=\"text-align:center;padding:16px\"><div style=\"font-size:2rem;margin-bottom:8px\">✨</div><div style=\"font-size:1rem;font-weight:700;color:#eee\" class=\"cn\">'+result+'</div><div style=\"font-size:.72rem;color:var(--muted);margin-top:4px\">Search XHS for: \"'+result.split(' ')[0]+' 护肤 推荐\"</div><button class=\"btn-secondary btn-small\" type=\"button\" onclick=\"topicInitSkinQuiz()\" style=\"margin-top:10px\">↻ Retake</button></div>';return;}var q=qs[step];el.innerHTML='<div class=\"quiz-q\">'+q.q+'</div><div class=\"quiz-opts\">'+q.opts.map(function(o){return '<div class=\"quiz-opt\" data-score=\"'+o.s+'\">'+o.t+'</div>';}).join('')+'</div>';Array.prototype.forEach.call(el.querySelectorAll('.quiz-opt'),function(opt){opt.onclick=function(){answers.push(this.dataset.score);this.classList.add('correct');Array.prototype.forEach.call(el.querySelectorAll('.quiz-opt'),function(o){o.style.pointerEvents='none';});setTimeout(function(){step++;render();},400);};});}render();}
function initTopicWidgets(){var renderers={cyber:renderCyberWidgets,political:renderPoliticalWidgets,genz:renderGenZWidgets,academia:renderAcademiaWidgets,tourist:renderTouristWidgets,gossip:renderGossipWidgets,makeup:renderMakeupWidgets,food:renderFoodWidgets,dropship:renderDropshipWidgets};Object.keys(renderers).forEach(function(tabId){var container=document.querySelector('[data-topic-widgets=\"'+tabId+'\"]');if(container)container.innerHTML=renderers[tabId]()+topicBuildFoundWordsWidget(tabId,'Per section');});['cyber','political','genz','academia','gossip','makeup','dropship'].forEach(function(tabId){var d=TOPIC_WIDGET_DATA[tabId];if(d&&d.terms)topicInitQuiz(tabId,d.terms);});setTimeout(function(){topicRenderMakeupYoutubeWidget();topicRenderFoodYoutubeWidget();topicRenderMakeupLatestFeed();topicRenderFoodLatestFeed();topicInitCyberTerminal();topicInitSkinQuiz();topicConvertGPA();topicConvertCurrency();topicCalcProfit();topicRenderHPOrder();topicMigrateFoundWordsToSavedWords();topicRefreshAllFoundWords();},50);}
window.topicFlipFC=topicFlipFC;window.topicNavFC=topicNavFC;window.topicBuildCyberQuery=topicBuildCyberQuery;window.topicSetVibe=topicSetVibe;window.topicSetTea=topicSetTea;window.topicSetEmailTpl=topicSetEmailTpl;window.topicConvertGPA=topicConvertGPA;window.topicConvertCurrency=topicConvertCurrency;window.topicToggleHP=topicToggleHP;window.topicCalcProfit=topicCalcProfit;window.topicNextQuiz=topicNextQuiz;window.topicInitSkinQuiz=topicInitSkinQuiz;window.topicCopyText=topicCopyText;window.topicCopyElText=topicCopyElText;window.topicAddFoundWord=topicAddFoundWord;window.topicDeleteFoundWord=topicDeleteFoundWord;window.topicRefreshFoundWords=topicRefreshFoundWords;window.topicRefreshAllFoundWords=topicRefreshAllFoundWords;window.topicMigrateFoundWordsToSavedWords=topicMigrateFoundWordsToSavedWords;window.topicSetMakeupYoutubeChannel=topicSetMakeupYoutubeChannel;window.topicSetFoodYoutubeChannel=topicSetFoodYoutubeChannel;window.topicOpenBaiduSearch=topicOpenBaiduSearch;window.topicBaiduKeydown=topicBaiduKeydown;window.topicBaiduSearchFromInput=topicBaiduSearchFromInput;window.topicBaiduQuickSearch=topicBaiduQuickSearch;window.topicTermListSetCat=topicTermListSetCat;window.topicTermListSetSort=topicTermListSetSort;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initTopicWidgets);else initTopicWidgets();
})();
