echo OFF
:: set hr=%time:~0,2%
:: if "%hr:~0,1%" equ " " set hr=0%hr:~1,1%
:: echo Archive_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%hr%%time:~3,2%%time:~6,2%.zip
:: echo .\%me%.%DATE:~10,4%_%DATE:~4,2%_%DATE:~7,2%%TIME:~0,2%_%TIME:~3,2%_%TIME:~6,2%.txt
set dt=%date:-=_%_%time:~0,2%_%time:~3,2%_%time:~6,2%
type NUL >> cookies_%dt%.txt