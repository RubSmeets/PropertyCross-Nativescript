/**
 * Property model constructor
 * 
 * @param {constructor arguments}
 */
function Property ( args ) {
	this.guid =  args.guid;
	this.title = args.title;
	this.price = args.price;
	this.property_type = args.property_type;
	this.img_url = args.img_url;
	this.thumb_url = args.thumb_url;
	this.summary = args.summary;
	this.bedroom_number = args.bedroom_number;
	this.bathroom_number = args.bathroom_number;
	this.latitude = args.latitude;
	this.longitude = args.longitude;
	this.isFavourite = false;
}

module.exports = Property;