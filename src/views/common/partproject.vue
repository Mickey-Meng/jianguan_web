<template>
	<div>
		<el-select v-model="currentModule" @change="getTreeData" placeholder="请选择">
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>

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
	import { getDicts } from "@/api/progress";
	export default {
		data() {
			return {
				treeInfo: null,
				defaultProps: {
					children: "child",
					label: "name"
				},
				currentModule: '',
				options: [],
				treename: []
			}
		},
		mounted() {
			getDicts('jg_gclx_all').then(res => {
				const data = res.data || [];
				const array = [];
				for(let i = 0; i <= data.length - 1; i++){
					const type = data[i];

					if (i === 0) {
						this.currentModule = type.dictValue;
					}
					
					const obj = {
						label: type.dictLabel,
						value: type.dictValue
					}
					array.push(obj);
				}

				this.options = array;

				this.initData()
			})
		},
		methods: {
			
			initData() {
				// this.treeInfo = [simpleData.data];
				// getBridgeTree('QL', null).then((res) => {
				// 	const arr = [];
				// 	arr.push(res.data);
				// 	this.treeInfo = arr;
				// });
				this.getTreeData();
			},
			getTreeData(){
				getBridgeTree(this.currentModule, this.$store.getters.project.id).then((res) => {
					const arr = [];
					arr.push(res.data);
					this.treeInfo = arr;
				});
			},
			nodeClick(node, data) {
				this.treename = [];
				this.getTreeName(data);
				this.$emit('callback', node, data, this.treename.reverse())
			},

			getTreeName(node) {
				if (node.parent) {
					this.treename.push(node.data.name)
					this.getTreeName(node.parent)
				}
			}
		}
	}
</script>

<style>
</style>
