<template>
	<div>
		<el-tree ref="tree" :data="treeInfo" accordion class="tree-box" highlight-current node-key="id"
			:default-expanded-keys="[2]" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick">
			<span slot-scope="{ node, data }" class="custom-tree-node">
				<span>
					<svg-icon class="svg-class" :icon-class="data.child.length > 0 ? 'folder' : 'coverage'" />
					{{ node.label }}
				</span>
				<svg-icon v-if="data.mouldid" class="svg-class" icon-class="model" />
			</span>
		</el-tree>
	</div>
</template>

<script>
	import {
		getBridgeTree
	} from "@/api/tree";
	
	import simpleData from '../common/simdata.js'

	export default {
		data() {
			return {
				treeInfo:null,
				defaultProps: {
				  children: "child",
				  label: "name"
				},
				treename:[]
			}
		},
		mounted() {
			this.initData()
		},
		methods:{
			initData(){
				this.treeInfo = [simpleData.data];
			
				// getBridgeTree('QL', null).then((res) => {
				//   const arr = [];
				//   arr.push(res.data);
				//   this.treeInfo = arr;
				// });
			},
			nodeClick(node, data){
				this.treename=[];
				this.getTreeName(data);
				this.$emit('callback',node,data,this.treename.reverse())
			},
			
			getTreeName(node){
				if(node.parent){
					this.treename.push(node.data.name)
					this.getTreeName(node.parent)
				}
			}
		}
	}
</script>

<style>
</style>
