import { Chapter, Scene, Item, Hotspot, Event, Puzzle, Dialog } from '@/types/game';

// 道具定義
export const items: Record<string, Item> = {
  // 第一空間：病房 701
  'pulse_clip': {
    id: 'pulse_clip',
    name: '一次性指尖脈搏夾',
    description: '它不是在量你活著，是在量你值不值。',
    collectible: true,
    usable: true,
  },
  'bed_tag': {
    id: 'bed_tag',
    name: '床腳掛牌：701-07',
    description: '你不是名字，你是床腳的一張紙。',
    collectible: false,
  },
  'yoga_mat': {
    id: 'yoga_mat',
    name: '粉紅瑜珈墊',
    description: '太乾淨了，乾淨得像被反覆擦拭。',
    collectible: true,
  },
  'rusty_hairpin': {
    id: 'rusty_hairpin',
    name: '生鏽髮夾',
    description: '冰冷、帶著時間的腥味。',
    collectible: true,
  },
  'bloody_key': {
    id: 'bloody_key',
    name: '沾血小鑰匙',
    description: '血跡很薄，像被人用酒精擦過一次。',
    collectible: true,
  },
  'uv_light': {
    id: 'uv_light',
    name: 'UV 燈',
    description: 'UV 光像一把很小的審判。',
    collectible: false,
  },
  
  // 第二空間：走廊
  'mirror_shard': {
    id: 'mirror_shard',
    name: '鏡片碎角',
    description: '它不鋒利，但足夠讓人誤以為自己還能反擊。',
    collectible: true,
  },
  'note': {
    id: 'note',
    name: '值班表背面的便條',
    description: '主任只簽同意書，不親手執行。',
    collectible: true,
  },
  'blood_number': {
    id: 'blood_number',
    name: '血跡數字：801',
    description: '密碼盤解鎖的瞬間，你聽到一聲輕微的「喀」。\n\n從鏡子反射中，你看到牆上模糊的塗鴉突然清晰起來——那不是塗鴉，是血跡寫成的數字：801。\n\n你突然想起：那是你被帶走前的最後一個地址。801號房。你以為那是你的家，但現在你明白了——那只是你被「登記」的地方。\n\n你的名字不是名字，是編號。你的家不是家，是倉庫。',
    collectible: true,
  },
  
  // 第三空間：病房 702
  'recorder': {
    id: 'recorder',
    name: '錄音筆',
    description: '按下去的那刻，你聽見別人的良心在漏電。',
    collectible: true,
    usable: true,
  },
  'consent_form': {
    id: 'consent_form',
    name: '撕裂的同意書一角',
    description: '你從沒同意任何事，但他們的文件總會替你點頭。',
    collectible: true,
  },
  'diary': {
    id: 'diary',
    name: '日記本',
    description: '有人在觀察你，還替你寫傳記。',
    collectible: true,
    usable: true,
  },
  'door_handle': {
    id: 'door_handle',
    name: '陽台落地窗手把',
    description: '它曾經是門的一部分，現在像遺物。',
    collectible: true,
  },
  'termination_notice': {
    id: 'termination_notice',
    name: '實驗終止通知書',
    description: '《實驗終止通知書》：07號，達標，進入收割排程。\n你以為終止的是實驗，終止的其實是你。',
    collectible: true,
  },
  
  // 第四空間：702 陽台
  'blank_nameplate': {
    id: 'blank_nameplate',
    name: '醫療束縛帶上的病患名牌',
    description: '空白最可怕，因為你會被寫上去。',
    collectible: true,
  },
  'pain_patch': {
    id: 'pain_patch',
    name: '裂開的止痛貼片盒',
    description: '有人在幫你，也有人在「管理」你的痛。',
    collectible: true,
    usable: true,
  },
  'rust_remover': {
    id: 'rust_remover',
    name: '除鏽劑',
    description: '這裡連希望都被安排在盆底。',
    collectible: true,
  },
  'ceramic_shard': {
    id: 'ceramic_shard',
    name: '陶瓷破片',
    description: '像潔白的凶器。',
    collectible: true,
  },
  
  // 第五空間：二樓露台
  'cold_chain_label': {
    id: 'cold_chain_label',
    name: '冷鏈運輸標籤',
    description: 'TEMP: 2–8°C / DEST: 研究所 / CONTENT: VITAL\n\n原來你要去的地方不是出口，是下一站。\n這不是逃生路線，是物流路線。',
    collectible: true,
  },
  'runner_bracelet': {
    id: 'runner_bracelet',
    name: '破裂的識別手環',
    description: '你把它扯斷那刻，才第一次覺得自己有力氣。',
    collectible: true,
  },
  'id_card': {
    id: 'id_card',
    name: '身份證',
    description: '你以為自己只是醒來，原來你一直在被選中。',
    collectible: true,
    usable: true,
  },
};

