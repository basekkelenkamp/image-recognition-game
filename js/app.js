const classifier = ml5.imageClassifier('MobileNet', modelLoaded)
let synth = window.speechSynthesis
let animal

//uploading
const image = document.getElementById('output')
const fileButton = document.querySelector("#file")
let outputText = document.getElementById('output-placeholder')

//Event listeners
fileButton.addEventListener("change", (event)=>loadFile(event))
image.addEventListener('load', () => userImageUploaded())


function loadFile(event) {

    if(event.target.files[0] !== undefined) {
        image.src = URL.createObjectURL(event.target.files[0])
    }
}

function returnRandomQuestion() {
    image.src = ''

    if(document.getElementsByTagName('button')[0] !== undefined) {
        document.getElementsByTagName('button')[0].remove()
    }

    let animals = ["zebra", "lion", "hen"]
    animal = animals[Math.floor(Math.random() * animals.length)]

    outputText.innerHTML = "Make a picture of a <b>" + animal + "</b>. Can you do it?"

}

function userImageUploaded(){

    if(document.getElementById('result') == null){
        let resultDiv = document.createElement('div');
        resultDiv.setAttribute("id", "result");
        document.body.appendChild(resultDiv)
    }

    console.log("The image is now visible in the DOM")
    classifyImage()
}


function modelLoaded() {
    console.log('Model Loaded!')
    returnRandomQuestion()
}


function classifyImage() {

    classifier.classify(document.getElementById('output'), (err, results) => {
        console.log(results),
        imageClassified(results)
    })
    
}

function imageClassified(results) {

    if(results[0].label.includes(animal) || results[1].label.includes(animal)){
        speak(`That is indeed a ${animal}! Good job.`)
    } else {
        speak(`That is not correct. What I'm seeing is a ${results[0].label} or maybe a ${results[1].label}.`)
    }

    let playAgain = document.createElement('button')
    playAgain.innerHTML = 'Play again?'
    document.getElementById('result').appendChild(playAgain)
    playAgain.addEventListener('click', () => returnRandomQuestion())
}


function speak(message) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (message !== '') {
        let utterThis = new SpeechSynthesisUtterance(message)
        utterThis.lang = 'en-US'
        synth.speak(utterThis)
    }

}