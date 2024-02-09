document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'https://raw.githubusercontent.com/devinull/psycho.site/main/text/';
    let folderUrl = 'onFreedom/freedom.';
    const numText = 92;
    let urlNumber = getRandomNumber(1, numText);
    let isFetching = false; // Flag to track if text is currently being fetched
    let typingTimeout; // Timeout for typing animation

    const metadataElement = document.getElementById('metadata');
    const textElement = document.getElementById('text');
    let animationComplete = false;

    // Audio element for typing sound effect
    const typingSound = new Audio('https://raw.githubusercontent.com/devinull/psycho.site/main/audio/thock.mp3');

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
        metadataElement.textContent = 'thought(' + urlNumber.toString(2) + ') >';

        function typeNextLetter() {
            if (textIndex < text.length) {
                typingSound.play();
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
    function changeTopic(newFolderUrl) {
        if (isFetching) return; // Prevent changing topic while text is being fetched
        folderUrl = newFolderUrl;
        urlNumber = getRandomNumber(1,numText);
        const nextUrl = baseUrl + folderUrl + urlNumber + '.txt';
        fetchTextFromUrl(nextUrl);
    }

    // Attach event listeners to navigation links
    document.getElementById('onSelf').addEventListener('click', function() {
        changeTopic('onSelf/self.');
    });

    document.getElementById('onSpirit').addEventListener('click', function() {
        changeTopic('onSpirit/spirit.');
    });

    document.getElementById('onFreedom').addEventListener('click', function() {
        changeTopic('onFreedom/freedom.');
    });

    // Initial fetch
    fetchTextFromUrl(baseUrl + folderUrl + urlNumber + '.txt');
});
