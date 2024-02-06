document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'https://raw.githubusercontent.com/devinull/psycho.site/main/text/self/thought.';
    const textElement = document.getElementById('text');
    const typingSpeed = 50; // in milliseconds
    let animationComplete = false;
    let urlNumber = 100; // Starting number in the URL

    // Function to fetch text from the URL
    function fetchTextFromUrl(url) {
        fetch(url)
        .then(response => response.text())
        .then(text => {
            typeText(text);
        })
        .catch(error => console.error('Error fetching text:', error));
    }

    // Function to type the text
    function typeText(text) {
        let textIndex = 0;
        textElement.textContent = ''; // Clear previous text
        const typingInterval = setInterval(function() {
            if (textIndex < text.length) {
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

                textIndex++;
            } else {
                clearInterval(typingInterval);
                animationComplete = true;
                // Wait for 5 seconds before fetching next text
                setTimeout(function() {
                    if (animationComplete) {
                        // Increment URL number and fetch next text
                        urlNumber++;
                        const nextUrl = baseUrl + urlNumber + '.txt';
                        fetchTextFromUrl(nextUrl);
                    }
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        }, typingSpeed);
    }

    // Fetch text from the initial URL
    fetchTextFromUrl(baseUrl + urlNumber + '.txt');
});
