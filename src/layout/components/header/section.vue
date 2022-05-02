<template>
  <div class="wrapper">
    <el-dropdown  @command="handleCommand" :hide-on-click="true" trigger="click">
      <el-button type="primary">
        {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,index) in sectionData" :key="index" :command="item" >{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    name: '',
    data(){
      return{
        name:'全标段',
        sectionData:[
          {
            name:'一工区',
            id:1
          },
          {
            name:'二工区',
            id:2
          },
          {
            name:'三工区',
            id:3
          },
          {
            name:'四工区',
            id:4
          },
          {
            name:'全标段',
            id:5
          }
        ]

      }
    },
    created() {
    },
    methods:{
      handleCommand(item){}
    }
  }
</script>

<style scoped lang="scss">
  .wrapper{
    display: flex;
    justify-content: center;
    .el-dropdown{
      .el-button{
        background-color: transparent;
        border: none;
      }
    }
  }

</style>
