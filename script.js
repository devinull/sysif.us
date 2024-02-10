document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'https://raw.githubusercontent.com/devinull/psycho.site/main/text/';
    let folderUrl = 'onFreedom/freedom.';
    const numText = 92;
    let urlNumber = getRandomNumber(1, numText);
    let isFetching = false; // Flag to track if text is currently being fetched
    let typingTimeout; // Timeout for typing animation
    let previousScrollHeight = 0; // Variable to store previous scroll height

    const metadataElement = document.getElementById('metadata');
    const textElement = document.getElementById('text');
    let animationComplete = false;

    // Audio element for typing sound effect
    const typingSound = new Audio('https://raw.githubusercontent.com/devinull/psycho.site/main/audio/thock.mp3');

    // Event listener for initiating audio playback on user interaction
    document.body.addEventListener('click', function() {
        typingSound.volume = 0; // Set volume to 0 to enable playback
        typingSound.play();
        typingSound.volume = 1; // Set volume to 1 to enable playback
    });

    // Fetch text from the URL
    function fetchTextFromUrl(url) {
        // Clear the text content before fetching new text
        textElement.textContent = '';
        // Clear typing timeout if it exists
        clearTimeout(typingTimeout);
        // If text is already being fetched, return
        if (isFetching) return;
        isFetching = true;

        fetch(url)
        .then(response => response.text())
        .then(text => {
            typeText(text);
        })
        .catch(error => console.error('Error fetching text:', error))
        .finally(() => {
            isFetching = false; // Reset the flag after fetching is complete
        });
    }

    // Generate a random number between min and max (inclusive)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate a random typing speed between min and max (inclusive)
    function getRandomTypingSpeed(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Type the text
    function typeText(text) {
        let textIndex = 0;
        textElement.textContent = ''; // Clear previous text

        // Set the metadata text
        metadataElement.textContent = '(' + urlNumber.toString(2) + ') >';

        function typeNextLetter() {
            if (textIndex < text.length) {
                // Check if the typing sound is currently playing
                if (!typingSound.paused) {
                    // If it's playing, reset it to the beginning
                    typingSound.currentTime = 0;
                } else {
                    // If it's not playing, start playing it
                    typingSound.play();
                }

                autoScrollPage(); // check if page needs to be scrolled
                // Check for line breaks and new lines
                if (text[textIndex] === '\n') {
                    textElement.innerHTML += '<br>';
                } else if (text[textIndex] !== '\r') {
                    textElement.innerHTML += text[textIndex];
                }

                // Remove the previous cursor
                const previousCursor = textElement.querySelector('.cursor');
                if (previousCursor) {
                    textElement.removeChild(previousCursor);
                }

                // Add the new cursor
                const cursorSpan = document.createElement('span');
                cursorSpan.textContent = '_';
                cursorSpan.classList.add('cursor');
                textElement.appendChild(cursorSpan);

                // Get a random typing speed for the next letter
                const typingSpeed = getRandomTypingSpeed(35, 100);

                // Wait for the next letter with the calculated typing speed
                typingTimeout = setTimeout(() => {
                    textIndex++;
                    typeNextLetter();
                }, typingSpeed);
            } else {
                animationComplete = true;
                // Wait for 5 seconds before fetching next text
                setTimeout(function() {
                    if (animationComplete) {
                        // Increment URL number and fetch next text
                        urlNumber = (urlNumber % numText) + 1; // Ensure it cycles through numText
                        const nextUrl = baseUrl + folderUrl + urlNumber + '.txt';
                        fetchTextFromUrl(nextUrl);
                    }
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        }

        typeNextLetter(); // Start typing
    }

    // Navigation functions
    function changeTopic(newFolderUrl, numText) {
        if (isFetching) return; // Prevent changing topic while text is being fetched
        folderUrl = newFolderUrl;
        urlNumber = getRandomNumber(1, numText);
        const nextUrl = baseUrl + folderUrl + urlNumber + '.txt';
        fetchTextFromUrl(nextUrl);
    }

    // Attach event listeners to navigation links
    document.getElementById('onSelf').addEventListener('click', function() {
        changeTopic('onSelf/self.', 255);
    });

    document.getElementById('onSpirit').addEventListener('click', function() {
        changeTopic('onSpirit/spirit.', 154);
    });

    document.getElementById('onFreedom').addEventListener('click', function() {
        changeTopic('onFreedom/freedom.', 92);
    });

    // Initial fetch when the page loads
    fetchTextFromUrl(baseUrl + folderUrl + urlNumber + '.txt');

    // Auto-scroll page if content exceeds viewport height
    function autoScrollPage() {
        const contentHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;

        if (contentHeight > viewportHeight && document.body.scrollHeight !== previousScrollHeight) {
            window.scrollTo(0, contentHeight);
            previousScrollHeight = contentHeight;
        }
    }

    // Event listener for scroll height changes
    window.addEventListener('scroll', autoScrollPage);
});
