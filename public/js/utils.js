export function convertDate(dateString) {
	console.log(dateString);

	const months = [
		"ม.ค.",
		"ก.พ.",
		"มี.ค.",
		"เม.ย.",
		"พ.ค.",
		"มิ.ย.",
		"ก.ค.",
		"ส.ค.",
		"ก.ย.",
		"ต.ค.",
		"พ.ย.",
		"ธ.ค.",
	];
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = months[date.getMonth()];
	const year = date.getFullYear() + 543;
	return `${day} ${month} ${year}`;
}
