import dayjs from './dayjs';

export const getGMT = () => {
	let date = new Date();
	const offset = date.getTimezoneOffset();
	const GMT = offset / 60 < 0 ? '+' + Math.abs(offset / 60) : (offset / 60) * -1;

	return 'GMT' + GMT;
};

export const getDateFormat = (date: string, timezone = true) => {
	if (date === '') date = new Date().toISOString();

	const dateFormat = dayjs.utc(date).local().format('YYYY-MM-DD');

	if (timezone) {
		return `${dateFormat} (${getGMT()})`;
	} else {
		return `${dateFormat}`;
	}
};

export const getDateTimeFormat = (date: string) => {
	if (date === '') date = new Date().toISOString();

	const dateFormat = dayjs.utc(date).local().format('YYYY-MM-DD HH:mm:ss');

	return `${dateFormat} (${getGMT()})`;
};

export const getTimeFormat = (date: string) => {
	if (date === '') date = new Date().toISOString();

	const dateFormat = dayjs.utc(date).local().format('HH:mm:ss');

	return `${dateFormat} (${getGMT()})`;
};
