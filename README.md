# OpenFairViewer
OpenFairViewer - a FAIR, ISO and OGC (meta)data compliant GIS data viewer for browsing, accessing and sharing geo-referenced statistics
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.2249305.svg)](https://doi.org/10.5281/zenodo.2249305)

## Sponsors

Many thanks to the following organizations that have provided fundings for strenghtening ``OpenFairViewer``:

<div style="float:left;">
  <a href="https://en.ird.fr/"><img src="http://www.umr-marbec.fr/images/logo-ird-en.png" height=200 width=200/>
  <a href="https://www.inrae.fr"><img height=200 width=200 src="https://www.inrae.fr/themes/custom/inrae_socle/logo.svg"></a>
</div>












## Introduction 

The OpenFairViewer is an HTML5/JS map viewer application  developed to adopt the FAIR Data principles, while complying with ISO/OGC standards for geospatial data. It enables data findn, access, query and sharing of geospatial data, in interoperable way.

The development of OpenFairViewer is done in synergy with the [geoflow](https://github.com/eblondel/geoflow) R package which provides a workflow tool to facilitate the management / publication of geospatial data and metadata using OGC services. 

## Installation

To deploy and configure an OpenFairViewer, you should install [node.js](https://nodejs.org/en/download/) that will provide the ``npm`` command required to build your OpenFairViewer project. Once node.js installed, install the following packages:

```
npm instal parcel-bundler --save-dev
npm install parcel-plugin-static-files-copy  --save-dev
```

Next, create a project with ``npm init``, or create the below ``package.json`` as follows:

```json
{
  "name": "openfairviewer_test",
  "version": "1.0.0",
  "description": "My mapviewer powered by OpenFairViewer",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "parcel index.html",
    "build": "parcel build --public-url ./ index.html"
  },
  "staticFiles": {
    "staticPath": [
      {
        "staticPath": "node_modules/openfairviewer/src/templates",
        "staticOutDir": "templates"
      },
      {
        "staticPath": "node_modules/openfairviewer/src/img",
        "staticOutDir": "img"
      }
    ]
  },
  "author": "Your name",
  "license": "licence",
  "devDependencies": {
    "cssnano": "^4.1.10",
    "parcel-bundler": "^1.12.4",
    "parcel-plugin-static-files-copy": "^2.5.0"
  },
  "dependencies": {

  }
}

```

Next, install OpenFairViewer using the following commands:

* for the latest (Github `master` branch)

```
npm install eblondel/openfairviewer
```

* for the latest release

```
npm install eblondel/openfairviewer#2.4.0
```

After the installation, OpenFairViewer will be installed as dependency.

## Configuration

The initialization of the viewer is done with a Javascript only, with a single ``main.js`` script. A simple ``index.html`` file is required referencing this javascript file, then all the HTML markup required is generated by OpenFairViewer. As OpenFairViewer is _metadata-driven_, the minimal configuration is done by specifying the OGC Catalogue Service for the Web (CSW) endpoint URL.

```javascript
import $ from 'jquery';
window.$ = $;

import OpenFairViewer from 'openfairviewer/src/OpenFairViewer.js';
 
window.OFV = null;
$(document).ready(function(){
	new OpenFairViewer({
		id: 'OFV',
		profile : '<p>Welcome to my <b>data portal!</b> powered by OpenFairViewer</p>',
		OGC_CSW_BASEURL: "https://localhost:8080/geonetwork/srv/eng/csw"
	}).init(true); //init is required to initialize the instance
	console.log(OFV);
});

```

The ``id`` is required to create an ``OpenFairViewer`` that will be queryable for any further interaction and customization with the application.

The ``profile`` is a summary markup description of your application that will appear when opening the application in a "About" panel dialog.



To run the application, you can run ``npm start``, it will compile deploy your viewer to http://localhost:1234

To create a build for deployment on web servers, run ``npm run build``. The compiled web resources will be created in the ``dist`` directory, and can be copied to your web-server.


## Options

The options of OpenFairViewer are grouped according to the main component of application, ie **labels**, **find**, **access**, **map**

An OpenFairViewer instance can be then customized handling one more options like this:

```javascript
import $ from 'jquery';
window.$ = $;

import OpenFairViewer from 'openfairviewer/src/OpenFairViewer.js';
 
window.OFV = null;
$(document).ready(function(){
	new OpenFairViewer({
		//an identifier used for the OpenFairViewer instance
		id: 'OFV', 
		//a profile (plain html markup or text) used as About window opened on viewer start
		profile : '<p>Welcome to my <b>data portal!</b> powered by OpenFairViewer</p>',
		//an OGC CSW endpoint URL
		OGC_CSW_BASEURL: "https://localhost:8080/geonetwork/srv/eng/csw"
	},{
		labels: { <label options here> },
		find: { <browse options here> },
		access: { <browse options here> },
		map: { <map options here> }
	}).init(true);
	console.log(OFV);
});

```

The next sections highlight the current options available in OpenFairViewer

### _labels_ options

Application vocabulary used for customization of labels or forthcoming support of i18n. If ignored, default (English) labels will be applied. At this early stage of development, the list of labels managed by OpenFairViewer is still not externalized and can be found at https://github.com/eblondel/OpenFairViewer/blob/master/src/OpenFairViewer.js#L219

### _find_ options

Name | Type | Description| Default value
-----|------|------------|----------------
filter | ``Object``| An OGC filter to restrain the selection of datasets through the CSW. See example at https://github.com/eblondel/OpenFairViewer/blob/master/main.js  | _empty_
filterByWMS| ``Boolean``| Indicates if only datasets with OGC WMS map resources should be listed | false
datasetInfoHandler| ``function`` | A function taking as parameter a metadata object. By default it will open a new tab with the XML version of the metadata through an OGC CSW GetRecordById request. | Function returning CSW GetRecordByID XML in new tab
maxitems| ``Integer``| Maximum number of datasets to retrieve from the catalogue| null


### _access_ options

Name | Type | Description| Default value
-----|------|------------|----------------
columns | ``Integer``| Number of columns to use for displaying the dynamic query form. **_Experimental_** (to use cautiously) | 2 
time | ``String``| Name of the widget to use for time selection. Default is 'datePicker'. Possible alternative value 'slider' for time slider. **_Experimental_** (to use cautiously) | 'datePicker'
dashboard | `Object` | An object to declare dashboards; See below sub-options. `handler` A function taking a single ``layer`` parameter that can be used to connect a dashboard The function should return an html markup (eg. IFrame embedding the link to a R Shiny app). The dashboard handler function can handle various content depending on the target layer, but |
 | ``boolean`` | ``enabled``: Activate the capacity to plug dashboards. |true
 | ``function`` | Sub options for dasbhoard. ``handler``: A function with arg ``layer`` to return dashboards as plain html. To use R shiny app dashboards, you can import the ``OpenFairShiny.js`` that provides utilities to load Shiny apps as iFrames. This handler allows to condition the plug of different dashboard handlers depending on the layers, ie adding conditions based on the ``layer.id`` (persistent identifier of each dataset).. By default, no dashboard will be associated to the layer. See below example. |null

Example of dashboard handler:

```javascript
function(layer){
	if(layer.id.startsWith('my_layer')){
		//for my_layer we want to have a R shiny dashboard access
		return OpenFairShiny.dashboardHandler("https://myshinyproxy.org/app_direct/myShinyApp/", layer, false);
	}else{
		//for other layers, no dashboard
		return;
	}
}
```

### _map_ options

Name | Type | Description| Default value
-----|------|------------|----------------
**mode** | `String` | Map mode either `2D` or `3D` to initialize the map viewer. Note the `3D` mode requires to add CesiumJS library directly in the index.html of the application (see example at https://github.com/eblondel/OpenFairViewer/blob/master/index.html). If available, OpenFairViewer will display a button (at bottom right of the screen) to switch  between `2D`/`3D` modes. | `2D` 
**control_options** | `Object` | Object that includes options for the map controls. Each sub-option correspond to one of the map controls enabled in the application. | 
 | `Object` | `loadingpanel`: Options of the LoadingPanel control (more details at https://github.com/eblondel/ol-loadingpanel). | Loading panel configured with 'progressbar' widget 
**attribution** | ``String`` | A string giving html markup for the map attribution. | null 
**extent** | ``Array``| Bounding box to use to bind the map geographic extent | [-180, -90, 180, 90]
**zoom** | ``Integer``| Zoom level to use for the map | 3
**projection**|``String``|Default map projection|'EPSG:4326'
**proj4defs**|``Array``|An array of Proj4 projection definitions in the form ``{epsgcode: "here the epsgcode", proj4string, : "here the proj4 string definition"}``|empty
**layergroups**|``Array``| Array of layer groups. Each layer group should be an object in the form  ``{name: "<layergroup name>", fold: 'open'}`` where fold is open/close depending if the layer group should be open or close at start| [{name: "Base overlays", fold: 'close'},{name: "Statistical maps", fold: 'open'}]
**mainlayergroup**|``Integer``|Index within ``layergroups`` to define the main layer group (where layers loaded from the ``browse`` part will be added) | 1
**baselayers** |``Array``| An array of baselayers defined with OpenLayers 6 layer objects| List of 5 baselayers including: EMoDnet Bathymetry world base layer, UN Clear Map (Simple, Dark), OpenStreetMaps, World Imagery 
**overlays**|``Array``| Array of base overlays to add to the map. Each overlay is defined as simplified object ``{group: <mainOverlayGroup>, id: <id>,title: <title>, wmsUrl: <wmsUrl>, wmsVersion: <wmsVersion>, layer: <layer>, hidden: <true/false>, visible: <true/false>, showLegend: <true/false>, opacity: <0 to 1>, tiled: <true/false>, cql_filter: <cql_filter>, style: <style>}``. | _empty_
**layer_options**|`Object`| An object handling layer options. See below | 
|`boolean`| `tiled`: if tiled WMS layers should be used | true 
|`Number`| `opacity`: default layer opacity to use | 0.9 
**point_vectorizing**|`boolean`| Option to indicate whether point datasets should be set-up as vector layers (based on WFS). | false 
**point_clustering**|`boolean`| Option to indicate whether point datasets should be set-up as clustered vector layers (based on WFS). Requires `point_vectorizing` to be `true`. | false 
**point_clustering_options**|`Object`| Object including the point clustering options inherited from the `SelectCluster` interaction plugin (See https://viglino.github.io/ol-ext/doc/doc-pages/ol.interaction.SelectCluster.html for details). Extra options here include the below: |  
|`function`| `style`: Function with args (feature, resolution) used to display a feature either clustered or not. | A default function that will show a simple circle for single feature and a larger circle with the number of features displayed for a cluster. 
|`function`| `selectClusterFeatureStyle`: Function with args (feature, resolution) used to display the cluster 'exploded' features | Default orangle small circle for 'exploded' features attached to the cluster feature by a dashed gray line 
|`function`| `selectClusterStyle`: Function with args (feature, resolution) used to display the selected feature either clustered or not. | same as the `style` default function 
**thematicmapping_options**|``Object``| Sub options for thematic mapping in geo-referenced statistics if thematic mapping is enabled for a layer. See belows |
|``Array``| ``breaks`` for labeling class interval breaks |[""," to ",""]
|`boolean`| `thresholding`: enable threshold of statistical values. This will be propagated to filters applied to statistical variables (both to WMS visualization and WFS for data) |true
|`String`| `threshold`: a simple threshold definition using mathematical operators (=,>=,<=,>,<). By default only positive values are kept. ***Experimental*** (likely to evolve) |"> 0"
**popup**|``Object``| Sub options for map layer tooltip/popup. , |
|`boolean`| ``enabled``: true/false |true
|`function`| ``handler``: A function with args ``layer``/ ``feature`` to return popup content as plain html. Default will list attributes of features. The access is operated through WMS GetFeatureInfo protocol for WMS layers, and WFS GetFeature for vector WFS layers. This requires that the data protocol uses the same protocol as the viewer (no mix of http/https origin) and is CORS enabled to allow GetFeatureInfo XMLHttpRequest to be performed. To use R shiny app as popups, you can import the ``OpenFairShiny.js`` that provides utilities to load Shiny apps as iFrames. This handler allows to condition the plug of different popup handlers depending on the layers. By default, a simple handler (DEFAULT_HANDLER) will be provided by OpenFairViewer. See below example. |
**cesium**|``Object``| 3D mode options. See below. |
|`String`| `defaultAccessToken`. The Cesium service token to configure in your OpenFairViewer instance if you want to use 3D mode |


Example of popup handler:

```javascript
function(layer, feature){
	if(layer.id.startsWith('my_layer')){
			return OpenFairShiny.popupHandler("https://myshinyproxy.org/app_direct/myShinyPopup/", layer, feature, false);
		}else{
			return this.DEFAULT_HANDLER(layer, feature);
		}
	}
}
```
