import { defineStore } from 'pinia';
import { store } from '@/store';
import { getLicence, LicenceResp } from '@/api/system';
import Licence from '@/core/utils/licence';

export interface LicenceState {
    licence: Licence | null;
    licenceResp: LicenceResp | null;
}

export const useLicenceStore = defineStore({
    id: 'app-licence',
    state: (): LicenceState => ({
        licence: null,
        licenceResp: null,
    }),
    getters: {
        getLicence(): Licence | null {
            return this.licence;
        },
        getLicenceResp(): LicenceResp | null {
            return this.licenceResp;
        },
    },
    actions: {
        async requestLicence(): Promise<LicenceResp> {
            const res = (await getLicence()) as LicenceResp;

            this.licence = res.licence;
            this.licenceResp = res;

            return res;
        },
    },
});

// Need to be used outside the setup
export function useLicence() {
    return useLicenceStore(store);
}
