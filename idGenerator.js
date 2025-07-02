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

class IdGenerator {
	// https://github.com/LLK/scratch-blocks/blob/67e0ba1942b473fde31e4fd9435b28919afbaa02/core/utils.js#L632-L633
	// 参考自 scratch-blocks 的 utils.js
	chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789!#$%()*+,-./:;=?@[]^_`{|}~";
	indexes = [-1];
	forbidden = {};

	constructor() {
		this.indexes = [-1];
	}

	genId() {
		let indexes = this.indexes;
		let charCount = this.chars.length;
		let chars = this.chars;
		let forbidden = this.forbidden;
		
		let result = "123";
		while(!isNaN(result) || result == "of" || forbidden[result]) {
			let i = 0;
			while(true) {
				indexes[i]++;
				if(indexes[i] >= charCount) {
					indexes[i] = 0;
					i++;
					if(i == indexes.length) {
						indexes.push(0);
						break;
					}
				} else {
					break;
				}
			}
			result = indexes.map(charIndex => chars[charIndex]).join("");
		}
		return result;
	}
}