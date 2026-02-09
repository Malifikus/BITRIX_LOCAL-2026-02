import { Core } from 'im.v2.application.core';
import { RecentPackId, RecentPackType, StickerPackType } from 'im.v2.const';

import { AddStickerButton } from './components/add-sticker-button';
import { StickerItem } from '../sticker-item/sticker-item';

import './css/pack-stickers.css';

import type { ImModelSticker } from 'im.v2.model';

// @vue/component
export const PackStickers = {
	name: 'PackStickers',
	components: { StickerItem, AddStickerButton },
	props: {
		pack: {
			type: Object,
			required: true,
		},
		withAddButton: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['clickSticker', 'openContextMenuSticker'],
	computed: {
		isRecentPack(): boolean
		{
			return this.pack.id === RecentPackId && this.pack.type === RecentPackType;
		},
		recentStickers(): ImModelSticker[]
		{
			return this.$store.getters['stickers/recent/get'];
		},
		stickers(): ImModelSticker[]
		{
			if (this.isRecentPack)
			{
				return this.recentStickers;
			}

			return this.$store.getters['stickers/getByPack']({
				id: this.pack.id,
				type: this.pack.type,
			});
		},
		canAddStickers(): boolean
		{
			if (!this.withAddButton)
			{
				return false;
			}

			if (this.pack.type !== StickerPackType.custom)
			{
				return false;
			}

			return this.pack.authorId === Core.getUserId();
		},
	},
	template: `
		<div class="bx-im-pack-stickers__container">
			<StickerItem
				v-for="sticker in stickers"
				:key="sticker.id"
				:sticker="sticker"
				@click="$emit('clickSticker', { event: $event, sticker })"
				@contextmenu.prevent="$emit('openContextMenuSticker', { event: $event, sticker })"
			/>
			<AddStickerButton v-if="canAddStickers" :pack="pack" />
		</div>
	`,
};
