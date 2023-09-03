# scheduled-jobs-test
Слушает запросы от регламентных заданий. Сигналит, если отваливаются ~или наоборот, начали приходить запросы от каких-то левых баз~.
Предполагается, что в базе будет внешняя обработка, команда которой висит на регламентном заднии. Эта обработка будет периодически слать запросы.

В корне проекта создать файл config.yaml. Заполнить его по образцу из config-example.yaml.

Как сделать EXE.
```
npm i nexe -g
nexe index.js
```
Если что не так, то смотреть пакет pkg, он даже круче.

Установка службы в Windows
```
nssm install ScheduledJobsTest C:\GIT\scheduled-jobs-test\scheduled-jobs-test.exe
nssm set ScheduledJobsTest DisplayName "1C Мониторинг активности регламентных заданий"
nssm set ScheduledJobsTest Description "Слушает запросы от регламентных заданий сервера 1С, сообщает, если долго нет запросов."
```

Удаление службы в Windows
```
nssm remove ScheduledJobsTest
```
или в PowerShell
```
(Get-WmiObject win32_service -Filter "name='ScheduledJobsTest'").delete()
```
