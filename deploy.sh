#!/usr/bin/env bash

HEROKU_REPOSITORY="https://git.heroku.com/subsidystorieseu.git"

# check if git cli is available
if ! which git 1>/dev/null 2>/dev/null; then
   echo "Git cli not installed.";
   exit 1;
fi

# create temporary branch for deploy
DEPLOY_BRANCH="temporary/heroku-deploy"
PREVIOUS_BRANCH=`git rev-parse --abbrev-ref HEAD`

git checkout ${DEPLOY_BRANCH} 2>/dev/null || git checkout -b ${DEPLOY_BRANCH}

if [ $? == 0 ]; then
  # install dependencies, build and add everything to git
  if npm install && npm run build && npm run review && npm test; then
    rm ./public/.gitignore 2>/dev/null
    git add --force ./public
    git commit -m "Build"
    # deploy
    if git push --force ${HEROKU_REPOSITORY} ${DEPLOY_BRANCH}:master; then
      # successful build - return to previous branch and cleanup
      git checkout ${PREVIOUS_BRANCH} 2>/dev/null
      git branch -D ${DEPLOY_BRANCH} 2>/dev/null

      echo ""
      echo "Build succeeded. Open you application using \`heroku apps:open\`"
      exit 0
    fi
  fi
fi

# cleanup anyway, and shor error message
git checkout ${PREVIOUS_BRANCH} 2>/dev/null
git branch -D ${DEPLOY_BRANCH} 2>/dev/null

echo ""
echo "Build failed."
exit 2
