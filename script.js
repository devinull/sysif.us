function reloadPage() {
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'https://raw.githubusercontent.com/devinull/psycho.site/main/text/prophet/religion.';
    const metadataElement = document.getElementById('metadata');
    const textElement = document.getElementById('text');
    const numText = 150;
    let animationComplete = false;
    let urlNumber = getRandomNumber(1, numText); // Get a random number between 1 and 255
    let audioLoaded = false; // Flag to track audio loading state

    // Audio element for typing sound effect
    const typingSound = new Audio('https://raw.githubusercontent.com/devinull/psycho.site/main/audio/thock.mp3'); // Adjust the file name and path or url as needed

    // Function to fetch text from the URL
    function fetchTextFromUrl(url) {
        fetch(url)
        .then(response => response.text())
        .then(text => {
            typeText(text);
        })
        .catch(error => console.error('Error fetching text:', error));
    }

    // Function to generate a random number between min and max (inclusive)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate a random typing speed between min and max (inclusive)
    function getRandomTypingSpeed(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to type the text
    function typeText(text) {
        let textIndex = 0;
        textElement.textContent = ''; // Clear previous text
        typeNextLetter();

        // Set the metadata text
        metadataElement.textContent = 'Thought ' + urlNumber.toString(2) + ':';
        
        function typeNextLetter() {
            if (textIndex < text.length) {
                // Check if the audio is playing
                if (!typingSound.paused) {
                    // If the audio is playing, rewind it to the beginning
                    typingSound.currentTime = 0;
                } else {
                    // If the audio is not playing, start playing it
                    typingSound.play();
                }

                // Remove the previous cursor
                const previousCursor = textElement.querySelector('.cursor');
                if (previousCursor) {
                    textElement.removeChild(previousCursor);
                }

                textElement.textContent += text[textIndex];

                // Add the new cursor
                const cursorSpan = document.createElement('span');
                cursorSpan.textContent = '_';
                cursorSpan.classList.add('cursor');
                textElement.appendChild(cursorSpan);

                // Get a random typing speed for the next letter
                const typingSpeed = getRandomTypingSpeed(35, 150);

                // Wait for the next letter with the calculated typing speed
                setTimeout(() => {
                    textIndex++;
                    typeNextLetter();
                }, typingSpeed);
            } else {
                animationComplete = true;
                // Wait for 5 seconds before fetching next text
                setTimeout(function() {
                    if (animationComplete) {
                        // Increment URL number and fetch next text
                        urlNumber++;
                        if (urlNumber > numText) {
                            urlNumber = getRandomNumber(0, numText); // Set to a random value between 0 and 255
                        }
                        const nextUrl = baseUrl + urlNumber + '.txt';
                        fetchTextFromUrl(nextUrl);
                    }
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        }
    }

    // Fetch text from the initial URL
    fetchTextFromUrl(baseUrl + urlNumber + '.txt');
});
