function copyTextToClipboard() {
    const div_gpt = document.getElementsByClassName('gpt-template');

// Sprawdź, czy istnieje przynajmniej jeden taki element
    if (div_gpt.length > 0) {
        const content = div_gpt[0].innerText;

        navigator.clipboard.writeText(content)
            .then(() => {
                console.log('Zawartość skopiowana do schowka.');
            })
            .catch((error) => {
                console.error('Błąd podczas kopiowania do schowka:', error);
            });
    } else {
        console.log('Nie znaleziono elementu <div> o klasie "gpt-template".');
    }
}

