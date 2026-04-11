cd "E:\sq agriculture website\sq-agriculture"
rmdir /s /q .git
"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" config user.email "faisal.nahiyan@gmail.com"
"C:\Program Files\Git\bin\git.exe" config user.name "Faisal Nahiyan"
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "feat: initial SQ Agriculture website setup with Next.js, NestJS, admin panel, and product catalog"
"C:\Program Files\Git\bin\git.exe" branch -M main
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/PavelNahiyan/sq-agriculture.git
"C:\Program Files\Git\bin\git.exe" push -f origin main