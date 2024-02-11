document.addEventListener("DOMContentLoaded", function () {
    fetch('https://source.unsplash.com/random/1920x1080/?skyline')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.url;
      })
      .then(imageUrl => {
        document.body.style.backgroundImage = `url(${imageUrl})`;
      })
      
      .catch(error => {
        console.error('There was a problem fetching the image:', error);
      });

      fetch("https://api.quotable.io/random")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch quote");
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById("quote").textContent = data.content;
        })
        .catch((error) => {
            console.error("Error fetching random quote:", error);
            //If fetch fails, displays a placeholder message
            document.getElementById("quote").textContent = "Quote fetch failed. But remember, it is your reaction to adversity, not the adversity itself, that shapes your life's narrative.";
        });

        const timerDisplay = document.getElementById("timer");
        const startButton = document.getElementById("start");
        const pauseButton = document.getElementById("pause");
        const resetButton = document.getElementById("reset");

        let timer;
        let timeLeft;
        let isPaused = false;
        let pauseTimeRemaining;

        function startTimer(durationInSeconds) {
            let endTime = Date.now() + durationInSeconds * 1000;

            timer = setInterval(updateTimer, 1000);

            function updateTimer() {
            if (!isPaused) {
                timeLeft = Math.round((endTime - Date.now()) / 1000);

                if(timeLeft == 0){
                    playChimeSound();
                }
                if (timeLeft < 0) {
                    clearInterval(timer);
                    timerDisplay.textContent = "00:00";
                    alert("Well done! Take a 5-minute break, and come back when you are ready to start the next cycle.");
                } else {
                    let minutes = Math.floor(timeLeft / 60);
                    let seconds = timeLeft % 60;
                    timerDisplay.textContent = `${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                    }
                }
            }
        }

        function playChimeSound() {
            const chimeSound = new Audio("assets/pomodoro-sfx.mp3");
            chimeSound.play();
        }

        function pauseTimer() {
            if(isPaused){
                resumeTimer();
            }
            else{
                isPaused = true;
                clearInterval(timer); // prevents countdown from continuing in the background when paused 
                remainingTime = timeLeft;
            }
        }

        function resumeTimer() {
            isPaused = false;
            if (remainingTime > 0) {
                startTimer(remainingTime); 
            }
        }

        function resetTimer() {
            clearInterval(timer);
            timerDisplay.textContent = "25:00";
            isPaused = false;
        }

        startButton.addEventListener("click", () => {
            startTimer(25 * 60);
        });

        pauseButton.addEventListener("click", pauseTimer);

        resetButton.addEventListener("click", resetTimer);

  
  });


  function updateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var amOrPm = hours < 12 ? "AM" : "PM";
  
    // Convert hours to 12-hour format
    hours = hours % 12 || 12; 
    hours = hours.toString();
    minutes = minutes.toString();
  
    // Formatting leading zero
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }
  
    var timeString = hours + ":" + minutes + " " + amOrPm;
    document.getElementById("current-time").textContent = timeString;
  }
  
  function updateTimeWithSeconds() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var amOrPm = hours < 12 ? "AM" : "PM";
    hours = hours % 12 || 12; 
  
    hours = hours.toString();
    minutes = minutes.toString();
    seconds = seconds.toString();
    
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }
    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }
  
    var timeString = hours + ":" + minutes + ":" + seconds + " " + amOrPm;
  
    document.getElementById("current-time").textContent = timeString;
  }
  
  function timeHoveredOver() {
    var timeElement = document.getElementById("current-time");
    var intervalId; // Variable to store the interval ID
  
    timeElement.addEventListener("mouseenter", function () {
      updateTimeWithSeconds();
      intervalId = setInterval(updateTimeWithSeconds, 1000); 
    });
  
    timeElement.addEventListener("mouseleave", function () {
      updateTime();
      clearInterval(intervalId); 
    });
  }

  function displayGreeting() {
    chrome.storage.sync.get(['name'], function(result) {
      var name = result.name || 'User';
      var greetingElement = document.getElementById('greeting');
      greetingElement.textContent = 'Hello, ' + name;
    });
  }
  
  function makeGreetingEditable() {
    var greetingElement = document.getElementById('greeting');
  
    greetingElement.addEventListener('dblclick', function() {
      var name = greetingElement.textContent.replace('Hello, ', '');
      var newName = prompt('Enter your name:', name);
      if (newName !== null) {
        greetingElement.textContent = 'Hello, ' + newName;
        chrome.storage.sync.set({ 'name': newName });
      }
    });
  }
  // Call updateTime() initially to display the time immediately
  updateTime();
  timeHoveredOver();
  displayGreeting();
  makeGreetingEditable();
  


  // Call updateTime() every 5 seconds to update the displayed time
  setInterval(updateTime, 5000);
  


  