document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'https://raw.githubusercontent.com/devinull/psycho.site/main/text/';
    let folderUrl = ''; // Initialize folderUrl to be set later
    const numText = 630;
    let urlNumber = getRandomNumber(1, numText);
    let isFetching = false; // Flag to track if text is currently being fetched
    let typingTimeout; // Timeout for typing animation
    let previousScrollHeight = 0; // Variable to store previous scroll height

    const metadataElement = document.getElementById('metadata');
    const textElement = document.getElementById('text');
    let animationComplete = false;

    // Audio context for typing sound effect
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    let typingBuffer; // Buffer for typing sound

    // Fetch typing sound file and decode it
    fetch('https://raw.githubusercontent.com/devinull/psycho.site/main/audio/thock.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedBuffer => {
            typingBuffer = decodedBuffer;
        })
        .catch(error => console.error('Error fetching audio:', error));

    // Event listener for initiating audio playback on user interaction (tap)
    document.body.addEventListener('touchstart', function() {
        playTypingSound();
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
        const folderName = folderUrl.split('/')[0]; // Extract folder name before '/'
        metadataElement.textContent = folderName + ' (' + urlNumber.toString(2) + ') >';

        function typeNextLetter() {
            if (textIndex < text.length) {
                playTypingSound();
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
                        // Choose a new topic and URL number
                        selectRandomTopic();
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

     // Auto-scroll page if content exceeds viewport height
    function autoScrollPage() {
        const contentHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight - window.innerHeight * 0.04; // Subtract 5vh from viewport height
        const scrollPosition = contentHeight - viewportHeight + window.innerHeight * 0.04; // Scroll 5vh below content end

        if (contentHeight > viewportHeight && document.body.scrollHeight !== previousScrollHeight) {
            window.scrollTo(0, scrollPosition);
            previousScrollHeight = document.body.scrollHeight;
        }
    }

    // Event listener for scroll height changes
    window.addEventListener('scroll', autoScrollPage);

    // Select a random topic from the available options
    function selectRandomTopic() {
        const topics = [
            { folderUrl: 'Self/self.', numText: 254 },
            { folderUrl: 'Spirit/spirit.', numText: 154 },
            { folderUrl: 'Freedom/freedom.', numText: 630 },
            { folderUrl: 'Prediction/prediction.', numText: 502 }
        ];

        const randomIndex = Math.floor(Math.random() * topics.length);
        const randomTopic = topics[randomIndex];
        changeTopic(randomTopic.folderUrl, randomTopic.numText);
    }

    // Immediately select a random topic on page load
    selectRandomTopic();

    // Function to play typing sound
    function playTypingSound() {
        if (!typingBuffer) return; // Audio buffer not loaded yet
        const source = audioContext.createBufferSource();
        source.buffer = typingBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');
    const header = document.getElementById('header');

    header.addEventListener('click', function() {
        overlay.style.display = 'flex';
    });

    closeBtn.addEventListener('click', function() {
        overlay.style.display = 'none';
    });

    // Attach event listeners to navigation links
    document.getElementById('onSelf').addEventListener('click', closeOverlay);
    document.getElementById('onSpirit').addEventListener('click', closeOverlay);
    document.getElementById('onFreedom').addEventListener('click', closeOverlay);

    function closeOverlay() {
        overlay.style.display = 'none';
    }
});
