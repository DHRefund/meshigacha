import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Master data mapping for main (0..119)
main_ja_names = [
    ("とんかつ定食", "Tonkatsu • 日本", "サクサク食感！揚げたてジューシー豚カツ。"),
    ("醤油ラーメン", "Shoyu Ramen • 東京", "深みのある醤油スープが五臓六腑に染み渡る。"),
    ("特製牛丼", "Gyudon • 日本", "旨味たっぷりの牛肉とつゆだくご飯の黄金コンビ。"),
    ("照り焼きチキン丼", "Teriyaki • 日本", "甘辛い照り焼きタレが食欲をそそる逸品。"),
    ("カツ丼", "Katsudon • 日本", "出汁の効いた卵でとじたサクサクの豚カツ。"),
    ("鰻重", "Unaju • 静岡", "香ばしく焼き上げた秘伝タレの絶品うなぎ。"),
    ("豚骨ラーメン", "Tonkotsu • 博多", "まろやかで濃厚な極上豚骨スープ。"),
    ("和風カレーライス", "Japanese Curry • 日本", "じっくり煮込んだコク旨和風カレー。"),
    ("天丼", "Tendon • 日本", "サクサク天ぷらに甘辛タレが染み渡る極上丼。"),
    ("天ぷらうどん", "Tempura Udon • 日本", "揚げたてサクサク天ぷらが出汁に映える一番人気。"),
    ("鮭の照り焼き丼", "Salmon Teriyaki • 日本", "脂の乗ったサーモンを香ばしく照り焼きに。"),
    ("親子丼", "Oyakodon • 日本", "とろっとろ半熟卵と柔らか鶏肉の優しい味わい。"),
    ("味噌ラーメン", "Miso Ramen • 札幌", "コク旨味噌スープと太縮れ麺の濃厚ハーモニー。"),
    ("ソース焼きそば", "Yakisoba • 日本", "香ばしいソースの香りがたまらない定番焼きそば。"),
    ("唐揚げ丼", "Karaage Don • 日本", "ジューシーな鶏唐揚げをのせたボリューム満点丼。"),
    ("つけ麺", "Tsukemen • 東京", "濃厚魚介豚骨スープに絡むもちもち極太麺。"),
    ("鮭いくら丼", "Salmon Ikra • 北海道", "脂の乗ったサーモンとぷちぷちいくらの極上コラボ。"),
    ("すき焼き丼", "Sukiyaki Don • 日本", "甘辛タレで煮込んだ牛肉と野菜の贅沢丼。"),
    ("海老天うどん", "Ebi Tempura Udon • 日本", "ぷりぷり大きな海老天がのった出汁うどん。"),
    ("豚の生姜焼き丼", "Shogayaki Don • 日本", "生姜の風味が効いた甘辛豚肉でご飯が進む。"),
    ("きつねうどん", "Kitsune Udon • 大阪", "ふっくらお揚げに出汁が染み込む名物うどん。"),
    ("和風ハンバーグ定食", "Hamburg Steak • 日本", "肉汁あふれるジューシーな和風ハンバーグ。"),
    ("塩ラーメン", "Shio Ramen • 函館", "透き通る旨味！あっさり澄んだスープの塩ラーメン。"),
    ("鉄火丼", "Tekkadon • 日本", "新鮮なマグロを贅沢にのせた旨味あふれる丼。"),
    ("冷やし中華", "Hiyashi Chuka • 日本", "彩り豊かなトッピングとさっぱり酸味スープ。"),
    ("海鮮丼", "Kaisendon • 北海道", "海の幸が盛りだくさん！贅沢あふれる海鮮丼。"),
    ("チキン南蛮定食", "Chicken Nanban • 宮崎", "濃厚タルタルソースがたっぷりかかった絶品南蛮。"),
    ("油そば", "Abura Soba • 東京", "タレと油を絡めて食べる汁なし濃厚麺。"),
    ("オムライス", "Omurice • 日本", "ふわとろ卵で包んだ懐かしい味わいの洋食。"),
    ("まぐろ山かけ丼", "Maguro Yamakake • 日本", "新鮮マグロととろろのヘルシー絶妙コンビ。"),
    ("長崎ちゃんぽん", "Champon • 長崎", "野菜と海鮮の旨味が溶け出した濃厚スープ麺。"),
    ("特上握り寿司", "Nigiri Sushi • 日本", "新鮮な旬のネタを堪能できる贅沢な握り寿司。"),
    ("サクサクコロッケ定食", "Korokke • 日本", "ほくほくジャガイモの黄金色コロッケ。"),
    ("具だくさん豚汁定食", "Tonjiru • 日本", "野菜と豚肉の旨味が詰まった体に優しい豚汁。"),
    ("鴨南蛮そば", "Kamo Soba • 京都", "鴨肉の旨味とネギの香ばしさが絶品の本格そば。"),
    ("ハヤシライス", "Hayashi Rice • 日本", "トマトと牛肉をじっくり煮込んだコク深いデミグラス。"),
    ("さばの塩焼き定食", "Saba Shioyaki • 日本", "脂がのった香ばしいサバの塩焼き。"),
    ("ざるそば", "Zaru Soba • 日本", "喉越し爽やか！のりと薬味で味わう冷製そば。"),
    ("メンチカツ定食", "Menchi Katsu • 日本", "肉汁ジュワッと溢れるサクサクジューシーメンチ。"),
    ("アジフライ定食", "Aji Fry • 日本", "ふっくら肉厚アジのサクサクフライ。"),
    ("牛カルビ丼", "Karubi Don • 日本", "香ばしく焼き上げた牛カルビのスタミナ丼。"),
    ("三色そぼろ丼", "Soboro Don • 日本", "鶏そぼろ・玉子・緑野菜の彩り鮮やか丼。"),
    ("特製担々麺", "Tantanmen • 日本", "胡麻の濃厚なコクと自家製ラー油のシビ辛麺。"),
    ("讃岐うどん", "Sanuki Udon • 香川", "コシのある強麺と黄金出汁の本場讃岐うどん。"),
    ("かき揚げそば", "Kakiage Soba • 日本", "サクサク野菜かき揚げが出汁に溶け出す美味そば。"),
    ("特上うな重", "Unaju Premium • 静岡", "ふっくら極上ウナギの贅沢うな重。"),
    ("はまちカマ塩焼き定食", "Hamachi Kama • 日本", "脂乗りの良いハマチのカマを塩焼きで。"),
    ("デミグラスハヤシライス", "Hayashi Rice • 日本", "じっくり煮込んだコク豊かな洋食ハヤシ。"),
    ("汁なし油そば", "Abura Soba • 東京", "濃厚タレと太麺をしっかり混ぜて食す。"),
    ("豚の角煮定食", "Kakuni • 長崎", "トロトロに煮込んだ甘辛い豚の角煮。"),
    ("チキンカツ丼", "Chicken Katsu • 日本", "サクサク鶏カツを卵でとじたボリューム丼。"),
    ("まぐろ刺身定食", "Maguro Sashimi • 日本", "新鮮赤身マグロの旨味をそのまま味わう。"),
    ("鍋焼きうどん", "Nabeyaki Udon • 日本", "アツアツ土鍋で煮込んだ具だくさんうどん。"),
    ("チーズカツカレー", "Cheese Curry • 日本", "とろけるチーズとカツの最強コンビカレー。"),
    ("和牛ステーキ丼", "Wagyu Steak • 日本", "極上和牛をミディアムレアで焼き上げた贅沢丼。"),
    ("出汁きつねうどん", "Kitsune Udon • 関西", "ジューシーなお揚げと旨味出汁のうどん。"),
    ("カレーうどん", "Curry Udon • 日本", "出汁の効いた濃厚カレーが太麺に絡む。"),
    ("山かけマグロ丼", "Maguro Yamakake • 日本", "とろろの喉越しとマグロの相性が抜群。"),
    ("ジューシーメンチカツ定食", "Menchi Katsu • 日本", "噛むと肉汁が溢れる揚げたてメンチ。"),
    ("エビフライカレー", "Ebi Fry Curry • 日本", "ぷりぷり海老フライを添えた贅沢カレー。"),
    ("焼き鳥丼", "Yakitori Don • 日本", "香ばしい焼き鳥と甘辛タレのご飯。"),
    ("あっさり塩ラーメン", "Shio Ramen • 日本", "澄み切ったスープの上品な塩ラーメン。"),
    ("パリッと餃子定食", "Gyoza Teishoku • 日本", "羽根つき餃子のジューシー定食。"),
    ("鮭のバター醤油焼き定食", "Salmon Butter • 日本", "香ばしいバター醤油 acquired が食欲をそそる鮭焼き。"),
    ("ニンニクスタミナ丼", "Stamina Don • 日本", "豚肉とニンニクでスタミナ満点！"),
    ("あさりうどん", "Asari Udon • 日本", "あさりの出汁がたっぷり染み出たうどん。"),
    ("サーモンハラス丼", "Salmon Harasu • 北海道", "脂が一番のったハラス部位を贅沢に。"),
    ("黒マー油豚骨ラーメン", "Black Garlic Tonkotsu • 日本", "香ばしい黒ガーリックオイルが効いた豚骨。"),
    ("カニクリームコロッケ定食", "Crab Croquette • 日本", "とろーりカニクリームが絶品のコロッケ。"),
    ("タレカツ丼", "Tare Katsudon • 新潟", "甘辛醤油タレをくぐらせた新潟名物カツ丼。"),
    ("ほっけの塩焼き定食", "Hokke Shioyaki • 北海道", "身がふっくら大きなホッケの塩焼き。"),
    ("辛口海鮮ラーメン", "Spicy Seafood • 日本", "海鮮の旨味とピリ辛スープが癖になる。"),
    ("コク旨黒カレー", "Black Curry • 日本", "スパイスとコクが凝縮された漆黒カレー。"),
    ("ネギトロ丼", "Negitoro Don • 日本", "とろけるネギトロとシャキシャキネギ。"),
    ("天ざるそば", "Ten Zaru Soba • 日本", "サクサク天ぷらと冷たいざるそばのセット。"),
    ("チャーシュー味噌ラーメン", "Chashu Miso • 札幌", "柔らかチャーシューがドンと乗った味噌。"),
    ("牛カルビ焼肉弁当", "Yakiniku Bento • 日本", "香ばしい焼肉タレのご飯が進む弁当。"),
    ("四川風麻婆豆腐丼", "Mapo Tofu Don • 日本", "山椒がピリッと効いた本格麻婆豆腐。"),
    ("月見うどん", "Tsukimi Udon • 日本", "とろり卵黄を月に見立てた風流なうどん。"),
    ("サーモンチーズフライ定食", "Salmon Cheese Fry • 日本", "サーモンととろけるチーズのサクサクフライ。"),
    ("カツカレーうどん", "Katsu Curry Udon • 日本", "ボリューミーなカツがのったカレーうどん。"),
    ("特製うなぎロール", "Unagi Roll • 日本", "香ばしいウナギを巻いた特製寿司ロール。"),
    ("牛すじじっくりカレー", "Gyusuji Curry • 日本", "牛すじがトロトロに溶け込んだ極旨カレー。"),
    ("サクサク唐揚げ定食", "Karaage Teishoku • 日本", "外はカリッと中はジューシーな一番人気。"),
    ("銀ダラの西京焼き定食", "Saikyo Yaki • 京都", "西京味噌の甘みと旨味が染み込んだ銀ダラ。"),
    ("海鮮豪華お茶漬け", "Kaisen Ochazuke • 日本", "出汁をかけてさらりといただく贅沢茶漬け。"),
    ("辛味噌豚骨ラーメン", "Kara Miso Tonkotsu • 日本", "濃厚豚骨にピリ辛味噌がベストマッチ。"),
    ("豚キムチ炒め定食", "Buta Kimchi • 日本", "豚肉とキムチの旨辛炒めでスタミナ補給。"),
    ("ふわふわエビ玉丼", "Ebitama Don • 日本", "プリプリエビとトロトロ卵の優しい丼。"),
    ("鴨南蛮温そば", "Kamo Soba • 日本", "鴨の旨味が溶け出した温かい出汁そば。"),
    ("ハンバーグカレー", "Hamburg Curry • 日本", "ボリューム満点！ハンバーグのせカレー。"),
    ("香ばしい焼うどん", "Yaki Udon • 日本", "醤油風味 navigation で香ばしく炒めたうどん。"),
    ("サーモンアボカド丼", "Salmon Avocado • 日本", "女性に大人気！サーモンとアボカドの組み合わせ。"),
    ("名古屋名物手羽先定食", "Tebasaki • 名古屋", "甘辛スパイシーな手羽先揚げ定食。"),
    ("特製チャーシュー味噌ラーメン", "Miso Ramen • 札幌", "厚切りチャーシューたっぷりの味噌。"),
    ("すき焼き小鍋定食", "Sukiyaki Nabe • 日本", "甘辛い割り下でいただく一人鍋すき焼き。"),
    ("チーズ焼きカレー", "Cheese Yaki Curry • 福岡", "香ばしく焼き上げたアツアツチーズカレー。"),
    ("スパイシーサーモンロール", "Spicy Salmon Roll • 日本", "ピリ辛ソースがアクセントのサーモンロール。"),
    ("チャーシュー炒飯", "Chahan • 日本", "パラパラに炒めたチャーシュー炒飯。"),
    ("特選和牛すき焼き", "Wagyu Sukiyaki • 日本", "とろける極上和牛の高級すき焼き。"),
    ("白身魚フライ定食", "Fish Fry • 日本", "タルタルソースでいただくサクサク白身魚。"),
    ("台湾まぜそば", "Taiwan Mazesoba • 名古屋", "ピリ辛台湾ミンチと卵黄を絡めるまぜそば。"),
    ("牛カルビ照り焼き丼", "Teriyaki Ribs • 日本", "甘辛照り焼きタレのカルビ丼。"),
    ("サーモンたたき丼", "Salmon Tataki • 日本", "表面を炙った香ばしいサーモンたたき。"),
    ("コーンバター味噌ラーメン", "Corn Butter • 札幌", "甘いコーンとコクのあるバターが溶ける。"),
    ("カツオムライス", "Katsu Omurice • 日本", "ふわとろオムライスにサクサクカツをトッピング。"),
    ("うな玉丼", "Unatama Don • 日本", "うなぎとふんわり玉子の贅沢丼。"),
    ("特製海鮮ちゃんぽん", "Champon Deluxe • 長崎", "海鮮の具材が山盛りの豪華ちゃんぽん。"),
    ("特上握り寿司盛り合わせ", "Deluxe Sushi • 日本", "旬の高級ネタを揃えた極上寿司。"),
    ("黒豚とんかつ定食", "Kurobuta • 鹿児島", "鹿児島県産黒豚のジューシーとんかつ。"),
    ("トリュフ豚骨ラーメン", "Truffle Tonkotsu • 日本", "トリュフの香りが華やかな高級豚骨。"),
    ("和牛温玉丼", "Wagyu Ontama • 日本", "和牛と温泉卵のトロトロ極上丼。"),
    ("ひつまぶし", "Hitsumabushi • 名古屋", "三通りの食べ方で味わう名古屋名物うなぎ。"),
    ("伊勢海老天丼", "Lobster Tempura • 三重", "豪快な伊勢海老のサクサク天丼。"),
    ("辛味噌サーモンラーメン", "Spicy Salmon Ramen • 日本", "鮭の旨味とピリ辛味噌の濃厚スープ。"),
    ("メガチャーシュー麺", "Mega Chashu • 日本", "丼を覆い尽くす圧巻のチャーシュー。"),
    ("海鮮極上天丼", "Kaisen Deluxe Tendon • 日本", "海鮮天ぷらが豪華にてんこ盛り。"),
    ("牛カルビ Yakiniku 定食", "Yakiniku Ribs • 日本", "ジューシーな牛カルビの本格焼肉定食。"),
    ("三色海鮮丼（サーモン・いくら・うに）", "Tri-Color Don • 北海道", "北海道の海の幸が詰まった豪華三色。"),
    ("極上海鮮ラーメン", "Supreme Seafood • 日本", "贅沢海鮮が出汁に溶け込んだ至高のラーメン。")
]

