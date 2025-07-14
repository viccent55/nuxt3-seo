
import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
    state: () => {
        return {
            lang: 'en',
            ip: '',
            userInfos: {
                userName: '',
                profile: '',
                phone: '',
                uuid: ''
            },
            accessToken: false,
            onSearch: false,
            categories: [],
            themeColor: '#818CF8',
            timeStr: '',
            placeTypes: <EmptyArrayType>[],
        }
    },
    actions: {
        updateLocale(lang: string) {
            this.lang = lang;
        },
       
        setCategories(categories: any) {
            this.categories = categories;
        },
        
    },
   
    persist: true,
})
