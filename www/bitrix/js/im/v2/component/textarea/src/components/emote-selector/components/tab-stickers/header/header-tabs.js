import { HeaderAddButton } from './header-add-button';
import { HeaderItem } from './header-item';
import { HeaderSkeleton } from './header-skeleton';

import '../css/header/header-tabs.css';

import type { ImModelStickerPack, ImModelStickerPackIdentifier } from 'im.v2.model';
import type { JsonObject } from 'main.core';

const SCROLL_LOADING_OFFSET = 200;
const ADD_BUTTON_OFFSET = 52;

// @vue/component
export const HeaderTabs = {
	name: 'HeaderTabs',
	components: { HeaderItem, HeaderSkeleton, HeaderAddButton },
	props: {
		packs: {
			type: Array,
			required: true,
		},
		activePack: {
			type: Object,
			required: true,
		},
		isLoadingFirstPage: {
			type: Boolean,
			required: true,
		},
		isLoadingNextPage: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['changeActivePack', 'scrollNextPage'],
	data(): JsonObject
	{
		return {
			highlightOffsetLeft: ADD_BUTTON_OFFSET,
		};
	},
	computed: {
		isLoading(): boolean
		{
			return this.isLoadingFirstPage || this.isLoadingNextPage;
		},
		highlightPositionStyles(): JsonObject
		{
			return {
				left: `${this.highlightOffsetLeft}px`,
			};
		},
	},
	watch: {
		activePack(newPack: ImModelStickerPackIdentifier)
		{
			const activePackIndex = this.packs.findIndex((pack: ImModelStickerPack) => (
				pack.id === newPack.id && pack.type === newPack.type
			));

			const PACK_ITEM_WIDTH = 36;
			const PACK_ITEM_GAP = 10;

			this.highlightOffsetLeft = ADD_BUTTON_OFFSET + (activePackIndex * (PACK_ITEM_WIDTH + PACK_ITEM_GAP));

			void this.$nextTick(() => {
				this.scrollToActiveTab(activePackIndex);
			});
		},
	},
	methods: {
		async onScrollHeader(event: Event)
		{
			const container = event.target;
			if (this.isLoading || !this.needToLoad(container, SCROLL_LOADING_OFFSET))
			{
				return;
			}
			this.$emit('scrollNextPage');
		},
		needToLoad(container: HTMLElement, offset: number): boolean
		{
			const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;

			return remaining <= offset;
		},
		isPackActive(pack: ImModelStickerPack): boolean
		{
			return pack.id === this.activePack.id && pack.type === this.activePack.type;
		},
		onHeaderPick(pack: ImModelStickerPack)
		{
			this.$emit('changeActivePack', {
				id: pack.id,
				type: pack.type,
			});
		},
		scrollToActiveTab(index: number)
		{
			const pack = this.$refs.tabs.children[index + 1]; // +1 to skip add button
			pack.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
		},
		onWheel(event: WheelEvent)
		{
			const { deltaX, deltaY, shiftKey } = event;
			const absX = Math.abs(deltaX);
			const absY = Math.abs(deltaY);

			const isHorizontalScroll = absX > absY || shiftKey;
			if (isHorizontalScroll)
			{
				return;
			}

			// vertical scroll - convert to horizontal scroll
			event.preventDefault();
			this.$refs.tabs.scrollLeft += Number(deltaY);
		},
		loc(phraseCode: string): string
		{
			return this.$Bitrix.Loc.getMessage(phraseCode);
		},
	},
	template: `
		<div
			class="bx-im-sticker-header-tabs__container"
			@scroll="onScrollHeader"
			@wheel="onWheel"
			ref="tabs"
		>
			<HeaderAddButton class="bx-im-sticker-header-tabs__add-button" />
			<template v-if="!isLoadingFirstPage">
				<HeaderItem
					v-for="pack in packs"
					:key="pack.key"
					:pack="pack"
					:isActive="isPackActive(pack)"
					class="bx-im-sticker-header-tabs__item"
					@click="onHeaderPick(pack)"
				/>
				<div class="bx-im-sticker-header-tabs__highlight-container" :style="highlightPositionStyles">
					<div class="bx-im-sticker-header-tabs__highlight"></div>
				</div>
			</template>
			<HeaderSkeleton v-if="isLoading" />
		</div>
	`,
};
