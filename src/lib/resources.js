const providerKeys = {
		azurerm: {
			ipResource: "azurerm_network_interface",
			ipAttributeContainer: "ip_configuration",
			ipAttribute: "private_ip_address"
		},
		google: {
			ipResource: "google_compute_instance",
			ipAttributeContainer: "network_interface",
			ipAttribute: "network_ip"
		}
}
//Export variables/functions
module.exports = {providerKeys}