@echo off

echo "#####update start#####"

scp  -P 10034 -v -r ./zjBIM root@112.30.143.209:/usr/local/nginx/html
call hexo-d.bat

echo "#####update end#####"

