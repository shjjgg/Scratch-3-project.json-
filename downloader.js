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

let requestsAwaiting = [];
let requestsActive = 0;

function download(url, type, errorMsg) {
	return new Promise((resolve, reject) => {
		requestsAwaiting.push({url, type, resolve, reject, errorMsg, attempt:1});
		downloadNext();
	});
}

function downloadNext() {
	if(requestsAwaiting > 9 || requestsAwaiting.length == 0) return;
	requestsActive++;
	let current = requestsAwaiting.shift();

	let xhr = new XMLHttpRequest();
	if(current.type) xhr.responseType = current.type;
	xhr.open("GET", current.url, true);
	xhr.onload = function() {
		if(current.type == "arraybuffer") {
			current.resolve(this.response);
		} else {
			current.resolve(this.responseText);
		}
		requestsActive--;
		downloadNext();
	}
	xhr.onerror = function() {
		if(current.attempt < 4) {
			current.attempt++;
			requestsAwaiting.push(current);
			requestsActive--;
			downloadNext();
		} else {
			alert("下载失败：" + current.errorMsg);
			current.reject(current.errorMsg);
		}
	}
	xhr.send();
}