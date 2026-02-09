import { PopupManager } from 'main.popup';
import { BIcon, Outline as OutlineIcons } from 'ui.icon-set.api.vue';

import { StickerPackForm, PackStickers } from 'im.v2.component.sticker';
import { StickerMenu, StickerPackMenu } from 'im.v2.lib.menu';
import { SendingService } from 'im.v2.provider.service.sending';
import { Color, PopupType, RecentPackId, RecentPackType, StickerPackType } from 'im.v2.const';

import '../css/pack.css';

import type { JsonObject } from 'main.core';
import type { ImModelSticker } from 'im.v2.model';

const ICON_SIZE = 24;

// @vue/component
export const Pack = {
	name: 'StickerPack',
	components: { BIcon, StickerPackForm, PackStickers },
	inject: ['disableAutoHide', 'enableAutoHide'],
	props: {
		pack: {
			type: Object,
			required: true,
		},
		dialogId: {
			type: String,
			required: true,
		},
	},
	emits: ['close'],
	data(): JsonObject
	{
		return {
			showPackForm: false,
		};
	},
	computed: {
		OutlineIcons: () => OutlineIcons,
		Color: () => Color,
		ICON_SIZE: () => ICON_SIZE,
		canShowContextMenu(): boolean
		{
			return this.pack.type === StickerPackType.custom || this.isRecentPack;
		},
		isRecentPack(): boolean
		{
			return this.pack.id === RecentPackId && this.pack.type === RecentPackType;
		},
	},
	methods: {
		onStickerClick({ sticker }: { sticker: ImModelSticker })
		{
			void SendingService.getInstance().sendMessageWithSticker({
				dialogId: this.dialogId,
				stickerParams: {
					id: sticker.id,
					packId: sticker.packId,
					packType: sticker.packType,
				},
			});
			this.$emit('close');
		},
		openPackMenu(event: PointerEvent)
		{
			PopupManager.getPopupById(PopupType.stickerPackContextMenu)?.close();
			if (!this.stickerPackMenu)
			{
				this.stickerPackMenu = new StickerPackMenu();
				this.stickerPackMenu.subscribe('close', () => {
					if (!this.showPackForm)
					{
						this.enableAutoHide();
					}
				});
				this.stickerPackMenu.subscribe('closeParentPopup', () => {
					this.$emit('close');
				});
				this.stickerPackMenu.subscribe('openEditor', () => {
					this.showPackForm = true;
				});
			}

			this.disableAutoHide();

			this.stickerPackMenu.openMenu({
				pack: this.pack,
				isRecent: this.isRecentPack,
				dialogId: this.dialogId,
			}, event.target);
		},
		openStickerMenu({ event, sticker }: { event: PointerEvent, sticker: ImModelSticker })
		{
			PopupManager.getPopupById(PopupType.stickerContextMenu)?.close();
			if (!this.stickerMenu)
			{
				this.stickerMenu = new StickerMenu();
				this.stickerMenu.subscribe('closeParentPopup', () => {
					this.$emit('close');
				});
				this.stickerMenu.subscribe('close', () => {
					this.enableAutoHide();
				});
			}

			this.disableAutoHide();

			this.stickerMenu.openMenu({
				sticker,
				isRecent: this.isRecentPack,
				dialogId: this.dialogId,
			}, event.target);
		},
		loc(phraseCode: string): string
		{
			return this.$Bitrix.Loc.getMessage(phraseCode);
		},
	},
	template: `
		<div class="bx-im-sticker-pack__container">
			<div class="bx-im-sticker-pack__header">
				<div class="bx-im-sticker-pack__header-title --ellipsis">
					{{ pack.name }}	
				</div>
				<BIcon
					v-if="canShowContextMenu"
					:name="OutlineIcons.MORE_M"
					:size="ICON_SIZE"
					:color="Color.gray40"
					:hoverable="true"
					class="bx-im-sticker-pack__header-actions"
					@click="openPackMenu"
				/>
			</div>
			<PackStickers 
				:pack="pack"
				class="bx-im-sticker-pack__stickers"
				@clickSticker="onStickerClick"
				@openContextMenuSticker="openStickerMenu"
			/>
			<StickerPackForm v-if="showPackForm" :pack="pack" @close="showPackForm = false" />
		</div>
	`,
};
