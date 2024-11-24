;(async function () {
	// 防止脚本重复运行，如果脚本已经运行则弹出提示
	if (window.scriptRunning) {
		alert('脚本已运行，请勿重复运行！')
		return
	}
	window.scriptRunning = true

	// 常量：选择项和选项值
	const options = ['猫猫养成', '修仙'] // 游戏选项
	const optionsValue = [1, 2] // 对应选项的值
	const intervalMinutes = 3 // 设置消息发送的间隔时间（分钟）

	// 创建遮罩层背景
	const overlay = createOverlay()
	document.body.appendChild(overlay) // 将遮罩层添加到页面中

	// 等待用户通过模态框选择并确认选项
	const selectedOptionValue = await createModal(overlay, options, optionsValue)

	// 将遮罩层移除
	document.body.removeChild(overlay)

	// 检查是否为直播页面
	if (isLivePage()) {
		// 如果是直播页面，开始发送聊天消息
		startLiveChatSending(selectedOptionValue, intervalMinutes)
	} else {
		// 如果当前页面不是直播页面，弹出警告并停止脚本
		alert('当前页面不是直播页面或未登录！')
		window.scriptRunning = false
	}

	// 创建遮罩层的函数
	function createOverlay() {
		const overlay = document.createElement('div') // 创建一个div元素作为遮罩层
		overlay.style.position = 'fixed' // 设置位置为固定定位
		overlay.style.top = '0' // 距离顶部为0
		overlay.style.left = '0' // 距离左侧为0
		overlay.style.width = '100%' // 占满全屏宽度
		overlay.style.height = '100%' // 占满全屏高度
		overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)' // 背景为半透明黑色
		overlay.style.zIndex = '9999' // 设置较高的层级，保证遮罩层在最上面
		overlay.style.display = 'flex' // 使用flex布局居中
		overlay.style.justifyContent = 'center' // 水平居中
		overlay.style.alignItems = 'center' // 垂直居中
		return overlay
	}

	// 创建模态框的函数，并返回用户选择的值（通过Promise）
	function createModal(overlay, options, optionsValue) {
		return new Promise((resolve) => {
			const modal = document.createElement('div') // 创建一个div元素作为模态框
			modal.style.backgroundColor = 'white' // 设置背景色为白色
			modal.style.padding = '20px' // 设置内边距为20px
			modal.style.borderRadius = '5px' // 设置圆角为5px
			modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)' // 添加阴影效果
			modal.style.textAlign = 'center' // 设置文本居中对齐

			const promptText = document.createElement('p') // 创建提示文字
			promptText.textContent = '游戏选择: ' // 设置提示文本内容
			promptText.style.color = 'blue' // 设置文本颜色为蓝色
			modal.appendChild(promptText) // 将提示文字添加到模态框

			const select = document.createElement('select') // 创建一个select元素
			for (let i = 0; i < options.length; i++) {
				const option = document.createElement('option') // 创建每个option元素
				option.value = optionsValue[i] // 设置每个选项的值
				option.textContent = options[i] // 设置每个选项的显示文本
				select.appendChild(option) // 将选项添加到select元素
			}
			modal.appendChild(select)

			const submitButton = document.createElement('button') // 创建一个button元素
			submitButton.textContent = '确认' // 设置按钮文本
			submitButton.style.marginTop = '10px' // 设置按钮顶部外边距为10px
			submitButton.style.padding = '10px' // 设置按钮内边距为10px
			submitButton.style.backgroundColor = '#4CAF50' // 设置按钮背景色为绿色
			submitButton.style.color = 'white' // 设置按钮文本颜色为白色
			submitButton.style.border = 'none' // 去掉按钮边框
			submitButton.style.borderRadius = '5px' // 设置按钮圆角为5px
			submitButton.style.cursor = 'pointer' // 鼠标悬停时显示为手型

			// 点击提交按钮后，解析用户选择的值并结束等待
			submitButton.addEventListener('click', function () {
				const selectedOptionValue = select.value
				resolve(selectedOptionValue) // 解析用户选择的值
			})

			modal.appendChild(submitButton)
			overlay.appendChild(modal)
		})
	}

	// 检查当前页面是否为直播页面的函数
	function isLivePage() {
		const liveRoomRegex = /live\.bilibili\.com\/\d+/ // 正则表达式，匹配直播页面
		return liveRoomRegex.test(window.location.host + window.location.pathname) // 如果匹配成功，返回true
	}

	// 处理直播聊天消息发送的函数
	function startLiveChatSending(selectedOptionValue, intervalMinutes) {
		const chatTextarea = document.querySelector('#chat-control-panel-vm textarea') // 获取聊天框文本区域
		const chatButton = document.querySelector('#chat-control-panel-vm button') // 获取发送按钮

		if (!chatTextarea || !chatButton) {
			alert('未能找到聊天框或发送按钮，请检查页面结构！')
			window.scriptRunning = false
			return
		}

		const inputEvent = new InputEvent('input', { bubbles: true })

		const sendMessage = ({ msg = '', loop = true } = {}) => {
			let message = ''
			if (!msg) {
				switch (parseInt(selectedOptionValue, 10)) {
					case 1:
						message = '喵' // 如果选择“猫猫养成”，发送“喵”
						break
					case 2:
						message = '修炼' // 如果选择“修仙”，发送“修炼”
						break
					default:
						message = '其他游戏' // 默认发送“其他游戏”
						break
				}
			} else {
				message = msg
			}
			chatTextarea.value = message // 设置聊天框的文本
			chatTextarea.dispatchEvent(inputEvent) // 触发输入事件
			chatButton.click() // 点击发送按钮

			// 显示间隔时间的单位（秒或分钟）
			let intervalDisplayTime = 0
			if (intervalMinutes > 1) {
				intervalDisplayTime = intervalMinutes + '分钟'
			} else {
				intervalDisplayTime = intervalMinutes * 60 + '秒'
			}

			// 输出发送成功信息
			if (!msg) {
				console.log('启动成功发送 ' + new Date(Date.now()).toLocaleTimeString()) // 启动时发送的消息
			} else {
				console.log('发送成功 ' + new Date(Date.now()).toLocaleTimeString() + ' 间隔时间为 ' + intervalDisplayTime) // 发送的消息和时间
			}

			// 循环发送消息
			if (loop) {
				setTimeout(() => sendMessage({ loop: true }), intervalMinutes * 60 * 1000) // 定时发送下一条消息
			}
		}

		// 初始消息发送
		sendMessage({ msg: '游戏模式启动!', loop: false })

		// 在短暂延迟后开始循环发送消息
		setTimeout(() => sendMessage({ loop: true }), 1500)
	}
})()
