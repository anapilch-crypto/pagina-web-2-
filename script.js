// Aguarda a página carregar 100% antes de iniciar o xadrez
window.onload = function() {
    // Verifica se a biblioteca Chess foi carregada corretamente pela internet
    if (typeof Chess === 'undefined') {
        console.error("A biblioteca do xadrez falhou ao carregar. Tentando reconectar...");
        // Força o carregamento de um link alternativo super seguro caso falhe
        var script = document.createElement('script');
        script.src = 'https://jsdelivr.net';
        script.onload = initGame;
        document.head.appendChild(script);
    } else {
        initGame();
    }
};

var board = null;
var game = null;
var $status = null;

function initGame() {
    game = new Chess();
    $status = $('#status');

    var config = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      pieceTheme: 'https://chessboardjs.com{piece}.png'
    };
    
    board = Chessboard('board', config);
    updateStatus();
}

function onDragStart (source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove () {
  var possibleMoves = game.moves();
  if (possibleMoves.length === 0) return;

  var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
  updateStatus();
}

function onDrop (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  updateStatus();
  window.setTimeout(makeRandomMove, 500);
}

function onSnapEnd () {
  board.position(game.fen());
}

function updateStatus () {
  if (!$status) return;
  var status = '';
  var moveColor = 'Brancas';
  if (game.turn() === 'b') { moveColor = 'Pretas'; }

  if (game.in_checkmate()) {
    status = 'Fim de jogo! As ' + moveColor + ' sofreram Xeque-Mate.';
  } else if (game.in_draw()) {
    status = 'Fim de jogo! Empate.';
  } else {
    status = 'Turno das ' + moveColor;
    if (game.in_check()) { status += ' (Seu Rei está em Xeque!)'; }
  }
  $status.html(status);
}

// Lógica das Regras Interativas (Independe do motor do xadrez)
function showRule(piece) {
    const rules = {
        peao: "<strong>♟️ Peão:</strong> Anda 1 casa para frente (ou 2 no primeiro movimento). Captura na diagonal.",
        torre: "<strong>♜ Torre:</strong> Movimenta-se em linha reta por quantas casas quiser.",
        cavalo: "<strong>♞ Cavalo:</strong> Anda em formato de 'L'. É a única peça que pula outras!",
        bispo: "<strong>♝ Bispo:</strong> Anda apenas nas linhas diagonais por quantas casas quiser.",
        rainha: "<strong>♛ Rainha:</strong> A mais forte! Anda para qualquer direção por quantas casas quiser.",
        rei: "<strong>♚ Rei:</strong> Anda apenas 1 casa para qualquer direção. Proteja-o para ganhar!"
    };
    $('#rule-display').html(rules[piece]);
}

// Chat de Suporte
$('#chat-send').click(function() { sendMessage(); });
$('#chat-input').keypress(function(e) { if(e.which == 13) { sendMessage(); } });

function sendMessage() {
    var text = $('#chat-input').val().trim();
    if (text === '') return;

    $('#chat-messages').append('<div class="message user">' + text + '</div>');
    $('#chat-input').val('');
    scrollChat();

    setTimeout(function() {
        var reply = "Ainda estou aprendendo! 🌸 Digite 'regras', 'jogar' ou 'erro' para receber ajuda.";
        var lowerText = text.toLowerCase();

        if (lowerText.includes('regra') || lowerText.includes('como mover')) {
            reply = "📚 Clique nos botões das pecinhas embaixo do tabuleiro para ver as regras de movimento na tela!";
        } else if (lowerText.includes('jogar') || lowerText.includes('como jogo')) {
            reply = "🎮 Clique e arraste as peças brancas. O computador jogará automaticamente logo em seguida.";
        } else if (lowerText.includes('erro') || lowerText.includes('bug')) {
            reply = "🔧 Se algo travar, recarregue a página no seu navegador.";
        } else if (lowerText.includes('oi') || lowerText.includes('olá')) {
            reply = "Olá! 😊 Bem-vindo ao Xadrez Rosa. Como posso ajudar no seu jogo hoje?";
        }

        $('#chat-messages').append('<div class="message bot">' + reply + '</div>');
        scrollChat();
    }, 600);
}

function scrollChat() {
    var chat = $('#chat-messages');
    chat.scrollTop(chat.prop("scrollHeight"));
}
