param([string]$Token)
$headers = @{
    "Authorization" = "Bearer $Token"
}
$response = Invoke-RestMethod -Uri "https://backboard.railway.app/v2/projects/3dc1bd26-c3e8-42b4-884b-4ec2c94efecf" -Headers $headers -Method Get
$response | ConvertTo-Json