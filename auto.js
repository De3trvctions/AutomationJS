;(function () {
	if (window.scriptRunning) {
		alert('脚本已运行，请勿重复运行！')
		return
	}
	window.scriptRunning = true

	// 常量：选择项和选项值
	const options = ['猫猫养成', '修仙']
	const optionsValue = [1, 2]
	const intervalMinutes = 3 // 设置消息发送的间隔时间（分钟）

	// 创建遮罩层背景
	const overlay = createOverlay()

	// 创建模态框容器
	const { select, modal } = createModal(options, optionsValue)

	// 将模态框添加到遮罩层，再将遮罩层添加到文档
	overlay.appendChild(modal)
	document.body.appendChild(overlay)

	// 处理直播聊天消息发送逻辑
	if (isLivePage()) {
		startLiveChatSending(select, intervalMinutes) // 直接传递 select 元素
	} else {
		alert('当前页面不是直播页面或未登录！')
		window.scriptRunning = false
	}

	// 逻辑内容
	// 创建遮罩层的函数
	function createOverlay() {
		const overlay = document.createElement('div')
		overlay.style.position = 'fixed'
		overlay.style.top = '0'
		overlay.style.left = '0'
		overlay.style.width = '100%'
		overlay.style.height = '100%'
		overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
		overlay.style.zIndex = '9999'
		overlay.style.display = 'flex'
		overlay.style.justifyContent = 'center'
		overlay.style.alignItems = 'center'
		return overlay
	}

	// 创建模态框和下拉框的函数
	function createModal(options, optionsValue) {
		const modal = document.createElement('div')
		modal.style.backgroundColor = 'white'
		modal.style.padding = '20px'
		modal.style.borderRadius = '5px'
		modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
		modal.style.textAlign = 'center'

		const promptText = document.createElement('p')
		promptText.textContent = '游戏选择: '
		promptText.style.color = 'Blue' // 设置文字颜色
		modal.appendChild(promptText)

		const select = createSelect(options, optionsValue)
		modal.appendChild(select)

		const submitButton = createSubmitButton(select)
		modal.appendChild(submitButton)

		return { select, modal } // 返回 select 和 modal
	}

	// 创建下拉框（select 元素）的函数
	function createSelect(options, optionsValue) {
		const select = document.createElement('select')
		for (let i = 0; i < options.length; i++) {
			const option = document.createElement('option')
			option.value = optionsValue[i] // 设置选项的值
			option.textContent = options[i] // 设置选项的文本
			option.style.color = 'Blue' // 设置选项文本颜色
			select.appendChild(option)
		}
		return select
	}

	// 创建提交按钮的函数
	function createSubmitButton(select) {
		const submitButton = document.createElement('button')
		submitButton.textContent = '确认'
		submitButton.style.marginTop = '10px'
		submitButton.style.padding = '10px'
		submitButton.style.backgroundColor = '#4CAF50' // 设置按钮背景色
		submitButton.style.color = 'white' // 设置按钮文本颜色
		submitButton.style.border = 'none'
		submitButton.style.borderRadius = '5px'
		submitButton.style.cursor = 'pointer'

		submitButton.addEventListener('click', function () {
			const selectedOptionValue = select.value
			const selectedOptionText = select.options[select.selectedIndex].text
			console.log('你选择了: ' + selectedOptionText + ' 值为 ' + selectedOptionValue)
			document.body.removeChild(overlay) // 删除模态框和遮罩层
		})

		return submitButton
	}

	// 检查当前页面是否为直播页面的函数
	function isLivePage() {
		const liveRoomRegex = /^live\.bilibili\.com\/\d+/
		return liveRoomRegex.test(window.location.host + window.location.pathname)
	}

	// 处理直播聊天消息发送的函数
	function startLiveChatSending(select, intervalMinutes) {
		const chatTextarea = document.querySelector('#chat-control-panel-vm textarea')
		const chatButton = document.querySelector('#chat-control-panel-vm button')
		const inputEvent = new InputEvent('input', { inputType: 'insertText', data: 'insertText' })

		const sendMessage = ({ msg = '', loop = true } = {}) => {
			// 按照不同的游戏， 发送不同的文本
			if (!msg) {
				switch (parseInt(select.value, 10)) {
					case 1:
						msg = '喵'
						break
					case 2:
						msg = '修炼'
						break
					default:
						msg = '其他游戏'
						break
				}
			}
			chatTextarea.value = msg
			chatTextarea.dispatchEvent(inputEvent)
			chatButton.click()

			if (!msg) {
				console.log('启动成功发送 ' + new Date(Date.now()).toLocaleTimeString())
			} else {
				console.log('发送成功 ' + new Date(Date.now()).toLocaleTimeString())
			}

			if (loop) {
				setTimeout(() => sendMessage({ loop: true }), intervalMinutes * 60 * 1000)
			}
		}

		// 初始消息发送
		sendMessage({ loop: false, msg: '游戏模式启动!' })

		// 在短暂延迟后开始循环发送消息
		setTimeout(() => sendMessage({ loop: true }), 1500)
	}
})()
