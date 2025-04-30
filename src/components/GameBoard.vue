<template>
  <div>
    <h3 v-if="currentPlayer === yourPlayer">Your turn</h3>
    <h3 v-else>
      Waiting for {{ currentPlayer }} to make a move
    </h3>
    <table class="game-board">
      <tr v-for="(row, rowIndex) in board" :key="rowIndex">
        <td v-for="(cell, colIndex) in row" :key="colIndex">
          <TableCell
            :type="isCurrentPlayerFirstMove(rowIndex, colIndex) ? cell.toLocaleLowerCase() : cell"
            @click="makeMove(rowIndex, colIndex)"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import TableCell from './TableCell.vue';

export default {
  name: 'GameBoard',
  components: {
    TableCell
  },
  props: {
    board: {
      type: Array,
      required: true,
      default: () => ([
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]),
    },
    currentPlayer: {
      type: String,
      required: true,
      default: '',
    },
    yourPlayer: {
      type: String,
      required: true,
      default: '',
    },
    playerXMoves: {
      type: Array,
      required: true,
      default: () => [],
    },
    playerOMoves: {
      type: Array,
      required: true,
      default: () => [],
    },
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
    makeMove(rowIndex, colIndex) {
      this.$emit('makeMove', rowIndex, colIndex);
    },
  }
}
</script>

<style scoped>
.game-board {
  border-collapse: collapse;
  margin: 20px auto;
}
.game-board td {
  width: 64px;
  height: 64px;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  border: 1px solid black;
}
</style>
