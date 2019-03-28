// 工具类

// 银行卡账号掩码设置
var fmtBankAccount = function (account) {
	if (!account) {
		return null;
	}
	var tempArr = account.split(''),
		_result = '';
	tempArr.forEach(function (ele, index) {
		if (index < 10) {
			_result += ele;
		} else {
			if (tempArr[tempArr.length - 3] == ' ') {
				if (index < tempArr.length - 4) {
					_result += ele.replace(/\d/, '*');
				} else {
					_result += ele;
				}
			} else {
				if (index < tempArr.length - 3) {
					_result += ele.replace(/\d/, '*');
				} else {
					_result += ele;
				}
			}
		}
	});
	return _result;
};

// 倒计时
var timeCountFromEnd = function (sendBtn, timeDiv, timeCnt) {
	if (!sendBtn || !timeCnt || !timeDiv) {
		return;
	}

	var InterValObj, //timer变量，控制时间
		count = 60, //间隔函数，1秒执行
		curCount; //当前剩余秒数

	curCount = count;
	sendBtn.addClass('rp-none');
	timeDiv.removeClass('rp-none');
	timeCnt.text(curCount);

	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次

	//timer处理函数
	function SetRemainTime() {
		if (curCount == 1) {
			window.clearInterval(InterValObj); //停止计时器
			sendBtn.removeClass("rp-none"); //启用按钮
			timeDiv.addClass('rp-none');
			if (window.closeTimer == 1) {
				sendBtn.text('获取验证码');
			} else {
				sendBtn.text('重新发送');
			}
			window.smsFlag = 0;
			window.closeTimer = 0;
		} else {
			curCount--;
			timeCnt.text(curCount);
		}
	}
};

function templateItemToHtml (allKeys, dataObj, tmpHtml, emptyValue) {
	var rstItemHtml = tmpHtml;
	for (var i = 0; i < allKeys.length; i++) {
		var tmpKey = allKeys[i].replace('{{', '').replace('}}', '');
		//判断tmpkey是否为多层选择
		if (tmpKey.indexOf('.') != -1) {
			var keyArr = tmpKey.split('.');
			var tmpObj = dataObj;
			for (var j = 0; j < keyArr.length; j++) {
				tmpObj = tmpObj == null ? {} : tmpObj[keyArr[j]];
			};
			if (tmpObj.toString() == "[object Object]") { //防止不存在值
				tmpObj = emptyValue ? emptyValue : "-";
			}
			rstItemHtml = rstItemHtml.replace(allKeys[i], tmpObj);
		} else {
			if (dataObj[tmpKey] == undefined) {
				dataObj[tmpKey] = emptyValue ? emptyValue : "-";
			}
			rstItemHtml = rstItemHtml.replace(allKeys[i], dataObj[tmpKey]);
		}
	}
	return rstItemHtml;
}

//模板转换成html；
var templateToHtml = function (dataObj, templateId, emptyValue) {
	var rstHtml = "";
	var tmpHtml = $(templateId).html();
	var allKeys = tmpHtml.match(/{{\w.*?}}/g);
	if (allKeys != null) {
		if ((dataObj instanceof Array) && dataObj.length > 0) {
			for (var i = 0; i < dataObj.length; i++) {
				rstHtml += templateItemToHtml(allKeys, dataObj[i], tmpHtml, emptyValue);
			}
		} else {
			rstHtml = templateItemToHtml(allKeys, dataObj, tmpHtml, emptyValue);
		}
	}
	return rstHtml;
};

// 格式化银行账号 每四位一分
var fmtBankAccountByFour = function (accno) {
	var result = '';
	if (!accno) {
		return result;
	}
	var trimData = trimString(accno),
			len = trimData.length;
	if (len == 0) {
		return result;
	}
	var i = 0,
			j = i,
			tempData = '';
	while(true) {
		j = i + 4;
		tempData = trimData.substring(i, j);
		if (i < len) {
			if (tempData.length < 4) {
				result += tempData;
				return result;
			} else {
				result += (tempData + ' ');
				i += 4;
			}
		} else {
			return result;
		}
	}
};

// 去掉字符串的空格
var trimString = function (data) {
	if (!data) {
		return '';
	}
	return data.replace(/\s+/g,'');
};

