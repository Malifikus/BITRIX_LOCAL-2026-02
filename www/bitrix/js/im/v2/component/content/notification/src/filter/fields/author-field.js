import { Dom } from 'main.core';
import { TagSelector } from 'ui.entity-selector';
import type { BaseEvent } from 'main.core.events';

import './css/field.css';

// @vue/component
export const NotificationFilterAuthorField = {
	name: 'AuthorFilterField',
	props: {
		modelValue: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['update:modelValue', 'popupStateChange'],
	computed: {
		labelText(): string
		{
			return this.loc('IM_NOTIFICATIONS_FILTER_AUTHOR_FIELD_TITLE');
		},
	},
	mounted(): void
	{
		this.selector = this.getSelector();
		this.selector.renderTo(this.$refs['author-selector']);
	},
	methods:
	{
		loc(phraseCode: string, replacements: { [p: string]: string } = {}): string
		{
			return this.$Bitrix.Loc.getMessage(phraseCode, replacements);
		},
		getSelector(): TagSelector
		{
			const preselectedItems = this.modelValue.map((author) => ['user', author.id]);
			const selector = new TagSelector({
				events: {
					onTagAdd: (event: BaseEvent) => {
						const { tag } = event.getData();
						if (!this.modelValue.some((author) => author.id === tag.id))
						{
							const searchAuthors = [
								...this.modelValue,
								{
									id: tag.id,
									name: tag.title?.text ?? String(tag.id),
								},
							];
							this.$emit('update:modelValue', searchAuthors);
						}
					},
					onTagRemove: (event: BaseEvent) => {
						const { tag } = event.getData();
						const searchAuthors = this.modelValue.filter((author) => author.id !== tag.id);
						this.$emit('update:modelValue', searchAuthors);
					},
				},
				multiple: true,
				dialogOptions: {
					height: 250,
					width: 380,
					preselectedItems,
					entities: [
						{
							id: 'user',
							options: {
								intranetUsersOnly: true,
								inviteEmployeeLink: false,
							},
						},
					],
					dropdownMode: true,
					hideOnDeselect: false,
					events: {
						onShow: () => {
							this.$emit('popupStateChange', { popup: 'author', active: true });
						},
						onHide: () => {
							this.$emit('popupStateChange', { popup: 'author', active: false });
						},
					},
				},
			});

			const container = selector.getDialog()?.getContainer();
			if (container)
			{
				Dom.attr(container, 'data-test-id', 'im_notifications-filter__author-field-selector');
			}

			return selector;
		},
	},
	template: `
		<div class="bx-im-notifications-filter_field__container">
			<div class="bx-im-notifications-filter_field__label">{{ labelText }}</div>
			<div
				ref="author-selector"
				class="bx-im-notifications-filter_field__selector-container"
				data-test-id="im_notifications-filter__author-field-container"
			/>
		</div>
	`,
};
