// Initialize Chess.js (game logic) and Chessboard.js (UI)
const game = new Chess();
const board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: handleMove,
});

// Handle player moves
function handleMove(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q', // Always promote to queen for simplicity
  });

  if (move === null) return 'snapback'; // Illegal move

  updateStatus();
}

// Update game status (checkmate, turn, etc.)
function updateStatus() {
  let status = '';

  if (game.isCheckmate()) {
    status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
  } else if (game.isDraw()) {
    status = 'Game ended in a draw';
  } else {
    status = `${game.turn() === 'w' ? 'White' : 'Black'}'s turn`;
    if (game.isCheck()) status += ' (Check!)';
  }

  document.getElementById('status').textContent = status;
}

// Reset game
document.getElementById('resetBtn').addEventListener('click', () => {
  game.reset();
  board.position(game.fen());
  updateStatus();
});

// Initial status
updateStatus();