<template>
  <div class="components-container">
    <aside>长安的雪飘不到江南、江南的雨也落不到长安</aside>
    <div class="board">
      <Kanban :key="1" :list="list1"  class="kanban todo" header-text="Todo" />
      <Kanban :key="2" :list="list2"  class="kanban working" header-text="Working" />
      <Kanban :key="3" :list="list3"  class="kanban done" header-text="Done" />
    </div>
  </div>
</template>
<script>
import Kanban from '@/components/drag-kanban'
import {reactive, toRefs} from "vue";

export default {
  name: 'kanban',
  components: {
    Kanban
  },
  setup(){
    const state = reactive({
      group: 'mission',
      list1: [
        { name: 'Mission', id: 1 },
        { name: 'Mission', id: 2 },
        { name: 'Mission', id: 3 },
        { name: 'Mission', id: 4 }
      ],
      list2: [
        { name: 'Mission', id: 5 },
        { name: 'Mission', id: 6 },
        { name: 'Mission', id: 7 }
      ],
      list3: [
        { name: 'Mission', id: 8 },
        { name: 'Mission', id: 9 },
        { name: 'Mission', id: 10 }
      ]
    })
    return{
      ...toRefs(state)
    }
  }
}
</script>
<style lang="scss">
.board {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

