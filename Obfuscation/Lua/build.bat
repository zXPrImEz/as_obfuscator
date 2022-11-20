@echo off
ECHO Building Aspect ...
RMDIR /s /q build
MKDIR build
glue.exe ./srlua.exe aspect-main.lua build/aspect.exe
robocopy ./src ./build/lua /E>nul

robocopy . ./build lua51.dll>nul

ECHO Done!