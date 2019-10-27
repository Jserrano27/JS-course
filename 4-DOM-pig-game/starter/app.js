/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gameON, scoreToWin;

init();

document.querySelector('.btn-roll').addEventListener('click', function () {
    // If game is on
    if (gameON) {
        // 1. Random number
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        // 2. Display the result
        var dice1DOM = document.querySelector('.dice1');
        dice1DOM.src = 'dice-' + dice1 + '.png';
        dice1DOM.style.display = 'block';

        var dice2DOM = document.querySelector('.dice2');
        dice2DOM.src = 'dice-' + dice2 + '.png';
        dice2DOM.style.display = 'block';

        // Update round score IF dice is not 1
        if (dice1 !== 1 && dice2 !== 1) {
            roundScore += dice1 + dice2;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        } else {
            nextPlayer();
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    // If game is on
    if (gameON) {
        // Add current score to global score
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        lastDice = 0;

        // Check if player won the game
        if (scores[activePlayer] >= scoreToWin) {
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.getElementById('name-' + activePlayer).textContent = 'WINNER!';
            document.getElementById('current-' + activePlayer).textContent = 0;
            document.querySelector('.dice1').style.display = 'none';
            document.querySelector('.dice2').style.display = 'none';

            // End game
            gameON = false;
        } else {
            nextPlayer();
        }
    }
});

// Restart game
document.querySelector('.btn-new').addEventListener('click', init);

// Change score to win when modified
document.getElementById('win-score').addEventListener('input', function () {
    scoreToWin = document.getElementById('win-score').value;
});


function nextPlayer() {
    roundScore = 0;
    document.getElementById('current-' + activePlayer).textContent = 0;
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    lastDice = 0;
}

function init() {
    gameON = true;

    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    scoreToWin = document.getElementById('win-score').value;

    document.querySelector('.dice1').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');
}

/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/