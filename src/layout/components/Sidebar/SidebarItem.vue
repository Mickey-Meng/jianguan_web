<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
        <span v-if="onlyOneChild.meta.title=='待办任务'" class="message-num">{{agencytasknum}}</span>
        <span v-if="onlyOneChild.meta.title=='抄送列表'" class="message-num">{{copytasknum}}</span>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
  import path from 'path'
  import { isExternal } from '@/utils/validate'
  import Item from './Item'
  import AppLink from './Link'
  import FixiOSBug from './FixiOSBug'

  import store from '@/store'

  export default {
    name: 'SidebarItem',
    computed:{
    agencytasknum() {
        return store.state.task.agencytasknum;
    },
    copytasknum() {
        return store.state.task.copytasknum;
    }
  },
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      this.onlyOneChild = null
      return {}
    },
    methods: {
      hasOneShowingChild(children = [], parent) {
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false
          } else {
            // Temp set(will be used if only has one showing child)
            this.onlyOneChild = item
            return true
          }
        })
        if (showingChildren.length === 1) {
          return true
        }
        if (showingChildren.length === 0) {
          this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
          return true
        }

        return false
      },
      resolvePath(routePath) {
        if (isExternal(routePath)) {
          return routePath
        }
        if (isExternal(this.basePath)) {
          return this.basePath
        }
        return path.resolve(this.basePath, routePath)
      }
    }
  }
</script>
<style scoped>
.nest-menu{
    position: relative;
}
.message-num{
    position: absolute;
    top: 16px;
    right: 20px;
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
}
</style>
