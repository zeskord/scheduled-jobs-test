# scheduled-jobs-test
Слушает запросы от регламентных заданий. Сигналит, если отваливаются или наоборот, начали приходить запросы от каких-то левых баз.
Предполагается, что в базе будет внешняя обработка, команда которой висит на регламентном заднии. Эта обработка будет периодически слать запросы.

В корне проекта создать файл config.json. Заполнить его по образцу из config-example.json.
secure: true, только если порт 465.

Идентификатор получить из базы: Константа.ИдентификаторИнформационнойБазы

Как сделать EXE.
npm i nexe -g
nexe index.js

Запуск службы в Windows
New-Service -Name "ScheduledJobsTest" -BinaryPathName C:\Git\scheduled-jobs-test\scheduled-jobs-test.exe -DisplayName "1C Мониторинг активности регламентных заданий" -Description "Слушает запросы от регламентных заданий сервера 1С, сообщает, если долго нет запросов."

Удаление службы в Windows
(Get-WmiObject win32_service -Filter "name='ScheduledJobsTest'").delete()
