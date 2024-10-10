import { defineStore } from 'pinia';

interface TokenStore {
  token: string;
  avatarUrl: string;
  setToken: (newToken: string) => void;
  removeToken: () => void;
  setAvatarUrl: (url: string) => void;
}

interface TokenState {
  token: string;
  avatarUrl: string;
}

export const useTokenStore = defineStore('token', {
  state: (): TokenState => ({
    token: '',
    avatarUrl: '',
  }),
  actions: {
    setToken(newToken: string) {
      this.token = newToken;
    },
    removeToken() {
      this.token = '';
    },
    setAvatarUrl(url: string) {
      this.avatarUrl = url;
    },
  },
  persist: true, 
});