<?php

if (class_exists('call'))
{
	return;
}

use Bitrix\Main\Localization\Loc;
use Bitrix\Call\EventHandler;
use Bitrix\Call\Integration;

class call extends \CModule
{
	public $MODULE_ID = 'call';

	private const EVENTS = [
		'call' => [
			'onCallAiTask' => [[Integration\AI\EventService::class, 'onCallAiTaskStart']],
			'onCallAiOutcome' => [[Integration\AI\EventService::class, 'onCallAiTaskComplete']],
			'onCallAiFailed' => [[Integration\AI\EventService::class, 'onCallAiTaskFailed']],
			'onCallFinished' => [
				[Integration\AI\EventService::class, 'onCallFinished'],
				[EventHandler::class, 'onCallFinished'],
			],
			'onCallTrackDownloaded' => [[\Bitrix\Call\Track\TrackService::class, 'onCallTrackDownloaded']],
		],
		'im' => [
			'OnChatUserDelete' => [[EventHandler::class, 'onChatUserLeave']],
			'OnChatUserAdd' => [[EventHandler::class, 'onChatUserAdd']],
			'OnCallUserStateChange' => [[EventHandler::class, 'onCallUserStateChange']],
		],
		'mobile' => [
			'onGetMobileCounterTypes' => [[\Bitrix\Call\Counter::class, 'onGetMobileCounterTypes']],
			'onGetMobileCounter' => [[\Bitrix\Call\Counter::class, 'onGetMobileCounter']],
		],
		'ai' => [
			'onQueueJobExecute' => [[Integration\AI\CallAIService::class, 'onQueueTaskExecute']],
			'onQueueJobFail' => [[Integration\AI\CallAIService::class, 'onQueueTaskFail']],
			'onTuningLoad' => [[Integration\AI\CallAISettings::class, 'onTuningLoad']],
		],
		'voximplant' => [
			'OnAfterStatisticAdd' => [[Integration\Voximplant\EventHandler::class, 'onAfterStatisticAdd']],
		],
		'bitrix24' => [
			'onDomainChange' => [[EventHandler::class, 'onPortalDomainChange']],
		],
	];

	public function __construct()
	{
		$arModuleVersion = [];

		include(__DIR__.'/version.php');

		if (is_array($arModuleVersion) && array_key_exists('VERSION', $arModuleVersion))
		{
			$this->MODULE_VERSION = $arModuleVersion['VERSION'];
			$this->MODULE_VERSION_DATE = $arModuleVersion['VERSION_DATE'];
		}

		$this->MODULE_NAME = Loc::getMessage('CALL_MODULE_NAME');
		$this->MODULE_DESCRIPTION = Loc::getMessage('CALL_MODULE_DESCRIPTION');
	}

	public function doInstall()
	{
		global $APPLICATION;
		$this->installFiles();
		$this->installDB();

		$APPLICATION->includeAdminFile(
			Loc::getMessage('CALL_INSTALL_TITLE'),
			$_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/call/install/step1.php'
		);
	}