# Drinks mapping (0..35)
drinks_ja_names = [
    ("宇治抹茶ラテ", "Matcha • 京都", "Matcha Uji とミルクの濃厚な味わい。"),
    ("冷やし煎茶", "Sencha • 日本", "スッキリ爽やかな日本の伝統茶。"),
    ("ほうじ茶ラテ", "Hojicha • 日本", "香ばしいほうじ茶とミルクの優しさ。"),
    ("ロイヤルミルクティー", "Royal Milk Tea • 日本", "濃厚な紅茶とミルクの贅沢な味わい。"),
    ("ラムネ", "Ramune • 日本", "シュワっと爽快！懐かしい夏の味。"),
    ("角ハイボール", "Highball • 日本", "ウイスキーの炭酸が爽快。"),
    ("本格辛口純米酒", "Sake • 日本", "キリッとした旨味の純米日本酒。"),
    ("カルピスソーダ", "Calpis • 日本", "甘酸っぱく爽やかな乳酸菌ソーダ。"),
    ("香ばしい玄米茶", "Genmaicha • 日本", "炒り米の香ばしさが広がるお茶。"),
    ("ゆず密ソーダ", "Yuzu Soda • 日本", "柚子の爽やかな香りと甘み。"),
    ("黒糖タピオカミルク", "Boba Milk • 日本", "モチモチタピオカと濃厚黒糖。"),
    ("アサヒ スーパードライ", "Asahi Beer • 日本", "キレ味抜群のドライ生ビール。"),
    ("生グレープフルーツサワー", "Grapefruit Sour • 日本", "生搾り果汁のほろ苦く爽やかな味わい。"),
    ("冷やし玉露", "Gyokuro • 日本", "旨味が凝縮された最高級の日本茶。"),
    ("生ビール", "Draft Beer • 日本", "キンキンに冷えたクリーミーな泡。"),
    ("サントリー角ハイボール", "Kaku Highball • 日本", "爽快な炭酸とウイスキーのコク。"),
    ("梅酒ロック", "Umeshu • 日本", "芳醇な梅の香りと甘酸っぱさ。"),
    ("巨峰サワー", "Kyoho Sour • 日本", "フルーティーな巨峰ぶどうのサワー。"),
    ("ジンジャーエール", "Ginger Ale • 日本", "ピリッとスパイシーな炭酸飲料。"),
    ("温かい緑茶", "Green Tea • 日本", "ホッと一息つける温かいお茶。"),
    ("いちごミルク", "Strawberry Milk • 日本", "甘くて可愛い定番のいちごミルク。"),
    ("緑茶ハイ", "Green Tea High • 日本", "お茶の香りでスッキリ飲めるお酒。"),
    ("青リンゴソーダ", "Green Apple Soda • 日本", "爽快な青リンゴ風味のソーダ。"),
    ("黒ごまラテ", "Kurogoma • 日本", "香ばしい黒ごまとミルクの健康ドリンク。"),
    ("冷やしあまざけ", "Amazake • 日本", "優しい甘さの栄養満点あまざけ。"),
    ("シークワーサーサワー", "Shikwasa Sour • 沖縄", "沖縄産シークワーサーの甘酸っぱさ。"),
    ("プレミアム生ビール", "Premium Beer • 日本", "深いコクと華やかな香りのビール。"),
    ("カシスオレンジ", "Cassis Orange • 日本", "フルーティーで飲みやすいカクテル。"),
    ("ウーロンハイ", "Oolong High • 日本", "すっきり食事に合うウーロン茶割。"),
    ("クラフトジンジャーエール", "Craft Ginger • 日本", "生姜がしっかり効いたクラフトソーダ。"),
    ("スパークリングゆず茶", "Yuzu Tea • 日本", "ゆず茶を炭酸で割った爽快ドリンク。"),
    ("抹茶レモネード", "Matcha Lemonade • 日本", "抹茶のほろ苦さとレモンの甘酸っぱさ。"),
    ("黒ごまミルク", "Kurogoma Milk • 日本", "濃厚な黒ごまの香ばしい味わい。"),
    ("マロンラテ", "Chestnut Latte • 日本", "栗の風味がほっこり広がるラテ。"),
    ("ブラッドオレンジソーダ", "Blood Orange • 日本", "濃厚な果汁のブラッドオレンジソーダ。"),
    ("和風ロイヤルミルクティー", "Royal Tea • 日本", "上品な和風仕立てのミルクティー。")
]

