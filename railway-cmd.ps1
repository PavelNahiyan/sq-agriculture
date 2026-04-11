param([string]$Token)
$env:RAILWAY_TOKEN = $Token
node "C:\Users\SQ AGRICULTURE\AppData\Roaming\npm\node_modules\@railway\cli\bin\railway.js" up --help