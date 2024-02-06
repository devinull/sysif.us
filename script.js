document.addEventListener("DOMContentLoaded", function() {
    // Fetch the text file
    fetch('https://raw.githubusercontent.com/devinull/psycho.site/main/text/self/thought.100.txt')
    .then(response => response.text())
    .then(text => {
        typeText(text);
    })
    .catch(error => console.error('Error fetching text:', error));

    const textElement = document.getElementById('text');
    let textIndex = 0;
    const typingSpeed = 50; // in milliseconds

    function typeText(text) {
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
            }
        }, typingSpeed);
    }
});
