document.addEventListener('DOMContentLoaded', (e) => {

	const dobInput = document.getElementById('dob')
	const usage = document.getElementById('usage')
	const inputs = document.getElementById('inputs')
	const today = new Date()
	const maxWeeks = 4693

	if(inputs instanceof HTMLFormElement && dobInput instanceof HTMLInputElement && usage instanceof HTMLParagraphElement){

		var max = new Date()
				max.setFullYear(max.getFullYear() - 5)
		var min = new Date()
				min.setFullYear(min.getFullYear() - 90)

		dobInput.value = (max.getFullYear()) + '-' +
				(max.getMonth().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' +
				(max.getDate().length > 1 ? max.getMonth() : '0' + max.getMonth())
		dobInput.max = (max.getFullYear()) + '-' +
				(max.getMonth().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' +
				(max.getDate().length > 1 ? max.getDate() : '0' + max.getDate())
		dobInput.min = (min.getFullYear()) + '-' +
				(min.getMonth().length > 0 ? min.getMonth() : '0' + min.getMonth()) + '-' +
				(min.getDate().length > 1 ? min.getDate() : '0' + min.getDate())

		dobInput.addEventListener('change', (e) => {
			let dob = new Date(Date.parse(dobInput.value))
			if(isNaN(dob.getDate())){
				dobInput.setCustomValidity('Please input the date of birth in YYYY-MM-DD format')
			} else {
				dobInput.setCustomValidity('')
			}
		})

		inputs.addEventListener('submit', (e) => {
			e.preventDefault()

			let dob = new Date(Date.parse(dobInput.value))
			let maxLife = new Date(Date.parse(dobInput.value))
			maxLife.setFullYear(maxLife.getFullYear() + 90)
			let weeks = Math.round(Math.round((today - dob) / 8.64e7) / 7);

			while(calender.firstChild){
				calender.removeChild(calender.firstChild)
			}
			for(i = 0; i <= maxWeeks; ++i) {
				let span = document.createElement('span')

				switch (true) {
						// already spent weeks
					case weeks > i:
						span.classList.add('black')
						break

						// first 7 years
					case i < 365:
						span.classList.add('black')
						break

						// 12 years
					case i < 626:
						span.classList.add('blue')
						break

						// more than 85 years
					case i > 4432 :
						span.classList.add('red')
						break

					default:
				}
				calender.appendChild(span)
			}

			usage.innerHTML = '<p>You have used <strong>' +
					((weeks / maxWeeks) * 100).toFixed(3) + '%</strong> of your life</p>'
		})
	}

	const calender = document.getElementById('calender')
	if(calender && calender instanceof HTMLDivElement){
		for(i = 0; i <= maxWeeks; ++i){
			let span = document.createElement('span')

			switch (true){
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
})
