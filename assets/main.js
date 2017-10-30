document.addEventListener('DOMContentLoaded', (e) => {

	const dobInput = document.getElementById('dob')
	const usage = document.getElementById('usage')
	const inputs = document.getElementById('inputs')
	const calender = document.getElementById('calender')
	const today = new Date()
	const maxWeeks = 4693

	if(inputs instanceof HTMLFormElement && dobInput instanceof HTMLInputElement && usage instanceof HTMLParagraphElement){

		let max = new Date()
				max.setFullYear(max.getFullYear() - 5)
		let min = new Date()
				min.setFullYear(min.getFullYear() - 90)

		dobInput.value = (max.getFullYear()) + '-' +
				(max.getMonth().toString().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' +
				(max.getDate().toString().length > 1 ? max.getDate() : '0' + max.getDate())
		dobInput.max = dobInput.value
		dobInput.min = (min.getFullYear()) + '-' +
				(min.getMonth().toString().length > 1 ? min.getMonth() : '0' + min.getMonth()) + '-' +
				(min.getDate().toString().length > 1 ? min.getDate() : '0' + min.getDate())

		dobInput.addEventListener('change', (e) => {
			let dob = new Date(Date.parse(dobInput.value))
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
			localStorage.setItem('dob', dobInput.value)
		})

		inputs.addEventListener('submit', (e) => {
			e.preventDefault()

			let dob = new Date(Date.parse(dobInput.value))
			let weeks = Math.round(Math.round((today - dob) / 8.64e7) / 7)

			while(calender.firstChild){
				calender.removeChild(calender.firstChild)
			}
			setupCalender(calender, weeks, maxWeeks)
			usage.innerHTML = '<p>You have used <strong>' +
					((weeks / maxWeeks) * 100).toFixed(3) + '%</strong> of your life</p>'
		})
	}

	if(calender && calender instanceof HTMLDivElement){
		const weeks = Math.round(Math.round((today - (new Date(Date.parse(localStorage.getItem('dob'))))) / 8.64e7) / 7)
		setupCalender(calender, weeks, maxWeeks)
		usage.innerHTML = '<p>You have used <strong>' +
			((weeks / maxWeeks) * 100).toFixed(3) + '%</strong> of your life</p>'
	}
	dobInput.value = localStorage.getItem('dob')
})

function setupCalender(calender, weeks = 0, maxWeeks){
	for(i = 0; i <= maxWeeks; ++i){
		let span = document.createElement('span')

		switch (true){
			// already spent weeks
			case weeks > i:
				span.classList.add('black')
				break

			// first 0-7 years
			case i < 365:
				span.classList.add('darkblue')
				break

			// 7-12 years
			case i < 626:
				span.classList.add('blue')
				break

			// more than 85 years
			case i > 4432:
				span.classList.add('red')
				break

			default:

		}
		calender.appendChild(span)
	}
}