// 廣播對話
const broadcasts: Record<string, Dialog> = {
  first: {
    text: '701，07號。醒了就不要浪費氧氣。',
    type: 'broadcast',
  },
  second: {
    text: '07號，請保持心率在「漂亮」的範圍內。',
    type: 'broadcast',
  },
  third: {
    text: '實驗體 07 體能已達標，準備收割。……請勿弄髒地面。',
    type: 'broadcast',
  },
  fourth: {
    text: '07號，不要摔壞。',
    type: 'broadcast',
  },
};

// 場景資料
export const scenes: Record<string, Scene> = {
  'ch1_sc1': {
    id: 'ch1_sc1',
    chapterId: 'ch1',
    name: '病房 701',
    description: '你睜眼的第一秒不是光，而是白到刺痛的牆。',
    background: '/images/bg_ch1_sc1_v1.png',
    hotspots: [
      {
        id: 'bed',
        shape: 'rect',
        coords: [0.1, 0.45, 0.3, 0.75],
        description: '床',
        hint: '床單被折得太平整，像從沒有人躺過。',
      },
      {
        id: 'bed_tag_spot',
        shape: 'rect',
        coords: [0.03, 0.80, 0.13, 0.90],
        description: '床腳掛牌',
        hint: '你不是名字，你是床腳的一張紙。',
      },
      {
        id: 'drawer',
        shape: 'rect',
        coords: [0.35, 0.65, 0.55, 0.85],
        description: '抽屜',
        hint: '抽屜似乎可以打開，但需要工具才能撬開。',
      },
      {
        id: 'yoga_mat_spot',
        shape: 'rect',
        coords: [0.36, 0.5, 0.56, 0.7],
        description: '粉紅瑜珈墊',
        hint: '太乾淨了，乾淨得像被反覆擦拭。',
      },
      {
        id: 'emergency_box',
        shape: 'rect',
        coords: [0.55, 0.35, 0.69, 0.49],
        description: '緊急呼叫盒',
        hint: '沒有電話，只有 UV 燈。點擊開啟查看。',
      },
      {
        id: 'door',
        shape: 'rect',
        coords: [0.65, 0.4, 0.80, 0.8],
        description: '門',
        hint: '需要密碼才能打開。',
      },
      {
        id: 'pulse_clip_spot',
        shape: 'rect',
        coords: [0.0, 0.5, 0.15, 0.6],
        description: '脈搏夾',
        hint: '它不是在量你活著，是在量你值不值。點擊收集後可在背包中使用。',
      },
      {
        id: 'iv_drip_wheel',
        shape: 'rect',
        coords: [0.15, 0.3, 0.25, 0.4],
        description: '點滴架輪子',
        hint: '輪縫卡著一撮粉紅纖維。',
      },
      {
        id: 'pillow_label',
        shape: 'rect',
        coords: [0.12, 0.4, 0.22, 0.5],
        description: '枕頭套的洗滌標籤',
        hint: '上面不是尺寸，是「07」與一串洗滌溫度。',
      },
    ],
    items: [
      items.pulse_clip,
      items.bed_tag,
      items.yoga_mat,
      items.rusty_hairpin,
      items.bloody_key,
    ],
    events: [
      {
        id: 'pickup_pulse_clip',
        name: '拿起脈搏夾',
        description: '當你拿起脈搏夾時，廣播響起。',
        requirements: [
          { type: 'hasItem', itemId: 'pulse_clip' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你拿起脈搏夾，塑膠外殼有乾掉的白色粉末；夾口內側黏著一根短毛。\n\n它不是在量你活著，是在量你值不值。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'use_pulse_clip',
        name: '使用脈搏夾',
        description: '使用脈搏夾測量數據，觸發廣播。',
        requirements: [
          { type: 'hasItem', itemId: 'pulse_clip' },
          { type: 'hasFlag', flag: 'pulse_clip_used', value: true },
        ],
        effects: [
          { type: 'showDialog', dialog: broadcasts.first },
        ],
        oneTime: true,
      },
      {
        id: 'examine_yoga_mat',
        name: '檢查瑜珈墊',
        description: '你在瑜珈墊中發現生鏽髮夾。',
        requirements: [
          { type: 'hasItem', itemId: 'yoga_mat' },
        ],
        effects: [
          { type: 'addItem', itemId: 'rusty_hairpin' },
          {
            type: 'showDialog',
            dialog: {
              text: '你把墊子攤開，粉紅色像某種過於樂觀的謊。太乾淨了，乾淨得像被反覆擦拭。\n\n捲起來的中心硬得不自然——你摸到金屬，冰冷、帶著時間的腥味。那是一根生鏽的髮夾，藏在粉紅色的偽裝裡。\n\n粉紅不是溫柔，是最後一點不肯熄滅的火。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'try_open_drawer',
        name: '嘗試打開抽屜',
        description: '抽屜被鎖住了，需要工具才能打開。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'drawer' },
          { 
            type: 'custom', 
            customCheck: (state) => !state.inventory.includes('rusty_hairpin')
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '抽屜被鎖住了。你需要工具才能撬開它。',
              type: 'system',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'open_drawer',
        name: '撬開抽屜',
        description: '用生鏽髮夾撬開抽屜。',
        requirements: [
          { type: 'hasItem', itemId: 'rusty_hairpin' },
          { type: 'hasInteracted', hotspotId: 'drawer' },
        ],
        effects: [
          { type: 'addItem', itemId: 'bloody_key' },
          {
            type: 'showDialog',
            dialog: {
              text: '你用生鏽髮夾撬開抽屜。金屬摩擦的聲音像指甲刮過黑板，但更糟——那是你骨頭深處的記憶。\n\n抽屜打開那瞬間，先不是物品映入眼簾，而是一股陳舊的鐵鏽味——和你嘴裡的血腥同一種語言。\n\n裡面躺著一把小鑰匙，上面有薄薄的血跡，像被人用酒精擦過一次。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'drawer_opened', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'use_uv_light',
        name: '使用 UV 燈',
        description: 'UV 光照出牆上的運動數據。',
        requirements: [
          { type: 'hasFlag', flag: 'uv_light_on', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: 'UV 光像一把很小的審判，照出牆上兩行運動數據：\n\nSquat: 120kg\nBench: 80kg\n\n你突然明白：有人不是在治療你，是在訓練你。\n\n醫院把你當健身房，健身房把你當屠宰場。\n\n這些數字不是記錄，是標價。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'uv_revealed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'door_code',
        type: 'input',
        solution: '12080',
        hint: '你的體能狀況很好吧？',
        onSolve: [
          { type: 'setFlag', flag: 'door_701_open', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '門鎖解除的聲音太溫柔了，像護士輕聲說：「乖，輪到你了。」',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '你睜眼的第一秒不是光，而是白到刺痛的牆。\n\n鼻腔裡全是消毒水的「乾淨」——乾淨得像要把你這個人擦掉。床單被折得太平整，像從沒有人躺過；但你的肩胛骨卻記得某種長期被束縛的痠。\n\n牆上那張破損的「病人守則」被撕走一角，像有人故意不讓你看到完整規則。\n\n你試著移動，發現自己還能動。但這裡的每一寸空氣都在告訴你：你不是病人，你是被編號的價值。',
      type: 'narrator',
    },
  },
  
  'ch1_sc2': {
    id: 'ch1_sc2',
    chapterId: 'ch1',
    name: '走廊',
    description: '走廊像被拉長的冷白色傷口。兩側掛著破碎的鏡子，每一片都映出你不同的角度——但沒有一片完整地映出「你」。燈光閃爍不是恐怖片那種誇張，而是更像電壓不足：這裡的恐怖是「省電」的。',
    background: '/images/bg_ch1_sc2_v1.png',
    hotspots: [
      {
        id: 'mirror',
        shape: 'rect',
        coords: [0.1, 0.2, 0.35, 0.65],
        description: '破碎的鏡子',
        hint: '破碎的鏡面映出你支離破碎的倒影。它把你還給你，但先把你撕碎。',
      },
      {
        id: 'mirror_shard_spot',
        shape: 'rect',
        coords: [0.08, 0.87, 0.11, 0.93],
        description: '地上的鏡片碎角',
        hint: '一小片鏡子碎片掉在地上，邊緣鋒利。',
      },
      {
        id: 'duty_schedule',
        shape: 'rect',
        coords: [-0.05, 0.3, 0.15, 0.5],
        description: '值班表',
        hint: '背面似乎有字。',
      },
      {
        id: 'beds',
        shape: 'rect',
        coords: [0.5, 0.5, 0.9, 0.8],
        description: '移動病床',
        hint: '每張床上有字母標籤，但字跡模糊。你需要工具才能看清。',
      },
      {
        id: 'password_panel',
        shape: 'rect',
        coords: [0.96, 0.96, 0.99, 0.99],
        description: '密碼盤',
        hint: '從鏡子裡看是反的。',
      },
      {
        id: 'door_702',
        shape: 'rect',
        coords: [0.35, 0.15, 0.65, 0.4],
        description: '702號病房',
        hint: '門緊閉著，無法進入。',
      },
      {
        id: 'rubber_glove',
        shape: 'rect',
        coords: [0.4, 0.7, 0.5, 0.8],
        description: '地上的橡膠手套',
        hint: '手套內側用筆寫：OBSERVE ONLY',
      },
      {
        id: 'cleaning_cart_nameplate',
        shape: 'rect',
        coords: [0.05, 0.6, 0.15, 0.7],
        description: '牆角的清潔推車名牌',
        hint: '名牌上只剩職位：實習生',
      },
    ],
    items: [
      items.mirror_shard,
      items.note,
      items.blood_number,
    ],
    events: [
      {
        id: 'pickup_mirror_shard',
        name: '收集鏡片碎角',
        description: '你撿起地上的鏡片碎角。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'mirror_shard_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'mirror_shard' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：鏡片碎角\n\n一小片破碎的鏡子，邊緣鋒利。它不鋒利，但足夠讓人誤以為自己還能反擊。',
              type: 'item',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'read_duty_schedule',
        name: '查看值班表',
        description: '你翻轉值班表，看到背面的便條。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'duty_schedule' },
        ],
        effects: [
          { type: 'addItem', itemId: 'note' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：值班表背面的便條\n\n用急促筆跡寫著：\n「主任只簽同意書，不親手執行。」',
              type: 'item',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'read_note',
        name: '閱讀便條',
        description: '你再次查看便條內容。',
        requirements: [
          { type: 'hasItem', itemId: 'note' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你再次查看便條：\n\n「主任只簽同意書，不親手執行。」',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'use_mirror_shard_on_beds',
        name: '用鏡片碎角觀察病床',
        description: '你用鏡片碎角反射光線，看清了病床上的標籤。',
        requirements: [
          { type: 'hasItem', itemId: 'mirror_shard' },
          { type: 'hasInteracted', hotspotId: 'beds' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '透過鏡片碎角的反射，你看到每張病床上都有模糊的標籤：\n\n「主任」、「主治」、「住院」、「護理師」、「實習生」\n\n這些標籤需要按照權力等級排列。便條上的線索突然有了意義。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'beds_labels_revealed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'arrange_beds',
        name: '排列病床',
        description: '按照職位高低排列病床。',
        requirements: [
          { type: 'custom', customCheck: (state) => state.flags.beds_arranged === true },
        ],
        effects: [
          { 
            type: 'showDialog', 
            dialog: broadcasts.second,
          },
          {
            type: 'showDialog',
            dialog: {
              text: '每張移動病床上的字母像屍體上的標籤。你把床推動時，輪子會發出像骨頭磨地的聲音。\n\n排好後俯瞰，字母連成方向，像有人在空中替你指路。\n\n有人安排你逃跑；更恐怖的是——你不知道他是救你，還是在放你出去「示範」。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'mirror_password',
        type: 'input',
        solution: '801',
        hint: '你站到特定位置，從鏡子裡看到牆上的塗鴉不是亂寫，而像某人臨死前留下的數字。從鏡子裡看密碼盤是反的，但數字依然清晰。',
        onSolve: [
          { type: 'setFlag', flag: 'mirror_solved', value: true },
          { type: 'addItem', itemId: 'blood_number' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：血跡數字：801\n\n密碼盤解鎖的瞬間，你聽到一聲輕微的「喀」。\n\n從鏡子反射中，你看到牆上模糊的塗鴉突然清晰起來——那不是塗鴉，是血跡寫成的數字：801。\n\n你突然想起：那是你被帶走前的最後一個地址。801號房。你以為那是你的家，但現在你明白了——那只是你被「登記」的地方。\n\n你的名字不是名字，是編號。你的家不是家，是倉庫。',
              type: 'item',
            },
          },
        ],
      },
      {
        id: 'bed_arrangement',
        type: 'arrangement',
        solution: ['主任', '主治', '住院', '護理師', '實習生'],
        hint: '按照職位高低排序。每張移動病床上的字母像屍體上的標籤。你把床推動時，輪子會發出像骨頭磨地的聲音。\n\n提示：便條上提到「主任只簽同意書，不親手執行」，這暗示了權力等級。\n\n請依序點選職位，按照權力等級從高到低排列。',
        requirements: [
          { type: 'hasItem', itemId: 'mirror_shard' },
          { type: 'hasFlag', flag: 'beds_labels_revealed', value: true },
        ],
        onSolve: [
          { type: 'setFlag', flag: 'beds_arranged', value: true },
          { type: 'setFlag', flag: 'door_702_open', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '排好後俯瞰，字母連成方向，像有人在空中替你指路。\n\n遠處傳來「喀」的一聲輕響，702號病房的門似乎打開了。',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '走廊像被拉長的冷白色傷口。兩側掛著破碎的鏡子，每一片都映出你不同的角度——但沒有一片完整地映出「你」。\n\n燈光閃爍不是恐怖片那種誇張，而是更像電壓不足：這裡的恐怖是「省電」的。\n\n你往前走，每一步都像踩在別人的影子上。',
      type: 'narrator',
    },
  },
  
  'ch1_sc3': {
    id: 'ch1_sc3',
    chapterId: 'ch1',
    name: '病房 702',
    description: '702 比 701 豪華：有沙發、有衣櫃、有更大的窗。但「豪華」在這裡像嘲諷：打鬥痕跡留在牆角，地毯上有被拖拽的毛邊，像有人曾經用盡力氣想把自己從這裡拖出去。',
    background: '/images/bg_ch1_sc3_v1.png',
    hotspots: [
      {
        id: 'recorder_spot',
        shape: 'rect',
        coords: [0.05, 0.6, 0.2, 0.7],
        description: '錄音筆',
        hint: '按下去的那刻，你聽見別人的良心在漏電。',
      },
      {
        id: 'pillow',
        shape: 'rect',
        coords: [0.2, 0.25, 0.4, 0.45],
        description: '枕頭',
        hint: '枕頭下似乎有東西。',
      },
      {
        id: 'bedside_table',
        shape: 'rect',
        coords: [0.1, 0.5, 0.25, 0.65],
        description: '床頭櫃',
        hint: '床頭櫃的抽屜似乎可以打開。',
      },
      {
        id: 'wardrobe',
        shape: 'rect',
        coords: [0.5, 0.25, 0.8, 0.6],
        description: '衣櫃',
        hint: '衣櫃門緊閉。',
      },
      {
        id: 'monitor',
        shape: 'rect',
        coords: [0.6, 0.05, 0.9, 0.2],
        description: '監控螢幕',
        hint: '螢幕突然亮起。',
      },
      {
        id: 'sofa_gap',
        shape: 'rect',
        coords: [0.3, 0.6, 0.45, 0.75],
        description: '沙發縫隙',
        hint: '沙發的縫隙裡似乎有什麼東西。',
      },
      {
        id: 'window',
        shape: 'rect',
        coords: [0.7, 0.5, 0.95, 0.8],
        description: '落地窗',
        hint: '需要手把才能打開。',
      },
      {
        id: 'size_tag',
        shape: 'rect',
        coords: [0.52, 0.28, 0.58, 0.38],
        description: '衣櫃內的尺碼吊牌',
        hint: 'S / M / L / Runner',
      },
      {
        id: 'carpet_fray',
        shape: 'rect',
        coords: [0.45, 0.65, 0.65, 0.75],
        description: '地毯毛邊的方向',
        hint: '毛邊被拖出一條弧線。',
      },
    ],
    items: [
      items.recorder,
      items.consent_form,
      items.diary,
      items.door_handle,
      items.termination_notice,
    ],
    events: [
      {
        id: 'pickup_recorder',
        name: '獲得錄音筆',
        description: '你拿起錄音筆。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'recorder_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'recorder' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：錄音筆\n\n按下去的那刻，你聽見別人的良心在漏電。',
              type: 'item',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'play_recorder',
        name: '播放錄音',
        description: '你按下錄音筆的播放鍵。',
        requirements: [
          { type: 'hasItem', itemId: 'recorder' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '……她每天都練，像要把骨頭練成門。主任說：「這種供體最漂亮。」我不想再聽到那個詞了……',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'pickup_diary',
        name: '獲得日記本',
        description: '你從枕頭下找到日記本。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'pillow' },
        ],
        effects: [
          { type: 'addItem', itemId: 'diary' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：日記本\n\n你翻開時，紙張乾燥得像被烘過。\n文字卻像潮濕：\n「那個粉紅色的墊子是她唯一的堅持，她每天在 701 瘋狂訓練，她想逃出去。」\n\n你讀到「她」的時候，心臟會漏拍：你明明就是「我」。為什麼有人用第三人稱寫你？\n有人在觀察你，還替你寫傳記。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'diary_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'read_diary',
        name: '閱讀日記',
        description: '你再次翻開日記本。',
        requirements: [
          { type: 'hasItem', itemId: 'diary' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你再次翻開日記：\n\n「那個粉紅色的墊子是她唯一的堅持，她每天在 701 瘋狂訓練，她想逃出去。」\n\n你讀到「她」的時候，心臟會漏拍：你明明就是「我」。為什麼有人用第三人稱寫你？',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'pickup_consent_form',
        name: '獲得同意書',
        description: '你從床頭櫃中找到同意書。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'bedside_table' },
        ],
        effects: [
          { type: 'addItem', itemId: 'consent_form' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：撕裂的同意書一角\n\n你從沒同意任何事，但他們的文件總會替你點頭。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'consent_form_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_consent_form',
        name: '仔細查看同意書',
        description: '你翻轉同意書，查看背面。',
        requirements: [
          { type: 'hasItem', itemId: 'consent_form' },
          { type: 'hasFlag', flag: 'diary_read', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你翻轉同意書，發現背面有一行用鉛筆寫的小字：\n\n「手把在沙發縫隙裡。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'handle_location_revealed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'wardrobe_jump_scare',
        name: '衣櫃爆開',
        description: '衣櫃門突然彈開，假人彈出。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'wardrobe' },
          { type: 'hasFlag', flag: 'diary_read', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '衣櫃門像被彈簧推開，假人穿粉紅瑜珈服，動作僵硬地做著「下犬式」，但頭部角度不可能。\n\n它手上那張紙寫著：\n**《實驗終止通知書》：07號，達標，進入收割排程。**\n\n獲得：實驗終止通知書\n\n你以為終止的是實驗，終止的其實是你。',
              type: 'item',
            },
          },
          { type: 'addItem', itemId: 'termination_notice' },
          { type: 'setFlag', flag: 'jump_scare_triggered', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'monitor_activation',
        name: '監控螢幕亮起',
        description: '監控螢幕突然顯示畫面。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'monitor' },
          { type: 'hasFlag', flag: 'jump_scare_triggered', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '監控螢幕突然亮起，顯示你在 701 病房訓練的畫面。\n\n**廣播台詞（第三次）**：\n**「實驗體 07 體能已達標，準備收割。……請勿弄髒地面。」**',
              type: 'broadcast',
            },
          },
          { type: 'setFlag', flag: 'monitor_activated', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'find_handle',
        name: '從沙發縫隙找到手把',
        description: '你從沙發縫隙中找到手把。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'sofa_gap' },
          { type: 'hasFlag', flag: 'handle_location_revealed', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'door_handle' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：陽台落地窗手把\n\n你從沙發縫隙中摸到一個冰冷的金屬物體。這個手把上有掌紋，像曾有人死抓著不放。\n\n它曾經是門的一部分，現在像遺物。',
              type: 'item',
            },
          },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '702 比 701 豪華：有沙發、有衣櫃、有更大的窗。但「豪華」在這裡像嘲諷：打鬥痕跡留在牆角，地毯上有被拖拽的毛邊。',
      type: 'narrator',
    },
  },
  
  'ch1_sc4': {
    id: 'ch1_sc4',
    chapterId: 'ch1',
    name: '702 陽台',
    description: '陽台風大，吹得你眼睛發乾。鐵柵欄鏽蝕嚴重，但它不是「老舊」的那種鏽——更像被某種化學藥劑刻意催熟。你往下看，城市沒有燈火；這棟樓像被挖出來的一顆牙，孤零零插在黑暗裡。',
    background: '/images/bg_ch1_sc4_v1.png',
    hotspots: [
      {
        id: 'plant',
        shape: 'rect',
        coords: [0.2, 0.4, 0.4, 0.6],
        description: '乾枯盆栽',
        hint: '盆栽土壤不是土，是像被焚過的粉末。',
      },
      {
        id: 'toolbox',
        shape: 'rect',
        coords: [0.5, 0.5, 0.7, 0.7],
        description: '工具箱',
        hint: '工具箱的鎖扣鏽蝕嚴重，需要除鏽劑才能打開。',
      },
      {
        id: 'restraints',
        shape: 'rect',
        coords: [0.1, 0.6, 0.3, 0.8],
        description: '醫療束縛帶',
        hint: '束縛帶散落在地上，名牌是空白的。',
      },
      {
        id: 'pain_patch_spot',
        shape: 'rect',
        coords: [0.3, 0.7, 0.5, 0.85],
        description: '止痛貼片盒',
        hint: '裂開的止痛貼片盒掉在地上。',
      },
      {
        id: 'fixed_point_1',
        shape: 'rect',
        coords: [0.6, 0.3, 0.7, 0.4],
        description: '固定點1',
        hint: '欄杆上的固定點，名牌上沒有標記。',
      },
      {
        id: 'fixed_point_2',
        shape: 'rect',
        coords: [0.75, 0.3, 0.85, 0.4],
        description: '固定點2（加固扣）',
        hint: '欄杆上的固定點，名牌上標記了「加固扣」。',
      },
      {
        id: 'descend_point',
        shape: 'rect',
        coords: [0.65, 0.4, 0.9, 0.5],
        description: '垂降點',
        hint: '欄杆邊緣，準備垂降的地方。',
      },
      {
        id: 'railing_knots',
        shape: 'rect',
        coords: [0.7, 0.25, 0.85, 0.35],
        description: '欄杆上的結痕',
        hint: '不同粗細、不同手法的舊結留下白痕。',
      },
    ],
    items: [
      items.blank_nameplate,
      items.pain_patch,
      items.rust_remover,
      items.ceramic_shard,
    ],
    events: [
      {
        id: 'pickup_rust_remover',
        name: '獲得除鏽劑',
        description: '從盆栽底部找到除鏽劑。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'plant' },
        ],
        effects: [
          { type: 'addItem', itemId: 'rust_remover' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：除鏽劑\n\n盆栽土壤不是土，是像被焚過的粉末。你把盆移開，底下那瓶除鏽劑像是早就為你放好。\n\n這裡連希望都被安排在盆底。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'rust_remover_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'open_toolbox',
        name: '打開工具箱',
        description: '用除鏽劑打開工具箱。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'toolbox' },
          { type: 'hasItem', itemId: 'rust_remover' },
        ],
        effects: [
          { type: 'addItem', itemId: 'ceramic_shard' },
          {
            type: 'showDialog',
            dialog: {
              text: '你將除鏽劑倒在工具箱的鎖扣上，鏽蝕的卡榫發出「喀」的一聲，鬆開了。\n\n獲得：陶瓷破片\n\n陶瓷破片邊緣白得像牙。你突然想到：這棟樓最不缺的，可能就是「白」。\n\n像潔白的凶器。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'toolbox_opened', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pickup_restraints',
        name: '收集束縛帶',
        description: '收集醫療束縛帶和病患名牌。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'restraints' },
        ],
        effects: [
          { type: 'addItem', itemId: 'blank_nameplate' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：醫療束縛帶上的病患名牌\n\n名牌是空白，表示「誰都可以是誰」。\n\n空白最可怕，因為你會被寫上去。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'restraints_collected', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pickup_pain_patch',
        name: '獲得止痛貼片盒',
        description: '獲得止痛貼片盒，背面有線索。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'pain_patch_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'pain_patch' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：裂開的止痛貼片盒\n\n有人在幫你，也有人在「管理」你的痛。\n\n你翻轉其中一片，背面藏著小字：\n**「二樓露台，箱子先肺後肝。」**',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'pain_patch_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'select_fixed_point',
        name: '選擇固定點',
        description: '選擇有加固扣的固定點。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'fixed_point_2' },
          { type: 'hasItem', itemId: 'blank_nameplate' },
          { type: 'hasFlag', flag: 'restraints_collected', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你將束縛帶固定在欄杆上，扣環「喀」一聲扣上，你聽到的不是安全感，是**手術燈開啟前的那種確定**。\n\n你用他們束縛你的東西，替自己做一條路。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'fixed_point_selected', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'descend_broadcast',
        name: '垂降廣播',
        description: '垂降時觸發廣播。',
        requirements: [
          { type: 'hasFlag', flag: 'fixed_point_selected', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你開始垂降時，樓上某扇窗內亮起一道很窄的光，像有人用手術燈照你。',
              type: 'narrator',
            },
          },
          { type: 'showDialog', dialog: broadcasts.fourth },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'descend',
        type: 'combination',
        solution: ['blank_nameplate'],
        hint: '你已經固定好繩索，現在需要確認垂降。這是你離開這棟樓的最後一步。',
        requirements: [
          { type: 'hasFlag', flag: 'fixed_point_selected', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你抓住繩索，開始往下垂降。風很大，吹得你眼睛發乾。\n\n你往下看，城市沒有燈火；這棟樓像被挖出來的一顆牙，孤零零插在黑暗裡。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你開始垂降時，樓上某扇窗內亮起一道很窄的光，像有人用手術燈照你。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: broadcasts.fourth,
          },
          { type: 'changeScene', chapterId: 'ch1', sceneId: 'ch1_sc5' },
        ],
      },
    ],
    initialDialog: {
      text: '陽台風大，吹得你眼睛發乾。鐵柵欄鏽蝕嚴重，但它不是「老舊」的那種鏽——更像被某種化學藥劑刻意催熟。\n\n你往下看，城市沒有燈火；這棟樓像被挖出來的一顆牙，孤零零插在黑暗裡。',
      type: 'narrator',
    },
  },
  
  'ch1_sc5': {
    id: 'ch1_sc5',
    chapterId: 'ch1',
    name: '二樓露台',
    description: '露台堆滿廢棄醫療器材箱，像一個被清空的戰場。你以為這裡會更自由，但空氣更重——因為你終於靠近「存貨區」。地上有拖行痕，像箱子不是被搬運，是被拉走；有些箱角撞裂，露出內層保麗龍——乾淨得像骨髓。',
    background: '/images/bg_ch1_sc5_v1.png',
    hotspots: [
      {
        id: 'cold_label_spot',
        shape: 'rect',
        coords: [0.05, 0.1, 0.25, 0.25],
        description: '冷鏈運輸標籤',
        hint: '標籤貼在箱側，上面有日期和溫度。',
      },
      {
        id: 'bracelet_spot',
        shape: 'rect',
        coords: [0.3, 0.1, 0.5, 0.25],
        description: '破裂的識別手環',
        hint: '手環掉在地上，已經破裂。',
      },
      {
        id: 'boxes_area',
        shape: 'rect',
        coords: [0.1, 0.3, 0.9, 0.55],
        description: '醫療器材箱',
        hint: '四個箱子需要按照優先級排序。',
      },
      {
        id: 'heart_box',
        shape: 'rect',
        coords: [0.1, 0.3, 0.3, 0.5],
        description: '心臟箱',
        hint: '心先走，因為最值錢。',
      },
      {
        id: 'lung_box',
        shape: 'rect',
        coords: [0.3, 0.3, 0.5, 0.5],
        description: '肺箱',
        hint: '肺要看吸菸史。',
      },
      {
        id: 'liver_box',
        shape: 'rect',
        coords: [0.5, 0.3, 0.7, 0.5],
        description: '肝箱',
        hint: '肝要看酒精。',
      },
      {
        id: 'kidney_box',
        shape: 'rect',
        coords: [0.7, 0.3, 0.9, 0.5],
        description: '腎箱',
        hint: '腎看年紀。',
      },
      {
        id: 'exit',
        shape: 'rect',
        coords: [0.4, 0.6, 0.6, 0.8],
        description: '逃生口',
        hint: '需要座標才能打開。',
      },
      {
        id: 'foam_code',
        shape: 'rect',
        coords: [0.15, 0.35, 0.25, 0.45],
        description: '箱角保麗龍的壓印碼',
        hint: '07-A / 07-B / 07-C（或只剩半截）',
      },
      {
        id: 'tape_label',
        shape: 'rect',
        coords: [0.75, 0.35, 0.85, 0.45],
        description: '封箱膠帶上的標語',
        hint: 'HANDLE WITH CARE',
      },
    ],
    items: [
      items.cold_chain_label,
      items.runner_bracelet,
      items.id_card,
    ],
    events: [
      {
        id: 'pickup_cold_label',
        name: '獲得冷鏈運輸標籤',
        description: '查看運輸標籤。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'cold_label_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'cold_chain_label' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：冷鏈運輸標籤\n\n**「TEMP: 2–8°C / DEST: 研究所 / CONTENT: VITAL」**\n\n原來你要去的地方不是出口，是下一站。\n\n這不是逃生路線，是物流路線。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'label_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pickup_bracelet',
        name: '獲得識別手環',
        description: '撿起破裂的識別手環。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'bracelet_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'runner_bracelet' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：破裂的識別手環\n\n手環上寫著：**Runner / 07**\n\n你把它扯斷那刻，才第一次覺得自己有力氣。\n\n你想起第一空間的「701-07」，身份終於完成扣合。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'bracelet_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'find_id_card',
        name: '在心臟箱找到身份證',
        description: '完成拼箱排序後，在心臟箱中找到身份證。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'heart_box' },
          { type: 'hasFlag', flag: 'boxes_arranged', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'id_card' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：身份證\n\n你打開心臟箱，裡面除了保冷設備，還有一張身份證。\n\n你看到照片是自己，那一瞬間不是震驚，是荒謬：\n**「國家特種部隊教官」**——你不是病人，你是被挑中的獵物。\n\n你以為自己只是醒來，原來你一直在被選中。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'id_card_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'read_id_back',
        name: '查看身份證背面',
        description: '查看身份證背面的座標。',
        requirements: [
          { type: 'hasItem', itemId: 'id_card' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你翻轉身份證，背面寫著一行座標：\n\n**「N24.1234, E120.5678」**\n\n座標像地址，也像你被寄送的目的地。\n\n你的自由，被寫成一行定位。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'final_password_revealed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'box_arrangement',
        type: 'arrangement',
        solution: ['心', '肺', '肝', '腎'],
        hint: '根據收割優先級排序：心臟最值錢，優先運送；肺臟需要檢查吸菸史；肝臟需要檢查酒精；腎臟看年紀。\n\n止痛貼片盒上的線索提示：「先肺後肝」。\n\n請依序點選器官，按照優先級從高到低排列。',
        requirements: [
          { type: 'hasFlag', flag: 'label_read', value: true },
          { type: 'hasFlag', flag: 'pain_patch_found', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你按照優先級排列箱子，箱側的圖示和標記突然連成一行字符。\n\n你仔細辨認，那是一串座標格式：**「N24.1234, E120.5678」**',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'boxes_arranged', value: true },
          { type: 'setFlag', flag: 'coordinates_revealed', value: true },
        ],
      },
      {
        id: 'final_exit',
        type: 'input',
        solution: 'N24.1234, E120.5678',
        hint: '輸入身份證背面的座標，或拼箱排序後獲得的座標。',
        requirements: [
          { type: 'hasFlag', flag: 'final_password_revealed', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '門開的瞬間，你期待城市、警笛、人聲。\n\n但外面是荒野。風很大，沒有路標。只有地平線像一條薄薄的刀線。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你低頭看手裡的粉紅瑜珈墊——它的內層其實有一道**壓紋暗線**，用 UV 燈照會顯出簡化地圖與標記：\n\n* 一個像「手術刀」的符號\n* 一個像「電塔」的符號\n* 一個寫著「回收點」的圈\n\n你終於懂了：這不是瑜珈墊，這是「逃亡者教材」。\n有人在更早之前就失敗過；而你，是下一個版本。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '**「你奔跑，不是為了活著。」**\n**「你奔跑，是為了把自己從『貨』變回『人』。」**',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'game_completed', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '露台堆滿廢棄醫療器材箱，像一個被清空的戰場。你以為這裡會更自由，但空氣更重——因為你終於靠近「存貨區」。\n\n地上有拖行痕，像箱子不是被搬運，是被拉走；有些箱角撞裂，露出內層保麗龍——乾淨得像骨髓。',
      type: 'narrator',
    },
  },
};

// 章節定義
export const chapters: Record<string, Chapter> = {
  ch1: {
    id: 'ch1',
    name: '第一章：甦醒',
    description: '從病房 701 開始的逃亡',
    scenes: ['ch1_sc1', 'ch1_sc2', 'ch1_sc3', 'ch1_sc4', 'ch1_sc5'],
  },
};

