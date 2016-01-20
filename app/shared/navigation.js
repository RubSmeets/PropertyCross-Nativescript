var frameModule = require("ui/frame");
var platformModule = require("platform");
var isMain;

module.exports = {
	goMain: function () {
		isMain = true;
		frameModule.topmost().navigate({
			moduleName: "views/main-page/main-page",
			//animated: true
			animated: false
		});
	},
	goToResults: function ( results ) {
		isMain = false;
		frameModule.topmost().navigate({
			moduleName: "views/search-results/search-results",
			context: results,
			//animated: true
			animated: false
		});
	},
	goToResultDetails: function ( details ) {
		isMain = false;
		if(platformModule.device.os === "android"){
			frameModule.topmost().android.cachePagesOnNavigate = true;
		}
		frameModule.topmost().navigate({
			moduleName: "views/result-details/result-details",
			context: details,
			//animated: true
			animated: false
		});
	},
	goBack: function () {
		if (isMain === false) {
			frameModule.topmost().goBack();
		}
	}
};