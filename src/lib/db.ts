import { readResource } from './api-client';
export interface PublicTotals {
  services: number;
  guides: number;
  builds: number;
}
export const totals = (): Promise<PublicTotals> => readResource('totals');
