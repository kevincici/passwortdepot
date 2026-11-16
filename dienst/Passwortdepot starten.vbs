' Passwortdepot starten
' Startet den lokalen Dienst unsichtbar (falls er noch nicht läuft) und öffnet die App im Standardbrowser.
' Diese Datei gehört in den Passwortdepot-Ordner (neben Passwortdepot.html und den Ordner "dienst").
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
server = dir & "\dienst\server.js"
If Not fso.FileExists(server) Then
  MsgBox "Der Dienst wurde nicht gefunden:" & vbCrLf & server, 16, "Passwortdepot"
  WScript.Quit 1
End If
' Läuft der Dienst schon, beendet sich der zweite Start von selbst (Port belegt).
sh.Run "node """ & server & """", 0, False
WScript.Sleep 800
sh.Run "http://127.0.0.1:47811/"
