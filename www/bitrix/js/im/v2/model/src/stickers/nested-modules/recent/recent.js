import { BuilderModel } from 'ui.vue3.vuex';

import { formatFieldsWithConfig } from '../../../utils/validate';
import { recentStickerConfig } from './field-config';

import type { Store, ActionTree, GetterTree, MutationTree } from 'ui.vue3.vuex';
import type { JsonObject } from 'main.core';
import type { StickerIdentifier, Sticker } from '../../../type/stickers';

type RecentState = {
	collection: StickerIdentifier[],
};

const RECENT_LIMIT = 12;

/* eslint-disable no-param-reassign */
export class RecentStickersModel extends BuilderModel
{
	getState(): RecentState
	{
		return {
			collection: [],
		};
	}

	getElementState(): StickerIdentifier
	{
		return {
			id: 0,
			packId: 0,
			packType: '',
		};
	}

	getGetters(): GetterTree
	{
		return {
			/** @function stickers/recent/get */
			get: (state: RecentState, getters, rootState, rootGetters): Sticker[] => {
				const recentStickersIds = state.collection.slice(0, RECENT_LIMIT);

				return recentStickersIds.map((recentSticker) => {
					return rootGetters['stickers/get']({
						id: recentSticker.id,
						packId: recentSticker.packId,
						packType: recentSticker.packType,
					});
				}).filter((sticker) => Boolean(sticker));
			},
		};
	}

	getActions(): ActionTree
	{
		return {
			/** @function stickers/recent/set */
			set: (store: Store, payload: StickerIdentifier[]) => {
				payload.forEach((sticker) => {
					const preparedRecentSticker = this.#formatFields(sticker);
					store.commit('add', {
						...this.getElementState(),
						...preparedRecentSticker,
					});
				});
			},
			/** @function stickers/recent/update */
			update: (store: Store, payload: StickerIdentifier) => {
				const preparedRecentSticker = this.#formatFields(payload);
				store.commit('update', {
					...this.getElementState(),
					...preparedRecentSticker,
				});
			},
			/** @function stickers/recent/clear */
			clear: (store: Store) => {
				store.commit('clear');
			},
			/** @function stickers/recent/delete */
			delete: (store: Store, payload: StickerIdentifier) => {
				store.commit('delete', payload);
			},
		};
	}

	getMutations(): MutationTree
	{
		return {
			add: (state: RecentState, payload: StickerIdentifier) => {
				state.collection.push(payload);
			},
			update: (state: RecentState, payload: StickerIdentifier) => {
				state.collection = state.collection.filter((sticker) => {
					return !this.#isEqual(sticker, payload);
				});
				state.collection.unshift(payload);
			},
			clear: (state: RecentState) => {
				state.collection = [];
			},
			delete: (state: RecentState, payload: StickerIdentifier) => {
				state.collection = state.collection.filter((sticker) => {
					return !this.#isEqual(sticker, payload);
				});
			},
		};
	}

	#formatFields(sticker: JsonObject): RecentItem
	{
		return formatFieldsWithConfig(sticker, recentStickerConfig);
	}

	#isEqual(firstSticker: StickerIdentifier, secondSticker: StickerIdentifier): boolean
	{
		return firstSticker.id === secondSticker.id
			&& firstSticker.packId === secondSticker.packId
			&& firstSticker.packType === secondSticker.packType;
	}
}
