@echo off
cd /d "%~dp0.."
set HOST=0.0.0.0
set PORT=14173
node work\static-preview-server.js
