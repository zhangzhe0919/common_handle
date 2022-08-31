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

/**
 * 使用正则表达式简化逻辑
 * 获取url value
 * @param name
 * @returns {string}
 */
function getQueryString (name, url) {
    if (typeof name !== 'string') {
    	return null;
    }	
    const result = {};
    let search = url ? url : window.location.search;
    search.replace(/([^&=?]+)=([^&]+)/g, (m, $1, $2) => {
        result[$1] = decodeURIComponent($2);
    })
    return result[name] || null;
}

/**
   *  微信里动态修改页面title
   *
   * @param {*} title 标题
   */
  function setDocumentTitle(title) {
    document.title = title;
    if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
      var i = document.createElement('iframe');
      i.src = '/favicon.ico';
      i.style.display = 'none';
      i.onload = function () {
        setTimeout(function () {
          i.remove();
        }, 9);
      };
      document.body.appendChild(i);
    }
  }

// 严谨方式校验身份证号码
        var strictCheckIdetify = function (idCard) {
            //15位和18位身份证号码的正则表达式
            var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            //如果通过该验证，说明身份证格式正确，但准确性还需计算
            if(regIdCard.test(idCard)) {
                if(idCard.length == 18) {
                    var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                    var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                    var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                    for(var i = 0; i < 17; i++) {
                        idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                    }

                    var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
                    var idCardLast = idCard.substring(17); //得到最后一位身份证号码

                    //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                    if(idCardMod == 2) {
                        if(idCardLast == "X" || idCardLast == "x") {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                        if(idCardLast == idCardY[idCardMod]) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }
        },
        // 根据获取身份证号码获取生日和性别
        var getBirthAndSex = function(idCard) {
            var rst = {
                isPass: false,
                birth: null,
                sex: null   
            };
            var tempIdCard = $.trim(idCard);
            var isCrect = this.strictCheckIdetify(tempIdCard);
            if (isCrect) {
                rst.isPass = true;
                var tbirth = null;
                var sexno = null;
                if(tempIdCard.length === 15) {
                    tbirth = "19" + tempIdCard.substring(6, 12);
                    sexno=tempIdCard.substring(14,15);
                } else if (tempIdCard.length === 18) {
                    tbirth = tempIdCard.substring(6, 14);
                    sexno=tempIdCard.substring(16,17);
                } else {
                    return rst;
                }
                rst.birth = tbirth.substring(0, 4) + "-" + tbirth.substring(4, 6) + "-" + tbirth.substring(6);
                rst.sex = sexno % 2 == 0 ? 'F' : 'M';
            }
            return rst;
				}
				


// 格式化日期
export const formatDate = (date, fmt) => {
  if (!date || !fmt) {
    return ''
  }

  let _that = new Date(date)

  if (_that.toString() === 'Invalid Date') {
    if (typeof date === "string") {
      // ios 不支持带 ‘-’ 的时间格式，需转换成 ‘/’
      date = date.replace(/-/g, '/')
      _that = new Date(date)
    }
  }

  if (_that.toString() === 'Invalid Date') {
    _that = new Date()
  }

  var o = {
    "M+": _that.getMonth() + 1,                 //月份
    "d+": _that.getDate(),                    //日
    "h+": _that.getHours(),                   //小时
    "m+": _that.getMinutes(),                 //分
    "s+": _that.getSeconds(),                 //秒
    "q+": Math.floor((_that.getMonth() + 3) / 3), //季度
    "S": _that.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (_that.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};     


export const currentEnv = () => {
  const ua = navigator.userAgent;

  if (ua.toLowerCase().match(/MicroMessenger/i) === 'micromessenger') {
    return 'WX'
  } else if (ua.match(/(iPhone|iPod|iPad);?/i)) {
    return 'IOS'
  } else if (ua.match(/android/i)) {
    return 'Android'
  }
  return null;
};

// 后端返回文件流
function downLoadFile(data, type) {
  const content = data
  const blob = new Blob([content])
  const fileName = type + '_' + formatDate(new Date(), 'yyyyMMddhhmmss') + '.xlsx'
  if ('download' in document.createElement('a')) {
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else { 
    navigator.msSaveBlob(blob, fileName)
  }
}


/**
 * 
 * @param { 判断是否为 '', ' ', undefined, null, {}, [] } data 
 */
export const isEmptyData = function (data) {

  if (data == null || data == undefined) {
    return true
  } else {
    let _type = typeof data
    if (_type == 'string') {
      return data.replace(/\s+/g, '').length == 0
    } else if (_type == 'object') {
      return Object.keys(data).length == 0
    }
  }

  return false
}


function debounce(func, wait, immediate) {

    var timeout, result;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
}

// 定时器
function myTimer(callback, times) {
    let timer = null;
    const now = Date.now
    let startTime = now()
    let endTime = startTime
    
    const loop = () => {
        timer = window.requestAnimationFrame(loop);
        endTime = now()
        if (endTime - startTime >= times) {
          startTime = endTime = now()
          callback(timer)
        }
    }

    timer = window.requestAnimationFrame(loop)
    return timer;
}

// AES 加密
function aesEncodeData(data, secretKey) {
  return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    // @ts-ignore
  },).toString();
}

// AES解密
const decroptyData = (aeskey, encroptyData) => {
  const key = CryptoJS.enc.Utf8.parse(aeskey);
  return CryptoJS.AES.decrypt(encroptyData, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8) || null;
}

// 深度克隆
function deepClone(obj) {

    //console.time('deepClone');

    if (obj && typeof obj !== 'object') {

        return obj;
    }

    let result = Object.create(obj.__proto__);

    for(let i in obj) {
        if (obj.hasOwnProperty(i)) {
            result[i] = obj[i];
        } else {
            result[i] = deepClone(obj[i])
        }
    }

    //console.timeEnd('deepClone');

    return result;
}

