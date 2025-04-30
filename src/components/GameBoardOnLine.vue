<template>
  <div>
    <div v-if="!isGameStarted">
      <div v-if="!winner && yourPlayer">
        Opponent left the game
      </div>
      <div v-else-if="winner && winner === yourPlayer">
        You won!
      </div>
      <div v-else-if="winner && winner !== yourPlayer">
        You lost!
      </div>
      <button @click="resetGame">Play</button>
    </div>
    <div v-else-if="!yourPlayer">
      <h3>Waiting for player...</h3>
    </div>
    <GameBoard
      v-else
      :player-o-moves="playerOMoves"
      :player-x-moves="playerXMoves"
      :current-player="currentPlayer"
      :your-player="yourPlayer"
      :board="board"
      @make-move="makeMove"
    />
  </div>
</template>

<script>
import GameBoard from "@/components/GameBoard.vue";
import useSocketEvents from "@/composables/useSocketEvents";
import { inject, ref } from "vue";

export default {
  name: 'GameBoardOnLine',
  components: {
    GameBoard,
  },
  setup() {
    const socket = inject('$socket');
    const socketState = inject('$socketState');

    const isGameStarted = ref(false);
    const board = ref([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    const yourPlayer = ref('');
    const currentPlayer = ref('');
    const winner = ref('');
    const playerXMoves = ref([]);
    const playerOMoves = ref([]);

    useSocketEvents(socket, socketState, {
      yourPlayer: (data) => {
        yourPlayer.value = data.yourPlayer;
      },
      startGame: (data) => {
        board.value = data.board;
        currentPlayer.value = data.currentPlayer;
        winner.value = data.winner;
        playerXMoves.value = data.playerXMoves;
        playerOMoves.value = data.playerOMoves;
      },
      currentState: (data) => {
        board.value = data.board;
        currentPlayer.value = data.currentPlayer;
        winner.value = data.winner;
        playerXMoves.value = data.playerXMoves;
        playerOMoves.value = data.playerOMoves;
      },
      gameOver: (data) => {
        winner.value = data.winner;
        isGameStarted.value = false;
      },
      playerLeft: () => {
        isGameStarted.value = false;
      },
    });

    return {
      socket,
      socketState,
      isGameStarted,
      board,
      yourPlayer,
      currentPlayer,
      winner,
      playerXMoves,
      playerOMoves,
    };
  },
  methods: {
    isCurrentPlayerFirstMove(row, col) {
      if (this.currentPlayer === 'X') {
        if (this.playerXMoves.length < 3) {
          return false;
        }

        return this.playerXMoves[0]?.col === col && this.playerXMoves[0]?.row === row;
      }

      if (this.playerOMoves.length < 3) {
        return false;
      }

      return this.playerOMoves[0]?.col === col && this.playerOMoves[0]?.row === row;
    },
    makeMove(row, col) {
      if (this.yourPlayer !== this.currentPlayer || this.winner || this.board[row][col]) {
        return;
      }

      this.socket.emit('makeMove', { row, col });
    },
    resetGame() {
      this.socket.emit('joinGame', {});
      this.isGameStarted = true;
      this.winner = null;
      this.yourPlayer = '';
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 16px;
  background: linear-gradient(135deg, #4d79ff, #6a5acd);
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #6a5acd, #4d79ff);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
