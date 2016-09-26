cd ../examples 

for /l %%x in (1, 1, 100) do (
   echo %%x
   start /B call ../scripts/referer.bat
)