import { Family } from './shared-interfaces';

export function hasActiveSub(subStatus: Family['subStatus'] | undefined): boolean {
    return subStatus === 'paid' || subStatus === 'trial';
}