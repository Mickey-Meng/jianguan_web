<template>
	<div>
		<el-upload class="upload-demo" action="" :limit="1" :show-file-list="false"
			ref="upload"
			accept=".jpg,.jpeg,.png,gif,JPG,JPEG,PNG,GIF,.map4,.xlsx,.xls,.pdf,.doc,.docx" :http-request="importFile">
			<el-button size="small" type="primary">点击上传</el-button>
		</el-upload>
	</div>
</template>

<script>
	import * as api from "@/api/quality";

	export default {
		data() {
			return {}
		},
		methods: {
			importFile(params) {
				let data = new FormData();
				data.append("file", params.file);
				api.uploadFile(data).then((res) => {
					this.$message({
						type: 'success',
						message: '上传成功!'
					});
					this.$refs.upload.clearFiles();
					this.$emit("afterUp",res['data']);
				});
			}
		}
	}
</script>

<style>
</style>
