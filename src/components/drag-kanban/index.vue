<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable
        class="board-column-content"
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        :list="list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
    >
      <template #item="{ element }">
        <li class="board-item">
          <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
          ></i>
          {{ element.name }}{{ element.id }}
        </li>
      </template>
    </draggable>

  </div>

</template>

<script>
import draggable from "vuedraggable";
import {computed, ref} from "vue";

export default {
  name: "transition-example-2",
  display: "Transitions",
  order: 7,
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props,context) {
    let drag = ref(false)

    const dragOptions = computed(()=>{
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    })

    const sort = ()=> {
      props.list = props.list.sort((a, b) => a.order - b.order);
    }

    return{
      drag,
      sort,
      dragOptions
    }
  }
};
</script>

<style scoped lang="scss">
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    margin: 0;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    padding-left: 0;
    list-style: none;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 50px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 40px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>