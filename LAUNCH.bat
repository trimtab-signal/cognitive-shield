@echo off
title Cognitive Shield - Launch Sequence
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "LAUNCH.ps1"
pause

