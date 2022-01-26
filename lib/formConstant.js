export const paymentMethods = ["Bank Transfer", "Cash Payment", "Select Soon"];

export const itemCategories = [
	"Facemasks",
	"Disinfectant spray gun",
	"Clothes",
	"Socks",
	"Pants",
	"Bra",
	"Panty",
	"Shoes",
	"Shoe accessories",
	"Bags",
	"Luggage",
	"Cap",
	"Belt",
	"Scarf",
	"Glove",
	"Glasses",
	"Contact Lens",
	"Watch",
	"Jewelleries",
	"Skincare",
	"Cosmetics",
	"Hair care",
	"Fragrance",
	"Phone accessories",
	"Mobile phone",
	"Computer parts",
	"Car Parts",
	"Car care",
	"Organizers",
	"Daily items",
	"Stationaries",
	"Office supplies",
	"Electronics (Household)",
	"Decoration",
	"Bed sheet",
	"Household items",
	"Toiletries",
	"Camera accessories",
	"Toys or models",
	"Baby items",
	"Baby chair",
	"Furniture",
	"Cleaning items",
	"Music instruments",
	"Fitness gear",
	"Renovation material",
	"Electronic parts",
	"Garden supplies",
	"Machine parts",
	"Camping stuff",
	"Snack",
	"Dried Food",
	"Tea",
	"Coffee",
	"Supplements",
	"Can Drinks",
	"Bicycle",
	"Pet supply",
	"Fishing supply",
	"Hair trimming supply",
	"Games",
	"Kitchenware",
	"Books",
	"Sports Equipment",
	"Medical Use",
].sort();
export const currencies = ["MYR", "BND", "SGD", "USD", "CNY", "JPY"];
export const couriers = [
	"ABX Express",
	"Airpak Express",
	"ARAMEX",
	"Asiaxpress",
	"City-Link Express",
	"DeliveryLah",
	"DHL Express",
	"DPEX",
	"FEDEX",
	"GD Express",
	"UPS",
	"Ninja Van",
	"Pos Laju",
	"Singpost",
	"J&T",
	"Others",
];
export const deliveryMethods = ["Self-Pickup", "Select Soon"];

export const MOHPharmacies = ["Skincare", "Cosmetics", "Hair care", "Fragrance", "Essential oils", "Medical Use"];
export const MOHFoodSafeties = ["Snack", "Dried Food", "Tea", "Coffee", "Supplements", "Can Drinks"];
export const AITI = ["Electronics (Household)", "Camera accessories", "Computer parts", "Watch", "Phone accessories", "Mobile phone"];
export const internalSecurities = ["Books"];

export const permitCategories = [
	"MOH Pharmacy",
	"MOH Food Safety and Quality Unit",
	"Pusat Dakhwah Islamiah (Religious books)",
	"Internal Security (All Books)",
];

export function getWeightPrice(weight) {
	if (!weight) return null;
	const numWeight = Number(weight);
	/* 
	0.1kg to 1.99kg - $6
	2kg to 3.99kg - $9
	4kg to 5.99kg - $12
	6kg to 7.99kg - $15
	8kg to 9.99kg - $18
	10kg to 11.99kg - $21
	12kg to 13.99kg - $24
	14kg to 15.99kg - $27
	16kg to 17.99kg - $30
	18kg to 19.99kg - $33
	20kg to 21.99kg - $36
	22kg to 23.99kg - $39
	24kg to 25.99kg - $42
	26kg and above - $3 per kilo 
	*/
	if (numWeight > 0 && numWeight < 2) return 6;
	if (numWeight < 4) return 9;
	if (numWeight < 6) return 12;
	if (numWeight < 8) return 15;
	if (numWeight < 10) return 18;
	if (numWeight < 12) return 21;
	if (numWeight < 14) return 24;
	if (numWeight < 16) return 27;
	if (numWeight < 18) return 30;
	if (numWeight < 20) return 33;
	if (numWeight < 22) return 36;
	if (numWeight < 24) return 39;
	if (numWeight < 26) return 42;
	if (numWeight >= 26) return 42 + 3 * Math.ceil(numWeight - 26);
}
