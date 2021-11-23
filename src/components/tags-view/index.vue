<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :style="{'backgroundColor':isActive(tag)?theme:'#fff','borderColor':isActive(tag)?theme:'#d8dce5'}"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag,$event)"

      >
        {{ generateRouterTitle(tag.meta) }}
        <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"><close /></el-icon>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">{{ $t('tagsView.close') }}</li>
      <li @click="closeOthersTags">{{ $t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import {computed, inject, onMounted, reactive, toRefs, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {Close} from "@element-plus/icons";

export default {
  components: {ScrollPane,Close},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    let state = reactive({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    })

    const generateRouterTitle = inject('generateRouterTitle')

    const visitedViews = computed(() => {
      return store.state.app.visitedViews
    })

    const theme = computed(() => {
      return store.state.app.theme
    })

    watch(route, () => {
      addTags()
    })

    watch(() => state.visible, (value) => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })


    const addTags = () => {
      const {name} = route
      if (name) {
        store.dispatch('app/addView', route)
      }
      return false
    }

    const closeMenu = () => {
      state.visible = false
    }

    const handleScroll = () => {
      closeMenu()
    }

    const isActive = (r) => {
      return r.path === route.path
    }

    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix
    }

    const closeSelectedTag = (view) => {
      store.dispatch('app/delView', view).then(({visitedViews}) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'home') {
          console.log(view.name)
          // to reload home page
          router.replace({path: view.fullPath})
        } else {
          router.push('/')
        }
      }
    }

    const closeOthersTags = () => {
      router.push(state.selectedTag)
      store.dispatch('app/delOthersViews', state.selectedTag)
    }

    const closeAllTags = (view) => {
      store.dispatch('app/delAllViews').then(({visitedViews}) => {
        toLastView(visitedViews, view)
      })
    }

    onMounted(() => {
      addTags()
    })

    return {
      ...toRefs(state),
      generateRouterTitle,
      visitedViews,
      theme,
      handleScroll,
      isActive,
      isAffix,
      closeSelectedTag,
      toLastView,
      closeOthersTags,
      closeAllTags
    }
  },

  methods: {
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/element";

.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        //background-color: #42b983;
        color: #fff;
        //border-color:#42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      font-size: 12px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
