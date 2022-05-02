import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component
import ElFormUpload from '@/components/ElFormUpload/index'

// register globally
Vue.component('svg-icon', SvgIcon)
Vue.component('el-form-upload', ElFormUpload)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