	public function installDB()
	{
		global $APPLICATION, $DB;

		$connection = \Bitrix\Main\Application::getConnection();

		$APPLICATION->resetException();
		$errors = $DB->RunSQLBatch($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/call/install/db/' . $connection->getType() . '/install.sql');
		if (!empty($errors))
		{
			$APPLICATION->throwException(implode('', $errors));
			return false;
		}
		else
		{
			$DB->RunSQLBatch($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/call/install/db/' . $connection->getType() . '/install_ft.sql');
		}
		if (!empty($errors))
		{
			$APPLICATION->throwException(implode('', $errors));
			return false;
		}

		\Bitrix\Main\ModuleManager::registerModule('call');

		$this->installEventHandlers();
		$this->installAgents();


		return true;
	}

	public function installFiles()
	{
		\CopyDirFiles(
			$_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/call/install/js',
			$_SERVER['DOCUMENT_ROOT'].'/bitrix/js',
			true,
			true
		);
		\CopyDirFiles(
			$_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/call/install/components',
			$_SERVER['DOCUMENT_ROOT'].'/bitrix/components',
			true,
			true
		);
		return true;
	}

	public function doUninstall()
	{
		global $APPLICATION;

		$step = (int)($_REQUEST['step'] ?? 1);
		$saveData = ($_REQUEST['savedata'] ?? 'N') == 'Y';
		if ($step < 2)
		{
			$APPLICATION->includeAdminFile(
				Loc::getMessage('CALL_UNINSTALL_TITLE'),
				$_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/call/install/unstep1.php'
			);
		}
		elseif ($step == 2)
		{
			$this->unInstallDB($saveData);
			$this->unInstallFiles();

			$APPLICATION->includeAdminFile(
				Loc::getMessage('CALL_UNINSTALL_TITLE'),
				$_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/call/install/unstep2.php'
			);
		}
	}

	public function unInstallDB(bool $saveData = true)
	{
		global $APPLICATION, $DB;

		if (\Bitrix\Main\Loader::includeModule('call'))
		{
			if (\Bitrix\Call\Settings::isNewCallsEnabled())
			{
				\Bitrix\Call\JwtCall::unregisterPortal();
			}

			\Bitrix\Call\Integration\Im\CallFollowupBot::unRegister();
		}

		$connection = \Bitrix\Main\Application::getConnection();
		$errors = [];
		if (!$saveData)
		{
			$APPLICATION->resetException();
			$errors = $DB->RunSQLBatch($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/call/install/db/' . $connection->getType() . '/uninstall.sql');
		}

		if (!empty($errors))
		{
			$APPLICATION->throwException(implode('', $errors));
			return false;
		}

		$this->unInstallEventHandlers();
		$this->unInstallAgents();

		\CAdminNotify::DeleteByTag('call_registration');/** @see \Bitrix\Call\NotifyService::ADMIN_NOTIFICATION_TAG */

		\Bitrix\Main\ModuleManager::unRegisterModule('call');

		return true;
	}

	/**
	 * Uninstall files.
	 */
	public function uninstallFiles()
	{
		$dir = new \Bitrix\Main\IO\File($_SERVER['DOCUMENT_ROOT'].'/bitrix/js/call');
		if (is_link($dir->getPath()))
		{
			$dir->delete();
		}
		else
		{
			\DeleteDirFilesEx('/bitrix/js/call/');
		}
	}

	public function installEventHandlers(): void
	{
		$eventManager = \Bitrix\Main\EventManager::getInstance();
		foreach (self::EVENTS as $module => $events)
		{
			foreach ($events as $eventCode => $handlers)
			{
				foreach ($handlers as $callback)
				{
					[$class, $method] = $callback;
					$eventManager->registerEventHandler($module, $eventCode, 'call', $class, $method);
				}
			}
		}
	}

	public function unInstallEventHandlers(): void
	{
		$connection = \Bitrix\Main\Application::getConnection();
		$eventManager = \Bitrix\Main\EventManager::getInstance();
		$res = $connection->query("SELECT * FROM b_module_to_module WHERE FROM_MODULE_ID='call' OR TO_MODULE_ID='call'");
		while ($row = $res->fetch())
		{
			$eventManager->unRegisterEventHandler(
				$row['FROM_MODULE_ID'],
				$row['MESSAGE_ID'],
				$row['TO_MODULE_ID'],
				$row['TO_CLASS'],
				$row['TO_METHOD']
			);
		}
	}

	public function installAgents(): void
	{
		/** @see \Bitrix\Call\Integration\AI\CallAIService::finishTasks */
		\CAgent::AddAgent(
			'Bitrix\Call\Integration\AI\CallAIService::finishTasks();',
			'call',
			'N',
			86400,
			'',
			'Y',
			\ConvertTimeStamp(time()+\CTimeZone::GetOffset() + rand(4320, 86400), 'FULL')
		);

		/** @see \Bitrix\Call\Call::finishOldCallsAgent */
		\CAgent::AddAgent(
			'Bitrix\Call\Call::finishOldCallsAgent();',
			'call',
			'N',
			3600,
			'',
			'Y',
			\ConvertTimeStamp(time()+\CTimeZone::GetOffset() + rand(4320, 86400), 'FULL')
		);

		/** @see \Bitrix\Call\JwtCall::registerPortalAgent() */
		\CAgent::AddAgent(
			'Bitrix\Call\JwtCall::registerPortalAgent();',
			'call',
			'N',
			300,
			'',
			'Y',
			\ConvertTimeStamp(time()+\CTimeZone::GetOffset() + rand(100, 500), 'FULL')
		);

		/** @see \Bitrix\Call\Integration\Im\CallFollowupBot::delayRegister */
		\CAgent::AddAgent(
			'Bitrix\Call\Integration\Im\CallFollowupBot::delayRegister();',
			'call',
			'N',
			100,
			'',
			'Y',
			\ConvertTimeStamp(time() + \CTimeZone::GetOffset() + \rand(600, 900), 'FULL')
		);
	}

	public function unInstallAgents(): void
	{
		\CAgent::RemoveModuleAgents('call');
	}
}
