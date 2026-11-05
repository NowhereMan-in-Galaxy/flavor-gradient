import type { CulinaryNode } from '../../types/flavor';
import { CHINA_NODES } from './china';
import { SOUTHEAST_ASIA_NODES } from './southeast-asia';
import { SOUTH_ASIA_NODES } from './south-asia';
import { WEST_CENTRAL_ASIA_NODES } from './west-central-asia';
import { AFRICA_NODES } from './africa';
import { EUROPE_NODES } from './europe';
import { AMERICAS_NODES } from './americas';
import { EAST_ASIA_NODES } from './east-asia';

export const NODES: CulinaryNode[] = [
  ...CHINA_NODES,
  ...SOUTHEAST_ASIA_NODES,
  ...SOUTH_ASIA_NODES,
  ...WEST_CENTRAL_ASIA_NODES,
  ...AFRICA_NODES,
  ...EUROPE_NODES,
  ...AMERICAS_NODES,
  ...EAST_ASIA_NODES,
];

export const NODE_BY_ID: ReadonlyMap<string, CulinaryNode> = new Map(NODES.map((n) => [n.id, n]));
