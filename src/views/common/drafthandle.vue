<template>
	<div class="form-btns">
		<el-button size="medium" @click="addOrModify">保存草稿</el-button>
		<el-button size="medium" @click="checkDraft">选择草稿</el-button>
		<el-button size="medium" type="primary">复制填充</el-button>
	</div>
</template>

<script>
	
	export default {
		data() {
			return {
			};
		},
		created() {},
		computed: {
			
		},
		mounted() {
			
		},
		methods: {
			addOrModify(){
				this.$emit("addOrModify",true);
			},
			checkDraft(){
				this.$emit("checkDraft");
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>
