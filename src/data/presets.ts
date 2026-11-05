import type { UserPalatePreset } from '../types/flavor';

export const PRESETS: UserPalatePreset[] = [
  {
    id: 'coastal-sea',
    name: '沿海本味 + 东南亚酸鲜胃',
    description: '喜欢清蒸白灼、鱼露青柠、生鲜草本；不爱干香料慢炖和糊状质地',
    idealVector: {
      naturalBenwei: 9,
      wokHeiThermal: 5,
      umamiFerment: 8,
      brightAcid: 7,
      freshHerbal: 8,
      warmDrySpice: 1,
      capsaicinHeat: 4,
      lipidRichness: 3,
      sweetHarmony: 4,
      crispTexture: 9,
    },
    weights: {
      naturalBenwei: 1.5,
      wokHeiThermal: 0.8,
      umamiFerment: 1.2,
      brightAcid: 1.0,
      freshHerbal: 1.2,
      warmDrySpice: 1.6,
      capsaicinHeat: 0.6,
      lipidRichness: 1.0,
      sweetHarmony: 0.5,
      crispTexture: 1.5,
    },
  },
];
