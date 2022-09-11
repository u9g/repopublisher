git clone https://github.com/$REPO code
cd code
git switch -f $BRANCH
if [ $REPO == *yarn ]; then
  wget https://raw.githubusercontent.com/u9g/repopublisher/main/.github/workflows/fixgradle.js
  for ver in "1.7" "1.8" "1.8.9" "1.9.4" "1.10.2" "1.11.2" "1.12.2" "1.13.2"; do
    node fixgradle.js $MAVEN_USERNAME $MAVEN_PASSWORD
    python ./yarn.py $ver publish
  done
else
  wget https://raw.githubusercontent.com/u9g/repopublisher/main/.github/workflows/fixgradle.js
  node fixgradle.js $MAVEN_USERNAME $MAVEN_PASSWORD
  ./gradlew publish
fi
