module.exports = function(board) {
    // continuously alternate between checking spaces, rows, and columns
    // for unambiguous solutions while changes are being made
    var changed = true;
    var solved = false;
    while (changed && !solved) {
        changed = false;

        if (checkSpaces(board))
            changed = true;

        // check rows
        if (checkLinearSequences(board, true))
            changed = true;


        // check cols
        if (checkLinearSequences(board, false))
            changed = true;

        // check if the puzzle has been solved
        solved = true;
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (board[row][col] === 0)
                    solved = false;
            }
        }
    }

    if (solved)
        return true;

    // do not try to brute-force solution because it can take a long time
    // and most puzzles that can be found don't require it
    return false;
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

        if (lastChanged[0] === -1 && lastChanged[1] === -1) {
            return false;
        }
    }
}

// check space to see if a single number fits in it; fill in if so
// return true if yes and false otherwise
function checkSpace(board, position) {
    // do not change number if there is already one here
    if (board[position[0]][position[1]] !== 0)
        return false;

    // get the possible numbers that can be used to fill this space
    var candidates = getCandidates(board, position);

    // if there is a single candidate, fill in board
    if (candidates.length === 1) {
        board[position[0]][position[1]] = candidates[0];

        return true;
    }

    return false;
}

// return possible numbers that can be used to fill given space
function getCandidates(board, position) {
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
    var rowStart = Math.floor(position[0] / 3) * 3;
    var colStart = Math.floor(position[1] / 3) * 3;

    for (var row = rowStart; row < rowStart+3; row++) {
        for (var col = colStart; col < colStart+3; col++) {
            var index = candidates.indexOf(board[row][col]);
            if (index !== -1)
                candidates.splice(index,1);
        }
    }

    return candidates;
}

// check rows or cols to see if there is a place where a number must go
// this happens if a number is unable to be placed anywhere else
// in the col because of existing restraints on those spaces
function checkLinearSequences(board, rows) {
    // iterate through rows/cols until the script has gone a full cycle without
    // making any additional changes
    var lastChanged = -1;
    for (;;) {
        for (var i = 0; i < 9; i++) {
            // collect array of all numbers that have not been used in row/col
            var unusedNumbers = [1,2,3,4,5,6,7,8,9];
            var unusedSpaces = [];
            for (var j = 0; j < 9; j++) {
                var index = unusedNumbers.indexOf(board[rows ? i : j][rows ? j : i]);
                if (index !== -1)
                    unusedNumbers.splice(index,1);
                else
                    unusedSpaces.push(rows ? j : i);
            }

            // iterate through each unusedNumber to try to find a spot for it
            for (var p = 0; p < unusedNumbers.length; p++) {
                // create new copy of unusedSpaces array for in-loop editing
                var possibleSpots = unusedSpaces.slice();

                // remove from possible spots all spaces which do not have the number as a candidate
                for (var q = 0; q < unusedSpaces.length; q++) {
                    if (getCandidates(board, [rows ? i : unusedSpaces[q], rows ? unusedSpaces[q] : i]).indexOf(unusedNumbers[i]) === -1) {
                        possibleSpots.splice(q, 1);
                    }
                }

                // if there is only one remaining possible spot, update board
                if (possibleSpots.length === 1) {
                    board[rows ? i : possibleSpots[0]][rows ? possibleSpots[0] : i] = unusedNumbers[p];
                    lastChanged = i;
                }
                else if (i === lastChanged) {
                    return true;
                }
            }
        }

        if (lastChanged === -1)
            return false;
    }
}
