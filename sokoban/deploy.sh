
rsync -riP --exclude '.DS_Store' --exclude '.swp' --exclude '.git' --exclude '.htaccess' --delete . $phpstrato:/var/www/html/sokoban/ | grep "f.sT...."
