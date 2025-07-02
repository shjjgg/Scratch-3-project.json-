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

const id = (id) => document.getElementById(id);
if(location.hash) id("urlInput").value = location.hash.substr(1);

id("loadFromUrl").addEventListener("click", async function(event) {
	try {
		Visual.reset();
		Visual.lock();
		let project = new Project();
		await project.loadFromUrl(id("urlInput").value);
		await compressAndSave(project);
	} catch(error) {
		id("importError").innerText = error;
	}
	Visual.unlock();
});

id("loadFromFile").addEventListener("click", function(event) {
	id("filePicker").click();
});

id("filePicker").addEventListener("change", async function(event) {
	try {
		Visual.reset();
		Visual.lock();
		let file = event.target.files[0]; 
		if(!file) return;
		event.target.value = null;
		let project = new Project();
		await project.loadFromFile(file);
		await compressAndSave(project);
	} catch(error) {
		id("importError").innerText = error;
	}
	Visual.unlock();
});

async function compressAndSave(project) {
	try {
		let options = Visual.getOptions();
		let min = new Minimizer();
		min.main(project.projectJson, options);

		let oldJson = project.projectJsonString;
		let newJson = project.projectJsonString = JSON.stringify(project.projectJson);
		let delta = oldJson.length - newJson.length;
		if(delta >  0) id("message").innerText = `体积减少了 ${delta} 字节`;
		if(delta == 0) id("message").innerText = `体积没有变化`;
		if(delta <  0) id("message").innerHTML = `体积<span class="redText">增加</span>了 ${-delta} 字节`;
		Visual.newbar(newJson.length / 5242880);
		Visual.oldbar(delta / 5242880);

		if(!options.dryRun) {
			id("waitForDownload").style.display = "inline";
			await project.save();
		}
	} catch(error) {
		id("message").innerHTML=`<span class="redText">${error}</span>`;
	}
}

function parse(string, errorMsg) {
	try {
		return JSON.parse(string);
	} catch(e) {
		throw new Error(errorMsg);
	}
}

function defined(value, errorMsg) {
	if(value === undefined || value === null) throw new Error(errorMsg);
	return value;
}