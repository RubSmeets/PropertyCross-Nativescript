var observableModule = require("data/observable");

var json = {
		guid: "",
		title: "",
		price: "",
		img_url: "",
		summary: "",
		specification: "",
		isFavourite: false
};
// create observable model that is sourced from a JSON object
var _viewModel = new observableModule.Observable(json);

function initViewModel(Property) {
	var formattedSpecification = "";

	if(Property.bedroom_number) { formattedSpecification = Property.bedroom_number + " bed"; }
	if(Property.bathroom_number) { formattedSpecification += ", " + Property.bathroom_number + " bathroom"; }
	if(Property.property_type) { formattedSpecification += " " + Property.property_type; }

	_viewModel.set("guid", Property.guid);
	_viewModel.set("title", Property.title);
	_viewModel.set("price", Property.price);
	_viewModel.set("img_url", Property.img_url);
	_viewModel.set("summary", Property.summary);
	_viewModel.set("specification", formattedSpecification);
	_viewModel.set("isFavourite", Property.isFavourite);
}

exports.initViewModel = initViewModel;
exports.model = _viewModel;
