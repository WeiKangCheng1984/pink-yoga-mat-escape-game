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
    description: '主任不會碰手術刀，主任只碰「同意書」。',
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
    description: '原來你要去的地方不是出口，是下一站。',
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
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '門鎖解除的聲音太溫柔了，像護士輕聲說：「乖，輪到你了。」',
              type: 'narrator',
            },
          },
          { type: 'changeScene', chapterId: 'ch1', sceneId: 'ch1_sc2' },
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
    description: '走廊像被拉長的冷白色傷口。',
    background: '/images/bg_ch1_sc2_v1.png',
    hotspots: [
      {
        id: 'mirror',
        shape: 'rect',
        coords: [0.1, 0.2, 0.3, 0.6],
        description: '破碎的鏡子',
        hint: '它把你還給你，但先把你撕碎。',
      },
      {
        id: 'mirror_shard_spot',
        shape: 'rect',
        coords: [0.15, 0.5, 0.25, 0.6],
        description: '鏡片碎角',
        hint: '它不鋒利，但足夠讓人誤以為自己還能反擊。',
      },
      {
        id: 'duty_schedule',
        shape: 'rect',
        coords: [0.4, 0.3, 0.6, 0.5],
        description: '值班表',
        hint: '背面似乎有字。',
      },
      {
        id: 'beds',
        shape: 'rect',
        coords: [0.5, 0.5, 0.9, 0.8],
        description: '移動病床',
        hint: '每張床上有字母標籤。',
      },
      {
        id: 'password_panel',
        shape: 'rect',
        coords: [0.7, 0.2, 0.9, 0.4],
        description: '密碼盤',
        hint: '從鏡子裡看是反的。',
      },
    ],
    items: [
      items.mirror_shard,
      items.note,
    ],
    events: [
      {
        id: 'read_note',
        name: '閱讀便條',
        description: '你看到值班表背面的便條。',
        requirements: [
          { type: 'hasItem', itemId: 'note' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '在這裡，階級不是制度，是刀口的方向。',
              type: 'narrator',
            },
          },
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
          { type: 'showDialog', dialog: broadcasts.second },
          {
            type: 'showDialog',
            dialog: {
              text: '有人安排你逃跑；更恐怖的是——你不知道他是救你，還是在放你出去「示範」。',
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
        solution: 'REFLECT',
        hint: '從鏡子裡看密碼盤...',
        onSolve: [
          { type: 'setFlag', flag: 'mirror_solved', value: true },
        ],
      },
      {
        id: 'bed_arrangement',
        type: 'sequence',
        solution: ['主任', '主治', '住院', '護理師', '實習生'],
        hint: '按照職位高低排序...',
        onSolve: [
          { type: 'setFlag', flag: 'beds_arranged', value: true },
          { type: 'changeScene', chapterId: 'ch1', sceneId: 'ch1_sc3' },
        ],
      },
    ],
    initialDialog: {
      text: '走廊像被拉長的冷白色傷口。兩側掛著破碎的鏡子，每一片都映出你不同的角度——但沒有一片完整地映出「你」。',
      type: 'narrator',
    },
  },
  
  'ch1_sc3': {
    id: 'ch1_sc3',
    chapterId: 'ch1',
    name: '病房 702',
    description: '702 比 701 豪華：有沙發、有衣櫃、有更大的窗。',
    background: '/images/bg_ch1_sc3_v1.png',
    hotspots: [
      {
        id: 'pillow',
        shape: 'rect',
        coords: [0.2, 0.3, 0.4, 0.5],
        description: '枕頭',
        hint: '枕頭下似乎有東西。',
      },
      {
        id: 'wardrobe',
        shape: 'rect',
        coords: [0.5, 0.2, 0.8, 0.6],
        description: '衣櫃',
        hint: '衣櫃門緊閉。',
      },
      {
        id: 'recorder_spot',
        shape: 'rect',
        coords: [0.1, 0.6, 0.3, 0.7],
        description: '錄音筆',
        hint: '按下去的那刻，你聽見別人的良心在漏電。',
      },
      {
        id: 'monitor',
        shape: 'rect',
        coords: [0.6, 0.1, 0.9, 0.3],
        description: '監控螢幕',
        hint: '螢幕突然亮起。',
      },
      {
        id: 'window',
        shape: 'rect',
        coords: [0.7, 0.5, 0.95, 0.8],
        description: '落地窗',
        hint: '需要手把才能打開。',
      },
    ],
    items: [
      items.recorder,
      items.consent_form,
      items.diary,
      items.door_handle,
    ],
    events: [
      {
        id: 'read_diary',
        name: '閱讀日記',
        description: '你翻開日記本。',
        requirements: [
          { type: 'hasItem', itemId: 'diary' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '那個粉紅色的墊子是她唯一的堅持，她每天在 701 瘋狂訓練，她想逃出去。\n你讀到「她」的時候，心臟會漏拍：你明明就是「我」。為什麼有人用第三人稱寫你？\n有人在觀察你，還替你寫傳記。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'diary_read', value: true },
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
        oneTime: true,
      },
      {
        id: 'wardrobe_jump_scare',
        name: '衣櫃爆開',
        description: '衣櫃門突然彈開，假人彈出。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'wardrobe' },
          { type: 'hasItem', itemId: 'diary' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '衣櫃門像被彈簧推開，假人穿粉紅瑜珈服，動作僵硬地做著「下犬式」，但頭部角度不可能。\n它手上那張紙寫著：《實驗終止通知書》：07號，達標，進入收割排程。\n你以為終止的是實驗，終止的其實是你。',
              type: 'narrator',
            },
          },
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
          { type: 'showDialog', dialog: broadcasts.third },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'open_window',
        type: 'combination',
        solution: ['door_handle'],
        hint: '需要手把才能打開落地窗。',
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '這個手把上有掌紋，像曾有人死抓著不放。',
              type: 'narrator',
            },
          },
          { type: 'changeScene', chapterId: 'ch1', sceneId: 'ch1_sc4' },
        ],
      },
    ],
    initialDialog: {
      text: '702 比 701 豪華：有沙發、有衣櫃、有更大的窗。但「豪華」在這裡像嘲諷：打鬥痕跡留在牆角，地毯上有被拖拽的毛邊。',
      type: 'narrator',
    },
  },
  
  'ch1_sc4': {
    id: 'ch1_sc4',
    chapterId: 'ch1',
    name: '702 陽台',
    description: '陽台風大，吹得你眼睛發乾。',
    background: '/images/bg_ch1_sc4_v1.png',
    hotspots: [
      {
        id: 'plant',
        shape: 'rect',
        coords: [0.2, 0.4, 0.4, 0.6],
        description: '盆栽',
        hint: '盆栽土壤不是土，是像被焚過的粉末。',
      },
      {
        id: 'toolbox',
        shape: 'rect',
        coords: [0.5, 0.5, 0.7, 0.7],
        description: '工具箱',
        hint: '需要除鏽劑才能打開。',
      },
      {
        id: 'restraints',
        shape: 'rect',
        coords: [0.1, 0.6, 0.3, 0.8],
        description: '醫療束縛帶',
        hint: '你用他們束縛你的東西，替自己做一條路。',
      },
      {
        id: 'railing',
        shape: 'rect',
        coords: [0.6, 0.3, 0.95, 0.5],
        description: '欄杆',
        hint: '鐵柵欄鏽蝕嚴重。',
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
        id: 'find_rust_remover',
        name: '發現除鏽劑',
        description: '在盆栽下找到除鏽劑。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'plant' },
        ],
        effects: [
          { type: 'addItem', itemId: 'rust_remover' },
          {
            type: 'showDialog',
            dialog: {
              text: '你把盆移開，底下那瓶除鏽劑像是早就為你放好。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'open_toolbox',
        name: '打開工具箱',
        description: '用除鏽劑打開工具箱。',
        requirements: [
          { type: 'hasItem', itemId: 'rust_remover' },
        ],
        effects: [
          { type: 'addItem', itemId: 'ceramic_shard' },
          {
            type: 'showDialog',
            dialog: {
              text: '陶瓷破片邊緣白得像牙。你突然想到：這棟樓最不缺的，可能就是「白」。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'read_pain_patch',
        name: '查看止痛貼',
        description: '止痛貼背面有字。',
        requirements: [
          { type: 'hasItem', itemId: 'pain_patch' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '另一片背面藏小字：「二樓露台，箱子先肺後肝。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'box_order_hint', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'prepare_rope',
        name: '準備繩索',
        description: '用束縛帶製作繩索。',
        requirements: [
          { type: 'hasItem', itemId: 'blank_nameplate' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '當你把束縛帶固定在欄杆，扣環「喀」一聲扣上，你聽到的不是安全感，是手術燈開啟前的那種確定。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'rope_ready', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'descend',
        name: '垂降',
        description: '你開始垂降。',
        requirements: [
          { type: 'hasFlag', flag: 'rope_ready', value: true },
        ],
        effects: [
          { type: 'showDialog', dialog: broadcasts.fourth },
          { type: 'changeScene', chapterId: 'ch1', sceneId: 'ch1_sc5' },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '陽台風大，吹得你眼睛發乾。鐵柵欄鏽蝕嚴重，但它不是「老舊」的那種鏽——更像被某種化學藥劑刻意催熟。',
      type: 'narrator',
    },
  },
  
  'ch1_sc5': {
    id: 'ch1_sc5',
    chapterId: 'ch1',
    name: '二樓露台',
    description: '露台堆滿廢棄醫療器材箱。',
    background: '/images/bg_ch1_sc5_v1.png',
    hotspots: [
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
    ],
    items: [
      items.cold_chain_label,
      items.runner_bracelet,
      items.id_card,
    ],
    events: [
      {
        id: 'find_id_card',
        name: '找到身份證',
        description: '在心臟箱中找到身份證。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'heart_box' },
        ],
        effects: [
          { type: 'addItem', itemId: 'id_card' },
          {
            type: 'showDialog',
            dialog: {
              text: '你看到照片是自己，那一瞬間不是震驚，是荒謬：「國家特種部隊教官」——你不是病人，你是被挑中的獵物。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'read_id_back',
        name: '查看身份證背面',
        description: '身份證背面有座標。',
        requirements: [
          { type: 'hasItem', itemId: 'id_card' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '座標像地址，也像你被寄送的目的地。你的自由，被寫成一行定位。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'coordinates_found', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'box_sequence',
        type: 'sequence',
        solution: ['heart', 'lung', 'liver', 'kidney'],
        hint: '先肺後肝...心先走...',
        onSolve: [
          { type: 'setFlag', flag: 'boxes_arranged', value: true },
        ],
      },
      {
        id: 'exit_code',
        type: 'input',
        solution: '23.456,121.789',
        hint: '身份證背面的座標...',
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '門開的瞬間，你期待城市、警笛、人聲。\n但外面是荒野。風很大，沒有路標。只有地平線像一條薄薄的刀線。\n\n你低頭看手裡的粉紅瑜珈墊——它的內層其實有一道壓紋暗線，用 UV 燈照會顯出簡化地圖與標記。\n你終於懂了：這不是瑜珈墊，這是「逃亡者教材」。\n有人在更早之前就失敗過；而你，是下一個版本。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你奔跑，不是為了活著。\n你奔跑，是為了把自己從「貨」變回「人」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'game_completed', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '露台堆滿廢棄醫療器材箱，像一個被清空的戰場。你以為這裡會更自由，但空氣更重——因為你終於靠近「存貨區」。',
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

