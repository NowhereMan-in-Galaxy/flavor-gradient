import type { FlavorCorridor } from '../types/flavor';

/** 种子走廊。Stage 2 需要补齐到 3 条，并保证每个 stop 的 nodeId 都存在于 NODES。 */
export const CORRIDORS: FlavorCorridor[] = [
  {
    id: 'lingnan-indochina',
    title: { zh: '岭南—中南半岛酸鲜走廊', en: 'Lingnan–Indochina Sour-Umami Corridor' },
    subtitle: '从潮汕白灼到河内清汤粉',
    themeColor: '#22C55E',
    gradientColors: ['#38BDF8', '#84CC16', '#22C55E'],
    scientificDriver: '同属季风湿热带，海产与发酵水产（鱼露/虾酱）共享鲜味来源；酸味从“蘸碟酸”过渡到“发酵酸”再到“青柠酸”',
    morphingConceptName: '一碗汤粉的三次变形',
    stops: [
      {
        nodeId: 'cn-chaoshan',
        transitionNote: '鲜味来自刚出水的海产，酸只在蘸碟里',
        representativeDishMorph: {
          dishName: '粿条汤',
          wrapperOrBase: '米粿条',
          fillingOrProtein: '鱼丸/牛肉',
          soulDipOrSauce: '鱼露、沙茶',
          cookingShift: '清汤快煮',
        },
      },
      {
        nodeId: 'cn-guangxi',
        transitionNote: '酸笋进汤，酸从配角变成主角',
        representativeDishMorph: {
          dishName: '老友粉',
          wrapperOrBase: '切粉',
          fillingOrProtein: '猪肉',
          soulDipOrSauce: '酸笋、豆豉、辣椒',
          cookingShift: '猛火炒料后煮',
        },
      },
      {
        nodeId: 'vn-north',
        transitionNote: '鱼露+青柠，草本以生的形式一大把上桌',
        representativeDishMorph: {
          dishName: 'Phở',
          wrapperOrBase: '河粉',
          fillingOrProtein: '牛肉',
          soulDipOrSauce: '鱼露、青柠、辣椒',
          cookingShift: '长熬清汤+生草本',
        },
      },
    ],
  },
];
