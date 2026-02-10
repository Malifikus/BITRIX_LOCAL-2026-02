<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("OTUS ДЗ Отладка и логирование");

# Подключаем класс логгера
require_once $_SERVER['DOCUMENT_ROOT'] . '/local/classes/OTUSLogger.php';

# Получаем IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

# Пишем в лог
OTUSLogger::log("HTTP запрос от IP: $ip");

# Время для вывода на странице
$time = date('Y-m-d H:i:s');

# HTML визуализация
?>

<h1>ДЗ Отладка и логирование</h1>

<div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3>Лог добавлен</h3>
    <p><strong>Дата:</strong> <?= htmlspecialchars($time) ?></p>
    <p><strong>IP:</strong> <?= htmlspecialchars($ip) ?></p>
    <p><strong>Лог:</strong> <code>/otus.log</code></p>
</div>

<ul>
    <li><a href="/otus.log" target="_blank">Посмотреть лог</a></li>
</ul>

<h3>Содержимое лога:</h3>
<pre style="background:#f5f5f5;padding:10px;max-height:300px;overflow:auto;">
<?php
$logPath = $_SERVER['DOCUMENT_ROOT'] . '/otus.log';
echo file_exists($logPath) 
    ? htmlspecialchars(file_get_contents($logPath)) 
    : 'Лог пуст';
?>
</pre>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>