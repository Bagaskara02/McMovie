/**
 * MovieBox API Service (Sansekai API)
 * Reference: https://api.sansekai.my.id/#/MovieBox
 */

import { StorageService } from './storageService';

function getBaseUrl() {
  const settings = StorageService.getSettings();
  return (settings?.movieBoxApiUrl || 'https://api.sansekai.my.id/api').replace(/\/+$/, '');
}

async function apiFetch(endpoint, params = {}) {
  const base = getBaseUrl();
  const url = new URL(`${base}${endpoint}`);
  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null) {
      url.searchParams.append(k, params[k]);
    }
  });

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`MovieBox API error HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`MovieBox endpoint ${endpoint} failed:`, err.message);
    return null;
  }
}

export const MovieBoxService = {
  async getHomepage() {
    const res = await apiFetch('/moviebox/homepage');
    return res?.data || res || [];
  },

  async getHollywoodMovies() {
    const res = await apiFetch('/moviebox/hollywood-movies');
    return res?.data || res || [];
  },

  async getIndoMovies() {
    const res = await apiFetch('/moviebox/indo-movies');
    return res?.data || res || [];
  },

  async getKDrama() {
    const res = await apiFetch('/moviebox/k-drama');
    return res?.data || res || [];
  },

  async search(query) {
    if (!query) return [];
    const res = await apiFetch('/moviebox/search', { query });
    return res?.data || res || [];
  },

  async getDetail(id) {
    if (!id) return null;
    const res = await apiFetch('/moviebox/detail', { id });
    return res?.data || res || null;
  },

  async getDownloadUrl(id) {
    if (!id) return null;
    const res = await apiFetch('/moviebox/get-download-url', { id });
    return res?.data || res || null;
  },

  getProxyVideoUrl(rawCdnUrl) {
    if (!rawCdnUrl) return '';
    const base = getBaseUrl();
    return `${base}/moviebox/proxy-video?url=${encodeURIComponent(rawCdnUrl)}`;
  }
};
