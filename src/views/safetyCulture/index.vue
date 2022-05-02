<template>
<div class="wrapper">
  <ul class="header">
    <li v-for="(item,index) in tabOptions" :key="index" :class="{'active':item.key === currentView}" @click="changeView(item.key)">{{ item.label }}</li>
  </ul>
  <div class="content">
    <keep-alive>
      <component v-bind:is="currentView"></component>
    </keep-alive>
  </div>
</div>
</template>

<script>
  import securityPatrolling from '@/views/safetyCulture/indexComponent/securityPatrolling'
  import safetyEducation from '@/views/safetyCulture/indexComponent/safetyEducation'
  import riskControl from '@/views/safetyCulture/indexComponent/riskControl'
  import peopleManagement from '@/views/safetyCulture/indexComponent/peopleManagement'
  import equipmentLedger from '@/views/safetyCulture/indexComponent/equipmentLedger'

  export default {
    name: '',
    components: { securityPatrolling, safetyEducation, riskControl, peopleManagement, equipmentLedger },
    data() {
      return {
        tabOptions: [
          { label: '安全巡更', key: 'securityPatrolling' },
          { label: '安全教育', key: 'safetyEducation' },
          { label: '风险管控', key: 'riskControl' },
          // { label: '人员管理', key: 'peopleManagement' },
          { label: '设备台账', key: 'equipmentLedger' }
        ],
        currentView: 'securityPatrolling'
      }
    },
    methods:{
      changeView(val){
        this.currentView =val;
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    height: 100%;
    padding: 10px;
    background-color: #EDEFF8;

    .header {
      height: 70px;
      line-height: 70px;
      background-color: #FFFFFF;
      color: #000000;
      display: flex;
      align-items: center;
      li{
        height: 50px;
        line-height: 50px;
        border: 1px solid rgb(51, 133, 255);
        padding: 0 40px;
        cursor: pointer;
      }
      .active{
        background-color: rgb(51, 133, 255);
        color: #FFFFFF;
      }


    }

    .content {
      margin-top: 10px;
      background-color: #FFFFFF;
      height: calc(100% - 100px);
    }
  }

</style>
