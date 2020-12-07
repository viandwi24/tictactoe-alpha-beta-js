class TicTacToeAI {
  board = null;
  player = null;
  enemy = null;
  maxDepth = 10;
  scores = { win: 1, lose: -1, tie: 0 };

  constructor(player, board) {
    this.player = player;
    this.enemy = (this.player == 'x') ? 'o' : 'x';
    this.board = board;
  }

  makeSignature (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getBestMove () {
    var alphaBeta = this.alphaBeta(this.board, 0, true, -Infinity, Infinity);
    return alphaBeta;
  }

  alphaBeta (board, depth, isMaximizing, alpha, beta, signature) {
    // terminal - get winner
    var win = board.getWinner()
    if (win != null) {
      if (win == 'tie') return { depth, score: this.scores.tie }
      return (this.player == win) ? { depth, score: this.scores.win } : { depth, score: this.scores.lose }
    }

    // terminal - max depth
    if (depth > this.maxDepth) return this.scores.tie;

    // terminal - get best move
    if (depth == 0) {
      var bestMove = { score: -Infinity, move: 0, tree: [], treeCount: 0 };

      // 
      for (let i = 0; i < board.state.length; i++) {
        const e = board.state[i];
        const newSignature = this.makeSignature(5);
        if (e == '') {
          var newBoard = new TicTacToeBoard([...board.state]);
          newBoard.move(this.player, i);
          var newNode = this.alphaBeta(newBoard, depth+1, false, alpha, beta, newSignature);
          if (bestMove.score < newNode.score) {
            bestMove.score = newNode.score;
            bestMove.move = i;
          }
          var node = { newSignature, depth, isMaximizing, alpha, beta, score: newNode.score, node: newNode };
          bestMove.tree.push(node);
        }
      }

      // 
      bestMove.treeCount = bestMove.tree.length;
      return bestMove;
    }

    // ai simulate
    var bestScore, bestMove, newNode;
    if (isMaximizing) {
      bestScore = -Infinity;
      for (let i = 0; i < board.state.length; i++) {
        const e = board.state[i];
        if (e == '') {
          var newBoard = new TicTacToeBoard([...board.state]);
          newBoard.move(this.player, i);
          newNode = this.alphaBeta(newBoard, depth+1, false, alpha, beta, signature);
          bestScore = Math.max(newNode.score, bestScore);
          alpha = Math.max(alpha, bestScore);
          bestMove = i;
          if (alpha > beta) break;
        }
      }
    } else {
      bestScore = Infinity;
      for (let i = 0; i < board.state.length; i++) {
        const e = board.state[i];
        if (e == '') {
          var newBoard = new TicTacToeBoard([...board.state]);
          newBoard.move(this.enemy, i);
          newNode = this.alphaBeta(newBoard, depth+1, true, alpha, beta, signature);
          bestScore = Math.min(newNode.score, bestScore);
          beta = Math.min(beta, bestScore);
          bestMove = i;
          if (alpha > beta) break;
        }
      }
    }
    return {
      signature, depth, isMaximizing, alpha, beta, score: bestScore, move: bestMove, node: newNode
    };
  }
}