<?php
return [
    'exception_handling' => [
        'value' => [
            'debug' => true,
            'handled_errors_types' => 0,
            'exception_errors_types' => 0,
            'ignore_silence' => false,
            'assertion_throws_exception' => true,
            'log' => null,
        ],
        'readonly' => false,
    ],
    'connections' => [
        'value' => [
            'default' => [
                'host' => 'db',
                'database' => 'bitrix',
                'login' => 'bitrix',
                'password' => 'bitrix',
                'options' => 2,
                'className' => '\\Bitrix\\Main\\DB\\MysqliConnection',
            ],
        ],
        'readonly' => false,
    ],
];
