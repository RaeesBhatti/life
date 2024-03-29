'use strict';
document.addEventListener('DOMContentLoaded', (e) => {

	const dobInput = document.getElementById('dob'),
				usage = document.getElementById('usage'),
				inputs = document.getElementById('inputs'),
				calender = document.getElementById('calender'),
				today = new Date(),
				maxWeeks = 4693

	let savedDOB = null
	try {
		savedDOB = JSON.parse(self.localStorage.getItem('dob'))
	} catch (_) {}

	if(inputs instanceof HTMLFormElement && dobInput instanceof HTMLInputElement && usage instanceof HTMLParagraphElement){

		const max = new Date(),
					min = new Date()

		max.setFullYear(max.getFullYear() - 5)
		min.setFullYear(min.getFullYear() - 90)

		dobInput.value = (max.getFullYear()) + '-' +
				(max.getMonth().toString().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' +
				(max.getDate().toString().length > 1 ? max.getDate() : '0' + max.getDate())
		dobInput.max = dobInput.value
		dobInput.min = (min.getFullYear()) + '-' +
				(min.getMonth().toString().length > 1 ? min.getMonth() : '0' + min.getMonth()) + '-' +
				(min.getDate().toString().length > 1 ? min.getDate() : '0' + min.getDate())

		dobInput.addEventListener('change', (e) => {
			const dob = new Date(Date.parse(dobInput.value))
			if(isNaN(dob.getDate())){
				dobInput.setCustomValidity('Please input the date of birth in YYYY-MM-DD format')
			} else if(dob > max) {
				dobInput.setCustomValidity('Date of birth should be less than ' +
						(max.getFullYear()) + '-' + (max.getMonth().toString().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' +
						(max.getDate().toString().length > 1 ? max.getDate() : '0' + max.getDate())
				)
			} else if(dob < min){
				dobInput.setCustomValidity('Date of birth should be greater than ' +
						(min.getFullYear()) + '-' + (min.getMonth().toString().length > 1 ? min.getMonth() : '0' + min.getMonth()) + '-' +
						(min.getDate().toString().length > 1 ? min.getDate() : '0' + min.getDate())
				)
			} else {
				dobInput.setCustomValidity('')
			}
			self.localStorage.setItem('dob', JSON.stringify(dobInput.value))
		})

		inputs.addEventListener('submit', (e) => {
			e.preventDefault()

			const dob = new Date(Date.parse(dobInput.value)),
						weeks = Math.round(Math.round((today - dob) / 8.64e7) / 7)

			while(calender.firstChild){
				calender.removeChild(calender.firstChild)
			}
			setupCalender(calender, weeks, maxWeeks)
			usage.innerHTML = '<p>You have used <strong>' +
					((weeks / maxWeeks) * 100).toFixed(3) + '%</strong> of your life</p>'
		})
	}

	dobInput.value = savedDOB
	if(calender instanceof HTMLDivElement){
		let weeks = 0
		if (savedDOB) {
			weeks =  Math.round(Math.round((today - (new Date(Date.parse(savedDOB)))) / 8.64e7) / 7)
			usage.innerHTML = '<p>You have used <strong>' +
				((weeks / maxWeeks) * 100).toFixed(3) + '%</strong> of your life</p>'
		}
		setupCalender(calender, weeks, maxWeeks)
	}
})

function setupCalender(calender, weeks = 0, maxWeeks){
	const totalWeeksIn90Years = 90 * 52;
	const remainingWeeksAt70 = totalWeeksIn90Years - (70 * 52)
	for(let i = 0; i <= maxWeeks; ++i){
		const span = document.createElement('span')

		switch (true){
			// already spent weeks
			case weeks > i:
				span.classList.add('black')
				break

			// first 0-7 years
			case i < (7 * 52):
				span.classList.add('darkblue')
				break

			// 7-12 years
			case i < (12 * 52):
				span.classList.add('blue')
				break

			// more than 70 years
			case i > (70 * 52):
				span.classList.add('red')
				// Fade-in the color, starting with 0% opacity at 70 years and ending with 100% at 90 years
				const remainingWeeksBetween70And90 = totalWeeksIn90Years - i;
				span.style.backgroundColor = 'rgba(255, 0, 0, ' + (1 - (remainingWeeksBetween70And90 / remainingWeeksAt70)) + ')'
				break

			default:

		}
		calender.appendChild(span)
	}
}

(self => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./sw.js', {scope: './', credentials: 'include'}).catch(err => {
			console.log('Service Worker Failed to Register', err)
		})
	}

})(self)
