var inputs = document.getElementsByTagName("input");

for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("keydown", function(event) {
        var keyCode = event.which || event.keyCode;

        if (keyCode == 39 || keyCode == 9) {
            // right arrow or tab
            navHorizontal(event.target, true);
        }
        else if (keyCode == 37) {
            // left arrow
            navHorizontal(event.target, false);
        }
        else if (keyCode == 40 || keyCode == 13) {
            // down arrow or enter
            navVertical(event.target, true);
        }
        else if (keyCode == 38) {
            // up arrow
            navVertical(event.target, false);
        }
        else if ((keyCode < 49 || keyCode > 57) && keyCode != 8) {
            // if keycode is not in range 1-9 and is not backspace
            event.preventDefault();
        }
    });
}

// clear button clears all inputs
var clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
});

// solve button solves puzzle using client-side javascript
var solveButton = document.getElementById("solve");
solveButton.addEventListener("click", solvePuzzle);

function navHorizontal(element, toRight) {
    // be sure to prevent default so tab doesn't get counted
    event.preventDefault();

    // go to the next or previous sibling depending on whether
    // direction is to the right or left
    if (toRight)
        var target = element.parentElement.nextElementSibling;
    else
        var target = element.parentElement.previousElementSibling;

    // if the element was already the first element, wrap around to next row
    if (!target) {
        if (toRight)
            target = element.parentElement.parentElement.nextElementSibling.children[0];
        else
            target = element.parentElement.parentElement.previousElementSibling.lastElementChild;
    }

    // focus on input element inside target
    target.children[0].focus();
}

function navVertical(element, down) {
    // be sure to prevent devault so enter doesn't get counted
    event.preventDefault();

    // go to the next or previous row depending on whether
    // direction is down or up
    if (down)
        var targetRow = element.parentElement.parentElement.nextElementSibling;
    else
        var targetRow = element.parentElement.parentElement.previousElementSibling;

    // if the element was already the first/last element and the
    // direction is wrong, just return
    if (!targetRow)
        return;

    // check what column the user is in
    var column = 1;
    var leftSibling = element.parentElement.previousElementSibling;
    while (leftSibling) {
        column++;
        leftSibling = leftSibling.previousElementSibling;
    }

    // focus on input element inside target in correct column
    targetRow.children[column-1].children[0].focus();
}

function solvePuzzle() {
    // solve puzzle here
}
