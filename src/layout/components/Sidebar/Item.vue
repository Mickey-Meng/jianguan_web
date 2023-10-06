<script>


export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon style="color:#fff" icon-class={icon}/>)
      }
    }

    if (title) {
        // if(title=='待办任务'){
        //     vnodes.push(<span slot='title' class="nav_title_name">{(title)}{{this.agencytasknum}}</span>)
        // }else if(title=='抄送列表'){
        //     vnodes.push(<span slot='title' class="nav_title_name">{(title)}{{this.copytasknum}}</span>)
        // }else{
            
        // }
        vnodes.push(<span slot='title' class="nav_title_name">{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
