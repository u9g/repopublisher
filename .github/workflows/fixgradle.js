const FILE_NAME = 'build.gradle'
const [,,USERNAME,PASSWORD] = require('process').argv
const txt = require('fs').readFileSync(FILE_NAME, 'utf-8')

function findBlockBetween(startIx, endIx, wantedText, onlyUseTopLevelMatches = true) {
    let sofar = ''
    let doneLookingForWantedText = false
    let waitingForFirstCurly = false
    let startReplaceIndex = 0
    let endReplaceIndex = 0
    let curlies = 0
    let lookingForBalencedCurlies = false
    
    let curlyNestingLevel = 0
    let ix = 0
    for (const text of txt) {
        ix++
        if (text === '{') curlyNestingLevel++
        if (text === '}') curlyNestingLevel--
        if (ix <= startIx || ix >= endIx) continue
        // if(a)process.stdout.write(`${text}(${curlyNestingLevel})`)
        if (!onlyUseTopLevelMatches || curlyNestingLevel === 0) sofar += text
        if (!doneLookingForWantedText && !wantedText.startsWith(sofar)) {
            sofar = ''
        } else if (wantedText === sofar) {
            console.log('WE FOUND IT: ' + wantedText)
            waitingForFirstCurly = true
            sofar = ''
            doneLookingForWantedText = true
        } else if (waitingForFirstCurly && text === '{') {
            curlies++
            waitingForFirstCurly = false
            lookingForBalencedCurlies = true
            startReplaceIndex = ix-1
        } else if (lookingForBalencedCurlies) {
            if (text === '{') curlies++
            if (text === '}') curlies--
            if (curlies === 0) {
                endReplaceIndex = ix
                lookingForBalencedCurlies = false
            }
        }
    }
    return [startReplaceIndex, endReplaceIndex]
}

const URL = 'https://maven.u9g.dev'

const newRepositoryBlock = `{\n\t\tmaven {
    url '${URL}'
    credentials {
        username '${USERNAME}'
        password '${PASSWORD}'
    }
    authentication {
        basic(BasicAuthentication)
    }
}\n}`

const REPOSITORIES = 'repositories'
let output = ''
// add our repo to the repositories block
const [reposStart] = findBlockBetween(0, txt.length, REPOSITORIES)
output += txt.substring(0, reposStart)
output += newRepositoryBlock.substring(0,newRepositoryBlock.length-1)
const reposEnd = reposStart+1
// remake publishing block
const publishingBlock = findBlockBetween(0, txt.length, 'publishing')
let startOfPublicationRepositories = publishingBlock[1]-1
let endOfPublicationRepositories = publishingBlock[1]-1
if (txt.substring(...publishingBlock).includes(REPOSITORIES)) { // there is a publishing block, we will have to overwrite it...
    const [start, end] = findBlockBetween(...publishingBlock, REPOSITORIES, false)
    startOfPublicationRepositories = start - `${REPOSITORIES} `.length
    endOfPublicationRepositories = end
}
output += txt.substring(reposEnd, startOfPublicationRepositories)
output += `${REPOSITORIES} ${newRepositoryBlock}`
output += txt.substring(endOfPublicationRepositories)
require('fs').writeFileSync(FILE_NAME, output)
