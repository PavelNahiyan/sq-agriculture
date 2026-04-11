param([string]$Token)
$env:RAILWAY_TOKEN = $Token
node "C:\Users\SQ AGRICULTURE\AppData\Roaming\npm\node_modules\@railway\cli\bin\railway.js" project link --project 3dc1bd26-c3e8-42b4-884b-4ec2c94efecf --environment production