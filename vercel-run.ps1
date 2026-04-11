param([string]$Token)
$env:VERCEL_TOKEN = $Token
node "C:\Users\SQ AGRICULTURE\AppData\Roaming\npm\node_modules\vercel\dist\vc.js" projects list