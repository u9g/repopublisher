git clone https://github.com/$REPO code
cd code
git switch -f $BRANCH
if [[ $REPO == *yarn ]]
then
  for ver in "1.8" "1.9.4"; do
    echo $ver
  done
else 
  wget https://raw.githubusercontent.com/u9g/repopublisher/main/.github/workflows/fixgradle.js
  node fixgradle.js $MAVEN_USERNAME $MAVEN_PASSWORD
  ./gradlew publish
fi
