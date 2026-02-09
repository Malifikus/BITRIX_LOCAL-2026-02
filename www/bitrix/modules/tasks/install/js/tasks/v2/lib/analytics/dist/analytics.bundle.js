/* eslint-disable */
this.BX = this.BX || {};
this.BX.Tasks = this.BX.Tasks || {};
this.BX.Tasks.V2 = this.BX.Tasks.V2 || {};
(function (exports,main_core,ui_analytics,ui_uploader_core,tasks_v2_const) {
	'use strict';

	const settings = main_core.Extension.getSettings('tasks.v2.lib.analytics');
	var _sendRoleChange = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("sendRoleChange");
	var _sendData = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("sendData");
	var _getTypeFromCardType = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("getTypeFromCardType");
	class AnalyticsSender {
	  constructor() {
	    Object.defineProperty(this, _getTypeFromCardType, {
	      value: _getTypeFromCardType2
	    });
	    Object.defineProperty(this, _sendData, {
	      value: _sendData2
	    });
	    Object.defineProperty(this, _sendRoleChange, {
	      value: _sendRoleChange2
	    });
	  }
	  sendClickCreate(params, options) {
	    var _params$context;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.ClickCreate,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context = params == null ? void 0 : params.context) != null ? _params$context : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: params.element,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p1: tasks_v2_const.Analytics.Params.IsDemo(settings.isDemo),
	      p2: settings.userType,
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      ...(options.collabId ? {
	        p4: tasks_v2_const.Analytics.Params.CollabId(options.collabId)
	      } : {}),
	      p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	    });
	  }
	  sendTaskView(params, options) {
	    var _params$context2;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.TaskView,
	      type: tasks_v2_const.Analytics.Type.Task,
	      c_section: (_params$context2 = params == null ? void 0 : params.context) != null ? _params$context2 : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: params.element,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p1: tasks_v2_const.Analytics.Params.IsDemo(settings.isDemo),
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	    });
	  }
	  sendTaskComplete(params, options) {
	    var _params$context3;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.TaskComplete,
	      type: tasks_v2_const.Analytics.Type.Task,
	      c_section: (_params$context3 = params == null ? void 0 : params.context) != null ? _params$context3 : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: params.element,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p1: tasks_v2_const.Analytics.Params.TaskId(options.taskId)
	    });
	  }
	  sendOpenFullCard(params) {
	    var _params$context4;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.FillTaskFormView,
	      type: tasks_v2_const.Analytics.Type.TaskMini,
	      c_section: (_params$context4 = params == null ? void 0 : params.context) != null ? _params$context4 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: tasks_v2_const.Analytics.SubSection.FullTaskForm,
	      c_element: tasks_v2_const.Analytics.Element.FullFormButton,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p1: tasks_v2_const.Analytics.Params.IsDemo(settings.isDemo)
	    });
	  }
	  sendAddTask(params, options) {
	    var _options$event, _params$context5;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: (_options$event = options.event) != null ? _options$event : tasks_v2_const.Analytics.Event.TaskCreate,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context5 = params == null ? void 0 : params.context) != null ? _params$context5 : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: params.element,
	      status: options.isSuccess ? tasks_v2_const.Analytics.Status.Success : tasks_v2_const.Analytics.Status.Error,
	      p1: tasks_v2_const.Analytics.Params.TaskId(options.taskId),
	      p2: settings.userType,
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      ...(options.collabId ? {
	        p4: tasks_v2_const.Analytics.Params.CollabId(options.collabId)
	      } : {}),
	      p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	    });
	  }
	  sendAddTaskWithCheckList(params, options) {
	    var _params$context6;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.TaskCreateWithChecklist,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context6 = params == null ? void 0 : params.context) != null ? _params$context6 : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: params.element,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p1: tasks_v2_const.Analytics.Params.TaskId(options.taskId),
	      p2: settings.userType,
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      ...(options.collabId ? {
	        p4: tasks_v2_const.Analytics.Params.CollabId(options.collabId)
	      } : {}),
	      p5: tasks_v2_const.Analytics.Params.ChecklistCount(options.checklistCount, options.checklistItemsCount)
	    });
	  }
	  sendDescription(params, options) {
	    var _params$context7;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.DescriptionTask,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context7 = params == null ? void 0 : params.context) != null ? _params$context7 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: tasks_v2_const.Analytics.SubSection.TaskCard,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p2: tasks_v2_const.Analytics.Params.HasDescription(options.hasDescription),
	      p3: tasks_v2_const.Analytics.Params.HasScroll(options.hasScroll)
	    });
	  }
	  sendAddProject(params, options) {
	    var _params$context8;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.AddProject,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context8 = params == null ? void 0 : params.context) != null ? _params$context8 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: tasks_v2_const.Analytics.SubSection.TaskCard,
	      c_element: tasks_v2_const.Analytics.Element.ProjectButton,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	    });
	  }
	  sendDeadlineSet(params, options) {
	    var _params$context9;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.DeadlineSet,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context9 = params == null ? void 0 : params.context) != null ? _params$context9 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: tasks_v2_const.Analytics.SubSection.TaskCard,
	      c_element: options.element,
	      status: tasks_v2_const.Analytics.Status.Success,
	      ...(options.taskId ? {
	        p1: tasks_v2_const.Analytics.Params.TaskId(options.taskId)
	      } : {}),
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	    });
	  }
	  sendAssigneeChange(params, options) {
	    babelHelpers.classPrivateFieldLooseBase(this, _sendRoleChange)[_sendRoleChange](params, {
	      ...options,
	      event: tasks_v2_const.Analytics.Event.AssigneeChange,
	      element: tasks_v2_const.Analytics.Element.ChangeButton
	    });
	  }
	  sendAddCoexecutor(params, options) {
	    babelHelpers.classPrivateFieldLooseBase(this, _sendRoleChange)[_sendRoleChange](params, {
	      ...options,
	      event: tasks_v2_const.Analytics.Event.AddCoexecutor,
	      element: tasks_v2_const.Analytics.Element.CoexecutorButton
	    });
	  }
	  sendAddViewer(params, options) {
	    babelHelpers.classPrivateFieldLooseBase(this, _sendRoleChange)[_sendRoleChange](params, {
	      ...options,
	      event: tasks_v2_const.Analytics.Event.AddViewer,
	      element: tasks_v2_const.Analytics.Element.ViewerButton
	    });
	  }
	  sendAttachFile(params, options) {
	    var _FileOrigin$CLIENT$op, _params$context10;
	    const subSection = (_FileOrigin$CLIENT$op = {
	      [ui_uploader_core.FileOrigin.CLIENT]: tasks_v2_const.Analytics.SubSection.MyFiles
	    }[options.fileOrigin]) != null ? _FileOrigin$CLIENT$op : tasks_v2_const.Analytics.SubSection.Bitrix24Files;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.AttachFile,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context10 = params == null ? void 0 : params.context) != null ? _params$context10 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: subSection,
	      c_element: tasks_v2_const.Analytics.Element.UploadButton,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p1: tasks_v2_const.Analytics.Params.FileSize(options.fileSize),
	      p2: settings.userType,
	      p3: tasks_v2_const.Analytics.Params.FilesCount(options.filesCount),
	      ...(options.collabId ? {
	        p4: tasks_v2_const.Analytics.Params.CollabId(options.collabId)
	      } : {}),
	      p5: tasks_v2_const.Analytics.Params.FileExtension(options.fileExtension)
	    });
	  }
	  sendStatusSummaryAdd(params, options) {
	    var _params$context11, _options$subSection, _options$element;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.StatusSummaryAdd,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context11 = params == null ? void 0 : params.context) != null ? _params$context11 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: (_options$subSection = options == null ? void 0 : options.subSection) != null ? _options$subSection : tasks_v2_const.Analytics.SubSection.TaskCard,
	      c_element: (_options$element = options == null ? void 0 : options.element) != null ? _options$element : tasks_v2_const.Analytics.Element.AddResult,
	      status: options.isSuccess ? tasks_v2_const.Analytics.Status.Success : tasks_v2_const.Analytics.Status.Error,
	      ...(options.taskId ? {
	        p1: tasks_v2_const.Analytics.Params.TaskId(options.taskId)
	      } : {})
	    });
	  }
	  sendAddChecklist(params, options) {
	    var _params$context12;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.AddChecklist,
	      type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	      c_section: (_params$context12 = params == null ? void 0 : params.context) != null ? _params$context12 : tasks_v2_const.Analytics.Section.Tasks,
	      c_sub_section: options.isNewTask ? tasks_v2_const.Analytics.TaskState.New : tasks_v2_const.Analytics.TaskState.Existing,
	      c_element: tasks_v2_const.Analytics.Element.CheckListButton,
	      status: tasks_v2_const.Analytics.Status.Success,
	      p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	      p4: tasks_v2_const.Analytics.Params.ChecklistPointsCount(options.checklistPointsCount),
	      p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	    });
	  }
	  sendRoleClick(params) {
	    var _params$context13;
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.RoleClick,
	      type: tasks_v2_const.Analytics.Type.Task,
	      c_section: (_params$context13 = params == null ? void 0 : params.context) != null ? _params$context13 : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: tasks_v2_const.Analytics.Element.RoleButton,
	      p1: tasks_v2_const.Analytics.Params.IsDemo(settings.isDemo)
	    });
	  }
	  sendRoleClickType(params, options) {
	    var _params$context14;
	    const element = {
	      view_all: tasks_v2_const.Analytics.Element.RoleAllButton,
	      view_role_responsible: tasks_v2_const.Analytics.Element.RoleDoingButton,
	      view_role_accomplice: tasks_v2_const.Analytics.Element.RoleHelpButton,
	      view_role_auditor: tasks_v2_const.Analytics.Element.RoleWatchingButton,
	      view_role_originator: tasks_v2_const.Analytics.Element.RoleAssignedButton
	    }[options.role];
	    babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	      event: tasks_v2_const.Analytics.Event.RoleClickType,
	      type: tasks_v2_const.Analytics.Type.Task,
	      c_section: (_params$context14 = params == null ? void 0 : params.context) != null ? _params$context14 : tasks_v2_const.Analytics.Section.Tasks,
	      ...(params.additionalContext ? {
	        c_sub_section: params.additionalContext
	      } : {}),
	      c_element: element,
	      p1: tasks_v2_const.Analytics.Params.IsDemo(settings.isDemo),
	      p2: tasks_v2_const.Analytics.Params.FilterEnabled(options.isFilterEnabled)
	    });
	  }
	}
	function _sendRoleChange2(params, options) {
	  var _params$context15;
	  babelHelpers.classPrivateFieldLooseBase(this, _sendData)[_sendData]({
	    event: options.event,
	    type: babelHelpers.classPrivateFieldLooseBase(this, _getTypeFromCardType)[_getTypeFromCardType](options.cardType),
	    c_section: (_params$context15 = params == null ? void 0 : params.context) != null ? _params$context15 : tasks_v2_const.Analytics.Section.Tasks,
	    c_sub_section: tasks_v2_const.Analytics.SubSection.TaskCard,
	    c_element: options.element,
	    status: tasks_v2_const.Analytics.Status.Success,
	    ...(options.taskId ? {
	      p1: tasks_v2_const.Analytics.Params.TaskId(options.taskId)
	    } : {}),
	    p3: tasks_v2_const.Analytics.Params.ViewersCount(options.viewersCount),
	    p5: tasks_v2_const.Analytics.Params.CoexecutorsCount(options.coexecutorsCount)
	  });
	}
	function _sendData2(data) {
	  ui_analytics.sendData({
	    tool: tasks_v2_const.Analytics.Tool.Tasks,
	    category: tasks_v2_const.Analytics.Category.TaskOperations,
	    ...data
	  });
	}
	function _getTypeFromCardType2(cardType) {
	  return {
	    [tasks_v2_const.CardType.Compact]: tasks_v2_const.Analytics.Type.TaskMini,
	    [tasks_v2_const.CardType.Full]: tasks_v2_const.Analytics.Type.Task
	  }[cardType];
	}
	const analytics = new AnalyticsSender();

	exports.settings = settings;
	exports.AnalyticsSender = AnalyticsSender;
	exports.analytics = analytics;

}((this.BX.Tasks.V2.Lib = this.BX.Tasks.V2.Lib || {}),BX,BX.UI.Analytics,BX.UI.Uploader,BX.Tasks.V2.Const));
//# sourceMappingURL=analytics.bundle.js.map
