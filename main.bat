echo OFF
set dt=%date:-=_%_%time:~0,2%_%time:~3,2%_%time:~6,2%
type NUL >> cookie_store/cookies_%dt%.txt
cd ../bin
phantomjs --proxy=127.0.0.1:9150 --proxy-type=socks5 --cookies-file=cookies_%dt%.txt ../scripts/source/ref2.js http://rk-awesome.blogspot.in/ http://stackoverflow.com/questions/11010834/how-to-run-multiple-dos-commands-in-parallel
cd ../scripts