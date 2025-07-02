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

class Visual {
	optionCheckboxes = [];
	idCheckboxes = [];
	allCheckboxes = [];

	constructor() {
		this.optionCheckboxes = Array.from(document.getElementsByClassName("option"));
		this.idCheckboxes = Array.from(document.getElementsByClassName("compressId"));
		this.allCheckboxes = [...this.optionCheckboxes, ...this.idCheckboxes];
	}

	reset() {
		id("newbar").style.width = "0%";
		id("oldbar").style.width = "0%";
		id("importError").innerText = "";
		id("message").innerText = "暂无结果";
		id("waitForDownload").style.display = "none";
	}

	newbar(size) {
		id("newbar").style.width = `${size*100}%`;
	}

	oldbar(size) {
		id("oldbar").style.width = `${size*100}%`;
	}

	show(string) {
		id("message").innerHTML = string;
	}

	lock() {
		id("loadFromFile").disabled = true;
		id("loadFromUrl").disabled = true;

		for(let checkbox of this.allCheckboxes) {
			checkbox.disabled = true;
		}
	}

	unlock() {
		id("loadFromFile").disabled = false;
		id("loadFromUrl").disabled = false;

		for(let checkbox of this.allCheckboxes) {
			checkbox.disabled = false;
		}
	}

	getOptions() {
		let options = {};
		for(let checkbox of this.optionCheckboxes) {
			options[checkbox.name] = checkbox.checked;
		}
		options.reduceIds = [];
		for(let checkbox of this.idCheckboxes) {
			if(checkbox.checked) options.reduceIds.push(checkbox.name);
		}
		return options;
	}
}
Visual = new Visual();