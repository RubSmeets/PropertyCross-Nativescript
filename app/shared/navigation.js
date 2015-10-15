var frameModule = require("ui/frame");
var applicationModule = require("application");
var isMain;

module.exports = {
	goMain: function () {
		isMain = true;
		frameModule.topmost().navigate({
			moduleName: "views/main-page/main-page",
			animated: true
		});
	},
	goToResults: function ( results ) {
		isMain = false;
		frameModule.topmost().navigate({
			moduleName: "views/search-results/search-results",
			context: results,
			animated: true
		});
	},
	goToResultDetails: function ( details ) {
		isMain = false;
		frameModule.topmost().navigate({
			moduleName: "views/result-details/result-details",
			context: details,
			animated: true
		});
	},
	goBack: function () {
		if (isMain === false) {
			frameModule.topmost().goBack();
		}
	}
};