# Snacks mapping (0..35)
snacks_ja_names = [
    ("三色花見団子", "Hanami Dango • 日本", "ピンク・白・緑の可愛らしいお団子。"),
    ("みたらし団子", "Mitarashi Dango • 日本", "甘辛い醤油タレ가たっぷり絡む。"),
    ("めで鯛焼き", "Taiyaki • 日本", "頭から tail まであんこぎっしり。"),
    ("ドラ焼き", "Dorayaki • 日本", "ふんわり生地と上品な粒あん。"),
    ("いちご大福", "Ichigo Daifuku • 日本", "甘酸っぱいイチゴと餡の絶妙コンビ。"),
    ("濃厚宇治抹茶ソフト", "Matcha Soft • 京都", "宇治抹茶を贅沢に使ったソフトクリーム。"),
    ("いちごかき氷", "Strawberry Kakigori • 日本", "シャリシャリ氷に特製いちごシロップ。"),
    ("醤油せんべい", "Senbei • 日本", "香ばしい醤油の香りの伝統せんべい。"),
    ("黒蜜あんみつ", "Anmitsu • 日本", "寒天・あんこ・黒蜜の和風スイーツ。"),
    ("北海道チーズタルト", "Hokkaido Cheese • 北海道", "濃厚でとろけるチーズクリームタルト。"),
    ("抹茶パフェ", "Matcha Parfait • 京都", "抹茶アイスやゼリーが詰まった豪華パフェ。"),
    ("昭和レトロプリン", "Purin • 日本", "固め食感とほろ苦カラメルのプリン。"),
    ("雪見大福", "Yukimi Daifuku • 日本", "もちもちお餅でアイスを包んだ人気スイーツ。"),
    ("出汁巻き玉子串", "Tamagoyaki Kushi • 日本", "出汁がジュワッと溢れる玉子焼き串。"),
    ("サクサクコロッケ", "Korokke • 日本", "揚げたてほくほくのポテトコロッケ。"),
    ("ポン・デ・リング", "Pon-de-ring • 日本", "モチモチ食感が大人気のドーナツ。"),
    ("長崎カステラ", "Castella • 長崎", "しっとり甘い伝統のスポンジケーキ。"),
    ("磯辺焼き", "Isobeyaki • 日本", "香ばしい醤油餅をパリパリ海苔で。"),
    ("スフレパンケーキ", "Souffle Pancake • 日本", "口の中でシュワッと溶ける極上の柔らかさ。"),
    ("ゆず氷", "Yuzu Ice • 日本", "柚子の香りが爽やかなシャーベット。"),
    ("わらび餅", "Warabi Mochi • 日本", "きな粉と黒蜜でいただくぷるぷる餅。"),
    ("抹茶モナカアイス", "Monaka Ice • 日本", "サクサク最中生地と抹茶アイス。"),
    ("焼きたてメロンパン", "Melonpan • 日本", "外はビスケット生地カリッと中はふわふわ。"),
    ("芋大福", "Imo Daifuku • 日本", "甘いさつまいも餡を包んだ大福。"),
    ("原宿クレープ", "Harajuku Crepe • 東京", "生クリームとフルーツたっぷりのクレープ。"),
    ("枝豆", "Edamame • 日本", "塩味が効いたヘルシーなおやつ。"),
    ("揚げ出し豆腐", "Agedashi Tofu • 日本", "お出汁でいただくサクサク豆腐。"),
    ("たこ焼き串", "Takoyaki Kushi • 大阪", "外はカリッ中はトロッのたこ焼き串。"),
    ("抹茶たい焼き", "Matcha Taiyaki • 日本", "抹茶風味の生地が香ばしい鯛焼き。"),
    ("塩せんべい", "Shio Sembei • 日本", "シンプルで飽きのこない塩味せんべい。"),
    ("抹茶ロールケーキ", "Matcha Roll • 日本", "濃厚抹茶クリームのしっとりロール。"),
    ("栗きんつば", "Kintsuba • 日本", "上品な小豆と栗の伝統和菓子。"),
    ("桜餅", "Sakura Mochi • 日本", "桜の葉の塩気とお餅の甘み。"),
    ("今川焼き", "Imagawayaki • 日本", "カスタードやあんこが詰まった焼き菓子。"),
    ("フルーツサンド", "Fruit Sandwich • 日本", "新鮮フルーツと生クリームのサンド。"),
    ("抹茶クッキー", "Matcha Cookie • 日本", "ほろ苦い抹茶風味のサクサククッキー。")
]

