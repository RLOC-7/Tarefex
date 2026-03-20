@echo off

set JAVA_HOME=C:\Program Files\BellSoft\LibericaJDK-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo Iniciando TAREFEX API em http://localhost:8080/api ...

call mvnw.cmd spring-boot:run

pause