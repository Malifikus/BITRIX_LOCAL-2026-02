import { BIcon, Outline as OutlineIcons } from 'ui.icon-set.api.vue';

import { RecentPackType, RecentPackId } from 'im.v2.const';

import '../css/header-item.css';

// @vue/component
export const HeaderItem = {
	name: 'HeaderItem',
	components: { BIcon },
	props: {
		pack: {
			type: Object,
			required: true,
		},
		isActive: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		OutlineIcons: () => OutlineIcons,
		isRecentPack(): boolean
		{
			return this.pack.id === RecentPackId && this.pack.type === RecentPackType;
		},
		packName(): string
		{
			return this.pack.name;
		},
		packCover(): string
		{
			return this.$store.getters['stickers/getPackCover']({
				id: this.pack.id,
				type: this.pack.type,
			});
		},
	},
	template: `
		<div 
			:title="packName"
			:class="{'--active': this.isActive}" 
			class="bx-im-stickers-header__item" 
		>
			<BIcon
				v-if="isRecentPack"
				:name="OutlineIcons.CLOCK"
			/>
			<BIcon
				v-else-if="!packCover"
				:name="OutlineIcons.STICKER"
			/>
			<img v-else :src="packCover" alt="" loading="lazy" draggable="false" />
		</div>
	`,
};