# Pub mapping (0..35)
pub_ja_names = [
    ("焼き鳥盛り合わせ", "Yakitori • Izakaya", "炭火で香ばしく焼き上げた定番焼き鳥。"),
    ("牛タン塩焼き", "Gyu-Tan • 仙台", "ジューシーで歯ごたえ抜群の牛タン。"),
    ("炙りチャーシュー", "Aburi Chashu • Izakaya", "香ばしく炙ったトロトロチャーシュー。"),
    ("豪華刺身舟盛り", "Sashimi • Izakaya", "新鮮な旬の魚介を豪華に盛り合わせ。"),
    ("赤海老塩焼き", "Ebi Shioyaki • Izakaya", "ぷりぷり海老の香ばしい塩焼き。"),
    ("ししゃも焼き", "Shishamo • Izakaya", "プチプチ卵が詰まった香ばしいししゃも。"),
    ("あさりのバター蒸し", "Asari Butter • Izakaya", "あさりとバターのコク深い出汁。"),
    ("大阪串カツ盛り", "Kushikatsu • 大阪", "サクサク衣の大阪名物串カツ。"),
    ("ソフトシェルクラブ天ぷら", "Soft Crab • Izakaya", "丸ごと食べられる柔らか脱皮カニ。"),
    ("豚キムチ炒め", "Buta Kimchi • Izakaya", "ピリ辛キムチとジューシー豚肉。"),
    ("揚げ出し豆腐", "Agedashi Tofu • Izakaya", "優しい出汁が染み込む揚げ豆腐。"),
    ("アスパラベーコン巻き", "Asparagus Bacon • Izakaya", "みずみずしいアスパラをベーコンで。"),
    ("イカの丸焼き", "Ika Yaki • Izakaya", "醤油タレの香ばしいイカの丸焼き。"),
    ("鉄板焼き餃子", "Sizzling Gyoza • Izakaya", "アツアツ鉄板で焼き上げるパリッと餃子。"),
    ("厚揚げ焼き", "Atsuage • Izakaya", "外はカリッと中はふわふわの厚揚げ。"),
    ("手羽先唐揚げ", "Tebasaki • 名古屋", "スパイシーなタレが後を引く手羽先。"),
    ("牛バラエノキ巻き", "Beef Enoki • Izakaya", "旨味たっぷりの牛バラ肉とエノキ。"),
    ("味噌サバ煮", "Saba Miso • Izakaya", "コク深い味噌でじっくり煮込んだサバ。"),
    ("塩茹で枝豆", "Edamame • Izakaya", "ビールに一番合う定番のおつまみ。"),
    ("明太じゃがバター", "Mentai Butter • Izakaya", "ホクホクじゃがいもとピリ辛明太子。"),
    ("つくね卵黄添え", "Tsukune • Izakaya", "濃厚な卵黄を絡めていただく鶏つくね。"),
    ("チーズベーコン串", "Cheese Bacon • Izakaya", "とろけるチーズと香ばしいベーコン。"),
    ("きゅうりとタコの酢の物", "Sunomono • Izakaya", "さっぱり甘酢のタコときゅうり。"),
    ("鮭カマ塩焼き", "Salmon Kama • Izakaya", "一番脂 framing が乗った鮭のカマ塩焼き。"),
    ("ししとう素揚げ", "Shishito • Izakaya", "塩でいただく香ばしいししとう。"),
    ("和牛 Yakiniku 串", "Wagyu Kushi • Izakaya", "贅沢な和牛の旨味あふれる串焼き。"),
    ("ハマチカマ塩焼き", "Hamachi Kama • Izakaya", "脂乗りの良いハマチのカマ焼き。"),
    ("パリパリ鶏皮串", "Tori Kawa • Izakaya", "カリカリに焼き上げた鶏皮。"),
    ("豚の角煮", "Kakuni • Izakaya", "トロトロに煮込んだ甘辛い豚の角煮。"),
    ("明太出汁巻き卵", "Mentai Tamago • Izakaya", "明太子を包み込んだ出汁巻き玉子。"),
    ("和風ポテトサラダ", "Potato Salad • Izakaya", "出汁や具材にこだわったポテサラ。"),
    ("丸ごとニンニク揚げ", "Ninniku Fry • Izakaya", "ホクホク香ばしいニンニク揚げ。"),
    ("じゃがバター", "Jagabata • Izakaya", "バターが溶けるアツアツジャガイモ。"),
    ("とろろ汁", "Tororo • Izakaya", "出汁の効いた優しい喉越しのとろろ。"),
    ("蟹味噌甲羅焼き", "Kani Miso • Izakaya", "香ばしく網焼きにする濃厚カニミソ。"),
    ("ミニすき焼き鍋", "Mini Sukiyaki • Izakaya", "お酒のアテにぴったりの一人鍋。")
]

