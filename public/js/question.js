// Global variables
let team_id = document.getElementById("team_id").value;
let currentindex = 0;
let masks = document.querySelectorAll('.mask');
let questionContainer = document.querySelector('.questio_container .question');
let optionsContainer = document.querySelector('.questio_container .showQuestions');
let submitButton = document.querySelector('.questio_container .buttons .submit');
let quessButton = optionsContainer.querySelector(".optionsContainer");
let quessInput = optionsContainer.querySelector("#guessImage");
let closeguess = optionsContainer.querySelector(".closeguess");
let currentQuestionResponse; // Variable to store the current question response
let currentRound;
let currentRoundImage;
let team;
let answeredQuestions = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
];

let currentTime;

// Set the timer for 10 minutes
const timerDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

// Get the current time
const startTime = Date.now();

// Function to update the timer display
function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = timerDuration - elapsedTime;

    // Calculate minutes and seconds
    const minutes = Math.floor(remainingTime / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
   

    if (seconds < 10) {
        // Display the remaining time
        document.getElementById("timer").textContent = `0${minutes} : 0${seconds} `;
        currentTime = `0${minutes} : 0${seconds} `
    }else{
        document.getElementById("timer").textContent = `0${minutes} : ${seconds} `;
        currentTime = `0${minutes} : ${seconds} `
    }

    // Check if the timer has finished
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "Time's up!";
        setTimeLapse(team_id);
    }
}

// Update the timer display every second
const timerInterval = setInterval(updateTimer, 1000);

// Initial call timerInterval

let full_screen = document.querySelector(".full_screen");

full_screen.addEventListener("click",()=>{
    full_screen.classList.toggle("active");
    full_screen.parentElement.classList.toggle("active");
})

setTimeout(() => {
    if (currentRound == "round1") {
        currentRoundImage = team.round1_image;
    }else if (currentRound == "round2") {
        currentRoundImage = team.round2_image;
    }else{
        currentRoundImage = team.round3_image;
    }

    document.querySelector(".image").setAttribute("src","/assets/img/"+(currentRoundImage.image_url));
    console.log(currentRoundImage.Image_name);

}, 500);


let profile = document.querySelector(".profile");

profile.addEventListener("click", ()=>{
    document.querySelector(".menu_options").classList.toggle("active");
});

let side_button = document.querySelector(".side_button");
let side_bar = document.querySelector(".side_bar");
let main = document.querySelector(".main");

side_button.addEventListener("click",()=>{
    side_button.classList.toggle("active");
    side_bar.classList.toggle("active");
    main.classList.toggle("active");
});

function submitGuess(){
    if(optionsContainer.querySelector("#guessImage").value.trim() == currentRoundImage.Image_name.trim()){
        setImageFound(team_id);
    }else{
        alert("wrong Guess");
        closeGuess()
    }
}

function displayGuess(){
    questionContainer.textContent = "Guess the image...?";
    optionsContainer.innerHTML = (`
        <button class="closeguess" onclick="closeGuess()">X</button> 
        <input type="text" name="quessImage" id="guessImage"> 
        <br>
        <button class="guessButton"  onclick="submitGuess()">guess</button> 
    `);
    submitButton.style.display = "none"
}

function closeGuess(){
    submitButton.style.display = "block"
    let newIndex = answeredQuestions.indexOf(false);
        if (newIndex != -1) {
            getQuestionDetails(newIndex);
            currentindex = newIndex;
        }else{
            optionsContainer.innerHTML = ` 
                <p class="highlight"><i class="fas fa-hand-point-right"></i> No more Options you have .... you have failed to found the image...😭 </p>
            `
        }
}
function checkAnswers(){
    masks.forEach(function(mask, index){
        if (answeredQuestions[index] == true) {
            mask.classList.add("active");
        }else{
            mask.classList.remove("active");
        }
    })
}

function getTeamDetails(teamid){
    let xhr = new XMLHttpRequest();
    document.querySelector(".load_question").classList.add("active");
    xhr.open('GET', '/details/' + teamid, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let response;
                try {
                    response = JSON.parse(xhr.responseText);
                    console.log("Response:", response);
                    document.querySelector(".load_question").classList.remove("active");
                } catch (error) {
                    console.error("Error parsing response:", error);
                    return;
                }
                if (response.success) {
                    answeredQuestions = response.team.AnsweredQuestions;
                    currentRound = response.team.currentRound;
                    // currentRoundImage = response.team;
                    team = response.team
                    console.log(currentRoundImage);
                    document.querySelector(".imagefound").innerHTML = response.team.images_found
                    document.querySelector(".score").innerHTML = response.team.score
                    document.querySelector(".attempts").innerHTML = response.team.attempts
                    checkAnswers()
                    console.log(answeredQuestions);
                } else {
                    console.error("Error:", response.message);
                }
            } else {
                console.error("Error:", xhr.status);
            }
        }
    };
    xhr.send();
}

getTeamDetails(team_id);


// Function to set timeLapsed update
function setTimeLapse(teamId) {
    let timeLapseXhr = new XMLHttpRequest();
    timeLapseXhr.open('PUT', '/timeLapse', true);
    timeLapseXhr.setRequestHeader('Content-Type', 'application/json');
    timeLapseXhr.onreadystatechange = function() {
        if (timeLapseXhr.readyState === XMLHttpRequest.DONE) {
            if (timeLapseXhr.status === 200) {
                checkAnswers()
                window.location.href = "";
                console.log("Time Lapse Added");
            } else {
                console.error("Error updating Guess:", timeLapseXhr.status);
            }
        }
    };
    timeLapseXhr.send(JSON.stringify({ teamId: teamId }));
}

