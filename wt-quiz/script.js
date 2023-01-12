var correctCards = 0;

fetch('./levels.json')
    .then(response => response.json())
    .then(data => myFunction(data));

var levels;

function myFunction(data) {
    levels = data;
    init();
}

function init() {
    var seed;
    var levelNumber = JSON.parse(localStorage.getItem('current_level'));

    if ((JSON.parse(localStorage.getItem('current_level')) == null) || (JSON.parse(localStorage.getItem('level_order')) == null || levelNumber == 10)) {

        // Generate random level orders (5 easy + 5 hard)
        var seedEasy = [0, 1, 2, 3, 4];
        var seedHard = [5, 6, 7, 8, 9];
        shuffleArray(seedEasy);
        shuffleArray(seedHard);
        seed = seedEasy.concat(seedHard);
        levelNumber = 0;

        // Initial local storage set
        localStorage.setItem('current_level', JSON.stringify(levelNumber));
        localStorage.setItem('level_order', JSON.stringify(seed));
    }
    else {
        levelNumber = JSON.parse(localStorage.getItem('current_level'));
        seed = JSON.parse(localStorage.getItem('level_order'));
    }

    if (levelNumber == 10) {
        console.log("koniec")
    }

    game(levels, seed[levelNumber]);

}

function game(levels, levelNumber) {

    // Hide the success message
    $('#successMessage').hide();
    $('#successMessage').css({
        left: '580px',
        top: '250px',
        width: 0,
        height: 0
    });

    // Reset the game
    correctCards = 0;
    $('#cardPile').html('');
    $('#cardSlots').html('');

    // Create the pile of shuffled cards
    var numbers = [1, 2, 3, 4, 5];
    var cards = [levels.level1[0 + levelNumber * 5].solution, levels.level1[1 + levelNumber * 5].solution, levels.level1[2 + levelNumber * 5].solution, levels.level1[3 + levelNumber * 5].solution, levels.level1[4 + levelNumber * 5].solution];
    shuffleArray(cards);

    // Show actual level difficulty
    $("#actualLevel").html(levels.level1[0 + levelNumber * 5].difficulty);

    // Get 5 cards from stack
    for (var i = 0; i < 5; i++) {
        $('<div>' + cards[i] + '</div>').data('number', levels.level1.findIndex(obj => obj.solution == cards[i])).attr('id', 'card' + numbers[i]).appendTo('#cardPile').draggable({
            stack: '#cardPile div',
            cursor: 'grabbing',
            revert: true
        });
    }

    // Create the card slots
    var slots = [levels.level1[0 + levelNumber * 5].problem, levels.level1[1 + levelNumber * 5].problem, levels.level1[2 + levelNumber * 5].problem, levels.level1[3 + levelNumber * 5].problem, levels.level1[4 + levelNumber * 5].problem];
    shuffleArray(slots);

    // 5 answer bubbles
    for (var i = 1; i <= 5; i++) {
        $('<div>' + slots[i - 1] + '</div>').data('number', levels.level1.findIndex(obj => obj.problem == slots[i - 1])).appendTo('#cardSlots').droppable({
            accept: '#cardPile div',
            hoverClass: 'hovered',
            drop: handleCardDrop
        });
    }
}

function handleCardDrop(event, ui) {
    var slotNumber = $(this).data('number');
    var cardNumber = ui.draggable.data('number');
    var levelNumber = JSON.parse(localStorage.getItem('current_level'));

    // If the card was dropped to the correct slot,
    // change the card colour, position it directly
    // on top of the slot, and prevent it being dragged
    // again and vibrate device if possible

    if (slotNumber == cardNumber) {
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        $(this).droppable('disable');
        ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
        ui.draggable.draggable('option', 'revert', false);
        correctCards++;
        var vibrateSuccess = window.navigator.vibrate([500]);
        console.log(vibrateSuccess);
    }

    // If all the cards have been placed correctly then display a message
    // and reset the cards for another go

    if (correctCards == 5) {
        var levelNumber = JSON.parse(localStorage.getItem('current_level'));
        levelNumber++;

        $('#successMessage').show();
        $('#successMessage').animate({
            left: '35%',
            top: '40%',
            width: '15%',
            height: '10%',
            opacity: 1
        });
        $('#successMessageInner').html("Gratulujeme!");
        $('#successMessageBtn').html("Ďalší level");
        localStorage.setItem('current_level', JSON.stringify(levelNumber));
        
        if (levelNumber == 10) {
            $('#successMessage').show();
            $('#successMessage').animate({
                left: '35%',
                top: '40%',
                width: '15%',
                height: '10%',
                opacity: 1
            });
            $('#successMessageInner').html("KONIEC HRY");
            $('#successMessageBtn').html("HRAT ZNOVU");
        }
    }
    
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const targetDiv = document.getElementById("third");
const btn = document.getElementById("toggle");
btn.onclick = function () {
    if (targetDiv.style.display == "none") {
        targetDiv.style.display = "flex";
    } else {
        targetDiv.style.display = "none";
    }
};

navigator.serviceWorker.register("./service-worker.js")
    .then((reg) => {
        console.log("service worker registered")
    })