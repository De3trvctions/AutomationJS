(function () {
	if (window.scriptRunning) {
		alert('脚本已运行，请勿重复运行！')
		return
	}
	window.scriptRunning = true

	const chatTextarea = document.querySelector('#chat-control-panel-vm textarea')
	const chatButton = document.querySelector('#chat-control-panel-vm button')
	const liveRoomRegex = /^live\.bilibili\.com\/\d+/

	if (liveRoomRegex.test(window.location.host + window.location.pathname) && chatTextarea && chatButton) {
		const intervalMinutes = 2 // Interval for looping messages
		const inputEvent = new InputEvent('input', {
			inputType: 'insertText',
			data: 'insertText',
		})

		const sendMessage = ({ msg = '', loop = true } = {}) => {
			if (!msg) {
				const messages = ['喵'] // Default random message
				msg = messages[Math.floor(Math.random() * messages.length)]
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
				//setTimeout(() => sendMessage({ loop: true, msg: new Date(Date.now()).toLocaleTimeString()}), intervalMinutes * 60 * 1200);
			}
		}

		// Initial activation message
		sendMessage({ loop: false, msg: '启用成功!' })

		// Staggered message sending
		setTimeout(() => sendMessage({ loop: true }), 1500)
		//setTimeout(() => sendMessage({ loop: true, msg: new Date(Date.now()).toLocaleTimeString()}), 3000);
	} else {
		alert(new Date(Date.now()).toLocaleTimeString() + ' 当前页面不是直播页面或未登录！')
		window.scriptRunning = false
	}
})();
