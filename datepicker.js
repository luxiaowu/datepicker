(function() {
	var year, month, lastDate, datepicker = {},
		flag = false

	datepicker.getMonthData = function() {
		var ret = []

		// 本月第一天
		var firstDay = new Date(year, month - 1, 1)
		var firstDayWeek = firstDay.getDay()
		if (firstDayWeek == 0) firstDayWeek = 7

		//日历表头	
		year = firstDay.getFullYear()
		month = firstDay.getMonth() + 1

		// 本月第一天所在星期之前的空位数
		var preMonthDayCount = firstDayWeek - 1

		//本月最后一天
		var lastDay = new Date(year, month, 0)
		lastDate = lastDay.getDate()

		//上月最后一天
		var lastDayOfLastMonth = new Date(year, month - 1, 0)
		var lastDateOfLastMonth = lastDayOfLastMonth.getDate()

		for (var i = 0; i < 42; i++) {
			var date = i + 1 - preMonthDayCount
			var showDate = date
			var thisMonth = month
			if (date <= 0) {
				thisMonth = month - 1
				showDate = lastDateOfLastMonth + date
			} else if (date > lastDate) {
				thisMonth = month + 1
				showDate = showDate - lastDate
			}

			if (thisMonth == 0) thisMonth = 12
			if (thisMonth == 13) thisMonth == 1

			if (i == 35 && date > lastDate) {
				break
			}

			ret.push({
				month: thisMonth,
				date: date,
				showDate: showDate
			})
		}
		return {
			year: year,
			month: month,
			days: ret
		}
	}


	datepicker.buildUi = function() {
		var data = datepicker.getMonthData()
		html = '<div class="ui-datepicker-header">' +
			'<a href="#" class="ui-datepicker-btn ui-datepicker-btn-prev">&lt;</a>' +
			'<span>' + data.year + '-' + data.month + '</span>' +
			'<a href="#" class="ui-datepicker-btn ui-datepicker-btn-next">&gt;</a>' +
			'</div>' +
			'<div class="ui-datepicker-body">' +
			'<table>' +
			'<tr>' +
			'<th>一</th>' +
			'<th>二</th>' +
			'<th>三</th>' +
			'<th>四</th>' +
			'<th>五</th>' +
			'<th>六</th>' +
			'<th>日</th>' +
			'</tr>'

		for (var i = 0; i < data.days.length; i++) {
			if (i % 7 == 0) html += '<tr>'
			if (data.days[i].date <= 0 || data.days[i].date > lastDate) {
				html += '<td style="color: #999" data-origin=' + data.days[i].date + '>' + data.days[i].showDate + '</td>'
			} else {
				html += '<td data-origin=' + data.days[i].date + '>' + data.days[i].showDate + '</td>'
			}
			if (i % 7 == 6) html += '</tr>'
		}
		html += '</table>' +
			'</div>'
		return html
	}

	datepicker.render = function(direction) {
		if (!year || !month) {
			var today = new Date()
			year = today.getFullYear()
			month = today.getMonth() + 1
		}

		if (direction == 'prev') month--;
		if (direction == 'next') month++;
		html = datepicker.buildUi()
		dom.innerHTML = html
		document.body.appendChild(dom)
	}

	datepicker.init = function(selector) {
		dom = document.createElement('div')
		dom.setAttribute('class', 'ui-datepicker-wrapper')
		datepicker.render()

		var input = document.querySelector(selector)
		input.addEventListener('click', function() {
			if (flag) {
				dom.style.display = 'none'
				flag = false
			} else {
				var left = input.offsetLeft,
					top = input.offsetTop,
					height = input.offsetHeight
				dom.style.top = top + height + 5 + 'px'
				dom.style.left = left + 'px'
				dom.style.display = 'block'
				flag = true
			}
		})
		dom.addEventListener('click', function(e) {
			var target = e.target

			if (target.classList.contains('ui-datepicker-btn-prev')) {
				datepicker.render('prev')
			}
			if (target.classList.contains('ui-datepicker-btn-next')) {
				datepicker.render('next')
			}
			if (target.tagName == 'TD') {
				var selected = new Date(year, month - 1, target.dataset.origin)
				input.value = datepicker.format(selected)
				dom.style.display = 'none'
				flag = false
			}
		})

	}


	datepicker.format = function(date) {
		var year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate()

		function addZero(s) {
			return s < 10 ? '0' + s : s
		}

		return year + '-' + month + '-' + day
	}

	window.datepicker = datepicker
})()