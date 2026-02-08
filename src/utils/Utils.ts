export const formatCurrency = (value: number): string => {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const getItemCountText = (count: number): string => {
	return count === 1 ? "1 item" : `${count} itens`;
};

export const scrollIntoView = (id: string): void => {
	const element = document.getElementById(id);
	if (element) element.scrollIntoView({ behavior: "smooth" });
};

export const getFormattedDate = (locale: string = "pt-BR") => {
	return new Date().toLocaleString(locale);
};

export const isDateExpired = (date: number | string): boolean => {
	const today = new Date();
	const messageDate = new Date(date);
	// 24 hours in milliseconds
	const oneDay = 24 * 60 * 60 * 1000;
	return messageDate.getTime() < today.getTime() - oneDay;
};
