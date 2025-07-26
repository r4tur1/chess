document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chess-board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset');
    
    let selectedSquare = null;
    let currentPlayer = 'white';
    let gameState = initializeBoard();
    
    // Create the chess board
    function createBoard() {
        board.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = gameState[row][col];
                if (piece) {
                    square.textContent = getPieceSymbol(piece);
                    square.dataset.piece = piece.type;
                    square.dataset.color = piece.color;
                }
                
                square.addEventListener('click', () => handleSquareClick(row, col));
                board.appendChild(square);
            }
        }
    }
    
    // Initialize the starting board
    function initializeBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Set up pawns
        for (let col = 0; col < 8; col++) {
            board[1][col] = { type: 'pawn', color: 'black' };
            board[6][col] = { type: 'pawn', color: 'white' };
        }
        
        // Set up rooks
        board[0][0] = board[0][7] = { type: 'rook', color: 'black' };
        board[7][0] = board[7][7] = { type: 'rook', color: 'white' };
        
        // Set up knights
        board[0][1] = board[0][6] = { type: 'knight', color: 'black' };
        board[7][1] = board[7][6] = { type: 'knight', color: 'white' };
        
        // Set up bishops
        board[0][2] = board[0][5] = { type: 'bishop', color: 'black' };
        board[7][2] = board[7][5] = { type: 'bishop', color: 'white' };
        
        // Set up queens
        board[0][3] = { type: 'queen', color: 'black' };
        board[7][3] = { type: 'queen', color: 'white' };
        
        // Set up kings
        board[0][4] = { type: 'king', color: 'black' };
        board[7][4] = { type: 'king', color: 'white' };
        
        return board;
    }
    
    // Get Unicode symbol for piece
    function getPieceSymbol(piece) {
        const symbols = {
            king: { white: '♔', black: '♚' },
            queen: { white: '♕', black: '♛' },
            rook: { white: '♖', black: '♜' },
            bishop: { white: '♗', black: '♝' },
            knight: { white: '♘', black: '♞' },
            pawn: { white: '♙', black: '♟' }
        };
        return symbols[piece.type][piece.color];
    }
    
    // Handle square clicks
    function handleSquareClick(row, col) {
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const piece = gameState[row][col];
        
        // If no square is selected yet
        if (selectedSquare === null) {
            // Can only select your own pieces
            if (piece && piece.color === currentPlayer) {
                selectedSquare = { row, col };
                square.classList.add('selected');
                highlightMoves(row, col);
            }
        } 
        // If a square is already selected
        else {
            // If clicking on the same square, deselect it
            if (selectedSquare.row === row && selectedSquare.col === col) {
                clearSelection();
                return;
            }
            
            // If clicking on another of your pieces, select that one instead
            if (piece && piece.color === currentPlayer) {
                clearSelection();
                selectedSquare = { row, col };
                square.classList.add('selected');
                highlightMoves(row, col);
                return;
            }
            
            // Try to move the selected piece
            const fromRow = selectedSquare.row;
            const fromCol = selectedSquare.col;
            
            // Very basic move validation (for demonstration)
            if (isValidMove(fromRow, fromCol, row, col)) {
                // Move the piece
                gameState[row][col] = gameState[fromRow][fromCol];
                gameState[fromRow][fromCol] = null;
                
                // Switch players
                currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                status.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
                
                // Redraw the board
                createBoard();
            }
            
            clearSelection();
        }
    }
    
    // Very simple move validation (just for demonstration)
    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = gameState[fromRow][fromCol];
        if (!piece) return false;
        
        // Basic pawn movement (no captures, en passant, or promotion)
        if (piece.type === 'pawn') {
            if (piece.color === 'white') {
                return fromCol === toCol && (fromRow - toRow === 1 || (fromRow === 6 && toRow === 4));
            } else {
                return fromCol === toCol && (toRow - fromRow === 1 || (fromRow === 1 && toRow === 3));
            }
        }
        
        // Other pieces can move anywhere (for this simple demo)
        return true;
    }
    
    // Highlight possible moves (simplified)
    function highlightMoves(row, col) {
        const piece = gameState[row][col];
        if (!piece) return;
        
        // Very simple highlighting for demonstration
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (isValidMove(row, col, r, c)) {
                    const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    square.classList.add('highlight');
                }
            }
        }
    }
    
    // Clear selection and highlights
    function clearSelection() {
        document.querySelectorAll('.selected, .highlight').forEach(el => {
            el.classList.remove('selected', 'highlight');
        });
        selectedSquare = null;
    }
    
    // Reset the game
    resetBtn.addEventListener('click', () => {
        gameState = initializeBoard();
        currentPlayer = 'white';
        status.textContent = "White's turn";
        createBoard();
        clearSelection();
    });
    
    // Initialize the game
    createBoard();
});