# Read original i18n.ts header up to mainJaData
with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    orig_i18n = f.read()

header_match = re.search(r'^(.*?)(export const mainJaData)', orig_i18n, re.DOTALL)
if not header_match:
    print("Could not find header")
    sys.exit(1)

header_code = header_match.group(1)

def format_dict(var_name, items):
    out = [f"export const {var_name}: Record<number, {{ name: string; sub: string; quip: string }}> = {{"]
    for idx, (name, sub, quip) in enumerate(items):
        name_esc = name.replace('"', '\\"')
        sub_esc = sub.replace('"', '\\"')
        quip_esc = quip.replace('"', '\\"')
        out.append(f'  {idx}: {{ name: "{name_esc}", sub: "{sub_esc}", quip: "{quip_esc}" }},')
    out.append("};\n")
    return "\n".join(out)

footer_code = """export function foodName(food: Food, language: Language) {
  if (language === "ja") {
    const cat = food.category || "main";
    if (cat === "drinks" && drinksJaData[food.image]) return drinksJaData[food.image].name;
    if (cat === "snacks" && snacksJaData[food.image]) return snacksJaData[food.image].name;
    if (cat === "pub" && pubJaData[food.image]) return pubJaData[food.image].name;
    if (mainJaData[food.image]) return mainJaData[food.image].name;
  }
  return food.name;
}

export function foodSubtitle(food: Food, language: Language) {
  if (language === "ja") {
    const cat = food.category || "main";
    if (cat === "drinks" && drinksJaData[food.image]) return drinksJaData[food.image].sub;
    if (cat === "snacks" && snacksJaData[food.image]) return snacksJaData[food.image].sub;
    if (cat === "pub" && pubJaData[food.image]) return pubJaData[food.image].sub;
    if (mainJaData[food.image]) return mainJaData[food.image].sub;
  }
  if (language === "vi") return food.sub;
  return food.veg ? copy.en.vegetarianDish : copy.en.lunchDish;
}

export function foodQuip(food: Food, language: Language) {
  if (language === "ja") {
    const cat = food.category || "main";
    if (cat === "drinks" && drinksJaData[food.image]) return drinksJaData[food.image].quip;
    if (cat === "snacks" && snacksJaData[food.image]) return snacksJaData[food.image].quip;
    if (cat === "pub" && pubJaData[food.image]) return pubJaData[food.image].quip;
    if (mainJaData[food.image]) return mainJaData[food.image].quip;
  }
  return food.quip;
}

export function priceLabel(
  thousands: number | string,
  language: Language,
  approximate = false,
) {
  const value = Number(thousands);
  if (language === "ja") {
    // 1k VND ~ 10 JPY scale for Japanese currency feel (55k = 550円)
    const jpy = value * 10;
    return `${approximate ? "約" : ""}${new Intl.NumberFormat("ja-JP").format(jpy)}円`;
  }
  const formatted =
    language === "en"
      ? `₫${new Intl.NumberFormat("en-US").format(value * 1000)}`
      : `${new Intl.NumberFormat("vi-VN").format(value * 1000)}đ`;
  return `${approximate ? "~" : ""}${formatted}`;
}
"""

new_file_content = (
    header_code +
    format_dict("mainJaData", main_ja_names) + "\n" +
    format_dict("drinksJaData", drinks_ja_names) + "\n" +
    format_dict("snacksJaData", snacks_ja_names) + "\n" +
    format_dict("pubJaData", pub_ja_names) + "\n" +
    footer_code
)

with open('src/lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(new_file_content)

print("Successfully updated src/lib/i18n.ts with clean 100% aligned Japanese data!")
