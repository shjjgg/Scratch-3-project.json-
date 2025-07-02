//    ScratchTools - a set of simple Scratch related tools
//    ScratchTools - 一组简单的 Scratch 相关工具
//    Copyright (C) 2021-2023  Xeltalliv
//
//    This program is free software: you can redistribute it and/or modify
//    本程序为自由软件：你可以重新发布和/或修改
//    it under the terms of the GNU General Public License as published by
//    根据自由软件基金会发布的 GNU 通用公共许可证第三版或（由你选择的）更高版本的条款。
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    本程序以希望对你有用为目的发布，
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    但不提供任何担保；甚至没有适销性或特定用途适用性的隐含担保。
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//    有关详细信息，请参阅 GNU 通用公共许可证。
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.
//    你应该已经收到随本程序附带的 GNU 通用公共许可证副本。如果没有，请访问 <https://www.gnu.org/licenses/>。

class Project {
	name;
	projectJson;
	projectJsonString = "";
	zip;
	type;

	async loadFromFile(file) {
		if(!file) throw new Error("未选择任何文件");

		try {
			let projectJsonString = await this.readBlob(file);
			let projectJson = JSON.parse(project);
			
			this.name = file.name || "project.json";
			this.projectJson = projectJson;
			this.projectJsonString = projectJsonString;
			this.type = "json";
		} catch(e) {
			let zip = await JSZip.loadAsync(file);
			let projectJsonString = await zip.file("project.json").async("string");
			let projectJson = parse(projectJsonString, "解析项目 JSON 失败");

			this.name = file.name || "project.sb3";
			this.projectJson = projectJson;
			this.projectJsonString = projectJsonString;
			this.zip = zip;
			this.type = "sb3";
		}
	}

	async loadFromUrl(url) {
		let id = parseInt(url.match(/\d+/)?.[0]);
		if(isNaN(id)) throw new Error("项目 URL 或 ID 无效");

		await Visual.show("正在加载 project.json");
		let projectApi = await download(`https://trampoline.turbowarp.org/proxy/projects/${id}`, "text", "获取项目令牌失败");
		let projectApiJson = parse(projectApi, "解析项目 API JSON 失败");
		let projectJsonString = await download(`https://projects.scratch.mit.edu/${id}?token=${projectApiJson.project_token}`, "text", "下载项目 JSON 失败");
		let projectJson = parse(projectJsonString, "解析项目 JSON 失败");
		let targets = defined(projectJson.targets, "未找到目标对象");

		let assets = {};
		let assetCounter = {total:0, loaded:0};
		let promiseList = [];
		let zip = new JSZip();
		for(var spriteName in targets) {
			let sprite = targets[spriteName];
			for(var asset in sprite.costumes) promiseList.push(this.processAsset(sprite.costumes[asset], assets, assetCounter, zip));
			for(var asset in sprite.sounds) promiseList.push(this.processAsset(sprite.sounds[asset], assets, assetCounter, zip));
		}
		await Visual.show(`正在加载资源（共 ${assetCounter.total} 个）`);
		await Promise.all(promiseList);
		console.log("所有资源已加载");

		this.name = `${id}.sb3`;
		this.projectJson = projectJson;
		this.projectJsonString = projectJsonString;
		this.zip = zip;
		this.type = "sb3";
	}

	async readBlob(file) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = event => resolve(event.target.result);
		});
	}

	async processAsset(asset, assets, assetCounter, zip) {
		var md5ext = asset.md5ext || asset.assetId+"."+asset.dataFormat;
		if(assets[md5ext]) return;
		assets[md5ext] = true;
		assetCounter.total++;
		let content = await download(`https://assets.scratch.mit.edu/internalapi/asset/${md5ext}/get`, "arraybuffer", `下载资源 ${md5ext} 失败`);
		zip.file(md5ext, content);
		console.log(`资源 ${md5ext} 已加载`);
		assetCounter.loaded++;
		Visual.newbar(assetCounter.loaded / assetCounter.total);
	}

	async save() {
		let blob;
		let projectJsonString = this.projectJsonString;

		let name = this.name.split(".");
		name.splice(name.length-1, 0, "min");
		name = name.join(".");
		
		if(this.type == "json") {
			blob = new Blob([projectJsonString], {type: "text/plain;charset=utf-8"});
		} else if(this.type == "sb3") {
			this.zip.file("project.json", projectJsonString);
			blob = await this.zip.generateAsync({type: "blob", compression: "DEFLATE"});
		} else {
			throw new Error(`无法识别的项目类型: ${this.type}`);
		}
		saveAs(blob, name);
	}
}