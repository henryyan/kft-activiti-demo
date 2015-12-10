@echo off
cd %~dp0
call mvn exec:java -Ph2server
pause