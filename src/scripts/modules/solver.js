module.exports = function(board) {
    checkSpaces(board);
}

// loop through board until there has been a full cycle with no changes
// return true if changes have been made and false otherwise
function checkSpaces(board) {
    var lastChanged = [-1, -1];

    // row and col are 0-based
    for (;;) {
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (row === lastChanged[0] && col === lastChanged[1])
                    return true;

                if (checkSpace(board, [row, col]))
                    lastChanged = [row, col];
            }
        }

        if (lastChanged === [-1, -1]) {
            return false;
        }
    }
}

// check space to see if a single number fits in it; fill in if so
// return true if yes and false otherwise
function checkSpace(board, position) {
    var candidates = [1,2,3,4,5,6,7,8,9];

    // eliminate from candidates using items in row:
    for (var col = 0; col < 9; col++) {
        var index = candidates.indexOf(board[position[0]][col]);
        if (index !== -1)
            candidates.splice(index,1);
    }

    // eliminate from candidates using items in col:
    for (var row = 0; row < 9; row++) {
        var index = candidates.indexOf(board[row][position[1]]);
        if (index !== -1)
            candidates.splice(index,1);
    }

    // eliminate from candidates using square:
    var rowStart = (position[0] % 3) * 3;
    var colStart = (position[1] % 3) * 3;

    for (var row = rowStart; row < rowStart+3; row++) {
        for (var col = colStart; col < colStart+3; col++) {
            var index = candidates.indexOf(board[row][col]);
            if (index !== -1)
                candidates.splice(index,1);
        }
    }

    // if there is a single candidate, fill in board
    if (candidates.length === 1) {
        board[position[0]][position[1]] = candidates[0];

        return true;
    }

    return false;
}
