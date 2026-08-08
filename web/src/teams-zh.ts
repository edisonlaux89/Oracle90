// Hong Kong-style club name translations, shown in the zh UI.
// Data JSON keeps canonical English names; mapping happens at render.
const TEAM_ZH: Record<string, string> = {
  Arsenal: "阿仙奴",
  "Aston Villa": "阿士東維拉",
  "Birmingham City": "伯明翰",
  "Blackburn Rovers": "布力般流浪",
  "Bolton Wanderers": "保頓",
  Bournemouth: "般尼茅夫",
  Brentford: "賓福特",
  "Brighton and Hove Albion": "白禮頓",
  "Bristol City": "布里斯托城",
  Burnley: "般尼",
  "Cardiff City": "卡迪夫城",
  "Charlton Athletic": "查爾頓",
  Chelsea: "車路士",
  "Coventry City": "高雲地利",
  "Crystal Palace": "水晶宮",
  "Derby County": "打比郡",
  Everton: "愛華頓",
  Fulham: "富咸",
  "Hull City": "侯城",
  "Ipswich Town": "葉士域治",
  "Leeds United": "列斯聯",
  "Lincoln City": "林肯城",
  Liverpool: "利物浦",
  "Manchester City": "曼城",
  "Manchester United": "曼聯",
  Middlesbrough: "米杜士堡",
  Millwall: "米禾爾",
  "Newcastle United": "紐卡素",
  "Norwich City": "諾域治",
  "Nottingham Forest": "諾定咸森林",
  Portsmouth: "樸茨茅夫",
  "Preston North End": "普雷斯頓",
  "Queens Park Rangers": "昆士柏流浪",
  "Sheffield United": "錫菲聯",
  Southampton: "修咸頓",
  "Stoke City": "史篤城",
  Sunderland: "新特蘭",
  "Swansea City": "史雲斯",
  "Tottenham Hotspur": "熱刺",
  Watford: "屈福特",
  "West Bromwich Albion": "西布朗",
  "West Ham United": "韋斯咸",
  "Wolverhampton Wanderers": "狼隊",
  "Wrexham AFC": "域斯咸",
};

// Short forms and other club names that can appear inside AI preview
// prose (the LLM shortens names; form/head-to-head lines mention other
// opponents). Full names above take precedence via longest-first order.
const ALIASES: Record<string, string> = {
  Wolves: "狼隊",
  Spurs: "熱刺",
  Tottenham: "熱刺",
  Newcastle: "紐卡素",
  Preston: "普雷斯頓",
  Bolton: "保頓",
  Brighton: "白禮頓",
  Coventry: "高雲地利",
  Hull: "侯城",
  Ipswich: "葉士域治",
  Leeds: "列斯聯",
  "Nott'm Forest": "諾定咸森林",
  "West Brom": "西布朗",
  Stoke: "史篤城",
  Blackburn: "布力般流浪",
  Charlton: "查爾頓",
  Derby: "打比郡",
  Lincoln: "林肯城",
  Norwich: "諾域治",
  QPR: "昆士柏流浪",
  Swansea: "史雲斯",
  Birmingham: "伯明翰",
  "West Ham": "韋斯咸",
  Cardiff: "卡迪夫城",
  Wrexham: "域斯咸",
  Leicester: "李斯特城",
  Oxford: "牛津聯",
  Bristol: "布里斯托城",
  "Sheffield Wednesday": "錫周三",
  Sheffield: "錫菲聯",
  Manchester: "曼徹斯特",
  Forest: "諾定咸森林",
  Villa: "阿士東維拉",
  Rangers: "昆士柏流浪",
  "Premier League": "英超",
  Championship: "英冠",
};

export function teamZh(name: string): string {
  return TEAM_ZH[name] ?? name;
}

const ALL_KEYS = [...Object.keys(TEAM_ZH), ...Object.keys(ALIASES)].sort(
  (a, b) => b.length - a.length,
);
const LOOKUP: Record<string, string> = { ...ALIASES, ...TEAM_ZH };
const PATTERN = new RegExp(
  ALL_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "g",
);

/** Replace every English club name in a zh prose string. */
export function zhClubNames(text: string): string {
  return text
    .replace(PATTERN, (m) => LOOKUP[m] ?? m)
    .replace(/([一-鿿。，、：；]) (?=[一-鿿])/g, "$1");
}
