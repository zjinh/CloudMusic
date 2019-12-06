<template>
	<div class="cm-page-main">
		<PageHeader title="本地音乐" :count="localMusic.length" prefix="歌曲">
			<button @click="scanLocalMusic" class="cm-dir-button">
				重新扫描
			</button>
			/
			<button @click="changeDir" class="cm-dir-button">选择目录</button>
		</PageHeader>
		<div class="cm-local-list">
			<SongList :data="localMusic" type="local" :loading="loading" />
		</div>
	</div>
</template>

<script>
const fs = require('fs');
const async = require('async');
export default {
	name: 'LocalMusic',
	data() {
		return {
			localDir: '',
			loading: true,
			localMusic: []
		};
	},
	created() {
		this.localDir = localStorage.localDir;
		this.$Api.LocalFile.read('local-music', data => {
			if (data.constructor === Array && data.length) {
				data.forEach(item => {
					item.play = false;
				});
				this.localMusic = data;
				this.loading = false;
			} else {
				if (this.localDir !== undefined && this.localDir.length) {
					this.scanLocalMusic();
				} else {
					this.$Message.info('请选择本地音乐目录');
					this.changeDir();
				}
			}
		});
	},
	methods: {
		scanLocalMusic() {
			this.localMusic = [];
			this.loading = true;
			// 使用 fs.readdir 来获取文件列表
			const folderPath = this.localDir;
			fs.readdir(folderPath, (err, files) => {
				if (err) {
					this.loading = false;
					return this.$Message.error('对不起，无法检索该目录');
				}
				localStorage.localDir = this.localDir;
				for (let i = files.length - 1; i >= 0; i--) {
					let item = files[i];
					const resolveFilePath = this.$path.resolve(folderPath, item);
					if (fs.lstatSync(resolveFilePath).isDirectory() || !item.Before('.').Exist('m4a,mp3,ogg,flac,f4a,wav')) {
						files.splice(i, 1);
					}
				}
				if (files.length === 0) {
					return this.localFileSet(files);
				}
				async.map(
					files,
					(file, asyncCB) => {
						const resolveFilePath = this.$path.resolve(folderPath, file);
						this.inspectAndDescribeFile(resolveFilePath, asyncCB);
					},
					this.displayFiles
				);
			});
		},
		getMusicInfo(files, index) {
			let file = files[index];
			this.$getMusicInfo(file.url, data => {
				Object.assign(files[index], data);
				if (index === files.length - 1) {
					this.localFileSet(files);
				} else {
					this.getMusicInfo(files, ++index);
				}
			});
		},
		displayFiles(err, files) {
			// 该函数的作用是显示文件列表信息
			if (err) {
				this.loading = false;
				return this.$Message.error('对不起，无法检索该目录下的文件');
			}
			this.getMusicInfo(files, 0);
		},
		localFileSet(files) {
			this.localMusic = files;
			this.$Api.LocalFile.write('local-music', files);
			this.loading = false;
		},
		inspectAndDescribeFile(filePath, cb) {
			fs.stat(filePath, (err, stat) => {
				if (err) {
					cb(err);
				} else {
					cb(err, {
						id: this.$randomRange(0, 9999999),
						url: filePath,
						size: stat.size,
						type: 'local'
					});
				}
			});
		},
		changeDir() {
			this.$electron.remote.dialog.showOpenDialog(
				{
					//默认路径
					defaultPath: '../Desktop',
					//选择操作，此处是打开文件夹
					properties: ['openDirectory'],
					filters: [{ name: 'All', extensions: ['*'] }]
				},
				res => {
					if (res) {
						res = res[0] || process.env.USERPROFILE;
						if (res === localStorage.localDir) {
							return;
						}
						this.localDir = res;
						this.scanLocalMusic();
					}
				}
			);
		}
	}
};
</script>

<style scoped>
.cm-dir-button {
	color: #e56464;
	background: none;
}

.cm-local-list {
	width: 100%;
}
</style>
