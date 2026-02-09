/* eslint-disable */
this.BX = this.BX || {};
this.BX.Messenger = this.BX.Messenger || {};
this.BX.Messenger.v2 = this.BX.Messenger.v2 || {};
(function (exports,main_sidepanel,ui_sidepanel_layout,ui_system_input_vue,im_v2_lib_notifier,im_v2_provider_service_sticker,ui_vue3_components_button,ui_vue3_components_richLoc,ui_iconSet_api_core,im_v2_lib_helpdesk,ui_uploader_tileWidget,main_core_events,main_core,ui_uploader_core,im_v2_application_core,im_v2_const,ui_iconSet_api_vue) {
	'use strict';

	const StickerPackFormHeader = {
	  name: 'StickerPackFormHeader',
	  methods: {
	    loc(phraseCode) {
	      return this.$Bitrix.Loc.getMessage(phraseCode);
	    }
	  },
	  template: `
		<div class="bx-im-sticker-pack-form-header__container">
			<div class="bx-im-sticker-pack-form-header__image"></div>
			<div class="bx-im-sticker-pack-form-header__content">
				<div class="bx-im-sticker-pack-form-header__title">
					{{ loc('IM_STICKER_PACK_FORM_WELCOME_TITLE') }}
				</div>
				<div class="bx-im-sticker-pack-form-header__description">
					{{ loc('IM_STICKER_PACK_FORM_WELCOME_BODY') }}
				</div>
			</div>
		</div>
	`
	};

	// @vue/component
	const UploadButton = {
	  name: 'UploadButton',
	  components: {
	    UiButton: ui_vue3_components_button.Button,
	    RichLoc: ui_vue3_components_richLoc.RichLoc
	  },
	  inject: ['uploader'],
	  computed: {
	    ButtonSize: () => ui_vue3_components_button.ButtonSize,
	    AirButtonStyle: () => ui_vue3_components_button.AirButtonStyle,
	    OutlineIcons: () => ui_iconSet_api_core.Outline,
	    description() {
	      return main_core.Loc.getMessage('IM_STICKER_PACK_FORM_DESCRIPTION');
	    }
	  },
	  mounted() {
	    this.uploader.assignBrowse(this.$refs.upload);
	  },
	  methods: {
	    onHelpdeskLinkClick() {
	      im_v2_lib_helpdesk.openHelpdeskArticle('26987270');
	    },
	    loc(phraseCode) {
	      return main_core.Loc.getMessage(phraseCode);
	    }
	  },
	  template: `
		<div class="bx-im-sticker-pack-form-upload-button__container">
			<div class="bx-im-sticker-pack-form-upload-button__button" ref="upload">
				<UiButton
					:size="ButtonSize.MEDIUM"
					:leftIcon="OutlineIcons.PLUS_L"
					:text="loc('IM_STICKER_PACK_FORM_ADD_FILES_BUTTON')"
				/>
			</div>
			<div class="bx-im-sticker-pack-form-upload-button__description">
				<RichLoc
					:text="description"
					placeholder="[url]"
				>
					<template #url="{ text }">
						<span 
							class="bx-im-sticker-pack-form-upload-button__description-link" 
							@click="onHelpdeskLinkClick"
						>
							{{ text }}
						</span>
					</template>
				</RichLoc>
			</div>
		</div>
	`
	};

	const WEBP_MIME_TYPE = 'image/webp';
	const WEBP_MAX_SIZE = 1024 * 500; // 500 KB
	const WEBP_MAX_RESOLUTION = 512; // 512 px
	var _isValid = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("isValid");
	class UploaderFilter extends ui_uploader_core.Filter {
	  constructor(...args) {
	    super(...args);
	    Object.defineProperty(this, _isValid, {
	      value: _isValid2
	    });
	  }
	  apply(file) {
	    return new Promise((resolve, reject) => {
	      if (babelHelpers.classPrivateFieldLooseBase(this, _isValid)[_isValid](file)) {
	        resolve();
	      } else {
	        reject(new ui_uploader_core.UploaderError('UPLOADING_ERROR', main_core.Loc.getMessage('IM_STICKER_PACK_FORM_UPLOADING_LIMITS_WEBP')));
	      }
	    });
	  }
	}
	function _isValid2(file) {
	  if (file.getType() !== WEBP_MIME_TYPE) {
	    return true;
	  }
	  if (file.isAnimated()) {
	    return false;
	  }
	  const isAllowedSize = file.getSize() <= WEBP_MAX_SIZE;
	  const isAllowedResolution = file.getWidth() <= WEBP_MAX_RESOLUTION && file.getHeight() <= WEBP_MAX_RESOLUTION;
	  return isAllowedSize && isAllowedResolution;
	}

	const CONTROLLER_ACTION = 'im.v2.controller.sticker.stickerUploader';
	const MAX_FILES_COUNT = 50;
	const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
	const FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
	var _fileIds = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("fileIds");
	class Uploader extends main_core_events.EventEmitter {
	  constructor() {
	    super();
	    Object.defineProperty(this, _fileIds, {
	      writable: true,
	      value: new Set()
	    });
	    this.setEventNamespace('BX.Messenger.v2.Textarea.StickersUploader');
	  }
	  getOptions() {
	    return {
	      controller: CONTROLLER_ACTION,
	      multiple: true,
	      maxFileCount: MAX_FILES_COUNT,
	      autoUpload: true,
	      maxFileSize: MAX_FILE_SIZE,
	      acceptedFileTypes: FILE_TYPES,
	      events: {
	        [ui_uploader_core.UploaderEvent.FILE_COMPLETE]: event => {
	          const {
	            file
	          } = event.getData();
	          const id = file.getServerFileId();
	          if (id) {
	            babelHelpers.classPrivateFieldLooseBase(this, _fileIds)[_fileIds].add(id);
	            this.emit(Uploader.UPLOAD_EVENT, [...babelHelpers.classPrivateFieldLooseBase(this, _fileIds)[_fileIds].values()]);
	          }
	        },
	        [ui_uploader_core.UploaderEvent.FILE_REMOVE]: event => {
	          const {
	            file
	          } = event.getData();
	          const id = file.getServerFileId();
	          if (id) {
	            babelHelpers.classPrivateFieldLooseBase(this, _fileIds)[_fileIds].delete(id);
	            this.emit(Uploader.UPLOAD_EVENT, [...babelHelpers.classPrivateFieldLooseBase(this, _fileIds)[_fileIds].values()]);
	          }
	        }
	      },
	      filters: [{
	        type: ui_uploader_core.FilterType.PREPARATION,
	        filter: UploaderFilter
	      }]
	    };
	  }
	}
	Uploader.UPLOAD_EVENT = 'uploadedFiles';

	const UploaderWidgetOptions = {
	  readonly: false,
	  hideDropArea: false,
	  slots: {
	    [ui_uploader_tileWidget.TileWidgetSlot.BEFORE_DROP_AREA]: UploadButton
	  }
	};
	const UploaderWidget = {
	  name: 'UploaderWidget',
	  components: {
	    TileWidgetComponent: ui_uploader_tileWidget.TileWidgetComponent
	  },
	  emits: ['uploadedFiles'],
	  computed: {
	    UploaderWidgetOptions: () => UploaderWidgetOptions,
	    uploaderOptions() {
	      return this.uploader.getOptions();
	    }
	  },
	  created() {
	    this.uploader = new Uploader();
	    this.uploader.subscribe(Uploader.UPLOAD_EVENT, event => {
	      const fileIds = event.getData();
	      this.$emit('uploadedFiles', fileIds);
	    });
	  },
	  template: `
		<TileWidgetComponent
			:uploaderOptions="uploaderOptions"
			:widgetOptions="UploaderWidgetOptions"
		/>
	`
	};

	let _ = t => t,
	  _t,
	  _t2;
	const SLIDER_ID = 'im:sticker-pack-form';
	const SLIDER_WIDTH = 700;

	// @vue/component
	const StickerPackForm = {
	  name: 'StickerPackForm',
	  components: {
	    BInput: ui_system_input_vue.BInput,
	    UiButton: ui_vue3_components_button.Button,
	    StickerPackFormHeader,
	    UploaderWidget,
	    UploadButton
	  },
	  props: {
	    pack: {
	      type: Object,
	      default: () => {}
	    }
	  },
	  emits: ['close'],
	  data() {
	    var _this$pack;
	    return {
	      uploadedFileIds: [],
	      packName: ((_this$pack = this.pack) == null ? void 0 : _this$pack.name) || ''
	    };
	  },
	  computed: {
	    InputDesign: () => ui_system_input_vue.InputDesign,
	    AirButtonStyle: () => ui_vue3_components_button.AirButtonStyle,
	    ButtonSize: () => ui_vue3_components_button.ButtonSize,
	    hasUploadedFiles() {
	      return this.uploadedFileIds.length > 0;
	    },
	    isUpdateMode() {
	      return Boolean(this.pack);
	    },
	    saveButtonName() {
	      if (this.isUpdateMode) {
	        return this.loc('IM_STICKER_PACK_FORM_BUTTON_SAVE');
	      }
	      return this.loc('IM_STICKER_PACK_FORM_BUTTON_CREATE');
	    },
	    contentContainer() {
	      return main_core.Tag.render(_t || (_t = _`<div></div>`));
	    },
	    footerContainer() {
	      return main_core.Tag.render(_t2 || (_t2 = _`<div></div>`));
	    },
	    title() {
	      if (this.isUpdateMode) {
	        return main_core.Loc.getMessage('IM_STICKER_PACK_FORM_UPDATE_TITLE');
	      }
	      return main_core.Loc.getMessage('IM_STICKER_PACK_FORM_CREATE_TITLE');
	    },
	    description() {
	      return main_core.Loc.getMessage('IM_STICKER_PACK_FORM_DESCRIPTION');
	    }
	  },
	  created() {
	    this.openSlider();
	  },
	  beforeUnmount() {
	    this.closeSlider();
	  },
	  methods: {
	    openSlider() {
	      main_sidepanel.SidePanel.Instance.open(SLIDER_ID, {
	        cacheable: false,
	        width: SLIDER_WIDTH,
	        contentCallback: () => {
	          return this.createLayoutContent();
	        },
	        events: {
	          onClose: () => {
	            this.$emit('close');
	          }
	        }
	      });
	    },
	    closeSlider() {
	      this.$emit('close');
	      const slider = main_sidepanel.SidePanel.Instance.getSlider(SLIDER_ID);
	      slider == null ? void 0 : slider.close();
	    },
	    createLayoutContent() {
	      return ui_sidepanel_layout.Layout.createContent({
	        title: this.title,
	        design: {
	          section: false,
	          alignButtonsLeft: true
	        },
	        content: () => this.contentContainer,
	        buttons: () => [this.footerContainer]
	      });
	    },
	    onUploadedFiles(ids) {
	      this.uploadedFileIds = ids;
	    },
	    onSave() {
	      if (this.isUpdateMode) {
	        void this.updatePack();
	        return;
	      }
	      void this.createPack();
	    },
	    async createPack() {
	      await im_v2_provider_service_sticker.StickerService.getInstance().createPack({
	        uuids: this.uploadedFileIds,
	        type: im_v2_const.StickerPackType.custom,
	        name: this.packName
	      });
	      im_v2_lib_notifier.Notifier.sticker.onCreatePackComplete();
	      this.$emit('close');
	    },
	    async updatePack() {
	      await im_v2_provider_service_sticker.StickerService.getInstance().updatePack({
	        uuids: this.uploadedFileIds,
	        id: this.pack.id,
	        type: this.pack.type,
	        name: this.packName
	      });
	      im_v2_lib_notifier.Notifier.sticker.onUpdatePackComplete();
	      this.$emit('close');
	    },
	    loc(phraseCode) {
	      return main_core.Loc.getMessage(phraseCode);
	    }
	  },
	  template: `
		<Teleport :to="contentContainer">
			<div class="bx-im-sticker-pack-form__section">
				<StickerPackFormHeader />
				<UploaderWidget @uploadedFiles="onUploadedFiles" />
			</div>
			<div
				v-if="hasUploadedFiles || isUpdateMode"
				class="bx-im-sticker-pack-form__section"
			>
				<div class="bx-im-sticker-pack-form__pack-title">
					{{ loc('IM_STICKER_PACK_FORM_PACK_NAME') }}
				</div>
				<BInput v-model.trim="packName" :design="InputDesign.Primary" />
			</div>
		</Teleport>
		<Teleport :to="footerContainer">
			<div class="bx-im-sticker-pack-form__buttons">
				<UiButton
					:size="ButtonSize.MEDIUM"
					:text="saveButtonName"
					@click="onSave"
				/>
				<UiButton
					:size="ButtonSize.MEDIUM"
					:style="AirButtonStyle.PLAIN"
					:text="loc('IM_STICKER_PACK_FORM_BUTTON_CANCEL')"
					@click="$emit('close');"
				/>
			</div>
		</Teleport>
	`
	};

	// @vue/component
	const AddStickerButton = {
	  name: 'AddStickerButton',
	  components: {
	    BIcon: ui_iconSet_api_vue.BIcon,
	    StickerPackForm
	  },
	  inject: ['disableAutoHide', 'enableAutoHide'],
	  props: {
	    pack: {
	      type: Object,
	      required: true
	    }
	  },
	  data() {
	    return {
	      showPackForm: false
	    };
	  },
	  computed: {
	    OutlineIcons: () => ui_iconSet_api_vue.Outline
	  },
	  methods: {
	    onUpdatePackClick() {
	      this.disableAutoHide();
	      this.showPackForm = true;
	    },
	    onPackFormClose() {
	      this.enableAutoHide();
	      this.showPackForm = false;
	    },
	    loc(phraseCode) {
	      return this.$Bitrix.Loc.getMessage(phraseCode);
	    }
	  },
	  template: `
		<div class="bx-im-stickers-add-sticker-button__container" @click="onUpdatePackClick">
			<div class="bx-im-stickers-add-sticker-button__button">
				<BIcon
					:name="OutlineIcons.PLUS_L"
					:title="loc('IM_TEXTAREA_STICKER_SELECTOR_STICKERS_RECENT')"
				/>
			</div>
			<StickerPackForm v-if="showPackForm" :pack="pack" @close="onPackFormClose" />
		</div>
	`
	};

	// @vue/component
	const StickerItem = {
	  name: 'StickerItem',
	  props: {
	    sticker: {
	      type: Object,
	      required: true
	    }
	  },
	  template: `
		<div class="bx-im-sticker-item__container">
			<img :src="sticker.uri" alt="" loading="lazy" draggable="false" />
		</div>
	`
	};

	// @vue/component
	const PackStickers = {
	  name: 'PackStickers',
	  components: {
	    StickerItem,
	    AddStickerButton
	  },
	  props: {
	    pack: {
	      type: Object,
	      required: true
	    },
	    withAddButton: {
	      type: Boolean,
	      default: true
	    }
	  },
	  emits: ['clickSticker', 'openContextMenuSticker'],
	  computed: {
	    isRecentPack() {
	      return this.pack.id === im_v2_const.RecentPackId && this.pack.type === im_v2_const.RecentPackType;
	    },
	    recentStickers() {
	      return this.$store.getters['stickers/recent/get'];
	    },
	    stickers() {
	      if (this.isRecentPack) {
	        return this.recentStickers;
	      }
	      return this.$store.getters['stickers/getByPack']({
	        id: this.pack.id,
	        type: this.pack.type
	      });
	    },
	    canAddStickers() {
	      if (!this.withAddButton) {
	        return false;
	      }
	      if (this.pack.type !== im_v2_const.StickerPackType.custom) {
	        return false;
	      }
	      return this.pack.authorId === im_v2_application_core.Core.getUserId();
	    }
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
	`
	};

	exports.StickerPackForm = StickerPackForm;
	exports.PackStickers = PackStickers;

}((this.BX.Messenger.v2.Component = this.BX.Messenger.v2.Component || {}),BX.SidePanel,BX.UI.SidePanel,BX.UI.System.Input.Vue,BX.Messenger.v2.Lib,BX.Messenger.v2.Provider.Service,BX.Vue3.Components,BX.UI.Vue3.Components,BX.UI.IconSet,BX.Messenger.v2.Lib,BX.UI.Uploader,BX.Event,BX,BX.UI.Uploader,BX.Messenger.v2.Application,BX.Messenger.v2.Const,BX.UI.IconSet));
//# sourceMappingURL=registry.bundle.js.map