// Function to send image update
function setImageFound(teamId) {
    let updateImageFoundXhr = new XMLHttpRequest();
    updateImageFoundXhr.open('PUT', '/updateImageFound', true);
    updateImageFoundXhr.setRequestHeader('Content-Type', 'application/json');
    updateImageFoundXhr.onreadystatechange = function() {
        if (updateImageFoundXhr.readyState === XMLHttpRequest.DONE) {
            if (updateImageFoundXhr.status === 200) {
                checkAnswers()
                window.location.href = "";
                console.log("correct Quess added");
            } else {
                console.error("Error updating Guess:", updateImageFoundXhr.status);
            }
        }
    };
    updateImageFoundXhr.send(JSON.stringify({  teamId: teamId , time: currentTime}));
}


// Function to send attempt update
function sendAttemptUpdate(teamId) {
    let updateAttemptXhr = new XMLHttpRequest();
    updateAttemptXhr.open('PUT', '/updateAttempt', true);
    updateAttemptXhr.setRequestHeader('Content-Type', 'application/json');
    updateAttemptXhr.onreadystatechange = function() {
        if (updateAttemptXhr.readyState === XMLHttpRequest.DONE) {
            if (updateAttemptXhr.status === 200) {
                checkAnswers()
                console.log("Attempt updated successfully");
            } else {
                console.error("Error updating attempt:", updateAttemptXhr.status);
            }
        }
    };
    updateAttemptXhr.send(JSON.stringify({ teamId: teamId }));
}

// Function to send score update
function sendScoreUpdate(teamId, increment) {
    let updateScoreXhr = new XMLHttpRequest();
    updateScoreXhr.open('PUT', '/updateScore', true);
    updateScoreXhr.setRequestHeader('Content-Type', 'application/json');
    updateScoreXhr.onreadystatechange = function() {
        if (updateScoreXhr.readyState === XMLHttpRequest.DONE) {
            if (updateScoreXhr.status === 200) {
                console.log("Score updated successfully");
                checkAnswers();
            } else {
                console.error("Error updating score:", updateScoreXhr.status);
            }
        }
    };
    updateScoreXhr.send(JSON.stringify({ teamId: teamId, increment: increment }));
}

// Function to get question details
function getQuestionDetails(index) {
    let xhr = new XMLHttpRequest();
    document.querySelector(".load_question").classList.add("active");
    xhr.open('GET', '/question/'+ currentRound +'/' + index, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let response;
                try {
                    response = JSON.parse(xhr.responseText);
                    console.log("Response:", response);
                    document.querySelector(".load_question").classList.remove("active");
                } catch (error) {
                    console.error("Error parsing response:", error);
                    return;
                }
                if (response.success) {
                    currentQuestionResponse = response; // Store the response
                    displayQuestion(response.question);
                } else {
                    console.error("Error:", response.message);
                }
            } else {
                console.error("Error:", xhr.status);
            }
        }
    };
    xhr.send();
}

// Function to display question details
function displayQuestion(question) {
    let language;
    
    questionContainer.innerHTML = `<pre><code class="${language}">${question.Question}</pre><code/>`;
    optionsContainer.innerHTML = (`
     <p style="width:100%">Guess the Output ❓</p>
     <div>
        <textarea type="text" name="guessOutput" id="guessOutput"></textarea>
     </div>
     <p>${question.Answer}</p>
    `);

    submitButton.style.display = "block"
    submitButton.disabled = false;
    hljs.highlightAll();
}

function updateAnsweredQuestions(userId, questionIndex, value) {
    // Convert the boolean value to a string
    const boolValue = value.toString();
    
    fetch(`/updateAnsweredQuestions/${userId}/${questionIndex}/${boolValue}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(updatedUser => {
        // Optionally, handle the response from the backend
        getTeamDetails(updatedUser._id);
    })
    .catch(error => {
        console.error('Error updating answered questions:', error);
    });
}


// Event listener for mask click
document.addEventListener('DOMContentLoaded', function() {
    masks.forEach(function(mask, index) {
        mask.addEventListener('click', function() {
            console.log("Index:", index);
            currentindex = index;
            // localStorage.setItem("currentindex",currentindex);
            getQuestionDetails(index);
        });
    });

    // Handle submission of the answer
    submitButton.onclick = function() {
        if (currentQuestionResponse) {
            let selectedOption = optionsContainer.querySelector('.question_options #guessOutput');
            if (selectedOption) {
                let selectedValue = selectedOption.value.trim();
                if (selectedValue === currentQuestionResponse.question.Answer) {
                    sendScoreUpdate(team_id, 1);
                    displayGuess();
                    updateAnsweredQuestions(team_id, currentindex, true);
                } else {
                    sendAttemptUpdate(team_id);
                    updateAnsweredQuestions(team_id, currentindex, false);
                }
            } else {
                alert("Please select an option.");
            }
        } else {
            console.error("No question response available.");
        }
    };
});


const title  = document.querySelector("title")
console.log(title.innerHTML);

title.addEventListener("blur",()=>{
    alert("opening new tab");
    console.log("tab");
});
