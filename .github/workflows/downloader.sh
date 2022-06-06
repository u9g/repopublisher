git clone https://github.com/${{github.event.inputs.repo}} code
cd code
if [[ ${{github.event.inputs.repo}} == *yarn ]]
then
  for ver in "1.8" "1.9.4"; do
    echo ver
  done
else 
  wget https://raw.githubusercontent.com/u9g/repopublisher/main/.github/workflows/fixgradle.js
  node fixgradle.js ${{ secrets.MAVEN_USERNAME }} ${{ secrets.MAVEN_PASSWORD }}
  ./gradlew publish
fi
