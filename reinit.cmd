del logs\*.* /Q
ServerEDO.exe run=com.spt.moskit.tiers.logic_tier.execution.commands.ClearDatabaseCommand
rem ServerEDO.exe run=com.spt.mosquito.core.module_manager.cmd_executor.commands.implementation.DistributiveFillingCommand dir_path=C:\wamp\www\mosquito\distrib
ServerEDO.exe run=com.spt.moskit.tiers.logic_tier.execution.commands.DistributiveFillingCommand
del logs\*.* /Q
start ServerEDO.exe