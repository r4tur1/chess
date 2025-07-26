$(document).ready(function() {
  const game = new Chess();
  const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/img/chesspieces/wikipedia/{piece}.png'
  });

  // Highlight legal moves
  function onDragStart(source, piece) {
    if (game.turn() !== piece[0] || game.isGameOver()) return false;
    
    const moves = game.moves({
      square: source,
      verbose: true
    });
    
    // Highlight squares
    $('#board .square-55d63').removeClass('highlight');
    moves.forEach(move => {
      $(`#board .square-${move.to}`).addClass('highlight');
    });
  }

  // Handle move
  function onDrop(source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q' // Always promote to queen for simplicity
    });

    if (move === null) return 'snapback'; // Illegal move
    updateStatus();
  }

  // Update board after move
  function onSnapEnd() {
    board.position(game.fen());
    $('#board .square-55d63').removeClass('highlight');
  }

  // Update game status
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
    $('#status').text(status);
  }

  // Reset game
  $('#resetBtn').click(function() {
    game.reset();
    board.position(game.fen());
    $('#board .square-55d63').removeClass('highlight');
    updateStatus();
  });

  updateStatus();
});