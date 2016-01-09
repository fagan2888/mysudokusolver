var partialBoard =
    [[5,3,0,0,7,0,0,0,0],
     [6,0,0,1,9,5,0,0,0],
     [0,9,8,0,0,0,0,6,0],
     [8,0,0,0,6,0,0,0,3],
     [4,0,0,8,0,3,0,0,1],
     [7,0,0,0,2,0,0,0,6],
     [0,6,0,0,0,0,2,8,0],
     [0,0,0,4,1,9,0,0,5],
     [0,0,0,0,8,0,0,7,9]];

 var solvedBoard =
     [[5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]];

 var emptyBoard =
     [[0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]];

function partiallyFillBoard(partialBoard, inputs) {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            var candidate = partialBoard[row][col];
            var fillValue = candidate === 0 ? '' : candidate.toString();
            inputs[row * 9 + col].value = fillValue;
        }
    }
}

function readBoard(inputs) {
    var board = [[], [], [], [], [], [], [], [], []];

    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            var inputValue = inputs[row * 9 + col].value;

            if (inputValue === '')
                board[row][col] = 0;
            else
                board[row][col] = parseInt(inputs[row * 9 + col].value);
        }
    }
    return board;
}

function clickSolve() {
    var solveButton = document.getElementById('solve');
    solveButton.click();
}

casper.test.begin('Website works correctly in browser', function(test) {
    casper.on('remote.message', function(msg) {
        this.echo('remote message caught: ' + msg);
    });

    casper.start('http://localhost:3000', function() {
        // partially fill board and make sure it was filled correctly
        test.assertEvalEquals(function(partialBoard, partiallyFillBoard, readBoard) {
            var inputs = document.getElementsByTagName('input');
            partiallyFillBoard(partialBoard, inputs);

            return readBoard(inputs);
        }, partialBoard, 'Board is partially filled correctly', [partialBoard, partiallyFillBoard, readBoard]);

        // ensure board is solved correctly when solve button is triggered
        test.assertEvalEquals(function (clickSolve, readBoard) {
            clickSolve();

            var inputs = document.getElementsByTagName('input');
            return readBoard(inputs);
        }, solvedBoard, 'Puzzle is solved correctly', [clickSolve, readBoard]);

        // trigger clear button and make sure it works properly
        test.assertEvalEquals(function(readBoard) {
            var clearButton = document.getElementById('clear');
            clearButton.click();

            var inputs = document.getElementsByTagName('input');
            return readBoard(inputs);
        }, emptyBoard, 'The clear button works correctly', [readBoard]);

        // trigger solve button and make sure it shows error box when it cannot solve
        test.assertEval(function(clickSolve) {
            clickSolve();

            var errorBox = document.getElementById('error-box');
            return errorBox.innerHTML !== '';
        }, 'Displays error box when necessary', [clickSolve]);
    });

    casper.run();
});
