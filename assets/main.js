document.addEventListener('DOMContentLoaded', (e) => {

	const dobInput = document.getElementById('dob')
	const usage = document.getElementById('usage')
	const inputs = document.getElementById('inputs')

	if(inputs instanceof HTMLFormElement && dobInput instanceof HTMLInputElement && usage instanceof HTMLParagraphElement){

		let max = new Date()
				max.setYear(max.getYear() - 5)
		let min = new Date()
		let today = new Date()

		dobInput.value = (max.getYear() + 1900 * 2) + '-' +
				(max.getMonth().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' + max.getDate()
		dobInput.max = (max.getYear() + 1900 * 2) + '-' +
				(max.getMonth().length > 1 ? max.getMonth() : '0' + max.getMonth()) + '-' + max.getDate()
		dobInput.min = (min.getYear() + 1900) - 90 + '-' +
				(min.getMonth().length > 0 ? min.getMonth() : '0' + min.getMonth()) + '-' + max.getDate()

		inputs.addEventListener('submit', (e) => {
			e.preventDefault()

			let dob = new Date(dobInput.valueAsDate)
			let maxLife = new Date(dobInput.valueAsDate)
			maxLife.setYear(maxLife.getYear() + 90 + 1900)
			let weeks = Math.round(Math.round((today - dob) / 8.64e7) / 7);

			while(calender.firstChild){
				calender.removeChild(calender.firstChild)
			}
			for(i = 0; i <= 4693; ++i) {
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
					((((today.getYear() + 1900) - (dob.getYear() + 1900)) / 90) * 100).toFixed(3) + '%</strong> of your life</p>'
		})
	}

	const calender = document.getElementById('calender')
	if(calender && calender instanceof HTMLDivElement){
		for(i = 0; i <= 4693; ++i){
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
