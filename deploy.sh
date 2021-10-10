cd /Users/swopnil/Developer/00-SwopnilWebsite

echo "======= Step 0: Backing Up Necessary Files ======="

# Temporarily move git and CNAME files
mkdir backup
mv -v remote/CNAME backup
mv -v remote/.gitignore backup
mv -v remote/.git backup/.git

rm -rf remote
mkdir remote
cd development

echo "======= Step 1: Building Hugo Static Pages ======="

# Get current Git Commit hash
cid=$(git rev-parse HEAD)
hugo -d ../remote
cd ../remote

echo "======= Step 2: Staging Commits ======="

mv -v ../backup/.git .git 
mv -v ../backup/.gitignore .
mv -v ../backup/CNAME .
rmdir ../backup
git status
git add .
git commit -m "[Automated Commit]:${cid}"

echo "======= Step 3: Pushing to Hugo Repository ======="

git push origin deploy

echo "======= Deployment Complete! ======="
