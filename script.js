// Inicialização do Jogo de Xadrez
var board = null
var game = new Chess()
var $status = $('#status')

function onDragStart (source, piece, position, orientation) {
  // Não deixa mover peças se o jogo acabou ou se for a vez das Pretas
  if (game.game_over()) return false
  if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // Se o jogo acabou, para por aqui
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
  updateStatus()
}

function onDrop (source, target) {
  // Confere se o movimento feito pelo jogador é válido pelas regras do xadrez
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // Promove para Rainha automaticamente se chegar ao fim
  })

  // Se o movimento for inválido, a peça volta para o lugar original
  if (move === null) return 'snapback'

  updateStatus()
  // Faz o computador jogar sozinho logo em seguida (simulando a partida)
  window.setTimeout(makeRandomMove, 500)
}

function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''
  var moveColor = 'Brancas'
  if (game.turn() === 'b') {
    moveColor = 'Pretas'
  }

  if (game.in_checkmate()) {
    status = 'Fim de jogo! As ' + moveColor + ' sofreram Xeque-Mate.'
  } else if (game.in_draw()) {
    status = 'Fim de jogo! Empate.'
  } else {
    status = 'Turno das ' + moveColor
    if (game.in_check()) {
      status += ' (Seu Rei está em Xeque!)'
    }
  }
  $status.html(status)
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'https://chessboardjs.com{piece}.png'
}
board = Chessboard('board', config)
updateStatus()

// Lógica das Regras Interativas
function showRule(piece) {
    const rules = {
        peao: "<strong>♟️ Peão:</strong> Anda 1 casa para frente (ou 2 no primeiro movimento do jogo). Ele captura outras peças andando um passo na diagonal.",
        torre: "<strong>♜ Torre:</strong> Movimenta-se em linha reta para cima, para baixo, para a esquerda ou direita por quantas casas quiser.",
        cavalo: "<strong>♞ Cavalo:</strong> Anda em formato de 'L' (anda duas casas em uma direção e uma para o lado). É a única peça que pula outras!",
        bispo: "<strong>♝ Bispo:</strong> Anda apenas nas linhas diagonais quantas casas quiser, sem pular peças.",
        rainha: "<strong>♛ Rainha:</strong> A peça mais forte! Ela pode andar para qualquer direção (reta ou diagonal) por quantas casas quiser.",
        rei: "<strong>♚ Rei:</strong> Anda apenas 1 casa para qualquer direção. Se ele for encurralado sem saída, o jogo acaba!"
    };
    $('#rule-display').html(rules[piece]);
}

// Lógica do Bot de Suporte Inteligente
$('#chat-send').click(function() {
    sendMessage();
});

$('#chat-input').keypress(function(e) {
    if(e.which == 13) {
        sendMessage();
    }
});

function sendMessage() {
    var text = $('#chat-input').val().trim();
    if (text === '') return;

    // Adiciona a mensagem criada pelo usuário na tela
    $('#chat-messages').append('<div class="message user">' + text + '</div>');
    $('#chat-input').val('');
    scrollChat();

    // Cria a resposta automática do robô após meio segundo
    setTimeout(function() {
        var reply = "Ainda estou aprendendo! 🌸 Digite 'regras' para entender o xadrez, 'jogar' para iniciar a partida ou 'erro' para suporte técnico.";
        var lowerText = text.toLowerCase();

        if (lowerText.includes('regra') || lowerText.includes('como mover') || lowerText.includes('como anda')) {
            reply = "📚 Para ver as regras, basta clicar nos botões das pecinhas logo abaixo do tabuleiro! Cada botão ensina um movimento diferente.";
        } else if (lowerText.includes('jogar') || lowerText.includes('como jogo') || lowerText.includes('começar')) {
            reply = "🎮 É super simples! Basta clicar e arrastar as suas peças brancas no tabuleiro. O oponente rosa vai responder logo em seguida.";
        } else if (lowerText.includes('erro') || lowerText.includes('bug') || lowerText.includes('travou')) {
            reply = "🔧 Se o jogo travar, tente atualizar a página apertando F5. Caso não resolva, limpe o histórico do navegador.";
        } else if (lowerText.includes('oi') || lowerText.includes('olá') || lowerText.includes('bom dia')) {
            reply = "Olá! 😊 Seja muito bem-vindo ao suporte do Xadrez Rosa. Como posso te ajudar a jogar hoje?";
        }

        $('#chat-messages').append('<div class="message bot">' + reply + '</div>');
        scrollChat();
    }, 600);
}

function scrollChat() {
    var chat = $('#chat-messages');
    chat.scrollTop(chat.prop("scrollHeight"));
}
