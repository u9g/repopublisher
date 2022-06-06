git clone https://github.com/$REPO code
cd code
if [[ $REPO == *yarn ]]
then
  for ver in "1.7" "1.8" "1.8.9" "1.9.4" "1.10.2" "1.11.2" "1.12.2" "1.13.2"; do
    wget https://raw.githubusercontent.com/u9g/repopublisher/main/.github/workflows/fixgradle.js
    node fixgradle.js $MAVEN_USERNAME $MAVEN_PASSWORD
    ./gradlew publish
    echo $ver
  done
else
  git switch -f $BRANCH
  wget https://raw.githubusercontent.com/u9g/repopublisher/main/.github/workflows/fixgradle.js
  node fixgradle.js $MAVEN_USERNAME $MAVEN_PASSWORD
  ./gradlew publish
fi
