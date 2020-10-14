cd /Users/swopnilnep/projects/proj-swopnil-website/development

echo "======= Step 1: Building Hugo Static Pages ======="

# Get current Git Commit hash
$cid=$(git rev-parse HEAD)
hugo -D -d ../remote
cd ../remote

echo "======= Step 2: Staging Commits ======="

git status
git add .
git commit -m "[Automated Commit]:$cid"

echo "======= Step 3: Pushing to Hugo Repository ======="

git push origin master

echo "======= Deployment Complete! ======="