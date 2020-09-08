/**
 * SDI Lab data viewer 
 *
 * @author Emmanuel Blondel GIS & web-information systems Expert
 *		   Contact: https://eblondel.github.io / emmanuel.blondel1@gmail.com 
 */

var app = app || {};
var appVersion = "1.0-beta"
 
//FAO dataset handlers (popup, dashboard)

var faoPopupHandler = function(shinyAppUrl, layer, feature, withGeom){
	console.log("Custom popup handler with Shiny app");
	console.log(layer);
	console.log(feature);
	var pid = layer.id;
	var layername = layer.getSource().getParams().LAYERS;
	var shinyapp_url = shinyAppUrl + "?";
	shinyapp_url += "pid=" + pid;
	shinyapp_url += "&layer=" + layername;
	shinyapp_url += "&csw_server=" + layer.csw_server;
	shinyapp_url += "&csw_version=" + layer.csw_version;
	shinyapp_url += "&wfs_server=" + layer.baseDataUrl.split('?')[0];
	shinyapp_url += "&wfs_version=1.0.0";
	shinyapp_url += "&wms_server=" + layer.getSource().getUrl().replace('ows?service=WMS','wms');
	shinyapp_url += "&wms_version=" + layer.getSource().getParams().VERSION;
	shinyapp_url += "&feature_geom=" + withGeom;
	shinyapp_url += "&strategy=" + layer.strategy;
	var params = null;
	switch(layer.strategy){
		case "ogc_filters": params = layer.getSource().getParams().CQL_FILTER; break;
		case "ogc_viewparams": params = layer.getSource().getParams().VIEWPARAMS.replace("sum", "none_withgeom"); break;
	}
	if(params) shinyapp_url += "&par=" + params;
	shinyapp_url += "&geom=" + feature.geometry_column;
	shinyapp_url += "&x=" + feature.popup_coordinates[0];
	shinyapp_url += "&y=" + feature.popup_coordinates[1];
	shinyapp_url += "&srs=EPSG:4326";

	if(layer.dsd){
		var dsd_small = layer.dsd.map(function(item){ 
			var newItem = item; 
			delete newItem.values; 
			if(newItem.definition) if(newItem.definition.length == 0) newItem.definition = null ; 
			return newItem
		});
		console.log(JSON.stringify(dsd_small));
		shinyapp_url += "&dsd="+ encodeURI(JSON.stringify(dsd_small));
	}

	var html = '<iframe src ="' + shinyapp_url + '" width="400" height="350" frameborder="0" marginheight="0"></iframe>';
	return html;
};

var faoDashboardHandler = function(shinyAppUrl, layer, withGeom){
	console.log("Custom dashboard handler with Shiny app");
	var pid = layer.id;
	var layername = layer.getSource().getParams().LAYERS;
	var shinyapp_url = shinyAppUrl + "?";
	shinyapp_url += "pid=" + pid;
	shinyapp_url += "&layer=" + layername;
	shinyapp_url += "&csw_server=" + layer.csw_server;
	shinyapp_url += "&csw_version=" + layer.csw_version;
	shinyapp_url += "&wfs_server=" + layer.baseDataUrl.split('?')[0];
	shinyapp_url += "&wfs_version=1.0.0";
	shinyapp_url += "&feature_geom=" + withGeom;
	shinyapp_url += "&strategy=" + layer.strategy;
	var params = null;
	switch(layer.strategy){
		case "ogc_filters": params = layer.getSource().getParams().CQL_FILTER; break;
		case "ogc_viewparams": params = layer.getSource().getParams().VIEWPARAMS.replace("sum", "none"); break;
	}
	if(params) shinyapp_url += "&par=" + params;
	shinyapp_url += "&srs=EPSG:4326";

	if(layer.dsd){
		var dsd_small = layer.dsd.map(function(item){ 
			var newItem = item; 
			delete newItem.values; 
			if(newItem.definition) if(newItem.definition.length == 0) newItem.definition = null ; 
			return newItem
		});
		console.log(JSON.stringify(dsd_small));
		shinyapp_url += "&dsd="+ encodeURI(JSON.stringify(dsd_small));
	}

	var html = '<iframe src ="' + shinyapp_url + '" width="100%" height="100%" frameborder="0" marginheight="0"></iframe>';
	return html;
};



$(document).ready(function(){
	app = new OpenFairViewer({
		OGC_CSW_BASEURL: "https://geonetwork-sdi-lab.d4science.org/geonetwork/srv/eng/csw"
	},{
		find : {
			filters: [],
			filterByWMS: true,
			datasetInfoHandler : function(metadata){
				var datasetInfoUrl = "https://geonetwork-sdi-lab.d4science.org/geonetwork/srv/eng/catalog.search#/metadata/" + metadata.fileIdentifier;
				$('#datasetInfo').empty().html('<iframe src="'+datasetInfoUrl+'" style="overflow: hidden; height: 100%; width: 100%; position: absolute;"> frameborder="0" marginheight="0"></iframe>');
				app.openInfoDialog();
			}
		},
		access: {
			time: 'slider',
			dashboard: {
				enabled: true,
				handler: function(layer){
					return OpenFairViewerUtils.shiny.dashboardHandler("https://abennici.shinyapps.io/Shiny_sdilab_dashboard", layer, false);
					/*if(layer.id.startsWith('fao_capture')) {	
						return OpenFairViewerUtils.shiny.dashboardHandler("https://abennici.shinyapps.io/Shiny_sdilab_dashboard", layer, false);
					}else{
						console.log("Default dashboard handler with OpenFairViewer");
						return;
					}*/
				}
			}
		},
		map : {
			proj4defs : [
				{epsgcode: 'EPSG:32706', proj4string: '+proj=utm +zone=6 +south +datum=WGS84 +units=m +no_defs'}
			],
			extent: [-180, -90, 180, 90],
			zoom: 3,
			styling : { dynamic : true },
			layergroups : [{name: "Base overlays"},{name: "My SDI Lab maps"}],
			mainlayergroup: 1,
			overlays: [
				{
					group: 0, id: "fsa", title: "FAO major areas & breakdown",
					wmsUrl: "http://www.fao.org/figis/geoserver/fifao/wms", layer: "fifao:FAO_AREAS_CWP",
					visible: false, showLegend: true, opacity: 0.9, tiled: true, cql_filter: undefined
				},
				{
					group: 0, id: "eez", title: "Exclusive Economic Zones",
					wmsUrl: "http://geo.vliz.be/geoserver/MarineRegions/wms", layer: "MarineRegions:eez_boundaries",
					visible: false, showLegend: true, opacity: 0.9, tiled: true, cql_filter: undefined
				}

			],
			tooltip: {
				enabled: true,
				handler: function(layer, feature){
					//return OpenFairViewerUtils.shiny.popupHandler("https://abennici.shinyapps.io/ShinysdilabPopup", layer, feature, false);
					if(layer.id.startsWith('geoflow-ais') || layer.id.startsWith('fad')) {//test on tuna atlas
						console.log("Default popup handler with OpenFairViewer");
						return this.DEFAULT_HANDLER(layer, feature);
					}else if(layer.id.startsWith('fao_capture')){
						//return OpenFairViewerUtils.shiny.popupHandler("https://abennici.shinyapps.io/ShinysdilabPopup", layer, feature, false);
						return faoPopupHandler("https://abennici.shinyapps.io/FaoCapturePop", layer, feature, false);
					}else{
						return OpenFairViewerUtils.shiny.popupHandler("https://abennici.shinyapps.io/ShinysdilabPopup", layer, feature, false);
					}
				}
			}
		}
	});
	app.init(true);
});
