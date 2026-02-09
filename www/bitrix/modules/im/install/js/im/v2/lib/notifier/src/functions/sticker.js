import { Loc } from 'main.core';

import { showNotification } from '../utils/notification';

export const StickerNotifier = {
	onLinkPackComplete(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKER_PACK_LINK_COMPLETE'));
	},

	handleLinkPackError(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKER_PACK_LINK_ERROR'));
	},

	handleAddStickersError(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKERS_LIMIT_ERROR'));
	},

	handleAddPackError(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKER_PACK_LIMIT_ERROR'));
	},

	onCreatePackComplete(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKER_PACK_CREATE_COMPLETE'));
	},

	onUpdatePackComplete(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKER_PACK_UPDATE_COMPLETE'));
	},

	onRemovePackComplete(): void
	{
		showNotification(Loc.getMessage('IM_NOTIFIER_MESSAGE_STICKER_PACK_REMOVE_COMPLETE'));
	},
};
